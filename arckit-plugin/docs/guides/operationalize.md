# Operational Readiness Playbook

`/arckit.operationalize` creates an operational readiness pack covering support model, runbooks, DR/BCP, on-call, and handover documentation.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | NFRs for availability, performance, recovery |
| Architecture diagrams | Components for runbook inventory |
| Risk register | Operational risks to mitigate |
| Data model | Backup requirements and data dependencies |

---

## Command

```bash
/arckit.operationalize Create operational readiness pack for <service>
```

Output: `projects/<id>/ARC-<id>-OPS-v1.0.md`

---

## Readiness Pack Structure

| Section | Contents |
|---------|----------|
| Service Overview | Name, criticality, tier, stakeholders, dependencies |
| Service Level Objectives | SLIs, SLOs, error budgets, breach response |
| Support Model | Support tiers, escalation matrix, on-call rotation |
| Monitoring & Observability | Health checks, metrics, dashboards, logs, tracing |
| Alerting Strategy | Routing rules, severity definitions, fatigue prevention |
| Runbooks | Service start/stop, health check failures, errors, capacity |
| Disaster Recovery | DR strategy, RTO/RPO, failover/failback procedures |
| Business Continuity | Impact analysis, workarounds, communication plan |
| Backup & Restore | Schedule, retention, verification, restore procedures |
| Capacity Planning | Baseline, projections, scaling thresholds |
| Security Operations | Access management, patching, vulnerability scanning |
| Deployment & Release | Windows, rollback, feature flags, migrations |
| Knowledge Transfer | Training materials, SME contacts, onboarding |
| Handover Checklist | Comprehensive go-live checklist |
| Operational Metrics | MTTR, MTBF, change failure rate, deployment frequency |
| UK Government Considerations | GDS Point 14, NCSC guidance, cross-government dependencies |

---

## Service Tier Mapping

| Tier | Availability | RTO | RPO | Support | On-Call |
|------|-------------|-----|-----|---------|---------|
| Critical | 99.95%+ | <1hr | <15min | 24/7 | Yes, immediate |
| Important | 99.9% | <4hr | <1hr | 24/7 | Yes, 15min response |
| Standard | 99.5% | <24hr | <4hr | Business hours | Best effort |

---

## Runbook Structure

Each runbook must include:

| Section | Contents |
|---------|----------|
| Purpose | What problem this runbook addresses |
| Prerequisites | Access, tools, knowledge required |
| Detection | How you know this runbook is needed |
| Steps | Numbered, specific, actionable steps |
| Verification | How to confirm the issue is resolved |
| Escalation | When and how to escalate |
| Rollback | How to undo changes if needed |

---

## Standard Runbooks Required

| Runbook | Purpose |
|---------|---------|
| Service Start/Stop | Graceful start and stop procedures |
| Health Check Failures | Response when health checks fail |
| High Error Rate | Diagnosis and mitigation for elevated errors |
| Performance Degradation | Response when SLOs are breached |
| Capacity Issues | Scaling procedures (manual and automatic) |
| Security Incident | Initial response for security events |
| Dependency Failure | Response when upstream services fail |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and architecture | `/arckit.requirements`, `/arckit.diagram` |
| Design | Create HLD/DLD, identify risks | `/arckit.hld-review`, `/arckit.risk` |
| Build | Implement, test, document | `/arckit.backlog`, `/arckit.devops` |
| Readiness | Create operational pack | `/arckit.operationalize` |
| Go-Live | Handover, train, transition | `/arckit.servicenow` |

---

## Handover Checklist Summary

- [ ] All runbooks written and reviewed
- [ ] Monitoring dashboards created and tested
- [ ] Alerts configured and tested
- [ ] On-call rotation staffed
- [ ] DR tested within last 6 months
- [ ] Backups verified and restore tested
- [ ] Support team trained
- [ ] Escalation contacts confirmed
- [ ] Access provisioned for support team
- [ ] Documentation in knowledge base
- [ ] SLOs agreed with stakeholders

---

## Review Checklist

- Every NFR has corresponding SLO/SLI.
- Every major component has a runbook.
- DR/BCP procedures documented and tested.
- On-call rotation defined with sustainable schedule.
- Escalation paths clear with contact details.
- Training plan exists for operations team.
- RTO/RPO align with architecture capability.

---

## Key Principles

1. **SRE-First**: Define SLIs before SLOs before alerts.
2. **Actionable Runbooks**: Specific, numbered steps with actual commands.
3. **Realistic RTO/RPO**: Must match architecture capability.
4. **Human-Centric**: On-call should be sustainable (no burnout).
5. **Continuous Improvement**: Regular reviews, post-incident improvements.
