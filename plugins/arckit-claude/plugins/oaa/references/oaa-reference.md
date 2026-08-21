# O-AA Standard (C208) Reference

Open Agile Architecture (O-AA) C208 is the standard for agile enterprise architecture, providing sprint-based, product-driven architecture delivery methods. This reference summarizes the chapters relevant to ArcKit O-AA commands.

## Axioms and Principles

O-AA is built on 16 axioms that define agile architecture practice. Key axioms for ArcKit:

- **Axiom 1–10**: Foundation principles covering scope, stakeholders, requirements, and the ADM cycle mapping (covered by `oaa-adm-lite`)

- **Axiom 11**: Agile Architecture — architecture must adapt to changing business needs through iterative, sprint-driven delivery

- **Axiom 11–12**: Product Architecture — architecture is organized around product domains, not technical layers

- **Axiom 15**: Security — security is embedded in every sprint, not gated at phase boundaries

- **Axiom 16**: Governance — governance operates at sprint velocity with lightweight evidence collection

## Chapter 10 — Strategy

Covers dual transformation strategy for enterprise architecture:

- **Legacy Modernization Track**: Incremental evolution of existing architecture through sprint-based improvements

- **Greenfield Innovation Track**: New architecture built from scratch for new capabilities

- **Strategy Canvas**: Visual mapping of current state, target state, and transformation path

- **Portfolio Alignment**: Architecture investments mapped to business outcomes and strategic priorities

Used by: `agile-strategy` command (OASTR doc type)

## Chapter 12 — Product Architecture

Defines product-centric architecture approach:

- **Product Mission**: Clear outcome definition and value proposition

- **Cross-Functional Teams**: Roles and responsibilities organized around product domains

- **Backlog-Driven Delivery**: Architecture components derived from product backlog items

- **Value Stream Mapping**: End-to-end flow from stakeholder need to delivered value

- **Product vs System View**: Distinguishing product-centric (outcome-focused) from system-centric (component-focused) architecture

Used by: `product-architecture` command (OAPR doc type)

## Chapter 17 — Security

Embeds security into agile architecture delivery:

- **Security Backlog**: Security requirements treated as backlog items, prioritized alongside features

- **Threat Modeling Per Sprint**: Each sprint includes threat modeling for the features being delivered

- **Continuous Compliance**: Compliance evidence collected continuously, not at gate reviews

- **Security Controls Assessment**: Controls assessed in continuous model rather than phase-gate checkpoints

- **Residual Risk Documentation**: Documenting remaining risk after sprint-level mitigations

Used by: `agile-security` command (OASEC doc type)

## Chapter 18 — Governance

Lightweight governance aligned to sprint cycles:

- **Sprint-Aligned Governance**: Review gates per sprint or release, not quarterly architecture boards

- **Minimal Artefacts**: Maximum 2 governance artefacts per sprint cycle

- **Lightweight Compliance Evidence**: Streamlined evidence collection that doesn't slow delivery

- **Change Management at Sprint Velocity**: Architecture change requests processed within sprint cadence

- **Architecture Review Gates**: Lightweight reviews embedded in sprint ceremonies

Used by: `agile-governance` command (OAGOV doc type)

## ADM Lite Mapping (Chapters 1–9)

Maps the traditional TOGAF ADM cycle to agile sprint delivery:

- **Sprint Windows**: 2–4 week engagement windows per ADM phase

- **Backlog-Driven ADM**: Each ADM phase broken into user stories and backlog items

- **Sprint Review Outputs**: Architecture artefacts produced and reviewed each sprint

- **Stakeholder Cadence**: Engagement rhythms aligned to sprint cycles

Used by: `oaa-adm-lite` command (OAAL doc type)

## Official Source

Open Agile Architecture: https://openagilearchitecture.com
