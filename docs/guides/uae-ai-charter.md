# UAE Charter for AI Compliance Playbook

> **Guide Origin**: Community | **ArcKit Version**: [VERSION]

`/arckit.uae-ai-charter` generates a UAE Charter for the Development and Use of AI compliance assessment for a federal entity AI system. Maps the system against the 12 Charter principles and produces a bias / fairness assessment plus a human-in-the-loop design.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | AI system purpose, users, decisions made |
| Architecture (`ARC-<id>-ARCH-v1.0.md`) | Model placement, data flow, inference path |
| Security NFRs (`ARC-<id>-NFR-SEC-v1.0.md`) | Confidentiality and integrity requirements |
| DPIA / fairness / bias artefacts (if present) | Existing privacy and bias controls |

---

## Command

```bash
/arckit.uae-ai-charter <project ID or AI system description>
```

Output: `projects/<id>/ARC-<id>-AICH-v1.0.md`

---

## The 12 Charter Principles

| # | Principle |
|---|-----------|
| 1 | Human-machine ties |
| 2 | Safety |
| 3 | Bias mitigation |
| 4 | Data privacy |
| 5 | Transparency |
| 6 | Human oversight |
| 7 | Governance and accountability |
| 8 | Technological excellence |
| 9 | Human commitment |
| 10 | Peaceful coexistence |
| 11 | Inclusive access |
| 12 | Lawful compliance |

---

## Assessment Structure

| Section | Contents |
|---------|----------|
| AI System Inventory | Purpose, scope, decision class, autonomy posture |
| 12-Principle Assessment | Per-principle compliance posture, evidence, gaps |
| Bias & Fairness Assessment | Protected groups, fairness metrics, mitigations |
| Human-in-the-Loop Design | Where humans intervene, escalation triggers, override rights |
| External References | UAE AI Charter citations |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | AI system definition | `/arckit.requirements` |
| Privacy | PDPL baseline | `/arckit.uae-pdpl` |
| Charter | 12-principle assessment | `/arckit.uae-ai-charter` |
| Autonomy | Per-tier guard-rails | `/arckit.uae-ai-autonomy-tier` |
| Risk | Charter gaps into risk register | `/arckit.risk` |

---

## Review Checklist

- All 12 principles assessed (no skipped rows).
- Bias and fairness metrics defined and measurable.
- Protected groups identified for the deployment context.
- Human-in-the-loop intervention points are specific (which decisions, by whom, when).
- Charter gaps surfaced to the project risk register.
- Charter posture handed off to `/arckit.uae-ai-autonomy-tier` for guard-rail design.

---

## Key Notes

- **Sector regulation**: For Central Bank-regulated workloads the Charter is a floor — the UAE Central Bank AI guidance is flagged as `[NEEDS VERIFICATION]` in the overlay maintenance log.
- **Run order**: Run before `/arckit.uae-ai-autonomy-tier` so the Charter posture informs the tier design.
- **Cross-jurisdiction projects**: For systems also touching the EU, run alongside `/arckit.eu-ai-act`.
- **Community-contributed**: Output should be reviewed by qualified AI ethics / federal compliance counsel before reliance.
