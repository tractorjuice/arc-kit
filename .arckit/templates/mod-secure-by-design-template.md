# MOD Secure by Design Assessment

> **Template Status**: Experimental | **Version**: [VERSION] | **Command**: `/arckit.mod-secure`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-SECD-MOD-v[VERSION] |
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

**Key Security Findings**:
- [Summary of critical security gaps]
- [Summary of security strengths]
- [Blocking security issues]

**Accreditation Status**: [Not Started / In Progress / Accredited / Conditional Accreditation]

**Risk Summary**: [Overall security risk level: Low / Medium / High / Very High]

---

## 1. Security Classification and Data Handling

### 1.1 Information Classification

**Highest Data Classification**: [OFFICIAL / OFFICIAL-SENSITIVE / SECRET / TOP SECRET]

**Classification Justification**:
[Explain why this classification level is required]

**Data Types Processed**:
- [ ] Personal data (UK GDPR)
- [ ] Special category data (biometric, health, etc.)
- [ ] Classified military information
- [ ] Operational data
- [ ] Intelligence data
- [ ] Cryptographic material
- [ ] Protectively marked documents

**Data Classification Matrix**:

| Data Type | Classification | Volume | Storage Location | Access Controls |
|-----------|---------------|---------|------------------|-----------------|
| [e.g., Personnel records] | OFFICIAL-SENSITIVE | [High/Med/Low] | [Location] | [RBAC/MFA/etc] |
| [e.g., Operational plans] | SECRET | [High/Med/Low] | [Location] | [RBAC/MFA/etc] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 2. MOD Security Principles Compliance

### 2.1 Defence in Depth

**Principle**: Multiple layers of security controls so that if one fails, others continue to protect.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe layered security controls implemented]

**Security Layers Implemented**:
- [ ] Physical security (data center, building access)
- [ ] Network security (firewalls, segmentation, IDS/IPS)
- [ ] Host security (hardened OS, endpoint protection)
- [ ] Application security (WAF, input validation, secure coding)
- [ ] Data security (encryption at rest and in transit)
- [ ] Identity security (MFA, privileged access management)
- [ ] Monitoring and detection (SIEM, SOC)

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 2.2 Secure by Default

**Principle**: Systems are secure out-of-the-box with minimal configuration required.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe default security configurations]

**Default Security Configurations**:
- [ ] Strong authentication required by default
- [ ] Encryption enabled by default
- [ ] Least privilege access model
- [ ] Secure protocols only (TLS 1.3, SSH v2)
- [ ] Security headers configured
- [ ] Default accounts disabled/removed
- [ ] Logging enabled by default

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 2.3 Least Privilege

**Principle**: Users and systems have only the minimum access required to perform their functions.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe access control implementation]

**Access Controls**:
- [ ] Role-Based Access Control (RBAC) implemented
- [ ] Principle of least privilege enforced
- [ ] Privileged access management (PAM) in place
- [ ] Just-in-time (JIT) access for elevated privileges
- [ ] Regular access reviews conducted
- [ ] Separation of duties enforced

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 2.4 Assume Breach

**Principle**: Design and operate as if compromise has already occurred.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe breach detection and response capabilities]

**Breach Readiness**:
- [ ] Security monitoring and alerting
- [ ] Incident response plan documented and tested
- [ ] Forensic capabilities available
- [ ] Network segmentation to limit blast radius
- [ ] Zero-trust architecture principles applied
- [ ] Regular red team/penetration testing

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 3. MOD Accreditation Requirements

### 3.1 Security Accreditation Status

**Accreditation Authority**: [JSP 440 / NCSC / Defence Digital]

**Accreditation Type**: [Full Accreditation / Interim Accreditation / Risk Managed Accreditation]

**Accreditation Progress**:
- [ ] Business Impact Assessment (BIA) completed
- [ ] Risk Management and Accreditation Documentation Set (RMADS) initiated
- [ ] Security Aspects Letter (SAL) issued
- [ ] Accreditation Service engaged
- [ ] Risk assessment completed
- [ ] Security controls documented
- [ ] Residual risks accepted by IAO/IAA
- [ ] Accreditation granted

**Information Assurance Owner (IAO)**: [Name/Role]
**Information Assurance Architect (IAA)**: [Name/Role]

**Target Accreditation Date**: [Date]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 3.2 JSP 440 Compliance

**JSP 440**: Defence Information Assurance Maturity Model (IAMM)

**IAMM Level Target**: [Level 0-5]

