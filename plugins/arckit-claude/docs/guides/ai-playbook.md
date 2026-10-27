# AI Playbook for the UK Government: the 10 principles

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

The AI Playbook for the UK Government is the government's guidance on using AI safely, responsibly and effectively, built around 10 principles. This guide lists the principles and ethical themes, explains who the playbook is for, and shows how `/arckit:ai-playbook` assesses a project against it.

---

## What the AI Playbook is

The Government Digital Service published the [AI Playbook for the UK Government](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government) on 10 February 2025. It updates and expands the Generative AI Framework for HMG of January 2024, and was retitled to cover a wider range of AI than generative AI.

The playbook explains what AI is, including its limitations and risks, and how to select, buy and deploy it in government. It is organised into:

- the 10 principles
- understanding AI: what it is, its fields, applications in government and its limitations
- building AI solutions: building the team, defining the goal and buying AI
- using AI safely and responsibly: ethics, legal considerations, data protection and privacy, security and governance
- an appendix of public sector case studies

## Who it applies to

GOV.UK describes the 10 principles as ones "civil servants should uphold when using AI". The foreword says the playbook is for government departments and public sector organisations. GovS 005, the [Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital), lists it as best practice guidance for organisations implementing AI.

The playbook itself is guidance, and principle 10 asks you to use it alongside your organisation's own policies. It points to requirements that are mandatory in their own right:

