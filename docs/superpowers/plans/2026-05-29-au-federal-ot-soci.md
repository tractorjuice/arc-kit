# AU Federal OT + SOCI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add reusable Australian OT security and SOCI/CIRMP commands to the AU community overlay, optional in `au-federal`.

**Architecture:** Add two source commands and templates under `arckit-au`, register two document types in core, wire both as default-off optional targets in the AU recipe, then regenerate downstream formats. Tests should verify command conversion, template consistency, document type registration, and recipe dependency validity.

**Tech Stack:** Markdown command prompts/templates, YAML recipe, ESM doc-type registry, Python converter, pytest, Node test scripts.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `arckit-au/commands/au-ot-security.md` | Command prompt for ASD OT security assessment. |
| `arckit-au/templates/au-ot-security-template.md` | Output template for `AUOT` artefacts. |
| `arckit-au/commands/au-soci-cirmp.md` | Command prompt for SOCI Act / CIRMP governance pack. |
| `arckit-au/templates/au-soci-cirmp-template.md` | Output template for `AUSOCI` artefacts. |
| `arckit-au/recipes/au-federal.yaml` | Adds optional default-off `AU_OT` and `AU_SOCI` targets. |
| `arckit-claude/config/doc-types.mjs` | Registers `AUOT` and `AUSOCI` document type codes. |
| `arckit-claude/commands/pages.md` | Mirrors doc-type codes so `/arckit:pages` includes outputs. |
| `arckit-au/README.md` | Updates AU plugin command count and rationale. |
| `arckit-au/CHANGELOG.md` | Records AU OT/SOCI additions. |
| `tests/plugin/test_au_federal_ot_soci.py` | Focused tests for source files, recipe optionality, and doc types. |
| generated extension directories | Produced by `python scripts/converter.py`. |

## Task 1: Add Failing Source Tests

**Files:**
- Create: `tests/plugin/test_au_federal_ot_soci.py`

- [ ] **Step 1: Write tests before implementation**

```python
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
    assert targets["AU_OT"]["deps"] == ["REQ", "STKE", "AU_E8", "AU_ISM"]
    assert targets["AU_SOCI"]["skill"] == "arckit:au-soci-cirmp"
    assert targets["AU_SOCI"]["output"]["type"] == "AUSOCI"
    assert targets["AU_SOCI"]["deps"] == ["REQ", "STKE", "AU_E8", "AU_ISM", "AU_PIA", "AU_NDB"]


def test_au_ot_and_soci_doc_types_registered_in_core_and_pages():
    doc_types = read("arckit-claude/config/doc-types.mjs")
    pages = read("arckit-claude/commands/pages.md")

    assert re.search(r"'AUOT':\s+\{ name: 'AU OT Security Assessment'", doc_types)
    assert re.search(r"'AUSOCI':\s+\{ name: 'AU SOCI CIRMP Governance Pack'", doc_types)
    assert "| | AUOT | `ARC-*-AUOT-*.md` | AU OT Security Assessment |" in pages
    assert "| | AUSOCI | `ARC-*-AUSOCI-*.md` | AU SOCI CIRMP Governance Pack |" in pages
```

- [ ] **Step 2: Run tests to verify failure**

Run:

```powershell
pytest tests/plugin/test_au_federal_ot_soci.py -q
```

Expected: failures because files, recipe targets, and doc-type registrations do not exist yet.

## Task 2: Add AU OT Security Command and Template

**Files:**
- Create: `arckit-au/commands/au-ot-security.md`
- Create: `arckit-au/templates/au-ot-security-template.md`

- [ ] **Step 1: Create the command prompt**

Use the established AU command pattern: YAML frontmatter with `[COMMUNITY]`, handoffs to `au-e8-posture`, `au-ism-controls`, `au-soci-cirmp`, and `risk`; process steps that read prerequisites, template, rendering partial, and write `AUOT`.

- [ ] **Step 2: Create the template**

Include these sections:

- Executive Summary
- OT Environment Context
- ASD OT Guidance Alignment
- Architecture Visibility and Asset Inventory
- IT/OT Segmentation and Trust Boundaries
- Secure Connectivity and Remote Access
- Supplier and Managed-Service Access
- Monitoring, Logging, and Incident Response
- Safety, Availability, and Recovery Constraints
- AI-in-OT Considerations
- Gaps, Recommendations, and External References

- [ ] **Step 3: Run focused tests**

Run:

```powershell
pytest tests/plugin/test_au_federal_ot_soci.py::test_au_ot_and_soci_source_files_exist_and_use_community_origin -q
```

Expected: still fails for `au-soci-cirmp`, passes the OT half implicitly once SOCI is added.

## Task 3: Add AU SOCI CIRMP Command and Template

**Files:**
- Create: `arckit-au/commands/au-soci-cirmp.md`
- Create: `arckit-au/templates/au-soci-cirmp-template.md`

- [ ] **Step 1: Create the command prompt**

Use the AU command pattern with `[COMMUNITY]`, handoffs to `au-ot-security`, `au-e8-posture`, `au-ism-controls`, `au-pia`, `au-ndb-playbook`, and `risk`; process steps that write `AUSOCI`.

- [ ] **Step 2: Create the template**

Include these sections:

- Executive Summary
- Critical Asset and Responsible Entity Context
- SOCI Applicability Assessment
- CIRMP Governance Model
- CIRMP Hazard Domain Assessment
- Cyber and Information Security Evidence
- Personnel, Supply Chain, Physical Security, and Natural Hazard Evidence
- Incident Reporting and Notification Pathways
- Board / Accountable Officer Attestation
- Gaps, Actions, and External References

- [ ] **Step 3: Run focused tests**

Run:

```powershell
pytest tests/plugin/test_au_federal_ot_soci.py::test_au_ot_and_soci_source_files_exist_and_use_community_origin -q
```

Expected: PASS.

## Task 4: Register Doc Types and Pages Table

**Files:**
- Modify: `arckit-claude/config/doc-types.mjs`
- Modify: `arckit-claude/commands/pages.md`

- [ ] **Step 1: Add doc types near existing AU entries**

Add:

```javascript
'AUOT':      { name: 'AU OT Security Assessment',                  category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
'AUSOCI':    { name: 'AU SOCI CIRMP Governance Pack',               category: 'Compliance',  regime: 'AU', severity: 'HIGH' },
```

- [ ] **Step 2: Add pages allow-list rows near existing AU rows**

Add:

```markdown
| | AUOT | `ARC-*-AUOT-*.md` | AU OT Security Assessment |
| | AUSOCI | `ARC-*-AUSOCI-*.md` | AU SOCI CIRMP Governance Pack |
```

- [ ] **Step 3: Run doc-type tests**

Run:

```powershell
node scripts/tests/test-doc-types-dual-registration.mjs
python scripts/check_doctype_collisions.py
pytest tests/plugin/test_au_federal_ot_soci.py::test_au_ot_and_soci_doc_types_registered_in_core_and_pages -q
```

Expected: PASS.

## Task 5: Wire Recipe Optional Targets

**Files:**
- Modify: `arckit-au/recipes/au-federal.yaml`

- [ ] **Step 1: Add optional targets**

Add `AU_OT` and `AU_SOCI` with `default: false` under `optional_targets`.

- [ ] **Step 2: Add targets after AU_NDB and before default service/AI/DISP consolidation**

Add:

```yaml
- id: AU_OT
  skill: arckit:au-ot-security
  args: "{P}"
  output: { project: "{P}-{NAME}", type: AUOT }
  deps: [REQ, STKE, AU_E8, AU_ISM]

- id: AU_SOCI
  skill: arckit:au-soci-cirmp
  args: "{P}"
  output: { project: "{P}-{NAME}", type: AUSOCI }
  deps: [REQ, STKE, AU_E8, AU_ISM, AU_PIA, AU_NDB]
```

- [ ] **Step 3: Run recipe tests**

Run:

```powershell
pytest tests/plugin/test_au_federal_ot_soci.py::test_au_federal_recipe_exposes_ot_and_soci_as_default_off_optional_targets -q
python scripts/check_recipes.py
```

Expected: PASS.

## Task 6: Update AU Plugin Docs

**Files:**
- Modify: `arckit-au/README.md`
- Modify: `arckit-au/CHANGELOG.md`

- [ ] **Step 1: Update README count and command list**

Change `8 slash commands` to `10 slash commands`, add the two new commands, update doc-type-code list, and add a short note that SOCI/OT are reusable cross-sector capabilities consumed by future sector recipes such as `au-energy`.

- [ ] **Step 2: Add changelog entry**

Add an Unreleased entry:

```markdown
## Unreleased

### Added

- Added `/arckit:au-ot-security` for ASD operational technology cyber security guidance.
- Added `/arckit:au-soci-cirmp` for SOCI Act / Critical Infrastructure Risk Management Program support.
- Added optional default-off `AU_OT` and `AU_SOCI` targets to the `au-federal` recipe for cross-sector critical-infrastructure use.
```

## Task 7: Regenerate Downstream Formats

**Files:**
- Modify generated outputs under `arckit-codex/`, `arckit-gemini/`, `arckit-opencode/`, `arckit-copilot/`, and `arckit-paperclip/`
- Modify copied project templates under `.arckit/templates/` if converter syncs them

- [ ] **Step 1: Run converter**

Run:

```powershell
python scripts/converter.py
```

Expected: generated command/skill/template outputs include `au-ot-security` and `au-soci-cirmp`.

- [ ] **Step 2: Run conversion tests**

Run:

```powershell
pytest tests/codex/test_codex_extension.py -q
pytest tests/paperclip/test_commands_json.py -q
pytest tests/plugin/test_template_consistency.py -q
```

Expected: PASS.

## Task 8: Final Verification

**Files:**
- All changed files

- [ ] **Step 1: Run full focused validation**

Run:

```powershell
pytest tests/plugin/test_au_federal_ot_soci.py -q
node scripts/tests/test-doc-types-dual-registration.mjs
python scripts/check_doctype_collisions.py
python scripts/check_recipes.py
pytest tests/codex/test_codex_extension.py -q
pytest tests/paperclip/test_commands_json.py -q
pytest tests/plugin/test_template_consistency.py -q
```

Expected: all pass.

- [ ] **Step 2: Review diff**

Run:

```powershell
git status --short
git diff --stat
```

Expected: only AU command/template/recipe docs, doc-type/pages registration, generated converter outputs, tests, and plan/spec files are changed.
