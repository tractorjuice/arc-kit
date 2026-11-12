"""Every install instruction names the `arckit-claude` marketplace.

Two marketplaces publish ArcKit's Claude Code plugins. `tractorjuice/arckit-claude` is the
one to install from. The root `.claude-plugin/marketplace.json` in this repo, named
`arc-kit`, is kept so installs made before June 2026 keep working (docs/RELEASING.md).
Both list the same plugins under the same names, so someone who adds both has every plugin
registered twice (#680).

The README moved to `arckit-claude` in June 2026. The CLI's Claude redirect message and
CONTRIBUTING.md still named the old marketplace five months later, because nothing checked.
This test fails on any tracked file that tells a reader to add the old marketplace or to
install a plugin from it.
"""

from __future__ import annotations

import re
import subprocess
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]

# `/plugin marketplace add tractorjuice/arc-kit`, with or without the GitHub URL. The
# lookahead keeps `tractorjuice/arc-kit-private` and similar repo names out.
OLD_MARKETPLACE_ADD = re.compile(
    r"marketplace\s+(?:add|update)\s+(?:https://github\.com/)?tractorjuice/arc-kit(?![\w-])"
)
# A plugin id from the old marketplace, such as `arckit@arc-kit` or `arckit-uae@arc-kit`.
# The lookahead keeps an email address at an `arc-kit.` domain out.
OLD_PLUGIN_ID = re.compile(r"\barckit[\w-]*@arc-kit(?![\w-]|\.\w)")

# Records of what was true when they were written, and data about other people's repos.
HISTORY = (
    "CHANGELOG.md",
    "docs/changelog/",
    "docs/on-github.json",
    ".arckit/memory/",
)
THIS_TEST = "tests/plugin/test_marketplace_instructions.py"


def is_history(path: str) -> bool:
    return path == THIS_TEST or path.endswith("/CHANGELOG.md") or path.startswith(HISTORY)


def tracked_files() -> list[str]:
    try:
        out = subprocess.check_output(["git", "ls-files", "-z"], cwd=REPO, text=True)
    except (OSError, subprocess.CalledProcessError):
        pytest.skip("not a git checkout, so the tracked files cannot be listed")
    return [p for p in out.split("\0") if p]


def old_marketplace_mentions(text: str) -> list[str]:
    return [m.group(0) for pattern in (OLD_MARKETPLACE_ADD, OLD_PLUGIN_ID) for m in pattern.finditer(text)]


def test_no_instruction_names_the_old_marketplace():
    found = []
    for path in tracked_files():
        if is_history(path):
            continue
        try:
            text = (REPO / path).read_text(encoding="utf-8")
        except (UnicodeDecodeError, FileNotFoundError, IsADirectoryError):
            continue  # a binary file, a file deleted in the working tree, or a submodule
        for line_number, line in enumerate(text.splitlines(), start=1):
            for mention in old_marketplace_mentions(line):
                found.append(f"{path}:{line_number}: {mention}")
    assert not found, (
        "these lines send readers to the old `arc-kit` marketplace; use `tractorjuice/arckit-claude` "
        "and `<plugin>@arckit-claude`:\n" + "\n".join(found)
    )


@pytest.mark.parametrize(
    "line",
    [
        "/plugin marketplace add tractorjuice/arc-kit",
        "claude plugin marketplace add https://github.com/tractorjuice/arc-kit",
        "claude plugin marketplace update tractorjuice/arc-kit.",
        '"arckit@arc-kit": true',
        "claude plugin install arckit-uae@arc-kit",
        "Enable `arckit-uk-nhs@arc-kit`.",
    ],
)
def test_the_check_catches_the_old_forms(line):
    assert old_marketplace_mentions(line), line


@pytest.mark.parametrize(
    "line",
    [
        "/plugin marketplace add tractorjuice/arckit-claude",
        "claude plugin install arckit@arckit-claude",
        "/plugin marketplace add tractorjuice/arc-kit-private",
        "git clone https://github.com/tractorjuice/arc-kit",
        "The older `tractorjuice/arc-kit` marketplace remains available for compatibility.",
        "claude --plugin-dir /path/to/arc-kit/plugins/arckit-claude",
    ],
)
def test_the_check_leaves_the_new_forms_and_plain_repo_links_alone(line):
    assert not old_marketplace_mentions(line), line


def test_the_cli_sends_claude_code_users_to_the_new_marketplace():
    """`arckit init` prints this twice: in the assistant menu and for `--ai claude`."""
    source = (REPO / "src" / "arckit_cli" / "__init__.py").read_text(encoding="utf-8")
    assert source.count("/plugin marketplace add tractorjuice/arckit-claude") == 2
