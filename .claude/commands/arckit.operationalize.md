---
description: Create operational readiness pack with support model, runbooks, DR/BCP, on-call, and handover documentation
---

# /arckit.operationalize - Operational Readiness Command

You are an expert Site Reliability Engineer (SRE) and IT Operations consultant with deep knowledge of:
- SRE principles (SLIs, SLOs, error budgets, toil reduction)
- ITIL v4 service management practices
- DevOps and platform engineering best practices
- Incident management and on-call operations
- Disaster recovery and business continuity planning
- UK Government GDS Service Standard and Technology Code of Practice

## Command Purpose

Generate a comprehensive **Operational Readiness Pack** that prepares a service for production operation. This command bridges the gap between development completion and live service operation, ensuring the operations team has everything needed to support the service.

## When to Use This Command

Use `/arckit.operationalize` after completing:
1. Requirements (`/arckit.requirements`) - for SLA targets
2. Architecture diagrams (`/arckit.diagram`) - for component inventory
3. HLD/DLD review (`/arckit.hld-review` or `/arckit.dld-review`) - for technical details
4. Data model (`/arckit.data-model`) - for data dependencies

Run this command **before go-live** to ensure operational readiness. This is complementary to `/arckit.servicenow` (which focuses on ITSM tooling) - this command focuses on the operational practices and documentation.

## User Input

```text
$ARGUMENTS
```

Parse the user input for:
- Service/product name
- Service tier (Critical/Important/Standard)
- Support model preference (24/7, follow-the-sun, business hours)
- Specific operational concerns
- Target go-live date (if mentioned)

## Instructions

### Phase 1: Context Gathering

First, read existing project artifacts to understand the service:

**Required Files**:
1. `projects/{project-name}/requirements.md` - NFRs for availability, performance, recovery
2. `.arckit/memory/architecture-principles.md` - Operational principles
3. `projects/{project-name}/diagrams/` - Architecture components

**Optional Files** (read if available):
4. `projects/{project-name}/risk-register.md` - Operational risks
5. `projects/{project-name}/data-model.md` - Data dependencies, backup requirements
6. `projects/{project-name}/servicenow-design.md` - ITSM integration
7. `projects/{project-name}/stakeholder-drivers.md` - Stakeholder expectations

**IMPORTANT**: Do not proceed until you have read the requirements and architecture files.

### Phase 2: Analysis

Extract operational requirements from artifacts:

**From Requirements (NFRs)**:
- **NFR-A-xxx (Availability)** → SLO targets, on-call requirements
- **NFR-P-xxx (Performance)** → SLI definitions, monitoring thresholds
- **NFR-S-xxx (Scalability)** → Capacity planning, auto-scaling rules
- **NFR-SEC-xxx (Security)** → Security runbooks, access procedures
- **NFR-C-xxx (Compliance)** → Audit requirements, retention policies

**From Architecture**:
- Components → Runbook inventory (one runbook per major component)
- Dependencies → Upstream/downstream escalation paths
- Data flows → Backup/restore procedures
- Deployment topology → DR site requirements

**Service Tier Mapping**:
| Tier | Availability | RTO | RPO | Support | On-Call |
|------|-------------|-----|-----|---------|---------|
| Critical | 99.95%+ | <1hr | <15min | 24/7 | Yes, immediate |
| Important | 99.9% | <4hr | <1hr | 24/7 | Yes, 15min response |
| Standard | 99.5% | <24hr | <4hr | Business hours | Best effort |

### Phase 3: Generate Operational Readiness Pack

Read the template from `.arckit/templates/operationalize-template.md` and generate a comprehensive operational readiness document.

**Section 1: Service Overview**
- Service name, description, business criticality
- Service tier with justification from NFRs
- Key stakeholders (service owner, technical lead, operations lead)
- Dependencies (upstream services this relies on, downstream consumers)

**Section 2: Service Level Objectives (SLOs)**
- Define 3-5 SLIs (Service Level Indicators) based on NFRs
- Set SLO targets (e.g., "99.9% of requests complete in <500ms")
- Calculate error budgets (e.g., "43.8 minutes downtime/month allowed")
- Define SLO breach response procedures

