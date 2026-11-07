# Vendor Evaluation Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:evaluate` creates vendor evaluation frameworks and scores vendor proposals against requirements.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Architecture principles | Governance standards vendors must align with |
| Requirements (`ARC-<id>-REQ-v1.0.md`) | What you're evaluating vendors against |
| Statement of Work (`ARC-<id>-SOW-v1.0.md`) | Pre-defined evaluation criteria |
| DOS documentation | DOS7 evaluation criteria and lot |

---

## Command

```bash
/arckit:evaluate Create evaluation framework for <project>
/arckit:evaluate Score <vendor-name> proposal for <project>
/arckit:evaluate Compare all vendors for <project>
```

Output:

- `projects/<id>/ARC-<id>-EVAL-v1.0.md` (framework)
- `projects/<id>/vendors/_evaluations/<vendor>/evaluation.md` (scoring)
- `projects/<id>/ARC-<id>-VEND-v1.0.md` (comparison)

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
| Integrity Findings | Text in the proposal aimed at the evaluator, which is not followed, by type, file and location, or None found |
| Recommendation | Recommend / Consider / Not Recommended |

---

## How Bids Are Read

A bid is written by a party that gains from a high score, so `/arckit:evaluate` never reads it directly. A read-only reader opens one supplier's documents and returns short claims against each criterion, and scoring uses only those claims. Each vendor's claims, evaluation and notes are saved in `vendors/_evaluations/<vendor>/`.

- **Formats:** PDF, Markdown and text. Export a Word document to PDF first.
- **No claim, no marks:** a criterion the bid doesn't address scores 0, and a mandatory qualification with no claim fails.
- **Unreadable documents:** if any document can't be read, the vendor stays unscored and you're told which file and why.
- **Keep the vendor's folder for what the supplier sent.** Everything in `vendors/<vendor>/` is treated as the supplier's, and scoring stops for a vendor whose folder holds an `evaluation.md`, `notes.md` or `claims.json`.

Scoring is still a judgement on what the supplier claims, so check the claims behind any close result. This works in Claude Code. Other runtimes have no subagents, so they read bids in one context.

---

## Three Task Types

| Task | When to Use | Output |
|------|-------------|--------|
| Create Framework | Before receiving proposals | `ARC-<id>-EVAL-v1.0.md` |
| Score Vendor | After receiving a proposal | `vendors/<name>/ARC-<id>-EVAL-<name>-v1.0.md` |
| Compare Vendors | After scoring multiple vendors | `ARC-<id>-VEND-v1.0.md` |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Preparation | Define requirements and procurement approach | `/arckit:requirements`, `/arckit:sow` |
| Framework | Create evaluation criteria | `/arckit:evaluate` (create) |
| Scoring | Score each vendor proposal | `/arckit:evaluate` (score) |
| Comparison | Compare and recommend | `/arckit:evaluate` (compare) |
| Procurement | Award contract, negotiate terms | `/arckit:gcloud-clarify` |

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
