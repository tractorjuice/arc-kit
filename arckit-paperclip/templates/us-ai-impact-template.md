# AI Impact Assessment (OMB M-24-10 + M-25-21)

> **Template Origin**: Community | **ArcKit Version**: [VERSION] | **Command**: `/arckit:us-ai-impact`

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->
<!-- Classification line MUST be: -->
<!-- | Classification | PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE (set via `default_classification` user-config) | -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [YYYY-MM-DD] | ArcKit AI | Initial creation from `/arckit:us-ai-impact` command | PENDING | PENDING |

---

## Executive Summary

[Two to three paragraphs: AI use case, rights-impacting / safety-impacting determination per OMB M-24-10, M-24-10 §5 risk-management practices status, M-25-21 acquisition controls (if procured), and CAIO sign-off status.]

---

## 1. AI Use Case Description

| Field | Value |
|-------|-------|
| **Use Case Name** | [Name] |
| **Agency / Bureau** | [Agency] |
| **Federal AI Use Case Inventory ID** | [If listed on federal.ai.gov — entry ID; otherwise PENDING] |
| **Purpose** | [What problem the AI solves] |
| **Decision Context** | [What decision is informed or made by the AI] |
| **Data Inputs** | [Data types, sources, sensitivity, PII?] |
| **Outputs** | [What the AI produces and how it is used downstream] |
| **Automation Level** | [Decision-support / Decision-making with human review / Decision-making automated] |
| **AI Capability Type** | [Predictive / Classification / Generative / Decision-Support] |
| **Population Affected** | [Federal employees / public / regulated cohort] |
| **Build / Buy / GenAI Wrapper** | [In-house / Vendor-built / Off-the-shelf with custom prompts] |
| **Cross-ref AI RMF** | [ARC-{P}-AIRMF-v*] |
| **Cross-ref PIA (if PII)** | [ARC-{P}-PIA-v*] |
| **CAIO** | [Name + role] |
| **Use-Case Owner** | [Name + role] |
| **Assessment Date** | [YYYY-MM-DD] |

---

## 2. Rights-Impacting / Safety-Impacting Determination

Per OMB M-24-10 Appendix I, certain categories of AI use are *presumed* to be rights-impacting or safety-impacting. Determine applicability for this use case.

### 2.1 Safety-Impacting Determination (M-24-10 Appendix I §1)

| Presumed Safety-Impacting Category | Applies? | Rationale |
|-------------------------------------|---------|-----------|
| Controls safety-critical functions of dams, emergency services, electrical grids, fire safety, financial systems, water supply | [Yes / No] | [Rationale] |
| Maintains civilian working conditions or worker safety in regulated environments | [Yes / No] | [Rationale] |
| Conducts biometric identification (real-time or post-hoc) in public spaces | [Yes / No] | [Rationale] |
| Detects fraud in benefits programmes resulting in benefit denial | [Yes / No] | [Rationale] |
| Conducts medical diagnostics or treatment decisions | [Yes / No] | [Rationale] |
| Controls physical movement of robots in workspaces accessible to humans | [Yes / No] | [Rationale] |
| Controls industrial / manufacturing emissions or hazardous materials | [Yes / No] | [Rationale] |
| Controls life-safety functions in transport (autonomous vehicles, aviation, rail) | [Yes / No] | [Rationale] |
| Conducts safety-related law-enforcement functions | [Yes / No] | [Rationale] |

**Safety-Impacting Determination**: **[Yes / No]**

[Narrative: if any of the above rows is Yes, the system is presumed safety-impacting. CAIO concurrence is required to override the presumption.]

### 2.2 Rights-Impacting Determination (M-24-10 Appendix I §2)

