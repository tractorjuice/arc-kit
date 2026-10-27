# NHS Digital Technology Assessment Criteria (DTAC) — [PRODUCT_NAME]

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

This assessment follows the **DTAC form version 2.0**, published by NHS England on 24 February 2026. From 6 April 2026 manufacturers must provide version 2.0 in place of the older version 1.0 form. Check <https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac> for a later form before submission: NHS England asks that the form be downloaded at the point of use.

This artefact prepares the answers and evidence for that form. It does not replace it: NHS buyers are asked to accept the standard NHS England form and not amended versions, so the submission itself is the completed NHS England form plus its supporting documents.

---

## Executive Summary

[One to two paragraphs: product under assessment, target NHS context, overall DTAC position (e.g. "C2–C4 pass; C1 PENDING DCB0129 sign-off; D1 responses recorded"), key gaps, and the recommended next assurance steps.]

### Status by section

Sections A and B give context and are not assessed. Sections C1–C4 are assessed: the product must meet them to pass. Section D1 is scored to help buyers compare products and does not count towards pass or fail.

| Section | Assessed? | Status | Notes |
|---|---|---|---|
| A. Company information | Not assessed | [COMPLETE / PENDING] | |
| B. Value proposition | Not assessed | [COMPLETE / PENDING] | |
| C1. Clinical safety | Assessed | [PASS / FAIL / PENDING] | |
| C2. Data protection | Assessed | [PASS / FAIL / PENDING] | |
| C3. Technical security | Assessed | [PASS / FAIL / PENDING] | |
| C4. Interoperability | Assessed | [PASS / FAIL / PENDING] | |
| D1. Usability and accessibility | Scored, not pass/fail | [Responses recorded / PENDING] | |
| AI and machine learning (ArcKit supplement, not a DTAC section) | Not part of DTAC | [N/A / COMPLETE / PENDING] | |

A section passes only when every question that applies to the product meets the form's pass criterion.

---

## Assessment context

| Field | Value |
|---|---|
| **Target NHS context** | [Primary care / Secondary care / Community / Mental health / ICS / National / Adult social care] |
| **Medical device determination** | [Yes — class / No / Borderline — cross-reference `ARC-{PID}-NHSMDR-*.md`; feeds C1.1.1] |
| **Uses AI / ML?** | [Yes — describe / No; feeds the AI supplement] |
| **Where data is stored and processed** | [UK only / Outside UK — feeds C2.2.5] |
| **Assessment date** | [YYYY-MM-DD] |

---

## A. Company information (not assessed)

| Code | Question | Response |
|---|---|---|
| A1 | Name of the company | [MANUFACTURER_LEGAL_ENTITY] |
| A2 | Name of the product | [PRODUCT_NAME] |
| A3 | Version number of the product this form corresponds to | [PRODUCT_VERSION] |
| A4 | Type of product | [Standalone software application or mobile application / Wearable / Software as a Service (SaaS) / Other — describe] |
| A5 | Key contact: name and job title | [PENDING] |
| A6 | Key contact: email address | [PENDING] |
| A7 | Key contact: phone number | [PENDING] |
| A8 | Registered address of the company | [PENDING] |
| A9 | Country in which the organisation is registered | [PENDING] |
| A10 | Companies House number, registered charity number or other organisational reference | [PENDING] |
| A11 | Date of last CQC assessment, if CQC registration is required | [Date / Not applicable] |
| A12 | Latest CQC report, if applicable | [Provided / Not applicable] |

---

## B. Value proposition (not assessed)

| Code | Question | Response | Source |
|---|---|---|---|
| B1 | Intended use of the product | [Patient care or support / Diagnostics / Clinical support / Workforce support or management / Other] | `ARC-{PID}-REQ-*.md` |
| B2 | What the product is designed to do and how it is expected to be used (high-level summary) | [Summary] | `ARC-{PID}-REQ-*.md` |
| B3 | Intended users, intended or proven benefits, and whether and how the benefits have been validated (include evaluations or clinical trials) | [Summary] | `ARC-{PID}-STKE-*.md` |
| B4 | Flow of data between the product and the Health IT system; a user journey map where applicable | [Provided / Not available] | `ARC-{PID}-DATA-*.md`, DPIA data flows, HLD |

---

## C1. Clinical safety (assessed)

