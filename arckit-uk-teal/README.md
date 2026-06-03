# ArcKit — UK Government Teal Book Overlay

3 slash commands and the `uk-teal-delivery` build recipe covering UK Government **project-delivery governance** aligned to [The Teal Book](https://projectdelivery.gov.uk/teal-book/home/) (NISTA / Government Project Delivery) and the [GovS 002 Project Delivery Functional Standard](https://www.gov.uk/government/publications/project-delivery-functional-standard):

- `/arckit:uk-teal-ciaf` — GovS 002 **Continuous Improvement Assessment Framework (CIAF)** capability self-assessment across the project-delivery themes on a four-stage maturity scale, with prioritised improvement actions
- `/arckit:uk-teal-tailoring` — **Delivery Management Approach** tailoring the Teal Book practices to a portfolio/programme/project (Teal Book Part B / Chapter 9), mapped to the mandatory requirements of GovS 002
- `/arckit:uk-teal-assurance` — **Integrated Assurance and Approval Plan (IAAP)** with IPA/NISTA gateway-review readiness, mapping business-case approval points to a proportionate, joined-up assurance schedule

Recipe: `uk-teal-delivery` (Teal Book delivery governance layered on the UK Government baseline).

## What the Teal Book is

The Teal Book is the UK Government's definitive guide to **portfolio, programme and project delivery**, launched in April 2025 by **NISTA** (the National Infrastructure and Service Transformation Authority, the merged National Infrastructure Commission and Infrastructure and Projects Authority) and Government Project Delivery. It is the practical "**how**" companion to the "**what**" of GovS 002, and is designed to be used alongside HM Treasury's Green Book. It is structured into parts spanning Context & guiding principles, Tailoring & Adopting, Managing Portfolios, Managing Programmes & Projects, Planning & Control, and Solution Delivery, and points to the GovS 002 CIAF for organisational capability assessment.

## Requires arckit core plugin

```bash
claude plugin install arckit arckit-uk-teal
```

Without `arckit` (core), recipes won't resolve their foundation commands (`arckit:principles`, `arckit:requirements`, `arckit:sobc`, `arckit:plan`, `arckit:risk`, etc.) and the `validate-arc-filename` hook won't recognise the Teal Book doc-type codes (`TEALCIAF`, `TEALDMA`, `TEALIAAP`).

## How it relates to ArcKit core

The Teal Book is *delivery* governance; ArcKit core is *architecture* governance. This overlay deliberately does **not** duplicate core — it adds the Teal-specific artefacts core lacks and cross-references the rest:

| Teal Book / GovS 002 need | Covered by |
|---|---|
| Business case (Green Book five-case) | core `/arckit:sobc` |
| Delivery plan, phases & gates (GDS) | core `/arckit:plan` |
| Risk register (Orange Book) | core `/arckit:risk` |
| Strategic roadmap | core `/arckit:roadmap` |
| Architecture conformance (technical assurance evidence) | core `/arckit:conformance` |
| Generic capability maturity | core `/arckit:maturity-model` |
| **GovS 002 CIAF capability self-assessment** | **this overlay — `uk-teal-ciaf`** |
| **Tailoring & embedding the Teal Book (Part B / Ch. 9)** | **this overlay — `uk-teal-tailoring`** |
| **Integrated Assurance & Approval Plan + gateway readiness** | **this overlay — `uk-teal-assurance`** |

The six core commands above gain Teal Book / GovS 002 anchors and handoffs so the artefacts reference each other coherently.

## Authoritative anchors

The Teal Book · GovS 002 Project Delivery Functional Standard · GovS 002 Continuous Improvement Assessment Framework (CIAF) · HM Treasury Green Book · IPA/Cabinet Office assurance & approvals (Gateway / Project Assessment Reviews, Integrated Assurance and Approval Plans) · NISTA.

## Statutory / guidance currency

The Teal Book **V1 is published for a trial period running to 31 December 2026** and will roll out in stages over five years — verify guidance against the live source (<https://projectdelivery.gov.uk/teal-book/home/>) before relying on any output. GovS 002 and the CIAF are updated without prior notice.

## Maintainer

`[COMMUNITY]` — **EXPERIMENTAL**. Recruiting a domain co-maintainer. Help wanted: if you are a UK government project-delivery practitioner with deep knowledge of the Teal Book, GovS 002, the CIAF, or IPA/NISTA assurance — open an issue at <https://github.com/tractorjuice/arc-kit/issues> tagged `co-maintainer: uk-teal`. Output from these commands is not assurance, commercial, or regulatory advice and does not constitute an IPA/NISTA assurance review; it MUST be reviewed by the SRO and the organisation's Project Delivery / assurance function before reliance.
