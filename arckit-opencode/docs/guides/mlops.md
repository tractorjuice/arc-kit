# MLOps Strategy Playbook

`/arckit.mlops` creates a machine learning operations strategy covering model lifecycle, training pipelines, serving, monitoring, and governance.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | ML-related functional and non-functional requirements |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Training data sources and features |
| AI Playbook assessment | Responsible AI context (UK Government) |
| Architecture principles | AI/ML technology standards |

---

## Command

```bash
/arckit.mlops Create MLOps strategy for <initiative>
```

Output: `projects/<id>/ARC-<id>-MLOPS-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| ML System Overview | Use cases, model types, maturity level, stakeholders |
| Model Inventory | Catalog of models with metadata, dependencies, risk classification |
| Data Pipeline | Training data sources, feature engineering, feature store, data versioning |
| Training Pipeline | Infrastructure, experiment tracking, hyperparameter optimization |
| Model Registry | Storage, versioning, metadata, approval workflow, promotion stages |
| Serving Infrastructure | Deployment patterns, platforms, scaling, A/B testing |
| Model Monitoring | Data drift, concept drift, performance, prediction drift, fairness |
| Retraining Strategy | Triggers, automated vs manual, champion-challenger, rollback |
| LLM/GenAI Operations | Prompt management, guardrails, token monitoring, RAG pipeline |
| CI/CD for ML | Source control, testing, continuous training/deployment |
| Model Governance | Documentation, approval, audit trail, risk assessment, retirement |
| Responsible AI Operations | Bias detection, explainability, human oversight, incident response |
| UK Government AI Compliance | AI Playbook, ATRS, JSP 936, DPIA alignment |
| Costs and Resources | Infrastructure costs, licensing, team structure |

---

## MLOps Maturity Levels

| Level | Characteristics | Automation | When to Use |
|-------|-----------------|------------|-------------|
| 0 | Manual, notebooks | None | PoC, exploration |
| 1 | Automated training | Training pipeline | First production model |
| 2 | CI/CD for ML | + Serving pipeline | Multiple models |
| 3 | Automated retraining | + Monitoring triggers | Production at scale |
| 4 | Full automation | + Auto-remediation | Enterprise ML |

---

## Model Types

| Type | Characteristics | MLOps Needs |
|------|-----------------|-------------|
| Custom Trained | Full control, internal data | Full training infrastructure |
| Fine-Tuned | Base model + custom training | Compute for fine-tuning |
| Foundation Model (API) | External API (OpenAI, Anthropic) | Prompt management, cost control |
| Pre-built (SaaS) | Cloud AI services | Configuration management |

---

## Monitoring Requirements

| Monitoring Type | What It Detects |
|-----------------|-----------------|
| Data Drift | Statistical changes in input distributions |
| Concept Drift | Changes in the relationship between inputs and outputs |
| Model Performance | Degradation in accuracy, precision, recall over time |
| Prediction Drift | Changes in output distributions |
| Fairness | Bias across protected groups |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Identify ML use cases, data sources | `/arckit.requirements`, `/arckit.data-model` |
| Governance | Assess AI risks and compliance | `/arckit.ai-playbook`, `/arckit.atrs`, `/arckit.dpia` |
| Strategy | Create MLOps strategy | `/arckit.mlops` |
| Implementation | Build pipelines, deploy models | `/arckit.backlog`, `/arckit.devops` |
| Operations | Monitor, retrain, govern | `/arckit.operationalize` |

---

## Review Checklist

- All ML requirements have model mapping.
- Monitoring covers data drift, concept drift, and performance.
- Model governance process defined (approval, audit, retirement).
- Responsible AI addressed (fairness, explainability, human oversight).
- Retraining triggers and thresholds defined.
- UK Government compliance addressed (ATRS, AI Playbook, JSP 936 if MOD).

---

## UK Government AI Requirements

| Requirement | Document | When Needed |
|-------------|----------|-------------|
| AI Playbook Compliance | `ARC-<id>-AIPB-v1.0.md` | All UK Gov AI projects |
| Algorithmic Transparency | `ARC-<id>-ATRS-v1.0.md` | Public-facing algorithmic decisions |
| MOD AI Assurance | `ARC-<id>-JSP936-v1.0.md` | Defence AI systems |
| Data Protection Impact | `ARC-<id>-DPIA-v1.0.md` | AI processing personal data |

---

## Key Principles

1. **Reproducibility First**: All training must be reproducible (versioned data, code, config).
2. **Monitoring is Essential**: Models degrade over time; monitoring is not optional.
3. **Governance is Built-In**: Governance is part of the pipeline, not an afterthought.
4. **Responsible AI**: Fairness and bias monitoring from day one.
5. **Human Oversight**: Maintain human oversight where required by risk level.
