# Risk Management Guide

`/arckit.risk` builds an HM Treasury Orange Book–aligned risk register with scoring, treatment, and monitoring.

---

## Inputs & Timing

| Pre-requisite | Reason |
|---------------|--------|
| Stakeholder analysis | Provides owners and governance forums |
| Principles & requirements | Identify compliance and delivery risks |
| Business case / plan | Supplies cost, schedule, and dependency data |

Run after stakeholder analysis and before `/arckit.sobc` so the business case incorporates risk-adjusted actions.

---

## Command

```bash
/arckit.risk Create risk register for <project>
```

Output: `projects/<id>/ARC-<id>-RISK-v1.0.md` plus heatmap images.

---

## Register Layout

| Column | Description | Notes |
|--------|-------------|-------|
| Risk ID & Category | Strategic, Operational, Financial, Compliance, Reputational, Technology | Categories align with Orange Book |
| Description & Cause | Concise summary plus trigger | Use “Cause → Event → Effect” wording |
| Inherent Score | Likelihood × Impact (1–5) before controls | Colour-coded heatmap |
| Treatment (4Ts) | Tolerate / Treat / Transfer / Terminate | Include action owner, due date |
| Residual Score | Post-mitigation rating | Must sit within risk appetite |
| Monitoring | Review cadence, indicators, linkage to backlog | Reference JIRA/ServiceNow ticket if applicable |

---

## Workflow

```text
1. Run /arckit.risk
2. Review top 10 risks with delivery team
3. Assign actions (treat/transfer) and update backlog
4. Escalate risks breaching appetite to governance board
5. Re-run monthly or when major changes occur
```

---

## Heatmap Interpretation

- 20–25 (Critical) → Immediate escalation to SRO/board; consider stop/pause.
- 13–19 (High) → Action plan with owner and deadline agreed in next governance meeting.
- 6–12 (Medium) → Monitor, plan mitigations if trend worsens.
- 1–5 (Low) → Accept; document rationale.

---

## Linkages

- Optimism bias adjustments in `/arckit.sobc`.
- Compliance actions in `/arckit.secure`, `/arckit.dpia`, `/arckit.ai-playbook`.
- Project plan contingencies via `/arckit.plan`.
- Continuous monitoring in `/arckit.analyze` and `/arckit.story`.
