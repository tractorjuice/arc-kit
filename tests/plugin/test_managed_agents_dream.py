"""scripts/managed-agents/dream.py: transcript staging, guards and the Managed Agents lifecycle.

Everything here runs offline. The lifecycle test drives dream() against a fake
client that records each call, so the request shapes, the cleanup and the
ledger are checked without an API key.
"""

from __future__ import annotations

import importlib.util
import json
import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

REPO = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("dream", REPO / "scripts" / "managed-agents" / "dream.py")
dream = importlib.util.module_from_spec(spec)
sys.modules["dream"] = dream
spec.loader.exec_module(dream)


def _eval_case(root: Path, name: str = "adr-case", *, failed: bool = True, extra: str = "") -> Path:
    case = root / "20261101T000000Z" / name
    (case / "files" / "projects").mkdir(parents=True)
    (case / "files" / "projects" / "artefact.md").write_text("an artefact the run wrote", encoding="utf-8")
    (case / "recording.json").write_text(json.dumps({
        "case": name, "prompt": "/arckit:adr pick a database", "tags": ["artefact"],
        "created_files": ["projects/001-x/ARC-001-ADR-v1.0.md"],
    }), encoding="utf-8")
    (case / "scores.json").write_text(json.dumps({"score": 0.5, "graders": [
        {"name": "adr-in-decisions", "type": "file_exists", "passed": not failed, "details": "no match"},
        {"name": "judge", "type": "llm", "skipped": True},
    ]}), encoding="utf-8")
    events = [
        {"type": "system", "subtype": "init"},
        {"type": "assistant", "message": {"content": [
            {"type": "thinking", "thinking": "private reasoning"},
            {"type": "text", "text": "Writing the ADR."},
            {"type": "tool_use", "name": "Write", "input": {"file_path": "projects/001-x/ARC-001-ADR-v1.0.md",
                                                             "content": extra}},
        ]}},
        {"type": "user", "message": {"content": [
            {"type": "tool_result", "is_error": True, "content": [{"type": "text", "text": "Blocked: use decisions/"}]},
        ]}},
        {"type": "result", "subtype": "success", "is_error": False, "num_turns": 3, "total_cost_usd": 0.4},
    ]
    (case / "transcript.jsonl").write_text("\n".join(json.dumps(e) for e in events) + "\n", encoding="utf-8")
    return case


# ── Rendering and discovery ──────────────────────────────────────────


def test_eval_recording_leads_with_grader_outcome_and_drops_thinking(tmp_path):
    case = _eval_case(tmp_path)
    text = dream.render_eval(case)
    assert text.index("grader FAIL: adr-in-decisions") < text.index("TRANSCRIPT")
    assert "grader SKIPPED: judge" in text
    assert "ASSISTANT: Writing the ADR." in text
    assert "TOOL_USE Write:" in text
    assert "TOOL_RESULT[error]: Blocked: use decisions/" in text
    assert "RESULT: subtype=success" in text
    assert "private reasoning" not in text


def test_discover_treats_eval_dirs_as_one_run_and_skips_their_files(tmp_path):
    _eval_case(tmp_path)
    session = tmp_path / "cc"
    (session / "abc" / "subagents").mkdir(parents=True)
    (session / "abc.jsonl").write_text(json.dumps({"type": "user", "message": {"content": "hi"}}) + "\n")
    (session / "abc" / "subagents" / "agent-1.jsonl").write_text("{}\n")
    found = dream.discover([tmp_path])
    kinds = sorted(k for k, _ in found)
    assert kinds == ["claude-code", "eval"]
    assert not any("artefact.md" in str(p) or "subagents" in str(p) for _, p in found)


def test_upload_names_are_ascii_unique_and_txt(tmp_path):
    a = _eval_case(tmp_path / "one", "same-name")
    b = _eval_case(tmp_path / "two", "same-name")
    used: set[str] = set()
    names = [dream._safe_name("eval", p, used) for p in (a, b, a)]
    assert len(set(names)) == 3
    assert all(n.isascii() and n.endswith(".txt") for n in names)


