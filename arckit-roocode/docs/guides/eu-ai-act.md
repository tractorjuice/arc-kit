# EU AI Act Compliance Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-ai-act` generates an EU AI Act (Regulation 2024/1689) compliance assessment, covering risk classification, conformity requirements, prohibited practices, and GPAI model obligations.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI system purpose and functionality |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Training data, input/output data |
| Risk register | AI-specific risks and mitigations |
| DPIA / RGPD | Personal data in AI processing |

---

## Command

```bash
/arckit.eu-ai-act Assess AI Act compliance for <AI system description>
```

Output: `projects/<id>/ARC-<id>-AIACT-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope Determination | Is it an AI system under Art. 3? GPAI model? |
| Risk Classification | Unacceptable / High-risk / Limited / Minimal |
| Prohibited Practices | Art. 5 checks (social scoring, biometric categorisation) |
| High-Risk Obligations | Conformity assessment, technical documentation, CE marking |
| Transparency | Art. 50 disclosure requirements (chatbots, deepfakes) |
| GPAI Model Obligations | Training data transparency, copyright policy, systemic risk |
| Human Oversight | Art. 14 human oversight mechanisms |
| EUDB Registration | EU AI Act database registration (high-risk systems) |
| Fundamental Rights | Impact on protected groups |
| Gap Analysis | Gaps with priority and deadline |

---

## Risk Classification (Annex III High-Risk Categories)

| Category | Examples |
|----------|---------|
| Biometric identification | Real-time remote biometric identification |
| Critical infrastructure | Water, energy, transport management |
| Education | Student assessment, admissions |
| Employment | CV screening, performance monitoring |
| Essential services | Credit scoring, benefits eligibility |
| Law enforcement | Polygraph, risk assessment tools |
| Migration | Asylum, border screening |
| Administration of justice | Legal interpretation, dispute resolution |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define AI system and use case | `/arckit.requirements` |
| Risk | Data and AI risk assessment | `/arckit.risk`, `/arckit.dpia` |
| Assessment | AI Act compliance assessment | `/arckit.eu-ai-act` |
| CRA | If product with digital elements | `/arckit.eu-cra` |

---

## Review Checklist

- AI system vs GPAI model distinction made.
- Prohibited practices (Art. 5) explicitly excluded or assessed.
- Risk classification determined with Annex III reference.
- High-risk: technical documentation, conformity assessment route, CE marking plan.
- Transparency obligations (Art. 50) assessed for chatbots and deepfake tools.
- EUDB registration planned for high-risk systems.
- Human oversight mechanisms documented.
- Fundamental rights impact assessment conducted for high-risk.
