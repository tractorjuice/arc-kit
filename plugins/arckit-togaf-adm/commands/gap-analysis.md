---
description: Perform gap analysis — capability matrix, gap severity scoring, workstream mapping
argument-hint: "<project ID, e.g. '001', 'capability gap analysis'>"
effort: max
handoffs:
  - command: transition-architecture
    description: Create work packages to close identified gaps
  - command: architecture-board
    description: Present gap analysis to Architecture Board for prioritization
---

You are helping an enterprise architect perform a **Gap Analysis** for TOGAF ADM Phase E (Opportunities & Solutions). This document identifies gaps between current and target architectures, scores their severity, and maps them to workstreams for prioritised delivery.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Architecture Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **BPCM** (Business Capability Model) — Extract: Capability hierarchy, maturity levels, capability ownership, capability-to-objective mappings
  - If missing: STOP and ask user to run `/arckit:business-capability-map` first. Gap analysis requires a capability baseline.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles) — Extract: Guiding principles, compliance requirements, technology standards, design constraints
  - If missing: note in assumptions that principle alignment could not be validated
- **STRAT** (Architecture Strategy) — Extract: Strategic vision, target state description, strategic themes, investment priorities
  - If missing: note in assumptions that strategic alignment could not be validated
- **PRIN** (Architecture Principles, in 000-global) — Extract: Enterprise-level principles, decision framework, governance standards
  - If missing: note in assumptions that enterprise-level principle alignment could not be validated

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract baseline assessments, target architecture descriptions, migration strategies
- Read any **enterprise standards** in `projects/000-global/external/` — extract capability maturity models, technology standards, compliance frameworks
- If no external assessment docs found but they would improve the output, ask: "Do you have any existing capability assessments, target architecture descriptions, or migration plans? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[GA-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Gap Analysis Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/gap-analysis-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/gap-analysis-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize gap-analysis`

### 3. AskUserQuestion: Gap Severity Weighting

Before generating the analysis, ask the user how to weight gap severity scoring:

**AskUserQuestion**: "How should gap severity be weighted?"

- Options: `Balanced` | `Strategic-risk` | `Operational`
- Default: `Balanced`

**Weighting profiles**:

- **Balanced**: Equal weight to strategic impact and operational cost of the gap
- **Strategic-risk**: Heavier weighting on strategic impact — gaps that threaten business outcomes are prioritised regardless of effort
- **Operational**: Heavier weighting on effort/cost — gaps that can be closed quickly with high business value are prioritised

### 4. Gather Gap Analysis Context

Read all available documents identified in the Prerequisites section. Build a mental model of:

- **Current state capabilities** (from BPCM): Maturity levels, coverage, capability gaps
- **Target state** (from STRAT/ADMP): Desired maturity levels, new capabilities, retired capabilities
- **Principles** (from PRIN): Constraints on how gaps can be addressed
- **Risks** (from RISK if available): Existing risk exposure from capability gaps
- **Stakeholder priorities** (from STKE if available): Which capability areas matter most

