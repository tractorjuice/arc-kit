# UK Digital Marketplace: G-Cloud Service Procurement

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:gcloud-search`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit:gcloud-search` command | PENDING | PENDING |

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
| NFR-SEC-xxx | [From NFR-SEC-xxx or ARC-000-PRIN-v*.md] | [Certificate/documentation] |
| NFR-SEC-xxx | [From NFR-SEC-xxx or ARC-000-PRIN-v*.md] | [Certificate/documentation] |

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

> **Call-off route**: this weighted model can become award criteria only on the G-Cloud 15 competitive selection route, where price and quality (including social value) must each carry between 10% and 90% of the weighting; the default below gives pricing 5%, so adjust it before using it that way. On the award without competition route the buyer cannot add criteria or weightings: the award goes to the lowest price after the framework's filters, so use these scores only to inform the statement of requirements and the choice of route.

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
- Filters: [Lot, taxonomy, social value, data storage and processing locations, certifications, security clearance, etc.]

**Digital Marketplace URL**: https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-15/choose-lot

### Shortlisted Services

#### Service 1: [Service Name]

| Field | Value |
|-------|-------|
| **Supplier** | [Supplier Name] |
| **Service ID** | [G-Cloud Service ID] |
| **Service URL** | [Link to Digital Marketplace page] |
| **Framework** | [G-Cloud 15] |
| **Lot** | [1a IaaS and PaaS / 1b IaaS and PaaS above OFFICIAL / 2a iSaaS / 2b SaaS / 3 Cloud support services] |
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

### Unmet Must-Have Requirements

Requirements from Section 2 that **no** shortlisted service clearly meets. A per-service gap belongs in that service's "Gaps Identified" block above; this section is for the ones nothing on the shortlist covers, because those change the procurement decision rather than the ranking.

⚠️ **Requirement Gap**: [MUST requirement ID and description]

- **Finding**: No shortlisted service clearly mentions this capability
- **Action Required**:
  - Contact shortlisted suppliers directly to confirm capability — `/arckit:gcloud-clarify` generates the questions
  - Broaden the search, or revisit whether the requirement is genuinely a MUST
  - Consider a hybrid approach combining two services

*If every MUST requirement is met by at least one shortlisted service, write "No unmet must-have requirements." — do not omit the section.*

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

- [Gap 1 - run /arckit:gcloud-clarify]
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
2. **Gap analysis**: Run `/arckit:gcloud-clarify` to generate clarification questions
3. **Budget alignment**: Confirm pricing fits within budget constraints

**Recommended call-off route**: [Award without competition / Competitive selection (two-stage or multi-stage)] — [Why this route fits the requirement]

### Supplier Engagement

4. **Send clarifications**: Email suppliers with questions from gcloud-clarify. On award without competition, keep these to basic clarifications of operational details (such as capacity or delivery timelines) or of the total price; anything more needs the competitive selection route
5. **Schedule demos**: Arrange technical demonstrations with top 2-3 services (competitive selection: the multi-stage process allows demonstrations)
6. **Reference checks**: Request customer references from shortlisted suppliers (not on award without competition, where supplier contact is limited to basic clarifications)

### Evaluation

7. **Formal scoring**: Use `/arckit:evaluate` to create evaluation framework (competitive selection only; award without competition uses the framework's objective mechanism and lowest price)
8. **Technical validation**: Test integration in demo/trial environment
9. **Final decision**: Select winning service: lowest price after the filters (award without competition) or most advantageous tender (competitive selection)

### Contract Award

10. **Award contract**: Through the Contract Award Service, completing the G-Cloud 15 order form
11. **Publish transparency notices**: The notices the G-Cloud 15 buyer guide sets out, such as the UK6 contract award notice and the UK7 contract details notice (within 30 days of entering the contract), on Find a Tender
12. **Onboarding**: Begin service implementation

---

## 10. Resources and References

### Digital Marketplace Guidance

- **Digital Marketplace**: https://www.digitalmarketplace.service.gov.uk/
- **G-Cloud 15 agreement, buyer guide and call-off guidance (GCA)**: https://www.gca.gov.uk/agreements/RM1557.15
- **G-Cloud 14 agreement (ends 28 October 2026)**: https://www.gca.gov.uk/agreements/RM1557.14
- **Search G-Cloud 15 services by lot**: https://www.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-15/choose-lot
- **Contract Award Service (shortlist and award)**: https://redirect.contractawardservice.gca.gov.uk/
- **Find a Tender (transparency notices)**: https://www.gov.uk/find-tender

### G-Cloud Framework Notes

- **Framework agreement**: G-Cloud 15 (RM1557.15) is an open framework under the Procurement Act 2023, run by the Government Commercial Agency (Crown Commercial Service until 1 April 2026). It replaced G-Cloud 14 and started on 6 August 2026.
- **Two call-off routes**: award without competition, where an existing catalogue service meets the statement of requirements (apply the framework's filters, then award on lowest price, with no criteria of your own), or competitive selection (shortlist with the filters, issue an invitation to tender to every eligible supplier on the shortlist, award on the most advantageous tender).
- **Call-off contracts**: each service purchase creates a call-off contract under the framework.
- **Integration testing**: confirm the service integrates per the `INT-xxx` requirements before commitment.
- **Exit strategy**: clarify data export and service termination terms before signing.
- **Audit trail**: record the evaluation decision and its justification — the call-off is auditable.

### Project Documents

- **Requirements**: projects/[project]/ARC-*-REQ-v*.md
- **Architecture Principles**: projects/000-global/ARC-000-PRIN-v*.md
- **Stakeholder Analysis**: projects/[project]/ARC-*-STKE-v*.md (if exists)

### Related ArcKit Commands

- **`/arckit:gcloud-clarify`**: Generate clarification questions for shortlisted services
- **`/arckit:evaluate`**: Create vendor evaluation framework and scoring
- **`/arckit:dos`**: If custom development needed instead of cloud services

---

## Appendix A: Search Methodology

**Search Date**: [DATE]

**Digital Marketplace Filters Applied**:

- Lot: [1a IaaS and PaaS / 2a iSaaS / 2b SaaS / 3 Cloud support services]
- Taxonomy filters: [Selected service categories]
- Social value filters: [Selected social value themes, if applicable]
- Standardised technical filters: [For example certifications, data storage and processing locations (United Kingdom / EEA), minimum government security clearance, supplier type]
- Keyword search: [Generic keywords used after the filters, if any]

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
| G-Cloud | UK Government framework for procuring cloud services; G-Cloud 15 (RM1557.15) is the current iteration |
| GCA | Government Commercial Agency, which runs G-Cloud (Crown Commercial Service until 1 April 2026) |
| CAS | Contract Award Service, GCA's platform for shortlisting and awarding G-Cloud call-off contracts |
| Award without competition | G-Cloud 15 call-off route: the framework's filters, then award on lowest price |
| Competitive selection | G-Cloud 15 call-off route: shortlist, invitation to tender, award on the most advantageous tender |
| DOS | Digital Outcomes and Specialists framework for custom development |
| SLA | Service Level Agreement |
| DR/BC | Disaster Recovery / Business Continuity |
| NFR | Non-Functional Requirement |
| INT | Integration Requirement |

## External References

> This section provides traceability from generated content back to source documents.
> Follow citation instructions in the project's citation reference guide.

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:gcloud-search` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
