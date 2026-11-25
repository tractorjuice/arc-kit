# EU GDPR Compliance Assessment Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:eu-rgpd` generates a GDPR (Regulation EU 2016/679) compliance assessment. It is member-state-neutral and covers all EEA supervisory authorities, cross-border transfers, breach notification, and DPO obligations.

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
/arckit:eu-rgpd Assess GDPR compliance for <project or data processing activity>
```

In Claude Code the overlay installs as its own plugin, `arckit-eu`, so the command is `/arckit-eu:eu-rgpd`.

Output: `projects/<id>/ARC-<id>-RGPD-v1.0.md`

> **Auto-versioning**: Re-running increments the version automatically.

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| 1. Scope and Role Determination | Controller or processor role, territorial scope |
| 2. Lawful Basis Assessment | Lawful basis and purpose per processing activity |
| 3. Privacy by Design and Default (Art. 25) | Data minimisation, retention and default settings |
| 4. Data Subject Rights (Arts. 15–22) | SAR, erasure, portability, objection mechanisms |
| 5. Records of Processing Activities (Art. 30) | Processing inventory |
| 6. Data Protection Impact Assessment (Art. 35) | DPIA screening and, where required, hand-off to `/arckit:dpia` |
| 7. Data Processors and Sub-Processors (Art. 28) | DPA obligations, processor agreements |
| 8. International Transfers (Arts. 44–49) | SCCs, BCRs, adequacy decisions |
| 9. Breach Notification (Arts. 33–34) | 72-hour reporting capability |
| 10. National Supervisory Authority Context | Supervisory authority and national specifics |
| 11. Gap Analysis and Action Plan | Gaps with priority and remediation plan |
| 12. External References | Documents cited |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Data model and requirements | `/arckit:requirements`, `/arckit:data-model` |
| Assessment | GDPR compliance assessment, including DPIA screening | `/arckit:eu-rgpd` |
| Risk | DPIA where screening scores 2 or more | `/arckit:dpia` |
| French layer | CNIL-specific requirements | `/arckit:fr-rgpd` |

---

## Review Checklist

- Lawful basis documented for each processing activity.
- DPO obligation assessed (public authority / large-scale / special categories).
- Data subject rights mechanisms operational (SAR response ≤ 1 month).
- International transfer safeguards in place (SCCs / BCRs / adequacy).
- 72-hour breach notification capability assessed.
- Processor agreements (Article 28) in place for all processors.
- Retention periods defined and enforced.
- DPIA screening completed; where the score is 2 or more, a DPIA conducted with `/arckit:dpia`.

---

## Key Notes

- **French layer**: Run `/arckit:fr-rgpd` for CNIL-specific obligations (health data, cookies, age 15 for minors).
- **DPIA**: The command screens for a DPIA itself (EDPB nine criteria). Where the screening score is 2 or more, a DPIA under Article 35 is mandatory, and the command hands off to `/arckit:dpia`.
- **Scope**: This command covers EU GDPR. UK GDPR (post-Brexit) is covered by `/arckit:dpia` with UK ICO context.
