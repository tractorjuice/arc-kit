# Agile Strategy Canvas

> **Template:** Agile Strategy Canvas (O-AA Dual Transformation Planning)
> **Issue:** ${user_config.project_issue_prefix}-126 | **Command:** `/arckit:agile-strategy`
> **Structure:** inlined below (YAML example in the YAML Structure section)
> **O-AA Reference:** Agile Strategy (C208 Ch. 11)

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time per _partials/RENDERING.md. -->

### Revision History

| Version | Date | Author | Description | Reviewer | Approver |
|---------|------|--------|-------------|----------|----------|
| `[VERSION]` | `[YYYY-MM-DD]` | ArcKit AI | Initial creation | `[REVIEWER_NAME]` | `[APPROVER_NAME]` |

---

---

## Trigger Guidance

Use this canvas when:

- Planning an enterprise transformation that involves both digital technology adoption AND organizational agility changes

- You need to map how technology changes interact with cultural and organizational changes

- The client requires axiom-based design principles traceable to O-AA standard

- Business continuity and resilience are strategic-level concerns (not just operational)

Do NOT use when:

- Single product feature scoping — use `product-architecture-template.md` instead

- Pure security architecture — use `agile-security-template.md` instead

- Traditional TOGAF documentation for regulated clients — use the `/arckit:adm-preliminary` command with its Stakeholder Drivers section

---

## Canvas Overview

The Agile Strategy Canvas captures the **dual transformation** agenda:

| Dimension | Focus Areas |
|---|---|
| **Digital Transformation** | Technology, Product, Operating Model |
| **Agile Transformation** | Organizational Agility, Cultural Agility, Team Agility |

These two dimensions intersect to form a 2x3 matrix of transformation activities. The canvas also defines the design principles (derived from O-AA axioms) and resilience targets that govern the target architecture.

---

## Section 1: Digital Transformation Dimension

### 1.1 Technology Transformation

Describe the technology shifts required to enable the target architecture.

| Field | Description |
|---|---|
| `current_state` | Existing technology stack, infrastructure, and platform limitations |
| `target_state` | Target technology architecture (cloud-native, AI platforms, data platforms) |
| `migration_approach` | Incremental migration strategy (strangler pattern, dual-run, big-bang) |
| `technology_risks` | Technical debt, integration complexity, vendor lock-in concerns |
| `enabling_technologies` | Key technologies that unlock the transformation (AI/ML, event-driven, API-first) |

**Example:**

```yaml
technology:
  current_state: "Monolithic on-premises ERP with batch ETL pipelines"
  target_state: "Cloud-native microservices with real-time event streaming and AI-driven analytics"
  migration_approach: "Strangler pattern — extract services incrementally over 4 waves"
  technology_risks:

    - "Legacy ERP vendor lock-in with 3rd-party integrations"

    - "Data migration complexity across 40+ database schemas"
  enabling_technologies:

    - "Event-driven architecture (Kafka/Pulsar)"

    - "Self-hosted LLM inference for internal decision support"

    - "Real-time feature store for ML pipelines"

```

### 1.2 Product Transformation

Describe how products evolve from project-centric delivery to permanent product organizations.

| Field | Description |
|---|---|
| `current_product_model` | Current product portfolio, delivery model (project-based vs product-based) |
| `target_product_model` | Target product organization (cross-functional teams, product ownership) |
| `product_outcomes` | Measurable outcomes each product team owns (not deliverables) |
| `value_streams` | Key value streams mapped to product teams |

**Example:**

```yaml
product:
  current_product_model: "Project-based delivery with temporary teams dissolved after release"
  target_product_model: "Permanent product teams with dedicated product owners and embedded architects"
  product_outcomes:

    - "Reduce customer onboarding time from 14 days to 2 hours"

    - "Increase cross-sell conversion rate by 15% through AI-driven recommendations"
  value_streams:

    - "Customer acquisition and onboarding"

    - "Claims processing and resolution"

    - "Regulatory reporting and compliance"

```

### 1.3 Operating Model Transformation

Describe the operating model changes to support agile, product-centric delivery.

| Field | Description |
|---|---|
| `current_operating_model` | Current operating model (functional silos, matrix, program management office) |
| `target_operating_model` | Target operating model (platform teams, stream-aligned teams, enabling teams) |
| `capability_gaps` | Organizational capabilities needed but currently missing |
| `platform_strategy` | Internal platform strategy (build vs buy, shared services, API marketplace) |

**Example:**

```yaml
operating_model:
  current_operating_model: "Functional silos with centralized PMO and waterfall delivery"
  target_operating_model: "Platform-aligned teams with stream-aligned squads and lightweight architecture guild"
  capability_gaps:

    - "Data engineering capacity for real-time feature pipelines"

    - "MLOps proficiency for continuous model monitoring"

    - "Product management maturity (outcome ownership vs feature delivery)"
  platform_strategy: "Build internal developer platform with self-service CI/CD, observability, and AI model registry"

```

---

## Section 2: Agile Transformation Dimension