**Section 3: Support Model**
- Support tiers (L1 Service Desk, L2 Application Support, L3 Engineering)
- Escalation matrix with contact details and response times
- On-call rotation structure (primary, secondary, escalation)
- Handoff procedures for follow-the-sun models (if applicable)
- Out-of-hours support procedures

**Section 4: Monitoring & Observability**
- Health check endpoints and expected responses
- Key metrics to monitor (latency, error rate, throughput, saturation)
- Dashboard locations and purposes
- Log aggregation and search (where to find logs, retention)
- Distributed tracing (if applicable)
- Synthetic monitoring / uptime checks

**Section 5: Alerting Strategy**
- Alert routing rules (who gets paged for what)
- Alert severity definitions (P1-P5 mapping)
- Alert fatigue prevention (grouping, deduplication, suppression windows)
- PagerDuty/Opsgenie/VictorOps configuration (or equivalent)
- Escalation timeouts

**Section 6: Runbooks**
Generate runbooks for:
- **Service Start/Stop** - How to gracefully start and stop the service
- **Health Check Failures** - Steps when health checks fail
- **High Error Rate** - Diagnosis and mitigation for elevated errors
- **Performance Degradation** - Steps when response times exceed SLO
- **Capacity Issues** - Scaling procedures (manual and automatic)
- **Security Incident** - Initial response for security events
- **Dependency Failure** - What to do when upstream services fail

Each runbook must include:
1. **Purpose**: What problem this runbook addresses
2. **Prerequisites**: Access, tools, knowledge required
3. **Detection**: How you know this runbook is needed
4. **Steps**: Numbered, specific, actionable steps
5. **Verification**: How to confirm the issue is resolved
6. **Escalation**: When and how to escalate
7. **Rollback**: How to undo changes if needed

**Section 7: Disaster Recovery (DR)**
- DR strategy (active-active, active-passive, pilot light, backup-restore)
- Recovery Time Objective (RTO) from NFRs
- Recovery Point Objective (RPO) from NFRs
- DR site details (region, provider, sync mechanism)
- Failover procedure (step-by-step)
- Failback procedure (step-by-step)
- DR test schedule and last test date

**Section 8: Business Continuity (BCP)**
- Business impact analysis summary
- Critical business functions supported
- Manual workarounds during outage
- Communication plan (who to notify, how, when)
- BCP activation criteria
- Recovery priorities

**Section 9: Backup & Restore**
- Backup schedule (full, incremental, differential)
- Backup retention policy
- Backup verification procedures
- Restore procedures (step-by-step)
- Point-in-time recovery capability
- Backup locations (primary, offsite)

**Section 10: Capacity Planning**
- Current capacity baseline (users, transactions, storage)
- Growth projections (6mo, 12mo, 24mo)
- Scaling thresholds and triggers
- Capacity review schedule
- Cost implications of scaling

**Section 11: Security Operations**
- Access management (who can access what, how to request)
- Secret/credential rotation procedures
- Security patching schedule
- Vulnerability scanning frequency
- Penetration testing schedule
- Security incident response contacts

**Section 12: Deployment & Release**
- Deployment frequency and windows
- Deployment procedure summary
- Rollback procedure
- Feature flag management
- Database migration procedures
- Blue-green or canary deployment details

**Section 13: Knowledge Transfer & Training**
- Training materials required
- Training schedule for operations team
- Knowledge base articles to create
- Subject matter experts and contacts
- Ongoing learning requirements

**Section 14: Handover Checklist**
Comprehensive checklist for production handover:
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

**Section 15: Operational Metrics**
- MTTR (Mean Time to Recovery) target
- MTBF (Mean Time Between Failures) target
- Change failure rate target
- Deployment frequency target
- Toil percentage target (<50%)

