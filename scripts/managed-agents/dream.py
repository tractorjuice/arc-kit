#!/usr/bin/env python3
"""
ArcKit harness dreaming on Claude Managed Agents.

Reads finished ArcKit runs (behavioural eval recordings, Claude Code session
transcripts, self-harness traces) and distils the repeatable mistakes they show
into a Managed Agents memory store: one page per harness weakness, each naming
the command, skill, template, reference or hook it belongs to and proposing a
gotcha. The store is exported to local files for a maintainer to review and
turn into pull requests. Nothing it writes is loaded into a user's session.

Based on the Claude cookbook "Dreaming with a dynamic workflow": a lead agent
with read-only tools writes a workflow that runs one analyzer per transcript,
then one organizer over the store. The sandbox has no network and the session
has a hard spend limit.

Default is a dry run: transcripts are collected, rendered to plain text,
redacted and staged locally so you can read exactly what would be uploaded.
Nothing leaves the machine without --run.

Prerequisites (for --run / --export-only only):
    pip install anthropic
    export ANTHROPIC_API_KEY="your-api-key"

Usage:
    # Stage the eval recordings and see what would be sent (no API calls):
    python dream.py plugins/arckit-claude/evals/results

    # Dream over them into a new store, then export it:
    python dream.py plugins/arckit-claude/evals/results --run

    # Nightly: add new transcripts to the same store (already-dreamed ones are skipped):
    python dream.py ~/.claude/projects/-home-me-arckit-test-project-v20 \\
        --store-id memstore_abc123 --run

    # Export a store for review without dreaming:
    python dream.py --store-id memstore_abc123 --export-only
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys
import time
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent.parent
PLUGIN_ROOT = REPO_ROOT / "plugins" / "arckit-claude"
PROMPTS_DIR = HERE / "dream-prompts"
DEFAULT_OUT = HERE / ".dream"

LEAD_MODEL = "claude-sonnet-5-5"
WORKER_MODEL = "claude-haiku-5-5"

MAX_SESSION_FILES = 500           # Managed Agents file resources per session
MAX_TRANSCRIPTS = MAX_SESSION_FILES - 1   # one slot for surfaces.md
MAX_TRANSCRIPT_BYTES = 400_000    # per rendered transcript; the middle is cut beyond this
MAX_TOOL_INPUT_CHARS = 1_500
MAX_TOOL_RESULT_CHARS = 2_000
UPLOAD_TTL_SECONDS = 24 * 3600    # Files API maximum
TRANSCRIPT_MOUNT = "/mnt/session/uploads/transcripts"
SURFACES_MOUNT = "/mnt/session/uploads/surfaces.md"
STORE_NAME = "arckit-harness-weaknesses"

# Rough list-price cost per MB of transcript, from the cookbook's own runs
# (283 KB for $0.36, about 12 MB for about $8). An estimate, not a quote.
COST_PER_MB_USD = 1.3

TEXT_SUFFIXES = {".md", ".txt", ".log"}

SECRET_PATTERNS: list[tuple[str, re.Pattern[str]]] = [
    ("anthropic-key", re.compile(r"sk-ant-[A-Za-z0-9_\-]{10,}")),
    ("openai-key", re.compile(r"\bsk-[A-Za-z0-9]{20,}")),
    ("github-token", re.compile(r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}")),
    ("aws-access-key", re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("google-api-key", re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b")),
    ("slack-token", re.compile(r"\bxox[abprs]-[A-Za-z0-9\-]{10,}")),
    ("private-key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----")),
    ("bearer-token", re.compile(r"(?i)\bbearer\s+[A-Za-z0-9._\-]{20,}")),
    ("jwt", re.compile(r"\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}")),
]

# A filled-in classification, not the template's "[PUBLIC / OFFICIAL / ...]"
# placeholder, which every ArcKit transcript that reads a template contains.
CLASSIFIED_PATTERNS = [
    re.compile(r"\|\s*\**Classification\**\s*\|\s*\**(OFFICIAL-SENSITIVE|SECRET|TOP SECRET)\**\s*\|"),
    re.compile(r"(?m)^\s*\**Classification\**\s*:\s*\**(OFFICIAL-SENSITIVE|SECRET|TOP SECRET)\b"),
]


# ---------------------------------------------------------------------------
# Transcript discovery and rendering (no network, no third-party imports)
# ---------------------------------------------------------------------------

@dataclass
class Transcript:
    name: str            # upload file name: ASCII, unique, .txt
    kind: str            # eval | claude-code | trace | text
    source: str          # path it was read from
    text: str
    sha256: str = ""
    redactions: dict[str, int] = field(default_factory=dict)
    classified: str | None = None

    @property
    def size(self) -> int:
        return len(self.text.encode("utf-8"))


def truncate_middle(text: str, limit: int) -> str:
    """Keep the head and tail of a long text, cutting the middle."""
    if len(text) <= limit:
        return text
    marker = f"\n\n[... {len(text) - limit} characters cut by dream.py ...]\n\n"
    keep = max(limit - len(marker), 0)
    head = keep * 2 // 3
    return text[:head] + marker + text[len(text) - (keep - head):]


def _clip(value: object, limit: int) -> str:
    s = value if isinstance(value, str) else json.dumps(value, ensure_ascii=False, default=str)
    s = s.replace("\r", "")
    return s if len(s) <= limit else s[:limit] + f" [... {len(s) - limit} more characters]"


def _tool_result_text(content: object) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        parts = []
        for block in content:
            if isinstance(block, dict) and block.get("type") == "text":
                parts.append(block.get("text", ""))
            elif isinstance(block, dict):
                parts.append(f"[{block.get('type', 'block')}]")
        return "\n".join(parts)
    return json.dumps(content, ensure_ascii=False, default=str)


def render_events(events: list[dict]) -> str:
    """Render Claude Code stream-json or session-transcript events as labelled plain text.

    Both formats carry user/assistant turns as {"type", "message": {"content"}}.
    Thinking blocks, attachments and bookkeeping records are dropped.
    """
    lines: list[str] = []
    for event in events:
        if not isinstance(event, dict):
            continue
        etype = event.get("type")
        if etype == "result":
            lines.append(
                "RESULT: subtype={} is_error={} turns={} cost_usd={}".format(
                    event.get("subtype"), event.get("is_error"),
                    event.get("num_turns"), event.get("total_cost_usd")))
            continue
        if etype not in ("user", "assistant"):
            continue
        if event.get("isMeta"):
            continue
        message = event.get("message") or {}
        content = message.get("content")
        role = "USER" if etype == "user" else "ASSISTANT"
        if isinstance(content, str):
            if content.strip():
                lines.append(f"{role}: {content.strip()}")
            continue
        if not isinstance(content, list):
            continue
        for block in content:
            if not isinstance(block, dict):
                continue
            btype = block.get("type")
            if btype == "text" and block.get("text", "").strip():
                lines.append(f"{role}: {block['text'].strip()}")
            elif btype == "tool_use":
                lines.append(f"TOOL_USE {block.get('name')}: {_clip(block.get('input'), MAX_TOOL_INPUT_CHARS)}")
            elif btype == "tool_result":
                label = "TOOL_RESULT[error]" if block.get("is_error") else "TOOL_RESULT"
                lines.append(f"{label}: {_clip(_tool_result_text(block.get('content')), MAX_TOOL_RESULT_CHARS)}")
    return "\n".join(lines)


def _read_jsonl(path: Path) -> list[dict]:
    events = []
    for line in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            events.append(json.loads(line))
        except json.JSONDecodeError:
            continue
    return events


def render_eval(case_dir: Path) -> str:
    """Render one eval recording: its outcome first, so the verifier signal leads."""
    rec = json.loads((case_dir / "recording.json").read_text(encoding="utf-8"))
    out = [
        "ARCKIT EVAL RECORDING",
        f"case: {rec.get('case', case_dir.name)}",
        f"prompt: {rec.get('prompt', '')}",
        f"tags: {', '.join(rec.get('tags') or [])}",
    ]
    scores_file = case_dir / "scores.json"
    if scores_file.is_file():
        scores = json.loads(scores_file.read_text(encoding="utf-8"))
        out.append(f"score: {scores.get('score')}")
        for g in scores.get("graders", []):
            if g.get("skipped"):
                state = "SKIPPED"
            else:
                state = "PASS" if g.get("passed") else "FAIL"
            detail = f" ({_clip(g.get('details'), 300)})" if g.get("details") else ""
            out.append(f"grader {state}: {g.get('name')} [{g.get('type')}]{detail}")
    else:
        out.append("score: not scored (run eval-headless.py --replay on the results directory to add scores)")
    created = rec.get("created_files") or []
    out.append(f"created files: {', '.join(created) if created else 'none'}")
    out.append("")
    out.append("TRANSCRIPT")
    transcript = case_dir / "transcript.jsonl"
    out.append(render_events(_read_jsonl(transcript)) if transcript.is_file() else "(no transcript recorded)")
    return "\n".join(out)


def render_claude_code(path: Path) -> str:
    return "CLAUDE CODE SESSION TRANSCRIPT\n" + f"file: {path.name}\n\n" + render_events(_read_jsonl(path))


def render_trace(path: Path) -> str:
    try:
        body = json.dumps(json.loads(path.read_text(encoding="utf-8")), indent=1, ensure_ascii=False)
    except json.JSONDecodeError:
        body = path.read_text(encoding="utf-8", errors="replace")
    return "ARCKIT SELF-HARNESS TRACE\n" + f"file: {path.name}\n\n" + body


def _safe_name(kind: str, source: Path, used: set[str]) -> str:
    stem = re.sub(r"[^A-Za-z0-9._-]+", "-", f"{source.parent.name}-{source.stem}" if source.is_file() else source.name)
    stem = stem.strip("-.")[:80] or "transcript"
    digest = hashlib.sha256(str(source).encode()).hexdigest()[:8]
    name = f"{kind}--{stem}--{digest}.txt"
    while name in used:
        digest = hashlib.sha256((name + digest).encode()).hexdigest()[:8]
        name = f"{kind}--{stem}--{digest}.txt"
    used.add(name)
    return name


def discover(paths: list[Path]) -> list[tuple[str, Path]]:
    """Find runs under the given paths. Returns (kind, path) pairs, sorted and de-duplicated."""
    found: dict[Path, str] = {}

    def classify_file(p: Path) -> str | None:
        if p.name in ("recording.json", "scores.json", "aggregate.json", "comparison.json", "variant.json"):
            return None
        if p.suffix == ".jsonl":
            return "claude-code"
        if p.suffix == ".json" and "autoresearch-traces" in p.parts:
            return "trace"
        if p.suffix in TEXT_SUFFIXES:
            return "text"
        return None

    for root in paths:
        root = root.expanduser().resolve()
        if root.is_file():
            if root.name == "recording.json":
                found[root.parent] = "eval"
            elif (kind := classify_file(root)):
                found[root] = kind
            continue
        if not root.is_dir():
            raise SystemExit(f"dream.py: no such file or directory: {root}")
        eval_dirs = {p.parent for p in root.rglob("recording.json")}
        for d in eval_dirs:
            found[d] = "eval"
        for p in root.rglob("*"):
            if not p.is_file() or any(p.is_relative_to(d) for d in eval_dirs):
                continue
            # Claude Code keeps each subagent's transcript in <session>/subagents/;
            # the parent transcript already carries the dispatch and the reply.
            if "subagents" in p.parts or p.name.startswith("."):
                continue
            if (kind := classify_file(p)):
                found[p] = kind
    return sorted(((k, p) for p, k in found.items()), key=lambda kp: str(kp[1]))


def redact(text: str) -> tuple[str, dict[str, int]]:
    counts: dict[str, int] = {}
    for label, pattern in SECRET_PATTERNS:
        text, n = pattern.subn(f"[REDACTED:{label}]", text)
        if n:
            counts[label] = n
    return text, counts


def find_classification(text: str) -> str | None:
    for pattern in CLASSIFIED_PATTERNS:
        if (m := pattern.search(text)):
            return m.group(1)
    return None


def load_transcripts(paths: list[Path]) -> list[Transcript]:
    renderers = {"eval": render_eval, "claude-code": render_claude_code, "trace": render_trace,
                 "text": lambda p: p.read_text(encoding="utf-8", errors="replace")}
    used: set[str] = set()
    out = []
    for kind, path in discover(paths):
        try:
            raw = renderers[kind](path)
        except (OSError, ValueError) as exc:
            print(f"  skipped {path}: {exc}", file=sys.stderr)
            continue
        if not raw.strip():
            continue
        text, counts = redact(truncate_middle(raw, MAX_TRANSCRIPT_BYTES))
        t = Transcript(name=_safe_name(kind, path, used), kind=kind, source=str(path), text=text,
                       redactions=counts, classified=find_classification(text))
        t.sha256 = hashlib.sha256(text.encode("utf-8")).hexdigest()
        out.append(t)
    return out


# ---------------------------------------------------------------------------
# Harness surfaces snapshot
# ---------------------------------------------------------------------------

def _frontmatter_description(path: Path) -> str:
    text = path.read_text(encoding="utf-8")
    m = re.match(r"---\n(.*?)\n---", text, re.S)
    if not m:
        return ""
    d = re.search(r"(?m)^description:\s*(.+)$", m.group(1))
    return d.group(1).strip().strip("'\"")[:200] if d else ""


def gotcha_sections(skill_md: str) -> list[str]:
    """Return each '## ...Gotcha...' section of a skill, heading included."""
    sections = []
    for m in re.finditer(r"(?m)^(#{2,3}) [^\n]*[Gg]otcha[^\n]*\n", skill_md):
        level = len(m.group(1))
        rest = skill_md[m.end():]
        end = re.search(rf"(?m)^#{{1,{level}}} ", rest)
        sections.append((m.group(0) + (rest[:end.start()] if end else rest)).strip())
    return sections


def build_surfaces(plugin_root: Path = PLUGIN_ROOT) -> str:
    out = [
        "# ArcKit harness surfaces",
        "",
        "Snapshot of the plugin's commands, skills, references, templates and hooks, taken by dream.py.",
        "Use these paths as the `surface` of a weakness. Existing gotchas are quoted so you can tell a new",
        "weakness from one that is already covered.",
        "",
        "## Skills and their existing gotchas",
        "",
    ]
    for skill in sorted((plugin_root / "skills").glob("*/SKILL.md")):
        out.append(f"### skills/{skill.parent.name}")
        out.append("")
        out.append(_frontmatter_description(skill))
        out.append("")
        sections = gotcha_sections(skill.read_text(encoding="utf-8"))
        if sections:
            # Demote the skill's own headings so they nest under this skill's heading.
            out.extend(re.sub(r"(?m)^#{2,3} ", "#### ", s) for s in sections)
        else:
            out.append("(no Gotchas section yet)")
        out.append("")
    out += ["## Commands", ""]
    for cmd in sorted((plugin_root / "commands").glob("*.md")):
        out.append(f"- `commands/{cmd.stem}`: {_frontmatter_description(cmd)}")
    out += ["", "## References", ""]
    out += [f"- `references/{p.name}`" for p in sorted((plugin_root / "references").glob("*.md"))]
    out += ["", "## Templates", ""]
    out += [f"- `templates/{p.name}`" for p in sorted((plugin_root / "templates").glob("*.md"))]
    out += ["", "## Hooks", ""]
    out += [f"- `hooks/{p.name}`" for p in sorted((plugin_root / "hooks").glob("*.mjs"))]
    return "\n".join(out) + "\n"


# ---------------------------------------------------------------------------
# Ledger: which transcripts each store has already dreamed over
# ---------------------------------------------------------------------------

def load_ledger(out_dir: Path) -> dict:
    path = out_dir / "ledger.json"
    return json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}


def save_ledger(out_dir: Path, ledger: dict) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "ledger.json").write_text(json.dumps(ledger, indent=2, sort_keys=True), encoding="utf-8")


def already_dreamed(ledger: dict, store_id: str | None, transcripts: list[Transcript]) -> set[str]:
    if not store_id:
        return set()
    seen = ledger.get(store_id, {})
    return {t.sha256 for t in transcripts if t.sha256 in seen}


def record_dreamed(ledger: dict, store_id: str, transcripts: list[Transcript], failed_names: set[str]) -> int:
    entry = ledger.setdefault(store_id, {})
    now = datetime.now(timezone.utc).isoformat(timespec="seconds")
    n = 0
    for t in transcripts:
        if t.name in failed_names:
            continue
        entry[t.sha256] = {"name": t.name, "source": t.source, "dreamed_at": now}
        n += 1
    return n


# ---------------------------------------------------------------------------
# Staging
# ---------------------------------------------------------------------------

def stage(run_dir: Path, transcripts: list[Transcript], surfaces: str) -> None:
    staged = run_dir / "staged"
    staged.mkdir(parents=True, exist_ok=True)
    for t in transcripts:
        (staged / t.name).write_text(t.text, encoding="utf-8")
    (run_dir / "surfaces.md").write_text(surfaces, encoding="utf-8")
    manifest = [{k: v for k, v in asdict(t).items() if k != "text"} | {"bytes": t.size} for t in transcripts]
    (run_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


def estimate_cost_usd(total_bytes: int) -> float:
    return max(0.25, round(total_bytes / 1_000_000 * COST_PER_MB_USD, 2))


# ---------------------------------------------------------------------------
# Managed Agents requests (pure builders, so tests can check them offline)
# ---------------------------------------------------------------------------

AUTO = {"type": "auto"}

NO_NETWORK = {
    "type": "limited",
    "allowed_hosts": [],
    "allow_package_managers": False,
    "allow_mcp_servers": False,
}


def toolset(*names: str) -> list[dict]:
    """The built-in agent toolset with everything off except the named tools."""
    return [{
        "type": "agent_toolset_20260401",
        "default_config": {"enabled": False, "permission_policy": AUTO},
        "configs": [{"name": n, "enabled": True} for n in names],
    }]


def load_prompt(name: str) -> str:
    return (PROMPTS_DIR / f"{name}.md").read_text(encoding="utf-8")


def worker_agent_request(name: str, prompt: str, model: str) -> dict:
    return {
        "name": name,
        "model": model,
        "system": load_prompt(prompt),
        "tools": toolset("read", "write", "edit", "glob", "grep"),
        "metadata": {"arckit": "dream", "role": name},
    }


def lead_agent_request(workers: list[dict], model: str) -> dict:
    return {
        "name": "arckit-dream-lead",
        "model": model,
        "system": load_prompt("lead"),
        "tools": toolset("read", "glob"),   # no write tools; read is needed to mount the uploads
        "multiagent": {
            "type": "multiagent_20261001",
            "workflows": {
                "type": "enabled",
                "inline_agents": {"type": "disabled"},
                "predefined_agents": workers,
            },
            "subagents": {"type": "disabled"},
        },
        "metadata": {"arckit": "dream", "role": "lead"},
    }


def session_request(lead_id: str, environment_id: str, store_id: str,
                    uploads: list[tuple[str, str]], budget_usd: float) -> dict:
    """uploads: (file_id, mount_path) pairs."""
    return {
        "agent": lead_id,
        "environment_id": environment_id,
        "title": "ArcKit harness dream",
        "resources": [
            *[{"type": "file", "file_id": fid, "mount_path": mount} for fid, mount in uploads],
            {
                "type": "memory_store",
                "memory_store_id": store_id,
                "access": "read_write",
                "instructions": (
                    "Long-term memory of repeatable ArcKit harness weaknesses, distilled from the run "
                    "transcripts mounted under " + TRANSCRIPT_MOUNT + ". Start at _index.md. Every "
                    "page is a proposal for a maintainer to review."
                ),
            },
        ],
        "budget": {
            "type": "limit",
            "max_list_cost": {"currency": "USD", "amount": str(round(budget_usd * 100))},
        },
        "metadata": {"arckit": "dream"},
    }


def work_request(n_transcripts: int) -> str:
    return (
        f"Please run tonight's dream. {n_transcripts} ArcKit run transcripts are mounted under "
        f"{TRANSCRIPT_MOUNT}/ and the harness surfaces snapshot is at {SURFACES_MOUNT}. Distil the "
        "repeatable harness weaknesses they show into the long-term memory store, as your system "
        "prompt describes, and reply with the one-line JSON report."
    )


def parse_report(text: str) -> dict | None:
    """Find the last JSON object in the lead's final message."""
    decoder = json.JSONDecoder()
    found = None
    for i, ch in enumerate(text):
        if ch != "{":
            continue
        try:
            obj, _ = decoder.raw_decode(text[i:])
        except json.JSONDecodeError:
            continue
        if isinstance(obj, dict) and "inputs_expected" in obj:
            found = obj
    return found


