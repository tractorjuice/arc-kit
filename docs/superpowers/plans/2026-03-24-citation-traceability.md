# Citation Traceability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add citation traceability so generated artifacts reference external source documents with inline markers and a structured references section.

**Architecture:** A single shared citation instructions file (`arckit-claude/references/citation-instructions.md`) is referenced by all 43 commands and 7 agents that read external documents. The existing `## External References` section in ~47 templates is evolved to include Document Register, Citations, and Unreferenced Documents tables.

**Tech Stack:** Markdown templates, YAML frontmatter, Python converter (`scripts/converter.py`)

**Spec:** `docs/superpowers/specs/2026-03-24-citation-traceability-design.md`

---

### Task 1: Create the shared citation instructions file

**Files:**
- Create: `arckit-claude/references/citation-instructions.md`

- [ ] **Step 1: Create `arckit-claude/references/citation-instructions.md`**

Write the file with these sections:

```markdown
# Citation Instructions for External Documents

When ArcKit commands read external documents (from `external/`, `policies/`, `vendors/`), use this citation system to create traceability from generated content back to source material.

## Document Abbreviation Rules

Derive a short Doc ID from each external filename:

1. Strip the file extension (`.pdf`, `.docx`, `.xlsx`, etc.)
2. Strip version numbers (`-v2`, `-v1.0`, `_v3`, etc.)
3. Take the first letter of each significant word (skip "the", "and", "of", "for", "in", "a", "an")
4. Uppercase the result

**Examples:**

| Filename | Doc ID | Derivation |
|----------|--------|------------|
| privacy-policy.pdf | PP | **P**rivacy **P**olicy |
| security-framework-v2.docx | SF | **S**ecurity **F**ramework |
| data-protection-impact-assessment.pdf | DPIA | **D**ata **P**rotection **I**mpact **A**ssessment |
| nhs-digital-service-manual.pdf | NDSM | **N**HS **D**igital **S**ervice **M**anual |
| cloud-hosting-strategy.pdf | CHS | **C**loud **H**osting **S**trategy |

**Collision handling:** If two documents produce the same abbreviation, append a numeric suffix to the second (e.g., `PP`, `PP2`). Alternatively, use more letters from the distinguishing word (e.g., `PRIV` for privacy-policy vs `PROC` for procurement-process).

## Citation ID Format

Each citation uses the format: `[{DOC_ID}-C{N}]`

- `DOC_ID` — The document abbreviation from the table above
- `C` — Literal "C" for "citation"
- `N` — Sequential number per document, starting at 1

Examples: `[PP-C1]`, `[PP-C2]`, `[SF-C1]`, `[DPIA-C3]`

## Inline Marker Placement

Place citation markers **immediately after** the requirement, finding, risk, or statement that was informed by the source document. Do not group citations at the end of paragraphs — attach them to the specific claim.

**Examples:**

```
The system must encrypt all personal data at rest using AES-256 [SF-C1] and in transit using TLS 1.3 [SF-C2].
```

```
| BR-001 | The platform must support 10,000 concurrent users [RFP-C1] | Must | Scalability |
```

```
Risk R-005: Non-compliance with data retention policy [PP-C3] could result in ICO enforcement action.
```

## Category Assignment

Assign each citation a usage category describing how the source material was used:

- **Business Requirement** — Source defines a business need or objective
- **Functional Requirement** — Source specifies system behaviour
- **Non-Functional Requirement** — Source defines quality attributes (performance, security, etc.)
- **Compliance Constraint** — Source imposes regulatory or policy obligations
- **Security Requirement** — Source defines security controls or standards
- **Data Requirement** — Source specifies data handling, retention, or classification rules
- **Risk Factor** — Source identifies or informs a risk assessment
- **Design Decision** — Source influences an architectural or design choice
- **Stakeholder Need** — Source captures stakeholder goals, concerns, or expectations
- **Integration Requirement** — Source defines interfaces with external systems
- **Procurement Constraint** — Source restricts or guides procurement approach

## Quoting Rules

For each citation, quote the **specific passage** from the source document that informed the finding:

1. Keep quotes to 1-3 sentences — enough to verify the source, not a full extract
2. Use double quotes around the passage
3. Include the page number, section number, or heading if identifiable
4. If the source is a table or diagram, describe the relevant content rather than quoting verbatim

## External References Section Structure

Populate the `## External References` section in the template with three sub-tables:

