import json
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
FIXTURE_DIR = REPO_ROOT / "tests" / "fixtures" / "au_visual_evidence"


def read_fixture(name: str) -> str:
    return (FIXTURE_DIR / name).read_text(encoding="utf-8")


def load_expected_results() -> dict:
    return json.loads((FIXTURE_DIR / "expected-results.json").read_text(encoding="utf-8"))


def classify_visual_evidence(text: str) -> str:
    """Deterministic proxy for the AU Federal visual-evidence rule."""
    has_mermaid = "```mermaid" in text
    relationship_count = text.count("-->") + text.count(" send ") + text.count(" produces ")
    has_pending = "Pending Input" in text or "TBC" in text
    has_visual_gap = "Visual Evidence Gap" in text
    has_do_not_diagram = "Do not create a diagram" in text

    if has_visual_gap and has_do_not_diagram:
        return "record_visual_evidence_gap"
    if has_mermaid and relationship_count >= 2:
        return "generate_companion_visuals"
    if has_pending and relationship_count >= 2:
        return "generate_draft_visual"
    return "record_visual_evidence_gap"


def test_au_visual_evidence_fixture_expected_results_are_valid():
    expected = load_expected_results()

    assert expected["eval_name"] == "au_visual_evidence_decision_rule"
    assert len(expected["cases"]) == 3

    for case in expected["cases"]:
        text = read_fixture(case["fixture"])
        assert classify_visual_evidence(text) == case["expected_decision"]
        for term in case["required_terms"]:
            assert term in text, f"{case['fixture']} should include required term: {term}"
        for term in case["must_not_include"]:
            assert term not in text, f"{case['fixture']} should not include term: {term}"
        for label in case["expected_labels"]:
            assert label in text, f"{case['fixture']} should include expected label: {label}"


def test_au_visual_evidence_eval_result_set_documents_all_cases():
    expected = load_expected_results()
    result_set = read_fixture("evaluation-results.md")

    for case in expected["cases"]:
        assert case["fixture"] in result_set
    assert "Generate companion visual artefacts" in result_set
    assert "Generate draft visual with `Pending Input` labels" in result_set
    assert "Do not create a diagram; record a Visual Evidence Gap" in result_set
