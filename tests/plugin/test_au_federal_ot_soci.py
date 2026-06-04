from pathlib import Path
import re

import yaml


REPO_ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (REPO_ROOT / path).read_text(encoding="utf-8")


def test_au_ot_and_soci_source_files_exist_and_use_community_origin():
    expected = {
        "au-ot-security": ("AUOT", "ASD operational technology"),
        "au-soci-cirmp": ("AUSOCI", "SOCI Act"),
    }

    for command, (doc_type, anchor) in expected.items():
        command_text = read(f"arckit-au/commands/{command}.md")
        template_text = read(f"arckit-au/templates/{command}-template.md")

        assert "[COMMUNITY]" in command_text
        assert f"generate-document-id.sh <PROJECT_ID> {doc_type} --filename" in command_text
        assert anchor in command_text
        assert "Template Origin**: Community" in template_text
        assert f"Command**: `/arckit:{command}`" in template_text


def test_au_ot_and_soci_leverage_core_arckit_capabilities():
    capability_terms = [
        "/arckit:diagram",
        "/arckit:dfd",
        "/arckit:data-model",
        "/arckit:servicenow",
        "CMDB",
        "/arckit:risk",
        "/arckit:traceability",
        "/arckit:graph-report",
        "/arckit:maturity-model",
    ]

    for command in ("au-ot-security", "au-soci-cirmp"):
        combined = "\n".join(
            [
                read(f"arckit-au/commands/{command}.md"),
                read(f"arckit-au/templates/{command}-template.md"),
            ]
        )
        for term in capability_terms:
            assert term in combined, f"{command} should reference {term}"

        assert "energy-specific" not in combined.lower()
        assert "sector-specific" in combined.lower()


def test_au_federal_recipe_exposes_ot_and_soci_as_default_off_optional_targets():
    recipe = yaml.safe_load(read("arckit-au/recipes/au-federal.yaml"))
    optional_targets = recipe["optional_targets"]

    assert optional_targets["AU_OT"]["default"] is False
    assert "operational technology" in optional_targets["AU_OT"]["description"].lower()
    assert optional_targets["AU_SOCI"]["default"] is False
    assert "critical infrastructure" in optional_targets["AU_SOCI"]["description"].lower()

    targets = {target["id"]: target for target in recipe["targets"]}
    assert targets["AU_OT"]["skill"] == "arckit:au-ot-security"
    assert targets["AU_OT"]["output"]["type"] == "AUOT"
    assert targets["AU_OT"]["deps"] == ["REQ", "STKE", "AU_E8", "AU_ISM", "DIAG", "DFD", "DATA_MODEL"]
    assert targets["AU_SOCI"]["skill"] == "arckit:au-soci-cirmp"
    assert targets["AU_SOCI"]["output"]["type"] == "AUSOCI"
    assert targets["AU_SOCI"]["deps"] == [
        "REQ",
        "STKE",
        "AU_E8",
        "AU_ISM",
        "AU_PIA",
        "AU_NDB",
        "AU_OT",
        "RISK",
        "TRACEABILITY",
        "SNOW",
    ]


def test_au_ot_and_soci_doc_types_registered_in_core_and_pages():
    doc_types = read("arckit-claude/config/doc-types.mjs")
    pages = read("arckit-claude/commands/pages.md")

    assert re.search(r"'AUOT':\s+\{ name: 'AU OT Security Assessment'", doc_types)
    assert re.search(r"'AUSOCI':\s+\{ name: 'AU SOCI CIRMP Governance Pack'", doc_types)
    assert "| | AUOT | `ARC-*-AUOT-*.md` | AU OT Security Assessment |" in pages
    assert "| | AUSOCI | `ARC-*-AUSOCI-*.md` | AU SOCI CIRMP Governance Pack |" in pages
