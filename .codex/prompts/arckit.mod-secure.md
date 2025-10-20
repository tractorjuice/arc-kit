---
description: Generate a MOD Secure by Design assessment for UK Ministry of Defence projects
tags: [security, mod, defence, accreditation, jsp-440, secure-by-design]
---

# MOD Secure by Design Assessment

You are helping to conduct a **Secure by Design assessment** for a UK Ministry of Defence (MOD) technology project or programme.

## Context

MOD requires all technology projects to follow Secure by Design principles and obtain appropriate security accreditation before deployment. This assessment evaluates security controls across the full system lifecycle.

**Key MOD Security References**:
- JSP 440: Defence Information Assurance Policy
- NCSC Cyber Assessment Framework (CAF)
- Defence Digital Security Standards
- HMG Security Policy Framework

## Your Task

Generate a comprehensive Secure by Design assessment document by:

1. **Loading the template**: Use the MOD Secure by Design template from `.specify/templates/mod-secure-by-design-template.md`

2. **Understanding the project context**:
   - Project name and MOD organization (Army, Navy, RAF, Defence Digital, etc.)
   - Data classification level (OFFICIAL, OFFICIAL-SENSITIVE, SECRET, TOP SECRET)
   - Project phase (Discovery, Alpha, Beta, Live)
   - Accreditation status and timeline
   - Deployment environment (MOD network, cloud, operational theatre)

3. **Check existing documentation**:
   - Requirements documents in `specs/*/requirements.md`
   - Architecture diagrams in `specs/*/diagrams/`
   - Any existing security documentation
   - TCoP assessments (if available)
   - Risk registers

4. **Assess security across 10 key domains**:

   **Domain 1: Security Classification and Data Handling**
   - Determine highest data classification
   - Identify data types (personal, classified, operational, intelligence)
   - Assess data handling controls

   **Domain 2: MOD Security Principles**
   - Defence in Depth (multiple security layers)
   - Secure by Default (secure out-of-box)
   - Least Privilege (minimum necessary access)
   - Assume Breach (design for compromise)

   **Domain 3: MOD Accreditation Requirements**
   - JSP 440 compliance status
   - IAMM (Information Assurance Maturity Model) level
   - Security Accreditation progress
   - IAO/IAA engagement

   **Domain 4: Threat Modeling and Risk Assessment**
   - Threat actors (nation state, terrorist, insider, etc.)
   - Threat model completeness (STRIDE, PASTA, etc.)
   - Risk register and residual risks
   - Critical/high security risks

   **Domain 5: Technical Security Controls**
   - Cryptography (CESG-approved algorithms)
   - Authentication and Identity (smart card, MFA, PAM)
   - Network Security (segmentation, firewalls, IDS/IPS, air-gap)
   - Vulnerability Management (scanning, patching, pen testing)
   - Security Monitoring (SIEM, SOC, logging)

   **Domain 6: Secure Development Lifecycle**
   - Secure coding practices (OWASP Top 10 mitigation)
   - Security testing (SAST, DAST, SCA)
   - DevSecOps integration
   - Code review including security

   **Domain 7: Supply Chain Security**
   - Third-party risk management
   - Vendor security assessments
   - Open source software security
   - Software Bill of Materials (SBOM)

   **Domain 8: Operational Security**
   - Backup and recovery (3-2-1 rule, RTO, RPO)
   - Incident response (plan, team, exercises)
   - Disaster recovery and business continuity
   - DR testing

   **Domain 9: Personnel Security**
   - Security clearances (BPSS, SC, DV, eDV)
   - Vetting compliance for classification level
   - Security awareness training
   - Insider threat mitigation

   **Domain 10: Compliance and Governance**
   - Regulatory compliance (UK GDPR, Official Secrets Act, etc.)
   - Security policies and procedures
   - Documentation currency
   - Governance structure

5. **For each domain**:
   - Assess status: ✅ Compliant / ⚠️ Partially Compliant / ❌ Non-Compliant
   - Gather evidence from project documents
   - Check relevant security controls
   - Identify critical gaps
   - Provide specific remediation actions with owners and timelines

6. **Determine overall security posture**:
   - Calculate domain compliance scores
   - Identify critical security issues (blockers for accreditation)
   - Assess readiness for security accreditation
   - Determine overall risk level (Low/Medium/High/Very High)

7. **Generate actionable recommendations**:
   - Critical priority (0-30 days) - must resolve before accreditation
   - High priority (1-3 months) - significant risk reduction
   - Medium priority (3-6 months) - continuous improvement
   - Assign owners and due dates

8. **Save the document**: Write to `specs/[project-folder]/mod-secure-by-design.md`

## Assessment Guidelines

### Status Indicators

- **✅ Compliant**: All security controls implemented and effective, no significant gaps
- **⚠️ Partially Compliant**: Some controls in place but significant gaps remain
- **❌ Non-Compliant**: Controls not implemented or ineffective, critical gaps exist

### Critical Security Issues (Accreditation Blockers)

Mark as CRITICAL if:
- Data classified SECRET or above without appropriate controls
- No encryption for data at rest or in transit
- Personnel lacking required security clearances
- No threat model or risk assessment
- Critical vulnerabilities unpatched
- No incident response capability
- No backup/recovery capability
- Non-compliance with JSP 440 mandatory controls

