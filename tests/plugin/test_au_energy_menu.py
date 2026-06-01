from pathlib import Path
import re

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (REPO_ROOT / path).read_text(encoding="utf-8")


def test_au_energy_source_files_exist_and_use_community_origin():
    expected = {
        "au-aescsf": ("AUAESCSF", "Australian Energy Sector Cyber Security Framework"),
        "au-energy-compliance": ("AUENERGY", "AER ring-fencing"),
    }

    for command, (doc_type, anchor) in expected.items():
        command_text = read(f"arckit-au-energy/commands/{command}.md")
        template_text = read(f"arckit-au-energy/templates/{command}-template.md")

        assert "[COMMUNITY]" in command_text
        assert f"generate-document-id.sh <PROJECT_ID> {doc_type} --filename" in command_text
        assert anchor in command_text
        assert "Template Origin**: Community" in template_text
        assert f"Command**: `/arckit:{command}`" in template_text


def test_au_energy_recipe_composes_federal_ot_soci_and_energy_targets():
    recipe = yaml.safe_load(read("arckit-au-energy/recipes/au-energy.yaml"))

    assert recipe["recipe"] == "au-energy"
    assert recipe["schema_version"] == 1
    assert recipe["flagship"] == "AU_ENERGY"
    assert "AESCSF" in recipe["description"]
    assert "ring-fencing" in recipe["description"]

    optional_targets = recipe["optional_targets"]
    assert optional_targets["AU_OT"]["default"] is True
    assert optional_targets["AU_SOCI"]["default"] is True
    assert optional_targets["AU_AESCSF"]["default"] is True
    assert optional_targets["AU_ENERGY"]["default"] is True
    assert optional_targets["SERVICE_INVENTORY"]["default"] is False

    targets = {target["id"]: target for target in recipe["targets"]}
    assert targets["AU_OT"]["skill"] == "arckit:au-ot-security"
    assert targets["AU_SOCI"]["skill"] == "arckit:au-soci-cirmp"
    assert targets["AU_AESCSF"]["skill"] == "arckit:au-aescsf"
    assert targets["AU_AESCSF"]["output"]["type"] == "AUAESCSF"
    assert targets["AU_AESCSF"]["deps"] == ["REQ", "STKE", "AU_E8", "AU_ISM", "AU_OT", "AU_SOCI"]
    assert targets["AU_ENERGY"]["skill"] == "arckit:au-energy-compliance"
    assert targets["AU_ENERGY"]["output"]["type"] == "AUENERGY"
    assert targets["AU_ENERGY"]["deps"] == [
        "REQ",
        "STKE",
        "AU_PIA",
        "AU_NDB",
        "AU_OT",
        "AU_SOCI",
        "AU_AESCSF",
    ]
    assert targets["SERVICE_INVENTORY"]["skill"] == "arckit:servicenow"
    assert targets["SERVICE_INVENTORY"]["output"]["type"] == "SNOW"
    assert targets["SERVICE_INVENTORY"]["deps"] == [
        "REQ",
        "STKE",
        "DATA_MODEL",
        "AU_OT",
        "AU_SOCI",
        "AU_AESCSF",
        "AU_ENERGY",
    ]

    adr_topics = [target["topic"] for target in recipe["targets"] if target["id"].startswith("ADR_")]
    assert len(adr_topics) == 8
    assert any("ring-fencing" in topic.lower() for topic in adr_topics)
    assert any("AEMO" in topic for topic in adr_topics)
    assert any("CSIP-AUS" in topic for topic in adr_topics)


def test_au_energy_doc_types_registered_in_core_and_pages():
    doc_types = read("arckit-claude/config/doc-types.mjs")
    pages = read("arckit-claude/commands/pages.md")

    assert re.search(r"'AUAESCSF':\s+\{ name: 'AU AESCSF Maturity Assessment'", doc_types)
    assert re.search(r"'AUENERGY':\s+\{ name: 'AU Energy Compliance Pack'", doc_types)
    assert "| | AUAESCSF | `ARC-*-AUAESCSF-*.md` | AU AESCSF Maturity Assessment |" in pages
    assert "| | AUENERGY | `ARC-*-AUENERGY-*.md` | AU Energy Compliance Pack |" in pages


