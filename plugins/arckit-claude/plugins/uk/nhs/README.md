# ArcKit — UK NHS Clinical Safety Overlay

4 slash commands and the `uk-nhs-clinical-safety` build recipe covering NHS digital-health clinical safety and UK/EU medical-device regulation:

- `/arckit-uk-nhs:uk-nhs-dcb0129` — NHS DCB0129 manufacturer Clinical Safety Case + Hazard Log (3-file output: `SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md`)
- `/arckit-uk-nhs:uk-nhs-dcb0160` — NHS DCB0160 deployer Clinical Safety Case + deployment Hazard Log (3-file output, deployer variant)
- `/arckit-uk-nhs:uk-nhs-dtac` — NHS Digital Technology Assessment Criteria (DTAC), following the DTAC form version 2.0 (24 February 2026): context sections A and B, assessed sections C1–C4, scored section D1, plus an optional AI supplement that is not part of DTAC
- `/arckit-uk-nhs:uk-mdr-classification` — UK MDR 2002 (as amended) + EU MDR 2017/745 software-as-medical-device (SaMD / AIaMD) classification, UKCA / UKNI / CE marking pathway, Windsor Framework NI handling

Recipe: `uk-nhs-clinical-safety` (composes with the UK SaaS baseline; no swaps — NHS digital products still need TCoP, Secure by Design, DPIA, ATRS).

## Spec lineage

`uk-nhs-dcb0129` and `uk-nhs-dcb0160` follow Dr Marcus Baw's [SAFETY.md specification](https://github.com/pacharanero/SAFETY.md) **version 2.0.0-draft, as at commit [`af405498`](https://github.com/pacharanero/SAFETY.md/blob/af405498/spec/specification.md) (22 July 2026)**. The spec is a draft with no tagged release, and its required fields have changed under the same version label (`role` and `applicable-standards` were added in July 2026), so the overlay names the commit it follows. The `SAFETY.md` required fields and the `HAZARD-LOG.md` YAML schema match that text.

Deliberate deviations from the spec:

- **Location**: the files live in `projects/{NNN}-<slug>/clinical-safety/` (deployer set in `clinical-safety/deployment/`), not at the repository root, so one repository can hold several ArcKit projects.
- **Document Control**: each file starts with an ArcKit Document Control table and Revision History, with the literal filename as its Document ID.
- **Deployer file set**: the DCB0160 case and hazard log are named `DEPLOYMENT-SAFETY-CASE.md` and `DEPLOYMENT-HAZARD-LOG.md`, with `D-HAZ-NNN` hazard and `DCNNN` control IDs, so they can sit beside the manufacturer set (the spec's DCB0160 crosswalk allows a deployment-specific safety case and hazard register).
- **Extra field**: the deployer `SAFETY.md` adds `manufacturer-case-url`, which the spec does not define.
- **Tier**: the commands emit the Tier 2 three-file set by default and do not generate `SAFETY-PLAN.md`; the CSO consolidates to Tier 1 or adds `SAFETY-PLAN.md` for Tier 3 by hand.

DUAA 2025 coverage, the assurance-domain register, the hazard-archetype checklist, and the re-review triggers are ArcKit-authored adaptations informed by Marcus Baw's SAFETY.md `mappings/` crosswalks and `.agents/skills` reference files (CC BY-SA 4.0); ArcKit provides its own expression and attributes the source.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-uk-nhs
```

Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, `dpia`, `atrs`, etc.) and `validate-arc-filename` won't recognise NHS doc-type codes (`NHSDTAC`, `NHSMDR`).

## Regulatory anchors

NHS DCB0129 (Clinical Risk Management — Manufacture) · NHS DCB0160 (Clinical Risk Management — Deployment) · NHS DTAC (form version 2.0, February 2026) · UK Data (Use and Access) Act 2025 (health/care information-standards framework, amending HSC Act 2012 Part 9) · UK MDR 2002 (as amended by the Medical Devices (Amendment) (Great Britain) Regulations 2024) · EU MDR 2017/745 (NI placement under Windsor Framework) · MHRA Software and AI as a Medical Device Programme · ISO 14971 (risk management) · IEC 62304 (software lifecycle) · ISO 13485 (QMS, signposted).

## Status

**Community-contributed.** Output should be reviewed by a qualified Clinical Safety Officer (CSO with appropriate GMC / NMC / HCPC / GPhC registration) and, for MDR classification, by a qualified Regulatory Affairs specialist before reliance. This plugin is **not** clinical, legal, or regulatory advice.

## Data

This overlay adds commands, templates and reference material only. It sends no data of its own, and it has no hooks and no MCP servers. Its commands run in Claude alongside the `arckit` core plugin, whose README lists what that plugin sends and when. Privacy policy: <https://arckit.org/privacy.html>.

## Maintainer

Domain co-maintainer (proposed): Dr Marcus Baw ([@pacharanero](https://github.com/pacharanero)) — clinical informatician at RCPCH, openEHR, and NHSE; author of the SAFETY.md spec and earlier DCB0129 markdown / templated repos at [turva-uk](https://github.com/turva-uk). Originally contributed via PR for issue [#424](https://github.com/tractorjuice/arc-kit/issues/424).
