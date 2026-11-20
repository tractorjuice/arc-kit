"""Every settings entry ArcKit ships or documents turns automatic updates on.

Claude Code leaves automatic updates off for a marketplace that isn't Anthropic's own, and
`marketplace.json` has no field to turn them on: its validator reports `autoUpdate` there as
an unknown field that is ignored at load time. The one place the choice can be written down
is the `autoUpdate` value of the marketplace's `extraKnownMarketplaces` entry in a settings
file. ArcKit publishes that entry in this repo's own settings, in the test-repo template and
in several guides, and until November 2026 half of them left the line out, so a team that
copied one stayed on the release it installed.

An entry pinned to a branch or tag with `ref` is left alone: it is there to hold a version.
"""

from __future__ import annotations

import re

import pytest

from test_marketplace_instructions import REPO, is_exempt, tracked_files

ENTRY_KEY = re.compile(r"""(?:["']|&quot;)extraKnownMarketplaces(?:["']|&quot;)\s*:""")
ARCKIT_SOURCE = re.compile(r"""(?:["']|&quot;)repo(?:["']|&quot;)\s*:\s*(?:["']|&quot;)tractorjuice/arckit-claude(?:["']|&quot;)""")
PINNED = re.compile(r"""(?:["']|&quot;)ref(?:["']|&quot;)\s*:""")
AUTO_UPDATE_ON = re.compile(r"""(?:["']|&quot;)autoUpdate(?:["']|&quot;)\s*:\s*(?:true|True)\b""")
# A pretty-printed entry closes within nine lines of its key: name, source (four lines),
# autoUpdate, two closing braces, and one line to spare.
ENTRY_REACH = 10

EXEMPT = {
    # This file's and its neighbour's own examples.
    "tests/plugin/test_marketplace_auto_update.py",
    "tests/plugin/test_marketplace_instructions.py",
}


def entries_without_auto_update(text: str) -> list[int]:
    """Line numbers of ArcKit marketplace entries that neither pin a version nor update themselves."""
    lines = text.splitlines()
    found = []
    for index, line in enumerate(lines):
        if not ENTRY_KEY.search(line):
            continue
        entry = "\n".join(lines[index : index + ENTRY_REACH])
        if ARCKIT_SOURCE.search(entry) and not PINNED.search(entry) and not AUTO_UPDATE_ON.search(entry):
            found.append(index + 1)
    return found


def test_every_arckit_marketplace_entry_turns_auto_update_on():
    missing = []
    checked = 0
    for path in tracked_files():
        if is_exempt(path) or path in EXEMPT:
            continue
        try:
            text = (REPO / path).read_text(encoding="utf-8")
        except (UnicodeDecodeError, FileNotFoundError, IsADirectoryError):
            continue
        if "extraKnownMarketplaces" not in text:
            continue
        checked += 1
        missing += [f"{path}:{number}" for number in entries_without_auto_update(text)]
    assert checked >= 5, "the check found too few files to mean anything"
    assert not missing, (
        "these `extraKnownMarketplaces` entries for tractorjuice/arckit-claude leave automatic updates off: "
        + ", ".join(missing)
        + '. Add `"autoUpdate": true` beside `source`, or pin the entry with `ref`.'
    )


OFF = """{
  "extraKnownMarketplaces": {
    "arckit-claude": {
      "source": {
        "source": "github",
        "repo": "tractorjuice/arckit-claude"
      }
    }
  }
}"""
ON = OFF.replace('      }\n    }\n  }', '      },\n      "autoUpdate": true\n    }\n  }')
PINNED_ENTRY = OFF.replace('"repo": "tractorjuice/arckit-claude"', '"repo": "tractorjuice/arckit-claude",\n        "ref": "v6.23.0"')
SET_TO_FALSE = ON.replace("true", "false")
AS_PYTHON = OFF.replace('"repo": "tractorjuice/arckit-claude"\n      }', '"repo": "tractorjuice/arckit-claude",\n      },\n      "autoUpdate": True,')
IN_A_PAGE = ON.replace('"', "&quot;")
ANOTHER_MARKETPLACE = OFF.replace("tractorjuice/arckit-claude", "example/other-marketplace")


@pytest.mark.parametrize("text", [OFF, SET_TO_FALSE, OFF.replace('"', "&quot;")], ids=["left out", "set to false", "left out of a page"])
def test_an_entry_that_leaves_it_off_is_caught(text):
    assert entries_without_auto_update(text) == [2]


@pytest.mark.parametrize(
    "text", [ON, PINNED_ENTRY, AS_PYTHON, IN_A_PAGE, ANOTHER_MARKETPLACE], ids=["on", "pinned", "python dict", "html page", "another marketplace"]
)
def test_an_entry_that_is_on_pinned_or_someone_elses_is_left_alone(text):
    assert entries_without_auto_update(text) == []
