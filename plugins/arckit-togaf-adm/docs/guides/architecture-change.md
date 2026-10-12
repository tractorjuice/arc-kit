# Architecture Change Request Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:architecture-change` creates a TOGAF Phase H Architecture Change Request with impact assessment, cost and benefit analysis, risk assessment, approval workflow, and ADM re-entry recommendation.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture board (`ARC-<id>-BORD-v1.0.md`) | Governance policy, decision precedent, approval route |
| Business capability map (`ARC-<id>-BPCM-v1.0.md`) | Capability impact assessment |
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | ADM scope and architecture framework |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Principle compliance implications |
| Transition architecture (`ARC-<id>-TRANS-v1.0.md`) | Current migration plan impact |
| Existing change documents or board minutes | Change history and prior decisions |

---

## Command

```bash
/arckit:architecture-change <project ID, change type, and change summary>
```

Output: `projects/<id>/changes/ARC-<id>-ACHG-001-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Change Request | Requested change, type, urgency, requester |
| Rationale | Why the change is needed now |
| Impact Assessment | Business, application, technology, data, security, delivery impact |
| Affected Artefacts | Documents and decisions that must change |
| ADM Re-Entry Point | Recommended ADM phase to revisit |
| Cost and Benefit | Expected cost, value, trade-offs |
| Risk Assessment | Risks introduced, reduced, or transferred |
| Approval Workflow | Reviewers, approvers, and decision status |
| Traceability | Links to board, capability, transition, and principle artefacts |

---

## Change Types

| Type | Use When |
|------|----------|
| Evolutionary | Adjusts an existing architecture within approved direction |
| Corrective | Fixes a defect, compliance gap, or failed assumption |
| Transformational | Changes target state, scope, or strategic direction |
| Emergency | Requires accelerated governance due to urgent risk or delivery pressure |

---

## Review Checklist

- The requested change is specific and actionable.
- Impacts are assessed across capability, application, technology, data, security, and delivery.
- ADM re-entry point is justified.
- Affected artefacts are listed with update actions.
- Approval workflow names the accountable decision forum or owner.

---

## Related Commands

- `/arckit:architecture-board` - Review and approve change requests.
- `/arckit:transition-architecture` - Update work packages after approval.
- `/arckit:gap-analysis` - Reassess gaps after the change.
