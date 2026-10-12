# Transition Architecture Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:transition-architecture` creates the TOGAF ADM Phase F migration plan. It defines intermediate transition states, work packages, migration waves, dependencies, resources, risks, and acceptance criteria.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Gap analysis (`ARC-<id>-GAPA-v1.0.md`) | Mandatory gap baseline and workstream inputs |
| Roadmap (`ARC-<id>-ROAD-v1.0.md`) | Timeline, horizons, governance gates, sequencing |
| Application rationalisation (`ARC-<id>-APPR-v1.0.md`) | Migration decisions for application portfolio |
| Architecture decision records (`ARC-<id>-ADR-*.md`) | Technology decisions and constraints |
| External migration or vendor plans | Existing dependencies, contract timings, cutover plans |

---

## Command

```bash
/arckit:transition-architecture <project ID or migration scope>
```

Output: `projects/<id>/ARC-<id>-TRANS-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Transition Overview | Baseline, transition states, and target state |
| Work Packages | Scope, owner, dependencies, effort, acceptance criteria |
| Dependencies | Cross-work-package sequencing and constraints |
| Resource Plan | People, skills, funding, environments, supplier needs |
| Risk and Contingency | Delivery risks and fallback options |
| Acceptance Criteria | How each transition state is judged complete |
| Traceability | Gaps, roadmap items, ADRs, and rationalisation links |

---

## Workflow

1. Run `/arckit:gap-analysis` to identify prioritised gaps.
2. Run `/arckit:application-rationalization` when application migration is in scope.
3. Run `/arckit:transition-architecture` to group work into transition states.
4. Send the plan through `/arckit:architecture-board` for governance approval.
5. Use `/arckit:architecture-change` for later scope or sequencing changes.

---

## Review Checklist

- Transition states are useful checkpoints, not just calendar milestones.
- Work packages have clear owners, dependencies, and acceptance criteria.
- Sequencing respects technical, operational, commercial, and governance constraints.
- Risks include contingency actions, not only descriptions.
- The plan links back to the gaps it is meant to close.

---

## Related Commands

- `/arckit:architecture-board` - Approve transition plans and exceptions.
- `/arckit:architecture-change` - Manage changes to approved transition scope.
- `/arckit:roadmap` - Maintain strategic timeline alignment.
