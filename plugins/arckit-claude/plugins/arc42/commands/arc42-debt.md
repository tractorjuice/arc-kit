---
description: Consolidate the technical debt recorded across audits, conformance assessments, design reviews, ADRs and risks into one register for arc42 section 11, each item traced to its source
doc-type: DEBT
argument-hint: "<project ID or name, e.g. '001', 'booking system'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: repo-audit
    description: Audit the codebase to find debt no artefact records yet
    condition: "No CDAU artefact exists and the system has code"
  - command: conformance
    description: Assess conformance to surface known and untracked architecture debt
    condition: "No CONF artefact exists"
  - command: risk
    description: Record the debt items whose interest is a risk to delivery or operation
  - command: arc42
    description: Re-assemble the arc42 description so section 11.2 cites this register
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

You are helping an architect keep a **technical debt register** for a system: the shortcuts, deferred fixes, workarounds and outdated parts it carries, what each one costs to keep, and what it would take to repay. arc42 section 11 lists technical debt beside technical risks. This command consolidates debt that the project's artefacts already record: codebase audits, conformance assessments, design reviews, ADR consequences, accepted risks and principle exceptions. It never invents debt. Each item is traced to the source that recorded it.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Artifacts

> **Project context**: Use the supplied project context for existing projects, source artefacts, external documents and global policies. If context is unavailable, list existing projects read-only, then inspect the selected project's directories and `projects/000-global/`. Do not create a project or request optional information while gathering context.

Resolve the existing project as described in step 1 before reading its sources. Where more than one version of an artefact exists, read the latest; for a multi-instance type, read every instance.

**MANDATORY** (stop if missing): at least one debt source from the list below.

- If the project has none of CDAU, CONF, DLDR, HLDR, ADR or RISK, STOP without writing files: there is nothing to consolidate. Suggest `/arckit-repo:repo-audit <repo>` for an existing codebase, or `/arckit:conformance <project-id>` for a design, then re-running `/arckit-arc42:arc42-debt <project-id>`.

**Debt sources** (read every one that exists):

- **CDAU** (Codebase Audit, in `audits/`): findings (`F-001` and so on) with their dimension, severity and evidence; drift between the code and the documented architecture
- **CONF** (Conformance Assessment): the ATD-KNOWN and ATD-UNTRACK checks (`ATD-001` and so on), deviations, and expired or unremediated exceptions
- **DLDR** and **HLDR** (design reviews, in `reviews/`): conditions, deferred items and findings
- **ADR** (every instance, in `decisions/`): negative consequences the decision accepted, and superseded decisions not yet migrated
- **RISK** (Risk Register): risks accepted as trade-offs (ACCEPT treatment) and technical risks caused by existing debt
- **PRIN-COMP** (Principles Compliance), where one exists: approved principle exceptions (`EXC-001` and so on) and their expiry dates

**RECOMMENDED** (read if available):