**Section 16: UK Government Considerations** (if applicable)
- GDS Service Standard Point 14 (operate a reliable service)
- NCSC operational security guidance
- Cross-government service dependencies (GOV.UK Notify, Pay, Verify)
- Cabinet Office Technology Code of Practice compliance

**Section 17: Traceability**
- Map each operational element to source requirements
- Link runbooks to architecture components
- Connect SLOs to stakeholder expectations

### Phase 4: Validation

Before saving, verify:

**Completeness**:
- [ ] Every NFR has corresponding SLO/SLI
- [ ] Every major component has a runbook
- [ ] DR/BCP procedures documented
- [ ] On-call rotation defined
- [ ] Escalation paths clear
- [ ] Training plan exists

**Quality**:
- [ ] Runbooks have specific commands (not generic placeholders)
- [ ] Contact details specified (even if placeholder format)
- [ ] RTO/RPO align with NFRs
- [ ] Support model matches service tier

### Phase 5: Output

**CRITICAL - Use Write Tool**:
Operational readiness packs are large documents (400+ lines). Use the Write tool to save the document to avoid token limits.

1. **Save the file** to `projects/{project-name}/operational-readiness.md`

2. **Provide summary** to user:
```
✅ Operational Readiness Pack generated!

**Service**: [Name]
**Service Tier**: [Critical/Important/Standard]
**Availability SLO**: [X.XX%] (Error budget: [X] min/month)
**RTO**: [X hours] | **RPO**: [X hours]

**Support Model**:
- [24/7 / Business Hours]
- On-call: [Yes/No]
- L1 → L2 → L3 escalation defined

**Runbooks Created**: [N] runbooks
- Service Start/Stop
- Health Check Failures
- High Error Rate
- [etc.]

**DR Strategy**: [Active-Passive / etc.]
- Last DR test: [Date or "Not yet tested"]

**Handover Readiness**: [X/Y] checklist items complete

**File**: projects/{project-name}/operational-readiness.md

**Next Steps**:
1. Review SLOs with service owner
2. Complete handover checklist items
3. Schedule DR test if not done recently
4. Train operations team
5. Conduct operational readiness review meeting
```

3. **Flag gaps**:
- Missing NFRs (defaulted values used)
- Untested DR procedures
- Incomplete runbooks
- Missing on-call coverage

## Error Handling

### If Requirements Not Found:
"⚠️ Cannot find requirements.md. Please run `/arckit.requirements` first. Operational readiness requires NFRs for SLO definitions."

### If No Architecture Diagrams:
"⚠️ Cannot find architecture diagrams. Runbooks require component inventory. Please run `/arckit.diagram container` first."

### If No Availability NFR:
"⚠️ No availability NFR found. Defaulting to 99.5% (Tier 3 Standard). Specify if higher availability required."

## Key Principles

### 1. SRE-First Approach
- Define SLIs before SLOs before alerts
- Error budgets drive operational decisions
- Toil reduction is a goal

### 2. Actionable Runbooks
- Every runbook must have specific, numbered steps
- Include actual commands, not "restart the service"
- Verification steps are mandatory

### 3. Realistic RTO/RPO
- RTO/RPO must match architecture capability
- Don't promise <1hr RTO without DR automation
- DR procedures must be tested

### 4. Human-Centric Operations
- On-call should be sustainable (no burnout)
- Escalation paths must be clear
- Training and handover are essential

### 5. Continuous Improvement
- Regular runbook reviews (quarterly)
- Post-incident reviews drive improvements
- Capacity planning is ongoing

## Document Control

**Auto-populate**:
- `[PROJECT_ID]` → From project path
- `[VERSION]` → "1.0" for new documents
- `[DATE]` → Current date (YYYY-MM-DD)
- `ARC-[PROJECT_ID]-OPS-v[VERSION]` → Document ID

**Generation Metadata Footer**:
```markdown
---
**Generated by**: ArcKit `/arckit.operationalize` command
**Generated on**: [DATE]
**ArcKit Version**: [VERSION]
**Project**: [PROJECT_NAME]
**AI Model**: [Model name]
```
