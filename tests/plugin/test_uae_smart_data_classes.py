"""The UAE Smart Data ladder is the framework's four classes (#949).

The UAE Smart Data Framework, Part 1: Smart Data Principles and Standards
(v2.0, February 2019), Data Classification Standard DC1, sets four classes:
Open, Confidential, Sensitive and Secret. Part 2: Smart Data Implementation
Guide (v2.0, March 2019), Guidance Note 5.1, gives the criteria for each.
Both are published at https://u.ae/en/about-the-uae/digital-uae/data/data-operability.

ArcKit shipped a five-rung ladder (Open / Shared / Confidential / Secret /
Top Secret) from v4.10 until #949. "Shared" is an exchange mode in the
framework, not a class, and there is no "Top Secret". These tests hold every
place that states the ladder to the four classes, in order, so that the
partial, the routing table, the CLAS template and the migration helper cannot
drift apart again.
"""

import importlib.util
import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]

FOUR_CLASSES = ["Open", "Confidential", "Sensitive", "Secret"]
FORMER_RUNGS = ("Shared", "Top Secret")

PARTIAL_COPIES = (
    REPO_ROOT / "plugins/arckit-claude/templates/_partials/document-control-uae.md",
    REPO_ROOT / ".arckit/templates/_partials/document-control-uae.md",
)
RENDERING_COPIES = (
    REPO_ROOT / "plugins/arckit-claude/templates/_partials/RENDERING.md",
    REPO_ROOT / ".arckit/templates/_partials/RENDERING.md",
)
CLAS_TEMPLATES = (
    REPO_ROOT / "plugins/arckit-uae/templates/uae-classification-template.md",
    REPO_ROOT / ".arckit/templates/uae-classification-template.md",
)
LADDER_TEMPLATES = (
    "uae-classification-template.md",
    "uae-cloud-residency-template.md",
    "uae-data-sharing-template.md",
    "uae-digital-records-template.md",
)
MIGRATION_SCRIPT = REPO_ROOT / "scripts/python/migrate_classification.py"


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def rungs(text: str) -> list[str]:
    return [part.strip() for part in text.strip("[] ").split("/") if part.strip()]


@pytest.mark.parametrize("path", PARTIAL_COPIES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_partial_carries_the_four_classes(path: Path) -> None:
    match = re.search(r"^\|\s*\*\*Classification\*\*\s*\|\s*(\[.+?\])\s*\|", read(path), re.M)
    assert match, f"{path} has no Classification row"
    assert rungs(match.group(1)) == FOUR_CLASSES


@pytest.mark.parametrize("path", RENDERING_COPIES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_routing_table_carries_the_four_classes(path: Path) -> None:
    match = re.search(r"^\|\s*UAE\s*\|\s*`document-control-uae\.md`\s*\|([^|]+)\|", read(path), re.M)
    assert match, f"{path} has no UAE row in the regime routing table"
    assert rungs(match.group(1)) == FOUR_CLASSES


@pytest.mark.parametrize("path", CLAS_TEMPLATES, ids=lambda p: str(p.relative_to(REPO_ROOT)))
def test_clas_levels_table_lists_the_four_classes(path: Path) -> None:
    section = read(path).split("## Classification Levels Used", 1)[1].split("\n## ", 1)[0]
    levels = re.findall(r"^\|\s*([A-Za-z ]+?)\s*\|\s*\[Y/N\]", section, re.M)
    assert levels == FOUR_CLASSES


@pytest.mark.parametrize("name", LADDER_TEMPLATES)
def test_uae_templates_offer_no_former_rung(name: str) -> None:
    for tree in ("plugins/arckit-uae/templates", ".arckit/templates"):
        text = read(REPO_ROOT / tree / name)
        assert "[Open / Confidential / Sensitive / Secret]" in text, f"{tree}/{name}"
        for rung in FORMER_RUNGS:
            assert f"/ {rung} /" not in text and f"/ {rung}]" not in text, (
                f"{tree}/{name} still offers {rung!r} as a classification"
            )


def test_migration_maps_uk_values_onto_the_four_classes() -> None:
    spec = importlib.util.spec_from_file_location("migrate_classification", MIGRATION_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)

    assert module.MAPPING == {
        "PUBLIC": "Open",
        "OFFICIAL": "Confidential",
        "OFFICIAL-SENSITIVE": "Sensitive",
        "SECRET": "Secret",
        "TOP SECRET": "Secret",
    }

    text = "| **Classification** | TOP SECRET |\n"
    new_text, changes = module.propose(text)
    assert new_text == "| **Classification** | Secret |\n"
    assert changes == [("TOP SECRET", "Secret")]


def test_migration_leaves_former_uae_labels_alone() -> None:
    """A document already on the old UAE ladder is not rewritten or rejected."""
    spec = importlib.util.spec_from_file_location("migrate_classification", MIGRATION_SCRIPT)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)

    for label in FORMER_RUNGS:
        text = f"| **Classification** | {label} |\n"
        assert module.propose(text) == (text, [])
