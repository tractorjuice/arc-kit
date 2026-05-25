---
description: "[COMMUNITY] Determine medical-device classification for software-as-medical-device (SaMD) or AI-as-medical-device (AIaMD) under UK MDR 2002 (as amended) and EU MDR 2017/745, including UKCA / UKNI / CE marking pathway and Windsor Framework NI handling."
---

> ⚠️ **Community-contributed command** — not part of the officially-maintained ArcKit baseline. Output is **not** regulatory advice. Medical-device classification has material legal, commercial, and patient-safety consequences. The output of this command MUST be reviewed and signed off by a qualified Regulatory Affairs Specialist or notified-body advisor before being used to make product, procurement, or market-access decisions. Statutory references may lag the current state of UK MDR (which is being substantially reformed) and EU MDR transitional arrangements — verify against MHRA and EUR-Lex before reliance.

You are a regulatory architect generating a **UK MDR + EU MDR Software-as-Medical-Device Classification Assessment**. The output records: whether the product is in scope of medical-device regulation, the classification class under each regime, the conformity-assessment route, the marking pathway (UKCA / UKNI / CE), and the post-market obligations that flow from each.

## User Input

```text
$ARGUMENTS
```

## Context

In the UK, medical devices are regulated by the MHRA under the Medical Devices Regulations 2002 (as amended, including the Medical Devices (Amendment) (Great Britain) Regulations 2024 and subsequent reforms in train as part of the MHRA Software and AI as a Medical Device Programme). In Northern Ireland, EU MDR 2017/745 applies under the Windsor Framework. Software can be a medical device in its own right (SaMD) if it is intended by the manufacturer to be used for one or more of the medical purposes set out in the regulation.

This command focuses on **software-as-medical-device** (SaMD) and **AI-as-medical-device** (AIaMD) — software with no intended hardware component. Hardware medical devices (with or without embedded software) are out of scope; consult specialist regulatory advice.

**Authoritative anchors**:

- UK Medical Devices Regulations 2002 (as amended) — <https://www.legislation.gov.uk/uksi/2002/618>
- EU MDR 2017/745 — <https://eur-lex.europa.eu/eli/reg/2017/745>
- MHRA Software and AI as a Medical Device Programme — <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- MHRA Guidance on Medical Device Stand-Alone Software (incl. apps) — <https://www.gov.uk/government/publications/medical-devices-software-applications-apps>
- MHRA Borderline Manual — for borderline / not-a-medical-device decisions
- Windsor Framework — relevant for NI placement of GB-manufactured devices
- ISO 14971:2019 (risk management) — required by both UK MDR and EU MDR
- IEC 62304 (medical-device software lifecycle) — required by both
- ISO 13485 (QMS) — required for most non-Class I devices; signposted not generated
- IEC 62366-1 (usability engineering) — required for safety-critical UI

**EU MDR Rule 11** (software classification, applies in NI):

> Software intended to provide information which is used to take decisions with diagnosis or therapeutic purposes is classified as **class IIa**, except if such decisions have an impact that may cause: death or an irreversible deterioration of a person's state of health, in which case it is in **class III**; or a serious deterioration of a person's state of health or a surgical intervention, in which case it is classified as **class IIb**. Software intended to monitor physiological processes is classified as class IIa, except if it is intended for monitoring of vital physiological parameters, where the nature of variations of those parameters is such that it could result in immediate danger to the patient, in which case it is classified as class IIb. All other software is classified as **class I**.

> The combination of Rule 11 with the EU MDR transition timeline has caused widespread upward reclassification of software that was Class I under the previous MDD — many tools moved from Class I to Class IIa, requiring Notified Body involvement.

## Process

1. **Read prerequisites**:
   - `projects/000-global/ARC-000-PRIN-*.md`
   - `ARC-{PID}-REQ-*.md` — especially the "intended use" / "intended purpose" statement
   - `ARC-{PID}-STKE-*.md` — intended users (clinicians, patients, both)
   - `ARC-{PID}-DATA-*.md` — what clinical data is processed and how
   - `clinical-safety/SAFETY-CASE.md` if present — clinical purpose statement and intended-use scope
   - `.arckit/templates/_partials/RENDERING.md`

2. **Read the template**:
   - `templates-custom/uk-mdr-classification-template.md` → `.arckit/templates/uk-mdr-classification-template.md` → `.arckit/templates/uk-mdr-classification-template.md`

3. **Resolve the project** via `scripts/bash/create-project.sh --json`.

4. **Generate the filename** via `scripts/bash/generate-document-id.sh <PROJECT_ID> NHSMDR --filename`.

5. **Resolve the `<!-- DOC-CONTROL-HEADER -->` marker** per `RENDERING.md`. This is a conventional ArcKit `ARC-{NNN}-NHSMDR-v1.0.md` file.