**IAMM Assessment**:

| Domain | Current Level | Target Level | Gap |
|--------|---------------|--------------|-----|
| Information Risk Management | [0-5] | [0-5] | [Gap description] |
| Secure Configuration | [0-5] | [0-5] | [Gap description] |
| Network Security | [0-5] | [0-5] | [Gap description] |
| Access Control | [0-5] | [0-5] | [Gap description] |
| Malware Protection | [0-5] | [0-5] | [Gap description] |
| Patch Management | [0-5] | [0-5] | [Gap description] |
| Security Monitoring | [0-5] | [0-5] | [Gap description] |
| Incident Management | [0-5] | [0-5] | [Gap description] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 4. Threat Modeling and Risk Assessment

### 4.1 Threat Model

**Threat Modeling Method**: [STRIDE / PASTA / Attack Trees / Other]

**Threat Model Completed**: [Yes / No / In Progress]

**Identified Threat Actors**:
- [ ] Nation state actors
- [ ] Terrorist organizations
- [ ] Organized crime
- [ ] Hacktivists
- [ ] Insider threats
- [ ] Supply chain threats

**Key Threats Identified**:

| Threat | Likelihood | Impact | Risk Level | Mitigation |
|--------|------------|--------|------------|------------|
| [e.g., Data exfiltration] | [H/M/L] | [H/M/L] | [Critical/High/Med/Low] | [Control description] |
| [e.g., Ransomware] | [H/M/L] | [H/M/L] | [Critical/High/Med/Low] | [Control description] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 4.2 Security Risk Assessment

**Risk Assessment Method**: [HMG Information Assurance Standard No. 1 & 2 / ISO 27005 / Other]

**Risk Register Maintained**: [Yes / No]

**Critical/High Risks**:

| Risk ID | Risk Description | Likelihood | Impact | Risk Level | Owner | Mitigation Plan |
|---------|------------------|------------|--------|------------|-------|-----------------|
| [R-001] | [Description] | [H/M/L] | [H/M/L] | [C/H/M/L] | [Name] | [Plan] |
| [R-002] | [Description] | [H/M/L] | [H/M/L] | [C/H/M/L] | [Name] | [Plan] |

**Residual Risks**: [Number of risks accepted by IAO/IAA]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 5. Technical Security Controls

### 5.1 Cryptography

**Cryptographic Standards**: [CESG / NCSC approved algorithms]

**Encryption Implementation**:
- [ ] Data at rest encrypted (AES-256 minimum)
- [ ] Data in transit encrypted (TLS 1.3 minimum)
- [ ] Database encryption enabled
- [ ] Backup encryption enabled
- [ ] Key management system implemented
- [ ] CESG-approved cryptography used for classified data
- [ ] Crypto key lifecycle managed

**Key Management**:
- Key storage: [HSM / Cloud KMS / Other]
- Key rotation frequency: [e.g., 90 days]
- Key backup and recovery: [Yes / No]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 5.2 Authentication and Identity

**Authentication Method**: [Smart card / Biometric / MFA / SSO]

**Identity Provider**: [MOD Active Directory / Azure AD / Other]

**Authentication Controls**:
- [ ] Multi-factor authentication (MFA) enforced
- [ ] Password complexity requirements (12+ chars, complexity)
- [ ] Smart card (CAC/PIV) authentication for classified systems
- [ ] Session timeout configured
- [ ] Account lockout after failed attempts
- [ ] Single Sign-On (SSO) where appropriate
- [ ] Privileged access management (PAM)

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 5.3 Network Security

**Network Architecture**: [Segmented / Flat / DMZ / Zero Trust]

**Network Security Controls**:
- [ ] Network segmentation by security zone
- [ ] Firewalls at zone boundaries
- [ ] Intrusion Detection/Prevention Systems (IDS/IPS)
- [ ] DDoS protection
- [ ] Web Application Firewall (WAF)
- [ ] VPN for remote access
- [ ] Network Access Control (NAC)
- [ ] Air-gapped for SECRET and above (if applicable)

**Network Zones**:
- [ ] Public zone (internet-facing)
- [ ] DMZ (semi-trusted)
- [ ] Internal zone (trusted)
- [ ] Management zone (privileged access)
- [ ] Classified zone (SECRET and above)

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 5.4 Vulnerability Management

**Vulnerability Scanning**: [Frequency: Weekly / Monthly / Continuous]

**Scanning Tools**: [Nessus / Qualys / Rapid7 / Other]

