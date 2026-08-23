# O-AA ADM Lite Template

> Maps the TOGAF ADM cycle to agile sprints. Use when delivering AI architectures in 2-4 week engagement windows. Sprint artefact structures are inlined in each sprint section below.

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
| **Template** | O-AA ADM Lite |
| **Framework** | Open Agile Architecture (O-AA) + TOGAF ADM |
| **Sprint length** | 2 weeks (configurable) |
| **Engagement window** | 4-8 weeks |
| **Prerequisites** | `${user_config.references_dir}` — organisation-specific prerequisite documents, if any |
| **Owner** | Enterprise Architecture Lead |
| **Replaces** | N/A — standalone sprint-mapped ADM delivery |

---

## Trigger Guidance

Use this template when **any** of the following conditions are met:

- Client engagement has a **hard timeline under 8 weeks** for architecture + initial delivery

- Client operates in **agile/sprint-driven** development culture

- First engagement with a client — rapid architecture vision needed before scoping sprints

- Client requires TOGAF alignment but cannot sustain traditional ADM cadence (quarterly architecture boards, 200-page deliverables)

**Do NOT use** when:

- Full regulatory audit trail is required (use `/arckit:adm-preliminary` with full ADM workflow instead)

- Multi-year enterprise transformation with 50+ stakeholder review gates

- Architecture baseline phase requires extensive current-state assessment (> 4 weeks)

---

## Sprint Map

| Sprint | TOGAF Phases | Focus | Duration | Key Output |
|---|---|---|---|---|
| Sprint 0 | ADM-P + A | Vision + Stakeholders | 1 week | `vision.yaml` |
| Sprint 1 | ADM-B + C (part) | Business + Data Architecture | 2 weeks | `business-architecture.yaml`, `data-architecture.yaml` |
| Sprint 2 | ADM-C (part) + D | Technology Architecture | 2 weeks | `technology-architecture.yaml` |
| Sprint 3 | ADM-E + F | Implementation Wave | 2 weeks | `implementation-strategy.yaml` |
| Sprint 4+ | ADM-G + H | Governance + Change | Ongoing | `governance-report.yaml`, `change-request.yaml` |

---

## Sprint 0: Vision + Stakeholders (ADM-P + A)

**Duration:** 1 week

**Goal:** Agreement on scope, constraints, and success criteria. Stakeholder map finalized.

### O-AA Axiom Alignment

- **Axiom 1 (Customer Experience Focus)** — every decision traces to a business outcome

- **Axiom 10 (Simple Common Operating Principles)** — no gold-plating; scope constrained to the client's immediate delivery horizon

- **Axiom 15 (Project to Product Shift)** — the vision organizes delivery around a product the team owns, not a one-off project

### Activities

1. **Preliminary (ADM-P):** Determine strategic drivers, constraints, and existing assets
2. **Stakeholder analysis:** Map roles to concerns to compliance requirements
3. **Vision definition (ADM-A):** Scope AI workload type, data classification, jurisdiction
4. **Success criteria:** Define measurable targets (latency, accuracy, availability)
5. **Architecture contract:** Agree on deliverable format and handoff process

### Deliverables

| Artifact | Structure | Validation |
|---|---|---|
| `vision.yaml` | Inlined below | Self-check against the inlined structure; `/arckit:health` after build |
| `stakeholder-map.md` | N/A (markdown) | Manual review against vision.yaml stakeholders array |

### Vision.yaml Structure

```yaml
vision:
  scope:
    ai_workload_type: "RAG pipeline" | "Agent orchestration" | "LLM serving" | "RAG pipeline + agent orchestration" | "Agent orchestration + RAG + model serving"
    use_cases: ["query_answer", "document_analysis"]
    data_classification: "public" | "internal" | "confidential" | "regulated"
    user_count: 500
    latency_requirement_ms: 2000
  constraints:
    budget_aud: 150000
    timeline_weeks: 12
    infrastructure: "on_premise" | "private_cloud" | "hybrid" | "multi-region"
    jurisdiction: "AU" | "EU" | "APAC" | "US" | "multi"
  stakeholders:

    - role: "CIO"
      concern: "data sovereignty"
      success_metric: "zero data exfiltration"

    - role: "CISO"
      concern: "network isolation"
      success_metric: "no external API calls from GPU cluster"
  success_criteria:

    - metric: "inference_latency_p95"
      target_ms: 1500

    - metric: "model_accuracy"
      target_percent: 92.5
  regulatory_controls: ["APP-11.1", "APRA-CPS230"]
  risk_profile:

    - risk: "GPU procurement delay"
      mitigation: "Pre-order hardware at sprint 0"
  deployment:
    topology: "air-gapped" | "network-isolated" | "network-isolated-per-region" | "cloud_vpc"

```

