---
description: Document architectural decisions with options analysis and traceability
---

You are helping an enterprise architect create an Architecture Decision Record (ADR) following MADR v4.0 format enhanced with UK Government requirements.

## User Input

```text
$ARGUMENTS
```

## Instructions

### 1. **Check for prerequisites**:
   - First, check if any `ARC-000-PRIN-*.md` file exists in `projects/000-global/`
     - If it doesn't exist, suggest running `/arckit.principles` first
     - Architecture principles should inform decision drivers
   - Optionally check for related artifacts that may inform the decision:
     - `projects/*/ARC-*-STKE-v*.md` - understand stakeholder goals
     - `projects/*/ARC-*-REQ-v*.md` - decisions address requirements
     - `projects/*/ARC-*-RSCH-v*.md` - research may have analyzed options
     - `projects/*/wardley-maps/ARC-*-WARD-*.md` - evolution stage influences choices

### 2. **Create or find the project**:
   - Run `.arckit/scripts/bash/create-project.sh --name "$PROJECT_NAME" --json` to create project structure
   - Parse the JSON output to get the project directory path and project ID
   - Or if the user specifies an existing project number (e.g., "001"), use that

### 3. **Create decisions directory and determine ADR number**:
```bash
PROJECT_SLUG=$(basename "$project_path")            # e.g., 001-payment-modernization
PROJECT_DIR="projects/${PROJECT_SLUG}"

# Ensure decisions directory exists
mkdir -p "${PROJECT_DIR}/decisions"
cd "${PROJECT_DIR}/decisions"

# Determine next ADR number
LAST_ADR=$(ls -1 ADR-*.md 2>/dev/null | grep -o 'ADR-[0-9]*' | sort -V | tail -1)
if [ -z "$LAST_ADR" ]; then
  NEXT_ADR="ADR-001"
else
  NUM=${LAST_ADR#ADR-}
  NEXT_NUM=$(printf "%03d" $((10#$NUM + 1)))
  NEXT_ADR="ADR-${NEXT_NUM}"
fi
```

### 4. **Read the template**: Read `.arckit/templates/adr-template.md` to understand the comprehensive structure

   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.

### 5. **Gather decision information from user**:
   - **Decision title**: Short noun phrase (e.g., "Use PostgreSQL for Data Persistence")
   - **Problem statement**: What architectural decision needs to be made?
   - **Context**: Why is this decision needed? Business/technical drivers?
   - **Status**: Proposed (default) / Accepted / Deprecated / Superseded
   - **Escalation level**: Team / Cross-team / Department / Cross-government
   - **Governance forum**: Architecture Review Board, TDA, Programme Board, etc.

