"""The rules that turn /arckit:research evidence into a buy-or-build verdict.

Applying the rubric to real reader output showed three faults: every product
was scored against the whole project's capability list, a product that did
more than asked lost marks, and the verdict rules left some categories with
no answer. These checks keep those fixes in place.
"""

import re
from pathlib import Path

import pytest
import yaml

PLUGIN = Path(__file__).resolve().parents[2] / "plugins" / "arckit-claude"
COMMAND = (PLUGIN / "commands" / "research.md").read_text(encoding="utf-8")
RUBRICS = ["research-generic.yaml", "research-uk-gov.yaml"]


def step(number):
    match = re.search(rf"^### Step {number}:.*?(?=^### Step {number + 1}:)", COMMAND, flags=re.M | re.S)
    assert match, f"Step {number} not found"
    return match.group(0)


@pytest.mark.parametrize("name", RUBRICS)
def test_requirements_fit_is_coverage_of_the_category(name):
    rubric = yaml.safe_load((PLUGIN / "schemas" / "scoring-rubrics" / name).read_text(encoding="utf-8"))
    spec = rubric["scoring"]["requirements_fit"]
    assert spec["method"] == "coverage_ratio"
    assert spec["against"] == "category.required_capabilities"


def test_each_category_gets_its_own_capability_list():
    assert "required_capabilities" in step(4)
    assert "category.required_capabilities" in step(7)


def test_verdict_rules_run_in_order_and_end_in_a_catch_all():
    rules = step(8)
    assert "first line that matches" in rules
    verdicts = re.findall(r"^\d+\. \*\*([a-z ]+)\*\*", rules, flags=re.M)
    assert verdicts == ["insufficient evidence", "build", "hybrid", "buy", "no clear winner"]


def test_price_step_passes_numeric_ids_and_keeps_documents_from_the_orchestrator():
    frontmatter = COMMAND.split("---", 2)[1]
    assert "scripts/fetch-gcloud-prices.mjs" in frontmatter
    recovery = step(7).split("### Step 7a:", 1)[1]
    assert "numeric service IDs only" in recovery
    assert "Never open those files yourself" in recovery
    assert "price_documents" in (PLUGIN / "agents" / "arckit-research-reader.md").read_text(encoding="utf-8")