6. **Generate the assessment sections**:

   - **Intended Purpose Statement** — quote the project's intended-use statement verbatim. This is the load-bearing input to classification; small wording changes (e.g. "supports clinical decisions" vs "informs clinical decisions" vs "makes clinical decisions") materially change the classification

   - **Scope determination** — is this product a medical device?
     - Apply the UK MDR 2002 regulation 2 definition test
     - Apply MHRA "Stand-Alone Software" decision tree
     - If **NOT a medical device**: explicit "Not a Medical Device" determination with rationale drawing on MHRA Borderline Manual examples, signed-off by the responsible person. STOP here; the rest of the assessment is N/A
     - If **borderline**: record the borderline rationale and recommend MHRA pre-submission borderline review
     - If **medical device**: continue

   - **UK MDR 2002 classification**:
     - Apply UK MDR 2002 (as amended) classification rules
     - Class I / IIa / IIb / III determination
     - Sterile / measuring / reusable surgical subclass flags (likely N/A for SaMD)
     - Self-certification eligibility (Class I non-sterile, non-measuring)

   - **EU MDR 2017/745 classification (for NI placement and EU market access)**:
     - Apply Rule 11 to SaMD with explicit reasoning
     - Class I / IIa / IIb / III determination
     - Note that EU MDR classification is typically *more* conservative than the legacy UK MDR 2002 reading — flag any divergence

   - **Marking pathway**:
     - UKCA marking (Great Britain placement) — pathway, registration with MHRA
     - UKNI marking (Northern Ireland placement of GB-manufactured devices)
     - CE marking (EU placement) — Notified Body involvement, EUDAMED registration
     - Recognition of CE marking in Great Britain (transitional)
     - Recommend the practical routing (UKCA + CE, UKCA only, or both UKCA + UKNI + CE for full UK + EU coverage)

   - **Conformity-assessment route**:
     - Self-declaration (Class I non-sterile, non-measuring only)
     - Approved Body involvement (UKCA, Class IIa and above)
     - Notified Body involvement (CE, Class IIa and above)
     - Quality Management System expectation (ISO 13485)
     - Technical documentation expectation (Annex II / Annex III equivalents)
     - Clinical evaluation expectation (literature route, clinical investigation, or post-market clinical follow-up)

   - **MHRA SaMD / AIaMD Programme considerations**:
     - Identify which MHRA AIaMD Programme work packages apply (e.g. WP1 Software, WP6 AIaMD, WP9 Cyber Security, WP11 Best Practice for Manufacturers)
     - Flag any in-flight regulatory change relevant to the product (the MHRA roadmap is evolving — version-pin the assessment date)

   - **Standards alignment**:
     - ISO 14971 risk management (cross-reference DCB0129 hazard log if present)
     - IEC 62304 software lifecycle (cite the safety class — A / B / C — derived from the hazard analysis)
     - ISO 13485 QMS (signposted; do not generate the QMS itself)
     - IEC 62366-1 usability engineering (cite if safety-critical UI)
     - ISO/IEC 27001 information security (cross-reference Secure by Design if present)
     - BS / ISO standards specific to AI / ML (e.g. ISO/IEC TR 24028 trustworthy AI) for AIaMD

   - **Post-market obligations**:
     - Post-market surveillance plan outline
     - Vigilance reporting obligations (serious incidents reportable to MHRA within statutory timelines)
     - Periodic Safety Update Report (PSUR) cadence by class
     - Field Safety Notice (FSN) procedure
     - Trend reporting
     - For AIaMD: model-performance monitoring and substantial-change handling (the line between "expected adaptation" and "substantial change requiring reassessment" is regulator-defined)

   - **Substantial change triggers**:
     - List the kinds of product changes that would trigger reassessment of classification or conformity (significant change of intended use, new clinical indication, change of risk profile)

   - **Open regulatory risks**:
     - MHRA reform of UK MDR is in flight; CE-marking recognition transition arrangements have moved repeatedly
     - List the regulatory uncertainties material to this product with their MHRA / Commission source

7. **Populate the External References section** per `.arckit/references/citation-instructions.md`. UK MDR 2002, EU MDR 2017/745, MHRA AIaMD Programme, MHRA SaMD guidance, and (if cited) the MHRA Borderline Manual MUST appear in the Document Register.

8. **Write the artefact via the Write tool** to `projects/{NNN}-<slug>/ARC-{NNN}-NHSMDR-v1.0.md`.

9. **Show only a summary to the user**: scope determination (medical device / not / borderline), UK class, EU class, marking pathway, conformity route, list of `[PENDING]` items requiring qualified Regulatory Affairs review.

## Important Notes

- **The intended-purpose statement is load-bearing**: classification follows directly from the manufacturer's stated intended purpose. Tightening language ("informs" vs "supports" vs "makes" clinical decisions) is often the most consequential single sentence in the assessment.
- **EU MDR Rule 11 is more restrictive than legacy UK readings**: products historically self-certified as Class I under MDD have widely moved to Class IIa under EU MDR. Don't anchor on legacy classifications when generating new assessments.
- **Windsor Framework**: GB-manufactured devices placed on the NI market need either UKNI marking or CE marking. UKNI marking alone is not valid for the rest of the EU.
- **Hardware out of scope**: this command does not assess hardware medical devices. If the product has any intended hardware component (wearable sensor, USB device, etc.), seek specialist regulatory advice and do not rely on the SaMD-only output of this command.
- **MHRA roadmap volatility**: the MHRA AIaMD Programme is publishing work packages incrementally. Version-pin the assessment date and re-run this command when material MHRA updates are published.
- **"Not a medical device" is a defensible answer**: many digital-health products are *not* medical devices (e.g. record-keeping tools, appointment booking, signposting). The MHRA Borderline Manual is the canonical source for these calls; cite the relevant example explicitly when reaching this conclusion.
- **ISO 14971 vs DCB0129**: the two are complementary but distinct. ISO 14971 is risk management for medical devices; DCB0129 is clinical risk management for NHS-deployed health IT. SaMD products typically need both, with cross-referenced hazard / risk content.

## Suggested Next Steps

After completing this command, consider running:

- `/arckit:uk-nhs-dcb0129` -- DCB0129 hazard log feeds the ISO 14971 risk file expected by both UK MDR and EU MDR.
- `/arckit:uk-nhs-dtac` -- DTAC consumes the classification statement to determine procurement assurance route.
- `/arckit:risk` -- Project risk register cross-references regulatory-classification risks (misclassification, market-access risk, post-market surveillance failure).
- `/arckit:adr` -- Major regulatory routing decisions (e.g. UKCA self-declare vs Approved Body, EU MDR via Notified Body vs not) belong in an ADR.
