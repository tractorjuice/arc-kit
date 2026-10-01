"""eval-headless.py reports a run that ended without writing its document.

Opus 5.5 can end a turn with a progress report instead of a tool call, and
`claude -p` treats that as the end of the run. The runner reports it as an
early stop, with the run's last words, rather than as an ordinary failure.
"""

from __future__ import annotations

import importlib.util
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location("eval_headless", REPO / "scripts" / "eval-headless.py")
eval_headless = importlib.util.module_from_spec(spec)
spec.loader.exec_module(eval_headless)


def scored(file_written: bool) -> dict:
    return {"graders": [
        {"name": "artefact", "type": "file_exists", "passed": file_written},
        {"name": "content", "type": "regex", "passed": file_written},
    ]}


def test_missing_document_on_a_normal_finish_is_an_early_stop():
    rec = {"subtype": "success", "timed_out": False,
           "last_message": "I've read the inputs. Next I'll write the Wardley map."}
    assert eval_headless.early_stop(rec, scored(False)).endswith("Next I'll write the Wardley map.")


def test_written_document_timeout_and_error_are_not_early_stops():
    ok = {"subtype": "success", "timed_out": False, "last_message": "Done."}
    assert eval_headless.early_stop(ok, scored(True)) is None
    assert eval_headless.early_stop({**ok, "timed_out": True}, scored(False)) is None
    assert eval_headless.early_stop({**ok, "subtype": "error_max_turns"}, scored(False)) is None


def test_read_only_cases_without_a_file_grader_are_never_early_stops():
    rec = {"subtype": "success", "timed_out": False, "last_message": "Here are the results."}
    assert eval_headless.early_stop(rec, {"graders": [{"name": "x", "type": "tool_used", "passed": False}]}) is None
