---
description: Establish Architecture Board charter, compliance scorecard, and governance process
argument-hint: "<project ID, e.g. '001', 'architecture board charter'>"
effort: high
handoffs:
  - command: architecture-change
    description: Create architecture change requests
---

You are helping an enterprise architect establish an **Architecture Board Charter** for TOGAF ADM Phase G (Implementation Governance). This document defines the Board's mandate, membership, decision framework, compliance scorecard, and exception processes.

## User Input

```text
$ARGUMENTS
```

## Instructions

> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

### 1. Identify or Create Project

Identify the target project from the hook context. If the user specifies a project that doesn't exist yet, create a new project:

1. Use Glob to list `projects/*/` directories and find the highest `NNN-*` number (or start at `001` if none exist)
2. Calculate the next number (zero-padded to 3 digits, e.g., `002`)
3. Slugify the project name (lowercase, replace non-alphanumeric with hyphens, trim)
4. Use the Write tool to create `projects/{NNN}-{slug}/README.md` with the project name, ID, and date — the Write tool will create all parent directories automatically
5. Also create `projects/{NNN}-{slug}/external/README.md` with a note to place external reference documents here
6. Set `PROJECT_ID` = the 3-digit number, `PROJECT_PATH` = the new directory path

### 2. Prerequisites: Read Architecture Artifacts

**MANDATORY** (warn if missing):

- **PRIN** (Architecture Principles, in `000-global`) — Extract: All principles, governance standards, decision rights, compliance requirements
  - If missing: STOP and ask user to run `/arckit:principles` first. The Architecture Board cannot operate without defined principles.

**RECOMMENDED** (read if available, note if missing):

- **ADMP** (ADM Cycle Plan) — Extract: ADM phase scope, governance model, stakeholder engagement plan, phase sequencing
  - If missing: note in assumptions that ADM governance alignment could not be validated
- **PRIN** (Architecture Principles) — Extract: Domain-specific principles, compliance gates, exception criteria
  - If missing: note in assumptions that domain-level principle alignment could not be validated
- **BPCM** (Business Capability Map) — Extract: Capability maturity, ownership, governance needs
  - If missing: note in assumptions that capability governance could not be assessed
- **HLD** (High-Level Design) — Extract: Architecture decisions requiring governance review
  - If missing: note in assumptions that design governance could not be assessed

### 3. Read Architecture Board Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/architecture-board-template.md` exists in the project root
- **If found**: Read the user's customised template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/architecture-board-template.md` (default)

> **Tip**: Users can customise templates with `/arckit:customize architecture-board`

### 4. Read external documents and policies

