# EU Digital Services Act Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-dsa` generates a DSA (Regulation EU 2022/2065) compliance assessment for online intermediary services operating in the EU. The DSA has applied in full since **17 February 2024**.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service type, user scale, functional requirements |
| Risk register | Content moderation risks, systemic risks |
| Stakeholder analysis | User groups including minors and business users |

---

## Command

```bash
/arckit.eu-dsa Assess DSA compliance for <service description and monthly EU user count>
```

Output: `projects/<id>/ARC-<id>-DSA-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Provider Classification | Mere conduit / Hosting / Platform / VLOP / VLOSE |
| General Obligations (Ch. II) | Transparency reports, complaints, authority cooperation |
| Hosting Obligations (Art. 16) | Notice and action, serious crime flagging |
| Platform Obligations (Art. 17–28) | Content moderation, dark patterns, advertising, recommender |
| VLOP/VLOSE Obligations (Ch. IV) | Systemic risk assessment, audit, researcher access |
| ARCOM Context | French Digital Services Coordinator enforcement |
| Gap Analysis | Gaps with priority by tier |

---

## Provider Tiers

| Tier | Criteria | Key Additional Obligations |
|------|---------|--------------------------|
| Mere conduit / Caching | Pure transmission | Minimal (Ch. II cooperation) |
| Hosting service | Stores user content | Notice and action |
| Online platform | Hosting + public dissemination | Content moderation, transparency, ads |
| Micro/small platform | < 50 employees AND < €10M | Reduced obligations (some Art. 20/27 exemptions) |
| VLOP / VLOSE | ≥ 45M monthly EU users, Commission-designated | Systemic risk assessment, annual audit, researcher access |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Service and user scale | `/arckit.requirements` |
| Risk | Content and platform risk | `/arckit.risk` |
| Assessment | DSA compliance assessment | `/arckit.eu-dsa` |
| AI layer | If AI-driven recommender/moderation | `/arckit.eu-ai-act` |
| GDPR layer | Personal data in ads/recommender | `/arckit.eu-rgpd` |

---

## Review Checklist

- Provider tier determined (conduit / hosting / platform / VLOP / VLOSE).
- Monthly active EU users threshold assessed vs 45M.
- Micro/small enterprise exemption assessed (< 50 FTE AND < €10M).
- General Ch. II obligations assessed (all providers).
- Hosting Art. 16 notice-and-action mechanism assessed.
- Advertising transparency (no profiling of minors) assessed.
- Recommender system transparency and non-profiling option assessed.
- VLOP/VLOSE: systemic risk assessment, audit, researcher access assessed.
- ARCOM as French DSC documented.

---

## Key Notes

- **ARCOM** (Autorité de Régulation de la Communication Audiovisuelle et Numérique) is the French Digital Services Coordinator — enforcement body for France-established providers.
- **Micro/small exemptions are real**: platforms below 50 FTE AND €10M are exempt from Art. 21 out-of-court dispute settlement and Art. 27 recommender transparency.
- **VLOP designation is Commission-driven**: the 45M threshold triggers notification — the Commission formally designates.