### Document Register

Lists every external document that was read, whether or not it was cited.

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|

- **Doc ID** — The abbreviation derived using the rules above
- **Filename** — Original filename as found in the directory
- **Type** — Document type (e.g., Policy, Standard, Strategy, RFP, Specification, Report, Guidance)
- **Source Location** — Directory path relative to `projects/` (e.g., `001-project/external/`, `000-global/policies/`)
- **Description** — Brief description of the document's purpose

### Citations

Lists every inline citation used in the document body.

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|

- **Citation ID** — The `[DOC_ID-CN]` marker used inline
- **Doc ID** — Cross-reference to the Document Register
- **Page/Section** — Page number, section number, or heading where the passage was found. Use "—" if not identifiable
- **Category** — One of the categories listed above
- **Quoted Passage** — The specific passage that informed the finding

### Unreferenced Documents

Lists external documents that were read but did not contribute to this artifact. This demonstrates that all input documents were reviewed.

| Filename | Source Location | Reason |
|----------|-----------------|--------|

- **Reason** — Brief explanation (e.g., "No content relevant to requirements", "Covers operational procedures outside scope of this artifact")

### When No External Documents Exist

If no external documents were provided or found, retain the placeholder row in the Document Register:

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

Omit the Citations and Unreferenced Documents sub-tables.
```

- [ ] **Step 2: Verify the file exists and is well-formed**

Run: `head -5 arckit-claude/references/citation-instructions.md && echo "---" && wc -l arckit-claude/references/citation-instructions.md`

Expected: First 5 lines of the file and a line count around 120-130 lines.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/references/citation-instructions.md
git commit -m "feat: add shared citation instructions for external document traceability (#158)"
```

---

### Task 2: Update templates — Batch 1 (core governance, 10 templates)

Replace the existing `## External References` section in each template. The old section looks like:

```markdown
## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |
```

Replace with:

```markdown
## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |
```

**Important:** Keep the standard footer (`**Generated by**: ArcKit...`) that follows the External References section. Only replace the External References block itself.

**Templates must be updated in both locations:**
- `arckit-claude/templates/{name}-template.md` (plugin source)
- `.arckit/templates/{name}-template.md` (CLI package data)

**Files (Batch 1 — core governance):**
- Modify: `arckit-claude/templates/requirements-template.md` + `.arckit/templates/requirements-template.md`
- Modify: `arckit-claude/templates/risk-register-template.md` + `.arckit/templates/risk-register-template.md`
- Modify: `arckit-claude/templates/hld-review-template.md` + `.arckit/templates/hld-review-template.md`
- Modify: `arckit-claude/templates/sobc-template.md` + `.arckit/templates/sobc-template.md`
- Modify: `arckit-claude/templates/adr-template.md` + `.arckit/templates/adr-template.md`
- Modify: `arckit-claude/templates/evaluation-criteria-template.md` + `.arckit/templates/evaluation-criteria-template.md`
- Modify: `arckit-claude/templates/dpia-template.md` + `.arckit/templates/dpia-template.md`
- Modify: `arckit-claude/templates/data-model-template.md` + `.arckit/templates/data-model-template.md`
- Modify: `arckit-claude/templates/sow-template.md` + `.arckit/templates/sow-template.md`
- Modify: `arckit-claude/templates/stakeholder-drivers-template.md` + `.arckit/templates/stakeholder-drivers-template.md`

- [ ] **Step 1: Update all 10 templates in `arckit-claude/templates/`**

