# US NIST AI RMF Assessment

> **Overlay**: USA Federal Civilian Community Overlay | **ArcKit Version**: [VERSION]

`/arckit:us-ai-rmf` produces a NIST AI Risk Management Framework 1.0 assessment for an AI/ML system, scoring the four core functions (Govern, Map, Measure, Manage) and applying the AI RMF Playbook actions. Where generative AI is in scope, the assessment cross-references **NIST AI 600-1 (Generative AI Profile)** to add GenAI-specific risk categories (confabulation, data privacy leakage, harmful bias, value chain risk, dangerous content, IP infringement, etc.).

This artefact is the **AI risk evidence base** that downstream artefacts (`us-ai-impact`, vendor evaluations, ATO packages) cite. It is voluntary at federal level but functionally required: the M-24-10 / M-25-21 chain expects agencies to demonstrate AI risk management, and the AI RMF is the agreed framework.

Reviewed by the agency Chief AI Officer (CAIO), Senior AI Official (SAO), Senior Agency Official for Privacy (SAOP), the System Owner, and the AI safety / model-evaluation function where one exists.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI-related FRs and NFRs, decision logic |
| Data Model (`ARC-<id>-DMOD-v1.0.md`) | Training data, inference data, PII flags |
| Architecture Principles (`ARC-<id>-PRIN-v1.0.md`) | Responsible-AI principles |

---

## Output

- **Doc-type**: `AIRMF`
- **Filename**: `ARC-<PID>-AIRMF-v1.0.md` (project root, single-instance)

---

## Process Overview

1. Apply the four AI RMF functions in turn — Govern, Map, Measure, Manage.
2. Walk the AI RMF Playbook actions; capture evidence, gaps, owners.
3. Where GenAI is in scope, apply the NIST AI 600-1 cross-reference for GenAI risk categories.
4. Score each function (qualitative + evidence-backed) and document the measurement plan.
5. Surface high-residual-risk items for the impact assessment and the risk register.

---

## Regulatory Anchors

- **NIST AI RMF 1.0** — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf>
- **NIST AI RMF Playbook** — <https://airc.nist.gov/AI_RMF_Knowledge_Base/Playbook>
- **NIST AI 600-1 (Generative AI Profile)** — <https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf>

---

## Example Usage

```bash
/arckit:us-ai-rmf 001-claims-triage-llm
```

---

## Common Pitfalls

- **Scoring all four functions equally without evidence.** Govern is usually mature, Measure is usually weakest. Equal scoring across the board is a tell that the assessment was theoretical.
- **Ignoring GenAI-specific risks when LLMs are involved.** If the system uses LLMs / foundation models, the AI 600-1 profile is not optional — confabulation and value-chain risk in particular need explicit treatment.
- **No measurement plan.** Risk that cannot be measured cannot be managed. Each high-residual risk needs a metric, a threshold, and a data source.
- **Treating AI RMF as a one-shot.** Models drift, training data rotates, user populations evolve — refresh the assessment on each retrain or material change.

---

## Handoffs

- **`us-ai-impact`** — AI RMF feeds the OMB M-24-10 / M-25-21 impact assessment
- **`us-privacy-pia`** — AI-decision logic and training-data PII feed the PIA
- **`risk`** — high-residual AI risks flow into the project risk register
- **`adr`** — foundation-model selection, fine-tuning vs. RAG, sovereignty calls warrant ADRs
