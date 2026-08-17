"""Tests for scripts/check-quality-checklist-ladders.py.

The guard exists because a per-type check can demand a classification the
artefact never renders. Since #744 hard-routed the Document Control ladder by
regime, an FR artefact renders `Diffusion Restreinte` from
`document-control-fr.md` while the checklist still demanded `OFFICIAL-SENSITIVE`
— so a correctly classified artefact failed the check its own command gates on.
Seven sections were in that state until PR #788 (issue #787), and every one
arose by copying a UK section when adding an overlay type.

The negative tests are the ones that matter. #790 asked for proof the guard can
fail, because a guard that cannot demonstrate a failure reads as coverage. The
`test_reproduces_the_*` cases below are that proof, and they use the real
registry and the real partials rather than a hardcoded ladder, so they cannot
drift from what the artefact actually renders.
"""

import importlib.util
import json
import subprocess
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
GUARD = REPO_ROOT / "scripts/check-quality-checklist-ladders.py"
CORE_CHECKLIST = REPO_ROOT / "plugins/arckit-claude/references/quality-checklist.md"

# The seven sections PR #788 fixed, with the value each must now assert. Six FR
# plus ATDSG; the values are the ones #752 settled for the command bodies.
PR788_SECTIONS = {
    "IRN": "Diffusion Restreinte",
    "EBIOS": "Diffusion Restreinte",
    "ANSSI": "Diffusion Restreinte",
    "CARTO": "Diffusion Restreinte",
    "ALGO": "Non protégé",
    "PSSI": "Diffusion Restreinte",
    "ATDSG": "Eingeschränkt",
}


def load_guard():
    spec = importlib.util.spec_from_file_location("check_quality_checklist_ladders", GUARD)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_plugin(root: Path, name: str, sections: dict[str, list[str]]) -> Path:
    """Minimal plugin carrying only a checklist.

    No `templates/_partials`, so `ladder_for` falls back to the real core copy
    and the test runs against the ladders the artefact actually renders.
    """
    plugin = root / name
    (plugin / ".claude-plugin").mkdir(parents=True)
    (plugin / ".claude-plugin/plugin.json").write_text(json.dumps({"name": name}))
    (plugin / "references").mkdir()
    body = "# Quality Checklist\n\n## Per-Type Checks\n\n"
    for code, lines in sections.items():
        body += f"### {code} -- Thing\n\n"
        body += "".join(f"- {line}\n" for line in lines)
        body += "\n"
    (plugin / "references/quality-checklist.md").write_text(body, encoding="utf-8")
    return plugin


def run_against(module, plugins_dir: Path) -> int:
    """Point the guard at a synthetic tree, keeping the real core registry."""
    module.PLUGINS_DIR = plugins_dir
    module.ROOT = plugins_dir.parent
    module.MIRROR_DIR = plugins_dir / "__no_mirror__"
    return module.main()


def section_body(checklist: str, code: str) -> str:
    guard = load_guard()
    lines = checklist.splitlines()
    out, capturing = [], False
    for line in lines:
        heading = guard.SECTION_RE.match(line)
        if heading:
            capturing = heading.group(1) == code
            continue
        if capturing:
            out.append(line)
    return "\n".join(out)


def test_guard_exists():
    assert GUARD.is_file(), "quality-checklist ladder guard missing"


def test_guard_passes_on_current_tree():
    result = subprocess.run(
        ["python3", str(GUARD)], capture_output=True, text=True, cwd=REPO_ROOT
    )
    assert result.returncode == 0, f"guard failed:\n{result.stdout}\n{result.stderr}"


def test_guard_is_wired_into_ci():
    workflow = (REPO_ROOT / ".github/workflows/lint-markdown.yml").read_text()
    assert "check-quality-checklist-ladders.py" in workflow, "guard not run in CI"


# --- the #787 defect, reproduced ------------------------------------------------


@pytest.mark.parametrize("code,uk_value", [("IRN", "OFFICIAL-SENSITIVE"), ("ALGO", "PUBLIC")])
def test_reproduces_the_787_defect(tmp_path, capsys, code, uk_value):
    # Exactly the pre-#788 wording: an FR section asserting a UK ladder value.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", {code: [f"Document classified {uk_value}"]})
    assert run_against(load_guard(), plugins) == 1
    err = capsys.readouterr().err
    assert uk_value in err and "on the UK ladder, not FR's" in err


def test_reproduces_the_atdsg_defect(tmp_path, capsys):
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", {"ATDSG": ["Document classified OFFICIAL-SENSITIVE"]})
    assert run_against(load_guard(), plugins) == 1
    assert "on the UK ladder, not AT's" in capsys.readouterr().err


def test_passes_when_the_value_is_on_the_own_ladder(tmp_path):
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(
        plugins,
        "arckit-fake",
        {
            "IRN": ["Document classified Diffusion Restreinte minimum"],
            "ATDSG": ["Document classified Eingeschränkt (or Vertraulich where it applies)"],
            "DR": ["Document itself classified DIFFUSION RESTREINTE"],
        },
    )
    assert run_against(load_guard(), plugins) == 0


