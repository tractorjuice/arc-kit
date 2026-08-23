# Agile Security Architecture Template

> Security embedded in every sprint/iteration. Risk-based testing automation, compliance-as-code integration, continuous validation replacing phase-gate checkpoints. Aligned with O-AA Security Playbook (G216).

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
| **Template** | Agile Security Architecture |
| **Framework** | O-AA Security Playbook (G216) + TOGAF ADM |
| **Parent** | `${user_config.references_dir}` — parent engagement reference, if any |
| **Organisation** | `${user_config.organisation_name}` |
| **Issue** | `${user_config.project_issue_prefix}-127` — Agile Security Architecture Template |
| **Date** | 2026-08-12 |
| **Status** | Draft |
| **Author** | Enterprise Architecture Lead |
| **Prerequisites** | ADR-001 (Executable TOGAF ADM), ADR-003 (AI Governance Framework) |
| **Integrates with** | `governance-report.yaml`, `compliance-mapping.yaml`, ADR-005 (Compliance Validation Pipeline) |

---

## Trigger Guidance

Use this template when **any** of the following conditions are met:

- Client operates in a **regulated environment** (APRA, GDPR, HIPAA, EU AI Act) and delivery follows agile sprints

- Security cannot wait for end-of-project gates — **continuous validation** is required

- Team needs to embed security activities into **sprint ceremonies** (planning, review, retrospective)

- Compliance evidence must be generated **automatically** alongside code delivery

**Do NOT use** when:

- Security assessment is a standalone, one-off engagement (use the standalone compliance validation pipeline described in your ADR-005 reference document instead)

- Client requires traditional waterfall security reviews with formal sign-off gates at each phase

- No CI/CD pipeline exists to host automated security checks

---

## Core Thesis (G216)

The O-AA Security Playbook (G216) frames the problem this way: security in an agile architecture must let the business move rapidly in a world of defined and managed risk.

Traditional security architectures insert phase-gate checkpoints that slow delivery. This template replaces those gates with **four continuous security pillars** that operate alongside the sprint rhythm:

1. **Embedded security** — security tasks in every sprint backlog, not a separate track
2. **Risk-based automation** — test depth proportional to risk classification, not uniform coverage
3. **Compliance-as-code** — regulatory controls expressed as executable validation rules
4. **Continuous validation** — real-time compliance evidence, not periodic audit snapshots

---

## Security Pillars

### Pillar 1: Embedded Security Per Sprint

Security is not a phase — it is woven into every sprint ceremony.

| Sprint Phase | Security Activity | Owner | Duration |
|---|---|---|---|
| Sprint Planning | Security story estimation + risk classification | Team Architect + Security Lead | 15 min |
| Daily Standup | Security blocker check (automated scan failures) | Team Lead | Continuous |
| Sprint Execution | Automated security scans run alongside feature tests | CI/CD Pipeline | Automated |
| Sprint Review | Security validation report review + compliance evidence | Security Lead | 30 min |
| Sprint Retrospective | Security debt review + control improvement items | Team | 15 min |

### Sprint Planning: Security Story Estimation

Every sprint backlog includes security stories alongside feature stories:

```yaml
# sprint-backlog example with security items
sprint: "Sprint 4"
stories:

  - id: "FE-012"
    type: feature
    title: "Implement RAG pipeline for document retrieval"
    security_impact: high
    security_stories: ["SEC-045", "SEC-046"]

  - id: "SEC-045"
    type: security
    title: "Implement input sanitization for RAG query endpoint"
    risk_category: data_exfiltration
    control: "input_validation"
    auto_test: "security/test_input_sanitization.py"

  - id: "SEC-046"
    type: security
    title: "Add rate limiting to prevent RAG abuse"
    risk_category: availability
    control: "rate_limiting"
    auto_test: "security/test_rate_limiting.py"

```

**Security story criteria:**

- Each security story has a **risk category** (data_exfiltration, model_poisoning, prompt_injection, unauthorized_access, availability)

