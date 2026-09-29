#!/usr/bin/env python3
"""Run the plugin's behavioural eval cases through `claude -p`, or replay a recording.

`claude plugin eval` is the intended runner for `plugins/arckit-claude/evals/`
and this script reads the same case files (`<case>/case.yaml` +
`<case>/graders/*.md`). It exists because the official runner is early-access
and gated per account, and because it has no replay mode: this script records
every run (transcript, tool calls, created files) and can re-score a recording
against the current graders without calling the model. That is the replay gate
the eval README describes.

Deterministic graders only — `file_exists`, `regex`, `tool_used`, `tool_order`.
An `llm` or `baseline` grader is reported as skipped, never as passed.

    python3 scripts/eval-headless.py                       # run every case
    python3 scripts/eval-headless.py --case "search*"       # by name glob
    python3 scripts/eval-headless.py --tag injection        # by tag
    python3 scripts/eval-headless.py --replay <results dir> # re-score, no model
    python3 scripts/eval-headless.py --case "sobc*" --model claude-sonnet-5-5 --effort high

`--effort` (or `effort:` in a case) runs the case against a temporary copy of
the plugin whose invoked command has that `effort:` level. A command's own
frontmatter wins over the session's effort, so this is the only way to compare
levels. Each run records the model, the requested effort, and the thinking and
output tokens the result event reports, which is how you can see the override
took effect.

Exit 0 when every scored case meets --threshold (default 1.0), 1 otherwise.
"""

from __future__ import annotations

import argparse
import fnmatch
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[1]
DEFAULT_PLUGIN = REPO_ROOT / "plugins" / "arckit-claude"
DETERMINISTIC = {"file_exists", "regex", "tool_used", "tool_order"}
EFFORT_LEVELS = ("low", "medium", "high", "xhigh", "max")
# Left out of a plugin copy: the eval results tree and the nested overlay
# mirror are large and never loaded by a core command.
COPY_IGNORE = shutil.ignore_patterns("evals", "plugins", "node_modules", "__pycache__", ".DS_Store")


# ── Effort override ──────────────────────────────────────────────────


def prompt_command(prompt: str) -> str:
    m = re.match(r"\s*/arckit:([\w.-]+)", prompt)
    if not m:
        raise ValueError(f"prompt does not invoke an /arckit: command: {prompt[:60]!r}")
    return m.group(1)


def plugin_with_effort(plugin_dir: Path, command: str, effort: str, dest: Path) -> Path:
    """Copy the plugin to `dest` with `commands/<command>.md` set to `effort`.

    The command's `effort:` line is replaced, or added to its frontmatter when
    it has none. Nothing else in the copy changes.
    """
    if effort not in EFFORT_LEVELS:
        raise ValueError(f"unknown effort level {effort!r}; expected one of {EFFORT_LEVELS}")
    shutil.copytree(plugin_dir, dest, ignore=COPY_IGNORE, symlinks=True)
    cmd_file = dest / "commands" / f"{command}.md"
    if not cmd_file.is_file():
        raise FileNotFoundError(f"no command file for /arckit:{command} in {plugin_dir}")
    text = cmd_file.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError(f"{cmd_file.name} has no frontmatter")
    end = text.index("\n---", 4)
    front, body = text[:end], text[end:]
    if re.search(r"^effort:", front, re.MULTILINE):
        front = re.sub(r"^effort:.*$", f"effort: {effort}", front, count=1, flags=re.MULTILINE)
    else:
        front += f"\neffort: {effort}"
    cmd_file.write_text(front + body, encoding="utf-8")
    return dest


# ── Case loading ─────────────────────────────────────────────────────


def split_frontmatter(text: str) -> tuple[dict, str]:
    if not text.startswith("---"):
        return {}, text
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}, text
    return (yaml.safe_load(parts[1]) or {}), parts[2]


def load_cases(eval_dir: Path, case_glob: str | None, tags: list[str]) -> list[dict]:
    cases = []
    for case_file in sorted(eval_dir.glob("*/case.yaml")):
        case = yaml.safe_load(case_file.read_text(encoding="utf-8")) or {}
        case["_dir"] = case_file.parent
        case.setdefault("name", case_file.parent.name)
        if case_glob and not fnmatch.fnmatch(case["name"], case_glob):
            continue
        if tags and not set(tags) & set(case.get("tags") or []):
            continue
        graders = []
        for g in sorted((case_file.parent / "graders").glob("*.md")):
            fm, body = split_frontmatter(g.read_text(encoding="utf-8"))
            fm["_name"] = g.stem
            fm["_body"] = body.strip()
            graders.append(fm)
        case["_graders"] = graders
        cases.append(case)
    return cases