### 6. **Generate comprehensive ADR** following MADR v4.0 + UK Gov framework:

   **Document Control** (see "Auto-Populate Document Control Fields" section below for full details):
   - Document ID: ARC-{PROJECT_ID}-ADR-{NUM}-v${VERSION} (use `generate-document-id.sh`)
   - ADR Number: ADR-{NUM} (e.g., ADR-001, ADR-002)
   - Version: ${VERSION} (from Step 0: Detect Version)
   - Status: Proposed (or as user specified)
   - Date: Current date (YYYY-MM-DD)
   - Escalation Level: Based on decision scope
   - Governance Forum: Based on escalation level

   **Stakeholders**:
   - **Deciders**: Who has authority to approve this ADR?
   - **Consulted**: Subject matter experts to involve (two-way communication)
   - **Informed**: Stakeholders to keep updated (one-way communication)
   - **UK Government Escalation Context**:
     - Team: Local implementation (frameworks, libraries, testing)
     - Cross-team: Integration patterns, shared services, APIs
     - Department: Technology standards, cloud providers, security
     - Cross-government: National infrastructure, cross-department interoperability

   **Context and Problem Statement**:
   - Problem description (2-3 sentences or story format)
   - Why is this decision needed?
   - Business context (link to BR-xxx requirements)
   - Technical context (link to FR-xxx, NFR-xxx requirements)
   - Regulatory context (GDPR, GDS Service Standard, Cyber Essentials)
   - Supporting links (user stories, requirements, research)

   **Decision Drivers (Forces)**:
   - **Technical drivers**: Performance, scalability, maintainability, security
     - Link to NFR-xxx requirements
     - Reference architecture principles
   - **Business drivers**: Cost, time to market, risk reduction
     - Link to BR-xxx requirements
     - Link to stakeholder goals
   - **Regulatory & compliance drivers**:
     - GDS Service Standard (which points apply?)
     - Technology Code of Practice (Point 5: Cloud first, Point 8: Reuse, Point 13: AI)
     - NCSC Cyber Security (Cyber Essentials, CAF principles)
     - Data Protection (UK GDPR Article 25, 35)
   - **Alignment to architecture principles**: Create table showing which principles support/conflict

   **Considered Options** (MINIMUM 2-3 options, always include "Do Nothing"):

   For each option:
   - **Description**: What is this option?
   - **Implementation approach**: How would it be implemented?
   - **Wardley Evolution Stage**: Genesis / Custom-Built / Product / Commodity
   - **Good (Pros)**:
     - ✅ Benefits, requirements met, principles supported
     - ✅ Quantify where possible (performance, cost savings)
   - **Bad (Cons)**:
     - ❌ Drawbacks, requirements not met, risks
     - ❌ Trade-offs and negative consequences
   - **Cost Analysis**:
     - CAPEX: One-time costs (licenses, hardware, migration)
     - OPEX: Ongoing costs (support, training, maintenance per year)
     - TCO (3-year): Total cost of ownership
   - **GDS Service Standard Impact**: Create table showing impact on relevant points

   **Option: Do Nothing (Baseline)**:
   - Always include this as baseline comparison
   - Pros: No immediate cost, no risk
   - Cons: Technical debt accumulates, opportunity cost, compliance risk

   **Decision Outcome**:
   - **Chosen Option**: Which option was selected
   - **Y-Statement** (structured justification):
     > In the context of [use case],
     > facing [concern],
     > we decided for [option],
     > to achieve [quality/benefit],
     > accepting [downside/trade-off].
   - **Justification**: Why this option over alternatives?
     - Key reasons with evidence
     - Stakeholder consensus or dissenting views
     - Risk appetite alignment

   **Consequences**:
   - **Positive**: Benefits, capabilities enabled, compliance achieved
     - Include measurable outcomes (metrics: baseline → target)
   - **Negative**: Accepted trade-offs, limitations, technical debt
     - Include mitigation strategies
   - **Neutral**: Changes needed (training, infrastructure, process, vendors)
   - **Risks and Mitigations**: Create table with risk, likelihood, impact, mitigation, owner
     - Link to risk register (RISK-xxx)

   **Validation & Compliance**:
   - **How will implementation be verified?**
     - Design review requirements (HLD, DLD include this decision)
     - Code review checklist (PR checklist includes ADR compliance)
     - Testing strategy (unit, integration, performance, security tests)
   - **Monitoring & Observability**:
     - Success metrics (how to measure if goals achieved)
     - Alerts and dashboards
   - **Compliance verification**:
     - GDS Service Assessment: Which points addressed, evidence prepared
     - Technology Code of Practice: Which points addressed
     - Security assurance: NCSC principles, Cyber Essentials, security testing
     - Data protection: DPIA updated, data flows, privacy notice

   **Links to Supporting Documents**:
   - **Requirements traceability**:
     - Business: BR-xxx requirements addressed
     - Functional: FR-xxx requirements addressed
     - Non-functional: NFR-xxx requirements addressed
   - **Architecture artifacts**:
     - Architecture principles: Which influenced this decision
     - Stakeholder drivers: Which stakeholder goals supported
     - Risk register: Which risks mitigated (RISK-xxx)
     - Research findings: Which research sections analyzed these options
     - Wardley Maps: Which maps show evolution stage
     - Architecture diagrams: Which C4/deployment/sequence diagrams show this
     - Strategic roadmap: Which theme/initiative this supports
   - **Design documents**:
     - High-Level Design: HLD section implementing this
     - Detailed Design: DLD specifications
     - Data model: If decision affects data structure
   - **External references**:
     - Standards and RFCs
     - Vendor documentation
     - UK Government guidance (GDS Service Manual, NCSC, GOV.UK patterns)
     - Research and evidence

   **Implementation Plan**:
   - **Dependencies**: Prerequisite ADRs, infrastructure, team skills
   - **Implementation timeline**: Phases, activities, duration, owners
   - **Rollback plan**: Trigger, procedure, owner

   **Review and Updates**:
   - **Review schedule**: Initial (3-6 months), periodic (annually)
   - **Review criteria**: Metrics met? Assumptions changed? Still optimal?
   - **Trigger events**: Version changes, cost changes, security incidents, regulatory changes

   **Related Decisions**:
   - **Depends on**: ADR-xxx
   - **Depended on by**: ADR-yyy
   - **Conflicts with**: ADR-zzz (how resolved)

   **Appendices** (optional):
   - **Options analysis details**: Benchmarks, PoC results
   - **Stakeholder consultation log**: Date, stakeholder, feedback, action
   - **Mermaid decision flow diagram**: Visual representation of decision logic

