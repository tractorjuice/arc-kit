# NHS DTAC Assessment Guide

> **Command**: `/arckit:uk-nhs-dtac` | **Overlay**: [UK NHS Clinical Safety Overlay](uk-nhs-clinical-safety-overlay.md) | **Origin**: Community-contributed

## Purpose

Generates an NHS Digital Technology Assessment Criteria (DTAC) assessment for a digital health product being procured or assured by an NHS organisation. DTAC is the NHS England assessment framework that care commissioners and providers use to assure digital health technology products, and they ask manufacturers for a completed DTAC form for each product version.

The command follows the **DTAC form version 2.0**, which NHS England published on 24 February 2026. From 6 April 2026 manufacturers must provide version 2.0 in place of the older version 1.0 form.

DTAC applies alongside, and does not replace, MHRA medical-device regulation (run `/arckit:uk-mdr-classification` if the product is a medical device), the Data Security and Protection Toolkit, or the NHS and GDS Service Standards (run `/arckit:service-assessment` if the product is also a GDS-assessed service).

## What it produces

Single artefact `projects/{NNN}-<slug>/ARC-{NNN}-NHSDTAC-v1.0.md` that answers each question of the DTAC form, by question code, with its evidence:

| Section | Coverage | Assessed? | ArcKit cross-references |
|---|---|---|---|
| A. Company information | A1–A12: company, product, version, product type, contact, registration, CQC | Not assessed — context | Project metadata |
| B. Value proposition | B1–B4: intended use, description, users and benefits, data flows and user journey | Not assessed — context | `requirements`, `stakeholders`, `data-model` |
| C1. Clinical safety | SaMD / AIaMD status (with a Pre-Acquisition Questionnaire if Yes), DCB0129 scope, clinical risk management system, Clinical Safety Case Report and Hazard Log, Clinical Safety Officer | Assessed — must pass | `uk-mdr-classification`, `clinical-safety/SAFETY-CASE.md`, `HAZARD-LOG.md` |
| C2. Data protection | Manufacturer's DSPT status, ICO registration, DPIA (with the form's coverage list), transparency information, terms of use, data location and transfers outside the UK | Assessed — must pass | `dpia` output |
| C3. Technical security | Cyber Essentials, Cyber Security Charter for Suppliers to the NHS, external penetration test (OWASP Top 10, within 12 months, no CVSS 7.0 or above), Software Security Code of Practice, multi-factor authentication, logging | Assessed — must pass | `secure`, `hld-review`, `dld-review` |
| C4. Interoperability | APIs and the standards they use, GDS Open API practice, NHS number, PDS, NHS login, DAPB3051 | Assessed — must pass | `data-model`, `adr` |
| D1. Usability and accessibility | User journey, usability testing, Accessible Information Standard, WCAG 2.2 AA, accessibility statement, service availability | Scored, not pass/fail | `service-assessment` |

DTAC version 2.0 has no AI section: AI appears only in C1.1.1, as AI as a Medical Device. Where a buyer asks for AI assurance, the artefact adds an **AI and machine learning supplement**, labelled as an ArcKit addition outside DTAC: model class, training-data provenance, ATRS publication, fairness assessment, model drift monitoring, human-in-the-loop / human-on-the-loop design, transparency to clinicians and patients, MHRA AIaMD Programme alignment.

## When to use

- The product is being submitted to an NHS Trust, ICS, or national NHS buyer for procurement assurance
- The product is being onboarded to an NHS framework (e.g. Spark DPS, Health Systems Support Framework)
- The deploying organisation requires a DTAC pack as part of clinical onboarding

## Prerequisites

The richest output comes when the project already has an MDR classification, DPIA, ATRS (if AI), Secure by Design assessment, and a DCB0129 case in place. The DTAC artefact cross-references all of these. The command marks `[PENDING]` for criteria that depend on these missing inputs rather than fabricating compliance.

## Use the NHS England form

NHS England asks buyers to accept the standard DTAC form and not to make amended versions; additional requirements go in a supplemental request. The ArcKit artefact is the evidence pack behind the completed NHS England form, not a replacement for it.

## DTAC version pinning

The command follows the DTAC form version 2.0 (24 February 2026). NHS England has said it will update DTAC again as its review of DCB0129 and DCB0160 and other standards work conclude, and asks that the form be downloaded at the point of use. Check <https://digital.nhs.uk/services/digital-technology-assessment-criteria-dtac> before submission; if a later form is published, the questions may have changed. The artefact records the form version it follows.

## `[PENDING]` markers

The command marks as `[PENDING]` any answer the project evidence does not support, such as DSPT status, ICO registration, certificates, test reports or the CSO's details. `[PENDING — organisation responsibility]` is kept for items the deploying NHS organisation, not the manufacturer, must supply, such as local Caldicott Guardian sign-off or its own DCB0160 case.

## Important

DTAC pass status does not constitute MHRA medical-device approval, does not constitute DCB0129/0160 compliance, and does not constitute UK GDPR compliance. Each is a separate assurance with its own evidence trail.

## Related commands

- `/arckit:uk-nhs-dcb0129` — manufacturer Clinical Safety Case (C1 evidence)
- `/arckit:uk-nhs-dcb0160` — deployer Clinical Safety Case (the deploying organisation's own duty, recorded beside C1 but not part of the DTAC form)
- `/arckit:dpia` — C2 evidence
- `/arckit:atrs` — AI supplement evidence
- `/arckit:secure` — C3 evidence
- `/arckit:service-assessment` — NHS and GDS Service Standard assessment, which DTAC complements
- `/arckit:uk-mdr-classification` — medical-device determination for C1.1.1
