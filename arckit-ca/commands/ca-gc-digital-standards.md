---
description: "[COMMUNITY] Generate a Government of Canada Digital Standards conformance scorecard against the 10 standards — evidence per standard, gap remediation plan, and maturity roadmap."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: service-assessment
    description: GC Digital Standards conformance feeds the broader service assessment evidence base.
  - command: roadmap
    description: Identified gaps and remediation actions become roadmap milestones.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel and the relevant departmental authority
> (ATIP coordinator, ITSEC officer, OCHRO language lead, CIO branch) before reliance. Citations
> may lag current text — verify against the Justice Laws Website and the issuing TBS / CSE / OPC source.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Government of Canada Digital Standards conformance scorecard for a federal digital service.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (if present)
   - The project's service-assessment artefact (if present)
   - Retrospective notes and accessibility audits (if present in the project folder)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-gc-digital-standards-template.md` (user override)
   - **Then**, `.arckit/templates/ca-gc-digital-standards-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-gc-digital-standards-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> DIGSTD --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header.
5. Generate the following sections (the template provides skeletons for each):
   - **The 10 GC Digital Standards** — name them explicitly so the scorecard can be read without leaving the artefact:
     1. Design with users
     2. Iterate and improve frequently
     3. Work in the open by default
     4. Use open standards and solutions
     5. Address security and privacy risks
     6. Build in accessibility from the start
     7. Empower staff to deliver better services
     8. Be good data stewards
     9. Design ethical services
     10. Collaborate widely
   - **Per-standard assessment** — for each of the 10 standards, populate one sub-table covering Evidence (cite artefacts, test reports, retrospectives, user-research outputs), Gaps, Remediation actions, Owner, Target date, and Maturity (Initial / Repeatable / Defined / Measured / Optimising).
   - **Cross-cutting themes** — accessibility (Standard 6 + WCAG 2.1 AA / 2.2 AA aligned with the *Accessible Canada Act*); open data and code (Standards 3, 4, 8); ethical AI (Standard 9 + the AIA from `ca-aia`); user research practice (Standards 1, 2). Each theme cross-references the standards it touches and surfaces a current status and required action.
   - **Maturity Roadmap** — current vs target maturity per standard, milestones, owners, and dates. Maturity must be expressed dimension-by-dimension; do not collapse to a single overall score.
   - **Open Items** — outstanding decisions, blocked remediations, and deferred standards work with owners and review dates.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The TBS *Government of Canada Digital Standards*, the *Policy on Service and Digital*, the *Directive on Service and Digital*, and the *Accessible Canada Act* MUST appear in the Document Register with their primary URLs and verification dates.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline conformance posture per standard, top three remediation actions, and any standards stuck at Initial maturity).

## Authoritative anchor

TBS *Government of Canada Digital Standards*. Primary URL: <https://www.canada.ca/en/government/system/digital-government/government-canada-digital-standards.html>. Companion guidance: TBS *Digital Operations Strategic Plan*, the *Policy on Service and Digital*, and the *Directive on Service and Digital*. The *Accessible Canada Act* and the *Accessible Canada Regulations* set the statutory floor for Standard 6.

## Important notes

- **The Digital Standards are policy, not aspiration.** They sit under the *Policy on Service and Digital* and ADMs are accountable for adherence. Non-conformance has policy consequences and is auditable through the TBS digital reporting cycle — do not treat the standards as guidance to follow when convenient.
- **Accessibility under Standard 6 is a statutory floor.** The *Accessible Canada Act* and the *Accessible Canada Regulations* set legal minima beyond the standard's design intent. WCAG 2.1 AA / 2.2 AA conformance is the operational target; statutory accessibility plans, progress reports, and feedback processes are mandatory regardless of the digital scorecard.
- **"Work in the open" is the default, not the exception.** Reasons not to publish (security, privacy, contractual constraint) must be explicit and time-boxed. Default-private working is itself a non-conformance to Standard 3 and must be remediated, not rationalised.
- **Maturity is per standard.** A service may be advanced on accessibility (Standard 6) and immature on open code (Standard 3). The scorecard MUST report dimension-by-dimension; a single overall maturity number is misleading and is not accepted by TBS reviewers.
- **Re-trigger on substantial change.** Conformance is point-in-time. Refresh the scorecard before launch, at ATO renewal, on substantive service change, and as part of the quarterly governance review cycle.
