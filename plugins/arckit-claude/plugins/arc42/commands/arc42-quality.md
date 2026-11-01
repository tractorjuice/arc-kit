---
description: Build the quality tree and measurable quality scenarios for arc42 section 10 from the project's requirements and stakeholder goals, classified by the Q42 quality model
doc-type: QUAL
argument-hint: "<project ID or name, e.g. '001', 'booking system'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: requirements
    description: Add measurable targets to the quality goals marked Target needed
    condition: "Any quality goal is marked Target needed"
  - command: adr
    description: Record the architecture approach for a scenario no decision addresses yet
    condition: "Any scenario has no approach recorded"
  - command: arc42-concepts
    description: Describe the crosscutting concepts the quality scenarios depend on
  - command: arc42
    description: Re-assemble the arc42 description so sections 1.2 and 10 cite this model
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an architect write a system's **quality requirements** in the form arc42 section 10 expects: a quality tree that groups the quality goals, and quality scenarios that make each goal concrete and testable. The command works from the project's existing artefacts. It classifies each goal by a dimension of the [Q42 quality model](https://quality.arc42.org) (by Gernot Starke, licensed CC BY-SA 4.0), turns every requirement with a measurable target into a scenario, and lists the goals that still have no measurable target. It never invents a target.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Project context**: Use the supplied project context for existing projects, source artefacts, external documents and global policies. If context is unavailable, list existing projects read-only, then inspect the selected project's directories and `projects/000-global/`. Do not create a project or request optional information while gathering context.

Resolve the existing project as described in step 1 before reading its sources. Where more than one version of an artefact exists, read the latest.

**MANDATORY** (stop if missing):

- **REQ** (Requirements) in `projects/{project-dir}/`
  - Extract: every non-functional requirement (all NFR families), its priority and its target; business requirements that state a quality expectation
  - If missing: STOP without writing files. Quality scenarios are derived from requirements. Suggest `/arckit:requirements <project-name>`, then re-running `/arckit-arc42:arc42-quality <project-id>`

**RECOMMENDED** (read if available, note if missing):

- **STKE** (Stakeholder Analysis): which stakeholders care about which qualities, and their priorities
- **ADR** (every instance, in `decisions/`): the approaches that address each quality goal
- **PRIN** (Architecture Principles, in `projects/000-global/`): quality-related principles, such as resilience, security and observability

**OPTIONAL** (read if available):

- **SOBC**: the business drivers behind quality goals
- **DIAG** (in `diagrams/`) and **HLDR**: the building blocks a scenario's stimulus reaches
- **SECD**: security controls and their targets
- **RISK**: risks that threaten a quality goal
- **CONC**: crosscutting concepts that implement a quality goal
- **QUAL**: the previous version of this document, to carry forward priorities a person has reviewed

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files): extract service-level objectives, performance or load-test results, availability reports, accessibility audits and penetration-test summaries
- Read any **enterprise standards** in `projects/000-global/external/`: extract organisation-wide service levels and quality baselines
- External documents are optional. If none are supplied, proceed with the ArcKit artefacts and record "No external documents supplied (default; not asked)" as an assumption. Offer once in the closing summary to place documents in `projects/{project-dir}/external/` and re-run; never pause for them.
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[SLO-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Require an Existing Project

Match the project ID or name in the arguments to an existing project in the project context. If no project is named, use a project the user named earlier in the conversation, or the sole existing non-global project. `000-global` is never a valid target: it holds enterprise-wide artefacts, not one system's quality requirements. If the arguments name it, STOP without writing files and request a re-run with the ID of the system's project. Set `PROJECT_ID`, `PROJECT_PATH` and `{project-dir}` from the existing directory and its metadata.

Do not create a project, allocate a project number or write project metadata. If the requested project does not exist, STOP without writing files and suggest `/arckit:requirements <project-name>`. If the target is ambiguous, list the matching existing projects and request a re-run with an explicit ID; do not guess or start an interview.

### Gathering Rules

Read `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` and prefill from the arguments, project metadata and source artefacts. This command needs no interview: optional information never blocks interactive, unattended, headless or recipe-worker runs.

- Use the document owner supplied in the arguments or project metadata; otherwise set the Owner field to `[PENDING]`.
- Record every default taken in the **Assumptions** section and an **Assumptions** line in the closing summary, for example "Owner: [PENDING] (default; not asked)".

### 2. Read the Template

- **First**, check if `.arckit/templates-custom/arc42-quality-template.md` exists in the project root, then `.arckit/templates/arc42-quality-template.md`
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/arc42-quality-template.md` (default)
- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.
- Start the output at the template's first heading (`# Quality Scenarios: ...`). Do not copy the template's YAML frontmatter or its `SPDX-License-Identifier` comment into the output; they label the template file, which is CC BY-SA 4.0, not the project's quality document. Keep the template's written Q42 attribution in the "About this document" line, including when using a customised template.

> **Tip**: Users can customise templates with `/arckit:customize arc42-quality`

### 3. Collect the Quality Goals

A quality goal is a quality the system must have, stated in a source. Collect one goal per distinct quality concern:

1. Every non-functional requirement in REQ, whatever its family (NFR-P, NFR-A, NFR-S, NFR-SEC, NFR-C, NFR-U, NFR-M, NFR-I and any others the document uses).
2. Business requirements or stakeholder goals that state a quality expectation, such as "residents can book from a mobile phone". Cite the BR or goal ID.
3. Quality-related principles from PRIN, but only where the principle is mandatory for this system.

Do not add a goal no source states. A quality that systems of this kind usually need, but no source mentions, goes in the Gap Register, not the tree.

### 4. Classify Each Goal by Q42 Dimension

Give each goal one primary Q42 dimension, chosen by what the goal constrains rather than by its ID prefix. Record a secondary dimension only where a goal clearly spans two.

> **Licence**: The dimension names and the classification in this table are adapted from the [Q42 quality model](https://quality.arc42.org) by Gernot Starke and licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), not MIT. See `${CLAUDE_PLUGIN_ROOT}/templates/arc42-LICENSE.md` for the attribution and the changes ArcKit made. The rest of this command is MIT-licensed.

| Q42 dimension | Typical goals | Usual NFR families |
|---------------|---------------|--------------------|
| `#reliable` | Availability, fault tolerance, recoverability, data consistency | NFR-A |
| `#efficient` | Response time, throughput, capacity, resource use | NFR-P, NFR-S |
| `#flexible` | Adaptability, configurability, interoperability, portability | NFR-I, NFR-S |
| `#maintainable` | Modifiability, testability, analysability | NFR-M (code and change) |
| `#usable` | Ease of use, accessibility, localisation | NFR-U |
| `#operable` | Installation, monitoring, administration, operating cost | NFR-M (operations, observability, runbooks) |
| `#secure` | Confidentiality, integrity, accountability, authenticity | NFR-SEC, audit logging in NFR-C |
| `#safe` | Fail-safe behaviour, hazard warnings, fault isolation that protects people or property | Safety requirements |
| `#suitable` | Functional completeness and correctness, regulatory fit | NFR-C (regulatory), BR |

### 5. Prioritise

- Take priorities from the sources: stakeholder priorities in STKE first, requirement priority (MoSCoW) second. Where they disagree, keep the higher priority and record the conflict under Trade-offs and Conflicts.
- Mark three to five goals as **Top quality goals**. These are the goals arc42 section 1.2 summarises. If neither source ranks the goals, mark the ranking "Inferred" and say what it was inferred from.

### 6. Write the Quality Scenarios

Write one scenario for every goal whose source states a measurable target:

- **ID** `QS-001`, `QS-002` and so on, and a **type**: Usage (normal operation), Change (modifying or extending the system) or Failure (stress, outage, attack).
- **Source**, **Stimulus**, **Environment**, **Artefact** (the building block from DIAG or HLDR, or "System" when none is documented), **Response** and **Response measure**.
- **The response measure is the source's own target, quoted exactly**, for example "95th percentile under 2 seconds" from NFR-P-001. Never tighten, loosen or round it.
- Mark every scenario "Inferred", because its framing is derived even when its target is stated, and cite the requirement it comes from.

For a goal with no measurable target, write no scenario. List the goal under **Goals Without a Measurable Target** as "Target needed", with the command that would add one.

### 7. Link Approaches and Verification

- **Approaches**: for each scenario, list the ADRs (by number), crosscutting concepts (CONC) or design decisions that address it. If none does, write "No approach recorded". That is a finding for the Gap Register; do not fill it with a proposal.
- **Verification**: name how the scenario can be verified, such as a load test, failover drill, penetration test, accessibility audit or code-review metric. Mark each "Proposed" unless a source already states how it is verified.

### 8. Record Trade-offs, Conflicts and Gaps

- **Trade-offs and conflicts**: where two goals pull against each other (for example, strong authentication against one-step booking), or two sources disagree about a target, list both with their sources. Do not resolve them; suggest an ADR.
- **Gap Register**: one row per gap, giving what is missing and the command that would fill it. Include every goal without a measurable target (`/arckit:requirements`), every scenario with no approach (`/arckit:adr`), and every Q42 dimension a stakeholder cares about that has no goal (`/arckit:requirements`).
- **Source Artefacts**: one row per artefact read, with its Document ID, version and what it supplied.

### 9. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-QUAL-v{VERSION}` (for filename: `ARC-{PROJECT_ID}-QUAL-v{VERSION}.md`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set Document Type: "Quality Scenarios"
- Set owner, dates, status
- Review cycle: On change (the model is regenerated whenever its source requirements change)

### 10. Quality Check

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **QUAL** per-type checks pass. Fix any failures before proceeding.

### 11. Write the File

**IMPORTANT**: Use the Write tool to create the file, NOT output the full content in chat.

```text
projects/{project-dir}/ARC-{PROJECT_ID}-QUAL-v{VERSION}.md
```

### 12. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Quality Scenarios Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-QUAL-v{VERSION}.md`
**Document ID**: ARC-{PROJECT_ID}-QUAL-v{VERSION}

**Quality goals**: [N] across [N] Q42 dimensions ([N] top goals)
**Scenarios**: [N] ([N] usage, [N] change, [N] failure)
**Goals without a measurable target**: [N]
**Scenarios with no approach recorded**: [N]
**Assumptions**: [Defaults taken, or "None"]

### Gaps to Fill
1. [What is missing] — run `/arckit:[command]`

### Next Steps
1. Add the missing targets with `/arckit:requirements`, then re-run `/arckit-arc42:arc42-quality`
2. Re-run `/arckit-arc42:arc42` so sections 1.2 and 10 cite this document
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-QUAL-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "Quality Scenarios"
- `[COMMAND]` -> "arckit.arc42-quality"

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit-arc42:arc42-quality` command | [PENDING] | [PENDING] |
```

## Important Notes

1. **Derive, Don't Invent**: Every goal, priority and target comes from a source. A target no source states is recorded as "Target needed", never estimated. Changing a requirement's target is the requirement owner's decision, made in REQ.

2. **Use Write Tool**: ALWAYS use the Write tool to create the file. Never output the full content in chat.

3. **Q42 Attribution and Licence**: The dimension names, the step 4 classification and the quality template are adapted from the Q42 quality model by Gernot Starke ([quality.arc42.org](https://quality.arc42.org)) and licensed CC BY-SA 4.0; `${CLAUDE_PLUGIN_ROOT}/templates/arc42-LICENSE.md` records the attribution and ArcKit's changes. Keep the template's written attribution line in the document. The licence covers that material, not the project's goals, scenarios and targets, so the document carries no licence metadata. Do not copy Q42's own definitions or other Q42 text into the document.

4. **Version Management**: If a quality model already exists (`ARC-*-QUAL-v*.md`), write the next version beside it rather than overwriting it, as `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` describes.

5. **Integration with Other Commands**:
   - Informed by: `/arckit:requirements`, `/arckit:stakeholders`, `/arckit:principles`, `/arckit:adr`, `/arckit:diagram`, `/arckit:secure`, `/arckit:risk`
   - Feeds into: `/arckit-arc42:arc42` (sections 1.2 and 10), `/arckit-arc42:arc42-concepts` (the concepts that implement each goal), `/arckit-arc42:arc42-handover` (success criteria for each feature)

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
