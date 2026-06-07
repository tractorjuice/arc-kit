# NIST SP 800-53 Rev 5 Tailored Control Set

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-nist-800-53`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-nist-800-53` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: scope of the tailored control set, the baseline selected (Low / Moderate / High), the catalog used (FedRAMP Rev 5 vs Agency Rev 5), summary of inherited vs implemented controls, and any significant tailoring decisions (controls added, removed, or compensated).]

---

## 1. Baseline Selection

| Field | Value |
|-------|-------|
| **FIPS 199 High-Water Mark** | [LOW / MODERATE / HIGH — cross-ref `ARC-{P}-FISMA-v*`] |
| **Selected Control Baseline** | [Low / Moderate / High] |
| **Baseline Source** | [NIST SP 800-53B / FedRAMP Rev 5 / Agency Overlay] |
| **Catalog Version** | [NIST SP 800-53 Rev 5.1.1 / FedRAMP Rev 5 Baselines vNN] |
| **Total Controls in Baseline** | [Count] |
| **Tailoring Rationale** | [Brief narrative — why this baseline matches the system's risk profile and mission] |

---

## 2. FedRAMP vs Agency Baseline

| Aspect | Selection | Rationale |
|--------|-----------|-----------|
| **Catalog tailored against** | [FedRAMP Rev 5 / Agency Rev 5 / Hybrid] | [Why] |
| **CSP-hosted?** | [Yes — CSP name / No] | [If CSP-hosted and pursuing FedRAMP authorisation, the FedRAMP baseline is the canonical tailoring source.] |
| **Agency-specific overlay applied** | [Yes — overlay reference / No] | [E.g., DoD CC SRG IL2/IL4/IL5, IRS Pub 1075, CJIS, HHS ePHI] |

---

## 3. Control Family Summary

| Family Code | Family Name | Baseline Controls | Implemented | Inherited | Hybrid | Not Applicable | Planned |
|-------------|------------|-------------------|-------------|-----------|--------|----------------|---------|
| AC | Access Control | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| AT | Awareness and Training | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| AU | Audit and Accountability | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| CA | Assessment, Authorization, and Monitoring | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| CM | Configuration Management | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| CP | Contingency Planning | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| IA | Identification and Authentication | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| IR | Incident Response | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| MA | Maintenance | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| MP | Media Protection | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| PE | Physical and Environmental Protection | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| PL | Planning | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| PM | Program Management | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| PS | Personnel Security | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| PT | PII Processing and Transparency | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| RA | Risk Assessment | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| SA | System and Services Acquisition | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| SC | System and Communications Protection | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| SI | System and Information Integrity | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |
| SR | Supply Chain Risk Management | [Count] | [Count] | [Count] | [Count] | [Count] | [Count] |

---

## 4. Tailoring Matrix

| Control ID | Control Title | Baseline | Implementation Status | Inheritance Source | Parameter Assignments | Compensating Controls | Notes |
|-----------|---------------|----------|----------------------|--------------------|----------------------|----------------------|-------|
| AC-2 | Account Management | [Mod] | [Implemented] | [N/A] | [Account types: Individual, Shared, Service, Application] | [None] | [Cross-ref ICAM artefact] |
| AC-2(2) | Automated Temporary and Emergency Account Management | [Mod] | [Implemented] | [N/A] | [Org-defined period: 30 days] | [None] | [Inactive accounts disabled at 30 days] |
| AC-17 | Remote Access | [Mod] | [Hybrid] | [CSP: AWS GovCloud — VPN substrate] | [Authorised remote access: VPN, BeyondCorp] | [None] | [Customer responsibility: device posture] |
| AU-2 | Event Logging | [Mod] | [Implemented] | [Partial — CSP logs network plane] | [Auditable events: §AU-2.a] | [None] | [Cross-ref ConMon plan] |
| AU-6 | Audit Record Review, Analysis, and Reporting | [Mod] | [Implemented] | [N/A] | [Review frequency: daily; reporting: weekly to SOC] | [None] | [SIEM-driven; alerts triaged in-platform] |
| CM-6 | Configuration Settings | [Mod] | [Implemented] | [N/A] | [Common Secure Configurations: DISA STIG / CIS Benchmarks Level 1] | [None] | [Compliance scanner: quarterly] |
| CP-9 | System Backup | [Mod] | [Inherited] | [CSP: AWS Backup cross-region] | [Frequency: daily; retention: 90 days] | [None] | [Customer validates restore quarterly] |
| IA-2(1) | MFA to Privileged Accounts | [Mod] | [Implemented] | [N/A] | [Phishing-resistant authenticator required] | [None] | [Cross-ref Zero Trust Identity pillar] |
| IR-4 | Incident Handling | [Mod] | [Implemented] | [N/A] | [IR Plan: ARC-{P}-IR-v*] | [None] | [US-CERT reporting: 1 hour] |
| RA-5 | Vulnerability Monitoring and Scanning | [Mod] | [Implemented] | [N/A] | [Scan frequency: weekly authenticated; monthly external] | [None] | [Cross-ref ConMon] |
| SC-7 | Boundary Protection | [Mod] | [Hybrid] | [CSP: AWS WAF / Shield] | [Egress filtering: deny-by-default] | [None] | [Customer responsibility: WAF rules] |
| SI-2 | Flaw Remediation | [Mod] | [Implemented] | [N/A] | [Patch windows: High = 30 days, Med = 90 days] | [None] | [Tracked via vulnerability-management platform] |

[Continue for every control in the baseline. For inherited controls, identify the FedRAMP-authorised CSP and the customer responsibility carry-over per the CRM.]

---

## 5. Parameter Assignments by Family

### AC — Access Control

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| AC-2(2) | Account inactivity period | [30 days] |
| AC-2(3) | Disable accounts after inactivity | [60 days] |
| AC-7 | Failed login attempts | [5 attempts; lockout 15 minutes] |
| AC-11 | Session lock after inactivity | [15 minutes] |
| AC-12 | Session termination after inactivity | [60 minutes] |

### AU — Audit and Accountability

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| AU-4 | Audit log storage capacity | [Retain online ≥ 90 days; archive ≥ 1 year] |
| AU-5 | Audit failure response | [Alert SOC; shift to backup logging] |
| AU-11 | Audit record retention | [3 years per NARA / agency schedule] |

### CP — Contingency Planning

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| CP-2 | Contingency plan review frequency | [Annual + after material change] |
| CP-4 | Contingency plan testing frequency | [Annual tabletop + every 3 years functional] |
| CP-9 | Backup frequency | [Daily incremental; weekly full] |

### IA — Identification and Authentication

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| IA-2 | MFA assurance level | [AAL2 standard users / AAL3 privileged] |
| IA-5 | Password complexity | [NIST SP 800-63B Section 5.1.1.2] |

### IR — Incident Response

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| IR-2 | Incident response training frequency | [Annual + on role change] |
| IR-3 | Incident response testing frequency | [Annual + after major change] |
| IR-6 | Incident reporting timeframes | [US-CERT: 1 hour; Agency CISO: 30 minutes] |

### SI — System and Information Integrity

| Control | Parameter | Org-Defined Value |
|---------|-----------|-------------------|
| SI-2 | Flaw remediation timeframes | [Critical = 15 days; High = 30 days; Med = 90 days] |
| SI-4 | System monitoring | [Continuous (24/7); detection signatures updated daily] |

---

## 6. Compensating Controls Register

When a baseline control cannot be implemented as written, document the alternative.

| Control ID | Reason Not Implemented | Compensating Control | Equivalent Risk Mitigation | Owner | Approval |
|-----------|------------------------|---------------------|----------------------------|-------|----------|
| [Control] | [Reason] | [Alternative] | [Equivalence narrative] | [Role] | [AO sign-off] |

---

## 7. Cloud Service Provider Inheritance

### Inherited FedRAMP-Authorised Services

| CSP | Service | FedRAMP Authorisation ID | Baseline | Customer Responsibility Matrix Reference |
|-----|---------|--------------------------|----------|----------------------------------------|
| [AWS GovCloud] | [Service] | [FR-MOD-NNNNN] | [Moderate / High] | [CRM URL / artefact] |
| [Azure Government] | [Service] | [FR-MOD-NNNNN] | [Moderate / High] | [CRM URL / artefact] |

### Customer Responsibility Matrix (Summary)

| Control Family | Provider Provides | Customer Configures | Joint |
|----------------|-------------------|---------------------|-------|
| AC | [Authentication primitives] | [Account lifecycle, role definitions] | [SSO integration] |
| AU | [Network plane logs] | [Application-tier logs, retention] | [Aggregation] |
| SC | [Encryption primitives] | [Encryption-key policy, certificate management] | [WAF rules] |
| SI | [Patching the platform] | [Patching customer workloads] | [Vulnerability disclosure] |

[Full CRM mapping per inherited CSP referenced in `external/` or vendor portal.]

---

## 8. Continuous Monitoring Strategy Summary

| Activity | Frequency | Owner | Output |
|---------|-----------|-------|--------|
| Authenticated vulnerability scan | [Weekly] | [SOC / SecOps] | [Scan report] |
| External attack-surface scan | [Monthly] | [SOC] | [External scan] |
| Configuration compliance scan | [Quarterly] | [Platform team] | [Drift report] |
| POA&M review | [Monthly] | [ISSO] | [POA&M update] |
| Control assessment (annual subset) | [Annual — 1/3 of controls] | [AO + 3PAO] | [Assessment report] |
| Penetration test | [Annual] | [3PAO] | [Pentest report] |

[Cross-ref `/arckit:us-fedramp-ssp` Section 13 for full ConMon plan.]

---

## 9. References

| Reference | Citation | URL |
|-----------|----------|-----|
| NIST SP 800-53 Rev 5 | Security and Privacy Controls for Information Systems and Organizations | <https://doi.org/10.6028/NIST.SP.800-53r5> |
| NIST SP 800-53B | Control Baselines for Information Systems and Organizations | <https://doi.org/10.6028/NIST.SP.800-53B> |
| FedRAMP Rev 5 Baselines | FedRAMP Moderate / High / Low Baselines | <https://www.fedramp.gov/baselines/> |
| OSCAL | Open Security Controls Assessment Language | <https://pages.nist.gov/OSCAL/> |
| FedRAMP CRM Template | Customer Responsibility Matrix Template | <https://www.fedramp.gov/documents-templates/> |

---

## 10. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| Information System Security Officer (ISSO) | [Name] | [Signature] | [YYYY-MM-DD] |
| Authorising Official (AO) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-nist-800-53` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
