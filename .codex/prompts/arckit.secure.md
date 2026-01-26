---
description: Generate a Secure by Design assessment for UK Government projects (civilian departments)
tags: [security, uk-government, ncsc, caf, cyber-essentials, gdpr, secure-by-design]
---

# UK Government Secure by Design Assessment

You are helping to conduct a **Secure by Design assessment** for a UK Government technology project (civilian/non-MOD).

## Context

UK Government departments must follow NCSC (National Cyber Security Centre) guidance and achieve appropriate security certifications before deploying systems. This assessment evaluates security controls using the NCSC Cyber Assessment Framework (CAF).

**Key UK Government Security References**:
- NCSC Cyber Assessment Framework (CAF)
- Cyber Essentials / Cyber Essentials Plus
- UK GDPR and Data Protection Act 2018
- Government Security Classifications Policy
- Cloud Security Principles

## Your Task

Generate a comprehensive Secure by Design assessment document by:

1. **Loading the template**: Use the UK Gov Secure by Design template from `.arckit/templates/ukgov-secure-by-design-template.md`
   > **Note**: Read the `VERSION` file and update the version in the template metadata line when generating.

2. **Understanding the project context**:
   - Department/organization (HMRC, DWP, Home Office, DEFRA, etc.)
   - Data classification (PUBLIC, OFFICIAL, OFFICIAL-SENSITIVE)
   - Project phase (Discovery, Alpha, Beta, Live)
   - User base (public-facing, internal staff, both)
   - Hosting approach (cloud, on-premise, hybrid)

3. **Check existing documentation**:
   - Requirements documents in `specs/*/requirements.md`
   - Architecture diagrams in `specs/*/diagrams/`
   - Any existing security or compliance documents
   - TCoP assessments (if available)
   - Risk registers or threat models

4. **Assess security using NCSC CAF (14 principles across 4 objectives)**:

   **Objective A: Managing Security Risk (4 principles)**
   - A1: Governance - SIRO appointed, security policies, oversight
   - A2: Risk Management - Asset classification, risk register, treatment plans
   - A3: Asset Management - Inventory of hardware, software, data
   - A4: Supply Chain - Vendor assessments, contracts, third-party controls

   **Objective B: Protecting Against Cyber Attack (6 principles)**
   - B1: Service Protection Policies - Acceptable use, access control, data protection policies
   - B2: Identity and Access Control - MFA, PAM, least privilege, access reviews
   - B3: Data Security - Encryption, UK GDPR compliance, DPIA, DLP
   - B4: System Security - Patching, hardening, anti-malware, EDR
   - B5: Resilient Networks - Segmentation, firewalls, IDS/IPS, VPN
   - B6: Staff Awareness - Security training, phishing awareness, data protection

   **Objective C: Detecting Cyber Security Events (2 principles)**
   - C1: Security Monitoring - SIEM, alerting, logging, threat intelligence
   - C2: Proactive Security Event Discovery - Vulnerability scanning, pen testing, threat hunting

   **Objective D: Minimising the Impact of Incidents (2 principles)**
   - D1: Response and Recovery Planning - Incident response, BC/DR, RTO/RPO
   - D2: Improvements - Post-incident reviews, metrics, continuous improvement

5. **Assess Cyber Essentials compliance (5 controls)**:
   - Firewalls - Boundary firewalls configured
   - Secure Configuration - Hardened systems, unnecessary services disabled
   - Access Control - User accounts, MFA, least privilege
   - Malware Protection - Anti-malware on all devices
   - Patch Management - Timely patching (critical within 14 days)

6. **Assess UK GDPR compliance (if processing personal data)**:
   - DPO appointed (if required)
   - Lawful basis identified
   - Privacy notice published
   - Data subject rights procedures
   - DPIA completed (if high risk)
   - Data breach notification process (72 hours to ICO)
   - Records of Processing Activities (ROPA)

7. **For each CAF principle and control**:
   - Assess status: ✅ Achieved / ⚠️ Partially Achieved / ❌ Not Achieved / N/A
   - Gather evidence from project documents
   - Check relevant security controls
   - Identify gaps and risks
   - Provide specific remediation actions with owners and timelines

8. **Calculate overall CAF score**: X/14 principles achieved

9. **Identify critical security issues**:
   - Issues that block progression to next phase
   - Unacceptable risk levels
   - Regulatory non-compliance (UK GDPR, Data Protection Act)

10. **Generate actionable recommendations**:
    - Critical priority (0-30 days) - blockers for next phase
    - High priority (1-3 months) - significant risk reduction
    - Medium priority (3-6 months) - continuous improvement

11. **Save the document**: Write to `specs/[project-folder]/ukgov-secure-by-design.md`




**CRITICAL - Auto-Populate Document Control Fields**:

Before completing the document, populate ALL document control fields in the header:

### Step 1: Generate Document ID
```bash
# Use the ArcKit document ID generation script
DOC_ID=$(.arckit/scripts/bash/generate-document-id.sh "${PROJECT_ID}" "SECD" "1.0")
# Example output: ARC-001-SECD-v1.0
```

