---
description: Create architecture change request with impact assessment and ADM cycle re-entry
argument-hint: "<project ID, change type, e.g. '001', 'evolutionary', 'new capability'>"
effort: high
handoffs:
  - command: transition-architecture
    description: Update transition plan for approved changes
  - command: gap-analysis
    description: Re-assess gaps after change implementation
---

You are helping an enterprise architect create an **Architecture Change Request** for TOGAF Phase H (Architecture Change Management). This document captures change requests with full impact assessment across capability, application, technology, and governance domains, plus ADM cycle re-entry points.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Architecture Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**RECOMMENDED** (read if available, note if missing):

- **BORD** (Architecture Board Review) — Extract: Governance context, board decisions, approval precedents, change policy
  - If missing: note in assumptions that board context could not be validated
- **BPCM** (Business Capability Model) — Extract: Current capability landscape for impact assessment
  - If missing: note that capability impact assessment will be limited
- **ADMP** (ADM Preliminary) — Extract: Architecture framework, principles, governance structure
  - If missing: note that framework alignment could not be validated
- **PRIN** (Architecture Principles) — Extract: Principle compliance implications of the change
  - If missing: note that principle compliance could not be validated
- **TRANS** (Transition Architecture) — Extract: Current transition plans that may be affected
  - If missing: note that transition plan impact could not be assessed

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract change management policies, existing change requests, migration plans, and architectural baselines
- Read any **enterprise standards** in `projects/000-global/external/` — extract change management frameworks, governance procedures, compliance requirements
- If no external change docs found but they would improve the output, ask: "Do you have any existing change requests, board minutes, or change management policies? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[ACHG-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Determine Change Request Number

Change requests are **multi-instance** documents (like ADRs). Find the next available number:

1. Use Glob to find existing `projects/{project-slug}/changes/ARC-{P}-ACHG-*`.md files
2. If none found, the next change number is `ACHG-001`
3. If found, extract the highest change number and increment by 1 (e.g., `ACHG-003` → `ACHG-004`), zero-padded to 3 digits
4. The changes directory will be created automatically when saving the file with the Write tool

