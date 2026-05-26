# ArcKit — UK Finance Payments Overlay

4 slash commands and the `uk-fs-payments` build recipe covering UK Financial Services payments compliance for established Payment Service Providers, E-Money Institutions, and Payment Institutions:

- `/arckit:uk-fs-sca-rts` — UK PSD2 SCA-RTS exemption design (Articles 10-18 PSRs 2017, TRA thresholds, fraud-monitoring framework)
- `/arckit:uk-fs-safeguarding` — EMI/PI safeguarding assessment (EMR 2011, PSRs 2017, FCA Dear CEO 2020) — **CRITICAL severity**
- `/arckit:uk-fs-consumer-duty` — FCA Consumer Duty annual Board Report (PS22/9, FG22/5)
- `/arckit:uk-fs-ctp-dependency` — Critical Third Parties dependency assessment (BoE/PRA/FCA PS24/16)

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

FCA PSRs 2017 + SCA-RTS · FCA Approach to Payment Services and Electronic Money · FCA PS20/6 (SCA) · UK Finance Industry Guidance on Strong Customer Authentication (2025) · Electronic Money Regulations 2011 · FCA "Dear CEO" letter on safeguarding (Jan 2020) · FCA REP-CRIM (SUP 16 Annex 30A) · FCA PS22/9 (Consumer Duty) · FCA FG22/5 · FCA Consumer Duty board-report observations (April 2026) · FCA Principle 12 (PRIN 2A) · BoE/PRA/FCA PS24/16 (Critical Third Parties) · FSMA 2023 · FINOS Common Cloud Controls (referenced as a control-library substrate).

## Statutory currency

The CTP regime is **effective January 2025** upon HMT designation; the designated CTP list is still maturing — verify against the current HMT designation page before relying on any CTP dependency entry. UK SCA-RTS is in **PSRs 2017 Schedule 5** and may diverge from EU PSD3 over time. FCA Consumer Duty board-report expectations are evolving — see the April 2026 FCA observations for the current good-practice baseline.

## Maintainer

`[COMMUNITY]` — **EXPERIMENTAL**. Recruiting domain co-maintainer. Help wanted: if you are a UK FS practitioner with deep knowledge of PSD2 SCA-RTS, EMI safeguarding, Consumer Duty, or the Critical Third Parties regime — open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-finance`. Output from these commands MUST be reviewed by qualified UK FS regulatory counsel and the firm's MLRO / Compliance Officer before reliance.
