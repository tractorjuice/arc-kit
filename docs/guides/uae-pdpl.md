# UAE PDPL Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-pdpl` generates a UAE Personal Data Protection Law compliance assessment under Federal Decree-Law No. 45 of 2021. Covers DPIA, lawful-basis register, data-subject-rights procedure, cross-border transfer log, and breach notification playbook. Anchored on the UAE Data Office statutory framework.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Processing activities and personal-data flows |
| Data requirements (`ARC-<id>-DR-v1.0.md`) | Personal-data categories collected |
| Data model (`ARC-<id>-DMOD-v1.0.md`) | Personal-data entities and relationships |
| Smart Data Classification Register (`ARC-<id>-CLAS-v*.md`) | Sensitivity tags per dataset |

---

## Command

```bash
/arckit.uae-pdpl <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-PDPL-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Scope | Personal-data flows, controllers, processors, data subjects |
| Lawful Basis Register | Per-processing lawful basis (consent, contract, legal obligation, vital interest, public interest, legitimate interest) |
| Data Subject Rights Procedure | Access, rectification, erasure, restriction, portability, objection workflow and SLAs |
| DPIA | High-risk processing screen, risk identification, mitigations, residual risk |
| Cross-Border Transfers | Adequacy decisions, contractual safeguards, derogations, transfer log |
| Breach Notification Playbook | Detection, triage, UAE Data Office notification timing, data-subject notification |
| Penalties | Informational summary of PDPL sanctions tier |
| External References | Decree-Law 45/2021, Executive Regulation status, Data Office guidance |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Inventory | Personal-data flows, lawful basis | `/arckit.requirements`, `/arckit.data-model` |
| Classification | Smart Data sensitivity tags | `/arckit.uae-classification` |
| PDPL | Compliance assessment + DPIA | `/arckit.uae-pdpl` |
| Sharing | Per-share lawful-basis mapping | `/arckit.uae-data-sharing` |
| Risk | Surface DPIA gaps to risk register | `/arckit.risk` |

---

## Review Checklist

- Lawful basis recorded for every processing activity (no "TBD").
- Data subject rights workflow has named owner and SLA.
- DPIA screen completed; high-risk processing has documented mitigations.
- Cross-border transfers logged with adequacy / safeguard mechanism.
- Breach playbook names the UAE Data Office notification window.
- DPIA outputs handed off to the project risk register.
- Smart Data Classification Register reconciled against PDPL-relevant datasets.

---

## Key Notes

- **Executive Regulation**: PDPL Executive Regulation is flagged as `[NEEDS VERIFICATION]` in the overlay maintenance log — confirm current status before publication.
- **Cross-border**: Default position is sovereign UAE residency for Confidential and above; transfers require explicit derogation.
- **Run order**: Best executed after `/arckit.uae-classification` so PDPL-relevant datasets are already tagged.
- **Community-contributed**: Output should be reviewed by qualified DPO / federal compliance counsel before reliance.
