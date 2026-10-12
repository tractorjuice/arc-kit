# Business Capability Map Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:business-capability-map` creates the business architecture baseline for TOGAF ADM Phase A. It maps capability hierarchy, value streams, capability maturity, heatmaps, and requirement or principle traceability.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | Mandatory scope, vision, drivers, constraints |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Business and functional requirements to map to capabilities |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | Value expectations, owners, outcomes, pain points |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Business architecture guardrails |
| Application inventory (`ARC-<id>-APP-v1.0.md`) | Optional current application support for each capability |

---

## Command

```bash
/arckit:business-capability-map <project ID or capability scope>
```

Output: `projects/<id>/ARC-<id>-BPCM-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Capability Hierarchy | Level 1 to Level 3 capability model |
| Value Streams | How capabilities support end-to-end value delivery |
| Maturity Assessment | Current and target maturity for each capability |
| Capability Heatmap | Visual prioritisation by maturity, value, or risk |
| Requirement Traceability | Requirement-to-capability mapping |
| Principle Alignment | Capability design alignment to architecture principles |
| Traceability | Source artefacts and downstream handoffs |

---

## Workflow

1. Run `/arckit:adm-preliminary` to define the scope and vision.
2. Run `/arckit:business-capability-map` to build the business capability baseline.
3. Use `/arckit:application-inventory` to map applications to capabilities.
4. Use `/arckit:gap-analysis` to identify weak or missing capability support.

---

## Review Checklist

- Capabilities are named as stable business abilities, not projects or systems.
- Capability levels are consistent and do not mix process steps with outcomes.
- Each critical capability has an owner, current maturity, and target maturity.
- High-value or high-risk capabilities are visible in the heatmap.
- Requirements and principles are traceable to capability decisions.

---

## Related Commands

- `/arckit:application-inventory` - Attach applications to capabilities.
- `/arckit:gap-analysis` - Prioritise capability gaps.
- `/arckit:transition-architecture` - Turn capability gaps into work packages.
