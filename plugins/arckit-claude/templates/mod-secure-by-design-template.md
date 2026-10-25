# MOD Secure by Design Assessment

> **Template Origin**: Official | **ArcKit Version**: [VERSION] | **Command**: `/arckit:mod-secure`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

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

**Continuous Assurance Status**: [Not Started / In Progress / Current / Review Overdue]

**Risk Summary**: [Overall security risk level: Low / Medium / High / Very High]

---

## 1. Security Classification and Data Handling

### 1.1 Information Classification

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe how classification was determined and confirmed (e.g., by the IAO), citing source documents]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 2. MOD Secure by Design Principles Compliance

> The seven principles as MOD publishes them at [digital.mod.uk](https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design). [ISN 2023/09](https://assets.publishing.service.gov.uk/media/64bfb929d4051a00145a9289/ISN_2023-09_Secure_by_Design_Requirements.pdf) sets out the requirements for each; it names Principle 7 "Enable Through Life Management".

### 2.1 Understand and Define Context

**Principle**: Understand what the capability does, how it will use and manage MOD data, and how it achieves its primary business or operational outcome.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the documented context, risk appetite, initial cyber risk assessment and CAAT registration, citing source documents]

**Context Checks**:

- [ ] Context, purpose and mode of operation documented (use, users and operators, support, data access, storage and processing, role of suppliers, end-to-end operation and interdependencies)
- [ ] Data classification determined (see Section 1)
- [ ] Operational environment understood
- [ ] Stakeholder security requirements captured
- [ ] Capability risk appetite defined and published by the SRO
- [ ] Initial cyber security risk assessment completed and documented
- [ ] Capability registered on the Cyber Activity and Assurance Tracker (CAAT)

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.2 Plan the Security Activities

**Principle**: Plan the right security activities from the start, including assessment of cyber threat and potential risks.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the security plan, Delivery Team Security Lead appointment and threat assessment]

**Planning Checks**:

- [ ] Delivery Team Security Lead appointed and funded, with suitably qualified and experienced (SQEP) security support
- [ ] Security requirements defined in the initial specifications, with validation and verification planned
- [ ] Threat assessment conducted in Discovery/Alpha (see Section 4)
- [ ] Security approach and plan documented (risk assessment method, control framework, assurance and testing approach)
- [ ] Security costs included in the business case and investment approvals
- [ ] Security expertise involved from the start

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.3 Implement Continuous Risk Management

**Principle**: Make cyber security risk management a continuous process, embedded in programme governance.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the risk register, review cadence and vulnerability management, citing source documents]

**Risk Management Checks**:

- [ ] Risk register maintained through life, with an accountable owner and the mitigating controls for each risk
- [ ] Cyber risk reviewed at least quarterly (ISN 2023/09)
- [ ] Risks managed within the defined risk appetite
- [ ] Risks reassessed when the capability, its vulnerabilities or the threats change
- [ ] Vulnerability management in place, including regular vulnerability scanning (see Section 5.4)
- [ ] CAAT maturity assessments kept up to date

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.4 Define Security Controls

**Principle**: Set up security controls that address the risks identified, or use current services and patterns.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the threat model, security architecture, control framework and the layered controls implemented]

**Control Design Checks**:

- [ ] Threat model informs the security architecture and control selection
- [ ] Security architecture reviewed and approved
- [ ] Designed in line with NCSC secure design guidance, using MOD approved architectural design patterns and standard tooling where available
- [ ] Controls selected from a control framework (for example NIST SP 800-53 or the ISO/IEC 27000 series), mapped to the risks and proportionate to the criticality of the capability and its data
- [ ] Common vulnerabilities (OWASP Top 10) mitigated and secure coding standards followed (see Section 6)

**Defence in Depth** (multiple layers of security controls, so that if one fails others continue to protect):

- [ ] Physical security (data center, building access)
- [ ] Network security (firewalls, segmentation, IDS/IPS)
- [ ] Host security (hardened OS, endpoint protection)
- [ ] Application security (WAF, input validation, secure coding)
- [ ] Data security (encryption at rest and in transit)
- [ ] Identity security (MFA, privileged access management)
- [ ] Monitoring and detection (SIEM, SOC)

**Secure by Default** (secure out of the box, with minimal configuration required):

- [ ] Strong authentication required by default
- [ ] Encryption enabled by default
- [ ] Secure protocols only (TLS 1.3, SSH v2)
- [ ] Security headers configured
- [ ] Default accounts disabled/removed
- [ ] Logging enabled by default