def failed_names(report: dict | None) -> set[str]:
    if not report:
        return set()
    names = set()
    for f in report.get("failures") or []:
        path = f.get("file", "") if isinstance(f, dict) else str(f)
        if path:
            names.add(Path(path).name)
    return names


def memory_export_path(out_root: Path, memory_path: str) -> Path:
    """Map a memory path to a file under out_root, refusing anything that escapes it."""
    rel = Path(memory_path.lstrip("/"))
    if rel.is_absolute() or ".." in rel.parts or not rel.parts:
        raise ValueError(f"unsafe memory path: {memory_path!r}")
    target = (out_root / rel).resolve()
    if not target.is_relative_to(out_root.resolve()):
        raise ValueError(f"unsafe memory path: {memory_path!r}")
    return target


# ---------------------------------------------------------------------------
# Managed Agents lifecycle (network)
# ---------------------------------------------------------------------------

def make_client():
    try:
        from anthropic import Anthropic
    except ImportError:
        raise SystemExit("dream.py: --run and --export-only need the SDK: pip install anthropic")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        raise SystemExit("dream.py: set ANTHROPIC_API_KEY")
    return Anthropic()


def export_store(client, store_id: str, out_dir: Path) -> Path:
    dest = out_dir / "stores" / store_id
    dest.mkdir(parents=True, exist_ok=True)
    count = 0
    for item in client.beta.memory_stores.memories.list(store_id, view="full"):
        if getattr(item, "type", None) != "memory":
            continue
        content = item.content
        if content is None:
            content = client.beta.memory_stores.memories.retrieve(item.id, memory_store_id=store_id, view="full").content
        try:
            target = memory_export_path(dest, item.path)
        except ValueError as exc:
            print(f"  skipped {exc}", file=sys.stderr)
            continue
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content or "", encoding="utf-8")
        count += 1
    print(f"Exported {count} memory files to {dest}")
    return dest


