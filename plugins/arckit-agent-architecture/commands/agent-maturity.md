---
description: Assess AI agent program maturity across design, governance, security, integration, and operations
argument-hint: "<project ID or agent program, e.g. '001', 'enterprise agent program'>"
effort: high
handoffs:
  - command: agent-design
    description: Design improvements based on maturity gaps
  - command: agent-governance
    description: Strengthen governance based on maturity assessment
---

You are helping an enterprise architect create an **AI Agent Program Maturity Model** assessment. This document evaluates the current maturity of the agent program across five key dimensions — Design, Governance, Security, Integration, and Operations — using a 5×5 maturity framework, and produces a prioritised improvement roadmap with benchmarks.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### 1. Read existing artifacts from the project context

**RECOMMENDED** (read if available, note if missing):

- **AAGI** (Agent Inventory, recommended) — Extract: agent inventory, capability baseline, ownership, lifecycle state, current architecture state
  - If missing: Note that the guide is unavailable; maturity assessment will rely on available evidence
- **AAGR** (Agent Architecture Specification, recommended) — Extract: architecture decisions, tool contracts, guardrails, orchestration design, current implementation state
  - If missing: Note that design specifications are unavailable
- **maturity-model output from core** (recommended) — Extract: existing enterprise maturity assessments, capability baselines, benchmark data
  - If missing: Note that enterprise maturity context is limited

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: AI/agent principles, governance principles, technology standards
- **AAOV** (Agent Governance Framework) — Extract: oversight tiers, compliance status, audit program, governance maturity
- **AASC** (Agent Security Architecture) — Extract: security controls, threat model, security maturity
- **AAIT** (Agent Integration Design) — Extract: integration patterns, API maturity, interoperability
- **RISK** (Risk Register) — Extract: AI-specific risks, governance gaps, operational risks

**OPTIONAL** (read if available, skip silently if missing):

- **BORD** (Board Review) — Extract: board-approved AI strategy, risk appetite, investment commitments
- **AIPB** (AI Playbook) — Extract: AI ethics principles, model governance standards
- **HLDR** (High-Level Design Review) — Extract: existing system architecture context
- **SECD** (Secure by Design) — Extract: security control maturity

### 2. Identify the target project

