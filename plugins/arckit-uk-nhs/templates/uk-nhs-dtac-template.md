# NHS Digital Technology Assessment Criteria (DTAC v3) — [PRODUCT_NAME]

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:uk-nhs-dtac`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---|---|---|---|---|---|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:uk-nhs-dtac` command | PENDING | PENDING |

---

## DTAC Version

DTAC **v3** (current as at 2026-05). Verify against <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/> before submission to an NHS buyer or assurance team — if a newer version is published, the section structure may have changed.

---

## Executive Summary

[One to two paragraphs: product under assessment, target NHS context, overall DTAC status (e.g. "passes 4 of 5 sections; Section 1 PENDING DCB0129 sign-off"), key gaps, and the recommended next assurance steps.]

### Pass / partial / fail by section

| Section | Status | Notes |
|---|---|---|
| 1. Clinical Safety (DCB0129 / DCB0160) | [PASS / PARTIAL / FAIL / PENDING] | |
| 2. Data Protection (UK GDPR / DPA 2018 / DSPT) | [PASS / PARTIAL / FAIL / PENDING] | |
| 3. Technical Assurance (security, lifecycle, BC/DR) | [PASS / PARTIAL / FAIL / PENDING] | |
| 4. Interoperability (FHIR UK Core, SNOMED, NHS APIs) | [PASS / PARTIAL / FAIL / PENDING] | |
| 5. Usability and Accessibility (WCAG 2.2 AA) | [PASS / PARTIAL / FAIL / PENDING] | |
| AI annex (if applicable) | [N/A / PASS / PARTIAL / FAIL / PENDING] | |

---

## Product summary

| Field | Value |
|---|---|
| **Product Name** | [PRODUCT_NAME] |
| **Manufacturer** | [MANUFACTURER_LEGAL_ENTITY] |
| **Product Version** | [VERSION] |
| **Target NHS Context** | [Primary care / Secondary care / Community / Mental health / ICS / National] |
| **Intended Users** | [Clinical roles] |
| **Intended Patient Population** | [Population] |
| **Medical Device?** | [Yes — Class / No / Borderline — cross-ref `/arckit:uk-mdr-classification`] |
| **Uses AI / ML?** | [Yes — describe / No] |
| **Hosting** | [Cloud provider + region / On-premise] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## Section 1 — Clinical Safety

### 1.1 DCB0129 Manufacturer Case

| Criterion | Status | Evidence / cross-reference |
|---|---|---|
| Clinical Safety Officer appointed (named, registered) | [PASS / FAIL / PENDING] | [CSO name + registration in `clinical-safety/SAFETY.md`] |
| Clinical Risk Management Plan documented | [PASS / FAIL] | [`clinical-safety/SAFETY.md` summary / `SAFETY-PLAN.md` if Tier 3] |
| Clinical Safety Case Report present and current | [PASS / FAIL / PENDING] | [`clinical-safety/SAFETY-CASE.md`] |
| Hazard Log maintained | [PASS / FAIL] | [`clinical-safety/HAZARD-LOG.md` — N open hazards, highest open risk: ___] |
| CSO sign-off in place | [PASS / PENDING] | [Sign-off section in `SAFETY-CASE.md`] |

### 1.2 DCB0160 Deployer Case (if applicable to assessment context)

| Criterion | Status | Evidence / cross-reference |
|---|---|---|
| Deployer CSO appointed at deploying organisation | [PASS / FAIL / N/A — manufacturer assessment only] | |
| Deployment Clinical Safety Case Report | [PASS / FAIL / N/A] | [`clinical-safety/deployment/DEPLOYMENT-SAFETY-CASE.md`] |
| Deployment Hazard Log | [PASS / FAIL / N/A] | [`clinical-safety/deployment/DEPLOYMENT-HAZARD-LOG.md`] |

> If `clinical-safety/SAFETY-CASE.md` or `clinical-safety/HAZARD-LOG.md` are absent, run `/arckit:uk-nhs-dcb0129` to seed them before completing this section.

---

## Section 2 — Data Protection

### 2.1 UK GDPR / DPA 2018 lawful basis

| Criterion | Status | Evidence |
|---|---|---|
| Article 6 lawful basis identified | [PASS / FAIL] | [Lawful basis + rationale] |
| Article 9 special-category basis identified (if applicable) | [PASS / N/A] | [Basis + rationale] |
| Common Law Duty of Confidentiality satisfied | [PASS / FAIL] | [Caldicott / consent / s251 / direct care basis] |

### 2.2 DPIA

| Criterion | Status | Evidence |
|---|---|---|
| DPIA conducted and current | [PASS / FAIL / PENDING] | [Cross-reference `ARC-{PID}-DPIA-*.md`] |
| High-risk findings mitigated | [PASS / FAIL] | [Mitigation tracker] |

### 2.3 NHS Data Security and Protection Toolkit (DSPT)

