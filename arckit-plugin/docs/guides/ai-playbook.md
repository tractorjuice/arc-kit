# AI Playbook Assessment Playbook

`/arckit.ai-playbook` assesses UK Government AI Playbook compliance for responsible AI deployment in public sector projects.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI-related functional and non-functional requirements |
| Architecture diagrams | AI system components and data flows |
| Data model | Training data sources, personal data processing |
| Stakeholder drivers | Business context and user impact |

---

## Command

```bash
/arckit.ai-playbook Assess AI Playbook compliance for <project>
```

Output: `projects/<id>/ARC-<id>-AIPB-v1.0.md`

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall compliance status and key findings |
| AI System Overview | System description, use cases, decision types |
| 10 Principles Assessment | Compliance against each AI Playbook principle |
| Risk Assessment | AI-specific risks (bias, transparency, accountability) |
| Data Governance | Training data quality, bias mitigation, personal data |
| Human Oversight | Human-in-the-loop requirements, escalation paths |
| Explainability | How decisions can be explained to users |
| Monitoring & Evaluation | Ongoing performance and fairness monitoring |
| Compliance Roadmap | Actions needed for full compliance |

---

## 10 AI Playbook Principles

| # | Principle | Focus Area |
|---|-----------|------------|
| 1 | Use AI to support public sector tasks | Legitimate public benefit |
| 2 | Have clear goals and robust evaluation | Measurable outcomes |
| 3 | Be fair, accountable and transparent | Bias mitigation, explainability |
| 4 | Consider the full lifecycle | Development through retirement |
| 5 | Use quality data responsibly | Data governance and ethics |
| 6 | Ensure adequate human oversight | Human-in-the-loop controls |
| 7 | Keep data secure and manage risks | Security and risk management |
| 8 | Use existing tools where appropriate | Avoid reinvention |
| 9 | Build internal capability | Skills and knowledge transfer |
| 10 | Work in the open | Transparency and collaboration |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define AI use cases and requirements | `/arckit.requirements`, `/arckit.stakeholders` |
| Data | Design data model and assess data quality | `/arckit.data-model`, `/arckit.dpia` |
| Governance | Assess AI Playbook compliance | `/arckit.ai-playbook` |
| Transparency | Create algorithmic transparency record | `/arckit.atrs` |
| Operations | Plan ongoing monitoring and governance | `/arckit.mlops`, `/arckit.operationalize` |

---

## Review Checklist

- All 10 AI Playbook principles assessed with evidence.
- Bias risks identified with mitigation measures.
- Human oversight requirements clearly defined.
- Explainability approach documented for affected users.
- Training data quality and governance addressed.
- Ongoing monitoring plan for fairness and performance.
- Compliance roadmap with owners and timelines.

---

## Related UK Government Requirements

| Requirement | Document | When Needed |
|-------------|----------|-------------|
| Algorithmic Transparency | `ARC-<id>-ATRS-v1.0.md` | Public-facing algorithmic decisions |
| Data Protection Impact | `ARC-<id>-DPIA-v1.0.md` | AI processing personal data |
| MOD AI Assurance | `ARC-<id>-JSP936-v1.0.md` | Defence AI systems |

---

## Key Principles

1. **Public Benefit First**: AI must serve legitimate public sector goals.
2. **Fairness by Design**: Bias detection and mitigation from the start.
3. **Transparency**: Users should understand how AI affects them.
4. **Human Oversight**: Appropriate human control based on risk level.
5. **Continuous Evaluation**: Ongoing monitoring, not just initial assessment.
