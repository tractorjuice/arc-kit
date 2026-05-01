---
description: '[COMMUNITY] Generate a Data Sharing Agreement under the UAE Government Services Data Sharing Policy. Captures collect-once mapping, federation/API plan, and PDPL lawful basis per share.'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a Data Sharing Agreement under the UAE Government Services Data Sharing Policy ("collect once, use securely").

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, INT, DR, DMOD, CLAS (UAE Smart Data Classification Register), and PDPL artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-data-sharing-template.md` (user override)
   - **Then**, `.arckit/templates/uae-data-sharing-template.md`
   - **Fallback**, `.arckit/templates/uae-data-sharing-template.md`
3. Use `scripts/bash/create-project.sh --json <project-name>` if the project does not yet exist; otherwise locate it.
4. Use `scripts/bash/generate-document-id.sh DSHR --filename` for the artefact filename.
5. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
6. Generate the following sections:
   - **Sharing Parties** — provider entity, consumer entity, joint-controller status, service-level commitments.
   - **Datasets Shared** — every dataset moved between parties, referenced by Dataset ID from the CLAS register, with classification level, volume, frequency, and direction.
   - **Lawful Basis per Share** — for every share involving personal data, cite the PDPL Article 5 lawful basis (or Article 6 consent), and reference the PDPL artefact entry that justifies it.
   - **Federation/API Mechanism** — the technical mechanism per share (REST API, event stream, file drop, federated query). State authentication, integrity, and rate-limiting controls.
   - **Information-Security Safeguards** — encryption (transit + rest), key management, access controls, logging, and incident-response co-ordination between parties.
   - **Data-Subject Rights Implications** — how data subject rights (access, rectification, erasure, restriction, portability, object) flow across the sharing boundary, and which party owns each obligation.
7. Populate the External References section per `.arckit/references/citation-instructions.md`. The 23 April 2026 UAE Cabinet meeting announcement (Government Services Data Sharing Policy) MUST appear in the Document Register with its primary URL and the verification date.
8. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
9. Show only a summary to the user (one paragraph plus the count of shares per direction and any unresolved lawful-basis gaps).

## Authoritative anchor

UAE Government Services Data Sharing Policy ("collect once, use securely") — Cabinet decision, 23 April 2026 (Cabinet Affairs). Primary URL: <https://mediaoffice.ae/en/news/2026/april/23-04/mohammed-bin-rashid-chairs-uae-cabinet-meeting>

## Important notes

- The "collect once, use securely" principle prohibits re-collecting data the federal entity already holds — flag any share that duplicates existing datasets across parties.
- Every share involving personal data MUST cite a PDPL lawful basis. Where `/arckit.uae-pdpl` has not yet been run, recommend it as a follow-up before sign-off.
- Sharing across parties does NOT change classification — Confidential data remains Confidential at the consumer end. Cross-reference the CLAS register for the correct level.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit-integration` -- Federation and API mechanisms feed the integration specification.
- `/arckit-uae-pdpl` -- Per-share PDPL lawful basis must be reflected in the PDPL compliance assessment.
