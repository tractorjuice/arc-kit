"""/arckit:research reports evidence; other commands decide.

/arckit:wardley decides how to source each capability, from how evolved it is.
/arckit:sobc appraises value for money, /arckit:evaluate and /arckit:score score
suppliers, and /arckit:adr records the decision. These checks stop research
growing a score, ranking or verdict again, and keep the fixes it still needs:
coverage measured per category, and supplier price documents read safely.
"""

import re
from pathlib import Path

PLUGIN = Path(__file__).resolve().parents[2] / "plugins" / "arckit-claude"
COMMAND = (PLUGIN / "commands" / "research.md").read_text(encoding="utf-8")
WRITER = (PLUGIN / "agents" / "arckit-research-writer.md").read_text(encoding="utf-8")
MONOLITH = (PLUGIN / "agents" / "arckit-research.md").read_text(encoding="utf-8")
TEMPLATE = (PLUGIN / "templates" / "research-findings-template.md").read_text(encoding="utf-8")


def step(label):
    match = re.search(rf"^### Step {label}:.*?(?=^### Step |^## )", COMMAND, flags=re.M | re.S)
    assert match, f"Step {label} not found"
    return match.group(0)


def test_no_research_rubric_remains():
    assert not list((PLUGIN / "schemas" / "scoring-rubrics").glob("research-*.yaml"))
    assert "scoring-rubrics" not in COMMAND


def test_command_reports_and_does_not_decide():
    assert "Report, don't decide" in COMMAND
    for owner in ("/arckit:wardley", "/arckit:sobc", "/arckit:evaluate"):
        assert owner in COMMAND
    headings = re.findall(r"^### Step [0-9a-z]+: (.+)$", COMMAND, flags=re.M)
    assert not [h for h in headings if re.search(r"score|decide|verdict|rank", h, re.I)], headings
    assert "recommendation" not in step(11)
    assert "total_score" not in COMMAND


def test_coverage_is_measured_against_each_category():
    assert "required_capabilities" in step(4)
    assert "category's `required_capabilities`" in step(7)


def test_market_evidence_is_for_wardley_and_places_nothing():
    evidence = step(8)
    assert "/arckit:wardley" in evidence
    assert "don't turn them into a stage or a verdict" in evidence


def test_price_step_passes_numeric_ids_and_keeps_documents_from_the_orchestrator():
    frontmatter = COMMAND.split("---", 2)[1]
    assert "scripts/fetch-gcloud-prices.mjs" in frontmatter
    recovery = step("7a")
    assert "numeric service IDs only" in recovery
    assert "Never open those files yourself" in recovery
    assert "price_documents" in (PLUGIN / "agents" / "arckit-research-reader.md").read_text(encoding="utf-8")


def test_writer_template_and_monolith_carry_no_verdict():
    assert '"recommendation"' not in WRITER
    assert "score_breakdown" not in WRITER
    for heading in ("Build vs Buy Recommendation", "Top Recommended Vendors", "Vendor Shortlist", "Preferred Option"):
        assert heading not in TEMPLATE, heading
    assert "Report, don't decide" in MONOLITH
    assert "Build vs Buy Analysis" not in MONOLITH