| Presumed Rights-Impacting Category | Applies? | Rationale |
|-------------------------------------|---------|-----------|
| Determines eligibility, access, or denial of federal benefits or services | [Yes / No] | [Rationale] |
| Generates risk assessments used in criminal or civil legal proceedings | [Yes / No] | [Rationale] |
| Detects fraud in benefits programmes (where outcome affects individuals) | [Yes / No] | [Rationale] |
| Monitors / detects student academic conduct or wellness | [Yes / No] | [Rationale] |
| Monitors employees in ways that affect employment outcomes | [Yes / No] | [Rationale] |
| Makes housing / loan / employment / insurance access decisions | [Yes / No] | [Rationale] |
| Conducts biometric identification or surveillance of public spaces | [Yes / No] | [Rationale] |
| Detects emotion, sentiment, or affect in regulated decision-making | [Yes / No] | [Rationale] |
| Translates / generates content used in legal, medical, or benefits proceedings | [Yes / No] | [Rationale] |
| Detects or generates content used in censorship / content-moderation by the federal government | [Yes / No] | [Rationale] |
| Conducts immigration / asylum / refugee decision-making | [Yes / No] | [Rationale] |
| Determines firearm-purchase / background-check eligibility | [Yes / No] | [Rationale] |
| Conducts predictive policing | [Yes / No] | [Rationale] |
| Determines child welfare interventions | [Yes / No] | [Rationale] |

**Rights-Impacting Determination**: **[Yes / No]**

### 2.3 CAIO Concurrence