| Criterion | Status | Evidence |
|---|---|---|
| DSPT submission in date | [PASS / FAIL / PENDING — organisation responsibility] | [Submission reference + expiry] |
| DSPT 'Standards Met' status | [PASS / FAIL / PENDING] | |

### 2.4 Sub-processors and cross-border transfers

| Sub-processor | Service | Location | Transfer mechanism | UK addendum / IDTA |
|---|---|---|---|---|
| | | | | |

### 2.5 Data subject rights

| Right | Implementation |
|---|---|
| Access (Article 15) | [How exercised] |
| Rectification (Article 16) | |
| Erasure (Article 17) | [If applicable — note exemptions for clinical records] |
| Restriction (Article 18) | |
| Portability (Article 20) | [If applicable] |
| Objection (Article 21) | |

---

## Section 3 — Technical Assurance

### 3.1 Hosting

| Criterion | Status | Evidence |
|---|---|---|
| Cloud provider | | [AWS / Azure / Google Cloud / UKCloud / Other] |
| UK region status | [PASS / FAIL] | [Region + data-residency commitment] |
| Sovereign cloud considerations | [Document if applicable] | |

### 3.2 Security certifications

| Criterion | Status | Evidence |
|---|---|---|
| Cyber Essentials | [PASS / FAIL / PENDING] | [Certificate + expiry] |
| Cyber Essentials Plus | [PASS / FAIL / N/A] | |
| ISO 27001 | [PASS / FAIL / N/A] | [Scope + certifying body] |
| SOC 2 Type II | [PASS / FAIL / N/A] | |

### 3.3 Software lifecycle

| Criterion | Status | Evidence |
|---|---|---|
| Documented SDLC | [PASS / FAIL] | |
| Code review on every change | [PASS / FAIL] | |
| Dependency scanning | [PASS / FAIL] | [Tool + cadence] |
| Software Bill of Materials (SBOM) | [PASS / FAIL] | [Format + accessibility] |

### 3.4 Encryption

| Criterion | Status | Evidence |
|---|---|---|
| In transit (TLS 1.2 minimum, TLS 1.3 preferred) | [PASS / FAIL] | |
| At rest (AES-256 or equivalent) | [PASS / FAIL] | |
| Key management | [PASS / FAIL] | [KMS / HSM details] |

### 3.5 Penetration testing

| Criterion | Status | Evidence |
|---|---|---|
| Independent pen test conducted in last 12 months | [PASS / FAIL / PENDING] | [Test date + scope] |
| All HIGH findings remediated or risk-accepted | [PASS / FAIL] | [Remediation log] |

### 3.6 Business continuity / disaster recovery

| Criterion | Target | Evidence |
|---|---|---|
| Recovery Time Objective (RTO) | [hours] | |
| Recovery Point Objective (RPO) | [hours] | |
| BC test cadence | [annual / biannual] | [Last test date + outcome] |

### 3.7 Vulnerability management

| Criterion | Status | Evidence |
|---|---|---|
| CVSS-rated SLAs for patching | [PASS / FAIL] | [HIGH within X days, MEDIUM within Y days] |
| Cross-reference Secure by Design assessment | [PASS / FAIL] | [`ARC-{PID}-SECD-*.md`] |

---

## Section 4 — Interoperability

### 4.1 Standards adopted

| Standard | Version / scope | Status |
|---|---|---|
| FHIR UK Core | [version] | [Conformant / Partial / N/A] |
| SNOMED CT UK Edition | [release] | |
| dm+d (if prescribing) | [release] | |
| HL7 v2 (if legacy integration) | [profile] | |

### 4.2 NHS Number handling

| Criterion | Status | Evidence |
|---|---|---|
| NHS Number is canonical patient identifier | [PASS / FAIL] | |
| PDS lookup with demographic trace on new records | [PASS / FAIL] | |
| NHS Number validation (Mod 11 check) | [PASS / FAIL] | |

### 4.3 NHS APIs

| API | Use | Status |
|---|---|---|
| Personal Demographics Service (PDS) | [Lookup / trace] | [Live / Pilot / N/A] |
| e-Referral Service (e-RS) | | |
| GP Connect | [Access record / Appointments / Send Document] | |
| NHS App Connect | | |
| NHS login | [Identity verification] | |
| BARS (Booking and Referral Standard) | | |
| IM1 (where applicable) | | |

### 4.4 Open standards conformance

| Criterion | Status | Evidence |
|---|---|---|
| OpenAPI specification published | [PASS / FAIL] | [URL] |
| API documentation accessible | [PASS / FAIL] | [URL] |
| Implementation guide aligned with NHS Interoperability Standards Catalogue | [PASS / FAIL] | [Catalogue reference] |

---

## Section 5 — Usability and Accessibility

### 5.1 NHS Service Standard alignment

