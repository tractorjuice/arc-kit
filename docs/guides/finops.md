# FinOps Strategy Playbook

`/arckit.finops` creates a cloud financial management strategy covering cost visibility, optimization, governance, and forecasting.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Scale and budget constraints from NFRs |
| Architecture diagrams | Resource topology and cloud estate |
| DevOps strategy | Infrastructure patterns and cloud usage |
| Stakeholder drivers | Business value and ROI targets |

---

## Command

```bash
/arckit.finops Create FinOps strategy for <initiative>
```

Output: `projects/<id>/ARC-<id>-FINOPS-v1.0.md`

---

## Strategy Structure

| Section | Contents |
|---------|----------|
| FinOps Overview | Strategic objectives, maturity level, team structure |
| Cloud Estate Overview | Providers, accounts, workloads, current spend, trends |
| Tagging Strategy | Mandatory/optional tags, enforcement policies |
| Cost Visibility & Reporting | Allocation model, dashboards, attribution |
| Budgeting & Forecasting | Budget setting, types, forecasting methodology |
| Showback/Chargeback | Allocation methodology, shared costs, unit economics |
| Cost Optimization | Rightsizing, reserved instances, spot usage, storage tiering |
| Commitment Management | RI inventory, Savings Plans, utilization targets |
| Anomaly Detection | Thresholds, alerts, investigation workflow |
| Governance & Policies | Approval workflows, quotas, exception handling |
| FinOps Tooling | Native cloud tools, third-party, automation |
| Sustainability & Carbon | Carbon footprint, green practices, sustainability reporting |
| UK Government Compliance | Spending controls, Treasury Green Book, G-Cloud tracking |
| Operating Model | Review cadence, stakeholder engagement, escalation |
| Metrics & KPIs | Cost efficiency, unit economics, optimization targets |

---

## FinOps Maturity Levels

| Level | Characteristics | Cost Visibility |
|-------|-----------------|-----------------|
| Crawl | Basic tagging, monthly reports | Limited |
| Walk | Automated reports, budgets, alerts | Moderate |
| Run | Real-time visibility, optimization automation, forecasting | Full |

---

## Tagging Strategy Example

| Tag | Type | Purpose |
|-----|------|---------|
| `cost-center` | Mandatory | Financial allocation |
| `environment` | Mandatory | Dev/staging/prod differentiation |
| `owner` | Mandatory | Accountability |
| `project` | Mandatory | Project-level cost tracking |
| `team` | Optional | Team-level attribution |
| `data-classification` | Optional | Compliance tracking |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Understand cloud estate and spend patterns | `/arckit.requirements`, `/arckit.stakeholders` |
| Architecture | Design infrastructure and deployment topology | `/arckit.diagram`, `/arckit.devops` |
| Strategy | Create FinOps strategy | `/arckit.finops` |
| Implementation | Implement tagging, dashboards, alerts | `/arckit.backlog` |
| Operations | Ongoing optimization and governance | `/arckit.operationalize` |

---

## Review Checklist

- Tagging strategy covers all cost attribution needs.
- Reporting cadence meets stakeholder requirements.
- Optimization strategies align with workload patterns.
- Governance framework matches organizational structure.
- Budget alerts configured at 50%, 75%, 90%, 100%.
- Commitment management plan defined (RI/Savings Plans).
- UK Government spending controls addressed (if applicable).

---

## Key Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Tagging Coverage | % of resources with required tags | >95% |
| Commitment Coverage | % of spend covered by commitments | 60-80% |
| Commitment Utilization | % of commitments actually used | >90% |
| Waste Identified | % of spend on idle/unused resources | <5% |
| Unit Cost | Cost per transaction/user/request | Trending down |

---

## Key Principles

1. **Cost Visibility First**: You cannot optimize what you cannot see.
2. **Shared Accountability**: Engineering teams own their cloud spend.
3. **Real-Time Decision Making**: Cost data should be timely and accessible.
4. **Variable Cost Model**: Cloud spend should scale with business value.
5. **Continuous Optimization**: Optimization is ongoing, not one-time.