**Least Privilege** (users and systems have only the minimum access they need):

- [ ] Role-Based Access Control (RBAC) implemented
- [ ] Principle of least privilege enforced
- [ ] Privileged access management (PAM) in place
- [ ] Just-in-time (JIT) access for elevated privileges
- [ ] Regular access reviews conducted
- [ ] Separation of duties enforced

**Assume Breach** (design and operate as if compromise has already occurred):

- [ ] Security monitoring and alerting
- [ ] Forensic capabilities available
- [ ] Network segmentation to limit blast radius
- [ ] Zero-trust architecture principles applied
- [ ] Regular red team/penetration testing

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.5 Engage and Manage the Supply Chain

**Principle**: Understand the supply chain, including the risks it poses and how suppliers meet their security responsibilities.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe supply chain risk assessments, contractual security requirements and supplier attestations]

**Supply Chain Checks**:

- [ ] Supply chain risk assessments completed (see Section 7)
- [ ] Through-life security requirements in contracts, including DEFCON 658 or equivalent
- [ ] Security approaches evaluated at tender
- [ ] Defence Cyber Protection Partnership (DCPP) process applied
- [ ] Software Bill of Materials (SBOM) maintained and open source software vetted
- [ ] Supplier security attestations obtained (ISN 2023/10)

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.6 Assure, Verify and Test

**Principle**: Get security assurance, testing and validation throughout the capability's lifecycle.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe security verification, acceptance testing, penetration testing and the security authorisation decision]

**Assurance and Testing Checks**:

- [ ] Security requirements and controls validated and verified at the appropriate design points
- [ ] Acceptance tests evaluate the security controls and functions
- [ ] Penetration testing carried out at key milestones
- [ ] Findings from security tests reviewed, acted on and shared with Cyber Security Assessors
- [ ] Non-conformances addressed before the capability handles MOD data or goes live
- [ ] Security authorisation decision made by the SRO, or suitable equivalent, that risks are within the stated risk appetite

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 2.7 Plan the Through-Life Approach

**Principle**: Continuously monitor for through-life security improvements, planning the approach using the Defence Lines of Development.

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the through-life security plan, monitoring, incident response, patching and decommissioning arrangements]

**Through-Life Checks**:

- [ ] Through-life security approach planned across the Defence Lines of Development
- [ ] Security monitoring operational, with threat intelligence
- [ ] Incident response plan documented and tested, with lessons learned applied (see Section 8.2)
- [ ] Patching and update process defined
- [ ] Security governance continues through life, including handover to service management
- [ ] Decommissioning process includes secure data deletion

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 3. MOD Secure by Design Assurance

Since August 2023, Secure by Design continuous assurance replaces point-in-time accreditation and the RMADS (JSP 440 Leaflet 5C; ISN 2023/10).

### 3.1 Continuous Assurance Status

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe assurance progress to date: CAAT registration and self-assessment, BIA, Security Aspects Letter (SAL) where issued, supplier attestation]

**Accountable Owner**: [SRO / capability owner]
**Delivery Team Security Lead (DTSL)**: [Name/Role]
**Security Assurance Coordinator (SAC)**: [Name/Role, if appointed]
**Project Security Officer (PSyO)**: [Name/Role — required for SECRET and above]

**Assurance Progress**:

- [ ] Registered on CAAT (Cyber Activity and Assurance Tracker) in Discovery/Alpha
- [ ] Delivery Team Security Lead appointed
- [ ] CAAT self-assessment question sets completed and kept up to date
- [ ] Business Impact Assessment (BIA) completed
- [ ] Security controls implemented and documented (NIST CSF, NCSC guidance, JSP 440)
- [ ] Continuous security testing in place (regular scanning, penetration tests at key milestones)
- [ ] Risk register actively maintained
- [ ] Supplier attestation obtained under ISN 2023/10 (where a supplier delivers the system)
- [ ] Security governance reviews scheduled with the Second Line (technical coherence)

**Legacy Accreditation**: [None / Expired — transitioned to Secure by Design continuous assurance]

**Next Assurance Review**: [Date]

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 3.2 JSP 440 Compliance

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the IAMM assessment basis and supporting artefacts]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 4. Threat Modeling and Risk Assessment

### 4.1 Threat Model

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe threat model coverage and the documents it is recorded in]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 4.2 Security Risk Assessment

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the security risk assessment and risk register sources]