- Each security story references a **compliance control** from the compliance mapping

- Each security story has an **automated test** that runs in CI/CD

---

### Pillar 2: Risk-Based Security Testing Automation

Not all code paths need equal security scrutiny. Test depth is proportional to risk classification.

```text
Risk Level ──→  │  Critical       │  High          │  Medium        │  Low
────────────────────────────────────────────────────────────────────────
Scan Frequency │  Every commit    │  Every PR       │  Sprint gate   │  Weekly
Test Depth     │  SAST + DAST +   │  SAST + config  │  SAST only     │  License check
               │  secrets + deps  │  audit          │                │
Approval      │  Security lead    │  Team lead      │  Auto-merge    │  None
               │  sign-off        │  review         │                │
Block Merge   │  Always           │  On failure     │  Warning only  │  Warning only

```

**Risk classification rules:**

- **Critical:** Model serving endpoints, data egress paths, authentication/authorization logic

- **High:** API gateways, data processing pipelines, configuration management

- **Medium:** Internal utilities, logging/monitoring components, documentation

- **Low:** Frontend assets, static content, build scripts

**Risk-based scan pipeline (illustrative — wire your own tooling into this shape):**

- **Critical paths** — every commit; block on failure

- **High paths** — every PR; require security review

- **Medium paths** — sprint gate; warn only

- **Low paths** — weekly scan; report only

**Security test categories:**

| Category | Tool/Method | Frequency | Block Merge |
|---|---|---|---|
| SAST (Static Analysis) | Bandit (Python), ESLint security (JS) | Every commit | Critical/High |
| Secret Detection | Gitleaks, TruffleHog | Every commit | Critical |
| Dependency Vulnerabilities | Safety (Python), npm audit (JS) | Every PR | Critical/High |
| DAST (Dynamic Analysis) | OWASP ZAP, custom endpoint tests | Sprint gate | Critical |
| Infrastructure as Code | Checkov (Terraform), Hadolint (Docker) | Every PR | Critical/High |
| Container Scanning | Trivy, Grype | Every image build | Critical |
| Model Safety | Prompt injection test suite, output filter tests | Model update | Critical |
| Compliance Validation | Compliance rule engine (your tooling) | Sprint gate | Critical |

---

### Pillar 3: Compliance-as-Code Integration Points

Regulatory controls are expressed as executable validation rules, not documentation.

```yaml
# compliance-as-code.yaml
controls:

  - id: "APP-11.1"
    description: "Data security measures"
    jurisdiction: AU
    validation:

      - rule: "encryption_at_rest"
        check: "storage encryption audit (all storage tiers)"
        expected: "AES-256"

      - rule: "encryption_in_transit"
        check: "TLS version enforcement check (all endpoints)"
        expected: "TLS 1.3+"

      - rule: "network_isolation"
        check: "network egress audit (data tier)"
        expected: "no_public_egress"
    auto_verify: true
    sprint_gate: true

```

**Integration with governance-report.yaml:**

The compliance-as-code pipeline feeds directly into `governance-report.yaml`:

```yaml
# governance-report.yaml — security validation section
security_validation:
  timestamp: "2026-08-12T10:00:00Z"
  sprint: 4
  scan_results:
    sast:
      status: passed
      critical_findings: 0
      high_findings: 2
      tool: bandit
    secrets:
      status: passed
      findings: 0
      tool: gitleaks
    dependencies:
      status: warning
      critical_findings: 0
      high_findings: 0
      medium_findings: 3
      tool: safety
    compliance:
      status: partial
      controls_checked: 23
      controls_passed: 18
      controls_gapped: 5
      tool: "compliance rule engine"
  compliance_as_code:

    - control: "APP-11.1"
      status: passed
      verification: "encryption audit + network egress test"

    - control: "APRA-CPS230"
      status: gap
      pending_items: ["network_segmentation", "threat_monitoring"]

    - control: "GDPR-32"
      status: gap
      pending_items: ["backup_and_recovery", "security_testing_annual"]
  next_sprint_security_goals:

    - "Close network_segmentation gap (SEC-050)"

    - "Deploy threat monitoring stack (SEC-051)"

    - "Resolve 3 medium dependency vulnerabilities"

```

