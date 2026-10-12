# AI Agent Integration Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-integration` creates an Agent Integration Architecture for multi-agent systems. It defines integration scope, inter-agent contracts, message protocol, shared state, failure isolation, observability, and traceability.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Agent design (`ARC-<id>-AAGR-v1.0.md`) | Mandatory agent definitions and interface requirements |
| Agent inventory (`ARC-<id>-AAGI-v1.0.md`) | Agent register, lifecycle, and deployment context |
| Agent governance (`ARC-<id>-AAOV-v1.0.md`) | Oversight, approval, and audit requirements |
| Agent security (`ARC-<id>-AASE-v1.0.md`) | Security controls and permitted communication patterns |
| System diagrams or HLD reviews | Existing system integration and platform context |

---

## Command

```bash
/arckit:agent-integration <project ID or agent group>
```

Output: `projects/<id>/ARC-<id>-AAIN-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Integration Architecture | Agent topology, orchestration, and boundaries |
| Inter-Agent Contracts | Contract name, sender, receiver, schema, SLA, failure mode |
| Message Protocol | Transport, envelope, correlation, idempotency, retries |
| Shared State Design | State ownership, locking, retention, consistency model |
| Failure Isolation | Circuit breakers, fallback, dead-letter paths, containment |
| Observability | Logs, traces, metrics, alerts, audit linkage |
| Traceability | Links to designs, inventory, governance, and security controls |

---

## Review Checklist

- Every integration has a named contract and accountable owner.
- Message schemas include versioning and compatibility expectations.
- Shared state ownership is explicit and avoids hidden coupling.
- Failure isolation contains bad outputs, tool failures, and cross-agent injection.
- Observability supports operational debugging and governance audit.

---

## Related Commands

- `/arckit:agent-design` - Define individual agent architecture and interfaces.
- `/arckit:agent-governance` - Apply oversight to multi-agent orchestration.
- `/arckit:agent-security` - Secure inter-agent communication.
