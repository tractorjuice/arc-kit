---
description: "[COMMUNITY] Conduct a NIST AI Risk Management Framework 1.0 assessment (Govern / Map / Measure / Manage) of an AI system, including the Generative AI Profile (NIST AI 600-1) where applicable."
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

You are an enterprise architect conducting a **NIST AI Risk Management Framework (AI RMF) 1.0** assessment of an AI / ML system used by a US federal civilian agency.

## User Input

```text
$ARGUMENTS
```

## Context

The NIST AI RMF 1.0 (January 2023) provides a voluntary, rights-preserving, sector-agnostic framework for managing risks to individuals, organisations, and society from AI systems. It defines four core functions — **Govern**, **Map**, **Measure**, **Manage** — each broken into categories and subcategories with associated outcomes. The AI RMF Playbook publishes suggested actions per subcategory.

The **Generative AI Profile (NIST AI 600-1, July 2024)** is a cross-sectoral profile that enumerates twelve distinct GenAI risks and maps each to AI RMF actions. Use the GenAI Profile additionally for any system containing generative components.

The AI RMF underpins the federal policy stack: OMB M-24-10 requires agencies to apply AI RMF practices to AI use cases, and M-25-21 directs agencies to require AI RMF alignment from AI acquisition vendors. NIST AI 600-1 supersedes the now-revoked EO 14110 expectations for the federal GenAI use-case posture.

**Authoritative anchors**:

- NIST AI Risk Management Framework 1.0 — <https://www.nist.gov/itl/ai-risk-management-framework>
- NIST AI RMF 1.0 PDF — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf>
- NIST AI RMF Playbook — <https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook>
- NIST AI 600-1 (Artificial Intelligence Risk Management Framework: Generative AI Profile) — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>
- NIST AI 100-2 E2023 (Adversarial Machine Learning: A Taxonomy and Terminology of Attacks and Mitigations) — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-2e2023.pdf>

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract `DR-*` (data requirements, especially training/inference data), `NFR-SEC-*`, `NFR-FAIR` (fairness if defined), `INT-*`
   - The project's DATA / data-model artefact — for training-data lineage, PII presence, sensitive attributes
   - The project's STKE artefact — for affected populations and decision-impact analysis
   - Any model cards, datasheets, or vendor model documentation under `projects/<id>/external/` or `projects/<id>/vendors/`
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/us-ai-rmf-template.md` (user override)
   - **Then**, `.arckit/templates/us-ai-rmf-template.md`
   - **Fallback**, `.arckit/templates/us-ai-rmf-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AIRMF --filename` for the artefact filename. The type code for this command is `AIRMF`.

5. Generate the following sections:

   - **AI System Description** — purpose, mission served, model type (classification / regression / generative / agentic / RL), training/fine-tuning regime, inference deployment pattern, human-in-the-loop posture, scale (users, decisions/day), and life-cycle stage (research / pilot / production / sunset).
   - **AI System Lifecycle and Actors** — which stages of the AI lifecycle (per AI RMF §3) are in scope (Plan & Design, Collect & Process Data, Build & Use Model, Verify & Validate, Deploy & Use, Operate & Monitor); identify Test, Evaluation, Verification, and Validation (TEVV) responsibilities.
   - **Govern Function Assessment** — for each Govern subcategory (Govern 1.1–1.7, 2.1–2.3, 3.1–3.2, 4.1–4.3, 5.1–5.2, 6.1–6.2) record: outcome statement, current state, evidence, gap actions. Document policies, accountability mechanisms, diverse-perspective inclusion, supply-chain accountability.
   - **Map Function Assessment** — Map 1–5 categories: AI context (Map 1), categorisation of the system (Map 2), risks/benefits (Map 3), risks of third-party components (Map 4), impacts on affected populations (Map 5). Build the impact-analysis matrix here.
   - **Measure Function Assessment** — Measure 1–4 categories: select metrics and methodologies for trustworthiness characteristics (valid & reliable, safe, secure & resilient, accountable & transparent, explainable & interpretable, privacy-enhanced, fair with harmful bias managed). Document test methods (offline metrics, online A/B, red-teaming) and frequency.
   - **Manage Function Assessment** — Manage 1–4 categories: prioritisation of risks, decision criteria for deploy / withdraw, third-party risk management, ongoing monitoring (drift, performance, fairness), incident response. Cross-reference the IR controls in the NIST 800-53 artefact.
   - **Generative AI Profile Addendum (NIST AI 600-1)** — required if the system uses generative AI (LLM, diffusion, multi-modal generative). Assess against the 12 GenAI risks: (1) CBRN information or capabilities; (2) Confabulation; (3) Dangerous, violent, or hateful content; (4) Data privacy; (5) Environmental impacts; (6) Harmful bias and homogenisation; (7) Human-AI configuration; (8) Information integrity; (9) Information security; (10) Intellectual property; (11) Obscene, degrading, or abusive content; (12) Value chain and component integration. For each risk: applicability, current controls, residual risk, action items.
   - **Residual Risk Register** — risks remaining after Manage actions, prioritised; each linked to a target review date.
   - **Control Crosswalk** — table mapping AI RMF subcategories to NIST 800-53 Rev 5 controls and to OMB M-24-10 minimum-practice items, so the assurance posture is traceable.

6. Use the Write tool to save the artefact at the path returned by `create-project.sh` + `generate-document-id.sh`.

7. Emit a short summary to the user — AI system type, GenAI in scope (Y/N), top 5 residual risks, M-24-10 impact-class hint (rights-impacting / safety-impacting / neither), and CAIO review status. Do not echo the full artefact.

## Handoffs

The RMF findings drive `/arckit:us-ai-impact` — the M-24-10 rights/safety-impacting determination and M-25-21 acquisition controls inherit the RMF risk register. PII-handling AI systems require `/arckit:us-privacy-pia`. Residual risks flow into `/arckit:risk`. Significant model, hosting, data-governance, and human-oversight decisions captured during the RMF process should be recorded as ADRs via `/arckit:adr`.

## Important Notes

- **The AI RMF is voluntary in form, mandatory in effect** — the framework itself is voluntary, but OMB M-24-10 directs federal agencies to apply AI RMF practices and M-25-21 directs them to require AI RMF alignment from vendors. The federal civilian effect is mandatory.
- **EO 14110 is revoked** — January 2025. Do not cite EO 14110 as the source of GenAI policy. The active anchors are OMB M-24-10, OMB M-25-21, and NIST AI 600-1.
- **Govern is a precondition, not a parallel track** — Map / Measure / Manage cannot satisfy their outcomes if the Govern function is weak. Score Govern honestly even where mission urgency tempts shortcutting.
- **GenAI Profile is additive, not replacement** — for systems with generative components, run both the full AI RMF and the AI 600-1 Profile. The Profile adds risks not surfaced by the base RMF (confabulation, value-chain integration, information integrity).
- **Adversarial ML is now in scope** — NIST AI 100-2 E2023 catalogues evasion, poisoning, extraction, and inference attacks. Measure-function security testing must include adversarial-ML threat modelling, not just traditional infosec testing.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:us-ai-impact` -- Translate AI RMF findings into the M-24-10 rights-impacting / safety-impacting determination and the M-25-21 acquisition controls.
- `/arckit:us-privacy-pia` -- AI systems trained on or inferencing over PII require an E-Gov Act §208 PIA; the AI RMF data inventory seeds the PIA.
- `/arckit:risk` -- Residual AI risks (confabulation, bias, security, value-chain) flow into the project risk register.
- `/arckit:adr` -- Model architecture, hosting, data-governance, and human-oversight decisions made during the RMF process warrant ADRs.