### Sprint 0 Gate (Go/No-Go)

- [ ] `vision.yaml` matches the inlined structure

- [ ] All stakeholders have signed off on scope

- [ ] Budget and timeline confirmed with CEO

- [ ] Regulatory baseline identified (jurisdiction → controls mapping)

- [ ] Handoff criteria to Sprint 1 documented

**Trigger to Sprint 1:** Vision gate passes → create Sprint 1 issue, attach `vision.yaml`.

---

## Sprint 1: Business + Data Architecture (ADM-B + C partial)

**Duration:** 2 weeks

**Goal:** Capabilities mapped, data flows defined, compliance requirements embedded in every data asset.

### O-AA Axiom Alignment

- **Axiom 5 (Value Stream Alignment)** — capabilities measured by business value delivered along the value stream, not diagram count

- **Axiom 1 (Customer Experience Focus)** — data classification and compliance controls trace to specific stakeholder concerns from Sprint 0

- **Axiom 6 (Autonomous Cross-Functional Teams)** — the sprint team owns the business and data architecture decisions end-to-end, without a central architecture board

### Activities

1. **Capability definition (ADM-B):** Current-state vs target-state gap analysis
2. **Process mapping:** Value streams with SLA targets
3. **Data asset inventory (ADM-C):** Classification, volume, retention, encryption
4. **Data flow definition:** Source → destination with transformation and compliance controls
5. **Application component mapping:** RAG pipeline / agent workflow components with SLAs

### Deliverables

| Artifact | Structure | Validation |
|---|---|---|
| `business-architecture.yaml` | Inlined below (capabilities + data) | Self-check against the inlined structure |
| `data-architecture.yaml` | Inlined below | Self-check against the inlined structure |
| `capability-gap-analysis.md` | N/A (markdown) | Cross-reference with vision.yaml success criteria |

### Data Architecture Structure

```yaml
data_assets:

  - id: "DA-001"
    name: "Client Document Store"
    classification: "confidential"
    format: "PDF, DOCX, CSV"
    volume_gb: 50
    retention_days: 365
    encryption: "AES-256"
data_flows:

  - id: "DF-001"
    source: "DA-001"
    destination: "DA-002"
    transformation: "ingest_pipeline"
    frequency: "on_demand"
    encryption_in_transit: true
    compliance_controls: ["APP-11.1", "GDPR-32"]
applications:

  - id: "APP-001"
    name: "RAG Pipeline"
    type: "langgraph_workflow"
    components: ["embedder", "vector_store", "retriever", "llm_client", "response_filter"]
    sla_ms: 2000

```

### Sprint 1 Gate (Go/No-Go)

- [ ] All data assets classified and encrypted

- [ ] Every data flow has compliance controls mapped

- [ ] Capability gaps quantified with effort estimates

- [ ] Application components and SLAs defined

- [ ] AI Safety Architect reviewed data architecture (safety sign-off)

**Trigger to Sprint 2:** Sprint 1 gate passes → Founding Engineer receives data architecture for technology design.

---

## Sprint 2: Technology Architecture (ADM-C continuation + D)

**Duration:** 2 weeks

**Goal:** Technology standards locked, infrastructure topology defined, monitoring stack specified.

### O-AA Axiom Alignment

- **Axiom 5 (Value Stream Alignment)** — technology choices directly enable the AI workload type declared in Sprint 0

- **Axiom 7 (Authority, Responsibility, and Accountability Distribution)** — the operational model (who monitors, who responds, who is accountable) is defined alongside the technical stack

### Activities

1. **Technology standards:** Model serving, vector store, database, runtime
2. **Infrastructure design:** GPU cluster sizing, network topology, ingress/egress
3. **Monitoring stack:** Metrics, alerting, retention
4. **Compliance validation:** Technology choices against jurisdictional requirements
5. **Architecture freeze:** Lock technology selections; no scope creep without change request

### Deliverables

| Artifact | Structure | Validation |
|---|---|---|
| `technology-architecture.yaml` | Inlined below | Self-check against the inlined structure |
| `data-flow-diagram.mmd` | Mermaid.js | Visual review |
| `tech-stack-compliance.md` | N/A (markdown) | Cross-reference with vision.yaml regulatory controls |

### Technology Architecture Structure

