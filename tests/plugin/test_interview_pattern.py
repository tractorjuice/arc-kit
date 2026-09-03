"""Every command that interviews the user follows references/interview-pattern.md.

The pattern is one message, prefilled, with (Recommended) defaults standing in
for answers. Ten commands used to carry a contradictory three-line boilerplate
("ask the most important question first", "maximum 2 rounds") beside a
"single call" instruction; this test keeps them on the shared contract.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
PLUGIN = REPO_ROOT / "plugins" / "arckit-claude"
REFERENCE = PLUGIN / "references" / "interview-pattern.md"
POINTER = "${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md"
INTERVIEWING = sorted(p for p in (PLUGIN / "commands").glob("*.md") if "AskUserQuestion" in p.read_text(encoding="utf-8"))


def test_reference_exists_and_states_the_five_rules():
    text = REFERENCE.read_text(encoding="utf-8")
    for heading in ["## 1. Prefill before asking", "## 2. Ask everything in one call",
                    "## 3. A skipped question takes its default", "## 4. Non-interactive runs never block"]:
        assert heading in text, f"interview-pattern.md lost section {heading!r}"


def test_at_least_the_known_interviewing_commands_are_covered():
    names = {p.stem for p in INTERVIEWING}
    assert {"adr", "backlog", "diagram", "plan", "dfd", "roadmap", "dpia", "sow",
            "presentation", "sobc", "template-builder"} <= names


@pytest.mark.parametrize("path", INTERVIEWING, ids=lambda p: p.stem)
def test_interviewing_command_points_at_the_pattern(path):
    text = path.read_text(encoding="utf-8")
    assert POINTER in text, f"{path.name} asks questions but does not reference {POINTER}"


@pytest.mark.parametrize("path", INTERVIEWING, ids=lambda p: p.stem)
def test_no_multi_round_boilerplate(path):
    text = path.read_text(encoding="utf-8")
    assert not re.search(r"Maximum \d+ rounds", text), f"{path.name} still allows a second round"
    assert "Ask the most important question first" not in text, f"{path.name} still sequences questions"


@pytest.mark.parametrize("path", INTERVIEWING, ids=lambda p: p.stem)
def test_every_question_marks_its_default(path):
    """A single-select `**Question N**` block offers exactly one (Recommended) option, the default the
    pattern falls back to; a multi-select block marks at most one (none means an empty default)."""
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"\n\s*\*\*Question \d+\*\*", text)[1:]
    for i, block in enumerate(blocks, 1):
        block = block.split("\n\n**Question", 1)[0]
        block = re.split(r"\n\s*(?:Apply the user|##|\d+\. \*\*)", block)[0]
        multi = "multiSelect: true" in block.splitlines()[0]
        n = len(re.findall(r"\(Recommended\)", block))
        if multi:
            assert n <= 1, f"{path.name} Question {i}: a multi-select question marks at most one (Recommended), found {n}"
        else:
            assert n == 1, f"{path.name} Question {i}: expected exactly one (Recommended) option, found {n}"


def test_build_harness_defers_to_the_pattern():
    text = (PLUGIN / "skills" / "arckit-build" / "SKILL.md").read_text(encoding="utf-8")
    assert POINTER in text
