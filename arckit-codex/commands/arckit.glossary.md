---
description: "Generate a consolidated project glossary of terms, acronyms, and definitions from existing artifacts"
---

You are helping an enterprise architect create a **Project Glossary** document. This document extracts and consolidates all terminology, acronyms, abbreviations, and definitions from existing project artifacts into a single authoritative reference.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements Specification) — Extract: Domain terminology, requirement ID prefixes (BR/FR/NFR/INT/DR), technical terms, business terms, acronyms used in requirements
  - If missing: Note that requirements terminology is unavailable; glossary will have limited domain coverage
- **DATA** (Data Model) — Extract: Entity names, attribute definitions, data types, relationship terminology, cardinality terms
  - If missing: Note that data model terminology is unavailable; glossary will lack entity/attribute definitions

**OPTIONAL** (read if available, skip silently if missing):

- **STKE** (Stakeholder Analysis) — Extract: Stakeholder role titles, organizational terms, governance bodies, engagement terminology
- **PRIN** (Architecture Principles, in 000-global) — Extract: Principle names, governance terminology, compliance terms
- **SOBC** (Strategic Outline Business Case) — Extract: Financial/business terms, investment terminology, benefits realisation terms
- **RSCH** (Research Report) — Extract: Technology terms, vendor-specific terminology, product names, industry standards
- **ADR** (Architecture Decision Records) — Extract: Decision context terminology, architectural pattern names, technology choices
- **STRAT** (Architecture Strategy) — Extract: Strategic themes, capability terms, maturity model terminology
- **RISK** (Risk Register) — Extract: Risk categories, mitigation terms, likelihood/impact terminology

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract domain-specific terminology, organizational jargon, policy terms
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise-wide terminology, cross-project terms
- If no external docs found but they would improve the output, ask: "Do you have any existing glossaries, data dictionaries, or terminology standards? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `.arckit/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Glossary Template

Load the glossary template structure:

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/glossary-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `.arckit/templates/glossary-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize glossary`

### 3. Extract Terms from Artifacts

Systematically scan all available artifacts and extract:

- **Domain-specific terms** — Business and technical terms with definitions inferred from context
- **Acronyms and abbreviations** — Every acronym used in any artifact, with full expansion
- **Technical standards referenced** — Standard names with versions and URLs where available (e.g., ISO 27001:2022, WCAG 2.2)
- **Requirement ID prefix meanings** — BR = Business Requirement, FR = Functional Requirement, NFR = Non-Functional Requirement, INT = Integration Requirement, DR = Data Requirement, and any sub-prefixes (NFR-P = Performance, NFR-SEC = Security, etc.)
- **Entity names from data models** — Entity definitions, attribute names, data types, relationship terms
- **Stakeholder role titles** — Formal role names and their descriptions (e.g., SIRO, IAO, SRO)
- **Architecture pattern names** — Named patterns referenced in ADRs or strategy (e.g., CQRS, Event Sourcing, Microservices)
- **Governance and compliance terms** — Framework names, assessment criteria, maturity levels
- **Financial and procurement terms** — Investment terminology, procurement vehicle names (G-Cloud, DOS)

For each term, record:

1. **Term** — The word, phrase, or acronym
2. **Definition** — Clear, concise definition (inferred from artifact context)
3. **Source** — Which artifact(s) the term appears in (by Document ID)
4. **Category** — One of: Business, Technical, Governance, Financial, Data, Security, or domain-specific

### 4. Generate Glossary

Populate the template with extracted terms, organized alphabetically within categories. Each entry should:

- Provide a clear, jargon-free definition
- Reference the source artifact Document ID(s)
- Note the category for filtering
- Cross-reference related terms where applicable
- Flag any terms with inconsistent definitions across artifacts

Include a separate **Acronyms** table for quick reference.

### 5. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-GLOS-v1.0` (for filename: `ARC-{PROJECT_ID}-GLOS-v1.0.md`)

