# Stakeholder Analysis Guide

`/arckit.stakeholders` maps stakeholders to drivers, goals, outcomes, and engagement plans—forming the backbone for requirements, risks, and communications.

---

## Stakeholder Canvas

| Field | Description | Example |
|-------|-------------|---------|
| Role / Name | Individual or group | “Chief Finance Officer (CFO)” |
| Power / Interest | High / Medium / Low | “High power / High interest” |
| Drivers | Strategic, Operational, Financial, Compliance, Risk, Personal, Customer | “Financial – reduce run costs; Risk – avoid outages” |
| Goals | SMART statement derived from drivers | “Cut hosting costs by 30% within 12 months” |
| Outcomes | Measurable evidence that goal achieved | “Monthly FinOps report shows £1.8m annual saving” |
| Engagement | Communication cadence & format | “Weekly steering meeting, finance dashboard” |

ArcKit produces this structure automatically; use it during workshops to confirm accuracy.

---

## Command

```bash
/arckit.stakeholders Analyse stakeholders for <project>
```

Output: `projects/<id>/ARC-<id>-STKE-v1.0.md`

---

## Workflow Integration

| Follow-up | Reason |
|-----------|--------|
| `/arckit.requirements` | Each requirement traces back to stakeholder goals |
| `/arckit.risk` | Stakeholder concerns become risk owners and drivers |
| `/arckit.sobc` | Benefits and investment rationale align with goals |
| `/arckit.story` | Story chapters reference stakeholder outcomes |

---

## Engagement Checklist

- High power & high interest stakeholders receive frequent, detailed updates.
- Conflicts between stakeholders are documented with resolution actions.
- Change readiness level recorded (advocate, neutral, resistant).
- Communication plan covers weekly, monthly, and gate-specific touchpoints.
- Ensure GOV.UK accessibility and language considerations for citizen stakeholders.