**Risk Assessment Method**: [HMG Information Assurance Standard No. 1 & 2 / ISO 27005 / Other]

**Risk Register Maintained**: [Yes / No]

**Critical/High Risks**:

| Risk ID | Risk Description | Likelihood | Impact | Risk Level | Owner | Mitigation Plan |
|---------|------------------|------------|--------|------------|-------|-----------------|
| [R-001] | [Description] | [H/M/L] | [H/M/L] | [C/H/M/L] | [Name] | [Plan] |
| [R-002] | [Description] | [H/M/L] | [H/M/L] | [C/H/M/L] | [Name] | [Plan] |

**Residual Risks**: [Number of risks accepted by IAO/IAA]

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 5. Technical Security Controls

### 5.1 Cryptography

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe encryption at rest/in transit, key management and HSM use]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 5.2 Authentication and Identity

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe authentication mechanisms, MFA and identity provider integration]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 5.3 Network Security

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe network segmentation, perimeter controls and IDS/IPS]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 5.4 Vulnerability Management

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe scanning, penetration testing and remediation evidence]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 5.5 Security Monitoring and Logging

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe SIEM/SOC coverage, log retention and alerting]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 6. Secure Development Lifecycle

### 6.1 Secure Coding Practices

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe secure coding standards, code review and SAST/DAST evidence]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 6.2 DevSecOps Integration

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe security tooling integrated into CI/CD pipelines]

**CI/CD Security Gates**:

- [ ] Automated security scanning in pipeline
- [ ] Secrets scanning (no hardcoded credentials)
- [ ] Dependency vulnerability scanning
- [ ] Container image scanning
- [ ] Infrastructure as Code (IaC) security scanning
- [ ] Build artifact signing and verification

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 7. Supply Chain Security

### 7.1 Third-Party Risk Management

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe supplier assessments, contractual security clauses and DEFCON 658 compliance]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 7.2 Open Source Software Security

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe SBOM, dependency scanning and licence compliance evidence]

**Open Source Components**: [Number of OSS dependencies]

**OSS Security Controls**:

- [ ] Software Bill of Materials (SBOM) generated
- [ ] Known vulnerabilities scanned (CVE database)
- [ ] License compliance verified
- [ ] OSS component lifecycle managed
- [ ] Alternative components evaluated for high-risk OSS

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 8. Operational Security

### 8.1 Backup and Recovery

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe backup regime, test restores and RTO/RPO evidence]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 8.2 Incident Response

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe incident response plan, exercises and MOD CERT/JSOC integration]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 8.3 Disaster Recovery and Business Continuity

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe DR/BCP plans and test results]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 9. Personnel Security

### 9.1 Security Clearances

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe clearance requirements and current clearance status for roles]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 9.2 Security Awareness

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe security awareness training completion and records]

**Security Training**:

- [ ] Mandatory security awareness training completed
- [ ] Role-based security training provided
- [ ] Phishing awareness training
- [ ] Insider threat awareness
- [ ] Data handling and classification training
- [ ] Annual security refresher training

**Training Completion Rate**: [X%]

**Gaps/Actions**:

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## 10. Compliance and Governance

### 10.1 Regulatory Compliance

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe regulatory compliance assessments and their outcomes]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

### 10.2 Security Policies and Procedures

**Status**: [✅ Compliant | ⚠️ Partially Compliant | ❌ Non-Compliant]

**Evidence**:
[Describe the security policies and procedures in place and their review status]

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

- [Action 1] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]
- [Action 2] — Owner: [Role] — Due: [YYYY-MM-DD] — Priority: [CRITICAL | HIGH | MEDIUM | LOW]

---

## Overall Security Assessment Summary

### Security Scorecard

| Security Domain | Status | Critical Issues | Priority |
|-----------------|--------|-----------------|----------|
| Data Classification | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 1: Understand and Define Context | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 2: Plan the Security Activities | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 3: Implement Continuous Risk Management | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 4: Define Security Controls | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 5: Engage and Manage the Supply Chain | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 6: Assure, Verify and Test | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| SbD 7: Plan the Through-Life Approach | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
| Continuous Assurance | [✅/⚠️/❌] | [Yes/No] | [High/Med/Low] |
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

1. [Issue 1 with domain reference - must be resolved before the next assurance review or phase gate]
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

**Generated by**: ArcKit `/arckit:mod-secure` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
