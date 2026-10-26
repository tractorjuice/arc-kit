# Stakeholder mapping and analysis: power/interest grid guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

A stakeholder map shows the people and groups who can influence your work or are affected by it, and how they relate to one another. This guide covers stakeholder analysis, the power/interest grid and how `/arckit:stakeholders` links each stakeholder to drivers, goals and measurable outcomes.

---

## What stakeholder mapping and analysis are

The FCDO's [practical guidance note on understanding stakeholders and political networks](https://www.gov.uk/government/publications/understanding-stakeholders-and-political-networks-practical-guidance-note) (April 2026) describes stakeholders as "individuals, organisations, groups or networks who can influence or who are affected by the issue you are examining".

- **Stakeholder analysis** identifies the key actors for your objective and assesses their interests, influence and position.
- **A stakeholder map** shows those stakeholders visually. Government guidance on [stakeholder engagement in heat networks](https://www.gov.uk/government/publications/stakeholder-engagement-in-heat-networks-a-guide-for-project-managers) says a map lets you understand "who your stakeholders are but also how they relate to one another".
- **Political network mapping**, in the FCDO note, goes a step further. It maps the relationships between actors: who has access to whom, coalitions, and the people who bridge groups.

The FCDO note says the purpose is "utility for decision-making, not representation accuracy". Treat your map as a working hypothesis, and update it as people, roles and positions change.

## How to map stakeholders

The FCDO note sets out seven steps:

1. Clarify your objective and how you will use the analysis.
2. Gather the information you need.
3. List the main stakeholders. The note suggests narrowing the list to the most relevant 20 to 30.
4. Explore what you know about each one: their power, interest, influence and relationships.
5. Map them, in a stakeholder matrix, a network map or both.
6. Discuss what the map means for your strategy or programme.
7. Develop and carry out a stakeholder engagement plan.

When you build the list, separate people in the same organisation who have different interests, such as a minister and the civil servants who advise them. Include people with influence who sit outside the formal structure. A stakeholder map records information about named people, so handle it in line with data protection law.

## Power/Interest Grid

The heat networks guide calls the interest-influence grid "the most commonly-used stakeholder prioritisation tool". Place each stakeholder by how much power they have over the work and how much interest they have in it, then choose how to engage them.

| | Low Interest | High Interest |
|---|--------------|---------------|
| **High Power** | Keep Satisfied | Manage Closely |
| **Low Power** | Monitor | Keep Informed |

Quadrant names vary between sources. The heat networks guide uses Key Players, Keep Satisfied, Keep Informed and Build Awareness. The FCDO note labels its quadrants by stance on the change: reformers, blockers, supporters and disengaged. In every version, the stakeholders with both high power and high interest get the most attention.

Two cautions from the heat networks guide:

- Interest can come from a negative or a positive perspective, so place opponents on the grid as well as supporters.
- Your view of a stakeholder's importance may not match their own view of it.

---

## Using /arckit:stakeholders

### Inputs

| Artefact | Purpose |
|----------|---------|
| Project brief | Initial context and objectives |
| Organization charts | Identify key stakeholders |
| Existing documentation | Current state understanding |
| Interview notes | Stakeholder perspectives |

### Command

```bash
/arckit:stakeholders Analyze stakeholders for <project>
```

Output: `projects/<id>/ARC-<id>-STKE-v1.0.md`

### Stakeholder Analysis Structure

| Section | Contents |
|---------|----------|
| Executive Summary | Purpose, key findings, critical success factors, alignment score |
| Stakeholder Identification | Internal and external stakeholders with influence, interest and engagement strategy; UK government digital and security roles where relevant |
| Power-Interest Grid | Prioritisation matrix and engagement approach per quadrant |
| Stakeholder Drivers Analysis | What motivates and worries each stakeholder, with enablers and blockers |
| Driver-to-Goal and Goal-to-Outcome Mapping | What success looks like, and how it is measured |
| Traceability Matrix and Conflict Analysis | Stakeholder to driver to goal to outcome, and where interests conflict |
| Communication & Engagement Plan | Messaging and engagement approach per stakeholder |
| Change Impact and Stakeholder Risks | Impact on each group, change readiness, stakeholder-related risks |
| Governance & Decision Rights | RACI matrix and escalation path |

### Stakeholder Profile Format

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
| Discovery | Identify and analyze stakeholders | `/arckit:stakeholders` |
| Requirements | Capture requirements from stakeholders | `/arckit:requirements` |
| Planning | Plan based on stakeholder needs | `/arckit:sobc`, `/arckit:plan` |
| Execution | Regular stakeholder engagement | Governance meetings |
| Closure | Validate outcomes with stakeholders | `/arckit:story` |

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

### UK Government Digital Roles

For UK government projects, also consider the roles that [GovS 005, the Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital) (version 2.2, October 2026), defines in its section on roles and accountabilities:

| Role (GovS 005) | Often known as | Typical Concerns |
|-----------------|----------------|------------------|
| Accounting officer | Usually the permanent head of the department | Stewardship of public money, accountability to Parliament |
| Senior officer accountable for the organisation's digital portfolio | Chief Digital Officer or Chief Digital and Information Officer | Digital strategy, priorities, risks and dependencies |
| Senior officer accountable for data | Chief Data Officer | Data and information assets, including data used by AI |
| Senior officer accountable for technology | Chief Technology Officer, often supported by a Chief Architect | Technology solutions and their management |
| Senior officer accountable for service delivery | | Service delivery operations across the organisation |
| Service owner | | The end-to-end service and its outcomes for users |
| Digital service manager | | Development and day-to-day running of the digital parts of a service |

Other roles come from other standards and guidance:

- The senior responsible owner (SRO) leads a programme or project. See [the role of the senior responsible owner](https://www.gov.uk/government/publications/the-role-of-the-senior-responsible-owner) and GovS 002: Project Delivery.
- Product managers and delivery managers are delivery team roles. The Service Manual's guide to [setting up a service team](https://www.gov.uk/service-manual/the-team/set-up-a-service-team) says you must appoint a service owner during alpha.
- The organisation's digital assurance team, which since 1 April 2026 carries out most digital assurance under the [Digital Assurance Playbook](https://www.gov.uk/government/publications/digital-assurance-playbook).

---

## Key Principles

1. **Early Engagement**: Identify stakeholders before requirements.
2. **Active Listening**: Understand concerns, not just stated needs.
3. **Balanced Representation**: Don't let loudest voice dominate.
4. **Clear Accountability**: One accountable person per decision.
5. **Continuous Engagement**: Stakeholder management is ongoing.

---

## Useful Links

- [Understanding stakeholders and political networks: practical guidance note](https://www.gov.uk/government/publications/understanding-stakeholders-and-political-networks-practical-guidance-note) (FCDO, April 2026)
- [Stakeholder engagement in heat networks: a guide for project managers](https://www.gov.uk/government/publications/stakeholder-engagement-in-heat-networks-a-guide-for-project-managers) (BEIS, 2018)
- [GovS 005: Government Functional Standard for Digital](https://www.gov.uk/government/publications/government-functional-standard-govs-005-digital)
- [The role of the senior responsible owner](https://www.gov.uk/government/publications/the-role-of-the-senior-responsible-owner)
