# MLOps framework: model lifecycle and maturity guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

MLOps (machine learning operations) is the engineering practice of building, deploying and running machine learning models as one joined-up system, so they can be retrained and monitored reliably. This guide covers what MLOps involves, the published maturity models from Google Cloud and Microsoft, and how `/arckit:mlops` writes an MLOps strategy.

---

## What MLOps is

Google Cloud's architecture guide to [MLOps: continuous delivery and automation pipelines in machine learning](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) (last updated August 2024) defines MLOps as "an ML engineering culture and practice that aims at unifying ML system development (Dev) and ML system operation (Ops)".

The same guide lists the steps of a machine learning process:

1. Data extraction
2. Data analysis
3. Data preparation
4. Model training
5. Model evaluation
6. Model validation
7. Model serving
8. Model monitoring

It also names a property that ordinary software delivery doesn't have: continuous training (CT), which is "concerned with automatically retraining and serving the models".

---

## MLOps maturity models

Google Cloud and Microsoft each publish a maturity model that describes how far a team has automated this process. They use different numbers of levels, so say which one you mean when you quote a level.

### Google Cloud: three levels

| Level | Name | What it means |
|-------|------|---------------|
| 0 | Manual process | Every step is manual, including data analysis, data preparation, model training and validation. |
| 1 | ML pipeline automation | The ML pipeline is automated so the model can be trained continuously. |
| 2 | CI/CD pipeline automation | A robust automated CI/CD system updates the pipelines in production quickly and reliably. |

### Microsoft: five levels

Microsoft's [MLOps maturity model](https://learn.microsoft.com/azure/architecture/ai-ml/guide/mlops-maturity-model) defines five levels of technical capability:

| Level | Name | Highlights |
|-------|------|------------|
| 0 | No MLOps | Builds, deployments, testing and training are manual. |
| 1 | DevOps but no MLOps | Application builds and tests are automated, but releases still rely on data teams for every new model. |
| 2 | Automated training | Model training is automated and tracked centrally, and the model is easy to reproduce. Releases are still manual. |
| 3 | Automated model deployment | Releases are automatic, with full traceability from deployment back to the original data. |
| 4 | Full MLOps automated operations | The whole system is automated and monitored. Drift or regression signals trigger retraining automatically. |

Microsoft says an organisation often shows characteristics of more than one level at once, so treat the levels as a continuum. Its model covers predictive and classical machine learning. For generative AI it describes GenAIOps, which adds prompt life cycle, retrieval augmentation, output safety and token cost governance on top of MLOps.

---

## Using /arckit:mlops

`/arckit:mlops` creates a machine learning operations strategy covering model lifecycle, training pipelines, serving, monitoring, and governance.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | ML-related functional and non-functional requirements |
| Data model (`ARC-<id>-DATA-v1.0.md`) | Training data sources and features |
| AI Playbook assessment | Responsible AI context (UK Government) |
| Architecture principles | AI/ML technology standards |

### Command

```bash
/arckit:mlops Create MLOps strategy for <initiative>
```

Output: `projects/<id>/ARC-<id>-MLOPS-v1.0.md`

### Strategy Structure

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

### Maturity levels in the strategy

The strategy uses its own five-level scale. It doesn't match either published model level for level: Google counts continuous training (automatic retraining) as level 1, where this scale puts automated retraining at level 3, and Microsoft puts automated training at level 2, where this scale puts it at level 1. If you report a level outside the project, map it to the model your organisation uses.

| Level | Characteristics | Automation | When to Use |
|-------|-----------------|------------|-------------|
| 0 | Manual, notebooks | None | PoC, exploration |
| 1 | Automated training | Training pipeline | First production model |
| 2 | CI/CD for ML | + Serving pipeline | Multiple models |
| 3 | Automated retraining | + Monitoring triggers | Production at scale |
| 4 | Full automation | + Auto-remediation | Enterprise ML |

### Model Types

| Type | Characteristics | MLOps Needs |
|------|-----------------|-------------|
| Custom Trained | Full control, internal data | Full training infrastructure |
| Fine-Tuned | Base model + custom training | Compute for fine-tuning |
| Foundation Model (API) | External API (OpenAI, Anthropic) | Prompt management, cost control |
| Pre-built (SaaS) | Cloud AI services | Configuration management |

### Monitoring Requirements

| Monitoring Type | What It Detects |
|-----------------|-----------------|
| Data Drift | Statistical changes in input distributions |
| Concept Drift | Changes in the relationship between inputs and outputs |
| Model Performance | Degradation in accuracy, precision, recall over time |
| Prediction Drift | Changes in output distributions |
| Fairness | Bias across protected groups |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Identify ML use cases, data sources | `/arckit:requirements`, `/arckit:data-model` |
| Governance | Assess AI risks and compliance | `/arckit:ai-playbook`, `/arckit:atrs`, `/arckit:dpia` |
| Strategy | Create MLOps strategy | `/arckit:mlops` |
| Implementation | Build pipelines, deploy models | `/arckit:backlog`, `/arckit:devops` |
| Operations | Monitor, retrain, govern | `/arckit:operationalize` |

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
| Algorithmic Transparency | `ARC-<id>-ATRS-v1.0.md` | Government departments, and arm's-length bodies that deliver public or frontline services or deal directly with the public: tools that significantly influence decisions with public effect, or interact directly with the public ([ATRS guidance](https://www.gov.uk/government/publications/guidance-for-organisations-using-the-algorithmic-transparency-recording-standard/algorithmic-transparency-recording-standard-guidance-for-public-sector-bodies)) |
| MOD AI Assurance | `ARC-<id>-JSP936-v1.0.md` | Defence AI systems |
| Data Protection Impact | `ARC-<id>-DPIA-v1.0.md` | AI processing personal data |

---

## Key Principles

1. **Reproducibility First**: All training must be reproducible (versioned data, code, config).
2. **Monitoring is Essential**: Models degrade over time; monitoring is not optional.
3. **Governance is Built-In**: Governance is part of the pipeline, not an afterthought.
4. **Responsible AI**: Fairness and bias monitoring from day one.
5. **Human Oversight**: Maintain human oversight where required by risk level.

---

## Useful Links

- [MLOps: continuous delivery and automation pipelines in machine learning](https://docs.cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning) (Google Cloud)
- [MLOps maturity model](https://learn.microsoft.com/azure/architecture/ai-ml/guide/mlops-maturity-model) (Microsoft Learn)
- [GenAIOps for organisations with MLOps investments](https://learn.microsoft.com/azure/architecture/ai-ml/guide/genaiops-for-mlops) (Microsoft Learn)
