# EU GDPR Compliance Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.eu-rgpd` generates a GDPR (Regulation EU 2016/679) compliance assessment. It is member-state-neutral and covers all EEA supervisory authorities, cross-border transfers, breach notification, and DPO obligations.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Processing activities and data flows |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Personal data categories and entities |
| DPIA (`ARC-<id>-DPIA-v1.0.md`) | High-risk processing already assessed |
| Risk register | Data breach and compliance risks |

---

## Command

```bash
/arckit.eu-rgpd Assess GDPR compliance for <project or data processing activity>
```

Output: `projects/<id>/ARC-<id>-RGPD-v1.0.md`

> **Auto-versioning**: Re-running increments the version automatically.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Processing Inventory | All processing activities, lawful basis, purpose |
| Data Subjects | Categories of data subjects and their rights |
| DPO Obligation | Whether a DPO is required and their role |
| Data Minimisation | Retention periods, minimisation measures |
| International Transfers | SCCs, BCRs, adequacy decisions |
| Breach Notification | 72-hour reporting capability |
| Data Subject Rights | SAR, erasure, portability, objection mechanisms |
| Third-Party Processors | DPA obligations, processor agreements |
| Gap Analysis | Gaps with priority and remediation plan |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Data model and requirements | `/arckit.requirements`, `/arckit.data-model` |
| Risk | DPIA for high-risk processing | `/arckit.dpia` |
| Assessment | GDPR compliance assessment | `/arckit.eu-rgpd` |
| French layer | CNIL-specific requirements | `/arckit.fr-rgpd` |

---

## Review Checklist

- Lawful basis documented for each processing activity.
- DPO obligation assessed (public authority / large-scale / special categories).
- Data subject rights mechanisms operational (SAR response ≤ 1 month).
- International transfer safeguards in place (SCCs / BCRs / adequacy).
- 72-hour breach notification capability assessed.
- Processor agreements (Article 28) in place for all processors.
- Retention periods defined and enforced.
- DPIA conducted for high-risk processing (run `/arckit.dpia` first).

---

## Key Notes

- **French layer**: Run `/arckit.fr-rgpd` for CNIL-specific obligations (health data, cookies, age 15 for minors).
- **DPIA**: For high-risk processing, a DPIA under Article 35 is mandatory — run `/arckit.dpia` before this command.
- **Scope**: This command covers EU GDPR. UK GDPR (post-Brexit) is covered by `/arckit.dpia` with UK ICO context.
