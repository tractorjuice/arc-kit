---
description: Turn the arc42 description and the artefacts behind it into a Specification Driven Development handover pack (a constitution, one feature brief per epic and plan inputs for Spec Kit), each tagged with its ArcKit source IDs
doc-type: SDDH
argument-hint: "<project ID or name, optionally epic IDs, e.g. '001', '001 EPIC-002 EPIC-003'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: arc42
    description: Assemble or refresh the arc42 description this pack is built from
    condition: "No ARC42 artefact exists, or it is older than its sources"
  - command: backlog
    description: Break the requirements into epics so each feature brief follows a planned epic
    condition: "No BKLG artefact exists"
  - command: traceability
    description: After delivery, trace requirements through the Spec Kit specs and tasks
  - command: conformance
    description: After delivery, check the Spec Kit plans and constitution against the ADRs and principles
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an architect hand a governed architecture over to a **Specification Driven Development (SDD)** tool that will build the solution. [Spec Kit](https://github.com/github/spec-kit) is the first target. ArcKit's role stays governance: this command writes the inputs the SDD tool needs (a constitution, one feature brief per epic and the architecture each plan must follow), tags every carried requirement, decision and principle with its ArcKit ID so traceability survives the handover, and explains how delivery evidence comes back into ArcKit. It writes plain Markdown and has no dependency on Spec Kit's internals; Spec Kit writes its own files when the team runs its commands with these inputs.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Project context**: Use the supplied project context for existing projects, source artefacts, external documents and global policies. If context is unavailable, list existing projects read-only, then inspect the selected project's directories and `projects/000-global/`. Do not create a project or request optional information while gathering context.

Resolve the existing project as described in step 1 before reading its sources. Where more than one version of an artefact exists, read the latest; for a multi-instance type, read every instance.

**MANDATORY** (stop if missing):

- **ARC42** (arc42 Architecture Description) in `projects/{project-dir}/`
  - Extract: constraints (section 2), solution strategy (4), building blocks (5), deployment (7), crosscutting concepts (8), quality requirements (10) and the Source Artefacts table
  - If missing: STOP without writing files. Suggest `/arckit-arc42:arc42 <project-id>`, then re-running `/arckit-arc42:arc42-handover <project-id>`
- **REQ** (Requirements) in `projects/{project-dir}/`
  - Extract: every requirement ID, its priority and its acceptance criteria
  - If missing: STOP without writing files. Feature briefs carry requirements; suggest `/arckit:requirements <project-name>`

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in `projects/000-global/`): the constitution's principles
- **ADR** (every instance, in `decisions/`): the decisions every plan must follow
- **BKLG** (Product Backlog): the epics that become feature briefs
- **DATA** (Data Model): the entities each feature's data model starts from
- **QUAL** (Quality Scenarios): success criteria with measurable targets
- **CONC** (Crosscutting Concepts): the conventions every feature follows

**OPTIONAL** (read if available):

- **STKE**: the users and goals each feature serves
- **DIAG** (in `diagrams/`): the building blocks each feature touches
- **SECD** and **RISK**: security constraints and risks a feature must not increase
- **DEBT**: technical debt a feature must not add to
- **GLOS**: the terms the briefs should use
- **SDDH**: the previous version of this pack

