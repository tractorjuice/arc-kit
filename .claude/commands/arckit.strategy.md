---
description: Synthesise strategic artifacts into executive-level Architecture Strategy document
---

You are helping an enterprise architect create an **Architecture Strategy** document. This document synthesises insights from multiple strategic artifacts (principles, stakeholders, wardley maps, roadmap, business case) into a single coherent executive-level narrative.

## User Input

```text
$ARGUMENTS
```

## Prerequisites: Read Strategic Artifacts

Scan the project directory for existing strategic artifacts and read them to synthesise this strategy:

**MANDATORY** (warn if missing):
- `ARC-000-PRIN-*.md` in `projects/000-global/` — Architecture principles
  - Extract: Guiding principles, decision framework, technology standards
  - If missing: STOP and ask user to run `/arckit.principles` first. Strategy must be grounded in principles.
- `ARC-*-STKE-*.md` in `projects/{project-dir}/` — Stakeholder analysis
  - Extract: Stakeholder drivers, goals, measurable outcomes, conflicts, engagement strategies
  - If missing: STOP and ask user to run `/arckit.stakeholders` first. Strategy must address stakeholder drivers.

**RECOMMENDED** (read if available, note if missing):
- `ARC-*-WARD-*.md` in `projects/{project-dir}/wardley-maps/` — Wardley maps
  - Extract: Component evolution, build vs buy positioning, technology radar
- `ARC-*-ROAD-*.md` in `projects/{project-dir}/` — Architecture roadmap
  - Extract: Timeline, phases, milestones, investment by year, capability evolution
- `ARC-*-SOBC-*.md` in `projects/{project-dir}/` — Strategic Outline Business Case
  - Extract: Investment figures, NPV, IRR, payback period, benefits timeline

**OPTIONAL** (read if available, skip silently if missing):
- `ARC-*-RISK-*.md` in `projects/{project-dir}/` — Risk register
  - Extract: Strategic risks, mitigations, risk appetite

**What to extract from each document**:
- **Principles**: Decision framework, technology standards, governance guardrails
- **Stakeholders**: Business drivers (SD-*), goals (G-*), outcomes (O-*), stakeholder power/interest grid
- **Wardley Maps**: Build vs buy decisions, technology evolution stages, strategic positioning
- **Roadmap**: Timeline, phases, themes, milestones, investment by year
- **SOBC**: Total investment, ROI, payback period, benefits realisation
- **Risk**: Top strategic risks, mitigations, assumptions, constraints

### Prerequisites 1b: Check for External Documents (optional)

Scan for external (non-ArcKit) documents the user may have provided:

**Strategy Documents**:
- **Look in**: `projects/{project-dir}/external/`
- **File types**: PDF (.pdf), Word (.docx), Markdown (.md), Images (.png, .jpg)
- **What to extract**: Existing strategies, strategic plans, vision documents
- **Examples**: `digital-strategy.pdf`, `technology-vision.docx`, `strategic-plan.png`

**User prompt**: If no external strategy docs found but they would improve the output, ask:
"Do you have any existing strategy documents, vision statements, or strategic plans? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

**Important**: This command works without external documents. They enhance output quality but are never blocking.

## Instructions

### 1. Identify or Create Project

Run the project creation script to get the project directory:

```bash
bash .arckit/scripts/bash/create-project.sh --name "[project-name-from-user-input]" --json
```

Parse the JSON response to extract:
- `project_path`: Where to create the strategy file
- `project_id`: For document ID generation
- `project_name`: For document metadata

### 2. Gather Strategic Context

Read all available documents identified in the Prerequisites section above. Build a mental model of:
- **What drives stakeholders** (from stakeholders document)
- **What principles guide decisions** (from principles document)
- **How technology should evolve** (from Wardley maps if available)
- **When capabilities will be delivered** (from roadmap if available)
- **Why this investment makes sense** (from SOBC if available)
- **What could go wrong** (from risk register if available)

### 3. Read Strategy Template

Load the strategy template structure:

**Read the template** (with user override support):
- **First**, check if `.arckit/templates-custom/architecture-strategy-template.md` exists (user override)
- **If found**: Read the user's customized template
- **If not found**: Read `.arckit/templates/architecture-strategy-template.md` (default)

