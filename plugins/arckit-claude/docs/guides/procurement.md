# Vendor Procurement Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

ArcKit streamlines procurement through three commands:

| Need | Command | Output |
|------|---------|--------|
| Statement of Work / RFP | `/arckit:sow` | `ARC-<id>-SOW-v1.0.md` with scope, requirements, deliverables, timeline, terms |
| Evaluation Framework | `/arckit:evaluate` | `ARC-<id>-EVAL-v1.0.md` with mandatory qualifications, scoring criteria and weights |
| Proposal Scoring | `/arckit:evaluate Score <vendor>` | `vendors/_evaluations/<vendor>/` (`claims.json`, `evaluation.md`, `notes.md`), and the EVAL's comparative table updated |
| Vendor Comparison | `/arckit:evaluate Compare vendors` | `ARC-<id>-VEND-v1.0.md` with a comparison matrix and recommendation |
| Persistent Scores | `/arckit:score vendor <name> --project=<id>`, then `compare` or `audit` | `vendors/scores.json`, a structured scoring record with comparison and audit trail |

In Claude Code, each vendor's bid is read by a separate reader subagent, so no bid reaches the scoring conversation. A second, independent scorer scores the same claims without seeing the first scores, and a neutral moderator settles any criterion where the two differ materially.

---

## Decision Flow

```text
Requirements ready? → run /arckit:sow
↓
Agree evaluation criteria with stakeholders → /arckit:evaluate
↓
Receive proposals → /arckit:evaluate Score <vendor> (or /arckit:score vendor <name>)
↓
/arckit:evaluate Compare vendors (or /arckit:score compare) → board decision
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
- Run moderated scoring sessions. ArcKit records each moderated criterion, with both scores, the moderator's final score and its reason, in the vendor's `evaluation.md` (`/arckit:evaluate`) or under `moderation` in `vendors/scores.json` (`/arckit:score`).
- Track mandatory gate checks (financial due diligence, security vetting) alongside evaluation.
- Store all artefacts in `projects/<id>/vendors/` for audit and reuse.
