# UK Digital Marketplace: Digital Outcomes and Specialists

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.dos`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-DOS-v[VERSION] |
| **Document Type** | DOS Procurement Requirements |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |
| **Framework** | Digital Outcomes and Specialists (DOS) |
| **Procurement Type** | [Digital Outcome / Digital Specialists / Outcome + Specialists] |
| **Requirements Source** | projects/[PROJECT_ID]/ARC-{PROJECT_ID}-REQ-v*.md |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.dos` command | PENDING | PENDING |

---

## 1. Executive Summary

### 1.1 Procurement Overview

[1-2 paragraph summary extracted from ARC-{PROJECT_ID}-REQ-v*.md Business Requirements section - describe what needs to be delivered and why]

### 1.2 Strategic Alignment

**Architecture Principles**:
[Reference relevant principles from ARC-000-PRIN-v*.md that constrain this procurement]

**Stakeholder Priorities** (if ARC-{PROJECT_ID}-STKE-v*.md exists):
[List top 3 stakeholder drivers/goals this addresses with IDs: D-001, G-001, etc.]

### 1.3 Expected Outcomes

[Extract from ARC-{PROJECT_ID}-REQ-v*.md Business Requirements (BR-xxx) - the measurable outcomes]

---

## 2. Digital Outcome Description

[Describe what vendor must deliver - the complete deliverable or specific outcome]

**What Success Looks Like**:

[Extract success criteria from ARC-{PROJECT_ID}-REQ-v*.md - ensure technology-agnostic]
- [Outcome 1 with measurable metric]
- [Outcome 2 with measurable metric]
- [Outcome 3 with measurable metric]

**Compliance with Architecture Principles**:
- [Principle Name]: [How outcome must comply]
- [Principle Name]: [How outcome must comply]

---

## 3. Essential Skills and Experience

[Extract from ARC-{PROJECT_ID}-REQ-v*.md - what capabilities are absolutely required]

### 3.1 Technical Capabilities (MUST Have)

From Functional Requirements (FR-xxx):
- **[Capability Area 1]**: [Skill needed to deliver FR-xxx requirements]
- **[Capability Area 2]**: [Skill needed to deliver FR-xxx requirements]
- **[Capability Area 3]**: [Skill needed to deliver FR-xxx requirements]

### 3.2 Non-Functional Expertise (MUST Have)

From Non-Functional Requirements (NFR-xxx):
- **Security**: [Skills for NFR-S-xxx requirements, reference security principles]
- **Performance**: [Skills for NFR-P-xxx requirements]
- **Compliance**: [Skills for NFR-C-xxx requirements, reference compliance principles]
- **Integration**: [Skills for INT-xxx requirements]

### 3.3 Architecture Governance (MUST Have)

From ARC-000-PRIN-v*.md:
- **[Principle Category]**: Experience with [specific technology/approach mandated by principles]
- **Design Reviews**: Experience with HLD/DLD review processes
- **Documentation**: Ability to produce architecture diagrams (Mermaid, C4)
- **Traceability**: Experience maintaining requirements traceability throughout delivery

---

## 4. Desirable Skills and Experience

[Nice-to-have skills that would enhance delivery]

From SHOULD requirements:
- [Desirable skill 1]
- [Desirable skill 2]
- [Desirable skill 3]

---

## 5. User Needs and Scenarios

[Extract user personas and scenarios from ARC-{PROJECT_ID}-REQ-v*.md to help vendors understand context]

**User Personas**:
[List personas from Functional Requirements section]

**Key User Journeys**:
1. [Journey 1 summary]
2. [Journey 2 summary]
3. [Journey 3 summary]

---

## 6. Requirements Summary

### 6.1 Business Requirements

[Extract all BR-xxx from ARC-{PROJECT_ID}-REQ-v*.md with IDs and priority]

| ID | Requirement | Priority | Acceptance Criteria |
|----|-------------|----------|---------------------|
| BR-001 | [requirement] | MUST | [criteria] |
| BR-002 | [requirement] | SHOULD | [criteria] |

### 6.2 Functional Requirements

[Extract all FR-xxx from ARC-{PROJECT_ID}-REQ-v*.md - group by capability area]

**[Capability Area 1]**:
- **FR-001** (MUST): [requirement] - [acceptance criteria]
- **FR-002** (MUST): [requirement] - [acceptance criteria]

**[Capability Area 2]**:
- **FR-003** (MUST): [requirement] - [acceptance criteria]

### 6.3 Non-Functional Requirements

[Extract all NFR-xxx from ARC-{PROJECT_ID}-REQ-v*.md - organize by category]

**Performance (NFR-P-xxx)**:
- [requirement with measurable targets]

**Security (NFR-S-xxx)**:
- [requirement with compliance references]

**Compliance (NFR-C-xxx)**:
- [requirement with standards/regulations]

**Scalability (NFR-SC-xxx)**:
- [requirement with capacity targets]

**Reliability (NFR-R-xxx)**:
- [requirement with uptime/availability targets]