def stream_until_done(client, session_id: str, prompt: str, timeout_minutes: int) -> tuple[str, str]:
    """Send the work request and follow the session. Returns (final agent text, stop reason)."""
    deadline = time.monotonic() + timeout_minutes * 60
    final_text = ""
    with client.beta.sessions.events.stream(session_id) as stream:
        client.beta.sessions.events.send(session_id, events=[{
            "type": "user.message",
            "content": [{"type": "text", "text": prompt}],
        }])
        for event in stream:
            if time.monotonic() > deadline:
                client.beta.sessions.events.send(session_id, events=[{"type": "user.interrupt"}])
                return final_text, "timeout"
            match event.type:
                case "agent.message":
                    text = "".join(getattr(b, "text", "") for b in event.content)
                    if text.strip():
                        final_text = text
                case "workflow_run.created":
                    print("  workflow started", flush=True)
                case "workflow_run.status_ended":
                    print("  workflow ended", flush=True)
                case "session.thread_created":
                    print(".", end="", flush=True)
                case "session.error":
                    print(f"\n  session error: {getattr(event.error, 'message', event)}", file=sys.stderr)
                case "session.status_terminated":
                    return final_text, "terminated"
                case "session.status_idle":
                    reason = event.stop_reason.type
                    if reason == "requires_action":
                        # Unattended: decline anything that would wait for approval.
                        client.beta.sessions.events.send(session_id, events=[
                            {"type": "user.tool_confirmation", "tool_use_id": eid, "result": "deny",
                             "deny_message": "Unattended dream run: approval is not available."}
                            for eid in event.stop_reason.event_ids
                        ])
                        continue
                    return final_text, reason
    return final_text, "stream-closed"


