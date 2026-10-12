# AI Agent Design Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-design` creates an Agent Architecture Specification. It documents agent pattern, tool contracts, memory architecture, orchestration, guardrails, testing strategy, and traceability back to requirements, risks, stakeholders, and inventory.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Agent inventory (`ARC-<id>-AAGI-v1.0.md`) | Existing agents, capability baseline, ownership, operational context |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Functional and non-functional requirements for agent capabilities |
| Global principles (`ARC-000-PRIN-v1.0.md`) | AI, technology, and governance constraints |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | Agent users, operators, approvers, and affected groups |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | AI, tool, security, reliability, and compliance risks |
| AI Playbook assessment (`ARC-<id>-AIPB-v1.0.md`) | Ethics, fairness, transparency, and model governance evidence |

---

## Command

```bash
/arckit:agent-design <agent name or project ID>
```

Output: `projects/<id>/ARC-<id>-AAGR-v1.0.md`

---

## Design Patterns

| Pattern | Use When |
|---------|----------|
| Single Agent | Focused domain, small tool set, simple operational model |
| Chain | Sequential specialist steps with clear handoff boundaries |
| Multi-Agent | Parallel workers or domain agents need coordination |
| Hierarchical | Supervisor and workers need dynamic task allocation |

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Agent Architecture Overview | Pattern, components, capabilities, C4-style diagram |
| Tool Contracts | Tool ID, permission, input schema, output schema, validation |
| Memory Architecture | Session, durable, and vector memory design |
| Orchestration Design | Routing, coordination, retries, and escalation |
| Guardrail Configuration | Input, context, tool, output, and policy controls |
| Testing Strategy | Unit, integration, security, regression, and acceptance tests |
| Traceability | Links to inventory, requirements, risks, stakeholders, and principles |

---

## Review Checklist

- Agent purpose and pattern are explicit and justified.
- Tool contracts include permissions, schemas, and failure behaviour.
- Memory design separates session, durable, and vector responsibilities.
- Guardrails are mapped to real requirements and risks.
- Testing covers tool contracts, orchestration, prompt injection, and output validation.

---

## Related Commands

- `/arckit:agent-integration` - Design multi-agent contracts and shared state.
- `/arckit:agent-security` - Add sandboxing, permission, and validation controls.
- `/arckit:agent-governance` - Define oversight and approvals.
