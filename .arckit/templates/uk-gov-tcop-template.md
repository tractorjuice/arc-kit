# UK Government Technology Code of Practice (TCoP) Assessment

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-TCOP-v[VERSION] |
| **Document Type** | [DOCUMENT_TYPE_NAME] |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Date** | [YYYY-MM-DD] |
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

## Executive Summary

**Overall Compliance**: [Score/13] points compliant

**Status**:
- ✅ COMPLIANT (11-13 points)
- ⚠️ PARTIALLY COMPLIANT (8-10 points)
- ❌ NON-COMPLIANT (< 8 points)

**Critical Issues**: [Number] blocking issues
**Recommendations**: [Brief summary]

---

## TCoP Point-by-Point Assessment

### 1. Define User Needs

**Principle**: Understand your users and their needs. Develop knowledge of how users interact with your technology initiatives.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] User research conducted (with at least 5 users)
- [ ] User personas documented
- [ ] User journeys mapped
- [ ] Accessibility needs identified
- [ ] User needs prioritized and validated
- [ ] Ongoing user feedback mechanism established

**Findings**:
[Describe user research conducted, personas created, needs identified]

**Gaps**:
[List any missing user research or validation]

**Requirements Mapping**:
- BR-xxx: [Business requirement aligned with user needs]
- FR-xxx: [Functional requirement derived from user needs]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 2. Make Things Accessible and Inclusive

**Principle**: Make sure your technology, infrastructure and systems are accessible and inclusive for all users.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] WCAG 2.2 Level AA compliance
- [ ] Tested with assistive technologies (screen readers, voice control)
- [ ] Keyboard navigation fully supported
- [ ] Color contrast meets requirements (4.5:1 minimum)
- [ ] Accessible across devices (mobile, tablet, desktop)
- [ ] Accessibility statement published
- [ ] Ongoing accessibility testing in CI/CD

**Findings**:
[Describe accessibility features implemented, testing conducted]

**Gaps**:
[List accessibility issues or missing features]

**Requirements Mapping**:
- NFR-A-xxx: [Accessibility requirements]
- FR-xxx: [Features supporting inclusive design]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 3. Be Open and Use Open Source

**Principle**: Publish your code and use open source software to improve transparency, flexibility and accountability.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Code published on public repository (GitHub/GitLab)
- [ ] Open source license applied (MIT, Apache 2.0, GPL, etc.)
- [ ] Uses open source software where appropriate
- [ ] Contributing back to open source projects
- [ ] Technical documentation publicly available
- [ ] Open Standards Profile (OSP) compliance documented
- [ ] Exemptions justified and documented (if any)

**Open Source Components Used**:
| Component | License | Purpose |
|-----------|---------|---------|
| [Name] | [License] | [Why used] |

**Code Published**:
- Repository: [URL]
- License: [Type]
- Documentation: [URL]

**Findings**:
[Describe open source usage and code publication]

**Gaps**:
[List proprietary components that could be replaced with OSS]

**Requirements Mapping**:
- TECH-xxx: [Technology standards requiring open source]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 4. Make Use of Open Standards

**Principle**: Build technology that uses open standards to ensure your technology works and communicates with other technology.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] RESTful APIs using JSON (or other open standards)
- [ ] Open data formats (CSV, JSON, XML, not proprietary)
- [ ] Open protocols (HTTP/HTTPS, OAuth 2.0, OpenID Connect)
- [ ] Open Standards Profile compliance
- [ ] No vendor lock-in through proprietary formats
- [ ] API specifications published (OpenAPI/Swagger)
- [ ] Interoperability tested with other systems

**Open Standards Used**:
| Standard | Purpose | Specification |
|----------|---------|---------------|
| HTTP/HTTPS | API communication | RFC 2616, RFC 2818 |
| OAuth 2.0 | Authentication | RFC 6749 |
| JSON | Data format | RFC 8259 |
| [Add more] | | |

**Findings**:
[Describe open standards implementation]

**Gaps**:
[List proprietary standards that should be replaced]

**Requirements Mapping**:
- INT-xxx: [Integration requirements using open standards]
- NFR-I-xxx: [Interoperability requirements]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 5. Use Cloud First

**Principle**: Consider using public cloud solutions first as stated in the Cloud First policy.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Public cloud solution evaluated first (AWS, Azure, GCP)
- [ ] Cloud First policy compliance documented
- [ ] On-premise alternative justified (if applicable)
- [ ] Multi-cloud or hybrid strategy documented
- [ ] Cloud-native services used (not just VMs)
- [ ] Infrastructure-as-Code implemented
- [ ] Cloud cost optimization strategy defined

**Cloud Strategy**:
- **Primary Cloud**: [AWS / Azure / GCP / Multi-cloud]
- **Services Used**: [Lambda, S3, RDS, etc.]
- **Justification for non-cloud** (if any): [Reason]

