# Agile Governance Cadence Template

> Replaces the centralised Architecture Review Board with a distributed governance model. Governance is embedded in sprint rhythm, not a periodic gate.

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

### Revision History

| Version | Date | Author | Description | Reviewer | Approver |
|---------|------|--------|-------------|----------|----------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation | `[REVIEWER_NAME]` | `[APPROVER_NAME]` |

---

| Field | Value |
|---|---|
| **Issue** | `${user_config.project_issue_prefix}-128` — Agile Governance Cadence Template |
| **Parent** | `${user_config.references_dir}` — parent engagement reference, if any |
| **Organisation** | `${user_config.organisation_name}` |
| **Date** | 2026-08-12 |
| **Status** | Draft |
| **Author** | Enterprise Architecture Lead |
| **Owner** | Distributed (Team Architect + AI Safety Architect + Legal Counsel) |
| **Replaces** | Centralised Architecture Review Board (where applicable) |

## Why This Replaces the ARB

A centralised Architecture Review Board introduces a 2-3 day synchronous gate per engagement. In agile delivery that rhythm doesn't fit. This template distributes governance across four continuous cadences so that governance becomes part of how we work, not something we stop to do.

| Centralised ARB | Agile Governance Cadence |
|---|---|
| Centralized board of 4 people | Every team member owns their governance domain |
| Synchronous gate before delivery | Continuous checks embedded in sprint rhythm |
| 2-3 day review cycle | Automated checks every sprint + quarterly deep review |
| Checklist-driven | Metric-driven with architecture health score |
| Manual sign-off per engagement | Automated compliance pipeline with exception escalation |

## Cadence Overview

```text
Sprint (2 weeks)      → Sprint Architecture Review Checklist
Month                 → Architecture Debt Backlog Review
Quarter (3 months)    → Architecture Health Assessment
Continuous            → Compliance Monitoring + Automated Reporting
```

---

## 1. Sprint Architecture Review Checklist

Runs at sprint planning and sprint review. Lightweight — 15 minutes max.

### Pre-Sprint (Sprint Planning)

- [ ] **Architecture constraint check:** Any new features require architecture changes beyond current sprint scope?

- [ ] **Compliance impact scan:** Does the sprint backlog contain items that touch PII, cross-border data, or regulated workflows?

- [ ] **Model change review:** Any model updates (version, quantization, parameters) planned this sprint?

- [ ] **Architecture debt items:** Any debt reduction tasks included in sprint capacity?

**If any answer is yes → flag for Team Architect async review before sprint starts.**

### Post-Sprint (Sprint Review)

- [ ] **Architecture drift check:** Deployed changes match architecture documentation? (Auto-check: diff against `technology-architecture.yaml`)

- [ ] **Compliance verification:** Compliance pipeline passed for all deployed changes? (Auto-check: `governance-report.yaml` status)

- [ ] **Architecture debt logged:** Any shortcuts taken documented as architecture debt items?

- [ ] **Observability validated:** New components have latency, error rate, and GPU utilization metrics?

### Automation

Example automation (illustrative — wire your own CI tooling into this shape):

- **Pre-sprint compliance scan** — scan the sprint backlog against the compliance rule set for the target jurisdiction (AU, EU, etc.)

- **Post-sprint architecture drift check** — diff deployed configuration against the `technology-architecture.yaml` baseline

---

## 2. Architecture Debt Tracking

Architecture debt is anything that compromises the target architecture for short-term delivery speed. Different from technical debt — it affects the system's long-term compliance, scalability, or security posture.

### Debt Categories

| Category | Definition | Example |
|---|---|---|
| **Compliance debt** | Control not fully implemented | Temporary API endpoint without authentication |
| **Scalability debt** | Design won't scale to target load | Single-model serving without load balancing |
| **Security debt** | Security control deferred | No encryption on interim data store |
| **Observability debt** | Monitoring gap for critical component | New microservice without health endpoint |
| **Documentation debt** | Architecture docs behind reality | Technology architecture YAML not updated after deploy |

### Debt Register (YAML)

```yaml
# architecture-debt-register.yaml
debt_items:

  - id: "AD-001"
    category: "compliance_debt"
    severity: "high"     # critical | high | medium | low
    description: "API endpoint /internal/metrics lacks authentication"
    introduced_sprint: 12
    introduced_issue: "${user_config.project_issue_prefix}-045"
    risk_if_unresolved: "Unauthorized metric access violates APP 11.1"
    target_resolution_sprint: 14
    owner: "Founding Engineer"
    status: "open"       # open | in_progress | resolved | accepted_risk
    resolution_notes: ""

```

