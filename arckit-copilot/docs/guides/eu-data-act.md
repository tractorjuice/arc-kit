# EU Data Act Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-data-act` generates an EU Data Act (Regulation EU 2023/2854) compliance assessment for connected product manufacturers, data holders, and data processing service providers (DAPS). Most obligations apply from **12 September 2025**.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Product type, data sharing requirements, cloud service type |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Data types, flows, personal vs non-personal data |
| Risk register | Data sharing risks, trade secret risks |

---

## Command

```bash
/arckit.eu-data-act Assess Data Act compliance for <product/service and role>
```

Output: `projects/<id>/ARC-<id>-DATAACT-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Role and Scope | Manufacturer / Data holder / DAPS / Public sector body |
| User Data Access (Ch. II) | Pre-purchase disclosure, real-time access, third-party sharing |
| B2B Data Sharing (Ch. III) | FRAND terms, SME protection, use restrictions, trade secrets |
| Public Sector Access (Ch. V) | Emergency exceptional access conditions |
| Cloud Switching (Ch. VI) | Switching process, 180-day completion, egress charges |
| International Transfers (Art. 27) | Non-EU government access restrictions |
| GDPR Intersection | Personal data in shared datasets — both GDPR and Data Act apply |
| Gap Analysis | Gaps with application timeline (Sep 2025 / Sep 2027) |

---

## Role Determination

| Role | Trigger | Key Chapter |
|------|---------|------------|
| Manufacturer | Makes/imports connected product | Ch. II, III |
| Data holder | Right/obligation to make data available | Ch. II, III, V |
| DAPS | IaaS/PaaS/SaaS/edge cloud provider | Ch. VI |
| Public sector body | Emergency data access requests | Ch. V |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Product type and data flows | `/arckit.requirements`, `/arckit.data-model` |
| Risk | Data sharing and trade secret risks | `/arckit.risk` |
| Assessment | Data Act compliance assessment | `/arckit.eu-data-act` |
| GDPR layer | Personal data in shared datasets | `/arckit.eu-rgpd` |

---

## Review Checklist

- Role(s) determined (manufacturer / data holder / DAPS / public body).
- Connected product scope confirmed (IoT, industrial equipment, smart appliances).
- Personal data vs non-personal data split identified.
- User data access rights (Ch. II) assessed if manufacturer/data holder.
- B2B FRAND terms documented.
- Cloud switching obligations (Ch. VI) assessed if DAPS.
- Egress charge elimination by September 2027 flagged if DAPS.
- International transfer restrictions (Art. 27) assessed.
- GDPR intersection documented.

---

## Key Notes

- **Application date**: 12 September 2025 for most obligations; September 2027 for egress charge elimination.
- **Data Act ≠ GDPR**: Data Act covers non-personal IoT data. GDPR still applies when personal data is in the dataset.
- **Trade secrets**: Explicitly protected — manufacturers can refuse sharing if trade secrets at risk, but must document and cannot use this as blanket refusal.
- **SecNumCloud intersection**: Art. 27 international transfer restrictions reinforce DINUM cloud doctrine.