### 7. **Ensure comprehensive traceability**:
   - Link decision drivers to requirements (BR-xxx, FR-xxx, NFR-xxx)
   - Link to architecture principles (show alignment/conflicts)
   - Link to stakeholder goals (from ARC-{PROJECT_ID}-STKE-v*.md)
   - Link to risk mitigations (from ARC-{PROJECT_ID}-RISK-v*.md)
   - Link to research findings (which sections analyzed these options)
   - Link to Wardley maps (evolution stage influences choice)
   - Link to roadmap (which theme/initiative this supports)
   - Create bidirectional traceability chain

### 8. **Create file naming**:
   - **Generate filename**: Use `generate-document-id.sh` with --filename --next-num flags:
     ```bash
     FILENAME=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "ADR" "${VERSION}" --filename --next-num "projects/${PROJECT_DIR}/decisions")
     # Example output: ARC-001-ADR-003-v1.0.md
     ```
   - **Format**: `ARC-{PROJECT_ID}-ADR-{NUM}-v{VERSION}.md`
   - **Example**: `ARC-001-ADR-001-v1.0.md`, `ARC-001-ADR-002-v1.0.md`
   - **Path**: `projects/{PROJECT_ID}-{project-name}/decisions/ARC-{PROJECT_ID}-ADR-{NUM}-v${VERSION}.md`
   - ADR number is auto-incremented by --next-num flag (for new ADRs)

### 9. **Use Write tool to create the ADR file**:
   - **CRITICAL**: Because ADRs are very large documents (500+ lines), you MUST use the Write tool to create the file
   - Do NOT output the full ADR content in your response (this will exceed token limits)
   - Use Write tool with the full ADR content
   - Path: `projects/{PROJECT_ID}-{project-name}/decisions/ARC-{PROJECT_ID}-ADR-{NUM}-v${VERSION}.md`



**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 0: Detect Version

Before generating the document ID, check if a previous version exists:

ADRs are multi-instance documents. Version detection depends on whether you are creating a **new** ADR or **updating** an existing one:

**Creating a new ADR** (default): Use `VERSION="1.0"` — the ADR number is auto-incremented by `--next-num`.