```yaml
technology_standards:
  model_serving:
    primary: "SGLang"
    fallback: "vLLM"
    models:

      - name: "Qwen2.5-32B-Instruct"
        quantization: "AWQ"
        context_length: 32768
  vector_store:
    primary: "Qdrant"
    deployment: "docker_compose"
  database:
    primary: "PostgreSQL"
    version: "16"
    extensions: ["pgvector"]
infrastructure:
  compute:
    gpu: "NVIDIA A100 80GB"
    count: 1
    runtime: "Docker"
  network:
    topology: "isolated"
    ingress: "Traefik"
    egress: "whitelist_only"
  monitoring:
    stack: "Prometheus + Grafana + DCGM"
    retention_days: 90

```

### Sprint 2 Gate (Go/No-Go)

- [ ] Technology stack validates against compliance requirements

- [ ] Infrastructure sizing supports success criteria from Sprint 0

- [ ] Monitoring stack covers all SLA metrics

- [ ] Network topology satisfies isolation requirements

- [ ] Architecture freeze documented; change process established

**Trigger to Sprint 3:** Sprint 2 gate passes → architecture complete, proceed to implementation planning.

---

## Sprint 3: Implementation Wave (ADM-E + F)

**Duration:** 2 weeks

**Goal:** Work packages defined, migration strategy selected, risk register populated. Ready for Founding Engineer to execute.

### O-AA Axiom Alignment

- **Axiom 14 (Bias for Change)** — the implementation plan enables rapid delivery with governance built in

- **Axiom 3 (Rapid Feedback Loops)** — each wave ships and feeds back; pragmatic trade-offs over theoretical perfection

### Activities

1. **Work package definition (ADM-E):** Build vs buy, effort estimates, assignee roles
2. **Migration wave planning:** Duration, dependencies, sequencing
3. **Risk register:** Likelihood, impact, mitigation, owner
4. **Migration strategy:** Big bang vs incremental vs parallel run
5. **Architecture handoff:** Blueprint package delivered to Founding Engineer

### Deliverables

| Artifact | Structure | Validation |
|---|---|---|
| `implementation-strategy.yaml` | Inlined below | Self-check against the inlined structure |
| `migration-plan.md` | N/A (markdown) | Cross-reference with wave definitions |
| `risk-register.md` | N/A (markdown) | All Sprint 0 risks have mitigation plans |

### Implementation Strategy Structure

```yaml
waves:

  - id: "WAVE-001"
    name: "Foundation Infrastructure"
    duration_weeks: 3
    dependencies: []
    work_packages:

      - id: "WP-001"
        name: "GPU Cluster Setup"
        type: "infrastructure"
        effort_person_weeks: 1
        assignee_role: "Founding Engineer"

      - id: "WP-002"
        name: "Model Serving Deployment"
        type: "infrastructure"
        effort_person_weeks: 1
        assignee_role: "Founding Engineer"

  - id: "WAVE-002"
    name: "Data Pipeline"
    duration_weeks: 2
    dependencies: ["WAVE-001"]
    work_packages:

      - id: "WP-003"
        name: "Document Ingestion Pipeline"
        type: "application"
        effort_person_weeks: 1.5
        assignee_role: "Founding Engineer"
migration:
  strategy: "big_bang" | "incremental" | "parallel_run"
  cutover_window: "weekend"
  rollback_trigger: "p95_latency > 5s for 10 minutes"

```

### Sprint 3 Gate (Go/No-Go)

- [ ] All work packages have clear owners and effort estimates

- [ ] Wave dependencies resolved (no circular dependencies)

- [ ] Migration strategy selected with rollback criteria

- [ ] Risk register complete — all risks have owners and mitigations

- [ ] Blueprint package attached to Paperclip, assigned to Founding Engineer

**Trigger to Sprint 4:** Blueprint package delivered → Founding Engineer begins Wave-001 execution.

---

## Sprint 4+: Continuous Governance (ADM-G + H)

**Duration:** Ongoing (bi-weekly reviews during implementation, then monthly post-deployment)

**Goal:** Compliance verification, performance baseline, change management cadence.

### O-AA Axiom Alignment

- **Axiom 7 (Authority, Responsibility, and Accountability Distribution)** — governance distributes decision authority instead of centralising it in a quarterly board

- **Axiom 3 (Rapid Feedback Loops)** — continuous monitoring and adaptation, not a one-time document

### Activities

1. **Compliance verification (ADM-G):** Automated checklist validation against deployed system
2. **Performance baseline:** Latency, throughput, GPU utilization measurements
3. **Change management (ADM-H):** Impact analysis for model upgrades, infrastructure scale, compliance updates
4. **Architecture debt tracking:** Drift detection between designed and deployed architecture
5. **Quarterly health assessment:** Architecture fitness review with stakeholders

