---
description: "[COMMUNITY] Generate an NHS Digital Technology Assessment Criteria (DTAC) assessment, following the DTAC form version 2.0, for a digital health product being procured or assured by an NHS organisation."
doc-type: NHSDTAC
argument-hint: "<project ID or product, e.g. '001', 'paediatric growth tool'>"
effort: high
keep-coding-instructions: true
handoffs:
  - command: uk-nhs-dcb0129
    description: DTAC section C1 (Clinical safety) asks for the Clinical Safety Case Report and Hazard Log (C1.2.4) — run uk-nhs-dcb0129 first if SAFETY-CASE.md and HAZARD-LOG.md are not present.
  - command: dpia
    description: DTAC section C2 (Data protection) asks for the product's DPIA (C2.2.2) — run dpia first if not present.
  - command: atrs
    description: The ArcKit AI supplement (not a DTAC section) references an Algorithmic Transparency Recording Standard (ATRS) entry if the product uses AI/ML.
  - command: secure
    description: The Secure by Design assessment holds the security evidence behind DTAC section C3 (Technical security), including hosting, encryption and continuity detail the DTAC form does not ask for.
  - command: service-assessment
    description: DTAC complements but does not replace the NHS and GDS Service Standards; run service-assessment if the product is also a GDS-assessed service.
