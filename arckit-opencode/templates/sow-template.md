# Statement of Work (SOW): [PROJECT_NAME]

> **Template Status**: Live | **Version**: [VERSION] | **Command**: `/arckit.sow`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-SOW-v[VERSION] |
| **Document Type** | [DOCUMENT_TYPE_NAME] |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] on [DATE] or [PENDING] |
| **Approved By** | [APPROVER_NAME] on [DATE] or [PENDING] |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.[COMMAND]` command | [PENDING] | [PENDING] |

## Document Purpose

[Brief description of what this document is for and how it will be used]

---

## 1. Executive Summary

### 1.1 Purpose of This SOW

This Statement of Work (SOW) defines the requirements, deliverables, and evaluation criteria for [PROJECT_NAME]. The issuing organization is seeking qualified vendors to [high-level objective].

### 1.2 Background

[2-3 paragraphs providing context about the organization, current state, business drivers for this project, and strategic importance]

### 1.3 Project Overview

**Objective**: [Primary goal of the project]

**Scope**: [High-level description of what is included]

**Expected Outcomes**:
- [Outcome 1]
- [Outcome 2]
- [Outcome 3]

**Budget Range**: $[MIN] - $[MAX] (or "Budget available upon request to qualified vendors")

**Timeline**: [Expected project duration, e.g., "12-month implementation timeline"]

---

## 2. Scope of Work

### 2.1 In Scope

The selected vendor will be responsible for:

1. **[Phase/Workstream 1]**
   - [Specific deliverable 1.1]
   - [Specific deliverable 1.2]
   - [Specific deliverable 1.3]

2. **[Phase/Workstream 2]**
   - [Specific deliverable 2.1]
   - [Specific deliverable 2.2]
   - [Specific deliverable 2.3]

3. **[Phase/Workstream 3]**
   - [Specific deliverable 3.1]
   - [Specific deliverable 3.2]

### 2.2 Out of Scope

The following are explicitly NOT part of this engagement:
- [Item 1 that vendor is NOT responsible for]
- [Item 2 that remains with client organization]
- [Item 3 deferred to future phase]

### 2.3 Client Responsibilities

[ORGANIZATION_NAME] will provide:
- [Resource/access 1 that client will provide]
- [Resource/access 2 that client will provide]
- [Decisions/approvals client will handle]
- [Existing infrastructure/tools client will maintain]

---

## 3. Requirements

### 3.1 Functional Requirements Summary

[High-level summary of functional capabilities required. Reference detailed requirements document if lengthy.]

**Key Capabilities**:
1. **[Capability Area 1]**: [Brief description]
2. **[Capability Area 2]**: [Brief description]
3. **[Capability Area 3]**: [Brief description]

**Detailed Requirements**: See Appendix A: Functional Requirements or attached requirements document [LINK].

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements
- **Response Time**: [Specific metrics, e.g., "< 2 seconds page load, < 200ms API response"]
- **Throughput**: [Transaction volume, e.g., "10,000 transactions/second at peak"]
- **Concurrent Users**: [e.g., "Support 50,000 concurrent users"]

#### 3.2.2 Availability and Resilience
- **Uptime SLA**: [e.g., "99.95% availability measured monthly"]
- **Disaster Recovery**:
  - RPO (Recovery Point Objective): [e.g., "< 15 minutes"]
  - RTO (Recovery Time Objective): [e.g., "< 4 hours"]
- **Backup**: [Frequency, retention, geographic redundancy]

#### 3.2.3 Security Requirements
- **Compliance**: [GDPR, HIPAA, PCI-DSS, SOC 2, ISO 27001, etc.]
- **Authentication**: [SSO, MFA requirements]
- **Encryption**: [TLS 1.3+, AES-256 at rest]
- **Vulnerability Management**: [Scanning, penetration testing, remediation SLAs]

#### 3.2.4 Scalability Requirements
- **Growth Projections**: [User growth, data growth over 3 years]
- **Horizontal Scaling**: [Auto-scaling capabilities]
- **Data Volume**: [Current and projected data volumes]

#### 3.2.5 Usability Requirements
- **Accessibility**: [WCAG 2.1 Level AA compliance]
- **Browser Support**: [Chrome, Firefox, Safari, Edge - last 2 versions]
- **Mobile**: [Responsive design, native apps if required]
- **Localization**: [Languages and locales to support]

#### 3.2.6 Integration Requirements
- **External Systems**: [List systems that must integrate]
- **Integration Patterns**: [API-based, event-driven, file-based]
- **API Standards**: [RESTful, GraphQL, SOAP]

### 3.3 Technical Constraints

**TC-1 - Architecture Principles**: Solution must comply with [ORGANIZATION_NAME] Enterprise Architecture Principles (see Appendix B or attached document).

**TC-2 - Cloud Platform**: [If mandated] Solution must deploy on [AWS | Azure | GCP].

**TC-3 - Technology Stack**: [If constrained] Solution must use approved technology stack (see Section 6.3).

**TC-4 - Existing Infrastructure**: Solution must integrate with existing [authentication, monitoring, logging] infrastructure.

**TC-5 - Data Residency**: [If applicable] Data must remain within [geographic region] for compliance.

---

## 4. Deliverables

### 4.1 Design Phase Deliverables

| Deliverable | Description | Format | Due Date (Relative to Project Start) | Acceptance Criteria |
|-------------|-------------|--------|--------------------------------------|---------------------|
| **High-Level Design (HLD)** | Architecture overview, component diagrams, technology stack, integration approach | Document (PDF/Markdown) + Diagrams (C4 model preferred) | Week 4 | Approved by Architecture Review Board |
| **Detailed Design (DLD)** | Component specifications, API contracts, data models, security controls | Document (PDF/Markdown), OpenAPI specs | Week 8 | Approved by technical reviewers |
| **Solution Architecture Document** | Infrastructure design, network topology, deployment model, DR strategy | Document + Infrastructure diagrams | Week 6 | Approved by Enterprise Architect |
| **Security Design** | Threat model, security controls, compliance mapping | Document | Week 6 | Approved by Security Architect |
| **Test Strategy** | Unit, integration, performance, security testing approach | Document | Week 8 | Approved by QA Lead |

### 4.2 Development Phase Deliverables

| Deliverable | Description | Format | Due Date | Acceptance Criteria |
|-------------|-------------|--------|----------|---------------------|
| **Source Code** | All application source code | Git repository | Ongoing | Code review approved, meets coding standards |
| **Infrastructure as Code** | Terraform/CloudFormation for all infrastructure | Git repository | Ongoing | Deployable to all environments |
| **Database Schemas** | DDL scripts, migration scripts, seed data | SQL scripts | Week 12 | Schema review approved |
| **API Documentation** | Interactive API documentation | OpenAPI 3.0 spec + Swagger UI | Ongoing | All endpoints documented |
| **Unit Tests** | Automated unit tests | Code | Ongoing | ≥80% code coverage |
| **Integration Tests** | Automated integration tests | Code | Ongoing | Critical paths covered |

### 4.3 Deployment Phase Deliverables

| Deliverable | Description | Format | Due Date | Acceptance Criteria |
|-------------|-------------|--------|----------|---------------------|
| **Deployed Application** | Fully functional application in production | Running system | Week 40 | Passes UAT, performance tests |
| **CI/CD Pipeline** | Automated build, test, deploy pipeline | CI/CD configuration | Week 36 | Deploys to all environments |
| **Monitoring & Alerting** | Dashboards, alerts, SLO/SLI definitions | Monitoring platform config | Week 38 | All key metrics tracked |
| **Runbooks** | Operational procedures for common tasks | Markdown documents | Week 38 | Covers deployment, rollback, incidents |
| **Disaster Recovery Plan** | DR procedures, tested and documented | Document | Week 39 | DR drill successfully executed |

### 4.4 Documentation Deliverables

| Deliverable | Description | Format | Due Date | Acceptance Criteria |
|-------------|-------------|--------|----------|---------------------|
| **Technical Documentation** | Architecture, design decisions, component docs | Markdown / Confluence | Ongoing | Kept current with code changes |
| **API Documentation** | Full API reference with examples | OpenAPI spec + docs site | Ongoing | All endpoints documented |
| **Operations Manual** | System administration, maintenance procedures | Document | Week 38 | SRE team trained |
| **User Manual** | End-user documentation | Document / Online help | Week 36 | User training completed |
| **Training Materials** | Training guides, videos, tutorials | Various formats | Week 36 | Users trained successfully |

### 4.5 Knowledge Transfer

| Activity | Description | Participants | Timeline | Acceptance Criteria |
|----------|-------------|--------------|----------|---------------------|
| **Technical Training** | Architecture, codebase walkthrough, deployment | Dev team | Weeks 38-40 | Team can make changes independently |
| **Operations Training** | Monitoring, incident response, maintenance | SRE/Ops team | Weeks 38-40 | Team can operate system 24/7 |
| **User Training** | End-user functionality training | End users | Weeks 36-38 | Users can perform daily tasks |
| **Documentation Review** | Review all docs for completeness | All stakeholders | Week 40 | Docs approved by all parties |

---

## 5. Project Timeline and Milestones

### 5.1 High-Level Timeline

**Total Duration**: [X months from contract signing]

| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| **Initiation** | Weeks 1-2 | Kickoff, resource onboarding, environment setup |
| **Design** | Weeks 3-8 | HLD complete (Week 4), DLD complete (Week 8), Design approval |
| **Development** | Weeks 9-32 | Sprints 1-12, incremental delivery, code reviews |
| **Testing** | Weeks 28-36 | Integration testing, UAT, performance testing, security testing |
| **Deployment** | Weeks 37-40 | Production deployment, hypercare, go-live |
| **Closure** | Weeks 40-42 | Knowledge transfer, warranty period begins |

### 5.2 Key Milestones

| Milestone | Target Week | Deliverables Due | Exit Criteria |
|-----------|-------------|------------------|---------------|
| **M1: Project Kickoff** | Week 1 | Project plan, resource assignments | Kickoff meeting held, teams introduced |
| **M2: Design Approval** | Week 8 | HLD, DLD, security design | Architecture Review Board approval |
| **M3: Development Sprint 6** | Week 20 | 50% functionality complete | Mid-project demo, stakeholder approval |
| **M4: UAT Complete** | Week 36 | All functionality, test results | UAT sign-off by business users |
| **M5: Production Go-Live** | Week 40 | Deployed system, docs, trained users | System live, users operational |
| **M6: Project Closure** | Week 42 | Final reports, lessons learned | Closure sign-off, warranty begins |

### 5.3 Proposal Timeline

| Event | Date |
|-------|------|
| **RFP Issued** | [DATE] |
| **Vendor Questions Due** | [DATE] (2 weeks after RFP issue) |
| **Answers Published** | [DATE] (3 weeks after RFP issue) |
| **Proposals Due** | [DATE] (6 weeks after RFP issue) |
| **Vendor Presentations** | [DATE RANGE] (8 weeks after RFP issue) |
| **Final Vendor Selection** | [DATE] (10 weeks after RFP issue) |
| **Contract Negotiation** | [DATE RANGE] (Weeks 11-12) |
| **Expected Project Start** | [DATE] (Week 13) |

---

## 6. Vendor Qualifications and Requirements

### 6.1 Mandatory Qualifications

Vendors MUST meet the following minimum qualifications to be considered:

**MQ-1 - Experience**: Minimum [5] years of experience delivering projects of similar scope and complexity.

**MQ-2 - Reference Projects**: At least [3] reference projects in the past [3] years demonstrating relevant capabilities.

**MQ-3 - Certifications**: Team must include individuals with relevant certifications:
- [ ] [AWS/Azure/GCP Certified Solutions Architect] (if cloud-based)
- [ ] [Security certification: CISSP, CEH, or equivalent]
- [ ] [Relevant technology certifications for proposed stack]

**MQ-4 - Security Compliance**: Company must hold [SOC 2 Type II | ISO 27001] certification.

**MQ-5 - Financial Stability**: Company must provide financial statements demonstrating stability (revenue, years in business).

**MQ-6 - Geographical Presence**: [If applicable] Vendor must have presence in [region] for on-site support.

**MQ-7 - Insurance**: Vendor must carry appropriate insurance (professional liability, cyber liability).

### 6.2 Preferred Qualifications

Preference will be given to vendors with:

**PQ-1**: Experience in [specific industry, e.g., "healthcare", "financial services", "retail"]

**PQ-2**: Expertise with [specific technology, e.g., "Kubernetes", "serverless architectures", "event-driven systems"]

**PQ-3**: Prior work with [ORGANIZATION_NAME] or similar organizations

**PQ-4**: Agile/DevOps culture with demonstrable CI/CD maturity

**PQ-5**: Strong observability and SRE practices

### 6.3 Approved Technology Stack (if applicable)

[If organization has technology constraints, list approved technologies. If vendor can propose alternatives, state that clearly.]

**Programming Languages**: [Java, Python, Go, TypeScript/Node.js]

**Cloud Platforms**: [AWS (preferred), Azure, GCP]

**Databases**: [PostgreSQL, MySQL, MongoDB, Redis]

**Container Orchestration**: [Kubernetes (EKS/AKS/GKE), AWS ECS/Fargate]

**CI/CD**: [GitHub Actions, GitLab CI, Jenkins]

**Monitoring**: [Prometheus, Grafana, DataDog, New Relic]

**Proposed Alternatives**: Vendors may propose alternative technologies if they can demonstrate superior fit for requirements. Justification must be included in proposal.

### 6.4 Team Requirements

**Minimum Team Composition**:
- [ ] 1 Solution Architect (senior, 10+ years experience)
- [ ] 1 Security Architect
- [ ] 1 Technical Lead (8+ years experience)
- [ ] [X] Senior Developers (5+ years experience)
- [ ] [Y] Developers (3+ years experience)
- [ ] 1 QA Lead
- [ ] [Z] QA Engineers
- [ ] 1 DevOps Engineer
- [ ] 1 Technical Writer

**Key Personnel Requirements**:
- Key personnel (Solution Architect, Technical Lead) must be dedicated to project for at least [50%] allocation
- Resumes for key personnel must be included in proposal
- Key personnel cannot be changed without client approval

**Onshore/Offshore Mix** (if applicable):
- [Specify requirements, e.g., "Minimum 50% onshore", "Onshore architect required"]

---

## 7. Proposal Requirements

### 7.1 Proposal Format

Proposals must follow this structure:

#### **Section 1: Executive Summary** (2 pages max)
- High-level approach
- Key differentiators
- Summary of costs

#### **Section 2: Company Overview** (5 pages max)
- Company history, size, stability
- Relevant expertise and certifications
- Case studies and references

#### **Section 3: Understanding of Requirements** (10 pages max)
- Demonstrate understanding of problem and requirements
- Identify any ambiguities or risks
- Proposed approach to clarifying unknowns

#### **Section 4: Technical Solution** (30 pages max)
- High-level architecture (C4 Context and Container diagrams)
- Technology stack and rationale
- Integration approach
- Security and compliance strategy
- Scalability and performance approach
- Disaster recovery and business continuity
- DevOps and deployment strategy

#### **Section 5: Project Approach and Methodology** (10 pages max)
- Development methodology (Agile, SAFe, etc.)
- Project phases and timeline
- Risk management approach
- Change management process
- Quality assurance approach
- Communication and governance plan

#### **Section 6: Team and Resources** (5 pages max)
- Proposed team structure and roles
- Key personnel resumes
- Staff augmentation plans if needed
- Onshore/offshore model (if applicable)

#### **Section 7: Experience and References** (10 pages max)
- Minimum 3 reference projects with:
  - Client name and contact information
  - Project scope and size
  - Technologies used
  - Challenges overcome
  - Outcomes achieved
- Industry-specific experience
- Awards and recognition

#### **Section 8: Cost Proposal** (see Section 7.2)

#### **Section 9: Assumptions and Risks**
- Key assumptions made in proposal
- Identified risks and mitigation strategies
- Dependencies on client organization

### 7.2 Cost Proposal Format

**Cost proposal must be provided in a SEPARATE document** to allow for technical evaluation independent of cost.

Cost proposal must include:

**7.2.1 Fixed Price (if applicable)**
- Total fixed price for all deliverables
- Payment milestones tied to deliverables
- Breakdown by project phase

**7.2.2 Time and Materials (if applicable)**
- Hourly/daily rates by role
- Estimated hours/days per role
- Total estimated cost
- Not-to-exceed cap (if any)

**7.2.3 Cost Breakdown**
- Labor costs (by role and phase)
- Infrastructure costs (cloud resources, licenses)
- Third-party service costs (APIs, SaaS tools)
- Travel expenses (if applicable)
- Contingency (percentage and justification)

**7.2.4 Ongoing Support and Maintenance**
- Annual support and maintenance cost
- SLA for support response times
- Included vs. out-of-scope support activities

**7.2.5 Pricing Terms**
- Payment terms (net 30, net 60, etc.)
- Invoicing schedule
- Currency
- Validity period of pricing

**7.2.6 Assumptions**
- Key assumptions affecting pricing
- Exclusions and out-of-scope items
- Client-provided resources/infrastructure

### 7.3 Submission Instructions

**Deadline**: Proposals must be received by **[DATE] at [TIME] [TIMEZONE]**

**Submission Method**: [Email to procurement@org.com | Upload to vendor portal | Physical delivery]

**Format**:
- PDF format preferred
- Technical proposal and cost proposal as SEPARATE files
- File naming: `[VENDOR_NAME]_[PROJECT_NAME]_Technical.pdf` and `[VENDOR_NAME]_[PROJECT_NAME]_Cost.pdf`

**Questions**:
- Submit questions by [DATE] to [EMAIL]
- All questions and answers will be published to all vendors by [DATE]
- No proprietary or confidential information in questions (visible to all vendors)

**Late Proposals**: Will not be accepted

---

## 8. Evaluation Criteria

### 8.1 Evaluation Process

Proposals will be evaluated in two phases:

**Phase 1: Technical Evaluation** (Cost proposals remain sealed)
- Mandatory qualifications check (pass/fail)
- Technical scoring (see Section 8.2)
- Shortlisting of top [3-5] vendors

**Phase 2: Cost Evaluation**
- Cost proposals opened only for shortlisted vendors
- Combined technical and cost scoring
- Vendor presentations and Q&A
- Final selection

### 8.2 Technical Evaluation Criteria

Proposals will be scored on a 100-point scale:

| Criteria | Weight | Max Points | Evaluation Focus |
|----------|--------|------------|------------------|
| **Technical Approach and Solution Design** | 35% | 35 | Architecture quality, technology choices, scalability, security, innovation |
| **Project Approach and Methodology** | 20% | 20 | Delivery methodology, risk management, quality assurance, realistic timeline |
| **Team Qualifications and Experience** | 25% | 25 | Team expertise, relevant experience, key personnel, certifications |
| **Relevant Experience and References** | 15% | 15 | Similar projects, industry experience, client references, success stories |
| **Understanding of Requirements** | 5% | 5 | Demonstrated understanding, identified risks, thoughtful questions |
| **TOTAL** | **100%** | **100** | |

### 8.3 Cost Evaluation Criteria

Cost will be evaluated using the following approach:

**Cost Scoring Method**: [Choose one]
- **Option A - Lowest Price Best Value**: Lowest cost proposal receives maximum points, others scaled proportionally
- **Option B - Fixed Weighting**: Cost is [X]% of total score, technical [Y]%
- **Option C - Cost-Benefit Analysis**: Best value considering both cost and technical quality

**Example (Option B)**:
- Technical Score: 70% weight
- Cost Score: 30% weight
- Final Score = (Technical Score × 0.7) + (Cost Score × 0.3)

### 8.4 Vendor Presentations

Shortlisted vendors will be invited to present their proposals:
- **Duration**: [2 hours] (1 hour presentation, 1 hour Q&A)
- **Audience**: Evaluation committee (Business, Architecture, Security, Procurement)
- **Format**: [In-person | Virtual]
- **Content**: Technical deep-dive, team introductions, demo (if applicable)

### 8.5 Selection Decision

**Decision Authority**: [Procurement Committee | CTO/CIO]

**Selection Criteria**:
1. Highest combined technical + cost score
2. Best value (not necessarily lowest price)
3. Confidence in vendor's ability to deliver
4. Cultural fit and communication

**Selection Timeline**: Final decision by [DATE]

**Notification**: All vendors will be notified of decision by [DATE]

---

## 9. Contract Terms and Conditions

### 9.1 Contract Type

[Fixed Price | Time and Materials | Hybrid]

### 9.2 Payment Terms

**Payment Schedule** (example for fixed price):
- 10% upon contract signing
- 20% upon design approval (Milestone M2)
- 30% upon development milestone (Milestone M3)
- 30% upon UAT completion (Milestone M4)
- 10% upon go-live and project closure (Milestone M6)

**Retainage**: [X]% held for [Y days] after go-live to ensure warranty support

### 9.3 Acceptance Criteria

Each deliverable must meet defined acceptance criteria (see Section 4). Acceptance process:
1. Vendor submits deliverable
2. Client reviews within [5 business days]
3. Client accepts, rejects with feedback, or requests clarifications
4. Vendor addresses feedback and resubmits
5. Formal acceptance sign-off

### 9.4 Warranty and Support

**Warranty Period**: [90 days] from go-live
- All defects identified during warranty will be fixed at no cost
- Response time for critical defects: [4 hours]
- Response time for non-critical defects: [2 business days]

**Post-Warranty Support**: See Section 9.5

### 9.5 Ongoing Support and Maintenance (Optional)

**Support Tiers**:
- **Tier 1 - L1 Support**: [Vendor | Client responsibility]
- **Tier 2 - L2 Support**: [Vendor responsibility]
- **Tier 3 - L3 Support**: [Vendor responsibility]

**Support Hours**: [24/7 | Business hours] for [Severity 1] issues

**Support SLA**:
| Severity | Response Time | Resolution Time |
|----------|---------------|-----------------|
| Severity 1 (Critical - System down) | 1 hour | 4 hours |
| Severity 2 (High - Major feature broken) | 4 hours | 24 hours |
| Severity 3 (Medium - Minor feature issue) | 1 business day | 5 business days |
| Severity 4 (Low - Enhancement request) | 5 business days | Best effort |

**Annual Maintenance**: Includes [bug fixes, security patches, minor enhancements up to X hours]

### 9.6 Intellectual Property Rights

**Work Product Ownership**: [Client | Vendor | Shared]

**Standard Clause**: All custom-developed work product and deliverables become property of [ORGANIZATION_NAME] upon final payment. Vendor retains ownership of pre-existing IP and reusable frameworks/components.

**Open Source**: Vendor must disclose all open-source components and licenses used.

### 9.7 Data and Security

**Data Ownership**: Client retains ownership of all client data

**Data Security**: Vendor must comply with client's security policies and standards (see Architecture Principles document)

**Data Handling**:
- Data must not be used for vendor's purposes
- Data must be returned or destroyed upon contract termination
- Vendor must sign Data Processing Agreement (DPA) if handling personal data

**Background Checks**: Vendor staff with access to sensitive data must pass background checks

### 9.8 Confidentiality

Both parties agree to maintain confidentiality of proprietary information disclosed during the engagement.

**Non-Disclosure Agreement (NDA)**: Required before sharing detailed requirements or data

### 9.9 Liability and Indemnification

**Liability Cap**: [To be negotiated, typically 1-2× contract value]

**Indemnification**: Vendor indemnifies client against:
- IP infringement claims
- Data breaches due to vendor negligence
- Violations of laws or regulations

### 9.10 Termination

**Termination for Convenience**: Client may terminate with [60 days] written notice, paying for work completed

**Termination for Cause**: Either party may terminate if other party breaches material terms and fails to cure within [30 days]

**Transition Assistance**: Vendor must provide [90 days] of transition assistance to new vendor or client team

### 9.11 Change Management

**Change Request Process**:
1. Either party submits written change request
2. Vendor provides impact analysis (cost, schedule, scope)
3. Client approves or rejects
4. Approved changes documented in change order
5. Contract amended accordingly

**Thresholds**:
- Changes < $[X] or [Y] hours: Technical Lead approval
- Changes > $[X] or [Y] hours: Executive Sponsor approval

---

## 10. Appendices

### Appendix A: Detailed Functional Requirements

[Link to or include detailed requirements document created separately]

### Appendix B: Enterprise Architecture Principles

[Link to or include organization's architecture principles document]

### Appendix C: Security and Compliance Standards

[List relevant standards: NIST, ISO 27001, GDPR, HIPAA, etc.]

### Appendix D: Reference Architecture Diagrams

[Include current state and desired future state architecture diagrams if available]

### Appendix E: Integration Specifications

[Details of systems that must integrate, APIs available, data formats]

### Appendix F: Glossary

[Define domain-specific terms, acronyms, abbreviations]

### Appendix G: Contract Template

[Attach standard contract template or terms and conditions]

---

## 11. Questions and Contact Information

### Questions

All questions regarding this SOW/RFP must be submitted in writing to:

**Email**: [procurement@organization.com]
**Subject Line**: "RFP [RFP_NUMBER] - [PROJECT_NAME] - Question"
**Deadline for Questions**: [DATE]

**Question Format**:
- Section reference (e.g., "Section 6.3 - Technology Stack")
- Specific question
- Context or rationale for question

All questions and answers will be published to all vendors by [DATE] to ensure fairness.

### Contact Information

**Primary Contact**:
[Name]
[Title]
[Email]
[Phone]

**Procurement Lead**:
[Name]
[Title]
[Email]
[Phone]

**Technical Lead**:
[Name]
[Title]
[Email]

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft |
| 0.2 | [DATE] | [AUTHOR] | Stakeholder review feedback |
| 1.0 | [DATE] | [AUTHOR] | Issued to vendors |

**Approvals**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Executive Sponsor | [NAME] | _________ | [DATE] |
| Procurement Lead | [NAME] | _________ | [DATE] |
| Enterprise Architect | [NAME] | _________ | [DATE] |
| Legal Review | [NAME] | _________ | [DATE] |

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.sow` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]