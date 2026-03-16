# Doctrine Assessment Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.wardley.doctrine` assesses organizational doctrine maturity across 4 phases and 40+ principles.

---

## When to Use

Run this command to assess organizational maturity, identify capability gaps, and plan improvements. Doctrine assessment reveals how well an organization applies universal strategic principles -- independent of any specific map or context. Use it to:

- Baseline current organizational maturity
- Identify systemic weaknesses before they manifest in projects
- Plan targeted improvement programmes
- Re-assess periodically to measure progress

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles (`ARC-000-PRIN-v1.0.md`) | **Mandatory** -- Governance principles to assess against |
| Wardley Map (`ARC-<id>-WARD-*.md`) | Recommended -- Provides strategic context for scoring |
| Stakeholder analysis (`ARC-<id>-STKE-v1.0.md`) | Recommended -- Organizational context and drivers |

---

## Command

```bash
/arckit.wardley.doctrine Assess doctrine maturity for <organisation>
```

Output: `projects/<id>/wardley-maps/ARC-<id>-WDOC-v1.0.md` (single instance per project)

---

## Doctrine Structure

| Section | Contents |
|---------|----------|
| Phase Assessment | Which of the 4 phases the organization has reached |
| Category Scores | Maturity scores across 6 doctrine categories |
| Principle-Level Detail | Individual 1-5 scoring for 40+ principles |
| Gap Analysis | Weaknesses and improvement priorities |
| Improvement Roadmap | Phased plan to advance doctrine maturity |

---

## Key Concepts

### The 4 Phases of Doctrine

| Phase | Name | Focus |
|-------|------|-------|
| I | Stop Self-Harm | Eliminate basic organizational dysfunctions |
| II | Becoming Context Aware | Develop situational awareness and mapping capability |
| III | Better for Less | Optimize through strategic play and efficiency |
| IV | Continuously Evolving | Anticipate and adapt to change systemically |

Organizations must master each phase before progressing to the next.

### The 6 Categories

| Category | Examples |
|----------|---------|
| Communication | Common language, challenge assumptions, listen to ecosystems |
| Development | Use appropriate methods, think small, know your details |
| Learning | Use a systematic mechanism of learning, bias towards data |
| Leading | Move fast, be the owner, think big |
| Operations | Manage inertia, optimise flow, think aptitude and attitude |
| Structure | Provide purpose, use small teams, think standards |

### Scoring (1-5)

| Score | Meaning |
|-------|---------|
| 1 | Not practiced -- principle is unknown or ignored |
| 2 | Ad hoc -- applied inconsistently |
| 3 | Developing -- recognized and partly systematized |
| 4 | Practiced -- systematically applied across the organization |
| 5 | Mastered -- deeply embedded, continuously improved |

### Re-Assessment

Doctrine assessments support periodic re-assessment. When re-running the command, the previous assessment is read and scores are compared to show progress, regression, or stagnation.

---

## Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Foundation | Establish architecture principles | `/arckit.principles` |
| Assessment | Score doctrine maturity | `/arckit.wardley.doctrine` |
| Mapping | Create Wardley Maps with doctrine context | `/arckit.wardley` |
| Strategy | Synthesise into strategy | `/arckit.strategy` |

---

## Review Checklist

- All 40+ principles scored with evidence.
- Phase classification is justified.
- Gap analysis identifies top priority improvements.
- Improvement roadmap has realistic timelines.
- Comparison with previous assessment included (if re-assessment).
- Scores reflect reality, not aspiration.

---

## Tips

1. **Be honest** -- Doctrine assessment only has value if scores reflect reality. Aspirational scoring hides problems.
2. **Involve multiple stakeholders** -- A single assessor introduces bias; cross-functional input produces better scores.
3. **Start with Phase I** -- If Phase I principles are not mastered, skip ahead at your peril.
4. **Re-assess quarterly** -- Doctrine maturity changes slowly; quarterly cadence balances effort and insight.
5. **Link to principles** -- Map each doctrine principle to your architecture principles for traceability.