### 2.1 Organizational Agility

Describe the structural changes to enable faster decision-making and response to change.

| Field | Description |
|---|---|
| `current_state` | Current organizational structure, decision-making hierarchy, approval chains |
| `target_state` | Target structure (decentralized decision-making, empowered teams) |
| `decision_framework` | Decision rights framework (which decisions are team-level vs architecture-level vs executive) |
| `governance_model` | Distributed governance model (architecture guild, community of practice) |

**Example:**

```yaml
organizational_agility:
  current_state: "4-level approval chain for any architectural change. Central Architecture Board meets quarterly."
  target_state: "Team-level architectural decisions with architecture guild as a consultative body"
  decision_framework:
    team_level: "Technology choices within approved platform boundaries"
    guild_level: "Cross-team integration patterns, shared service evolution"
    executive_level: "Strategic platform investments, vendor commitments >$500K"
  governance_model: "Architecture guild meets bi-weekly. Async RFC process for cross-cutting decisions."

```

### 2.2 Cultural Agility

Describe the cultural shifts required for an agile, learning-oriented organization.

| Field | Description |
|---|---|
| `current_culture` | Current organizational culture (risk-averse, blame-oriented, siloed) |
| `target_culture` | Target culture (learning-oriented, blameless postmortem, psychological safety) |
| `change_initiatives` | Specific initiatives to drive cultural change |
| `success_indicators` | Cultural metrics that indicate progress (DORA metrics, team health scores) |

**Example:**

```yaml
cultural_agility:
  current_culture: "Risk-averse with blame culture for production incidents. Siloed teams with limited cross-team collaboration."
  target_culture: "Blameless postmortem culture with learning-focused retrospectives. Cross-team knowledge sharing."
  change_initiatives:

    - "Blameless incident review process within 48 hours of any production event"

    - "Cross-team tech talks bi-weekly"

    - "Architecture office hours for async knowledge sharing"
  success_indicators:

    - "Mean time to recovery (MTTR) < 1 hour"

    - "Deployment frequency >= daily per team"

    - "Team health score >= 8/10 (quarterly survey)"

```

### 2.3 Team Agility

Describe how individual teams become more agile, self-organizing, and outcome-focused.

| Field | Description |
|---|---|
| `current_team_model` | Current team structure (component teams, layered teams, project teams) |
| `target_team_model` | Target team structure (feature teams, stream-aligned teams, platform teams) |
| `team_composition` | Ideal team composition and size (cross-functional, embedded architect) |
| `agile_practices` | Agile practices adopted (scrum, kanban, SAFe, LeSS) |
| `flow_metrics` | Team flow metrics (cycle time, lead time, WIP limits) |

**Example:**

```yaml
team_agility:
  current_team_model: "Component teams (frontend, backend, data) with handoffs between layers"
  target_team_model: "Stream-aligned feature teams owning vertical slices from UI to data pipeline"
  team_composition: "8-10 people: product owner, embedded architect, 4-5 engineers, QA, data engineer, UX"
  agile_practices: "Kanban with WIP limits, weekly demos, async decision documentation"
  flow_metrics:
    cycle_time_target: "< 5 business days from commit to production"
    lead_time_target: "< 2 weeks from requirement to delivery"
    wip_limit: "Max 3 items in progress per team"

```

---

## Section 3: Axiom-Based Design Principles

Design principles derived from O-AA guiding axioms. Each principle must be traceable to an O-AA axiom.

| Field | Description |
|---|---|
| `principle` | Declarative statement of the design principle |
| `axiom` | Published O-AA axiom (C208) this principle derives from, cited by number and name |
| `rationale` | Why this principle matters for this transformation |
| `implications` | Architectural and organizational implications of following this principle |
| `exceptions` | Known exceptions or trade-offs |

**Example:**

```yaml
design_principles:

  - principle: "Outcome over output"
    axiom: "Axiom 1 — Customer Experience Focus"
    rationale: "Teams measure success by business impact, not by artifacts delivered"
    implications:

      - "Architecture review gates evaluate outcome contribution, not document completeness"

      - "Team OKRs tied to business outcomes, not feature counts"
    exceptions: "Regulatory submissions require documented evidence — exception documented in compliance register"

  - principle: "Permanent product over temporary project"
    axiom: "Axiom 15 — Project to Product Shift"
    rationale: "Product teams maintain continuity and deep domain knowledge across iterations"
    implications:

      - "No project dissolution after release — teams evolve the product continuously"

      - "Architect embedded in product team, not in separate architecture group"
    exceptions: "Time-bound regulatory compliance projects may use temporary teams with knowledge handoff"

  - principle: "Platform before feature"
    axiom: "Axiom 6 — Autonomous Cross-Functional Teams"
    rationale: "Teams need shared platform capabilities before building domain-specific features"
    implications:

      - "Platform team velocity prioritized over feature team velocity in early waves"

      - "Internal developer platform with self-service capabilities"
    exceptions: "Urgent customer-facing features may bypass platform dependencies with architectural debt tracking"

```

