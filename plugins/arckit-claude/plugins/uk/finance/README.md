# ArcKit — UK Finance Payments Overlay

4 slash commands and the `uk-fs-payments` build recipe covering UK Financial Services payments compliance for established Payment Service Providers, E-Money Institutions, and Payment Institutions:

- `/arckit-uk-finance:uk-fs-sca-rts` — UK PSD2 SCA-RTS exemption design (UK SCA-RTS Articles 10-18 under PSRs 2017 Reg 100 and 106A, TRA thresholds, fraud-monitoring framework)
- `/arckit-uk-finance:uk-fs-safeguarding` — EMI/PI safeguarding assessment (EMR 2011, PSRs 2017, CASS 15 from 7 May 2026, FCA Dear CEO 2020) — **CRITICAL severity**
- `/arckit-uk-finance:uk-fs-consumer-duty` — FCA Consumer Duty annual Board Report (PS22/9, FG22/5)
- `/arckit-uk-finance:uk-fs-ctp-dependency` — Critical Third Parties dependency assessment (BoE/PRA/FCA PS24/16)

Recipe: `uk-fs-payments` (11 targets across baseline + overlay).

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-uk-finance
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-uk-finance` is enabled. Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` won't recognise UK Finance doc-type codes (`FSSCA`, `FSSAFE`, `FSCD`, `FSCTP`).

## Scope

**In scope (v1)**: Established UK Payment Service Providers (PSPs), E-Money Institutions (EMIs), and Payment Institutions (PIs) scaling regulated operations under FCA authorisation. Day-2 compliance artefacts — not pre-authorisation business-plan preparation.

**Out of scope**: Banking prudential regulation (ICAAP/ILAAP/MRM SS1/23), insurance, asset management, Open Banking conformance (TPP-side — separate overlay candidate), cryptoasset financial promotions, DORA mapping for UK firms with EU operations. Each is a candidate v2+ command or sibling overlay.

## Regulatory anchors

FCA PSRs 2017 + UK SCA-RTS (FCA technical standards; PS21/19, FCA 2025/62) · FCA Approach to Payment Services and Electronic Money (May 2026) · UK Finance Industry Guidance on Strong Customer Authentication (2025) · Electronic Money Regulations 2011 · FCA "Dear CEO" letter on safeguarding (Jan 2020) · FCA PS25/12 (safeguarding, August 2025) and CASS 15 (from 7 May 2026) · FCA monthly safeguarding return (SUP 16.14A, SUP 16 Annex 29BR) · FCA PS22/9 (Consumer Duty) · FCA FG22/5 · FCA "Consumer Duty board reports: good practice and areas for improvement" (11 December 2024, last updated 9 March 2026) and FCA blog "Year 2 Consumer Duty Board Reports: progress and what comes next" (16 April 2026) · FCA Principle 12 (PRIN 2A) · BoE/PRA/FCA PS24/16 (Critical Third Parties) · FSMA 2023 · FINOS Common Cloud Controls (referenced as a control-library substrate).

## Statutory currency

The CTP regime is **effective January 2025** upon HMT designation; the designated CTP list is still maturing — verify against the current HMT designation page before relying on any CTP dependency entry. The UK SCA-RTS is a set of **FCA technical standards made under PSRs 2017 regulation 106A** (not part of the PSRs themselves); it is amended by the FCA and no longer tracks the EU text — FCA 2025/62 replaced the Article 11 contactless limits with a risk-based exemption from 19 March 2026. The CASS 15 safeguarding rules and the monthly safeguarding return apply from 7 May 2026. FCA Consumer Duty board-report expectations are evolving — see the FCA's December 2024 good-practice review (last updated 9 March 2026) and its 16 April 2026 blog on year-2 board reports for the current baseline.

## Data

This overlay adds commands, templates and reference material only. It sends no data of its own, and it has no hooks and no MCP servers. Its commands run in Claude alongside the `arckit` core plugin, whose README lists what that plugin sends and when. Privacy policy: <https://arckit.org/privacy.html>.

## Maintainer

`[COMMUNITY]` — **EXPERIMENTAL**. Recruiting domain co-maintainer. Help wanted: if you are a UK FS practitioner with deep knowledge of PSD2 SCA-RTS, EMI safeguarding, Consumer Duty, or the Critical Third Parties regime — open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-finance`. Output from these commands MUST be reviewed by qualified UK FS regulatory counsel and the firm's MLRO / Compliance Officer before reliance.