> **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.
> **Tip**: Users can customize templates with `/arckit.customize strategy`

### 4. Generate Architecture Strategy

Create a comprehensive Architecture Strategy document that synthesises insights from the strategic artifacts. The document should:

#### Document Control
- Generate Document ID: `ARC-[PROJECT_ID]-STRAT-v1.0` (for filename: `ARC-{PROJECT_ID}-STRAT-v1.0.md`)
- Set owner, dates, strategic horizon
- Review cycle: Quarterly (default for strategy documents)

#### Executive Summary
- **Strategic Vision**: 2-3 paragraphs articulating the transformation vision
- **Strategic Context**: Business challenge, opportunity, investment, risk appetite
- **Key Strategic Decisions**: Build vs buy, cloud strategy, vendor strategy, integration approach
- **Strategic Outcomes**: 5 measurable outcomes that will define success

#### Strategic Drivers (from stakeholders)
- Summarise top 5-7 business drivers with stakeholder ownership
- List external drivers (regulatory, market, technology, competitive)
- Include stakeholder power/interest grid

#### Guiding Principles (from principles)
- Summarise foundational, technology, and governance principles
- Show strategic implications of each principle
- Include principles compliance summary

#### Current State Assessment
- Technology landscape overview
- Capability maturity baseline (L1-L5)
- Technical debt summary
- SWOT analysis

#### Target State Vision
- Future architecture description
- Capability maturity targets
- Architecture vision diagram (Mermaid)

#### Technology Evolution Strategy (from Wardley maps)
- Strategic positioning (Genesis → Commodity)
- Build vs buy decisions table
- Technology radar summary (Adopt/Trial/Assess/Hold)

#### Strategic Themes & Investment Areas
- Define 3-5 strategic themes (e.g., Cloud Migration, Data Modernisation, Security)
- For each theme: objective, investment, initiatives, success criteria, principles alignment

#### Delivery Roadmap Summary (from roadmap)
- Strategic timeline (Mermaid Gantt)
- Phase summary table
- Key milestones

#### Investment Summary (from SOBC)
- Total investment (CAPEX/OPEX split)
- Investment by financial year
- Investment by theme
- Business case summary (NPV, IRR, payback)
- Benefits realisation timeline

#### Strategic Risks & Mitigations (from risk register)
- Top 5-7 strategic risks with mitigations
- Risk heat map (ASCII or Mermaid)
- Assumptions and constraints

#### Success Metrics & KPIs
- Strategic KPIs with baseline and targets by year
- Leading indicators (early warning)
- Lagging indicators (final proof)

#### Governance Model
- Governance structure (forums, frequency, participants)
- Decision rights
- Review cadence

#### Traceability
- List source documents with document IDs
- Traceability matrix: Driver → Goal → Outcome → Theme → Principle → KPI

#### Next Steps & Recommendations
- Immediate actions (30 days)
- Short-term actions (90 days)
- Recommended follow-on artifacts with ArcKit commands

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

### 7. Mermaid Diagram Requirements

Include at least 2 Mermaid diagrams:

1. **Architecture Vision Diagram** (graph/flowchart showing target architecture)
2. **Strategic Timeline** (Gantt chart showing phases and milestones)

**Syntax Rules**:
- ✅ Gantt: Use dateFormat YYYY-MM-DD, no `<br/>` in task names
- ✅ Flowcharts: Node labels can use `<br/>`, edge labels cannot
- ✅ Use subgraphs for architecture layers


