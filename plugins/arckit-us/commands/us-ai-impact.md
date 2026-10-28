---
description: "[COMMUNITY] Determine whether an AI use case is high-impact under OMB M-25-21 and document the minimum risk-management practices, waivers, M-25-22 acquisition terms, and public reporting obligations."
doc-type: AIIA
argument-hint: "<project ID or AI system, e.g. '001', 'Benefits Eligibility ML Model'>"
effort: high
handoffs:
  - command: us-ai-rmf
    description: The minimum-practice gaps surfaced here drive the AI RMF Govern / Map / Measure / Manage uplift backlog.
  - command: us-privacy-pia
    description: AI systems handling PII require an E-Gov Act §208 PIA, which the M-25-21 impact assessment should reference.
  - command: risk
    description: Residual M-25-21 risks (especially where minimum practices cannot be met) flow into the risk register.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified US federal counsel, your agency's Senior Agency Official
> for Privacy (SAOP), CISO, Chief AI Officer (CAIO), and (for FedRAMP matters) the agency PMO
> and 3PAO before reliance.
>
> **Statutory currency**: EO 14110 was **revoked January 2025**; the active AI assurance mandates
> are **OMB M-25-21** (use and governance of AI; it rescinded and replaced M-24-10 on 3 April 2025)
> and **OMB M-25-22** (acquisition of AI; it replaced M-24-18). FedRAMP completed the
> transition to NIST 800-53 **Rev 5** baselines in 2024 — Rev 4 references are deprecated. Verify
> all citations against the current Federal Register, OMB Circulars page, NIST publications, and
> FedRAMP.gov before relying on this output.

You are an enterprise architect producing an **AI Impact Assessment** under **OMB M-25-21** for a US federal civilian agency, with the **OMB M-25-22** acquisition terms where the AI is procured.

## User Input

```text
$ARGUMENTS
```

## Context

OMB M-25-21 ("Accelerating Federal Use of AI through Innovation, Governance, and Public Trust", 3 April 2025) is the binding policy for federal civilian agency use of AI. It rescinded and replaced M-24-10, and with it M-24-10's separate "rights-impacting" and "safety-impacting" categories. M-25-21 has one category that triggers the minimum risk-management practices:

- **High-impact AI** (§5) — AI whose output serves as a principal basis for decisions or actions with a legal, material, binding, or significant effect on (1) an individual's or entity's civil rights, civil liberties, or privacy; (2) their access to education, housing, insurance, credit, employment, and other programs; (3) their access to critical government resources or services; (4) human health and safety; (5) critical infrastructure or public safety; or (6) strategic assets or resources, including high-value property and information marked sensitive or classified. A use case can be high-impact whether or not a human oversees the decision (§4(a)).

M-25-21 §6 lists fifteen purposes, (a) to (o), that are **presumed high-impact** when the AI's output is a principal basis for the agency's decision or action. The list is not exhaustive: the §5 definition decides. AI in a §6 category whose output is not a principal basis for the decision is not high-impact (§4(a), footnote 27). If an agency official concludes that a use case in a §6 category is not high-impact, they must notify the CAIO in writing; the CAIO gives these determinations to OMB on request and may revisit any of them at any time (§4(a)).

For high-impact AI, agencies had to document implementation of the seven minimum practices in §4(b) within 365 days of the memo, that is by **3 April 2026**, and must safely discontinue any high-impact use that does not comply (§4(a)(i)). The seven practices are: pre-deployment testing; an AI impact assessment (this artefact) with seven required elements; ongoing monitoring; human training and assessment; human oversight, intervention and accountability, with a fail-safe where practicable; consistent remedies or appeals; and consultation with end users and the public. A pilot of limited scale and duration that the CAIO has certified is exempt, subject to the conditions in §4(a)(i). Only the CAIO can waive a practice, by written determination (§4(a)(ii)–(iv)).

The CAIO (§3(a)(i)) must be designated within 60 days of the memo and, in a CFO Act agency, hold a Senior Executive Service, Scientific and Professional, or Senior Leader position, or equivalent. The CAIO's duties include processes to determine and document high-impact use cases, an independent review of high-impact use cases before risk acceptance, and central tracking of high-impact use cases and determinations. Risk is accepted by trained and accountable officials at the lowest appropriate level (§3(b)(i)), and the impact assessment carries their signature (§4(b)(ii)(G)). Agencies inventory their AI use cases at least annually, submit the inventory to OMB and publish it (§3(b)(v)). OMB's reporting guidance for the 2025 inventory has agencies publish it at `[agency.gov]/ai` and record whether each use case is high-impact.

