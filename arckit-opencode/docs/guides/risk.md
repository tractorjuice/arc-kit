# Risk Register Playbook

`/arckit.risk` creates a comprehensive risk register following HM Treasury Orange Book principles for project and operational risk management.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Requirements that could be at risk |
| Stakeholder drivers | Business context and risk appetite |
| Architecture diagrams | Technical risks from design |
| Existing risk registers | Organizational risk context |

---

## Command

```bash
/arckit.risk Create risk register for <project>
```

Output: `projects/<id>/ARC-<id>-RISK-v1.0.md`

---

## Risk Register Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall risk profile and top risks |
| Risk Appetite | Organization's tolerance for risk |
| Risk Categories | Grouping of risks by type |
| Risk Register | Detailed risk entries with scoring |
| Risk Treatments | Mitigation actions and owners |
| Risk Monitoring | Review schedule and escalation |
| Dependencies | Cross-project and external risks |

---

## Orange Book 4Ts Risk Responses

| Response | Description | When to Use |
|----------|-------------|-------------|
| Tolerate | Accept the risk | Low impact, low likelihood |
| Treat | Mitigate the risk | Reduce likelihood or impact |
| Transfer | Share the risk | Insurance, contracts, third parties |
| Terminate | Avoid the risk | Remove the risk source entirely |

---

## Risk Scoring Matrix

| Likelihood / Impact | Very Low (1) | Low (2) | Medium (3) | High (4) | Very High (5) |
|---------------------|--------------|---------|------------|----------|---------------|
| **Very High (5)** | 5 | 10 | 15 | 20 | 25 |
| **High (4)** | 4 | 8 | 12 | 16 | 20 |
| **Medium (3)** | 3 | 6 | 9 | 12 | 15 |
| **Low (2)** | 2 | 4 | 6 | 8 | 10 |
| **Very Low (1)** | 1 | 2 | 3 | 4 | 5 |

---

## Risk Categories

| Category | Examples |
|----------|----------|
| Strategic | Business case viability, stakeholder support |
| Delivery | Timeline, resources, dependencies |
| Technical | Technology maturity, integration complexity |
| Security | Data breaches, cyber threats |
| Financial | Budget overrun, funding uncertainty |
| Compliance | Regulatory, legal, policy requirements |
| Operational | Service availability, support capability |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and stakeholders | `/arckit.requirements`, `/arckit.stakeholders` |
| Identification | Identify and categorize risks | `/arckit.risk` |
| Assessment | Score and prioritize risks | Review workshop |
| Treatment | Define mitigations and owners | Update risk register |
| Monitoring | Regular review and reporting | Governance meetings |

---

## Review Checklist

- Risk appetite clearly defined and agreed.
- All risk categories considered.
- Each risk has likelihood, impact, and score.
- All high/very high risks have treatment plans.
- Treatment owners and deadlines assigned.
- Dependencies on other projects captured.
- Review schedule established.
- Escalation thresholds defined.

---

## Risk Entry Format

| Field | Description |
|-------|-------------|
| ID | Unique identifier (RISK-001) |
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