| Code | Question | Response | Status | Evidence / cross-reference |
|---|---|---|---|---|
| C1.1.1 | Does the product, or any component within it, qualify as Software or AI as a Medical Device under the UK Medical Devices Regulations 2002? | [Yes / No] | [PASS / FAIL / PENDING] | [`ARC-{PID}-NHSMDR-*.md`. If Yes, a completed Pre-Acquisition Questionnaire (PAQ) must accompany the form] |
| C1.1.2 | Is the product a standalone medical device? | [Yes / No / N/A] | — | [If Yes, the form moves on to C2] |
| C1.2 | Is the product designed to provide electronic information to influence, support or manage the real time or near real time direct care of patients or service users (a health IT system in DCB0129 scope)? | [Yes / No] | — | |
| C1.2.1 | If No: justification for why the product is not in DCB0129 scope | [Free text / N/A] | [PASS / FAIL / N/A] | [Reasoned against the DCB0129 definitions and NHS England applicability guidance; the buyer can challenge it] |
| C1.2.2 | Have clinical risk management activities been undertaken for this product in compliance with DCB0129? | [Yes / No] | [PASS / FAIL / PENDING] | [`clinical-safety/SAFETY.md`] |
| C1.2.3 | The clinical risk management system | [Provided / Not provided] | [PASS / FAIL / PENDING] | [`clinical-safety/SAFETY.md` summary; `SAFETY-PLAN.md` if Tier 3] |
| C1.2.4 | Clinical Safety Case Report and Hazard Log | [Provided / Not provided] | [PASS / FAIL / PENDING] | [`clinical-safety/SAFETY-CASE.md`, `clinical-safety/HAZARD-LOG.md` — N open hazards, highest open risk: ___; risk-scoring scheme declared in the case report] |
| C1.2.5 | Name of the Clinical Safety Officer (CSO), their profession and registration details | [Free text] | [PASS / FAIL / PENDING] | [`clinical-safety/SAFETY.md` `clinical-safety-officer` field] |

Pass criteria to check against (DTAC form version 2.0):

- **C1.2.4**: the case report and hazard log must meet DCB0129 and be proportionate to the product. There is no NHS-wide risk-scoring scheme, so the case report must declare the scheme it uses.
- **C1.2.5**: a named CSO, who may be outsourced, who is a suitably qualified and experienced clinician with current registration with an appropriate professional body. The version 1.0 requirement for NHS DTAC-specific CSO training no longer applies.
- **Hardware**: if the product is supplied with hardware as one health IT system, the DCB0129 documentation must cover the whole system, hardware included.

> If `clinical-safety/SAFETY-CASE.md` or `clinical-safety/HAZARD-LOG.md` are absent, run `/arckit:uk-nhs-dcb0129` to seed them before completing this section.

### Deploying organisation's DCB0160 case (not part of the DTAC form)

DCB0160 is the deploying organisation's own duty, and the DTAC form does not ask the manufacturer for it. As the form notes, DCB0160 (requirement 2.5.1) requires the deploying organisation to ensure, before deployment, that the manufacturer and the system comply with DCB0129: C1 is the evidence it reviews. Record the deployer case here only when this assessment is prepared by or for the deploying organisation.

| Item | Status | Evidence / cross-reference |
|---|---|---|
| Deployer CSO appointed at the deploying organisation | [IN PLACE / PENDING / N/A — manufacturer submission only] | |
| Deployment Clinical Safety Case Report | [IN PLACE / PENDING / N/A] | [`clinical-safety/deployment/DEPLOYMENT-SAFETY-CASE.md`] |
| Deployment Hazard Log | [IN PLACE / PENDING / N/A] | [`clinical-safety/deployment/DEPLOYMENT-HAZARD-LOG.md`] |

---

## C2. Data protection (assessed)

| Code | Question | Response | Status | Evidence / cross-reference |
|---|---|---|---|---|
| C2.1 | If the manufacturer has, or will have, direct or remote access to patient data or NHS systems: Data Security and Protection Toolkit (DSPT) "Standards Met" or "Standards Exceeded" for the current year (or the previous year if no return has yet been made for the current year) | [Confirmed / Unable to confirm / No access to patient data or national NHS systems] | [PASS / FAIL / PENDING / N/A] | [DSPT organisation code and status; the assessor checks it against the DSPT database] |
| C2.2 | Does the product or service process personal data, or data about deceased individuals, including through a sub-processor? | [Yes / No] | — | `ARC-{PID}-DATA-*.md` |
| C2.2.1 | Current registration with the Information Commissioner's Office | [Provided / Not provided] | [PASS / FAIL / PENDING] | [Registration number and expiry date] |
| C2.2.2 | Data Protection Impact Assessment (DPIA) for the product | [Provided / Not provided] | [PASS / FAIL / PENDING] | [`ARC-{PID}-DPIA-*.md`; coverage checked below] |
| C2.2.3 | The product's transparency information | [Provided / Not provided] | [PASS / FAIL / PENDING] | [Privacy notice, published DPIA or equivalent] |
| C2.2.4 | Product terms and conditions on the use of user data, end user licence agreement or equivalent | [Provided / Not provided / Not applicable — explain] | [PASS / FAIL / N/A] | |
| C2.2.5 | Where the product, including third-party components, stores and processes data | [UK only / Outside of UK] | — | |
| C2.2.6 | If outside the UK: the countries, and how the arrangements comply with current legislation | [Free text / N/A] | [PASS / FAIL / N/A] | [UK adequacy regulations, or an International Data Transfer Agreement, or binding corporate rules with a transfer risk assessment] |

