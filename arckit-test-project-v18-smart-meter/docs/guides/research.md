# Technology Research Guide

`/arckit.research` investigates market, SaaS, open-source, and government marketplace options to support build vs buy decisions.

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Build vs buy | “Research options for <capability> and recommend build vs buy” | Compares custom development vs product |
| Supplier shortlist | “Research G-Cloud services for <need> including pricing tiers” | Public sector supplier discovery |
| Standards review | “Research regulatory obligations for <domain>” | Highlights policies, certifications, compliance |
| Migration | “Research tooling to migrate from <legacy> to <target>” | Guides modernisation approaches |
| Risk investigation | “Research security/operational risks for <technology>” | Informs risk register and mitigations |

Add constraints (budget, data residency, clearance) in the prompt for tailored results.

---

## Command

```bash
/arckit.research Research <topic> for <project>
```

Outputs: `projects/<id>/ARC-<id>-RSCH-v1.0.md` plus optional CSV of suppliers.

---

## Output Highlights

- Option catalogue with pros, cons, pricing, support model.
- Alignment to requirements and principles.
- Risk considerations (lock-in, data sovereignty, accessibility).
- Recommendation with rationale and next steps (PoC, procurement, or custom build).

---

## Follow-on Actions

- Feed supplier data into `/arckit.sow` and `/arckit.evaluate`.
- Update Wardley Maps with evolution stage insights.
- Add identified risks to `/arckit.risk` and mitigations to project backlog.
- Cite findings in business case and design reviews.
