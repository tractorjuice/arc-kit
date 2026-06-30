---
description: Set ADM scope, architecture vision, drivers, constraints, and success criteria
argument-hint: "<project ID or name, e.g. '001', 'enterprise transformation vision'>"
effort: high
handoffs:
  - command: business-capability-map
    description: Map business capabilities within the defined scope
  - command: gap-analysis
    description: Perform gap analysis based on scope and vision
---

You are helping an enterprise architect create an **Architecture Vision** document for the Preliminary phase of the TOGAF Architecture Development Method (ADM). This document defines the scope, drivers, constraints, and success criteria that will guide all subsequent ADM phases.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Guiding principles, decision framework, technology standards
  - If missing: STOP and ask user to run `/arckit:principles` first. The Preliminary ADM must be grounded in architecture principles.

**RECOMMENDED** (read if available, note if missing):

- **STKE** (Stakeholder Analysis) — Extract: Stakeholder drivers, goals, measurable outcomes, conflicts, engagement strategies
- **STRAT** (Architecture Strategy) — Extract: Strategic vision, investment envelope, strategic themes, high-level direction

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing vision documents, strategic plans, enterprise architecture mandates
- Read any **enterprise standards** in `projects/000-global/external/` — extract architecture vision statements, enterprise transformation plans, cross-project alignment documents
- If no external vision docs found but they would improve the output, ask: "Do you have any existing vision documents, architecture mandates, or transformation charters? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/adm-preliminary-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/adm-preliminary-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize adm-preliminary`

### 3. Clarify Scope with User

Before generating the document, ask the user about the scope of this ADM engagement:

**AskUserQuestion**: "What is the scope of this ADM engagement?"

- Options: `Enterprise-wide` | `Business Unit` | `Project-specific`
- Default: `Business Unit`

### 4. Generate Architecture Vision Document

Create the Architecture Vision document following the template structure. Populate all sections with content derived from the available artifacts.

#### Document Control

- Generate Document ID: `ARC-{P}-ADMP-v1.0` (for filename: `ARC-{P}-ADMP-v1.0.md`)
- Set owner, dates, status, classification
- Review cycle: Monthly during active ADM cycle

#### Architecture Vision

- **2-3 paragraph narrative** articulating the transformation vision
- Ground the vision in principles from PRIN
- Reference stakeholder drivers from STKE
- If STRAT is available, align with strategic themes

#### Scope Boundaries

- **In scope**: Capabilities, systems, business areas within the ADM engagement scope
- **Out of scope**: Explicitly excluded areas — be specific to prevent scope creep

#### Drivers

- **Strategic drivers**: Business outcomes and strategic imperatives (from STKE)
- **Operational drivers**: Day-to-day operational needs and pain points
- **Compliance drivers**: Regulatory and governance requirements
- **Technology drivers**: Technology landscape changes and modernisation needs
- Minimum 3 drivers across all categories

#### Constraints

- **Budget**: Financial envelope and limitations
- **Timeline**: Deadlines and time-based constraints
- **Regulatory**: Compliance and legal constraints
- **Technical**: Technical limitations and dependencies
- Minimum 2 constraints

#### Resources

- **Team**: Key roles and people involved
- **Budget**: Budget envelope for the engagement
- **Tools**: Key tools and platforms to be used

#### Success Criteria

- Define measurable outcomes with specific metrics and targets
- Minimum 3 success criteria
- Each criterion should have a measurable metric and target value

#### High-Level Architecture Landscape

- Include a **Mermaid C4 Context diagram** showing the target architecture at a high level
- Show key systems, stakeholders, and integration points
- Keep it conceptual — detailed diagrams come in later phases

#### Stakeholder Map

- Populated from STKE if available
- Include stakeholder name, role, interest, influence level, and engagement strategy
- If STKE is not available, create placeholder rows and note that detailed stakeholder analysis is needed

#### ADM Scope Note

- Indicate which ADM phases are in scope for this engagement
- All phases are in scope by default for a full ADM cycle
- Mark phases with notes on inclusions/exclusions

#### Traceability

- Link to PRIN (architecture principles)
- Link to STKE (stakeholder analysis)
- Link to STRAT if available
- Show clear traceability from drivers → vision → success criteria

