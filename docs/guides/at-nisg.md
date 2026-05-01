# Austrian NIS Act (NISG) Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.at-nisg` assesses Austrian NISG obligations (BGBl. I Nr. 94/2025) — the Austrian transposition of NIS2. Covers Essential / Important entity classification, BKA (GovCERT) and BMI (SPOC) reporting, KSÖ coordination, and Austrian sectoral rules.

> **Run after** `/arckit.eu-nis2` — this command supplements the EU NIS2 baseline with Austrian transposition specifics.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Service / sector context |
| EU NIS2 assessment (`ARC-<id>-NIS2-v*.md`) | Base NIS2 compliance — required prerequisite |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Components and trust boundaries |
| Security NFRs (`ARC-<id>-NFR-SEC-v1.0.md`) | Existing security posture |

---

## Command

```bash
/arckit.at-nisg <project ID or organisation>
```

Output: `projects/<id>/ARC-<id>-ATNISG-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Entity Classification | Essential vs Important under NISG, sectoral mapping |
| Article 21 Ten Minimum Measures | Per-measure compliance posture and gaps |
| BKA / GovCERT Reporting Pathway | Incident reporting workflow, timing, content |
| BMI Single Point of Contact | Registration, contact maintenance, escalation |
| KSÖ Coordination | National cyber-coordination role and obligations |
| Austrian Sectoral Rules | Sector-specific requirements above NIS2 baseline |
| Supply-Chain Security | Vendor obligations under NISG (feeds procurement) |
| Gap Analysis | Austrian-specific gaps beyond NIS2 baseline |
| External References | NISG idF BGBl. I Nr. 94/2025 + implementing ordinances |

---

## Article 21 — The Ten Minimum Measures

| # | Measure |
|---|---------|
| 1 | Risk analysis and information system security policies |
| 2 | Incident handling |
| 3 | Business continuity / crisis management |
| 4 | Supply chain security |
| 5 | Security in network and information systems acquisition, development, maintenance |
| 6 | Policies and procedures to assess effectiveness |
| 7 | Basic cyber hygiene and training |
| 8 | Cryptography and encryption policies |
| 9 | Human resources security, access control, asset management |
| 10 | Multi-factor authentication, secured comms, secured emergency comms |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| EU baseline | NIS2 compliance | `/arckit.eu-nis2` |
| Austrian layer | NISG-specific assessment | `/arckit.at-nisg` |
| Risk | Surface gaps to risk register | `/arckit.risk` |
| Controls | Implement Article 21 measures | `/arckit.secure` |
| Procurement | Supply-chain clauses | `/arckit.at-bvergg` |

---

## Review Checklist

- EU NIS2 baseline (`ARC-<id>-NIS2-v*.md`) completed first.
- Entity classification (Essential vs Important) is explicit with sectoral basis.
- All 10 Article 21 measures assessed (no skipped rows).
- BKA / GovCERT reporting pathway has named owner and incident-class triggers.
- BMI SPOC registration status and contact maintenance documented.
- Supply-chain clauses fed to procurement (`/arckit.at-bvergg`).
- Gaps surfaced to project risk register.

---

## Key Notes

- **Recent legislation**: NISG idF BGBl. I Nr. 94/2025 is recent and evolving — items marked `[NEEDS VERIFICATION]` must be confirmed against the current text and implementing ordinances before external use.
- **Sectoral overlay**: Some sectors (energy, transport, finance, health) have additional Austrian rules above NIS2 — confirm sectoral scope.
- **Run order**: Supplements `/arckit.eu-nis2`. Do not run in isolation.
- **Community-contributed**: Output should be reviewed by qualified CISO / BMI-liaison / Rechtsabteilung before reliance.