**Vulnerability Management Process**:
- [ ] Automated vulnerability scanning
- [ ] Manual penetration testing (annual minimum)
- [ ] Patch management process defined
- [ ] Critical patches applied within 14 days
- [ ] High severity patches applied within 30 days
- [ ] Vulnerability remediation tracking
- [ ] Exception process for unfixable vulnerabilities

**Recent Penetration Test**: [Date / Not Yet Conducted]
**Penetration Test Findings**: [Critical: X, High: Y, Medium: Z]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 5.5 Security Monitoring and Logging

**Security Operations Center (SOC)**: [24/7 MOD SOC / 3rd party / None]

**SIEM Solution**: [Splunk / ArcSight / Sentinel / Other]

**Logging and Monitoring**:
- [ ] Centralized log collection (SIEM)
- [ ] Real-time security alerting
- [ ] Log retention (minimum 12 months)
- [ ] Security event correlation
- [ ] User behavior analytics (UBA)
- [ ] Automated incident response playbooks
- [ ] Integration with MOD Cyber Defence Operations

**Security Alerts**:
- Failed authentication attempts: [Monitored / Not monitored]
- Privilege escalation: [Monitored / Not monitored]
- Data exfiltration attempts: [Monitored / Not monitored]
- Malware detection: [Monitored / Not monitored]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 6. Secure Development Lifecycle

### 6.1 Secure Coding Practices

**Secure Coding Standards**: [OWASP / CERT / MOD Secure Coding Guidelines]

**Secure Development Practices**:
- [ ] Secure coding training for developers
- [ ] Code review process includes security review
- [ ] Static Application Security Testing (SAST)
- [ ] Dynamic Application Security Testing (DAST)
- [ ] Software Composition Analysis (SCA) for dependencies
- [ ] Threat modeling during design phase
- [ ] Security testing in CI/CD pipeline

**OWASP Top 10 Mitigation**:
- [ ] Injection flaws prevented (SQLi, XSS, etc.)
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

### 6.2 DevSecOps Integration

**CI/CD Security Gates**:
- [ ] Automated security scanning in pipeline
- [ ] Secrets scanning (no hardcoded credentials)
- [ ] Dependency vulnerability scanning
- [ ] Container image scanning
- [ ] Infrastructure as Code (IaC) security scanning
- [ ] Build artifact signing and verification

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 7. Supply Chain Security

### 7.1 Third-Party Risk Management

**Vendor Security Assessment**:
- [ ] Vendor security questionnaires completed
- [ ] Vendor security certifications verified (ISO 27001, Cyber Essentials+)
- [ ] Vendor access controls defined and enforced
- [ ] Third-party code review conducted
- [ ] Supply chain risk assessment completed

**Third-Party Components**:

| Component | Vendor | Security Rating | Risk Level | Mitigations |
|-----------|--------|-----------------|------------|-------------|
| [e.g., Cloud provider] | [Vendor] | [High/Med/Low] | [H/M/L] | [Controls] |
| [e.g., Software library] | [Vendor] | [High/Med/Low] | [H/M/L] | [Controls] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 7.2 Open Source Software Security

**Open Source Components**: [Number of OSS dependencies]

**OSS Security Controls**:
- [ ] Software Bill of Materials (SBOM) generated
- [ ] Known vulnerabilities scanned (CVE database)
- [ ] License compliance verified
- [ ] OSS component lifecycle managed
- [ ] Alternative components evaluated for high-risk OSS

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 8. Operational Security

### 8.1 Backup and Recovery

**Backup Strategy**: [3-2-1 rule / Continuous replication / Other]

**Backup Controls**:
- [ ] Regular backups scheduled (RPO: [X hours])
- [ ] Backup encryption enabled
- [ ] Offsite/offline backups stored
- [ ] Backup restoration tested (RTO: [X hours])
- [ ] Backup integrity verified
- [ ] Immutable backups for ransomware protection

**Recovery Time Objective (RTO)**: [X hours]
**Recovery Point Objective (RPO)**: [X hours]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 8.2 Incident Response

**Incident Response Plan**: [Documented / In Development / Not Started]

**Incident Response Team**: [24/7 / Business Hours / Ad-hoc]

**Incident Response Capabilities**:
- [ ] Incident response plan documented and tested
- [ ] Incident response team trained
- [ ] Incident detection capabilities
- [ ] Forensic investigation capabilities
- [ ] Communication plan for incidents
- [ ] Regulatory reporting process (MOD, NCSC, ICO)
- [ ] Lessons learned process