**OMB M-25-22** ("Driving Efficient Acquisition of Artificial Intelligence in Government", 3 April 2025) replaced M-24-18 as the acquisition memo. It applies to contracts awarded under solicitations issued from 30 September 2025 (180 days after the memo) and to options exercised after that date (§2(c)). When practicable, solicitations must say whether a planned use is, or is reasonably likely to become, high-impact, and tell vendors what documentation the agency needs for its impact assessment (§4(c)). Contracts must cover IP rights and use of government data, privacy, vendor lock-in protections, compliance with the M-25-21 minimum practices for high-impact use, and ongoing testing and monitoring (§4(d)). Agencies must ensure contracts permanently prohibit the use of non-public agency inputs and outputs to train publicly or commercially available AI without explicit agency consent (§3(e)). **OMB M-26-04** (11 December 2025), which complements M-25-22, adds contract terms on the Unbiased AI Principles of EO 14319 to every solicitation or order for a large language model issued after that date, with minimum vendor transparency: an acceptable use policy; model, system or data cards; end-user resources; and a feedback mechanism.

Neither M-25-21 nor M-25-22 mentions the NIST AI RMF. ArcKit uses the AI RMF assessment (`/arckit:us-ai-rmf`) as the evidence base for the practices, not as a mandate.

EO 14434 (29 September 2026) tells agencies to use "Super Intelligence" and "SI" in place of "artificial intelligence" and "AI" in non-statutory documents, to the extent the law allows. It changes neither memo and does not require earlier documents to be altered. Follow the agency's own instruction on wording; the requirements in this artefact are unaffected.

**Authoritative anchors**:

- OMB M-25-21 (Accelerating Federal Use of AI through Innovation, Governance, and Public Trust) — <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-21-Accelerating-Federal-Use-of-AI-through-Innovation-Governance-and-Public-Trust.pdf>
- OMB M-25-22 (Driving Efficient Acquisition of Artificial Intelligence in Government) — <https://www.whitehouse.gov/wp-content/uploads/2025/02/M-25-22-Driving-Efficient-Acquisition-of-Artificial-Intelligence-in-Government.pdf>
- OMB M-26-04 (Increasing Public Trust in Artificial Intelligence Through Unbiased AI Principles) — <https://www.whitehouse.gov/wp-content/uploads/2025/12/M-26-04-Increasing-Public-Trust-in-Artificial-Intelligence-Through-Unbiased-AI-Principles-1.pdf>
- OMB Guidance on 2025 Agency AI Reporting, and OMB's consolidated 2025 Federal Agency AI Use Case Inventory — <https://github.com/ombegov/2025-Federal-Agency-AI-Use-Case-Inventory>
- NIST AI Risk Management Framework 1.0 — <https://www.nist.gov/itl/ai-risk-management-framework>
- NIST AI 600-1 (Generative AI Profile) — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's AI RMF artefact (recommended prerequisite — if absent, suggest running `/arckit:us-ai-rmf` first)
   - The project's REQ artefact — extract `NFR-SEC-*`, `DR-*`, `INT-*`, plus any explicit fairness / non-discrimination requirements
   - The project's STKE artefact — for affected populations and decisions affecting them
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-ai-impact-template.md` (user override)
   - **Then**, `.arckit/templates/us-ai-impact-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/us-ai-impact-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AIIA {VERSION} --filename` for the artefact filename. The type code for this command is `AIIA`. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the US regime to `_partials/document-control-us.md`, which already carries the EO 13526 / 32 CFR Part 2002 marking ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **AI System Summary** — system name, agency owner, mission served, model type, intended decisions or actions supported, scale (users / decisions per day), stage of development (pre-deployment / pilot / deployed / retired).
   - **Presumed High-Impact Check** — match the use case against the fifteen M-25-21 §6 purposes, (a) to (o). Record each matched letter with the purpose text, or "no §6 match" if none.
   - **High-Impact Determination** — apply the §5 definition: does the AI's output serve as a principal basis for a decision or action with a legal, material, binding, or significant effect on any of the six areas? Name the decision or action, the output it relies on, the affected population and the areas affected. Record the verdict in the values OMB's inventory uses: High-impact / Presumed high-impact, but determined not high-impact / Not high-impact. Where a §6 match is determined not high-impact, record the written notice to the CAIO and its justification (§4(a)).
   - **Pilot Exemption** — only if the use case is a pilot claiming exemption from the minimum practices: record all four §4(a)(i) conditions (limited scale and duration; CAIO certification, tracked centrally; opt-in and opt-out for individuals where possible; practices applied where practicable).
   - **Minimum Risk-Management Practices Checklist** — the seven M-25-21 §4(b) practices: (i) pre-deployment testing and risk-mitigation plans; (ii) the AI impact assessment; (iii) ongoing monitoring; (iv) human training and assessment; (v) human oversight, intervention and accountability, with a fail-safe where practicable; (vi) consistent remedies or appeals; (vii) consultation and feedback from end users and the public. For each: status (Met / Partial / Not Met / Not Applicable), evidence reference, action. Then cover the seven elements the impact assessment must address under §4(b)(ii): purpose and expected benefit; data quality and model capability; potential impacts on privacy, civil rights and civil liberties; reassessment schedule; costs; results of an independent review; and risk acceptance signed by the accepting official.
   - **Waiver Posture** — if any minimum practice cannot be met, document the waiver test (M-25-21 §4(a)(ii)–(iv)) and the CAIO's written determination record: ground, risk-assessment reference, compensating measures, OMB report date (within 30 days), annual certification date (the waiver period) and public summary. Without a waiver, a high-impact use case that does not meet a practice must be safely discontinued.
   - **M-25-22 Acquisition Terms** — for AI procured from a vendor under M-25-22: the solicitation's high-impact disclosure and the vendor documentation it requires (§4(c)); the contract terms §4(d) requires (IP rights and use of government data, including the prohibition on training on non-public agency data; privacy; vendor lock-in protections; M-25-21 compliance requirements; ongoing testing and monitoring) and those it encourages (vendor performance requirements, new-feature notification); the ATO before deployment (§4(e)); and closeout transfer of data and derived assets (§4(f)). For a large language model, add the M-26-04 Unbiased AI Principles terms and minimum vendor transparency.
   - **Public Reporting Obligations** — confirm the entry has been (or will be) added to the agency AI Use Case Inventory submitted to OMB and published at `[agency.gov]/ai`, with the high-impact field set; that the summary of any not-high-impact determination or waiver is published (§4(a)(iv)); and note any details withheld because sharing them would be inconsistent with law or government-wide policy (for example the 5 U.S.C. §552 exemptions).
   - **CAIO Sign-Off Block** — agency Chief AI Officer review and approval section: reviewer, date, scope of approval, conditions, next review. Record the independent reviewer and the risk-accepting official separately.

7. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AIIA** per-type checks pass. Fix any failures before proceeding.
8. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.mjs`.