**Freshness check**: compare each source's latest version with the version the arc42 description's Source Artefacts table records. If any source is newer, use the newer source, record "arc42 description is older than its sources" in the Gap Register with `/arckit-arc42:arc42` as the fix, and continue.

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files): extract delivery standards, definition-of-done checklists and engineering guidelines the delivery team must follow
- Read any **enterprise standards** in `projects/000-global/external/`: extract organisation-wide engineering and security standards
- External documents are optional. If none are supplied, proceed with the ArcKit artefacts and record "No external documents supplied (default; not asked)" as an assumption. Offer once in the closing summary to place documents in `projects/{project-dir}/external/` and re-run; never pause for them.
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[ENG-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Require an Existing Project

Match the project ID or name in the arguments to an existing project in the project context. If no project is named, use a project the user named earlier in the conversation, or the sole existing non-global project. `000-global` is never a valid target: it holds enterprise-wide artefacts, not one system's handover. If the arguments name it, STOP without writing files and request a re-run with the ID of the system's project. Set `PROJECT_ID`, `PROJECT_PATH` and `{project-dir}` from the existing directory and its metadata.

Do not create a project, allocate a project number or write project metadata. If the requested project does not exist, STOP without writing files. If the target is ambiguous, list the matching existing projects and request a re-run with an explicit ID; do not guess or start an interview.

If the arguments name epic IDs (`EPIC-002`), write feature briefs for those epics only, and say so in the Assumptions. Otherwise write one brief per epic.

### Gathering Rules

Read `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` and prefill from the arguments, project metadata and source artefacts. This command needs no interview: optional information never blocks interactive, unattended, headless or recipe-worker runs.

- Use the document owner supplied in the arguments or project metadata; otherwise set the Owner field to `[PENDING]`.
- Record every default taken in the **Assumptions** section and an **Assumptions** line in the closing summary, for example "Owner: [PENDING] (default; not asked)".

### 2. Read the Template

- **First**, check if `.arckit/templates-custom/arc42-handover-template.md` exists in the project root, then `.arckit/templates/arc42-handover-template.md`
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/arc42-handover-template.md` (default)
- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

> **Tip**: Users can customise templates with `/arckit:customize arc42-handover`

### 3. Apply the Traceability Tag Convention

The tags are the contract that carries traceability across the handover, and `/arckit:traceability` reads them back from the delivered `specs/` folder. Apply them everywhere in the pack:

- **Ownership**: requirement IDs repeat across projects (every project can have an `FR-001`), so each feature also declares the ArcKit project it delivers with one ownership tag, `[ArcKit Project {PROJECT_ID}]`. Make it the first line of every Specify Input: Spec Kit records the feature description in the spec's `Input` line, so the tag lands in `spec.md`. `/arckit:traceability` credits a feature to this project only when its spec, plan or tasks carry this project's ownership tag and no other project's; a feature with none, or with tags for more than one project, is reported as a gap, never counted.
- Tag every carried item with its ArcKit ID in square brackets: `[ArcKit FR-012]`, `[ArcKit NFR-P-001]`, `[ArcKit ADR-003]`, `[ArcKit EPIC-002]`, `[ArcKit Principle 4]`. Several IDs share one tag: `[ArcKit FR-012, FR-013]`.
- Use requirement IDs exactly as REQ writes them. Never renumber them.
- Spec Kit numbers each feature's requirements (`FR-001`) and success criteria (`SC-001`) locally. Those are not ArcKit IDs. Tell the team to keep both: Spec Kit's local ID first and the ArcKit tag after the statement, for example `- **FR-001**: System MUST let a resident cancel a booking [ArcKit FR-012]`.
- Tags, including the ownership tag, must survive into `spec.md`, `plan.md` and `tasks.md`.

### 4. Write the Constitution Input

Write the text the team passes to `speckit.constitution`, as one fenced `text` block:

- **Principles**: each architecture principle that applies to this system becomes a constitution principle with its name and its rules. A non-negotiable or mandatory principle gives MUST rules; any other gives SHOULD rules. Tag each with `[ArcKit Principle N]`.
- **Constraints**: the arc42 section 2 constraints that bind every feature become MUST rules, tagged with their source.
- **Conventions**: each Decided crosscutting concept (from CONC, or arc42 section 8 when there is no CONC) becomes a rule every feature follows, tagged with the ADR or document that decided it. Leave Open concepts out; list them in the Gap Register.
- **Governance**: state that the constitution derives from ArcKit document `ARC-{PROJECT_ID}-SDDH-v{VERSION}`, that changes to a principle or decision go through ArcKit (`/arckit:principles` or `/arckit:adr`) before the constitution changes, and that delivery evidence returns through the steps in the Evidence Loop section.

Every rule comes from a source. Do not add a rule no source states.

### 5. Write the Shared Plan Context

Write the architecture every feature's plan must follow, once, as one fenced `text` block the team adds to each `speckit.plan` input:

- The technology and patterns decided by accepted ADRs (number and one line each). Leave superseded decisions out. List Proposed ADRs separately as "not yet decided".
- The building blocks from arc42 section 5 with their responsibilities, and the deployment view from section 7.
- The quality targets every feature must meet, quoted exactly from REQ or QUAL with their tags.

### 6. Write One Feature Brief per Epic

Take the epics from BKLG (`EPIC-001` and so on, with the business requirement and stories each covers). If there is no BKLG, group the functional requirements by the business requirement they serve, one feature per business requirement, mark the grouping "Inferred", and add a Gap Register entry for `/arckit:backlog`.

For each feature, write:

- **Heading**: `Feature F-NN: [epic name]` with its tag (`[ArcKit EPIC-002]`, or `[ArcKit BR-003]` for an inferred feature).
- **Specify input**: one fenced `text` block for `speckit.specify`. Its first line is the ownership tag, `[ArcKit Project {PROJECT_ID}]`. Then describe what to build and why, for whom (from STKE) and what is out of scope, in natural language. Tag every requirement it carries. Quote non-functional targets exactly. Where the sources leave something open that the feature needs, write Spec Kit's own marker, `[NEEDS CLARIFICATION: question]`, so `speckit.clarify` raises it; never fill the gap with an assumption.
- **Requirements carried**: a table of ArcKit ID, summary, priority and acceptance criteria, from REQ.
- **Success criteria candidates**: the acceptance criteria and quality scenarios (`QS-NNN` from QUAL) that apply, with their targets quoted exactly.
- **Plan input**: one fenced `text` block for `speckit.plan`: the building blocks this feature touches, the ADRs and concepts that constrain it, the data entities from DATA and the integrations from INT requirements. Refer to the Shared Plan Context rather than repeating it.
- **Debt to avoid**: DEBT items that affect the feature's building blocks, by ID. Omit the line when there is no DEBT.

### 7. Write the Evidence Loop

Describe how delivery evidence returns to ArcKit after `speckit.implement` and `speckit.converge`:

1. `/arckit:traceability` reads the `[ArcKit ...]` tags in `specs/`, or in a separate delivery repository's specs folder passed as `SPECS=<path>`, and traces each requirement to the features this project owns and their tasks. Features without exactly one matching ownership tag are listed as gaps.
2. `/arckit:conformance` checks each `specs/*/plan.md` and the constitution against the ADRs and principles.
3. `/arckit-repo:repo-audit` audits the delivered code against the principles and requirements.
4. Decisions taken during delivery that change the architecture are recorded with `/arckit:adr`; then `/arckit-arc42:arc42` and this command are re-run.

### 8. Build the Gap Register, Source Artefacts Table and Assumptions

- **Gap Register**: one row per gap, giving what is missing and the command that would fill it: features inferred without a backlog (`/arckit:backlog`), Open concepts (`/arckit:adr`), requirements without acceptance criteria (`/arckit:requirements`), and an arc42 description older than its sources (`/arckit-arc42:arc42`).
- **Source Artefacts**: one row per artefact read, with its Document ID, version and the sections it fed.

### 9. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-SDDH-v{VERSION}` (for filename: `ARC-{PROJECT_ID}-SDDH-v{VERSION}.md`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set Document Type: "SDD Handover Pack"
- Set owner, dates, status
- Review cycle: On change (the pack is regenerated whenever the arc42 description or its sources change)

### 10. Quality Check

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SDDH** per-type checks pass. Fix any failures before proceeding.

### 11. Write the File

**IMPORTANT**: Use the Write tool to create the file, NOT output the full content in chat.

```text
projects/{project-dir}/ARC-{PROJECT_ID}-SDDH-v{VERSION}.md
```

### 12. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## SDD Handover Pack Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-SDDH-v{VERSION}.md`
**Document ID**: ARC-{PROJECT_ID}-SDDH-v{VERSION}

**Constitution**: [N] principles, [N] constraints, [N] conventions
**Feature briefs**: [N] ([N] from backlog epics, [N] inferred)
**Requirements carried**: [N] of [N] in REQ
**Open clarifications**: [N] `[NEEDS CLARIFICATION]` markers
**Assumptions**: [Defaults taken, or "None"]

### Hand Over in Spec Kit (use the form exposed by your installed integration)
1. `speckit.constitution` with the Constitution Input
2. For each feature: `speckit.specify` with its Specify Input, `speckit.clarify`, then `speckit.plan` with its Plan Input and the Shared Plan Context
3. `speckit.tasks`, `speckit.implement`, `speckit.converge`

### Bring Evidence Back
1. `/arckit:traceability`, `/arckit:conformance` and `/arckit-repo:repo-audit` after each delivery
2. `/arckit-arc42:arc42` and `/arckit-arc42:arc42-handover` again when decisions change
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-SDDH-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "SDD Handover Pack"
- `[COMMAND]` -> "arckit.arc42-handover"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` -> Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` -> Document owner from arguments or project metadata; otherwise `[PENDING]` (default; not asked)
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` -> [PENDING]
- `[APPROVER_NAME]` -> [PENDING]
- `[DISTRIBUTION_LIST]` -> Default to "Project Team, Architecture Team, Delivery Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit-arc42:arc42-handover` command | [PENDING] | [PENDING] |
```

## Important Notes

1. **Governance, Not Delivery**: ArcKit supplies the SDD tool's inputs and checks the evidence that comes back; the SDD tool builds the solution. The pack makes no architecture decisions and states nothing its sources do not.

2. **Use Write Tool**: ALWAYS use the Write tool to create the file. Never output the full content in chat.

3. **Spec Kit Step Names**: Name Spec Kit's steps by their logical names (`speckit.constitution`, `speckit.specify`, `speckit.clarify`, `speckit.plan`, `speckit.tasks`, `speckit.implement`, `speckit.converge`), never by one integration's invocation form as if it were universal. How a step is invoked depends on the team's Spec Kit integration, so keep the template's integration table, which follows Spec Kit's [command invocation](https://github.github.io/spec-kit/integrations/cli.html#command-invocation) guidance, and its instruction to "use the form exposed by your installed integration":

   | Integration | `speckit.specify` is invoked as |
   |-------------|---------------------------------|
   | GitHub Copilot, default skills mode | `/speckit-specify` |
   | Codex, Command Code and ZCode skills | `$speckit-specify` |
   | Kimi skills | `/skill:speckit-specify` |
   | Integrations using slash-command notation | `/speckit.specify` |

   None of these forms is obsolete; each is current for its integration. The inputs are plain text and work with any of them, and with other SDD tools that take a constitution, a feature description and a plan.

4. **Version Management**: If a pack already exists (`ARC-*-SDDH-v*.md`), write the next version beside it rather than overwriting it, as `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` describes. Keep feature numbers (`F-NN`) stable for epics that persist, so the delivery team's Spec Kit features still match.

5. **Integration with Other Commands**:
   - Informed by: `/arckit-arc42:arc42`, `/arckit:requirements`, `/arckit:principles`, `/arckit:adr`, `/arckit:backlog`, `/arckit:data-model`, `/arckit-arc42:arc42-quality`, `/arckit-arc42:arc42-concepts`, `/arckit-arc42:arc42-debt`
   - Feeds into: Spec Kit (`speckit.constitution`, `speckit.specify`, `speckit.plan`); evidence returns through `/arckit:traceability`, `/arckit:conformance` and `/arckit-repo:repo-audit`

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
