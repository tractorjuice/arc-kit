---
description: Plan transition architectures with work packages, migration waves, and acceptance criteria
argument-hint: "<project ID, e.g. '001', 'transition architecture plan'>"
effort: max
handoffs:
  - command: architecture-board
    description: Present transition plan to Architecture Board for approval
  - command: architecture-change
    description: Create change requests for transition scope changes
---

You are helping an enterprise architect create a **Transition Architecture** for TOGAF ADM Phase F (Migration Planning). This document defines transition architectures (intermediate states between baseline and target), work packages to achieve each transition, migration wave sequencing, resource plans, risk contingencies, and acceptance criteria for every work package.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read existing artifacts from the project context

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **GAPA** (Gap Analysis) — Extract: Capability gaps, gap severity scores, workstream mappings, gap-to-risk mappings
  - If missing: STOP and ask user to run `/arckit:gap-analysis` first. Transition architecture cannot be planned without a gap baseline.

**RECOMMENDED** (read if available, note if missing):

- **ROAD** (Strategic Architecture Roadmap) — Extract: Timeline horizons, strategic themes, investment envelopes, governance gates, capability delivery matrix
  - If missing: note in assumptions that strategic timeline alignment could not be validated
- **APPR** (Application Rationalisation) — Extract: Application decisions (keep/merge/replace/retire), migration approaches, rationalisation waves, implementation sequencing
  - If missing: note in assumptions that application migration specifics could not be incorporated
- **ADR-\*** (Architecture Decision Records) — Extract: Technology choices, platform decisions, migration constraints, design standards
  - If missing: note in assumptions that architecture decision context is limited

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract migration strategies, vendor transition plans, regulatory timelines
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise migration standards, technology refresh cycles, compliance deadlines
- If no external migration docs found but they would improve the output, ask: "Do you have any existing migration plans, vendor transition agreements, or regulatory compliance deadlines? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[TRANS-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Transition Architecture Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/transition-architecture-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/transition-architecture-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize transition-architecture`

### 3. AskUserQuestion: Number of Transition Architectures

Before generating the transition architecture, use the **AskUserQuestion** tool to determine the number of transition architectures (intermediate states between baseline and target):

**AskUserQuestion**: "How many transition architectures (migration waves) should the plan cover?"

- Options: `2 waves` | `3 waves (Recommended)` | `4 waves`
- Default: `3 waves`

**Wave profiles**:

- **2 waves**: Simple transition — baseline → intermediate → target. Suitable for focused, short-duration programmes (≤12 months).
- **3 waves (Recommended)**: Balanced transition — baseline → Architecture 2 → Architecture 3 → target. Most common for enterprise transformations (12–36 months).
- **4 waves**: Granular transition — baseline → Architecture 2 → Architecture 3 → Architecture 4 → target. Suitable for complex, long-duration programmes (24–48 months) with many interdependencies.

**Gathering rules** (apply to all questions):

- Ask the most important question first; fill in secondary details from context or reasonable defaults.
- **Maximum 2 rounds of questions.** After that, pick the best option from available context.
- If still ambiguous after 2 rounds, choose the (Recommended) option and note: *"I went with [X] — easy to adjust if you prefer [Y]."*

### 4. Gather Transition Context

Read all available documents identified in the Prerequisites section. Build a mental model of:

- **Gap landscape** (from GAPA): Which capabilities need transformation, urgency rankings, workstream groupings
- **Strategic timeline** (from ROAD): Financial years, governance gates, investment envelopes, capability delivery matrix
- **Application migration plan** (from APPR): Application rationalisation decisions, migration approaches, sequencing
- **Architecture decisions** (from ADR-*): Technology choices, platform decisions that constrain or guide migration
- **Risk register** (from RISK if available): Existing risks that affect migration sequencing
- **Stakeholder priorities** (from STKE if available): Which capability areas and timelines matter most

