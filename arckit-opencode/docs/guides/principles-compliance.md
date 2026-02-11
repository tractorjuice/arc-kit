# Principles Compliance Guide

`/arckit.principles-compliance` scores each architecture principle defined in `projects/000-global/ARC-000-PRIN-v1.0.md`, producing a RAG status with evidence and actions.

---

## Inputs

| Artefact | Contribution |
|----------|--------------|
| Architecture principles | Source of truth for principle definitions, validation gates |
| Requirements, designs, reviews | Evidence for compliance or gaps |
| Risk register & exceptions | Track tolerances and remediation plans |

---

## Command

```bash
/arckit.principles-compliance <description>
```

Output saved as `projects/<id>/ARC-<id>-PRIN-COMP-v1.0.md`.

---

## Scorecard Structure

| Column | Meaning | Typical Actions |
|--------|---------|-----------------|
| Principle | ID + summary | Ensure names align with governance library |
| Status | ✅ / ⚠️ / ❌ / ⏳ (not assessed) | Address ❌ immediately; plan remediation for ⚠️ |
| Evidence | Artefacts referenced (requirements, diagrams, reviews) | Confirm links resolve to current documents |
| Actions | Required remediation, owner, due date | Track via backlog or governance board |

---

## Review Rhythm

| Phase | Purpose |
|-------|---------|
| Discovery | Identify principles that will drive scope and constraints |
| Alpha | Validate design proposals honour mandatory principles |
| Beta | Confirm implementation evidence and service readiness |
| Live / Quarterly | Detect drift, review exceptions, re-baseline actions |

---

## Checklist

- Each principle has explicit evidence or clearly marked gap.
- Exceptions include expiry date and accountable owner.
- Actions feed into backlog with priority reflecting risk.
- Summary recommends gate decision (Block / Conditional / Proceed).
- Previous assessments archived for audit trail.

---

## Tip

Use the generated scorecard as the backbone of design review meetings—walk through each principle, confirm status, and update actions live.