---

### Pillar 4: Continuous Security Validation (Replacing Phase Gates)

Traditional TOGAF ADM Phase G (Implementation Governance) runs at the end. This template distributes governance validation across the sprint cycle.

| Phase Gate (Traditional) | Continuous Replacement | Evidence |
|---|---|---|
| Security review before deployment | Automated security scans on every PR | CI/CD pipeline results |
| Compliance audit before go-live | Compliance-as-code checks every sprint | `governance-report.yaml` updates |
| Penetration test at project end | DAST on staging every sprint + annual external test | Scan reports + test logs |
| Security sign-off from board | Security validation report at sprint review | Sprint review notes |
| Architecture compliance check | Architecture drift detection (auto-diff) | `technology-architecture.yaml` diff |

**Continuous validation pipeline (runs automatically at sprint gate, end of sprint):**

1. Aggregate the sprint's security scan results into `security-report.yaml`

2. Run compliance validation against the control set → `compliance-results.yaml`

3. Merge both into `governance-report.yaml`

4. Architecture drift check: diff deployed configuration against the `technology-architecture.yaml` baseline

---

## Sprint Security Backlog Template

Every sprint includes security items derived from the compliance gap analysis:

```yaml
# security-backlog.yaml (sprint 4 snapshot)
sprint: 4
risk_classification:

  - component: "model_serving"
    risk_level: critical
    threats: ["prompt_injection", "data_exfiltration", "model_poisoning"]

  - component: "api_gateway"
    risk_level: high
    threats: ["unauthorized_access", "rate_abuse"]

  - component: "vector_store"
    risk_level: high
    threats: ["data_exfiltration", "injection"]
security_stories:

  - id: "SEC-045"
    title: "Input sanitization for RAG endpoint"
    risk: critical
    category: data_exfiltration
    control: "input_validation"
    acceptance: "Pass prompt injection test suite (50+ test cases)"

  - id: "SEC-050"
    title: "Network segmentation for model serving VPC"
    risk: high
    category: network_security
    control: "network_segmentation"
    compliance: ["APRA-CPS230", "GDPR-32"]
    acceptance: "VPC has no public subnets, egress filtered through approved destinations"

  - id: "SEC-051"
    title: "Deploy threat monitoring stack"
    risk: high
    category: monitoring
    control: "threat_monitoring"
    compliance: ["APRA-CPS230", "DORA"]
    acceptance: "Prometheus + Grafana alerts for anomalous inference patterns"
security_debt:

  - item: "Outdated container base images in 2 services"
    risk: medium
    target_sprint: 5

  - item: "Missing MFA on CI/CD deployment pipeline"
    risk: high
    target_sprint: 4

```

---

## Security Metrics Dashboard

Continuous validation produces measurable security posture indicators:

| Metric | Source | Threshold | Alert |
|---|---|---|---|
| Security scan pass rate | CI/CD pipeline | ≥ 95% | Sprint blocked if < 80% |
| Compliance gap count | `governance-report.yaml` | Decreasing trend | Alert if increasing for 2+ sprints |
| Critical vulnerabilities | Dependency scanner | 0 | Block merge immediately |
| Security story velocity | Sprint backlog | ≥ 20% of total story points | Review if consistently < 15% |
| Security debt aging | Security debt backlog | 0 items > 2 sprints old | Escalate to Team Architect |
| Architecture drift | Automated drift check (your CI tooling) | 0 unapproved changes | Alert on detection |

---

## TOGAF ADM Phase Mapping