### Debt Review Rules

- **Critical severity:** Must be resolved within 2 sprints or escalated to CEO

- **High severity:** Must have resolution sprint assigned within 1 sprint

- **Medium/Low severity:** Track in architecture debt backlog; review monthly

- **Accepted risk:** Requires documented justification + sign-off from AI Safety Architect

### Monthly Debt Backlog Review

At the end of each calendar month, Team Architect reviews the debt register:

1. Export current debt register
2. Remove resolved items, update in-progress items
3. Flag any critical/high items exceeding resolution deadline
4. Report top 5 debt items in architecture health assessment

---

## 3. Quarterly Architecture Health Assessment

Comprehensive evaluation of the architecture's health. Replaces the ARB's ad-hoc review with a predictable quarterly cadence.

### Health Assessment Structure

```yaml
# quarterly-health-assessment.yaml
assessment:
  date: "2026-09-30"
  quarter: "Q3 2026"
  engagement: "Client Name / Internal Project"
  assessors:

    - role: "Team Architect"
      name: "Enterprise Architecture Lead"

    - role: "Technical Review"
      name: "Founding Engineer"

    - role: "Safety Review"
      name: "AI Safety Architect"

scores:
  architecture_alignment: 8  # 1-10: How close is deployed state to target architecture?
  compliance_maturity: 9     # 1-10: Are all required controls implemented and verified?
  observability_coverage: 7  # 1-10: Are critical components monitored with adequate metrics?
  documentation_currency: 6  # 1-10: Are architecture docs current with deployed state?
  security_posture: 9       # 1-10: Security controls adequate for threat model?
  debt_burden: 4            # 1-10: Lower is better — how much architecture debt is outstanding?

overall_health: "Good"  # Critical | Poor | Fair | Good | Excellent

findings:

  - category: "documentation_currency"
    severity: "medium"
    description: "Technology architecture YAML hasn't been updated since Sprint 10"
    recommendation: "Schedule documentation sync in Sprint 14"

improvements_quarter:

  - "Implemented GPU utilization alerting pipeline"

  - "Reduced architecture debt from 12 to 7 items"

risks_next_quarter:

  - "Model upgrade to Qwen3 requires architecture review — potential compliance impact"

```

### Scoring Rubric

| Score | Architecture Alignment | Compliance Maturity |
|---|---|---|
| 9-10 | Deployed state matches target architecture | All controls implemented, verified, automated |
| 7-8 | Minor deviations documented as accepted risk | Controls implemented, verification pending on 1-2 items |
| 5-6 | Significant deviation in 1-2 areas | 3+ controls not fully implemented |
| 3-4 | Major deviation across multiple areas | Critical controls missing or unverified |
| 1-2 | No alignment with target architecture | No governance process in place |

### Assessment Output

Each quarterly assessment produces:

1. `quarterly-health-assessment.yaml` — structured assessment data
2. Updated `governance-report.yaml` — merged assessment findings
3. Architecture debt register update
4. Improvement plan for next quarter (3-5 items max)

---

## 4. Continuous Compliance Monitoring

Automated compliance checks that run on every deployment and produce structured reports.

### Monitoring Pipeline

```text
Code/Config Change → Compliance Scan → Governance Report Update → Alert (if threshold breach)
```

### Automated Checks

| Check | Frequency | Tool | Alert Threshold |
|---|---|---|---|
| Encryption at rest | Every deploy | Compliance rule engine (your tooling) | Any unencrypted data store |
| Network egress | Continuous | Network policy monitor | Any public egress from data tier |
| Model provenance | Model deploy | Checksum verification | Checksum mismatch |
| API authentication | Every deploy | Architecture drift check (your CI tooling) | Unauthenticated endpoint |
| Data residency | Continuous | Infrastructure config scan | Data stored outside required jurisdiction |
| Audit log coverage | Weekly | Log analysis script | Component without audit logging |

### Governance Report Integration

Compliance monitoring output feeds directly into the `governance-report.yaml` structure:

