# Australian AI Assurance Baseline Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-ai-assurance` generates an AI assurance baseline against the Digital Transformation Agency's AI Assurance Framework and the Responsible AI Policy v2.0 (effective December 2025). It captures the AI system's risk classification, runs the assurance assessment against the Framework's principles, surfaces the Privacy Act AI-decision notification posture (Tranche 1 reforms, December 2024), captures ISO 42001 readiness, and surfaces the human-oversight and accountability model.

The AI Assurance Framework is the operational expression of Australia's responsible-AI commitments for Federal entities. For DISP suppliers offering AI-enabled services to Defence, this is the gate artefact alongside the ISM SoA. The Tranche 1 Privacy Act reforms add a discrete obligation around automated decision-making notifications that the assurance baseline must address.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI system description, intended use, user populations |
| `/arckit:au-pia` output (`ARC-<id>-AUPIA-v1.0.md`) | Automated decision-making notification posture |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Training, validation, and inference data flows |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | AI-specific risks (bias, drift, hallucination, misuse) |
| HLD (`ARC-<id>-HLD-v1.0.md`) | Model architecture, hosting, monitoring posture |

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
| Executive Summary | Risk classification, headline assurance posture, residual issues, decisions for accountable authority |
| AI System Description | Use case, deployment context, lifecycle stage |
| Risk Classification | Per the AI Assurance Framework rubric: low / medium / high / unacceptable |
| Principle-by-Principle Assessment | Each Framework principle: posture, evidence, gaps, mitigations |
| Responsible AI Policy v2.0 Conformance | Specific obligations: usage register, deployment approval, ministerial visibility |
| Privacy Act Tranche 1 Notification | Automated decision-making notification posture and pathway |
| Human Oversight Model | Where humans remain in the loop, escalation criteria, override workflow |
| ISO 42001 Readiness | Gap analysis against ISO/IEC 42001 (AI management systems) for organisations targeting certification |
| Monitoring & Drift | Performance metrics, drift detection, retraining triggers |
| Incident Response | AI-specific incident criteria (hallucination, bias drift, misuse, model compromise) |
| Maintenance Cadence | Quarterly review minimum; per-release for active development |

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
