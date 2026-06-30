---
title: "Agent Program Maturity Model"
docType: AAMT
templateVersion: "1.0"
---

# Agent Program Maturity Model

## Document Control

<!-- DOC-CONTROL-HEADER -->
<!-- Resolved at command-execution time to _partials/document-control-uk.md or _partials/document-control-uae.md based on plugin userConfig classification_scheme + governance_framework. See _partials/RENDERING.md (when present). -->

## Revision History

| Version | Date | Author | Changes | Approved By | Approval Date |
|---------|------|--------|---------|-------------|---------------|
| [VERSION] | [DATE] | ArcKit AI | Initial creation from `/arckit:agent-maturity` command | [PENDING] | [PENDING] |

---

## 1. Maturity Model Framework

### 1.1 Framework Overview

This maturity model assesses the AI agent program across five dimensions at five levels of maturity. Each level represents a progressive stage of capability development.

| Level | Name | Description |
|-------|------|-------------|
| L1 | Ad-hoc | No formal processes, reactive, undocumented, person-dependent |
| L2 | Reactive | Processes defined post-incident, some documentation, inconsistent |
| L3 | Defined | Standard processes documented, proactive management, measured outcomes |
| L4 | Managed | Metrics-driven, data-led decisions, continuous improvement |
| L5 | Optimized | Continuous improvement, predictive, industry-leading, automated |

### 1.2 Level Definitions by Dimension

#### Design

| Level | Characteristics |
|-------|----------------|
| L1 | Designs created ad-hoc, no reuse, decisions undocumented |
| L2 | Basic designs documented after issues arise, some patterns identified |
| L3 | Standard design patterns documented, reviews required, reusable templates |
| L4 | Design quality measured, automated validation, architecture decision records |
| L5 | AI-assisted design optimisation, predictive pattern matching, industry contribution |

#### Governance

| Level | Characteristics |
|-------|----------------|
| L1 | No formal governance, decisions made by individuals |
| L2 | Basic oversight after incidents, ad-hoc reviews |
| L3 | Governance framework established, regular reviews, documented authority |
| L4 | Automated compliance monitoring, governance metrics, audit trails |
| L5 | Self-governing framework, predictive compliance, industry standards contribution |

#### Security

| Level | Characteristics |
|-------|----------------|
| L1 | No formal security design, reactive to breaches |
| L2 | Basic security controls added after incidents |
| L3 | Security by design, threat modelling, regular security testing |
| L4 | Automated security monitoring, continuous vulnerability scanning, security metrics |
| L5 | Predictive threat detection, zero-trust architecture, security automation |

#### Integration

| Level | Characteristics |
|-------|----------------|
| L1 | Point-to-point integrations, no standards, manual connections |
| L2 | Basic integration patterns, some API documentation |
| L3 | Standardised integration patterns, API specifications, integration testing |
| L4 | API management platform, automated integration testing, observability |
| L5 | Self-healing integrations, automated discovery, integration orchestration |

#### Operations

| Level | Characteristics |
|-------|----------------|
| L1 | Manual operations, no monitoring, reactive to failures |
| L2 | Basic monitoring, runbooks created after incidents |
| L3 | Standard operating procedures, alerting, SLA tracking |
| L4 | Automated operations, predictive monitoring, MTTR targets |
| L5 | Self-healing operations, predictive scaling, chaos engineering |

---

## 2. Current State Assessment

### 2.1 Assessment Matrix

| Dimension | Level | Evidence | Gaps |
|-----------|-------|----------|------|
| Design | [Current level, e.g., L2] | [Concrete evidence — e.g., "Architecture decisions documented in 2 of 5 agents, no reusable patterns"] | [Gaps — e.g., "No design review process, limited pattern reuse across agents"] |
| Governance | [Current level, e.g., L1] | [Concrete evidence — e.g., "No formal governance board for AI agents, ad-hoc oversight"] | [Gaps — e.g., "No audit trail, no compliance monitoring, no authority matrix"] |
| Security | [Current level, e.g., L2] | [Concrete evidence — e.g., "Guardrails defined in 3 agents, basic prompt injection checks"] | [Gaps — e.g., "No threat model, no automated security testing, no security metrics"] |
| Integration | [Current level, e.g., L1] | [Concrete evidence — e.g., "Point-to-point API connections, no integration standards"] | [Gaps — e.g., "No API management, no integration testing, no observability"] |
| Operations | [Current level, e.g., L2] | [Concrete evidence — e.g., "Basic monitoring via cloud provider, ad-hoc runbooks"] | [Gaps — e.g., "No SLA tracking, no alerting thresholds, no incident response plan"] |

