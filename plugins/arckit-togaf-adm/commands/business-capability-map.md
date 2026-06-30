---
description: Map business capabilities, value streams, and maturity for Phase A Business Architecture
argument-hint: "<project ID or name, e.g. '001', 'enterprise capability mapping'>"
effort: high
handoffs:
  - command: gap-analysis
    description: Analyze capability gaps against target state
  - command: application-inventory
    description: Map applications to capabilities
---

You are helping an enterprise architect create a **Business Capability Map** for TOGAF ADM Phase A (Business Architecture). This document maps the enterprise's capabilities, value streams, and maturity levels to establish the business architecture baseline.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **ADMP** (ADM Preliminary / Architecture Vision) — Extract: Scope boundaries, architecture vision, drivers, constraints, success criteria, in-scope capabilities
  - If missing: STOP and ask user to run `/arckit:adm-preliminary` first. Business Architecture must be grounded in the ADM scope and vision.

**RECOMMENDED** (read if available, note if missing):

- **REQ** (Requirements) — Extract: Business requirements, functional requirements, non-functional requirements, requirement priorities
- **STKE** (Stakeholder Analysis) — Extract: Stakeholder goals, pain points, value expectations, influence areas
- **PRIN** (Architecture Principles, in 000-global) — Extract: Business principles, capability design guidelines, governance requirements

**OPTIONAL** (read if available, skip silently if missing):

- **APP** (Application Inventory) — Extract: Current application landscape, system ownership, application-to-business mapping

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing capability models, business process documentation, service catalogs
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise capability frameworks, business taxonomy standards, capability naming conventions
- If no external capability docs found but they would improve the output, ask: "Do you have any existing capability maps, process models, or service catalogs? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
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

- **First**, check if `.arckit/templates-custom/capability-map-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/capability-map-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize capability-map`

### 3. Clarify Capability Depth with User

**AskUserQuestion**: "What level of capability detail do you need?"

- Options: `Level 1` (Domains only) | `Level 2` (Domains + Sub-capabilities) | `Level 3` (Full hierarchy)
- Default: `Level 3`

### 4. Generate Business Capability Map

Create a comprehensive Business Capability Map following the template structure. The document should:

#### Document Control

- Generate Document ID: `ARC-{P}-BPCM-v1.0` (for filename: `ARC-{P}-BPCM-v1.0.md`)
- Set owner, dates, classification, status
- Review cycle: Monthly during active ADM cycle

#### Capability Hierarchy (Level 1 → 2 → 3)

- **Level 1 — Capability Domains**: 3-7 top-level domains aligned to the ADMP scope and business drivers. Examples: Customer Management, Product & Service Delivery, Finance & Accounting, Enterprise Operations, Innovation & R&D. Each domain gets a `C{N}.0` ID.
- **Level 2 — Sub-Capabilities**: 3-8 sub-capabilities per domain, numbered `C{N}.{M}`. Each sub-capability must be mutually exclusive and collectively exhaustive within its domain.
- **Level 3 — Detailed Capabilities**: 2-5 granular capabilities per sub-capability, numbered `C{N}.{M}.{K}`. Only include at this depth if the user requested Level 3 detail.
- **Capability Map (Mermaid mindmap)**: Visual hierarchy showing all domains, sub-capabilities, and (if Level 3) detailed capabilities.

#### Value Streams

- **Value Stream Matrix**: Map 3-5 value streams, each linking triggers to outcomes through sequences of capabilities. Number as `VS-001`, `VS-002`, etc.
- **Value Stream Flow**: Mermaid flowchart for at least one key value stream showing capability sequence from trigger to outcome.

#### Capability Maturity Assessment

- **Maturity Scale**:
  - L1 (Initial): Ad-hoc, undocumented, inconsistent
  - L2 (Managed): Documented, repeatable, locally managed
  - L3 (Defined): Standardised, integrated across the organisation
  - L4 (Quantitatively Managed): Measured, controlled, predictable
  - L5 (Optimising): Continuously improved, innovative, best-in-class
- **Maturity Table**: For each capability (or Level 2 sub-capability minimum), assess current maturity, target maturity, identify the gap, and assign a priority (High/Medium/Low) based on strategic importance.

#### Capability Heatmap

- **Mermaid quadrant chart**: Plot capabilities on a Strategic Importance (x-axis) vs Current Maturity (y-axis) quadrant chart. Use quadrant labels:
  - Quadrant 1 (High Importance, Low Maturity): **Invest** — priorities for transformation
  - Quadrant 2 (High Importance, High Maturity): **Maintain** — protect competitive advantage
  - Quadrant 3 (Low Importance, Low Maturity): **Monitor** — watch for change
  - Quadrant 4 (Low Importance, High Maturity): **Transform** — candidates for automation/offloading

#### Capability-Requirement Traceability Matrix

- If REQ is available, map each requirement to the capabilities that address it.
- Coverage: `Full` (capability fully satisfies requirement), `Partial` (capability partially satisfies), `Gap` (no capability currently addresses requirement).
- If REQ is not available, note this and leave the section as a placeholder.

#### Capability-Principle Alignment

- Map each architecture principle to the capabilities it governs or influences.
- Alignment status: `Aligned` (capability design follows principle), `Partial` (capability partially addresses principle), `Misaligned` (capability conflicts with principle — flag for remediation).

#### Capability-to-Application Mapping (if APP exists)

- If Application Inventory (APP) is available, map capabilities to applications that support them.
- Include: Capability, Application, Relationship (supports/enables/replaces), Confidence Level.

#### Traceability

