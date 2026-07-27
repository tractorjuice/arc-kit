"""Tests for /arckit:repo-audit and the CDAU doc-type registration (#616).

Covers the registration points that fail silently when missed:
  - CDAU in doc-types.mjs DOC_TYPES / MULTI_INSTANCE_TYPES / SUBDIR_MAP
  - CDAU in the separate /arckit:pages allow-list (dual registration)
  - MULTI_INSTANCE_TYPES parity across the .mjs set and both bash copies
  - template presence in both trees, byte-identical
  - the command's non-negotiable safety rules surviving future edits
"""

import re
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

DOC_TYPES_MJS = REPO_ROOT / "plugins/arckit-claude/config/doc-types.mjs"
PAGES_CMD = REPO_ROOT / "plugins/arckit-claude/commands/pages.md"
COMMAND = REPO_ROOT / "plugins/arckit-repo/commands/repo-audit.md"
PLUGIN_TEMPLATE = REPO_ROOT / "plugins/arckit-repo/templates/codebase-audit-template.md"
ARCKIT_TEMPLATE = REPO_ROOT / ".arckit/templates/codebase-audit-template.md"
BASH_COPIES = (
    REPO_ROOT / "scripts/bash/generate-document-id.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/generate-document-id.sh",
)


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def mjs_multi_instance() -> set[str]:
    match = re.search(
        r"export\s+const\s+MULTI_INSTANCE_TYPES\s*=\s*new\s+Set\(\s*\[(.*?)\]\s*\)",
        read(DOC_TYPES_MJS),
        re.DOTALL,
    )
    assert match, "MULTI_INSTANCE_TYPES set not found in doc-types.mjs"
    body = re.sub(r"//[^\n]*", "", match.group(1))
    return set(re.findall(r"['\"]([A-Z0-9-]+)['\"]", body))


def bash_multi_instance(path: Path) -> set[str]:
    match = re.search(r'^MULTI_INSTANCE_TYPES="([^"]*)"', read(path), re.MULTILINE)
    assert match, f"MULTI_INSTANCE_TYPES assignment not found in {path}"
    return set(match.group(1).split())


# --- doc-type registration ------------------------------------------------


def test_cdau_registered_in_doc_types():
    assert "'CDAU':" in read(DOC_TYPES_MJS), "CDAU missing from DOC_TYPES"


def test_cdau_is_multi_instance():
    # A project may audit several repositories; without this the ID helper
    # returns no -NNN- sequence and each audit overwrites the last.
    assert "CDAU" in mjs_multi_instance()


def test_cdau_maps_to_audits_subdir():
    assert re.search(r"'CDAU':\s*'audits'", read(DOC_TYPES_MJS)), \
        "CDAU missing from SUBDIR_MAP or not mapped to 'audits'"


def test_cdau_in_pages_allowlist():
    # Dual registration: /arckit:pages keeps its own allow-list inside the
    # prompt. Without an entry the artefact is silently absent from the
    # dashboard sidebar even though the manifest hook records it.
    assert "CDAU" in read(PAGES_CMD), "CDAU missing from the /arckit:pages allow-list"


def test_cdau_does_not_collide_with_an_existing_code():
    codes = re.findall(r"^\s+'([A-Z0-9-]+)':\s*\{", read(DOC_TYPES_MJS), re.MULTILINE)
    assert codes.count("CDAU") == 1, f"CDAU declared {codes.count('CDAU')} times"


# --- multi-instance parity (regression: TNDR/CMPT v5.9.0, GRNT 2026-07) ----


