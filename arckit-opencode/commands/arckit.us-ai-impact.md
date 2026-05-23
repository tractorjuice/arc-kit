---
description: "[COMMUNITY] Determine whether an AI system is rights-impacting or safety-impacting under OMB M-24-10 and document the minimum risk-management practices, M-25-21 acquisition controls, and public disclosure obligations."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified US federal counsel, your agency's Senior Agency Official
> for Privacy (SAOP), CISO, Chief AI Officer (CAIO), and (for FedRAMP matters) the agency PMO
> and 3PAO before reliance.
>
> **Statutory currency**: EO 14110 was **revoked January 2025**; the active AI assurance mandates
> are **OMB M-24-10** (use of AI) and **OMB M-25-21** (acquisition of AI). FedRAMP completed the
> transition to NIST 800-53 **Rev 5** baselines in 2024 — Rev 4 references are deprecated. Verify
> all citations against the current Federal Register, OMB Circulars page, NIST publications, and
> FedRAMP.gov before relying on this output.

You are an enterprise architect producing an **AI Impact Assessment** under **OMB M-24-10** and **OMB M-25-21** for a US federal civilian agency.

## User Input

```text
$ARGUMENTS
```

## Context

OMB M-24-10 ("Advancing Governance, Innovation, and Risk Management for Agency Use of Artificial Intelligence", March 2024) is the binding policy framework for federal civilian AI use. It defines two impact categories that trigger heightened oversight:

- **Rights-impacting AI** — AI whose output serves as a principal basis for a decision or action that has a legal, material, or similarly significant effect on an individual's civil rights, civil liberties, equal opportunity, access to government benefits or services, or privacy.
- **Safety-impacting AI** — AI whose output controls or significantly influences the outcome of decisions or actions that could meaningfully impact the safety of human life or wellbeing, climate or environment, critical infrastructure, or strategic assets.

Appendix I of M-24-10 lists **presumed-impacting** use cases (those agencies must treat as rights- or safety-impacting unless rebutted). Agencies must implement minimum risk-management practices for each impact category, may not waive them without CAIO documentation, and must publicly inventory AI use cases (federal.ai.gov).

**OMB M-25-21** ("Accelerating Federal Use of AI through Innovation, Governance, and Public Trust", April 2025) is the acquisition-side companion: it directs agencies to embed AI risk-management requirements in solicitations, contracts, and vendor evaluations, and requires AI RMF alignment from vendors.

**Authoritative anchors**:

