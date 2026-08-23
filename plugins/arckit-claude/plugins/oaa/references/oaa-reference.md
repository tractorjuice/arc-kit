# O-AA Standard (C208) Reference

Open Agile Architecture (O-AA) C208 is The Open Group's standard for agile enterprise architecture, published as **C208** ("Open Agile Architecture Standard", **v3.0, October 2022**). It is organized in two parts — **Part 1: The O-AA Core** (Ch. 3–9) and **Part 2: The O-AA Building Blocks** (Ch. 10–22). This reference summarizes the chapters relevant to ArcKit O-AA commands; chapter numbers follow the C208 table of contents, and the topic summaries below describe how ArcKit applies each area.

## The 16 Axioms (C208 Ch. 9, "Axioms for the Practice of Agile Architecture")

The O-AA Standard (C208) is built on **16 published axioms**. ArcKit commands cite axioms by published number and name; derivation notes live in the generated artefacts (axiom wording is published only in the standard itself, behind an Open Group sign-in — see Official Source).

| # | Axiom | Applied by |
|---|---|---|
| 1 | Customer Experience Focus | `oaa-adm-lite` |
| 2 | Outside-In Thinking | — |
| 3 | Rapid Feedback Loops | `oaa-adm-lite` |
| 4 | Touchpoint Orchestration | — |
| 5 | Value Stream Alignment | `oaa-adm-lite`, `agile-strategy` |
| 6 | Autonomous Cross-Functional Teams | `oaa-adm-lite`, `product-architecture` |
| 7 | Authority, Responsibility, and Accountability Distribution | `oaa-adm-lite`, `agile-governance` |
| 8 | Loosely-Coupled Systems | — |
| 9 | Modular Data Platform | — |
| 10 | Simple Common Operating Principles | `oaa-adm-lite` |
| 11 | Partitioning Over Layering | — |
| 12 | Organization Mirroring Architecture | — |
| 13 | Organizational Leveling | — |
| 14 | Bias for Change | — |
| 15 | Project to Product Shift | `oaa-adm-lite`, `product-architecture` |
| 16 | Secure by Design | `agile-security` |

## C208 Ch. 11 — Agile Strategy

Covers dual transformation strategy for enterprise architecture:

- **Legacy Modernization Track**: Incremental evolution of existing architecture through sprint-based improvements

- **Greenfield Innovation Track**: New architecture built from scratch for new capabilities

- **Strategy Canvas**: Visual mapping of current state, target state, and transformation path

- **Portfolio Alignment**: Architecture investments mapped to business outcomes and strategic priorities

Used by: `agile-strategy` command (OASTR doc type). Related C208 content: Ch. 3 (A Dual Transformation) and Axiom 12.

## C208 Ch. 14 — Product Architecture

Defines product-centric architecture approach:

- **Product Mission**: Clear outcome definition and value proposition

- **Cross-Functional Teams**: Roles and responsibilities organized around product domains

- **Backlog-Driven Delivery**: Architecture components derived from product backlog items

- **Value Stream Mapping**: End-to-end flow from stakeholder need to delivered value

- **Product vs System View**: Distinguishing product-centric (outcome-focused) from system-centric (component-focused) architecture

Used by: `product-architecture` command (OAPR doc type). Related C208 content: Axioms 6 and 15.

## Security by Design — C208 Ch. 4.6, Axiom 16, and the O-AA Security Playbook (G216)

C208 has no dedicated security chapter: security is carried by **Ch. 4.6 "Security by Design"**, **Axiom 16 (Secure by Design)**, and the companion **O-AA Security Playbook (G216)**:

- **Security Backlog**: Security requirements treated as backlog items, prioritized alongside features

- **Threat Modeling Per Sprint**: Each sprint includes threat modeling for the features being delivered

- **Continuous Compliance**: Compliance evidence collected continuously, not at gate reviews

- **Security Controls Assessment**: Controls assessed in continuous model rather than phase-gate checkpoints

- **Residual Risk Documentation**: Documenting remaining risk after sprint-level mitigations

Used by: `agile-security` command (OASEC doc type)

## C208 Ch. 8 — Agile Governance

Lightweight governance aligned to sprint cycles:

- **Sprint-Aligned Governance**: Review gates per sprint or release, not quarterly architecture boards

- **Minimal Artefacts**: Maximum 2 governance artefacts per sprint cycle

- **Lightweight Compliance Evidence**: Streamlined evidence collection that doesn't slow delivery

- **Change Management at Sprint Velocity**: Architecture change requests processed within sprint cadence

- **Architecture Review Gates**: Lightweight reviews embedded in sprint ceremonies

Used by: `agile-governance` command (OAGOV doc type). Related C208 content: Axiom 7.

## ADM Lite Sprint Mapping (ArcKit convention over TOGAF ADM, C182)

The O-AA standard does **not** define an ADM cycle. The `oaa-adm-lite` command's sprint map (Sprint 0–4+ ↔ ADM-P…H) is an ArcKit convention that maps **TOGAF ADM phases (C182)** onto agile sprints, drawing its agile-architecture substance from C208 Part 1 (Ch. 3–9, including the 16 axioms of Ch. 9):

- **Sprint Windows**: 2–4 week engagement windows per ADM phase

- **Backlog-Driven ADM**: Each ADM phase broken into user stories and backlog items

- **Sprint Review Outputs**: Architecture artefacts produced and reviewed each sprint

- **Stakeholder Cadence**: Engagement rhythms aligned to sprint cycles

Used by: `oaa-adm-lite` command (OAAL doc type)

## Official Source

- O-AA Standard (C208, v3.0, October 2022) — https://pubs.opengroup.org/architecture/o-aa-standard/ (publication page: https://publications.opengroup.org/c208; full text behind Open Group sign-in)

- O-AA Security Playbook (G216) — https://publications.opengroup.org/guides/agile-architecture-guides/g216

- The Agile Enterprise Architect Playbook (G226) — The Open Group publications catalogue