def test_au_energy_fixtures_are_public_synthetic_and_have_expected_shape():
    fixture_root = REPO_ROOT / "tests/fixtures/au-energy"
    assert (fixture_root / "README.md").is_file()
    assert (fixture_root / "REFERENCES_AND_METHODOLOGY.md").is_file()
    assert (fixture_root / "EVAL_EXPECTATIONS.md").is_file()
    assert (fixture_root / "EVAL_RESULTS.md").is_file()
    assert (fixture_root / "EVAL_SUMMARY_REPORT.md").is_file()
    assert (fixture_root / "LIVE_GENERATION_REVIEW.md").is_file()
    assert (fixture_root / "fixture-a-eastland-dnsp").is_dir()
    assert (fixture_root / "fixture-b-voltiq-supplier").is_dir()

    fixture_files = [
        path
        for path in fixture_root.rglob("*.md")
        if path.name not in {
            "README.md",
            "REFERENCES_AND_METHODOLOGY.md",
            "INTERNATIONAL_DATA_SOURCES.md",
            "EVAL_EXPECTATIONS.md",
            "EVAL_RESULTS.md",
        }
    ]
    assert fixture_files

    for path in fixture_files:
        text = path.read_text(encoding="utf-8")
        assert "SYNTHETIC" in text.upper(), f"{path} missing synthetic disclaimer"

    expectations = read("tests/fixtures/au-energy/EVAL_EXPECTATIONS.md")
    results = read("tests/fixtures/au-energy/EVAL_RESULTS.md")
    live_review = read("tests/fixtures/au-energy/LIVE_GENERATION_REVIEW.md")
    assert "Eastland Energy Networks" in expectations
    assert "Voltiq Analytics" in expectations
    assert "MIL-1" in expectations
    assert "Not a SOCI-covered entity" in expectations
    assert "Manual evaluation" in results


def test_au_energy_synthetic_fixtures_exercise_new_skill_prompts():
    fixture_root = REPO_ROOT / "tests/fixtures/au-energy"
    eastland_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (fixture_root / "fixture-a-eastland-dnsp").rglob("*.md")
    )
    voltiq_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in (fixture_root / "fixture-b-voltiq-supplier").rglob("*.md")
    )

    aescsf_command = read("arckit-au-energy/commands/au-aescsf.md")
    energy_command = read("arckit-au-energy/commands/au-energy-compliance.md")
    summary = read("tests/fixtures/au-energy/EVAL_SUMMARY_REPORT.md")
    results = read("tests/fixtures/au-energy/EVAL_RESULTS.md")
    live_review = read("tests/fixtures/au-energy/LIVE_GENERATION_REVIEW.md")

    for required_section in [
        "Domain Maturity Assessment",
        "OT/IT and Grid-Edge Findings",
        "Architecture Evidence",
        "IT/OT and Market Data Flows",
        "Energy Data Model Dependencies",
        "Asset, Interface, and Evidence Inventory",
        "Federal Baseline Cross-Reference",
    ]:
        assert required_section in aescsf_command

    for required_section in [
        "Energy-Sector Applicability",
        "AER Ring-Fencing Assessment",
        "NER / NGR and AEMO Obligation Mapping",
        "Market and System-Operator Interface Register",
        "Regulated Asset, Interface, and Data Inventory",
        "Regulated / Unregulated Data Flows",
        "Architecture Decision Seeds",
    ]:
        assert required_section in energy_command

    for command_text in [aescsf_command, energy_command]:
        for arckit_tool in [
            "/arckit:servicenow",
            "/arckit:data-model",
            "/arckit:dfd",
            "/arckit:diagram",
            "/arckit:risk",
            "/arckit:graph-report",
        ]:
            assert arckit_tool in command_text

    aescsf_template = read("arckit-au-energy/templates/au-aescsf-template.md")
    energy_template = read("arckit-au-energy/templates/au-energy-compliance-template.md")
    for template_text in [aescsf_template, energy_template]:
        assert "Register / Inventory" in template_text
        assert "Source of Truth" in template_text
        assert "Visualisation / Scoring" in template_text
        assert "ServiceNow / CMDB" in template_text
        assert "Graph Report" in template_text

    eastland_positive_anchors = [
        "Eastland Energy Networks",
        "critical electricity asset",
        "SCADA",
        "ADMS",
        "DERMS",
        "DOE",
        "CSIP-AUS",
        "vendor remote access",
        "MIL-1",
        "ring-fencing",
        "AEMO",
        "NMI",
        "settlement",
        "CIRMP",
    ]
    for anchor in eastland_positive_anchors:
        assert anchor in eastland_text, f"Fixture A missing expected anchor: {anchor}"

    voltiq_negative_anchors = [
        "Voltiq Analytics",
        "Not a SOCI-covered entity",
        "flow-down",
        "supplier",
        "tenant",
        "OT overlay",
        "notification",
    ]
    for anchor in voltiq_negative_anchors:
        assert anchor in voltiq_text, f"Fixture B missing expected anchor: {anchor}"

    for reported_signal in [
        "Synthetic skill compatibility evaluation",
        "Fixture A: Pass",
        "Fixture B: Pass",
        "au-aescsf",
        "au-energy-compliance",
        "deterministic fixture-coverage evaluation",
    ]:
        assert reported_signal in summary
        assert reported_signal in results

    for live_signal in [
        "Asset, Interface, and Evidence Inventory",
        "Regulated Asset, Interface, and Data Inventory",
        "ServiceNow / CMDB",
        "Visualisation / Scoring",
        "Fixture A strongly triggered",
        "Fixture B selectively triggered",
    ]:
        assert live_signal in live_review
        assert live_signal in results or live_signal in summary or "Fixture" not in live_signal