def test_truncate_middle_keeps_head_and_tail():
    text = "HEAD" + "x" * 10_000 + "TAIL"
    out = dream.truncate_middle(text, 1_000)
    assert len(out) <= 1_000
    assert out.startswith("HEAD") and out.endswith("TAIL") and "cut by dream.py" in out
    assert dream.truncate_middle("short", 1_000) == "short"


# ── Guards: secrets, classification, ledger ──────────────────────────


@pytest.mark.parametrize("secret,label", [
    ("sk-ant-api03-" + "a" * 30, "anthropic-key"),
    ("ghp_" + "b" * 36, "github-token"),
    ("AKIA" + "C" * 16, "aws-access-key"),
    ("Authorization: Bearer " + "d" * 40, "bearer-token"),
    ("-----BEGIN RSA PRIVATE KEY-----\nabc\n-----END RSA PRIVATE KEY-----", "private-key"),
])
def test_redact_replaces_secrets(secret, label):
    text, counts = dream.redact(f"before {secret} after")
    assert counts.get(label) == 1
    assert f"[REDACTED:{label}]" in text and "before" in text and "after" in text


def test_classification_ignores_the_template_placeholder():
    placeholder = "| Classification | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |"
    assert dream.find_classification(placeholder) is None
    assert dream.find_classification("| **Classification** | OFFICIAL |") is None
    assert dream.find_classification("| Classification | OFFICIAL-SENSITIVE |") == "OFFICIAL-SENSITIVE"
    assert dream.find_classification("Classification: SECRET\n") == "SECRET"


def test_dry_run_sends_nothing_and_leaves_out_classified_runs(tmp_path, monkeypatch, capsys):
    _eval_case(tmp_path / "ok", "plain")
    _eval_case(tmp_path / "hot", "sensitive", extra="| Classification | OFFICIAL-SENSITIVE |")
    monkeypatch.setattr(dream, "make_client", lambda: pytest.fail("dry run must not create a client"))
    out = tmp_path / "out"
    assert dream.main([str(tmp_path / "ok"), str(tmp_path / "hot"), "--out", str(out)]) == 0
    run_dir = next((out / "runs").iterdir())
    staged = sorted(p.name for p in (run_dir / "staged").iterdir())
    assert len(staged) == 1 and "plain" in staged[0]
    assert "OFFICIAL-SENSITIVE" in capsys.readouterr().err
    manifest = json.loads((run_dir / "manifest.json").read_text())
    assert "text" not in manifest[0] and manifest[0]["bytes"] > 0
    assert (run_dir / "surfaces.md").is_file()


def test_ledger_skips_runs_already_dreamed_into_the_same_store(tmp_path):
    _eval_case(tmp_path)
    ts = dream.load_transcripts([tmp_path])
    ledger: dict = {}
    assert dream.record_dreamed(ledger, "memstore_1", ts, failed_names=set()) == 1
    assert dream.already_dreamed(ledger, "memstore_1", ts) == {ts[0].sha256}
    assert dream.already_dreamed(ledger, "memstore_2", ts) == set()
    assert dream.already_dreamed(ledger, None, ts) == set()
    assert dream.record_dreamed({}, "memstore_1", ts, failed_names={ts[0].name}) == 0


def test_memory_export_path_refuses_escapes(tmp_path):
    assert dream.memory_export_path(tmp_path, "/_index.md") == (tmp_path / "_index.md").resolve()
    assert dream.memory_export_path(tmp_path, "/a/b.md") == (tmp_path / "a" / "b.md").resolve()
    for bad in ("/../x.md", "/a/../../x.md", "/"):
        with pytest.raises(ValueError):
            dream.memory_export_path(tmp_path, bad)


# ── Surfaces snapshot ────────────────────────────────────────────────


def test_gotcha_sections_stop_at_the_next_peer_heading():
    md = "# Skill\n\n## Usage\n\nx\n\n## Common Gotchas\n\n- one\n\n### Detail\n\n- two\n\n## Next\n\nno\n"
    [section] = dream.gotcha_sections(md)
    assert section.startswith("## Common Gotchas") and "- two" in section and "## Next" not in section


def test_surfaces_snapshot_quotes_existing_gotchas_and_lists_commands():
    surfaces = dream.build_surfaces()
    assert "### skills/wardley-mapping" in surfaces
    assert "#### Common Gotchas" in surfaces
    assert "- `commands/requirements`:" in surfaces
    assert "- `hooks/validate-arc-filename.mjs`" in surfaces


