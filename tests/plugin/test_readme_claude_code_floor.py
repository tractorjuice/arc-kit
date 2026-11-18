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
# "It needs Claude Code 2.1.319 or later", "ArcKit needs Claude Code **v2.1.319 or later**",
# "**Claude Code** v2.1.319 or later (recommended minimum)".
STATED = re.compile(r"needs Claude Code \**v?(\d+\.\d+\.\d+)|Claude Code\** v?(\d+\.\d+\.\d+) or later \(recommended minimum\)")


def stated_floors(path: Path) -> list[str]:
    return [a or b for a, b in STATED.findall(path.read_text(encoding="utf-8"))]


def test_the_pattern_finds_the_floors_it_must_hold():
    """Core's README and the overlays with an install line all state one; a test that matched none would pass."""
    stating = {p.parent.name for p in READMES if stated_floors(p)}
    assert {"arckit-claude", "arckit-uk-food", "arckit-uk-legacy", "arckit-uk-nhs"} <= stating, stating


@pytest.mark.parametrize("readme", READMES, ids=lambda p: p.parent.name)
def test_a_stated_floor_is_cores(readme):
    wrong = [v for v in stated_floors(readme) if v != FLOOR]
    assert not wrong, f"{readme.relative_to(REPO_ROOT)} states Claude Code {wrong}; core's floor is {FLOOR}"
