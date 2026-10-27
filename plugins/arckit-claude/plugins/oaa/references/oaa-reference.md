# O-AA Standard, Version 2.0 (C262) Reference

Open Agile Architecture (O-AA) is The Open Group's standard for agile enterprise architecture. This overlay cites the **Open Agile Architecture™ Standard, Version 2.0** (The Open Group document **C262**, published April 2026), which supersedes **C208** (published 2020, re-issued October 2022 with Technical Corrigendum U221). Version 2.0 is organized in four parts — **Part 1: The Agile Way of Thinking** (Ch. 3), **Part 2: The Agile Enterprise** (Ch. 4–7), **Part 3: The Agile Architecture Capability** (Ch. 8–15) and **Part 4: The Ways of Supporting** (Ch. 16–21) — with the axioms in **Appendix A**. This reference summarizes the chapters relevant to ArcKit O-AA commands; chapter numbers follow the Version 2.0 table of contents, and the topic summaries below describe how ArcKit applies each area.

## Where Topics Moved from C208

| Topic | C208 (superseded) | Version 2.0 (C262) |
|---|---|---|
| A Dual Transformation | Ch. 3 | Ch. 3 |
| Agile Strategy | Ch. 11 | Ch. 5 |
| Agile Governance | Ch. 8 | Ch. 7 |
| Product Architecture | Ch. 14 | Ch. 12 |
| Axioms for the Practice of Agile Architecture | Ch. 9 | Appendix A |
| Security | Axiom 16; §21.4.1 | Axiom 16; §14.6.1 |

The 16 axioms keep their numbers and names in Version 2.0.

## The 16 Axioms (Appendix A, "Axioms for the Practice of Agile Architecture")

The O-AA Standard is built on **16 published axioms**. ArcKit commands cite axioms by published number and name; derivation notes live in the generated artefacts (axiom wording is published only in the standard itself, behind an Open Group sign-in — see Official Source).

| # | Axiom | Applied by |
|---|---|---|
| 1 | Customer Experience Focus | `oaa-adm-lite`, `agile-strategy` |
| 2 | Outside-In Thinking | — |
| 3 | Rapid Feedback Loops | `oaa-adm-lite` |
| 4 | Touchpoint Orchestration | — |
| 5 | Value Stream Alignment | `oaa-adm-lite`, `agile-strategy` |
| 6 | Autonomous Cross-Functional Teams | `oaa-adm-lite`, `product-architecture`, `agile-strategy` |
| 7 | Authority, Responsibility, and Accountability Distribution | `oaa-adm-lite`, `agile-governance` |
| 8 | Loosely-Coupled Systems | — |
| 9 | Modular Data Platform | — |
| 10 | Simple Common Operating Principles | `oaa-adm-lite` |
| 11 | Partitioning Over Layering | — |
| 12 | Organization Mirroring Architecture | — |
| 13 | Organizational Leveling | — |
| 14 | Bias for Change | `oaa-adm-lite`, `agile-strategy` |
| 15 | Project to Product Shift | `oaa-adm-lite`, `product-architecture`, `agile-strategy` |
| 16 | Secure by Design | `agile-security` |

## Ch. 5 — Agile Strategy

Version 2.0 takes **dual transformation** — the Digital Transformation of the enterprise together with its Agile Transformation — as its starting point (Preface; Part 1, Ch. 3 "A Dual Transformation"). "Dual transformation" in O-AA means these two, run together — not a legacy track and an innovation track.

Ch. 5 frames agile strategy through six tenets (cite by title; do not quote text that cannot be checked against the standard):

- Situational Awareness
- Frame Strategy Around "Hard-to-Reverse" Choices
- Managing Strategy Implementation
- Strategy is a Journey
- Balance Stability and Dynamism
- Do Not Deploy Strategy in Silos

It also covers bending the law of unintended consequences (§5.2) and succeeding at strategy deployment (§5.3).

How ArcKit applies it: the agile strategy canvas has a **digital dimension** (technology, product, operating model — legacy modernization sits in technology) and an **agile dimension** (organizational, cultural, team agility), plus axiom-based design principles, resilience mapping, transformation waves and a strategy-to-backlog mapping. The canvas format is an ArcKit convention.

