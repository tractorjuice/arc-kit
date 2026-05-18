---
description: "[COMMUNITY] Generate a DTA Digital Service Standard compliance assessment for Australian Government digital services against all 13 criteria."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by a qualified DTA assessor or digital delivery lead before reliance. The DTA Digital Service Standard was refreshed in July 2025 — verify criteria against the current published version.

You are an enterprise architect generating a **DTA Digital Service Standard compliance assessment** for an Australian Government digital service.

## User Input

```text
$ARGUMENTS
```

## Context

The Digital Transformation Agency (DTA) Digital Service Standard sets the mandatory criteria that Australian Government digital services must meet. Services subject to the Standard must demonstrate compliance at key assessment points. The Standard replaced the earlier Digital Service Standard (2016) with a refreshed version in July 2025.

**Authoritative anchor**: DTA Digital Service Standard — <https://www.dta.gov.au/help-and-advice/about-digital-service-standard>

**Key Australian Digital Service References**:

- DTA Digital Service Standard (July 2025 refresh)
- DTA Service Design and Delivery Process
- Digital Government Strategy
- Web Content Accessibility Guidelines (WCAG) 2.2 Level AA
- Style Manual for Australian Government (style.gov.au)
- DTA Content Guide
- Whole of Government Digital and ICT Investment Oversight Framework

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (architecture principles, if present)
   - The project's REQ artefact — extract user-facing requirements, accessibility requirements, technology choices
   - The project's STKE artefact — extract user research, stakeholder engagement evidence
   - `.arckit/templates/_partials/RENDERING.md`

2. Read the template:
   - **First**, check `.arckit/templates-custom/au-dss-template.md` (user override)
   - **Then**, `.arckit/templates/au-dss-template.md`
   - **Fallback**, `.arckit/templates/au-dss-template.md`

3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.

4. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> AUDSS --filename` for the artefact filename.

5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Australian classification scheme (UNOFFICIAL / OFFICIAL / OFFICIAL:Sensitive / PROTECTED / SECRET) — replace the standard UK line in the header.

6. Generate the following sections:

   - **Service Context** — service name, owning agency/department, service phase (Discovery / Alpha / Beta / Live), user base (public-facing / internal / both), annual transaction volume (if known).

   - **13-Criterion Assessment** — one assessment block per Digital Service Standard criterion:
     1. **Understand user needs** — research conducted with real users, needs documented
     2. **Have a multidisciplinary team** — team composition, capability coverage, DDaT roles
     3. **Agile and user-centred process** — delivery methodology, iteration cadence, user feedback loops
     4. **Understand tools and systems** — technology landscape mapped, legacy dependencies identified
     5. **Make it secure** — security posture, E8 alignment, threat assessment, incident response
     6. **Consistent and responsive design** — design system usage, responsive breakpoints, device testing
     7. **Protect users' privacy** — PIA completed, APP compliance, data minimisation, consent
     8. **Make source code open** — open-source strategy, code repository, licence
     9. **Make it accessible** — WCAG 2.2 AA compliance, assistive technology testing, accessibility statement
     10. **Test the service** — testing strategy (unit, integration, UAT, accessibility, performance, security)
     11. **Measure performance** — KPIs defined (completion rate, user satisfaction, cost per transaction, digital take-up)
     12. **Don't forget the non-digital experience** — assisted digital, phone, in-person channel design
     13. **Encourage everyone to use the digital service** — channel shift strategy, take-up targets

     For each criterion, document:
     - Assessment status: ✅ Met / ⚠️ Partially Met / ❌ Not Met / N/A
     - Evidence summary (what demonstrates compliance)
     - Gap description (what is missing)
     - Remediation actions with owner and target date

   - **Compliance Summary** — table: Criterion # | Criterion Name | Status | Gap Count

   - **Assessment Readiness** — for services approaching Alpha/Beta/Live assessment, identify the top 3 risks to passing and recommended mitigations.

   - **Recommendations** — prioritised list of actions to improve compliance posture, grouped by criterion priority.

7. Populate the External References section per `.arckit/references/citation-instructions.md`. The DTA Digital Service Standard MUST appear in the Document Register.

8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.

9. Show only a summary to the user (one paragraph plus the compliance summary table showing status per criterion).

## Important Notes

- The DTA Digital Service Standard applies to **all new and redesigned Australian Government digital services**. Existing services may be assessed when undergoing significant change.
- Criterion 5 (Make it secure) should cross-reference the ASD Essential Eight assessment (`/arckit:au-e8-posture`) if one exists.
- Criterion 7 (Protect users' privacy) should cross-reference the Privacy Impact Assessment (`/arckit:au-pia`) if one exists.
- Criterion 9 (Make it accessible) requires WCAG 2.2 Level AA as the minimum standard for Australian Government services.
- The Standard is assessed at Alpha, Beta, and Live phases — the depth of evidence expected increases at each gate.
- This assessment is analogous to the UK GDS Service Standard assessment (`/arckit:service-assessment`) but uses Australian criteria and governance structures.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:au-e8-posture` -- DSS Criterion 5 (Make it secure) feeds into the E8 maturity posture assessment.
- `/arckit:au-pia` -- DSS Criterion 7 (Protect users' privacy) feeds into the Privacy Impact Assessment.
- `/arckit:risk` -- DSS gaps surface as delivery and compliance risks for the risk register.
