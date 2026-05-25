---
description: "[COMMUNITY] Generate an NHS Digital Technology Assessment Criteria (DTAC v3) assessment for a digital health product being procured or assured by an NHS organisation."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** procurement, regulatory, or clinical advice. DTAC v3 is the current published version as at writing (2026-05) — verify against <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/> for any subsequent revisions before submission to an NHS buyer or assurance team. DTAC outputs MUST be reviewed by the product's Clinical Safety Officer, DPO, and engineering lead before submission.

You are an enterprise architect generating an **NHS Digital Technology Assessment Criteria (DTAC v3)** assessment for a digital health product. DTAC is the NHS England assessment used by NHS organisations to confirm new digital products meet a baseline standard for clinical safety, data protection, technical security, interoperability, and usability/accessibility before purchase or deployment.

## User Input

```text
$ARGUMENTS
```

## Context

DTAC was introduced by NHSX (now part of NHS England's Transformation Directorate) and is the de facto national NHS procurement-assurance baseline for digital products. It is consumed by NHS Trust procurement teams, ICS digital teams, NHS Supply Chain framework buyers, and is referenced by NHS England innovation pathways. DTAC overlaps but does not replace MHRA medical-device regulation (`/arckit:uk-mdr-classification`) or the GDS Service Standard (`/arckit:service-assessment`).

**Authoritative anchors**:

- NHS DTAC (NHS England Transformation Directorate) — <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/>
- NHS DCB0129 / DCB0160 (clinical safety; DTAC Section 1 references) — <https://digital.nhs.uk/data-and-information/information-standards>
- UK GDPR and Data Protection Act 2018 (DTAC Section 2 references)
- NHS Data Security and Protection Toolkit (DSPT) — <https://www.dsptoolkit.nhs.uk/>
- WCAG 2.2 AA (DTAC Section 5 accessibility baseline)
- NHS Service Standard — <https://service-manual.nhs.uk/standards-and-technology/service-standard>
- ATRS for AI components — <https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub>

**DTAC v3 structure** (5 sections + AI annex):

| Section | Title | Approximate criteria | ArcKit cross-references |
|---|---|---|---|
| 1 | Clinical Safety | DCB0129 (manufacturer) + DCB0160 (deployer) compliance | `/arckit:uk-nhs-dcb0129`, `/arckit:uk-nhs-dcb0160` |
| 2 | Data Protection | UK GDPR, DPA 2018, DSPT, DPIA | `/arckit:dpia` |
| 3 | Technical Assurance | Security, cloud, software lifecycle, business continuity | `/arckit:secure`, `/arckit:hld`, `/arckit:dld` |
| 4 | Interoperability | FHIR UK Core, SNOMED CT, NHS Number, NHS APIs (PDS, e-RS, GP Connect) | `/arckit:data-model`, `/arckit:adr` |
| 5 | Usability and Accessibility | NHS Service Standard, WCAG 2.2 AA | `/arckit:service-assessment` |
| AI annex | AI / ML components | Model governance, ATRS, training-data provenance, fairness, drift monitoring | `/arckit:atrs` |

## Process

1. **Read prerequisites**:
   - `projects/000-global/ARC-000-PRIN-*.md`
   - `ARC-{PID}-REQ-*.md`, `ARC-{PID}-DATA-*.md`, `ARC-{PID}-STKE-*.md`
   - `ARC-{PID}-HLDR-*.md` and `ARC-{PID}-DLDR-*.md` if present
   - `ARC-{PID}-DPIA-*.md` if present (Section 2)
   - `ARC-{PID}-ATRS-*.md` if present (AI annex)
   - `ARC-{PID}-SECD-*.md` if present (Section 3)
   - `clinical-safety/SAFETY-CASE.md` and `clinical-safety/HAZARD-LOG.md` if present (Section 1)
   - `.arckit/templates/_partials/RENDERING.md`

2. **Read the template**:
   - `templates-custom/uk-nhs-dtac-template.md` → `.arckit/templates/uk-nhs-dtac-template.md` → `.arckit/templates/uk-nhs-dtac-template.md`

3. **Resolve the project** via `scripts/bash/create-project.sh --json`.

4. **Generate the filename** via `scripts/bash/generate-document-id.sh <PROJECT_ID> NHSDTAC --filename` (this is a single-instance artefact; no `--next-num`).

5. **Resolve the `<!-- DOC-CONTROL-HEADER -->` marker** per `RENDERING.md`. The DTAC artefact is a conventional ArcKit `ARC-{NNN}-NHSDTAC-v1.0.md` file.

6. **Generate the five sections** (each with explicit pass / partial / fail status and evidence):

   - **Section 1 — Clinical Safety**:
     - DCB0129 manufacturer case status (cross-reference `clinical-safety/SAFETY-CASE.md`)
     - DCB0160 deployer case status (cross-reference `clinical-safety/deployment/`)
     - CSO name and registration
     - Hazard log status (open hazards count, highest open risk level)
     - State `[PENDING DCB0129/0160]` clearly if the safety case files are absent

   - **Section 2 — Data Protection**:
     - Lawful basis under UK GDPR Article 6 (and Article 9 if special-category data)
     - Personal data inventory (cross-reference DATA artefact)
     - DPIA status (cross-reference DPIA artefact)
     - DSPT submission status (state `[PENDING — organisation responsibility]` if external)
     - Sub-processor list with locations and SCCs / UK addendum
     - Data subject rights handling

   - **Section 3 — Technical Assurance**:
     - Cloud hosting (provider, UK-region status, sovereign-cloud considerations)
     - Cyber Essentials / Cyber Essentials Plus certification
     - ISO 27001 status if held
     - Software lifecycle (SDLC, code review, dependency scanning, SBOM)
     - Encryption (in transit, at rest, key management)
     - Penetration test status
     - Business continuity / disaster recovery (RTO, RPO targets)
     - Vulnerability management policy and SLA
     - Cross-reference `/arckit:secure` output

   - **Section 4 — Interoperability**:
     - Standards adopted: FHIR UK Core (version), SNOMED CT, dm+d (if prescribing), HL7 v2 (if legacy)
     - NHS Number handling (PDS lookup, demographic trace)
     - NHS APIs used: GP Connect, e-Referral Service, NHS App Connect, BARS, IM1, NHS login
     - Open standards conformance (cite the NHS Interoperability Standards Catalogue entry)
     - API documentation and OpenAPI specification availability

   - **Section 5 — Usability and Accessibility**:
     - NHS Service Standard alignment (key points)
     - WCAG 2.2 AA conformance status
     - Mobile / responsive design status
     - Screen reader, keyboard navigation, colour contrast evidence
     - Plain English / reading age compliance
     - User research evidence (cite sources)

   - **AI annex (if applicable)**:
     - State whether the product uses AI / ML — if no, state explicitly and skip the rest
     - Model class (rule-based, statistical, deep learning, foundation model, agentic)
     - Training-data provenance and consent basis
     - ATRS record published (cross-reference `/arckit:atrs` output)
     - Fairness assessment — protected characteristics evaluated, performance parity
     - Model drift monitoring approach
     - Human-in-the-loop / human-on-the-loop design
     - Transparency to clinicians and patients (model card, plain-English explanation)
     - Alignment with MHRA AIaMD Programme expectations

7. **Populate the External References section** per `.arckit/references/citation-instructions.md`. DTAC v3, NHS DCB0129, NHS DCB0160, UK GDPR, DSPT, WCAG 2.2, and ATRS (if AI) MUST appear in the Document Register.

8. **Write the artefact via the Write tool** to `projects/{NNN}-<slug>/ARC-{NNN}-NHSDTAC-v1.0.md`.

9. **Show only a summary to the user**: pass / partial / fail counts per section, list of `[PENDING]` items requiring human input, recommended next commands.

## Important Notes

- **DTAC is procurement assurance, not regulation**: a passing DTAC does not constitute MHRA medical-device approval (run `/arckit:uk-mdr-classification` if the product is a medical device) and does not constitute DCB0129/0160 compliance (run those commands explicitly).
- **DTAC version pinning**: DTAC has been revised periodically (v3 current as at 2026-05). Confirm the version against the NHS England Transformation Directorate page before submission. If a new version is published, the section structure may have changed.
- **`[PENDING]` markers**: many DTAC items depend on activities that the deploying NHS organisation must complete (DSPT submission, local Caldicott Guardian sign-off). The artefact uses `[PENDING — organisation responsibility]` clearly; do not assert these are complete from product-side evidence alone.
- **AI annex**: omit cleanly if the product is non-AI. Do not fabricate AI compliance content. If the product uses third-party AI features (e.g. embedded LLM for free-text summarisation), the annex applies and the third-party provider's assurances should be referenced.
- **Reuse the DCB0129/0160 outputs**: Section 1 is materially incomplete without a real DCB0129/0160 case. If those files are absent at runtime, the artefact must state so explicitly rather than hand-waving compliance.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-nhs-dcb0129` -- DTAC Section 1 (Clinical Safety) references SAFETY-CASE.md and HAZARD-LOG.md — run uk-nhs-dcb0129 first if not present.
- `/arckit:dpia` -- DTAC Section 2 (Data Protection) references a UK GDPR DPIA — run dpia first if not present.
- `/arckit:atrs` -- DTAC AI annex references an Algorithmic Transparency Recording Standard (ATRS) entry if the product uses AI/ML.
- `/arckit:secure` -- DTAC Section 3 (Technical Assurance) cross-references the Secure by Design assessment.
- `/arckit:service-assessment` -- DTAC overlaps the GDS Service Standard; run service-assessment if the product is also a GDS-assessed service.
