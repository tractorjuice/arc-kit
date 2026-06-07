# ArcKit — Australian Energy Sector Overlay

2 slash commands and the `au-energy` build recipe covering Australian energy-sector cyber security and regulatory compliance:

- `/arckit:au-aescsf` — Australian Energy Sector Cyber Security Framework (AESCSF) maturity assessment for projects with IT, OT, market, and grid-edge dependencies
- `/arckit:au-energy-compliance` — Australian energy compliance pack covering AER ring-fencing, AEMC NER/NGR, AEMO interfaces, DERMS/DOE, CSIP-AUS, privacy/NDB, and SOCI escalation evidence

Recipe: `au-energy` (22 targets) composes the `arckit-au` federal baseline — Essential Eight, ISM, OT security, SOCI/CIRMP, Privacy Act 1988 / OAIC NDB — then layers energy-sector coverage (AESCSF maturity, AER ring-fencing, NER/NGR, AEMO obligations, IT/OT evidence, data flows, traceability, and energy-sector ADRs) on top. It includes an optional default-off `SERVICE_INVENTORY` target (`/arckit:servicenow`) for teams with a CMDB / service-inventory need.

## First Australian sector overlay

`arckit-au` is a **jurisdiction** overlay (Australian Federal Government / DISP-supplier baseline). `arckit-au-energy` is the first Australian **sector** overlay, layering energy-industry coverage on that baseline — the same jurisdiction-plus-sector split used by `arckit-uk-finance` and `arckit-uk-nhs` on the UK side.

Rather than introduce a new inventory command, the register/evidence-heavy energy review composes existing ArcKit skills: `/arckit:data-model` (data catalogues), `/arckit:servicenow` (CMDB / service inventory), `/arckit:dfd` (IT/OT, market, DER, customer data flows), `/arckit:diagram` (architecture visualisation), `/arckit:risk` (heat / residual risk), `/arckit:maturity-model` (AESCSF maturity), `/arckit:traceability` (obligations / controls / evidence), and `/arckit:graph-report` (coverage and missing-evidence links).

## Requires arckit core and arckit-au

```bash
claude plugin install arckit arckit-au arckit-au-energy
```

The `au-energy` recipe consumes federal-layer targets from `arckit-au` (`AU_E8`, `AU_ISM`, `AU_OT`, `AU_SOCI`, `AU_PIA`, `AU_NDB`). Without `arckit-au`, those foundation steps won't resolve. Without `arckit` (core), recipes won't resolve their base commands (`arckit:principles`, `arckit:requirements`, `risk`, `data-model`, etc.) and `validate-arc-filename` won't recognise the energy doc-type codes (`AUAESCSF`, `AUENERGY`).

## Regulatory anchors

AESCSF (AEMO / Australian Energy Sector Cyber Security Framework) · AER ring-fencing guideline · National Electricity Rules (NER) / National Gas Rules (NGR) via AEMC · AEMO market and operational interfaces · DERMS / Dynamic Operating Envelopes (DOE) · CSIP-AUS (IEEE 2030.5) · SOCI Act 2018 / CIRMP · Privacy Act 1988 / OAIC Notifiable Data Breach scheme. Verify the current AESCSF version and AEMO publication dates before external use.

## Evaluation fixtures

Public **synthetic** evaluation fixtures live under `tests/fixtures/au-energy/` — Fixture A (Eastland Energy Networks, an applicable DNSP / critical electricity asset case) and Fixture B (Voltiq Analytics, a non-SOCI supplier negative case). All organisations, scenarios, evidence, and personas are fictional composites built from public sources (Forrester-TEI method); they represent no real network, supplier, person, or client. Intended for public evaluation, regression testing, and community improvement.

## Status

**Community-contributed.** Output should be reviewed by a qualified energy-sector cyber security specialist, OT/ICS engineer, CISO, or regulatory affairs adviser before reliance. This plugin is **not** legal, regulatory, or safety advice. AESCSF, AER, AEMC, and AEMO guidance is periodically updated — verify the guidance version and publication date before external use.
