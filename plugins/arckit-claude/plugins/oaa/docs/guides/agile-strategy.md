# O-AA Agile Strategy Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit-oaa:agile-strategy` creates an Agile Strategy Canvas using Open Agile Architecture (O-AA, C208) Ch. 11, Agile Strategy. It plans a dual transformation: legacy modernisation (defend) and greenfield innovation (attack) run in parallel with shared backlogs. The strategy is condensed into a 1-2 page canvas whose items enter the product backlog as epics and features, and success is measured by product outcomes rather than project milestones. The canvas is a living document, updated each sprint cycle. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The client is pursuing dual transformation: legacy modernisation and greenfield innovation at the same time | The transformation is purely defensive with no innovation component (use `/arckit-togaf-adm:transition-architecture`) |
| Strategy needs to be backlog-driven, not a static document | The client requires a traditional multi-year strategic plan with 200+ page deliverables |
| Strategy should map to product outcomes, not project deliverables | The scope is a single product (use `/arckit-oaa:product-architecture`) |
| A 1-2 page canvas is preferred over a 50+ page strategic plan | |
| Transformation waves must be sequenced while legacy systems stay operational | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Strategic principles, technology direction, investment priorities. If missing, the command warns you to run `/arckit:principles` first |
| O-AA ADM Lite (`ARC-<id>-OAAL-v*.md`) | Recommended. Sprint plan, vision, scope, success criteria |
| Agile product architecture (`ARC-<id>-OAPR-v*.md`) | Recommended. Product mission, outcomes, guardrails |
| Transition architecture (`ARC-<id>-TRANS-v*.md`) | Recommended. Legacy systems, migration constraints, transition waves |
| Business capability map (`ARC-<id>-BPCM-v*.md`) | Recommended. Current capabilities, target capabilities, gap areas |
| Project external documents (`projects/<id>/external/`) | Read if present. Strategic plans, transformation charters, business cases, investment proposals |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Technology refresh policies, innovation frameworks, dual transformation methods |

---

## Command

```bash
/arckit-oaa:agile-strategy <product or programme name>
```

Output: `projects/<id>/ARC-<id>-OASTR-v1.0.md`

If the named project does not exist, the command creates it. If an OASTR document already exists, it writes a new version (v2.0) instead of overwriting. The structured version of the canvas is `strategy-canvas.yaml`.

---

## Dual Transformation

| Element | What the document sets out |
|---------|----------------------------|
| Defend track | Legacy inventory with modernisation priority (keep, modify, replace, retire), legacy dependency risks, minimal viable modernisation per sprint |
| Attack track | New product capabilities with outcome targets, innovation backlog items, experimentation framework with fast-failure thresholds |
| Strategy canvas | Customer segments, value proposition, channels, revenue or impact model, key activities, key resources, key partnerships, cost structure |
| Sequencing | Wave 1 quick wins, Wave 2 core capability modernisation, Wave 3 platform foundations, plus dependencies between the two tracks |
| Strategy-to-backlog mapping | Epics, features and stories with architecture guardrails per epic and O-AA axiom compliance per feature |

The command anchors the strategy on Axiom 5 (Value Stream Alignment), so strategy and architecture stay in one system.

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| Trigger Guidance | When to use the canvas and which template to use instead |
| Canvas Overview | Digital and agile transformation dimensions forming a 2x3 matrix |
| Section 1: Digital Transformation Dimension | Technology, product and operating model change: current and target state, migration approach, capability gaps, platform strategy |
| Section 2: Agile Transformation Dimension | Organisational, cultural and team agility: decision framework, governance model, change initiatives, flow metrics |
| Section 3: Axiom-Based Design Principles | Principles traced to published O-AA axioms, with rationale, implications and exceptions |
| Section 4: Resilience Mapping | Threats, impact, mitigation and recovery targets (RTO, RPO) per transformation dimension |
| Section 5: Transformation Wave Plan | Waves with digital and agile activities, resilience milestones, governance gates |
| YAML Structure | The structured canvas artefact |
| O-AA Axiom Reference | Axioms applied in the canvas |
| Cross-References | Related O-AA and TOGAF templates |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- Both tracks are described, or one is ruled out with a reason.
- The tracks run in parallel, not one after the other.
- Each strategic bet states the outcome it buys and the measure that would show it worked.
- Every product is mapped to a track.
- Funding and team-topology implications are stated.
- Each axiom is cited by published number and name and justifies a specific choice.

---

## Next Steps

- `/arckit-oaa:agile-security` - Embed security into the dual transformation strategy.
- `/arckit-oaa:agile-governance` - Establish governance cadence for the transformation programme.