### Deliverables

| Artifact | Structure | Validation |
|---|---|---|
| `governance-report.yaml` | Inlined below | Self-check against the inlined structure |
| `change-request.yaml` | N/A (per change request) | Impact analysis per `/arckit:architecture-change` gate criteria |
| `performance-baseline.csv` | N/A (CSV) | Automated collection from monitoring stack |
| `architecture-health.md` | N/A (markdown) | Quarterly manual review |

### Governance Report Structure

```yaml
verification:
  checklist: "${user_config.safety_checklist_id}"
  score: 94
  critical_pass: true
  important_pass_rate: 0.95
  blocked_items: []
performance_baseline:
  inference_latency_p50_ms: 800
  inference_latency_p95_ms: 1500
  gpu_utilization_percent: 65
  queries_per_second: 12
compliance_artifacts:

  - document: "Network Architecture Diagram"
    status: "delivered"

  - document: "Data Processing Agreement"
    status: "signed"

```

### Governance Cadence

| Frequency | Activity | Owner |
|---|---|---|
| Bi-weekly | Compliance checklist review during implementation | Enterprise Architecture Lead |
| Weekly | Performance metrics review | Founding Engineer |
| Monthly | Architecture fitness assessment | Enterprise Architecture Lead + AI Safety Architect |
| Quarterly | Stakeholder architecture review | CEO + all stakeholders |
| Ad-hoc | Change request processing | Enterprise Architecture Lead |

### Governance Gate (Continuous)

- [ ] All Critical safety controls pass every review cycle

- [ ] Performance metrics within success criteria thresholds

- [ ] Architecture debt items tracked and prioritized

- [ ] Change requests validated before implementation

- [ ] Compliance artifacts up to date

---

## Sprint Artefact Traceability

| Sprint | Phase | Primary Artefact | Secondary Artefact |
|---|---|---|---|
| 0 | ADM-P + A | `vision.yaml` | `stakeholder-map.md` |
| 1 | ADM-B + C (data) | `business-architecture.yaml` | `data-architecture.yaml` |
| 2 | ADM-C (tech) + D | `technology-architecture.yaml` | `tech-stack-compliance.md` |
| 3 | ADM-E + F | `implementation-strategy.yaml` | `migration-plan.md` |
| 4+ | ADM-G + H | `governance-report.yaml` | `change-request.yaml` |

---

## Paperclip Integration

Each sprint produces Paperclip issues for traceability:

1. **Sprint N issue** — architecture artifacts attached as comments
2. **Work package issues** — auto-created from `implementation-strategy.yaml` waves, assigned to Founding Engineer
3. **Compliance issues** — auto-assigned to AI Safety Architect
4. **Phase gate issues** — block downstream work until the sprint gate criteria pass

### Issue Naming Convention

```text
[Sprint N] ADM-<Phase>: <artifact-name>
Example: [Sprint 0] ADM-A: vision.yaml
Example: [Sprint 3] ADM-E: WAVE-001 Foundation Infrastructure

```

---

## Comparison: Full ADM vs ADM Lite

| Dimension | Full ADM workflow | O-AA ADM Lite |
|---|---|---|
| Duration | 3-6 months | 4-8 weeks |
| Artifacts | 12+ YAML documents | 6 core artifacts |
| Review gates | Quarterly architecture board | Sprint reviews (bi-weekly) |
| Stakeholder engagement | Formal steering committee | Sprint demos + stakeholder map |
| Governance | Monthly architecture reviews | Continuous monitoring |
| Best for | Regulated enterprises, multi-year programs | AI delivery engagements, time-bound projects |
| Compliance depth | Full audit trail | Embedded compliance in artifacts |
| TOGAF alignment | Complete ADM P-H | Sprint-mapped ADM P-H |

**Note:** ADM Lite does not replace the full ADM. Use full ADM when regulatory audit depth justifies the cadence. ADM Lite is the default for time-bound AI delivery engagements.

---

## References

- ${user_config.references_dir} — organisation reference documents (ADR-001: Executable TOGAF ADM Workflow, ADR-002: Architecture Handoff Process, ADR-003: AI Governance Framework, O-AA Study Notes); include only documents that exist in the configured directory

- Sprint artefact structures: inlined in this template (see each sprint's structure section)

- The Open Group: Open Agile Architecture (O-AA) Standard — https://publications.opengroup.org/c208

- The Agile Enterprise Architect Playbook (G226) — TOGAF + Agile integration

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

**Generated by**: ArcKit `/arckit:oaa-adm-lite` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
