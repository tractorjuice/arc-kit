from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]


def read(path: str) -> str:
    return (REPO_ROOT / path).read_text(encoding="utf-8")


def test_all_au_domains_reference_relevant_embedded_arckit_capabilities():
    expected = {
        "au-ai-assurance": [
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-disp-attestation": [
            "/arckit:servicenow",
            "CMDB",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-dss": [
            "/arckit:diagram",
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:servicenow",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-e8-posture": [
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-ism-controls": [
            "/arckit:diagram",
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:servicenow",
            "CMDB",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-ndb-playbook": [
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:servicenow",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
        ],
        "au-pia": [
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
        ],
        "au-pspf": [
            "/arckit:diagram",
            "/arckit:data-model",
            "/arckit:servicenow",
            "CMDB",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-ot-security": [
            "/arckit:diagram",
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:servicenow",
            "CMDB",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
        "au-soci-cirmp": [
            "/arckit:diagram",
            "/arckit:dfd",
            "/arckit:data-model",
            "/arckit:servicenow",
            "CMDB",
            "/arckit:risk",
            "/arckit:traceability",
            "/arckit:graph-report",
            "/arckit:maturity-model",
        ],
    }

    for command, terms in expected.items():
        combined = "\n".join(
            [
                read(f"plugins/arckit-au/commands/{command}.md"),
                read(f"plugins/arckit-au/templates/{command}-template.md"),
            ]
        )
        for term in terms:
            assert term in combined, f"{command} should reference {term}"


def test_all_au_domains_define_visual_evidence_decision_rule():
    commands = [
        "au-ai-assurance",
        "au-disp-attestation",
        "au-dss",
        "au-e8-posture",
        "au-ism-controls",
        "au-ndb-playbook",
        "au-pia",
        "au-pspf",
        "au-ot-security",
        "au-soci-cirmp",
    ]
    required_terms = [
        "Visual Evidence Decision Rule",
        "enough structure to identify real nodes and relationships",
        "Pending Input",
        "Visual Evidence Gap",
        "do not create a diagram",
    ]

    for command in commands:
        combined = "\n".join(
            [
                read(f"plugins/arckit-au/commands/{command}.md"),
                read(f"plugins/arckit-au/templates/{command}-template.md"),
            ]
        )
        for term in required_terms:
            assert term in combined, f"{command} should define visual evidence rule term: {term}"
