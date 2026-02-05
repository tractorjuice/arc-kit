# Project Analysis Playbook

Use `/arckit.analyze` as a recurring quality health check. The command inspects coverage, risks, traceability, compliance, and architecture drift, then prints gap-focused actions.

---

## When to Run

| Cadence | Trigger | Notes |
|---------|---------|-------|
| Weekly | Active delivery | Slot into sprint review so actions feed backlog |
| Gate reviews | Discovery→Alpha, Alpha→Beta, Beta→Live | Attach the latest analysis to assurance packs |
| After major change | New requirements, design shifts, supplier change | Confirms nothing regressed |
| On request | Sponsors, audit, governance board | Provides transparent status in minutes |

_Command:_ `arckit.analyze --project <path>` or run inside the project root.

---

## Prep Checklist

- Latest requirements, risk register, diagrams, and design reviews committed.
- Traceability matrix refreshed (`/arckit.traceability`).
- Recent compliance artefacts (TCoP, AI Playbook, DPIA) generated if applicable.

---

## Output At A Glance

| Section | What It Scores | Immediate Follow-up |
|---------|----------------|---------------------|
| Requirements Coverage | Completeness, IDs, acceptance criteria, MoSCoW | Create missing requirements; align with stakeholders |
| Risk Assessment | Category coverage, treatment, owners, review cadence | Assign owners; raise change requests for mitigations |
| Traceability | Links across lifecycle artefacts | Add missing links; file backlog items for orphan work |
| Compliance | TCoP, GDPR, accessibility, security | Schedule remedial work or update evidence packs |
| Architecture Quality | Diagram freshness, decision rationale | Trigger design review if drift detected |

---

## Recommended Actions Flow

```text
1. Run /arckit.analyze
2. Copy actionable gaps into the backlog (tag with QA/Compliance)
3. Re-run after fixes to confirm issues closed
4. Store report with meeting minutes or assurance evidence
```

---

## Tips

- Automate weekly via CI to post summaries in team chat.
- Track history (store reports in `/reports/analysis/`) to show continuous improvement.
- Pair with `/arckit.story` for end-of-phase retrospectives.
