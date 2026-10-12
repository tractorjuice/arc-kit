# AI Agent Governance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit:agent-governance` creates an Agent Governance Framework covering oversight model, approval workflow, audit requirements, monitoring KPIs, escalation procedures, incident response, and compliance mapping.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Agent inventory (`ARC-<id>-AAGI-v1.0.md`) | Mandatory agent list, capabilities, risk levels |
| Agent design (`ARC-<id>-AAGR-v1.0.md`) | Mandatory autonomy, tool use, decision patterns, integration points |
| Global principles (`ARC-000-PRIN-v1.0.md`) | Governance principles and human oversight standards |
| Architecture board (`ARC-<id>-BORD-v1.0.md`) | Board policies, risk appetite, approval precedents |
| Risk register (`ARC-<id>-RISK-v1.0.md`) | AI, operational, security, and compliance risks |
| AI or regulatory assessments | AI Playbook, AI Act, NIST AI RMF, sector controls as applicable |

---

## Command

```bash
/arckit:agent-governance <agent, project ID, or agent programme>
```

Output: `projects/<id>/ARC-<id>-AAOV-v1.0.md`

---

## Deliverable Snapshot

| Section | Contents |
|---------|----------|
| Oversight Model | Human oversight tiers by risk and autonomy |
| Approval Matrix | Who approves design, deployment, tool access, and changes |
| Audit Requirements | Logs, evidence, retention, review cadence |
| Monitoring KPIs | Safety, quality, performance, incident, and drift signals |
| Escalation Procedures | Operational and governance escalation paths |
| Incident Response Plan | Severity, response times, owners, communications |
| Compliance Mapping | Applicable AI, security, data, and sector controls |
| Traceability | Links to inventory, design, principles, board, and risk artefacts |

---

## Review Checklist

- Oversight model matches autonomy, risk, and user impact.
- Approval matrix covers deployment, tool access, model changes, and policy exceptions.
- Audit requirements include retention, reviewers, and evidence location.
- Monitoring KPIs are actionable and assigned to owners.
- Compliance mapping distinguishes required controls from advisory practices.

---

## Related Commands

- `/arckit:agent-security` - Align security controls to governance requirements.
- `/arckit:architecture-board` - Route high-impact agent decisions.
- `/arckit:agent-maturity` - Assess programme maturity and improvement roadmap.