Used by: `agile-strategy` command (OASTR doc type). Related content: Ch. 3 (A Dual Transformation) and Axiom 12.

## Ch. 12 — Product Architecture

Ch. 12 covers defining product architecture, interdependence and modularity, the modularity-integrality trade-off, and product platforms.

How ArcKit applies it:

- **Product Mission**: Clear outcome definition and value proposition

- **Cross-Functional Teams**: Roles and responsibilities organized around product domains

- **Backlog-Driven Delivery**: Architecture components derived from product backlog items

- **Value Stream Mapping**: End-to-end flow from stakeholder need to delivered value

- **Product vs System View**: Distinguishing product-centric (outcome-focused) from system-centric (component-focused) architecture

Used by: `product-architecture` command (OAPR doc type). Related content: Axioms 6 and 15.

## Security by Design — Axiom 16, §14.6.1, and the O-AA Security Playbook (G216)

The standard has no dedicated security chapter: security is carried by **Axiom 16 (Secure by Design)** in Appendix A, **§14.6.1 "Security"** (one of the non-functional software requirements in Ch. 14, Software Architecture), and the companion **O-AA Security Playbook (G216)**.

How ArcKit applies it:

- **Security Backlog**: Security requirements treated as backlog items, prioritized alongside features

- **Threat Modeling Per Sprint**: Each sprint includes threat modeling for the features being delivered

- **Continuous Compliance**: Compliance evidence collected continuously, not at gate reviews

- **Security Controls Assessment**: Controls assessed in continuous model rather than phase-gate checkpoints

- **Residual Risk Documentation**: Documenting remaining risk after sprint-level mitigations

Used by: `agile-security` command (OASEC doc type)

## Ch. 7 — Agile Governance

Ch. 7 covers classical IT governance, governance in the face of Agile, hybrid delivery styles, agile governance, and what can lead to IT governance failures.

How ArcKit applies it — lightweight governance aligned to sprint cycles:

- **Sprint-Aligned Governance**: Review gates per sprint or release, not quarterly architecture boards

- **Minimal Artefacts**: Maximum 2 governance artefacts per sprint cycle

- **Lightweight Compliance Evidence**: Streamlined evidence collection that doesn't slow delivery

- **Change Management at Sprint Velocity**: Architecture change requests processed within sprint cadence

- **Architecture Review Gates**: Lightweight reviews embedded in sprint ceremonies

Used by: `agile-governance` command (OAGOV doc type). Related content: Axiom 7.

## ADM Lite Sprint Mapping (ArcKit convention over TOGAF ADM, 10th Edition, C220)

The O-AA standard does **not** define an ADM cycle. The `oaa-adm-lite` command's sprint map (Sprint 0–4+ ↔ ADM-P…H) is an ArcKit convention that maps **TOGAF ADM phases (The TOGAF Standard, 10th Edition, C220)** onto agile sprints, drawing its agile-architecture substance from Version 2.0 Part 3 (Ch. 8 Architecture Development, Ch. 10 Intentional Architecture, Ch. 11 Continuous Architectural Refactoring) and the 16 axioms of Appendix A:

- **Sprint Windows**: one sprint (1–2 weeks) per pair of ADM phases, except Sprint 2, which takes Phase D (Technology Architecture) alone because Sprint 1 covers both parts of Phase C (Data and Application Architecture); Sprint 0 to Sprint 3 fit a 4–8 week engagement window

- **Backlog-Driven ADM**: Each ADM phase broken into user stories and backlog items

- **Sprint Review Outputs**: Architecture artefacts produced and reviewed each sprint

- **Stakeholder Cadence**: Engagement rhythms aligned to sprint cycles

Used by: `oaa-adm-lite` command (OAAL doc type)

## Official Source

- Open Agile Architecture™ Standard, Version 2.0 (C262, April 2026) — publication page: https://publications.opengroup.org/c262 (HTML and PDF editions behind Open Group sign-in). It supersedes C208: https://publications.opengroup.org/c208

- O-AA Security Playbook (G216) — https://publications.opengroup.org/guides/agile-architecture-guides/g216

- The Agile Enterprise Architect Playbook (G226) — The Open Group publications catalogue