- If you're a central government department or an arm's length body within scope, you're required to use the [Algorithmic Transparency Recording Standard (ATRS)](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub).
- An AI service must comply with the Secure by Design principles and the government's Cyber Security Standard.
- If you develop a service, you must use the [Service Standard](https://www.gov.uk/service-manual/service-standard). Since September 2026, service assessments ask about AI: see [using AI in services](https://www.gov.uk/service-manual/technology/using-artificial-intelligence-ai-in-services).

---

## The 10 principles

The principles are quoted from the [playbook](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government/artificial-intelligence-playbook-for-the-uk-government-html). The evidence and artefact columns are ArcKit's suggestions.

| # | Principle | Evidence examples | ArcKit artefacts |
|---|-----------|-------------------|------------------|
| 1 | You know what AI is and what its limitations are | Documented limitations and failure modes, a process to test output accuracy | `/arckit:requirements`, `/arckit:risk` |
| 2 | You use AI lawfully, ethically and responsibly | Legal and data protection advice, DPIA, equality and bias assessment, environmental impact | `/arckit:dpia`, `/arckit:risk` |
| 3 | You know how to use AI securely | Threat model covering AI-specific threats such as data poisoning and prompt injection, Secure by Design, security testing | `/arckit:secure`, `/arckit:servicenow` |
| 4 | You have meaningful human control at the right stages | Human validation of high-risk decisions, testing before deployment, a way for users to report issues and prompt human review | `/arckit:operationalize`, runbooks (`/arckit:jsp-936` for defence) |
| 5 | You understand how to manage the full AI life cycle | Life cycle plan to decommissioning, drift and bias monitoring, retraining triggers | `/arckit:plan`, `/arckit:mlops` |
| 6 | You use the right tool for the job | Options including non-AI solutions, build vs buy rationale | `/arckit:research`, `/arckit:wardley` |
| 7 | You are open and collaborative | Engagement with cross-government communities and civil society, ATRS record where required, chatbot responses labelled as automated | `/arckit:stakeholders`, `/arckit:atrs` |
| 8 | You work with commercial colleagues from the start | Early commercial engagement, contract terms on transparency and responsible AI | `/arckit:sow`, `/arckit:evaluate` |
| 9 | You have the skills and expertise needed to implement and use AI solutions | Skills matrix, training records, including for decision makers and SROs | `/arckit:plan` |
| 10 | You use these principles alongside your organisation's policies and have the right assurance in place | Organisation policies followed, assurance team engaged early, AI review board or programme board, documented review and escalation | `/arckit:risk`, `/arckit:story` |

## The six ethical themes

The playbook's ethics section names six themes to address:

| Theme | What the playbook asks |
|-------|------------------------|
| Safety, security and robustness | AI systems that are resilient and work reliably, even in unforeseen situations or under adversarial attack |
| Transparency and explainability | Communicate how, when and for what purposes an AI system is used, and make its outputs explainable |
| Fairness, bias and discrimination | Outputs that are unprejudiced and do not amplify existing social, demographic or cultural disparities |
| Accountability and responsibility | Individuals and organisations can be held responsible for the effects of the AI systems they develop, deploy or use |
| Contestability and redress | Ways to challenge AI outputs or decisions and seek remedy, designed before deployment and maintained throughout |
| Societal wellbeing and public good | Minimise harm, and actively use AI to solve societal challenges |

---

## Preparing an AI Playbook assessment

### Review Checklist

- All 10 AI Playbook principles assessed with evidence.
- All six ethical themes addressed with recommended actions.
- Bias risks identified with mitigation measures, and bias testing documented with metrics per protected characteristic.
- Human oversight requirements clearly defined, including the appeal process (who, when, how).
- Explainability approach documented for affected users.
- Training data quality and governance addressed.
- Model cards or datasheets attached for transparency.
- Drift monitoring and retraining policy in place, with thresholds.
- Ongoing monitoring plan for fairness and performance.
- Public communication plan covers the ATRS record and citizen-facing explanations.
- Compliance roadmap with owners and timelines.

### When to review

| Stage | Activities |
|-------|------------|
| Discovery / Alpha | Baseline assessment, identify risks and mitigations |
| Beta | Update with model performance, bias tests, operational plans |
| Live | Review at least annually or after model changes / incidents |

---

## Using /arckit:ai-playbook

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI-related functional and non-functional requirements |
| Architecture diagrams | AI system components and data flows |
| Data model | Training data sources, personal data processing |
| Stakeholder drivers | Business context and user impact |

### Command

```bash
/arckit:ai-playbook Assess AI Playbook compliance for <project>
```

Output: `projects/<id>/ARC-<id>-AIPB-v1.0.md`

### Assessment Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Overall compliance status and key findings |
| AI System Overview | System description, use cases, decision types |
| The 10 Core Principles Assessment | Compliance against each AI Playbook principle |
| Six Ethical Themes Assessment | Safety, transparency, fairness, accountability, contestability and societal wellbeing |
| Overall Assessment Summary | Compliance scorecard, risk-based decision, critical issues, recommendations |
| Action Plan | Actions needed for full compliance, with owners |
| Mandatory Documentation | Required assessments and governance approvals |
| Go/No-Go Decision and Sign-Off | Deployment decision and approvals |
| Review Schedule | When the assessment is next reviewed |

### One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define AI use cases and requirements | `/arckit:requirements`, `/arckit:stakeholders` |
| Data | Design data model and assess data quality | `/arckit:data-model`, `/arckit:dpia` |
| Governance | Assess AI Playbook compliance | `/arckit:ai-playbook` |
| Transparency | Create algorithmic transparency record | `/arckit:atrs` |
| Operations | Plan ongoing monitoring and governance | `/arckit:mlops`, `/arckit:operationalize` |

---

## Related UK Government Requirements

| Requirement | Document | When Needed |
|-------------|----------|-------------|
| Algorithmic Transparency | `ARC-<id>-ATRS-v1.0.md` | Public-facing algorithmic decisions |
| Data Protection Impact | `ARC-<id>-DPIA-v1.0.md` | AI processing personal data |
| MOD AI Assurance | `ARC-<id>-JSP936-v1.0.md` | Defence AI systems |

Align actions with `/arckit:jsp-936` for MOD projects or `/arckit:dpia` for privacy-heavy systems.

---

## Key Principles

1. **Public Benefit First**: AI must serve legitimate public sector goals.
2. **Fairness by Design**: Bias detection and mitigation from the start.
3. **Transparency**: Users should understand how AI affects them.
4. **Human Oversight**: Appropriate human control based on risk level.
5. **Continuous Evaluation**: Ongoing monitoring, not just initial assessment.

---

## Useful Links

- [AI Playbook for the UK Government](https://www.gov.uk/government/publications/ai-playbook-for-the-uk-government) (GOV.UK, February 2025)
- [Algorithmic Transparency Recording Standard hub](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub)
- [AI Risk Management Toolkit](https://www.gov.uk/government/publications/ai-risk-management-toolkit) (DSIT, September 2026)
- [Using artificial intelligence in services](https://www.gov.uk/service-manual/technology/using-artificial-intelligence-ai-in-services) (Service Manual)
- [AI Playbook summary matrix](uk-government/ai-playbook.md), the short reference version of this guide
