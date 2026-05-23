# arckit-us — Changelog

## 5.1.0 — 2026-05-23

### Added

Initial release of the **USA Federal Civilian Overlay** as a `[COMMUNITY]` plugin in the ArcKit marketplace.

**Commands (10):**

- `us-fisma-categorization` — FIPS 199 system categorization
- `us-nist-800-53` — NIST SP 800-53 Rev 5 tailoring (Low/Mod/High)
- `us-fedramp-ssp` — FedRAMP System Security Plan
- `us-fedramp-readiness` — 3PAO Readiness Assessment
- `us-zero-trust` — CISA Zero Trust Maturity Model v2.0
- `us-icam` — OMB M-19-17 / NIST SP 800-63-3 ICAM
- `us-ai-rmf` — NIST AI RMF 1.0 + Generative AI Profile
- `us-ai-impact` — OMB M-24-10 / M-25-21 AI impact assessment
- `us-privacy-pia` — E-Gov Act §208 PIA
- `us-sbom-eo-14028` — EO 14028 secure-software self-attestation + SBOM

**Recipe:** `us-federal` (5 waves).

**Doc-type codes registered in `arckit` core**: `FIPS199`, `NIST`, `FRSSP`, `FRRR`, `ZTA`, `ICAM`, `AIRMF`, `AIIA`, `USPIA`, `SBOM`.

Requires `arckit` core at `=5.1.0`.
