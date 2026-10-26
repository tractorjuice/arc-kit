---
description: "[COMMUNITY] Generate a DTA Digital Service Standard compliance assessment for Australian Government digital services against all 10 criteria of the current Standard."
doc-type: AUDSS
argument-hint: "<project ID or service, e.g. '001', 'MyGov Portal Redesign'>"
effort: high
handoffs:
  - command: diagram
    description: Architecture diagrams support DSS evidence for service boundaries, channels, dependencies, security zones, and user journeys.
  - command: dfd
    description: DFDs support privacy, integration, non-digital channel, and service measurement evidence.
  - command: data-model
    description: Data model evidence supports privacy, analytics, reporting, retention, and data-quality criteria.
  - command: au-e8-posture
    description: DSS Criterion 5 (Build trust in design — implement security measures) feeds into the E8 maturity posture assessment.
  - command: au-pia
    description: DSS Criterion 7 (Do no harm — understand privacy impacts) feeds into the Privacy Impact Assessment.
  - command: servicenow
    description: ServiceNow design supports Live-phase service ownership, support, incident, change, and SLA evidence.
  - command: risk
    description: DSS gaps surface as delivery and compliance risks for the risk register.
  - command: traceability
    description: DSS criteria and remediation actions should trace to requirements, evidence, owners, and risks.
  - command: maturity-model
    description: DSS findings can seed a service capability maturity model across discovery, delivery, operations, and measurement.
  - command: graph-report
    description: Graph reporting should show AUDSS coverage alongside architecture, privacy, security, risk, and traceability artefacts.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a digital delivery lead familiar with the Digital Experience Policy before reliance. The current Digital Service Standard (10 criteria) took effect on 1 July 2024 for new and replacement services and on 1 July 2025 for existing public-facing services — verify criteria against the current published version at digital.gov.au.

You are an enterprise architect generating a **DTA Digital Service Standard compliance assessment** for an Australian Government digital service.

## User Input

```text
$ARGUMENTS
```

## Context

The Digital Transformation Agency (DTA) Digital Service Standard sets the requirements for designing and delivering Australian Government digital services. It is part of the whole-of-government Digital Experience Policy and is mandatory for informational and transactional digital services that are subject to the Investment Oversight Framework (IOF), new or replacement public-facing services, new staff-facing services, and all existing public-facing services. It came into effect on 1 July 2024 for new and replacement services (public- and staff-facing) and on 1 July 2025 for existing public-facing services.

The current Standard has **10 criteria**, and agencies must meet all of them:

1. Have a clear intent
2. Know your user
3. Leave no one behind
4. Connect services
5. Build trust in design
6. Don't reinvent the wheel
7. Do no harm
8. Innovate with purpose
9. Monitor your service
10. Keep it relevant

It replaced the earlier 13-criterion Digital Service Standard ("Understand user needs" through "Encourage everyone to use the digital service"). Do not assess against the old criteria or their numbering. Agencies report compliance to the DTA through its IOF data collection, and can seek an exemption from a criterion under the DTA's Compliance, Reporting and Exemption Guide.

**Authoritative anchor**: DTA Digital Service Standard — <https://www.digital.gov.au/policy/digital-experience/digital-service-standard>

**Key Australian Digital Service References**:

- DTA Digital Service Standard (10 criteria; in effect from 1 July 2024)
- DTA Digital Experience Policy and its Compliance, Reporting and Exemption Guide
- DTA Service Design and Delivery Process
- Data and Digital Government Strategy
- Disability Discrimination Act 1992 (Cth)
- Web Content Accessibility Guidelines (WCAG) — latest version, as Criterion 3 requires (WCAG 2.2 at the time of writing)
- Style Manual for Australian Government (style.gov.au)
- DTA Content Guide
- Whole of Government Digital and ICT Investment Oversight Framework

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract user-facing requirements, accessibility requirements, technology choices
   - The project's STKE artefact — extract user research, stakeholder engagement evidence
   - The project's DIAG artefacts (`ARC-{P}-DIAG-*`) — service context, channel, integration, and deployment views
   - The project's DFD artefacts (`ARC-{P}-DFD-*`) — user data, channel, reporting, and integration flows
   - The project's DATA artefact (`ARC-{P}-DATA-v*`) — personal data, analytics, performance, and reporting entities
   - The project's ServiceNow artefact (`ARC-{P}-SNOW-v*`) if available — service ownership, SLAs, support groups, incident and change workflows
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/au-dss-template.md` (user override)
   - **Then**, `.arckit/templates/au-dss-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/au-dss-template.md`

3. Use `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"` if the project does not yet exist; otherwise locate it.