### 5. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **Financial Year Notation**: Use "FY 2024/25", "FY 2025/26" format
- **Spending Review Alignment**: Reference SR periods
- **GDS Service Standard**: Reference Discovery/Alpha/Beta/Live phases
- **TCoP (Technology Code of Practice)**: Reference 13 points
- **NCSC CAF**: Security maturity progression
- **Cross-Government Services**: GOV.UK Pay, Notify, Design System
- **G-Cloud/DOS**: Procurement alignment

### 6. MOD Specifics

If this is a Ministry of Defence project, include:

- **JSP 440**: Defence project management alignment
- **Security Clearances**: BPSS, SC, DV requirements
- **IAMM**: Security maturity progression
- **JSP 936**: AI assurance (if applicable)

### 7. Load Mermaid Syntax References

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` for official Mermaid syntax — node shapes, edge labels, and styling options for C4 Context diagrams.

### 8. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **ADMP** per-type checks pass. Fix any failures before proceeding.

### 9. Write the Vision File

**IMPORTANT**: The Architecture Vision document will be a substantial document (typically 200-350 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-ADMP-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 10. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Architecture Vision Created

**Document**: `projects/{P}/ARC-{P}-ADMP-v1.0.md`
**Document ID**: ARC-{P}-ADMP-v1.0

### Vision Scope
- **Scope**: [Enterprise-wide / Business Unit / Project-specific]
- **In Scope**: [N] areas
- **Out of Scope**: [N] areas explicitly excluded

### Drivers & Constraints
- **Drivers**: [N] drivers identified ([strategic] strategic, [operational] operational, [compliance] compliance, [technology] technology)
- **Constraints**: [N] constraints ([budget] budget, [timeline] timeline, [regulatory] regulatory, [technical] technical)

### Success Criteria
| # | Criterion | Target |
|---|-----------|--------|
| 1 | [Criterion 1] | [Target 1] |
| 2 | [Criterion 2] | [Target 2] |
| 3 | [Criterion 3] | [Target 3] |

### ADM Scope
- **In scope phases**: [List phases marked as in scope]
- **Out of scope phases**: [List phases marked as out of scope]

### Synthesised From
- ✅ Architecture Principles: ARC-000-PRIN-v[N].md
- [✅/⚠️] Stakeholder Analysis: ARC-{P}-STKE-v[N].md
- [✅/⚠️] Architecture Strategy: ARC-{P}-STRAT-v[N].md

### Next Steps
1. Review Architecture Vision with Architecture Board / Sponsor
2. Validate scope boundaries with key stakeholders
3. Begin Phase A (Architecture Vision refinement): `/arckit:business-capability-map`
4. Perform gap analysis: `/arckit:gap-analysis`

### Traceability
- Aligns to [N] architecture principles
- Addresses [N] stakeholder drivers
- Defines [N] success criteria

**File location**: `projects/{P}/ARC-{P}-ADMP-v1.0.md`
```

## Important Notes

1. **Technology-Agnostic**: This document must remain technology-agnostic at this stage. Specific technology decisions belong in later ADM phases (Phases B, C, D). The Preliminary phase sets the vision, not the technical solution.

2. **Traceability is Critical**: Every driver, constraint, and success criterion must trace back to source documents (PRIN, STKE, STRAT). This ensures the vision is grounded in agreed artifacts, not assumptions.

3. **Mandatory Prerequisites**: The Preliminary ADM requires PRIN (principles) as a mandatory prerequisite. STKE and STRAT are strongly recommended but the command can proceed with warnings if missing.

4. **Executive Audience**: The Architecture Vision is intended for executive stakeholders and governance bodies. Use appropriate language and focus on business outcomes rather than technical details.

5. **Scope Boundaries**: Be explicit about what is out of scope. Ambiguous scope boundaries are the most common cause of ADM engagement failure.

6. **Version Management**: If an Architecture Vision already exists (`ARC-*-ADMP-v*.md`), create a new version (v2.0) rather than overwriting. Architecture visions should be versioned to track evolution across ADM cycles.

7. **Integration with Other Commands**:
   - ADMP feeds into: `/arckit:business-capability-map` (Phase A — Business Architecture), `/arckit:gap-analysis` (Phase E — Opportunities & Solutions)
   - ADMP is informed by: `/arckit:principles`, `/arckit:stakeholders`, `/arckit:strategy`

8. **TOGAF Alignment**: This document maps to TOGAF ADM Preliminary Phase outputs: Architecture Principles, Architecture Repository, Architecture Capability, ADM Scope & Tailoring, and Architecture Vision.

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