### 5. Load Mermaid Syntax References

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` and `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/quadrant.md` for official Mermaid syntax — node shapes, edge labels, quadrant chart syntax, and styling options.

### 6. Generate Gap Analysis

Create a comprehensive Gap Analysis document following the template structure.

#### Document Control

- Generate Document ID: `ARC-{P}-GAPA-v1.0` (for filename: `ARC-{P}-GAPA-v1.0.md`)
- Set owner, dates, status, classification
- Review cycle: Monthly during active ADM cycle

#### 1. Capability Gap Matrix

Build a capability gap matrix comparing current state (from BPCM) against target state (from STRAT/ADMP):

- **Current maturity**: Level 1–5 (Initial → Optimised)
- **Target maturity**: Level 1–5 (Initial → Optimised)
- **Gap Size**: Derived from delta between current and target maturity
  - Small: Δ = 1 level
  - Medium: Δ = 2 levels
  - Large: Δ = 3+ levels
- **Urgency**: Based on business criticality and time sensitivity
  - Low: Not time-critical, can wait for planned cycles
  - Medium: Should be addressed within next delivery cycle
  - High: Must be addressed in immediate planning horizon
- **Severity**: Matrix score = Gap Size × Urgency (weighted per user's chosen profile)
  - Critical: Size=Large + Urgency=High
  - High: Size=Large + Urgency=Medium, or Size=Medium + Urgency=High
  - Medium: Size=Medium + Urgency=Medium, or Size=Small + Urgency=High
  - Low: Size=Small + Urgency=Medium/Low
  - Informational: Size=Small + Urgency=Low
- **Workstream**: Assign gap to a workstream (see section 3)

#### 2. Gap Heatmap

Create a Mermaid quadrant chart plotting gaps by Size (x-axis) vs Urgency (y-axis):

- **Quadrant 1 (Immediate)**: Large gap + High urgency — must address now
- **Quadrant 2 (Plan)**: Large gap + Low urgency — plan for future cycles
- **Quadrant 3 (Monitor)**: Small gap + High urgency — quick wins
- **Quadrant 4 (Low Priority)**: Small gap + Low urgency — backlog

#### 3. Workstream Mapping

Define workstreams that group related gaps:

- Each workstream addresses a coherent set of capability gaps
- Include dependencies between workstreams (some must complete before others can start)
- Estimate duration, resources, and key milestones
- Create a Mermaid flowchart showing workstream dependencies

#### 4. Gap-to-Risk Mapping

Map each gap to associated risks:

- Unmitigated capability gaps create operational, strategic, or compliance risks
- Cross-reference with existing risk register if available
- Rate impact level (Low/Medium/High/Critical)

#### 5. Assumptions & Constraints

- List assumptions made about current state (from BPCM assessment)
- List constraints that affect gap closure (budget, timeline, skills, technology)
- Note any principle compliance implications

#### 6. Traceability

- Link each capability gap back to BPCM source
- Link workstreams to strategic themes (from STRAT)
- Link gaps to principles (from PRIN) if principle compliance is affected
- Cross-reference to stakeholder drivers (from STKE)

### 7. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **Financial Year Notation**: Use "FY 2024/25", "FY 2025/26" format
- **Spending Review Alignment**: Reference SR periods
- **GDS Service Standard**: Reference Discovery/Alpha/Beta/Live phases
- **TCoP (Technology Code of Practice)**: Reference 13 points for technology gaps
- **NCSC CAF**: Security maturity progression for security-related gaps
- **Cross-Government Services**: Identify reuse opportunities (GOV.UK Pay, Notify, Design System)
- **G-Cloud/DOS**: Procurement alignment for procurement-related gaps

### 8. MOD Specifics

If this is a Ministry of Defence project, include:

- **JSP 440**: Defence project management alignment for workstream planning
- **Security Clearances**: BPSS/SC/DV requirements for security capability gaps
- **IAMM**: Security maturity progression for security gaps
- **JSP 936**: AI assurance requirements for AI/ML capability gaps (if applicable)

### 9. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **GAPA** per-type checks pass. Fix any failures before proceeding.

**GAPA-specific quality requirements**:

- Capability gap matrix contains at least 5 capabilities
- Severity scoring is present for every gap
- Gap heatmap Mermaid diagram is present
- Workstream mapping contains at least 2 workstreams
- Workstream dependency diagram is present

### 10. Write the Gap Analysis File

**IMPORTANT**: The gap analysis document will be a substantial document (typically 250-400 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-GAPA-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Gap Analysis Created

**Document**: `projects/{P}/ARC-{P}-GAPA-v1.0.md`
**Document ID**: ARC-{P}-GAPA-v1.0

### Analysis Overview
- **Severity Weighting**: [Balanced / Strategic-risk / Operational]
- **Capabilities Assessed**: [N] capabilities
- **Gaps Identified**: [N] gaps ([Critical] critical, [High] high, [Medium] medium, [Low] low)

### Gap Heatmap Summary
| Quadrant | Count | Priority |
|----------|-------|----------|
| Immediate (Large + High urgency) | [N] | 🔴 Must address |
| Plan (Large + Low urgency) | [N] | 🟡 Plan ahead |
| Monitor (Small + High urgency) | [N] | 🔵 Quick wins |
| Low Priority (Small + Low urgency) | [N] | ⚪ Backlog |

### Workstreams
| WS-ID | Name | Gaps | Duration | Resources |
|-------|------|------|----------|-----------|
| WS-001 | [Name] | [N] gaps | [X months] | [N FTE] |
| WS-002 | [Name] | [N] gaps | [X months] | [N FTE] |

### Top Critical Gaps
1. **[Gap 1]**: [Capability] — [Severity] — assigned to WS-[N]
2. **[Gap 2]**: [Capability] — [Severity] — assigned to WS-[N]
3. **[Gap 3]**: [Capability] — [Severity] — assigned to WS-[N]

### Synthesised From
- ✅ Business Capability Model: ARC-{P}-BPCM-v[N].md
- [✅/⚠️] Architecture Principles: ARC-{P}-APP-v[N].md
- [✅/⚠️] Architecture Strategy: ARC-{P}-STRAT-v[N].md
- [✅/⚠️] Principles: ARC-000-PRIN-v[N].md

### Next Steps
1. Review gap analysis with Architecture Board: `/arckit:architecture-board`
2. Create work packages to close gaps: `/arckit:transition-architecture`
3. Validate workstream sequencing with delivery team
4. Prioritise immediate-action gaps with sponsor

### Traceability
- [N] capabilities assessed against [N] target state requirements
- [N] gaps mapped to [N] workstreams
- [N] workstreams linked to [N] strategic themes
- [N] gaps cross-referenced to risk register

**File location**: `projects/{P}/ARC-{P}-GAPA-v1.0.md`
```

