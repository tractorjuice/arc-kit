# French Public Algorithm Transparency Notice Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:fr-algorithme-public` generates a mandatory transparency notice for French public administration algorithmic decisions under CRPA Article L311-3-1 (Loi République Numérique 2016). More legally binding than the UK ATRS equivalent.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Algorithmic decision-making scope and purpose |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Input data, training data, personal data |
| DPIA / EU RGPD | GDPR Art. 22 compliance for automated decisions |

---

## Command

```bash
/arckit:fr-algorithme-public Generate transparency notice for <algorithm and decision type>
```

Output: `projects/<id>/ARC-<id>-ALGO-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Legal Framework | CRPA Art. L311-3-1, Loi République Numérique, GDPR Art. 22 |
| Scope Determination | Which decisions are covered (administrative decisions affecting individuals) |
| Algorithm Inventory | Per-algorithm section (ALGO-xx identifier) |
| Algorithm Description | Plain-language description, purpose, legal basis |
| Parameters and Weights | Input parameters and their influence; weighting applied to a person's case is communicated to them on request |
| Human Oversight | Human review mechanisms and appeal rights |
| GDPR Art. 22 | Automated individual decisions — safeguards required |
| EU AI Act | Flag if ML system falls under AI Act high-risk category |
| Publication Plan | Publication channel, update frequency |
| Gap Analysis | Gaps with legal obligation reference |

---

## Scope — Which Decisions Are Covered

Individual administrative decisions taken on the basis of algorithmic processing (CRPA L311-3-1), whatever the degree of human involvement: fully automated processing and decision-support tools whose output a human then acts on are both covered. CRPA R311-3-1-2 requires the administration to explain the degree and mode of the algorithm's contribution to the decision, and DINUM's guide on public algorithms states that the obligations apply whatever the degree of human involvement. Examples include:
tax assessment, benefits eligibility, scholarship allocation, admission decisions, permit decisions, fine calculation.

Not covered: general (regulatory) decisions. Disclosure is limited where it would harm a secret protected by law (CRPA L311-5 2°, such as national defence, State security, or the prevention of offences by the competent services).

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Algorithm scope and decision impact | `/arckit:requirements` |
| Data | Data model and personal data | `/arckit:data-model` |
| GDPR | Art. 22 compliance | `/arckit:eu-rgpd`, `/arckit:dpia` |
| Notice | Algorithm transparency notice | `/arckit:fr-algorithme-public` |
| AI Act | If ML system | `/arckit:eu-ai-act` |

---

## Review Checklist

- Legal obligation scope confirmed (CRPA Art. L311-3-1).
- All in-scope algorithms inventoried with ALGO-xx identifier.
- Plain-language description suitable for the public (not technical).
- Parameters and their influence documented. The rules defining the main processes are published online (CRPA L312-1-3, administrations with 50 or more agents). The parameters and, where applicable, their weighting as applied to a person's situation are communicated to that person on request (CRPA R311-3-1-2). Details may be withheld only where disclosure would harm a secret protected by law (CRPA L311-5 2°, L311-6), and the rest is then disclosed after redaction (L311-7).
- Human oversight mechanism documented (who can review, how to appeal).
- GDPR Art. 22 safeguards in place for automated individual decisions.
- EU AI Act flag if ML system used (may trigger high-risk classification).
- Publication plan: channel, format, update trigger.
- Document classified Non protégé (transparency notice must be publicly accessible).

---

## Key Notes

- **Legally binding**: Unlike the UK ATRS (voluntary), the French transparency obligation is a statutory requirement. A refusal to communicate can be referred to the CADA, whose opinion comes before any action in the administrative courts.
- **CADA** = Commission d'Accès aux Documents Administratifs — oversees compliance and handles citizen complaints.
- **Plain language requirement**: The description must be understandable by any citizen without technical background.
- **Scope**: Applies to public administrations only — private sector algorithmic decisions are not covered by CRPA (but may be covered by GDPR Art. 22).
