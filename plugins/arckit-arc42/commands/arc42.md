---
description: Assemble an arc42 architecture description from the project's existing ArcKit artefacts, with a gap register for the sections they do not cover
doc-type: ARC42
argument-hint: "<project ID or name, e.g. '001', 'booking system'>"
effort: high
handoffs:
  - command: diagram
    description: Fill an empty Context, Building Block, Runtime or Deployment view
    condition: "Gap Register lists a missing view"
  - command: adr
    description: Record a decision the Solution Strategy relies on but no ADR covers
  - command: risk
    description: Add risks or technical debt the description surfaced
  - command: glossary
    description: Build the glossary the arc42 Glossary section summarises
    condition: "No GLOS artefact exists"
  - command: traceability
    description: Check requirements trace through to the building blocks described
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an architect produce an **arc42 architecture description** for a project. [arc42](https://arc42.org) is a 12-section template for documenting the architecture of one software system. This command does not design the architecture: it assembles the description from the artefacts ArcKit has already produced, cites each one, and records which sections still have no source.

The arc42 template is by Peter Hruschka and Gernot Starke and is published under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The ArcKit template keeps that attribution; do not remove it.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

This command has no single mandatory artefact, because each arc42 section draws on different ones. If the project has **none** of REQ, STKE, PRIN, HLDR, DIAG or ADR, STOP: there is nothing to assemble. Tell the user to run `/arckit:principles`, `/arckit:stakeholders` and `/arckit:requirements` first.

Read every artefact below that exists. For a multi-instance type, read every instance: ADRs are in `projects/{project-dir}/decisions/`, and DIAG and DFD documents are in `projects/{project-dir}/diagrams/`. Where more than one version of an artefact exists, read the latest.

| Code | Artefact | Feeds arc42 section |
|------|----------|---------------------|
| **REQ** | Requirements | 1 (BR goals), 2 (constraints stated as requirements), 10 (NFRs) |
| **STKE** | Stakeholder Analysis | 1.3 Stakeholders |
| **SOBC** | Strategic Outline Business Case | 1 (business drivers) |
| **PRIN** | Architecture Principles (in `000-global`) | 2 Constraints, 4 Solution Strategy |
| **STRAT** | Architecture Strategy | 4 Solution Strategy |
| **WARD** | Wardley Map (in `wardley-maps/`) | 4 Solution Strategy (build-versus-buy positioning) |
| **DIAG** | Architecture Diagrams | 3 (C4 Context), 5 (C4 Container), 6 (Sequence), 7 (Deployment) |
| **DFD** | Data Flow Diagram | 3.2 Technical Context, 6 Runtime View |
| **HLDR** / **DLDR** | High- and Detailed-Level Design Reviews | 4, 5, 8 |
| **ADR** | Architecture Decision Records | 4 Solution Strategy, 9 Architecture Decisions |
| **DATA** | Data Model | 5 Building Block View, 8 (persistence and domain model) |
| **PLAT** | Platform Design | 5, 7 Deployment View |
| **DEVOPS** / **OPS** | DevOps Strategy, Operational Readiness | 7 Deployment View, 8 (operations concepts) |
| **SECD** | Secure by Design | 8 (security concepts) |
| **RISK** | Risk Register | 11 Risks and Technical Debt |
| **CDAU** | Codebase Audit (in `audits/`) | 11 (technical debt found in code) |
| **GLOS** | Glossary | 12 Glossary |

Also read any vendor HLD or DLD documents in `projects/{project-dir}/vendors/`; they feed sections 5, 6 and 7.

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing architecture descriptions, context diagrams, deployment topology and technical constraints
- Read any **enterprise standards** in `projects/000-global/external/` — extract organisation-wide constraints and mandated technologies for section 2
- If the project has no external documents but an existing architecture description would improve the output, ask: "Do you have an existing architecture document, or an earlier arc42 description of this system? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[AD-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user names a project that does not exist yet, create it:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

A newly created project has no artefacts, so the STOP rule in Prerequisites applies.

### 2. Read the arc42 Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/arc42-template.md` exists in the project root, then `.arckit/templates/arc42-template.md`
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/arc42-template.md` (default)
- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

> **Tip**: Users can customise templates with `/arckit:customize arc42`

### 3. Assemble Each Section

Work through the 12 sections in order. For each one:

1. **Summarise, don't copy.** Write a short summary of what the source artefacts say, and cite each by Document ID (for example, "see ARC-001-ADR-003-v1.0"). The source stays the authority; the arc42 description is a view over it. Copying whole sections makes the description drift as soon as a source changes.
2. **Reuse IDs exactly.** Quote requirement IDs (`BR-001`, `NFR-SEC-003`), ADR numbers and risk IDs as they appear in their source.
3. **Reproduce diagrams unchanged.** Where a DIAG or DFD artefact holds the diagram a view needs, copy its Mermaid or PlantUML code unchanged and cite it. Do not draw a new diagram that no artefact backs.
4. **Never invent.** If no source covers a section or subsection, write "Not yet documented." followed by one line on what is missing, and add an entry to the Gap Register (step 4). Do not fill it with plausible but unsourced content.
5. **Mark inferences.** Where you derive something rather than read it directly (for example, a quality scenario derived from an NFR's target), mark it "Inferred" and name the source it was derived from.

Section-specific rules:

- **1.2 Quality Goals**: the top three to five quality goals only, taken from the NFRs the requirements or stakeholders prioritise highest. The full list belongs in section 10.
- **2 Constraints**: separate technical, organisational and regulatory constraints. Principles from PRIN are constraints only where they are mandatory; say which.
- **5 Building Block View**: Level 1 is the system's containers or major components. Go to Level 2 only where a DLDR, vendor DLD or C4 Component diagram describes the internals.
- **8 Crosscutting Concepts**: cover only the concepts a source addresses (for example, security from SECD, persistence from DATA). List concepts a system of this kind would normally need but no source covers in the Gap Register, not in the section.
- **10 Quality Requirements**: the Quality Requirements Overview groups the NFRs by quality attribute. Write a quality scenario only for an NFR with a measurable target, and mark each one "Inferred".
- **11 Risks and Technical Debt**: risks come from RISK; list technical risks only and cite the risk ID. Technical debt comes from CDAU or DLDR findings. If neither exists, record the gap rather than guessing at debt.

### 4. Build the Gap Register and Source Artefacts Table

- **Gap Register**: one row per empty or partial section or subsection, giving the arc42 section, what is missing, and the `/arckit:*` command that would fill it. For example: section 6, no runtime scenarios, `/arckit:diagram sequence <scenario>`. Order rows by section number.
- **Source Artefacts**: one row per artefact read, with its Document ID, version and the sections it fed. Re-running this command after a source changes produces a new version of the description; this table is how a reader tells whether the current one is out of date.

### 5. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-ARC42-v{VERSION}` (for filename: `ARC-{PROJECT_ID}-ARC42-v{VERSION}.md`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set Document Type: "arc42 Architecture Description"
- Set owner, dates, status
- Review cycle: On change (the description is regenerated whenever its source artefacts change)

### 6. Quality Check

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **ARC42** per-type checks pass. Fix any failures before proceeding.

### 7. Write the File

**IMPORTANT**: An arc42 description is a substantial document. You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{project-dir}/ARC-{PROJECT_ID}-ARC42-v{VERSION}.md
```

### 8. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## arc42 Architecture Description Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-ARC42-v{VERSION}.md`
**Document ID**: ARC-{PROJECT_ID}-ARC42-v{VERSION}

### Section Coverage
| # | Section | Status | Sources |
|---|---------|--------|---------|
| 1 | Introduction and Goals | [Complete / Partial / Gap] | [Doc IDs] |
| ... | ... | ... | ... |
| 12 | Glossary | [Complete / Partial / Gap] | [Doc IDs] |

**Coverage**: [N] of 12 sections complete, [N] partial, [N] gaps
**Source Artefacts Read**: [N]

### Gaps to Fill
1. Section [N] — [what is missing] — run `/arckit:[command]`
2. ...

### Next Steps
1. Run the commands in the Gap Register, then re-run `/arckit:arc42` to produce the next version
2. Review the "Inferred" items with the architects who own the source artefacts
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-ARC42-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "arc42 Architecture Description"
- `[COMMAND]` -> "arckit.arc42"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` -> Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` -> Document owner (prompt user if not in metadata)
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` -> [PENDING]
- `[APPROVER_NAME]` -> [PENDING]
- `[DISTRIBUTION_LIST]` -> Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:arc42` command | [PENDING] | [PENDING] |
```

## Important Notes

1. **Assembly, Not Design**: This command describes the architecture the project's artefacts already record. It makes no architecture decisions. Where the artefacts disagree (for example, an ADR superseded by a later one, or a diagram that contradicts the HLD review), report the conflict in the section and cite both sources; do not resolve it silently.

2. **Use Write Tool**: ALWAYS use the Write tool to create the file. Never output the full content in chat.

3. **arc42 Structure Is Fixed**: Keep all 12 sections, in order, with their arc42 numbers and names, even when a section is a gap. Readers who know arc42 navigate by section number.

4. **Version Management**: If an arc42 description already exists (`ARC-*-ARC42-v*.md`), write the next version beside it rather than overwriting it, as `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` describes: a refresh after source changes is a minor increment, a description restructured after a major redesign is a major one.

5. **Integration with Other Commands**:
   - Informed by: `/arckit:requirements`, `/arckit:stakeholders`, `/arckit:principles`, `/arckit:diagram`, `/arckit:adr`, `/arckit:hld-review`, `/arckit:dld-review`, `/arckit:data-model`, `/arckit:platform-design`, `/arckit:secure`, `/arckit:risk`, `/arckit:glossary`
   - Feeds into: architecture reviews and hand-over to delivery teams, as the single description of the system's architecture

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
