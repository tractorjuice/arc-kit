# Australian Notifiable Data Breach Response Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.au-ndb-playbook` generates an operational response playbook under the OAIC Notifiable Data Breaches scheme (Privacy Act 1988 Part IIIC). It captures the assessment criteria for an eligible data breach, the 30-day investigation clock, the notification decision logic, the workflow for notifying affected individuals and the OAIC, and the post-incident review obligations including remediation tracking and lessons-learned capture.

The NDB playbook is operational — it is read in the middle of an incident, not at design time. It must be precise about timeframes, roles, and decision criteria. Where the playbook depends on the eligible-data-breach test, the language follows OAIC guidance verbatim.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| `/arckit.au-pia` output (`ARC-<id>-AUPIA-v1.0.md`) | Personal information inventory; eligible-data-breach criteria already drafted |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, privacy officer, security incident commander |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | Data-breach risks identified at design time |
| Runbooks (`ARC-<id>-RBK-v1.0.md`) | Existing incident response procedures the NDB workflow plugs into |

---

## Command

```bash
/arckit.au-ndb-playbook <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUNDB-v1.0.md`

---

## Playbook Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Activation Criteria | When to enter the NDB workflow vs treat as general incident |
| Roles & Responsibilities | Accountable authority, privacy officer, incident commander, comms lead, OAIC liaison |
| Phase 1 — Containment & Initial Triage | First 24 hours: contain, preserve evidence, initial scoping |
| Phase 2 — Eligible-Data-Breach Assessment | 30-day clock; serious-harm test against OAIC guidance |
| Phase 3 — Notification Decisions | Trigger criteria, escalation matrix, individuals vs OAIC vs both |
| Phase 4 — Notification Execution | Templates, channels, timing, language requirements |
| Phase 5 — Post-Incident Review | Lessons learned, remediation, public-register updates |
| Decision Tree | Visual flow from detection through notification or no-notification |
| Templates | Standard wording for individual notifications, OAIC report, board briefing |
| External Dependencies | OAIC contact protocol, legal counsel, forensics partner |
| Quarterly Review | Refresh cadence, regulatory-update tracking |

---

## Regulatory Anchors

- **Privacy Act 1988 (Cth) Part IIIC** — Notifiable Data Breaches scheme (statutory basis)
- **OAIC Notifiable Data Breach guidance** — authoritative interpretation of "eligible data breach" and "serious harm"
- **Privacy and Other Legislation Amendment Act 2024** (Tranche 1) — enhanced statutory tort and class-action exposure
- **Cyber Security Act 2024 (Cth)** — adjacent incident-reporting obligations that may run in parallel to NDB

---

## When to Run

- Author this at service design, not in the middle of an incident
- Refresh after every actual NDB event (lessons-learned)
- Refresh on material OAIC guidance change or Privacy Act amendment
- Refresh on accountable-authority or privacy-officer change

---

## Common Pitfalls

- **Conflating the 30-day clock with the notification clock** — the 30-day clock is for the eligible-data-breach assessment. Once eligibility is confirmed, notification must be as soon as practicable. These are distinct.
- **No pre-drafted notification text** — incident teams under pressure write poor notifications. Templates with placeholder fields cut time-to-notify significantly.
- **Missing the OAIC liaison path** — the playbook must name a specific individual responsible for OAIC contact, with backup. "The privacy officer" is not specific enough.

---

## Handoff

Tied tightly to `/arckit.au-pia` (PIA establishes the eligible-data-breach criteria) and the operational runbooks (`/arckit.operationalize`). Cited as evidence in `/arckit.au-disp-attestation` (DISP information protection domain) and `/arckit.au-pspf` (PSPF Outcome 4 incident management).
