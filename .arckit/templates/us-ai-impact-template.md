# AI Impact Assessment (OMB M-25-21 + M-25-22)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-ai-impact`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-ai-impact` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: AI use case, high-impact determination per OMB M-25-21 §5–§6, status of the M-25-21 §4(b) minimum risk-management practices, waivers, M-25-22 acquisition terms (if procured), and CAIO sign-off status.]

---

## 1. AI Use Case Description

| Field | Value |
|-------|-------|
| **Use Case Name** | [Name] |
| **Agency / Bureau** | [Agency] |
| **AI Use Case Inventory ID** | [Use Case ID in the agency inventory; otherwise PENDING] |
| **Stage of Development** | [Pre-deployment / Pilot / Deployed / Retired] |
| **Purpose** | [What problem the AI solves] |
| **Decision Context** | [What decision or action is informed or made by the AI] |
| **Data Inputs** | [Data types, sources, sensitivity, PII?] |
| **Outputs** | [What the AI produces and how it is used downstream] |
| **Automation Level** | [Decision-support / Decision-making with human review / Decision-making automated] |
| **AI Capability Type** | [Predictive / Classification / Generative / Decision-Support] |
| **Population Affected** | [Federal employees / public / regulated cohort] |
| **Build / Buy / GenAI Wrapper** | [In-house / Vendor-built / Off-the-shelf with custom prompts] |
| **Cross-ref AI RMF** | [ARC-{P}-AIRMF-v*] |
| **Cross-ref PIA (if PII)** | [ARC-{P}-USPIA-v*] |
| **CAIO** | [Name + role] |
| **Use-Case Owner** | [Name + role] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## 2. High-Impact Determination

Per OMB M-25-21 §5, AI is high-impact when its output serves as a principal basis for decisions or actions with a legal, material, binding, or significant effect on the areas in Section 2.2. M-25-21 §6 lists purposes that are presumed high-impact. A use case can be high-impact whether or not a human oversees the decision (§4(a)).

### 2.1 Presumed High-Impact Purposes (M-25-21 §6)

A purpose below applies when the AI's output serves as a principal basis for the agency's decision or action. The list is not exhaustive; Section 2.2 decides.

| § | Presumed High-Impact Purpose | Applies? | Rationale |
|---|------------------------------|----------|-----------|
| (a) | Safety-critical functions of critical infrastructure or government facilities, emergency services, fire and life safety systems in structures, food safety mechanisms, or traffic control and other systems controlling physical transit | [Yes / No] | [Rationale] |
| (b) | Physical movements of robots, robotic appendages, vehicles or craft, or industrial equipment that could cause significant injury to humans | [Yes / No] | [Rationale] |
| (c) | Kinetic or non-kinetic measures for attack or active defence in real-world circumstances that could cause significant injury to humans | [Yes / No] | [Rationale] |
| (d) | Transport, safety, design, development, or use of hazardous chemicals or biological agents | [Yes / No] | [Rationale] |
| (e) | Design, construction, or testing of equipment, systems, or public infrastructure that would pose a significant risk to safety if they failed | [Yes / No] | [Rationale] |
| (f) | Healthcare: medically relevant functions of medical devices; patient diagnosis, risk assessment, or treatment; allocation of care in public insurance; control of health-insurance costs and underwriting | [Yes / No] | [Rationale] |
| (g) | Control of access to, or the security of, government facilities | [Yes / No] | [Rationale] |
| (h) | Adjudication or enforcement of sanctions, trade restrictions, or other controls on exports, investments, or shipping | [Yes / No] | [Rationale] |
| (i) | Blocking, removal, hiding, or limiting the reach of protected speech | [Yes / No] | [Rationale] |
| (j) | Law enforcement: risk assessments about individuals; identifying criminal suspects; forecasting crime; tracking non-governmental vehicles over time in public spaces; biometric identification; facial reconstruction from genetic information; social media monitoring; digital forensics; cyber intrusions; location monitoring or tracking of individuals; detecting weapons or violent activity; determinations on recidivism, sentencing, parole, supervised release, probation, bail, or pretrial release or detention | [Yes / No] | [Rationale] |
| (k) | Preparing or adjudicating risk assessments of foreign nationals seeking temporary or permanent access to the US or its territories, including immigration, asylum, detention, or travel approval status | [Yes / No] | [Rationale] |
| (l) | Biometric identification for one-to-many identification in publicly accessible spaces | [Yes / No] | [Rationale] |
| (m) | Applying for, or adjudicating, requests for critical federal services, processes, and benefits (including loans and public housing); continued eligibility for benefits; controlling access to IT systems for benefits through biometrics or other means (e.g. signature matching); detecting fraudulent use of government services; adjudicating penalties in government benefits | [Yes / No] | [Rationale] |
| (n) | Terms or conditions of Federal employment: pre-employment screening, reasonable accommodation, pay or promotion, performance management, hiring or termination, recommending disciplinary action, or reassigning workers to new tasks or teams | [Yes / No] | [Rationale] |
| (o) | Language translation where responses are legally binding, or for an interaction that directly informs an agency decision or action | [Yes / No] | [Rationale] |

