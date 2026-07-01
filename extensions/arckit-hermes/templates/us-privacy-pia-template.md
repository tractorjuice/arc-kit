# Privacy Impact Assessment (E-Government Act §208)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-privacy-pia`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-privacy-pia` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: system being assessed, PII processed, lawful authority, Privacy Act applicability (SoR? new SORN required?), residual privacy risks, and SAOP sign-off status.]

---

## 1. System Overview

| Field | Value |
|-------|-------|
| **System Name** | [Name] |
| **System Acronym** | [Acronym] |
| **Agency** | [Agency] |
| **Bureau / Component** | [Bureau] |
| **System Owner** | [Name + role] |
| **Senior Agency Official for Privacy (SAOP)** | [Name + role] |
| **Project Phase** | [Initiation / Development / Operations / Decommissioned] |
| **Project Purpose** | [What the system does] |
| **PIA Trigger** | [New system / Substantial change / Periodic review / Privacy Act SoR change] |
| **Cross-ref FISMA Categorization** | [ARC-{P}-FISMA-v*] |
| **Cross-ref AI Impact Assessment (if AI used)** | [ARC-{P}-AIIA-v*] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## 2. PII Inventory

| Data Element | Source | Lawful Authority | Use | Disclosure | Retention | Disposal Method |
|--------------|--------|------------------|-----|-----------|-----------|-----------------|
| Full name | [Individual / agency partner] | [Statutory citation] | [Identity proofing; correspondence] | [Internal only; SOR routine use #1] | [Per NARA schedule N1-NNN] | [Cryptographic erasure] |
| Social Security Number (SSN) | [Individual / IRS / SSA] | [E.g., 26 USC §6109; Pub L 93-579 §7] | [Benefits eligibility verification] | [SSA matching agreement; SOR routine use #2] | [7 years post-decision] | [Cryptographic erasure + NIST SP 800-88 sanitisation] |
| Date of birth | [Individual] | [Statutory citation] | [Identity proofing; eligibility] | [Internal only] | [Per NARA schedule N1-NNN] | [Cryptographic erasure] |
| Residential address | [Individual] | [Statutory citation] | [Correspondence; jurisdictional eligibility] | [USPS for mailing only] | [Per NARA schedule N1-NNN] | [Cryptographic erasure] |
| Email address | [Individual] | [Statutory citation] | [Service notifications; account recovery] | [None — internal only] | [Per NARA schedule N1-NNN] | [Cryptographic erasure] |
| Biometric data (facial template, fingerprint) | [Individual via login.gov / agency enrolment] | [HSPD-12 / agency-specific authority] | [Identity proofing IAL3] | [None — held only by issuer] | [Per FIPS 201-3 — lifetime of credential + N years] | [Crypto-erasure + physical destruction of biometric template store] |

[Add additional rows for every PII element processed.]

---

## 3. Lawful Authority

| Authority Type | Citation | Applies To |
|----------------|----------|-----------|
| Statute | [E.g., 5 USC §301; 31 USC §3101; agency enabling statute] | [Collection of named PII elements] |
| Executive Order | [EO citation] | [Specific elements / processing] |
| Agency Regulation | [CFR citation] | [Specific processing] |
| OMB Memorandum | [OMB memo citation] | [Specific processing] |
| Privacy Act Routine Use | [SOR citation + routine use number] | [Specific disclosures] |

[Document the complete legal basis for each PII collection and processing activity.]

---

## 4. Privacy Act (5 USC §552a) Alignment

| Question | Answer |
|----------|--------|
| Is this a System of Records (SoR) under the Privacy Act? | [Yes / No] |
| If Yes, applicable SORN(s) | [Agency-XX-NNN; published Federal Register YYYY-MM-DD] |
| If Yes, are records retrieved by personal identifier? | [Yes — identifiers listed] |
| If new SoR being created — SORN drafting plan | [Target Federal Register publication date; OMB / Congressional notice 60-day clock start date] |
| If existing SoR being modified — modification plan | [Modified SORN draft; OMB / Congressional notice timing] |
| Privacy Act §(e)(3) notice provided at collection? | [Yes — notice text linked / No — justification] |
| Privacy Act §(e)(10) safeguards? | [Cross-ref security controls in 800-53 artefact] |
| Routine uses documented? | [Yes — list / No — gap to close] |

[A SORN is required for any system of records covered by the Privacy Act before any record can be collected. Plan the publication timeline accordingly.]

---

## 5. SORN Trigger Check (OMB M-03-22 Decision Tree)

| Question | Answer |
|----------|--------|
| 1. Does the system collect, maintain, use, or disseminate information about individuals? | [Yes / No] |
| 2. Is the information about *federal employees, federal contractors, or members of the public*? | [Yes / No] |
| 3. Will records be retrieved by a personal identifier (name, SSN, biometric, employee ID)? | [Yes / No] |
| 4. Is this system already covered by an existing published SORN? | [Yes — cite SORN / No] |

**SORN Outcome**: [No new SORN required (covered by existing SORN X) / Existing SORN modification required / New SORN required] — [Rationale]

---

## 6. OMB M-03-22 Conformance Checklist

| Privacy Principle | Status | Evidence | Gap | Action |
|-------------------|--------|----------|-----|--------|
| Notice | [Met / Gap] | [Notice text + posting location] | [Gap] | [Action] |
| Choice (opt-in / opt-out where applicable) | [Met / Gap] | [Mechanism] | [Gap] | [Action] |
| Access (individual's right to inspect their record) | [Met / Gap] | [Process + form] | [Gap] | [Action] |
| Security (cross-ref 800-53 controls) | [Met / Gap] | [Cross-ref ARC-{P}-NIST53-v*] | [Gap] | [Action] |
| Accountability (designated SAOP, training, audit) | [Met / Gap] | [SAOP designation; training records] | [Gap] | [Action] |
| Data Quality (accuracy, completeness, timeliness) | [Met / Gap] | [Validation processes] | [Gap] | [Action] |
| Transparency (publication of PIA + SORN) | [Met / Gap] | [Publication URL] | [Gap] | [Action] |

---

## 7. Privacy Risk Analysis

| Risk ID | Risk Description | Likelihood | Impact | Mitigation | Residual Risk | Owner |
|---------|------------------|-----------|--------|-----------|---------------|-------|
| PR-001 | [Unauthorised disclosure of SSN via misconfigured S3 bucket] | [Low] | [High] | [SSE-KMS + bucket policy + drift detection + DLP scanning] | [Low] | [Platform team] |
| PR-002 | [Aggregation enabling re-identification of de-identified records] | [Medium] | [Med] | [Differential privacy on aggregated outputs; minimum cell-size suppression] | [Low] | [Data team] |
| PR-003 | [Cross-system data flow disclosing PII outside lawful authority] | [Low] | [High] | [Data-loss-prevention + interconnection security agreements] | [Low] | [Privacy office] |
| PR-004 | [Retention beyond NARA schedule] | [Medium] | [Low] | [Automated retention enforcement; quarterly disposal report] | [Low] | [Records officer] |

---

## 8. Mitigation Tracker

| Mitigation ID | Linked Risk | Mitigation Description | Target Date | Owner | Status |
|---------------|------------|------------------------|-------------|-------|--------|
| MT-001 | PR-001 | [Implement DLP across object storage] | [YYYY-MM-DD] | [Owner] | [Open / In Progress / Closed] |

---

## 9. Agency SAOP Sign-Off

| Sign-Off Item | SAOP Statement |
|---------------|----------------|
| PII inventory complete and accurate | [Concur / Concur with conditions / Returned] |
| Lawful authority documented for every PII element | [Concur / Concur with conditions / Returned] |
| Privacy Act / SORN compliance confirmed | [Concur / Concur with conditions / Returned] |
| OMB M-03-22 principles satisfied | [Concur / Concur with conditions / Returned] |
| Privacy risks identified and mitigated to acceptable residual level | [Concur / Concur with conditions / Returned] |

**SAOP Signature**: [Name + signature + date]

---

## 10. Public Posting Plan

| Element | Status |
|---------|--------|
| PIA approved for public posting? | [Yes / No — partial redaction] |
| If partial redaction, citation of exception | [E.g., 6 USC §1523(b)(3)(C) — law-enforcement-sensitive] |
| Target publication URL | [https://www.agency.gov/privacy/pias/...] |
| Target publication date | [YYYY-MM-DD] |
| Linked SORN published in Federal Register | [Yes — citation / No — pending] |

---

## 11. References

| Reference | Citation | URL |
|-----------|----------|-----|
| E-Government Act of 2002 §208 | Privacy Impact Assessment requirement | <https://www.congress.gov/107/plaws/publ347/PLAW-107publ347.pdf> |
| OMB M-03-22 | Guidance for Implementing the Privacy Provisions of the E-Government Act of 2002 | <https://www.whitehouse.gov/wp-content/uploads/2017/11/203-M-03-22-OMB-Guidance-for-Implementing-the-Privacy-Provisions-of-the-E-Government-Act-of-2002-1.pdf> |
| Privacy Act of 1974 | 5 USC §552a | <https://www.justice.gov/opcl/privacy-act-1974> |
| NIST SP 800-122 | Guide to Protecting the Confidentiality of PII | <https://doi.org/10.6028/NIST.SP.800-122> |
| OMB Circular A-108 | Federal Agency Responsibilities for Review, Reporting, and Publication under the Privacy Act | <https://www.whitehouse.gov/wp-content/uploads/legacy_drupal_files/omb/circulars/A108/omb_circular_a-108.pdf> |

---

## 12. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| System Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| Privacy Officer | [Name] | [Signature] | [YYYY-MM-DD] |
| Senior Agency Official for Privacy (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency General Counsel | [Name] | [Signature] | [YYYY-MM-DD] |
| Authorising Official (AO) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-privacy-pia` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
