# UK Finance Payments Overlay

> **Status**: EXPERIMENTAL · Community-contributed · No named domain co-maintainer · **Output requires
> review by qualified UK FS regulatory counsel, the firm's MLRO / Compliance Officer, and the
> SMF holder with primary accountability for payment services before any reliance on generated
> artefacts.** Regulatory citations reflect the position at the time each command was authored;
> verify against current FCA, BoE, PRA, and legislation.gov.uk publications before reliance.

## Purpose

The UK Finance Payments Overlay is the first sector-specific ArcKit overlay. Where the jurisdiction
overlays (UAE, France, Canada, EU, Austria, Australia, USA) replace or supplement the UK
governance framework for a different legal territory, this overlay stays within the UK but narrows
the regulatory focus to the **payments and e-money sector** — authorised Payment Service Providers
(PSPs), Electronic Money Institutions (EMIs), Authorised Payment Institutions (APIs), and the
registered Small Payment Institutions (SPIs) that may opt into safeguarding voluntarily.

The v1 scope covers the UK payments slice that applies to **established PSPs and EMIs** already
holding their FCA authorisation and now building or re-architecting a product on top of that
authorisation. It does not replicate the authorisation application process itself; it produces the
architecture and compliance artefacts that a firm needs once authorised — and that the FCA expects
to find during supervisory engagement.

---

## When to Use

Use the overlay if any of the following describe the project:

- **Building a new product on an existing FCA authorisation** — adding a new payment rail, a
  new card-present exemption design, a virtual account product, or a cross-border FX offering
  to a firm already authorised under PSRs 2017 or EMR 2011.
- **Refreshing artefacts after a regulatory change** — FCA PS24/9 (safeguarding reforms), PS24/16
  (Critical Third Parties, effective January 2025), or a future SCA-RTS instrument revision has
  changed an obligation and the firm's compliance documentation needs updating.
- **Preparing for FCA supervisory engagement** — an FCA skilled-person review (s166), a Dear CEO
  letter response, or an annual safeguarding return audit trail requires the firm to produce
  structured, traceable compliance documentation.
- **Onboarding an architecture team to payments compliance** — the commands produce teaching
  artefacts that ground architects and engineers in the regulatory anchors without requiring
  them to read each primary instrument from scratch.

For non-payments projects, the overlay is dormant: existing baseline ArcKit commands (risk, dpia,
requirements, adr, etc.) are unchanged. For cross-border EU operations, the EU overlay handles
the PSD3 / EU SCA-RTS trajectory; this overlay covers the post-Brexit UK SCA-RTS divergence
specifically.

---

## Prerequisites

Before running the commands:

- The project must be scaffolded via `/arckit:init`. A `projects/` directory must exist.
- The baseline artefacts (PRIN, STKE, REQ, RISK) ideally exist before running the overlay
  commands — each overlay command reads them for context. They do not need to be final; draft
  versions are sufficient.
- The plugin `userConfig` should have `governance_framework` set to `UK Gov` and
  `default_classification` set appropriately (PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE for most
  payments artefacts; check with counsel for any that contain firm-sensitive commercial data).
- No additional userConfig keys are required for this overlay beyond the core plugin defaults.

---

## The 4 Commands

### `/arckit:uk-fs-sca-rts` — SCA-RTS Exemption Design

Generates an SCA-RTS exemption design pack for an authorised PSP, EMI, or PI subject to the Payment
Services Regulations 2017 and the UK Technical Standards on Strong Customer Authentication (FCA
2020/70 as amended by PS21/19). The artefact covers: an exemption applicability matrix for Articles
10, 10A, 11, 13–18 (with Article 12 out of scope as AISP-only); Transaction Risk Analysis (TRA)
fraud rate band assessment under Article 18; authentication architecture (knowledge / possession /
inherence factor inventory; dynamic linking implementation); fraud monitoring framework including
reporting cadence and MLRO notification triggers; and audit trail requirements. Doc-type code:
**FSSCA**. Principal citations: PSRs 2017 SI 2017/752; FCA PS21/19; FCA 2020/70; the FCA Approach
Document (current edition).

### `/arckit:uk-fs-safeguarding` — EMI / PI Safeguarding Assessment

