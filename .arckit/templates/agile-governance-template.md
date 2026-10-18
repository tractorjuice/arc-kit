# Agile Governance Cadence Template

> Replaces the centralised Architecture Review Board with a small cross-functional sprint review panel drawn from the product team, and distributes continuous governance duties across its members. Governance is embedded in sprint rhythm, not a periodic gate.

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
| **Parent** | `${user_config.references_dir}` — parent engagement reference, if any |
| **Organisation** | `${user_config.organisation_name}` |
| **Governance owner** | Sprint review panel (section 1), with continuous duties distributed across its members (section 7) |
| **Replaces** | Centralised Architecture Review Board (where applicable) |

## Why This Replaces the ARB

A centralised Architecture Review Board introduces a 2-3 day synchronous gate per engagement. In agile delivery that rhythm doesn't fit. This template moves decisions to a 3-5 person sprint review panel drawn from the product team, and spreads governance across four continuous cadences so that governance becomes part of how we work, not something we stop to do.

| Centralised ARB | Agile Governance Cadence |
|---|---|
| Central board outside the delivery team | 3-5 person sprint review panel drawn from the product team; each member also owns a governance domain |
| Synchronous gate before delivery | Pre-, mid- and post-sprint checks embedded in sprint rhythm |
| 2-3 day review cycle | Change requests decided within the sprint + quarterly deep review |
| Checklist-driven | Metric-driven with architecture health score |
| Manual sign-off per engagement | Automated compliance pipeline with exception escalation |

**Conditions for reverting to a board:** regulation mandates board-level architecture approval, decisions repeatedly exceed the panel's authority, or delivery moves to a phase-gate model (see section 9).

## Cadence Overview

```text
Sprint (2 weeks)      → Sprint review panel: pre-, mid- and post-sprint checks; change requests decided
Month                 → Architecture Debt Backlog Review
Quarter (3 months)    → Architecture Health Assessment
Continuous            → Compliance Monitoring + Automated Reporting
```

| Cadence event | Input | Output artefact | Owner |
|---|---|---|---|
| Pre-sprint check | Sprint backlog | Flagged items for async architecture review | Lead Architect |
| Mid-sprint check | Work in progress, pipeline results | Health check note; blockers raised | Lead Architect |
| Post-sprint check | Deployed changes, pipeline results | Updated `governance-report.yaml`, `compliance-evidence.yaml` | Sprint review panel |
| Change request decision | `change-request.yaml` | Decision recorded in the change log | Sprint review panel |
| Monthly debt review | Debt register | Updated debt register | Lead Architect |
| Quarterly health assessment | Governance reports, debt register | `quarterly-health-assessment.yaml` | Sprint review panel + Compliance Representative |
| Continuous monitoring | Deployments, configuration | `governance-report.yaml` updates and alerts | DevOps Lead |

---

## 1. Sprint Review Panel

A lightweight, cross-functional panel replaces the board. Its members belong to the product team; decision authority, responsibility and accountability sit with them (O-AA Axiom 7, Authority, Responsibility, and Accountability Distribution).

| Member | Perspective | Decides |
|---|---|---|
| Product Owner | Value and priority | Trade-offs between architecture work and features |
| Lead Architect | Architecture integrity | Changes within the product's guardrails |
| AI Safety Engineer | Model safety and data governance | Safety and model-lifecycle changes |
| DevOps Lead | Operability | Infrastructure and deployment changes |
| Compliance Representative | Regulatory obligations | Whether a change needs regulatory review |

### Decision Authority Matrix

| Decision | Panel decides | Escalate to |
|---|---|---|
| Change within existing guardrails | Yes | — |
| New technology inside approved building blocks | Yes | — |
| Change to a guardrail or cross-product contract | No | Cross-product architecture forum |
| Accepting a Critical or High risk | No | Executive sponsor |
| Change affecting a client SLA or budget | No | Executive sponsor |

---

## 2. Sprint Architecture Review Checklist

Runs at sprint planning, mid-sprint and sprint review. Lightweight — 15 minutes max per check.

### Pre-Sprint (Sprint Planning)

- [ ] **Architecture constraint check:** Any new features require architecture changes beyond current sprint scope?

- [ ] **Compliance impact scan:** Does the sprint backlog contain items that touch PII, cross-border data, or regulated workflows?

- [ ] **Model change review:** Any model updates (version, quantization, parameters) planned this sprint?

- [ ] **Architecture debt items:** Any debt reduction tasks included in sprint capacity?

**If any answer is yes → flag for Lead Architect async review before sprint starts.**

### Mid-Sprint (Health Check)