**Findings**:
[Describe cloud strategy and implementation]

**Gaps**:
[List areas not using cloud or using VMs instead of cloud-native]

**Requirements Mapping**:
- CLOUD-xxx: [Cloud-first principle requirements]
- NFR-SC-xxx: [Scalability using cloud]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 6. Make Things Secure

**Principle**: Keep systems and data safe with the appropriate level of security.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Risk assessment completed (using HMG IA Standard)
- [ ] Security accreditation obtained (if required)
- [ ] Cyber Essentials / Cyber Essentials Plus certification
- [ ] NCSC guidance followed
- [ ] Threat modeling conducted
- [ ] Penetration testing completed
- [ ] Security monitoring and logging implemented
- [ ] Incident response plan documented
- [ ] Security by Design principles applied

**Security Measures**:
| Measure | Implementation | Compliance |
|---------|----------------|------------|
| Authentication | [OAuth 2.0, MFA] | ✅ / ⚠️ / ❌ |
| Encryption at rest | [AES-256] | ✅ / ⚠️ / ❌ |
| Encryption in transit | [TLS 1.3] | ✅ / ⚠️ / ❌ |
| Access controls | [RBAC, least privilege] | ✅ / ⚠️ / ❌ |
| Security scanning | [SAST, DAST in CI/CD] | ✅ / ⚠️ / ❌ |

**Data Classification**:
- [ ] OFFICIAL
- [ ] OFFICIAL-SENSITIVE
- [ ] SECRET (requires additional accreditation)

**Findings**:
[Describe security implementation]

**Gaps**:
[List security vulnerabilities or missing controls]

**Requirements Mapping**:
- NFR-S-xxx: [Security requirements]
- NFR-C-xxx: [Compliance requirements]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 7. Make Privacy Integral

**Principle**: Make sure users rights are protected by integrating privacy as an essential part of your system.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Data Protection Impact Assessment (DPIA) completed
- [ ] UK GDPR compliance documented
- [ ] Privacy policy published and accessible
- [ ] Cookie consent implemented (if applicable)
- [ ] User data minimization practiced
- [ ] Data retention policy defined and implemented
- [ ] Right to access (DSAR) process documented
- [ ] Right to erasure implemented
- [ ] Privacy by Design principles applied
- [ ] Information Commissioner's Office (ICO) guidance followed

**Personal Data Processing**:
| Data Type | Purpose | Legal Basis | Retention |
|-----------|---------|-------------|-----------|
| [Name, email] | [User accounts] | [Consent / Contract] | [2 years] |

**Privacy Features**:
- [ ] Consent management
- [ ] Data export capability
- [ ] Data deletion capability
- [ ] Anonymization/pseudonymization
- [ ] Privacy dashboard for users

**Findings**:
[Describe privacy implementation]

**Gaps**:
[List privacy risks or missing features]

**Requirements Mapping**:
- NFR-P-xxx: [Privacy requirements]
- NFR-C-xxx: [GDPR compliance requirements]
- DR-xxx: [Data requirements with privacy controls]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 8. Share, Reuse and Collaborate

**Principle**: Avoid duplicating effort and unnecessary costs by collaborating across government and sharing and reusing technology.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Cross-government Digital Marketplace used for procurement
- [ ] Existing government services/components reused (GOV.UK Pay, Notify, etc.)
- [ ] Code shared on GitHub/GitLab
- [ ] Collaboration with other departments documented
- [ ] Reusable components identified and published
- [ ] Common platforms used (GOV.UK PaaS, etc.)
- [ ] Knowledge sharing via blogs, documentation, conferences

**Reused Government Services**:
| Service | Provider | Purpose |
|---------|----------|---------|
| GOV.UK Pay | GDS | Payment processing |
| GOV.UK Notify | GDS | Email/SMS notifications |
| [Add more] | | |

**Shared Components**:
| Component | Repository | Reusable by |
|-----------|------------|-------------|
| [Name] | [URL] | [Other departments] |

**Findings**:
[Describe collaboration and reuse]

**Gaps**:
[List areas where existing government services could be reused]

**Requirements Mapping**:
- INT-xxx: [Integration with government services]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 9. Integrate and Adapt Technology

**Principle**: Your technology should work with existing technologies, processes and infrastructure in your organisation, and adapt to future demands.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Integration with existing systems documented
- [ ] API-first approach for flexibility
- [ ] Modular architecture for adaptability
- [ ] Technical debt management strategy
- [ ] Technology roadmap defined
- [ ] Legacy system migration plan (if applicable)
- [ ] Change management process established
- [ ] Scalability for future growth

**Integration Points**:
| System | Integration Type | Status |
|--------|------------------|--------|
| [Legacy system] | [REST API] | ✅ / 🔄 / ⏳ |

