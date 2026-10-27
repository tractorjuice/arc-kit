# UAE PDPL Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:uae-pdpl` generates a UAE Personal Data Protection Law compliance assessment under Federal Decree-Law No. 45 of 2021. Covers DPIA, lawful-basis register, data-subject-rights procedure, cross-border transfer log, and breach notification playbook. Anchored on the UAE Data Office statutory framework.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Processing activities and personal-data flows |
| Data requirements (`DR-*` in `ARC-<id>-REQ-v*.md`) | Personal-data categories collected |
| Data model (`ARC-<id>-DATA-v*.md`) | Personal-data entities and relationships |

---

## Command

```bash
/arckit:uae-pdpl <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-PDPL-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope | Personal-data flows, controllers, processors, data subjects; PDPL applicability against the seven Article 2(2) exclusions |
| Lawful Basis Register | Per-processing lawful basis (consent, contract, legal obligation, vital interest, public interest, legitimate interest) |
| Data Subject Rights Procedure | Access, rectification, erasure, restriction, portability, objection workflow and SLAs |
| DPIA | High-risk processing screen, risk identification, mitigations, residual risk |
| Cross-Border Transfers | Transfer log with each transfer's Article 22 or Article 23(1) ground |
| Breach Notification Playbook | Detection, triage, UAE Data Office notification timing, data-subject notification |
| Penalties | Informational summary of PDPL sanctions tier |
| External References | Decree-Law 45/2021, Executive Regulation status, Data Office guidance |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Inventory | Personal-data flows, lawful basis | `/arckit:requirements`, `/arckit:data-model` |
| Classification | Smart Data sensitivity tags | `/arckit:uae-classification` |
| PDPL | Compliance assessment + DPIA | `/arckit:uae-pdpl` |
| Sharing | Per-share lawful-basis mapping | `/arckit:uae-data-sharing` |
| Risk | Surface DPIA gaps to risk register | `/arckit:risk` |

---

## Review Checklist

- Each Article 2(2) exclusion tested; where one applies, the Scope and Executive Summary say the PDPL does not apply to that processing.
- Lawful basis recorded for every processing activity (no "TBD").
- Data subject rights workflow has named owner and SLA.
- DPIA screen completed; high-risk processing has documented mitigations.
- Each cross-border transfer logged with its Article 22 or Article 23(1) ground.
- Breach playbook names the UAE Data Office notification window.
- DPIA outputs handed off to the project risk register.
- Smart Data Classification Register reconciled against PDPL-relevant datasets.

---

## Key Notes

- **Executive Regulations**: Federal Decree-Law No. 45 of 2021 was issued on 20 September 2021, published in Official Gazette No. 712 (supplement) on 26 September 2021, and has been in force since 2 January 2022. Its Executive Regulations are a separate Cabinet instrument. The UAE Government portal's data protection page (<https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws>, updated 4 December 2025) names none, and secondary commentary disagrees on whether they have been issued. The artefact therefore records the status as checked against the UAE Legislation portal (<https://uaelegislation.gov.ae>), with the date of the check, and bases the assessment on the Decree-Law text alone when no Executive Regulations are in force.
- **Who the PDPL does not cover**: Article 2(2) excludes Government Data; governmental entities that control or process personal data; personal data held by the security and judicial authorities; a data subject's own personal processing; health data, and banking and credit data, that have their own protection legislation; and companies and establishments in free zones with their own data protection legislation, such as the DIFC (DIFC Law No. 5 of 2020) and ADGM (Data Protection Regulations 2021). A federal ministry or authority acting as controller therefore falls outside the Decree-Law, and the artefact says so rather than scoring statutory compliance. It names the regime that applies instead only from a primary source it cites. Source: UAE Legislation Platform, <https://uaelegislation.gov.ae/en/legislations/1972>.
- **Cross-border**: Article 22 allows a transfer, in cases the Data Office approves, to a destination with its own data protection legislation and an authority that enforces it, or one covered by a data protection agreement the UAE has joined. Where neither applies, Article 23(1) allows it on any one of six grounds: a contract binding the recipient to the Decree-Law's measures, the data subject's explicit consent, judicial claims, a contract in the data subject's interest, international judicial cooperation, or the public interest. Article 23(2) leaves the controls to the Executive Regulations. Where the data may be stored is a separate question, set by its classification under the National Cloud Security Policy: see `/arckit:uae-cloud-residency`.
- **Run order**: Best executed after `/arckit:uae-classification` so PDPL-relevant datasets are already tagged.
- **Community-contributed**: Output should be reviewed by qualified DPO / federal compliance counsel before reliance.
