---
description: "[COMMUNITY] Generate an AI assurance assessment for Australian Government / regulated-sector AI systems covering DTA AI Policy v2.0, ISO 42001, AU AI Ethics Principles, and Privacy Act AI-decision notification (Dec 2026)."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified AI ethics specialist, Privacy Officer, or DTA-aligned AI assurance assessor before reliance. DTA AI Policy v2.0 may have been updated — verify against the current edition before any external use.

You are an enterprise architect generating an **AI assurance assessment** for an Australian Government or regulated-sector AI / machine-learning system.

## User Input

```text
$ARGUMENTS
```

## Context

Australia's AI assurance landscape combines several frameworks that together govern AI deployment in government and regulated industry:

- **DTA Responsible AI Policy v2.0 (effective Dec 2025)** — mandatory for non-corporate Commonwealth entities; expected via flow-down for AU Government tenderers and suppliers
- **AU AI Ethics Principles** (Department of Industry, 2019) — 8 voluntary principles
- **AU Essential AI Practices ("AI6")** — National AI Centre (NAIC) operational guidance: 6 essential practices for safe and responsible AI adoption (accountability, impact assessment, risk management, information sharing, testing/monitoring, human control). Foundations + Implementation Guidance issued via ai.gov.au.
- **ISO 42001:2023 — AI Management Systems** — Australian Standard adopted Feb 2024; certification expected to become baseline for AI-intensive vendors
- **Privacy Act 1988 (Cth)** — AI decision-making notification required from Dec 2026 (Tranche 1 reform)
- **Online Safety Act + AI-generated content provisions**
- Sector-specific: APRA CPS 234 (AI in financial services), AHPRA AI guidance (health)

**Authoritative anchors**:

- DTA Responsible AI Policy v2.0 — <https://www.digital.gov.au/policy/ai/policy>
- AU AI Ethics Principles — <https://www.industry.gov.au/publications/australias-artificial-intelligence-ethics-framework/australias-ai-ethics-principles>
- AU Essential AI Practices (AI6) — Guidance for AI Adoption: Foundations — <https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-foundations>
- AU Essential AI Practices — Implementation Guidance — <https://www.ai.gov.au/staying-safe-and-responsible/essential-ai-practices/guidance-ai-adoption-implementation-guidance>
- Privacy Act 1988 (Cth) — <https://www.legislation.gov.au/Details/C2024C00301>

## Process

