# Risk register: template and Orange Book guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A risk register records the risks to a project's objectives, with a score, an owner and a planned response for each. This guide covers what HM Treasury's Orange Book expects of risk management in government, what a register should contain, and how `/arckit:risk` builds one.

---

## The Orange Book and who it applies to

[The Orange Book: Management of Risk, Principles and Concepts](https://www.gov.uk/government/publications/orange-book/the-orange-book-management-of-risk-principles-and-concepts) is the UK government's guidance on risk management, published by HM Treasury and the Government Finance Function. The current edition (May 2023) builds on the 2020 version and adds Part II, the risk control framework.

- **Scope**: it applies to all government departments and arm's length public bodies (executive agencies, non-departmental public bodies and non-ministerial departments) with responsibility for public funds derived from central government. The wider UK public sector may also find it useful.
- **Comply or explain**: the five main principles are mandatory and the supporting principles are advisory. Each organisation must disclose compliance, or explain why it departs, in the governance statement that accompanies its annual resource accounts.
- **Review**: the organisation should review its risk management framework, and the outcomes it achieves, at least annually.

The five main principles say that risk management shall be:

| Principle | Main principle |
|-----------|----------------|
| A | An essential part of governance and leadership |
| B | An integral part of all organisational activities, to support decision-making |
| C | Collaborative, and informed by the best available information and expertise |
| D | Structured to include identification and assessment, treatment, monitoring and reporting |
| E | Continually improved through learning and experience |

On 29 July 2026 HM Treasury removed four supplementary guides from the [Orange Book page](https://www.gov.uk/government/publications/orange-book) as out of date, including the Risk Appetite Guidance Note and the Good Practice Guide on risk reporting.

---

## What a risk register should contain

The Orange Book sets principles. It does not prescribe a register format or a scoring matrix. What it does ask for:

- **A common set of risk criteria** based on the likelihood of a risk occurring and its consequences, so risks can be compared and prioritised (principle D4).
- **Risks stated as cause, event and consequence**, taking care not to record a consequence as if it were the risk itself (Annex 5).
- **An evaluation against risk appetite**: the nature and extent of risk the organisation is willing to take (D6).
- **A treatment plan** for each chosen option, covering the rationale, the actions, who is accountable and responsible, resources, performance measures and early warning indicators, constraints, timescales, and how it will be reported and monitored (D8).

### Treatment options

The current Orange Book does not use the "4Ts". Principle D6 lists these options, and one or more may apply:

- Avoid the risk, if feasible, by not starting or continuing the activity.
- Take or increase the risk in order to pursue an opportunity.
- Retain the risk by informed decision.
- Change the likelihood, where possible.
- Change the consequences, including planning contingency activities.
- Share the risk, for example through commercial contracts.

### Example risk categories

Annex 4 of the Orange Book gives example categories. It says they are not meant to be comprehensive: strategy, governance, operations, legal, property, financial, commercial, people, technology, information, security, project/programme, and reputational.

---

## Building and reviewing a risk register

1. Identify risks across the project's objectives, whether or not their sources are under your direct control.
2. Analyse each risk for likelihood and impact against your agreed scales.
3. Evaluate the results against risk appetite and choose a treatment.
4. Assign an owner, actions and dates to each treatment.
5. Monitor and report at an agreed frequency, and escalate risks that exceed appetite.

### Review Checklist

- Risk appetite clearly defined and agreed.
- All risk categories considered.
- Each risk has likelihood, impact, and score.
- All high and critical risks have treatment plans.
- Treatment owners and deadlines assigned.
- Dependencies on other projects captured.
- Review schedule established.
- Escalation thresholds defined.

---

## Using /arckit:risk

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Requirements that could be at risk |
| Stakeholder drivers | Business context and risk appetite |
| Architecture diagrams | Technical risks from design |
| Existing risk registers | Organizational risk context |

### Command

```bash
/arckit:risk Create risk register for <project>
```

Output: `projects/<id>/ARC-<id>-RISK-v1.0.md`

### Risk Register Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall risk profile, risks exceeding appetite, top risks |
| Risk Matrix | Inherent (before controls) and residual (after controls) heat maps |
| Top 10 Risks | Ranked by residual score |
| Detailed Risk Register | One entry per risk with scoring, controls, response and action plan |
| Risk Category Analysis | Profile for each of the six categories |
| Risk Ownership Matrix | Who owns which risks |
| Response Summary | Count of risks by 4Ts response |
| Risk Appetite Compliance | Risks within and exceeding appetite |
| Prioritised Action Plan | Urgent, high and medium actions |
| Integration with SOBC | What the register feeds into the business case |
| Monitoring and Review | Review schedule, key risk indicators, escalation criteria |
| Orange Book Compliance Checklist | Evidence against the main principles and the risk control framework |

### Risk Responses (4Ts)

ArcKit records each risk's primary response as one of the 4Ts. They map to the Orange Book's treatment options like this:

| Response | Description | When to Use | Orange Book option (D6) |
|----------|-------------|-------------|-------------------------|
| Tolerate | Accept the risk | Low impact, low likelihood | Retain the risk by informed decision |
| Treat | Mitigate the risk | Reduce likelihood or impact | Change the likelihood or the consequences |
| Transfer | Share the risk | Insurance, contracts, third parties | Share the risk |
| Terminate | Avoid the risk | Remove the risk source entirely | Avoid the risk |

The Orange Book also allows taking or increasing a risk to pursue an opportunity; record that decision and its rationale in the risk entry.

### Risk Scoring Matrix

| Likelihood / Impact | Negligible (1) | Minor (2) | Moderate (3) | Major (4) | Catastrophic (5) |
|---------------------|----------------|-----------|--------------|-----------|------------------|
| **Almost certain (5)** | 5 | 10 | 15 | 20 | 25 |
| **Likely (4)** | 4 | 8 | 12 | 16 | 20 |
| **Possible (3)** | 3 | 6 | 9 | 12 | 15 |
| **Unlikely (2)** | 2 | 4 | 6 | 8 | 10 |
| **Rare (1)** | 1 | 2 | 3 | 4 | 5 |

Scores of 1 to 5 are Low, 6 to 12 Medium, 13 to 19 High and 20 to 25 Critical. Replace these scales with your organisation's if it has its own.

### Risk Categories

| Category | Examples |
|----------|----------|
| Strategic | Strategic direction changes, policy changes, stakeholder support |
| Operational | Service delivery, skills gaps, resources, dependencies |
| Financial | Budget overrun, funding shortfall, cost escalation |
| Compliance/Regulatory | Laws, regulations, data protection, procurement rules |
| Reputational | Public confidence, media scrutiny, visible service failures |
| Technology | Technical failure, cyber security, legacy integration, vendor lock-in |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and stakeholders | `/arckit:requirements`, `/arckit:stakeholders` |
| Identification | Identify and categorize risks | `/arckit:risk` |
| Assessment | Score and prioritize risks | Review workshop |
| Treatment | Define mitigations and owners | Update risk register |
| Monitoring | Regular review and reporting | Governance meetings |

### Risk Entry Format

| Field | Description |
|-------|-------------|
| ID | Unique identifier (R-001) |
| Title | Brief description |
| Category | Risk category |
| Description | Detailed explanation |
| Cause | What could cause this risk |
| Effect | Impact if risk materializes |
| Likelihood | 1-5 score with rationale |
| Impact | 1-5 score with rationale |
| Inherent Score | Likelihood × Impact (before treatment) |
| Response | Tolerate/Treat/Transfer/Terminate |
| Treatment | Actions to address the risk |
| Owner | Person accountable |
| Residual Score | Score after treatment |

---

## Key Principles

1. **Risk-Informed Decisions**: Use risk to guide project decisions.
2. **Proportionate Response**: Treatment effort matches risk severity.
3. **Clear Ownership**: Every risk has a named owner.
4. **Regular Review**: Risks change; register must be living document.
5. **Escalation Culture**: High risks escalate promptly to senior leaders.

---

## Useful Links

- [The Orange Book: Management of Risk, Principles and Concepts](https://www.gov.uk/government/publications/orange-book/the-orange-book-management-of-risk-principles-and-concepts) (GOV.UK)
- [Orange Book publication page](https://www.gov.uk/government/publications/orange-book), including the Central Government's Assurance Directory