```yaml
# governance-report.yaml (updated by compliance monitoring)
verification:
  checklist: "${user_config.safety_checklist_id}"
  score: 94
  critical_pass: true
  important_pass_rate: 0.95
  blocked_items: []

compliance_monitoring:
  last_check: "2026-08-12T10:30:00Z"
  checks_passed: 18
  checks_failed: 0
  checks_pending: 2
  details:

    - control: "encryption_at_rest_aes256"
      status: "pass"
      last_verified: "2026-08-12T10:30:00Z"

    - control: "network_egress_isolation"
      status: "pass"
      last_verified: "2026-08-12T10:30:00Z"

    - control: "model_provenance"
      status: "pending"
      reason: "Model upgrade pending — verification after deployment"

architecture_health:
  overall: "Good"
  scores:
    architecture_alignment: 8
    compliance_maturity: 9
    observability_coverage: 7
    documentation_currency: 6
    security_posture: 9
    debt_burden: 4
  debt_summary:
    open_items: 7
    critical: 0
    high: 1
    medium: 3
    low: 3

```

### Automated Reporting

Weekly automated report (scheduled via your CI/CD or agent runtime cron):

1. Run compliance scan across all active engagements
2. Update `governance-report.yaml` for each engagement
3. Generate executive summary (markdown) for Architecture Lead
4. Alert on any score drop below threshold or critical control failure

---

## 5. Distributed Governance Roles

No more Architecture Review Board. Governance ownership is distributed:

| Role | Governance Responsibility | Cadence |
|---|---|---|
| **Team Architect** (Enterprise Architecture Lead) | Sprint review checklist, quarterly health assessment, debt register | Every sprint + quarterly |
| **Founding Engineer** | Architecture drift detection, debt resolution, documentation updates | Continuous + sprint |
| **AI Safety Architect** | Safety control verification, model lifecycle governance, risk assessment | Every deploy + monthly |
| **Legal Counsel** | Regulatory alignment review, compliance mapping currency | Quarterly |
| **Every engineer** | Log architecture debt when taking shortcuts, flag compliance concerns | Continuous |

### Escalation Path

```text
Architecture concern → Team Architect (async, 24h) → AI Safety Architect (if safety impact) → CEO (if scope/risk exceeds team authority)
```

### Exception Handling

When a governance check fails but delivery timeline is critical:

1. Document exception in architecture debt register as `accepted_risk`
2. AI Safety Architect sign-off required for security/compliance exceptions
3. CEO sign-off required if exception affects client SLA
4. Resolution sprint assigned — exception auto-escalates if not resolved within deadline

---

## 6. Integration with TOGAF ADM

This cadence maps to TOGAF ADM phases G and H (continuous):

| TOGAF ADM Phase | Agile Cadence Mapping |
|---|---|
| **G — Implementation Governance** | Sprint review checklist + compliance monitoring |
| **H — Architecture Change Management** | Architecture debt register + quarterly health assessment |
| **ADM cycle repeat** | Quarterly health assessment triggers re-evaluation of target architecture |

---

## 7. Trigger Guidance

**Use this template when:**

- Client engagement follows agile delivery (sprints, iterations)

- Architecture needs continuous validation rather than periodic gates

- Team is distributed and synchronous ARB meetings are impractical

- Compliance requires ongoing monitoring, not one-time certification

**Use traditional ARB (ADR-003) when:**

- Client requires formal governance board with documented sign-off per phase

- Regulatory environment mandates board-level architecture approval

- Engagement is waterfall/phase-gate delivery model

---

## References

- ${user_config.references_dir} — organisation reference documents (e.g. TOGAF ADM workflow, AI governance framework, compliance validation pipeline); include only documents that exist in the configured directory

- `governance-report.yaml`: Governance report structure (Phase G governance)

- `${user_config.safety_checklist_id}`: Safety checklist integrated into compliance monitoring

---

## External References

### Document Register

| Doc ID | Filename | Type | Source Location | Description |
|--------|----------|------|-----------------|-------------|
| *None provided* | — | — | — | — |

### Citations

| Citation ID | Doc ID | Page/Section | Category | Quoted Passage |
|-------------|--------|--------------|----------|----------------|
| — | — | — | — | — |

### Unreferenced Documents

| Filename | Source Location | Reason |
|----------|-----------------|--------|
| — | — | — |

---

**Generated by**: ArcKit `/arckit:agile-governance` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
