# Digital Outcomes and Specialists Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:dos` generates Digital Outcomes and Specialists 7 (DOS7, RM1043.9) procurement documentation. You publish it on the Government Commercial Agency's Contract Award Service (CAS), which you reach through the Public Procurement Gateway (PPG). DOS opportunities stopped going on the Digital Marketplace after DOS 5.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What outcomes or capabilities are needed |
| Stakeholder drivers | Business context and success criteria |
| Budget constraints | Funding envelope and commercial model |
| Timeline | Required delivery dates |

---

## Command

```bash
/arckit:dos Create DOS procurement for <requirement>
```

Output: `projects/<id>/procurement/ARC-<id>-DOS-v1.0.md`

---

## DOS Documentation Structure

| Section | Contents |
|---------|----------|
| Opportunity Summary | Brief description for the CAS listing |
| Background | Organisation context and current situation |
| Problem Statement | What problem needs solving |
| Outcomes Required | Specific, measurable outcomes expected |
| Work Phases | Breakdown of work (discovery, alpha, beta, etc.) |
| Essential Skills | Required capabilities and experience |
| Nice-to-Have Skills | Desirable but not mandatory |
| Evaluation Criteria | How proposals will be scored |
| Budget & Timeline | Commercial constraints |
| Assessment Process | Stages, questions, presentations |

---

## DOS7 Lots

| Lot | What it buys | When to Use |
|-----|--------------|-------------|
| 1. Digital Outcomes | Specific, outcome-based digital projects | You know the outcome, not the solution |
| 2. Digital Capability and Delivery Partners | Long-term transformation programmes, capability building, resource augmentation | A partner for a programme, not a single project |
| 3. Digital Specialists | Specialists in specific digital roles who join your team | You know the skills you need |
| 4. User Research Studios and Participants | Studio hire and research participants | You need a lab or people to test with |

---

## Evaluation Criteria

| Criterion | Typical Weight | Focus |
|-----------|----------------|-------|
| Technical Approach | 35% | How they'll deliver outcomes |
| Team & Experience | 25% | Skills, CVs, relevant experience |
| Understanding | 20% | Grasp of problem and context |
| Price | 20% | Value for money |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Define requirements and outcomes | `/arckit:requirements`, `/arckit:stakeholders` |
| Preparation | Create DOS documentation | `/arckit:dos` |
| Publication | Publish on the Contract Award Service (through PPG) | Manual |
| Evaluation | Score supplier proposals | `/arckit:evaluate` |
| Award | Contract negotiation | Manual |

---

## Review Checklist

- Outcomes are specific and measurable (not vague).
- Essential skills are genuine requirements (not wish list).
- Evaluation criteria total 100% with clear weightings.
- Budget is realistic for outcomes required.
- Timeline allows for proper discovery/delivery.
- Assessment questions are answerable in word limits.
- No requirement that only one supplier can meet.

---

## DOS7 Buying Rules

| Rule | What it means |
|------|---------------|
| Further competition only | No award without competition; each procurement goes to a single supplier |
| Competition stages | Single-stage, two-stage or multi-stage |
| Where to publish | The Contract Award Service; only suppliers on the lot who are registered on CAS see it |
| Award notices | Find a Tender under the Procurement Act 2023, not Contracts Finder (see the generated document's Next Steps) |

Source: the [DOS7 agreement page](https://www.gca.gov.uk/agreements/RM1043.9). Check the lot's buyer guidance on CAS for word limits, question limits and how long the opportunity stays open.

---

## Key Principles

1. **Outcomes Over Outputs**: Buy results, not activities.
2. **Fair Competition**: Requirements shouldn't favor one supplier.
3. **Clear Evaluation**: Suppliers must know how they'll be scored.
4. **Realistic Budgets**: Underfunding leads to poor outcomes.
5. **Agile Friendly**: Structure work in phases, not big-bang delivery.
