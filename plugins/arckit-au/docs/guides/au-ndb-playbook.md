# Australian Notifiable Data Breach Response Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:au-ndb-playbook` generates an operational response playbook under the OAIC Notifiable Data Breaches scheme (Privacy Act 1988 Part IIIC). It captures the assessment criteria for an eligible data breach, the two statutory clocks (a suspected breach must be assessed within 30 days; an eligible data breach must be notified as soon as practicable), the notification decision logic, the workflow for notifying affected individuals and the OAIC, and the post-incident review obligations including remediation tracking and lessons-learned capture.

The NDB playbook is operational — it is read in the middle of an incident, not at design time. It must be precise about timeframes, roles, and decision criteria. Where the playbook depends on the eligible-data-breach test, the language follows OAIC guidance verbatim.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| `/arckit:au-pia` output (`ARC-<id>-AUPIA-v1.0.md`) | Personal information inventory; eligible-data-breach criteria already drafted |
| Stakeholders (`ARC-<id>-STKE-v1.0.md`) | Accountable authority, privacy officer, security incident commander |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | Data-breach risks identified at design time |
| Runbooks (the operational readiness pack, `ARC-<id>-OPS-v*.md`) | Existing incident response procedures the NDB workflow plugs into |

---

## Command

```bash
/arckit:au-ndb-playbook <project ID or service description>
```

Output: `projects/<id>/ARC-<id>-AUNDB-v1.0.md`

---

## Playbook Structure

| Section | Contents |
|---------|----------|
| Document Control | Australian classification (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET / TOP SECRET) |
| Revision History | Version, date, author, changes, approvals |
| Executive Summary | APP entity status, NDB scheme applicability, playbook readiness, last test date, key risks |
| 1. Entity Profile | APP entity status, Privacy Officer, accountable officer for NDB response, business-hours and after-hours leads, legal counsel, communications lead, CISO, last exercise and last live incident |
| 2. NDB Eligibility Test (Decision Tree) | The three statutory tests as a decision tree, ending in notification as soon as practicable for an eligible data breach |
| 3. Assessment and Notification Timeline | Clock A: assess a suspected breach within 30 days (s 26WH). Clock B: from the point the entity believes an eligible data breach has occurred, notify the OAIC and then affected individuals as soon as practicable (ss 26WK, 26WL). Post-incident review within 90 days |
| 4. Roles & Responsibilities (RACI) | Privacy Officer, Security Officer / CISO, SOC, accountable officer, legal counsel, communications, affected business owner |
| 5. Detection + Containment Procedures | Detection sources and immediate containment, including evidence preservation |
| 6. Assessment Procedure | The three statutory tests, serious-harm criteria, and the reasonable-steps (remedial action) test |
| 7. OAIC Notification Form Content | Required statement content and sample notification text |
| 8. Individual Notification Approach | Direct or publication-based notification, channel, language and accessibility, content, cohort segmentation |
| 9. Communications Plan | Audience-by-audience channels and pre-approved holding statements |
| 10. Post-Incident Review | Root cause, control effectiveness, artefact updates, lessons learned, exercise refresh |
| 11. Coordination With Other Reporting Obligations | SOCI, DISP, sector regulator, EU GDPR and NZ Privacy Act timelines that can run alongside the NDB clocks |
| 12. Tabletop Exercise Plan | Cadence, last and next exercise, scenario theme, participants, evidence retention |
| 13. External References | ArcKit evidence integration, document register, citations, unreferenced documents, verification dates |
| Visual Evidence Decision Rule | When a companion diagram is drawn, drafted with `Pending Input` labels, or recorded as a visual evidence gap |

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

- **Conflating the 30-day clock with the notification clock** — the 30-day clock is for assessing a suspected breach (Privacy Act s 26WH). Once the entity has reasonable grounds to believe an eligible data breach has occurred, it must notify the OAIC and then affected individuals as soon as practicable (ss 26WK, 26WL). These are distinct, and a plan that notifies on Day 30 is wrong.
- **No pre-drafted notification text** — incident teams under pressure write poor notifications. Templates with placeholder fields cut time-to-notify significantly.
- **Missing the OAIC liaison path** — the playbook must name a specific individual responsible for OAIC contact, with backup. "The privacy officer" is not specific enough.

---

## Handoff

Tied tightly to `/arckit:au-pia` (PIA establishes the eligible-data-breach criteria) and the operational runbooks (`/arckit:operationalize`). Cited as evidence in `/arckit:au-disp-attestation` (DISP information protection domain) and `/arckit:au-pspf` (PSPF Governance domain, security incidents).