### C2.2.2 DPIA coverage

The form lists what the manufacturer's DPIA must cover.

| DPIA content required by the form | Covered? | DPIA section |
|---|---|---|
| Summary of the product, including how it processes data | [YES / NO] | |
| List of the data fields required | [YES / NO] | |
| How data flows into, within and out of the product | [YES / NO] | |
| Security controls for end users (onboarding, offboarding, access limits) | [YES / NO] | |
| Technical and organisational measures for data in transit and at rest, proportionate to the risk | [YES / NO] | |
| Countries the data will be stored in or flow through | [YES / NO] | |
| Whether the manufacturer's staff can access personal data, and the legal basis for doing so | [YES / NO] | |
| Who is controller for each element of the processing | [YES / NO] | |
| Retention and disposal arrangements | [YES / NO] | |
| Processors and sub-processors, with confirmation of a legally binding agreement | [YES / NO] | |
| Confidentiality, integrity and availability risks, and how the product mitigates them | [YES / NO] | |
| How the product supports data subject rights | [YES / NO] | |

### Processors, sub-processors and transfers

| Processor / sub-processor | Service | Location | Legally binding agreement | Transfer safeguard |
|---|---|---|---|---|
| | | | | |

---

## C3. Technical security (assessed)

| Code | Question | Response | Status | Evidence / cross-reference |
|---|---|---|---|---|
| C3.1 | Cyber Essentials certificate | [Provided / Not provided] | [PASS / FAIL / PENDING] | [Certificate number and expiry; certification lasts 12 months; the assessor checks it against the IASME database] |
| C3.2 | Has the manufacturer signed the Cyber Security Charter for Suppliers to the NHS? | [Yes / No] | — | [If Yes, the remaining C3 questions are skipped] |
| C3.3 | For internet-based products or products accessible from the internet: summary report of an external penetration test within the previous 12 months that included the OWASP Top 10 | [Provided / Not provided / N/A] | [PASS / FAIL / PENDING / N/A] | [Test date, third-party tester, scope; to pass, no vulnerabilities scoring 7.0 or above on CVSS] |
| C3.4 | Software produced in adherence to the DSIT / NCSC Software Security Code of Practice, with commitment to its principles of secure design and development, secure build environment, secure deployment and maintenance, and communication with customers | [Confirmed / Unable to confirm] | [PASS / FAIL / PENDING] | |
| C3.5 | A plan for implementing multi-factor authentication for all account types, preferably through identity federation | [Yes / No] | [PASS / FAIL / PENDING] | |
| C3.5.1 | Multi-factor authentication enabled on all supplier accounts with privileged access to the product (or applied at the remote end) | [Yes / No / Not applicable — supplier has no access] | [PASS / FAIL / N/A] | |
| C3.6 | Logging and reporting requirements defined (for example, audit trails of all access) | [Yes / No] | [PASS / FAIL / PENDING] | |

> Hosting, encryption, business continuity and vulnerability management are not DTAC questions. Record them in the Secure by Design assessment (`ARC-{PID}-SECD-*.md`), and put any further buyer requirement as a supplemental request rather than into this form.

---

## C4. Interoperability (assessed)

