"""Tests for scripts/check-doc-type-registry.py.

The guard's command/agent check is the one that catches the fatal class of
doc-type drift: validate-arc-filename.mjs is a PreToolUse hook that BLOCKS any
write under projects/** whose code is not in KNOWN_TYPES, and the command has no
conforming name to fall back to. That is how /arckit:glossary (GLOS) and
/arckit:framework (FWRK) shipped unusable.

Its regex was blind to every multi-instance filename carrying a sequence
segment, which is the form all 20 MULTI_INSTANCE_TYPES codes are actually
written in (#715). The hook strips the sequence before its own KNOWN_TYPES
lookup, so an unregistered multi-instance code passed the gate and was then
blocked at runtime. These tests pin the filename forms that must resolve.
"""

import importlib.util
import subprocess
import textwrap
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-doc-type-registry.py"
PROBE = REPO_ROOT / "plugins/arckit-claude/commands/zz-doc-type-registry-probe.md"


def load_guard():
    spec = importlib.util.spec_from_file_location("check_doc_type_registry", GUARD)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_guard_exists():
    assert GUARD.is_file(), "doc-type registry guard missing"


def test_guard_passes_on_current_tree():
    result = subprocess.run(
        ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"guard failed:\n{result.stdout}\n{result.stderr}"


def test_guard_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "check-doc-type-registry.py" in workflow, "guard not run in CI"


@pytest.mark.parametrize(
    "filename,expected",
    [
        # Single-instance: the form that always worked.
        ("ARC-001-REQ-v1.0.md", "REQ"),
        ("ARC-{PROJECT_ID}-REQ-v{VERSION}.md", "REQ"),
        # Compound codes must survive intact, not be split at the last segment.
        ("ARC-000-PRIN-COMP-v1.0.md", "PRIN-COMP"),
        ("ARC-001-SECD-MOD-v1.0.md", "SECD-MOD"),
        # Multi-instance: every sequence form in the tree. Each of these
        # returned no match at all before #715.
        ("ARC-001-WGAM-001-v1.0.md", "WGAM"),
        ("ARC-{PROJECT_ID}-WGAM-{NNN}-v1.0.md", "WGAM"),
        ("ARC-{PROJECT_ID}-WGAM-{NUM}-v{VERSION}.md", "WGAM"),
        ("ARC-{PID}-ADR-001-v1.0.md", "ADR"),
        ("ARC-001-DSCT-002-v2.1.md", "DSCT"),
    ],
)
def test_command_code_regex_matches_written_filename_forms(filename, expected):
    guard = load_guard()
    assert guard.COMMAND_CODE_RE.findall(filename) == [expected], (
        f"{filename!r} did not yield {expected!r} -- an unregistered code in "
        f"this form would pass the gate and then be blocked by "
        f"validate-arc-filename.mjs at runtime"
    )


def test_literal_nn_placeholder_still_resolves_via_fallback():
    """`ARC-{P}-GRNT-NN-v1.0.md` is matched as the compound code `GRNT-NN`.

    CODE swallows the uppercase `NN`, and check_command_codes splits it back off
    against NOT_A_CODE_IN_PROSE. That is pre-existing behaviour the widened
    pattern must not disturb.
    """
    guard = load_guard()
    assert guard.COMMAND_CODE_RE.findall("ARC-{P}-GRNT-NN-v1.0.md") == ["GRNT-NN"]
    assert "NN" in guard.NOT_A_CODE_IN_PROSE


def test_guard_rejects_unregistered_multi_instance_code(tmp_path):
    """End-to-end: an unregistered code in multi-instance form must fail the gate.

    The guard globs the real plugin tree, so the probe has to live there
    briefly. It is removed again whether or not the assertions hold.
    """
    PROBE.write_text(
        textwrap.dedent(
            """\
            ---
            description: doc-type registry regression probe
            ---

            Write `ARC-{PROJECT_ID}-BOGUS-{NNN}-v1.0.md` and
            `ARC-001-ZZZZ-001-v1.0.md` and `ARC-{PID}-QQQQ-{NUM}-v1.0.md`.
            """
        )
    )
    try:
        result = subprocess.run(
            ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
        )
    finally:
        PROBE.unlink(missing_ok=True)

    assert result.returncode == 1, "guard passed on unregistered codes"
    for code in ("BOGUS", "ZZZZ", "QQQQ"):
        assert code in result.stderr, f"{code} not reported:\n{result.stderr}"
