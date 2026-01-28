# Vendor Procurement Guide

ArcKit streamlines procurement through three commands:

| Need | Command | Output |
|------|---------|--------|
| Statement of Work / RFP | `/arckit.sow` | `ARC-<id>-SOW-v1.0.md` with scope, requirements, deliverables, timeline, terms |
| Evaluation Framework | `/arckit.evaluate` | `ARC-<id>-EVAL-v1.0.md` plus scoring spreadsheet |
| Proposal Scoring | `/arckit.evaluate Score <vendor>` | `vendors/<vendor>/ARC-<id>-EVAL-<vendor>-v1.0.md` and comparison matrix |

---

## Decision Flow

```text
Requirements ready? → run /arckit.sow
↓
Agree evaluation criteria with stakeholders → /arckit.evaluate
↓
Receive proposals → /arckit.evaluate Score <vendor>
↓
/arckit.evaluate Compare vendors → board decision
```

---

## Inputs Checklist

- Finalised requirements (BR/FR/NFR/INT/DR) with priorities.
- Architecture principles, Secure by Design requirements, compliance obligations.
- Budget, commercial constraints, contract model.
- Governance list (approvers, procurement board, commercial lead).

---

## Evaluation Template

| Criterion Group | Typical Weight | Evidence |
|-----------------|----------------|---------|
| Technical capability | 40% | Alignment with requirements, architecture approach |
| Delivery approach | 20% | Plan, resourcing, tooling, risk handling |
| Compliance & security | 20% | Standards coverage (TCoP, Cyber Essentials, JSP 604, etc.) |
| Commercials | 15% | Pricing transparency, TCO, payment schedule |
| Social value / sustainability | 5% | UK government reporting obligations |

Adjust to local policy (e.g. Cabinet Office commercial frameworks).

---

## Best Practice Tips

- Include a supplier Q&A window; capture clarifications inside the SOW annex.
- Run moderated scoring sessions; document consensus reasons in `comparison.md`.
- Track mandatory gate checks (financial due diligence, security vetting) alongside evaluation.
- Store all artefacts in `projects/<id>/vendors/` for audit and reuse.
