# Project Story Guide

`/arckit.story` produces a narrative history of your project—ideal for gate packs, retrospectives, and knowledge transfer.

---

## Inputs

- Multiple ArcKit artefacts committed (principles, stakeholders, requirements, plan, reviews, assessments).
- Git history or file timestamps available to build timelines.
- Optional: metrics dashboards or service performance data to embed.

---

## Command

```bash
/arckit.story Generate project story for <project>
```

Output: `projects/<id>/ARC-<id>-STORY-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version (minor for refreshed content, major for changed scope) instead of overwriting.

---

## Story Structure

| Section | Content | Use it for |
|---------|---------|------------|
| Executive summary | Highlights, investment outcome, next steps | Board updates |
| Timeline | Gantt, flowchart, event log | Show pacing, critical path, blockers |
| Narrative chapters | Foundation → Business Case → Requirements → Research → Procurement → Design → Delivery → Compliance | Retrospectives, onboarding |
| Traceability | Stakeholder → Requirement → Work item → Test | Assurance evidence |
| Governance achievements | TCoP, Service Standard, Secure by Design, AI Playbook | Compliance pack |
| Lessons learned & actions | What worked, what didn’t, forward plan | Continuous improvement |

---

## Review Checklist

- Key decisions and approvals captured (link to minutes or tickets).
- Quantitative metrics (velocity, defect rate, uptime) included where relevant.
- Lessons learned have actionable follow-ups with owners/dates.
- Artefact references resolve to committed files.
- Sensitive information redacted before sharing externally.

---

## When to Regenerate

| Moment | Rationale |
|--------|-----------|
| Gate reviews (Discovery→Alpha, etc.) | Summarise progress and evidence |
| Quarterly portfolio reporting | Provide consistent executive view |
| Project closure | Archive knowledge for future teams |
| Major change or reset | Document rationale and new direction |

Store the story alongside meeting packs and share with stakeholders for transparency.
