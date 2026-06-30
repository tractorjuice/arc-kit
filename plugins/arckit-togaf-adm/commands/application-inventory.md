---
description: Catalog existing applications with strategic fit scoring, dependencies, and lifecycle status
argument-hint: "<project ID or scope, e.g. '001', 'all applications', 'cloud portfolio'>"
effort: high
handoffs:
  - command: application-rationalization
    description: Decide keep/merge/replace/retire for each application
  - command: gap-analysis
    description: Analyze capability coverage from application inventory
---

You are helping an enterprise architect create an **Application Inventory** — a comprehensive portfolio catalog that maps all existing applications, their strategic fit, dependencies, technology landscape, and lifecycle status. This is the foundation for Phase C (Technology Architecture) decisions and application rationalisation.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Foundational Artifacts

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

**MANDATORY** (warn if missing):

- **ADMP** (Architecture Vision / Preliminary ADM) — Extract: Scope boundaries, ADM phase inclusions, strategic vision
  - If missing: STOP and ask user to run `/arckit:adm-preliminary` first. The application inventory must be scoped by the architecture vision.

**RECOMMENDED** (read if available, note if missing):

- **BPCM** (Business Capability Map) — Extract: Capability landscape, capability owners, capability-to-business value mapping
- **REQ** (Requirements) — Extract: System requirements, application migration requirements, integration requirements
- **PRIN** (Architecture Principles, in 000-global) — Extract: Technology standards, cloud strategy, application portfolio principles

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing application catalogues, portfolio assessments, asset inventories, technology register
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise technology standards, approved technology stack, technology rationalisation targets
- If no external application docs found but they would improve the inventory, ask: "Do you have any existing application catalogues, portfolio assessments, or technology registers? I can read PDFs, spreadsheets, and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
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

- **First**, check if `.arckit/templates-custom/application-inventory-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/application-inventory-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize application-inventory`

### 3. Clarify Scope with User

Before generating the inventory, ask the user about the scope of this assessment:

**AskUserQuestion**: "What is the scope of this application inventory?"

- Options: `All applications` | `Business Unit` | `Specific Project`
- Default: `All applications`

### 4. Gather Application Data

Collect application information from all available sources:

- **From ADMP**: Scope boundaries — which business areas / systems are in scope
- **From BPCM**: Capabilities covered by each application, capability gaps
- **From REQ**: Requirements driving application changes — new capabilities, integration points, technology constraints
- **From external documents**: Existing application catalogues, technology registers, portfolio assessments
- **From user**: Direct input about known applications, strategic priorities, technology strategy

### 5. Load Mermaid Syntax References

Read the following Mermaid syntax references for diagrams:

- `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/quadrantChart.md` — Strategic fit matrix (quadrant chart)
- `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/pie.md` — Technology distribution (pie chart)
- `${CLAUDE_PLUGIN_ROOT}/skills/mermaid-syntax/references/flowchart.md` — Dependency map (flowchart)

### 6. Generate Application Inventory

Create the Application Inventory document following the template structure.

#### Application Register

For each application, determine and document:

- **App ID**: APP-001, APP-002, etc.
- **Name**: Application name / product name
- **Category**: Line-of-Business, Shared Service, Platform, Customer-Facing, Internal Tool, etc.
- **Owner**: Business owner and technical owner
- **Technology Stack**: Primary runtime, framework, database, hosting model
- **Lifecycle Phase**: Concept / Discovery / Development / Operational / Mature / Declining / Retired
- **Status**: Active / Deprecated / Planned / Under Review
- **Strategic Fit**: Score each application using the following framework:

  | Strategic Fit Rating | Criteria | Action |
  |---|---|---|
  | **Strategic** | Core to business strategy, competitive differentiator, high business value | Invest & Grow |
  | **Critical** | Essential for operations but not a differentiator, commodity functionality | Maintain & Optimise |
  | **Support** | Supplementary functionality, low business value relative to cost | Rationalise |
  | **Replace** | High technical debt, poor alignment with strategy, better alternatives exist | Plan Replacement |

#### Strategic Fit Matrix

Generate a Mermaid quadrant chart plotting applications on:

