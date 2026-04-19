# French Public Algorithm Transparency Notice Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.fr-algorithme-public` generates a mandatory transparency notice for French public administration algorithmic decisions under CRPA Article L311-3-1 (Loi République Numérique 2016). More legally binding than the UK ATRS equivalent.

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
/arckit.fr-algorithme-public Generate transparency notice for <algorithm and decision type>
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
| Parameters and Weights | All input parameters and their relative weights |
| Human Oversight | Human review mechanisms and appeal rights |
| GDPR Art. 22 | Automated individual decisions — safeguards required |
| EU AI Act | Flag if ML system falls under AI Act high-risk category |
| Publication Plan | Publication channel, update frequency |
| Gap Analysis | Gaps with legal obligation reference |

---

## Scope — Which Decisions Are Covered

Individual administrative decisions based exclusively or significantly on algorithmic processing, including:
tax assessment, benefits eligibility, social scoring, scholarship allocation, admission decisions, permit decisions, fine calculation.

Excluded: decisions with mandatory human review at every step.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Algorithm scope and decision impact | `/arckit.requirements` |
| Data | Data model and personal data | `/arckit.data-model` |
| GDPR | Art. 22 compliance | `/arckit.eu-rgpd`, `/arckit.dpia` |
| Notice | Algorithm transparency notice | `/arckit.fr-algorithme-public` |
| AI Act | If ML system | `/arckit.eu-ai-act` |

---

## Review Checklist

- Legal obligation scope confirmed (CRPA Art. L311-3-1).
- All in-scope algorithms inventoried with ALGO-xx identifier.
- Plain-language description suitable for the public (not technical).
- All parameters and weights documented — no "black box" permitted.
- Human oversight mechanism documented (who can review, how to appeal).
- GDPR Art. 22 safeguards in place for automated individual decisions.
- EU AI Act flag if ML system used (may trigger high-risk classification).
- Publication plan: channel, format, update trigger.
- Document classified PUBLIC (transparency notice must be publicly accessible).

---

## Key Notes

- **Legally binding**: Unlike the UK ATRS (voluntary), the French transparency obligation is a statutory requirement enforceable by the CADA.
- **CADA** = Commission d'Accès aux Documents Administratifs — oversees compliance and handles citizen complaints.
- **Plain language requirement**: The description must be understandable by any citizen without technical background.
- **Scope**: Applies to public administrations only — private sector algorithmic decisions are not covered by CRPA (but may be covered by GDPR Art. 22).