1. Read prerequisites:
   - Project's PIA artefact (`ARC-{P}-AUPIA-v*`) — APP 6 + APP 11 cross-reference
   - Project's DATA artefact — for training/inference data classification
   - Project's DFD artefacts (`ARC-{P}-DFD-*`) — for AI data, prompt, inference, output, and feedback flows
   - Project's REQ artefact — extract AI-specific requirements
   - Project's RISK artefact — existing AI risks
   - Project's TRAC artefact — existing requirement-to-control-to-risk mappings
   - Project's maturity-model artefact if available — AI governance capability baseline
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ai-assurance-template.md`
   - Then: `.arckit/templates/au-ai-assurance-template.md`
   - Fallback: `.arckit/templates/au-ai-assurance-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUAIA --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **AI System Description** — system name, purpose, AI capability type (generative / predictive / decision-support / decision-making / agentic / multi-modal), deployment phase (research / pilot / production), foundation model used (e.g., GPT-4 / Claude / Gemini / open-source), training-data sources, inference-data sources, decisions affecting individuals (yes/no — describe), human-in-the-loop posture.

   - **DTA Responsible AI Policy v2.0 Compliance** — assessment against the policy's six accountabilities:
     1. **Accountability** — designated AI accountable officer
     2. **Transparency** — public AI use disclosure
     3. **Risk-based approach** — AI risk assessment performed
     4. **Quality data + design integrity** — data lineage, model documentation
     5. **Privacy + security** — cross-reference PIA + ISM + E8
     6. **Human oversight + redress** — human review mechanism, individual appeal pathway

   - **AU AI Ethics Principles Alignment** — assess against the 8 principles:
     1. Human, societal and environmental wellbeing
     2. Human-centred values
     3. Fairness
     4. Privacy protection and security
     5. Reliability and safety
     6. Transparency and explainability
     7. Contestability
     8. Accountability

     For each principle: status (Aligned / Partial / Not Aligned), evidence, gap, mitigation.

   - **AU Essential AI Practices (AI6) Alignment** — assess against the 6 essential practices issued by the National AI Centre via ai.gov.au:
     1. Decide who is accountable
     2. Understand impacts and plan accordingly
     3. Measure and manage risks
     4. Share essential information
     5. Test and monitor
     6. Maintain human control

     For each practice: status (Implemented / Partial / Not Implemented / Not Applicable), evidence (artefact references where possible), gap, action. Cross-reference the DTA Responsible AI Policy six accountabilities — both frameworks share underlying principles but differ in scope (DTA = policy mandate for Commonwealth entities; AI6 = practical adoption guidance for any organisation). The AI6 *Implementation Guidance* on ai.gov.au provides "Getting started" and "Next steps" prompts per practice — useful for filling in evidence and action columns.

   - **ISO 42001 Readiness** — assessment against the standard's clauses (context, leadership, planning, support, operation, performance evaluation, improvement). Useful for organisations pursuing or anticipating ISO 42001 certification.

   - **Privacy Act AI-Decision Notification (Dec 2026)** — if the AI system makes substantially-automated decisions significantly affecting individuals, document: notification mechanism implemented (or planned for Dec 2026), what individuals are told, opt-out pathway if applicable. Cross-reference AUPIA APP 6 + APP 11.

   - **Fairness Assessment** — bias evaluation methodology, protected-attribute analysis, fairness metrics used (demographic parity / equalised odds / etc.), test results across population segments, residual fairness risks.

   - **Security of AI Training + Inference Data** — training-data classification (often higher than expected — model can memorise PI), inference-data flow (input PII handling, output PII risk), prompt-injection defences, model-extraction defences. Cross-reference E8 posture + ISM applicability.

   - **Model Lifecycle Governance** — version control, change-management for model updates, drift detection, retirement/sunset criteria.

   - **Vendor / Foundation-Model Disclosure** — for systems built on third-party foundation models, document: vendor name, model version, vendor's AI policy compliance, training-data provenance disclosure (if available), data-residency for inference, IP / copyright position.

   - **ArcKit Evidence Integration** — map `/arckit:dfd`, `/arckit:data-model`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` evidence to AI policy accountabilities, model controls, privacy obligations, lifecycle controls, and assurance gaps.

   - **Recommendations** — prioritised AI assurance actions grouped by Quick Wins / Short-Term / Medium-Term, each tagged to which framework it satisfies.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. DTA AI Policy v2.0, AU AI Ethics Principles, AU Essential AI Practices (AI6) — Foundations + Implementation Guidance, ISO 42001 (Australian Standard), and Privacy Act 1988 MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the DTA + Ethics Principles compliance summary table).

## Important Notes

- DTA AI Policy v2.0 applies to **non-corporate Commonwealth entities** directly. State/Territory Government and corporate Commonwealth entities are not bound but commonly flow it down via tender requirements. Suppliers to those entities should track for contractual flow-down.
- The **December 2026 Privacy Act AI-decision notification** is a deadline. Systems making automated decisions significantly affecting individuals must implement the notification mechanism by then — design choices made before that date should anticipate the requirement.
- Foundation-model use is a supply-chain concern. Vendor lock-in, training-data disclosure, IP indemnification, and inference-region sovereignty are commonly under-assessed in early-pilot AI systems.
- Bias / fairness assessment is methodology-dependent. Recipes should not produce a "passes fairness" verdict from data alone — refer to a qualified data-ethics specialist for fairness validation.
- For research / pilot AI not yet making production decisions, the assessment should still describe forward-looking requirements that will apply once the system moves to production. This avoids "we'll add it later" technical debt.
- AI assurance findings often surface security and privacy implications that should propagate to AUPIA + AUE8 + AUISM artefacts. Recommend re-runs of those artefacts when an AI system materially changes.
- Use embedded ArcKit artefacts as evidence: DFDs for AI flows, data models for entity classification, risk registers for model risks, traceability for obligations and controls, graph-report for coverage gaps, and maturity-model for capability uplift.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:dfd` -- DFDs show AI input, prompt, training, inference, output, disclosure, and feedback flows for assurance review.
- `/arckit:data-model` -- Data model evidence identifies training, inference, prompt, output, personal, sensitive, and derived data entities.
- `/arckit:au-pia` -- AI fairness + automated decision-making findings feed APP 6 + APP 11 in the PIA.
- `/arckit:au-dss` -- AI assurance feeds DSS Criterion 7 (privacy) + Criterion 5 (security of training/inference data).
- `/arckit:au-ism-controls` -- AI training / inference data security cites ISM Domain 9 (System Hardening) + Domain 12 (Cryptography).
- `/arckit:risk` -- AI-specific risks (bias, drift, prompt injection, training-data exposure) feed the project risk register.
- `/arckit:traceability` -- AI obligations, model controls, privacy findings, and mitigations should trace back to requirements and risks.
- `/arckit:maturity-model` -- AI assurance findings can seed an AI governance and model lifecycle maturity model.
- `/arckit:graph-report` -- Graph reporting should show AUAIA coverage alongside privacy, data, risk, and traceability artefacts.