def dream(args, transcripts: list[Transcript], surfaces: str, run_dir: Path, ledger: dict) -> int:
    client = make_client()
    b = client.beta
    created: dict[str, object] = {}
    uploaded: list[str] = []
    record: dict = {"run_dir": str(run_dir), "transcripts": len(transcripts),
                    "started_at": datetime.now(timezone.utc).isoformat(timespec="seconds")}
    try:
        if args.store_id:
            store_id = args.store_id
        else:
            store = b.memory_stores.create(
                name=STORE_NAME,
                description="Repeatable ArcKit harness weaknesses distilled from run transcripts by dream.py.",
                metadata={"arckit": "dream"},
            )
            store_id = store.id
            print(f"Memory store created: {store_id}  (reuse with --store-id {store_id})")
        record["store_id"] = store_id

        mounts: list[tuple[str, str]] = []
        for t in transcripts:
            f = b.files.upload(file=(t.name, t.text.encode("utf-8"), "text/plain"),
                               expires_in_seconds=UPLOAD_TTL_SECONDS)
            uploaded.append(f.id)
            mounts.append((f.id, f"{TRANSCRIPT_MOUNT}/{t.name}"))
        f = b.files.upload(file=("surfaces.md", surfaces.encode("utf-8"), "text/markdown"),
                           expires_in_seconds=UPLOAD_TTL_SECONDS)
        uploaded.append(f.id)
        mounts.append((f.id, SURFACES_MOUNT))
        print(f"Uploaded {len(uploaded)} files")

        analyzer = created["analyzer"] = b.agents.create(
            **worker_agent_request("transcript-analyzer", "analyzer", args.worker_model))
        organizer = created["organizer"] = b.agents.create(
            **worker_agent_request("memory-organizer", "organizer", args.worker_model))
        workers = [{"type": "agent", "id": a.id, "version": a.version} for a in (analyzer, organizer)]
        lead = created["lead"] = b.agents.create(**lead_agent_request(workers, args.lead_model))
        env = created["environment"] = b.environments.create(
            name="arckit-dream", config={"type": "cloud", "networking": NO_NETWORK})
        session = created["session"] = b.sessions.create(
            **session_request(lead.id, env.id, store_id, mounts, args.budget_usd))
        record["session_id"] = session.id
        print(f"Session {session.id} running (budget ${args.budget_usd:.2f}, timeout {args.timeout_minutes} min)")

        final_text, stop = stream_until_done(client, session.id, work_request(len(transcripts)),
                                             args.timeout_minutes)
        report = parse_report(final_text)
        record.update({"stop_reason": stop, "report": report, "final_text": final_text[-4000:]})
        print(f"\nStopped: {stop}")
        print(json.dumps(report, indent=2) if report else f"No JSON report found. Last message:\n{final_text[-2000:]}")

        try:
            usage = b.sessions.retrieve(session.id).usage
            cost = getattr(usage, "list_cost", None)
            record["list_cost"] = cost.model_dump() if cost is not None else None
            record["usage"] = usage.model_dump(exclude_none=True)
            if cost is not None:
                print(f"List cost: {int(cost.amount) / 100:.2f} {cost.currency}")
        except Exception as exc:  # cost reporting must never lose the run record
            print(f"  could not read session usage: {exc}", file=sys.stderr)

        export_store(client, store_id, args.out)
        if report and report.get("inputs_processed"):
            n = record_dreamed(ledger, store_id, transcripts, failed_names(report))
            save_ledger(args.out, ledger)
            print(f"Ledger: {n} transcripts marked as dreamed into {store_id}")
        return 0 if report and stop == "end_turn" else 1
    finally:
        record["finished_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds")
        (run_dir / "run.json").write_text(json.dumps(record, indent=2, default=str), encoding="utf-8")
        cleanup(b, created, uploaded, keep_session=args.keep_session)