# ── Request builders ─────────────────────────────────────────────────


def test_toolset_enables_only_named_tools_without_shell_or_web():
    [ts] = dream.toolset("read", "glob")
    assert ts["default_config"]["enabled"] is False
    assert [c["name"] for c in ts["configs"]] == ["read", "glob"]


def test_lead_cannot_write_or_define_its_own_agents():
    req = dream.lead_agent_request([{"type": "agent", "id": "agent_a", "version": 1}], "m")
    tools = [c["name"] for c in req["tools"][0]["configs"]]
    assert "write" not in tools and "edit" not in tools
    ma = req["multiagent"]
    assert ma["workflows"]["inline_agents"] == {"type": "disabled"}
    assert ma["subagents"] == {"type": "disabled"}


def test_session_has_no_write_access_beyond_the_store_and_a_budget_in_cents():
    req = dream.session_request("agent_l", "env_1", "memstore_1", [("file_1", "/mnt/x.txt")], 12.5)
    assert req["budget"]["max_list_cost"] == {"currency": "USD", "amount": "1250"}
    store = [r for r in req["resources"] if r["type"] == "memory_store"]
    assert store[0]["access"] == "read_write" and len(store[0]["instructions"]) <= 4096
    assert dream.NO_NETWORK["allowed_hosts"] == [] and dream.NO_NETWORK["allow_mcp_servers"] is False


def test_parse_report_takes_the_last_report_object():
    text = 'I ran it. {"note": 1} {"inputs_expected": 2, "inputs_processed": 1, ' \
           '"failures": [{"file": "/mnt/session/uploads/transcripts/eval--a.txt", "reason": "x"}]}'
    report = dream.parse_report(text)
    assert report["inputs_processed"] == 1
    assert dream.failed_names(report) == {"eval--a.txt"}
    assert dream.parse_report("no json here") is None


def test_prompts_treat_transcripts_as_untrusted():
    for name in ("lead", "analyzer", "organizer"):
        assert "untrusted" in dream.load_prompt(name).lower(), name


# ── Lifecycle against a fake client ──────────────────────────────────


class FakeStream:
    def __init__(self, events):
        self.events = events

    def __enter__(self):
        return iter(self.events)

    def __exit__(self, *exc):
        return False


def _fake_client(calls: list, report: dict):
    def rec(name, result=None):
        def fn(*a, **kw):
            calls.append((name, a, kw))
            return result(*a, **kw) if callable(result) else result
        return fn

    counter = iter(range(1, 1000))
    agent = lambda **kw: SimpleNamespace(id=f"agent_{kw['name']}", version=1)
    idle = SimpleNamespace(type="session.status_idle", stop_reason=SimpleNamespace(type="end_turn"))
    message = SimpleNamespace(type="agent.message", content=[SimpleNamespace(text=json.dumps(report))])
    usage = SimpleNamespace(list_cost=SimpleNamespace(amount="42", currency="USD",
                                                      model_dump=lambda: {"amount": "42", "currency": "USD"}),
                            model_dump=lambda **kw: {"input_tokens": 1})
    memories = [SimpleNamespace(type="memory", id="mem_1", path="/_index.md", content="# Index\n"),
                SimpleNamespace(type="memory", id="mem_2", path="/../escape.md", content="nope")]
    b = SimpleNamespace(
        memory_stores=SimpleNamespace(
            create=rec("store.create", SimpleNamespace(id="memstore_new")),
            memories=SimpleNamespace(list=rec("memories.list", memories), retrieve=rec("memories.retrieve"))),
        files=SimpleNamespace(upload=rec("files.upload", lambda **kw: SimpleNamespace(id=f"file_{next(counter)}")),
                              delete=rec("files.delete")),
        agents=SimpleNamespace(create=rec("agents.create", agent), archive=rec("agents.archive")),
        environments=SimpleNamespace(create=rec("env.create", SimpleNamespace(id="env_1")),
                                     archive=rec("env.archive")),
        sessions=SimpleNamespace(
            create=rec("sessions.create", SimpleNamespace(id="sess_1")),
            retrieve=rec("sessions.retrieve", SimpleNamespace(usage=usage)),
            delete=rec("sessions.delete"),
            events=SimpleNamespace(stream=lambda sid: FakeStream([message, idle]), send=rec("events.send"))),
    )
    return SimpleNamespace(beta=b)


