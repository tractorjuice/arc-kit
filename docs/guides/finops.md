# FinOps framework: a guide to cloud cost management

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

FinOps is a practice that brings engineering, finance and business teams together to manage the cost and value of cloud and other technology spend. This guide covers the FinOps Foundation framework (principles, phases, personas and maturity) and how `/arckit:finops` writes a cloud cost management strategy.

---

## What FinOps is

The [FinOps Foundation](https://www.finops.org/introduction/what-is-finops/) (definition updated March 2026) says: "FinOps is an operational framework and cultural practice which maximizes the business value of technology, enables timely data-driven decision making, and creates financial accountability through collaboration between engineering, finance, and business teams."

The Foundation applies FinOps beyond public cloud, to other technology spend including SaaS, licensing, data centres and data cloud platforms.

---

## The FinOps framework

The [FinOps Framework](https://www.finops.org/framework/) sets out principles, phases, personas, domains and a maturity model.

### Principles

The Foundation lists six [principles](https://www.finops.org/framework/principles/), in no particular order:

1. Teams need to collaborate.
2. Business value drives technology decisions.
3. Everyone takes ownership for their technology usage.
4. FinOps data should be accessible, timely, and accurate.
5. FinOps should be enabled centrally.
6. Take advantage of the variable cost model of the cloud.

### Phases

| Phase | What happens |
|-------|--------------|
| Inform | Examine cost, usage and efficiency data to understand where you are: allocation, reporting, forecasting and unit economics. |
| Optimize | Find ways to improve efficiency and value. Usage changes involve engineering teams; rate changes involve procurement and leadership. |
| Operate | Put the chosen changes into practice, with accountability shared across engineering, finance and business teams. |

The [phases](https://www.finops.org/framework/phases/) are a loop, not a sequence. Teams cycle through them quickly and keep going back to Inform to check the effect of what they changed.

### Personas

| Type | Personas |
|------|----------|
| Core (always engaged) | FinOps Practitioner, Engineering, Finance, Product, Procurement, Leadership |
| Allied (support the practice) | ITAM, ITFM, ITSM, Security, Sustainability |

### Domains

The framework groups the outcomes of a FinOps practice into four domains: Understand Usage and Cost, Quantify Business Value, Optimize Usage and Cost, and Manage the FinOps Practice.

---

## FinOps maturity: crawl, walk, run

The [FinOps maturity model](https://www.finops.org/framework/maturity-model/) rates each capability separately. An organisation can be at Run for one capability and Crawl for another, and the Foundation says the goal should never be simply to reach Run in every capability. Put the effort where it brings the most business value.

| Level | What it looks like | Example KPIs from the Foundation |
|-------|--------------------|----------------------------------|
| Crawl | Little reporting and tooling. Basic KPIs, processes and policies are defined. The capability is understood but not followed by every major team. | At least 70% of cost allocated to a known owner; forecast within 20% of actual |
| Walk | The capability is understood and followed across the organisation. Automation or processes cover most requirements. Hard edge cases are identified. | At least 85% of cost allocated; forecast within 10% of actual |
| Run | Every team understands and follows the capability. Hard edge cases are being dealt with. Automation is the preferred approach. | Over 90% of spend allocated; forecast within 5% of actual |

---

## Using /arckit:finops

`/arckit:finops` creates a cloud financial management strategy covering cost visibility, optimization, governance, and forecasting.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Scale and budget constraints from NFRs |
| Architecture diagrams | Resource topology and cloud estate |
| DevOps strategy | Infrastructure patterns and cloud usage |
| Stakeholder drivers | Business value and ROI targets |

### Command

```bash
/arckit:finops Create FinOps strategy for <initiative>
```

Output: `projects/<id>/ARC-<id>-FINOPS-v1.0.md`

### Strategy Structure

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

### Maturity in the strategy

The strategy rates the current and target level of each FinOps capability, grouped by the Foundation's domains, as the Foundation does. An overall level, if given, is only a labelled summary of those ratings.

| Level | Characteristics | Cost Visibility |
|-------|-----------------|-----------------|
| Crawl | Basic tagging, monthly reports | Limited |
| Walk | Automated reports, budgets, alerts | Moderate |
| Run | Real-time visibility, optimization automation, forecasting | Full |

The table is a rough guide to what each level looks like for cost visibility; the Foundation's own descriptions and sample KPIs per level are on its [maturity model page](https://www.finops.org/framework/maturity-model/).

### Tagging Strategy Example

| Tag | Type | Purpose |
|-----|------|---------|
| `cost-center` | Mandatory | Financial allocation |
| `environment` | Mandatory | Dev/staging/prod differentiation |
| `owner` | Mandatory | Accountability |
| `project` | Mandatory | Project-level cost tracking |
| `team` | Optional | Team-level attribution |
| `data-classification` | Optional | Compliance tracking |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Understand cloud estate and spend patterns | `/arckit:requirements`, `/arckit:stakeholders` |
| Architecture | Design infrastructure and deployment topology | `/arckit:diagram`, `/arckit:devops` |
| Strategy | Create FinOps strategy | `/arckit:finops` |
| Implementation | Implement tagging, dashboards, alerts | `/arckit:backlog` |
| Operations | Ongoing optimization and governance | `/arckit:operationalize` |

### UK government spend approval

The UK government's digital and technology spend controls were removed from 1 April 2026 and replaced with a more devolved approach, set out in the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook). If the strategy's UK Government Compliance section refers to Cabinet Office spend controls, replace that with your organisation's own approval and assurance route.

---

## Review Checklist

- Tagging strategy covers all cost attribution needs.
- Reporting cadence meets stakeholder requirements.
- Optimization strategies align with workload patterns.
- Governance framework matches organizational structure.
- Budget alerts configured at 50%, 75%, 90%, 100%.
- Commitment management plan defined (RI/Savings Plans).
- UK Government spend approval route addressed (if applicable), under the Digital Assurance Playbook rather than the former spend controls.

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

These are the working principles the strategy is written to. The FinOps Foundation's own six principles are listed above.

1. **Cost Visibility First**: You cannot optimize what you cannot see.
2. **Shared Accountability**: Engineering teams own their cloud spend.
3. **Real-Time Decision Making**: Cost data should be timely and accessible.
4. **Variable Cost Model**: Cloud spend should scale with business value.
5. **Continuous Optimization**: Optimization is ongoing, not one-time.

---

## Useful Links

- [What is FinOps?](https://www.finops.org/introduction/what-is-finops/) (FinOps Foundation)
- [The FinOps Framework](https://www.finops.org/framework/): [principles](https://www.finops.org/framework/principles/), [phases](https://www.finops.org/framework/phases/), [personas](https://www.finops.org/framework/personas/) and [maturity model](https://www.finops.org/framework/maturity-model/)
- [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook) (GOV.UK, in force from 1 April 2026)
