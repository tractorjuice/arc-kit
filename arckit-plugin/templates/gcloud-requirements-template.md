# UK Digital Marketplace: G-Cloud Service Procurement

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.gcloud-search`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-GCLD-v[VERSION] |
| **Document Type** | G-Cloud Service Requirements |
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
| **Framework** | G-Cloud |
| **Service Category** | [Cloud Hosting / Cloud Software / Cloud Support] |
| **Requirements Source** | projects/[PROJECT_ID]/ARC-{PROJECT_ID}-REQ-v*.md |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.gcloud-search` command | PENDING | PENDING |

---

## 1. Service Overview

### 1.1 What We Need

[Describe what cloud service/software is needed - from ARC-{PROJECT_ID}-REQ-v*.md]

### 1.2 Why We Need It

[Business context from BR-xxx requirements]

### 1.3 Strategic Alignment

**Architecture Principles** (if exists):
[Reference relevant principles, especially cloud strategy, security principles]

### 1.4 Integration Context

[Extract from INT-xxx requirements - what systems this service will integrate with]

---

## 2. Must-Have Requirements

The service **MUST** provide:

[Extract MUST requirements from ARC-{PROJECT_ID}-REQ-v*.md]

### 2.1 Functional Requirements

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-xxx | [From FR-xxx] | [Criteria] |
| FR-xxx | [From FR-xxx] | [Criteria] |
| FR-xxx | [From FR-xxx] | [Criteria] |

### 2.2 Performance Requirements

| ID | Requirement | Target Metric |
|----|-------------|---------------|
| NFR-P-xxx | [From NFR-P-xxx] | [Measurable metric] |
| NFR-P-xxx | [From NFR-P-xxx] | [Measurable metric] |

### 2.3 Security Requirements

| ID | Requirement | Evidence Required |
|----|-------------|-------------------|
| NFR-S-xxx | [From NFR-S-xxx or ARC-000-PRIN-v*.md] | [Certificate/documentation] |
| NFR-S-xxx | [From NFR-S-xxx or ARC-000-PRIN-v*.md] | [Certificate/documentation] |

### 2.4 Compliance Requirements

| ID | Requirement | Certification |
|----|-------------|---------------|
| NFR-C-xxx | [From NFR-C-xxx] | [e.g., ISO 27001, Cyber Essentials Plus] |
| NFR-C-xxx | [Data Residency] | [e.g., UK data centers only, GDPR compliance] |

### 2.5 Integration Requirements

| ID | System | Integration Method |
|----|--------|-------------------|
| INT-xxx | [From INT-xxx] | [API, webhook, file transfer, etc.] |
| INT-xxx | [From INT-xxx] | [API, webhook, file transfer, etc.] |

---

## 3. Desirable Requirements

The service **SHOULD** provide:

[Extract SHOULD requirements from ARC-{PROJECT_ID}-REQ-v*.md]

| ID | Requirement | Priority |
|----|-------------|----------|
| [REQ-ID] | [Desirable feature 1] | SHOULD |
| [REQ-ID] | [Desirable feature 2] | SHOULD |
| [REQ-ID] | [Desirable feature 3] | COULD |

---

## 4. Success Criteria

[Extract measurable success criteria from ARC-{PROJECT_ID}-REQ-v*.md BR-xxx]

| Criterion | Metric | Target |
|-----------|--------|--------|
| [Criterion 1] | [How measured] | [Target value] |
| [Criterion 2] | [How measured] | [Target value] |
| [Criterion 3] | [How measured] | [Target value] |

---

## 5. Evaluation Criteria

### 5.1 Functional Fit (50%)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Must-Have Coverage | 30% | Meets all MUST requirements |
| Desirable Features | 20% | Coverage of SHOULD requirements |

### 5.2 Reliability & Performance (25%)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Service Level Agreements | 10% | Uptime guarantees, support response times |
| Performance Specifications | 10% | Meets NFR-P-xxx requirements |
| Disaster Recovery | 5% | DR/BC capabilities |

### 5.3 Security & Compliance (15%)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Security Certifications | 5% | ISO 27001, Cyber Essentials Plus, etc. |
| Data Protection | 5% | GDPR compliance, data residency |
| Compliance Standards | 5% | Industry-specific certifications |

### 5.4 Cost & Support (10%)

| Criterion | Weight | Description |
|-----------|--------|-------------|
| Pricing Model | 5% | Transparency, predictability, value |
| Support Availability | 3% | Support hours, escalation process |
| Contract Flexibility | 2% | Terms, exit strategy, lock-in |

---

## 6. Service Search Results

### Search Strategy

**Search Terms Used**:
- Primary: [main service category]
- Secondary: [specific capabilities]
- Filters: [UK data centers, certifications, etc.]

**Digital Marketplace URL**: https://www.digitalmarketplace.service.gov.uk/g-cloud/search

### Shortlisted Services

#### Service 1: [Service Name]

| Field | Value |
|-------|-------|
| **Supplier** | [Supplier Name] |
| **Service ID** | [G-Cloud Service ID] |
| **Service URL** | [Link to Digital Marketplace page] |
| **Category** | [Cloud Hosting / Cloud Software / Cloud Support] |
| **Pricing Model** | [Per user / Per GB / Per transaction / etc.] |