- Link ADMP → BPCM → REQ → PRIN with document IDs.
- Include all available source artifacts (ADMP mandatory, REQ/STKE/PRIN optional).

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

Read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/mindmap.md` and `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` for official Mermaid syntax — mindmap node syntax, flowchart node shapes, edge labels, and styling options. Also read `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/quadrant.md` for quadrant chart syntax.

### 8. Mermaid Diagram Requirements

Include the following Mermaid diagrams:

1. **Capability Map** (mindmap showing full hierarchy)
2. **Value Stream Flow** (flowchart for at least one key value stream)
3. **Capability Heatmap** (quadrantChart: strategic importance vs maturity)

**Syntax Rules**:

- ✅ Mindmap: Use `[Label]` for child nodes, `root((Label))` for root
- ✅ Flowchart: Node labels can use `<br/>`, edge labels cannot
- ✅ Quadrant chart: Coordinate values between 0.0 and 1.0

### 9. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **BPCM** per-type checks pass. Fix any failures before proceeding.

**BPCM-specific quality checks**:

- Capability hierarchy has ≥ 3 Level 1 domains
- Each domain has ≥ 2 sub-capabilities (Level 2)
- At least 1 value stream is defined with trigger and outcome
- Maturity assessment table includes current maturity and target maturity columns
- Capability heatmap (Mermaid quadrant chart) is present
- Traceability matrix links BPCM to ADMP, REQ, STKE, and PRIN
- Capability IDs follow `C{N}.{M}.{K}` convention consistently throughout the document

### 10. Write the Capability Map File

**IMPORTANT**: The capability map document will be a substantial document (typically 250-450 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-BPCM-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Business Capability Map Created

**Document**: `projects/{P}/ARC-{P}-BPCM-v1.0.md`
**Document ID**: ARC-{P}-BPCM-v1.0

### Capability Overview
- **Capability Depth**: [Level 1 / Level 2 / Level 3]
- **Domains (L1)**: [N] capability domains
- **Sub-Capabilities (L2)**: [N] sub-capabilities
- **Detailed Capabilities (L3)**: [N] detailed capabilities (if applicable)
- **Value Streams**: [N] value streams mapped

### Maturity Summary
| Maturity Level | Capabilities | Description |
|---------------|--------------|-------------|
| L1 (Initial) | [N] | [Description] |
| L2 (Managed) | [N] | [Description] |
| L3 (Defined) | [N] | [Description] |
| L4 (Quantitative) | [N] | [Description] |
| L5 (Optimising) | [N] | [Description] |

### Key Findings
- **Highest Priority Gaps**: [Top 3 capabilities needing most improvement]
- **Strategic Investment Areas**: [Quadrant 1 capabilities — high importance, low maturity]
- **Competitive Advantages**: [Quadrant 2 capabilities — high importance, high maturity]

### Requirement Coverage
- **Fully Covered**: [N] requirements
- **Partially Covered**: [N] requirements
- **Gap (No Capability)**: [N] requirements

### Capability-Principle Alignment
- **Aligned**: [N] capabilities fully aligned with principles
- **Partial**: [N] capabilities partially aligned
- **Misaligned**: [N] capabilities misaligned (need remediation)

### Synthesised From
- ✅ ADM Preliminary: ARC-{P}-ADMP-v[N].md
- [✅/⚠️] Requirements: ARC-{P}-REQ-v[N].md
- [✅/⚠️] Stakeholders: ARC-{P}-STKE-v[N].md
- [✅/⚠️] Principles: ARC-000-PRIN-v[N].md
- [✅/⚠️] Applications: ARC-{P}-APP-v[N].md

### Next Steps
1. Review capability map with business architecture stakeholders
2. Validate maturity assessments with capability owners
3. Prioritise investment areas with investment board
4. Perform gap analysis: `/arckit:gap-analysis`
5. Map applications to capabilities: `/arckit:application-inventory`

### Traceability
- Grounded in [N] ADM Preliminary scope items
- Addresses [N] business requirements
- Aligned to [N] architecture principles
- Supports [N] stakeholder value expectations

**File location**: `projects/{P}/ARC-{P}-BPCM-v1.0.md`
```

## Important Notes

1. **Business-Led, Not IT-Led**: Capability maps describe WHAT the business does, not HOW it does it. Avoid technology-specific terms. Focus on business outcomes and value delivery.

2. **Mutually Exclusive, Collectively Exhaustive**: Capability domains should be MECE — no overlap between domains, and together they cover the full enterprise scope defined in ADMP.

3. **Maturity is Assessment, Not Ranking**: The maturity assessment reflects current operational reality. Do not assume higher maturity is always better — some capabilities are intentionally simple and efficient.

4. **Value Streams Are Cross-Cutting**: A single capability may participate in multiple value streams. Model this explicitly rather than duplicating capabilities.

5. **Traceability is Critical**: Every capability should trace to at least one driver from ADMP. Requirements trace to capabilities, and capabilities trace to principles. This chain ensures the business architecture is grounded in business needs.

6. **Version Management**: If a capability map already exists (`ARC-*-BPCM-v*.md`), create a new version (v2.0) rather than overwriting. Capability maps should be versioned to track evolution across ADM cycles.

7. **Integration with Other Commands**:
   - BPCM feeds into: `/arckit:gap-analysis` (Phase E — gap identification), `/arckit:application-inventory` (Phase C — application architecture)
   - BPCM is informed by: `/arckit:adm-preliminary`, `/arckit:requirements`, `/arckit:stakeholders`, `/arckit:principles`

8. **TOGAF Alignment**: This document maps to TOGAF ADM Phase A outputs: Business Architecture description, business capability definition, and value stream analysis.

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji
