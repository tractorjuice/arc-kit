# Australian AI Assurance Baseline Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-ai-assurance` generates an AI assurance baseline against the Digital Transformation Agency's AI Assurance Framework and the Responsible AI Policy v2.0 (effective December 2025). It describes the AI system, assesses it against the Responsible AI Policy accountabilities, the AU AI Ethics Principles and the Essential AI Practices (AI6), surfaces the Privacy Act AI-decision notification posture (introduced by the Tranche 1 reforms in December 2024, commencing December 2026), captures ISO 42001 readiness, and records fairness, data security, model lifecycle and vendor disclosure.

The AI Assurance Framework is the operational expression of Australia's responsible-AI commitments for Federal entities. For DISP suppliers offering AI-enabled services to Defence, this is the gate artefact alongside the ISM SoA. The Tranche 1 Privacy Act reforms add a discrete obligation around automated decision-making notifications that the assurance baseline must address.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI system description, intended use, user populations |
| `/arckit:au-pia` output (`ARC-<id>-AUPIA-v1.0.md`) | Automated decision-making notification posture |
| Data model (`ARC-<id>-DATA-v*.md`) | Training, validation, and inference data flows |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | AI-specific risks (bias, drift, hallucination, misuse) |
| Vendor HLD (`vendors/*/hld-v*.md`) | Model architecture, hosting, monitoring posture |

---

## Command

```bash
/arckit:au-ai-assurance <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUAIA-v1.0.md`

---

## Assurance Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | AI system, deployment phase, frameworks in scope, overall assurance posture, key gaps |
| 1. AI System Description | Purpose, capability type, deployment phase, foundation model, training and inference data, decisions affecting individuals, human-in-the-loop posture, population affected, AI accountable officer |
| 2. DTA Responsible AI Policy v2.0 Compliance | The six accountabilities: status, evidence, gap, mitigation |
| 3. AU AI Ethics Principles Alignment | The eight principles: status, evidence, gap, mitigation |
| 4. AU Essential AI Practices (AI6) Alignment | The six National AI Centre practices: status, evidence, gap, action |
| 5. ISO 42001 Readiness | Readiness by clause 4–10 and certification position |
| 6. Privacy Act AI-Decision Notification (Dec 2026) | Substantially automated decisions, notification mechanism, what individuals are told, opt-out pathway, PIA cross-reference |
| 7. Fairness Assessment | Methodology, protected attributes, test segments, metrics and results, residual fairness risks, validator |
| 8. Security of AI Training + Inference Data | Data classification, prompt-injection and model-extraction defences, training-data sanitisation, E8 and ISM cross-references |
| 9. Model Lifecycle Governance | Version control, change management, drift detection, retraining cadence, retirement criteria, audit trail |
| 10. Vendor / Foundation-Model Disclosure | Vendor, model and version, vendor AI policy, training-data provenance, inference region, IP position, data-use policy |
| 11. Recommendations | Quick Wins / Short-Term / Medium-Term, each tagged to its framework |
| 12. External References | ArcKit evidence integration, document register, citations, unreferenced documents, verification dates |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

---

## Regulatory Anchors

- **DTA AI Assurance Framework** — primary assurance methodology (current version)
- **Responsible AI Policy v2.0** — effective December 2025; usage transparency obligations
- **Privacy Act 1988 (Cth)** — Tranche 1 reforms (Dec 2024): automated decision-making notification
- **ISO/IEC 42001** — AI management system standard; voluntary but increasingly procurement-relevant
- **NSW AI Assurance Framework** — sub-federal reference; non-binding for Commonwealth but informative
- **DTA Generative AI Framework / Guardrails** — generative-AI-specific extensions

---

## When to Run

- For any AI / ML system entering Federal use; for DISP suppliers shipping AI to Defence
- Pre-deployment and at each material model change (retraining, new use case, new population)
- Quarterly minimum once Live; per-release in active development
- On regulatory update (Framework version change, new policy version)

---

## Common Pitfalls

- **Treating LLMs as low risk by default** — generative AI in customer-facing or decision-support contexts is typically medium or high. Map honestly.
- **Missing the Tranche 1 notification trigger** — automated decisions that affect individuals trigger notification obligations under the amended Privacy Act. Cross-check the PIA explicitly.
- **No drift monitoring** — assurance is a posture at a point in time. Without continuous monitoring, the posture lapses immediately.
- **ISO 42001 confused with conformance** — readiness is a gap analysis, not a certification claim. Mark certification status explicitly.

---

## Handoff

Cross-references `/arckit:au-pia` (automated decision-making notification), `/arckit:au-ism-controls` (technical controls for model serving), and feeds `/arckit:au-disp-attestation` (DISP supplier AI assurance evidence for Defence-facing systems).
