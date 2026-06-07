# ArcKit — USA Federal Civilian Overlay

10 slash commands and the `us-federal` build recipe covering US Federal Civilian agency compliance:

- `/arckit:us-fisma-categorization` — FIPS 199 categorization (NIST SP 800-60 information types)
- `/arckit:us-nist-800-53` — NIST SP 800-53 Rev 5 tailoring against Low / Moderate / High baselines
- `/arckit:us-fedramp-ssp` — FedRAMP System Security Plan (Moderate / High template, 15 sections)
- `/arckit:us-fedramp-readiness` — 3PAO-style Readiness Assessment Report + Agency vs JAB path
- `/arckit:us-zero-trust` — CISA Zero Trust Maturity Model v2.0 across 5 pillars + 3 cross-cuts
- `/arckit:us-icam` — OMB M-19-17 / NIST SP 800-63-3 IAL/AAL/FAL (PIV + login.gov integration)
- `/arckit:us-ai-rmf` — NIST AI RMF 1.0 (Govern/Map/Measure/Manage) + Generative AI Profile (AI 600-1)
- `/arckit:us-ai-impact` — OMB M-24-10 rights/safety-impacting AI determination + M-25-21 acquisition
- `/arckit:us-privacy-pia` — E-Gov Act §208 PIA + OMB M-03-22 + Privacy Act §552a SORN trigger
- `/arckit:us-sbom-eo-14028` — EO 14028 + OMB M-22-18 / M-23-16 secure-software self-attestation + SBOM

Recipe: `us-federal` (5 waves: baseline → controls → posture → ai → authorization).

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-us
```

On Claude Code v2.1.143+, `claude plugin disable arckit` will refuse with a copy-pasteable disable-chain hint while `arckit-us` is enabled. Without `arckit` (core), the recipe will not resolve foundation commands (`arckit:principles`, `arckit:requirements`, etc.) and `validate-arc-filename` will not recognise US doc-type codes (`FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `USPIA`, `SBOM`).

## Scope

**In scope (v1)**: Federal civilian agencies and the vendors that sell to them.

**Out of scope**: Federal defense (CMMC / RMF / DISA STIGs), state regimes (StateRAMP / TX-RAMP / CJIS), sector-specific (HIPAA / GLBA / SOX / PCI), Section 508 accessibility (deferred to v2). Each is a candidate sibling overlay.

## Regulatory anchors

FIPS 199 / SP 800-60 Vol 2 · NIST SP 800-53 Rev 5 / SP 800-53B · FedRAMP Rev 5 / 3PAO Readiness · CISA Zero Trust Maturity Model v2.0 · OMB M-22-09 (Federal Zero Trust) · OMB M-19-17 (ICAM) · NIST SP 800-63-3 (IAL/AAL/FAL) · NIST AI RMF 1.0 / NIST AI 600-1 (Generative AI Profile) · OMB M-24-10 (use of AI) · OMB M-25-21 (acquisition of AI) · E-Government Act of 2002 §208 · OMB M-03-22 (PIA guidance) · Privacy Act of 1974 (5 U.S.C. §552a) · EO 14028 / OMB M-22-18 / M-23-16 (secure software) · NTIA Minimum Elements for SBOM.

## Statutory currency

EO 14110 (Safe, Secure, and Trustworthy AI) was **revoked January 2025**. The active AI assurance mandates are **OMB M-24-10 + M-25-21**. FedRAMP completed the **Rev 5** transition in 2024 — Rev 4 references are deprecated throughout. Verify citations against the current Federal Register, OMB Circulars page, and FedRAMP.gov before relying on any artefact.

## Maintainer

`[COMMUNITY]` — recruiting domain co-maintainer. Originally contributed in PR [pending].