### 5. Load Mermaid Syntax References

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` and `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/gantt.md` for official Mermaid syntax — node shapes, edge labels, gantt chart syntax, and styling options.

### 6. Generate Transition Architecture

Create a comprehensive Transition Architecture document following the template structure.

#### Document Control

- Generate Document ID: `ARC-{P}-TRANS-v1.0` (for filename: `ARC-{P}-TRANS-v1.0.md`)
- Set owner, dates, status, classification
- Review cycle: Monthly during active migration, quarterly after migration

#### 1. Transition Overview

Create the transition overview table showing:

- **Architecture states**: Baseline (current), Architecture 2, Architecture 3, …, Target
- **Scope**: What each intermediate architecture delivers (capability gaps closed, systems migrated, processes implemented)
- **Duration**: Timeframe for each transition wave
- **Investment**: Budget allocation per wave
- **Key milestone**: Primary achievement that marks completion of each architecture state

#### 2. Work Packages

Generate numbered work packages (at least 4) based on the gap analysis workstreams. Each work package must include:

- **WP-ID**: Sequential ID (WP-001, WP-002, …)
- **Name**: Descriptive name reflecting the work package scope
- **Scope**: Clear statement of what the work package delivers
- **Deliverables**: Bulleted list of concrete outputs
- **Dependencies**: References to other work packages or ADRs that must precede this package
- **Resources**: FTE counts and budget allocation
- **Timeline**: Start and end dates, aligned to the transition wave
- **Acceptance Criteria**: 2–5 measurable criteria that define "done" for the work package
  - Must be testable (not subjective)
  - Must reference specific metrics, dates, or artefacts
  - Examples: "API platform handles ≥10,000 concurrent requests with <200ms latency", "All critical data migrated with <0.01% loss rate verified by reconciliation"

**Work package design principles**:

- Work packages should be **atomic** enough to have clear acceptance criteria, but **coherent** enough to represent meaningful delivery units
- Assign each work package to a **transition wave** (Architecture N)
- Ensure every GAPA gap is addressed by at least one work package
- Cross-reference work packages to the roadmap timeline (from ROAD)

#### 3. Work Package Dependencies

Create a Mermaid flowchart showing work package dependency relationships:

- Show which work packages must complete before others can start
- Show parallel work packages where dependencies allow
- Include milestone nodes for governance gates
- **IMPORTANT**: Flowcharts CANNOT use `<br/>` in edge labels — use comma-separated text instead

#### 4. Resource Plan

Create a resource allocation table showing:

- **Resource types**: Architecture, Development, Data Engineering, Security, Operations, Business Analyst, QA, PMO
- **Allocation per work package**: FTE estimates for each resource type in each work package
- **Peak resource requirements**: Identify resource contention periods where multiple work packages compete for the same resources
- **Skill requirements**: Key skills needed, availability, training/recruitment lead times

#### 5. Risk & Contingency

For each significant risk affecting the transition:

- **Risk description**: What could go wrong
- **Likelihood**: Low / Medium / High
- **Impact**: Low / Medium / High / Critical
- **Contingency plan**: Specific mitigation actions
- **Work package affected**: Which WP is at risk
- **Trigger conditions**: When the contingency should be activated
- **Risk owner**: Role responsible for managing the risk

Cross-reference with the GAPA gap-to-risk mapping and existing risk register (from RISK if available).

#### 6. Traceability

Create traceability links showing the complete chain:

- **GAPA gaps → Work packages**: Every gap must map to a work package
- **Work packages → Transition architecture**: Every WP must map to an architecture state
- **Work packages → ROAD themes**: Every WP must align to a strategic theme
- **APPR decisions → Work packages**: Application migration decisions must be reflected in relevant WPs
- **Traceability table**: Tabular cross-reference of source artifacts to TRANS sections

### 7. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **Financial Year Notation**: Use "FY 2024/25", "FY 2025/26" format
- **Spending Review Alignment**: Reference SR periods and budget envelopes
- **GDS Service Standard**: Reference Discovery/Alpha/Beta/Live phases aligned to work packages
- **TCoP (Technology Code of Practice)**: Reference 13 points for technology migration compliance
- **NCSC CAF**: Security maturity progression milestones per migration wave
- **Cross-Government Services**: Reuse opportunities (GOV.UK Pay, Notify, Design System) — include in work package scope where applicable
- **Digital Marketplace**: G-Cloud/DOS procurement alignment for vendor-sourced work packages

### 8. MOD Specifics

If this is a Ministry of Defence project, include:

- **JSP 440**: Defence project management alignment for work package planning and governance
- **Security Clearances**: BPSS/SC/DV requirements per work package, especially for infrastructure and data migration
- **IAMM**: Security maturity milestones per transition wave
- **JSP 936**: AI assurance requirements for AI/ML migration work packages (if applicable)

### 9. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **TRANS** per-type checks pass. Fix any failures before proceeding.

**TRANS-specific quality requirements**:

- **At least 2 transition architectures** (not counting baseline and target) — ensures phased migration
- **At least 4 work packages** — ensures sufficient granularity for execution planning
- **Work package dependency diagram** (Mermaid flowchart) is present and syntactically valid
- **Resource plan table** is present with allocations for each work package
- **Acceptance criteria** are defined for every work package (minimum 2 per WP)
- **Risk register** has at least 3 entries with contingency plans
- Every GAPA workstream is addressed by at least one work package

### 10. Write the Transition Architecture File

**IMPORTANT**: The transition architecture document will be a substantial document (typically 350-600 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-TRANS-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Transition Architecture Created

**Document**: `projects/{P}/ARC-{P}-TRANS-v1.0.md`
**Document ID**: ARC-{P}-TRANS-v1.0

### Transition Overview
- **Transition architectures**: [N] intermediate states (Baseline → [A2] → [A3] → Target)
- **Total duration**: [X months]
- **Total investment**: £[X]
- **Work packages**: [N] work packages

### Work Packages

| WP | Name | Wave | Duration | FTE | Budget |
|----|------|------|----------|-----|--------|
| WP-001 | [Name] | [Wave 1] | [X months] | [X FTE] | £[X] |
| WP-002 | [Name] | [Wave 1] | [X months] | [X FTE] | £[X] |
| WP-003 | [Name] | [Wave 2] | [X months] | [X FTE] | £[X] |
| WP-004 | [Name] | [Wave 2] | [X months] | [X FTE] | £[X] |

### Dependency Summary
- **Critical path**: WP-001 → WP-002 → WP-004 → WP-006
- **Parallel work**: WP-003 and WP-005 can run concurrently
- **Governance gates**: [N] decision gates identified

### Risk Summary
| Priority | Risk | WP Affected | Contingency |
|----------|------|-------------|-------------|
| High | [Risk description] | WP-[X] | [Action] |
| Medium | [Risk description] | WP-[Y] | [Action] |

### Acceptance Criteria Coverage
- Total acceptance criteria: [N] across [N] work packages
- All GAPA gaps covered: ✅ [N] of [N] workstreams addressed

### Synthesised From
- ✅ Gap Analysis: ARC-{P}-GAPA-v[N].md
- [✅/⚠️] Strategic Roadmap: ARC-{P}-ROAD-v[N].md
- [✅/⚠️] Application Rationalisation: ARC-{P}-APPR-v[N].md
- [✅/⚠️] Architecture Decisions: ARC-{P}-ADR-*.md

### Next Steps
1. Present transition plan to Architecture Board: `/arckit:architecture-board`
2. Create change requests for scope adjustments: `/arckit:architecture-change`
3. Break work packages into delivery plans: `/arckit:plan`
4. Generate backlog from work packages: `/arckit:backlog`

### Traceability
- [N] GAPA gaps → [N] work packages
- [N] work packages → [N] transition architectures
- [N] work packages → [N] ROAD themes
- [N] APPR decisions → work package scope

**File location**: `projects/{P}/ARC-{P}-TRANS-v1.0.md`
```

