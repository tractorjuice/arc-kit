# Austrian DSG / DSGVO Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.at-dsgvo` generates an **Austrian Data Protection Assessment** — the Austria-specific GDPR layer applied by the Datenschutzbehörde (DSB) under the Datenschutzgesetz (DSG 2018, BGBl. I Nr. 165/1999 as amended). Covers DSB enforcement patterns, §§ 12–13 DSG special provisions, image processing under § 12 DSG, and Austrian DPIA blacklist criteria.

> **Run after** `/arckit.eu-rgpd` — this command supplements the EU GDPR baseline.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Processing activities and data flows |
| EU GDPR assessment (`ARC-<id>-RGPD-v*.md`) | Base GDPR compliance — required prerequisite |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Personal-data categories and entities |

---

## Command

```bash
/arckit.at-dsgvo <project ID or processing description>
```

Output: `projects/<id>/ARC-<id>-ATDSG-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Austrian Layer Scope | Processing activities subject to DSG-specific obligations beyond GDPR |
| § 12 DSG Image Processing | CCTV / image-processing rules (more restrictive than GDPR baseline) |
| §§ 12–13 DSG Special Provisions | Public-interest, scientific, statistical, archival processing |
| DSB Blacklist Screening | Austrian DPIA blacklist criteria and outcome |
| Data Subject Rights — AT Layer | DSB complaint pathway and timelines |
| DSB Enforcement Patterns | Recent DSB decisions and priority areas |
| Cross-Border Transfers — AT Specifics | National derogations and DSB notification |
| Gap Analysis | Austrian-specific gaps beyond EU GDPR baseline |
| External References | DSG 2018, DSB guidance, recent DSB decisions |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| EU baseline | GDPR compliance | `/arckit.eu-rgpd` |
| Austrian layer | DSB-specific assessment | `/arckit.at-dsgvo` |
| High-risk | Full DPIA if blacklist criteria triggered | `/arckit.dpia` |
| Critical entity | NISG obligations where applicable | `/arckit.at-nisg` |

---

## Review Checklist

- EU GDPR baseline (`ARC-<id>-RGPD-v*.md`) completed first.
- § 12 DSG checked explicitly if any image / video / CCTV processing occurs.
- DSB Blacklist screening result is explicit (triggered / not triggered + which criteria).
- DPIA escalation triggered when 2+ blacklist criteria apply or DSB Blacklist explicitly applies.
- Public-interest / scientific / statistical / archival processing covered if relevant.
- DSB complaint pathway documented for data subjects.
- Gap analysis lists Austrian-specific gaps (not duplicates of EU GDPR gaps).

---

## Key Notes

- **§ 12 DSG is stricter than GDPR**: Image processing rules in Austria are more restrictive than Article 6 GDPR — workplace and public-space CCTV needs explicit § 12 DSG analysis.
- **DSB Blacklist**: Austria has published a national DPIA blacklist on top of the GDPR Article 35(4) list — this is checked separately.
- **Run order**: This command supplements `/arckit.eu-rgpd`. Do not run in isolation.
- **Community-contributed**: Output should be reviewed by qualified DSB-Beauftragter / DPO / Rechtsabteilung before reliance.
