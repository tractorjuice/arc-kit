# AI Agent Inventory Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-inventory` creates a governed catalogue of AI agents across a project, programme, or organisation. It records agent purpose, capabilities, ownership, lifecycle, dependencies, security classification, and human oversight level.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| ADM preliminary (`ARC-<id>-ADMP-v1.0.md`) | Recommended programme scope and transformation context |
| Application inventory (`ARC-<id>-APP-v1.0.md`) | Application and hosting context for deployed agents |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Agent governance, AI, technology, and risk guardrails |
| Existing agent designs (`ARC-<id>-AAGR-v1.0.md`) | Agent capabilities and architecture details |
| Agent governance (`ARC-<id>-AAOV-v1.0.md`) | Oversight tiers and approval model |
| Agent security (`ARC-<id>-AASE-v1.0.md`) | Security posture and controls |

---

## Command

```bash
/arckit:agent-inventory <project ID, organisation scope, or environment>
```

Output: `projects/<id>/ARC-<id>-AAGI-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Agent Register | Agent ID, name, purpose, model, deployment (Prod, Staging, Dev, Planned), owner, risk level, oversight level |
| Capability Matrix | Tools, skills, memory type (session, durable, vector, episodic) and output types per agent |
| Agent Dependencies | Agent-to-agent orchestration, data flows and shared tools (Mermaid flowchart) |
| Security Classification | Data sensitivity, access level, isolation, audit required |
| Agent Lifecycle | Status (Active, In Development, Deprecating, Retired), created and updated dates, version |
| Oversight Model | Human-in-the-loop, human-on-the-loop or human-out-of-the-loop per agent, with approval gates, monitoring and escalation |
| Traceability | Links to ADM, applications, design, governance, and security artefacts |

---

## Review Checklist

- Inventory scope is explicit: project, programme, environment, or enterprise.
- Each agent has an owner and lifecycle status.
- Tool, data, model, and system dependencies are captured.
- Oversight level matches autonomy and risk.
- Security classification is evidence-backed, not inferred from the agent name.

---

## Related Commands

- `/arckit:agent-design` - Design new or modified agents.
- `/arckit:agent-governance` - Define oversight and approval workflows.
- `/arckit:agent-security` - Assess and design agent security controls.
