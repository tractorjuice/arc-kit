# EU NIS2 Directive Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-nis2` generates an NIS2 Directive (2022/2555) compliance assessment for entities in scope as essential or important operators in the EU, including French OIV/OSE obligations.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service type and sector classification |
| Risk register | Cybersecurity risks and existing controls |
| Secure by Design | Existing security measures |

---

## Command

```bash
/arckit.eu-nis2 Assess NIS2 compliance for <entity and sector>
```

Output: `projects/<id>/ARC-<id>-NIS2-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope and Classification | Essential (Annex I) vs Important (Annex II) entity |
| French OIV/OSE Status | LPM designation and ANSSI obligations |
| Governance | Management body accountability (Art. 20) |
| Risk Management | 10 minimum security measures (Art. 21) |
| Incident Reporting | 24h → 72h → 30-day timeline (Art. 23) |
| Supply Chain Security | Third-party ICT risk management |
| Vulnerability Disclosure | Coordinated disclosure policy |
| Enforcement | Supervisory authority (ANSSI for France) |
| Gap Analysis | Gaps with priority and NIS2 deadline |

---

## NIS2 Sectors (Annex I — Essential)

Energy, transport, banking, financial market infrastructure, health, drinking water, wastewater, digital infrastructure, ICT service management, public administration, space.

## NIS2 Sectors (Annex II — Important)

Postal/courier services, waste management, chemicals, food, manufacturing, digital providers (search engines, social networks, online marketplaces), research.

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Sector and entity classification | `/arckit.requirements` |
| Risk | Cybersecurity risk assessment | `/arckit.risk` |
| Assessment | NIS2 compliance assessment | `/arckit.eu-nis2` |
| French layer | ANSSI hygiene measures | `/arckit.fr-anssi`, `/arckit.fr-ebios` |

---

## Review Checklist

- Entity classification (Essential vs Important) determined with sector reference.
- French OIV/OSE designation assessed (LPM Article 22 for OIV).
- All 10 Art. 21 minimum measures assessed.
- 24h/72h/30-day incident reporting pipeline ready.
- Management body training and accountability documented.
- Supply chain ICT risk management programme in place.
- ANSSI as competent authority for France documented.

---

## Key Notes

- **France**: NIS2 transposed via LPM (Loi de Programmation Militaire). OIV obligations are stricter than NIS2 minimums.
- **CRA overlap**: For product manufacturers, the CRA incident reporting obligations overlap with NIS2 — run `/arckit.eu-cra`.
- **DORA overlap**: For financial entities, DORA replaces NIS2 for ICT risk — run `/arckit.eu-dora` instead.