4. Use `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> AUDSS {VERSION} --filename` for the artefact filename. Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md` before writing the artefact. `RENDERING.md` hard-routes the AU regime to `_partials/document-control-au.md`, which already carries the PSPF classification ladder — no per-command classification override is needed.

6. Generate the following sections:

   - **Service Context** — service name, owning agency/department, service type (informational / transactional; public-facing / staff-facing), whether the service is new, a replacement or existing, whether it is subject to the Investment Oversight Framework (IOF), the date the Standard applies to it (1 July 2024 for new and replacement services; 1 July 2025 for existing public-facing services), service phase (Discovery / Alpha / Beta / Live), annual transaction volume (if known).

   - **10-Criterion Assessment** — one assessment block per Digital Service Standard criterion, using the agency responsibilities DTA lists for each:
     1. **Have a clear intent** — business case for change, survey of the policy and service landscape, understanding of the service lifecycle, agile methodology adopted
     2. **Know your user** — the service's users understood, user research conducted, designs tested and validated with users
     3. **Leave no one behind** — diversity of users understood; compliance with the Disability Discrimination Act 1992, the latest version of the Web Content Accessibility Guidelines (WCAG) and the Australian Government Style Manual; a feedback mechanism
     4. **Connect services** — designed for interoperability; joined up with related services
     5. **Build trust in design** — transparent data handling, security measures implemented (cross-reference E8 and ISM), a reliable service, accountability for the service
     6. **Don't reinvent the wheel** — "build once, use many times": common platforms, patterns and standards reused; a common, seamless experience; data reused where possible
     7. **Do no harm** — users' digital rights protected, privacy impacts understood (cross-reference the PIA), the limits of data understood
     8. **Innovate with purpose** — guidance on critical and emerging technologies followed (including AI — cross-reference the AI assurance artefact where present), interoperability maintained as new technology is adopted, adoption of new technology tracked
     9. **Monitor your service** — a baseline established, the right performance indicators identified, measurement, reporting and improvement against them
     10. **Keep it relevant** — the service improved across its life, regular assessments scheduled, service upgrades communicated

     For each criterion, document:
     - Assessment status: ✅ Met / ⚠️ Partially Met / ❌ Not Met / Exemption sought
     - Evidence summary (what demonstrates compliance)
     - Gap description (what is missing)
     - Remediation actions with owner and target date

   - **Compliance Summary** — table: Criterion # | Criterion Name | Status | Gap Count; exemptions sought, with the criterion and rationale.

   - **Assessment Readiness** — identify the top 3 risks to meeting all 10 criteria and reporting compliance to the DTA (and to moving to the next Service Design and Delivery Process phase), with recommended mitigations.

   - **ArcKit Evidence Integration** — map `/arckit:diagram`, `/arckit:dfd`, `/arckit:data-model`, `/arckit:servicenow`, `/arckit:risk`, `/arckit:traceability`, `/arckit:graph-report`, and `/arckit:maturity-model` outputs to DSS criteria, evidence gaps, delivery risks, Live operations, and service maturity.

   - **Recommendations** — prioritised list of actions to improve compliance posture, grouped by criterion priority.

7. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The DTA Digital Service Standard MUST appear in the Document Register.

8. Before writing the file, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **AUDSS** per-type checks pass. Fix any failures before proceeding.
9. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

10. Show only a summary to the user (one paragraph plus the compliance summary table showing status per criterion).

## Important Notes

- The Standard is mandatory for informational and transactional services subject to the IOF, new or replacement public-facing services, new staff-facing services, and all existing public-facing services (existing public-facing services from 1 July 2025). Agencies must meet all 10 criteria or obtain an exemption under the DTA's Compliance, Reporting and Exemption Guide.
- The criteria were renumbered when the current Standard replaced the 13-criterion version. Never cite old criterion numbers or names (for example "Criterion 13 — Encourage everyone to use the digital service" no longer exists).
- Criterion 5 (Build trust in design) should cross-reference the ASD Essential Eight assessment (`/arckit:au-e8-posture`) if one exists.
- Criterion 7 (Do no harm) should cross-reference the Privacy Impact Assessment (`/arckit:au-pia`) if one exists.
- Criterion 3 (Leave no one behind) requires compliance with the latest version of WCAG (WCAG 2.2 at the time of writing). Record the WCAG version and conformance level the service achieves, and check the target level against current DTA guidance.
- The DTA also recommends considering users' non-digital experience so services stay inclusive; record it with the Criterion 3 evidence.
- Each criterion links to the most relevant phases of the DTA Service Design and Delivery Process, but applies across the whole service lifecycle. Agencies demonstrate compliance by reporting to the DTA through its IOF data collection; check the Compliance, Reporting and Exemption Guide for the current timeframes.
- This assessment is analogous to the UK GDS Service Standard assessment (`/arckit:service-assessment`) but uses Australian criteria and governance structures.
- Use embedded ArcKit artefacts as evidence: diagrams for service boundaries, DFDs for flows, data models for privacy and analytics, ServiceNow for Live operations, risk and traceability for remediation governance, graph-report for coverage, and maturity-model for uplift.