- [ ] **Pipeline health:** Security and compliance checks passing on the main branch?

- [ ] **Emerging decisions:** Any architecturally significant decision taken in flight that needs a change request or ADR?

- [ ] **Blockers:** Any architecture or compliance blocker that needs a panel decision before sprint review?

**If any answer needs a decision → raise it with the panel now, not at sprint end.**

### Post-Sprint (Sprint Review)

- [ ] **Architecture drift check:** Deployed changes match architecture documentation? (Auto-check: diff against `technology-architecture.yaml`)

- [ ] **Compliance verification:** Compliance pipeline passed for all deployed changes? (Auto-check: `governance-report.yaml` status)

- [ ] **Compliance evidence current:** `compliance-evidence.yaml` updated for this sprint's deliverables?

- [ ] **Architecture debt logged:** Any shortcuts taken documented as architecture debt items?

- [ ] **Observability validated:** New components have latency, error rate, and GPU utilization metrics?

### Gate Criteria

| Check | Pass | Fail → remediation |
|---|---|---|
| Pre-sprint | No unflagged architecture or compliance impact | Item held until the Lead Architect reviews it |
| Mid-sprint | Pipelines green; no undecided significant decision | Panel decides within 2 working days |
| Post-sprint | No unapproved drift; compliance evidence current | Debt item or exception raised (sections 4 and 7) |

### Automation

Example automation (illustrative — wire your own CI tooling into this shape):

- **Pre-sprint compliance scan** — scan the sprint backlog against the compliance rule set for the target jurisdiction (AU, EU, etc.)

- **Post-sprint architecture drift check** — diff deployed configuration against the `technology-architecture.yaml` baseline

---

## 3. Change Management at Sprint Velocity

Architecture change requests are evaluated and decided within the sprint, not held for a quarterly board.

```yaml
# change-request.yaml — one per change request
change_request:
  id: "CR-[NNN]"
  raised_sprint: "[N]"
  raised_by: "[role]"
  title: "Replace vector store with managed service"
  type: "technology"        # technology | data | integration | security | process
  impact:
    components: ["vector_store", "retriever"]
    compliance: "Data residency must be re-verified for the managed service"
    effort_story_points: 13
  options_considered: ["Keep self-hosted", "Managed service in the same region"]
  decision: "approved"      # approved | rejected | deferred | escalated
  decided_by: "Sprint review panel"
  decided_sprint: "[N]"
  adr: "ARC-[PROJECT_ID]-ADR-[NNN]"
```

| Step | Target |
|---|---|
| Change request raised | Any team member, any time |
| Impact assessed (architecture, compliance, effort) | Within 2 working days |
| Decision | At the next panel check, within the same sprint |
| Change log updated | At sprint review, linked to the ADR |

---

## 4. Architecture Debt Tracking

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
    introduced_issue: "${user_config.project_issue_prefix}-[NNN]"
    risk_if_unresolved: "Unauthorized metric access violates APP 11.1"
    target_resolution_sprint: 14
    owner: "Lead Engineer"
    status: "open"       # open | in_progress | resolved | accepted_risk
    resolution_notes: ""

```

### Debt Review Rules

- **Critical severity:** Must be resolved within 2 sprints or escalated to the executive sponsor

- **High severity:** Must have resolution sprint assigned within 1 sprint

- **Medium/Low severity:** Track in architecture debt backlog; review monthly

- **Accepted risk:** Requires documented justification + sign-off from the AI Safety Engineer (safety or compliance debt) or the Lead Architect (other debt)

### Monthly Debt Backlog Review

At the end of each calendar month, the Lead Architect reviews the debt register:

1. Export current debt register
2. Remove resolved items, update in-progress items
3. Flag any critical/high items exceeding resolution deadline
4. Report top 5 debt items in architecture health assessment

---

## 5. Quarterly Architecture Health Assessment

Comprehensive evaluation of the architecture's health. Replaces the ARB's ad-hoc review with a predictable quarterly cadence.

### Health Assessment Structure

```yaml
# quarterly-health-assessment.yaml
assessment:
  date: "[YYYY-MM-DD]"
  quarter: "[QN YYYY]"
  engagement: "[Client Name / Internal Project]"
  assessors:

    - role: "Lead Architect"
      name: "[Name]"

    - role: "Technical Review"
      name: "[Lead Engineer]"

    - role: "Safety Review"
      name: "[AI Safety Engineer]"

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

  - "Planned model upgrade requires architecture review — potential compliance impact"

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

## 6. Continuous Compliance Monitoring and Evidence

