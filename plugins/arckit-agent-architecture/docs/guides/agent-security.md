# AI Agent Security Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-security` creates an Agent Security Architecture covering threat model, sandboxing, tool permissions, data handling, prompt-injection defences, output validation, secret management, incident response, and traceability.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Agent inventory (`ARC-<id>-AAGI-v1.0.md`) | Mandatory agent list, capabilities, risk levels |
| Agent design (`ARC-<id>-AAGR-v1.0.md`) | Mandatory tool contracts, memory, guardrails, integration points |
| Secure by Design (`ARC-<id>-SECD-v1.0.md`) | Existing security controls and threat model |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | Security, AI, tool, and data risks |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Security and technology constraints |
| Agent governance (`ARC-<id>-AAOV-v1.0.md`) | Oversight tiers and compliance requirements |
| DPIA or AI Playbook artefacts | Personal data and AI ethics implications |

---

## Command

```bash
/arckit:agent-security <agent or project ID>
```

Output: `projects/<id>/ARC-<id>-AASE-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Threat Model | Input, execution, output, and infrastructure attack surfaces |
| Sandboxing Architecture | Agent, tool, memory, network, and data isolation |
| Tool Permission Matrix | Permissions, access scope, risk, and mitigation by tool |
| Data Handling Policy | PII, sensitive, public, model, and secret handling rules |
| Prompt Injection Defences | Input, context, output, and tool-call controls |
| Output Validation Pipeline | Schema, safety, PII, human review, release stages |
| Secret Management | Storage, scope, rotation, and ownership |
| Incident Response | Severity tiers, owners, actions, and timing |
| Traceability | Links to inventory, design, governance, and Secure by Design artefacts |

---

## Review Checklist

- Threat model covers direct and indirect prompt injection.
- High-risk tools have explicit permission checks and mitigations.
- Sandboxing boundaries are enforceable, not just policy statements.
- Output validation includes schema, content, and PII checks.
- Secret lifecycle includes storage, scope, owner, and rotation cadence.

---

## Related Commands

- `/arckit:agent-governance` - Align security controls with oversight model.
- `/arckit:secure` - Produce wider Secure by Design evidence.
- `/arckit:agent-integration` - Secure communication between agents.