### 3. Read the Template (with user override support)

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/architecture-change-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/architecture-change-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize architecture-change`

### 4. Interactive Configuration

Before creating the change request, use the **AskUserQuestion** tool to gather key parameters. **Skip any question where the user has already provided a clear answer in their arguments.**

**Gathering rules** (apply to all questions in this section):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions.** After that, pick the best option from available context.
- If still ambiguous after 2 rounds, choose the (Recommended) option and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

**Question 1** — header: `Change Type`, multiSelect: false
> "What type of architecture change is this?"

- **Evolutionary (Recommended)**: Incremental improvement to existing architecture — extends or enhances current capabilities without fundamental change
- **Transformational**: Fundamental change that restructures significant portions of the architecture — new capabilities, technology platforms, or operating models
- **Corrective**: Fix for architectural deficiencies, technical debt, or compliance failures — restores intended design

**Question 2** — header: `Priority`, multiSelect: false
> "What is the priority level of this change?"

- **Critical**: Must be implemented immediately — safety, security, or regulatory compliance
- **High**: Major business impact — core capability changes, significant investment
- **Medium (Recommended)**: Standard change — enhancement or improvement within planned cycles
- **Low**: Minor refinement — low-risk, low-cost improvements

**Question 3** — header: `ADM Re-Entry`, multiSelect: true
> "Which ADM phases need to be re-entered for this change?"

- **Phase A (Architecture Vision)**: Change affects overall vision or scope
- **Phase B (Business Architecture)**: Change affects business processes or organisation
- **Phase C (Information Systems)**: Change affects data or application architecture
- **Phase D (Technology Architecture)**: Change affects technology infrastructure
- **Phase E (Opportunities & Solutions)**: Change affects solution options or migrations
- **Phase F (Migration Planning)**: Change affects migration sequencing
- **Phase G (Implementation Governance)**: Change affects implementation oversight
- **Phase H (Change Management)**: Change affects ongoing change control

Apply the user's selections to populate the Change Type, Priority, and ADM Re-Entry sections of the template.

### 5. Gather Change Information from Context

Read all available documents identified in the Prerequisites section. Build a mental model of:

- **Current architecture baseline** (from BPCM, ADMP, APP): What exists today
- **Proposed change**: What is being requested and why
- **Impact scope**: Which domains are affected (capability, application, technology, governance)
- **Transition plans** (from TRANS): What existing plans this change might affect
- **Governance context** (from BORD): Board precedent and approval thresholds

### 6. Generate Architecture Change Request

Create a comprehensive Architecture Change Request document following the template structure.

#### Document Control

- Document ID: `ARC-{P}-ACHG-{NUM}-v{VERSION}` (e.g., `ARC-001-ACHG-001-v1.0`)
- Change ID: `ACHG-{NUM}` (e.g., ACHG-001, ACHG-002)
- Version: `1.0` for new change requests
- Status: DRAFT
- Date: Current date (YYYY-MM-DD)

#### 1. Change Request Header

- **Change ID**: Sequential ID (ACHG-001, ACHG-002, etc.)
- **Change Type**: Evolutionary / Transformational / Corrective
- **Submitted By**: Extract from context or prompt user
- **Date**: Current date
- **Priority**: Critical / High / Medium / Low

#### 2. Rationale

Provide a clear statement of why this change is needed. Include:

- **Business driver**: Business objective or problem being addressed
- **Technical driver**: Architectural reason (performance, security, scalability, compliance)
- **Regulatory driver**: Compliance requirements (UK GDPR, NCSC, GDS Service Standard) if applicable
- **Trigger**: What initiated this change request (audit finding, strategic shift, technology obsolescence, stakeholder request)

#### 3. Impact Assessment

Assess impact across **at least four categories**:

**3.1 Capability Impact**

- Which business capabilities are affected?
- Classification: Enhanced / Modified / New / Retired
- Maturity level changes (reference BPCM)

**3.2 Application Impact**

- Which applications are affected?
- Classification: Enhanced / Modified / Replaced / Retired
- Integration impact on connected applications

**3.3 Technology Impact**

- Which technology components are affected?
- Classification: Enhanced / Modified / Replaced / Retired
- Infrastructure and platform implications

**3.4 Governance Impact**

- Which governance areas are affected?
- Compliance, standards, principles alignment
- Policy and procedure changes required

#### 4. Affected Artefacts

List all architecture artefacts that will need updates as a result of this change:

- Cross-reference to existing documents (BPCM, STRAT, APP, ADMP, etc.)
- Impact level per artefact: High / Medium / Low
- Action required: Update / No change / New section

#### 5. ADM Re-Entry Point

Map which ADM phases need to be re-entered and the scope of re-entry for each:

- For each phase (A through H), indicate Yes/No for re-entry
- Describe the scope of re-work needed in that phase
- If no phases require re-entry, note that the change is contained within Phase H only

#### 6. Cost/Benefit

Provide financial assessment:

- Implementation cost (CAPEX)
- Ongoing costs (OPEX)
- Expected benefit (quantified where possible)
- Payback period
- For UK Government: include TCoP alignment and G-Cloud/DOS cost considerations

#### 7. Risk Assessment

Identify and assess risks associated with the change:

- Technical risks (implementation complexity, integration)
- Operational risks (service disruption, user impact)
- Compliance risks (regulatory non-compliance)
- Financial risks (cost overruns, benefit shortfall)
- Include likelihood, impact, and mitigation for each

#### 8. Approval Workflow

Document the governance workflow:

- Submission → Assessment → Board Review → Approval → Implementation
- Owner for each stage
- Decision status (Pending/Approved/Rejected/Conditional)
- Include architecture board or programme board as appropriate

#### 9. Traceability

Create traceability links:

- **BORD** → affected artefacts → **ACHG** links
- Cross-reference to architecture principles
- Link to strategic objectives
- Link to requirements being addressed
- Link to existing change requests (if related)

### 7. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **ACHG** per-type checks pass. Fix any failures before proceeding.

**ACHG-specific quality requirements**:

- Change type is explicitly defined (Evolutionary/Transformational/Corrective)
- Impact assessment covers at least 4 categories (capability, application, technology, governance)
- ADM re-entry mapping is present for all phases
- Cost/benefit section is populated (even if estimates)
- Risk assessment table has at least 2 risks identified
- Approval workflow has all 5 stages (Submission → Assessment → Board Review → Approval → Implementation)

### 8. Write the Architecture Change Request File

**IMPORTANT**: The architecture change request document will be a substantial document (typically 200-400 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/changes/ARC-{P}-ACHG-{NUM}-v1.0.md
```

Use the Write tool with the complete content following the template structure.

