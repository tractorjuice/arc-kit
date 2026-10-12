# NHS DTAC v3 Assessment Guide

> **Command**: `/arckit:uk-nhs-dtac` | **Overlay**: [UK NHS Clinical Safety Overlay](uk-nhs-clinical-safety-overlay.md) | **Origin**: Community-contributed

## Purpose

Generates an NHS Digital Technology Assessment Criteria (DTAC) v3 assessment for a digital health product being procured or assured by an NHS organisation. DTAC is the de facto NHS England procurement-assurance baseline used by NHS Trust procurement teams, ICS digital teams, NHS Supply Chain framework buyers, and NHS England innovation pathways.

DTAC overlaps but does not replace MHRA medical-device regulation (run `/arckit:uk-mdr-classification` if the product is a medical device) or the GDS Service Standard (run `/arckit:service-assessment` if the product is also a GDS-assessed service).

## What it produces

Single artefact `projects/{NNN}-<slug>/ARC-{NNN}-NHSDTAC-v1.0.md` covering five sections plus an optional AI annex:

| Section | Coverage | ArcKit cross-references |
|---|---|---|
| 1. Clinical Safety | DCB0129 + DCB0160 status, CSO, hazard log open count, highest open risk | `clinical-safety/SAFETY-CASE.md`, `HAZARD-LOG.md` |
| 2. Data Protection | UK GDPR / DPA 2018 lawful basis, DPIA, DSPT, sub-processors, data-subject rights | `dpia` output |
| 3. Technical Assurance | Cloud hosting, security certifications (Cyber Essentials, ISO 27001), SDLC, encryption, pen test, BC/DR, vulnerability management | `secure`, `hld`, `dld` |
| 4. Interoperability | FHIR UK Core, SNOMED CT, dm+d, NHS Number, NHS APIs (PDS, e-RS, GP Connect, NHS App Connect, NHS login, BARS) | `data-model`, `adr` |
| 5. Usability + Accessibility | NHS Service Standard, WCAG 2.2 AA, screen-reader / keyboard / contrast evidence, plain English | `service-assessment` |

The **AI annex** is required when the product uses AI/ML for any clinically-relevant function — model class, training-data provenance, ATRS publication, fairness assessment, model drift monitoring, human-in-the-loop / human-on-the-loop design, transparency to clinicians and patients, MHRA AIaMD Programme alignment.

## When to use

- The product is being submitted to an NHS Trust, ICS, or national NHS buyer for procurement assurance
- The product is being onboarded to an NHS framework (e.g. Spark DPS, Health Systems Support Framework)
- The deploying organisation requires a DTAC pack as part of clinical onboarding

## Prerequisites

The richest output comes when the project already has DPIA, ATRS (if AI), Secure by Design assessment, and DCB0129/0160 cases in place. The DTAC artefact cross-references all of these. The command marks `[PENDING]` for criteria that depend on these missing inputs rather than fabricating compliance.

## DTAC version pinning

DTAC v3 is current as at 2026-05. Verify against <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/> before submission — if NHS England has published a new version, the section structure may have changed. The artefact carries its source-version reference.

## `[PENDING — organisation responsibility]` markers

Many DTAC items depend on activities the deploying NHS organisation must complete (DSPT submission, local Caldicott Guardian sign-off, organisational pen-test of the integrated solution). The artefact uses `[PENDING — organisation responsibility]` explicitly rather than asserting these are complete from product-side evidence alone.

## Important

DTAC pass status does not constitute MHRA medical-device approval, does not constitute DCB0129/0160 compliance, and does not constitute UK GDPR compliance. Each is a separate assurance with its own evidence trail.

## Related commands

- `/arckit:uk-nhs-dcb0129` — manufacturer Clinical Safety Case (Section 1 evidence)
- `/arckit:uk-nhs-dcb0160` — deployer Clinical Safety Case (Section 1 evidence, deploying-organisation perspective)
- `/arckit:dpia` — Section 2 evidence
- `/arckit:atrs` — AI annex evidence
- `/arckit:secure` — Section 3 evidence
- `/arckit:service-assessment` — overlapping NHS Service Standard assessment
- `/arckit:uk-mdr-classification` — for medical-device determination, parallel to DTAC
