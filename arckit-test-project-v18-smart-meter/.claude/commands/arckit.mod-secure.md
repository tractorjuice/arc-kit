---
description: Generate a MOD Secure by Design assessment for UK Ministry of Defence projects using CAAT and continuous assurance
tags: [security, mod, defence, jsp-440, jsp-453, secure-by-design, continuous-assurance, caat, continuous-risk-management, isn-2023-09, isn-2023-10]
---

# MOD Secure by Design Assessment

You are helping to conduct a **Secure by Design (SbD) assessment** for a UK Ministry of Defence (MOD) technology project, programme, or capability.

## Context

Since August 2023, ALL Defence capabilities, technology infrastructure, and digital services **MUST** follow the Secure by Design (SbD) approach mandated in JSP 440 Leaflet 5C. This represents a fundamental shift from legacy RMADS (Risk Management and Accreditation Documentation Set) to **continuous risk management** throughout the capability lifecycle.

**Key MOD Security References**:
- **JSP 440**: Defence Manual of Security (primary security policy)
- **JSP 440 Leaflet 5C**: Secure by Design mandate (August 2023)
- **JSP 453**: Digital Policies and Standards for Defence
- **ISN 2023/09**: Industry Security Notice - Secure by Design Requirements
- **ISN 2023/10**: Industry Security Notice - Supplier attestation and legacy accreditation withdrawal
- **NIST Cybersecurity Framework (CSF)**: Risk assessment and controls framework
- **NCSC Secure Design Principles**: Technical security guidance
- **Data Protection Act 2018 / UK GDPR**: Data privacy requirements

## Critical Changes (Post-August 2023)

**SbD is now mandatory**:
- Cyber security is a **licence to operate** - cannot be traded out
- Applies to ALL new programmes and systems
- Legacy systems transition when accreditation expires (by 31 March 2024 completed)
- Supplier-owned continuous assurance (not MOD accreditation)
- **Suppliers must attest** that systems are secure
- Senior Responsible Owners (SROs), capability owners, and delivery teams are **accountable**

## Your Task

Generate a comprehensive Secure by Design assessment document using the **continuous risk management** approach by:

1. **Understanding the project context**:
   - Programme/project/capability name
   - MOD organization (Army, Navy, RAF, Defence Digital, Strategic Command, etc.)
   - Data classification level (OFFICIAL, OFFICIAL-SENSITIVE, SECRET, TOP SECRET)
   - Project phase (Discovery, Alpha, Beta, Live, Through-Life)
   - Deployment environment (MOD network, cloud, operational theatre, coalition)
   - Delivery Team Security Lead appointed (Yes/No)
   - Project Security Officer (PSyO) appointed if SECRET+ (Yes/No)
   - Current SbD maturity level (self-assessment score)

2. **Check existing documentation**:
   - Requirements documents: Any `ARC-*-REQ-*.md` file in `projects/*/`
   - Risk register: Any `ARC-*-RISK-*.md` file in `projects/*/`
   - Architecture diagrams in `projects/*/diagrams/`
   - Any existing security documentation
   - TCoP assessments (if available)
   - Previous SbD self-assessments

