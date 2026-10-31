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

The adapted template is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), based on [arc42](https://arc42.org/license/) by Peter Hruschka and Gernot Starke. ArcKit changed its explanatory text and added Document Control, source citations, a Gap Register and a Source Artefacts table. Preserve the template's licence, attribution and changes notice in every output, including when using a customised template. This notice applies to the adapted template; project-specific content and cited artefacts retain their own licences and confidentiality rules.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Project context**: Use the supplied project context for existing projects, source artefacts, external documents and global policies. If context is unavailable, list existing projects read-only, then inspect the selected project's directories and `projects/000-global/`. Do not create a project or request optional information while gathering context.

Resolve the existing project as described in step 1 before reading its sources. This command has no single mandatory artefact, because each arc42 section draws on different ones. If the project has **none** of REQ, STKE, PRIN, HLDR, DIAG or ADR, STOP without writing an ARC42 document: there is nothing to assemble. Name the missing source types and suggest `/arckit:principles`, `/arckit:stakeholders <project-name>` and `/arckit:requirements <project-name>`, then re-running `/arckit-arc42:arc42 <project-id>`.

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
- External documents are optional. If none are supplied, proceed with the existing ArcKit artefacts and record "No external documents supplied (default; not asked)" as an assumption. Offer once in the closing summary to place additional documents in `projects/{project-dir}/external/` and re-run; never pause for them.
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[AD-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Require an Existing Project

Match the project ID or name in the arguments to an existing project in the project context. If no project is named, use the explicitly active project, or the sole existing non-global project. Set `PROJECT_ID`, `PROJECT_PATH` and `{project-dir}` from that existing directory and its metadata.

Do not create a project, allocate a project number or write project metadata. An empty new project cannot supply this command's source artefacts.

If the requested project does not exist, STOP without writing files. Suggest `/arckit:stakeholders <project-name>` followed by `/arckit:requirements <project-name>` to initialise it and create source artefacts, then re-running `/arckit-arc42:arc42 <project-id>`. If the target is ambiguous, list the matching existing projects and request a re-run with an explicit ID; do not guess or start an interview.

### Gathering Rules

Read `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` and prefill from the arguments, project metadata and source artefacts. This assembly command needs no interview: optional information never blocks interactive, unattended, headless or recipe-worker runs.

- Use the document owner supplied in the arguments or project metadata; otherwise set the Owner field to `[PENDING]`. Do not infer ownership from authorship or ask for an owner.
- Use existing external documents when available; otherwise take the no-external-documents default above.
- Record every default taken in an **Assumptions** section in the document and an **Assumptions** line in the closing summary. For example: "Owner: [PENDING] (default; not asked)". Keep assumptions separate from sourced architecture content.
- Missing project or source prerequisites are actionable failures, not interview questions. Optional omissions are recorded defaults, not failures.

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
**Assumptions**: [Defaults taken, or "None"]

### Gaps to Fill
1. Section [N] — [what is missing] — run `/arckit:[command]`
2. ...

### Next Steps
1. Run the commands in the Gap Register, then re-run `/arckit-arc42:arc42` to produce the next version
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
- `[OWNER_NAME_AND_ROLE]` -> Document owner from arguments or project metadata; otherwise `[PENDING]` (default; not asked)
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` -> [PENDING]
- `[APPROVER_NAME]` -> [PENDING]
- `[DISTRIBUTION_LIST]` -> Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit-arc42:arc42` command | [PENDING] | [PENDING] |
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