def cleanup(b, created: dict, uploaded: list[str], *, keep_session: bool) -> None:
    def attempt(label: str, fn, *a, **kw):
        try:
            fn(*a, **kw)
        except Exception as exc:
            print(f"  cleanup: could not {label}: {exc}", file=sys.stderr)

    session = created.get("session")
    if session is not None and not keep_session:
        attempt(f"delete session {session.id}", b.sessions.delete, session.id)
    for role in ("lead", "analyzer", "organizer"):
        if (agent := created.get(role)) is not None:
            attempt(f"archive agent {agent.id}", b.agents.archive, agent.id)
    if (env := created.get("environment")) is not None:
        attempt(f"archive environment {env.id}", b.environments.archive, env.id)
    for fid in uploaded:
        attempt(f"delete file {fid}", b.files.delete, fid)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Dream over ArcKit run transcripts into a Managed Agents memory store of harness weaknesses.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Sources: eval results directories (plugins/arckit-claude/evals/results/...), Claude Code\n"
            "session transcripts (~/.claude/projects/<project>/), .arckit/autoresearch-traces/, or\n"
            ".md/.txt/.log files. Without --run nothing is sent: transcripts are staged under\n"
            "--out for you to read first."
        ),
    )
    p.add_argument("sources", nargs="*", type=Path, help="files or directories of runs to dream over")
    p.add_argument("--run", action="store_true", help="upload and dream (calls the API, costs money)")
    p.add_argument("--export-only", action="store_true", help="export --store-id to local files and stop")
    p.add_argument("--store-id", help="memory store to dream into or export (default: create one)")
    p.add_argument("--all", action="store_true", help="include transcripts the ledger says this store has seen")
    p.add_argument("--limit", type=int, default=MAX_TRANSCRIPTS,
                   help=f"most transcripts per run (default and maximum {MAX_TRANSCRIPTS})")
    p.add_argument("--allow-classified", action="store_true",
                   help="send transcripts that carry an OFFICIAL-SENSITIVE or SECRET classification")
    p.add_argument("--budget-usd", type=float, default=20.0, help="hard spend limit for the session (default 20)")
    p.add_argument("--timeout-minutes", type=int, default=180)
    p.add_argument("--lead-model", default=LEAD_MODEL)
    p.add_argument("--worker-model", default=WORKER_MODEL)
    p.add_argument("--keep-session", action="store_true", help="do not delete the session afterwards")
    p.add_argument("--out", type=Path, default=DEFAULT_OUT, help=f"local working directory (default {DEFAULT_OUT})")
    args = p.parse_args(argv)
    if args.export_only and not args.store_id:
        p.error("--export-only needs --store-id")
    if not args.export_only and not args.sources:
        p.error("give at least one source file or directory")
    if not 1 <= args.limit <= MAX_TRANSCRIPTS:
        p.error(f"--limit must be between 1 and {MAX_TRANSCRIPTS}")
    if args.budget_usd <= 0:
        p.error("--budget-usd must be positive")
    return args


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    args.out = args.out.expanduser().resolve()

    if args.export_only:
        export_store(make_client(), args.store_id, args.out)
        return 0

    transcripts = load_transcripts(args.sources)
    ledger = load_ledger(args.out)
    seen = set() if args.all else already_dreamed(ledger, args.store_id, transcripts)
    if seen:
        print(f"Skipping {len(seen)} transcripts already dreamed into {args.store_id} (use --all to include them)")
        transcripts = [t for t in transcripts if t.sha256 not in seen]

    classified = [t for t in transcripts if t.classified]
    if classified and not args.allow_classified:
        print(f"Leaving out {len(classified)} transcripts marked OFFICIAL-SENSITIVE or above "
              "(--allow-classified sends them):", file=sys.stderr)
        for t in classified:
            print(f"  {t.classified}: {t.source}", file=sys.stderr)
        transcripts = [t for t in transcripts if not t.classified]

    if len(transcripts) > args.limit:
        print(f"Taking the first {args.limit} of {len(transcripts)} transcripts; run again for the rest.")
        transcripts = transcripts[:args.limit]
    if not transcripts:
        print("Nothing to dream over.")
        return 0

    run_dir = args.out / "runs" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    surfaces = build_surfaces()
    stage(run_dir, transcripts, surfaces)

    total = sum(t.size for t in transcripts)
    by_kind: dict[str, int] = {}
    for t in transcripts:
        by_kind[t.kind] = by_kind.get(t.kind, 0) + 1
    redacted = sum(sum(t.redactions.values()) for t in transcripts)
    print(f"Staged {len(transcripts)} transcripts ({total / 1_000_000:.2f} MB) in {run_dir}")
    print("  " + ", ".join(f"{k}: {n}" for k, n in sorted(by_kind.items())))
    if redacted:
        print(f"  {redacted} likely secrets redacted (see manifest.json)")
    print(f"  rough list cost: ${estimate_cost_usd(total):.2f} (hard limit ${args.budget_usd:.2f})")

    if not args.run:
        print("\nDry run: nothing was sent. Read the staged files, then add --run to dream.")
        return 0
    return dream(args, transcripts, surfaces, run_dir, ledger)


if __name__ == "__main__":
    sys.exit(main())