**§6 Match**: [Yes — (letters) / No §6 match]

### 2.2 High-Impact Test (M-25-21 §5)

| Test | Finding |
|------|---------|
| Decision or action the AI supports | [Named decision or action] |
| AI output relied on | [Output] |
| Does the output serve as a principal basis for the decision or action? | [Yes / No — rationale. AI in a §6 category whose output is not a principal basis is not high-impact (§4(a), footnote 27).] |
| Is the effect legal, material, binding, or significant? | [Yes / No — rationale] |
| Areas affected | [Civil rights, civil liberties, or privacy / Access to education, housing, insurance, credit, employment, and other programs / Access to critical government resources or services / Human health and safety / Critical infrastructure or public safety / Strategic assets or resources, including high-value property and sensitive or classified information] |
| Affected population | [Who] |
| Human oversight | [Describe — oversight does not change the determination] |

**Determination**: **[High-impact / Presumed high-impact, but determined not high-impact / Not high-impact]**

### 2.3 Not-High-Impact Determination for a §6 Purpose

[Complete only if a §6 purpose applies and the determination is "Presumed high-impact, but determined not high-impact". M-25-21 §4(a) requires an appropriate agency official to notify the CAIO in writing. The CAIO provides the determination to OMB on request and may revisit it at any time, and the agency publishes a summary of it (§4(a)(iv)). Where the evidence is unclear, record the use case as high-impact.]

| Field | Value |
|-------|-------|
| Determining official | [Name + role] |
| Written notice to the CAIO | [YYYY-MM-DD, reference] |
| Justification | [Why the output is not a principal basis for the decision, or why the effect is not legal, material, binding, or significant] |
| Public summary | [URL / Pending] |

### 2.4 Pilot Exemption (M-25-21 §4(a)(i))

[Complete only if the use case is a pilot claiming exemption from the minimum practices; otherwise state "Not a pilot". All four conditions must hold.]

| Condition | Met? | Evidence |
|-----------|------|----------|
| Limited scale and duration | [Yes / No] | [Scope, end date] |
| The CAIO has certified that the pilot may go forward, and the certification is tracked centrally | [Yes / No] | [Certification reference] |
| Where possible, individuals who may interact with the AI can opt into and out of the pilot, with enough notice to decide | [Yes / No / Not possible — reason] | [Mechanism] |
| Minimum practices applied where practicable | [Yes / No] | [Which practices] |

---

## 3. Minimum Risk-Management Practices Checklist

Per OMB M-25-21 §4(b). Required for every high-impact use case. Agencies had to document implementation by 3 April 2026 (§4(a)(i)). A high-impact use case that does not meet a practice must be safely discontinued unless a CAIO waiver (Section 4) covers the gap.