### 6.4 Integration Requirements

[Extract all INT-xxx from ARC-{PROJECT_ID}-REQ-v*.md]

**Upstream Systems**:
- INT-xxx: [system and integration method]

**Downstream Systems**:
- INT-xxx: [system and integration method]

**Data Requirements (DR-xxx)**:
- [Extract any DR-xxx data requirements relevant to integration]

---

## 7. Scope and Boundaries

### 7.1 In Scope

[Extract from ARC-{PROJECT_ID}-REQ-v*.md scope section OR infer from MUST requirements]
- [Scope item 1]
- [Scope item 2]
- [Scope item 3]

### 7.2 Out of Scope

[Extract from ARC-{PROJECT_ID}-REQ-v*.md OR infer from explicitly excluded items]
- [Exclusion 1]
- [Exclusion 2]

---

## 8. Constraints and Dependencies

### 8.1 Architecture Constraints

[From ARC-000-PRIN-v*.md - what vendors MUST comply with]
- **[Constraint Type]**: [Specific constraint from principles]
- **[Constraint Type]**: [Specific constraint from principles]

### 8.2 Technical Dependencies

[From ARC-{PROJECT_ID}-REQ-v*.md dependencies section or INT-xxx]
- [Dependency 1]
- [Dependency 2]

### 8.3 Timelines

[If specified in user input or requirements]
- **Project Duration**: [timeline]
- **Key Milestones**: [milestones]
- **Critical Deadlines**: [deadlines if any]

---

## 9. Project Governance

### 9.1 Architecture Review Gates

**Mandatory Reviews**:
- [ ] **High-Level Design (HLD) Review** - before detailed design
- [ ] **Detailed Design (DLD) Review** - before implementation
- [ ] **Code Review** - ongoing during implementation
- [ ] **Security Review** - before go-live
- [ ] **Compliance Review** - before go-live

Reference: Run `/arckit.hld-review` and `/arckit.dld-review` for formal review processes

### 9.2 Compliance Requirements

[From ARC-000-PRIN-v*.md and NFR-C-xxx requirements]
- [Compliance requirement 1]
- [Compliance requirement 2]

### 9.3 Requirements Traceability

Vendor must maintain requirements traceability throughout delivery:
- Requirements → High-Level Design
- Requirements → Detailed Design
- Requirements → Test Cases
- Requirements → Deliverables

Reference: `/arckit.traceability` for traceability matrix generation and validation

---

## 10. Budget Considerations

[If provided by user - otherwise mark as TBD]

**Estimated Budget**: [budget range]

**Payment Structure**: [milestone-based / time & materials / fixed price]

**Contract Length**: [duration]

---

## 11. Evaluation Criteria

Suppliers will be evaluated according to Digital Marketplace guidelines:

### 11.1 Technical Capability (40%)

**Essential Criteria** (Pass/Fail):
- [ ] Meets ALL MUST requirements (from section 6)
- [ ] Meets ALL essential skills (from section 3.1-3.3)
- [ ] Demonstrates architecture governance experience
- [ ] Demonstrates requirements traceability capabilities

**Scoring Criteria**:
- **Technical Approach** (20%): Quality of proposed solution, alignment with architecture principles
- **Evidence of Delivery** (10%): Similar projects delivered, relevant domain experience
- **Understanding of Requirements** (10%): Depth of requirements understanding, risk identification

### 11.2 Team Experience and Composition (30%)

- **Team Skills Match** (15%): Coverage of essential + desirable skills
- **Track Record** (10%): Relevant project experience, client references, success stories
- **Team Structure** (5%): Appropriate roles, seniority levels, availability commitment

### 11.3 Quality Assurance (20%)

- **Testing Approach** (10%): Test coverage strategy, automation, non-functional testing
- **Compliance & Security** (5%): Security testing approach, compliance validation methods
- **Documentation** (5%): Quality of design docs, runbooks, training materials, handover plan

### 11.4 Value for Money (10%)

- **Cost Breakdown** (5%): Transparency, justification, flexibility, no hidden costs
- **Risk Mitigation** (5%): Approach to project risks, contingency planning, issue management

---

## 12. Deliverables

### 12.1 Architecture & Design

- [ ] **High-Level Design (HLD)** document with Mermaid diagrams
- [ ] **Detailed Design (DLD)** document
- [ ] **Data model** and schemas (if applicable)
- [ ] **API contracts** and specifications (if applicable)
- [ ] **Security design** documentation
- [ ] **Integration design** documentation (for INT-xxx requirements)

Reference: Generate with `/arckit.diagram`, `/arckit.data-model`

### 12.2 Implementation

- [ ] **Source code** (following architecture principles)
- [ ] **Configuration** and deployment scripts
- [ ] **Database migration** scripts (if applicable)
- [ ] **Infrastructure as Code** (if applicable)

### 12.3 Testing & Quality

