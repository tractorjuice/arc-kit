---
description: Generate a MOD Secure by Design assessment for UK Ministry of Defence projects using CAAT and continuous assurance
doc-type: SECD-MOD
argument-hint: "<project name, e.g. 'Logistics Management System OFFICIAL'>"
tags: [security, mod, defence, jsp-440, jsp-453, secure-by-design, continuous-assurance, caat, continuous-risk-management, isn-2023-09, isn-2023-10]
effort: high
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
---

# MOD Secure by Design Assessment

You are helping to conduct a **Secure by Design (SbD) assessment** for a UK Ministry of Defence (MOD) technology project, programme, or capability.

## User Input

```text
$ARGUMENTS
```

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

## Read the Template

**Read the template** (with user override support):

- **First**, check if `.arckit/templates-custom/mod-secure-by-design-template.md` exists in the project root, then `.arckit/templates/mod-secure-by-design-template.md`
- **If found**: Read the user's customized template (user override takes precedence)
- **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/mod-secure-by-design-template.md` (default)
- **Then read** `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md` and resolve the `<!-- DOC-CONTROL-HEADER -->` marker in the template before writing. Do not hand-write the Document Control table: the partial `RENDERING.md` selects is the only source of the 14 standard fields and of the classification ladder.

> **Tip**: Users can customize templates with `/arckit:customize mod-secure`

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

2. **Read Available Documents**:

   > **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.

   **MANDATORY** (warn if missing):
   - **REQ** (Requirements) — Extract: NFR-SEC (security), NFR-A (availability), INT (integration), DR (data) requirements, data classification
     - If missing: warn user to run `/arckit:requirements` first
   - **PRIN** (Architecture Principles, in 000-global) — Extract: MOD security standards, approved platforms, classification handling, compliance requirements
     - If missing: warn user to run `/arckit:principles` first

   **RECOMMENDED** (read if available, note if missing):
   - **RISK** (Risk Register) — Extract: Security risks, threat model, risk appetite, mitigations, MOD-specific threats
   - **SECD** (Secure by Design) — Extract: NCSC CAF findings, Cyber Essentials status, existing security controls

   **OPTIONAL** (read if available, skip silently if missing):
   - **DIAG** (Architecture Diagrams, in diagrams/) — Extract: Deployment topology, network boundaries, data flows, trust zones
   - Previous SbD self-assessments (if available in project directory)

3. **Assess against the 7 MOD Secure by Design Principles**, using the names MOD publishes at https://www.digital.mod.uk/policy-rules-standards-and-guidance/secure-by-design. ISN 2023/09 sets out the requirements for the same seven principles; it names Principle 7 "Enable Through Life Management", which MOD now publishes as "Plan the through-life approach". Use MOD's current names as headings, and cite ISN 2023/09 for the requirements.

   **Principle 1: Understand and define context**
   - Understand what the capability does, how it will use and manage MOD data, and how it achieves its primary business or operational outcome
   - **Assessment**:
     - Context, purpose and mode of operation documented (use, users and operators, support requirements, data access, storage and processing, role of suppliers, end-to-end operation and interdependencies)
     - Data classification determined
     - Operational environment understood
     - Stakeholder security requirements captured
     - Capability risk appetite defined and published by the SRO
     - Initial cyber security risk assessment completed and documented
     - Capability registered on the Cyber Activity and Assurance Tracker (CAAT)

   **Principle 2: Plan the security activities**
   - Establish the capability's security workstream and plan the security activities, including assessment of cyber threat and potential risks, from the start
   - **Assessment**:
     - Delivery Team Security Lead appointed and funded, with suitably qualified and experienced (SQEP) security support
     - Security requirements defined in the initial specifications, with validation and verification planned
     - Threat assessment conducted in Discovery/Alpha
     - Security approach and plan documented (risk assessment method, control framework, assurance and testing approach)
     - Security costs included in the business case and investment approvals
     - Security expertise involved from the start

   **Principle 3: Implement continuous risk management**
   - Embed cyber security risk management into programme governance as a continuous process
   - **Assessment**:
     - Risk register created and actively maintained through life, with an accountable owner and the mitigating controls for each risk
     - Cyber risk reviewed regularly, at least quarterly (ISN 2023/09)
     - Risks managed within the defined risk appetite
     - Risks reassessed when the capability, its vulnerabilities or the threats change
     - Vulnerability management in place, including regular vulnerability scanning
     - CAAT maturity assessments kept up to date

   **Principle 4: Define security controls**
   - Define, architect and implement security controls that address the risks identified, reusing existing services and patterns where they exist
   - **Assessment**:
     - Threat model informs the security architecture and control selection
     - Security architecture reviewed and approved
     - Designed in line with NCSC secure design guidance, using MOD approved architectural design patterns and standard tooling where available
     - Controls selected from a control framework (for example NIST SP 800-53 or the ISO/IEC 27000 series) and mapped to the risks, proportionate to the criticality of the capability and its data
     - Layered security controls (network, host, application, data), with segmentation and least privilege
     - Monitoring and detection at each layer, with containment and recovery capabilities
     - Common vulnerabilities (OWASP Top 10) mitigated and secure coding standards followed

   **Principle 5: Engage and manage the supply chain**
   - Understand the supply chain's role and the risks it poses, and make sure suppliers meet their security responsibilities
   - **Assessment**:
     - Supply chain risk assessments completed
     - Through-life security requirements in contracts, including DEFCON 658 or equivalent, and security approaches evaluated at tender
     - Defence Cyber Protection Partnership (DCPP) process applied
     - Software Bill of Materials (SBOM) maintained and open source software vetted
     - Supplier security attestations obtained (ISN 2023/10)
     - Supply chain attack vectors mitigated

   **Principle 6: Assure, verify and test**
   - Work with security experts to gain security assurance, and test and validate security throughout the capability's lifecycle
   - **Assessment**:
     - Security requirements and controls validated and verified at the appropriate design points
     - Acceptance tests evaluate the security controls and functions
     - Penetration testing carried out at key milestones
     - Findings from security tests reviewed, acted on and shared with Cyber Security Assessors
     - Non-conformances addressed before the capability handles MOD data or goes live
     - Security authorisation decision made by the SRO, or suitable equivalent, that risks are within the stated risk appetite

   **Principle 7: Plan the through-life approach**
   - Continuously monitor for through-life security improvements, planning the approach using the Defence Lines of Development
   - **Assessment**:
     - Through-life security approach planned across the Defence Lines of Development
     - Security monitoring operational, with continuous monitoring and threat intelligence
     - Incident response capability proven, with incidents tracked and lessons learned applied
     - Patching and update process defined
     - Security governance continues through life, including handover to service management
     - Decommissioning process includes secure data deletion

4. **Read external documents and policies**:
   - Read any **external documents** listed in the project context (`external/` files) — extract CAAT assessment results, security clearance requirements, JSP 440 compliance status, IAMM maturity scores
   - Read any **vendor security attestations** in `projects/{project-dir}/vendors/{vendor}/` — extract supplier security clearances, List X status, DEFCON compliance, SC/DV clearance evidence
   - Read any **global policies** listed in the project context (`000-global/policies/`) — extract MOD security standards, classification requirements, ITAR restrictions
   - Read any **enterprise standards** in `projects/000-global/external/` — extract enterprise MOD security baselines, accreditation templates, cross-project security assurance evidence
   - If no external MOD security docs found, ask: "Do you have any JSP 440 compliance reports, CAAT assessment results, or supplier security attestations? I can read PDFs directly. Place them in `projects/{project-dir}/external/` and re-run, or skip."
   - **Citation traceability**: When referencing content from external documents, follow the citation instructions in `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Place inline citation markers (e.g., `[PP-C1]`) next to findings informed by source documents and populate the "External References" section in the template.

