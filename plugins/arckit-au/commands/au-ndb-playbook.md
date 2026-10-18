---
description: "[COMMUNITY] Generate a Notifiable Data Breach (NDB) scheme response playbook under Privacy Act 1988 Part IIIC — eligible-data-breach test, 30-day assessment limit, OAIC and individual notification as soon as practicable, containment, and lessons-learned framework."
doc-type: AUNDB
argument-hint: "<project ID or system, e.g. '001'>"
effort: medium
handoffs:
  - command: dfd
    description: DFDs identify personal-information flows, breach blast radius, notification channels, and third-party disclosure paths.
  - command: data-model
    description: Data model evidence identifies personal-information entities, sensitive attributes, retention, and affected data subjects.
  - command: au-pia
    description: NDB playbook is the operational complement to AUPIA APP 11 mitigation; APP 11 references NDB.
  - command: au-disp-attestation
    description: DISP attestation pack cites NDB capability evidence.
  - command: servicenow
    description: ServiceNow incident, problem, change, and knowledge workflows operationalise NDB response ownership and evidence capture.
  - command: risk
    description: NDB-relevant risks tagged into the project risk register.
  - command: traceability
    description: NDB triggers, roles, decisions, notifications, and lessons learned should trace to evidence and controls.
  - command: graph-report
    description: Graph reporting should show AUNDB coverage alongside privacy, security, risk, and traceability artefacts.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
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

The scheme runs two separate clocks, and they must not be merged:

- **Assessment — 30 days at most (s 26WH).** When the entity is aware of reasonable grounds to *suspect* an eligible data breach, it must carry out a reasonable and expeditious assessment and take all reasonable steps to complete it within 30 days of becoming aware of those grounds. The 30 days is a ceiling for the assessment, not a notification deadline; the OAIC expects entities to treat it as a maximum.
- **Notification — as soon as practicable (ss 26WK, 26WL).** As soon as the entity is aware of reasonable grounds to *believe* an eligible data breach has occurred — whether on Day 0 or at the end of the assessment — it must prepare a statement and give it to the OAIC as soon as practicable, then notify affected individuals as soon as practicable after the statement is prepared. There is no fixed day count, and no 30-day allowance.

Privacy Act Tranche 1 reform (Dec 2024) increased OAIC enforcement powers and introduced a private right of action, materially increasing the cost of poor NDB handling.

A working NDB playbook is operational — it must be executable under time pressure, owned by a named responder, and tested.

**Authoritative anchors**:

- Privacy Act 1988 (Cth) Part IIIC — <https://www.legislation.gov.au/Details/C2024C00301>
- OAIC NDB scheme guidance — <https://www.oaic.gov.au/privacy/notifiable-data-breaches>
- OAIC Data breach preparation and response, Part 4 (assessment within 30 days; notification as soon as practicable) — <https://www.oaic.gov.au/privacy/privacy-guidance-for-organisations-and-government-agencies/preventing-preparing-for-and-responding-to-data-breaches/data-breach-preparation-and-response/part-4-notifiable-data-breach-ndb-scheme>

## Process