def test_run_creates_mounts_dreams_exports_records_and_cleans_up(tmp_path, monkeypatch):
    src = tmp_path / "src"
    _eval_case(src, "a")
    _eval_case(src, "b")
    calls: list = []
    names = sorted(t.name for t in dream.load_transcripts([src]))
    report = {"inputs_expected": 2, "inputs_processed": 1, "organized": True, "index_entries": 1,
              "changes": [], "failures": [{"file": f"{dream.TRANSCRIPT_MOUNT}/{names[1]}", "reason": "x"}]}
    monkeypatch.setattr(dream, "make_client", lambda: _fake_client(calls, report))
    out = tmp_path / "out"

    assert dream.main([str(src), "--run", "--out", str(out), "--budget-usd", "5"]) == 0

    by_name = {}
    for name, a, kw in calls:
        by_name.setdefault(name, []).append((a, kw))
    assert len(by_name["files.upload"]) == 3                       # two transcripts + surfaces.md
    lead_kw = by_name["agents.create"][2][1]
    assert lead_kw["multiagent"]["workflows"]["predefined_agents"] == [
        {"type": "agent", "id": "agent_transcript-analyzer", "version": 1},
        {"type": "agent", "id": "agent_memory-organizer", "version": 1}]
    assert by_name["env.create"][0][1]["config"]["networking"] == dream.NO_NETWORK
    session_kw = by_name["sessions.create"][0][1]
    mounts = sorted(r["mount_path"] for r in session_kw["resources"] if r["type"] == "file")
    assert dream.SURFACES_MOUNT in mounts and f"{dream.TRANSCRIPT_MOUNT}/{names[0]}" in mounts
    assert session_kw["budget"]["max_list_cost"]["amount"] == "500"

    # Cleanup: session deleted, three agents and the environment archived, every upload deleted.
    assert len(by_name["sessions.delete"]) == 1
    assert len(by_name["agents.archive"]) == 3
    assert len(by_name["env.archive"]) == 1
    assert len(by_name["files.delete"]) == 3

    # Export keeps the store's files inside the export directory.
    exported = out / "stores" / "memstore_new"
    assert (exported / "_index.md").read_text() == "# Index\n"
    assert not (out / "stores" / "escape.md").exists()

    # Only the transcript that did not fail is marked as dreamed.
    ledger = json.loads((out / "ledger.json").read_text())
    assert [v["name"] for v in ledger["memstore_new"].values()] == [names[0]]
    run = json.loads(next((out / "runs").glob("*/run.json")).read_text())
    assert run["store_id"] == "memstore_new" and run["stop_reason"] == "end_turn"
    assert run["list_cost"] == {"amount": "42", "currency": "USD"}


def test_cleanup_runs_even_when_a_step_fails(tmp_path, monkeypatch):
    src = tmp_path / "src"
    _eval_case(src)
    calls: list = []
    client = _fake_client(calls, {})

    def boom(**kw):
        raise RuntimeError("environment refused")

    client.beta.environments.create = boom
    monkeypatch.setattr(dream, "make_client", lambda: client)
    with pytest.raises(RuntimeError):
        dream.main([str(src), "--run", "--store-id", "memstore_x", "--out", str(tmp_path / "out")])
    names = [c[0] for c in calls]
    assert "store.create" not in names
    assert names.count("agents.archive") == 3
    assert names.count("files.delete") == 2
    assert (next((tmp_path / "out" / "runs").iterdir()) / "run.json").is_file()


def test_cli_requires_sources_or_export_store():
    with pytest.raises(SystemExit):
        dream.parse_args([])
    with pytest.raises(SystemExit):
        dream.parse_args(["--export-only"])
    with pytest.raises(SystemExit):
        dream.parse_args(["x", "--limit", "600"])
    assert dream.parse_args(["--export-only", "--store-id", "memstore_1"]).export_only
