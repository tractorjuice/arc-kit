---
description: Document the crosscutting concepts for arc42 section 8 (domain model, persistence, security, error handling, logging and more), each traced to the decisions and designs that settle it, with open concepts routed to ADRs
doc-type: CONC
argument-hint: "<project ID or name, e.g. '001', 'booking system'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: adr
    description: Decide an Open concept, choosing between the candidate approaches listed for it
    condition: "Any concept is Open or Partially decided"
  - command: data-model
    description: Document the domain model and persistence concepts no data model covers yet
    condition: "No DATA artefact exists"
  - command: secure
    description: Assess the security concept against Secure by Design
    condition: "No SECD artefact exists"
  - command: arc42
    description: Re-assemble the arc42 description so section 8 cites this document
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an architect document a system's **crosscutting concepts**: the rules, patterns and conventions that apply across many building blocks, such as the domain model, persistence, security, error handling and logging. arc42 section 8 holds them. This command works from the project's existing artefacts. For each concept it records whether the architecture has decided it, which sources say so and which building blocks it applies to. Where nothing has decided a concept, it says so, lists the options for an ADR to choose between, and never presents an option as a decision.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Project context**: Use the supplied project context for existing projects, source artefacts, external documents and global policies. If context is unavailable, list existing projects read-only, then inspect the selected project's directories and `projects/000-global/`. Do not create a project or request optional information while gathering context.

Resolve the existing project as described in step 1 before reading its sources. Where more than one version of an artefact exists, read the latest; for a multi-instance type, read every instance.

**MANDATORY** (stop if missing):

- **REQ** (Requirements) in `projects/{project-dir}/`, or at least one **ADR** in `decisions/`
  - Extract: the requirements and decisions that settle or constrain each concept
  - If the project has neither: STOP without writing files. There is nothing to trace concepts to. Suggest `/arckit:requirements <project-name>` and `/arckit:adr <project-id> <decision>`, then re-running `/arckit-arc42:arc42-concepts <project-id>`

**RECOMMENDED** (read if available, note if missing):

- **ADR** (every instance): the decisions that settle concepts
- **DATA** (Data Model): domain model, persistence and data-protection concepts
- **SECD** (Secure by Design): the security concept
- **PRIN** (Architecture Principles, in `projects/000-global/`): mandatory conventions, such as observability or API standards
- **HLDR** and **DLDR** (design reviews) and vendor HLD or DLD documents in `vendors/`: concepts as designed and the reviewers' findings on them

**OPTIONAL** (read if available):