1. Read prerequisites:
   - The project's PIA (`ARC-{P}-AUPIA-v*`) — APP 11 cross-reference
   - The project's E8 posture (`ARC-{P}-AUE8-v*`) — security baseline
   - The project's ISM applicability (`ARC-{P}-AUISM-v*`) — Domain 2 (Cyber Security Incidents)
   - The project's RISK artefact
   - The project's DFD artefacts (`ARC-{P}-DFD-*`) — personal-information flows, disclosure paths, external entities, stores
   - The project's DATA artefact (`ARC-{P}-DATA-v*`) — affected personal-information entities, sensitivity, retention, data owners
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available — incident queues, escalation groups, change/problem workflows, knowledge articles
   - The project's TRAC artefact if available — notification decision and evidence mappings
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - First: `.arckit/templates-custom/au-ndb-playbook-template.md`
   - Then: `.arckit/templates/au-ndb-playbook-template.md`
   - Fallback: `${CLAUDE_PLUGIN_ROOT}/templates/au-ndb-playbook-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AUNDB {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the AU regime to `_partials/document-control-au.md`, which already carries the PSPF classification ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **Entity Profile** — APP entity status, Privacy Officer designation, accountable officer for NDB response, business hours + after-hours contact details, key incident-team roles.

   - **NDB Eligibility Test** — explicit decision tree:
     1. Has there been unauthorised access to / disclosure of, or loss of, personal information?
     2. Is serious harm likely to result?
     3. Can the entity remediate through reasonable steps to prevent the serious harm?

     If 1 + 2 = Yes and 3 = No → eligible data breach → prepare the statement and notify the OAIC as soon as practicable, then notify affected individuals as soon as practicable (ss 26WK, 26WL). Do not hold notification back to the end of the 30-day assessment period.

   - **Assessment and Notification Timeline** — milestones on two clocks, never one:
     - Day 0: entity becomes aware of reasonable grounds to suspect an eligible data breach → contain, activate the playbook, start the s 26WH assessment
     - Assessment window (target well under 30 days; 30 days is the ceiling): investigate, scope affected individuals and information, assess serious harm, take remedial action
     - Belief point (the moment the entity has reasonable grounds to believe there is an eligible data breach — can be Day 0 if the breach is plain): stop assessing and start notifying
     - Belief point onward, as soon as practicable: prepare the statement, legal review and sign-off at the pace the incident allows, give the statement to the OAIC, then notify affected individuals (direct, or by publication where direct notification is not practicable)
     - Assessment ends without belief: record the decision and reasons; no notification
     - Pre-approved statement templates and sign-off delegations exist so that "as soon as practicable" is measured in days, not weeks

   - **Roles & Responsibilities (RACI)** — Privacy Officer, Security Officer, CISO, Legal, Communications, accountable executive — clear responsibility matrix.

   - **Detection + Containment Procedures** — how breaches become known to the playbook owner (SIEM alerts, customer reports, vendor disclosure, insider report); immediate containment steps; evidence preservation.

   - **Assessment Procedure** — how to determine eligibility under the three statutory tests; serious-harm assessment criteria (financial loss, identity theft, emotional distress, physical safety, reputational harm); reasonable-steps mitigation to remove eligibility.

   - **OAIC Notification Form Content** — what OAIC requires per the statutory form: nature of breach, kind of information involved, recommendations for affected individuals, contact details. Template language for use in the OAIC form.

   - **Individual Notification Approach** — direct vs publication-based notification options, content requirements, channel decisions, language and accessibility considerations.

   - **Communications Plan** — internal, external, media, regulator-coordinated. Pre-written holding statements + escalation triggers.

   - **Post-Incident Review** — root cause analysis, lessons learned, control updates feeding back into AUE8 + AUISM + AUPIA artefacts.

   - **Coordination With Other Reporting Obligations** — SOCI Act 12hr / 72hr (where applicable), DISP incident reporting, sectoral reporting (APRA, AHPRA, etc.). Single incident may trigger multiple obligations on different timelines.

   - **Tabletop Exercise Plan** — annual tabletop scenario, evidence retention, lessons-learned cycle.

   - **ArcKit Evidence Integration** — map `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, and `/arckit:graph-report` outputs to breach scope, incident workflow, decision evidence, risk treatment, and coverage gaps.

7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. Privacy Act 1988 + OAIC NDB scheme guidance MUST appear in the Document Register.

8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AUNDB** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

10. Show only a summary to the user (one paragraph plus the assessment and notification timeline summary).

## Important Notes

- **30 days is the assessment limit, not the notification deadline.** The s 26WH assessment clock starts when the entity becomes aware of reasonable grounds to *suspect* an eligible data breach, and the assessment must be completed within 30 days. Notification to the OAIC (s 26WK) and to individuals (s 26WL) is due as soon as practicable once the entity has reasonable grounds to *believe* an eligible data breach has occurred, and an entity that reaches that belief early must notify early. Conflating the two clocks is the most commonly misread part of the scheme; the playbook must never schedule notification for Day 30.
- The "reasonable steps to remediate" test is the off-ramp from notification — if the entity can prevent serious harm through containment / mitigation actions, no notification is required. But this needs to be assessed conservatively; OAIC will second-guess hindsight optimism.
- For multi-jurisdictional incidents (e.g., breach affecting AU + NZ + EU residents), the NDB assessment and notification clocks are not the only timelines. EU GDPR is 72 hours; NZ Privacy Act is "as soon as practicable". The playbook should flag this for legal-counsel coordination.
- "Serious harm" is a broad threshold including financial loss, identity theft, **emotional distress** (including humiliation), and **reputational harm**. It is materially broader than "real prospect of significant harm" some practitioners assume.
- For SOCI-covered entities, the NDB assessment and notification clocks run in parallel with SOCI 12hr / 72hr cyber incident reporting. The playbook should explicitly coordinate both timelines so the 12hr SOCI report doesn't pre-commit positions before the NDB assessment is complete.
- Pre-written holding statements and notification templates dramatically reduce time-to-notify under pressure. Recipes producing this artefact should include template language wherever possible.
- The playbook is operational. It should be **tested** at least annually via tabletop exercise; the recipe should output an exercise scenario template as part of the deliverable.
- Use embedded ArcKit artefacts as evidence: DFDs and data models for breach scope, ServiceNow for incident workflow and evidence capture, risk for remediation, traceability for notification decisions, and graph-report for coverage.
