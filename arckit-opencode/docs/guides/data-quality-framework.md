# UK Government Data Quality Framework — ArcKit Reference Guide

This guide maps the [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework) (DQF) to ArcKit commands and artefacts. The DQF is published by the Government Data Quality Hub and provides principles, dimensions, and practical tools for managing data quality across government.

---

## Five Principles

| # | DQF Principle | Description | ArcKit Evidence |
|---|---------------|-------------|-----------------|
| 1 | **Commit to data quality** | Establish accountability and ongoing assessment | `/arckit:data-model` (Data Quality Framework section — owners, targets, monitoring) |
| 2 | **Know your users and their needs** | Research quality requirements of data consumers | `/arckit:stakeholders` (data governance roles), `/arckit:data-mesh-contract` (consumer SLAs) |
| 3 | **Assess quality throughout the data lifecycle** | Monitor at every stage: collect, store, use, share, archive | `/arckit:data-model` (quality metrics per entity, lifecycle stages) |
| 4 | **Communicate data quality clearly** | Transparent, plain-language quality information for consumers | `/arckit:data-mesh-contract` (quality statements, SLA targets, consumer documentation) |
| 5 | **Anticipate changes affecting quality** | Plan proactively to prevent quality degradation | `/arckit:risk` (data quality risks), `/arckit:operationalize` (monitoring, alerting) |

---

## Six Quality Dimensions

These dimensions are already scaffolded in the `/arckit:data-model` template with per-entity targets, validation rules, and measurement methods.

| Dimension | Definition | Template Section |
|-----------|-----------|-----------------|
| **Completeness** | All required records and values are present | Quality Dimensions → Completeness |
| **Uniqueness** | No unnecessary duplication of records | Quality Dimensions → Uniqueness |
| **Consistency** | Values align across systems and don't contradict | Quality Dimensions → Consistency |
| **Timeliness** | Data reflects current information, available when needed | Quality Dimensions → Timeliness |
| **Validity** | Data conforms to expected formats, ranges, and rules | Quality Dimensions → Validity |
| **Accuracy** | Data correctly represents real-world conditions | Quality Dimensions → Accuracy |

---

## Four Practical Tools

### 1. Data Quality Action Plans

Prioritised improvement steps for critical data issues. The data-model template captures this through:
- Quality targets per entity and dimension (gap = target vs current)
- Issue classification (Critical/High/Medium/Low)
- Resolution process with owner assignment

**When to create a formal action plan**: When quality scores consistently fall below targets, or when a new data source is onboarded with unknown quality characteristics.

### 2. Root Cause Analysis

Techniques for addressing underlying data quality problems rather than symptoms.

| Technique | When to Use |
|-----------|------------|
| **5 Whys** | Simple causal chains — "why is email accuracy dropping?" |
| **Fishbone (Ishikawa)** | Multiple contributing factors — people, process, technology, data sources |
| **Pareto Analysis** | Prioritise — which 20% of causes drive 80% of quality issues? |

**ArcKit integration**: Record root causes and remediation in `/arckit:risk` (risk register) and track actions in `/arckit:backlog`.

### 3. Metadata Guidance

Minimum metadata set for documenting data characteristics. The data-model template captures this through:
- Entity catalogue (definitions, data types, keys, constraints)
- Data dictionary with attribute-level descriptions
- Source system and refresh cadence per entity
- Data steward contact per entity/domain

### 4. Data Maturity Model

Self-assessment of organisational data quality capability.

| Level | Description | Indicators |
|-------|-------------|------------|
| **Initial** | Ad hoc, reactive quality management | No formal ownership, quality issues discovered by users |
| **Repeatable** | Basic processes and ownership defined | Data stewards assigned, some quality rules |
| **Defined** | Standardised processes across the organisation | Quality dimensions measured, dashboards in place |
| **Managed** | Quantitative quality management with targets | SLAs defined, automated monitoring, regular reporting |
| **Optimising** | Continuous improvement, predictive quality | Proactive issue prevention, root cause analysis embedded |

**ArcKit evidence**: The data-model template's quality metrics section (overall score, monitoring, alerting) provides evidence for Defined/Managed maturity. The issue resolution process supports Managed/Optimising.

---

## Data Lifecycle Stages

The DQF expects quality assessment at every stage of the data lifecycle.

| Lifecycle Stage | Quality Focus | ArcKit Artefact |
|-----------------|--------------|-----------------|
| **Plan** | Define quality requirements and targets | `/arckit:requirements` (DR-xxx data requirements) |
| **Collect / Ingest** | Validate at point of entry | `/arckit:data-model` (validation rules, reject/accept logic) |
| **Prepare / Store / Maintain** | Cleanse, deduplicate, reconcile | `/arckit:data-model` (deduplication rules, reconciliation process) |
| **Use / Process** | Monitor quality during processing | `/arckit:data-model` (quality metrics, dashboards) |
| **Share / Publish** | Communicate quality to consumers | `/arckit:data-mesh-contract` (SLAs, quality statements) |
| **Archive / Destroy** | Maintain quality of retained data | `/arckit:data-model` (retention policy, disposal procedures) |

---

## Relationship to Other Frameworks

| Framework | Relationship to DQF |
|-----------|---------------------|
| **National Data Strategy** | DQF implements the Data Foundations pillar (Mission 3: transforming government data use) |
| **GovS 010: Analysis** | Parent functional standard for analytical quality and data management |
| **ISO 8000** | International data quality standard — DQF dimensions align with ISO 8000 |
| **DAMA DMBOK** | Industry data management body of knowledge — DQF covers a subset of DAMA quality domains |
| **AI Readiness Guidelines** | AI-ready datasets require DQF-level quality assurance |

---

## References

- [Government Data Quality Framework](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework)
- [Government Data Quality Hub](https://www.gov.uk/government/organisations/government-data-quality-hub/about)
- [DQF Guidance](https://www.gov.uk/government/publications/the-government-data-quality-framework/the-government-data-quality-framework-guidance)
- [Making Government Datasets Ready for AI](https://www.gov.uk/government/publications/making-government-datasets-ready-for-ai/guidelines-and-best-practices-for-making-government-datasets-ready-for-ai)
- [GDS Data Standards](https://www.gov.uk/government/collections/data-standards-for-government)