- **X-axis**: Technical Debt (Low → High)
- **Y-axis**: Business Value (Low → High)

Quadrants:

1. **Keep & Invest** (Low Debt, High Value) — Strategic apps
2. **Modernize** (High Debt, High Value) — Critical apps needing refactoring
3. **Retire** (High Debt, Low Value) — Replace candidates
4. **Monitor** (Low Debt, Low Value) — Support apps to watch

#### Technology Landscape Heatmap

Generate a Mermaid pie chart showing technology distribution across the portfolio:

- **Cloud-Native**: Containers, serverless, managed services
- **Containerised**: Docker/Kubernetes deployments
- **Virtualised**: VM-based deployments
- **Physical**: Bare metal / on-premise hardware

Also include a technology diversity analysis:

- **Runtime diversity**: Number of unique runtimes/languages (target: reduce)
- **Platform diversity**: Number of unique hosting platforms (target: standardise)
- **Vendor lock-in risk**: Assessed per application

#### Application Dependencies

Generate a Mermaid flowchart showing:

- Inter-application dependencies (upstream/downstream)
- Shared services and common platforms
- External / third-party dependencies
- Critical path analysis — which apps, if down, cascade to others

#### Application-to-Capability Mapping

Map each application to the business capabilities it supports:

- Full coverage: Application is the primary system for the capability
- Partial coverage: Application handles some aspects; other systems also contribute
- Overlap: Multiple applications cover the same capability (rationalisation candidate)
- Gap: Capability has no system coverage

#### Application Lifecycle

For each application, document:

- **Age**: Time since initial deployment
- **EOL Date**: Known end-of-life date for platform/runtime/framework
- **Next Major Version**: Planned upgrade schedule
- **End of Life Plan**: Migration/retirement plan

#### Risk Register

Identify application-level risks:

- **Technical**: Unsupported technology, security vulnerabilities, scalability limits
- **Operational**: Single point of failure, lack of skilled staff, poor documentation
- **Compliance**: Data residency, audit requirements, certification expiry
- **Strategic**: Misalignment with direction, vendor risk, market obsolescence

#### Traceability

- Link ADMP → Application scope
- Link BPCM → Capability coverage
- Link REQ → Application requirements
- Link PRIN → Technology alignment

