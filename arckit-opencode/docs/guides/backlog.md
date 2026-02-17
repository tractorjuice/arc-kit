# Product Backlog Quick Guide

Generate a sprint-ready backlog from existing ArcKit artefacts with `/arckit.backlog`. The command converts requirements into groomed stories, groups them into sprints, and exports markdown, CSV, and JSON for tooling.

---

## Input Readiness

| Must Have | Why it matters |
|-----------|----------------|
| `ARC-<id>-REQ-v1.0.md` with BR/FR/NFR/INT/DR IDs | Feeds epics, stories, and non-functional tasks |
| Approved HLD/DLD | Ensures stories reference actual components |
| Stakeholder analysis | Provides personas for story wording |

_Strongly recommended_: risk register (for priority), business case (for value), traceability matrix (for gaps).

---

## Command Patterns

```bash
/arckit.backlog                      # default: 8 sprints, 20 pts each
/arckit.backlog VELOCITY=25 SPRINTS=12 FORMAT=all
/arckit.backlog PRIORITY=risk        # other options: value, moscow, multi
```

Outputs land in `projects/<id>/ARC-<id>-BKLG-v1.0.*`.

---

## Backlog Workflow

| Stage | Action |
|-------|--------|
| 1. Gather inputs | Confirm artefacts above are up to date |
| 2. Run command | Choose velocity/sprint count that matches team capacity |
| 3. Review exports | Check epic grouping, dependencies, and MoSCoW tags |
| 4. Sprint slicing | Adjust sprint boundaries to respect change freeze / compliance windows |
| 5. Tool import | Use CSV/JSON for Jira, Azure DevOps, or Trello |

---

## Sprint Planning Checklist

- Stories tie back to requirement IDs in description.
- Acceptance criteria reflect regulatory constraints (WCAG, GDPR, security).
- Risks flagged as HIGH appear in Sprint 1–2 for mitigation.
- Each sprint finishes a vertical slice (discovery, build, test).
- Service management work (e.g., `/arckit.servicenow`) placed before go-live.

---

## Useful References

- GOV.UK Service Manual on [Agile delivery](https://www.gov.uk/service-manual/agile-delivery) (estimation guidance).
- `/arckit.traceability` to spot requirements without coverage before backlog generation.
