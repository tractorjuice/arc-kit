---
description: 'Generate a capability maturity model with assessment criteria and level definitions'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

You are helping an enterprise architect create a **Capability Maturity Model** document. This document defines capability dimensions relevant to the project domain, maturity levels with measurable evidence criteria, self-assessment questionnaires, and transition criteria for progressing between levels.

## User Input

```text
${input:topic:Enter project name or topic}
```

## Prerequisites: Read Artifacts

> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.

**RECOMMENDED** (read if available, note if missing):

- **PRIN** (Architecture Principles, in 000-global) — Extract: Guiding principles to align maturity dimensions with, decision framework, technology standards, governance principles
  - If missing: Note that principles are unavailable; maturity dimensions will lack explicit principles alignment

**OPTIONAL** (read if available, skip silently if missing):

- **STRAT** (Architecture Strategy) — Extract: Strategic themes, capability targets, current state assessment, target state vision
- **REQ** (Requirements Specification) — Extract: Non-functional requirements that imply capability maturity targets (e.g., performance, security, data quality)
- **STKE** (Stakeholder Analysis) — Extract: Stakeholder expectations for capability maturity, governance bodies responsible for assessment
- **RISK** (Risk Register) — Extract: Risks that indicate capability gaps or maturity deficiencies
- **DATA** (Data Model) — Extract: Data governance maturity indicators, data quality dimensions, metadata management maturity

### Prerequisites 1b: Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract existing maturity assessments, capability frameworks, benchmark data
- Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise maturity frameworks, capability baselines, industry benchmarks
- If no external maturity docs found but they would improve the output, ask: "Do you have any existing maturity assessments, capability frameworks, or industry benchmarks? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."

## Instructions

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Read Maturity Model Template

Load the maturity model template structure:

**Read the template** (with user override support):

- **First**, check if `.arckit/templates/maturity-model-template.md` exists in the project root
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `.arckit/templates/maturity-model-template.md` (default)

> **Tip**: Users can customize templates with `/arckit:customize maturity-model`

### 3. Analyze Project Context and Determine Capability Dimensions

Analyze all available project artifacts, the user's input, and the project domain to determine 4-6 relevant capability dimensions. The dimensions must be tailored to the project domain — do NOT use a generic one-size-fits-all set.

Examples of domain-specific dimensions:

- **Data management project**: Data Quality, Data Governance, Metadata Management, Data Integration, Data Security, Master Data Management
- **Cloud migration project**: Cloud Architecture, DevOps/CI-CD, Security & Compliance, Cost Optimisation, Operational Resilience, Platform Engineering
- **Digital service project**: User Experience, Service Design, Agile Delivery, Technology Operations, Security, Data Analytics
- **Enterprise architecture project**: Architecture Governance, Standards Adoption, Technology Lifecycle, Integration Maturity, Innovation, Portfolio Management

For each dimension, define:

- **Name** — Clear, descriptive dimension name
- **Scope** — What the dimension covers and does not cover
- **Why it matters** — Business justification for measuring this dimension
- **Alignment** — Which architecture principles, strategic themes, or requirements it supports

### 4. Define 5 Maturity Levels Per Dimension

For each capability dimension, define 5 maturity levels following the standard maturity progression:

| Level | Name | General Characteristics |
|-------|------|------------------------|
| 1 | Initial | Ad-hoc, reactive, undocumented, person-dependent |
| 2 | Repeatable | Basic processes documented, some consistency, reactive improvement |
| 3 | Defined | Standardised processes, proactive management, measured outcomes |
| 4 | Managed | Quantitatively managed, data-driven decisions, continuous improvement |
| 5 | Optimised | Continuous innovation, industry-leading, automated optimisation |

For each level within each dimension, provide:

- **Characteristics** — 3-5 specific, observable characteristics (not vague aspirations)
- **Evidence criteria** — Concrete, measurable evidence that demonstrates this level (e.g., "Documented data quality rules exist for > 80% of critical data elements")
- **Examples** — 1-2 real-world examples of what this level looks like in practice

### 5. Create Transition Criteria Between Levels

For each dimension, define what must be demonstrated to progress from one level to the next:

- **L1 to L2**: What minimum processes, documentation, or governance must be established
- **L2 to L3**: What standardisation, measurement, or tooling must be in place
- **L3 to L4**: What quantitative management, automation, or data-driven practices must exist
- **L4 to L5**: What innovation, optimisation, or industry leadership must be demonstrated

Each transition criterion must be:

- **Specific** — Not "improve processes" but "implement automated quality gates in CI/CD pipeline"
- **Measurable** — Include a threshold or evidence requirement
- **Achievable** — Realistic within a 6-12 month improvement cycle

### 6. Design Self-Assessment Questionnaire

Create a self-assessment questionnaire with 3-5 questions per dimension. Each question must include calibrated answers showing what Level 1, Level 3, and Level 5 responses look like.

Format for each question:

- **Question**: Clear, specific question about current practices
- **Level 1 response**: What someone at L1 would answer (e.g., "We have no documented process for...")
- **Level 3 response**: What someone at L3 would answer (e.g., "We have a standardised process that is...")
- **Level 5 response**: What someone at L5 would answer (e.g., "We have automated, continuously optimised...")
- **Scoring guidance**: How to score intermediate levels (L2 between L1 and L3, L4 between L3 and L5)

### 7. Map Principles to Dimensions