**Updating an existing ADR** (user explicitly references an existing ADR number, e.g., "update ADR-001", "revise ADR-003"):
1. Look for existing `ARC-{PROJECT_ID}-ADR-{NUM}-v*.md` files in `projects/{project-dir}/decisions/`
2. **If no existing file**: Use VERSION="1.0"
3. **If existing file found**:
   - Read the existing document to understand its current state
   - Compare against current inputs and the decision being made
   - **Minor increment** (e.g., 1.0 → 1.1): Status change, updated evidence, corrected details, same decision outcome
   - **Major increment** (e.g., 1.0 → 2.0): Decision outcome changed, options re-evaluated, fundamentally different justification
4. Use the determined version for document ID, filename, Document Control, and Revision History
5. For v1.1+/v2.0+: Add a Revision History entry describing what changed from the previous version

### Step 1: Generate Document ID
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "ADR" "${VERSION}" --filename --next-num "projects/${PROJECT_DIR}/decisions")
# Example output: ARC-001-ADR-003-v1.0.md
```

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Determined version from Step 0
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Use the document purpose (e.g., "Architecture Decision Record")
- `ARC-[PROJECT_ID]-ADR-[NUM]-v[VERSION]` → Use generated DOC_ID from Step 1
- `[COMMAND]` → Current command name (e.g., "arckit.adr")

**User-provided fields** (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

**Calculated fields**:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days (requirements, research, risks)
- `[YYYY-MM-DD]` for Review Date → Phase gate dates (Alpha/Beta/Live for compliance docs)

**Pending fields** (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

### Step 3: Populate Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.adr` command | [PENDING] | [PENDING] |
```

### Step 4: Populate Generation Metadata Footer

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.adr` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from VERSION file or use "1.0.0"]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### Example Fully Populated Document Control Section:

```markdown
## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-ADR-003-v1.0 |
| **Document Type** | Architecture Decision Record |
| **Project** | Windows 10 to Windows 11 Migration (Project 001) |
| **Classification** | OFFICIAL-SENSITIVE |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2025-10-29 |
| **Last Modified** | 2025-10-29 |
| **Review Date** | 2025-11-30 |
| **Owner** | John Smith (Enterprise Architect) |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | PM Team, Architecture Team, Dev Team |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2025-10-29 | ArcKit AI | Initial creation from `/arckit.adr` command | [PENDING] | [PENDING] |
```


### 10. **Show summary to user** (NOT full document):
   ```markdown
   ## Architecture Decision Record Created

   **ADR Number**: ADR-{NUM}
   **Title**: {Decision title}
   **Status**: {Proposed/Accepted/etc}
   **File**: `projects/{PROJECT_ID}-{project-name}/decisions/ARC-{PROJECT_ID}-ADR-{NUM}-v${VERSION}.md`

   ### Chosen Option
   {Option name}

   ### Y-Statement
   > In the context of {use case},
   > facing {concern},
   > we decided for {option},
   > to achieve {quality},
   > accepting {downside}.

   ### Options Considered
   - Option 1: {Name} - {Brief summary}
   - Option 2: {Name} - {Brief summary}
   - Option 3: Do Nothing - Baseline comparison

   ### Key Consequences
   **Positive**:
   - {Benefit 1}
   - {Benefit 2}

   **Negative** (accepted trade-offs):
   - {Trade-off 1}
   - {Trade-off 2}

   ### Decision Drivers
   - {Driver 1}: {Brief description}
   - {Driver 2}: {Brief description}

   ### Requirements Addressed
   - BR-XXX: {Business requirement}
   - FR-XXX: {Functional requirement}
   - NFR-XXX: {Non-functional requirement}

   ### Traceability Links
   - Architecture principles: {Count} principles referenced
   - Stakeholder goals: {Count} goals supported
   - Requirements: {Count} requirements addressed
   - Risks: {Count} risks mitigated

   ### Next Steps
   - [ ] Stakeholder review and approval
   - [ ] Update status to "Accepted" once approved
   - [ ] Reflect decision in HLD/DLD
   - [ ] Update architecture diagrams
   - [ ] Implement decision
   - [ ] Verify with testing
   - [ ] Schedule ADR review ({Date})

   ### UK Government Compliance
   **Escalation Level**: {Level}
   **Governance Forum**: {Forum}
   **GDS Service Standard**: Points {X, Y, Z} addressed
   **Technology Code of Practice**: Points {A, B, C} addressed
   ```