# ── Workspace and run ────────────────────────────────────────────────


def build_workspace(case: dict, workspace: Path) -> None:
    for entry in (case.get("context") or {}).get("add_dirs") or []:
        src = (case["_dir"] / entry["source"]).resolve()
        dest_rel = str(entry.get("dest") or ".").lstrip("/")
        if dest_rel.startswith("work/"):
            dest_rel = dest_rel[len("work/"):]
        dest = workspace / dest_rel
        dest.mkdir(parents=True, exist_ok=True)
        shutil.copytree(src, dest, dirs_exist_ok=True)
    subprocess.run(["git", "init", "-q", "."], cwd=workspace, check=True)
    subprocess.run(["git", "add", "-A"], cwd=workspace, check=True)
    # Backdate the fixture commit so the plugin's Stop hook (session-learner)
    # does not read it as work this session did and nudge the model about it.
    backdated = {**os.environ, "GIT_AUTHOR_DATE": "2026-01-01T00:00:00Z", "GIT_COMMITTER_DATE": "2026-01-01T00:00:00Z"}
    subprocess.run(
        ["git", "-c", "user.email=eval@arckit.local", "-c", "user.name=arckit-eval",
         "commit", "-q", "--allow-empty", "-m", "fixture"],
        cwd=workspace, check=True, env=backdated,
    )


def snapshot(workspace: Path) -> set[str]:
    out = set()
    for p in workspace.rglob("*"):
        if p.is_file() and ".git" not in p.parts:
            out.add(str(p.relative_to(workspace)))
    return out


def run_claude(case: dict, workspace: Path, plugin_dir: Path, model: str | None,
               timeout: int | None = None) -> dict:
    cmd = [
        "claude", "-p", case["prompt"],
        "--plugin-dir", str(plugin_dir),
        "--output-format", "stream-json", "--verbose",
        "--max-turns", str(case.get("max_turns", 10)),
    ]
    if case.get("allowed_tools"):
        cmd += ["--allowedTools", *case["allowed_tools"]]
    if model or case.get("model"):
        cmd += ["--model", model or case["model"]]
    if case.get("append_system_prompt"):
        cmd += ["--append-system-prompt", case["append_system_prompt"]]
    env = dict(os.environ)
    for k, v in (case.get("env") or {}).items():
        env[k] = str(v)
    started = time.time()
    limit = timeout or case.get("timeout_seconds", 600)
    timed_out = False
    try:
        proc = subprocess.run(
            cmd, cwd=workspace, env=env, capture_output=True, text=True,
            stdin=subprocess.DEVNULL, timeout=limit,
        )
        stdout, stderr, returncode = proc.stdout, proc.stderr, proc.returncode
    except subprocess.TimeoutExpired as exc:
        # Keep the partial transcript and whatever the run wrote: a timeout is
        # a result to score (it fails the file graders), not a crash that
        # abandons every case after it.
        timed_out = True
        def text(v):
            return v.decode("utf-8", "replace") if isinstance(v, bytes) else (v or "")
        stdout, stderr, returncode = text(exc.stdout), text(exc.stderr), None
    events = []
    for line in stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            events.append({"type": "raw", "text": line})
    tool_uses = []
    for ev in events:
        if ev.get("type") == "assistant":
            for block in ev.get("message", {}).get("content", []):
                if block.get("type") == "tool_use":
                    tool_uses.append({"name": block.get("name"), "input": block.get("input")})
    result = next((ev for ev in reversed(events) if ev.get("type") == "result"), {})
    model_usage = result.get("modelUsage") or {}
    return {
        "models": sorted(model_usage),
        "thinking_tokens": sum(int(m.get("thinkingTokens") or 0) for m in model_usage.values()),
        "output_tokens": sum(int(m.get("outputTokens") or 0) for m in model_usage.values()),
        "duration_ms": result.get("duration_ms"),
        "events": events,
        "tool_uses": tool_uses,
        "last_message": result.get("result") or "",
        "cost_usd": result.get("total_cost_usd"),
        "num_turns": result.get("num_turns"),
        "subtype": f"timeout after {limit}s" if timed_out else result.get("subtype"),
        "timed_out": timed_out,
        "exit_code": returncode,
        "stderr": stderr[-4000:],
        "duration_s": round(time.time() - started, 1),
    }


# ── Graders ──────────────────────────────────────────────────────────


