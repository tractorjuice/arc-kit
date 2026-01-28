# Stakeholder Analysis Playbook

`/arckit.stakeholders` analyzes stakeholder drivers, goals, and measurable outcomes to establish project foundation.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Project brief | Initial context and objectives |
| Organization charts | Identify key stakeholders |
| Existing documentation | Current state understanding |
| Interview notes | Stakeholder perspectives |

---

## Command

```bash
/arckit.stakeholders Analyze stakeholders for <project>
```

Output: `projects/<id>/ARC-<id>-STKE-v1.0.md`

---

## Stakeholder Analysis Structure

| Section | Contents |
|---------|----------|
| Stakeholder Catalog | List of all stakeholders with roles |
| Stakeholder Profiles | Detailed profile per stakeholder |
| Drivers & Concerns | What motivates and worries each group |
| Goals & Outcomes | What success looks like |
| Power/Interest Grid | Prioritization matrix |
| Communication Plan | Engagement approach per stakeholder |
| RACI Matrix | Responsibility assignment |

---

## Stakeholder Profile Format

| Field | Description |
|-------|-------------|
| Name/Role | Who they are |
| Organization | Where they sit |
| Interest | What they care about |
| Influence | Power to affect project |
| Drivers | What motivates them |
| Concerns | What worries them |
| Goals | What they want to achieve |
| Success Metrics | How they measure success |

---

## Power/Interest Grid

| | Low Interest | High Interest |
|---|--------------|---------------|
| **High Power** | Keep Satisfied | Manage Closely |
| **Low Power** | Monitor | Keep Informed |

---

## RACI Matrix

| Role | Description |
|------|-------------|
| **R**esponsible | Does the work |
| **A**ccountable | Ultimately answerable (one per task) |
| **C**onsulted | Input required before decision |
| **I**nformed | Notified after decision |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Identify and analyze stakeholders | `/arckit.stakeholders` |
| Requirements | Capture requirements from stakeholders | `/arckit.requirements` |
| Planning | Plan based on stakeholder needs | `/arckit.sobc`, `/arckit.plan` |
| Execution | Regular stakeholder engagement | Governance meetings |
| Closure | Validate outcomes with stakeholders | `/arckit.story` |

---

## Review Checklist

- All relevant stakeholders identified.
- Each stakeholder has documented drivers and concerns.
- Goals are specific and measurable.
- Power/interest mapping completed.
- RACI matrix covers key decisions.
- Communication plan appropriate for each group.
- Conflicting interests identified and addressed.
- Executive sponsor clearly identified.

---

## Common Stakeholder Types

| Type | Typical Concerns |
|------|------------------|
| Executive Sponsor | Budget, timeline, business value |
| Product Owner | Features, user needs, prioritization |
| Technical Lead | Architecture, quality, feasibility |
| Operations | Supportability, reliability, handover |
| Security | Risk, compliance, data protection |
| Users | Usability, training, change impact |
| Finance | Cost, ROI, budget approval |

---

## Key Principles

1. **Early Engagement**: Identify stakeholders before requirements.
2. **Active Listening**: Understand concerns, not just stated needs.
3. **Balanced Representation**: Don't let loudest voice dominate.
4. **Clear Accountability**: One accountable person per decision.
5. **Continuous Engagement**: Stakeholder management is ongoing.
