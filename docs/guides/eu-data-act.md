# EU Data Act Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-data-act` generates an EU Data Act (Regulation EU 2023/2854) compliance assessment for connected product manufacturers, data holders, and data processing service providers (DAPS). Most obligations apply from **12 September 2025**.

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
/arckit:eu-data-act Assess Data Act compliance for <product/service and role>
```

In Claude Code the overlay installs as its own plugin, `arckit-eu`, so the command is `/arckit-eu:eu-data-act`.

Output: `projects/<id>/ARC-<id>-DATAACT-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Role and Scope | Manufacturer / Data holder / DAPS / Public sector body; GDPR intersection — both apply to personal data, and GDPR prevails in a conflict (Art. 1(5)) |
| User Data Access (Ch. II) | Pre-purchase disclosure, real-time access, third-party sharing |
| B2B Data Sharing (Ch. III) | FRAND terms, SME protection, use restrictions, trade secrets |
| Public Sector Access (Ch. V) | Emergency exceptional access conditions |
| Cloud Switching (Ch. VI) | No obstacles to switching, notice of at most two months, 30-day transitional period (up to seven months if technically unfeasible), switching charges |
| International Governmental Access (Ch. VII, Art. 32) | Safeguards against unlawful third-country governmental access to non-personal data |
| Interoperability (Ch. VIII, Arts. 33–36) | Data-space requirements, in-parallel use, interoperability standards, smart contracts |
| Trade Secret Protection (Arts. 4(6)–(9), 5(9)–(11), 8(6)) | Identifying trade secrets, confidentiality measures, withholding or refusing access, notifying the competent authority |
| Gap Analysis | Gaps with application timeline (12 Sep 2025 / 12 Sep 2026 / 12 Jan 2027) |

---

## Role Determination

| Role | Trigger | Key Chapter |
|------|---------|------------|
| Manufacturer | Makes/imports connected product | Ch. II, III |
| Data holder | Right/obligation to make data available | Ch. II, III, V |
| DAPS | IaaS/PaaS/SaaS/edge cloud provider | Ch. VI, VII, VIII (Arts. 34–35) |
| Public sector body | Emergency data access requests | Ch. V |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Product type and data flows | `/arckit:requirements`, `/arckit:data-model` |
| Risk | Data sharing and trade secret risks | `/arckit:risk` |
| Assessment | Data Act compliance assessment | `/arckit:eu-data-act` |
| GDPR layer | Personal data in shared datasets | `/arckit:eu-rgpd` |

---

## Review Checklist

- Role(s) determined (manufacturer / data holder / DAPS / public body).
- Connected product scope confirmed (IoT, industrial equipment, smart appliances).
- Personal data vs non-personal data split identified.
- User data access rights (Ch. II) assessed if manufacturer/data holder.
- B2B FRAND terms documented.
- Cloud switching obligations (Ch. VI) assessed if DAPS.
- Switching charges flagged if DAPS: reduced charges only until 12 January 2027, none from that date (Art. 29).
- Safeguards against unlawful international governmental access (Ch. VII, Art. 32) assessed if DAPS.
- GDPR intersection documented.

---

## Key Notes

- **Application dates**: 12 September 2025 for most obligations; 12 September 2026 for the Art. 3(1) design obligation on newly placed connected products (Art. 50); no switching charges from 12 January 2027 (Art. 29).
- **Data Act ≠ GDPR**: Data Act covers non-personal IoT data. GDPR still applies when personal data is in the dataset.
- **Trade secrets**: Explicitly protected — manufacturers can refuse sharing if trade secrets at risk, but must document and cannot use this as blanket refusal.
- **SecNumCloud intersection**: Chapter VII (Art. 32) safeguards against third-country governmental access reinforce DINUM cloud doctrine.