## Important Notes

1. **Evidence-Based**: This command synthesises work packages from GAPA gaps, ROAD timelines, and APPR migration decisions. It should NOT invent work packages without traceability to source documents. Where source documents are incomplete, note assumptions clearly.

2. **Use Write Tool**: The transition architecture document is typically 350-600 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Mandatory Prerequisites**: GAPA is the only mandatory prerequisite. Without a gap baseline, work packages cannot be derived. ROAD and APPR refine the transition plan but are not blockers.

4. **Transition Architecture Design**:
   - Each transition architecture represents a **coherent intermediate state** — all work packages completing in a wave should collectively achieve a meaningful capability milestone.
   - Avoid "half-done" states where systems are partially migrated and create more risk than they mitigate.
   - Each wave should have a **governance gate** where progress is assessed before proceeding.

5. **Work Package Sizing**:
   - Work packages should be deliverable in 3–9 months
   - Smaller than a programme, larger than a sprint
   - Must have clear acceptance criteria that are testable and objective
   - Must include resource estimates and dependency information

6. **Acceptance Criteria Quality**:
   - Must be measurable (not "improve performance" — use "response time < 500ms at 95th percentile")
   - Must be achievable within the work package timeline
   - Must be independently verifiable (not "stakeholder satisfaction" — use "UAT pass rate > 95%")

7. **Integration with Other Commands**:
   - Transition Architecture feeds into: `/arckit:architecture-board` (governance approval), `/arckit:plan` (detailed delivery plans), `/arckit:backlog` (work package decomposition)
   - Transition Architecture is informed by: `/arckit:gap-analysis` (GAPA), `/arckit:roadmap` (ROAD), `/arckit:application-rationalization` (APPR)

8. **Version Management**: If a transition architecture already exists (`ARC-*-TRANS-v*.md`), create a new version (v2.0) rather than overwriting.

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