9. Emit a short summary to the user — high-impact verdict (high-impact / presumed high-impact, but determined not high-impact / not high-impact), §6 match (Y/N, with letters), minimum-practice satisfaction percentage, waiver count, AI Use Case Inventory ID (or "pending"), and CAIO review status. Do not echo the full artefact.

## Handoffs

Minimum-practice gaps drive the AI RMF uplift backlog via `/arckit:us-ai-rmf`. PII-handling AI systems require `/arckit:us-privacy-pia`, and the impact assessment should reference the PIA (M-25-21 §4(b)(ii)(C)). Any residual M-25-21 risks — particularly waiver scenarios — should be entered into `/arckit:risk` with the next CAIO review date.

## Important Notes

- **M-24-10 is rescinded** — M-25-21 rescinded and replaced it on 3 April 2025. Do not use M-24-10's rights-impacting and safety-impacting categories, its Appendix I lists, its minimum-practice list or its 1 December 2024 deadline. Use the §5 high-impact definition, the §6 presumed purposes and the §4(b) practices, and re-run any assessment written under M-24-10.
- **EO 14110 is revoked** — January 2025. Do not cite EO 14110 as the basis for impact assessment. The active mandates are OMB M-25-21 (use) and OMB M-25-22 (acquisition); NIST AI 600-1 provides the GenAI risk taxonomy.
- **The §6 list is a presumption, not the test** — an agency may conclude that a §6 use case is not high-impact, but only with written notice to the CAIO, who may revisit the conclusion at any time. Where the evidence is unclear, treat the use case as high-impact.
- **Minimum practices are not optional for high-impact AI** — since 3 April 2026 a high-impact use case that does not meet them must be safely discontinued. A waiver needs a written CAIO determination that the CAIO cannot delegate, a report to OMB within 30 days, annual certification and a public summary; it is not a hidden off-ramp.
- **M-25-22 binds acquisitions, not just internal builds** — vendor-supplied AI used for a high-impact purpose must still meet the M-25-21 practices, and the contract must give the agency the documentation and testing access to show it.
- **AI Use Case Inventory is public** — agencies publish their inventories at `[agency.gov]/ai`, and OMB consolidates them on GitHub. Withhold only the details that law or government-wide policy require; pre-clear withheld details with the agency CAIO and SAOP before submission, not after.
