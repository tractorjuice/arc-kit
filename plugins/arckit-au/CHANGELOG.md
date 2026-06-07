# Changelog — arckit-au

All notable changes to the `arckit-au` plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Added `au-ot-security` for ASD operational technology cyber security guidance in connected OT environments.
- Added `au-soci-cirmp` for SOCI Act / Critical Infrastructure Risk Management Program support.
- Added optional default-off `AU_OT` and `AU_SOCI` targets to the `au-federal` recipe for cross-sector critical-infrastructure use. These are general AU capabilities intended to be consumed by the first industry-specific AU menu, `au-energy`.

## [5.0.0] - 2026-05-18

### Added

Initial release of `arckit-au` — Australian Federal Government / DISP-supplier compliance overlay. Supersedes PR #441 (au-federal-recipe by @royster70) by restructuring the same content into the v5.0.0 per-jurisdiction layout.

**8 community-overlay commands** (validated end-to-end against a real Australian SMB engagement; DISP-track, OFFICIAL:Sensitive):

- `au-e8-posture` — ASD Essential Eight ML0–ML3 maturity assessment
- `au-pia` — Privacy Act 1988 s33D Privacy Impact Assessment (13 APPs)
- `au-dss` — DTA Digital Service Standard (13 criteria)
- `au-ism-controls` — ASD ISM Statement of Applicability (17 control domains)
- `au-ndb-playbook` — OAIC Notifiable Data Breach response playbook
- `au-pspf` — Protective Security Policy Framework (4 outcomes / 16 core requirements)
- `au-ai-assurance` — DTA AI Assurance Framework + Responsible AI Policy v2.0 baseline
- `au-disp-attestation` — DISP Member self-attestation pack (consolidates E8 + ISM + PIA + NDB + PSPF)

**Recipe:** `au-federal` (35 targets across 9 build waves).

**8 doc-type codes** registered in `arckit-claude/config/doc-types.mjs` (per the v5.0.0 spec, doc-types stay in core): `AUE8`, `AUISM`, `AUPIA`, `AUNDB`, `AUDSS`, `AUPSPF`, `AUAIA`, `AUDISP`. Regime `AU` added to `REGIMES` and `REGIME_LABELS`.

**Validation evidence** preserved from PR #441: 25/25 evaluation scorecard pass, 220 AU framework references in validation artefacts, 0 UK framework leakage. See `docs/au-federal-validation-scorecard.md`.

**Domain co-maintainer:** @royster70.
