# O-AA Agile Governance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agile-governance` creates an Agile Governance document using Open Agile Architecture (O-AA, C208) Ch. 8, Agile Governance. It sets a lightweight governance cadence tied to sprint cycles: review gates at sprint boundaries, compliance evidence produced every sprint, and architecture change requests decided within the sprint rather than held for a quarterly board. Following Axiom 7 (Authority, Responsibility, and Accountability Distribution), decision authority sits with a small cross-functional review panel instead of a top-down board, and governance is treated as a service that gives clear decision paths. The command is part of the `arckit-oaa` overlay, which needs the core `arckit` plugin.

---

## When to Use

| Use when any of these apply | Do not use when |
|-----------------------------|-----------------|
| The client wants governance aligned to sprint cycles rather than quarterly architecture boards | The client requires a traditional quarterly architecture board with 20+ member panels |
| Architecture review needs to be lightweight and continuous | It is a multi-year programme with formal governance stages and stage-gate reviews |
| Compliance evidence must be collected per sprint | Regulation mandates a formal governance cadence outside sprint cycles |
| Architecture changes must be evaluated and approved within sprint cycles | |
| The architecture board is being replaced by cross-functional sprint review panels | |

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v*.md`) | Recommended. Governance principles, decision authority, compliance obligations. If missing, the command warns you to run `/arckit:principles` first |
| O-AA ADM Lite (`ARC-<id>-OAAL-v*.md`) | Recommended. Sprint plan, governance cadence, compliance mapping |
| Agile product architecture (`ARC-<id>-OAPR-v*.md`) | Recommended. Product guardrails, compliance requirements |
| Agile security (`ARC-<id>-OASEC-v*.md`) | Recommended. Security compliance evidence, regulatory mappings |
| Agile strategy canvas (`ARC-<id>-OASTR-v*.md`) | Recommended. Governance strategy, risk appetite |
| Project external documents (`projects/<id>/external/`) | Read if present. Governance frameworks, compliance obligations, change management policies, risk registers |
| Enterprise standards (`projects/000-global/external/`) | Read if present. Governance policies, architecture review procedures, approval workflows |

---

## Command

```bash
/arckit:agile-governance <product or programme name>
```

Output: `projects/<id>/ARC-<id>-OAGOV-v1.0.md`

If the named project does not exist, the command creates it. If an OAGOV document already exists, it writes a new version (v2.0) instead of overwriting. Sprint artefacts: `governance-report.yaml`, `change-request.yaml` (one per change) and `compliance-evidence.yaml`, which is shared with `/arckit:agile-security`. The governance report cites the safety checklist set by the `safety_checklist_id` plugin setting.

---

## Governance Model

| Element | What the document sets out |
|---------|----------------------------|
| Sprint review panel | 3-5 members (Product Owner, Lead Architect, AI Safety Engineer, DevOps Lead, Compliance Representative), a decision authority matrix, and escalation paths for issues beyond the panel's authority |
| Review gates | Pre-sprint alignment check, mid-sprint health check and post-sprint compliance review, each with pass/fail criteria and a remediation path |
| Change management | Standard change request, evaluation of impact, compliance and effort, a decision within the sprint, and a change log per sprint |
| Compliance evidence | Regulatory, security control, architecture standard and quality gate evidence each sprint, mapped to GDPR, APRA, APP and the AI Act |
| Metrics | Decision velocity, compliance rate, architecture debt, risk exposure |
| Exceptions | Architecture, compliance and security exceptions, raised, assessed, approved or rejected, and reviewed at each sprint boundary |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Document Control | Document ID, owner, status, classification; review cycle per sprint |
| Why This Replaces the ARB | Centralised review board compared with the sprint review panel, and the conditions for reverting to a board |
| Cadence Overview | Sprint, month, quarter and continuous horizons, each event with its input, output artefact and owner |
| 1. Sprint Review Panel | Panel members and the perspective each brings, decision authority matrix |
| 2. Sprint Architecture Review Checklist | Pre-sprint, mid-sprint and post-sprint checks, gate criteria with remediation, example automation |
| 3. Change Management at Sprint Velocity | `change-request.yaml` structure, decision timeline within the sprint |
| 4. Architecture Debt Tracking | Five debt categories, debt register with severity and status, review rules by severity, monthly review |
| 5. Quarterly Architecture Health Assessment | Scored assessment, scoring rubric, assessment outputs |
| 6. Continuous Compliance Monitoring and Evidence | Automated checks, `compliance-evidence.yaml`, `governance-report.yaml` integration, weekly reporting, governance metrics |
| 7. Distributed Governance Duties | Continuous duties by role, escalation tiers and their decisions, exception handling |
| 8. Integration with TOGAF ADM | Mapping to ADM Phases G and H |
| 9. Trigger Guidance | When to use the cadence and when a traditional board fits better |
| External References | Document Register (C208 with URL and verification date), citations |

---

## Review Checklist

- The cadence covers every stated horizon: sprint, month, quarter and continuous.
- Each cadence event has an input, an output artefact and an owner.
- The debt register defines its states and its review rule.
- The escalation path names each tier and the decision it can take.
- Exceptions record accepted risk with sign-off and a resolution deadline.
- The distributed model is justified against a traditional review board, with the conditions for reverting stated.
- Governance outputs feed the compliance evidence used by `/arckit:agile-security`.

---

## Next Steps

- `/arckit:oaa-adm-lite` - Re-plan sprint cadence based on governance findings.
- `/arckit:agile-security` - Update the security backlog from governance review findings.
