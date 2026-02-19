# UK Government Secure by Design Assessment

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.secure`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-SECD-v[VERSION] |
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

## Executive Summary

**Overall Security Posture**: [Strong / Adequate / Needs Improvement / Inadequate]

**NCSC Cyber Assessment Framework (CAF) Score**: [X/14 objectives met]

**Key Security Findings**:
- [Summary of critical security gaps]
- [Summary of security strengths]
- [Blocking security issues for next phase]

**Cyber Essentials Status**: [Not Started / In Progress / Basic / Plus]

**Cyber Security Standard Compliance**: [Compliant / Partially Compliant / Non-Compliant / Not Assessed]

**Risk Summary**: [Overall security risk level: Low / Medium / High / Very High]

---

## 1. NCSC Cyber Assessment Framework (CAF) Assessment

### Objective A: Managing Security Risk

**A1: Governance**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe security governance structure]

**Security Governance**:
- [ ] Senior leadership owns information security
- [ ] Senior Information Risk Owner (SIRO) appointed
- [ ] Security policies and standards defined
- [ ] Security roles and responsibilities documented
- [ ] Security risk management process established
- [ ] Security oversight and reporting in place

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**A2: Risk Management**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe risk management approach]

**Risk Management Process**:
- [ ] Information assets identified and classified
- [ ] Threats and vulnerabilities assessed
- [ ] Risk assessment methodology defined
- [ ] Risk register maintained and reviewed
- [ ] Risk treatment plans implemented
- [ ] Residual risks accepted by SIRO

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**A3: Asset Management**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe asset inventory and management]

**Asset Management**:
- [ ] Hardware inventory maintained
- [ ] Software inventory maintained
- [ ] Data assets catalogued
- [ ] Asset ownership assigned
- [ ] Asset lifecycle management
- [ ] Secure disposal procedures

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**A4: Supply Chain**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe supply chain security]

**Supply Chain Security**:
- [ ] Supplier security requirements defined
- [ ] Supplier security assessments conducted
- [ ] Contracts include security obligations
- [ ] Third-party access controlled
- [ ] Supply chain risk register
- [ ] Open source software risks managed

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

### Objective B: Protecting Against Cyber Attack

**B1: Service Protection Policies and Processes**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe protective security policies]

**Protection Policies**:
- [ ] Acceptable Use Policy
- [ ] Access Control Policy
- [ ] Data Protection Policy
- [ ] Secure Development Policy
- [ ] Network Security Policy
- [ ] Cryptography Policy

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**B2: Identity and Access Control**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe access control implementation]

**Access Controls**:
- [ ] User accounts managed centrally
- [ ] Multi-factor authentication (MFA) enabled
- [ ] Privileged access management (PAM)
- [ ] Least privilege principle enforced
- [ ] Regular access reviews
- [ ] Account provisioning/deprovisioning process
- [ ] Strong password policy (12+ characters)

**Authentication Method**: [GOV.UK Verify / Azure AD / Other]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**B3: Data Security**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe data protection measures]

**Data Protection**:
- [ ] Data classification scheme implemented
- [ ] Encryption at rest (AES-256 minimum)
- [ ] Encryption in transit (TLS 1.3 minimum)
- [ ] Data loss prevention (DLP) controls
- [ ] Secure data destruction
- [ ] UK GDPR compliance
- [ ] Data retention policy

**Personal Data Processing**: [Yes / No]
**DPIA Completed**: [Yes / No / N/A]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**B4: System Security**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe system hardening and security]

**System Hardening**:
- [ ] Secure baseline configurations
- [ ] Unnecessary services disabled
- [ ] Security patches applied timely
- [ ] Anti-malware deployed
- [ ] Application whitelisting (where appropriate)
- [ ] Host-based firewalls
- [ ] Endpoint Detection and Response (EDR)

**Operating Systems**: [Windows / Linux / macOS / Mixed]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**B5: Resilient Networks**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe network architecture and security]

**Network Security**:
- [ ] Network segmentation by function/sensitivity
- [ ] Firewalls at network boundaries
- [ ] Intrusion Detection/Prevention Systems (IDS/IPS)
- [ ] DDoS protection
- [ ] Secure remote access (VPN)
- [ ] Network Access Control (NAC)
- [ ] WiFi security (WPA3)

**Network Architecture**: [On-premise / Cloud / Hybrid]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**B6: Staff Awareness and Training**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe security awareness program]

**Security Training**:
- [ ] Mandatory security awareness training
- [ ] Phishing awareness training
- [ ] Role-based security training
- [ ] Annual security refresher
- [ ] Security incident reporting awareness
- [ ] Data protection training (UK GDPR)
- [ ] Social engineering awareness

**Training Completion Rate**: [X%]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

### Objective C: Detecting Cyber Security Events

**C1: Security Monitoring**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe monitoring capabilities]

**Monitoring Capabilities**:
- [ ] Centralized logging (SIEM)
- [ ] Real-time security alerting
- [ ] Log retention (minimum 12 months)
- [ ] Security event correlation
- [ ] User behavior analytics
- [ ] Threat intelligence integration
- [ ] File integrity monitoring

**SIEM Solution**: [Splunk / Sentinel / ELK / Other / None]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**C2: Proactive Security Event Discovery**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe proactive threat hunting]

**Proactive Measures**:
- [ ] Threat hunting activities
- [ ] Vulnerability scanning (weekly/monthly)
- [ ] Penetration testing (annual minimum)
- [ ] Red team exercises
- [ ] Security posture reviews
- [ ] Threat modeling

**Last Penetration Test**: [Date / Not Conducted]
**Pen Test Findings**: [Critical: X, High: Y, Medium: Z, Low: W]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

### Objective D: Minimising the Impact of Cyber Security Incidents

**D1: Response and Recovery Planning**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe incident response and recovery plans]

**Incident Response**:
- [ ] Incident response plan documented
- [ ] Incident response team defined
- [ ] Incident classification scheme
- [ ] Escalation procedures defined
- [ ] Communication plan for incidents
- [ ] Regulatory reporting process (ICO)
- [ ] Lessons learned process

**IR Plan Last Tested**: [Date / Not Tested]

**Business Continuity**:
- [ ] Business continuity plan (BCP)
- [ ] Disaster recovery plan (DRP)
- [ ] Recovery time objective (RTO) defined
- [ ] Recovery point objective (RPO) defined
- [ ] BC/DR testing conducted

**RTO**: [X hours]
**RPO**: [X hours]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

**D2: Improvements**

**Status**: [✅ Achieved | ⚠️ Partially Achieved | ❌ Not Achieved | N/A]

**Evidence**:
[Describe continuous improvement process]

**Continuous Improvement**:
- [ ] Post-incident reviews conducted
- [ ] Security metrics tracked
- [ ] Security improvements implemented
- [ ] Lessons learned documented
- [ ] Security trends analyzed
- [ ] Security roadmap maintained

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 2. Cyber Essentials / Cyber Essentials Plus

### Cyber Essentials Status

**Current Status**: [Not Started / In Progress / Certified Basic / Certified Plus]

**Certification Date**: [Date / N/A]
**Expiry Date**: [Date / N/A]

**Cyber Essentials Requirements**:

| Control Area | Status | Evidence |
|--------------|--------|----------|
| **Firewalls** | [✅/⚠️/❌] | [Description] |
| **Secure Configuration** | [✅/⚠️/❌] | [Description] |
| **Access Control** | [✅/⚠️/❌] | [Description] |
| **Malware Protection** | [✅/⚠️/❌] | [Description] |
| **Patch Management** | [✅/⚠️/❌] | [Description] |

**Cyber Essentials Plus Additional Requirements**:
- [ ] External vulnerability scan passed
- [ ] Internal vulnerability scan passed
- [ ] System configuration review passed

**Target Certification Level**: [Basic / Plus]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 3. UK GDPR and Data Protection

### 3.1 Data Protection Compliance

**Data Protection Officer (DPO) Appointed**: [Yes / No / Not Required]

**ICO Registration**: [Required / Not Required / Completed]

**UK GDPR Compliance**:
- [ ] Lawful basis for processing identified
- [ ] Privacy notice published
- [ ] Data subject rights procedures
- [ ] Data retention policy defined
- [ ] Data breach notification process (72 hours)
- [ ] Data processing agreements with suppliers
- [ ] Records of processing activities (ROPA)

**Personal Data Processed**: [Yes / No]

**Special Category Data**: [Yes / No]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 3.2 Data Protection Impact Assessment (DPIA)

**DPIA Required**: [Yes / No]

**DPIA Status**: [Completed / In Progress / Not Started / N/A]

**DPIA Findings**:
- High risks identified: [Number]
- Mitigations implemented: [Number]
- Residual risks accepted: [Yes/No by whom]

**ICO Consultation Required**: [Yes / No]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 4. Secure Development Practices

### 4.1 Secure Software Development Lifecycle (SDLC)

**Development Methodology**: [Agile / Waterfall / DevOps]

**Secure Development Practices**:
- [ ] Secure coding standards defined
- [ ] Security requirements in user stories
- [ ] Threat modeling in design phase
- [ ] Code review includes security
- [ ] Static Application Security Testing (SAST)
- [ ] Dynamic Application Security Testing (DAST)
- [ ] Software Composition Analysis (SCA)
- [ ] Dependency vulnerability scanning

**OWASP Top 10 Mitigation**:
- [ ] Injection flaws prevented
- [ ] Broken authentication prevented
- [ ] Sensitive data exposure prevented
- [ ] XML External Entities (XXE) prevented
- [ ] Broken access control prevented
- [ ] Security misconfiguration prevented
- [ ] Cross-Site Scripting (XSS) prevented
- [ ] Insecure deserialization prevented
- [ ] Using components with known vulnerabilities prevented
- [ ] Insufficient logging and monitoring addressed

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 4.2 DevSecOps

**CI/CD Security Integration**:
- [ ] Automated security testing in pipeline
- [ ] Secrets scanning (no hardcoded credentials)
- [ ] Container image scanning
- [ ] Infrastructure as Code (IaC) security
- [ ] Build artifact signing
- [ ] Automated deployment security checks

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 5. Cloud Security (if applicable)

### 5.1 Cloud Service Provider

**Cloud Provider**: [AWS / Azure / GCP / GOV.UK PaaS / Other / N/A]

**Cloud Deployment Model**: [Public / Private / Hybrid / N/A]

**Data Residency**: [UK / EU / Other]

**Cloud Security Controls**:
- [ ] Cloud Security Posture Management (CSPM)
- [ ] Identity and Access Management (IAM)
- [ ] Encryption key management
- [ ] Network security groups
- [ ] Cloud Access Security Broker (CASB)
- [ ] Cloud security monitoring
- [ ] Multi-region redundancy

**NCSC Cloud Security Principles**: [X/14 principles met]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 6. Vulnerability and Patch Management

### 6.1 Vulnerability Management

**Vulnerability Scanning Frequency**: [Daily / Weekly / Monthly]

**Scanning Coverage**: [X% of assets]

**Vulnerability Management Process**:
- [ ] Automated vulnerability scanning
- [ ] Vulnerability prioritization (CVSS scores)
- [ ] Remediation SLAs defined
- [ ] Exception process for unfixable vulnerabilities
- [ ] Vulnerability remediation tracking
- [ ] Metrics and reporting

**Remediation SLAs**:
- Critical vulnerabilities: [Within X days]
- High vulnerabilities: [Within X days]
- Medium vulnerabilities: [Within X days]
- Low vulnerabilities: [Within X days]

**Current Vulnerability Status**:
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 6.2 Patch Management

**Patch Management Process**:
- [ ] Patch assessment and testing
- [ ] Patch deployment schedule
- [ ] Emergency patching process
- [ ] Patch compliance monitoring
- [ ] Rollback procedures

**Patch Compliance**: [X% of systems patched]

**Critical Patch SLA**: [Within 14 days]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 7. Third-Party and Supply Chain Risk

### 7.1 Third-Party Risk Management

**Third-Party Security Assessment**:
- [ ] Vendor security questionnaires
- [ ] Vendor security certifications verified
- [ ] Data Processing Agreements (DPAs) in place
- [ ] Third-party access controls
- [ ] Vendor risk register
- [ ] Ongoing vendor monitoring

**Key Third Parties**:

| Vendor | Service | Security Rating | Risk Level | Mitigations |
|--------|---------|-----------------|------------|-------------|
| [Vendor 1] | [Service] | [High/Med/Low] | [H/M/L] | [Controls] |
| [Vendor 2] | [Service] | [High/Med/Low] | [H/M/L] | [Controls] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 7.2 Open Source Security

**Open Source Components**: [Number]

**OSS Security Controls**:
- [ ] Software Bill of Materials (SBOM)
- [ ] Automated dependency scanning
- [ ] Known vulnerability detection (CVE)
- [ ] License compliance checks
- [ ] OSS component lifecycle management

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 8. Backup and Recovery

### 8.1 Backup Strategy

**Backup Method**: [3-2-1 rule / Continuous replication / Snapshot / Other]

**Backup Controls**:
- [ ] Automated backups scheduled
- [ ] Backup encryption enabled
- [ ] Offsite/cloud backups
- [ ] Immutable backups (ransomware protection)
- [ ] Backup integrity testing
- [ ] Backup restoration testing

**Backup Frequency**: [Continuous / Hourly / Daily / Weekly]

**Backup Retention**: [X days/months/years]

**Last Successful Backup**: [Date/time]

**Last Restoration Test**: [Date]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 8.2 Recovery Capabilities

**Recovery Time Objective (RTO)**: [X hours]
**Recovery Point Objective (RPO)**: [X hours]

**Recovery Testing**: [Last tested: Date]

**Recovery Success Rate**: [X%]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 9. UK Government Cyber Security Standard Compliance

> The [UK Government Cyber Security Standard](https://www.gov.uk/government/publications/government-cyber-security-standard) (July 2025, Cabinet Office) mandates CAF Baseline/Enhanced profiles, GovAssure assurance for critical systems, and Secure by Design high-confidence profiles. This section tracks compliance with those mandatory requirements beyond the CAF assessment above.

### 9.1 GovAssure Status

**GovAssure Cycle Year**: [YYYY / N/A]

**Scope**: [Description of critical systems in scope for GovAssure assessment]

| System | GovAssure Status | Assessment Date | Findings Summary | Remediation Status |
|--------|-----------------|-----------------|------------------|--------------------|
| [System 1] | [Planned / In Progress / Complete] | [Date / N/A] | [Summary] | [Open / In Progress / Closed] |
| [System 2] | [Planned / In Progress / Complete] | [Date / N/A] | [Summary] | [Open / In Progress / Closed] |

**Assessment Findings**:
- [Key finding 1]
- [Key finding 2]

**Remediation Actions**:
- [ ] [Action 1 - Owner - Due date]
- [ ] [Action 2 - Owner - Due date]

> Reference: [NCSC GovAssure guidance](https://www.ncsc.gov.uk/collection/govassure)

### 9.2 Secure by Design Confidence Rating

**Confidence Level**: [Low / Medium / High]

**Secure by Design Principles Checklist**:

| SbD Principle | Status | Evidence |
|---------------|--------|----------|
| **Secure Development** | [✅/⚠️/❌] | [Description] |
| **Secure Deployment** | [✅/⚠️/❌] | [Description] |
| **Secure Operation** | [✅/⚠️/❌] | [Description] |

**High-Confidence Profile Achievement**:
- [ ] Security is embedded throughout the development lifecycle
- [ ] Threat modelling conducted and reviewed regularly
- [ ] Security testing integrated into CI/CD pipelines
- [ ] Incident response capabilities tested and proven
- [ ] Continuous monitoring and improvement demonstrated

**Gap Analysis**:

| Gap | Impact | Improvement Action | Owner | Target Date |
|-----|--------|--------------------|-------|-------------|
| [Gap 1] | [High/Med/Low] | [Action] | [Owner] | [Date] |
| [Gap 2] | [High/Med/Low] | [Action] | [Owner] | [Date] |

### 9.3 Cyber Security Standard Exception Register

> Per CSS clauses 4.3/4.4, departments must formally record and manage exceptions where full compliance cannot be achieved.

| Exception ID | Description | CSS Clause | Risk Assessment | Mitigation in Place | Approval Authority | Review Date | Improvement Plan |
|-------------|-------------|------------|-----------------|---------------------|--------------------|-------------|------------------|
| CSS-EXC-001 | [Description] | [Clause ref] | [High/Med/Low] | [Mitigation] | [Authority] | [Date] | [Plan] |
| CSS-EXC-002 | [Description] | [Clause ref] | [High/Med/Low] | [Mitigation] | [Authority] | [Date] | [Plan] |

**Total Exceptions**: [Number]
**Exceptions Under Active Improvement Plan**: [Number]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 10. GovS 007: Security — Alignment Summary

> [Government Functional Standard GovS 007: Security](https://www.gov.uk/government/publications/government-functional-standard-govs-007-security) is the cross-government protective security standard. The table below maps its nine principles to evidence captured elsewhere in this assessment and related ArcKit artefacts.

| GovS 007 Principle | Evidence / ArcKit Artefact | Status |
|---------------------|---------------------------|--------|
| 1. Governance aligned to organisational purpose | Section 1 (CAF A1 Governance), SIRO sign-off | [✅/⚠️/❌] |
| 2. Risk-based approach to protective security | Section 1 (CAF A2 Risk Management), `/arckit:risk` | [✅/⚠️/❌] |
| 3. Security integrated into all activities | Sections 4–5 (Secure Development, Cloud Security) | [✅/⚠️/❌] |
| 4. Holistic security planning across disciplines | Sections 1–8 (CAF full assessment), `/arckit:plan` | [✅/⚠️/❌] |
| 5. Security culture embedded in organisation | Section 1 (CAF B6 Staff Awareness) | [✅/⚠️/❌] |
| 6. Accountability at all levels | Approval & Sign-Off (SSRO, DSO, SIRO roles) | [✅/⚠️/❌] |
| 7. Proportionate security measures | Executive Summary (data classification → controls) | [✅/⚠️/❌] |
| 8. Continuous improvement of security posture | Section 1 (CAF D2 Improvements), `/arckit:operationalize` | [✅/⚠️/❌] |
| 9. Compliance with legal/regulatory obligations | Section 3 (UK GDPR), `/arckit:dpia` | [✅/⚠️/❌] |

### Security Roles (GovS 007)

| Role | Name | Responsibility |
|------|------|---------------|
| Accounting Officer | [Name] | Overall accountability for security of the organisation |
| Senior Security Risk Owner (SSRO) | [Name] | Owns protective security risk at board level |
| Departmental Security Officer (DSO) | [Name] | Day-to-day security coordination and policy implementation |
| Senior Information Risk Owner (SIRO) | [Name] | Owns information and cyber security risk |

---

## Overall Security Assessment Summary

### NCSC CAF Scorecard

| CAF Objective | Principles Achieved | Status |
|---------------|---------------------|--------|
| A. Managing Security Risk | [X/4] | [✅/⚠️/❌] |
| B. Protecting Against Cyber Attack | [X/6] | [✅/⚠️/❌] |
| C. Detecting Cyber Security Events | [X/2] | [✅/⚠️/❌] |
| D. Minimising Impact of Incidents | [X/2] | [✅/⚠️/❌] |
| **Overall** | **[X/14]** | **[Overall status]** |

### Security Posture Summary

**Strengths**:
- [Strength 1]
- [Strength 2]

**Critical Gaps**:
- [Gap 1 - blocks progression to next phase]
- [Gap 2 - unacceptable risk level]

**Overall Risk Rating**: [Low / Medium / High / Very High]

### Critical Security Issues

1. [Issue 1 with CAF reference] - **CRITICAL** - [Impact]
2. [Issue 2 with CAF reference] - **HIGH** - [Impact]
3. [Issue 3 with CAF reference] - **HIGH** - [Impact]

### Recommendations

**Critical Priority** (0-30 days - must resolve before next phase):
- [Recommendation 1 - Owner - Due date]
- [Recommendation 2 - Owner - Due date]

**High Priority** (1-3 months - significant risk reduction):
- [Recommendation 1 - Owner - Due date]
- [Recommendation 2 - Owner - Due date]

**Medium Priority** (3-6 months - continuous improvement):
- [Recommendation 1 - Owner - Due date]
- [Recommendation 2 - Owner - Due date]

---

## Next Steps and Action Plan

**Immediate Actions** (0-30 days):
- [ ] [Action 1 - Owner - Due date]
- [ ] [Action 2 - Owner - Due date]

**Short-term Actions** (1-3 months):
- [ ] [Action 1 - Owner - Due date]
- [ ] [Action 2 - Owner - Due date]

**Long-term Actions** (3-12 months):
- [ ] [Action 1 - Owner - Due date]
- [ ] [Action 2 - Owner - Due date]

**Next Security Review**: [Date - recommend quarterly during development, annually in Live]

---

## Approval and Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Lead | [Name] | | |
| Security Architect | [Name] | | |
| Senior Security Risk Owner (SSRO) | [Name] | | |
| Departmental Security Officer (DSO) | [Name] | | |
| Senior Information Risk Owner (SIRO) | [Name] | | |
| Data Protection Officer (DPO) | [Name] | | |

---

**Document Control**:
- **Version**: 1.0
- **Classification**: [OFFICIAL / OFFICIAL-SENSITIVE]
- **Last Reviewed**: [Date]
- **Next Review**: [Date - recommend quarterly]
- **Document Owner**: [Name/Role]

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| Government Functional Standard GovS 007: Security | Policy | Cabinet Office | 9 security principles, security lifecycle, protective security disciplines | https://www.gov.uk/government/publications/government-functional-standard-govs-007-security |
| UK Government Cyber Security Standard | Policy | Cabinet Office (July 2025) | CAF profiles, GovAssure, SbD confidence, exception management | https://www.gov.uk/government/publications/government-cyber-security-standard |
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.secure` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]