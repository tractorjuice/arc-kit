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
   - First, check if `.arckit/memory/architecture-principles.md` exists
     - If it doesn't exist, suggest running `/arckit.principles` first
     - Architecture principles should inform decision drivers
   - Optionally check for related artifacts that may inform the decision:
     - `projects/*/stakeholder-drivers.md` - understand stakeholder goals
     - `projects/*/requirements.md` - decisions address requirements
     - `projects/*/research-findings.md` - research may have analyzed options
     - `projects/*/wardley-maps/*.md` - evolution stage influences choices

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

   **Document Control** (auto-populate):
   - Document ID: ARC-{PROJECT_ID}-ADR-{NUM}-v1.0 (use `generate-document-id.sh`)
   - ADR Number: ADR-{NUM} (e.g., ADR-001, ADR-002)
   - Version: 1.0 (initial draft)
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

   **Generation Metadata**: Auto-populate ArcKit version, AI model, timestamp

### 7. **Ensure comprehensive traceability**:
   - Link decision drivers to requirements (BR-xxx, FR-xxx, NFR-xxx)
   - Link to architecture principles (show alignment/conflicts)
   - Link to stakeholder goals (from stakeholder-drivers.md)
   - Link to risk mitigations (from risk-register.md)
   - Link to research findings (which sections analyzed these options)
   - Link to Wardley maps (evolution stage influences choice)
   - Link to roadmap (which theme/initiative this supports)
   - Create bidirectional traceability chain

### 8. **Create file naming**:
   - **Format**: `ADR-{NUM}-{short-title}.md`
   - **Example**: `ADR-001-use-postgresql.md`, `ADR-002-api-gateway-pattern.md`
   - **Path**: `projects/{PROJECT_ID}-{project-name}/decisions/ADR-{NUM}-{short-title}.md`
   - Keep title short (3-5 words), lowercase, hyphen-separated

### 9. **Use Write tool to create the ADR file**:
   - **CRITICAL**: Because ADRs are very large documents (500+ lines), you MUST use the Write tool to create the file
   - Do NOT output the full ADR content in your response (this will exceed token limits)
   - Use Write tool with the full ADR content
   - Path: `projects/{PROJECT_ID}-{project-name}/decisions/ADR-{NUM}-{short-title}.md`

### 10. **Show summary to user** (NOT full document):
   ```markdown
   ## Architecture Decision Record Created

   **ADR Number**: ADR-{NUM}
   **Title**: {Decision title}
   **Status**: {Proposed/Accepted/etc}
   **File**: `projects/{PROJECT_ID}-{project-name}/decisions/ADR-{NUM}-{short-title}.md`

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
