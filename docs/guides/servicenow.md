# ServiceNow Service Design Playbook

`/arckit.servicenow` creates a comprehensive ServiceNow service design covering CMDB, SLAs, incident management, change control, and ITSM integration.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | SLA targets from NFRs |
| Architecture diagrams | Components for CMDB population |
| Operational readiness | Support model and escalation paths |
| Stakeholder drivers | Business criticality and service expectations |

---

## Command

```bash
/arckit.servicenow Create ServiceNow service design for <service>
```

Output: `projects/<id>/ARC-<id>-SNOW-v1.0.md`

---

## Service Design Structure

| Section | Contents |
|---------|----------|
| Service Overview | Service definition, criticality, ownership |
| CMDB Design | CI classes, relationships, discovery, data quality |
| Service Portfolio | Service catalog entry, request items, bundles |
| Incident Management | Categories, priorities, SLAs, escalation, major incident |
| Problem Management | Root cause analysis, known errors, problem review |
| Change Management | Change types, CAB process, approvals, windows |
| Service Level Management | SLAs, OLAs, UCs, reporting |
| Knowledge Management | Article structure, approval workflow, review cycle |
| Service Request Management | Request catalog, fulfillment workflows, approvals |
| Asset Management | Hardware/software assets, lifecycle, contracts |
| Event Management | Alert integration, correlation, auto-remediation |
| Reporting & Dashboards | KPIs, dashboards, executive reporting |
| Integration Architecture | External system integrations, APIs, data flows |
| Automation | Flow Designer, IntegrationHub, auto-assignment |
| UK Government Considerations | Cross-government ITSM, NCSC alignment |

---

## CMDB CI Classes

| CI Class | Examples | Relationships |
|----------|----------|---------------|
| Business Service | "Customer Portal" | Depends on Technical Services |
| Technical Service | "API Gateway" | Runs on Applications |
| Application | "Portal Frontend" | Runs on Servers/Containers |
| Server | "web-server-01" | Hosted on Hardware/Cloud |
| Database | "PostgreSQL Cluster" | Stores data for Applications |
| Network Device | "Load Balancer" | Connects to Servers |

---

## Incident Priority Matrix

| Impact / Urgency | High | Medium | Low |
|------------------|------|--------|-----|
| **High** | P1 (Critical) | P2 (High) | P3 (Moderate) |
| **Medium** | P2 (High) | P3 (Moderate) | P4 (Low) |
| **Low** | P3 (Moderate) | P4 (Low) | P5 (Planning) |

---

## SLA Response/Resolution Targets

| Priority | Response | Resolution | Support Hours |
|----------|----------|------------|---------------|
| P1 | 15 minutes | 4 hours | 24/7 |
| P2 | 30 minutes | 8 hours | 24/7 |
| P3 | 4 hours | 24 hours | Business hours |
| P4 | 8 hours | 72 hours | Business hours |
| P5 | 24 hours | 2 weeks | Business hours |

---

## Change Types

| Change Type | Approval | Lead Time | Example |
|-------------|----------|-----------|---------|
| Standard | Pre-approved | Immediate | Password reset, minor config |
| Normal | CAB | 5 days | New feature deployment |
| Emergency | Emergency CAB | Immediate | Critical security patch |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define service and requirements | `/arckit.requirements`, `/arckit.stakeholders` |
| Architecture | Design components and dependencies | `/arckit.diagram`, `/arckit.hld-review` |
| Operations | Create operational readiness | `/arckit.operationalize` |
| ITSM Design | Create ServiceNow design | `/arckit.servicenow` |
| Implementation | Configure ServiceNow, populate CMDB | `/arckit.backlog` |

---

## Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| Monitoring (Prometheus, Datadog) | Event Management | Auto-create incidents from alerts |
| CI/CD (Jenkins, GitHub Actions) | Change Management | Auto-create change records |
| Cloud Provider (AWS, Azure) | Discovery | Auto-populate CMDB |
| Identity Provider (Azure AD) | User Management | SSO, group sync |
| Communication (Slack, Teams) | Notifications | Incident updates, approvals |

---

## Review Checklist

- CMDB design covers all architecture components.
- CI relationships reflect actual dependencies.
- SLAs align with NFRs and business expectations.
- Incident categories match service components.
- Change management process appropriate for service criticality.
- Knowledge base structure defined with review cycle.
- Integrations defined for monitoring, CI/CD, and discovery.
- Automation opportunities identified (auto-assignment, auto-remediation).

---

## Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| CMDB Accuracy | % of CIs with correct data | >95% |
| SLA Achievement | % of incidents meeting SLA | >95% |
| First Contact Resolution | % resolved at L1 | >70% |
| Change Success Rate | % of changes without incidents | >95% |
| MTTR | Mean time to resolve incidents | Trending down |

---

## Key Principles

1. **CMDB as Source of Truth**: All service relationships mapped and maintained.
2. **ITIL Alignment**: Follow ITIL v4 practices for service management.
3. **Automation First**: Automate ticket creation, routing, and remediation.
4. **Continuous Improvement**: Regular service reviews and CSI initiatives.
5. **Integration**: Connect ServiceNow to monitoring, CI/CD, and cloud platforms.
