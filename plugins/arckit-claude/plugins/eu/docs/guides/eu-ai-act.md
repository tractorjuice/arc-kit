# EU AI Act Compliance Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-eu:eu-ai-act` generates an EU AI Act (Regulation 2024/1689) compliance assessment, covering risk classification, conformity requirements, prohibited practices, and GPAI model obligations.

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
/arckit-eu:eu-ai-act Assess AI Act compliance for <AI system description>
```

In Claude Code the overlay installs as its own plugin, `arckit-eu`, so the command is `/arckit-eu:eu-ai-act`.

Output: `projects/<id>/ARC-<id>-AIACT-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| 1. AI System Classification | Is it an AI system under Art. 3? GPAI model? Risk class: unacceptable / high-risk / limited / minimal |
| 2. Prohibited AI Practices (Art. 5) | Social scoring, biometric categorisation and the other Art. 5 checks |
| 3. High-Risk AI Requirements (Arts. 8–17) | Risk management, data governance, technical documentation, human oversight |
| 4. Transparency Obligations (Arts. 50–52) | Disclosure requirements (chatbots, deepfakes) |
| 5. GPAI Model Obligations (Arts. 53–55) | Training data transparency, copyright policy, systemic risk |
| 6. Conformity Assessment and Registration | Conformity route, CE marking, EU database registration |
| 7. French Market Context | National supervisory context |
| 8. Gap Analysis and Roadmap | Gaps with priority and deadline |

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

## Application Dates

The dates are in Article 113, as amended by Regulation (EU) 2026/1744 (the Digital Omnibus on AI, in force since 27 July 2026). The omnibus moved the high-risk dates back. August 2027 is not a date of full application: the only obligation that falls due then is for GPAI models already on the market before 2 August 2025.

| Date | What applies |
|------|--------------|
| 2 February 2025 | Prohibited practices (Art. 5) and AI literacy |
| 2 August 2025 | GPAI model obligations, governance and penalties |
| 2 August 2026 | General application, including Art. 50 transparency |
| 2 December 2026 | New Art. 5 prohibitions on non-consensual intimate imagery and child sexual abuse material |
| 2 August 2027 | GPAI models placed on the market before 2 August 2025 must comply |
| 2 December 2027 | High-risk obligations for Annex III systems |
| 2 August 2028 | High-risk obligations for AI systems in Annex I products |
| 2 August 2030 | Pre-existing high-risk systems used by public authorities must comply |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define AI system and use case | `/arckit:requirements` |
| Risk | Data and AI risk assessment | `/arckit:risk`, `/arckit:dpia` |
| Assessment | AI Act compliance assessment | `/arckit-eu:eu-ai-act` |
| CRA | If product with digital elements | `/arckit-eu:eu-cra` |

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
