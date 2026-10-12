# Architecture Board Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:architecture-board` establishes an Architecture Board charter for TOGAF ADM Phase G. It defines mandate, membership, decision rights, compliance scorecard, exception process, review cadence, and decision register.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Global architecture principles (`ARC-000-PRIN-v1.0.md`) | Mandatory standards and decision guardrails |
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | Scope, phases, governance model |
| Business capability map (`ARC-<id>-BPCM-v1.0.md`) | Business scope and owners |
| Gap analysis (`ARC-<id>-GAPA-v1.0.md`) | Prioritised gap closure needs |
| Transition architecture (`ARC-<id>-TRANS-v1.0.md`) | Work packages requiring governance |
| Existing governance policies or board minutes | Decision precedent and local operating model |

---

## Command

```bash
/arckit:architecture-board <project ID or board scope>
```

Output: `projects/<id>/ARC-<id>-BORD-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Board Charter | Mandate, scope, authority, operating principles |
| Membership | Roles, decision rights, quorum, deputies |
| Decision Framework | Approval criteria, escalation, exception handling |
| Compliance Scorecard | Measures for principles, standards, and transition control |
| Exception Process | How deviations are requested, assessed, and tracked |
| Review Cadence | Meeting rhythm, inputs, outputs, and standing agenda |
| Decision Register | Board decisions and traceability |

---

## Review Checklist

- Board authority is explicit and proportionate to the ADM scope.
- Membership includes architecture, delivery, risk, security, and business ownership where needed.
- Exception criteria are clear enough to use repeatedly.
- Compliance scorecard measures actual governance signals.
- Decision register has a durable owner and cadence.

---

## Related Commands

- `/arckit:architecture-change` - Create change requests for Board review.
- `/arckit:transition-architecture` - Present migration plans for approval.
- `/arckit:principles-compliance` - Check artefacts against architecture principles.