### Classification-Specific Requirements

**OFFICIAL**:
- Cyber Essentials baseline
- Basic access controls and encryption
- Standard MOD security policies

**OFFICIAL-SENSITIVE**:
- Cyber Essentials Plus
- MFA required
- Enhanced logging and monitoring
- DPIA if processing personal data

**SECRET**:
- Security Cleared (SC) personnel minimum
- CESG-approved cryptography
- Air-gapped or assured network connectivity
- Enhanced physical security
- Full security accreditation before deployment

**TOP SECRET**:
- Developed Vetting (DV) personnel
- Compartmented security
- Strictly controlled access
- Enhanced OPSEC measures

### Project Phase Considerations

**Discovery/Alpha**:
- Initial threat model
- Classification determination
- Preliminary risk assessment
- Security architecture design
- Accreditation planning

**Beta**:
- Comprehensive threat model
- Full risk assessment
- Security controls implemented
- Penetration testing completed
- RMADS documentation submitted
- Interim or conditional accreditation

**Live**:
- All security controls operational
- Full accreditation granted
- Continuous monitoring active
- Regular security reviews
- Incident response capability proven

## MOD-Specific Context

### JSP 440 Information Assurance Maturity Model (IAMM)

Assess maturity across 8 domains (0-5 scale):
- Level 0: Non-existent
- Level 1: Initial/Ad hoc
- Level 2: Repeatable
- Level 3: Defined
- Level 4: Managed
- Level 5: Optimized

Target Level 3+ for operational systems.

### Accreditation Process

1. Engage with Accreditation Service early (Discovery/Alpha)
2. Appoint Information Assurance Owner (IAO) and Architect (IAA)
3. Complete Business Impact Assessment (BIA)
4. Develop Risk Management and Accreditation Documentation Set (RMADS)
5. Obtain Security Aspects Letter (SAL)
6. Implement security controls
7. Conduct security testing (penetration test, vulnerability scan)
8. Submit for accreditation review
9. Remediate identified issues
10. Obtain accreditation approval from IAA

### Common MOD Security Requirements

**Cryptography**:
- CESG-approved algorithms (AES-256, SHA-256, RSA-2048+)
- Hardware Security Modules (HSMs) for key management
- FIPS 140-2 compliant modules

**Network Security**:
- Segmentation by security domain
- Firewalls at trust boundaries
- IDS/IPS for threat detection
- Air-gap for SECRET and above (or assured connectivity)

**Authentication**:
- Smart card (CAC/MOD Form 90) for OFFICIAL-SENSITIVE and above
- Multi-factor authentication (MFA) mandatory
- Privileged Access Management (PAM) for admin access

**Monitoring**:
- Integration with MOD Cyber Defence Operations
- 24/7 security monitoring
- SIEM with correlation rules
- Incident escalation to MOD CERT

## Example Output Structure

```markdown
# MOD Secure by Design Assessment

**Project**: MOD Personnel Management System
**Classification**: OFFICIAL-SENSITIVE
**Overall Security Posture**: Adequate (with gaps to address)

## Domain 1: Security Classification
**Status**: ✅ Compliant
**Evidence**: System handles personnel records (OFFICIAL-SENSITIVE), classification confirmed by IAO...

## Domain 5: Technical Security Controls

### 5.1 Cryptography
**Status**: ⚠️ Partially Compliant
**Evidence**: AES-256 encryption at rest, TLS 1.3 in transit, but key rotation not automated...
**Gaps**:
- Automated key rotation required (HIGH PRIORITY)
- HSM not yet deployed (MEDIUM PRIORITY)

### 5.3 Network Security
**Status**: ❌ Non-Compliant
**Evidence**: Network segmentation incomplete, no IDS/IPS deployed...
**Gaps**:
- Deploy network segmentation (CRITICAL - accreditation blocker)
- Implement IDS/IPS (HIGH PRIORITY)

## Critical Issues
1. Network segmentation incomplete (Domain 5) - BLOCKER for accreditation
2. Penetration test not completed (Domain 5) - Required before Beta

## Recommendations
**Critical** (0-30 days):
- Complete network segmentation - Security Architect - 30 days
- Schedule penetration test - IAO - 15 days
```

## Important Notes

- **Accreditation is mandatory** for MOD systems before operational deployment
- Non-compliance can block project progression and funding
- IAO/IAA engagement required from Discovery phase
- Regular security reviews required (quarterly during development, annually in Live)
- Classification determines security control requirements
- Insider threat is a primary concern for MOD - emphasize personnel security
- Supply chain security critical due to foreign adversary threats
- Operational security (OPSEC) essential for operational systems

## Related MOD Standards

- JSP 440: Defence Information Assurance Policy
- JSP 441: Security Policy
- Defence Digital Security Strategy
- NCSC Cloud Security Principles
- HMG Security Policy Framework
- CESG Cryptographic Mechanisms

## Resources

- JSP 440: https://www.gov.uk/government/publications/jsp-440-defence-information-assurance
- NCSC CAF: https://www.ncsc.gov.uk/collection/caf
- Defence Digital: https://www.gov.uk/government/organisations/defence-digital
- CESG: https://www.ncsc.gov.uk/section/products-services/cesg

Generate the MOD Secure by Design assessment now based on the project information provided.