| Code | Question | Response | Status | Evidence / cross-reference |
|---|---|---|---|---|
| C4.1 | Does the product expose any APIs or integration channels for other products relevant to the provision or administration of health or social care? | [Yes / No] | — | |
| C4.1.1 | If Yes: the international or industry interoperability standards the APIs use, and why they are appropriate | [Free text] | [PASS / FAIL / N/A] | [Standards listed below; NHS England Standards Directory] |
| C4.1.2 | The APIs follow GDS Open API best practice and are openly documented and freely available to third parties | [Confirm / Cannot confirm] | [PASS / FAIL / N/A] | [API documentation URL] |
| C4.1.3 | If C4.1.2 cannot be confirmed: the basis on which the APIs are documented and made available to third parties | [Free text / N/A] | [PASS / FAIL / N/A] | |
| C4.2 | Does the product share or receive data with national or local systems for managing or delivering patient care, or for administration where patient identity is relevant? | [Yes / No] | — | |
| C4.2.1 | Can the product use the NHS number to identify patient data when exchanging data? | [Yes / No] | [PASS / FAIL / N/A] | |
| C4.2.2 | Does the product integrate with the NHS Personal Demographics Service, or with local record systems, to establish or validate the NHS number? | [Yes / No] | [PASS / FAIL / N/A] | |
| C4.2.3 | If No to C4.2.1 or C4.2.2: the approach that ensures correct identification of patient records and data quality | [Free text / N/A] | [PASS / FAIL / N/A] | |
| C4.2.4 | If used directly by patients: is NHS login used to verify identity and authenticate the user? | [Yes / No / Not applicable — not used directly by patients] | [PASS / FAIL / N/A] | |
| C4.2.5 | If used by public health or adult social care organisations to deliver care services: does the product support compliance with DAPB3051 (Identity Verification and Authentication Standard for Digital Health and Care Services)? | [Yes / No / Not applicable] | [PASS / FAIL / N/A] | |
| C4.2.6 | If NHS login is not used: the approach to authenticating users and the data protection measures in place | [Free text / N/A] | [PASS / FAIL / N/A] | |

### Standards used (supports C4.1.1)

| Standard | Version / scope | Use in the product |
|---|---|---|
| FHIR UK Core | [version] | [Conformant / Partial / N/A] |
| SNOMED CT UK Edition | [release] | |
| dm+d (if prescribing) | [release] | |
| HL7 v2 (if legacy integration) | [profile] | |

---

## D1. Usability and accessibility (scored, not pass/fail)

This section gives buyers a comparative view of the product. It does not count towards the pass or fail in section C.

| Code | Question | Response | Evidence |
|---|---|---|---|
| D1.1 | How the product is used or fits into existing systems such as care pathways (for example a user journey or instructions for use) | [Provided / Not provided] | |
| D1.2 | Is the product tested with intended users to validate its usability? | [Yes / No] | [User research evidence] |
| D1.3 | Has the manufacturer read the Accessible Information Standard and considered how its requirements should be reflected in the product's design? | [Confirm / Cannot confirm] | |
| D1.4 | Is the product a web or mobile application? | [Yes / No] | |
| D1.4.1 | If Yes: does it comply with WCAG 2.2 at AA or higher? | [Yes / No, but a plan and timeline for AA is in place / No / Not applicable] | [Audit date and auditor] |
| D1.4.2 | Timescale for reaching WCAG 2.2 AA, if not yet met | [Free text / N/A] | |
| D1.4.3 | Link to the published accessibility statement | [URL] | |
| D1.5 | Average service availability over the past 12 months, as a percentage to two decimal places | [NN.NN%] | |

> The NHS Service Standard and the GDS Service Standard are not DTAC sections. NHS England says DTAC complements them; assess them with `/arckit:service-assessment`.

---

## AI and machine learning (ArcKit supplement — not a DTAC section)

> DTAC form version 2.0 has no AI section. AI appears in it only through C1.1.1 (AI as a Medical Device under UK MDR 2002). NHS England asks buyers with requirements beyond DTAC to raise them as supplemental requests that do not duplicate DTAC. Complete this supplement only if the product uses AI / ML for a clinically relevant function, and present it to buyers as a separate document. Otherwise state: "No AI / ML components — supplement N/A."

### AI.1 AI usage

| Field | Value |
|---|---|
| Uses AI / ML? | [Yes / No — if No, supplement is N/A] |
| Model class | [Rule-based / Classical ML / Deep learning / Foundation model / Agentic LLM] |
| Clinical function performed by AI | [Decision support / triage / risk score / summarisation / etc.] |
| Vendor of AI component | [In-house / named third party] |

### AI.2 Model governance

| Criterion | Status | Evidence |
|---|---|---|
| Training-data provenance documented | [PASS / FAIL] | |
| Training-data consent basis | [PASS / FAIL] | |
| Training-data clinical representativeness assessed | [PASS / FAIL] | |
| Model card published | [PASS / FAIL] | [URL] |
| ATRS record published (cross-reference `/arckit:atrs`) | [PASS / FAIL / PENDING] | [`ARC-{PID}-ATRS-*.md`] |

### AI.3 Fairness and bias