[If the determination contests a presumed category — i.e., you assert "No" against a presumed Yes — the agency CAIO must concur per M-24-10 §5. Document the CAIO's rationale and signature in the Approvals section.]

**Determination Contested?**: [Yes — CAIO concurrence required / No]

---

## 3. Minimum Risk-Management Practices Checklist

Per OMB M-24-10 §5 + Appendix II. Required for any AI determined rights-impacting or safety-impacting.

| # | Practice | Status | Evidence | Action |
|---|----------|--------|----------|--------|
| 1 | Complete AI Impact Assessment (this artefact) | [Implemented / Planned / Not Applicable] | [Self-reference] | [N/A] |
| 2 | Test the AI for performance in a real-world context | [Implemented / Planned / Not Applicable] | [Test report ref] | [Action] |
| 3 | Independently evaluate the AI | [Implemented / Planned / Not Applicable] | [Evaluator + report ref] | [Action] |
| 4 | Conduct ongoing monitoring | [Implemented / Planned / Not Applicable] | [Monitoring plan ref] | [Action] |
| 5 | Regularly evaluate risks from the AI's use | [Implemented / Planned / Not Applicable] | [Reassessment cadence] | [Action] |
| 6 | Mitigate emerging risks to rights and safety | [Implemented / Planned / Not Applicable] | [Mitigation register] | [Action] |
| 7 | Ensure adequate human training and assessment for AI use | [Implemented / Planned / Not Applicable] | [Training records] | [Action] |
| 8 | Provide additional human oversight, intervention, and accountability as part of decisions or actions that could result in a significant impact on rights or safety | [Implemented / Planned / Not Applicable] | [Oversight design] | [Action] |
| 9 | Provide public notice and plain-language documentation through the agency's AI use-case inventory | [Implemented / Planned / Not Applicable] | [federal.ai.gov entry] | [Action] |
| 10 | Notify negatively affected individuals — provide a means to opt-out where practicable and a means to access human consideration and remedy | [Implemented / Planned / Not Applicable] | [Notice text + opt-out mechanism] | [Action] |
| 11 | Maintain options to opt-out from the AI-enabled decision in favour of a human alternative (where practicable) | [Implemented / Planned / Not Applicable] | [Opt-out design] | [Action] |
| 12 | Provide consultation and feedback opportunities for the public and affected communities | [Implemented / Planned / Not Applicable] | [Consultation record] | [Action] |
| 13 | Maintain consistency with broader privacy and civil-rights laws (Privacy Act, ADA, Title VI, etc.) | [Implemented / Planned / Not Applicable] | [Legal review] | [Action] |
| 14 | Conduct an equity assessment for disparate impact on protected populations | [Implemented / Planned / Not Applicable] | [Equity assessment ref] | [Action] |

---

## 4. M-25-21 Acquisition Controls

[Applies when the AI system is procured rather than built in-house. Document contract clauses, evaluation criteria, and vendor obligations per OMB M-25-21.]

**AI Procured?**: [Yes / No]

| Acquisition Control | Status | Notes |
|---------------------|--------|-------|
| Solicitation includes plain-language description of intended use | [Met / Gap] | [Notes] |
| Evaluation criteria assess vendor AI-risk-management maturity | [Met / Gap] | [Notes] |
| Contract clause: vendor disclosure of training data sources | [Met / Gap] | [Notes] |
| Contract clause: vendor disclosure of model architecture and any base models | [Met / Gap] | [Notes] |
| Contract clause: vendor model documentation (model card / system card) | [Met / Gap] | [Notes] |
| Contract clause: agency audit rights over vendor AI lifecycle | [Met / Gap] | [Notes] |
| Contract clause: data rights — agency retains rights to its data + derivatives | [Met / Gap] | [Notes] |
| Contract clause: IP — clear ownership of agency-generated content, prompts, embeddings, fine-tuned weights | [Met / Gap] | [Notes] |
| Contract clause: vendor commitment to update / patch / decommission cadence | [Met / Gap] | [Notes] |
| Contract clause: vendor incident-disclosure obligations (AI incidents, safety failures) | [Met / Gap] | [Notes] |
| Contract clause: prohibition on training vendor models with agency data without explicit permission | [Met / Gap] | [Notes] |
| Contract clause: vendor must support agency M-24-10 minimum practices | [Met / Gap] | [Notes] |
| Vendor management plan in place | [Met / Gap] | [Notes] |

---

## 5. Public Disclosure Obligations

| Element | Status | Notes |
|---------|--------|-------|
| Entry in agency AI Use Case Inventory (federal.ai.gov) | [Posted / Pending / N/A] | [URL / target date] |
| Plain-language description on agency website | [Posted / Pending / N/A] | [URL / target date] |
| Notice to affected individuals at point of contact | [Implemented / Planned] | [Notice text reference] |
| Opt-out mechanism communicated | [Implemented / Planned / Not practicable — narrative required] | [Mechanism] |
| Appeals / human-review mechanism communicated | [Implemented / Planned] | [Mechanism] |

**Federal AI Use Case Inventory Entry** (draft):

| Field | Value |
|-------|-------|
| Use case title | [Title] |
| Agency | [Agency] |
| Bureau | [Bureau] |
| Mission area | [Mission area] |
| Stage | [Initiated / Acquisition and/or Development / Implementation and Assessment / Operation and Maintenance / Decommissioned] |
| Plain-language summary | [Two-sentence summary of what the AI does and for whom] |
| Rights-impacting | [Yes / No] |
| Safety-impacting | [Yes / No] |
| Date last updated | [YYYY-MM-DD] |

---

## 6. Agency CAIO Sign-Off

| Sign-Off Item | CAIO Statement |
|---------------|----------------|
| Determination of rights-/safety-impacting concurred | [Concur / Concur with conditions / Do not concur] |
| Minimum risk-management practices reviewed | [Reviewed and approved / Conditional / Returned for revision] |
| Acquisition controls (where applicable) reviewed | [Reviewed and approved / Conditional / N/A] |
| Public disclosure plan reviewed | [Reviewed and approved / Conditional] |

**CAIO Signature**: [Name + signature + date]

---

## 7. References

| Reference | Citation | URL |
|-----------|----------|-----|
| OMB M-24-10 | Advancing Governance, Innovation, and Risk Management for Agency Use of Artificial Intelligence | <https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf> |
| OMB M-25-21 | Acquisition of Artificial Intelligence in the Federal Government | <https://www.whitehouse.gov/omb/> |
| NIST AI 600-1 | AI RMF: Generative AI Profile | <https://doi.org/10.6028/NIST.AI.600-1> |
| federal.ai.gov | Federal AI Use Case Inventory | <https://ai.gov/ai-use-cases/> |

---

## 8. Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| AI Use-Case Owner | [Name] | [Signature] | [YYYY-MM-DD] |
| Chief AI Officer (CAIO) | [Name] | [Signature] | [YYYY-MM-DD] |
| Senior Agency Official for Privacy (SAOP) | [Name] | [Signature] | [YYYY-MM-DD] |
| Agency General Counsel (or designee) | [Name] | [Signature] | [YYYY-MM-DD] |

---

**Generated by**: ArcKit `/arckit:us-ai-impact` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]