### 11. **Provide guidance on ADR lifecycle**:
   - **Status transitions**:
     - Proposed → Accepted (after approval)
     - Accepted → Superseded (when replaced by new ADR)
     - Accepted → Deprecated (when no longer recommended but not replaced)
   - **When to create new ADR**:
     - Significant architectural decision affecting structure, behavior, or quality attributes
     - Technology choices (databases, frameworks, cloud services, APIs)
     - Integration patterns and protocols
     - Security and compliance approaches
     - Deployment and infrastructure decisions
     - Data management and privacy decisions
   - **When NOT to create ADR**:
     - Minor implementation details (variable names, coding style)
     - Temporary workarounds or fixes
     - Decisions that don't affect other teams or systems
   - **ADR numbering**:
     - Sequential: ADR-001, ADR-002, ADR-003, etc.
     - Never reuse numbers (even if ADR is superseded)
     - Superseded ADRs remain in place with updated status

## Important Notes

- **Token Limit**: ADRs are very large documents. Always use Write tool to create the file, never output full content
- **Minimum Options**: Always analyze at least 2-3 options plus "Do Nothing" baseline
- **Y-Statement**: This is the concise justification format - always include it
- **Traceability**: Every ADR must link to requirements, principles, stakeholders, risks
- **UK Government**: Include escalation level and governance forum for compliance
- **MADR Format**: Follow MADR v4.0 structure (Context, Decision Drivers, Options, Outcome, Consequences)
- **Evidence-Based**: Decisions should be supported by research findings, benchmarks, PoCs
- **Wardley Evolution**: Consider evolution stage (Genesis/Custom/Product/Commodity) when choosing options
- **GDS Service Standard**: Document which Service Standard points the decision addresses
- **Technology Code of Practice**: Show TCoP compliance (Point 5: Cloud first, Point 8: Reuse, etc.)
- **Security**: Include NCSC guidance, Cyber Essentials, security testing requirements
- **Review Schedule**: Every ADR needs review schedule and trigger events for re-evaluation
- **Rollback Plan**: Document how to rollback if decision proves wrong
- **Cost Analysis**: Always include CAPEX, OPEX, TCO for each option
- **Consequences**: Be explicit about both positive and negative consequences
- **Validation**: Define how implementation will be verified (review, testing, monitoring)

## Example Decision Titles

- "Use PostgreSQL for Transactional Data Persistence"
- "Adopt API Gateway Pattern for Service Integration"
- "Deploy on Azure Government Cloud"
- "Implement OAuth 2.0 with Azure AD for Authentication"
- "Use Event-Driven Architecture for Real-Time Processing"
- "Choose React with TypeScript for Frontend Development"
- "Implement Microservices over Monolithic Architecture"
- "Use Terraform for Infrastructure as Code"
- "Adopt Kubernetes for Container Orchestration"
- "Implement CQRS Pattern for Read/Write Separation"

## UK Government Escalation Guidance

| Level | Decision Makers | Example Decisions | Governance Forum |
|-------|----------------|-------------------|------------------|
| **Team** | Tech Lead, Senior Developers | Framework choice, testing strategy, code patterns | Team standup, Sprint review |
| **Cross-team** | Technical Architects, Lead Engineers | Integration patterns, API standards, shared libraries | Architecture Forum, Technical Design Review |
| **Department** | Enterprise Architects, CTO, Architecture Board | Cloud provider, security framework, technology standards | Architecture Review Board, Enterprise Architecture Board |
| **Cross-government** | Technical Design Authority, GDS | National infrastructure, cross-department APIs, GOV.UK standards | Technical Design Council, GDS Architecture Community |
