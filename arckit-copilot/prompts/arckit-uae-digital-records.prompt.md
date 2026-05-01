---
description: '[COMMUNITY] Generate a Digital Records Plan under the UAE Government Services Digital Records Policy. Captures the source-of-truth register per service, retention schedule, and records-as-official-source designation.'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a Digital Records Plan under the UAE Government Services Digital Records Policy.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, DR, DMOD, ARCH, and CLAS (UAE Smart Data Classification Register) artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-digital-records-template.md` (user override)
   - **Then**, `.arckit/templates/uae-digital-records-template.md`
   - **Fallback**, `.arckit/templates/uae-digital-records-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh DREC --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Source-of-Truth Register** — for every record type the service produces or consumes, designate the authoritative system, the custodian entity, and a stable record identifier scheme.
   - **Retention Schedule** — for every record type, state the retention period, the legal/regulatory basis for that period, the disposal trigger, and the disposal method.
   - **Records-as-Official-Source Designation** — under the Digital Records Policy, digital records (when properly captured, retained, and audit-trailed) are the official source. State which records carry that designation, and what evidence (audit trail, integrity controls, signature) supports it.
   - **Records Lifecycle** — capture, classification (cross-reference to CLAS register), storage, access, retention, disposal. State where each lifecycle stage is implemented in the technology stack.
   - **Audit & Disposal procedures** — the operational procedure for periodic audit (sampling, integrity checks) and the controlled disposal procedure (approver, evidence of disposal).
7. Populate the External References section per `.arckit/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Government Services Digital Records Policy) MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the count of records under each lifecycle stage and any retention gaps).

## Authoritative anchor

UAE Government Services Digital Records Policy — Cabinet decision, 23 April 2026 (Cabinet Affairs). Primary URL: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>

## Important notes

- The Cabinet decision designates digital records as the official source — ensure this is reflected explicitly per record type, not merely as a policy aspiration.
- Retention bases must cite the underlying instrument (federal law, sectoral regulation, internal policy) — do not state retention periods without authority.
- Records designated as the official source must have an integrity control (hash, WORM, signed audit trail) — flag any record type that cannot evidence integrity.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-data-model` -- Source-of-truth designations refine entity ownership in the data model.
- `/arckit-uae-data-sharing` -- Records designated as the official source feed downstream data-sharing agreements.