**Auto-Populate Document Control Fields**:

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Use "1.0" for new change requests
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[CHANGE_TYPE]` → From user input (Evolutionary/Transformational/Corrective)
- `[ACHG_NUM]` → Next available number (001, 002, etc.)
- `[COMMAND]` → "arckit.architecture-change"

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Architecture Change Request Created

**Change ID**: ACHG-{NUM}
**Document**: `projects/{P}/changes/ARC-{P}-ACHG-{NUM}-v1.0.md`
**Document ID**: ARC-{P}-ACHG-{NUM}-v1.0

### Change Overview
- **Type**: [Evolutionary/Transformational/Corrective]
- **Priority**: [Critical/High/Medium/Low]
- **Status**: DRAFT

### Impact Summary
| Domain | Level | Count |
|--------|-------|-------|
| Capability | [High/Med/Low] | [N] affected |
| Application | [High/Med/Low] | [N] affected |
| Technology | [High/Med/Low] | [N] affected |
| Governance | [High/Med/Low] | [N] affected |

### ADM Re-Entry
| Phase | Required | Scope |
|-------|----------|-------|
| Phase A | [Yes/No] | [Scope] |
| Phase B | [Yes/No] | [Scope] |
...

### Cost/Benefit
| Item | Amount |
|------|--------|
| Implementation Cost | [£X] |
| Expected Benefit | [£Y/year] |
| Payback Period | [Z months] |

### Risks Identified: [N]
1. **[Risk 1]**: [Description] — [Likelihood] × [Impact] = [Overall]
2. **[Risk 2]**: [Description] — [Likelihood] × [Impact] = [Overall]

### Approval Workflow
| Stage | Owner | Status |
|-------|-------|--------|
| Submission | [Requester] | ✅ Submitted |
| Assessment | [Architect] | [Pending] |
| Board Review | [Board] | [Pending] |
| Approval | [Board Chair] | [Pending] |
| Implementation | [Team] | [Pending] |

### Synthesised From
- [✅/⚠️] Architecture Board Review: ARC-{P}-BORD-v[N].md
- [✅/⚠️] Business Capability Model: ARC-{P}-BPCM-v[N].md
- [✅/⚠️] ADM Preliminary: ARC-{P}-ADMP-v[N].md
- [✅/⚠️] Architecture Principles: ARC-{P}-APP-v[N].md
- [✅/⚠️] Transition Architecture: ARC-{P}-TRANS-v[N].md

### Next Steps
1. Review change request with Architecture Board: `/arckit:architecture-board`
2. Update transition plan for approved changes: `/arckit:transition-architecture`
3. Re-assess gaps after implementation: `/arckit:gap-analysis`
4. Schedule ADM cycle re-entry if phases require re-work
5. Update affected artefacts after approval

### Traceability
- [N] artefacts identified for impact review
- [N] ADM phases marked for re-entry
- [N] risks assessed
- Linked to BORD governance context

**File location**: `projects/{P}/changes/ARC-{P}-ACHG-{NUM}-v1.0.md`
```

## Important Notes

1. **Evidence-Based Assessment**: Impact assessments must reference actual artefacts from the project context. Do not invent capabilities, applications, or technologies without source evidence.

2. **Use Write Tool**: The change request document is typically 200-400 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Change Types**:
   - **Evolutionary**: Incremental — extends existing architecture without structural change
   - **Transformational**: Structural — reorganises significant portions of the architecture
   - **Corrective**: Remedial — fixes architectural deficiencies or compliance failures

4. **Impact Categories**: All four categories (capability, application, technology, governance) must be assessed even if impact is "None" for some. This ensures comprehensive coverage.

5. **ADM Re-Entry**: Not every change requires full ADM cycle re-entry. Phase H is the most common entry point for evolutionary changes. Transformational changes often require re-entry to Phases A-D.

6. **Multi-Instance Numbering**: Change requests follow sequential numbering (ACHG-001, ACHG-002, etc.) similar to ADRs. Numbers are never reused — superseded or rejected changes retain their numbers.

7. **Integration with Other Commands**:
   - Architecture Change feeds into: `/arckit:transition-architecture` (update migration plans), `/arckit:gap-analysis` (re-assess after implementation)
   - Architecture Change is informed by: `/arckit:architecture-board` (governance context), BPCM (capability baseline), ADMP (framework)

8. **Version Management**: If a change request needs revision (e.g., after board feedback), create a new version (v1.1 for minor changes, v2.0 for significant changes) rather than overwriting.

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 months`, `> £100,000`) to prevent markdown renderers from interpreting them as HTML tags or emoji.

10. **UK Government Context**: For UK Government projects, align change management with:

- **GDS Service Standard**: Change governance and user impact assessment
- **NCSC CAF**: Security control updates for technology changes
- **Technology Code of Practice**: Reuse-first principle for technology changes
- **Cross-Government Services**: Impact on shared services (GOV.UK Pay, Notify, Design System)