For each template, find the `## External References` section and replace the old 5-column table with the new 3-table citation structure shown above. Preserve the standard footer after it.

- [ ] **Step 2: Update all 10 templates in `.arckit/templates/`**

Same replacement in the CLI package data copies.

- [ ] **Step 3: Spot-check one template from each location**

Run: `grep -A 20 "## External References" arckit-claude/templates/requirements-template.md`
Run: `grep -A 20 "## External References" .arckit/templates/requirements-template.md`

Expected: Both show the new 3-table structure with Document Register, Citations, and Unreferenced Documents.

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/requirements-template.md arckit-claude/templates/risk-register-template.md arckit-claude/templates/hld-review-template.md arckit-claude/templates/sobc-template.md arckit-claude/templates/adr-template.md arckit-claude/templates/evaluation-criteria-template.md arckit-claude/templates/dpia-template.md arckit-claude/templates/data-model-template.md arckit-claude/templates/sow-template.md arckit-claude/templates/stakeholder-drivers-template.md
git add .arckit/templates/requirements-template.md .arckit/templates/risk-register-template.md .arckit/templates/hld-review-template.md .arckit/templates/sobc-template.md .arckit/templates/adr-template.md .arckit/templates/evaluation-criteria-template.md .arckit/templates/dpia-template.md .arckit/templates/data-model-template.md .arckit/templates/sow-template.md .arckit/templates/stakeholder-drivers-template.md
git commit -m "feat: add citation traceability to core governance templates (#158)"
```

---

### Task 3: Update templates — Batch 2 (strategy & planning, 8 templates)

Same replacement pattern as Task 2.

**Files:**
- Modify: `arckit-claude/templates/architecture-strategy-template.md` + `.arckit/templates/architecture-strategy-template.md`
- Modify: `arckit-claude/templates/roadmap-template.md` + `.arckit/templates/roadmap-template.md`
- Modify: `arckit-claude/templates/project-plan-template.md` + `.arckit/templates/project-plan-template.md`
- Modify: `arckit-claude/templates/backlog-template.md` + `.arckit/templates/backlog-template.md`
- Modify: `arckit-claude/templates/story-template.md` + `.arckit/templates/story-template.md`
- Modify: `arckit-claude/templates/architecture-principles-template.md` + `.arckit/templates/architecture-principles-template.md`
- Modify: `arckit-claude/templates/traceability-matrix-template.md` + `.arckit/templates/traceability-matrix-template.md`
- Modify: `arckit-claude/templates/architecture-diagram-template.md` + `.arckit/templates/architecture-diagram-template.md`

- [ ] **Step 1: Update all 8 templates in `arckit-claude/templates/`**
- [ ] **Step 2: Update all 8 templates in `.arckit/templates/`**
- [ ] **Step 3: Spot-check**
- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/architecture-strategy-template.md arckit-claude/templates/roadmap-template.md arckit-claude/templates/project-plan-template.md arckit-claude/templates/backlog-template.md arckit-claude/templates/story-template.md arckit-claude/templates/architecture-principles-template.md arckit-claude/templates/traceability-matrix-template.md arckit-claude/templates/architecture-diagram-template.md
git add .arckit/templates/architecture-strategy-template.md .arckit/templates/roadmap-template.md .arckit/templates/project-plan-template.md .arckit/templates/backlog-template.md .arckit/templates/story-template.md .arckit/templates/architecture-principles-template.md .arckit/templates/traceability-matrix-template.md .arckit/templates/architecture-diagram-template.md
git commit -m "feat: add citation traceability to strategy and planning templates (#158)"
```

---

### Task 4: Update templates — Batch 3 (security & compliance, 8 templates)

Same replacement pattern as Task 2.