Generates a safeguarding assessment for an authorised EMI or API (or an SPI that voluntarily
safeguards) under EMR 2011 Reg 20–22 and PSRs 2017 Reg 23. The artefact covers: safeguarding method
statement (segregation in a designated bank account, comparable insurance policy, or comparable
guarantee — with full justification for the chosen method); designated safeguarding bank or insurer
details; end-to-end client-funds flow diagram; daily reconciliation framework with a four-tier
sign-off chain; and an audit plan aligned to FCA REP-CRIM expectations and the monthly safeguarding
return (SUP 16 Annex 34A for payment institutions; SUP 16 Annex 34B for EMIs). Failure scenarios and
recovery plans are required sections. Doc-type code: **FSSAFE** (CRITICAL severity). Principal
citations: EMR 2011 SI 2011/99; PSRs 2017 SI 2017/752; FCA PS24/9; FCA Approach Document (May 2026).

### `/arckit:uk-fs-consumer-duty` — Consumer Duty Annual Board Report

Generates an FCA Consumer Duty Annual Board Report covering the four Consumer Duty outcomes
introduced by PS22/9 (in force July 2023 for open products, July 2024 for closed products) and
anchored on FCA Principle 12 and PRIN 2A. The artefact covers: per-outcome evidence assessment
(Products and Services, Price and Value, Consumer Understanding, Consumer Support); fair-value
framework; target market assessment; vulnerable customer cohort identification using the FG22/5
four vulnerability drivers (health, life events, resilience, capability); foreseeable harms register;
and a board attestation block for SMF holder sign-off. Doc-type code: **FSCD**. Principal citations:
FCA PS22/9; FCA FG22/5; FCA Consumer Duty board-report good practice observations (December 2024,
updated March 2026); FCA PRIN 2A via FCA 2022/31.

### `/arckit:uk-fs-ctp-dependency` — Critical Third Party Dependency Assessment

Generates a CTP dependency register and resilience testing plan under the BoE/PRA/FCA CTP regime
established by PS24/16 (effective January 2025) and grounded in the Financial Services and Markets
Act 2023. The artefact covers: identification of designated CTPs and material non-CTPs (cloud
hyperscalers, payment networks, BaaS providers); a four-dimension materiality scoring framework (IBS
dependency, substitution difficulty, recovery time impact, concentration risk contribution); Nth-party
(sub-contractor) dependency framing; concentration risk analysis across geographic, vendor, and
functional dimensions; and a resilience testing plan including exit and substitution drills. The
designated CTP list is still maturing — verify via the HMT publication page before reliance.
Doc-type code: **FSCTP**. Principal citations: FCA PS24/16; FSMA 2023; FCA 2024/41 CTP Sourcebook
instrument; HMT designation approach document (March 2024).

---

## Recipe

The overlay ships with the `uk-fs-payments` recipe, which orchestrates 11 build targets across
baseline and overlay commands in a structured wave sequence:

- **Wave 1 (foundation)**: PRIN, STKE
- **Wave 2 (requirements + risk)**: REQ, RISK
- **Wave 3 (payments overlay — parallel where possible)**: FSSCA, FSSAFE, FSCD, FSCTP
- **Wave 4 (cross-cutting)**: DPIA, ADR, traceability

To run:

```bash
# In a Claude Code session with the ArcKit plugin and UK Finance overlay enabled:
/arckit:build <project-name> --recipe uk-fs-payments --plan   # wave-plan dry run
/arckit:build <project-name> --recipe uk-fs-payments          # full build
```

The recipe is defined in `plugins/arckit-uk-finance/recipes/uk-fs-payments.yaml`.

---

## Doc-type Codes

| Code | Artefact name | Severity |
|------|---------------|----------|
| FSSCA | SCA-RTS Exemption Design | Standard |
| FSSAFE | Safeguarding Assessment | CRITICAL |
| FSCD | Consumer Duty Board Report | Standard |
| FSCTP | CTP Dependency Assessment | Standard |

FSSAFE carries CRITICAL severity because safeguarding failures have led to firm collapse and FCA
enforcement action — Allied Wallet (2021) and Premier FX (2018) are the documented enforcement
cases. The CRITICAL marker signals that the artefact requires elevated sign-off and more frequent
review than standard compliance artefacts.

---

## v2 Candidates

The following commands were designed during the v1 scoping exercise but deferred to a future
version to keep the v1 surface area focused:

- **uk-fs-payments-or** — operational resilience important business services (IBS) mapping and
  impact tolerance setting under the FCA/PRA operational resilience framework (effective March 2022).
  Complements uk-fs-ctp-dependency; deferred because the two overlap significantly and the CTP
  dependency is the more immediate FCA focus for most PSPs/EMIs.
