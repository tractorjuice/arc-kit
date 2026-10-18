# Austrian NIS Act (NISG) Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:at-nisg` assesses Austrian **NISG 2026** obligations (BGBl. I Nr. 94/2025) — the Austrian transposition of NIS2. The NISG 2026 is a standalone act that **replaced the NISG 2018** and has been **in force since 1 October 2026 (§51)**, with registration due within three months, by 31 December 2026 (§29 Abs. 3). The detailed risk-management requirements and significant-incident criteria sit in the **NISV 2026** (BGBl. II Nr. 290/2026). Covers Essential / Important entity classification (§24), Cybersicherheitsbehörde registration, CSIRT incident reporting via the NIS2-Meldeplattform (§34), KSÖ coordination, and Austrian sectoral rules.

> **Run after** `/arckit:eu-nis2` where you can — this command supplements the EU NIS2 baseline with Austrian transposition specifics. The baseline is recommended, not required: the command warns if it is missing and carries on. `eu-nis2` ships in the separate `arckit-eu` overlay.

---

## Inputs

| Artefact | Requirement | Purpose |
|----------|-------------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Mandatory (warns if missing) | Service / sector context, security NFRs (`NFR-SEC-*`) and existing security posture |
| EU NIS2 assessment (`ARC-<id>-NIS2-v*.md`) | Recommended (warns if missing) | Base NIS2 compliance: Annex I/II classification, Article 21 status |
| Risk register, Secure by Design assessment, architecture principles | Recommended | Existing security, supply-chain and continuity risks and controls |
| AT DSG assessment, DORA assessment | Optional | Personal-data overlap in security monitoring; financial-sector ICT resilience overlap |

---

## Command

```bash
/arckit:at-nisg <project ID or organisation>
```

Output: `projects/<id>/ARC-<id>-ATNISG-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Status and critical-gap count per pillar |
| 1. Austrian Scope and Designation | Sector classification (Anlagen 1/2), Essential vs Important (§24), previous NISG 2018 status |
| 2. Governance (§31) | Management-body approval, oversight and cyber training |
| 3. Risk Management Measures (§32) | The ten Article 21 measures, plus the NISV 2026 detailed requirements |
| 4. Incident Reporting (§34) | CSIRT reporting via the NIS2-Meldeplattform, significance criteria (§35, NISV 2026), Cybersicherheitsbehörde registration (§29) |
| 5. Supply Chain Security | Supplier inventory, contract clauses, software supply chain (feeds procurement) |
| 6. Business Continuity and Resilience | BCP, backup and restore testing, RTO / RPO |
| 7. Supervision, Inspections, and Penalties | Supervision (§38), enforcement (§39), fines (§45) or the public-administration route (§46), self-declaration and effectiveness evidence (§33) |
| 8. KSÖ and National Cyber Coordination | KSÖ, CSIRT contacts, CSS / IKDOK / OpKoord (§§12–14) |
| 8b. Austrian Additions Beyond NIS2 | NISG 2026 provisions with no direct NIS2 equivalent |
| 9. Gap Analysis and Roadmap | Maturity matrix and remediation roadmap |
| External References | NISG 2026 (BGBl. I Nr. 94/2025), NISV 2026 (BGBl. II Nr. 290/2026) and any later ordinances |

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
| EU baseline | NIS2 compliance | `/arckit:eu-nis2` |
| Austrian layer | NISG-specific assessment | `/arckit:at-nisg` |
| Risk | Surface gaps to risk register | `/arckit:risk` |
| Controls | Implement Article 21 measures | `/arckit:secure` |
| Procurement | Supply-chain clauses | `/arckit:at-bvergg` |

---

## Review Checklist

- EU NIS2 baseline (`ARC-<id>-NIS2-v*.md`) completed first, or its absence noted in the assessment.
- Entity classification (Essential vs Important) is explicit with sectoral basis.
- All 10 Article 21 measures assessed (no skipped rows).
- CSIRT reporting pathway (NIS2-Meldeplattform, §34) has named owner and incident-class triggers.
- Cybersicherheitsbehörde registration status and contact maintenance documented (§29).
- Supply-chain clauses fed to procurement (`/arckit:at-bvergg`).
- Gaps surfaced to project risk register.

---

## Key Notes

- **In force since 1 October 2026**: NISG 2026 (BGBl. I Nr. 94/2025) entered into force on 1 October 2026 (§51) and replaced the NISG 2018, which ceased to apply on the same date; Betreiber wesentlicher Dienste designations under the NISG 2018 became void (§51 Abs. 5), so former BwDs re-assess and register. The § references have been checked against the enacted text. The first implementing ordinance, the NISV 2026 (BGBl. II Nr. 290/2026), has applied since the end of 1 October 2026; further ordinances may follow, so items marked `[NEEDS VERIFICATION]` — chiefly ordinance-dependent detail and operational channel names — must be confirmed before external use.
- **Sectoral overlay**: Some sectors (energy, transport, finance, health) have additional Austrian rules above NIS2 — confirm sectoral scope.
- **Run order**: Supplements `/arckit:eu-nis2`. Run that first where the EU overlay is installed; without it the command warns and assesses the Austrian layer on its own.
- **Community-contributed**: Output should be reviewed by qualified CISO / Cybersicherheitsbehörde-liaison / Rechtsabteilung before reliance.