- Use the **ArcKit Project Context** (above) to find the project matching the user's input (by name or number)
- If no match, create a new project:
  1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
  2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
  3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
  4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
  5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
  6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 3. Read the template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/agent-maturity-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/agent-maturity-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize agent-maturity`

### 4. Assess Current State — 5×5 Maturity Framework

Evaluate the agent program across **five dimensions** at **five maturity levels**:

| Level | Name | Description |
|-------|------|-------------|
| L1 | Ad-hoc | No formal processes, reactive, undocumented |
| L2 | Reactive | Processes defined post-incident, some documentation |
| L3 | Defined | Standard processes documented, proactive management |
| L4 | Managed | Metrics-driven, data-led decisions, continuous improvement |
| L5 | Optimized | Continuous improvement, predictive, industry-leading |

#### Dimension assessments

For each dimension, determine the current maturity level based on available evidence:

**A. Design Maturity**

- Evidence sources: AAGR, design documentation, architecture decision records
- Indicators: Reusable patterns, design standards, tool contract completeness
- Key questions: Are designs documented and reviewed? Are patterns reusable?

**B. Governance Maturity**

- Evidence sources: AAOV, governance policies, compliance evidence
- Indicators: Oversight model completeness, audit coverage, compliance status
- Key questions: Is there an oversight model? Are decisions auditable?

**C. Security Maturity**

- Evidence sources: AASC, risk register, security controls, guardrail configurations
- Indicators: Threat model coverage, guardrail comprehensiveness, security testing
- Key questions: Are security controls proactive? Is there automated security testing?

**D. Integration Maturity**

- Evidence sources: AAIT, API documentation, integration test results
- Indicators: Standardised APIs, interoperability, integration automation
- Key questions: Are integrations standardised? Is there end-to-end testing?

**E. Operations Maturity**

- Evidence sources: monitoring KPIs, incident response plans, SLA data
- Indicators: Monitoring coverage, incident response readiness, operational metrics
- Key questions: Are operations measured? Is there predictive monitoring?

For each dimension, record:

- **Current level**: L1 through L5
- **Evidence**: Concrete examples or artefacts supporting the rating
- **Gaps**: What is missing to reach the next level

### 5. Read External Documents and Policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing maturity assessments, capability frameworks, benchmark data
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise maturity frameworks, capability baselines, industry benchmarks
- If no external maturity docs found but they would improve the output, ask: "Do you have any existing maturity assessments, capability frameworks, or industry benchmarks? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

### 6. Define Target State

For each dimension, determine a realistic target maturity level:

- **Target level**: 1–2 levels above current (achievable within 6–12 months)
- **Rationale**: Business justification for the target
- **Gap**: Number of levels to progress

Target levels should be ambitious but achievable. Consider:

- Regulatory requirements (may mandate minimum levels)
- Investment commitments and resource availability
- Risk appetite (higher risk = more maturity needed)

### 7. Create Improvement Roadmap

For each gap identified (current → target), define improvement initiatives:

| Initiative | Dimension | From | To | Timeline | Investment |
|------------|-----------|------|----|----------|------------|
| [Name] | [Dimension] | [Current L] | [Target L] | [Q1/Q2/etc] | [£X / FTE] |

**Minimum 3 initiatives** must be defined. Each initiative should include:

- **Name**: Clear, actionable initiative name
- **Dimension**: Which maturity dimension it addresses
- **Scope**: What activities are involved
- **Success criteria**: How progress will be measured
- **Dependencies**: Other initiatives or artefacts it depends on
- **Owner**: Responsible team or role

### 8. Establish Benchmarks

Compare the agent program against industry benchmarks:

- **Industry standards**: CMMI, NIST AI RMF maturity, UK AI Centre maturity model
- **Peer organisations**: Similar programmes in the sector
- **Regulatory expectations**: Minimum maturity required for compliance

For each benchmark:

- **Metric**: What is being measured
- **Industry average**: Typical maturity level in the sector
- **Our position**: Current maturity level
- **Gap**: Difference from industry average

### 9. Detect Version

Before generating the document ID, check if a previous version exists:

1. Look for existing `ARC-{PROJECT_ID}-AAMT-v*.md` files in the project directory
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its scope
   - Compare against current assessment
   - **Minor increment** (e.g., 1.0 → 1.1): Same scope — updated assessments, refined targets
   - **Major increment** (e.g., 1.0 → 2.0): New dimensions added, fundamentally different framework
4. Use the determined version for document ID, filename, Document Control, and Revision History

### 10. Construct Document Control Metadata

- **Document ID**: `ARC-{PROJECT_ID}-AAMT-v{VERSION}` (e.g., `ARC-001-AAMT-v1.0`)

**Populate document control fields**:

- `document_id`: Constructed from format above
- `project_id`: From Step 2
- `project_name`: From Step 2
- `version`: Determined version from Step 9
- `author`: "ArcKit AI"
- `date_created`: Current date (YYYY-MM-DD)
- `date_updated`: Current date (YYYY-MM-DD)
- `generation_date`: Current date and time
- `ai_model`: Your model name

### 11. Generate Agent Program Maturity Model

**CRITICAL INSTRUCTIONS FOR QUALITY**:

1. **This is a LARGE document** (maturity assessment + roadmap + benchmarks, 400-800+ lines). You MUST use the **Write tool** to create the file. DO NOT output the full document to the user (you will exceed token limits).

2. **Follow the template structure** with all 6 sections:

   **Section 1: Maturity Model Framework**
   - 5×5 maturity model table (5 dimensions × 5 levels)
   - Level definitions with observable characteristics
   - Evidence criteria for each level per dimension

   **Section 2: Current State Assessment**
   - Assessment matrix: Dimension × Level × Evidence × Gaps
   - Maturity heatmap (Mermaid quadrant chart)
   - Detailed per-dimension analysis

   **Section 3: Target State**
   - Target level per dimension with rationale
   - Gap analysis (current vs target)
   - Priority ranking of improvements

   **Section 4: Improvement Roadmap**
   - Initiative table with ≥3 initiatives
   - Timeline and sequencing
   - Resource allocation and dependencies
   - Success metrics per initiative

   **Section 5: Benchmarks**
   - Comparison against industry standards
   - Gap analysis vs peers
   - Regulatory alignment assessment

   **Section 6: Traceability**
   - AAGI → AAGR → AAMT links
   - Cross-references to related artefacts
   - Source document citations

3. **Mermaid diagram requirements**:
   - Quadrant chart for maturity heatmap
   - Use valid Mermaid syntax
   - Position dimensions correctly based on assessed maturity

### 12. Quality Checks

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AAMT** per-type checks pass. Fix any failures before proceeding.

**AAMT-specific quality checks**:

- **Maturity framework**: 5 levels defined (L1 Ad-hoc through L5 Optimized)
- **Dimensions assessed**: All 5 dimensions assessed (Design, Governance, Security, Integration, Operations)
- **Evidence provided**: Each dimension has concrete evidence supporting its rating
- **Gaps identified**: Each dimension has at least 1 gap documented
- **Heatmap present**: Valid Mermaid quadrant chart visualising maturity
- **Target state defined**: Target level set for each dimension with rationale
- **Improvement initiatives**: At least 3 initiatives defined in the roadmap
- **Benchmarks included**: Industry benchmarks with gap analysis
- **Traceability links**: AAGI and AAGR references present
- **No placeholder text**: No remaining `[Dimension]`, `[Level]`, `[Evidence]`, or `[Gaps]` tokens

### 13. Use Write tool to create the maturity model file

- **CRITICAL**: Because maturity models are large documents (400-800+ lines), you MUST use the Write tool to create the file
- Do NOT output the full content in your response (this will exceed token limits)
- Use Write tool with the full maturity model content
- Path: `projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAMT-v{VERSION}.md`

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header following the same pattern as other ArcKit commands.

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined from Step 9
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Agent Program Maturity Model"
- `ARC-[PROJECT_ID]-AAMT-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.agent-maturity"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Next Review → Current date + 90 days (quarterly review cycle)

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "AI Governance Board, Architecture Team, Compliance Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:agent-maturity` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

