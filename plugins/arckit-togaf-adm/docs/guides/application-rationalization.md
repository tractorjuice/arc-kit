# Application Rationalization Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:application-rationalization` turns the application inventory into portfolio decisions. It applies keep, merge, replace, and retire recommendations with rationale, target-state implications, benefits, risks, and implementation sequencing.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Application inventory (`ARC-<id>-APP-v1.0.md`) | Mandatory application baseline |
| Business capability map (`ARC-<id>-BPCM-v1.0.md`) | Capability criticality and target capability support |
| Architecture decision records (`ARC-<id>-ADR-*.md`) | Existing platform and technology decisions |
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | Transformation scope and strategy context |
| Transition architecture (`ARC-<id>-TRANS-v1.0.md`) | Existing migration sequencing if already planned |
| Vendor contracts or cost models | Licensing, support, commercial constraints |

---

## Command

```bash
/arckit:application-rationalization <project ID or portfolio scope>
```

Output: `projects/<id>/ARC-<id>-APPR-v1.0.md`

---

## Decision Model

| Decision | Use When |
|----------|----------|
| Keep | Application is strategically aligned, healthy, and cost-effective |
| Merge | Duplicate capabilities can be consolidated into fewer services |
| Replace | Capability is needed but the current application is unfit |
| Retire | Capability is obsolete, unused, or better served elsewhere |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Rationalisation Summary | Portfolio-level decision distribution |
| Per-Application Decisions | Decision, rationale, evidence, owner, timing |
| Portfolio Target State | Future application landscape and consolidation view |
| Benefits | Cost, complexity, risk, and capability benefits |
| Risks | Delivery, vendor, operational, and compliance risks |
| Sequencing | Order of decisions and dependencies |
| Pending Approvals | Decisions requiring board, sponsor, or commercial approval |

---

## Review Checklist

- Every decision is evidence-backed, not preference-based.
- Critical capabilities remain covered in the target state.
- Retirement and replacement decisions include migration and data handling notes.
- Vendor, licence, and contract constraints are visible.
- Pending approvals are explicit and traceable.

---

## Related Commands

- `/arckit:gap-analysis` - Reassess gaps after rationalisation.
- `/arckit:transition-architecture` - Convert decisions into work packages.
- `/arckit:architecture-board` - Approve high-impact portfolio decisions.