**Recent Incident Response Exercise**: [Date / Not Conducted]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 8.3 Disaster Recovery and Business Continuity

**Disaster Recovery Plan**: [Documented / In Development / Not Started]

**Business Continuity Plan**: [Documented / In Development / Not Started]

**DR/BC Capabilities**:
- [ ] DR plan documented and tested
- [ ] Alternative processing site identified
- [ ] Critical system identification completed
- [ ] Failover procedures documented
- [ ] Regular DR testing conducted
- [ ] Business impact analysis (BIA) completed

**Last DR Test**: [Date / Not Conducted]
**DR Test Results**: [Successful / Issues identified]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 9. Personnel Security

### 9.1 Security Clearances

**Clearance Levels Required**:

| Role | Clearance Level | Current Clearance Status |
|------|-----------------|-------------------------|
| [System Administrator] | [SC / DV / eDV] | [Active / Pending / Expired] |
| [Developer] | [SC / DV / eDV] | [Active / Pending / Expired] |
| [End User] | [BPSS / SC / DV] | [Active / Pending / Expired] |

**Security Vetting Compliance**:
- [ ] All personnel appropriately vetted
- [ ] Clearance levels match data classification
- [ ] Clearance renewal process managed
- [ ] Foreign nationals risk assessed
- [ ] Contractor clearances verified

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 9.2 Security Awareness

**Security Training**:
- [ ] Mandatory security awareness training completed
- [ ] Role-based security training provided
- [ ] Phishing awareness training
- [ ] Insider threat awareness
- [ ] Data handling and classification training
- [ ] Annual security refresher training

**Training Completion Rate**: [X%]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## 10. Compliance and Governance

### 10.1 Regulatory Compliance

**Applicable Regulations**:
- [ ] UK GDPR and Data Protection Act 2018
- [ ] Official Secrets Act
- [ ] Defence Reform Act
- [ ] Network and Information Systems (NIS) Regulations
- [ ] MOD JSP 440 (Defence IA Policy)
- [ ] NCSC Cyber Assessment Framework (CAF)

**Compliance Status**:

| Regulation | Compliance Status | Last Assessment | Next Assessment |
|------------|------------------|-----------------|-----------------|
| [UK GDPR] | [Compliant / Partial / Non-Compliant] | [Date] | [Date] |
| [JSP 440] | [Compliant / Partial / Non-Compliant] | [Date] | [Date] |

**Gaps/Actions**:
- [Action 1]
- [Action 2]

### 10.2 Security Policies and Procedures

**Security Documentation**:
- [ ] Information Security Policy
- [ ] Acceptable Use Policy
- [ ] Access Control Policy
- [ ] Incident Response Procedure
- [ ] Business Continuity Plan
- [ ] Disaster Recovery Plan
- [ ] Change Management Procedure
- [ ] Data Classification and Handling Guide

**Documentation Review Frequency**: [Annual / Biennial]
**Last Documentation Review**: [Date]

**Gaps/Actions**:
- [Action 1]
- [Action 2]

---

## Overall Security Assessment Summary

### Security Scorecard

| Security Domain | Status | Critical Issues | Priority |
|-----------------|--------|-----------------|----------|
| Data Classification | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Defence in Depth | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Secure by Default | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Least Privilege | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Assume Breach | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Accreditation | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Threat Modeling | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Cryptography | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Authentication | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Network Security | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Vulnerability Management | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Security Monitoring | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Secure Development | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Supply Chain Security | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Backup and Recovery | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Incident Response | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Personnel Security | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Compliance | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |

### Critical Security Issues Requiring Immediate Action

1. [Issue 1 with domain reference - must be resolved before accreditation]
2. [Issue 2 with domain reference - blocks progression to next phase]
3. [Issue 3 with domain reference - unacceptable risk level]

### Recommendations

**Critical Priority** (0-30 days):
- [Recommendation 1]
- [Recommendation 2]

**High Priority** (1-3 months):
- [Recommendation 1]
- [Recommendation 2]

**Medium Priority** (3-6 months):
- [Recommendation 1]
- [Recommendation 2]

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

**Next Assessment Date**: [Date - recommend quarterly during development, annually in Live]

---

## Approval and Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Project Lead | [Name] | | |
| Security Architect | [Name] | | |
| Information Assurance Owner (IAO) | [Name] | | |
| Information Assurance Architect (IAA) | [Name] | | |
| Senior Information Risk Owner (SIRO) | [Name] | | |

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
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.secure` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]