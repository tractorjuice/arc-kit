# Austrian DSG / DSGVO Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:at-dsgvo` generates an **Austrian Data Protection Assessment** — the Austria-specific GDPR layer applied by the Datenschutzbehörde (DSB) under the Datenschutzgesetz (DSG 2018, BGBl. I Nr. 165/1999 as amended). Covers DSB enforcement patterns, image and video processing (assessed on the GDPR, with the case law on §§ 12–13 DSG), the age-14 digital consent rule, health, employee and research data, and the DSB's DPIA list (DSFA-V).

> **Run after** `/arckit:eu-rgpd` — this command supplements the EU GDPR baseline. It warns if the baseline is missing and proceeds with the data available.

---

## Inputs

| Artefact | Requirement | Purpose |
|----------|-------------|---------|
| Data model (`ARC-<id>-DATA-v*.md`) | Mandatory (warns if missing) | Personal-data categories, special categories, data subjects, flows and processors |
| EU GDPR assessment (`ARC-<id>-RGPD-v*.md`) | Mandatory (warns if missing) | Base GDPR compliance: lawful basis, DPIA screening, DPO, transfers |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Recommended | Data requirements, compliance requirements, ID Austria integration |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | Recommended | Data-subject groups (minors, patients, employees under ArbVG) |
| Secure by Design assessment, risk register | Optional | Art. 32 security measures; existing privacy risks |

---

## Command

```bash
/arckit:at-dsgvo <project ID or processing description>
```

Output: `projects/<id>/ARC-<id>-ATDSG-v1.0.md`

---

## Assessment Structure

The template has an executive summary and 18 sections. Conditional sections are kept with an "N/A" line when they do not apply.

| Section | Contents |
|---------|----------|
| 1. AT DSG Regulatory Framework | Applicable texts, DSB, remedies, age of digital consent (14, § 4 Abs. 4 DSG) |
| 2. Lawful Basis (Art. 6 / Art. 9) | Basis per processing activity, with the Austrian law cited for lit. (c) and (e) |
| 3. Consent Management | Consent quality, withdrawal, records (where consent is relied on) |
| 4. DPIA Screening | EDPB criteria plus the DSB's DSFA-V list |
| 5. Image and Video Processing | CCTV and imagery assessed on Art. 6 GDPR (see Key Notes) |
| 6. Health Data and ELGA | Art. 9 basis, ELGA-G and GTelG 2012 |
| 7. Employee Data | ArbVG § 96 Abs. 1 Z 3 / § 96a Betriebsvereinbarung |
| 8. Scientific Research | §§ 7–8 DSG, DSB Genehmigung, § 2d FOG |
| 9. Data Subject Rights | Art. 15–22 timelines and the DSB complaint pathway |
| 10. DPO Registration and ROPA | Art. 37 DPO test, DSB notification, Verarbeitungsverzeichnis |
| 11. Breach Notification to DSB | 72-hour process, individual notification, breach register |
| 12. Technical and Organisational Measures | Art. 32 GDPR |
| 13. Data Processing Agreements | Art. 28 GDPR processor register and clauses |
| 14. International Transfers | Transfer impact assessment, SCCs, EU-US Data Privacy Framework |
| 15. Cookies and Tracking | § 165 TKG 2021 consent |
| 16. DSB Enforcement Self-Assessment | Recent DSB enforcement themes |
| 17. Sanctions Exposure | Art. 83 GDPR, § 62 DSG, and the public-authority exemption (§ 30 Abs. 5 DSG) |
| 18. Gap Analysis and Action Plan | Austrian-specific gaps beyond the EU GDPR baseline |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| EU baseline | GDPR compliance | `/arckit:eu-rgpd` |
| Austrian layer | DSB-specific assessment | `/arckit:at-dsgvo` |
| High-risk | Full DPIA if the screening or the DSFA-V requires one | `/arckit:dpia` |
| Critical entity | NISG obligations where applicable | `/arckit:at-nisg` |

---

## Review Checklist

- EU GDPR baseline (`ARC-<id>-RGPD-v*.md`) completed first.
- Image / video / CCTV processing assessed on Art. 6 GDPR with a documented balancing of interests, not on § 12 DSG.
- DPIA screening result is explicit (EDPB criteria triggered, and whether the processing is on the DSFA-V list).
- DPIA escalation triggered when 2+ EDPB criteria apply or the processing is on the DSFA-V list.
- Scientific, statistical or archival processing covered under §§ 7–8 DSG if relevant.
- DSB complaint pathway documented for data subjects.
- Gap analysis lists Austrian-specific gaps (not duplicates of EU GDPR gaps).

---

## Key Notes

- **Image processing is assessed on the GDPR, not § 12 DSG**: §§ 12–13 DSG are still in force, but the Verwaltungsgerichtshof has held that where private video surveillance is assessed under Art. 6(1)(f) GDPR, § 12 Abs. 2 Z 4 in conjunction with Abs. 3 DSG must be left unapplied, because the GDPR has no opening clause for it; the surveillance is judged solely on Art. 6(1)(f), case by case ([VwGH 22.10.2025, Ra 2023/04/0075](https://www.ris.bka.gv.at/Dokument.wxe?Abfrage=Vwgh&Dokumentnummer=JWT_2023040075_20251022L00), confirming the Bundesverwaltungsgericht's 2019 decisions). The OGH applied § 12 DSG in a civil case (6 Ob 150/19f) and civil courts still cite it alongside Art. 6(1)(f). The § 13 DSG points (labelling, justifying retention beyond 72 hours) remain useful benchmarks, but neither section is the legal basis or a rule stricter than the GDPR.
- **DSB DPIA list**: the DSB's DSFA-V (BGBl. II Nr. 278/2018) is Austria's Article 35(4) list of processing that always needs a DPIA; the DSFA-AV (BGBl. II Nr. 108/2018) lists the exceptions. Both are checked alongside the EDPB screening criteria.
- **Run order**: This command supplements `/arckit:eu-rgpd`. Without the baseline it warns and assesses the Austrian layer on the data available.
- **Community-contributed**: Output should be reviewed by qualified DSB-Beauftragter / DPO / Rechtsabteilung before reliance.
