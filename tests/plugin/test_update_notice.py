"""The session-start update notice says how to get updates without asking.

Claude Code leaves automatic updates off for any marketplace that isn't Anthropic's own, and a marketplace cannot
turn them on for the people who add it. Until November 2026 the notice said only that auto-update was off, so
"nothing changes until you update", and every release reached a user when they next ran a command by hand. The
notice is the one message a user with auto-update off is certain to see, so it now says where the switch is.

The hook cannot tell whether auto-update is on: the setting can sit in Claude Code's marketplace list or in a user,
repository or managed settings file. So one notice has to be right for every reader: someone with it off, someone
with it on, a team that sets it in a settings file, and a team that has pinned a release on purpose.

The hook is a script with no exports, so this reads its source, as tests/plugin/hooks-fail-closed.test.mjs does.
"""

from __future__ import annotations

import re
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
HOOK = REPO / "plugins" / "arckit-claude" / "hooks" / "version-check.mjs"
# The one warnings.push that names an update, from its first template literal to the line that closes the call.
PUSH = re.compile(r"warnings\.push\(\n(\s*`## ArcKit Update Available.*?)\n\s*\);\n\s*process\.stderr\.write\(`\[ArcKit\] Update available", re.S)
LITERAL = re.compile(r"`((?:[^`\\]|\\.)*)`")


def notice() -> str:
    """The update notice as the hook builds it."""
    found = PUSH.search(HOOK.read_text(encoding="utf-8"))
    assert found, "the update notice is no longer a warnings.push followed by the stderr line"
    lines = found.group(1).split("\n")
    # Every line of the call is one template literal and nothing else, so nothing in a comment can be read as text.
    for line in lines:
        assert re.fullmatch(r"\s*`(?:[^`\\]|\\.)*`(?: \+)?", line), f"not a single template literal: {line.strip()[:60]}"
    return "".join(LITERAL.findall(found.group(1))).replace("\\`", "`").replace("\\n", "\n")


def plain(text: str) -> str:
    """Text without Markdown emphasis or code marks, in lower case, for comparing the README with the notice."""
    return re.sub(r"[`*]", "", text).lower()


def test_the_notice_says_where_to_turn_auto_update_on():
    text = notice()
    assert ("To get each release without doing anything, turn on auto-update: run `/plugin`, open the Marketplaces tab, "
            "select arckit-claude and turn auto-update on.") in text
    assert "Claude Code leaves it off for any marketplace that isn't Anthropic's own" in text


def test_the_notice_is_right_for_someone_who_has_it_on_already():
    """The hook reads arc-kit's release; Claude Code updates from the marketplace repository, which is filled a little
    later. So the notice promises the update once it is there, and names both ways it is then loaded."""
    text = notice()
    assert ("If it is on already, there is nothing to do: once the release reaches the marketplace, Claude Code fetches it "
            "in the background and loads it when you run `/reload-plugins` or next start a session.") in text


def test_the_notice_covers_a_team_that_sets_it_in_a_settings_file():
    assert 'A team can set it for everyone with `"autoUpdate": true` on the marketplace entry in a settings file.' in notice()


def test_the_notice_does_not_move_a_pinned_team_to_the_newest_release():
    """A regulated engagement pins the release it has reviewed. The notice says to leave auto-update off, and its
    example names no version, so following it cannot pin the release the notice is announcing."""
    text = notice()
    assert ("On a regulated engagement, leave auto-update off and pin the release you have reviewed, with "
            "`/plugin marketplace add tractorjuice/arckit-claude#vX.Y.Z`.") in text
    assert "arckit-claude#v${latestVersion}" not in text


def test_the_notice_still_gives_the_manual_update_and_the_release_notes():
    text = notice()
    assert "To update now, run `claude plugin update arckit@arckit-claude`" in text
    assert "then `/reload-plugins`" in text
    assert "Release notes: https://github.com/${REPO}/releases/tag/${latestTag}" in text


def test_the_readme_and_the_notice_give_the_same_steps():
    """The README's sentence, without its emphasis, is in the notice word for word, so a change to one that is not made
    to the other fails here."""
    readme = (REPO / "README.md").read_text(encoding="utf-8")
    sentence = re.search(r"Run `/plugin`, open the \*\*Marketplaces\*\* tab, select `arckit-claude` and turn auto-update on\.", readme)
    assert sentence, "the README no longer says where the auto-update switch is"
    assert plain(sentence.group(0)) in plain(notice())


def test_the_hooks_guide_says_what_the_notice_offers():
    guide = (REPO / "docs" / "guides" / "hooks.md").read_text(encoding="utf-8")
    entry = guide[guide.index("### version-check"):]
    entry = entry[:entry.index("\n## ")]
    assert "how to turn automatic updates on" in entry and "how to pin a release" in entry
    assert "warns when Claude Code is older than the version ArcKit needs" in entry
