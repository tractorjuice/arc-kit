# Digital Outcomes and Specialists Playbook

`/arckit.dos` generates Digital Outcomes and Specialists (DOS) procurement documentation for the UK Digital Marketplace.

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
/arckit.dos Create DOS procurement for <requirement>
```

Output: `projects/<id>/ARC-<id>-DOS-v1.0.md`

---

## DOS Documentation Structure

| Section | Contents |
|---------|----------|
| Opportunity Summary | Brief description for Digital Marketplace |
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

## DOS Procurement Types

| Type | Description | When to Use |
|------|-------------|-------------|
| Digital Outcomes | Buy outcomes (e.g., "improve service") | Don't know solution |
| Digital Specialists | Buy people (e.g., "3 developers") | Know what skills needed |
| User Research | Research services | User research projects |

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
| Discovery | Define requirements and outcomes | `/arckit.requirements`, `/arckit.stakeholders` |
| Preparation | Create DOS documentation | `/arckit.dos` |
| Publication | Publish on Digital Marketplace | Manual |
| Evaluation | Score supplier proposals | `/arckit.evaluate` |
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

## Digital Marketplace Requirements

| Requirement | Description |
|-------------|-------------|
| Word Limits | Opportunity summary max 100 words |
| Evaluation | Must use Digital Marketplace scoring |
| Questions | Max 5 assessment questions |
| Publication | Minimum 2 weeks open |

---

## Key Principles

1. **Outcomes Over Outputs**: Buy results, not activities.
2. **Fair Competition**: Requirements shouldn't favor one supplier.
3. **Clear Evaluation**: Suppliers must know how they'll be scored.
4. **Realistic Budgets**: Underfunding leads to poor outcomes.
5. **Agile Friendly**: Structure work in phases, not big-bang delivery.
