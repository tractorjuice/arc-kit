# UK Grants & Funding Research Playbook

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:grants` researches UK government grants, charitable funding, and accelerator programmes for the project, with eligibility scoring per programme. Runs as a research-heavy agent that produces a per-grant briefing plus reusable tech-notes.

---

## Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Project scope and outcomes |
| SOBC (`ARC-<id>-SOBC-v*.md`) | Strategic case and funding ask |
| Architecture principles (`ARC-000-PRIN-*.md`) | Eligibility-relevant principles (open source, accessibility, etc.) |

---

## Command

```bash
/arckit:grants <project ID or domain>
```

Outputs:

- `projects/<id>/research/ARC-<id>-GRNT-NNN-v1.0.md` — per-grant briefing, one per programme researched
- `projects/<id>/tech-notes/<grant-slug>.md` — reusable knowledge note per programme (when 2+ substantive facts captured)

---

## Long runs: Remote Control + push notifications

`/arckit:grants` frequently exceeds 10 minutes as the agent crawls UKRI, Innovate UK, NIHR, charitable foundations, and accelerator programmes for live deadlines and eligibility criteria. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (programme shortlist confirmation, eligibility ambiguity). ArcKit's minimum Claude Code floor (v2.1.200) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## Briefing Structure

| Section | Contents |
|---------|----------|
| Programme Overview | Funder, scheme name, total fund, individual grant size |
| Eligibility | Sector, organisation type, project stage, geography, IP requirements |
| Eligibility Scoring | Project's fit against each criterion with rationale |
| Application Process | Stages, gates, deadlines, panel / peer review model |
| Match Funding & Co-Investment | Funder match rules, partner requirements |
| Reporting & Compliance | Milestone reporting, audit, IP and dissemination obligations |
| Decision | Pursue / monitor / discard with rationale |
| External References | Programme guidance, recent awards, funder priorities |

---

## Funder Coverage

Typical programmes researched:

| Funder | Examples |
|--------|----------|
| UKRI | EPSRC, ESRC, MRC, NERC, Innovate UK |
| Innovate UK | Smart Grants, KTPs, sector challenge programmes |
| NIHR | Health and care research funding streams |
| Wellcome | Biomedical, climate, mental health |
| Nesta | Innovation challenges and challenge prizes |
| Charitable trusts | Domain-specific philanthropic funding |
| Accelerators | Government-backed and corporate accelerators |

---

## One-Page Workflow

| Phase | Key Activities | ArcKit Commands |
|-------|----------------|-----------------|
| Discovery | Project scope and outcomes | `/arckit:requirements` |
| Funding research | Programme scan + eligibility scoring | `/arckit:grants` |
| Business case | Folding funding into Economic Case | `/arckit:sobc` |
| Plan | Align project plan to grant milestones | `/arckit:plan` |
| Risk | Grant-specific risks (rejection, compliance, reporting) | `/arckit:risk` |

---

## Review Checklist

- At least one programme researched per relevant funder family.
- Eligibility scoring shows rationale per criterion (not just a number).
- Match-funding requirements identified for every "pursue" recommendation.
- Reporting and IP obligations called out before "pursue" decision.
- Pursue / monitor / discard decision recorded for every programme.
- Funding inputs handed off to SOBC Economic Case and project plan.
- Grant-specific risks added to the risk register.

---

## Key Notes

- **Agent command**: Heavy WebSearch / WebFetch — runs as the `arckit-grants` autonomous agent in Claude Code; the slash command is a thin wrapper.
- **Tech notes**: Programmes worth detailed study spawn a reusable tech-note that future projects can read without re-running the research.
- **Plan alignment**: Grants impose milestone and reporting cadences that must be reflected in the project plan — do not skip the `/arckit:plan` handoff.
- **Multi-instance numbering**: `GRNT-001`, `GRNT-002`, etc. — one document per programme, generated automatically.