**Files:**
- Modify: `arckit-claude/templates/ukgov-secure-by-design-template.md` + `.arckit/templates/ukgov-secure-by-design-template.md`
- Modify: `arckit-claude/templates/mod-secure-by-design-template.md` + `.arckit/templates/mod-secure-by-design-template.md`
- Modify: `arckit-claude/templates/conformance-assessment-template.md` + `.arckit/templates/conformance-assessment-template.md`
- Modify: `arckit-claude/templates/tcop-review-template.md` + `.arckit/templates/tcop-review-template.md`
- Modify: `arckit-claude/templates/service-assessment-prep-template.md` + `.arckit/templates/service-assessment-prep-template.md`
- Modify: `arckit-claude/templates/uk-gov-ai-playbook-template.md` + `.arckit/templates/uk-gov-ai-playbook-template.md`
- Modify: `arckit-claude/templates/uk-gov-atrs-template.md` + `.arckit/templates/uk-gov-atrs-template.md`
- Modify: `arckit-claude/templates/jsp-936-template.md` + `.arckit/templates/jsp-936-template.md`

- [ ] **Step 1: Update all 8 templates in `arckit-claude/templates/`**
- [ ] **Step 2: Update all 8 templates in `.arckit/templates/`**
- [ ] **Step 3: Spot-check**
- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/ukgov-secure-by-design-template.md arckit-claude/templates/mod-secure-by-design-template.md arckit-claude/templates/conformance-assessment-template.md arckit-claude/templates/tcop-review-template.md arckit-claude/templates/service-assessment-prep-template.md arckit-claude/templates/uk-gov-ai-playbook-template.md arckit-claude/templates/uk-gov-atrs-template.md arckit-claude/templates/jsp-936-template.md
git add .arckit/templates/ukgov-secure-by-design-template.md .arckit/templates/mod-secure-by-design-template.md .arckit/templates/conformance-assessment-template.md .arckit/templates/tcop-review-template.md .arckit/templates/service-assessment-prep-template.md .arckit/templates/uk-gov-ai-playbook-template.md .arckit/templates/uk-gov-atrs-template.md .arckit/templates/jsp-936-template.md
git commit -m "feat: add citation traceability to security and compliance templates (#158)"
```

---

### Task 5: Update templates — Batch 4 (operations & platform, 8 templates)

Same replacement pattern as Task 2.

**Files:**
- Modify: `arckit-claude/templates/devops-template.md` + `.arckit/templates/devops-template.md`
- Modify: `arckit-claude/templates/mlops-template.md` + `.arckit/templates/mlops-template.md`
- Modify: `arckit-claude/templates/finops-template.md` + `.arckit/templates/finops-template.md`
- Modify: `arckit-claude/templates/operationalize-template.md` + `.arckit/templates/operationalize-template.md`
- Modify: `arckit-claude/templates/platform-design-template.md` + `.arckit/templates/platform-design-template.md`
- Modify: `arckit-claude/templates/data-mesh-contract-template.md` + `.arckit/templates/data-mesh-contract-template.md`
- Modify: `arckit-claude/templates/servicenow-design-template.md` + `.arckit/templates/servicenow-design-template.md`
- Modify: `arckit-claude/templates/dos-requirements-template.md` + `.arckit/templates/dos-requirements-template.md`

- [ ] **Step 1: Update all 8 templates in `arckit-claude/templates/`**
- [ ] **Step 2: Update all 8 templates in `.arckit/templates/`**
- [ ] **Step 3: Spot-check**
- [ ] **Step 4: Commit**

```bash
git add arckit-claude/templates/devops-template.md arckit-claude/templates/mlops-template.md arckit-claude/templates/finops-template.md arckit-claude/templates/operationalize-template.md arckit-claude/templates/platform-design-template.md arckit-claude/templates/data-mesh-contract-template.md arckit-claude/templates/servicenow-design-template.md arckit-claude/templates/dos-requirements-template.md
git add .arckit/templates/devops-template.md .arckit/templates/mlops-template.md .arckit/templates/finops-template.md .arckit/templates/operationalize-template.md .arckit/templates/platform-design-template.md .arckit/templates/data-mesh-contract-template.md .arckit/templates/servicenow-design-template.md .arckit/templates/dos-requirements-template.md
git commit -m "feat: add citation traceability to operations and platform templates (#158)"
```

---

### Task 6: Update templates — Batch 5 (diagrams, data & research, 11 templates)

Same replacement pattern as Task 2. All 11 templates in this batch have the existing `## External References` section.