- **DIAG** (in `diagrams/`) or **HLDR**: the building blocks each item affects
- **DEBT**: the previous version of this register, to keep item IDs, owners and statuses a person has set

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files): extract static-analysis reports, dependency or end-of-life reports, penetration-test findings and support-team problem records
- Read any **enterprise standards** in `projects/000-global/external/`: extract technology lifecycle policies and support end dates
- External documents are optional. If none are supplied, proceed with the ArcKit artefacts and record "No external documents supplied (default; not asked)" as an assumption. Offer once in the closing summary to place documents in `projects/{project-dir}/external/` and re-run; never pause for them.
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[SCA-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Require an Existing Project

Match the project ID or name in the arguments to an existing project in the project context. If no project is named, use a project the user named earlier in the conversation, or the sole existing non-global project. `000-global` is never a valid target: it holds enterprise-wide artefacts, not one system's debt. If the arguments name it, STOP without writing files and request a re-run with the ID of the system's project. Set `PROJECT_ID`, `PROJECT_PATH` and `{project-dir}` from the existing directory and its metadata.

Do not create a project, allocate a project number or write project metadata. If the requested project does not exist, STOP without writing files. If the target is ambiguous, list the matching existing projects and request a re-run with an explicit ID; do not guess or start an interview.

### Gathering Rules

Read `${CLAUDE_PLUGIN_ROOT}/references/interview-pattern.md` and prefill from the arguments, project metadata and source artefacts. This command needs no interview: optional information never blocks interactive, unattended, headless or recipe-worker runs.

- Use the document owner supplied in the arguments or project metadata; otherwise set the Owner field to `[PENDING]`.
- Item owners come from the sources or the previous register; otherwise `[PENDING]`.
- Record every default taken in the **Assumptions** section and an **Assumptions** line in the closing summary, for example "Owner: [PENDING] (default; not asked)".

### 2. Read the Template

- **First**, check if `.arckit/templates-custom/arc42-debt-template.md` exists in the project root, then `.arckit/templates/arc42-debt-template.md`
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/arc42-debt-template.md` (default)
- **Then**, read `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the template's `<!-- DOC-CONTROL-HEADER -->` marker to the Document Control partial it selects, applying the `${user_config.organisation_name}` and `${user_config.default_classification}` substitutions. Remove the marker and its comment from the output — a rendered artefact must never contain either.

> **Tip**: Users can customise templates with `/arckit:customize arc42-debt`

### 3. Collect Debt Items

An item is technical debt when a source records a known gap between how the system is and how it should be, kept on purpose or found later, that costs something to keep. Collect one item per distinct gap:

- From every source above, take the items that meet that definition. Keep each source's own ID (`F-004`, `ATD-002`, `EXC-001`, `R-007`, `ADR-005`) as a linked ID.
- **Merge duplicates**: when several sources record the same gap (an audit finding and a conformance item about the same workaround), make one item and link every source.
- **Keep debt and risk apart**: a risk is something that may happen; debt is something already true. Where a risk exists because of a debt item, link the two rather than copying the risk.
- Do not add an item no source records. A gap that systems of this kind often have, but no source mentions, is not debt in this register.

### 4. Describe Each Item

Give each item an ID (`TD-001`, `TD-002` and so on; keep the IDs from the previous register for items that persist) and these fields:

- **Category**: Architecture, Code, Test, Infrastructure, Dependency (outdated or unsupported components), Security, Data or Documentation.
- **Origin**: *Deliberate* (accepted on purpose in an ADR, risk acceptance or exception) or *Inadvertent* (found later by an audit, review or assessment).
- **Description**, and the **Affected building blocks**.
- **Interest**: what keeping the debt costs or risks now, from the source. Write "Not stated" if no source says.
- **Principal**: what repaying it would take, from the source. Write "Not stated" if no source says; never estimate effort.
- **Severity**: the source's own severity. Where sources disagree, keep the higher one and note the disagreement. Where none states one, write "Not rated".
- **Status** (Open, Planned, In progress, Resolved) and **Owner**: from the sources or the previous register; otherwise Open and `[PENDING]`.
- **Due**: an exception's expiry date or a planned repayment date, where a source states one.
- **Sources**: the Document IDs with versions and the linked IDs.

### 5. Prioritise and Summarise

- Order the register by severity, then by due date.
- Summarise the items by category and by origin, and list the items whose exception has expired or whose due date has passed.
- **Repayment candidates**: list up to five items that the sources show are blocking a quality goal or a decision, with the reason. Mark the list "Proposed" — the order of repayment is the team's decision.

### 6. Build the Gap Register and Source Artefacts Table

- **Gap Register**: one row for each area with no debt source, such as no codebase audit for a system with code (`/arckit-repo:repo-audit`), or no conformance assessment (`/arckit:conformance`).
- **Source Artefacts**: one row per artefact read, with its Document ID, version and the items it supplied.

### 7. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-DEBT-v{VERSION}` (for filename: `ARC-{PROJECT_ID}-DEBT-v{VERSION}.md`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

- Set Document Type: "Technical Debt Register"
- Set owner, dates, status
- Review cycle: Quarterly, or on change when a new audit, review or assessment is written

### 8. Quality Check

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **DEBT** per-type checks pass. Fix any failures before proceeding.

### 9. Write the File

**IMPORTANT**: Use the Write tool to create the file, NOT output the full content in chat.

```text
projects/{project-dir}/ARC-{PROJECT_ID}-DEBT-v{VERSION}.md
```

### 10. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Technical Debt Register Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-DEBT-v{VERSION}.md`
**Document ID**: ARC-{PROJECT_ID}-DEBT-v{VERSION}

**Items**: [N] ([N] deliberate, [N] inadvertent)
**By severity**: [N] critical, [N] high, [N] medium, [N] low, [N] not rated
**Overdue or expired**: [N]
**Sources consolidated**: [N] ([list of Document IDs])
**Assumptions**: [Defaults taken, or "None"]

### Repayment Candidates (Proposed)
1. TD-[NNN] — [title] — [why it blocks a goal or decision]

### Next Steps
1. Agree owners and repayment dates for the open items
2. Re-run `/arckit-arc42:arc42` so section 11.2 cites this register
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-DEBT-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "Technical Debt Register"
- `[COMMAND]` -> "arckit.arc42-debt"

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
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit-arc42:arc42-debt` command | [PENDING] | [PENDING] |
```

## Important Notes

1. **Consolidate, Don't Discover**: This command gathers debt the artefacts already record. Finding new debt is the job of `/arckit-repo:repo-audit` and `/arckit:conformance`; run them first, then re-run this command.

2. **Use Write Tool**: ALWAYS use the Write tool to create the file. Never output the full content in chat.

3. **Never Estimate**: Interest, principal and severity come from the sources. A value no source states is written as "Not stated" or "Not rated", so the register shows what still needs an estimate.

4. **Version Management**: If a register already exists (`ARC-*-DEBT-v*.md`), write the next version beside it rather than overwriting it, as `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md` describes. Keep the item IDs of items that persist, and mark repaid items Resolved rather than deleting them.

5. **Integration with Other Commands**:
   - Informed by: `/arckit-repo:repo-audit`, `/arckit:conformance`, `/arckit:dld-review`, `/arckit:hld-review`, `/arckit:adr`, `/arckit:risk`, `/arckit:principles-compliance`
   - Feeds into: `/arckit-arc42:arc42` (section 11.2), `/arckit:risk` (debt whose interest is a risk), `/arckit-arc42:arc42-handover` (debt a delivery team must not add to)

6. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