def test_fallthrough_regime_may_assert_a_uk_value(tmp_path):
    # UK, MOD, EU and US resolve through user config, so a UAE-configured
    # operator can legitimately render a UAE ladder for them. Policing those
    # would fail correct content — only the six hard-routing regimes are checked.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", {"TCOP": ["Document classified OFFICIAL-SENSITIVE"]})
    assert run_against(load_guard(), plugins) == 0


def test_fails_if_phrasing_stops_matching(tmp_path, capsys):
    # If the assertion wording is reworded tree-wide, ASSERT_RE silently matches
    # nothing and every section "passes". Guard must refuse to pass empty.
    plugins = tmp_path / "plugins"
    plugins.mkdir()
    make_plugin(plugins, "arckit-fake", {"IRN": ["Some check with no classification"]})
    assert run_against(load_guard(), plugins) == 1
    assert "no Document Control classification assertions found" in capsys.readouterr().err


# --- parsing --------------------------------------------------------------------


@pytest.mark.parametrize(
    "line,expected",
    [
        ("- Document classified Diffusion Restreinte minimum", ["Diffusion Restreinte"]),
        ("- Document itself classified DIFFUSION RESTREINTE", ["DIFFUSION RESTREINTE"]),
        ("- Document classified Non protégé (notice must be public)", ["Non protégé"]),
        ("- Classification: Offen", ["Offen"]),
        # The hyphen bug: a bare `-` strip cut this to OFFICIAL, which is itself
        # a real ladder value, so the guard reported the wrong token as foreign.
        ("- Document classified OFFICIAL-SENSITIVE", ["OFFICIAL-SENSITIVE"]),
        ("- Document classified Eingeschränkt or Vertraulich", ["Eingeschränkt", "Vertraulich"]),
        # Not classification assertions — both occur in the checklist today.
        ("- Change classified as EVOLUTIONARY, TRANSFORMATIONAL or CORRECTIVE", []),
        ("- Every provider classified as designated CTP, material non-CTP", []),
        # The documented false positive from the #787 detection pass: `Open` is
        # on the UAE ladder and also ordinary English.
        ("- Open Items record which regulations may post-date the artefact", []),
    ],
)
def test_assertion_parsing(line, expected):
    assert load_guard().asserted_values(line) == expected


def test_ladders_are_read_from_the_partials_not_hardcoded():
    guard = load_guard()
    core = REPO_ROOT / "plugins/arckit-claude"
    fr = guard.ladder_for(core, "document-control-fr.md")
    assert fr is not None and "Diffusion Restreinte" in fr
    assert "OFFICIAL-SENSITIVE" not in fr
    # Enumerating schemes by hand is the defect #788 fixed in the checklist, where
    # a list of three had drifted from a registry of six. Check the code, not the
    # docstring, which necessarily quotes the values to explain itself.
    code = GUARD.read_text().split('"""', 2)[-1]
    for value in ("Diffusion Restreinte", "Eingeschränkt", "Protected B", "Ongerubriceerd"):
        assert value not in code, f"{value!r} hardcoded — ladder values must stay derived"


def test_registry_parses_all_hard_routing_regimes():
    guard = load_guard()
    regime_of, partial_of, fallthrough = guard.load_registry(
        REPO_ROOT / "plugins/arckit-claude/config/doc-types.mjs"
    )
    routing = {r for r in partial_of if r not in fallthrough}
    # US joined the hard-routing set in #746, when document-control-us.md landed
    # and the 10 federal civilian doc-types stopped rendering the UK ladder.
    assert routing == {"AT", "AU", "CA", "FR", "NL", "UAE", "US"}
    assert regime_of["IRN"] == "FR" and regime_of["ATDSG"] == "AT"
    assert guard.primary_regime(partial_of["UK"]) == "UK"


# --- regression lock on the seven -----------------------------------------------


@pytest.mark.parametrize("code,expected", sorted(PR788_SECTIONS.items()))
def test_pr788_sections_assert_their_own_ladder(code, expected):
    body = section_body(CORE_CHECKLIST.read_text(encoding="utf-8"), code)
    assert body, f"### {code} missing from the core checklist"
    assert expected in body, f"### {code} no longer asserts {expected}"
    assert "OFFICIAL-SENSITIVE" not in body, f"### {code} has regained a UK assertion"


def test_every_plugin_copy_is_checked():
    # Resolution is per plugin: ${CLAUDE_PLUGIN_ROOT} has no cross-plugin
    # fallback, so an overlay reads its own copy. Checking core alone would pass
    # a drifted overlay.
    guard = load_guard()
    with_checklist = [
        p for p in guard.plugin_dirs() if (p / guard.CHECKLIST_REL).is_file()
    ]
    assert len(with_checklist) >= 15, f"only {len(with_checklist)} checklists found"


def test_generated_mirror_is_excluded():
    guard = load_guard()
    assert guard.MIRROR_DIR == REPO_ROOT / "plugins/arckit-claude/plugins"
    assert guard.MIRROR_DIR not in guard.plugin_dirs()
