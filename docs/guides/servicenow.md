# CMDB and ServiceNow service design: a practical guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A configuration management database (CMDB) records the configuration items (CIs) behind a service, such as applications, servers and databases, and how they depend on each other. This guide covers what a CMDB holds, how ServiceNow structures its CMDB, and how `/arckit:servicenow` designs the CMDB, SLAs, incident and change processes for a service.

---

## What a CMDB is

In IT service management, a configuration item is any component you need to manage to deliver a service. Configuration management keeps accurate records of those items and the relationships between them. A CMDB is where those records live.

ServiceNow's [CMDB documentation](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/c_ITILConfigurationManagement.html) (Zurich release) describes its CMDB application as a way to "build logical representations of assets, services, and the relationships between them that comprise the infrastructure of your organization". Details about these components are stored in the CMDB as configuration items.

The relationships matter as much as the items. They are what let support and change teams see which services a failing server or a planned change could affect.

---

## How the ServiceNow CMDB is structured

| Part | What it does |
|------|--------------|
| Configuration Item table (`cmdb_ci`) | The core class, which stores the basic attributes of all CIs. |
| Class tables | Sets of CIs that share attributes, such as computers, are stored in their own class table. Each class inherits attributes from the one above it, back to the base CI class. |
| CI Relationship table (`cmdb_rel_ci`) | Defines all relationships between CIs. |
| CI Class Manager | Manages classes within the CMDB hierarchy: their attributes, identification rules and member CIs. |

The [CMDB schema model](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/c_ConfigurationManagementDatabase.html) notes that CIs from tables that do not extend `cmdb_ci` don't appear in Dependency Views maps or CI relation formatters.

### Populating the CMDB

ServiceNow lists four ways to get data in:

- Discovery.
- IntegrationHub ETL or Import Sets, to import and integrate data from a third-party source.
- Integrating with an external CMDB.
- Creating CIs manually.

### Keeping the data healthy

- **CMDB Health** monitors duplicate CIs, required CI fields and audits.
- **CMDB Identification and Reconciliation** reconciles data integrity issues.
- **CMDB Data Manager** handles bulk CI life cycle operations such as deletion, archival and attestation.
- **CMDB Workspace** is where you search the CMDB and reach its dashboards.

---

## Using /arckit:servicenow

`/arckit:servicenow` creates a comprehensive ServiceNow service design covering CMDB, SLAs, incident management, change control, and ITSM integration.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | SLA targets from NFRs |
| Architecture diagrams | Components for CMDB population |
| Operational readiness | Support model and escalation paths |
| Stakeholder drivers | Business criticality and service expectations |

### Command

```bash
/arckit:servicenow Create ServiceNow service design for <service>
```

Output: `projects/<id>/ARC-<id>-SNOW-v1.0.md`

### Service Design Structure

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

### CMDB CI Classes

These are the logical layers the design maps your architecture onto. Map each one to the CI classes your ServiceNow instance uses.

| CI Class | Examples | Relationships |
|----------|----------|---------------|
| Business Service | "Customer Portal" | Depends on Technical Services |
| Technical Service | "API Gateway" | Runs on Applications |
| Application | "Portal Frontend" | Runs on Servers/Containers |
| Server | "web-server-01" | Hosted on Hardware/Cloud |
| Database | "PostgreSQL Cluster" | Stores data for Applications |
| Network Device | "Load Balancer" | Connects to Servers |

### Incident Priority Matrix

| Impact / Urgency | High | Medium | Low |
|------------------|------|--------|-----|
| **High** | P1 (Critical) | P2 (High) | P3 (Moderate) |
| **Medium** | P2 (High) | P3 (Moderate) | P4 (Low) |
| **Low** | P3 (Moderate) | P4 (Low) | P5 (Planning) |

### SLA Response/Resolution Targets

These are example targets. Set yours from the service's non-functional requirements and support model.

| Priority | Response | Resolution | Support Hours |
|----------|----------|------------|---------------|
| P1 | 15 minutes | 4 hours | 24/7 |
| P2 | 30 minutes | 8 hours | 24/7 |
| P3 | 4 hours | 24 hours | Business hours |
| P4 | 8 hours | 72 hours | Business hours |
| P5 | 24 hours | 2 weeks | Business hours |

### Change Types

| Change Type | Approval | Lead Time | Example |
|-------------|----------|-----------|---------|
| Standard | Pre-approved | Immediate | Password reset, minor config |
| Normal | CAB | 5 days | New feature deployment |
| Emergency | Emergency CAB | Immediate | Critical security patch |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define service and requirements | `/arckit:requirements`, `/arckit:stakeholders` |
| Architecture | Design components and dependencies | `/arckit:diagram`, `/arckit:hld-review` |
| Operations | Create operational readiness | `/arckit:operationalize` |
| ITSM Design | Create ServiceNow design | `/arckit:servicenow` |
| Implementation | Configure ServiceNow, populate CMDB | `/arckit:backlog` |

### Integration Points

| System | Integration Type | Purpose |
|--------|------------------|---------|
| Monitoring (Prometheus, Datadog) | Event Management | Auto-create incidents from alerts |
| CI/CD (Jenkins, GitHub Actions) | Change Management | Auto-create change records |
| Cloud Provider (AWS, Azure) | Discovery | Auto-populate CMDB |
| Identity Provider (Microsoft Entra ID, formerly Azure AD) | User Management | SSO, group sync |
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
2. **ITIL Alignment**: Follow ITIL practices for service management. The design uses ITIL 4 terms. [ITIL (Version 5)](https://www.peoplecert.org/browse-certifications/it-governance-and-service-management/ITIL-1) is now available from PeopleCert, with a bridge course for ITIL 4 holders.
3. **Automation First**: Automate ticket creation, routing, and remediation.
4. **Continuous Improvement**: Regular service reviews and CSI initiatives.
5. **Integration**: Connect ServiceNow to monitoring, CI/CD, and cloud platforms.

---

## Useful Links

- [Configuration Management Database (CMDB)](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/c_ITILConfigurationManagement.html) (ServiceNow docs, Zurich release)
- [CMDB schema model](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/c_ConfigurationManagementDatabase.html) (ServiceNow docs)
- [Overview of CMDB](https://www.servicenow.com/docs/bundle/zurich-servicenow-platform/page/product/configuration-management/concept/cnfig-mgmt-and-cmdb.html) (ServiceNow docs)
