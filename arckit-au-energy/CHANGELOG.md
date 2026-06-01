# Changelog — arckit-au-energy

All notable changes to the `arckit-au-energy` plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

Initial release of `arckit-au-energy` — Australian Energy Sector overlay. First **Australian sector-specific** overlay (the existing `arckit-au` is jurisdiction-specific; this layers an industry sector on top of it, mirroring how `arckit-uk-finance` and `arckit-uk-nhs` layer sectors on the UK baseline). Partially addresses [#440](https://github.com/tractorjuice/arc-kit/issues/440).

**2 community-overlay commands:**

- `au-aescsf` — Australian Energy Sector Cyber Security Framework (AESCSF) maturity assessment for energy-sector projects with IT, OT, market, and grid-edge dependencies.
- `au-energy-compliance` — Australian energy-sector compliance architecture pack covering AER ring-fencing, AEMC NER/NGR, AEMO interfaces, and SOCI escalation evidence.

**Recipe `au-energy`** (22 targets) composes the `arckit-au` federal baseline (Essential Eight, ISM, OT security, SOCI/CIRMP, Privacy Act/NDB) and layers energy-sector coverage. Includes an optional default-off `SERVICE_INVENTORY` target using `/arckit:servicenow` for CMDB / service-inventory evidence. Reuses existing ArcKit skills (`data-model`, `servicenow`, `dfd`, `diagram`, `risk`, `maturity-model`, `traceability`, `graph-report`) for register/evidence-heavy energy review rather than introducing a new inventory command.

**Doc types** `AUAESCSF` (AESCSF Maturity Assessment) and `AUENERGY` (Energy Compliance Pack) — both regime `AU`, HIGH severity, registered in the `arckit` core `doc-types.mjs` and `pages.md`.

**Synthetic public evaluation fixtures** under `tests/fixtures/au-energy/` — Fixture A (Eastland Energy Networks, applicable DNSP / critical electricity asset) and Fixture B (Voltiq Analytics, non-SOCI supplier negative case) — with deterministic pytest coverage (`tests/plugin/test_au_energy_menu.py`).

Requires the `arckit` core plugin and the `arckit-au` federal overlay (the `au-energy` recipe consumes `AU_E8`, `AU_ISM`, `AU_OT`, `AU_SOCI`, `AU_PIA`, and `AU_NDB` targets from `arckit-au`).
