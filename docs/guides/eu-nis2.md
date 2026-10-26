# EU NIS2 Directive Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-nis2` generates an NIS2 Directive (2022/2555) compliance assessment for entities in scope as essential or important operators in the EU, including French OIV/OSE obligations.

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
/arckit:eu-nis2 Assess NIS2 compliance for <entity and sector>
```

In Claude Code the overlay installs as its own plugin, `arckit-eu`, so the command is `/arckit-eu:eu-nis2`.

Output: `projects/<id>/ARC-<id>-NIS2-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope and Classification | Essential (Annex I) vs Important (Annex II) entity |
| French OIV/OSE Status | LPM designation and ANSSI obligations |
| Governance | Management body accountability (Art. 20) |
| Risk Management | 10 minimum security measures (Art. 21) |
| Incident Reporting | 24h early warning → 72h notification → final report no later than one month after the notification (Art. 23(4)) |
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
| Discovery | Sector and entity classification | `/arckit:requirements` |
| Risk | Cybersecurity risk assessment | `/arckit:risk` |
| Assessment | NIS2 compliance assessment | `/arckit:eu-nis2` |
| French layer | ANSSI hygiene measures | `/arckit:fr-anssi`, `/arckit:fr-ebios` |

---

## Review Checklist

- Entity classification (Essential vs Important) determined with sector reference.
- French OIV/OSE designation assessed (LPM Article 22 for OIV).
- All 10 Art. 21 minimum measures assessed.
- Incident reporting pipeline ready: 24-hour early warning, 72-hour notification, final report no later than one month after the notification.
- Management body training and accountability documented.
- Supply chain ICT risk management programme in place.
- ANSSI as competent authority for France documented.

---

## Key Notes

- **France**: NIS2 transposed via LPM (Loi de Programmation Militaire). OIV obligations are stricter than NIS2 minimums.
- **CRA overlap**: For product manufacturers, the CRA incident reporting obligations overlap with NIS2 — run `/arckit:eu-cra`.
- **DORA for financial entities**: DORA is a sector-specific Union legal act under NIS2 Article 4 (DORA Art. 1(2)). For the financial entities it covers, DORA's ICT risk-management, incident-reporting and supervision rules apply instead of NIS2 Articles 21 and 23 and Chapter VII (NIS2 recital 28) — run `/arckit:eu-dora` for those. NIS2 still applies to group entities or services in a NIS2 sector that DORA does not cover (Art. 4(1)), the entity can still be identified as essential or important under national law, and the DORA authority passes major-incident details to the NIS2 CSIRT, competent authority or single point of contact (DORA Art. 19(6)).