5. **Assess using NIST Cybersecurity Framework** (as mandated by SbD):

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

6. **Assess Three Lines of Defence**:

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

7. **For each domain**:
   - Assess status: ✅ Compliant / ⚠️ Partially Compliant / ❌ Non-Compliant
   - Gather evidence from project documents
   - Check relevant security controls
   - Identify critical gaps
   - Provide specific remediation actions with owners and timelines

8. **Determine overall security posture**:
   - Calculate domain compliance scores
   - Identify critical security issues (blockers for deployment)
   - Assess SbD maturity level using CAAT
   - Determine overall risk level (Low/Medium/High/Very High)

9. **Generate actionable recommendations**:
   - Critical priority (0-30 days) - must resolve before deployment
   - High priority (1-3 months) - significant risk reduction
   - Medium priority (3-6 months) - continuous improvement
   - Assign owners and due dates

---

**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

**Construct Document ID**:

- **Document ID**: `ARC-{PROJECT_ID}-SECD-MOD-v{VERSION}` (e.g., `ARC-001-SECD-MOD-v1.0`)

**Populate Required Fields**:

*Auto-populated fields* (populate these automatically):

- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → from `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: "1.0" only when no earlier `ARC-{PROJECT_ID}-SECD-MOD-v*.md` exists
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → "MOD Secure by Design Assessment"
- `ARC-[PROJECT_ID]-SECD-MOD-v[VERSION]` → Construct using format above
- `[COMMAND]` → "arckit.mod-secure"

*User-provided fields* (extract from project metadata or user input):

- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- **Classification** → comes from the resolved Document Control header, not from a placeholder. `_partials/RENDERING.md` fixes the ladder from the artefact's own regime; `${user_config.default_classification}` applies only where that regime falls through to user config.

*Calculated fields*:

- `[YYYY-MM-DD]` for Next Review Date → Current date + 30 days

*Pending fields* (leave as [PENDING] until manually updated):

- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

**Populate Revision History**:

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit:mod-secure` command | [PENDING] | [PENDING] |
```

**Populate Generation Metadata Footer**:

The footer should be populated with:

```markdown
**Generated by**: ArcKit `/arckit:mod-secure` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: {ARCKIT_VERSION}
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "Claude Sonnet 5 (session default)"]
**Generation Context**: [Brief note about source documents used]
```

---

Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **SECD-MOD** per-type checks pass. Fix any failures before proceeding.

10. **Save the document**: Write to `projects/[project-folder]/ARC-{PROJECT_ID}-SECD-MOD-v{VERSION}.md`

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

- **Markdown escaping**: When writing less-than or greater-than comparisons, always include a space after `<` or `>` (e.g., `< 3 seconds`, `> 99.9% uptime`) to prevent markdown renderers from interpreting them as HTML tags or emoji

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
- ISN 2023/09: Industry Security Notice - Secure by Design Requirements: https://assets.publishing.service.gov.uk/media/64bfb929d4051a00145a9289/ISN_2023-09_Secure_by_Design_Requirements.pdf
- ISN 2023/10: Industry Security Notice - Supplier attestation
- NCSC CAF: https://www.ncsc.gov.uk/collection/caf
- NCSC Secure Design Principles: https://www.ncsc.gov.uk/collection/cyber-security-design-principles
- Defence Digital: https://www.gov.uk/government/organisations/defence-digital

Generate the MOD Secure by Design assessment now based on the project information provided.
