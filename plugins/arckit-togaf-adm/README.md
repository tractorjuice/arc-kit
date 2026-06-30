# ArcKit — TOGAF ADM Overlay

9 slash commands and the `togaf-adm-full` build recipe covering the TOGAF Architecture Development Method:

- `/arckit:adm-preliminary` — Preliminary phase: scope, drivers, constraints, architecture vision
- `/arckit:business-capability-map` — Phase A Business Architecture: strategy, capabilities, value chains
- `/arckit:application-inventory` — Phase C Application Architecture: portfolio assessment and integration patterns
- `/arckit:application-rationalization` — Application rationalization: consolidate, retire, replace
- `/arckit:gap-analysis` — Phase E Opportunities & Solutions: gap analysis and workload prioritization
- `/arckit:transition-architecture` — Phase F Migration Planning: transition architectures and work packages
- `/arckit:architecture-board` — Phase G Implementation Governance: architecture board and compliance review
- `/arckit:architecture-change` — Phase H Architecture Change Management: change requests and ADM re-entry
- `/arckit:architecture-repository` — Architecture Repository: patterns, standards, reference architectures, lessons learned

Doc-type codes: `ADMP`, `BPCM`, `APP`, `APPR`, `GAPA`, `TRANS`, `BORD`, `ACHG`, `REPO`.

Recipe: `togaf-adm-full`.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-togaf-adm
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-togaf-adm` is enabled. Without `arckit` (core), the recipe will not resolve foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` will not recognise TOGAF ADM doc-type codes (`ADMP`, `BPCM`, `APP`, `APPR`, `GAPA`, `TRANS`, `BORD`, `ACHG`, `REPO`).

## Scope

**In scope (v1)**: All 9 phases of the TOGAF ADM (Preliminary, A–H) plus the Architecture Repository.

**Out of scope**: TOGAF content framework (meta-model, artefact types), ADM tailoring guidance (deferred to v2). Each is a candidate extension.

## Maintainer

`[COMMUNITY]` — recruiting domain co-maintainer. Originally contributed in PR [pending].