- Read any **external documents** listed in the project context (`external/` files) — extract governance frameworks, board charters, compliance frameworks
- Read any **enterprise standards** in `projects/000-global/external/` — extract architecture governance policies, board operating procedures, compliance standards
- If no governance documents found but they would improve the output, ask: "Do you have any existing governance policies, board charters, or compliance frameworks? I can read PDFs and images directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
- **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[BD-C1]`) next to findings informed by source documents.

### 5. Generate Architecture Board Charter

Create a comprehensive Architecture Board Charter following the template structure.

#### Document Control

- Generate Document ID: `ARC-{P}-BORD-v1.0` (for filename: `ARC-{P}-BORD-v1.0.md`)
- Set owner, dates, status, classification
- Review cycle: Quarterly review of charter, monthly Board meetings

#### 1. Board Charter

Generate the charter sections:

- **1.1 Purpose**: Write a purpose statement grounded in TOGAF Phase G governance — why the Board exists, what decisions it makes, and how it protects architecture integrity
- **1.2 Scope**: Define in-scope and out-of-scope areas — which projects, domains, and decisions fall under Board authority
- **1.3 Authority**: Complete the authority table with:
  - **Advisory**: Non-binding decisions (recommendations, guidance)
  - **Mandatory**: Binding decisions (principle enforcement, security sign-off)
  - **Exception**: Formal deviation process (waivers, compensating controls)

#### 2. Membership

- **2.1 Board Members**: Populate membership table with at least 3 roles. Recommended minimum:
  - Chair (Voting) — Board leadership
  - CISO (Voting) — Security governance
  - Chief Architect (Voting) — Architecture oversight
  - Add other members based on project context (CTO, Compliance Officer, Programme Sponsor)
- **2.2 Quorum**: Define minimum attendance for valid decisions

#### 3. Decision Framework

- **3.1 Voting Model**: Complete voting model table:
  - Consensus for standard decisions
  - Majority vote for time-sensitive decisions
  - Chair decision for deadlock resolution
- **3.2 Escalation Path**: Include Mermaid flowchart showing escalation from Board → Programme Board → Steering Committee → Executive Board
- **3.3 Decision Recording**: Define how decisions are captured and maintained

#### 4. Compliance Scorecard

Build a compliance scorecard with at least 3 domains. Recommended domains:

| Domain | Standard/Framework | Description |
|--------|-------------------|-------------|
| Security | NCSC CAF | Security maturity assessment |
| Data Architecture | DCAM | Data management compliance |
| Application Portfolio | TOGAF Standards | Application rationalisation progress |
| Technology Standards | TCoP / Internal | Technology compliance |
| Governance | COBIT 2019 | Governance maturity |
| Business Alignment | BSM | Business strategy alignment |

For each domain:

- **Current state**: Maturity level (1–5)
- **Target state**: Desired maturity level (1–5)
- **Gap**: Qualitative description of the gap
- **Priority**: High / Medium / Low based on business impact

#### 5. Exception Process

Define the formal exception process:

- **5.1 Process Steps**: Complete the 5-step process (Submit → Assess → Review → Decide → Appeal) with owners and timelines
- **5.2 Exception Criteria**: Define what constitutes a valid exception request
- **5.3 Exception Register Template**: Provide a template table for tracking exceptions

#### 6. Review Cadence

Define the meeting schedule:

- **Architecture Board**: Monthly — full Board members
- **Programme Board**: Monthly — sponsors and programme managers
- **Steering Committee**: Quarterly — executive oversight
- **Executive Board**: Semi-annually — strategic review

#### 7. Decision Register

Provide a template for ongoing decision recording with columns: Date, Decision ID, Topic, Decision, Rationale, Owner, Status

#### 8. Traceability

Cross-reference to related documents:

- Architecture Principles (`ARC-000-PRIN-v[N].md`) — board enforces principles
- ADM Plan (`ARC-{P}-ADMP-v[N].md`) — board governs Phase G
- Gap Analysis (`ARC-{P}-GAPA-v[N].md`) — board prioritises gap closure
- Architecture Change Requests (`ARC-{P}-ACHG-v[N].md`) — board approves changes

### 6. UK Government Specifics

If the user indicates this is a UK Government project, include:

- **TCoP (Technology Code of Practice)**: Reference all 13 points for compliance assessment
- **NCSC CAF**: Security maturity progression framework
- **GDS Service Standard**: Service assessment and assurance
- **DCAM**: Data Capability Maturity model
- **MoRIS**: Governance of projects and programmes
- **Security Clearance levels**: BPSS/SC/DV requirements for board membership

### 7. MOD Specifics

If this is a Ministry of Defence project, include:

- **JSP 440**: Defence project management governance alignment
- **IAMM**: Information Assurance Maturity Model
- **Security clearances**: BPSS/SC/DV requirements for board members
- **JSP 936**: AI assurance governance for AI-related architecture decisions

### 8. Quality Gate

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **BORD** per-type checks pass. Fix any failures before proceeding.

**BORD-specific quality requirements**:

| # | Check | Requirement |
|---|-------|-------------|
| 1 | Charter present | Sections 1.1 (Purpose), 1.2 (Scope), 1.3 (Authority) must all be populated |
| 2 | Membership ≥ 3 roles | Board membership table must list at least 3 roles |
| 3 | Decision framework | Voting model table and escalation Mermaid diagram must be present |
| 4 | Scorecard ≥ 3 domains | Compliance scorecard must cover at least 3 architecture domains |
| 5 | Exception process defined | All 5 process steps must be present with owners and timelines |
| 6 | Review cadence defined | At least 2 forums with frequency and agenda items |
| 7 | Decision register template | Template with all required columns present |
| 8 | Traceability | Links to at least PRIN and ADMP source documents |

### 9. CRITICAL — Auto-Populate Document Control Fields

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-BORD-v{VERSION}` (e.g., `ARC-001-BORD-v1.0`)

**Populate Required Fields**:

*Auto-populated fields*:

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → "1.0" (or increment if previous version exists)
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "Architecture Board Charter"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to `${user_config.default_classification}`; if unavailable, use "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

*Calculated fields*:

- `[YYYY-MM-DD]` for Review Date → Current date + 90 days (quarterly review)

