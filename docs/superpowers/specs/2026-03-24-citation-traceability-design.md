# Citation Traceability for External Documents

**Date:** 2026-03-24
**Issue:** [#158](https://github.com/tractorjuice/arc-kit/issues/158)
**Status:** IMPLEMENTED (PR #207)

## Problem

When ArcKit commands read external documents (from `external/`, `policies/`, `vendors/`), the generated artifacts contain no record of what was read or which parts informed the output. Clients cannot verify that ArcKit reviewed all input documents or trace findings back to source material.

## Solution

Add citation traceability to all commands that read external documents. Generated artifacts will contain:

1. **Inline citation markers** next to findings informed by source documents (e.g., `[PP-C1]`)
2. **Enhanced External References section** with citation details and quoted passages (evolving the existing `## External References` section already present in 45 templates)

## Approach

**Shared citation block + template evolution.** A single reusable citation instructions file is referenced by all commands. The existing `## External References` section in templates is enriched with citation support. This keeps citation logic in one place and minimises per-command changes.

## Design

### 1. Shared Citation Instructions File

**File:** `arckit-claude/references/citation-instructions.md`

Contains the reusable citation logic that all commands reference:

- **Abbreviation derivation rules** — First letters of significant words from filename (strip extensions, version numbers, common words like "the/and/of"):
  - `privacy-policy.pdf` → `PP`
  - `security-framework-v2.docx` → `SF`
  - `data-protection-impact-assessment.pdf` → `DPIA`
- **Collision handling** — If two documents produce the same abbreviation, append a numeric suffix (e.g., `PP`, `PP2`). Alternatively, use more letters from distinguishing words (e.g., `PRIV` vs `PROC`)
- **Citation ID format** — `[{ABBREV}-C{N}]` where N is sequential per document (e.g., `[PP-C1]`, `[PP-C2]`, `[SF-C1]`)
- **Inline marker placement** — Place immediately after the requirement, finding, or statement informed by the source. E.g., `The system must encrypt data at rest [SF-C1] and in transit [SF-C2].`
- **Category assignment** — Each citation gets a usage category (e.g., "Security Requirement", "Compliance Constraint", "Risk Factor", "Design Decision")
- **Quoting rules** — Quote the specific passage, 1-3 sentences. Include page/section reference if identifiable
- **External References structure** — Standardised table format (see Section 2)

This file is copied to extensions by `converter.py` via the existing `copy_extension_files()` mechanism (same as `quality-checklist.md`).

### 2. Evolve Existing External References Section

45 templates already contain a `## External References` section with this structure:

```markdown
## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |
```

This section is **replaced** with an enriched version that adds citation support:

```markdown
## External References

> This section provides traceability from generated content back to source documents.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| PP | privacy-policy.pdf | Policy | external/ | Organisation privacy policy |
| SF | security-framework-v2.docx | Standard | 000-global/policies/ | Enterprise security framework |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| [PP-C1] | PP | Section 3.2 | Compliance Constraint | "All personal data must be..." |
| [PP-C2] | PP | Section 5.1 | Data Requirement | "Retention periods shall not..." |
| [SF-C1] | SF | Page 12 | Security Requirement | "Encryption at rest using AES-256..." |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| org-chart.pdf | external/ | No content relevant to this artifact |
```

**Structure:**

- **Document Register** — Maps abbreviations to filenames, types, and locations. Preserves the existing columns (Document, Type, Source) while adding Doc ID for citation cross-referencing
- **Citations** — References with quoted passages and categories. Cross-references inline markers in the document body
- **Unreferenced Documents** — Lists external files read but not cited, with reason. Verifies ArcKit reviewed all documents
- **When no external documents exist** — Section displays a single-row placeholder: `| *None provided* | — | — | — | — |` matching the new Document Register columns
- **Templates without existing External References** — A small number of templates (e.g., `maturity-model-template.md`, `wardley-doctrine-template.md`) lack the section entirely and need it added rather than evolved

### 3. Command Prompt Modifications

Each command that reads external documents gets one instruction line added after the existing "Read any external documents" step:

```
When referencing content from external documents, follow the citation instructions
in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation
markers next to findings informed by source documents and populate the
"External References" section in the template.
```

**All 43 commands requiring this addition:**

| Command | External Source Type |
|---------|---------------------|
| requirements | external/, policies/ |
| risk | external/, policies/ |
| hld-review | vendors/, external/ |
| sobc | external/, policies/ |
| adr | external/ |
| evaluate | external/ |
| dpia | external/ |
| data-model | external/ |
| sow | external/ |
| secure | external/, policies/ |
| conformance | external/, policies/ |
| stakeholders | external/ |
| principles | policies/ |
| strategy | external/ |
| roadmap | external/ |
| plan | external/ |
| backlog | external/ |
| story | external/ |
| diagram | external/ |
| dfd | external/ |
| wardley | external/ |
| wardley.value-chain | external/ |
| wardley.climate | external/ |
| wardley.gameplay | external/ |
| mod-secure | external/, policies/ |
| tcop | external/, policies/ |
| service-assessment | external/ |
| ai-playbook | external/ |
| atrs | external/ |
| jsp-936 | external/, policies/ |
| dos | external/ |
| dld-review | vendors/, external/ |
| devops | external/ |
| mlops | external/ |
| finops | external/ |
| operationalize | external/ |
| platform-design | external/ |
| data-mesh-contract | external/ |
| servicenow | external/ |
| glossary | external/ |
| principles-compliance | external/, policies/ |
| maturity-model | external/ |
| traceability | external/ |

**What does NOT change:**

- Command frontmatter stays as-is
- Existing command flow and structure unchanged
- Commands that don't read external documents are untouched (e.g., `score`, `customize`, `pages`, `framework`)
- Agents that read external documents (7 agents) get the same one-line addition

**Agents requiring this addition:**

| Agent | External Source Type |
|-------|---------------------|
| arckit-research | external/ |
| arckit-datascout | external/ |
| arckit-framework | external/ |
| arckit-aws-research | external/ |
| arckit-azure-research | external/ |
| arckit-gcp-research | external/ |
| arckit-gov-reuse | external/ |

### 4. Converter & Extension Handling

No converter code changes needed.

- `copy_extension_files()` already copies the `references/` directory to all extensions
- `rewrite_paths()` handles `${CLAUDE_PLUGIN_ROOT}` substitution per target
- Templates are copied as-is (static markdown the model populates)

**Path rewriting per target:**

| Target | Rewritten Path |
|--------|---------------|
| Claude Code | `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md` |
| Codex | `.arckit/references/citation-instructions.md` |
| OpenCode | `.arckit/references/citation-instructions.md` |
| Gemini | `~/.gemini/extensions/arckit/references/citation-instructions.md` |
| Copilot | `.arckit/references/citation-instructions.md` |

## Out of Scope

- **No `/arckit.cite` retrofit command** — Could be added later to back-fill citations into existing artifacts
- **No citation config file** — No `.arckit/citation-map.yaml`. Users who want different ID formats use `/arckit.customize`
- **No cross-artifact citation deduplication** — Each artifact has its own independent citation register
- **No automated citation validation** — No command to verify cited passages exist in source documents
- **No Pages dashboard changes** — Citations live in markdown artifacts, not rendered specially in HTML

## Deliverables

1. New file: `arckit-claude/references/citation-instructions.md`
2. Template changes: ~47 templates — evolve existing `## External References` section to enriched citation format (add section to templates that lack it)
3. Command changes: 43 commands get one citation instruction line
4. Agent changes: 7 agents that read external docs get the same line
5. Converter: No code changes (existing mechanisms handle it)
6. Run `converter.py` to regenerate all extension formats
7. Documentation: Update CHANGELOG