| # | Practice (M-25-21 §4(b)) | Status | Evidence | Action |
|---|--------------------------|--------|----------|--------|
| 1 | (i) Pre-deployment testing that reflects expected real-world outcomes, with a risk-mitigation plan; alternative methods (querying the service, vendor evaluation on agency data) where the agency has no access to the code, models, or data | [Met / Partial / Not Met / Not Applicable] | [Test report ref] | [Action] |
| 2 | (ii) AI impact assessment completed before deployment and updated through the lifecycle (this artefact; elements in Section 3.1) | [Met / Partial / Not Met / Not Applicable] | [Self-reference] | [Action] |
| 3 | (iii) Ongoing monitoring and periodic human review for adverse impacts to performance and security, including those that may violate privacy, civil rights, or civil liberties law; designed to detect changes to the system, the context of use, or the data | [Met / Partial / Not Met / Not Applicable] | [Monitoring plan ref] | [Action] |
| 4 | (iv) Sufficient, periodic training, assessment, and oversight for operators to interpret and act on the AI's output and manage its risks | [Met / Partial / Not Met / Not Applicable] | [Training records] | [Action] |
| 5 | (v) Human oversight, intervention, and accountability suited to the use case, with an appropriate fail-safe that minimises the risk of significant harm where practicable | [Met / Partial / Not Met / Not Applicable] | [Oversight design] | [Action] |
| 6 | (vi) Consistent remedies or appeals: timely human review and a chance to appeal negative impacts, without unnecessary burden on the individual | [Met / Partial / Not Met / Not Applicable] | [Appeal process ref] | [Action] |
| 7 | (vii) An option for end users and the public to give feedback on the use case, used to inform agency decisions about the AI (consultation methods in M-25-21 §8) | [Met / Partial / Not Met / Not Applicable] | [Feedback mechanism] | [Action] |

### 3.1 AI Impact Assessment Elements (M-25-21 §4(b)(ii))

| Element | Content | Reference |
|---------|---------|-----------|
| A. Intended purpose and expected benefit, supported by metrics or qualitative analysis against existing agency processes | [Summary] | [Ref] |
| B. Quality and appropriateness of the data and model capability: summary of the data used in design, development, training, testing, and operation; collection and preparation; whether the data is to be disclosed as an open government data asset; any information about classes protected by Federal nondiscrimination laws | [Summary] | [Ref] |
| C. Potential impacts on privacy, civil rights, and civil liberties, of using and of not using the AI, with planned mitigations; reference the PIA and any CAIO-approved waivers | [Summary] | [ARC-{P}-USPIA-v*] |
| D. Reassessment schedule and procedures, including after significant modification of the AI system | [Summary] | [Ref] |
| E. Costs: direct costs and expected savings | [Summary] | [Ref] |
| F. Results of an independent review by an agency reviewer not involved in development; all reviewer comments included and shared with the person accepting the risk | [Reviewer, date, concerns raised] | [Ref] |
| G. Risk acceptance, signed by the individual accepting the risk | [Name, role, date] | [Signature ref] |

---

## 4. Waiver Posture

[Complete one row for every Section 3 practice marked Partial or Not Met that the agency intends to proceed without. If none, state "No waivers sought".]

**Basis**: the agency CAIO, in coordination with other relevant officials, may waive one or more minimum practices for a specific AI application or component only by a written determination, based on a system-specific and context-specific risk assessment, that meeting the practice would increase risks to safety or rights overall, or would create an unacceptable impediment to critical agency operations. The CAIO may not delegate this. Each waiver is tracked centrally, reassessed when the conditions or context of use change significantly, reported to OMB within 30 days of being granted or revoked, certified as still valid every year, and summarised publicly with its justification. Without a waiver, a high-impact use case that does not meet a practice must be safely discontinued. Source: OMB M-25-21 §4(a)(i)–(iv). OMB's reporting guidance for 2025 has agencies report waivers through OMB's collection form and publish the summaries at `[agency.gov]/ai`.

