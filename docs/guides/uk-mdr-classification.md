# UK + EU MDR SaMD / AIaMD Classification Guide

> **Command**: `/arckit:uk-mdr-classification` | **Overlay**: [UK NHS Clinical Safety Overlay](uk-nhs-clinical-safety-overlay.md) | **Origin**: Community-contributed

## Purpose

Determines whether a software product is a medical device under UK MDR 2002 (as amended) and EU MDR 2017/745, classifies it (Class I / IIa / IIb / III), identifies the marking pathway (UKCA / UKNI / CE), the conformity-assessment route (self-declaration / Approved Body / Notified Body), the QMS expectation, the standards alignment expected, and the post-market obligations that flow from the classification.

The output is **not** regulatory advice. Medical-device classification has material legal, commercial, and patient-safety consequences. The artefact MUST be reviewed and signed off by a qualified Regulatory Affairs Specialist or Notified Body / Approved Body advisor.

## Scope

Software-as-medical-device (SaMD) and AI-as-medical-device (AIaMD) only. Hardware medical devices and software embedded in hardware devices are **out of scope** for v1 — different conformity routes, different test regimes, different MHRA processes. Consult specialist regulatory advice for hardware.

## What it produces

Single artefact `projects/{NNN}-<slug>/ARC-{NNN}-NHSMDR-v1.0.md` covering:

- **Intended-purpose statement** captured verbatim from upstream artefacts (the load-bearing input — small wording changes change the classification)
- **Scope determination** — UK MDR 2002 regulation 2 test, MHRA Stand-Alone Software decision tree, MHRA Borderline Manual citations. Explicit "Not a Medical Device" determination supported (and often the right answer for record-keeping, signposting, appointment booking, and similar tools)
- **UK MDR 2002 classification** — Class I / IIa / IIb / III, subclass flags, self-certification eligibility
- **EU MDR 2017/745 classification** — Rule 11 reasoning, divergence from UK classification (EU is typically more conservative; many products that were Class I under MDD moved to Class IIa under MDR)
- **Marking pathway** — UKCA (GB), UKNI (NI under Windsor Framework), CE (EU market + NI), CE-in-GB transitional arrangements
- **Conformity-assessment route** — self-declaration vs Approved Body vs Notified Body, with technical documentation and clinical evaluation expectations
- **MHRA SaMD / AIaMD Programme** alignment — applicable Work Packages (WP1 Software, WP6 AIaMD, WP9 Cyber Security, WP11 Best Practice for Manufacturers)
- **Standards alignment** — ISO 14971 (risk management), IEC 62304 (software lifecycle), ISO 13485 (QMS, signposted), IEC 62366-1 (usability), ISO/IEC 27001 (information security), ISO/IEC TR 24028 (AI trustworthiness for AIaMD)
- **Post-market obligations** — PMS plan, vigilance reporting timelines, PSUR cadence, FSCA, AIaMD substantial-change handling
- **Substantial change triggers**, **open regulatory risks**

## When to use

- Any digital health product where there is uncertainty about whether it is a medical device
- Clinical decision-support tools, monitoring tools, diagnostic tools, triage tools, risk-score tools
- AI/ML products with any clinically-facing function
- Products placed on the NI market (where EU MDR applies under the Windsor Framework)

## Prerequisites

Requires the project's REQ (especially the intended-purpose statement), STKE, DATA, and DCB0129 case (if present — clinical hazards inform the ISO 14971 risk file expected under both UK MDR and EU MDR).

## "Not a medical device" is a defensible answer

Many digital-health products are *not* medical devices — record-keeping tools, appointment booking, signposting, navigation. The MHRA Borderline Manual is the canonical source for these determinations; the artefact cites the closest borderline example explicitly when reaching this conclusion. The "Not a Medical Device" path requires the responsible person at the manufacturer to sign off the determination and record that the product will not be marketed as a medical device.

## EU MDR Rule 11 is more restrictive than legacy UK readings

Products historically self-certified as Class I under MDD have widely moved to Class IIa under EU MDR. Do not anchor on legacy classifications — the command applies Rule 11 fresh.

## MHRA reform of UK MDR

UK MDR is being substantially reformed by MHRA. CE-marking recognition in GB transitional arrangements have moved repeatedly. The artefact pins its assessment date and lists known regulatory uncertainties. Re-run on material MHRA publications.

## Related commands

- `/arckit:uk-nhs-dcb0129` — DCB0129 hazard log feeds the ISO 14971 risk file (complementary; ISO 14971 and DCB0129 are distinct but cross-referenced)
- `/arckit:uk-nhs-dtac` — DTAC consumes the classification statement to determine procurement assurance route
- `/arckit:risk` — project risk register cross-references regulatory-classification risks (misclassification, market-access risk, post-market surveillance failure)
- `/arckit:adr` — major regulatory routing decisions (UKCA self-declare vs Approved Body, EU MDR via Notified Body vs not, NI placement strategy) belong in an ADR
- `/arckit:atrs` — if AIaMD, ATRS publication is expected alongside model card
