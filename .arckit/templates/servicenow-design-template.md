# ServiceNow Service Design

> **Template Status**: Beta | **Version**: [VERSION] | **Command**: `/arckit.servicenow`

## Document Control

| Field | Value |
|-------|-------|
| **Document ID** | ARC-[PROJECT_ID]-SNOW-v[VERSION] |
| **Document Type** | ServiceNow Service Design |
| **Project** | [PROJECT_NAME] (Project [PROJECT_ID]) |
| **Classification** | [PUBLIC / OFFICIAL / OFFICIAL-SENSITIVE / SECRET] |
| **Status** | [DRAFT / IN_REVIEW / APPROVED / PUBLISHED / SUPERSEDED / ARCHIVED] |
| **Version** | [VERSION] |
| **Created Date** | [YYYY-MM-DD] |
| **Last Modified** | [YYYY-MM-DD] |
| **Review Cycle** | [Monthly / Quarterly / Annual / On-Demand] |
| **Next Review Date** | [YYYY-MM-DD] |
| **Owner** | [OWNER_NAME_AND_ROLE] |
| **Reviewed By** | [REVIEWER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Approved By** | [APPROVER_NAME] ([YYYY-MM-DD]) or PENDING |
| **Distribution** | [DISTRIBUTION_LIST] |

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit.servicenow` command | PENDING | PENDING |

---

## 1. Service Overview

### Service Description
[Brief description of the service - what business capability it provides]

**Service Type**: [Application / Infrastructure / Business Service]
**Service Owner**: [Team/Department]
**Service Tier**: [Tier 1 Critical / Tier 2 Important / Tier 3 Standard]

### Service Dependencies
- **Upstream**: [Services this depends on]
- **Downstream**: [Services that depend on this]

---

## 2. CMDB Design

### Configuration Items
[Derive CI hierarchy from architecture diagrams - Context/Container/Component layers map to Business Service/Application/Infrastructure CIs]

| CI Name | CI Class | Parent CI | Owner | Environment |
|---------|----------|-----------|-------|-------------|
| [Service Name] | Business Service | - | [Team] | PROD |
| [Application 1] | Application | [Service Name] | [Team] | PROD |
| [Database 1] | Database | [Application 1] | [Team] | PROD |

**Key CI Attributes**:
- `u_service_tier`: [1/2/3]
- `u_technology_stack`: [Languages/frameworks]
- `u_repository_url`: [GitHub URL]
- `u_health_check_url`: [Monitoring endpoint]

---

## 3. Service Level Agreements (SLAs)

### Availability SLA
[Derive from NFRs]

| Service Tier | Availability | Max Downtime/Month |
|--------------|--------------|-------------------|
| Tier 1 | 99.95% | 21.9 minutes |
| Tier 2 | 99.9% | 43.8 minutes |
| Tier 3 | 99.5% | 3.65 hours |

### Performance SLA
[Derive from NFRs]

| Transaction Type | Target (p95) | Target (p99) |
|------------------|--------------|--------------|
| [API GET] | [<500ms] | [<1000ms] |
| [API POST] | [<1000ms] | [<2000ms] |

### Support Coverage

| Support Tier | Hours | On-Call | Response Times |
|--------------|-------|---------|----------------|
| Critical (P1/P2) | 24/7 | Yes | P1: 15min, P2: 1hr |
| Standard (P3+) | Business hours | No | P3: 4hr, P4: 1 day |

---

## 4. Incident Management

### Priority Matrix

| Impact | Urgency High | Urgency Medium | Urgency Low |
|--------|--------------|----------------|-------------|
| **Critical** | P1 (15min/4hr) | P2 (1hr/8hr) | P3 (4hr/24hr) |
| **High** | P2 (1hr/8hr) | P3 (4hr/24hr) | P4 (1d/3d) |
| **Medium** | P3 (4hr/24hr) | P4 (1d/3d) | P4 (1d/5d) |
| **Low** | P4 (1d/3d) | P4 (1d/5d) | P5 (2d/10d) |

### Assignment Groups

| Category | Subcategory | Assignment Group | Escalation |
|----------|-------------|------------------|------------|
| [Service]-Auth | Login Issues | [Team]-Auth-L2 | [Team]-Auth-L3 |
| [Service]-API | 5xx Errors | [Team]-Backend-L2 | [Team]-Backend-L3 |
| [Service]-DB | Performance | DBA-Support | DBA-Senior |

### P1 Response Runbook
1. **Detection** (0-5min): Auto-create incident, page on-call
2. **Response** (5-15min): Acknowledge, join incident bridge
3. **Diagnosis** (15-60min): Check dashboards, review logs
4. **Mitigation** (60-240min): Fix or rollback
5. **Resolution**: Verify, close incident, schedule PIR

---

## 5. Change Management

### Change Categories

| Type | Approval | Lead Time | Downtime |
|------|----------|-----------|----------|
| Standard | Auto-approved | 1 hour | None |
| Normal | CAB | 5 days | Maintenance window |
| Emergency | ECAB | 2 hours | Allowed 24/7 |

### Maintenance Windows
- **Standard**: [Day] [Time UTC], e.g. Sunday 02:00-06:00 UTC
- **Blackout Periods**: [e.g., fiscal year-end, peak usage]

### Rollback Criteria
- [e.g., Error rate >5% for 10 minutes]
- [e.g., Response time >3s for 5 minutes]

---

## 6. Monitoring & Alerting

### Health Checks

| Component | Endpoint | Frequency | Alert Threshold |
|-----------|----------|-----------|-----------------|
| [App 1] | /health | 30s | HTTP non-200 OR >2s |
| [Database] | Connection | 60s | Connection fail |

### Key Metrics

| Metric | Threshold | Severity | Action |
|--------|-----------|----------|--------|
| Error Rate | >1% for 5min | P2 | Page on-call |
| Error Rate | >5% for 5min | P1 | Page on-call + manager |
| Response Time (p95) | >target for 10min | P3 | Create incident |
| CPU Usage | >80% for 15min | P3 | Auto-scale + alert |

### Dashboards
- **Operational**: [Grafana/Datadog URL] - Real-time service health
- **Business**: [BI tool URL] - Daily user/transaction metrics

---

## 7. Knowledge Management

### Required Runbooks
- [ ] Getting Started Guide (users)
- [ ] Troubleshooting Guide (users + support)
- [ ] Incident Response Runbook (operations)
- [ ] Deployment Procedure (operations)
- [ ] Rollback Procedure (operations)
- [ ] DR Recovery Procedure (operations)

**Review Schedule**: Runbooks reviewed quarterly, updated after major incidents

---

## 8. Go-Live Checklist

### ServiceNow Configuration
- [ ] Service CI created in CMDB with all child CIs
- [ ] Service Catalog entry published
- [ ] Incident categories and assignment groups configured
- [ ] SLA definitions configured
- [ ] Change templates created

### Documentation
- [ ] All runbooks written and tested
- [ ] User guides published
- [ ] Support team trained

### Monitoring
- [ ] Health checks configured
- [ ] Dashboards created
- [ ] Alert rules tested
- [ ] On-call rotation staffed

### Compliance
- [ ] DPIA completed (if processing PII)
- [ ] Security review passed
- [ ] Accessibility audit passed (WCAG 2.2 AA)
- [ ] ATRS published (if algorithmic system)

---

## 9. Requirements Traceability

| Requirement ID | Requirement | ServiceNow Element | Status |
|----------------|-------------|-------------------|--------|
| [NFR-001] | 99.9% uptime | Availability SLA | ✅ |
| [NFR-002] | <500ms response | Performance SLA | ✅ |
| [NFR-003] | P1 response 15min | Incident SLA | ✅ |

---

## 10. UK Government Compliance

### GDS Service Standard
- **Point 5**: WCAG 2.2 AA compliance monitored
- **Point 10**: Success metrics in ServiceNow dashboards
- **Point 13**: Reuse common platforms (GOV.UK Notify, Pay)

### ITIL v4 Practices
- **Plan**: Change Management (CAB)
- **Improve**: Post-Incident Reviews
- **Engage**: Service Catalog
- **Deliver & Support**: Incident Management, SLA monitoring

---

## Approval

| Role | Name | Date |
|------|------|------|
| Service Owner | [Name] | |
| Technical Lead | [Name] | |
| IT Operations Manager | [Name] | |

## External References

| Document | Type | Source | Key Extractions | Path |
|----------|------|--------|-----------------|------|
| *None provided* | — | — | — | — |

---

**Generated by**: ArcKit `/arckit.servicenow` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**Model**: [AI_MODEL]

