# O-AA Product Architecture Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:product-architecture` creates an Agile Product Architecture document using Open Agile Architecture (O-AA, C208) Ch. 14, Product Architecture. The product is the organising principle for the team, the backlog and the architecture. The document sets the product mission, outcomes and boundary, the permanent cross-functional team, architecture items in the product backlog with requirements coverage, architecture guardrails, a C4 component diagram with the product's interfaces and dependencies, the release roadmap, value streams and the compliance controls carried by each feature. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The architecture work targets a specific product, not enterprise-wide transformation | Enterprise-wide architecture is needed (use `/arckit:adm-preliminary`) |
| The client wants product-centric architecture with clear outcomes and ownership | The work is multi-product portfolio rationalisation (use `/arckit:application-rationalization`) |
| Teams need to be cross-functional and permanent, not temporary project teams | The client requires traditional TOGAF documentation with a full ADM audit trail |
| Delivery is backlog-driven with continuous architecture evolution | |
| The product needs design principles based on the O-AA axioms | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Product architecture principles, technology standards, compliance requirements. If missing, the command warns you to run `/arckit:principles` first |
| O-AA ADM Lite (`ARC-<id>-OAAL-v*.md`) | Recommended. Sprint plan, vision, scope, success criteria |
| Business capability map (`ARC-<id>-BPCM-v*.md`) | Recommended. Product capabilities, value streams, capability ownership |
| Requirements (`ARC-<id>-REQ-v*.md`) | Recommended. Functional and non-functional requirements to place inside or outside the product boundary |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | Recommended. Stakeholder goals and measures that the product outcomes serve |
| Project external documents (`projects/<id>/external/`) | Read if present. Product definitions, product roadmaps, team charters |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Product architecture standards, team composition guidelines |

---

## Command

```bash
/arckit:product-architecture <product name>
```

Output: `projects/<id>/ARC-<id>-OAPR-v1.0.md`

If the named project does not exist, the command creates it. If an OAPR document already exists, it writes a new version (v2.0) instead of overwriting.

---

## Product Architecture Principles

| Principle | Meaning |
|-----------|---------|
| Product-centric | The product, not the project, capability or service, organises the team, backlog and architecture (Axiom 15, Project to Product Shift) |
| Outcome-driven | Architecture decisions trace to measurable product outcomes: value, adoption, experience |
| Team-led | Permanent cross-functional teams own the product end to end (Axiom 6, Autonomous Cross-Functional Teams) |
| Backlog-driven | Architecture evolves through the product backlog, not a separate architecture workstream |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| 1. Product Mission and Outcome | One-sentence mission, outcome targets (value, outcome, experience, adoption), product principles derived from O-AA axioms, product boundary, outcomes traced to stakeholder goals |
| 2. Cross-Functional Team Composition | Roles (Product Owner, Architect, Lead Engineer, AI Safety Engineer, DevOps, QA), cadence, and the embedded architect's responsibilities |
| 3. Product Backlog with Architecture Items | Architecture items as first-class backlog entries with acceptance criteria, compliance mapping, story points, risk and linked ADRs; item types; requirements coverage |
| 4. Architecture Guardrails | Non-negotiable constraints, technology standards and approved building blocks, anti-patterns |
| 5. Product Architecture Diagram | Mermaid C4 component view; interfaces as contracts with owners, dependencies with coupling type |
| 6. Release Architecture Roadmap | Releases with architecture scope and compliance milestones; release gate criteria |
| 7. Value Stream Mapping | Delivery and runtime value streams, touch, wait and lead times, value stream metrics |
| 8. Embedded Compliance Per Feature | Regulations and controls, feature compliance matrix, compliance gaps, compliance-as-code integration points |
| 9. Template Usage Guide | When to use the template and how its elements map to TOGAF ADM phases |
| 10. Worked Sample | Combined `product-architecture.yaml` sample |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- The product boundary is defined before the internal structure: what the product is and is not.
- Team composition is permanent and cross-functional, with architecture ownership named.
- Architecture decisions map to backlog items, not phase gates, and ADRs link to those items.
- Decomposition is by product, not by capability or service layer.
- Interfaces between products are contracts with owners; dependencies are listed with their coupling type.
- Guardrails list non-negotiable constraints, approved building blocks and forbidden approaches.
- A Mermaid C4 component diagram shows product components, integration points, data flow and API boundaries.
- Every requirement lands in a backlog item or is recorded as out of scope.

---

## Next Steps

- `/arckit:agile-strategy` - Plan dual transformation for the product.
- `/arckit:agile-security` - Embed security into the product sprint rhythm.
