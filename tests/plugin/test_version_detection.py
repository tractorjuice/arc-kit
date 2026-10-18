"""Re-running a single-instance command writes the next version, never over v1.0 (#946).

A single-instance doc-type has one document per project (`ARC-001-RISK-v1.1.md`),
unlike the multi-instance types numbered with `--next-num`. Re-running its command
must find the existing `ARC-{PROJECT_ID}-{TYPE}-v*.md`, pick the next minor or major
version and add a Revision History row. Thirteen commands hard-coded `v1.0` in their
write step instead, so a re-run silently replaced a reviewed or approved document,
and the others described the step in a dozen different ways.
references/version-detection.md holds the procedure; this test keeps every
single-instance command on it.
"""

from __future__ import annotations

import re
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[2]
PLUGIN = REPO_ROOT / "plugins" / "arckit-claude"
REFERENCE = PLUGIN / "references" / "version-detection.md"
POINTER = "${CLAUDE_PLUGIN_ROOT}/references/version-detection.md"


def _multi_instance_types() -> set[str]:
    text = (PLUGIN / "config" / "doc-types.mjs").read_text(encoding="utf-8")
    block = re.search(r"export const MULTI_INSTANCE_TYPES = new Set\(\[(.*?)\]\)", text, re.S).group(1)
    return set(re.findall(r"'([A-Z0-9-]+)'", block))


def _declared_codes(path: Path) -> list[str]:
    front = path.read_text(encoding="utf-8").split("---\n", 2)[1]
    raw = re.search(r"^doc-type:\s*(.+?)\s*$", front, re.M).group(1)
    return [] if raw == "none" else [c.strip() for c in raw.strip("[]").split(",") if c.strip()]


def _instructions(path: Path) -> str:
    """The command body, plus the agent it hands the write to (framework -> arckit-framework)."""
    text = path.read_text(encoding="utf-8")
    agent = path.parent.parent / "agents" / f"arckit-{path.stem}.md"
    if agent.exists():
        text += agent.read_text(encoding="utf-8")
    return text


MULTI = _multi_instance_types()
# Core and every community overlay. Overlays carry their own copy of the reference
# (scripts/sync-shared-assets.py), so the same pointer resolves in each plugin.
SINGLE_INSTANCE = sorted(
    p for p in REPO_ROOT.glob("plugins/arckit-*/commands/*.md") if any(c not in MULTI for c in _declared_codes(p))
)


def _id(path: Path) -> str:
    return f"{path.parent.parent.name}/{path.stem}"

def _pinned_to_v1(path: Path) -> list[str]:
    """The command's own output named at v1.0 with a placeholder project ID.

    Worked examples with a real ID (`ARC-001-STKE-v1.0.md`) stay legal: they show a
    first run. Other doc-types the command only reads are out of scope here.
    """
    text = _instructions(path)
    own = [c for c in _declared_codes(path) if c not in MULTI]
    found = set()
    for code in own:
        found.update(re.findall(
            r"ARC-(?:[{\[](?:PROJECT_ID|PID|P|NNN)[}\]]|<[a-z-]+>|NNN)-" + re.escape(code) + r"-v1\.0\b", text))
    return sorted(found)


def test_reference_states_the_procedure():
    text = REFERENCE.read_text(encoding="utf-8")
    for heading in ["## 1. Look for an existing version", "## 2. No existing file: version 1.0",
                    "## 3. Existing file: pick the next version", "## 4. Carry the version everywhere"]:
        assert heading in text, f"version-detection.md lost section {heading!r}"
    assert "Minor increment" in text and "Major increment" in text


def test_the_commands_from_946_are_single_instance():
    """Guards the doc-type parse: if this set shrinks, the parametrised checks below silently cover less."""
    names = {p.stem for p in SINGLE_INSTANCE}
    assert {"conformance", "data-model", "devops", "finops", "jsp-936", "mlops", "operationalize",
            "principles-compliance", "risk", "service-assessment", "servicenow", "stakeholders",
            "wardley.doctrine", "requirements", "framework"} <= names


@pytest.mark.parametrize("path", SINGLE_INSTANCE, ids=_id)
def test_single_instance_command_follows_version_detection(path):
    assert POINTER in _instructions(path), (
        f"{path.name} writes a single-instance artefact but does not reference {POINTER}, "
        f"so a re-run can overwrite the existing version"
    )


@pytest.mark.parametrize("path", SINGLE_INSTANCE, ids=_id)
def test_own_output_is_not_pinned_to_v1(path):
    pinned = _pinned_to_v1(path)
    assert not pinned, f"{path.name} pins its output to v1.0: {pinned}; use v{{VERSION}} from the version check"