| Criterion | Status | Evidence |
|---|---|---|
| Protected characteristics evaluated (sex, age, ethnicity, etc.) | [PASS / FAIL] | |
| Performance parity across groups | [PASS / FAIL] | [Metrics + thresholds] |
| Bias mitigation actions documented | [PASS / FAIL] | |

### AI.4 Operational monitoring

| Criterion | Status | Evidence |
|---|---|---|
| Model drift monitoring approach | [PASS / FAIL] | [Metrics + cadence + thresholds] |
| Human-in-the-loop / human-on-the-loop design | [PASS / FAIL] | [Where humans intervene] |
| Substantial-change handling | [PASS / FAIL] | [What triggers reassessment under MDR if AIaMD] |

### AI.5 Transparency

| Criterion | Status | Evidence |
|---|---|---|
| Plain-English explanation available to clinicians | [PASS / FAIL] | |
| Plain-English explanation available to patients | [PASS / FAIL] | |
| Confidence / uncertainty surfaced in the UI | [PASS / FAIL] | |

### AI.6 MHRA AIaMD Programme alignment

| MHRA Change Programme WP | Applicability | Status |
|---|---|---|
| WP5 Cyber Secure Medical Devices | | |
| WP9 AI Rigour | | |
| WP10 Project Glass Box (AI interpretability) | | |
| WP11 Project Ship of Theseus (AI adaptivity) | | |

---

## Supporting documentation

The form asks that each document be labelled with the company name, the question number and the date of submission.

| Question | Document | Status | Location |
|---|---|---|---|
| A12 | CQC report | [Provided / N/A] | |
| B4 | User journeys and data flows | [Provided / Not available] | |
| C1.1.1 | Pre-Acquisition Questionnaire (PAQ) | [Provided / N/A] | |
| C1.2.3 | Clinical risk management system | [Provided / Not provided] | `clinical-safety/SAFETY.md` |
| C1.2.4 | Clinical Safety Case Report and Hazard Log | [Provided / Not provided] | `clinical-safety/SAFETY-CASE.md`, `clinical-safety/HAZARD-LOG.md` |
| C2.2.1 | ICO registration | [Provided / Not provided] | |
| C2.2.2 | Data Protection Impact Assessment | [Provided / Not provided] | `ARC-{PID}-DPIA-*.md` |
| C2.2.4 | Terms and conditions on use of user data, EULA or equivalent | [Provided / N/A] | |
| C3.1 | Cyber Essentials certificate | [Provided / Not provided] | |
| C3.3 | External penetration test summary report | [Provided / N/A] | |
| D1.1 | User journeys or how the product fits a care pathway | [Provided / Not provided] | |

---

## External References

### Authoritative Sources

| Doc ID | Title | Source | Used in |
|---|---|---|---|
| DTAC-2.0 | Digital Technology Assessment Criteria for Health and Social Care (DTAC) form, version 2.0 (24 February 2026) | NHS England | Throughout |
| DTAC-GUIDE | DTAC guidance for buyers and suppliers | NHS England | Throughout |
| DCB0129 | Clinical Risk Management — Manufacture of Health IT Systems | NHS England | C1 |
| DCB0160 | Clinical Risk Management — Deployment and Use of Health IT Systems | NHS England | C1 (deployer note) |
| PAQ | Pre-Acquisition Questionnaire for medical devices | NHS England | C1.1.1 |
| UK-MDR-2002 | Medical Devices Regulations 2002 (as amended) | legislation.gov.uk | C1.1.1 |
| UK-GDPR | UK General Data Protection Regulation | Information Commissioner | C2 |
| DPA-2018 | Data Protection Act 2018 | UK Parliament | C2 |
| DSPT | Data Security and Protection Toolkit | NHS England | C2.1 |
| CYBER-ESS | Cyber Essentials | NCSC / IASME | C3.1 |
| SSCOP | Software Security Code of Practice | DSIT / NCSC | C3.4 |
| DAPB3051 | Identity Verification and Authentication Standard for Digital Health and Care Services | NHS England | C4.2.5 |
| AIS | Accessible Information Standard | NHS England | D1.3 |
| WCAG-2.2 | Web Content Accessibility Guidelines 2.2 | W3C | D1.4.1 |
| ATRS | Algorithmic Transparency Recording Standard | CDEI / DSIT | AI supplement |
| MHRA-AIAMD | MHRA Software and AI as a Medical Device Programme | MHRA | AI supplement |

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

**Generated by**: ArcKit `/arckit:uk-nhs-dtac` command
**Generated on**: [YYYY-MM-DD]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
