"""A closed question a command cannot answer for the user goes to the question selector.

Until November 2026 eleven commands asked "which project?" or "which document?" in plain text, and three asked a
two-way question the same way. In Claude Code a typed reply to a closed question is slower than a choice and can
come back in a form the command has to ask about again. Those questions now go to the question tool.

Two kinds are told apart, as references/interview-pattern.md does:

- a choice with no safe default (which of several projects, which of several documents, whether to score a
  codebase against a project that may describe another system) offers its candidates with none marked
  (Recommended), and stops with the list when no answer comes back;
- a question with a safe default marks it (Recommended) and takes it when no answer comes back.

Other assistants have no such tool. scripts/converter.py turns "use the AskUserQuestion tool to ask" into "ask the
user", so the same sentence reads correctly there.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))
from converter import neutralise_question_tool  # noqa: E402

POINTER = "${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md"
REFERENCE = REPO / "plugins" / "arckit-claude" / "references" / "interview-pattern.md"
CORE = REPO / "plugins" / "arckit-claude" / "commands"

# Commands that ask which of several candidates was meant, and what the candidates are.
WHICH = {
    CORE / "competitors.md": "the matching projects",
    CORE / "datascout.md": "the matching projects",
    CORE / "gov-reuse.md": "the matching projects",
    CORE / "grants.md": "the matching projects",
    CORE / "research.md": "the matching projects",
    CORE / "tenders.md": "the matching projects",
    CORE / "analyze.md": "the projects",
    CORE / "trello.md": "the projects",
    CORE / "navigator.md": "the projects",
    CORE / "impact.md": "the matching documents",
    REPO / "plugins" / "arckit-repo" / "commands" / "repo-audit.md": "the projects",
}
# What each said before, so the plain-text form does not come back beside the new one.
OLD = [
    "ask the user to disambiguate before proceeding",
    "(if multiple, ask which)",
    "- If multiple projects, ask which one",
    "you should ask the user which project they meant",
    "ask the user to specify which one to analyse",
    "ask which project the audit belongs to",
]


def test_the_reference_sets_out_a_choice_with_no_default():
    text = REFERENCE.read_text(encoding="utf-8")
    assert "## 5. A choice only the user can make" in text
    assert "**none** marked (Recommended)" in text
    assert "Rule 3 does not apply to it." in text
    assert "stop and list the candidates" in text
    assert "Never pick the most recent, the first or the largest." in text
    # The section that says what the pattern is not keeps its place at the end.
    assert text.index("## 5. A choice only the user can make") < text.index("## 6. What this is not")


@pytest.mark.parametrize("path", sorted(WHICH), ids=lambda p: f"{p.parent.parent.name}/{p.stem}")
def test_a_choice_between_candidates_goes_to_the_selector_with_none_recommended(path):
    text = path.read_text(encoding="utf-8")
    sentence = (f"use the AskUserQuestion tool to ask which, with {WHICH[path]} as its options and none marked (Recommended), "
                f"as `{POINTER}` section 5 sets out")
    assert sentence in text, path.name
    for old in OLD:
        assert old not in text, f"{path.name} still says {old!r}"
    # With no answer the command stops; it never picks one.
    after = text[text.index(sentence) + len(sentence):][:160]
    assert "stop" in after, f"{path.name}: what happens with no answer is not said next to the question"


def test_the_repository_audit_asks_before_scoring_against_a_doubtful_project():
    text = (REPO / "plugins" / "arckit-repo" / "commands" / "repo-audit.md").read_text(encoding="utf-8")
    assert "with those two as its options and neither marked (Recommended)" in text
    # No answer must not produce verdicts against requirements for another system.
    assert "With no answer, run the standalone audit and say why in the Audit Scope" in text


@pytest.mark.parametrize("name, default", [("agent-inventory", "Proceed with the agents found (Recommended)"),
                                           ("agent-integration", "Proceed with what exists (Recommended)")])
def test_a_question_with_a_safe_default_marks_it(name, default):
    text = (REPO / "plugins" / "arckit-agent-architecture" / "commands" / f"{name}.md").read_text(encoding="utf-8")
    assert "use the AskUserQuestion tool to ask" in text and default in text
    assert POINTER in text
    assert "list that as an assumption" in text


@pytest.mark.parametrize("path", sorted(WHICH), ids=lambda p: f"{p.parent.parent.name}/{p.stem}")
def test_other_assistants_get_the_question_in_plain_words(path):
    """The generated copies name no tool: the sentence becomes "ask the user which, with ... as its options"."""
    source = f"use the AskUserQuestion tool to ask which, with {WHICH[path]} as its options"
    assert source in path.read_text(encoding="utf-8")
    plain = neutralise_question_tool("If multiple match, " + source + ".")
    assert plain == f"If multiple match, ask the user which, with {WHICH[path]} as its options.", plain
    assert "AskUserQuestion" not in plain