**Files:**
- Modify: `arckit-claude/templates/wardley-map-template.md` + `.arckit/templates/wardley-map-template.md`
- Modify: `arckit-claude/templates/research-findings-template.md` + `.arckit/templates/research-findings-template.md`
- Modify: `arckit-claude/templates/datascout-template.md` + `.arckit/templates/datascout-template.md`
- Modify: `arckit-claude/templates/aws-research-template.md` + `.arckit/templates/aws-research-template.md`
- Modify: `arckit-claude/templates/azure-research-template.md` + `.arckit/templates/azure-research-template.md`
- Modify: `arckit-claude/templates/gcp-research-template.md` + `.arckit/templates/gcp-research-template.md`
- Modify: `arckit-claude/templates/gov-reuse-template.md` + `.arckit/templates/gov-reuse-template.md`
- Modify: `arckit-claude/templates/gov-code-search-template.md` + `.arckit/templates/gov-code-search-template.md`
- Modify: `arckit-claude/templates/gov-landscape-template.md` + `.arckit/templates/gov-landscape-template.md`
- Modify: `arckit-claude/templates/principles-compliance-assessment-template.md` + `.arckit/templates/principles-compliance-assessment-template.md`
- Modify: `arckit-claude/templates/dld-review-template.md` + `.arckit/templates/dld-review-template.md`

- [ ] **Step 1: Check which templates in this batch lack `## External References`**

Run: `for f in wardley-map-template.md research-findings-template.md datascout-template.md aws-research-template.md azure-research-template.md gcp-research-template.md gov-reuse-template.md gov-code-search-template.md gov-landscape-template.md principles-compliance-assessment-template.md dld-review-template.md; do echo -n "$f: "; grep -c "## External References" arckit-claude/templates/$f; done`

For templates that return `0`, add the new External References section before the standard footer (`---\n\n**Generated by**:`).

- [ ] **Step 2: Update all 11 templates in `arckit-claude/templates/`**
- [ ] **Step 3: Update all 11 templates in `.arckit/templates/`**
- [ ] **Step 4: Spot-check**
- [ ] **Step 5: Commit**

```bash
git add arckit-claude/templates/wardley-map-template.md arckit-claude/templates/research-findings-template.md arckit-claude/templates/datascout-template.md arckit-claude/templates/aws-research-template.md arckit-claude/templates/azure-research-template.md arckit-claude/templates/gcp-research-template.md arckit-claude/templates/gov-reuse-template.md arckit-claude/templates/gov-code-search-template.md arckit-claude/templates/gov-landscape-template.md arckit-claude/templates/principles-compliance-assessment-template.md arckit-claude/templates/dld-review-template.md
git add .arckit/templates/wardley-map-template.md .arckit/templates/research-findings-template.md .arckit/templates/datascout-template.md .arckit/templates/aws-research-template.md .arckit/templates/azure-research-template.md .arckit/templates/gcp-research-template.md .arckit/templates/gov-reuse-template.md .arckit/templates/gov-code-search-template.md .arckit/templates/gov-landscape-template.md .arckit/templates/principles-compliance-assessment-template.md .arckit/templates/dld-review-template.md
git commit -m "feat: add citation traceability to diagram, data and research templates (#158)"
```

---

### Task 7: Update templates — Batch 6 (remaining templates that need the section added)

Check for any templates that were not covered in Batches 1-5. These include templates for commands in the 43-command list (`maturity-model`, `traceability`, `glossary`, `dfd`, Wardley sub-commands) plus `wardley-doctrine-template.md` for consistency even though `wardley.doctrine` is not in the 43-command list.