allowed-tools:
  - Read(/${CLAUDE_PLUGIN_ROOT}/**)
  - Bash(bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(bash "${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh" *)
  - Bash(${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh *)
  - Bash(node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs *)
  - Bash(node "${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs" *)
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** procurement, regulatory, or clinical advice. This command follows the DTAC form version 2.0 (NHS England, 24 February 2026; required in place of version 1.0 from 6 April 2026). Check <https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac> for a later form before submission to an NHS buyer or assurance team. DTAC outputs MUST be reviewed by the product's Clinical Safety Officer, DPO, and engineering lead before submission.

You are an enterprise architect generating an **NHS Digital Technology Assessment Criteria (DTAC)** assessment for a digital health product. DTAC is the NHS England assessment framework that care commissioners and providers use to assure digital health technology products before purchase or deployment. It covers five areas: clinical safety, data protection, technical security, interoperability, and usability and accessibility.

## User Input

```text
$ARGUMENTS
```

## Context

DTAC was introduced by NHSX and is now published by NHS England. Commissioners and providers ask manufacturers for a completed DTAC form for each product version they buy or deploy, including trials and products bought outside normal procurement. DTAC applies alongside, and does not replace, MHRA medical-device regulation (`/arckit-uk-nhs:uk-mdr-classification`), the Data Security and Protection Toolkit, the Pre-Acquisition Questionnaire for medical devices, or the NHS and GDS Service Standards (`/arckit:service-assessment`).

NHS England asks buyers to accept the standard DTAC form and not to make amended versions; additional buyer requirements should be supplemental requests that do not duplicate DTAC. The ArcKit artefact is therefore a preparation and evidence pack that maps each form question to the project's evidence. The submission is the completed NHS England form plus its supporting documents.

**Authoritative anchors**:

- NHS England DTAC guidance and form — <https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac>
- DTAC form version 2.0 (24 February 2026) — <https://digital.nhs.uk/binaries/content/assets/website-assets/services/dtac/dtac_form_2.0_february_2026.docx>
- NHS DCB0129 / DCB0160 (clinical safety; DTAC section C1) — <https://digital.nhs.uk/data-and-information/information-standards>
- UK GDPR and Data Protection Act 2018 (DTAC section C2)
- NHS Data Security and Protection Toolkit (DSPT; C2.1) — <https://www.dsptoolkit.nhs.uk/>
- Pre-Acquisition Questionnaire for medical devices (C1.1.1) — <https://www.england.nhs.uk/publication/pre-acquisition-questionnaire/>
- WCAG 2.2 AA (D1.4.1)
- ATRS for AI components (ArcKit AI supplement) — <https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub>

**DTAC form version 2.0 structure**:

| Section | Title | Assessed? | ArcKit cross-references |
|---|---|---|---|
| A | Company information (A1–A12) | Not assessed — context | Project metadata, `${user_config.organisation_name}` |
| B | Value proposition (B1–B4) | Not assessed — context | `/arckit:requirements`, `/arckit:stakeholders`, `/arckit:data-model` |
| C1 | Clinical safety (C1.1.1–C1.2.5): SaMD / AIaMD status and PAQ, DCB0129 scope, clinical risk management system, Clinical Safety Case Report and Hazard Log, CSO | Assessed — must pass | `/arckit-uk-nhs:uk-mdr-classification`, `/arckit-uk-nhs:uk-nhs-dcb0129` |
| C2 | Data protection (C2.1–C2.2.6): DSPT, ICO registration, DPIA, transparency information, terms of use, data location and transfers | Assessed — must pass | `/arckit:dpia`, `/arckit:data-model` |
| C3 | Technical security (C3.1–C3.6): Cyber Essentials, Cyber Security Charter, penetration test, Software Security Code of Practice, multi-factor authentication, logging | Assessed — must pass | `/arckit:secure`, `/arckit:hld-review`, `/arckit:dld-review` |
| C4 | Interoperability (C4.1–C4.2.6): APIs and standards, GDS Open API practice, NHS number, PDS, NHS login, DAPB3051 | Assessed — must pass | `/arckit:data-model`, `/arckit:adr` |
| D1 | Usability and accessibility (D1.1–D1.5): user journey, usability testing, Accessible Information Standard, WCAG 2.2 AA, accessibility statement, service availability | Scored, not pass/fail | `/arckit:service-assessment` |

DTAC version 2.0 has **no AI section**. AI appears only in C1.1.1 (AI as a Medical Device). ArcKit adds an optional **AI and machine learning supplement**, clearly labelled as outside DTAC, for buyers that ask for AI assurance as a supplemental request.

## Process

1. **Read prerequisites**:
   - `projects/000-global/ARC-000-PRIN-*.md`
   - `ARC-{PID}-REQ-*.md`, `ARC-{PID}-DATA-*.md`, `ARC-{PID}-STKE-*.md`
   - `ARC-{PID}-HLDR-*.md` and `ARC-{PID}-DLDR-*.md` if present
   - `ARC-{PID}-NHSMDR-*.md` if present (C1.1.1)
   - `ARC-{PID}-DPIA-*.md` if present (C2.2.2)
   - `ARC-{PID}-ATRS-*.md` if present (AI supplement)
   - `ARC-{PID}-SECD-*.md` if present (C3)
   - `clinical-safety/SAFETY.md`, `clinical-safety/SAFETY-CASE.md` and `clinical-safety/HAZARD-LOG.md` if present (C1.2)
   - `${CLAUDE_PLUGIN_ROOT}/templates/_partials/RENDERING.md`

2. **Read the template**:
   - `.arckit/templates-custom/uk-nhs-dtac-template.md` → `.arckit/templates/uk-nhs-dtac-template.md` → `${CLAUDE_PLUGIN_ROOT}/templates/uk-nhs-dtac-template.md`

3. **Resolve the project**: locate the target `projects/{NNN}-<slug>/` from the ArcKit Project Context; only if no project exists, create one with `bash ${CLAUDE_PLUGIN_ROOT}/scripts/bash/create-project.sh --json --name "<project-name>"`. `create-project.sh` is create-only — invoked with no `--name` it exits 1 without returning a path.

4. **Generate the filename** via `node ${CLAUDE_PLUGIN_ROOT}/scripts/generate-document-id.mjs <PROJECT_ID> NHSDTAC {VERSION} --filename` (this is a single-instance artefact; no `--next-num`). Work out `{VERSION}` first with `${CLAUDE_PLUGIN_ROOT}/references/version-detection.md`: a re-run writes the next version beside the earlier file, never over it.

5. **Resolve the `<!-- DOC-CONTROL-HEADER -->` marker** per `RENDERING.md`. The DTAC artefact is a conventional ArcKit `ARC-{NNN}-NHSDTAC-v{VERSION}.md` file.

6. **Answer every form question in order**, using the form's question codes. For each assessed question in C1–C4 record the response, a PASS / FAIL / PENDING / N/A status against the form's pass criterion, and the evidence. Follow the form's skip logic (for example, C1.1.2 Yes moves on to C2; C2.2 No moves on to C3; C3.2 Yes skips the rest of C3) and mark skipped questions N/A with the reason.

   - **A — Company information**: A1–A12 from project metadata. Leave contact details as `[PENDING]` rather than inventing them.

   - **B — Value proposition**: B1 intended use; B2 what the product does; B3 intended users and benefits, and how benefits were validated; B4 data flows and user journey (cross-reference DATA, DPIA, HLD).

   - **C1 — Clinical safety**:
     - C1.1.1 SaMD / AIaMD status under UK MDR 2002, from the NHSMDR artefact; a Yes requires a completed Pre-Acquisition Questionnaire
     - C1.1.2 standalone medical device; C1.2 health IT system in DCB0129 scope; C1.2.1 justification if out of scope
     - C1.2.2–C1.2.4 DCB0129 clinical risk management, the clinical risk management system, and the Clinical Safety Case Report and Hazard Log (cross-reference `clinical-safety/SAFETY-CASE.md` and `HAZARD-LOG.md`; give open-hazard count and highest open risk level; confirm the case report declares its risk-scoring scheme)
     - C1.2.5 CSO name, profession and registration (from `clinical-safety/SAFETY.md`; never invent a CSO)
     - State `[PENDING DCB0129]` clearly if the safety case files are absent
     - The deploying organisation's DCB0160 case is not a DTAC question: record its status in the template's deployer note only when the assessment is prepared by or for the deployer

   - **C2 — Data protection**:
     - C2.1 the manufacturer's own DSPT status, where it has direct or remote access to patient data or NHS systems; mark `[PENDING]` if the status is not in the project evidence
     - C2.2 whether personal data is processed; C2.2.1 ICO registration; C2.2.2 DPIA (cross-reference the DPIA artefact and check the form's twelve coverage items); C2.2.3 transparency information; C2.2.4 terms of use
     - C2.2.5 data location; C2.2.6 for data outside the UK, the countries and the safeguard relied on (adequacy, IDTA, or binding corporate rules with a transfer risk assessment), with the processor and sub-processor list

   - **C3 — Technical security**:
     - C3.1 Cyber Essentials (in date); C3.2 Cyber Security Charter for Suppliers to the NHS
     - C3.3 external penetration test within 12 months including the OWASP Top 10, with no findings scoring CVSS 7.0 or above
     - C3.4 adherence to the DSIT / NCSC Software Security Code of Practice
     - C3.5 multi-factor authentication plan; C3.5.1 MFA on supplier privileged access; C3.6 logging and reporting
     - Cross-reference `/arckit:secure` output for the evidence. Hosting, encryption, business continuity and vulnerability management are not DTAC questions: point to the Secure by Design assessment rather than adding them to the form answers

   - **C4 — Interoperability**:
     - C4.1–C4.1.3 APIs exposed, the interoperability standards used and why (FHIR UK Core, SNOMED CT, dm+d, HL7 v2 where relevant), GDS Open API best practice and open documentation
     - C4.2–C4.2.6 NHS number use, PDS integration, alternative identification approach, NHS login for patient-facing products, DAPB3051 for public health and adult social care use, and any other authentication approach

   - **D1 — Usability and accessibility** (scored, not pass/fail):
     - D1.1 user journey or instructions for use; D1.2 usability testing with intended users; D1.3 Accessible Information Standard
     - D1.4–D1.4.3 web or mobile application, WCAG 2.2 AA status or plan and timescale, accessibility statement link
     - D1.5 average service availability over the past 12 months
     - Record responses; do not give D1 a pass or fail

   - **AI and machine learning supplement (ArcKit addition, not part of DTAC)**:
     - State whether the product uses AI / ML — if no, state explicitly and skip the rest
     - Model class (rule-based, statistical, deep learning, foundation model, agentic)
     - Training-data provenance and consent basis
     - ATRS record published (cross-reference `/arckit:atrs` output)
     - Fairness assessment — protected characteristics evaluated, performance parity
     - Model drift monitoring approach
     - Human-in-the-loop / human-on-the-loop design
     - Transparency to clinicians and patients (model card, plain-English explanation)
     - Alignment with MHRA AIaMD Programme expectations

   - **Supporting documentation**: list each document the form expects, labelled by question number.

7. **Populate the External References section** per `${CLAUDE_PLUGIN_ROOT}/references/citation-instructions.md`. The DTAC form version 2.0, NHS DCB0129, UK GDPR, DSPT and WCAG 2.2 MUST appear in the Document Register; add NHS DCB0160 where the deployer note is used, the PAQ where C1.1.1 is Yes, and ATRS where the AI supplement applies.

8. **Before writing the file**, read `${CLAUDE_PLUGIN_ROOT}/references/quality-checklist.md` and verify all **Common Checks** plus the **NHSDTAC** per-type checks pass. Fix any failures before proceeding.
9. **Write the artefact via the Write tool** to `projects/{NNN}-<slug>/ARC-{NNN}-NHSDTAC-v{VERSION}.md`.

10. **Show only a summary to the user**: pass / fail / pending counts for C1–C4, the D1 responses, list of `[PENDING]` items requiring human input, recommended next commands.

## Important Notes

- **DTAC is procurement assurance, not regulation**: a passing DTAC does not constitute MHRA medical-device approval (run `/arckit-uk-nhs:uk-mdr-classification` if the product is a medical device) and does not constitute DCB0129/0160 compliance (run those commands explicitly).
- **DTAC version pinning**: this command follows the DTAC form version 2.0 (24 February 2026), which replaced version 1.0 from 6 April 2026. NHS England says it will update DTAC again as the DCB0129 and DCB0160 review and other standards work conclude. Check the NHS England page before submission; if a later form is published, the questions may have changed.
- **Use the NHS England form**: buyers are asked not to accept amended DTAC forms. Present the ArcKit artefact as the evidence pack behind the completed form, and the AI supplement as a separate supplemental document.
- **`[PENDING]` markers**: mark any answer the project evidence does not support — DSPT status, ICO registration, certificates, test reports, the CSO's details — as `[PENDING]` rather than asserting it. Use `[PENDING — organisation responsibility]` only for items the deploying organisation, not the manufacturer, must supply (for example local Caldicott Guardian sign-off or its own DCB0160 case).
- **AI supplement**: omit cleanly if the product is non-AI. Do not fabricate AI compliance content, and do not describe it as a DTAC section. If the product uses third-party AI features (e.g. embedded LLM for free-text summarisation), the supplement applies and the third-party provider's assurances should be referenced.
- **Reuse the DCB0129 outputs**: C1 is materially incomplete without a real DCB0129 case. If those files are absent at runtime, the artefact must state so explicitly rather than hand-waving compliance.