## Important Notes

1. **Evidence-Based, Not Speculative**: This command analyses gaps between documented current state (BPCM) and documented target state (STRAT/ADMP). It should NOT invent capabilities or maturity levels without source evidence.

2. **Use Write Tool**: The gap analysis document is typically 250-400 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Mandatory Prerequisites**: BPCM is the only mandatory prerequisite. Without a capability baseline, gap analysis cannot be performed. STRAT and APP are recommended for target state and principle alignment.

4. **Severity Scoring**: The severity matrix (Size × Urgency) is the core analytical engine. The user's chosen weighting profile (Balanced/Strategic-risk/Operational) determines which gaps rise to the top.

5. **Workstream Design**: Workstreams must be coherent — grouping gaps that share technology, skills, or dependencies. Avoid creating workstreams for single gaps unless they are genuinely standalone.

6. **Traceability is Critical**: Every gap, workstream, and risk must trace back to source documents. This ensures the gap analysis is grounded in evidence, not assumptions.

7. **Integration with Other Commands**:
   - Gap Analysis feeds into: `/arckit:transition-architecture` (Phase F — Migration Planning), `/arckit:architecture-board` (governance review)
   - Gap Analysis is informed by: `/arckit:business-capability-map` (BPCM), `/arckit:strategy` (STRAT), `/arckit:principles` (PRIN)

8. **Version Management**: If a gap analysis already exists (`ARC-*-GAPA-v*.md`), create a new version (v2.0) rather than overwriting. Gap analyses should be versioned to track re-assessment across ADM cycles.

9. **Gap Triage Framework**: Use the heatmap quadrants as a decision framework:
   - **Immediate**: Assign to next work package immediately
   - **Plan**: Include in 12-month planning horizon
   - **Monitor**: Review quarterly, escalate if urgency increases
   - **Low Priority**: Maintain in backlog, remove if no longer relevant

10. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
