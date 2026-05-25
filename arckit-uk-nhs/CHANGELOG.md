# Changelog — arckit-uk-nhs

All notable changes to the `arckit-uk-nhs` plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.0.3] - 2026-05-19

### Added

Initial release of `arckit-uk-nhs` — UK NHS Clinical Safety + Medical Device Regulation overlay. First **sector-specific** ArcKit community overlay (existing overlays are jurisdiction-specific). Closes part of [#424](https://github.com/tractorjuice/arc-kit/issues/424).

**4 community-overlay commands** (DCB0129 / DCB0160 adopt [Marcus Baw's SAFETY.md spec](https://github.com/pacharanero/SAFETY.md) for file naming and YAML-frontmatter hazard log):

- `uk-nhs-dcb0129` — NHS DCB0129 manufacturer Clinical Safety Case + Hazard Log (3-file output: `SAFETY.md`, `SAFETY-CASE.md`, `HAZARD-LOG.md` in `clinical-safety/`)
- `uk-nhs-dcb0160` — NHS DCB0160 deployer Clinical Safety Case + deployment Hazard Log (3-file output, deployer variant in `clinical-safety/deployment/`)
- `uk-nhs-dtac` — NHS DTAC v3 (5 sections + AI annex)
- `uk-mdr-classification` — UK MDR 2002 (as amended) + EU MDR 2017/745 SaMD/AIaMD classification, UKCA/UKNI/CE marking, Windsor Framework NI handling

**Recipe:** `uk-nhs-clinical-safety` (composes with the UK SaaS baseline; no swaps — NHS digital products still need TCoP, Secure by Design, DPIA, ATRS).

**2 doc-type codes** registered in `arckit-claude/config/doc-types.mjs` (core): `NHSDTAC`, `NHSMDR`. Marcus's `SAFETY.md` / `SAFETY-CASE.md` / `HAZARD-LOG.md` files deliberately do not carry ArcKit doc-type codes — they pass through the `validate-arc-filename` hook untouched. Other documents cross-reference them by relative path.

**Status:** Community-contributed. Output should be reviewed by a qualified CSO and (for MDR classification) by a qualified Regulatory Affairs specialist before reliance. This plugin is not clinical, legal, or regulatory advice.

**Spec doc:** [`docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md`](https://github.com/tractorjuice/arc-kit/blob/main/docs/superpowers/specs/2026-05-19-uk-nhs-overlay-design.md) — decision log for review by @pacharanero.

**Domain co-maintainer (proposed):** Dr Marcus Baw ([@pacharanero](https://github.com/pacharanero)).