- **uk-fs-app-fraud** — APP fraud reimbursement obligations under the PSR's mandatory reimbursement
  policy (effective October 2024) and Confirmation of Payee (CoP) scheme rules. A high-priority v2
  candidate given the PSR's active supervisory focus.
- **uk-fs-aml-reg18** — MLR 2017 firm-wide risk assessment under Regulation 18. Addresses the MLRO
  and AML-angle that the current commands touch only at their periphery.
- **uk-fs-dora-mapping** — DORA mapping for UK firms with EU operations subject to the EU Digital
  Operational Resilience Act. Relevant for firms with EU-regulated entities that need to align their
  CTP dependency assessment with DORA's ICT third-party risk requirements.
- **Open Banking conformance commands** (TPP-focused) — API conformance testing evidence, Directory
  enrolment artefacts, FAPI 1.0 Advanced profile mapping. Candidate for a separate `arckit-uk-open-banking`
  overlay rather than inclusion in the payments overlay.

---

## Status

EXPERIMENTAL. This overlay has not been validated against a live FCA supervisory review or
skilled-person (s166) engagement. The regulatory anchors are verified at the time of authoring;
re-verify before production reliance. Quarterly review cadence is the target once a domain
co-maintainer is in place.

**Help wanted — domain co-maintainer.** The overlay is seeking a UK payments / e-money SME
co-maintainer. Relevant backgrounds include FCA-authorised payments firm compliance leads, payment
services solicitors, Big Four FS regulatory advisers, and architects with direct FCA supervisory
engagement experience. If you are interested, [open an issue](https://github.com/tractorjuice/arc-kit/issues)
with the label `co-maintainer: uk-finance` or DM [@tractorjuice](https://github.com/tractorjuice).

Co-maintainer recruitment is a precondition for re-evaluating the overlay for official-baseline
promotion.

---

## References

The following URLs are the principal regulatory sources used across the overlay's commands. All were
verified as live at the time the commands were authored.

- [Payment Services Regulations 2017 (SI 2017/752)](https://www.legislation.gov.uk/uksi/2017/752)
- [Electronic Money Regulations 2011 (SI 2011/99)](https://www.legislation.gov.uk/uksi/2011/99)
- [Payment Services and Electronic Money — Our Approach (FCA, current edition)](https://www.fca.org.uk/publication/finalised-guidance/payment-services-electronic-money-approach.pdf)
- [FCA EMI and Payment Institutions — key publications](https://www.fca.org.uk/firms/emi-payment-institutions-key-publications)
- [FCA PS21/19 — SCA-RTS changes (Article 10A)](https://www.fca.org.uk/publications/policy-statements/ps21-19-changes-sca-rts-and-guidance-approach-document-and-perimeter-guidance-manual)
- [FCA PS24/9 — Safeguarding reforms](https://www.fca.org.uk/publication/policy/ps24-9.pdf)
- [FCA PS22/9 — A new Consumer Duty](https://www.fca.org.uk/publications/policy-statements/ps22-9-new-consumer-duty)
- [FCA FG22/5 — Guidance for firms on the Consumer Duty (PDF)](https://www.fca.org.uk/publication/finalised-guidance/fg22-5.pdf)
- [FCA PS24/16 — Operational resilience: Critical third parties](https://www.fca.org.uk/publications/policy-statements/ps24-16-operational-resilience-critical-third-parties-uk-financial-sector)
- [Financial Services and Markets Act 2023](https://www.legislation.gov.uk/ukpga/2023/29)
- [HM Treasury — Critical Third Parties: HMT's approach to designation (March 2024)](https://www.gov.uk/government/publications/critical-third-parties-hm-treasurys-approach-to-designation)
- [FCA CTP Sourcebook instrument (FCA 2024/41)](https://www.handbook.fca.org.uk/instrument/2024/FCA_2024_41.pdf)
- [FCA Strong Customer Authentication — firms guidance](https://www.fca.org.uk/firms/strong-customer-authentication)
- [FCA Consumer Duty board reports: good practice and areas for improvement (December 2024, updated March 2026)](https://www.fca.org.uk/publications/good-and-poor-practice/consumer-duty-board-reports-good-practice-areas-improvement)
- [FCA SUP 16 — Reporting requirements (entry point for Annex 34A/34B)](https://www.handbook.fca.org.uk/handbook/SUP/16/)