| Service Standard point | Status | Evidence |
|---|---|---|
| Understand users and their needs | [PASS / FAIL] | [User research evidence] |
| Solve a whole problem for users | [PASS / FAIL] | |
| Provide a joined-up experience across channels | [PASS / FAIL] | |
| Make the service simple to use | [PASS / FAIL] | |
| Make sure everyone can use the service | [PASS / FAIL] | |
| Have a multi-disciplinary team | [PASS / FAIL] | |
| Use agile ways of working | [PASS / FAIL] | |
| Iterate and improve frequently | [PASS / FAIL] | |
| Create a secure service which protects users' privacy | [Cross-ref §2 + §3] | |
| Define what success looks like and publish performance data | [PASS / FAIL] | |
| Choose the right tools and technology | [Cross-ref §3] | |
| Make new source code open | [PASS / FAIL / N/A] | |
| Use and contribute to open standards, common components and patterns | [PASS / FAIL] | |
| Operate a reliable service | [Cross-ref §3] | |

### 5.2 WCAG 2.2 AA accessibility

| Criterion | Status | Evidence |
|---|---|---|
| Independent accessibility audit in last 12 months | [PASS / FAIL / PENDING] | [Audit date + auditor] |
| All Level A criteria pass | [PASS / FAIL] | |
| All Level AA criteria pass | [PASS / FAIL] | |
| Accessibility statement published | [PASS / FAIL] | [URL] |
| Screen reader tested (NVDA + VoiceOver + JAWS) | [PASS / FAIL] | |
| Keyboard-only navigation supported | [PASS / FAIL] | |
| Colour contrast ≥ 4.5:1 for normal text | [PASS / FAIL] | |
| Plain English / reading age | [Reading age target met] | |

---

## AI Annex (DTAC AI Module)

> Complete this annex only if the product uses AI / ML for any clinically-relevant function. Otherwise state: "No AI / ML components — annex N/A."

### A.1 AI usage

| Field | Value |
|---|---|
| Uses AI / ML? | [Yes / No — if No, annex is N/A] |
| Model class | [Rule-based / Classical ML / Deep learning / Foundation model / Agentic LLM] |
| Clinical function performed by AI | [Decision support / triage / risk score / summarisation / etc.] |
| Vendor of AI component | [In-house / named third party] |

### A.2 Model governance

| Criterion | Status | Evidence |
|---|---|---|
| Training-data provenance documented | [PASS / FAIL] | |
| Training-data consent basis | [PASS / FAIL] | |
| Training-data clinical representativeness assessed | [PASS / FAIL] | |
| Model card published | [PASS / FAIL] | [URL] |
| ATRS record published (cross-reference `/arckit:atrs`) | [PASS / FAIL / PENDING] | [`ARC-{PID}-ATRS-*.md`] |

### A.3 Fairness and bias

| Criterion | Status | Evidence |
|---|---|---|
| Protected characteristics evaluated (sex, age, ethnicity, etc.) | [PASS / FAIL] | |
| Performance parity across groups | [PASS / FAIL] | [Metrics + thresholds] |
| Bias mitigation actions documented | [PASS / FAIL] | |

### A.4 Operational monitoring

| Criterion | Status | Evidence |
|---|---|---|
| Model drift monitoring approach | [PASS / FAIL] | [Metrics + cadence + thresholds] |
| Human-in-the-loop / human-on-the-loop design | [PASS / FAIL] | [Where humans intervene] |
| Substantial-change handling | [PASS / FAIL] | [What triggers reassessment under MDR if AIaMD] |

### A.5 Transparency

| Criterion | Status | Evidence |
|---|---|---|
| Plain-English explanation available to clinicians | [PASS / FAIL] | |
| Plain-English explanation available to patients | [PASS / FAIL] | |
| Confidence / uncertainty surfaced in the UI | [PASS / FAIL] | |

### A.6 MHRA AIaMD Programme alignment

| MHRA AIaMD WP | Applicability | Status |
|---|---|---|
| WP1 Software | | |
| WP6 AIaMD | | |
| WP9 Cyber Security | | |
| WP11 Best Practice for Manufacturers | | |

---

## External References

| Doc ID | Title | Source | Used in |
|---|---|---|---|
| DTAC-V3 | NHS Digital Technology Assessment Criteria v3 | NHS England Transformation Directorate | Throughout |
| DCB0129 | Clinical Risk Management — Manufacture of Health IT | NHS England | §1 |
| DCB0160 | Clinical Risk Management — Deployment | NHS England | §1 |
| UK-GDPR | UK General Data Protection Regulation | Information Commissioner | §2 |
| DPA-2018 | Data Protection Act 2018 | UK Parliament | §2 |
| DSPT | NHS Data Security and Protection Toolkit | NHS Digital | §2 |
| WCAG-2.2 | Web Content Accessibility Guidelines 2.2 | W3C | §5 |
| NHS-SVC-STD | NHS Service Standard | NHS Service Manual | §5 |
| ATRS | Algorithmic Transparency Recording Standard | CDEI / DSIT | AI annex |
| MHRA-AIAMD | MHRA Software and AI as a Medical Device Programme | MHRA | AI annex |

---

**Generated by**: ArcKit `/arckit:uk-nhs-dtac` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