**Files:**
- Check and modify as needed (both `arckit-claude/templates/` and `.arckit/templates/`)

- [ ] **Step 1: Identify remaining templates**

Cross-reference the 43-command list against Batches 1-6. For each command, check if its template exists and was already updated. List any gaps.

Run: `for cmd in maturity-model traceability glossary dfd wardley.value-chain wardley.climate wardley.gameplay wardley.doctrine; do echo -n "$cmd: "; ls arckit-claude/templates/*${cmd}*template* 2>/dev/null || echo "NO TEMPLATE"; done`

- [ ] **Step 2: Update any remaining templates in both locations**
- [ ] **Step 3: Commit**

```bash
git add arckit-claude/templates/ .arckit/templates/
git commit -m "feat: add citation traceability to remaining templates (#158)"
```

---

### Task 8: Update commands — Batch 1 (core governance, 10 commands)

Add the citation instruction line to each command after the existing "Read any external documents" block. The line to add:

```markdown
   - **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.
```

Insert this as a new bullet point at the end of the "Read external documents and policies" step (step 3 in most commands), maintaining the existing indentation level.

**Files:**
- Modify: `arckit-claude/commands/requirements.md`
- Modify: `arckit-claude/commands/risk.md`
- Modify: `arckit-claude/commands/hld-review.md`
- Modify: `arckit-claude/commands/sobc.md`
- Modify: `arckit-claude/commands/adr.md`
- Modify: `arckit-claude/commands/evaluate.md`
- Modify: `arckit-claude/commands/dpia.md`
- Modify: `arckit-claude/commands/data-model.md`
- Modify: `arckit-claude/commands/sow.md`
- Modify: `arckit-claude/commands/stakeholders.md`

- [ ] **Step 1: Update all 10 commands**

For each command, find the step that reads external documents (look for `Read any **external documents**`) and add the citation instruction bullet at the end of that step's bullet list.

- [ ] **Step 2: Spot-check**

Run: `grep -A 2 "Citation traceability" arckit-claude/commands/requirements.md`

Expected: The citation instruction line followed by the next step.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/requirements.md arckit-claude/commands/risk.md arckit-claude/commands/hld-review.md arckit-claude/commands/sobc.md arckit-claude/commands/adr.md arckit-claude/commands/evaluate.md arckit-claude/commands/dpia.md arckit-claude/commands/data-model.md arckit-claude/commands/sow.md arckit-claude/commands/stakeholders.md
git commit -m "feat: add citation instructions to core governance commands (#158)"
```

---

### Task 9: Update commands — Batch 2 (strategy & planning, 8 commands)

Same insertion pattern as Task 8.

**Files:**
- Modify: `arckit-claude/commands/strategy.md`
- Modify: `arckit-claude/commands/roadmap.md`
- Modify: `arckit-claude/commands/plan.md`
- Modify: `arckit-claude/commands/backlog.md`
- Modify: `arckit-claude/commands/story.md`
- Modify: `arckit-claude/commands/diagram.md`
- Modify: `arckit-claude/commands/dfd.md`
- Modify: `arckit-claude/commands/principles-compliance.md`

- [ ] **Step 1: Update all 8 commands**
- [ ] **Step 2: Spot-check**
- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/strategy.md arckit-claude/commands/roadmap.md arckit-claude/commands/plan.md arckit-claude/commands/backlog.md arckit-claude/commands/story.md arckit-claude/commands/diagram.md arckit-claude/commands/dfd.md arckit-claude/commands/principles-compliance.md
git commit -m "feat: add citation instructions to strategy and planning commands (#158)"
```

---

### Task 10: Update commands — Batch 3 (security & compliance, 8 commands)

Same insertion pattern as Task 8.