| TOGAF Phase | Agile Security Activity | Template Reference |
|---|---|---|
| ADM-P (Preliminary) | Define security risk tolerance, regulatory scope | This template |
| ADM-A (Architecture Vision) | Security requirements + threat model | `vision.yaml` |
| ADM-B (Business) | Security business objectives, risk appetite | Embedded in sprint planning |
| ADM-C (Information Systems) | Security architecture design, data classification | `technology-architecture.yaml`, `data-architecture.yaml` |
| ADM-D (Technology) | Security controls implementation, infrastructure hardening | Security stories in sprint backlog |
| ADM-E (Opportunities) | Security backlog prioritization, risk-based sequencing | `security-backlog.yaml` |
| ADM-F (Migration) | Security testing automation, compliance validation | CI/CD pipeline compliance stage |
| **ADM-G (Governance)** | **Continuous security validation** | **`governance-report.yaml`** |
| ADM-H (Change Management) | Security impact assessment for all changes | `change-request.yaml` security section |

---

## Integration Points

### With ADR-001 (Executable TOGAF ADM Workflow)

This template replaces the static Phase G governance gate with continuous validation. The `governance-report.yaml` output format remains the same, but it is updated every sprint instead of at project end.

### With ADR-003 (AI Governance Framework)

Security stories in sprint backlogs implement the controls defined in ADR-003's governance pillars:

- Model lifecycle management → model safety tests (prompt injection, output filtering)

- Agent orchestration standards → authorization and audit logging tests

- Compliance mapping → compliance-as-code validation rules

### With ADR-005 (Compliance Validation Pipeline)

The compliance-as-code integration point uses the compliance validation pipeline described in ADR-005 as the execution model. Every sprint gate runs the validation stage and feeds results into `governance-report.yaml`.

### With the Agile Governance Template

The sprint-level security validation report is reviewed during the Sprint Architecture Review Checklist (`agile-governance-template.md`, section 1). Security metrics feed into the quarterly Architecture Health Assessment.

---

## Example CI Checks (Illustrative)

The checks below describe the pipeline shape — ArcKit does not ship these tools. Wire your own SAST/DAST/compliance tooling into the same stages:

- **Security scanning** — risk-level-driven scan orchestration, with per-sprint result aggregation

- **Model safety** — prompt-injection suite, output-filtering suite, input-sanitization suite, and rate-limiting checks

- **Infrastructure validation** — encryption at rest/in transit, TLS version enforcement, network isolation, and model safety gates

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Security story debt accumulates across sprints | Medium | Medium | Velocity threshold alert (≥ 20% story points). Escalate if consistently < 15%. |
| Compliance-as-code rules become stale | Low | High | Quarterly review of compliance rules against current regulations |
| Over-instrumentation slows sprint velocity | Medium | Low | Risk-based scan depth — low-risk paths only get license checks |
| Team treats security as checklist items | Medium | Medium | Security stories tie to real risk scenarios, not generic controls |
| Continuous validation misses edge cases | Low | High | Annual external penetration test supplements automated checks |

---

## Acceptance Criteria

- [ ] Template aligns with O-AA Security Playbook (G216) principles

- [ ] Security activities embedded in each sprint/iteration, not separate gates

- [ ] Risk-based security testing automation defined with clear classification rules

- [ ] Compliance-as-code integration points documented with YAML examples

- [ ] Continuous security validation replaces phase-gate checkpoints with measurable evidence

- [ ] Integration with existing `governance-report.yaml` structure is explicit

- [ ] Reference to ADR-001, ADR-003, ADR-005, and `agile-governance-template.md`

- [ ] Security metrics dashboard with alert thresholds

## Sources

- O-AA Security Playbook (G216) — The Open Group. Guidelines for addressing security in Agile Architecture. https://publications.opengroup.org/guides/agile-architecture-guides/g216

- ADR-001: Executable TOGAF ADM Workflow

- ADR-003: AI Governance Framework

- ADR-005: Compliance Validation Pipeline

- Agile Governance Template (`agile-governance-template.md`)

- ${user_config.references_dir} — organisation reference documents (e.g. implementation plan); include only documents that exist in the configured directory

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

**Generated by**: ArcKit `/arckit:agile-security` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
