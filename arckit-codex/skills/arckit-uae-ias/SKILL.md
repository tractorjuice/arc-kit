---
name: arckit-uae-ias
description: "[COMMUNITY] Generate a UAE IAS Statement of Applicability against the 188 controls (60 management M1–M6 + 128 technical T1–T9), priority-tiered P1–P4. Anchored on the UAE Cybersecurity Council Information Assurance Standard v2."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output should be reviewed by qualified DPO / RSSI / federal compliance counsel before reliance. Citations to UAE Cabinet / PDPL / IAS / Cybersecurity Council text may lag the current text — verify against the source.

You are an enterprise architect generating a UAE IAS Statement of Applicability for a federal entity or Critical Information Infrastructure (CII) operator.

## Process

1. Read prerequisites:
   - `projects/000-global/ARC-000-PRIN-*.md` (federal principles, if present)
   - The project's REQ, ARCH, NFR-SEC, and SECD artefacts (if present)
   - `.arckit/templates/_partials/RENDERING.md`
2. Read the template:
   - **First**, check `.arckit/templates-custom/uae-ias-template.md` (user override)
   - **Then**, `.arckit/templates/uae-ias-template.md`
   - **Fallback**, `.arckit/templates/uae-ias-template.md`
3. Use `scripts/bash/generate-document-id.sh IAS --filename` for the artefact filename.
4. Resolve the `<!-- DOC-CONTROL-HEADER -->` marker per `RENDERING.md`.
5. Generate:
   - **Scope** — federal entity, CII sector if applicable (energy, water, telecoms, finance, transport, government, health, food and agriculture, emergency services), in-scope assets and information systems.
   - **Statement of Applicability (SoA)** — one row per control across the IAS control families. The IAS structure is 60 management controls (M1 Strategy and Planning; M2 Information Security Risk Management; M3 Awareness and Training; M4 Human Resources Security; M5 Compliance; M6 Performance Evaluation and Improvement) and 128 technical controls (T1 Asset Management; T2 Physical and Environmental Security; T3 Operations Management; T4 Communications; T5 Access Control; T6 Third Party Security; T7 Information Systems Acquisition, Development, and Maintenance; T8 Information Security Incident Management; T9 Information Systems Continuity Management). Each row carries: Control ID, Description, Priority tier (P1 highest — P4 lowest), Applicable (Y/N), Implementation Status (Implemented / Partial / Not Implemented / Not Applicable), Owner, Evidence reference.
   - **Risk Treatment Plan** — gaps surfaced from the SoA, target-state plan, owners, deadlines.
   - **CII Registration** (if applicable) — registration status with the UAE Cybersecurity Council, sector designation, sector regulator interactions.
6. Populate the External References section per `.arckit/references/citation-instructions.md`. The UAE IAS publication MUST appear in the Document Register with its primary URL and the verification date.
7. Write the artefact via the Write tool to `projects/<project-id>/<filename>`.
8. Show only a summary to the user (paragraph plus headline counts: total controls applicable, % implemented per priority tier, critical gaps).

## Authoritative anchor

UAE Information Assurance Standard (IAS), published by the UAE Cybersecurity Council. Primary URL: <https://csc.gov.ae/en/w/uae-information-assurance-standard>

## Important notes

- The IAS replaces the older NESA IAS — cite the current Cybersecurity Council version, not the deprecated NESA text.
- Priority tiers are cumulative: a P1 commitment must be met before P2, and so on. Flag this for the architect when the SoA has un-implemented P1 controls.
- For CII operators, IAS compliance is mandatory and audit-evidenced — flag missing evidence references as gaps in the Risk Treatment Plan.

## Suggested Next Steps

After completing this command, consider running:

- `$arckit-risks` -- IAS gaps and risk-treatment plan feed the project risk register.
- `$arckit-uae-cloud-residency` -- IAS technical controls (T-family) constrain residency and CSP choice.