### Step 2: Populate Required Fields

**Auto-populated fields** (populate these automatically):
- `[PROJECT_ID]` → Extract from project path (e.g., "001" from "projects/001-project-name")
- `[VERSION]` → Start with "1.0" for new documents
- `[DATE]` / `[YYYY-MM-DD]` → Current date in YYYY-MM-DD format
- `[DOCUMENT_TYPE_NAME]` → Use the document purpose (e.g., "Business and Technical Requirements")
- `ARC-[PROJECT_ID]-SECD-v[VERSION]` → Use generated DOC_ID from Step 1
- `[COMMAND]` → Current command name (e.g., "arckit.secure")

**User-provided fields** (extract from project metadata or user input):
- `[PROJECT_NAME]` → Full project name from project metadata or user input
- `[OWNER_NAME_AND_ROLE]` → Document owner (prompt user if not in metadata)
- `[CLASSIFICATION]` → Default to "OFFICIAL" for UK Gov, "PUBLIC" otherwise (or prompt user)

**Calculated fields**:
- `[YYYY-MM-DD]` for Review Date → Current date + 30 days (requirements, research, risks)
- `[YYYY-MM-DD]` for Review Date → Phase gate dates (Alpha/Beta/Live for compliance docs)

**Pending fields** (leave as [PENDING] until manually updated):
- `[REVIEWER_NAME]` → [PENDING]
- `[APPROVER_NAME]` → [PENDING]
- `[DISTRIBUTION_LIST]` → Default to "Project Team, Architecture Team" or [PENDING]

### Step 3: Populate Revision History

```markdown
| 1.0 | {DATE} | ArcKit AI | Initial creation from `/arckit.secure` command | [PENDING] | [PENDING] |
```

### Step 4: Populate Generation Metadata Footer

The footer should be populated with:
```markdown
**Generated by**: ArcKit `/arckit.secure` command
**Generated on**: {DATE} {TIME} GMT
**ArcKit Version**: [Read from .arckit/VERSION file or use "0.6.0"]
**Project**: {PROJECT_NAME} (Project {PROJECT_ID})
**AI Model**: [Use actual model name, e.g., "claude-sonnet-4-5-20250929"]
**Generation Context**: [Brief note about source documents used]
```

### Example Fully Populated Document Control Section:

```markdown
## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-001-SECD-v1.0 |
| **Document Type** | {Document purpose} |
| **Project** | Windows 10 to Windows 11 Migration (Project 001) |
| **Classification** | OFFICIAL-SENSITIVE |
| **Status** | DRAFT |
| **Version** | 1.0 |
| **Created Date** | 2025-10-29 |
| **Last Modified** | 2025-10-29 |
| **Review Date** | 2025-11-30 |
| **Owner** | John Smith (Business Analyst) |
| **Reviewed By** | [PENDING] |
| **Approved By** | [PENDING] |
| **Distribution** | PM Team, Architecture Team, Dev Team |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| 1.0 | 2025-10-29 | ArcKit AI | Initial creation from `/arckit.secure` command | [PENDING] | [PENDING] |
```


## Assessment Guidelines

### Status Indicators

- **✅ Achieved**: All key controls implemented and effective, no significant gaps
- **⚠️ Partially Achieved**: Some controls in place but gaps remain
- **❌ Not Achieved**: Controls not implemented or ineffective
- **N/A**: Principle genuinely not applicable

### Critical Security Issues (Phase Blockers)

Mark as CRITICAL if:
- No UK GDPR compliance for personal data processing
- No DPIA for high-risk processing
- No encryption for sensitive data (OFFICIAL-SENSITIVE)
- Cyber Essentials not obtained (required for most gov contracts)
- No incident response capability
- No backup/recovery capability
- Critical vulnerabilities unpatched (>30 days)
- No MFA for privileged access
- SIRO not appointed or engaged

### Data Classification Requirements

**PUBLIC**:
- Basic security controls
- No special encryption requirements
- Standard access controls

**OFFICIAL**:
- Cyber Essentials baseline minimum
- Encryption in transit (TLS 1.2+)
- Access control and audit logging
- Regular security patching

**OFFICIAL-SENSITIVE**:
- Cyber Essentials Plus recommended
- Encryption at rest and in transit (strong algorithms)
- Multi-factor authentication required
- Enhanced audit logging
- DPIA if processing personal data
- Data loss prevention controls

### Project Phase Considerations

**Discovery/Alpha**:
- Security principles identified
- Data classification determined
- Initial risk assessment
- Security requirements defined
- SIRO engaged

**Beta**:
- Security controls implemented
- Penetration testing completed
- DPIA completed (if required)
- Cyber Essentials certification obtained
- Vulnerability management operational
- Incident response plan documented

**Live**:
- All CAF principles addressed
- Cyber Essentials Plus for high-risk systems
- Continuous security monitoring
- Regular penetration testing (annual minimum)
- Security incident capability proven
- Annual security review with SIRO

### Cyber Essentials Requirements

