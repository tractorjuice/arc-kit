# Changelog — arckit-uk-teal

All notable changes to the `arckit-uk-teal` plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [5.9.2] - 2026-06-03

### Added

Initial release of `arckit-uk-teal` — UK Government **Teal Book** project-delivery overlay, aligned to [The Teal Book](https://projectdelivery.gov.uk/teal-book/home/) (NISTA / Government Project Delivery) and the [GovS 002 Project Delivery Functional Standard](https://www.gov.uk/government/publications/project-delivery-functional-standard). The Teal Book is the "how" companion to the "what" of GovS 002 and sits alongside HM Treasury's Green Book; ArcKit core already covers the Green Book business case (`/arckit:sobc`), the GDS delivery plan (`/arckit:plan`), and the Orange Book risk register (`/arckit:risk`), so this overlay adds the Teal-specific delivery-governance artefacts core does not.

**3 community-overlay commands:**

- `uk-teal-ciaf` — GovS 002 **Continuous Improvement Assessment Framework (CIAF)** capability self-assessment across the project-delivery themes on a four-stage maturity scale, with prioritised improvement actions (doc-type `TEALCIAF`).
- `uk-teal-tailoring` — **Delivery Management Approach** tailoring the Teal Book practices (Part B / Chapter 9) to a portfolio/programme/project's size, complexity, risk and setting, mapped to the mandatory requirements of GovS 002 (doc-type `TEALDMA`).
- `uk-teal-assurance` — **Integrated Assurance and Approval Plan (IAAP)** with IPA/NISTA gateway-review readiness, mapping business-case approval points to a coordinated, proportionate assurance schedule across the three lines of defence (doc-type `TEALIAAP`).

**Recipe:** `uk-teal-delivery` (composes with the UK SaaS / UK Government baseline — Teal Book delivery governance layered on top of the Green Book business case, GDS plan, and Orange Book risk register).

**3 doc-type codes** registered in `arckit-claude/config/doc-types.mjs` (core): `TEALCIAF`, `TEALDMA`, `TEALIAAP` (all `regime: UK`).

**Core command cross-references:** `/arckit:sobc`, `/arckit:plan`, `/arckit:risk`, `/arckit:roadmap`, `/arckit:conformance`, and `/arckit:maturity-model` gain Teal Book / GovS 002 anchors and handoffs so the core delivery artefacts and this overlay reference each other coherently.

**Status:** Community-contributed, **EXPERIMENTAL**. The Teal Book V1 is published for a trial period running to **31 December 2026** — verify guidance against the live source before reliance. Output is not assurance, commercial, or regulatory advice and does not constitute an IPA/NISTA assurance review; tailoring and assurance decisions must be agreed with the SRO and the organisation's Project Delivery / assurance function.
