---
description: "[COMMUNITY] Generate a Notifiable Data Breach (NDB) scheme response playbook under Privacy Act 1988 Part IIIC — eligible-data-breach test, 30-day OAIC notification timeline, individual notification, containment, and lessons-learned framework."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a Privacy Officer and legal counsel before adoption. NDB scheme guidance is updated by OAIC — verify against current OAIC publications before any external use.

You are an enterprise architect generating a **Notifiable Data Breach (NDB) scheme response playbook** under the Privacy Act 1988 (Cth) Part IIIC.

## User Input

```text
$ARGUMENTS
```

## Context

The Notifiable Data Breach (NDB) scheme under Privacy Act 1988 (Cth) Part IIIC requires APP entities (Australian Government agencies + private organisations subject to the Privacy Act) to notify the **OAIC and affected individuals** when an "eligible data breach" of personal information occurs and is likely to result in serious harm.

The NDB scheme has three statutory tests:

1. **Unauthorised access to / disclosure of, or loss of, personal information**
2. **Likely to result in serious harm** to one or more individuals
3. **Cannot be remediated through reasonable steps** to prevent the serious harm

The notification clock is **30 days** to OAIC + affected individuals from the time the entity has reasonable grounds to believe an eligible data breach has occurred. Privacy Act Tranche 1 reform (Dec 2024) increased OAIC enforcement powers and introduced a private right of action, materially increasing the cost of poor NDB handling.

A working NDB playbook is operational — it must be executable under time pressure, owned by a named responder, and tested.

**Authoritative anchors**:

- Privacy Act 1988 (Cth) Part IIIC — <https://www.legislation.gov.au/Details/C2024C00301>
- OAIC NDB scheme guidance — <https://www.oaic.gov.au/privacy/notifiable-data-breaches>

## Process

1. Read prerequisites:
   - The project's PIA (`ARC-{P}-AUPIA-v*`) — APP 11 cross-reference
   - The project's E8 posture (`ARC-{P}-AUE8-v*`) — security baseline
   - The project's ISM applicability (`ARC-{P}-AUISM-v*`) — Domain 2 (Cyber Security Incidents)
   - The project's RISK artefact
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ndb-playbook-template.md`
   - Then: `.arckit/templates/au-ndb-playbook-template.md`
   - Fallback: `.arckit/templates/au-ndb-playbook-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUNDB --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **Entity Profile** — APP entity status, Privacy Officer designation, accountable officer for NDB response, business hours + after-hours contact details, key incident-team roles.

   - **NDB Eligibility Test** — explicit decision tree:
     1. Has there been unauthorised access to / disclosure of, or loss of, personal information?
     2. Is serious harm likely to result?
     3. Can the entity remediate through reasonable steps to prevent the serious harm?

     If 1 + 2 = Yes and 3 = No → eligible data breach → notify within 30 days.

   - **30-Day Timeline Plan** — day-by-day milestones from Day 0 (becoming aware of suspected breach) through Day 30 (OAIC + individual notification deadline):
     - Day 0–1: Detect, contain, assess + activate playbook
     - Day 1–7: Investigate, scope, classify
     - Day 7–14: Eligibility assessment, draft notifications
     - Day 14–21: Legal review, executive sign-off, finalise notifications
     - Day 21–30: OAIC notification, individual notifications, public statement (if required)

   - **Roles & Responsibilities (RACI)** — Privacy Officer, Security Officer, CISO, Legal, Communications, accountable executive — clear responsibility matrix.

   - **Detection + Containment Procedures** — how breaches become known to the playbook owner (SIEM alerts, customer reports, vendor disclosure, insider report); immediate containment steps; evidence preservation.

   - **Assessment Procedure** — how to determine eligibility under the three statutory tests; serious-harm assessment criteria (financial loss, identity theft, emotional distress, physical safety, reputational harm); reasonable-steps mitigation to remove eligibility.

   - **OAIC Notification Form Content** — what OAIC requires per the statutory form: nature of breach, kind of information involved, recommendations for affected individuals, contact details. Template language for use in the OAIC form.

   - **Individual Notification Approach** — direct vs publication-based notification options, content requirements, channel decisions, language and accessibility considerations.

   - **Communications Plan** — internal, external, media, regulator-coordinated. Pre-written holding statements + escalation triggers.

   - **Post-Incident Review** — root cause analysis, lessons learned, control updates feeding back into AUE8 + AUISM + AUPIA artefacts.

   - **Coordination With Other Reporting Obligations** — SOCI Act 12hr / 72hr (where applicable), DISP incident reporting, sectoral reporting (APRA, AHPRA, etc.). Single incident may trigger multiple obligations on different timelines.

   - **Tabletop Exercise Plan** — annual tabletop scenario, evidence retention, lessons-learned cycle.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. Privacy Act 1988 + OAIC NDB scheme guidance MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the 30-day timeline summary).

## Important Notes

- The 30-day notification clock starts from "reasonable grounds to believe" an eligible breach has occurred — **not** from the breach itself, and **not** from confirmation. This is the most commonly misread part of the scheme. The recipe should make this distinction unambiguous.
- The "reasonable steps to remediate" test is the off-ramp from notification — if the entity can prevent serious harm through containment / mitigation actions, no notification is required. But this needs to be assessed conservatively; OAIC will second-guess hindsight optimism.
- For multi-jurisdictional incidents (e.g., breach affecting AU + NZ + EU residents), the 30-day clock is not the only timeline. EU GDPR is 72 hours; NZ Privacy Act is "as soon as practicable". The playbook should flag this for legal-counsel coordination.
- "Serious harm" is a broad threshold including financial loss, identity theft, **emotional distress** (including humiliation), and **reputational harm**. It is materially broader than "real prospect of significant harm" some practitioners assume.
- For SOCI-covered entities, the NDB 30-day clock runs in parallel with SOCI 12hr / 72hr cyber incident reporting. The playbook should explicitly coordinate both timelines so the 12hr SOCI report doesn't pre-commit positions before the NDB assessment is complete.
- Pre-written holding statements and notification templates dramatically reduce time-to-notify under pressure. Recipes producing this artefact should include template language wherever possible.
- The playbook is operational. It should be **tested** at least annually via tabletop exercise; the recipe should output an exercise scenario template as part of the deliverable.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-pia` -- NDB playbook is the operational complement to AUPIA APP 11 mitigation; APP 11 references NDB.
- `/arckit:au-disp-attestation` -- DISP attestation pack cites NDB capability evidence.
- `/arckit:risk` -- NDB-relevant risks tagged into the project risk register.
