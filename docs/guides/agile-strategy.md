# O-AA Agile Strategy Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agile-strategy` creates an Agile Strategy Canvas using Open Agile Architecture (O-AA, C208) Ch. 11, Agile Strategy. It plans the dual transformation C208 is written for: the digital transformation of the enterprise (technology, product, operating model) together with its agile transformation (organisational, cultural and team agility). Legacy modernisation sits inside the technology part of the digital dimension. The strategy is condensed into a canvas whose epics enter the product backlog, and success is measured by outcomes rather than project milestones. The canvas is a living document, updated each sprint cycle. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The client is pursuing a dual transformation: digital and agile transformation at the same time | The work is a technology migration with no product, operating-model or organisational change (use `/arckit:transition-architecture`) |
| Strategy needs to be backlog-driven, not a static document | The client requires a traditional multi-year strategic plan with 200+ page deliverables |
| Strategy should map to product outcomes, not project deliverables | The scope is a single product (use `/arckit:product-architecture`) |
| A 1-2 page canvas is preferred over a 50+ page strategic plan | |
| Transformation waves must be sequenced while legacy systems stay operational | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Strategic principles, technology direction, investment priorities. If missing, the command warns you to run `/arckit:principles` first |
| Stakeholder analysis (`ARC-<id>-STKE-v*.md`) | Recommended. Stakeholder drivers, goals and measures the strategy must serve |
| Requirements (`ARC-<id>-REQ-v*.md`) | Recommended. Business requirements and the drivers behind them |
| O-AA ADM Lite (`ARC-<id>-OAAL-v*.md`) | Recommended. Sprint plan, vision, scope, success criteria |
| Agile product architecture (`ARC-<id>-OAPR-v*.md`) | Recommended. Product mission, outcomes, guardrails |
| Transition architecture (`ARC-<id>-TRANS-v*.md`) | Recommended. Legacy systems, migration constraints, transition waves |
| Business capability map (`ARC-<id>-BPCM-v*.md`) | Recommended. Current capabilities, target capabilities, gap areas |
| Project external documents (`projects/<id>/external/`) | Read if present. Strategic plans, transformation charters, business cases, investment proposals |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Technology refresh policies, innovation frameworks, dual transformation methods |

---

## Command

```bash
/arckit:agile-strategy <product or programme name>
```

Output: `projects/<id>/ARC-<id>-OASTR-v1.0.md`

If the named project does not exist, the command creates it. If an OASTR document already exists, it writes a new version (v2.0) instead of overwriting. The structured version of the canvas is `strategy-canvas.yaml`.

---

## Dual Transformation

| Element | What the document sets out |
|---------|----------------------------|
| Digital transformation | Technology (current and target state, migration approach, legacy systems with a keep, modify, replace or retire decision), product (project-based to permanent product teams, outcomes, value streams), operating model (capability gaps, platform strategy, funding model) |
| Agile transformation | Organisational agility (decision rights by level), cultural agility (change initiatives, success indicators), team agility (team topology, practices, flow metrics) |
| Design principles and resilience | Principles traced to published O-AA axioms; resilience targets per threat and dimension |
| Wave plan | Waves combining digital and agile activities, each with the outcome it buys, its success measures, resilience milestones and governance gates |
| Strategy-to-backlog mapping | Epics, features and stories with architecture guardrails per epic, O-AA axiom per feature, and a trace to stakeholder goals or business requirements |

The command anchors the strategy on Axiom 5 (Value Stream Alignment), so strategy and architecture stay in one system. It uses C208's agile strategy tenets, cited by title, to test the canvas's choices.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| Trigger Guidance | When to use the canvas and which template to use instead |
| Canvas Overview | Digital and agile transformation dimensions forming a 2x3 matrix |
| Section 1: Digital Transformation Dimension | Technology, product and operating model change: current and target state, migration approach, capability gaps, platform strategy, funding model |
| Section 2: Agile Transformation Dimension | Organisational, cultural and team agility: decision framework, governance model, change initiatives, flow metrics |
| Section 3: Axiom-Based Design Principles | Principles traced to published O-AA axioms, with rationale, implications and exceptions |
| Section 4: Resilience Mapping | Threats, impact, mitigation and recovery targets (RTO, RPO) per transformation dimension |
| Section 5: Transformation Wave Plan | Waves with outcome, success measures, digital and agile activities, resilience milestones, governance gates |
| Section 6: Strategy-to-Backlog Mapping | Epics with their wave, trace to stakeholder goals or requirements, features, guardrails and axiom |
| YAML Structure | The structured canvas artefact, `strategy-canvas.yaml` |
| O-AA Axiom Reference | Axioms applied in the canvas |
| Cross-References | Related O-AA and TOGAF templates |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- Both dimensions are described: digital (technology, product, operating model) and agile (organisational, cultural, team agility), or an area is ruled out with a reason.
- The two dimensions are planned together in each wave, not one after the other.
- Each product outcome and wave states the outcome it buys and the measure that would show it worked.
- Every value stream is mapped to a product team and a wave.
- Funding and team-topology implications are stated.
- Each axiom is cited by published number and name and justifies a specific choice.
- The strategy traces to stakeholder goals and business requirements where those artefacts exist.

---

## Next Steps

- `/arckit:agile-security` - Embed security into the dual transformation strategy.
- `/arckit:agile-governance` - Establish governance cadence for the transformation programme.