- **DIAG** (in `diagrams/`): the building blocks each concept applies to
- **DEVOPS**, **OPS** and **PLAT**: build, deployment, configuration and operational concepts
- **QUAL**: the quality scenarios a concept has to satisfy
- **DPIA**: privacy concepts
- **CDAU** (Codebase Audit, in `audits/`): the concepts as built, where they differ from the design
- **CONC**: the previous version of this document

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files): extract existing design standards, coding guidelines, logging or error-handling conventions and platform guardrails
- Read any **enterprise standards** in `projects/000-global/external/`: extract mandated patterns, approved technologies and organisation-wide conventions
- External documents are optional. If none are supplied, proceed with the ArcKit artefacts and record "No external documents supplied (default; not asked)" as an assumption. Offer once in the closing summary to place documents in `projects/{project-dir}/external/` and re-run; never pause for them.
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[STD-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Require an Existing Project

Match the project ID or name in the arguments to an existing project in the project context. If no project is named, use a project the user named earlier in the conversation, or the sole existing non-global project. `000-global` is never a valid target: it holds enterprise-wide artefacts, not one system's concepts. If the arguments name it, STOP without writing files and request a re-run with the ID of the system's project. Set `PROJECT_ID`, `PROJECT_PATH` and `{project-dir}` from the existing directory and its metadata.

Do not create a project, allocate a project number or write project metadata. If the requested project does not exist, STOP without writing files and suggest `/arckit:requirements <project-name>`. If the target is ambiguous, list the matching existing projects and request a re-run with an explicit ID; do not guess or start an interview.

### Gathering Rules

Read `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` and prefill from the arguments, project metadata and source artefacts. This command needs no interview: optional information never blocks interactive, unattended, headless or recipe-worker runs.

- Use the document owner supplied in the arguments or project metadata; otherwise set the Owner field to `[PENDING]`.
- Record every default taken in the **Assumptions** section and an **Assumptions** line in the closing summary, for example "Owner: [PENDING] (default; not asked)".

### 2. Read the Template

- **First**, check if `.arckit/templates-custom/arc42-concepts-template.md` exists in the project root, then `.arckit/templates/arc42-concepts-template.md`
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/arc42-concepts-template.md` (default)
- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

> **Tip**: Users can customise templates with `/arckit:customize arc42-concepts`

### 3. Assess Each Concept in the Catalogue

The template lists a catalogue of concepts in groups: domain and data, security, robustness, communication, operations, development, and user-facing concepts. Work through every concept in it. For each one, set exactly one status:

| Status | When to use it |
|--------|----------------|
| **Decided** | An accepted ADR, a reviewed design or a mandatory principle settles how the concept works. Cite it. |
| **Partially decided** | A source settles part of the concept and leaves the rest open. Say which part is open. |
| **Open** | The system needs the concept, but no source settles it. |
| **Not applicable** | A source shows the system does not need it, for example a single-language service with no localisation requirement. Cite that source. |
| **Not assessed** | No source says whether the system needs the concept. |

For every concept that is Decided or Partially decided, write:

- **Rules**: the conventions that apply across building blocks, summarised from the sources, not copied. Reuse ADR numbers, requirement IDs and principle numbers exactly as their sources write them.
- **Applies to**: the building blocks (from DIAG, HLDR or the vendor HLD) the concept covers, or "All".
- **Sources**: the Document IDs, with versions.
- **As built** (only when a CDAU exists): whether the code follows the rule, citing the audit finding. A difference is a finding, not a correction.

For every concept that is Open:

- **Why it is needed**: the requirement, quality scenario or risk that makes the concept necessary, cited.
- **Candidate approaches**: two or three options, each with its main trade-off. Label the list "Proposed — not decided". Do not recommend one as settled; an ADR decides.
- **Next step**: the `/arckit:adr` command that would decide it, with a suggested decision title.

Do not raise a concept to Decided on the strength of a proposal, a common practice or a vendor default. Where two sources disagree about a concept, set it to Partially decided, cite both and record the conflict.

### 4. Add System-Specific Concepts

Add any concept a source settles that the catalogue does not list, such as multi-tenancy, offline working or an AI guardrail. Give it the same fields.

### 5. Build the Coverage Summary, Gap Register and Source Artefacts Table

- **Coverage summary**: the number of concepts per status.
- **Gap Register**: one row per Open, Partially decided or Not assessed concept, giving what is missing and the command that would fill it (`/arckit:adr`, `/arckit:data-model`, `/arckit:secure`, `/arckit:devops` or `/arckit:operationalize`).
- **Source Artefacts**: one row per artefact read, with its Document ID, version and the concepts it informed.

### 6. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-CONC-v{VERSION}` (for filename: `ARC-{PROJECT_ID}-CONC-v{VERSION}.md`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set Document Type: "Crosscutting Concepts"
- Set owner, dates, status
- Review cycle: On change (the document is regenerated whenever a decision or design it cites changes)

### 7. Quality Check

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **CONC** per-type checks pass. Fix any failures before proceeding.

### 8. Write the File

**IMPORTANT**: Use the Write tool to create the file, NOT output the full content in chat.

```text
projects/{project-dir}/ARC-{PROJECT_ID}-CONC-v{VERSION}.md
```

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Crosscutting Concepts Documented

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-CONC-v{VERSION}.md`
**Document ID**: ARC-{PROJECT_ID}-CONC-v{VERSION}

| Status | Concepts |
|--------|----------|
| Decided | [N] |
| Partially decided | [N] |
| Open | [N] |
| Not applicable | [N] |
| Not assessed | [N] |

**Assumptions**: [Defaults taken, or "None"]

### Decisions Needed
1. [Concept] — `/arckit:adr {PROJECT_ID} [suggested decision title]`

### Next Steps
1. Decide the Open concepts with `/arckit:adr`, then re-run `/arckit-arc42:arc42-concepts`
2. Re-run `/arckit-arc42:arc42` so section 8 cites this document
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-CONC-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "Crosscutting Concepts"
- `[COMMAND]` -> "arckit.arc42-concepts"

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit-arc42:arc42-concepts` command | [PENDING] | [PENDING] |
```

## Important Notes

1. **Record, Don't Decide**: This command records which concepts the architecture has settled. It makes no architecture decisions. Candidate approaches for an Open concept are input to an ADR, clearly labelled as proposals.

2. **Use Write Tool**: ALWAYS use the Write tool to create the file. Never output the full content in chat.

3. **Summarise Sources**: Each Decided concept summarises and cites its sources; the ADRs and designs remain authoritative. When a decision changes, update the ADR and re-run this command.

4. **Version Management**: If a concepts document already exists (`ARC-*-CONC-v*.md`), write the next version beside it rather than overwriting it, as `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` describes.

5. **Integration with Other Commands**:
   - Informed by: `/arckit:adr`, `/arckit:data-model`, `/arckit:secure`, `/arckit:principles`, `/arckit:hld-review`, `/arckit:dld-review`, `/arckit:devops`, `/arckit:operationalize`, `/arckit-arc42:arc42-quality`
   - Feeds into: `/arckit-arc42:arc42` (section 8), `/arckit-arc42:arc42-handover` (the constitution and plan inputs)

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
