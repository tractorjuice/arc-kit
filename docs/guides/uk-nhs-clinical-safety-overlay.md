# UK NHS Clinical Safety Overlay Guide

> **Overlay Origin**: Community-contributed | **Domain co-maintainer (proposed)**: [@pacharanero](https://github.com/pacharanero) (Dr Marcus Baw) | **ArcKit Version**: [VERSION]

The UK NHS Clinical Safety Overlay adds 4 community-contributed commands covering NHS clinical safety, NHS procurement assurance, and UK/EU medical-device regulation. It is the **first sector-specific** ArcKit overlay (all existing overlays are jurisdiction-specific) and establishes the `uk-{sector}-*` naming precedent for future sector overlays.

The DCB0129 and DCB0160 commands adopt Dr Marcus Baw's [SAFETY.md spec v2.0.0-draft](https://github.com/pacharanero/SAFETY.md) verbatim for filenames and YAML-frontmatter hazard log, placed inside an ArcKit project subdirectory rather than the repo root, with an ArcKit Document Control block prepended.

This overlay closes part of [#424](https://github.com/tractorjuice/arc-kit/issues/424). The full design decision log lives at [`docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md`](../superpowers/specs/2026-05-19-uk-nhs-overlay-design.md) and was written so the proposed co-maintainer can review and push back on any decision before tagging.

---

## Purpose

Four jobs in one overlay:

1. **Make NHS clinical safety a first-class architectural artefact** — DCB0129 manufacturer Clinical Safety Case + Hazard Log and DCB0160 deployer counterpart sit alongside requirements and HLD, in machine-readable form (YAML-frontmatter hazard array + rendered Markdown table) rather than buried in Word documents on Sharepoint.
2. **Make NHS DTAC v3 reusable across procurement events** — five sections plus AI annex, with explicit cross-references to DCB0129/0160, DPIA, ATRS, and Secure by Design so the assurance evidence trail is one document not a folder structure.
3. **Disambiguate medical-device regulation for SaMD / AIaMD products** — UK MDR 2002 (as amended) and EU MDR 2017/745 classification with Rule 11 reasoning, UKCA / UKNI / CE marking pathway, Windsor Framework NI handling, MHRA SaMD/AIaMD Programme alignment, and post-market obligations.
4. **Compose with the existing UK government baseline rather than replace it** — NHS digital products still need TCoP, Secure by Design, DPIA, ATRS, Risk register, and Service Standard. The overlay adds the clinical-safety and medical-device-regulation layer on top.

---

## When to Use

Use the overlay if any of the following apply to the project:

- The system is **deployed in or sold to the NHS** in any of the four home nations (England, Scotland, Wales, NI). DCB0129/0160 are NHS England standards mandated under the Health and Social Care Act 2012 s250, and are commonly adopted by other home-nation health services through procurement assurance.
- The system handles **clinical data** (patient health information, prescribing data, clinical observations, diagnostic outputs) and is intended to inform or support clinical decisions.
- The system is being submitted for **NHS DTAC procurement assessment** by an NHS Trust, ICS, or national NHS England buyer.
- The system is potentially a **medical device** — software intended for diagnostic, therapeutic, monitoring, prevention, or treatment purposes. Borderline determination is supported by the `uk-mdr-classification` command which cites the MHRA Borderline Manual explicitly.
- The system uses **AI / ML for clinical decision support** — this combines clinical safety (DCB0129 hazards specific to AI), procurement (DTAC AI annex), regulation (UK/EU MDR AIaMD), and the MHRA SaMD/AIaMD Programme work packages.

For non-NHS projects the overlay is dormant: the existing UK, MOD, EU, French, Austrian, UAE, Canada, and Australian overlays are unchanged.

---

## Prerequisites

No new plugin userConfig keys are required. The overlay uses the existing `governance_framework: UK Gov` and `default_classification` settings.

Recommended values for an NHS project:

| userConfig key | Value |
|---|---|
| `governance_framework` | `UK Gov` |
| `default_classification` | typically `OFFICIAL` for unidentified clinical data flows; `OFFICIAL-SENSITIVE` for identifiable patient data |
| `organisation_name` | the deploying NHS organisation (or manufacturer legal entity, depending on whether you're producing DCB0129 or DCB0160) |

> **Caldicott Guardian and SIRO**: NHS-specific governance roles. Both should be named in the Document Control of any artefact handling identifiable patient data. The overlay templates include placeholders.

---

## The 4 Commands

### `/arckit:uk-nhs-dcb0129` — Manufacturer Clinical Safety Case

Generates a 3-file output set in `projects/{NNN}-<slug>/clinical-safety/`:

| File | Purpose | Content |
|---|---|---|
| `SAFETY.md` | Front-door anchor | Required SAFETY.md fields (product-name, version, standard, CSO, organisation, status, hazard-log-url, last-reviewed) + ArcKit Document Control + Summary |
| `SAFETY-CASE.md` | Clinical Safety Case Report | GSN-inspired sections: Intended Use, Scope, Safety Argument (G1.1–G1.6 cross-referencing hazards), Evidence, Residual Risk, CSO Sign-off |
| `HAZARD-LOG.md` | Hazard Log | YAML frontmatter array of hazards + controls, rendered Markdown table below. 6 starter hazards covering wrong-patient, stale data, audit, authorisation, alert delivery, write integrity |

The 3 files together implement the NHS DCB0129 deliverables (Clinical Risk Management Plan, Hazard Log, Clinical Safety Case Report, Clinical Risk Management File). The repository itself is the Clinical Risk Management File — Git history is the audit trail.

**CSO appointment is non-negotiable**: a named, qualified Clinical Safety Officer (GMC / NMC / HCPC / GPhC registered) must take ownership. The command leaves the CSO name as `[PENDING]` for the human to populate.

### `/arckit:uk-nhs-dcb0160` — Deployer Clinical Safety Case

Generates a 3-file output set in `projects/{NNN}-<slug>/clinical-safety/deployment/`:

| File | Purpose |
|---|---|
| `SAFETY.md` | Deployer front-door anchor (deployer adaptation of Marcus's spec) |
| `DEPLOYMENT-SAFETY-CASE.md` | Deployment Context, Scope + Phasing, Manufacturer Case Acceptance, Deployment Safety Argument (G1.1–G1.6 with deployment-specific claims), Local Evidence, Residual Deployment Risk, Deploying-organisation CSO Sign-off |
| `DEPLOYMENT-HAZARD-LOG.md` | YAML frontmatter array with 10 starter deployment hazards covering training, workflow integration, integration failure, BC, parallel running, migration, local configuration, terminology / coding, RBAC, incident reporting |

The deployer case sits *alongside* the manufacturer case — neither replaces the other. The deploying NHS organisation has its own legal obligation under DCB0160 even if a complete DCB0129 case exists.

**Deploying-organisation CSO**: must be appointed by the deploying organisation, NOT the product manufacturer.

### `/arckit:uk-nhs-dtac` — NHS Digital Technology Assessment Criteria v3

Generates `ARC-{NNN}-NHSDTAC-v1.0.md` covering five sections:

| Section | Coverage | ArcKit cross-references |
|---|---|---|
| 1. Clinical Safety | DCB0129 + DCB0160 status, CSO, hazard log | `clinical-safety/SAFETY-CASE.md`, `clinical-safety/HAZARD-LOG.md` |
| 2. Data Protection | UK GDPR / DPA 2018 lawful basis, DPIA, DSPT, sub-processors, data-subject rights | `dpia` output |
| 3. Technical Assurance | Cloud hosting, security certifications, SDLC, encryption, pen test, BC/DR, vulnerability management | `secure`, `hld`, `dld` |
| 4. Interoperability | FHIR UK Core, SNOMED CT, dm+d, NHS Number, NHS APIs (PDS, e-RS, GP Connect, NHS App Connect, NHS login, BARS) | `data-model`, `adr` |
| 5. Usability + Accessibility | NHS Service Standard, WCAG 2.2 AA, screen-reader / keyboard / contrast evidence, plain English | `service-assessment` |

Plus an **AI annex** when the product uses AI/ML clinically — model governance, fairness, operational monitoring, transparency, MHRA AIaMD Programme alignment. Cross-references `atrs` output.

### `/arckit:uk-mdr-classification` — UK + EU MDR SaMD / AIaMD Classification

Generates `ARC-{NNN}-NHSMDR-v1.0.md` covering:

- **Intended-purpose statement** captured verbatim (load-bearing input — small wording changes change the classification)
- **Scope determination** — is this a medical device? UK MDR 2002 regulation 2 test, MHRA Stand-Alone Software decision tree, MHRA Borderline Manual citations
- **UK MDR 2002 classification** — Class I / IIa / IIb / III, subclass flags, self-certification eligibility
- **EU MDR 2017/745 classification** — Rule 11 reasoning, divergence from UK class (EU is typically more conservative)
- **Marking pathway** — UKCA (GB), UKNI (NI), CE (NI under Windsor Framework + EU market), recognition of CE in GB (transitional)
- **Conformity-assessment route** — self-declaration / Approved Body / Notified Body, with technical documentation and clinical evaluation expectations
- **MHRA SaMD / AIaMD Programme** alignment — applicable work packages (WP1 Software, WP6 AIaMD, WP9 Cyber Security, WP11 Best Practice for Manufacturers)
- **Standards alignment** — ISO 14971 (risk management), IEC 62304 (software lifecycle), ISO 13485 (QMS, signposted), IEC 62366-1 (usability)
- **Post-market obligations** — PMS, vigilance reporting timelines, PSUR cadence, FSCA, AIaMD substantial-change handling
- **Substantial change triggers**, **open regulatory risks**

Scope is **SaMD only** in v1. Hardware medical devices are out of scope; consult specialist regulatory advice.

---

## Recipe — `uk-nhs-clinical-safety`

The recipe lives at `arckit-claude/skills/arckit-build/recipes/uk-nhs-clinical-safety.yaml`. It composes with the UK SaaS baseline — no swaps from `uk-saas.yaml`; the NHS overlay adds clinical safety and medical-device regulation on top.

44 targets across 8 build waves:

| Wave | Targets | Notes |
|---|---|---|
| 0 / 1 | PRIN, GLOSSARY, REQ, STKE | Foundation |
| 2 | ORG_RESEARCH, RESEARCH, AWS_RESEARCH, AZURE_RESEARCH, GCP_RESEARCH, GOV_REUSE, DATASCOUT | Research (parallel) |
| 3 | ADR-001 to ADR-008 | Architecture decisions (NHS-flavoured topics: NHS login + CIS2, FHIR UK Core, AIaMD-aware AI/LLM, NHS frameworks for build vs buy) |
| 4 | DATA, STRATEGY, WARDLEY, RISK, HLD, SOBC | Data + risk + HLD |
| 5 | TCOP, SBD, DPIA, AIP, ATRS | UK compliance baseline |
| 6 | UK_NHS_DCB0129, UK_NHS_DCB0160 | Clinical safety (manufacturer + deployer) |
| 7 | UK_NHS_DTAC | Procurement assurance |
| 8 | UK_MDR_CLASSIFICATION | Medical-device classification (optional but default-on) |
| Plus | DIAGs, PLAN, ROADMAP, DEVOPS, FINOPS, OPS, SVCASS, TRACE | Operations + traceability |

Run: `/arckit:build {project} --recipe uk-nhs-clinical-safety`. Add `--exclude UK_MDR_CLASSIFICATION` for products definitively not a medical device.

---

## Filename convention deviation

The Marcus Baw 3-file outputs (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md` plus the `deployment/` variants) **deliberately do not carry the `ARC-` prefix**. This is intentional:

- Marcus's SAFETY.md spec is convention-driven (like `README.md`, `LICENSE`, `SECURITY.md`) — clinicians, MHRA reviewers, Notified Body assessors, and NHS procurement staff who don't use ArcKit should still be able to find and read these files
- The `validate-arc-filename` hook ignores non-`ARC-` files, so they pass through untouched
- They do not appear in the ArcKit manifest (`docs/manifest.json`) as discrete ARC artefacts
- Other artefacts (DTAC, MDR, project risk register, traceability) cross-reference them by **relative path** (`clinical-safety/SAFETY-CASE.md`) rather than by document ID

DTAC and MDR classification *do* follow ArcKit naming (`ARC-{NNN}-NHSDTAC-v1.0.md`, `ARC-{NNN}-NHSMDR-v1.0.md`) because no equivalent open-source convention exists for those documents.

---

## Doc-type codes

Two doc-type codes are registered in `arckit-claude/config/doc-types.mjs`:

| Code | Document type | Regime | Category | Severity |
|---|---|---|---|---|
| `NHSDTAC` | NHS Digital Technology Assessment Criteria (DTAC v3) | UK | Compliance | HIGH |
| `NHSMDR` | UK MDR + EU MDR SaMD/AIaMD Classification | UK | Compliance | HIGH |

Hazards do not have a doc-type code because they live in Marcus's `HAZARD-LOG.md` YAML, not as separate ARC files.

---

## Phase 2 candidates (out of scope for v1)

| Command | Purpose | Why Phase 2 |
|---|---|---|
| `uk-nhs-cra` | Standalone Clinical Risk Assessment (separated from CSCR) | Niche; most teams want full case + log together |
| `uk-nhs-interop` | FHIR UK Core / NHS API conformance / openEHR archetype dependencies | Deserves its own design pass with Marcus's openEHR background |
| `uk-mhra-saamd-roadmap` | Alignment to MHRA SaMD/AIaMD Programme work packages | Programme evolving; revisit when stabilises |
| `uk-nhs-shared-care-record` | LHCR / ShCR integration patterns | Regional variation across the 42 ICSs — needs scoping |
| GitHub Issues hazard-log alternative | Marcus's `--via=issues` variant | Add when requested |
| `SAFETY-PLAN.md` (Tier 3) | Separate Clinical Risk Management Plan for SaMD | Most NHS digital products are Tier 1 / 2 |

---

## Tiering (Marcus's SAFETY.md spec)

| Tier | Applies to | Files |
|---|---|---|
| Tier 1 | Low-risk reference / informational tools, decision support with no direct clinical action | `SAFETY.md` only (single file, embedded hazard table) |
| Tier 2 | Moderate-risk clinical software, decision-support tools (default for this overlay) | `SAFETY.md` + `SAFETY-CASE.md` + `HAZARD-LOG.md` |
| Tier 3 | High-risk / regulated medical devices, SaMD | Tier 2 + `SAFETY-PLAN.md` |

This overlay always emits the Tier 2 three-file set. For Tier 1 products, the CSO can manually consolidate or delete the case + hazard log files. For Tier 3, author `SAFETY-PLAN.md` separately (a future Phase 2 command may automate this).

---

## Status and review

**Community-contributed.** Output is **not** clinical, legal, or regulatory advice. The Clinical Safety Case Report, Hazard Log, DTAC assessment, and MDR Classification MUST be reviewed and signed off by:

- A qualified Clinical Safety Officer (CSO) with current GMC / NMC / HCPC / GPhC registration — for DCB0129, DCB0160, DTAC §1
- A Data Protection Officer or appropriately qualified privacy specialist — for DTAC §2 (and the underlying DPIA)
- A qualified Regulatory Affairs Specialist or Notified Body / Approved Body advisor — for UK MDR + EU MDR classification

before the product is deployed into clinical use, submitted to an NHS buyer, or placed on the market as a medical device. Misuse of the generated output has material legal, commercial, and patient-safety consequences.

---

## References

- NHS DCB0129 — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0129-clinical-risk-management-its-application-in-the-manufacture-of-health-it-systems>
- NHS DCB0160 — <https://digital.nhs.uk/data-and-information/information-standards/information-standards-and-data-collections-including-extractions/publications-and-notifications/standards-and-collections/dcb0160-clinical-risk-management-its-application-in-the-deployment-and-use-of-health-it-systems>
- NHS DTAC — <https://transform.england.nhs.uk/key-tools-and-info/digital-technology-assessment-criteria-dtac/>
- UK MDR 2002 (as amended) — <https://www.legislation.gov.uk/uksi/2002/618>
- EU MDR 2017/745 — <https://eur-lex.europa.eu/eli/reg/2017/745>
- MHRA Software and AI as a Medical Device Programme — <https://www.gov.uk/government/publications/software-and-artificial-intelligence-ai-as-a-medical-device>
- Marcus Baw SAFETY.md spec — <https://github.com/pacharanero/SAFETY.md>
- Marcus Baw DCB0129 templated — <https://github.com/turva-uk/dcb0129-template>
- Marcus Baw DCB0129 markdown — <https://github.com/turva-uk/dcb0129-markdown>
- ArcKit issue [#424](https://github.com/tractorjuice/arc-kit/issues/424) — Community overlay recruitment thread and design context
- Spec doc [`docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md`](../superpowers/specs/2026-05-19-uk-nhs-overlay-design.md) — full design decision log written for @pacharanero review
