# UK Government AI Playbook Guide

`/arckit.ai-playbook` documents compliance with the UK Government AI Playbook’s 10 principles and 6 ethical themes.

---

## Command

```bash
/arckit.ai-playbook Assess AI Playbook compliance for <AI system>
```

Output: `projects/<id>/ARC-<id>-AIPB-v1.0.md`.

---

## Compliance Matrix

| Principle | Focus | Evidence Examples | Linked Artefacts |
|-----------|-------|-------------------|------------------|
| Understand users | Problem definition, user research, success metrics | Discovery notes, KPIs, personas | `/arckit.stakeholders`, `/arckit.requirements` |
| Lawful & ethical | GDPR, EqIA, DPIA, lawful basis | DPIA, legal review | `/arckit.dpia`, `/arckit.secure` |
| Security | Threat model, controls, monitoring | STRIDE, Secure by Design, logging plan | `/arckit.secure`, `/arckit.servicenow` |
| Human control | Human-in-the-loop, override, accountability | RAISO, playbooks, escalation paths | `/arckit.jsp-936`, runbooks |
| Lifecycle management | Governance throughout build → operate | Plan, change control, retraining triggers | `/arckit.plan`, `/arckit.story` |
| Right tool | Build vs buy rationale | Wardley map, research findings | `/arckit.wardley`, `/arckit.research` |
| Collaboration | Stakeholder engagement, cross-government sharing | Meeting logs, design forums | `/arckit.story` |
| Commercial partnership | Supplier accountability, contract clauses | SOW, evaluation, bias mitigation requirements | `/arckit.sow`, `/arckit.evaluate` |
| Skills & expertise | Team capability, training plans | Skills matrix, training records | `/arckit.plan` |
| Organisational alignment | Governance, reporting, assurance | Board minutes, risk logs | `/arckit.risk`, `/arckit.story` |

Ethical themes (Safety, Transparency, Fairness, Accountability, Contestability, Societal Wellbeing) are captured in the same output with recommended actions.

---

## Review Checklist

- Bias testing documented with metrics per protected characteristic.
- Human oversight and appeal process clearly defined (who, when, how).
- Model cards / datasheets attached for transparency.
- Drift monitoring and retraining policy in place with thresholds.
- Public communication plan covers ATRS and citizen-facing explanations.

---

## Cadence

| Stage | Activities |
|-------|------------|
| Discovery / Alpha | Baseline assessment, identify risks and mitigations |
| Beta | Update with model performance, bias tests, operational plans |
| Live | Review at least annually or after model changes / incidents |

Align actions with `/arckit.jsp-936` for MOD projects or `/arckit.dpia` for privacy-heavy systems.
