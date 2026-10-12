# AI Agent Maturity Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-maturity` assesses an AI agent programme across design, governance, security, integration, and operations. It produces a current-state maturity view, target maturity, improvement roadmap, benchmarks, and traceability.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Agent inventory (`ARC-<id>-AAGI-v1.0.md`) | Agent baseline, ownership, lifecycle, capability context |
| Agent design (`ARC-<id>-AAGR-v1.0.md`) | Design patterns, tool contracts, guardrails, orchestration |
| Agent governance (`ARC-<id>-AAOV-v1.0.md`) | Oversight, audit, monitoring, approval process |
| Agent security (`ARC-<id>-AASE-v1.0.md`) | Security controls, threat model, validation pipeline |
| Agent integration (`ARC-<id>-AAIN-v1.0.md`) | Integration patterns and interoperability evidence |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | Operational, compliance, and AI risk context |
| Enterprise maturity model | Wider maturity baseline and benchmark context |

---

## Command

```bash
/arckit:agent-maturity <project ID or agent programme>
```

Output: `projects/<id>/ARC-<id>-AAMT-v1.0.md`

---

## Maturity Dimensions

| Dimension | Evidence |
|-----------|----------|
| Design | Reusable patterns, tool contracts, design reviews, ADRs |
| Governance | Oversight model, audit coverage, approval records, compliance mapping |
| Security | Threat model, sandboxing, permission controls, security testing |
| Integration | Standard APIs, contracts, observability, failure isolation |
| Operations | Monitoring, incident response, SLAs, support model, continuous improvement |

---

## Maturity Levels

| Level | Meaning |
|-------|---------|
| L1 Ad-hoc | Reactive, informal, undocumented |
| L2 Reactive | Some process after issues occur |
| L3 Defined | Standard process documented and repeatable |
| L4 Managed | Metrics-driven and actively governed |
| L5 Optimized | Predictive, continuously improved, evidence-led |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Maturity Model Framework | Dimensions, levels, and evidence criteria |
| Current State Assessment | Level, evidence, gaps, and risk per dimension |
| Target State | Target level and rationale per dimension |
| Improvement Roadmap | Initiatives, owners, timeline, dependencies, success criteria |
| Benchmarks | Industry, regulatory, and peer comparisons |
| Traceability | Links to inventory, design, governance, security, integration, and roadmap artefacts |

---

## Review Checklist

- Ratings cite evidence rather than relying on opinion.
- Target levels are realistic for the investment and timeline.
- Each improvement initiative has owner, success criteria, and dependency notes.
- Security and governance maturity are not averaged away by strong design maturity.
- Roadmap actions feed back into `/arckit:agent-design`, `/arckit:agent-governance`, and `/arckit:agent-security`.

---

## Related Commands

- `/arckit:maturity-model` - Assess wider enterprise architecture maturity.
- `/arckit:agent-design` - Address design maturity gaps.
- `/arckit:agent-governance` - Address governance maturity gaps.