**Files:**
- Modify: `arckit-claude/commands/secure.md`
- Modify: `arckit-claude/commands/mod-secure.md`
- Modify: `arckit-claude/commands/conformance.md`
- Modify: `arckit-claude/commands/tcop.md`
- Modify: `arckit-claude/commands/service-assessment.md`
- Modify: `arckit-claude/commands/ai-playbook.md`
- Modify: `arckit-claude/commands/atrs.md`
- Modify: `arckit-claude/commands/jsp-936.md`

- [ ] **Step 1: Update all 8 commands**
- [ ] **Step 2: Spot-check**
- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/secure.md arckit-claude/commands/mod-secure.md arckit-claude/commands/conformance.md arckit-claude/commands/tcop.md arckit-claude/commands/service-assessment.md arckit-claude/commands/ai-playbook.md arckit-claude/commands/atrs.md arckit-claude/commands/jsp-936.md
git commit -m "feat: add citation instructions to security and compliance commands (#158)"
```

---

### Task 11: Update commands — Batch 4 (operations, platform & remaining, 17 commands)

Same insertion pattern as Task 8.

**Files:**
- Modify: `arckit-claude/commands/wardley.md`
- Modify: `arckit-claude/commands/wardley.value-chain.md`
- Modify: `arckit-claude/commands/wardley.climate.md`
- Modify: `arckit-claude/commands/wardley.gameplay.md`
- Modify: `arckit-claude/commands/dos.md`
- Modify: `arckit-claude/commands/dld-review.md`
- Modify: `arckit-claude/commands/devops.md`
- Modify: `arckit-claude/commands/mlops.md`
- Modify: `arckit-claude/commands/finops.md`
- Modify: `arckit-claude/commands/operationalize.md`
- Modify: `arckit-claude/commands/platform-design.md`
- Modify: `arckit-claude/commands/data-mesh-contract.md`
- Modify: `arckit-claude/commands/servicenow.md`
- Modify: `arckit-claude/commands/glossary.md`
- Modify: `arckit-claude/commands/maturity-model.md`
- Modify: `arckit-claude/commands/traceability.md`
- Modify: `arckit-claude/commands/principles.md`

- [ ] **Step 1: Update all 17 commands**
- [ ] **Step 2: Spot-check**
- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/wardley.md arckit-claude/commands/wardley.value-chain.md arckit-claude/commands/wardley.climate.md arckit-claude/commands/wardley.gameplay.md arckit-claude/commands/dos.md arckit-claude/commands/dld-review.md arckit-claude/commands/devops.md arckit-claude/commands/mlops.md arckit-claude/commands/finops.md arckit-claude/commands/operationalize.md arckit-claude/commands/platform-design.md arckit-claude/commands/data-mesh-contract.md arckit-claude/commands/servicenow.md arckit-claude/commands/glossary.md arckit-claude/commands/maturity-model.md arckit-claude/commands/traceability.md arckit-claude/commands/principles.md
git commit -m "feat: add citation instructions to operations and remaining commands (#158)"
```

---

### Task 12: Update agents (7 agents)

Add the same citation instruction to agents that read external documents. The insertion point varies per agent — find the step where external documents are read and add the citation bullet.

**Files:**
- Modify: `arckit-claude/agents/arckit-research.md`
- Modify: `arckit-claude/agents/arckit-datascout.md`
- Modify: `arckit-claude/agents/arckit-framework.md`
- Modify: `arckit-claude/agents/arckit-aws-research.md`
- Modify: `arckit-claude/agents/arckit-azure-research.md`
- Modify: `arckit-claude/agents/arckit-gcp-research.md`
- Modify: `arckit-claude/agents/arckit-gov-reuse.md`

- [ ] **Step 1: Update all 7 agents**

For each agent, find the section where external documents are read and add:

```markdown
   - **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.
```

- [ ] **Step 2: Spot-check**

Run: `grep -c "Citation traceability" arckit-claude/agents/arckit-*.md`