**Future Adaptability**:
- [ ] Microservices architecture
- [ ] Containerization (Docker, Kubernetes)
- [ ] CI/CD pipeline for rapid changes
- [ ] Feature flags for gradual rollout
- [ ] API versioning strategy

**Findings**:
[Describe integration approach and adaptability]

**Gaps**:
[List integration challenges or inflexibility]

**Requirements Mapping**:
- INT-xxx: [Integration requirements]
- NFR-SC-xxx: [Scalability for future demands]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 10. Make Better Use of Data

**Principle**: Use data more effectively by improving your technology, infrastructure and processes.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Data strategy documented
- [ ] Data quality standards defined
- [ ] Analytics and reporting capabilities
- [ ] Data-driven decision making processes
- [ ] Performance metrics and KPIs defined
- [ ] Data governance framework
- [ ] Open data published (where appropriate)
- [ ] Machine learning/AI opportunities identified

**Data Usage**:
| Data Type | Purpose | Quality Measures |
|-----------|---------|------------------|
| [Transaction data] | [Performance analysis] | [Completeness, accuracy] |

**Analytics & Reporting**:
- [ ] Real-time dashboards
- [ ] KPI tracking
- [ ] User behavior analytics
- [ ] Performance monitoring
- [ ] Cost optimization insights

**Open Data**:
- [ ] Non-personal data published on data.gov.uk
- [ ] API for data access
- [ ] Open data license applied

**Findings**:
[Describe data usage and effectiveness]

**Gaps**:
[List missed data opportunities or quality issues]

**Requirements Mapping**:
- DR-xxx: [Data requirements]
- BR-xxx: [Business intelligence requirements]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 11. Define Your Purchasing Strategy

**Principle**: Your purchasing strategy must show you've considered commercial and technology aspects, and contractual limitations.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Procurement strategy documented
- [ ] Digital Marketplace considered/used
- [ ] Commercial considerations documented (TCO, ROI)
- [ ] Technology options analysis completed
- [ ] Supplier lock-in risks assessed
- [ ] SME participation encouraged
- [ ] Contract terms reviewed (exit strategy, IP rights)
- [ ] Social Value Model applied (if contract > £5M)

**Procurement Approach**:
- **Route**: [ ] G-Cloud / [ ] DOS / [ ] Open competition / [ ] Framework
- **Contract Value**: £[amount]
- **Contract Length**: [duration] months
- **Exit Strategy**: [Describe how to exit if needed]

**Commercial Considerations**:
| Factor | Analysis | Risk Mitigation |
|--------|----------|-----------------|
| Total Cost of Ownership | £[amount] over [X] years | [Strategy] |
| Vendor lock-in | [Risk level] | [Open standards, data portability] |
| SME access | [% of contract available to SMEs] | [Lot structure] |

**Technology Considerations**:
- [ ] Build vs buy analysis completed
- [ ] Open source alternatives evaluated
- [ ] SaaS vs hosted vs on-premise considered
- [ ] Interoperability requirements defined

**Findings**:
[Describe procurement strategy]

**Gaps**:
[List procurement risks or missing analysis]

**Requirements Mapping**:
- Aligns with requirements.md and sow.md in project

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 12. Make Your Technology Sustainable

**Principle**: Increase sustainability throughout the lifecycle of your technology.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Carbon impact assessment completed
- [ ] Energy-efficient infrastructure chosen
- [ ] Green hosting provider selected
- [ ] Carbon offsetting strategy (if applicable)
- [ ] E-waste and disposal plan for hardware
- [ ] Sustainable procurement practices
- [ ] Digital sustainability principles applied
- [ ] Greening Government ICT Strategy compliance

**Sustainability Measures**:
| Measure | Implementation | Impact |
|---------|----------------|--------|
| Cloud region selection | [Use UK regions to reduce latency/carbon] | [Estimated reduction] |
| Code efficiency | [Performance optimization] | [Reduced compute time] |
| Caching strategy | [CDN, Redis] | [Reduced server load] |
| Auto-scaling | [Scale down during low usage] | [Energy savings] |

**Hardware Lifecycle** (if applicable):
- [ ] Energy-efficient equipment (Energy Star rated)
- [ ] Equipment recycling program
- [ ] Extend hardware lifecycle through refurbishment

**Carbon Footprint**:
- Estimated annual carbon: [X] tonnes CO2e
- Reduction target: [X]% by [year]

**Findings**:
[Describe sustainability efforts]

**Gaps**:
[List sustainability opportunities]

**Requirements Mapping**:
- NFR-ENV-xxx: [Environmental requirements]

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

### 13. Meet the Service Standard

**Principle**: Services must comply with the Service Standard requirements.

**Compliance Status**: [ ] COMPLIANT / [ ] PARTIAL / [ ] NON-COMPLIANT