@pytest.mark.parametrize("bash_path", BASH_COPIES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_multi_instance_parity_with_bash(bash_path: Path):
    expected = mjs_multi_instance()
    actual = bash_multi_instance(bash_path)
    assert actual == expected, (
        f"MULTI_INSTANCE_TYPES drift in {bash_path.relative_to(REPO_ROOT)}: "
        f"missing={sorted(expected - actual)} extra={sorted(actual - expected)}"
    )


def test_grnt_present_in_bash_lists():
    # Explicit regression: GRNT was registered in .mjs but absent from bash,
    # so every /arckit:grants run emitted the same colliding ID.
    for bash_path in BASH_COPIES:
        assert "GRNT" in bash_multi_instance(bash_path), \
            f"GRNT missing from {bash_path.relative_to(REPO_ROOT)}"


def test_parity_guard_script_exists_and_passes():
    guard = REPO_ROOT / "scripts/check-multi-instance-parity.py"
    assert guard.is_file(), "parity guard script missing"
    result = subprocess.run(
        ["python3", str(guard)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"parity guard failed:\n{result.stdout}\n{result.stderr}"


# --- document ID generation ----------------------------------------------


def test_generate_document_id_sequences_cdau(tmp_path: Path):
    script = REPO_ROOT / "scripts/bash/generate-document-id.sh"

    def gen() -> str:
        result = subprocess.run(
            ["bash", str(script), "001", "CDAU", "--next-num", str(tmp_path)],
            capture_output=True, text=True, cwd=REPO_ROOT,
        )
        assert result.returncode == 0, result.stderr
        return result.stdout.strip()

    assert gen() == "ARC-001-CDAU-001-v1.0"
    (tmp_path / "ARC-001-CDAU-001-v1.0.md").touch()
    assert gen() == "ARC-001-CDAU-002-v1.0"


# --- template -------------------------------------------------------------


def test_template_exists_in_both_trees():
    assert PLUGIN_TEMPLATE.is_file(), "plugin template missing"
    assert ARCKIT_TEMPLATE.is_file(), ".arckit template missing"


def test_templates_are_identical():
    assert read(PLUGIN_TEMPLATE) == read(ARCKIT_TEMPLATE), \
        "codebase-audit-template.md differs between plugins/arckit-repo and .arckit"


def test_template_has_document_control_header():
    # The header resolves against ${CLAUDE_PLUGIN_ROOT}/templates/_partials/,
    # which is why arckit-repo is no longer sync-exempt.
    assert "<!-- DOC-CONTROL-HEADER -->" in read(PLUGIN_TEMPLATE)


def test_plugin_carries_shared_partials():
    partials = REPO_ROOT / "plugins/arckit-repo/templates/_partials"
    for name in ("document-control-uk.md", "document-control-uae.md"):
        assert (partials / name).is_file(), f"{name} missing from arckit-repo"


def test_arckit_repo_not_sync_exempt():
    sync_script = read(REPO_ROOT / "scripts/sync-shared-assets.py")
    match = re.search(r"SYNC_EXEMPT_PLUGINS\s*=\s*\{([^}]*)\}", sync_script)
    assert match, "SYNC_EXEMPT_PLUGINS not found"
    assert "arckit-repo" not in match.group(1), (
        "arckit-repo is sync-exempt again, but /arckit:repo-audit needs its own "
        "templates/_partials for the Document Control header"
    )


# --- command contract -----------------------------------------------------


def test_command_exists():
    assert COMMAND.is_file(), "repo-audit.md missing"


def test_command_writes_cdau_via_helper():
    body = read(COMMAND)
    assert "CDAU" in body
    assert "generate-document-id.sh" in body
    assert "--next-num" in body, "multi-instance types require --next-num"


def test_command_uses_write_tool_not_inline_output():
    # Large documents must go through Write or they hit the 32K output cap.
    assert "Write tool" in read(COMMAND)


@pytest.mark.parametrize(
    "rule",
    [
        "Never execute code from the audited repository",
        "Never write into the audited repository",
        "Never write a discovered secret's value into the report",
        "Never claim a control exists without evidence",
    ],
)
def test_command_retains_absolute_safety_rules(rule: str):
    assert rule in read(COMMAND), f"safety rule removed from repo-audit.md: {rule}"


def test_command_does_not_hard_error_on_missing_prerequisites():
    body = read(COMMAND)
    assert "Do not hard-error on missing prerequisites" in body, (
        "cold-mode degradation removed; the command would refuse to audit a repo "
        "that has no PRIN/REQ, which is the common first-run case"
    )


def test_command_declares_handoffs():
    body = read(COMMAND)
    for command in ("adr", "conformance", "requirements", "risk"):
        assert f"command: {command}" in body, f"missing handoff: {command}"


def test_command_clones_shallow_and_public_only():
    body = read(COMMAND)
    assert "--depth 100" in body, "shallow clone depth missing"
    assert "--recurse-submodules=no" in body, "submodules must not be cloned"
    assert "Private repos are out of scope" in body


def test_guide_exists_in_both_trees_and_matches():
    root_guide = REPO_ROOT / "docs/guides/repo-audit.md"
    plugin_guide = REPO_ROOT / "plugins/arckit-claude/docs/guides/repo-audit.md"
    assert root_guide.is_file(), "root guide missing"
    assert plugin_guide.is_file(), "plugin guide copy missing"
    assert read(root_guide) == read(plugin_guide), "guide trees drifted"


# --- F-010: project/repo correspondence before conformance mode -----------


def test_command_confirms_project_describes_the_repo():
    """A project existing in the repo does not mean it describes the audited code.

    Found on the first real run: arc-kit's only project is a UK-government
    consulting market study, and the command would have scored this codebase
    against its 28 unrelated requirements.
    """
    body = read(COMMAND)
    assert "Confirm the project actually describes this repository" in body
    assert "treat it as a *candidate*, not a decision" in body


def test_command_falls_back_to_cold_when_correspondence_unconfirmed():
    body = read(COMMAND)
    assert "Neither, or correspondence not confirmed" in body, (
        "unconfirmed correspondence must select cold mode, not conformance"
    )


def test_command_does_not_call_create_project_when_no_project_exists():
    # create-project.sh requires ARC-000-PRIN-*.md and refuses without it,
    # which would block the audit on a prerequisite it deliberately avoids.
    body = read(COMMAND)
    assert "Do **not** call `create-project.sh` here" in body


def test_check_mode_reports_correspondence():
    body = read(COMMAND)
    assert "whether that project appears to describe this repository" in body


# --- F-005: create-project.sh must not fail silently ---------------------


CREATE_PROJECT_COPIES = (
    REPO_ROOT / "scripts/bash/create-project.sh",
    REPO_ROOT / "plugins/arckit-claude/scripts/bash/create-project.sh",
)


@pytest.mark.parametrize("script", CREATE_PROJECT_COPIES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_create_project_guards_the_principles_lookup(script: Path):
    """`find` on a missing dir exits non-zero; under `set -euo pipefail` that
    killed the script before its own error message could print."""
    body = read(script)
    assert 'if [[ -d "$GLOBAL_DIR" ]]; then' in body, "missing directory guard"
    assert '| head -1) || true' in body, "find failure must be tolerated"


@pytest.mark.parametrize("script", CREATE_PROJECT_COPIES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_create_project_reports_missing_principles(tmp_path: Path, script: Path):
    """End-to-end: no projects/000-global at all must still explain itself."""
    (tmp_path / ".arckit").mkdir()
    (tmp_path / "projects").mkdir()
    result = subprocess.run(
        ["bash", str(script), "--name", "Test Project", "--json"],
        capture_output=True, text=True, cwd=tmp_path,
    )
    assert result.returncode == 1, "should fail without principles"
    combined = result.stdout + result.stderr
    assert combined.strip(), "failed SILENTLY - the whole point of this fix"
    assert "/arckit:principles" in combined, (
        f"error must name the fix, got: {combined!r}"
    )


def test_create_project_copies_are_identical():
    a, b = (read(p) for p in CREATE_PROJECT_COPIES)
    assert a == b, "create-project.sh copies have drifted"