*Pending fields* (leave as `[PENDING]` until manually updated):

- `[REVIEWER_NAME]` → `[PENDING]`
- `[APPROVER_NAME]` → `[PENDING]`

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:architecture-board` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:architecture-board` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### 10. Write the Architecture Board Charter File

**IMPORTANT**: The Architecture Board Charter document will be a substantial document (typically 200-350 lines). You MUST use the Write tool to create the file, NOT output the full content in chat.

Create the file at:

```text
projects/{P}/ARC-{P}-BORD-v1.0.md
```

Use the Write tool with the complete content following the template structure.

### 11. Show Summary to User

After writing the file, show a concise summary (NOT the full document):

```markdown
## Architecture Board Charter Created

**Document**: `projects/{P}/ARC-{P}-BORD-v1.0.md`
**Document ID**: ARC-{P}-BORD-v1.0

### Board Charter Summary
- **Purpose**: [Brief purpose statement]
- **Scope**: [Key in-scope areas]
- **Authority levels**: Advisory / Mandatory / Exception

### Board Membership
| Role | Vote Type |
|------|-----------|
| [Role 1] | Voting |
| [Role 2] | Voting |
| [Role 3] | Observer |

### Decision Framework
| Model | Quorum |
|-------|--------|
| Consensus | [X%] |
| Majority Vote | 50% + 1 |
| Chair Decision | Deadlock resolution |

### Compliance Scorecard
| Domain | Current | Target | Gap | Priority |
|--------|---------|--------|-----|----------|
| [Domain 1] | [L3] | [L4] | [Gap] | [High] |
| [Domain 2] | [L2] | [L3] | [Gap] | [Medium] |

### Exception Process
- **5-step process**: Submit → Assess → Review → Decide → Appeal
- **Total timeline**: T+0 to T+21 days

### Review Cadence
| Forum | Frequency |
|-------|-----------|
| Architecture Board | Monthly |
| Programme Board | Monthly |
| Steering Committee | Quarterly |

### Synthesised From
- ✅ Architecture Principles: ARC-000-PRIN-v[N].md
- [✅/⚠️] ADM Plan: ARC-{P}-ADMP-v[N].md
- [✅/⚠️] Architecture Principles (domain): ARC-{P}-APP-v[N].md
- [✅/⚠️] Business Capability Map: ARC-{P}-BPCM-v[N].md

### Next Steps
1. Present charter to governance body for ratification
2. Populate actual board member names and organisations
3. Create architecture change requests: `/arckit:architecture-change`
4. Schedule first Architecture Board meeting

### Traceability
- Board charter linked to [N] source documents
- [N] compliance domains assessed
- [N] board members defined
- Decision framework covers [N] decision types

**File location**: `projects/{P}/ARC-{P}-BORD-v1.0.md`
```

## Important Notes

1. **Governance Foundation**: The Architecture Board Charter is a GOVERNANCE FOUNDATION document — it establishes who decides what, how they decide, and how compliance is measured. It should be written before detailed design work begins.

2. **Use Write Tool**: The Architecture Board Charter is typically 200-350 lines. ALWAYS use the Write tool to create it. Never output the full content in chat.

3. **Mandatory Prerequisites**: PRIN (Architecture Principles) is mandatory — a Board without principles has nothing to govern. ADMP and HLD/REQ are recommended for context but the charter can be created without them.

4. **Membership is flexible**: The minimum is 3 roles, but the actual membership should reflect the organisation's governance structure. Add roles based on the project's compliance needs (e.g., DPO for GDPR, Security for NCSC CAF).

5. **Compliance scorecard is living**: The scorecard should be updated quarterly at minimum. It tracks progress against architecture principles and standards over time.

6. **Exception process is critical**: A governance process without an exception mechanism creates bureaucracy without pragmatism. The 5-step process (submit → assess → review → decide → appeal) ensures structured deviation handling.

7. **Integration with other commands**:
   - Architecture Board Charter enables: `/arckit:architecture-change` (governed change requests), `/arckit:gap-analysis` (board prioritises gaps)
   - Architecture Board Charter is informed by: `/arckit:principles` (PRIN), `/arckit:adm-preliminary` (ADMP)

8. **Version Management**: If a board charter already exists (`ARC-*-BORD-v*.md`), create a new version (v2.0) rather than overwriting. Charters should be versioned to track governance evolution.

9. **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji.