**Evidence**:
- [ ] Service Standard assessment completed
- [ ] All 14 Service Standard points addressed
- [ ] Service meets user needs (point 1)
- [ ] Solves a whole problem (point 2)
- [ ] Joined up services (point 3)
- [ ] Simple to use (point 4)
- [ ] Accessible (point 5)
- [ ] Privacy-preserving (point 6)
- [ ] Clear ownership (point 7)
- [ ] Skilled team (point 8)
- [ ] Multidisciplinary team (point 9)
- [ ] Agile delivery (point 10)
- [ ] Continuous improvement (point 11)
- [ ] Data-driven decisions (point 12)
- [ ] Security and privacy by design (point 13)
- [ ] Defined success metrics (point 14)

**Service Standard Assessment**:
- **Phase**: [ ] Discovery / [ ] Alpha / [ ] Beta / [ ] Live
- **Assessment Date**: [Date]
- **Assessment Result**: [ ] PASS / [ ] PASS with conditions / [ ] FAIL

**Service Standard Points Summary**:
| Point | Title | Status |
|-------|-------|--------|
| 1 | Understand users and their needs | ✅ / ⚠️ / ❌ |
| 2 | Solve a whole problem for users | ✅ / ⚠️ / ❌ |
| 3 | Provide a joined up experience | ✅ / ⚠️ / ❌ |
| ... | ... | ... |

**Findings**:
[Describe Service Standard compliance]

**Gaps**:
[List Service Standard points not yet met]

**Requirements Mapping**:
- All requirements should align with Service Standard

**Remediation** (if non-compliant):
- Action: [What needs to be done]
- Owner: [Who is responsible]
- Due: [Timeline]

**Score**: ___/10

---

## Overall Assessment Summary

### Compliance Scorecard

| TCoP Point | Title | Score /10 | Status |
|------------|-------|-----------|--------|
| 1 | Define User Needs | __ | ✅ / ⚠️ / ❌ |
| 2 | Accessible and Inclusive | __ | ✅ / ⚠️ / ❌ |
| 3 | Open and Open Source | __ | ✅ / ⚠️ / ❌ |
| 4 | Open Standards | __ | ✅ / ⚠️ / ❌ |
| 5 | Cloud First | __ | ✅ / ⚠️ / ❌ |
| 6 | Secure | __ | ✅ / ⚠️ / ❌ |
| 7 | Privacy Integral | __ | ✅ / ⚠️ / ❌ |
| 8 | Share and Reuse | __ | ✅ / ⚠️ / ❌ |
| 9 | Integrate and Adapt | __ | ✅ / ⚠️ / ❌ |
| 10 | Better Use of Data | __ | ✅ / ⚠️ / ❌ |
| 11 | Purchasing Strategy | __ | ✅ / ⚠️ / ❌ |
| 12 | Sustainable | __ | ✅ / ⚠️ / ❌ |
| 13 | Service Standard | __ | ✅ / ⚠️ / ❌ |
| **TOTAL** | | **__/130** | |

**Percentage Score**: ___%

### Compliance Levels

- **90-100%** (117-130 points): Excellent - Fully compliant
- **70-89%** (91-116 points): Good - Compliant with minor gaps
- **50-69%** (65-90 points): Needs improvement - Partially compliant
- **< 50%** (< 65 points): Poor - Non-compliant

### Critical Issues (Blocking)

1. [Issue description]
2. [Issue description]
3. [Issue description]

### Recommendations

#### High Priority (Address within 1 month)

1. [Recommendation]
2. [Recommendation]

#### Medium Priority (Address within 3 months)

1. [Recommendation]
2. [Recommendation]

#### Low Priority (Address within 6 months)

1. [Recommendation]
2. [Recommendation]

---

## Action Plan

| Action | TCoP Point | Owner | Due Date | Status |
|--------|------------|-------|----------|--------|
| [Action item] | [Point #] | [Name] | [Date] | 🔄 / ⏳ / ✅ |

---

## Sign-Off

**Assessed By**: [Name, Role]
**Date**: [Date]
**Next Review**: [Date]

**Senior Responsible Owner Sign-Off**:
Name: ________________
Date: ________________
Signature: ________________

---

## Appendices

### Appendix A: Service Standard Assessment Details
[Link to full Service Standard assessment]

### Appendix B: Security Accreditation
[Link to security risk assessment and accreditation]

### Appendix C: DPIA
[Link to Data Protection Impact Assessment]

### Appendix D: User Research
[Link to user research reports]

### Appendix E: Open Source Components
[Full list of OSS components with licenses]

---

**Template Version**: 1.0
**Last Updated**: 2024-10-14
**Source**: https://www.gov.uk/guidance/the-technology-code-of-practice
---

**Generated by**: ArcKit `/arckit.tcop` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

