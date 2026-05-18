---
description: "[COMMUNITY] Generate a Canada Security of Information Act handling plan — Special Operational Information (SOI) register, marking and handling matrix, transmission channels, compartments and need-to-know, destruction and sanitisation, CSIS Act §16 and §19 coordination, RCMP NSP liaison, breach response, personnel reliability prerequisites."
argument-hint: "<project ID or service name>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: ca-itsg-33
    description: SOIA handling rules sit on top of the ITSG-33 security baseline; categorisation and control profile are the prerequisite layer.
  - command: risk
    description: SOIA-specific residual risks (compartment compromise, suspected unauthorised disclosure) feed the operational risk register.
  - command: adr
    description: Compartment design, MOU choices with CSIS / RCMP, and tier-promotion thresholds warrant Architecture Decision Records.
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline.
> Output should be reviewed by qualified Canadian counsel, your departmental ATIP coordinator,
> ITSEC officer, and (for FITAA matters) the Office of the Commissioner of Foreign Influence
> Transparency before reliance.
>
> **Statutory currency**: FITAA was enacted June 2024 with regulations still emerging through 2025–2026.
> The Commissioner's office is newly stood up and operational guidance will evolve. Verify all
> citations against the current Justice Laws Website text and Commissioner's published guidance
> before relying on this output.

## User Request

```text
$ARGUMENTS
```