3. **Assess against the 7 MOD Secure by Design Principles** (ISN 2023/09):

   **Principle 1: Understand and Define Context**
   - Understand the capability's overall context
   - How it will use and manage MOD data
   - How it achieves its primary business/operational outcome
   - **Assessment**:
     - Context documented (mission, users, data flows)
     - Data classification determined
     - Operational environment understood
     - Stakeholder security requirements captured

   **Principle 2: Apply Security from the Start**
   - Security embedded in design from inception (not bolt-on)
   - Security requirements defined early
   - Security architecture designed before build
   - **Assessment**:
     - Security requirements in initial specifications
     - Threat model created in Discovery/Alpha
     - Security architecture reviewed and approved
     - Security expertise involved from start

   **Principle 3: Apply Defence in Depth**
   - Multiple layers of security controls
   - Fail-safe defaults (secure by default)
   - Assume breach (design for compromise)
   - **Assessment**:
     - Layered security controls (network, host, application, data)
     - Segmentation and least privilege implemented
     - Monitoring and detection at each layer
     - Containment and recovery capabilities

   **Principle 4: Follow Secure Design Patterns**
   - Use proven secure architectures
   - Leverage NCSC/NIST guidance
   - Avoid known insecure patterns
   - **Assessment**:
     - NCSC Secure Design Principles applied
     - NIST CSF controls mapped
     - Common vulnerabilities (OWASP Top 10) mitigated
     - Secure coding standards followed

   **Principle 5: Continuously Manage Risk**
   - Risk assessment is ongoing (not one-time)
   - Risk register maintained through-life
   - Security testing continuous
   - **Assessment**:
     - Risk register actively maintained
     - Regular vulnerability scanning and pen testing
     - Security incidents tracked and lessons learned
     - Continuous monitoring and threat intelligence

   **Principle 6: Secure the Supply Chain**
   - Third-party components assessed
   - Vendor security requirements in contracts
   - Software supply chain protected
   - **Assessment**:
     - Software Bill of Materials (SBOM) maintained
     - Third-party risk assessments completed
     - Supplier security attestations obtained (ISN 2023/10)
     - Open source software vetted
     - Supply chain attack vectors mitigated

   **Principle 7: Enable Through-Life Assurance**
   - Security posture maintained post-deployment
   - Regular security reviews
   - Capability to respond to new threats
   - **Assessment**:
     - Security monitoring operational
     - Incident response capability proven
     - Patching and update process defined
     - Security governance continues through-life
     - Decommissioning process includes secure data deletion

4. **Assess using NIST Cybersecurity Framework** (as mandated by SbD):

   **Identify**:
   - Asset inventory (hardware, software, data, people)
   - Business environment and criticality
   - Governance structure and policies
   - Risk assessment methodology

   **Protect**:
   - Access control (authentication, authorisation)
   - Data security (encryption at rest/in transit, DLP)
   - Protective technology (firewalls, AV, IDS/IPS)
   - Security awareness training

   **Detect**:
   - Continuous monitoring (SIEM, SOC integration)
   - Anomaly and event detection
   - Security testing (vulnerability scanning, pen testing)
   - Detection processes and procedures

   **Respond**:
   - Incident response plan
   - Communications and reporting (to MOD CERT)
   - Analysis and mitigation
   - Improvements from lessons learned

   **Recover**:
   - Recovery planning (backup, DR, BC)
   - Improvements (post-incident review)
   - Communications and restoration

5. **Assess Three Lines of Defence**:

   **First Line**: Delivery team owns security
   - Delivery Team Security Lead appointed
   - Security requirements owned by capability owner
   - Day-to-day security management

   **Second Line**: Assurance and oversight
   - Technical Coherence Assurance
   - Security policies and standards
   - Independent security reviews

   **Third Line**: Independent audit
   - Internal audit of security controls
   - Penetration testing by independent teams
   - External audit (NAO, GIAA)

5. **For each domain**:
   - Assess status: ✅ Compliant / ⚠️ Partially Compliant / ❌ Non-Compliant
   - Gather evidence from project documents
   - Check relevant security controls
   - Identify critical gaps
   - Provide specific remediation actions with owners and timelines

6. **Determine overall security posture**:
   - Calculate domain compliance scores
   - Identify critical security issues (blockers for deployment)
   - Assess SbD maturity level using CAAT
   - Determine overall risk level (Low/Medium/High/Very High)

7. **Generate actionable recommendations**:
   - Critical priority (0-30 days) - must resolve before deployment
   - High priority (1-3 months) - significant risk reduction
   - Medium priority (3-6 months) - continuous improvement
   - Assign owners and due dates

8. **Save the document**: Write to `projects/[project-folder]/ARC-{PROJECT_ID}-SECD-MOD-v1.0.md`

## Assessment Guidelines

### Status Indicators

- **✅ Compliant**: All security controls implemented and effective, no significant gaps
- **⚠️ Partially Compliant**: Some controls in place but significant gaps remain
- **❌ Non-Compliant**: Controls not implemented or ineffective, critical gaps exist

### Critical Security Issues (Deployment Blockers)

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
- CAAT assessment and security governance review before deployment

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
- CAAT registration and initial self-assessment
- Delivery Team Security Lead (DTSL) appointed

**Beta**:
- Comprehensive threat model
- Full risk assessment
- Security controls implemented
- Penetration testing completed
- CAAT self-assessment completed
- Security governance review

**Live**:
- All security controls operational
- CAAT continuously updated
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

### Continuous Assurance Process (Replaced RMADS in August 2023)

