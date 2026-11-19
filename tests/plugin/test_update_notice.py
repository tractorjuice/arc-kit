"""The session-start update notice says how to get updates without asking.

Claude Code leaves automatic updates off for any marketplace that isn't Anthropic's own, and a marketplace cannot
turn them on for the people who add it. Until November 2026 the notice said only that auto-update was off, so
"nothing changes until you update", and every release reached a user when they next ran a command by hand. The
notice is the one message a user with auto-update off is certain to see, so it now says where the switch is.

The hook is a script with no exports, so this reads its source, as tests/plugin/hooks-fail-closed.test.mjs does.
"""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
HOOK = REPO / "plugins" / "arckit-claude" / "hooks" / "version-check.mjs"


def notice() -> str:
    """The update notice as the hook builds it: the string pieces of the one warnings.push that names an update."""
    source = HOOK.read_text(encoding="utf-8")
    start = source.index("`## ArcKit Update Available")
    block = source[start:source.index(");", start)]
    return "".join(re.findall(r"`((?:[^`\\]|\\.)*)`", block)).replace("\\`", "`").replace("\\n", "\n")


def test_the_notice_says_where_to_turn_auto_update_on():
    text = notice()
    assert ("To get each release without doing anything, turn on auto-update: run `/plugin`, open the Marketplaces tab, "
            "select arckit-claude and turn auto-update on.") in text
    # Why it is not on already, and what to expect once it is.
    assert "Claude Code leaves it off for any marketplace that isn't Anthropic's own" in text
    assert "If it is on already, Claude Code fetches this update in the background and loads it on your next launch." in text


def test_the_notice_still_gives_the_manual_update_and_the_pin():
    text = notice()
    assert "To update now, run `claude plugin update arckit@arckit-claude`" in text
    assert "then `/reload-plugins`" in text
    assert "can pin a release instead, with `/plugin marketplace add tractorjuice/arckit-claude#v${latestVersion}`" in text
    assert "Release notes: https://github.com/${REPO}/releases/tag/${latestTag}" in text


def test_the_notice_no_longer_stops_at_auto_update_being_off():
    assert "so nothing changes until you update;" not in HOOK.read_text(encoding="utf-8")


def test_the_readme_gives_the_same_steps():
    """The README and the notice name the same place, so a reader of either finds the switch."""
    readme = (REPO / "README.md").read_text(encoding="utf-8")
    assert "Run `/plugin`, open the **Marketplaces** tab, select `arckit-claude` and turn auto-update on." in readme
