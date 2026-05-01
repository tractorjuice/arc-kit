---
description: '[COMMUNITY] Generate a UAE PDPL (Federal Decree-Law 45/2021) compliance assessment including DPIA, lawful-basis register, data-subject-rights procedure, and cross-border transfer log. Anchored on the UAE Data Office statutory framework.'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a UAE PDPL Compliance Assessment for a federal entity.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, DR, and DMOD artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-pdpl-template.md` (user override)
   - **Then**, `.arckit/templates/uae-pdpl-template.md`
   - **Fallback**, `.arckit/templates/uae-pdpl-template.md`
3. Use `scripts/bash/generate-document-id.sh PDPL --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
5. Generate the following sections:
   - **Scope** — what processing is covered, what carve-outs apply. Note free-zone regimes DIFC DPL and ADGM DPR are out of scope of the federal PDPL; healthcare data may also fall under ADHICS.
   - **Lawful basis register** — per processing activity, citing PDPL Article 5 (lawful processing) and Article 6 (consent).
   - **Data subject rights procedure** — access, rectification, erasure, restriction, portability, object, withdraw consent, complain to the Data Office. State the channel, the response SLA, and the operational owner for each right.
   - **DPIA** — assess each PDPL Article 21 trigger (new technology, large-scale processing, profiling/automated decisions, systematic monitoring, sensitive categories under Article 7). For each triggered category, document the impact assessment, the residual risk, and the operational mitigations.
   - **Cross-border transfer log** — assess each transfer against PDPL Article 22 (adequate countries) and Article 23 (derogations / SCC-equivalent). Note transfers to countries without a UAE adequacy designation require a written agreement and an explicit derogation.
   - **Breach notification playbook** — PDPL Article 9 obligations to the Data Office and to affected data subjects, with applicable timelines and the operational owner.
   - **Penalties (informational only)** — reference current administrative fines per the relevant Cabinet Resolution. This section is informational and is not used for compliance scoring.
6. Populate the External References section per `.arckit/references/citation-instructions.md`. Federal Decree-Law No. 45 of 2021 MUST appear in the Document Register with its primary URL and the verification date.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline DPIA outcome and any cross-border transfers flagged).

## Authoritative anchor

Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data. Authority: UAE Data Office. Primary URL: <https://uaelegislation.gov.ae/en/legislations/1972/download>

The PDPL Executive Regulation status MUST be flagged as "verified as of [date]" in the External References section because publication status changes — see `docs/guides/uae-overlay-maintenance.md` for the current verification date.

## Important notes

- Do NOT confuse the federal PDPL with the DIFC DPL or ADGM DPR free-zone regimes — those are separately maintained and out of scope of this command.
- Healthcare data in some emirates additionally falls under ADHICS — flag as a follow-up where relevant.
- Where the Executive Regulation is not yet in force at the verification date, treat its provisions as informational only and base the assessment on the primary Decree-Law text.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-risks` -- DPIA outputs feed the risk register's privacy and regulatory entries.
- `/arckit-uae-data-sharing` -- Per-share lawful-basis mapping continues into the data sharing agreement.
- `/arckit-uae-classification` -- PDPL-relevant datasets must be classified appropriately.