Create a traceability matrix showing which architecture principles align to which capability dimensions:

- For each dimension, list the principles that support or drive it
- For each principle, show which dimensions it influences
- Highlight any dimensions that lack principle coverage (potential governance gap)
- Highlight any principles that lack dimension coverage (potential measurement gap)

If no principles document exists, note this as a gap and recommend running `/arckit:principles` first for full alignment.

### 8. Auto-Populate Document Control

Generate Document ID: `ARC-{PROJECT_ID}-MMOD-v1.0` (for filename: `ARC-{PROJECT_ID}-MMOD-v1.0.md`)

- Set Document Type: "Maturity Model"
- Set owner, dates
- Review cycle: Quarterly (default for maturity model documents)

### 9. Quality Check

Before writing the file, read `.arckit/references/quality-checklist.md` and verify all **Common Checks** pass. Fix any failures before proceeding.

### 10. Write the Maturity Model File

**IMPORTANT**: The maturity model document will be a LARGE document (typically 300-500 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{project-dir}/ARC-{PROJECT_ID}-MMOD-v1.0.md
```

Use the Write tool with the complete maturity model content following the template structure.

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Capability Maturity Model Created

**Document**: `projects/{project-dir}/ARC-{PROJECT_ID}-MMOD-v1.0.md`
**Document ID**: ARC-{PROJECT_ID}-MMOD-v1.0

### Maturity Model Overview
- **Capability Dimensions**: [N] dimensions defined
- **Maturity Levels**: 5 levels per dimension (L1 Initial through L5 Optimised)
- **Assessment Questions**: [N] questions per dimension ([TOTAL] total)
- **Principles Mapped**: [N] principles aligned to dimensions

### Dimensions Defined
1. **[Dimension 1]**: [Brief scope description]
2. **[Dimension 2]**: [Brief scope description]
3. **[Dimension 3]**: [Brief scope description]
4. **[Dimension 4]**: [Brief scope description]
5. **[Dimension 5]**: [Brief scope description] (if applicable)
6. **[Dimension 6]**: [Brief scope description] (if applicable)

### Source Artifacts
- [List each artifact scanned with Document ID]

### Coverage Gaps
- [Note any missing artifacts that would improve dimension definition]
- [Note any dimensions lacking principle alignment]

### Next Steps
1. Conduct baseline assessment using self-assessment questionnaire
2. Set target maturity levels per dimension with stakeholders
3. Create phased roadmap for maturity progression: `/arckit:roadmap`
4. Incorporate maturity targets into architecture strategy: `/arckit:strategy`

**File location**: `projects/{project-dir}/ARC-{PROJECT_ID}-MMOD-v1.0.md`
```

---

**CRITICAL - Auto-Populate Document Information Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-MMOD-v{VERSION}` (e.g., `ARC-001-MMOD-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` -> Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` -> "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` -> Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` -> "Maturity Model"
- `ARC-[PROJECT_ID]-MMOD-v[VERSION]` -> Construct using format above
- `[COMMAND]` -> "arckit.maturity-model"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` -> Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` -> Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` -> Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date -> Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` -> [PENDING]
- `[APPROVER_NAME]` -> [PENDING]
- `[DISTRIBUTION_LIST]` -> Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:maturity-model` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:maturity-model` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

---

## Output Instructions

**CRITICAL - Token Efficiency**:

- Write the full maturity model to file using the Write tool
- DO NOT output the full document content in the response
- Show ONLY the summary section (Step 11) to the user
- The maturity model contains detailed level definitions and questionnaires — outputting it in chat wastes tokens

## Important Notes

1. **Domain-Agnostic Design**: The maturity model dimensions must be tailored to the specific project domain. Do NOT use a generic CMMI-style framework — derive dimensions from the actual project context, requirements, and strategic goals.

2. **Measurable Evidence Criteria**: Every maturity level must include concrete, measurable evidence criteria. Avoid vague statements like "mature processes exist" — instead specify what artifacts, metrics, or practices must be observable (e.g., "Automated data quality checks run on > 90% of ingestion pipelines with results published to a dashboard").

3. **Principles Alignment is Critical**: Each capability dimension should trace back to one or more architecture principles. This ensures the maturity model measures what the organisation has agreed matters. If principles are unavailable, recommend creating them first.

4. **Use Write Tool**: The maturity model document is typically 300-500 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

5. **Version Management**: If a maturity model already exists (ARC-*-MMOD-v*.md), create a new version (v2.0) rather than overwriting. Maturity models should be versioned to track assessment evolution over time.

6. **Self-Assessment Calibration**: The questionnaire answers for L1, L3, and L5 must be clearly differentiated so that assessors can reliably score themselves. Avoid ambiguous or overlapping descriptions between levels.

7. **Integration with Other Commands**:
   - Maturity model is informed by: `/arckit:principles`, `/arckit:strategy`, `/arckit:requirements`, `/arckit:stakeholders`, `/arckit:risk`, `/arckit:data-model`
   - Maturity model feeds into: `/arckit:roadmap` (phased maturity progression), `/arckit:strategy` (capability targets), `/arckit:risk` (capability gap risks)

8. **Transition Realism**: Transition criteria between levels should be achievable within a 6-12 month improvement cycle. Do not set criteria that would take years to achieve in a single level jump.

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-roadmap` -- Create phased roadmap based on maturity progression
- `/arckit-strategy` -- Incorporate maturity targets into architecture strategy
