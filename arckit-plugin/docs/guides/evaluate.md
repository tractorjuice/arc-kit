# Vendor Evaluation Playbook

`/arckit.evaluate` creates vendor evaluation frameworks and scores vendor proposals against requirements.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles | Governance standards vendors must align with |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What you're evaluating vendors against |
| Statement of Work (`ARC-<id>-SOW-v1.0.md`) | Pre-defined evaluation criteria |
| DOS documentation | Digital Marketplace procurement criteria |

---

## Command

```bash
/arckit.evaluate Create evaluation framework for <project>
/arckit.evaluate Score <vendor-name> proposal for <project>
/arckit.evaluate Compare all vendors for <project>
```

Output:
- `projects/<id>/ARC-<id>-EVAL-v1.0.md` (framework)
- `projects/<id>/vendors/<vendor>/ARC-<id>-EVAL-<vendor>-v1.0.md` (scoring)
- `projects/<id>/ARC-<id>-EVCP-v1.0.md` (comparison)

---

## Evaluation Framework Structure

| Section | Contents |
|---------|----------|
| Mandatory Qualifications | Pass/fail requirements (certifications, experience, financial stability) |
| Technical Approach | Solution design, architecture alignment, technology choices (35 points) |
| Project Approach | Methodology, risk management, QA, change management (20 points) |
| Team Qualifications | Experience, composition, key personnel, certifications (25 points) |
| Company Experience | References, industry expertise, financial stability (10 points) |
| Pricing | Cost competitiveness, pricing model clarity, value for money (10 points) |
| Evaluation Process | Scoring methodology, team composition, timeline, decision criteria |

---

## Vendor Scoring Structure

| Section | Contents |
|---------|----------|
| Overall Score | Total points out of 100 |
| Category Breakdown | Score per evaluation category with justification |
| Strengths | What the vendor did well |
| Weaknesses | Gaps, concerns, or risks identified |
| Risk Assessment | Delivery, technical, commercial, and compliance risks |
| Recommendation | Recommend / Consider / Not Recommended |

---

## Three Task Types

| Task | When to Use | Output |
|------|-------------|--------|
| Create Framework | Before receiving proposals | `ARC-<id>-EVAL-v1.0.md` |
| Score Vendor | After receiving a proposal | `vendors/<name>/ARC-<id>-EVAL-<name>-v1.0.md` |
| Compare Vendors | After scoring multiple vendors | `ARC-<id>-EVCP-v1.0.md` |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Preparation | Define requirements and procurement approach | `/arckit.requirements`, `/arckit.sow` |
| Framework | Create evaluation criteria | `/arckit.evaluate` (create) |
| Scoring | Score each vendor proposal | `/arckit.evaluate` (score) |
| Comparison | Compare and recommend | `/arckit.evaluate` (compare) |
| Procurement | Award contract, negotiate terms | `/arckit.gcloud-clarify` |

---

## Review Checklist

- Mandatory qualifications are clear pass/fail criteria.
- Scoring criteria total exactly 100 points.
- All scores have specific justification (no arbitrary numbers).
- Requirements are referenced (e.g., "Meets NFR-SEC-001").
- Evaluation aligns with architecture principles.
- Conflicts of interest documented.
- Final decision authority clearly assigned.

---

## Scoring Guidelines

| Score Range | Interpretation |
|-------------|----------------|
| 90-100 | Exceptional - exceeds requirements significantly |
| 80-89 | Strong - meets all requirements with some excellence |
| 70-79 | Acceptable - meets core requirements |
| 60-69 | Marginal - meets minimum requirements with concerns |
| Below 60 | Unacceptable - does not meet requirements |

---

## Key Principles

1. **Objectivity**: Evaluation must be based on documented criteria only.
2. **Traceability**: Every score references specific requirements.
3. **Confidentiality**: Keep vendor proposals confidential.
4. **Governance Alignment**: Vendors must align with architecture principles.
5. **Risk-Based**: Consider delivery, technical, and commercial risks.
