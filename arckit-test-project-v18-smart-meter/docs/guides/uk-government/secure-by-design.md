# UK Government Secure by Design Guide

`/arckit.secure` captures NCSC Secure by Design, Cyber Essentials, and GDPR evidence for civilian (non-MOD) services.

---

## Command

```bash
/arckit.secure Assess UK Government Secure by Design for <service>
```

Output: `projects/<id>/ARC-<id>-SECU-v1.0.md`.

---

## Evidence Checklist

| Theme | Key Questions | Artefacts |
|-------|---------------|-----------|
| Context & classification | What data do we hold? Which classification (OFFICIAL / OFFICIAL-SENSITIVE)? | Data model, DPIA, risk register |
| Governance & roles | Who owns security? Who approves exceptions? | RACI, project plan, service runbook |
| Secure development | How do we embed security in SDLC? | CI/CD controls, code review policy, threat model |
| Identity & access | How is privileged access controlled? MFA used? | IAM documentation, Terraform/PAM configs |
| Protection & resilience | How do we protect data at rest/in transit? Backups? DR? | Deployment diagrams, recovery runbooks |
| Monitoring & response | What logging/alerting is in place? Incident response plan? | `/arckit.servicenow`, logging architecture |
| Supply chain | How are suppliers assessed and monitored? | Procurement docs, contract clauses, assurance |

---

## Mapping to Standards

| Control Set | Covered By |
|-------------|------------|
| NCSC Cloud Security Principles (1–14) | Hosting decision log, architecture diagrams, `/arckit.secure` output sections |
| Cyber Essentials (Firewalls, Configuration, Access, Malware, Patching) | Infrastructure-as-Code, operations procedures |
| GDPR Privacy by Design | `/arckit.dpia`, data retention, subject rights, encryption |

---

## Cadence

| Phase | Activity |
|-------|----------|
| Discovery / Alpha | Baseline assessment, identify high-risk gaps |
| Beta | Update with security testing, monitoring plans, operational readiness |
| Live | Review quarterly or after major change / incident |

Link actions into risk register and backlog; track completion before passing assurance gates.
