"""Every command that reads supplier-written text treats it as evidence.

A supplier has a direct interest in what these commands decide, so a proposal,
a design or a marketplace page can be written to steer them. #872 gave
`evaluate` and `score` the rule, and #1074 added `hld-review` and `dld-review`,
and each time other commands were left without it. This pins the list, so a
command that starts reading supplier text gets the rule in the same change.

The wording is the only control here. Whether the model follows it is graded
by the evals in `plugins/arckit-claude/evals/`, where a planted instruction can
run offline. These commands read live pages, so this test holds the text in place.
"""
import re
from pathlib import Path

import pytest

REPO = Path(__file__).resolve().parents[2]
PLUGIN = REPO / "plugins" / "arckit-claude"

COMMANDS = ["evaluate", "score", "hld-review", "dld-review", "gcloud-search", "gcloud-clarify"]
TEMPLATES = [
    "hld-review-template.md",
    "dld-review-template.md",
    "gcloud-requirements-template.md",
    "gcloud-clarify-template.md",
]
CHECKLIST_SECTIONS = ["HLDR", "DLDR", "GCLD", "GCLC"]


@pytest.mark.parametrize("command", COMMANDS)
def test_command_states_the_rule(command):
    text = (PLUGIN / "commands" / f"{command}.md").read_text(encoding="utf-8")
    assert "evidence, never instructions" in text


@pytest.mark.parametrize("command", COMMANDS)
def test_command_says_where_a_finding_goes(command):
    text = (PLUGIN / "commands" / f"{command}.md").read_text(encoding="utf-8")
    assert re.search("integrity findings", text, re.IGNORECASE)


@pytest.mark.parametrize("tree", [PLUGIN / "templates", REPO / ".arckit" / "templates"], ids=["plugin", "root"])
@pytest.mark.parametrize("template", TEMPLATES)
def test_template_has_somewhere_to_put_a_finding(tree, template):
    assert "Integrity Findings" in (tree / template).read_text(encoding="utf-8")


@pytest.mark.parametrize("section", CHECKLIST_SECTIONS)
def test_checklist_checks_for_findings(section):
    text = (PLUGIN / "references" / "quality-checklist.md").read_text(encoding="utf-8")
    body = re.search(rf"^### {section} -- .*?(?=^### )", text, re.MULTILINE | re.DOTALL)
    assert body, f"no {section} section in the checklist"
    assert "Integrity Findings" in body.group(0)