### 7. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **Technology Code of Practice (TCoP)**: Align application assessment against 13 TCoP points
- **GDS Technology Standards**: Check against [GDS Technology Standards Catalogue](https://technology-standards.service.gov.uk/)
- **CloudFirst**: Compliance with CloudFirst policy for hosting model
- **Spending Control Alignment**: Application costs mapped to SR periods
- **Cross-Government Services**: Identify opportunities for GOV.UK Pay, Notify, Verify, Design System

### 8. MOD Specifics

If this is a Ministry of Defence project, include:

- **Defiance Programme**: Cloud migration status and MOD Cloud Programme alignment
- **JSP 440**: System project management stage alignment
- **IAMM Level**: Information assurance maturity for each application
- **SSE**: Single Source Estate compliance for commercial tools

### 9. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **APP** per-type checks pass. Fix any failures before proceeding.

**Additional quality checks for Application Inventory**:

1. **Register Completeness**: Application register must contain ≥3 applications with complete data (ID, name, category, owner, technology, lifecycle, status, strategic fit)
2. **Strategic Fit Scoring**: Every application in the register must have a strategic fit rating assigned (Strategic/Critical/Support/Replace)
3. **Dependency Diagram**: At least one Mermaid flowchart showing inter-application dependencies
4. **Capability Mapping**: Every application must be mapped to at least one business capability
5. **Lifecycle Data**: Every application must have lifecycle phase and status documented

### 10. Write the Output

**IMPORTANT**: The Application Inventory document will be a substantial document. You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-APP-v1.0.md
```

Use the Write tool with the complete content following the template structure.

#### Auto-Populate Document Information Fields

Before completing the document, populate document information fields:

- `[PROJECT_ID]` → Extract from project path (e.g., "001")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Application Inventory"
- `ARC-[PROJECT_ID]-APP-v[VERSION]` → Generated document ID
- `[STATUS]` → "DRAFT" for new documents
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" (UK Gov) or "PUBLIC"

#### User-provided fields

- `[PROJECT_NAME]` → Full project name
- `[OWNER_NAME_AND_ROLE]` → Document owner

#### Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:application-inventory` command |
```

#### Generation Metadata Footer

```markdown
**Generated by**: ArcKit `/arckit:application-inventory` command
**Generated on**: {DATE}
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Actual model name]
```

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Application Inventory Complete

**Document**: `projects/{P}/ARC-{P}-APP-v1.0.md`
**Document ID**: ARC-{P}-APP-v1.0

### Inventory Scope
- **Scope**: [All applications / Business Unit / Project-specific]
- **Applications catalogued**: [N]

### Strategic Fit Summary
| Rating | Count | Examples |
|--------|-------|----------|
| Strategic | [N] | [App names] |
| Critical | [N] | [App names] |
| Support | [N] | [App names] |
| Replace | [N] | [App names] |

### Technology Landscape
- **Cloud-Native**: [N]% of portfolio
- **Containerised**: [N]% of portfolio
- **Virtualised**: [N]% of portfolio
- **Physical**: [N]% of portfolio
- **Technology diversity**: [N] unique runtimes, [N] platforms

### Dependency Analysis
- **Applications with dependencies mapped**: [N]
- **Shared services identified**: [N]
- **Critical dependencies**: [N] (single points of failure)

### Capability Coverage
- **Capabilities covered**: [N] out of [N] (from BPCM)
- **Full coverage**: [N] capabilities
- **Partial coverage**: [N] capabilities
- **Gaps (no system)**: [N] capabilities
- **Overlaps**: [N] capabilities covered by multiple apps

### Lifecycle
- **Active**: [N] applications
- **Deprecated**: [N] applications
- **Planned**: [N] applications
- **Applications approaching EOL**: [N]

### Risk Summary
- **High risks**: [N]
- **Medium risks**: [N]
- **Low risks**: [N]

### Synthesised From
- ✅ Architecture Vision: ARC-{P}-ADMP-v[N].md
- [✅/⚠️] Business Capability Map: ARC-{P}-BPCM-v[N].md
- [✅/⚠️] Requirements: ARC-{P}-REQ-v[N].md
- [✅/⚠️] Architecture Principles: ARC-000-PRIN-v[N].md

### Next Steps
1. Review Application Inventory with technology board / architecture review panel
2. Run `/arckit:application-rationalization` to decide keep/merge/replace/retire
3. Run `/arckit:gap-analysis` to identify capability coverage gaps

### Traceability
- [N] applications mapped to [N] capabilities
- [N] dependencies documented
- [N] risks identified
- [N] lifecycle actions required

**File location**: `projects/{P}/ARC-{P}-APP-v1.0.md`
```

## Important Notes

1. **Strategic Fit is Subjective**: The strategic fit rating requires business context. Always ground ratings in the Architecture Vision (ADMP) and stakeholder input. When uncertain, flag applications for architectural review.

2. **Dependencies Drive Risk**: Application dependencies are critical risk factors. Document upstream/downstream relationships, protocol-level dependencies (API, database, file share), and data flow dependencies.

3. **Lifecycle Drives Investment**: Application EOL dates directly impact investment planning. Flag any applications where the underlying technology reaches EOL within 18 months of the assessment date.

4. **Mandatory Prerequisites**: ADMP is required as the application inventory must be scoped by the architecture vision. BPCM, REQ, and PRIN are recommended for full context.

5. **Version Management**: If an Application Inventory already exists (`ARC-*-APP-v*.md`), create a new version (v2.0) rather than overwriting. Track portfolio evolution across ADM cycles.

6. **Integration with Other Commands**:
   - **Input**: Requires ADMP (scope), uses BPCM (capability mapping), REQ (requirements), PRIN (technology standards)
   - **Output**: Feeds `/arckit:application-rationalization` (portfolio decisions), `/arckit:gap-analysis` (capability gaps)

7. **TOGAF Alignment**: This document maps to TOGAF Phase C (Technology Architecture) outputs: existing technology baseline, technology standards, and application portfolio assessment.

8. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
