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
    python3 scripts/eval-headless.py --case "sobc*" --variant ~/sobc-shorter.md --runs 2

`--effort` (or `effort:` in a case) runs the case against a temporary copy of
the plugin whose invoked command has that `effort:` level. A command's own
frontmatter wins over the session's effort, so this is the only way to compare
levels. Each run records the model, the requested effort, and the thinking and
output tokens the result event reports, which is how you can see the override
took effect.

`--variant` runs every case twice, on the plugin as it stands and with a
change laid over a copy of it, then reports per case the graders whose pass
count moved. A file is a new body for the invoked command; a directory
mirrors the plugin's layout (`commands/`, `templates/`, `references/`, ...).
Each arm is recorded under `baseline/` and `variant/`; `--replay` on the
results directory re-scores and compares both.

Exit 0 when every scored case meets --threshold (default 1.0), 1 otherwise;
for a comparison, every scored case of the variant.
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
VARIANT_IGNORE = {"__pycache__", ".DS_Store"}


# ── Plugin copies: effort override and variants ──────────────────────


def prompt_command(prompt: str) -> str:
    m = re.match(r"\s*/arckit:([\w.-]+)", prompt)
    if not m:
        raise ValueError(f"prompt does not invoke an /arckit: command: {prompt[:60]!r}")
    return m.group(1)


def build_plugin(plugin_dir: Path, dest: Path, *, command: str, effort: str | None = None,
                 overlay: dict[str, Path] | None = None) -> Path:
    """Copy the plugin to `dest`, lay `overlay` over it, then set the command's effort.

    `overlay` maps plugin-relative paths to the files that replace or add them
    (see `variant_files`). Effort goes on last, so `--effort` wins over a
    variant's own `effort:` line and both arms of a comparison run at one level.
    """
    if effort is not None and effort not in EFFORT_LEVELS:
        raise ValueError(f"unknown effort level {effort!r}; expected one of {EFFORT_LEVELS}")
    shutil.copytree(plugin_dir, dest, ignore=COPY_IGNORE, symlinks=True)
    for rel, src in (overlay or {}).items():
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        # The copy keeps symlinks; writing through one would change the real plugin.
        target.unlink(missing_ok=True)
        shutil.copyfile(src, target)
    if effort is None:
        return dest
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


def plugin_with_effort(plugin_dir: Path, command: str, effort: str, dest: Path) -> Path:
    """Copy the plugin to `dest` with `commands/<command>.md` set to `effort`.

    The command's `effort:` line is replaced, or added to its frontmatter when
    it has none. Nothing else in the copy changes.
    """
    return build_plugin(plugin_dir, dest, command=command, effort=effort)


def variant_files(variant: Path, command: str | None) -> dict[str, Path]:
    """The plugin-relative paths a variant replaces or adds, mapped to their source files.

    A file is a new body for the invoked command, `commands/<command>.md`. A
    directory mirrors the plugin's layout, so it can change a template, a
    reference or an agent as well as the command.
    """
    if variant.is_file():
        if not command:
            raise ValueError("a single-file variant replaces the invoked command, and no command was given")
        return {f"commands/{command}.md": variant}
    if not variant.is_dir():
        raise FileNotFoundError(f"no variant at {variant}")
    files = {}
    for p in sorted(variant.rglob("*")):
        rel = p.relative_to(variant)
        if p.is_file() and not VARIANT_IGNORE & set(rel.parts):
            files[rel.as_posix()] = p
    if not files:
        raise ValueError(f"the variant directory {variant} holds no files")
    return files


def check_variant(plugin_dir: Path, files: dict[str, Path]) -> tuple[list[str], list[str]]:
    """Split a variant's paths into those it changes and those it adds; refuse a no-op.

    A variant identical to the plugin would pay for two identical runs, and a
    misspelt path shows up here as an added file rather than a silent no-op.
    """
    changed, added = [], []
    for rel, src in sorted(files.items()):
        target = plugin_dir / rel
        if not target.is_file():
            added.append(rel)
        elif target.read_bytes() != src.read_bytes():
            changed.append(rel)
    if not changed and not added:
        raise ValueError(f"the variant is identical to {plugin_dir}; there is nothing to compare")
    return changed, added


def single_command(cases: list[dict]) -> str:
    """The one command a single-file variant replaces, across every selected case."""
    commands = sorted({prompt_command(c["prompt"]) for c in cases})
    if len(commands) != 1:
        raise ValueError(
            "a single-file variant replaces one command, but the selected cases invoke "
            + ", ".join(f"/arckit:{c}" for c in commands)
            + "; narrow --case or --tag, or pass a directory that names each file")
    return commands[0]


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


def early_stop(rec: dict, scored: dict) -> str | None:
    """The run ended normally but never wrote the document it was asked for.

    Opus 5.5 can end a turn with a progress report ("next I'll write the
    file...") instead of a tool call, and `claude -p` treats that as the end of
    the run. That is a different failure from a wrong document or a timeout, so
    it is reported separately with the run's last words.
    """
    if rec.get("timed_out") or rec.get("subtype") not in (None, "success"):
        return None
    missing = [g for g in scored["graders"]
               if g.get("type") == "file_exists" and not g.get("skipped") and not g.get("passed")]
    if not missing:
        return None
    tail = " ".join((rec.get("last_message") or "").split())
    return tail[-200:] or "(no final message)"


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


def recorded_runs(results_dir: Path, case_name: str) -> int:
    """How many runs of a case a results directory holds: `<case>.runN/` per run, or one `<case>/`."""
    if not results_dir.is_dir():
        return 1
    pattern = re.compile(rf"{re.escape(case_name)}\.run(\d+)")
    numbers = [int(m.group(1)) for p in results_dir.iterdir()
               if (m := pattern.fullmatch(p.name)) and (p / "recording.json").is_file()]
    return max(numbers, default=1)


def load_recording(case_out: Path) -> dict:
    rec = json.loads((case_out / "recording.json").read_text(encoding="utf-8"))
    transcript = case_out / "transcript.jsonl"
    rec["events"] = [json.loads(l) for l in transcript.read_text(encoding="utf-8").splitlines() if l.strip()] \
        if transcript.exists() else []
    return rec


# ── Comparison ───────────────────────────────────────────────────────


def compare(baseline: list[dict], variant: list[dict]) -> list[dict]:
    """Per case, each arm's mean score, cost and output, and the graders whose pass count moved.

    Runs are pooled per case rather than paired by run number: with `--runs 2`
    a grader that passed once in each arm has not moved, whichever run it was.
    """
    arms = {"baseline": baseline, "variant": variant}
    rows = []
    for name in dict.fromkeys(e["case"] for e in baseline + variant):
        runs = {arm: [e for e in entries if e["case"] == name] for arm, entries in arms.items()}
        tally: dict[str, dict[str, tuple[int, int]]] = {arm: {} for arm in arms}
        for arm, entries in runs.items():
            for e in entries:
                for g in e["graders"]:
                    if g.get("skipped"):
                        continue
                    passed, seen = tally[arm].get(g["name"], (0, 0))
                    tally[arm][g["name"]] = (passed + bool(g["passed"]), seen + 1)
        moved = []
        for g in sorted(set(tally["baseline"]) & set(tally["variant"])):
            (bp, bn), (vp, vn) = tally["baseline"][g], tally["variant"][g]
            if bp * vn != vp * bn:
                moved.append({"name": g, "baseline": [bp, bn], "variant": [vp, vn],
                              "change": "better" if vp * bn > bp * vn else "worse"})

        def mean(values):
            values = [v for v in values if v is not None]
            return sum(values) / len(values) if values else None

        rows.append({
            "case": name,
            "runs": {arm: len(entries) for arm, entries in runs.items()},
            "score": {arm: mean(e["score"] for e in entries) for arm, entries in runs.items()},
            "cost_usd": {arm: round(sum(float(e.get("cost_usd") or 0) for e in entries), 4)
                         for arm, entries in runs.items()},
            "output_tokens": {arm: mean(e.get("output_tokens") for e in entries) for arm, entries in runs.items()},
            "early_stops": {arm: sum(1 for e in entries if e.get("early_stop")) for arm, entries in runs.items()},
            "graders": moved,
        })
    return rows


def print_comparison(rows: list[dict]) -> None:
    def num(v, spec):
        return "n/a" if v is None else format(v, spec)

    print("\nbaseline → variant")
    for row in rows:
        s, c, t, stops = row["score"], row["cost_usd"], row["output_tokens"], row["early_stops"]
        print(f"  {row['case']}: score {num(s['baseline'], '.2f')} → {num(s['variant'], '.2f')}, "
              f"cost ${c['baseline']:.2f} → ${c['variant']:.2f}, "
              f"output tokens {num(t['baseline'], '.0f')} → {num(t['variant'], '.0f')}")
        for g in row["graders"]:
            (bp, bn), (vp, vn) = g["baseline"], g["variant"]
            print(f"      {g['change']:<6}  {g['name']}: {bp}/{bn} → {vp}/{vn}")
        if not row["graders"]:
            print("      no grader result moved")
        if stops["baseline"] or stops["variant"]:
            print(f"      early stops {stops['baseline']} → {stops['variant']}")
    better = sum(g["change"] == "better" for row in rows for g in row["graders"])
    worse = sum(g["change"] == "worse" for row in rows for g in row["graders"])
    cost = {arm: sum(row["cost_usd"][arm] for row in rows) for arm in ("baseline", "variant")}
    print(f"variant: {better} grader result(s) better, {worse} worse; "
          f"cost ${cost['baseline']:.2f} → ${cost['variant']:.2f}")


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
    ap.add_argument("--variant", type=Path,
                    help="also run every case with this command file, or this directory laid over "
                         "the plugin, and report which graders moved")
    ap.add_argument("--threshold", type=float, default=1.0)
    ap.add_argument("--output-dir", type=Path)
    ap.add_argument("--replay", type=Path, help="re-score this results directory without calling the model")
    ap.add_argument("--json", type=Path, help="write the aggregate result to this path as well")
    ap.add_argument("--keep-temp", action="store_true")
    args = ap.parse_args()
    if args.variant and args.replay:
        ap.error("--variant runs live; to re-score a comparison, pass its results directory to --replay")

    plugin_dir = args.plugin.resolve()
    eval_dir = plugin_dir / args.eval_dir
    cases = load_cases(eval_dir, args.case, args.tag)
    if not cases:
        print("no cases matched", file=sys.stderr)
        return 1

    overlay = None
    if args.variant:
        variant = args.variant.resolve()
        try:
            overlay = variant_files(variant, single_command(cases) if variant.is_file() else None)
            changed, added = check_variant(plugin_dir, overlay)
        except (ValueError, FileNotFoundError) as exc:
            ap.error(f"--variant: {exc}")

    if args.replay:
        out_dir = args.replay.resolve()
        mode = "replay"
    else:
        stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
        out_dir = (args.output_dir or (eval_dir / "results" / stamp)).resolve()
        out_dir.mkdir(parents=True, exist_ok=True)
        mode = "live"

    # A comparison keeps each arm's recordings in the layout a single run uses,
    # under baseline/ and variant/, so `--replay <dir>/variant` re-scores one arm
    # and `--replay <dir>` (found by its variant.json) re-scores and compares both.
    comparing = overlay is not None or (mode == "replay" and (out_dir / "variant.json").is_file())
    arms = [("baseline", None), ("variant", overlay)] if comparing else [(None, None)]
    if overlay is not None:
        variant_meta = {"variant": str(variant), "changed": changed, "added": added,
                        "model": args.model, "effort": args.effort}
        (out_dir / "variant.json").write_text(json.dumps(variant_meta, indent=2), encoding="utf-8")
        # Keep the files tested, since the variant is usually edited again afterwards.
        for rel, src in overlay.items():
            kept = out_dir / "variant-files" / rel
            kept.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(src, kept)
        print(f"[variant] {args.variant}: changes {', '.join(changed) or 'nothing'}"
              f"{'; adds ' + ', '.join(added) if added else ''}")
        print("          each case runs twice: on the plugin as it stands, then with the variant")
    elif comparing:
        variant_meta = json.loads((out_dir / "variant.json").read_text(encoding="utf-8"))

    aggregates = {arm: {"mode": mode, "plugin": str(plugin_dir), "cases": [], "total_cost_usd": 0.0}
                  for arm, _ in arms}
    worst = dict.fromkeys(aggregates, 1.0)
    for case in cases:
        if args.runs:
            runs = args.runs
        elif mode == "replay":
            runs = max(recorded_runs(out_dir / arm if arm else out_dir, case["name"]) for arm, _ in arms)
        else:
            runs = int(case.get("runs", 1))
        for run_no in range(1, runs + 1):
            case_key = case["name"] if runs == 1 else f"{case['name']}.run{run_no}"
            for arm, arm_overlay in arms:
                arm_dir = out_dir / arm if arm else out_dir
                case_out = arm_dir / case_key
                shown = f"{case_key} ({arm})" if arm else case_key
                if mode == "replay":
                    if not (case_out / "recording.json").exists():
                        print(f"[skip] {shown}: no recording in {arm_dir}")
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
                        # Both arms of a comparison run from a copy made the same way,
                        # so the only difference between them is the variant's files.
                        if effort or arm:
                            plugin_copy = Path(tempfile.mkdtemp(prefix="arckit-eval-plugin-"))
                            run_plugin = build_plugin(plugin_dir, plugin_copy / "arckit",
                                                      command=prompt_command(case["prompt"]),
                                                      effort=effort, overlay=arm_overlay)
                        print(f"[run ] {shown}{f' (effort: {effort})' if effort else ''} …", flush=True)
                        rec = run_claude(case, workspace, run_plugin, args.model, args.timeout)
                        rec["requested_model"] = args.model or case.get("model")
                        rec["requested_effort"] = effort
                        if arm:
                            rec["arm"] = arm
                        rec["created_files"] = sorted(snapshot(workspace) - before)
                        case_out = record({**case, "name": case_key}, rec, workspace, before, arm_dir)
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
                stopped = early_stop(rec, scored)
                if score is not None:
                    worst[arm] = min(worst[arm], score)
                aggregates[arm]["cases"].append({
                    "name": case_key, "case": case["name"], "score": score, "cost_usd": rec.get("cost_usd"),
                    "num_turns": rec.get("num_turns"), "models": rec.get("models"),
                    "requested_effort": rec.get("requested_effort"),
                    "thinking_tokens": rec.get("thinking_tokens"), "output_tokens": rec.get("output_tokens"),
                    "duration_ms": rec.get("duration_ms"), "graders": scored["graders"],
                    "early_stop": stopped,
                })
                aggregates[arm]["total_cost_usd"] += float(rec.get("cost_usd") or 0)
                label = "pass" if score == 1.0 else ("FAIL" if score is not None else "n/a ")
                extra = " TIMED OUT" if rec.get("timed_out") else ""
                if stopped:
                    extra += " EARLY STOP"
                if rec.get("thinking_tokens") is not None:
                    extra += (f" thinking={rec.get('thinking_tokens')} output={rec.get('output_tokens')}"
                             f" models={','.join(rec.get('models') or [])}")
                print(f"[{label}] {shown}: score={score} cost=${rec.get('cost_usd') or 0:.2f} turns={rec.get('num_turns')}{extra}")
                for g in scored["graders"]:
                    mark = "skip" if g.get("skipped") else ("ok  " if g["passed"] else "FAIL")
                    print(f"         {mark} {g['name']}: {g['details']}")
                if stopped:
                    print(f"         ended without writing the document; last words: {stopped!r}")

    for arm, aggregate in aggregates.items():
        arm_dir = out_dir / arm if arm else out_dir
        arm_dir.mkdir(parents=True, exist_ok=True)
        (arm_dir / "aggregate.json").write_text(json.dumps(aggregate, indent=2), encoding="utf-8")
    result = aggregates.get(None)
    if comparing:
        rows = compare(aggregates["baseline"]["cases"], aggregates["variant"]["cases"])
        print_comparison(rows)
        result = {"mode": mode, **variant_meta, "cases": rows,
                  "total_cost_usd": {arm: a["total_cost_usd"] for arm, a in aggregates.items()}}
        (out_dir / "comparison.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    if args.json:
        args.json.write_text(json.dumps(result, indent=2), encoding="utf-8")
    total = sum(a["total_cost_usd"] for a in aggregates.values())
    print(f"\nresults: {out_dir}  total cost: ${total:.2f}")
    # A comparison's exit status is the variant's, against the same threshold.
    return 0 if worst[arms[-1][0]] >= args.threshold else 1


if __name__ == "__main__":
    sys.exit(main())
