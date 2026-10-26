# TOGAF ADM Preliminary Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:adm-preliminary` creates the Architecture Vision artefact for a TOGAF ADM engagement. Use it to set scope, drivers, constraints, success criteria, stakeholders, and ADM phase boundaries before producing business, application, gap, transition, and governance artefacts.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Global architecture principles (`ARC-000-PRIN-v1.0.md`) | Mandatory decision framework and standards baseline |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | Drivers, goals, conflicts, outcomes, engagement needs |
| Architecture strategy (`ARC-<id>-STRAT-v1.0.md`) | Strategic themes, investment envelope, target direction |
| External vision or mandate documents | Existing transformation charter, EA mandate, business strategy |

---

## Command

```bash
/arckit:adm-preliminary <project ID or transformation scope>
```

Output: `projects/<id>/ARC-<id>-ADMP-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Architecture Vision | Narrative for the transformation or ADM cycle |
| Scope | In-scope and out-of-scope capabilities, systems, and business areas |
| Drivers | Strategic, operational, compliance, and technology drivers |
| Constraints | Budget, timeline, regulatory, technical, and resource constraints |
| Success Criteria | Measurable targets for the ADM engagement |
| Architecture Landscape | High-level Mermaid context diagram |
| Stakeholder Map | Stakeholder interest, influence, and engagement approach |
| ADM Scope | Phase coverage and exclusions |
| Traceability | Links from principles, stakeholders, and strategy into the vision |

---

## Workflow

| Step | Command | Result |
|------|---------|--------|
| 1 | `/arckit:principles` | Establish global architecture guardrails |
| 2 | `/arckit:stakeholders` | Capture business drivers and stakeholder goals |
| 3 | `/arckit:strategy` | Set the strategic direction and investment frame |
| 4 | `/arckit:adm-preliminary` | Define the ADM scope and Architecture Vision |
| 5 | `/arckit:business-capability-map` | Translate the vision into business capabilities |

---

## Review Checklist

- Architecture principles are present and referenced.
- Scope boundaries are explicit enough to prevent uncontrolled expansion.
- At least three drivers and three measurable success criteria are included.
- ADM phases are marked in scope or out of scope with rationale.
- External strategy or mandate sources are cited where used.

---

## Related Commands

- `/arckit:business-capability-map` - Map capabilities within the ADM scope.
- `/arckit:gap-analysis` - Compare current and target architecture states.
- `/arckit:architecture-board` - Establish the governance body for implementation.