Expected: 7 files show count of 1.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/agents/arckit-research.md arckit-claude/agents/arckit-datascout.md arckit-claude/agents/arckit-framework.md arckit-claude/agents/arckit-aws-research.md arckit-claude/agents/arckit-azure-research.md arckit-claude/agents/arckit-gcp-research.md arckit-claude/agents/arckit-gov-reuse.md
git commit -m "feat: add citation instructions to research agents (#158)"
```

---

### Task 13: Run converter and verify extension output

Generate all extension formats and verify the citation instructions file was copied.

**Files:**
- Run: `scripts/converter.py`
- Verify: Extension directories contain the new reference file

- [ ] **Step 1: Run the converter**

Run: `python scripts/converter.py`

Expected: Converter completes without errors.

- [ ] **Step 2: Verify citation instructions copied to extensions**

Run: `for dir in arckit-codex arckit-opencode arckit-gemini arckit-copilot; do echo -n "$dir: "; ls $dir/references/citation-instructions.md 2>/dev/null && echo "OK" || echo "MISSING"; done`

Expected: All 4 extensions show "OK".

- [ ] **Step 3: Verify path rewriting in a Codex command**

Run: `grep "citation-instructions" arckit-codex/skills/arckit-requirements/SKILL.md 2>/dev/null || grep "citation-instructions" .codex/prompts/arckit.requirements.md 2>/dev/null`

Expected: Path shows `.arckit/references/citation-instructions.md` (not `${CLAUDE_PLUGIN_ROOT}`).

- [ ] **Step 4: Verify path rewriting in a Gemini command**

Run: `grep "citation-instructions" arckit-gemini/commands/arckit/requirements.toml 2>/dev/null`

Expected: Path shows `~/.gemini/extensions/arckit/references/citation-instructions.md`.

- [ ] **Step 5: Commit converter output**

```bash
git add arckit-codex/ arckit-opencode/ arckit-gemini/ arckit-copilot/ .codex/ .opencode/
git commit -m "chore: regenerate extension formats with citation support (#158)"
```

---

### Task 14: Final verification

- [ ] **Step 1: Count citation instruction references across commands**

Run: `grep -rl "Citation traceability" arckit-claude/commands/ | wc -l`

Expected: 43

- [ ] **Step 2: Count citation instruction references across agents**

Run: `grep -rl "Citation traceability" arckit-claude/agents/ | wc -l`

Expected: 7

- [ ] **Step 3: Verify all templates have new External References structure**

Run: `grep -rl "### Document Register" arckit-claude/templates/ | wc -l`

Expected: ~52 (45 existing + ~7 added by Task 7)

- [ ] **Step 4: Verify no old-format External References remain**

Run: `grep -l "Key Extractions" arckit-claude/templates/ | wc -l`

Expected: 0 (all old tables replaced)

- [ ] **Step 5: Verify `.arckit/templates/` stays in sync with `arckit-claude/templates/`**

Run: `diff <(ls arckit-claude/templates/ | sort) <(ls .arckit/templates/ | sort)`

Expected: No differences (or only expected differences for templates that exist in one location only).

- [ ] **Step 6: Run markdown lint**

Run: `npx markdownlint-cli2 "arckit-claude/references/citation-instructions.md"`

Expected: No errors.

---

### Task 15: Update CHANGELOG

**Files:**
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add citation traceability entry to CHANGELOG**

Add under the `## [Unreleased]` section (or create it if it doesn't exist):

```markdown
### Added
- Citation traceability for external documents — generated artifacts now include inline citation markers (`[DOC-CN]`) and a structured "External References" section with Document Register, Citations, and Unreferenced Documents tables (#158)
- Shared citation instructions file (`arckit-claude/references/citation-instructions.md`) referenced by all 43 commands and 7 agents that read external documents
```

- [ ] **Step 2: Commit**

```bash
git add CHANGELOG.md
git commit -m "docs: add citation traceability to CHANGELOG (#158)"
```