**Waivers Sought**: [Yes — N practices / No waivers sought]

| Practice # (Section 3) | Practice Waived | Ground (Increases Risk to Safety or Rights Overall / Unacceptable Impediment to Critical Operations) | Risk Assessment Reference | CAIO Written Determination (Date, Reference) | Compensating Measures | OMB Report Date (≤ 30 Days) | Annual Certification Due | Public Summary | Revocation Triggers |
|------------------------|-----------------|--------------------------------------------------------------------------------------------------------|---------------------------|----------------------------------------------|-----------------------|------------------------------|--------------------------|----------------|---------------------|
| [#] | [Practice] | [Ground] | [Ref] | [YYYY-MM-DD, ref] | [Measures that reduce the risk the practice addressed] | [YYYY-MM-DD] | [YYYY-MM-DD] | [URL / Pending] | [Changes in conditions or context that would force reassessment] |

---

## 5. M-25-22 Acquisition Terms

[Applies when the AI system or service is procured rather than built in-house. OMB M-25-22 applies to contracts awarded under solicitations issued from 30 September 2025 (180 days after the memo) and to options exercised after that date (§2(c)). It does not cover common commercial products with embedded AI, or AI a contractor uses incidentally (§2(b)).]

**AI Procured?**: [Yes / No]

| Acquisition Term | Source | Status | Notes |
|------------------|--------|--------|-------|
| Initial determination of whether the system is likely to host high-impact use cases | M-25-22 §4(a) | [Met / Gap / N/A] | [Notes] |
| Solicitation states (when practicable) whether the planned use is, or is reasonably likely to become, high-impact | M-25-22 §4(c) | [Met / Gap / N/A] | [Notes] |
| Solicitation sets the vendor transparency and documentation the agency needs for its AI impact assessment | M-25-22 §4(c) | [Met / Gap / N/A] | [Notes] |
| Proposed solutions tested before award, to the greatest extent practicable | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term: IP rights and use of government data — licence scope that avoids lock-in, components available for as long as needed, vendor collects and retains agency data only when reasonably necessary | M-25-22 §3(e), §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term: permanent prohibition on using non-public agency inputs and outputs to train publicly or commercially available AI without explicit agency consent | M-25-22 §3(e) | [Met / Gap / N/A] | [Notes] |
| Contract term: privacy — compliance with privacy law and policy wherever PII is involved, with the SAOP involved from acquisition planning | M-25-22 §3(d), §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term: vendor lock-in protections — knowledge transfer, data and model portability, rights to code and models produced under the contract, licensing and pricing transparency | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term: compliance with the M-25-21 minimum practices for high-impact use | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term: ongoing testing and monitoring — agency-defined evaluation data kept from the vendor, vendor access and time for independent evaluation, vendor test procedures detailed and disclosable within the agency | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term (encouraged): vendor performance requirements, including meeting standards before a new version is deployed or rolling back | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Contract term (to consider): vendor notification before new AI features are integrated | M-25-22 §4(d) | [Met / Gap / N/A] | [Notes] |
| Authorization to operate from an agency official before deployment | M-25-22 §4(e) | [Met / Gap / N/A] | [Notes] |
| Closeout plan for transferring data and derived assets | M-25-22 §4(f) | [Met / Gap / N/A] | [Notes] |
| Large language model only: Unbiased AI Principles contract terms, and the vendor's acceptable use policy, model / system / data cards, end-user resources, and feedback mechanism | M-26-04 | [Met / Gap / N/A] | [Notes] |

---

## 6. Public Reporting Obligations

| Element | Status | Notes |
|---------|--------|-------|
| Entry in the agency AI Use Case Inventory, submitted to OMB and published at `[agency.gov]/ai` (M-25-21 §3(b)(v)) | [Posted / Pending / Details withheld — legal basis] | [URL / target date] |
| Summary of a not-high-impact determination for a §6 purpose published (M-25-21 §4(a)(iv)) | [Posted / Pending / N/A] | [URL] |
| Waiver reported to OMB within 30 days, and its summary and justification published (M-25-21 §4(a)(iii)–(iv)) | [Posted / Pending / N/A] | [URL] |
| Route for end users and the public to give feedback (M-25-21 §4(b)(vii)) | [Implemented / Planned] | [Mechanism] |
| Human review and appeal route communicated to affected individuals (M-25-21 §4(b)(vi)) | [Implemented / Planned / N/A] | [Mechanism] |

**AI Use Case Inventory Entry** (draft):

[Field names follow OMB's Guidance on 2025 Agency AI Reporting. Check the current year's instructions before submission.]

| Field | Value |
|-------|-------|
| Use case name | [Title] |
| Agency | [Agency] |
| Bureau / component | [Bureau] |
| Stage of development | [Pre-deployment / Pilot / Deployed / Retired] |
| Is the AI use case high-impact? | [High-impact / Presumed high-impact, but determined not high impact / Not high-impact] |
| Justification (only if presumed high-impact, but determined not high impact) | [Justification] |
| What problem is the AI intended to solve? | [Plain-language answer] |
| Expected benefits and positive outcomes | [Plain-language answer] |
| AI system's outputs | [Plain-language answer] |
| Purchased from a vendor, developed under contract, or in-house | [Answer, vendor name if applicable] |
| Date last updated | [YYYY-MM-DD] |

---

## 7. Agency CAIO Sign-Off

| Sign-Off Item | CAIO Statement |
|---------------|----------------|
| High-impact determination reviewed | [Concur / Concur with conditions / Do not concur] |
| Independent review completed before risk acceptance | [Yes — reviewer and date / No] |
| Minimum risk-management practices reviewed | [Reviewed and approved / Conditional / Returned for revision] |
| Waivers (Section 4) determined in writing by the CAIO | [None sought / N granted — determination references / Refused] |
| Pilot certification (Section 2.4) | [Certified / Not a pilot] |
| Acquisition terms (where applicable) reviewed | [Reviewed and approved / Conditional / N/A] |
| Public reporting plan reviewed | [Reviewed and approved / Conditional] |

**CAIO Signature**: [Name + signature + date]

---

## 8. References

| Reference | Citation | URL |
|-----------|----------|-----|
| OMB M-25-21 | Accelerating Federal Use of AI through Innovation, Governance, and Public Trust (3 April 2025; rescinded and replaced M-24-10) | <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf> |
| OMB M-25-22 | Driving Efficient Acquisition of Artificial Intelligence in Government (3 April 2025; rescinded and replaced M-24-18) | <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-22-Driving-Efficient-Acquisition-of-Artificial-Intelligence-in-Government.pdf> |
| OMB M-26-04 | Increasing Public Trust in Artificial Intelligence Through Unbiased AI Principles (11 December 2025) | <https://www.whitehouse.gov/wp-content/uploads/2025/12/M-26-04-Increasing-Public-Trust-in-Artificial-Intelligence-Through-Unbiased-AI-Principles-1.pdf> |
| OMB AI reporting guidance | Guidance on 2025 Agency AI Reporting; consolidated 2025 Federal Agency AI Use Case Inventory | <https://github.com/ombegov/2025-Federal-Agency-AI-Use-Case-Inventory> |
| NIST AI 600-1 | AI RMF: Generative AI Profile | <https://doi.org/10.6028/NIST.AI.600-1> |

---

## 9. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| AI Use-Case Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| Independent Reviewer (M-25-21 §4(b)(ii)(F)) | [Name] | [Signature] | [YYYY-MM-DD] |
| Risk-Accepting Official (M-25-21 §4(b)(ii)(G)) | [Name] | [Signature] | [YYYY-MM-DD] |
| Chief AI Officer (CAIO) | [Name] | [Signature] | [YYYY-MM-DD] |
| Senior Agency Official for Privacy (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency General Counsel (or designee) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-ai-impact` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
