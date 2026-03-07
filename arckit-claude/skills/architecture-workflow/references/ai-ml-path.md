# AI/ML Project Path Modifier

## When This Modifier Applies

This is not a standalone path. Apply these additions to whichever base path matches the project sector (standard, UK Government, or Defence).

- Project includes AI or machine learning components
- Algorithmic decision-making systems
- Natural language processing or computer vision
- Predictive analytics or recommendation engines
- Any system requiring model training, serving, or monitoring

## Additional Commands

### Design and Analysis Phase

Add to the base path's Design and Analysis phase:

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/arckit:datascout` | Discover training data sources, validate data quality | Before data-model (if not already in base path) |

### Operations Phase

Add to the base path's Operations phase:

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/arckit:mlops` | ML model lifecycle: training pipelines, model registry, serving, monitoring, drift detection | After `/arckit:devops` |

### Compliance Phase

Which compliance commands to add depends on the base path:

#### UK Government Base Path

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/arckit:ai-playbook` | UK Government AI Playbook compliance (10 principles) | After `/arckit:tcop` |
| `/arckit:atrs` | Algorithmic Transparency Recording Standard (mandatory for public-facing algorithmic systems) | After `/arckit:ai-playbook` |

#### Defence Base Path

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/arckit:jsp-936` | MOD AI Assurance (JSP 936) — risk classification and approval pathway | After `/arckit:mod-secure` |

#### Standard Base Path

| Command | Rationale | Insert After |
|---------|-----------|-------------|
| `/arckit:ai-playbook` | AI Playbook principles are good practice even outside UK Government | Optional, after quality checks |

## Critical Gates

### UK Government AI Projects

- AI Playbook compliance required before Beta
- ATRS publication required before Live
- DPIA mandatory if AI processes personal data

### Defence AI Projects

- JSP 936 risk classification determines approval pathway:
  - **Critical**: 2PUS/Ministerial approval
  - **Severe/Major**: Defence-Level JROC/IAC approval
  - **Moderate/Minor**: TLB-Level approval
- MOD Secure by Design required before Beta
- JSP 936 approval required before Beta

### Standard AI Projects

- No mandatory compliance gates
- AI Playbook principles recommended as best practice
- DPIA recommended if processing personal data

## Key Considerations

- **Model governance**: Establish model risk management framework early (during requirements phase)
- **Training data**: Use `/arckit:datascout` to identify and evaluate training data sources
- **Bias and fairness**: Address in requirements (NFR-AI-xxx) and validate in ai-playbook assessment
- **Explainability**: Document explainability approach in ADRs
- **Monitoring**: MLOps must include model drift detection and retraining triggers

## Duration Impact

AI/ML components typically add:

- **2-4 weeks** for mlops planning
- **2-4 weeks** for AI compliance assessments (ai-playbook, atrs, jsp-936)
- **Ongoing** model monitoring and retraining cycles post-deployment
