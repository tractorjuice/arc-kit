"""Tests for scripts/check-quality-checklist-refs.py.

The guard exists because a per-type reference to a section that does not exist
fails silently: the model reads the checklist, finds no `### <CODE>` heading, and
invents the criteria for the artefact it is about to write. Nothing errors and
nothing is logged. That shipped for 15 codes across arckit-togaf-adm and
arckit-agent-architecture from 2026-06-30 until PR #750 (issue #749).

The tests that matter most here are the negative ones. A guard that cannot fail
is worse than no guard, because it reads as coverage.
"""

import importlib.util
import json
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-quality-checklist-refs.py"

# The 15 codes that were dangling until PR #750.
REGRESSION_CODES = {
    "arckit-togaf-adm": [
        "ADMP", "BPCM", "APP", "APPR", "GAPA", "TRANS", "BORD", "ACHG", "REPO",
    ],
    "arckit-agent-architecture": [
        "AAGI", "AAGR", "AASE", "AAIN", "AAOV", "AAMT",
    ],
}


def load_guard():
    spec = importlib.util.spec_from_file_location("check_quality_checklist_refs", GUARD)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_plugin(root: Path, name: str, *, ref_code: str | None, sections: list[str] | None):
    """Build a minimal plugin tree. sections=None means no checklist file at all."""
    plugin = root / name
    (plugin / ".claude-plugin").mkdir(parents=True)
    (plugin / ".claude-plugin/plugin.json").write_text(json.dumps({"name": name}))
    if ref_code is not None:
        (plugin / "commands").mkdir()
        (plugin / "commands/thing.md").write_text(
            "---\ndoc-type: X\n---\n\nBefore writing the file, read the checklist and verify "
            f"all **Common Checks** plus the **{ref_code}** per-type checks pass.\n"
        )
    if sections is not None:
        (plugin / "references").mkdir()
        body = "# Quality Checklist\n\n## Per-Type Checks\n\n"
        body += "".join(f"### {c} -- Thing\n\n- a check\n\n" for c in sections)
        (plugin / "references/quality-checklist.md").write_text(body)
    return plugin


def run_against(module, plugins_dir: Path) -> int:
    module.PLUGINS_DIR = plugins_dir
    module.ROOT = plugins_dir.parent
    module.MIRROR_DIR = plugins_dir / "__no_mirror__"
    return module.main()


def test_guard_exists():
    assert GUARD.is_file(), "quality-checklist reference guard missing"


def test_guard_passes_on_current_tree():
    result = subprocess.run(
        ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"guard failed:\n{result.stdout}\n{result.stderr}"


def test_guard_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "check-quality-checklist-refs.py" in workflow, "guard not run in CI"


def test_guard_fails_on_dangling_reference(tmp_path, capsys):
    # The defect the guard exists for: reference emitted, no matching section.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", ref_code="GAPA", sections=["REQ", "ADR"])
    assert run_against(load_guard(), plugins) == 1
    assert "GAPA" in capsys.readouterr().err


def test_guard_fails_when_plugin_has_no_checklist_at_all(tmp_path, capsys):
    # ${CLAUDE_PLUGIN_ROOT} has no cross-plugin fallback, so a sync-exempt plugin
    # that emits a reference reads a file that does not exist. Resolving against
    # the core copy instead would pass this and fail open.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", ref_code="REQ", sections=None)
    assert run_against(load_guard(), plugins) == 1
    assert "no references/quality-checklist.md" in capsys.readouterr().err


def test_guard_passes_when_section_present(tmp_path):
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", ref_code="GAPA", sections=["GAPA"])
    assert run_against(load_guard(), plugins) == 0


def test_guard_fails_if_phrasing_stops_matching(tmp_path, capsys):
    # If the instruction wording is reworded tree-wide, REF_RE silently matches
    # nothing and every reference "resolves". Guard must refuse to pass empty.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", ref_code=None, sections=["REQ"])
    assert run_against(load_guard(), plugins) == 1
    assert "no per-type references found" in capsys.readouterr().err


@pytest.mark.parametrize(
    "text,expected",
    [
        ("plus the **GAPA** per-type checks pass", ["GAPA"]),
        ("plus **SECD** per-type checks pass", ["SECD"]),
        ("plus any applicable **WARD** per-type checks pass", ["WARD"]),
        ("plus the **FIPS199** per-type checks pass", ["FIPS199"]),
        ("plus the **NHS-DTAC** per-type checks pass", ["NHS-DTAC"]),
        ("all **Common Checks** pass", []),
    ],
)
def test_ref_regex_handles_every_phrasing_in_the_tree(text, expected):
    # All five shapes occur in plugins/ today; the last is the Common-Checks-only
    # form that must NOT be read as a per-type reference.
    assert load_guard().REF_RE.findall(text) == expected


def test_section_regex_matches_real_heading_shape():
    guard = load_guard()
    checklist = (
        REPO_ROOT / "plugins/arckit-claude/references/quality-checklist.md"
    ).read_text()
    found = set(guard.SECTION_RE.findall(checklist))
    assert "GAPA" in found and "REQ" in found
    assert len(found) >= 90, f"expected >=90 sections, found {len(found)}"


@pytest.mark.parametrize(
    "plugin,code",
    [(p, c) for p, codes in REGRESSION_CODES.items() for c in codes],
)
def test_pr750_codes_still_resolve_in_their_own_plugin(plugin, code):
    # Explicit regression for the 15 that motivated the guard, checked against
    # each plugin's OWN copy — the file the command actually reads at runtime.
    checklist = REPO_ROOT / "plugins" / plugin / "references/quality-checklist.md"
    assert checklist.is_file(), f"{plugin} carries no quality-checklist.md"
    guard = load_guard()
    sections = set(guard.SECTION_RE.findall(checklist.read_text()))
    assert code in sections, f"### {code} missing from {plugin}'s checklist again"


def test_generated_mirror_is_excluded():
    # plugins/arckit-claude/plugins/** is regenerated by sync-claude-plugin-layout.py.
    # Scanning it would double-report every core finding.
    guard = load_guard()
    assert guard.MIRROR_DIR == REPO_ROOT / "plugins/arckit-claude/plugins"
    core = REPO_ROOT / "plugins/arckit-claude"
    scanned = {path for path, _ in guard.references_for(core)}
    assert scanned, "no references found in core plugin"
    assert not any(guard.MIRROR_DIR in p.parents for p in scanned)