def grade(grader: dict, rec: dict, files_dir: Path) -> dict:
    kind = grader.get("type")
    name = grader["_name"]
    if kind not in DETERMINISTIC:
        return {"name": name, "type": kind, "skipped": True,
                "details": "needs the official runner (llm/baseline grader)"}
    created = rec["created_files"]

    if kind == "file_exists":
        pattern = grader["path"]
        hits = [f for f in created if fnmatch.fnmatch(f, pattern) or f == pattern]
        return {"name": name, "type": kind, "passed": bool(hits),
                "details": f"created files matching {pattern!r}: {hits or 'none'}"}

    if kind == "tool_used":
        tool = grader["tool"]
        input_re = re.compile(grader["input_match"]) if grader.get("input_match") else None
        calls = [t for t in rec["tool_uses"] if t["name"] == tool
                 and (input_re is None or input_re.search(json.dumps(t["input"])))]
        lo, hi = int(grader.get("min", 1)), grader.get("max")
        ok = len(calls) >= lo and (hi is None or len(calls) <= int(hi))
        return {"name": name, "type": kind, "passed": ok,
                "details": f"{tool} called {len(calls)} time(s); min={lo} max={hi}"}

    if kind == "tool_order":
        names = [t["name"] for t in rec["tool_uses"]]
        before, after = grader["before"], grader["after"]
        ok = before in names and after in names and names.index(before) < names.index(after)
        return {"name": name, "type": kind, "passed": ok, "details": f"order seen: {names}"}

    # regex
    target = grader.get("target", "last_message")
    if isinstance(target, dict) and target.get("source") == "file":
        path = target["path"]
        hits = [f for f in created if fnmatch.fnmatch(f, path) or f == path]
        if not hits:
            text, where = "", f"no created file matches {path!r}"
        else:
            text = "\n".join((files_dir / h).read_text(encoding="utf-8", errors="replace") for h in hits)
            where = ", ".join(hits)
    elif target == "trace":
        text, where = "\n".join(json.dumps(e) for e in rec.get("events", [])), "trace"
    elif target == "files":
        text, where = "\n".join(created), "created file list"
    else:
        text, where = rec["last_message"], "last message"
    flags = 0
    for ch in str(grader.get("flags", "")):
        flags |= {"i": re.IGNORECASE, "m": re.MULTILINE, "s": re.DOTALL}.get(ch, 0)
    found = re.search(grader["pattern"], text, flags) is not None
    mode = grader.get("match", "contains")
    passed = found if mode == "contains" else (not found)
    return {"name": name, "type": kind, "passed": passed,
            "details": f"pattern {'found' if found else 'not found'} in {where}; match={mode}"}


def score_case(case: dict, rec: dict, files_dir: Path) -> dict:
    results = [grade(g, rec, files_dir) for g in case["_graders"]]
    scored = [r for r in results if not r.get("skipped")]
    score = (sum(1 for r in scored if r["passed"]) / len(scored)) if scored else None
    return {"graders": results, "score": score}


# ── Recording ────────────────────────────────────────────────────────