- [ ] **Test plans** and test cases (linked to requirements)
- [ ] **Test results** and coverage reports
- [ ] **Performance test results** (NFR-P-xxx validation)
- [ ] **Security test results** (NFR-S-xxx validation)
- [ ] **Compliance evidence** (NFR-C-xxx validation)

### 12.4 Documentation

- [ ] **User documentation** and guides
- [ ] **Administrator documentation**
- [ ] **Deployment runbooks**
- [ ] **Training materials**
- [ ] **Requirements traceability matrix** (Requirements → Design → Tests → Code)
- [ ] **Handover documentation**

### 12.5 Support & Warranty

- [ ] [Warranty period and terms]
- [ ] [Support arrangements and SLAs]
- [ ] [Knowledge transfer plan]
- [ ] [Defect management process]

---

## 13. Proposal Submission Requirements

Vendors must provide:

1. **Technical Proposal**
   - Proposed solution architecture (aligned with ARC-000-PRIN-v*.md)
   - Approach to each requirement category (BR, FR, NFR, INT, DR)
   - Risk assessment and mitigation strategy
   - Quality assurance approach
   - Compliance and security approach

2. **Team Proposal**
   - Team composition and roles
   - CVs demonstrating essential skills
   - Availability and commitment (% allocation)
   - Client references (minimum 2 from similar projects)
   - Escalation path and governance structure

3. **Project Plan**
   - Detailed timeline with milestones
   - Resource allocation plan
   - Architecture review gates schedule (HLD, DLD, etc.)
   - Delivery roadmap with dependencies
   - Risk management plan

4. **Commercial Proposal**
   - Detailed cost breakdown by role/phase
   - Payment terms and milestones
   - Assumptions and exclusions
   - Contract terms
   - Change request process

---

## 14. Next Steps

### 14.1 For Procurement Team

1. **Review & Refine**: Validate this document with stakeholders
2. **Budget Approval**: Obtain budget sign-off before publishing
3. **Publish on Digital Marketplace**:
   - Go to: https://www.digitalmarketplace.service.gov.uk/
   - Select "Digital Outcomes and Specialists"
   - Post requirements (publicly visible)
   - Set closing date for proposals
4. **Answer Supplier Questions**: Via Digital Marketplace platform (visible to all)
5. **Evaluate Proposals**: Using criteria in Section 11
6. **Conduct Assessments**: Interview/technical assessment for shortlisted suppliers
7. **Award Contract**: To highest-scoring supplier
8. **Publish Award Details**: On Contracts Finder (legal requirement)

### 14.2 For Architecture Team

1. **Prepare Review Frameworks**:
   - Run `/arckit.hld-review` to set up HLD review process
   - Run `/arckit.dld-review` to set up DLD review process
   - Prepare evaluation scorecards based on Section 11 criteria
2. **Establish Governance**:
   - Set up architecture review board
   - Define review gates and approval process
   - Schedule regular checkpoints with vendor
3. **Traceability Setup**:
   - Run `/arckit.traceability` to establish tracking framework
   - Define traceability requirements for vendor

---

## 15. Resources and References

### 15.1 Digital Marketplace Guidance

- **Digital Marketplace**: https://www.digitalmarketplace.service.gov.uk/
- **DOS Buyers Guide**: https://www.gov.uk/guidance/digital-outcomes-and-specialists-buyers-guide
- **General Buying Guide**: https://www.gov.uk/guidance/buying-and-selling-on-the-digital-marketplace
- **Contracts Finder**: https://www.gov.uk/contracts-finder

### 15.2 Project Documents

- **Requirements**: projects/[project]/ARC-*-REQ-v*.md
- **Architecture Principles**: projects/000-global/ARC-000-PRIN-v*.md
- **Stakeholder Analysis**: projects/[project]/ARC-*-STKE-v*.md (if exists)
- **General RFP/SOW**: projects/[project]/procurement/ARC-*-SOW-*.md (if exists)

### 15.3 ArcKit Commands for Vendor Management

- **`/arckit.evaluate`**: Create vendor evaluation framework and scoring
- **`/arckit.hld-review`**: High-Level Design review process for vendor deliverables
- **`/arckit.dld-review`**: Detailed Design review process for vendor deliverables
- **`/arckit.traceability`**: Requirements traceability matrix validation

---

## 16. Important Compliance Notes

**Audit Trail**:
- All procurement decisions must be documented and auditable
- Evaluation scoring must be recorded with justification
- Supplier questions and answers must be visible to all bidders
- Changes to requirements must be published to all suppliers

**GDS Approval**:
- New or redesigned services may require formal GDS approval
- Check if spend control process applies to your organisation
- Consult with digital/technology leadership before publishing

**Transparency**:
- Requirements are published publicly on Digital Marketplace
- Evaluation criteria must be published before receiving proposals
- Award details must be published on Contracts Finder after completion

**Fair Competition**:
- All suppliers have equal access to information
- No preferential treatment during Q&A
- Evaluation based solely on published criteria
- No changes to requirements after publishing (unless necessary and communicated to all)

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.dos` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