### 2.2 Maturity Heatmap

```mermaid
quadrantChart
    title Agent Program Maturity — Current State
    x-axis__Low --> High
    y-axis__High Priority --> Low Priority
    quadrant-1 Quick Wins
    quadrant-2 Monitor
    quadrant-3 Strategic Investments
    quadrant-4 Develop
    "Design", [0.3, 0.4]
    "Governance", [0.1, 0.3]
    "Security", [0.2, 0.5]
    "Integration", [0.2, 0.2]
    "Operations", [0.3, 0.6]
```

### 2.3 Dimension Analysis

#### Design — [Current Level]

**Strengths**:

- [Strength 1]
- [Strength 2]

**Areas for improvement**:

- [Gap 1 — what needs to change]
- [Gap 2 — specific artefact or process missing]

**Evidence summary**:

- [Artefact reference 1]
- [Artefact reference 2]

#### Governance — [Current Level]

**Strengths**:

- [Strength 1]
- [Strength 2]

**Areas for improvement**:

- [Gap 1]
- [Gap 2]

**Evidence summary**:

- [Artefact reference 1]
- [Artefact reference 2]

#### Security — [Current Level]

**Strengths**:

- [Strength 1]
- [Strength 2]

**Areas for improvement**:

- [Gap 1]
- [Gap 2]

**Evidence summary**:

- [Artefact reference 1]
- [Artefact reference 2]

#### Integration — [Current Level]

**Strengths**:

- [Strength 1]
- [Strength 2]

**Areas for improvement**:

- [Gap 1]
- [Gap 2]

**Evidence summary**:

- [Artefact reference 1]
- [Artefact reference 2]

#### Operations — [Current Level]

**Strengths**:

- [Strength 1]
- [Strength 2]

**Areas for improvement**:

- [Gap 1]
- [Gap 2]

**Evidence summary**:

- [Artefact reference 1]
- [Artefact reference 2]

---

## 3. Target State

### 3.1 Target Levels

| Dimension | Current | Target | Gap | Rationale |
|-----------|---------|--------|-----|-----------|
| Design | [L2] | [L4] | [+2] | [e.g., "Support multi-agent programmes with standardised patterns and automated design validation"] |
| Governance | [L1] | [L3] | [+2] | [e.g., "Regulatory compliance requires documented governance framework within 6 months"] |
| Security | [L2] | [L4] | [+2] | [e.g., "Security incidents require proactive threat modelling and automated security testing"] |
| Integration | [L1] | [L3] | [+2] | [e.g., "Enterprise integration requires standardised APIs and integration testing"] |
| Operations | [L2] | [L4] | [+2] | [e.g., "Production operations require SLA tracking, alerting, and automated response"] |

### 3.2 Priority Ranking

| Rank | Dimension | Priority | Justification |
|------|-----------|----------|---------------|
| 1 | [Dimension] | Critical | [Why this is the highest priority] |
| 2 | [Dimension] | High | [Why this ranks second] |
| 3 | [Dimension] | Medium | [Why this ranks third] |
| 4 | [Dimension] | Medium | [Why this ranks fourth] |
| 5 | [Dimension] | Low | [Why this ranks last] |

---

## 4. Improvement Roadmap

### 4.1 Improvement Initiatives

| Initiative | Dimension | From | To | Timeline | Investment | Owner |
|------------|-----------|------|----|----------|------------|-------|
| [Initiative 1 — e.g., "Design Pattern Library"] | [Design] | [L2] | [L3] | [Q1–Q2] | [£X / FTEs] | [Team] |
| [Initiative 2 — e.g., "Governance Board Setup"] | [Governance] | [L1] | [L2] | [Q1] | [£X / FTEs] | [Team] |
| [Initiative 3 — e.g., "Security Testing Automation"] | [Security] | [L2] | [L3] | [Q2–Q3] | [£X / FTEs] | [Team] |
| [Initiative 4 — e.g., "API Gateway Implementation"] | [Integration] | [L1] | [L2] | [Q2] | [£X / FTEs] | [Team] |
| [Initiative 5 — e.g., "Operations Dashboard"] | [Operations] | [L2] | [L3] | [Q3–Q4] | [£X / FTEs] | [Team] |

### 4.2 Initiative Details

#### [Initiative 1]: [Name]

**Dimension**: [Design]
**Scope**: [What this initiative will deliver]
**Activities**:

- [Activity 1]
- [Activity 2]
- [Activity 3]

**Success Criteria**:

- [Criterion 1 — measurable outcome]
- [Criterion 2 — measurable outcome]

**Dependencies**: [Depends on / Enables]
**Risks**: [Key risks and mitigations]