def record(case: dict, rec: dict, workspace: Path, before: set[str], out_dir: Path) -> Path:
    case_out = out_dir / case["name"]
    files_dir = case_out / "files"
    files_dir.mkdir(parents=True, exist_ok=True)
    after = snapshot(workspace)
    created = sorted(after - before)
    for rel in created:
        dst = files_dir / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(workspace / rel, dst)
    (case_out / "transcript.jsonl").write_text(
        "\n".join(json.dumps(e) for e in rec["events"]) + "\n", encoding="utf-8")
    summary = {k: v for k, v in rec.items() if k != "events"}
    summary.update({
        "case": case["name"], "prompt": case["prompt"], "tags": case.get("tags", []),
        "created_files": created, "recorded_at": datetime.now(timezone.utc).isoformat(),
    })
    (case_out / "recording.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return case_out


def load_recording(case_out: Path) -> dict:
    rec = json.loads((case_out / "recording.json").read_text(encoding="utf-8"))
    transcript = case_out / "transcript.jsonl"
    rec["events"] = [json.loads(l) for l in transcript.read_text(encoding="utf-8").splitlines() if l.strip()] \
        if transcript.exists() else []
    return rec


# ── Main ─────────────────────────────────────────────────────────────


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--plugin", type=Path, default=DEFAULT_PLUGIN)
    ap.add_argument("--eval-dir", default="evals")
    ap.add_argument("--case", help="name glob")
    ap.add_argument("--tag", action="append", default=[])
    ap.add_argument("--runs", type=int, help="override per-case runs")
    ap.add_argument("--model")
    ap.add_argument("--effort", choices=EFFORT_LEVELS,
                    help="run the invoked command at this effort level (overrides the case's `effort:`)")
    ap.add_argument("--timeout", type=int, help="seconds per run (overrides the case's timeout_seconds)")
    ap.add_argument("--threshold", type=float, default=1.0)
    ap.add_argument("--output-dir", type=Path)
    ap.add_argument("--replay", type=Path, help="re-score this results directory without calling the model")
    ap.add_argument("--json", type=Path, help="write the aggregate result to this path as well")
    ap.add_argument("--keep-temp", action="store_true")
    args = ap.parse_args()

    plugin_dir = args.plugin.resolve()
    eval_dir = plugin_dir / args.eval_dir
    cases = load_cases(eval_dir, args.case, args.tag)
    if not cases:
        print("no cases matched", file=sys.stderr)
        return 1

    if args.replay:
        out_dir = args.replay.resolve()
        mode = "replay"
    else:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        out_dir = (args.output_dir or (eval_dir / "results" / stamp)).resolve()
        out_dir.mkdir(parents=True, exist_ok=True)
        mode = "live"

    aggregate = {"mode": mode, "plugin": str(plugin_dir), "cases": [], "total_cost_usd": 0.0}
    worst = 1.0
    for case in cases:
        runs = args.runs or (1 if mode == "replay" else int(case.get("runs", 1)))
        for run_no in range(1, runs + 1):
            case_key = case["name"] if runs == 1 else f"{case['name']}.run{run_no}"
            case_out = out_dir / case_key
            if mode == "replay":
                if not (case_out / "recording.json").exists():
                    print(f"[skip] {case_key}: no recording in {out_dir}")
                    continue
                rec = load_recording(case_out)
            else:
                workspace = Path(tempfile.mkdtemp(prefix=f"arckit-eval-{case['name']}-"))
                effort = args.effort or case.get("effort")
                plugin_copy = None
                try:
                    build_workspace(case, workspace)
                    before = snapshot(workspace)
                    run_plugin = plugin_dir
                    if effort:
                        plugin_copy = Path(tempfile.mkdtemp(prefix="arckit-eval-plugin-"))
                        run_plugin = plugin_with_effort(
                            plugin_dir, prompt_command(case["prompt"]), effort, plugin_copy / "arckit")
                    print(f"[run ] {case_key}{f' (effort: {effort})' if effort else ''} …", flush=True)
                    rec = run_claude(case, workspace, run_plugin, args.model, args.timeout)
                    rec["requested_model"] = args.model or case.get("model")
                    rec["requested_effort"] = effort
                    rec["created_files"] = sorted(snapshot(workspace) - before)
                    case_out = record({**case, "name": case_key}, rec, workspace, before, out_dir)
                finally:
                    if plugin_copy:
                        shutil.rmtree(plugin_copy, ignore_errors=True)
                    if args.keep_temp:
                        print(f"       workspace kept at {workspace}")
                    else:
                        shutil.rmtree(workspace, ignore_errors=True)
            scored = score_case(case, rec, case_out / "files")
            (case_out / "scores.json").write_text(json.dumps(scored, indent=2), encoding="utf-8")
            score = scored["score"]
            if score is not None:
                worst = min(worst, score)
            aggregate["cases"].append({
                "name": case_key, "score": score, "cost_usd": rec.get("cost_usd"),
                "num_turns": rec.get("num_turns"), "models": rec.get("models"),
                "requested_effort": rec.get("requested_effort"),
                "thinking_tokens": rec.get("thinking_tokens"), "output_tokens": rec.get("output_tokens"),
                "duration_ms": rec.get("duration_ms"), "graders": scored["graders"],
            })
            aggregate["total_cost_usd"] += float(rec.get("cost_usd") or 0)
            label = "pass" if score == 1.0 else ("FAIL" if score is not None else "n/a ")
            extra = " TIMED OUT" if rec.get("timed_out") else ""
            if rec.get("thinking_tokens") is not None:
                extra += (f" thinking={rec.get('thinking_tokens')} output={rec.get('output_tokens')}"
                         f" models={','.join(rec.get('models') or [])}")
            print(f"[{label}] {case_key}: score={score} cost=${rec.get('cost_usd') or 0:.2f} turns={rec.get('num_turns')}{extra}")
            for g in scored["graders"]:
                mark = "skip" if g.get("skipped") else ("ok  " if g["passed"] else "FAIL")
                print(f"         {mark} {g['name']}: {g['details']}")

    (out_dir / "aggregate.json").write_text(json.dumps(aggregate, indent=2), encoding="utf-8")
    if args.json:
        args.json.write_text(json.dumps(aggregate, indent=2), encoding="utf-8")
    print(f"\nresults: {out_dir}  total cost: ${aggregate['total_cost_usd']:.2f}")
    return 0 if worst >= args.threshold else 1


if __name__ == "__main__":
    sys.exit(main())