---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Generate Document ID**:
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "STRAT" "${VERSION}")
# Example output: ARC-001-STRAT-v1.0
```

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Architecture Strategy"
- `ARC-[PROJECT_ID]-STRAT-v[VERSION]` → Use generated DOC_ID
- `[COMMAND]` → "arckit.strategy"

*User-provided fields* (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.strategy` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.strategy` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from VERSION file]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

### 8. Write the Strategy File

**IMPORTANT**: The strategy document will be a LARGE document (typically 350-500 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:
```
projects/[PROJECT_ID]/ARC-{PROJECT_ID}-STRAT-v1.0.md
```

Use the Write tool with the complete strategy content following the template structure.

### 9. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Architecture Strategy Created

**Document**: `projects/[PROJECT_ID]/ARC-{PROJECT_ID}-STRAT-v1.0.md`
**Document ID**: ARC-[PROJECT_ID]-STRAT-v1.0

### Strategy Overview
- **Strategic Horizon**: FY [START_YEAR] - FY [END_YEAR] ([N] years)
- **Total Investment**: £[AMOUNT] ([% CAPEX] / [% OPEX])
- **Expected ROI**: [%]% by FY [YEAR]
- **Risk Appetite**: [LOW / MEDIUM / HIGH]

### Key Strategic Decisions
- **Build vs Buy**: [Build / Buy / Hybrid]
- **Cloud Strategy**: [Cloud-Native / Hybrid / On-Premises]
- **Vendor Strategy**: [Single / Multi / Platform]

### Strategic Themes
1. **[Theme 1]**: £[INVESTMENT] - [Brief description]
2. **[Theme 2]**: £[INVESTMENT] - [Brief description]
3. **[Theme 3]**: £[INVESTMENT] - [Brief description]
4. **[Theme 4]**: £[INVESTMENT] - [Brief description]

### Strategic Outcomes
1. [Measurable outcome 1]
2. [Measurable outcome 2]
3. [Measurable outcome 3]
4. [Measurable outcome 4]
5. [Measurable outcome 5]

### Synthesised From
- ✅ Architecture Principles: ARC-000-PRIN-v[N].md
- ✅ Stakeholder Analysis: ARC-[PID]-STKE-v[N].md
- [✅/⚠️] Wardley Maps: [Status]
- [✅/⚠️] Architecture Roadmap: [Status]
- [✅/⚠️] Strategic Business Case: [Status]
- [✅/⚠️] Risk Register: [Status]

### Top Strategic Risks
1. **[Risk 1]**: [Mitigation summary]
2. **[Risk 2]**: [Mitigation summary]
3. **[Risk 3]**: [Mitigation summary]

### Next Steps
1. Review strategy with Strategy Board / Architecture Review Board
2. Validate investment with Finance / Spending Review
3. Confirm strategic direction with Executive Sponsor
4. Create detailed requirements: `/arckit.requirements`
5. Expand roadmap: `/arckit.roadmap`
6. Begin detailed design: `/arckit.diagram`

### Traceability
- Aligns to [N] architecture principles
- Addresses [N] stakeholder drivers
- Delivers [N] strategic outcomes
- Mitigates [N] strategic risks

**File location**: `projects/[PROJECT_ID]/ARC-{PROJECT_ID}-STRAT-v1.0.md`
```

## Important Notes

1. **Synthesis, Not Generation**: This command synthesises existing artifacts into a coherent narrative. It should NOT generate new information but rather consolidate and present existing strategic decisions.

2. **Use Write Tool**: The strategy document is typically 350-500 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Mandatory Prerequisites**: Unlike other commands, this command has TWO mandatory prerequisites (principles AND stakeholders). Strategy cannot be created without understanding both the decision framework and the stakeholder drivers.

4. **Executive Audience**: The strategy document is intended for executive stakeholders (CTO, CIO, Strategy Board). Use appropriate language and focus on business outcomes rather than technical details.

5. **Traceability is Critical**: Every element of the strategy should trace back to source documents. This ensures the strategy is grounded in agreed artifacts, not assumptions.

6. **Gap Identification**: If recommended documents are missing, include a "Gaps" section noting what additional artifacts would strengthen the strategy (e.g., "A Wardley Map would improve build vs buy decisions").

7. **Principles Compliance**: Show how each strategic theme aligns to specific principles. This demonstrates that strategy is principles-driven.

8. **Integration with Other Commands**:
   - Strategy feeds into: `/arckit.requirements` (detailed requirements), `/arckit.roadmap` (expanded timeline), `/arckit.plan` (project delivery)
   - Strategy is informed by: `/arckit.principles`, `/arckit.stakeholders`, `/arckit.wardley`, `/arckit.sobc`, `/arckit.risk`

9. **Version Management**: If a strategy already exists (ARC-*-STRAT-v*.md), create a new version (v2.0) rather than overwriting. Strategies should be versioned to track evolution.

10. **Financial Years**: For UK Government, use "FY 2024/25" notation (April-March). For US/other contexts, use appropriate fiscal year notation.
