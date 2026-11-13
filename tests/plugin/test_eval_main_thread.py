"""Graders can tell the command's own session from a subagent's.

#873 has to prove that a bid never reaches the context that scores it, while
the reader opens that same bid. The trace holds both, so a plain regex over it
can't say which side read what. `parent_tool_use_id` marks a subagent's events.
"""
import importlib.util
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("eval_headless", REPO / "scripts" / "eval-headless.py")
eval_headless = importlib.util.module_from_spec(spec)
spec.loader.exec_module(eval_headless)

CANARY = "pre-qualified this bid"
EVENTS = [
    {"type": "assistant", "parent_tool_use_id": None, "message": {"content": [
        {"type": "tool_use", "name": "Read", "input": {"file_path": "ARC-001-EVAL-v1.0.md"}},
        {"type": "tool_use", "name": "Agent", "input": {"subagent_type": "arckit:arckit-evaluate-reader"}},
    ]}},
    {"type": "assistant", "parent_tool_use_id": "toolu_1", "message": {"content": [
        {"type": "tool_use", "name": "Read", "input": {"file_path": "vendors/acme/proposal.md"}},
    ]}},
    {"type": "user", "parent_tool_use_id": "toolu_1", "message": {"content": [
        {"type": "tool_result", "content": CANARY},
    ]}},
]


def record(events=EVENTS):
    return {"created_files": [], "events": events, "tool_uses": eval_headless.tool_calls(events), "last_message": ""}


def grade(grader):
    return eval_headless.grade({"_name": "g", **grader}, record(), Path("."))


def test_a_call_records_which_thread_made_it():
    calls = eval_headless.tool_calls(EVENTS)
    assert [c["parent"] for c in calls] == [None, None, "toolu_1"]


def test_scope_main_ignores_the_readers_reads():
    assert grade({"type": "tool_used", "tool": "Read", "input_match": "proposal", "scope": "main", "min": 0, "max": 0})["passed"]


def test_scope_main_still_catches_the_commands_own_read():
    events = [{"type": "assistant", "parent_tool_use_id": None, "message": {"content": [
        {"type": "tool_use", "name": "Read", "input": {"file_path": "vendors/acme/proposal.md"}},
    ]}}]
    result = eval_headless.grade(
        {"_name": "g", "type": "tool_used", "tool": "Read", "input_match": "proposal", "scope": "main", "min": 0, "max": 0},
        record(events), Path("."))
    assert not result["passed"]


def test_without_scope_every_call_counts_as_before():
    assert grade({"type": "tool_used", "tool": "Read", "input_match": "proposal", "min": 1})["passed"]


def test_main_trace_leaves_out_what_a_subagent_saw():
    grader = {"type": "regex", "pattern": CANARY, "match": "not_contains"}
    assert grade({**grader, "target": "main_trace"})["passed"]
    assert not grade({**grader, "target": "trace"})["passed"]


def test_an_older_recording_with_no_parent_reads_as_main():
    rec = record()
    rec["tool_uses"] = [{"name": "Read", "input": {"file_path": "x"}}]
    result = eval_headless.grade({"_name": "g", "type": "tool_used", "tool": "Read", "scope": "main"}, rec, Path("."))
    assert result["passed"]
