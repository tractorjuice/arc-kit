"""No instruction sends a reader to the old `arc-kit` marketplace.

Two marketplaces publish ArcKit's Claude Code plugins. `tractorjuice/arckit-claude` is the
one to install from. The root `.claude-plugin/marketplace.json` in this repo, named
`arc-kit`, is kept so installs made before June 2026 keep working (docs/RELEASING.md).
Both list the same plugins under the same names, so someone who adds both has every plugin
registered twice (#680).

The README moved to `arckit-claude` in June 2026. The CLI's Claude redirect message and
CONTRIBUTING.md still named the old marketplace five months later, because nothing checked.

This test reads every tracked file for the three ways an instruction can name the old
marketplace: the `marketplace add` command, a plugin id such as `arckit@arc-kit`, and the
`"repo": "tractorjuice/arc-kit"` source of a settings entry. It does not read prose, so
"add the arc-kit marketplace" in a sentence still needs a reviewer.

A page that explains how to move off the old marketplace has to name it. Add that page to
EXEMPT_FILES with the reason.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path, PurePosixPath

import pytest

REPO = Path(__file__).resolve().parents[2]

# The old repo after `marketplace add`: bare, quoted, as a URL or as an SSH address. The
# lookahead keeps `tractorjuice/arc-kit-private` and similar repo names out.
OLD_MARKETPLACE_ADD = re.compile(
    r"""marketplace\s+(?:add|update)\s+["']?(?:(?:https?://|git@)?github\.com[:/])?tractorjuice/arc-kit(?![\w-])"""
)
# A plugin id from the old marketplace, such as `arckit@arc-kit` or `arckit-uae@arc-kit`.
OLD_PLUGIN_ID = re.compile(r"\barckit[\w-]*@arc-kit(?![\w-])")
# The source of an `extraKnownMarketplaces` entry, in JSON or as a Python dict.
OLD_SETTINGS_SOURCE = re.compile(r"""["']repo["']\s*:\s*["']tractorjuice/arc-kit["']""")

PATTERNS = (OLD_MARKETPLACE_ADD, OLD_PLUGIN_ID, OLD_SETTINGS_SOURCE)

EXEMPT_FILES = {
    # Other people's repo names, descriptions and PR titles, and the page made from them.
    "docs/on-github.json",
    "docs/on-github.html",
    # This file's own examples.
    "tests/plugin/test_marketplace_instructions.py",
}
EXEMPT_FOLDERS = (
    "docs/changelog/",  # the archive of the plugin changelog
    ".arckit/memory/",  # the session log, which records commit subjects
)


def is_exempt(path: str) -> bool:
    """Changelogs and logs record what was true when they were written."""
    return (
        path in EXEMPT_FILES
        or path.startswith(EXEMPT_FOLDERS)
        or PurePosixPath(path).name == "CHANGELOG.md"
    )


def tracked_files() -> list[str]:
    out = subprocess.check_output(["git", "ls-files", "-z"], cwd=REPO)
    return [p for p in out.decode("utf-8").split("\0") if p]


def old_marketplace_mentions(text: str) -> list[str]:
    return [m.group(0) for pattern in PATTERNS for m in pattern.finditer(text)]


def test_no_instruction_names_the_old_marketplace():
    found = []
    scanned = 0
    for path in tracked_files():
        if is_exempt(path):
            continue
        try:
            text = (REPO / path).read_text(encoding="utf-8")
        except (UnicodeDecodeError, OSError):
            continue  # a binary file, a file deleted in the working tree, or a submodule
        scanned += 1
        for line_number, line in enumerate(text.splitlines(), start=1):
            for mention in old_marketplace_mentions(line):
                found.append(f"{path}:{line_number}: {mention}")
    assert scanned > 1000, f"only {scanned} files read, so the listing of tracked files is wrong"
    assert not found, (
        "these lines send readers to the old `arc-kit` marketplace; use `tractorjuice/arckit-claude` "
        "and `<plugin>@arckit-claude`:\n" + "\n".join(found)
    )


@pytest.mark.parametrize(
    "line",
    [
        "/plugin marketplace add tractorjuice/arc-kit",
        "claude plugin marketplace add https://github.com/tractorjuice/arc-kit",
        "claude plugin marketplace add git@github.com:tractorjuice/arc-kit.git",
        "claude plugin marketplace add github.com/tractorjuice/arc-kit",
        'claude plugin marketplace add "tractorjuice/arc-kit"',
        "claude plugin marketplace update tractorjuice/arc-kit.",
        '"arckit@arc-kit": true',
        "claude plugin install arckit-uae@arc-kit",
        "Enable `arckit-uk-nhs@arc-kit`.Then restart.",
        '"repo": "tractorjuice/arc-kit"',
        "'repo': 'tractorjuice/arc-kit',",
    ],
)
def test_the_check_catches_the_old_forms(line):
    assert old_marketplace_mentions(line), line


@pytest.mark.parametrize(
    "line",
    [
        "/plugin marketplace add tractorjuice/arckit-claude",
        "claude plugin install arckit@arckit-claude",
        '"repo": "tractorjuice/arckit-claude"',
        "/plugin marketplace add tractorjuice/arc-kit-private",
        "/plugin marketplace remove arc-kit",
        "git clone https://github.com/tractorjuice/arc-kit",
        "The older `tractorjuice/arc-kit` marketplace remains available for compatibility.",
        "claude --plugin-dir /path/to/arc-kit/plugins/arckit-claude",
    ],
)
def test_the_check_leaves_the_new_forms_and_plain_repo_links_alone(line):
    assert not old_marketplace_mentions(line), line


@pytest.mark.parametrize(
    ("path", "exempt"),
    [
        ("CHANGELOG.md", True),
        ("plugins/arckit-claude/CHANGELOG.md", True),
        ("docs/changelog/arckit-plugin-archive.md", True),
        ("docs/on-github.html", True),
        (".arckit/memory/sessions.md", True),
        ("CHANGELOG.md.orig", False),
        ("docs/on-github.json.bak", False),
        ("README.md", False),
        ("docs/articles/2026-11-12-example.md", False),
        ("src/arckit_cli/__init__.py", False),
    ],
)
def test_only_records_are_exempt(path, exempt):
    assert is_exempt(path) is exempt
