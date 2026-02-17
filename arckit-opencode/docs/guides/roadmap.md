# Architecture Roadmap Playbook

`/arckit.roadmap` creates a multi-year architecture roadmap that links current-state constraints to future-state capabilities, governance milestones, and funding cycles.

---

## Inputs

| Artefact | Why it matters |
|----------|----------------|
| Architecture principles | Provide guardrails for phased investments |
| Stakeholder drivers & outcomes | Ensure roadmap themes trace to business goals |
| Requirements & Wardley maps | Prioritise capabilities and evolution paths |
| Risk register & SOBC | Surface delivery blockers and funding approvals |

---

## Command

```bash
/arckit.roadmap Create roadmap for <initiative> covering FY24/25–FY27/28
```

Outputs: `projects/<id>/ARC-<id>-ROAD-v1.0.md` plus optional Mermaid timeline snippets.

---

## Roadmap Structure

| Section | Contents |
|---------|----------|
| Document control | ARC document ID, owner, review cadence, financial years |
| Executive summary | Vision statement, investment overview, measurable outcomes |
| Capability themes | 4–6 strategic themes with “now / next / later” framing |
| Timeline view | Quarterly or semester swimlanes with milestones and dependencies |
| Capability evolution | Table that shows baseline → interim → target maturity with KPIs |
| Funding & resourcing | CAPEX/OPEX envelope, sourcing model, team shape transitions |
| Governance cadence | Gates (Discovery, Alpha, Beta, Live) mapped to decision forums |
| Risk and mitigation | Top transformation risks with contingency triggers |

---

## Governance Hooks

- Reference the GDS Agile Delivery phases and cite which artefacts unlock each gate.
- Call out when compliance activities (TCoP, Secure by Design, AI Playbook) must be completed to avoid blocking approvals.
- Include explicit “decision hold points” for vendor selection, architecture reviews, and budget refresh.

---

## Tips

- Keep the roadmap time-boxed (usually 3–4 years) and avoid promising detailed sprint plans.
- Use Wardley mapping outputs to justify when capabilities move from experimentation to standardisation.
- Align every milestone to stakeholder goals, then feed those IDs into `/arckit.traceability` and `/arckit.story`.
- Refresh the document quarterly and note deltas in the change log for audit traceability.
