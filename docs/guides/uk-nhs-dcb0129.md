# NHS DCB0129 Manufacturer Clinical Safety Case Guide

> **Command**: `/arckit:uk-nhs-dcb0129` | **Overlay**: [UK NHS Clinical Safety Overlay](uk-nhs-clinical-safety-overlay.md) | **Origin**: Community-contributed

## Purpose

Generates the **manufacturer-side** clinical safety documentation required under NHS DCB0129 for any health IT product being placed on the NHS market. NHS DCB0129 is mandated under the Health and Social Care Act 2012 s250 and applies to *any* health IT system deployed in the NHS, regardless of whether the product is also a medical device.

The output is a 3-file set that follows Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) verbatim — chosen so the documents remain readable by clinicians, NHS England assessors, MHRA inspectors, and Notified Body reviewers without ArcKit-specific tooling.

## What it produces

Three files in `projects/{NNN}-<slug>/clinical-safety/`:

| File | Purpose |
|---|---|
| `SAFETY.md` | Front-door anchor: required Marcus-spec fields (product-name, version, CSO, organisation, status, hazard-log-url, last-reviewed) + ArcKit Document Control + Summary |
| `SAFETY-CASE.md` | Clinical Safety Case Report with 6 GSN-inspired sections: Intended Use, Scope, Safety Argument (G1.1–G1.6 cross-referencing hazards), Evidence, Residual Risk, CSO Sign-off |
| `HAZARD-LOG.md` | YAML-frontmatter hazard array + controls + rendered Markdown table. 6 starter hazards: wrong-patient identity, stale clinical data, audit-trail gap, authorisation bypass, alert delivery failure, write-integrity loss |

The 3 files together implement the four DCB0129 deliverables — Clinical Risk Management Plan (summarised in `SAFETY.md`), Hazard Log, Clinical Safety Case Report, and Clinical Risk Management File (the repository itself; Git history is the audit trail).

## Risk scoring scales (DCB0129 convention)

- **Severity**: `1` Catastrophic | `2` Major | `3` Considerable | `4` Significant | `5` Minor
- **Likelihood**: `1` Very High | `2` High | `3` Medium | `4` Low | `5` Very Low
- **Risk level**: `unacceptable` | `high` | `medium` | `low`
- **Status**: `open` | `mitigated` | `accepted` | `closed`

> ⚠️ DCB0129 inverts the usual Orange Book convention where 5 = highest. Templates carry the legend prominently.

## When to use

- The system will be deployed in NHS England, Scotland, Wales, or NI as a manufacturer-supplied product
- The system is software intended to support, inform, or perform clinical functions (decision support, observation capture, prescribing, results display, scheduling for clinical purposes, identity / demographics, etc.)
- Compare with DCB0160 for **deployer-side** obligations at the deploying NHS organisation

## Prerequisites

Requires the project's REQ, DATA, STKE, RISK artefacts. Will read the project's DPIA if present (privacy hazards may overlap with clinical hazards).

A named, qualified **Clinical Safety Officer** (CSO) with current GMC / NMC / HCPC / GPhC registration MUST be appointed to sign off the case. The command generates the documents in `DRAFT` status with the CSO field left as `[PENDING]`.

## Tiering (Marcus's SAFETY.md spec)

- **Tier 1** (low-risk reference / informational): the CSO may consolidate to a single `SAFETY.md` with embedded hazard table and delete the case + log files
- **Tier 2** (moderate-risk; the command's default output)
- **Tier 3** (SaMD; high-risk regulated medical devices): additionally author a `SAFETY-PLAN.md`

## Filename convention

The three filenames deliberately do **not** carry the ArcKit `ARC-` prefix. They pass through the `validate-arc-filename` hook untouched and do not appear in the ArcKit manifest as discrete ARC artefacts. Other documents (DTAC, MDR, project risk register) cross-reference them by relative path.

## Important

This guide and the command's output are **not** clinical, legal, or regulatory advice. The Clinical Safety Case Report MUST be reviewed, materially supplemented, and signed off by a qualified CSO before the product is placed into clinical use.

## Related commands

- `/arckit:uk-nhs-dcb0160` — deployer-side companion (DCB0160)
- `/arckit:uk-nhs-dtac` — NHS DTAC v3 (consumes the SAFETY-CASE.md content in Section 1)
- `/arckit:uk-mdr-classification` — if the product is also a medical device, DCB0129 hazards feed the ISO 14971 risk file
- `/arckit:risk` — project-level risk register cross-references clinical hazards
- `/arckit:dpia` — privacy hazards may overlap with clinical hazards