**Basic Cyber Essentials**: Self-assessment questionnaire
**Cyber Essentials Plus**: External technical verification

Required for:
- All central government contracts involving handling personal data
- Contracts valued at £5 million or more
- Most public sector technology procurements

## UK Government Context

### Senior Information Risk Owner (SIRO)

- Senior executive responsible for information risk
- Must be board-level or equivalent
- Reviews and approves risk treatment
- Signs off on major security decisions
- Typically Permanent Secretary or Director level

### Data Protection Officer (DPO)

Required if:
- Public authority or public body
- Core activities involve regular/systematic monitoring
- Core activities involve large-scale processing of special category data

Responsibilities:
- Advise on UK GDPR compliance
- Monitor compliance with UK GDPR
- Advise on DPIA
- Liaise with ICO

### Information Commissioner's Office (ICO)

- UK's independent data protection regulator
- Enforces UK GDPR and Data Protection Act 2018
- Must be notified of data breaches within 72 hours
- Can impose fines up to £17.5 million or 4% of turnover

### Common UK Government Security Requirements

**Cyber Essentials Controls**:
- Firewalls and internet gateways configured
- Secure configuration (CIS benchmarks)
- User access control (least privilege, MFA)
- Malware protection (up-to-date anti-malware)
- Security update management (patching within 14 days)

**Cloud Hosting**:
- Prefer UK or EU data centers for data residency
- NCSC Cloud Security Principles compliance
- Cloud provider certifications (ISO 27001, etc.)
- Clear data ownership and portability

**Network Security**:
- PSN (Public Services Network) connectivity if required
- Network segmentation by sensitivity
- VPN for remote access
- WiFi security (WPA3 preferred, WPA2 minimum)

## Example Output Structure

```markdown
# UK Government Secure by Design Assessment

**Project**: HMRC Tax Credits Modernization
**Department**: HMRC
**Data Classification**: OFFICIAL-SENSITIVE
**NCSC CAF Score**: 11/14 Achieved

## NCSC CAF Assessment

### Objective A: Managing Security Risk

#### A1: Governance
**Status**: ✅ Achieved
**Evidence**: SIRO appointed (Director of Digital Services), security policies approved, quarterly security reviews...

#### A2: Risk Management
**Status**: ⚠️ Partially Achieved
**Evidence**: Risk register exists, but threat modeling incomplete...
**Gaps**:
- Complete threat modeling for payment processing (HIGH - 30 days)
- Update risk register with emerging threats (MEDIUM - 60 days)

### Objective B: Protecting Against Cyber Attack

#### B3: Data Security
**Status**: ⚠️ Partially Achieved
**Evidence**: TLS 1.3 in transit, AES-256 at rest, but DPIA not completed...
**Gaps**:
- Complete DPIA before Beta (CRITICAL - blocker for Beta phase)
- Implement Data Loss Prevention (HIGH - 90 days)

## Cyber Essentials

**Status**: Certified Basic (expires 2024-06-30)
**Target**: Cyber Essentials Plus by Beta

**Gaps**:
- External vulnerability scan required for Plus certification

## UK GDPR Compliance

**Status**: ⚠️ Partially Compliant
**DPO**: Appointed ([Data Protection Officer Name])
**DPIA**: Not completed (REQUIRED before Beta)

**Critical Issues**:
1. DPIA not completed for tax credit processing (CRITICAL)
2. Data retention policy not documented (HIGH)

## Critical Issues
1. DPIA incomplete (CAF B3, UK GDPR) - Blocks Beta phase
2. Threat modeling incomplete (CAF A2) - Significant risk gap

## Recommendations
**Critical** (0-30 days):
- Complete DPIA - DPO - 15 days
- Complete threat model - Security Architect - 30 days
```

## Important Notes

- **NCSC CAF is the standard framework** for UK Government security assessment
- **Cyber Essentials is mandatory** for most government contracts
- **UK GDPR compliance is legally required** for personal data processing
- **SIRO sign-off required** for security risk acceptance
- **Data classification drives security controls** - OFFICIAL-SENSITIVE requires stronger controls
- **Penetration testing** recommended annually minimum
- **Incident response** - 72-hour reporting to ICO for personal data breaches
- **Cloud First** - prefer cloud hosting, assess against NCSC Cloud Security Principles

## Related UK Government Standards

- NCSC Cyber Assessment Framework (CAF)
- Cyber Essentials Scheme
- UK Government Security Classifications
- Government Functional Standard GovS 007: Security
- NCSC Cloud Security Principles
- HMG Security Policy Framework
- Public Services Network (PSN) Code of Connection

## Resources

- NCSC CAF: https://www.ncsc.gov.uk/collection/caf
- Cyber Essentials: https://www.ncsc.gov.uk/cyberessentials
- UK GDPR: https://ico.org.uk/for-organisations/guide-to-data-protection/
- Government Security Classifications: https://www.gov.uk/government/publications/government-security-classifications
- NCSC Guidance: https://www.ncsc.gov.uk/guidance

Generate the UK Government Secure by Design assessment now based on the project information provided.