- OMB M-24-10 (Advancing Governance, Innovation, and Risk Management for Agency Use of Artificial Intelligence) — <https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf>
- OMB M-25-21 (Accelerating Federal Use of AI through Innovation, Governance, and Public Trust) — <https://www.whitehouse.gov/omb/management/ofcio/>
- NIST AI Risk Management Framework 1.0 — <https://www.nist.gov/itl/ai-risk-management-framework>
- NIST AI 600-1 (Generative AI Profile) — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>
- Federal AI Use Case Inventory — <https://ai.gov/ai-use-cases/>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's AI RMF artefact (recommended prerequisite — if absent, suggest running `/arckit:us-ai-rmf` first)
   - The project's REQ artefact — extract `NFR-SEC-*`, `DR-*`, `INT-*`, plus any explicit fairness / non-discrimination requirements
   - The project's STKE artefact — for affected populations and decisions affecting them
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-ai-impact-template.md` (user override)
   - **Then**, `.arckit/templates/us-ai-impact-template.md`
   - **Fallback**, `.arckit/templates/us-ai-impact-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AIIA --filename` for the artefact filename. The type code for this command is `AIIA`.

5. Generate the following sections:

   - **AI System Summary** — system name, agency owner, mission served, model type, intended decisions or actions supported, scale (users / decisions per day).
   - **Appendix I Presumed-Impacting Check** — match the use case against M-24-10 Appendix I's presumed-impacting lists (rights and safety). Record the matched item(s) verbatim with the M-24-10 §X.Y reference, or note "no Appendix I match" if none.
   - **Rights-Impacting Determination** — apply the M-24-10 definition: does the AI output serve as a principal basis for a decision affecting civil rights, civil liberties, equal opportunity, access to benefits/services, or privacy? Record verdict (Yes / No / Rebuttal-of-presumption) with named decision and affected population.
   - **Safety-Impacting Determination** — does the AI output meaningfully control or influence decisions affecting human safety, climate / environment, critical infrastructure, or strategic assets? Record verdict and named decision-flow.
   - **Minimum Risk-Management Practices Checklist** — per M-24-10 §5, document satisfaction of: pre-deployment testing for performance and fairness; impact assessment; ongoing monitoring; risk-based human override and remedy options; consultation with affected communities; AI Use Case Inventory submission; CAIO sign-off; cost-benefit analysis for high-cost systems. For each: status (Met / Partial / Not Met / Not Applicable), evidence reference, action.
   - **Waiver Posture** — if any minimum practice cannot be met, document the M-24-10 waiver criteria and CAIO determination record, including period of waiver and compensating measures.
   - **M-25-21 Acquisition Controls** — for AI procured from a vendor, document the contract clauses and evaluation criteria implemented: AI RMF alignment requirement, model provenance documentation, training-data disclosure, bias-testing access, fairness reporting, incident-reporting obligations, exit / portability.
   - **Public Disclosure Obligations** — confirm the entry has been (or will be) submitted to the agency AI Use Case Inventory (federal.ai.gov); note any redactions required for sensitive law-enforcement or national-security carve-outs.
   - **CAIO Sign-Off Block** — agency Chief AI Officer review and approval section: reviewer, date, scope of approval, conditions, next review.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — impact verdict (rights-impacting / safety-impacting / both / neither), Appendix I match (Y/N), minimum-practice satisfaction percentage, waiver count, AI Use Case Inventory ID (or "pending"), and CAIO review status. Do not echo the full artefact.

## Handoffs

Minimum-practice gaps drive the AI RMF uplift backlog via `/arckit:us-ai-rmf`. PII-handling AI systems require `/arckit:us-privacy-pia`. Any residual M-24-10 risks — particularly waiver scenarios — should be entered into `/arckit:risk` with the next CAIO review date.

## Important Notes

- **EO 14110 is revoked** — January 2025. Do not cite EO 14110 as the basis for impact assessment. The active mandates are OMB M-24-10 (use) and OMB M-25-21 (acquisition); NIST AI 600-1 provides the GenAI risk taxonomy.
- **Appendix I is presumptive, not definitive** — agencies may rebut the presumption that an Appendix I-listed use case is rights- or safety-impacting, but the rebuttal must be documented and signed by the CAIO. Default-deny on rebuttals.
- **Minimum practices are not optional for impacting AI** — M-24-10 §5 minimum-practice items are mandatory for rights- or safety-impacting AI. Waivers exist but require CAIO determination, time-boxing, and compensating measures; they are not a hidden off-ramp.
- **M-25-21 binds acquisitions, not just internal builds** — vendor-supplied AI used in agency mission delivery falls under M-25-21. Contract clauses and evaluation criteria must reflect AI RMF alignment and provenance disclosure.
- **AI Use Case Inventory is public** — submissions appear on federal.ai.gov (subject to law-enforcement and national-security carve-outs). Pre-clear redactions with the agency CAIO and SAOP before submission, not after.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-ai-rmf` -- The minimum-practice gaps surfaced here drive the AI RMF Govern / Map / Measure / Manage uplift backlog.
- `/arckit:us-privacy-pia` -- Rights-impacting AI systems handling PII require an E-Gov Act §208 PIA.
- `/arckit:risk` -- Residual M-24-10 risks (especially where minimum practices cannot be met) flow into the risk register.
