"""A closed question a command cannot answer for the user goes to the question selector.

Until November 2026 some two dozen commands asked "which project?" or "which document?" in plain text, and three
asked a two-way question the same way. In Claude Code a typed reply to a closed question is slower than a choice
and can come back in a form the command has to ask about again. Those questions now go to the question tool.

Two kinds are told apart, as references/interview-pattern.md does:

- a choice with no safe default (which of several projects, which of several documents) lists its candidates,
  offers them with none marked as recommended, and stops without writing anything when no answer comes back;
- a question with a safe default marks it (Recommended) and takes it when no answer comes back.

Other assistants have no such tool. scripts/converter.py turns "use the AskUserQuestion tool to ask" into "ask the
user", so the sentence is written to read correctly either way.

The first pass over the commands searched for a handful of phrasings and missed four more ("ask to disambiguate",
"Ask user which project", "ask which one", "which one they mean"). The last test here reads every command for any
of them, so the next command that asks this in plain text fails.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "scripts"))
from converter import neutralise_question_tool  # noqa: E402

POINTER = "${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md"
CORE_PLUGIN = REPO / "plugins" / "arckit-claude"
REFERENCE = CORE_PLUGIN / "references" / "interview-pattern.md"
CORE = CORE_PLUGIN / "commands"
GCLOUD = REPO / "plugins" / "arckit-uk-gcloud" / "commands"
REPO_AUDIT = REPO / "plugins" / "arckit-repo" / "commands" / "repo-audit.md"
ASK = ("then use the AskUserQuestion tool to ask which, offering them as the choices with none marked as recommended (`"
       + POINTER + "`, section 5)")

CORE_CHOOSERS = ["research", "datascout", "grants", "gov-reuse", "tenders", "competitors", "aws-research", "azure-research",
                 "gcp-research", "analyze", "trello", "navigator", "impact"]
CHOOSERS = [CORE / f"{name}.md" for name in CORE_CHOOSERS] + [REPO_AUDIT] + sorted(
    p for p in GCLOUD.glob("*.md") if ASK in p.read_text(encoding="utf-8"))


def all_commands() -> list[Path]:
    """Every plugin's commands. The copies under plugins/arckit-claude/plugins/ are a mirror of these."""
    return sorted(REPO.glob("plugins/arckit-*/commands/*.md"))


def test_the_g_cloud_overlay_is_covered():
    assert len([p for p in CHOOSERS if p.parent == GCLOUD]) == 11


def test_the_reference_sets_out_a_choice_with_no_default():
    text = REFERENCE.read_text(encoding="utf-8")
    section = text[text.index("## 5. A choice only the user can make"):text.index("## 6. What this is not")]
    # More candidates than the tool has options must still all be seen.
    assert "List every candidate first, in a message of its own" in section
    assert "with **none** marked (Recommended)" in section
    # Neither the default for a skipped question nor the default for a run with nobody in it applies.
    assert "Rules 3 and 4 do not apply to it." in section
    assert "stop without writing anything and leave the list as the result" in section
    assert "Never pick the most recent, the first or the largest." in section
    rule_4 = text[text.index("## 4. Non-interactive runs never block"):text.index("## 5.")]
    assert "The one question that has no default is a choice under section 5: there the run stops and lists the candidates." in rule_4


@pytest.mark.parametrize("path", CHOOSERS, ids=lambda p: f"{p.parent.parent.name}/{p.stem}")
def test_a_choice_between_candidates_is_listed_offered_and_never_guessed(path):
    text = path.read_text(encoding="utf-8")
    assert ASK in text, path.name
    at = text.index(ASK)
    # The candidates are listed before the question, and the command stops when nobody answers.
    assert re.search(r"\blist\b", text[max(0, at - 160):at], re.I), f"{path.name}: the candidates are not listed before the question"
    assert "stop" in text[at + len(ASK):][:120], f"{path.name}: what happens with no answer is not said next to the question"


def test_the_build_harness_does_not_choose_for_its_workers():
    """A worker has nobody to ask and takes defaults; the first option in a list of projects is not a default."""
    text = (CORE_PLUGIN / "skills" / "arckit-build" / "SKILL.md").read_text(encoding="utf-8")
    assert "| A choice between projects or documents (no option marked, section 5 of the reference) | none: see below |" in text
    assert "do not pick one. Stop without writing the artefact and name the" in text


def test_the_enforcement_statement_lists_the_rule():
    text = (CORE_PLUGIN / "docs" / "ENFORCEMENT.md").read_text(encoding="utf-8")
    tier_2 = text[text.index("## Tier 2: Asked of the model"):text.index("## Tier 3")]
    assert "**A choice only the user can make is never guessed.**" in tier_2
    assert "`references/interview-pattern.md` section 5" in tier_2


def test_the_repository_audit_defaults_to_the_audit_that_scores_against_nothing():
    text = REPO_AUDIT.read_text(encoding="utf-8")
    assert 'offering "Run a standalone audit (Recommended)" and "Audit against the project"' in text
    assert "With no answer, run the standalone audit and record that as an assumption in the Audit Scope" in text


@pytest.mark.parametrize("name, default", [("agent-inventory", "Proceed with the agents found (Recommended)"),
                                           ("agent-integration", "Proceed with what exists (Recommended)")])
def test_a_question_with_a_safe_default_marks_it(name, default):
    text = (REPO / "plugins" / "arckit-agent-architecture" / "commands" / f"{name}.md").read_text(encoding="utf-8")
    assert "use the AskUserQuestion tool to ask" in text and default in text
    assert POINTER in text
    assert "list that as an assumption" in text


@pytest.mark.parametrize("path", CHOOSERS, ids=lambda p: f"{p.parent.parent.name}/{p.stem}")
def test_other_assistants_get_the_question_in_plain_words(path):
    """The command's own line, as scripts/converter.py writes it for an assistant with no question tool."""
    for line in path.read_text(encoding="utf-8").splitlines():
        if ASK not in line:
            continue
        plain = neutralise_question_tool(line)
        assert "AskUserQuestion" not in plain
        assert "then ask the user which, offering them as the choices with none marked as recommended" in plain, plain[:200]


# A choice of project or document asked without the tool, in the wordings found so far.
PLAIN_TEXT_CHOICE = re.compile(
    r"ask (?:the )?user which (?:project|one|document)\b"
    r"|ask (?:the user )?to disambiguate"
    r"|ask which (?:one|project|document)\b"
    r"|which (?:one|project) they mean"
    r"|ask which\)", re.I)
# Commands that ask this for a reason the selector does not serve, with the reason.
ASKED_IN_PLAIN_TEXT = {
    # The food safety commands say "ask which" with their own wording for a runtime that can offer
    # choices; tests/plugin/test_uk_food_commands.py holds them to it.
    "arckit-uk-food",
}


def test_no_command_asks_which_project_or_document_in_plain_text():
    found = []
    for path in all_commands():
        if path.parent.parent.name in ASKED_IN_PLAIN_TEXT:
            continue
        for number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if PLAIN_TEXT_CHOICE.search(line) and "AskUserQuestion" not in line:
                found.append(f"{path.parent.parent.name}/{path.name}:{number}")
    assert not found, ("these lines ask which project or document was meant without the question tool: " + ", ".join(found)
                       + ". Use the sentence in this file's ASK, or add the plugin to ASKED_IN_PLAIN_TEXT with the reason.")