You are an enterprise architect generating a Canada Security of Information Act handling plan for a federal information system that processes Special Operational Information or other classified material.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ artefact (if present)
   - The project's ITSG-33 Statement of Applicability (`ARC-<id>-ITSG-*.md`) if present — its categorisation drives the handling envelope
   - The project's FITAA assessment (`ARC-<id>-FITAA-*.md`) if present — the protected investigative dataset overlaps with SOI
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/ca-soia-template.md` (user override)
   - **Then**, `.arckit/templates/ca-soia-template.md`
   - **Fallback**, `${CLAUDE_PLUGIN_ROOT}/templates/ca-soia-template.md`
3. Use `scripts/bash/generate-document-id.sh <PROJECT_ID> SOIA --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`. Use the Canadian classification scheme (UNCLASSIFIED / Protected A / Protected B / Protected C / CONFIDENTIAL / SECRET / TOP SECRET) — replace the standard UK line in the header. Note that the artefact itself will frequently warrant a SECRET or higher classification.
5. Generate the following sections (the template provides skeletons for each):
   - **SOI Inventory** — every dataset, document, or artefact that meets the *Security of Information Act* s.8 definition of *Special Operational Information*. Include intelligence reporting, source-protective material, foreign-government-shared product, methods and techniques, and identities subject to s.8. SOI is a statutory category — material qualifies by meeting the s.8 definition, and departmental designation cannot create or remove SOI status.
   - **Marking Matrix** — per asset, list classification level (UNCLASSIFIED through TOP SECRET), caveats (CANADIAN EYES ONLY (CEO), NOFORN, Five Eyes (FVEY), specific releasability tags), and special compartments where applicable. Foreign-shared product carries originator caveats — the Third-Party Rule applies and redistribution requires originator consent.
   - **Handling Rules per categorisation** — at rest (storage approval, encryption to CMVP / CSE-approved standard), in transit (transmission channels), and in use (clean-desk, screen viewing, printing, USB / removable media rules). Tier the rules per classification level.
   - **Transmission Channel Matrix** — a true matrix of allowed channels per categorisation (e.g. SECRET via XNet / IRRINET / designated dark fibre / approved courier; TOP SECRET via Mandrake / SCIF-to-SCIF / dedicated channels). Capture unencrypted-link prohibitions and any caveat-driven channel restrictions (CEO and NOFORN material is not transmissible over allied-shared infrastructure).
   - **Compartment / Need-to-Know Register** — every compartment, its owner, the access-list size, the indoctrination requirements, and the audit-log rotation cadence. Compartmentation defaults to deny — every access decision is an explicit need-to-know determination, and default-allow on a compartment is the highest-impact failure mode.
   - **Destruction and Sanitisation** — approved destruction routes (CSE / RCMP-approved shredders, degaussers, incineration), media sanitisation per CSE *ITSP.40.006 IT Media Sanitization* across the media lifecycle.
   - **CSIS Act §16 / §19 Coordination** — §16 foreign intelligence requests (received from the Minister of Foreign Affairs or the Minister of National Defence and authorised by the Federal Court); §19 disclosure framework (the purposes for which CSIS may disclose information). Identify the system's role in §16 collection, §19 disclosure receipt, or both, and the coordinating contact and artefact for each.
   - **RCMP National Security Programme Liaison** (where applicable) — INSET (Integrated National Security Enforcement Team) or SI&IS (Sensitive Investigations and Intelligence Services) interface, evidence-handling for criminal disclosure under the *Stinchcombe* and *McNeil* obligations.
   - **Breach Response** — suspected unauthorised disclosure runbook: containment within minutes (revoke access, isolate the affected system, suspend the implicated account), notification (departmental security officer → CSE incident response → CSIS / RCMP as warranted), investigation, and reporting to the Privy Council Office where Cabinet-level confidence is implicated. Breach-response timing matters more than completeness — initial containment within minutes, with forensic completeness following.
   - **Personnel Reliability** — clearance prerequisites (Reliability, Secret, Top Secret, Top Secret SCI), update cycle, briefing and debriefing protocol, and indoctrination for compartments. Clearance is per-task, not per-role.
   - **Open Items** — explicit list of statutory currency caveats: which CSIS Act amendments under Bill C-26 / Bill C-70 are still settling, which Ministerial Directives are pending, which compartment MOUs with CSIS or RCMP are still in negotiation, and a reminder that the artefact itself is likely classified and must be stored, marked, and handled accordingly.
6. Populate the External References section per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The *Security of Information Act* (R.S.C., 1985, c. O-5) and the *Canadian Security Intelligence Service Act* (R.S.C., 1985, c. C-23) MUST appear in the Document Register with their primary URLs (Justice Laws Website) and the verification date.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (one paragraph plus the headline SOI inventory count, compartment count, and any open statutory-currency or MOU items). Remind the user that the artefact may itself be classified.

## Authoritative anchor

*Security of Information Act* (R.S.C., 1985, c. O-5); *Canadian Security Intelligence Service Act* (R.S.C., 1985, c. C-23); TBS *Standard on Security Screening*; CSE ITSP-series guidance (ITSP.40.006 media sanitisation, ITSP.30.031 v3 user authentication, etc.). Authority: CSIS, CSE / Cyber Centre, RCMP, TBS. Primary URLs: <https://laws-lois.justice.gc.ca/eng/acts/O-5/> (SOIA) and <https://laws-lois.justice.gc.ca/eng/acts/C-23/> (CSIS Act).

CSIS Act amendments via Bill C-26 (cyber security) and Bill C-70 (foreign interference) are still settling — flag the consolidated Justice Laws text date in the External References section.

## Important notes

- **SOI is a statutory category** — material qualifies as Special Operational Information by meeting the *Security of Information Act* s.8 definition. Departmental designation cannot create or remove SOI status; a departmental "we treat this as SOI" label without a s.8 hook is a finding by inspection.
- **Compartmentation defaults to deny** — every access decision is an explicit need-to-know determination. Default-allow on a compartment is the highest-impact failure mode of the handling plan; review the access-list size and audit cadence with the same rigour as the marking matrix.
- **Breach response timing matters more than completeness** — initial containment must occur within minutes (revoke access, isolate the affected system, suspend the implicated account). Forensic completeness can follow; waiting for a complete picture before containment is the second-highest-impact failure mode.
- **Foreign-shared product carries originator caveats** — the Third-Party Rule applies. CANADIAN EYES ONLY, NOFORN, and FVEY-restricted material can only be redistributed with the originator's consent. The marking matrix and the transmission channel matrix must both enforce this; an unrestricted internal share of caveated foreign product is a reportable breach.
- **The artefact produced is itself often classified** — treat the SOIA handling plan as a SECRET document by default, store it in a TBS-approved system, and apply the same marking and handling rules to it as to the SOI it describes.