**Must-Have Match**: [X]/[Y] requirements
**Desirable Match**: [X]/[Y] features

**Key Features**:
- [Feature 1 matching requirements]
- [Feature 2 matching requirements]
- [Feature 3 matching requirements]

**Compliance Mentions**:
- [Certification 1]
- [Certification 2]

**Gaps Identified**:
- [Gap 1 - requirement not mentioned]
- [Gap 2 - ambiguous claim]

**Risk Level**: [🔴 CRITICAL / 🟠 HIGH / 🔵 MEDIUM / 🟢 LOW]

---

#### Service 2: [Service Name]

[REPEAT STRUCTURE FOR EACH SERVICE]

---

#### Service 3: [Service Name]

[REPEAT STRUCTURE FOR EACH SERVICE]

---

## 7. Service Comparison Matrix

| Criterion | Weight | [Service 1] | [Service 2] | [Service 3] |
|-----------|--------|-------------|-------------|-------------|
| **Must-Have Requirements** | 30% | [X]/[Y] | [X]/[Y] | [X]/[Y] |
| **Desirable Features** | 20% | [X]/[Y] | [X]/[Y] | [X]/[Y] |
| **SLA & Performance** | 10% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Security Certifications** | 5% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Data Protection** | 5% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Compliance** | 5% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **DR/BC** | 5% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Pricing Clarity** | 5% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Support** | 3% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Contract Terms** | 2% | [✅/⚠️/❌] | [✅/⚠️/❌] | [✅/⚠️/❌] |
| **Overall Risk** | - | [🔴/🟠/🔵/🟢] | [🔴/🟠/🔵/🟢] | [🔴/🟠/🔵/🟢] |

**Legend**: ✅ Confirmed | ⚠️ Ambiguous | ❌ Not Mentioned

---

## 8. Recommendation

### Recommended Service

**Primary Recommendation**: [Service Name] by [Supplier Name]

**Rationale**:
- [Reason 1 - best match for MUST requirements]
- [Reason 2 - compliance/security]
- [Reason 3 - value/support]

**Risk Level**: [Risk Level]

**Gaps to Clarify**:
- [Gap 1 - run /arckit.gcloud-clarify]
- [Gap 2]

### Alternative Options

**Second Choice**: [Service Name]
- Rationale: [Why this is second choice]
- Trade-offs: [What you gain/lose vs primary]

**Third Choice**: [Service Name]
- Rationale: [Why this is third choice]
- Trade-offs: [What you gain/lose vs primary]

---

## 9. Next Steps

### Immediate Actions

1. **Review shortlist**: Validate services with technical team
2. **Gap analysis**: Run `/arckit.gcloud-clarify` to generate clarification questions
3. **Budget alignment**: Confirm pricing fits within budget constraints

### Supplier Engagement

4. **Send clarifications**: Email suppliers with questions from gcloud-clarify
5. **Schedule demos**: Arrange technical demonstrations with top 2-3 services
6. **Reference checks**: Request customer references from shortlisted suppliers

### Evaluation

7. **Formal scoring**: Use `/arckit.evaluate` to create evaluation framework
8. **Technical validation**: Test integration in demo/trial environment
9. **Final decision**: Select winning service based on scoring

### Contract Award

10. **Award contract**: Via Digital Marketplace
11. **Publish on Contracts Finder**: Legal requirement for transparency
12. **Onboarding**: Begin service implementation

---

## 10. Resources and References

### Digital Marketplace Guidance

- **Digital Marketplace**: https://www.digitalmarketplace.service.gov.uk/
- **G-Cloud Buyers Guide**: https://www.gov.uk/guidance/g-cloud-buyers-guide
- **General Buying Guide**: https://www.gov.uk/guidance/buying-and-selling-on-the-digital-marketplace
- **Contracts Finder**: https://www.gov.uk/contracts-finder

### Project Documents

- **Requirements**: projects/[project]/ARC-*-REQ-v*.md
- **Architecture Principles**: projects/000-global/ARC-000-PRIN-v*.md
- **Stakeholder Analysis**: projects/[project]/ARC-*-STKE-v*.md (if exists)

### Related ArcKit Commands

- **`/arckit.gcloud-clarify`**: Generate clarification questions for shortlisted services
- **`/arckit.evaluate`**: Create vendor evaluation framework and scoring
- **`/arckit.dos`**: If custom development needed instead of cloud services

---

## Appendix A: Search Methodology

**Search Date**: [DATE]

**Digital Marketplace Filters Applied**:
- Lot: [Cloud Hosting / Cloud Software / Cloud Support]
- Categories: [Selected categories]
- Capabilities: [Selected capabilities]
- Certifications: [Required certifications]
- Data location: [UK only / EU / etc.]

**Search Queries**:
1. `[Primary search term]` - [N] results
2. `[Secondary search term]` - [N] results
3. `[Filtered search]` - [N] results

**Services Reviewed**: [N]
**Services Shortlisted**: [N]

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| G-Cloud | UK Government framework for procuring cloud services |
| DOS | Digital Outcomes and Specialists framework for custom development |
| SLA | Service Level Agreement |
| DR/BC | Disaster Recovery / Business Continuity |
| NFR | Non-Functional Requirement |
| INT | Integration Requirement |

---

**Generated by**: ArcKit `/arckit.gcloud-search` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
