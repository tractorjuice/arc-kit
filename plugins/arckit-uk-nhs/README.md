# ArcKit — UK NHS Clinical Safety Overlay

4 slash commands and the `uk-nhs-clinical-safety` build recipe covering NHS digital-health clinical safety and UK/EU medical-device regulation:

- `/arckit:uk-nhs-dcb0129` — NHS DCB0129 manufacturer Clinical Safety Case + Hazard Log (3-file output: `SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`)
- `/arckit:uk-nhs-dcb0160` — NHS DCB0160 deployer Clinical Safety Case + deployment Hazard Log (3-file output, deployer variant)
- `/arckit:uk-nhs-dtac` — NHS Digital Technology Assessment Criteria (DTAC v3) — 5 sections plus AI annex
- `/arckit:uk-mdr-classification` — UK MDR 2002 (as amended) + EU MDR 2017/745 software-as-medical-device (SaMD / AIaMD) classification, UKCA / UKNI / CE marking pathway, Windsor Framework NI handling

Recipe: `uk-nhs-clinical-safety` (composes with the UK SaaS baseline; no swaps — NHS digital products still need TCoP, Secure by Design, DPIA, ATRS).

## Spec lineage

`uk-nhs-dcb0129` and `uk-nhs-dcb0160` adopt Dr Marcus Baw's [SAFETY.md spec](https://github.com/pacharanero/SAFETY.md) verbatim for filenames and YAML-frontmatter hazard-log structure. The 3 files (`SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`) land inside an ArcKit project subdirectory (`projects/{NNN}/clinical-safety/`) rather than at the repo root, with an ArcKit Document Control block prepended for provenance and review-cycle tracking. The body and YAML follow his spec exactly.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-uk-nhs
```

Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, `dpia`, `atrs`, etc.) and `validate-arc-filename` won't recognise NHS doc-type codes (`NHSDTAC`, `NHSMDR`).

## Regulatory anchors

NHS DCB0129 (Clinical Risk Management — Manufacture) · NHS DCB0160 (Clinical Risk Management — Deployment) · NHS DTAC v3 · UK MDR 2002 (as amended by the Medical Devices (Amendment) (Great Britain) Regulations 2024) · EU MDR 2017/745 (NI placement under Windsor Framework) · MHRA Software and AI as a Medical Device Programme · ISO 14971 (risk management) · IEC 62304 (software lifecycle) · ISO 13485 (QMS, signposted).

## Status

**Community-contributed.** Output should be reviewed by a qualified Clinical Safety Officer (CSO with appropriate GMC / NMC / HCPC registration) and, for MDR classification, by a qualified Regulatory Affairs specialist before reliance. This plugin is **not** clinical, legal, or regulatory advice.

## Maintainer

Domain co-maintainer (proposed): Dr Marcus Baw ([@pacharanero](https://github.com/pacharanero)) — clinical informatician at RCPCH, openEHR, and NHSE; author of the SAFETY.md spec and earlier DCB0129 markdown / templated repos at [turva-uk](https://github.com/turva-uk). Originally contributed via PR for issue [#424](https://github.com/tractorjuice/arc-kit/issues/424).