**SbD replaces point-in-time accreditation with continuous assurance**:

1. **Register on CAAT** (Cyber Activity and Assurance Tracker)
   - Every programme must register on CAAT in Discovery/Alpha
   - CAAT is the self-assessment tool for cyber security maturity
   - Available through MOD Secure by Design portal (DefenceGateway account required)

2. **Appoint Delivery Team Security Lead (DTSL)**
   - DTSL owns security for the delivery team (First Line of Defence)
   - May also appoint Security Assurance Coordinator (SAC)
   - Project Security Officer (PSyO) still required for SECRET+ systems

3. **Complete CAAT self-assessment question sets**
   - Based on the 7 MOD Secure by Design Principles
   - Assess cyber security maturity throughout lifecycle
   - Regular updates required (not one-time submission)

4. **Complete Business Impact Assessment (BIA)**
   - Understand criticality and impact of compromise
   - Informs risk assessment and security controls

5. **Implement security controls**
   - Based on NIST CSF, NCSC guidance, and JSP 440 requirements
   - Defence in depth approach
   - Continuous improvement throughout lifecycle

6. **Conduct continuous security testing**
   - Vulnerability scanning (regular, automated)
   - Penetration testing (at key milestones)
   - Security audits by Third Line of Defence

7. **Maintain continuous risk management**
   - Risk register actively maintained
   - Threats and vulnerabilities continuously monitored
   - Security incidents tracked and lessons learned applied

8. **Supplier attestation** (for systems delivered by suppliers)
   - Suppliers must attest that systems are secure (ISN 2023/10)
   - Supplier-owned continuous assurance (not MOD accreditation)
   - Supplier security requirements in contracts

9. **Security governance reviews**
   - Regular reviews by Second Line (Technical Coherence)
   - No single "accreditation approval" - ongoing assurance
   - SROs and capability owners accountable for security posture

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
- Deploy network segmentation (CRITICAL - deployment blocker)
- Implement IDS/IPS (HIGH PRIORITY)

## Critical Issues
1. Network segmentation incomplete (Domain 5) - BLOCKER for deployment
2. Penetration test not completed (Domain 5) - Required before Beta

## Recommendations
**Critical** (0-30 days):
- Complete network segmentation - Security Architect - 30 days
- Schedule penetration test - DTSL - 15 days
```

## Important Notes

- **Continuous assurance is mandatory** for MOD systems throughout their lifecycle (replaced point-in-time accreditation August 2023)
- **CAAT registration required** for all programmes from Discovery/Alpha phase
- Non-compliance can block project progression, funding, and deployment
- **Delivery Team Security Lead (DTSL)** engagement required from Discovery phase
- Regular security reviews required (quarterly during development, annually in Live)
- **SROs and capability owners are accountable** for security posture (not delegated to accreditation authority)
- Classification determines security control requirements
- **Supplier attestation required** for supplier-delivered systems (ISN 2023/10)
- Insider threat is a primary concern for MOD - emphasize personnel security
- Supply chain security critical due to foreign adversary threats
- Operational security (OPSEC) essential for operational systems
- **Cyber security is a "licence to operate"** - cannot be traded out or descoped

## Related MOD Standards

- JSP 440: Defence Information Assurance Policy
- JSP 441: Security Policy
- Defence Digital Security Strategy
- NCSC Cloud Security Principles
- HMG Security Policy Framework
- CESG Cryptographic Mechanisms

## Resources

- **MOD Secure by Design**: https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design
- **MOD Secure by Design Portal**: Requires DefenceGateway account for industry partners
- **CAAT** (Cyber Activity and Assurance Tracker): Self-assessment tool available through SbD portal
- JSP 440: https://www.gov.uk/government/publications/jsp-440-defence-information-assurance
- JSP 453 (Digital Policies): https://www.digital.mod.uk/policy-rules-standards-and-guidance
- ISN 2023/09: Industry Security Notice - Secure by Design Requirements
- ISN 2023/10: Industry Security Notice - Supplier attestation
- NCSC CAF: https://www.ncsc.gov.uk/collection/caf
- NCSC Secure Design Principles: https://www.ncsc.gov.uk/collection/cyber-security-design-principles
- Defence Digital: https://www.gov.uk/government/organisations/defence-digital

Generate the MOD Secure by Design assessment now based on the project information provided.