---

## Section 4: Resilience Mapping

Map resilience targets across the dual transformation dimensions.

| Field | Description |
|---|---|
| `resilience_domain` | Domain of resilience (technical, organizational, operational, regulatory) |
| `threat` | Specific threat or disruption scenario |
| `impact` | Business impact if the threat materializes |
| `mitigation` | Resilience mechanism (redundancy, fallback, automation, training) |
| `recovery_target` | Recovery time objective (RTO) and recovery point objective (RPO) |
| `transformation_dimension` | Which transformation dimension this resilience target belongs to |

**Example:**

```yaml
resilience_mapping:

  - resilience_domain: "technical"
    threat: "Primary AI inference cluster failure during peak demand"
    impact: "Customer-facing recommendation engine unavailable for 30+ minutes"
    mitigation: "Multi-zone GPU cluster with automatic failover and degraded-mode serving"
    recovery_target:
      rto: "5 minutes"
      rpo: "0 (synchronous replica)"
    transformation_dimension: "digital_technology"

  - resilience_domain: "organizational"
    threat: "Key product architect departure during critical migration wave"
    impact: "Wave delivery delayed 2+ weeks, knowledge silo created"
    mitigation: "Pair architecting model with shared design documentation and architecture guild coverage"
    recovery_target:
      rto: "1 week (guild coverage activation)"
    transformation_dimension: "agile_organizational"

  - resilience_domain: "regulatory"
    threat: "New data privacy regulation introduced during transformation"
    impact: "Data architecture requires rework; compliance gap during transition"
    mitigation: "Privacy-by-design principles embedded in platform. Quarterly regulatory scan with automated compliance checks."
    recovery_target:
      rto: "30 days for compliance remediation"
    transformation_dimension: "digital_operating_model"

```

---

## Section 5: Transformation Wave Plan

Map the dual transformation activities across delivery waves.

| Field | Description |
|---|---|
| `wave` | Wave number and name |
| `duration` | Duration in weeks/sprints |
| `digital_activities` | Digital transformation activities in this wave |
| `agile_activities` | Agile transformation activities in this wave |
| `resilience_milestones` | Resilience targets achieved by end of this wave |
| `governance_gates` | Architecture review checkpoints |

**Example:**

```yaml
transformation_waves:

  - wave: "Wave 0 — Foundation"
    duration: "4 weeks"
    digital_activities:

      - "Platform infrastructure provisioning (Kubernetes, observability stack)"

      - "Data pipeline foundation (feature store, event bus)"
    agile_activities:

      - "Team formation and structure definition"

      - "Decision framework and governance model establishment"
    resilience_milestones:

      - "Multi-zone platform redundancy operational"
    governance_gates:

      - "Architecture vision sign-off (ADM Phase A)"

  - wave: "Wave 1 — First Value Stream"
    duration: "8 weeks"
    digital_activities:

      - "Migrate first value stream to cloud-native architecture"

      - "Deploy AI model serving for first product team"
    agile_activities:

      - "First stream-aligned team delivery cycle"

      - "Agile practices adoption (Kanban, demos, retrospectives)"
    resilience_milestones:

      - "Automated canary deployment for value stream"

      - "Blameless postmortem process operational"
    governance_gates:

      - "Implementation governance review (ADM Phase G)"

```

---

## YAML Structure

The structured version of this canvas is the `agile-strategy-canvas.yaml` artefact, defined by the YAML example above. Validate your canvas by self-checking it against that structure, and run `/arckit:health` after the build to catch stale or orphaned artefacts.

---

## O-AA Axiom Reference

| Axiom | Application in the Canvas |
|---|---|
| Axiom 1 (Customer Experience Focus) | Design principles prioritise customer outcomes over document artefacts |
| Axiom 5 (Value Stream Alignment) | Transformation waves align to value streams, not calendar quarters |
| Axiom 6 (Autonomous Cross-Functional Teams) | Governance distributed to teams; architect embedded in delivery teams |
| Axiom 14 (Bias for Change) | Operating model shifts from temporary project structures to permanent product organizations |
| Axiom 15 (Project to Product Shift) | Product transformation maps customer/employee experience improvements |

---

## Cross-References

| Related Template | When to Use Together |
|---|---|
| `oaa-adm-lite-template.md` | Use ADM Lite to structure waves; use Strategy Canvas for transformation planning |
| `product-architecture-template.md` | Strategy Canvas defines the why; Product Architecture defines the what |
| `agile-governance-template.md` | Strategy Canvas sets direction; Governance maintains it |
| `adm-preliminary-template.md` | Use ADM-P for formal TOGAF engagements; Strategy Canvas for agile planning |

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

**Generated by**: ArcKit `/arckit:agile-strategy` command
**Generated on**: `[DATE] [TIME] GMT`
**ArcKit Version**: `{ARCKIT_VERSION}`
**Project**: `[PROJECT_NAME]` (Project `[PROJECT_ID]`)
**Model**: `[AI_MODEL]`