#### [Initiative 2]: [Name]

**Dimension**: [Governance]
**Scope**: [What this initiative will deliver]
**Activities**:

- [Activity 1]
- [Activity 2]
- [Activity 3]

**Success Criteria**:

- [Criterion 1 — measurable outcome]
- [Criterion 2 — measurable outcome]

**Dependencies**: [Depends on / Enables]
**Risks**: [Key risks and mitigations]

#### [Initiative 3]: [Name]

**Dimension**: [Security]
**Scope**: [What this initiative will deliver]
**Activities**:

- [Activity 1]
- [Activity 2]
- [Activity 3]

**Success Criteria**:

- [Criterion 1 — measurable outcome]
- [Criterion 2 — measurable outcome]

**Dependencies**: [Depends on / Enables]
**Risks**: [Key risks and mitigations]

### 4.3 Timeline

```mermaid
gantt
    title Agent Maturity Improvement Roadmap
    dateFormat  YYYY-MM
    section Phase 1 — Foundation
    Governance Board Setup       :active, gov1, 2026-Q1, 3M
    Design Pattern Library        :active, des1, 2026-Q1, 6M
    section Phase 2 — Capability
    Security Testing Automation   :active, sec1, 2026-Q2, 6M
    API Gateway Implementation    :active, int1, 2026-Q2, 4M
    section Phase 3 — Optimisation
    Operations Dashboard          :active, ops1, 2026-Q3, 6M
```

### 4.4 Dependencies and Sequencing

| Initiative | Depends On | Blocks |
|------------|-----------|--------|
| [Initiative 1] | [None / Initiative X] | [Initiative Y] |
| [Initiative 2] | [None] | [Initiative 3] |
| [Initiative 3] | [Initiative 2] | [None] |

---

## 5. Benchmarks

### 5.1 Industry Benchmarking

| Benchmark | Standard | Industry Average | Our Position | Gap |
|-----------|----------|----------------|--------------|-----|
| Design maturity | CMMI Software | L3 | [L2] | [-1] |
| Governance maturity | NIST AI RMF | L3 | [L1] | [-2] |
| Security maturity | OWASP LLM Top 10 | L3 | [L2] | [-1] |
| Integration maturity | TOGAF | L3 | [L1] | [-2] |
| Operations maturity | ITIL 4 | L4 | [L2] | [-2] |

### 5.2 Peer Comparison

| Peer Organisation | Overall Maturity | Strongest Dimension | Weakest Dimension |
|-------------------|------------------|---------------------|--------------------|
| [Organisation A] | [Level / Score] | [Dimension] | [Dimension] |
| [Organisation B] | [Level / Score] | [Dimension] | [Dimension] |
| **Our Programme** | [Level / Score] | [Dimension] | [Dimension] |

### 5.3 Regulatory Alignment

| Regulation | Requirement | Our Status | Evidence |
|------------|-------------|------------|----------|
| [Regulation 1] | [Requirement] | [Compliant/Partial/Non-compliant] | [Evidence] |
| [Regulation 2] | [Requirement] | [Compliant/Partial/Non-compliant] | [Evidence] |

---

## 6. Traceability

### 6.1 Source Artefacts

| Source | Document ID | Contribution |
|--------|-------------|--------------|
| Agent Inventory | ARC-{P}-AAGI-v{VERSION} | [Agent inventory and capability baseline] |
| Agent Architecture Specification | ARC-{P}-AAGR-v{VERSION} | [Design patterns, tool contracts, guardrails] |
| Agent Governance Framework | ARC-{P}-AAOV-v{VERSION} | [Governance maturity evidence] |
| Architecture Principles | ARC-000-PRIN-v{VERSION} | [Principles alignment for maturity targets] |

### 6.2 Cross-References

| Target | Document ID | Usage |
|--------|-------------|-------|
| Agent Design improvements | ARC-{P}-AAGR-v{NEXT} | [Design initiative outputs] |
| Governance updates | ARC-{P}-AAOV-v{NEXT} | [Governance initiative outputs] |
| Roadmap | ARC-{P}-ROAD-v{VERSION} | [Improvement roadmap integration] |

### 6.3 External References

| Reference | Source | Citation |
|-----------|--------|----------|
| [External benchmark / framework] | [Source name] | [Citation ID] |

---

> **Generated by**: ArcKit `/arckit:agent-maturity` command
> **Generated on**: [DATE] [TIME] GMT
> **ArcKit Version**: [VERSION]
> **Project**: [PROJECT_NAME] (Project [PROJECT_ID])
> **AI Model**: [MODEL_NAME]
> **Generation Context**: [SOURCE_DOCUMENTS]
