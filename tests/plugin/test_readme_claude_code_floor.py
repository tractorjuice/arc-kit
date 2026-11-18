"""Every plugin README that states a Claude Code floor states core's current one.

Every overlay needs the core plugin, and core's hooks/version-check.mjs warns below
MIN_CLAUDE_CODE_VERSION. A README that names an older version tells a reader the overlay works
where it does not. Eleven overlay READMEs said "It needs Claude Code 2.1.275 or later" (the release
the one-step `--marketplace` install line needs) for days after core's floor moved to 2.1.319.
The copies under plugins/arckit-claude/plugins/ are kept identical to these by
scripts/sync-claude-plugin-layout.py.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
VERSION_CHECK = REPO_ROOT / "plugins" / "arckit-claude" / "hooks" / "version-check.mjs"
FLOOR = re.search(r"MIN_CLAUDE_CODE_VERSION = '([\d.]+)'", VERSION_CHECK.read_text(encoding="utf-8")).group(1)
READMES = sorted((REPO_ROOT / "plugins").glob("*/README.md"))
# A floor is stated with a requirement word next to "Claude Code" and a version: "needs" or "requires"
# Claude Code X, "minimum" or "at least" Claude Code X, or Claude Code X "or later" or "or newer", bold
# or not, with or without a "v". A version beside Claude Code with none of these ("On Claude Code
# v2.1.143+, ...", "(Claude Code v2.1.207+)", a dated "**v2.1.234** stops ..." line) is a note about a
# feature, not a floor, and a version beside another tool's name is not Claude Code's.
CLAUDE_CODE = r"\**Claude Code\**"
VERSION = r"\**v?(\d+\.\d+\.\d+)"
STATED = re.compile(
    rf"\b(?:needs?|requires?|requiring)\s+(?:at least\s+)?{CLAUDE_CODE}\s+{VERSION}"
    rf"|\b(?:minimum|at least)\s+{CLAUDE_CODE}(?:\s+version)?:?\s+{VERSION}"
    rf"|{CLAUDE_CODE}\s+{VERSION}\**\s+or\s+(?:later|newer)",
    re.IGNORECASE)


def stated_floors_in(text: str) -> list[str]:
    return [next(v for v in groups if v) for groups in STATED.findall(text)]


def stated_floors(path: Path) -> list[str]:
    return stated_floors_in(path.read_text(encoding="utf-8"))


@pytest.mark.parametrize("sentence", [
    "It needs Claude Code 2.1.300 or later.",
    "ArcKit needs Claude Code **v2.1.300 or later** (see Prerequisites below).",
    "- **Claude Code** v2.1.300 or later (recommended minimum)",
    "This overlay requires Claude Code 2.1.300.",
    "Requires **Claude Code** v2.1.300+.",
    "Minimum Claude Code version: 2.1.300",
    "You need at least Claude Code 2.1.300.",
    "Use Claude Code 2.1.300 or newer.",
])
def test_the_pattern_reads_a_floor_however_it_is_put(sentence):
    assert stated_floors_in(sentence) == ["2.1.300"], sentence


@pytest.mark.parametrize("sentence", [
    "On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse while the overlay is enabled.",
    "> - **v2.1.234** stops Claude Code's MCP diagnostics printing resolved secrets.",
    "The project's `settings.json` is ignored (Claude Code v2.1.207+).",
    "It needs Node 18.0.0 or later.",
    "The extension requires Gemini CLI 0.4.0 or later.",
])
def test_the_pattern_reads_no_floor_in_a_feature_note_a_dated_line_or_another_tool(sentence):
    assert stated_floors_in(sentence) == [], sentence


def test_the_pattern_finds_the_floors_it_must_hold():
    """Core's README and the overlays with an install line all state one; a test that matched none would pass."""
    stating = {p.parent.name for p in READMES if stated_floors(p)}
    assert {"arckit-claude", "arckit-uk-food", "arckit-uk-legacy", "arckit-uk-nhs"} <= stating, stating


@pytest.mark.parametrize("readme", READMES, ids=lambda p: p.parent.name)
def test_a_stated_floor_is_cores(readme):
    wrong = [v for v in stated_floors(readme) if v != FLOOR]
    assert not wrong, f"{readme.relative_to(REPO_ROOT)} states Claude Code {wrong}; core's floor is {FLOOR}"