- Set Document Type: "Project Glossary"
- Set owner, dates
- Review cycle: Quarterly (default for glossary documents)

### 6. Quality Check

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

### 7. Write the Glossary File

**IMPORTANT**: The glossary document can be a large document depending on the number of artifacts scanned. You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{project-dir}/ARC-{PROJECT_ID}-GLOS-v1.0.md
```

Use the Write tool with the complete glossary content following the template structure.

### 8. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Project Glossary Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-GLOS-v1.0.md`
**Document ID**: ARC-{PROJECT_ID}-GLOS-v1.0

### Glossary Overview
- **Total Terms Defined**: [N]
- **Acronyms Catalogued**: [N]
- **Standards Referenced**: [N]
- **Source Artifacts Scanned**: [N]

### Terms by Category
- **Business**: [N] terms
- **Technical**: [N] terms
- **Governance**: [N] terms
- **Financial**: [N] terms
- **Data**: [N] terms
- **Security**: [N] terms

### Source Artifacts
- [List each artifact scanned with Document ID]

### Coverage Gaps
- [Note any missing artifacts that would add terminology]
- [Note any terms with ambiguous or missing definitions]
- [Note any inconsistencies found across artifacts]

### Next Steps
1. Review glossary with domain experts for accuracy
2. Validate acronym expansions with stakeholders
3. Add missing definitions for flagged terms
4. Review data model terminology: `/arckit:data-model`

**File location**: `projects/{project-dir}/ARC-{PROJECT_ID}-GLOS-v1.0.md`
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-GLOS-v{VERSION}` (e.g., `ARC-001-GLOS-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "Project Glossary"
- `ARC-[PROJECT_ID]-GLOS-v[VERSION]` -> Construct using format above
- `[COMMAND]` -> "arckit.glossary"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` -> Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` -> Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` -> Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date -> Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` -> [PENDING]
- `[APPROVER_NAME]` -> [PENDING]
- `[DISTRIBUTION_LIST]` -> Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:glossary` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:glossary` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

## Output Instructions

**CRITICAL - Token Efficiency**:

- Write the full glossary to file using the Write tool
- DO NOT output the full document content in the response
- Show ONLY the summary section (Step 8) to the user
- The glossary can contain hundreds of terms — outputting it in chat wastes tokens

## Important Notes

1. **Extraction, Not Invention**: This command extracts and consolidates terminology from existing artifacts. It should NOT invent new terms or definitions not grounded in the project artifacts. If a definition must be inferred, note it as "Inferred from context".

2. **Use Write Tool**: The glossary document can be large depending on the number of artifacts. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Consistency Checking**: If the same term is defined differently across artifacts, flag the inconsistency and use the most authoritative source (typically the artifact that introduced the term).

4. **Alphabetical Organization**: Terms within each category must be sorted alphabetically for easy lookup.

5. **Cross-References**: Where terms are related (e.g., "SRO" relates to "Senior Responsible Owner"), include cross-references to help readers navigate.

6. **Living Document**: The glossary should be updated when new artifacts are created. Note this in the document's maintenance section.

7. **Integration with Other Commands**:
   - Glossary is informed by: `/arckit:requirements`, `/arckit:data-model`, `/arckit:stakeholders`, `/arckit:principles`, `/arckit:sobc`, `/arckit:research`, `/arckit:adr`, `/arckit:strategy`, `/arckit:risk`
   - Glossary feeds into: `/arckit:data-model` (validated entity/attribute names)

8. **Version Management**: If a glossary already exists (ARC-*-GLOS-v*.md), create a new version (v2.0) rather than overwriting. Glossaries should be versioned to track terminology evolution.

9. **Scope**: If the user specifies "all projects", scan artifacts across all project directories and create a consolidated glossary in `projects/000-global/`.

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:data-model` -- Review data model for entity/attribute terminology