Automated compliance checks that run on every deployment and produce structured reports. Compliance evidence is produced every sprint, so the programme is always audit-ready.

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

### Compliance Evidence Framework

Evidence categories: regulatory compliance, security controls, architecture standards and quality gates. The `compliance-evidence.yaml` structure is shared with `/arckit:agile-security`, which produces the security-control evidence:

```yaml
# compliance-evidence.yaml (sprint 4)
sprint: 4
owner: "[Compliance Representative]"
evidence:

  - control: "APP-11.1 encryption_at_rest"
    category: "security_control"     # regulatory | security_control | architecture_standard | quality_gate
    requirement: "NFR-SEC-003"
    artefact: "CI job storage-encryption-audit, run [RUN_ID]"
    result: "pass"
    collected: "[YYYY-MM-DD]"

  - control: "Architecture standard: no cross-product database access"
    category: "architecture_standard"
    requirement: "GR-003"
    artefact: "Drift check, sprint 4"
    result: "pass"
    collected: "[YYYY-MM-DD]"

```

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
  last_check: "[YYYY-MM-DDThh:mm:ssZ]"
  checks_passed: 18
  checks_failed: 0
  checks_pending: 2
  details:

    - control: "encryption_at_rest_aes256"
      status: "pass"
      last_verified: "[YYYY-MM-DDThh:mm:ssZ]"

    - control: "network_egress_isolation"
      status: "pass"
      last_verified: "[YYYY-MM-DDThh:mm:ssZ]"

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
3. Generate executive summary (markdown) for the Lead Architect
4. Alert on any score drop below threshold or critical control failure

### Governance Metrics

| Metric | Definition | Target |
|---|---|---|
| Decision velocity | Average time from change request to decision | Within the sprint it was raised |
| Compliance rate | Percentage of sprint deliverables passing governance checks | ≥ 95% |
| Architecture debt | Open debt items, and items past their resolution sprint | Decreasing trend; 0 critical past deadline |
| Risk exposure | Open accepted-risk exceptions and their age | 0 exceptions past their resolution deadline |

---

## 7. Distributed Governance Duties

Panel members, and every engineer, carry continuous governance duties between panel checks:

| Role | Governance Responsibility | Cadence |
|---|---|---|
| **Lead Architect** | Sprint review checklist, quarterly health assessment, debt register | Every sprint + quarterly |
| **Lead Engineer** | Architecture drift detection, debt resolution, documentation updates | Continuous + sprint |
| **AI Safety Engineer** | Safety control verification, model lifecycle governance, risk assessment | Every deploy + monthly |
| **DevOps Lead** | Continuous compliance monitoring, automated reporting | Continuous + weekly |
| **Compliance Representative** | Regulatory alignment review, compliance evidence currency | Every sprint + quarterly |
| **Every engineer** | Log architecture debt when taking shortcuts, flag compliance concerns | Continuous |

### Escalation Path

```text
Architecture concern → Lead Architect (async, 24h) → Sprint review panel (decides within the sprint) → Executive sponsor (if scope or risk exceeds panel authority)
```

| Tier | Decision it can take |
|---|---|
| Lead Architect | Clarify guardrails; approve changes clearly inside them |
| Sprint review panel | Decisions in the authority matrix (section 1) |
| Executive sponsor | Accept Critical/High risk; approve scope, SLA or budget changes |

### Exception Handling

When a governance check fails but delivery timeline is critical:

1. Document exception in architecture debt register as `accepted_risk`, with its type (architecture, compliance or security)
2. AI Safety Engineer sign-off required for security/compliance exceptions
3. Executive sponsor sign-off required if exception affects client SLA
4. Resolution sprint assigned — exception auto-escalates if not resolved within deadline
5. Open exceptions are reviewed at every post-sprint check

---

## 8. Integration with TOGAF ADM

This cadence maps to TOGAF ADM phases G and H (continuous):

| TOGAF ADM Phase | Agile Cadence Mapping |
|---|---|
| **G — Implementation Governance** | Sprint review checklist + compliance monitoring |
| **H — Architecture Change Management** | Change requests decided by the panel, architecture debt register + quarterly health assessment |
| **ADM cycle repeat** | Quarterly health assessment triggers re-evaluation of target architecture |

---

## 9. Trigger Guidance

**Use this template when:**

- Client engagement follows agile delivery (sprints, iterations)

- Architecture needs continuous validation rather than periodic gates

- Team is distributed and synchronous ARB meetings are impractical

- Compliance requires ongoing monitoring, not one-time certification

**Use a traditional architecture board (for example `/arckit:architecture-board` from the TOGAF ADM overlay) when:**

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