```markdown
**Generated by**: ArcKit `/arckit:agent-maturity` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### 14. Show summary to user (NOT full document)

```markdown
## Agent Program Maturity Model Created

**Document**: projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAMT-v1.0.md
**Document ID**: ARC-{PROJECT_ID}-AAMT-v1.0

### Maturity Summary

| Dimension | Current | Target | Gap |
|-----------|---------|--------|-----|
| Design | [Level] | [Level] | [Levels] |
| Governance | [Level] | [Level] | [Levels] |
| Security | [Level] | [Level] | [Levels] |
| Integration | [Level] | [Level] | [Levels] |
| Operations | [Level] | [Level] | [Levels] |

### Key Findings

- **Highest priority**: [Dimension with largest gap]
- **Strongest area**: [Dimension with highest maturity]
- **Improvement initiatives**: [N] initiatives defined
- **Benchmarks**: [N] benchmarks assessed

### Next Steps

1. Review assessment with stakeholders
2. Prioritise improvement initiatives
3. Create detailed plans for top priorities: `/arckit:agent-design`
4. Strengthen governance for low-maturity dimensions: `/arckit:agent-governance`

### Files Created

📄 `projects/{PROJECT_ID}-{project-name}/ARC-{PROJECT_ID}-AAMT-v1.0.md` ({line_count} lines)
```

## Important Notes

- **Maturity models are living documents** — review and update quarterly or after significant program changes
- **Be evidence-based** — every rating must reference concrete evidence, not impressions
- **Target levels must be achievable** — maximum 2 levels per improvement cycle (6-12 months)
- **Benchmarks provide context** — use industry standards and peer comparisons to set realistic targets
- **Improvement initiatives drive action** — each initiative must be scoped, resourced, and measurable
- **Traceability is critical** — link back to AAGI, AAGR, and governance artefacts
- **The heatmap visualises priorities** — use quadrant positioning to show where to focus investment
- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 5% gap`, `> 95% coverage`) to prevent markdown renderers from interpreting them as HTML tags or emoji
- **Template customization**: Users can override the template by placing their own `agent-maturity-template.md` in `.arckit/templates-custom/`
- **Versioning**: Always check for existing versions before creating a new file — increment appropriately
