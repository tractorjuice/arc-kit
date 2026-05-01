# UK Grants Research Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.grants` researches UK funding opportunities — government grants (UKRI, Innovate UK, NIHR, DSIT, DASA), charitable foundations (Wellcome, Nesta, Health Foundation), social impact investors, and accelerator programmes — and scores each opportunity for eligibility against the project's profile.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent makes dozens of WebSearch and WebFetch calls across UK funding bodies and the 360Giving/GrantNav open-data corpus, keeping the research context isolated from the main conversation. The slash command is a thin wrapper that delegates to the agent.

---

## Prerequisites

### Web Access (REQUIRED)

This command relies entirely on live WebSearch and WebFetch calls — eligibility criteria, funding amounts, and deadlines change frequently and must come from current funder pages. There is no MCP server to install.

### Project Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) — **MANDATORY** (warn-and-proceed if missing; the user's prompt arguments become the project description)
- Stakeholder analysis (`ARC-*-STKE-*.md`) — Recommended (organisation type, partnership signals)
- Strategic Outline Business Case (`ARC-*-SOBC-*.md`) — Recommended (existing funding assumptions, budget gap)
- Architecture principles (`ARC-000-PRIN-*.md`) — Optional (technology constraints affecting eligibility)

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|----------|-------------|-------|
| Sector-led discovery | `/arckit.grants Research funding for <sector> project` | Maps sector to UK funding bodies (NIHR for health, DASA for defence, etc.) |
| Project-anchored | `/arckit.grants 001` | Reads `projects/001-*/` artifacts and scores opportunities against them |
| Domain-narrow search | `/arckit.grants AI for SME health tech` | Filters across multiple bodies for a specific domain |
| Charity / social impact | `/arckit.grants Find charitable funding for <project>` | Wellcome, Nesta, Health Foundation, social impact investors |
| Accelerator route | `/arckit.grants Accelerator programmes for <project>` | Techstars, Eagle Labs, Digital Catapult, KTN |
| Quick scan (no spawn) | `/arckit.grants 001 --no-spawn` | Produces the report without creating per-grant tech notes |

Add constraints (TRL, organisation type, budget) in the prompt for tailored results.

---

## Command

```bash
/arckit.grants <project ID or domain>
```

Outputs: `projects/<id>/research/ARC-<id>-GRNT-<NNN>-v1.0.md`

> **Multi-instance**: `GRNT` is a multi-instance type. Each run creates a new sequence-numbered file (`-001-`, `-002-`, …) so historical funding scans are preserved.

---

## How It Works

| Step | Action |
|------|--------|
| 1 | Detect target project (explicit ID, or most recent project under `projects/`) |
| 2 | Read REQ, STKE, SOBC and any `external/` documents to build a funding profile |
| 3 | Build the funding profile: sector, organisation type, TRL, budget range, timeline, key objectives |
| 4 | Search UK grant bodies via WebSearch + WebFetch (live programme pages only — no general knowledge) |
| 5 | Cross-check 360Giving / GrantNav for funders not on the curated list and recent grant patterns in the project's domain |
| 6 | Gather eligibility, funding range, deadline, and application process for each candidate |
| 7 | Score each grant **High / Medium / Low** with rationale |
| 8 | Run the quality checklist (Common Checks) |
| 9 | Write the report to file with citation traceability for any external documents read |
| 10 | Spawn per-grant tech notes under `projects/<id>/tech-notes/` (unless `--no-spawn`) |
| 11 | Return a summary to the caller |

### Funding Bodies Covered

| Category | Bodies |
|----------|--------|
| Government R&D | UKRI, Innovate UK, DSIT, BEIS |
| Health | NIHR, MHRA AI Airlock, NHS England |
| Charitable | Wellcome Trust, Nesta, Health Foundation, Nuffield Foundation |
| Social Impact | Big Society Capital, Access Foundation, Social Enterprise UK |
| Accelerators | Techstars, Barclays Eagle Labs, Digital Catapult, KTN |
| Defence / Security | DASA, DSTL Innovation |
| Open Data | 360Giving / GrantNav (200+ funders, historical + active) |

The agent skips categories that are clearly irrelevant to the project's sector to keep the search focused.

### Eligibility Scoring

Each grant is scored against the project profile with rationale:

| Score | Meaning |
|-------|---------|
| **High** | Sector match, TRL aligned, organisation type eligible, deadline reachable, budget within range |
| **Medium** | Most criteria match but at least one gap (e.g. partnership requirement, co-funding, narrow eligibility) |
| **Low** | Substantial mismatch — listed for completeness, not as a recommended target |

---

## Output Highlights

- **Total grants found** with High/Medium/Low breakdown
- **Top 3 matches** with funding amounts, deadlines, and application stages
- **Total potential funding** range across all High-scored grants
- **Nearest application deadlines** (so users know what's time-critical)
- **Eligibility gaps** to address before applying (co-funding, partnerships, sector classification)
- **Citation traceability** to any external documents read (`external/`, `policies/`)

### Spawned Knowledge

Unless `--no-spawn` is passed, the agent creates standalone tech notes for grant programmes researched in depth (2+ substantive facts):

- `projects/<id>/tech-notes/<grant-slug>.md` — one per programme
- Existing notes are updated rather than duplicated
- A `## Spawned Knowledge` section is appended to the grants report listing every note created or updated

This makes grant programme details reusable — future runs of `/arckit.grants` (or a human reviewer) can read the notes directly without re-running the research.

---

## Flags

| Flag | Effect |
|------|--------|
| `--no-spawn` | Skip tech-note spawning. Produces the grants report only. Useful for quick scans. |

---

## Follow-on Actions

- `/arckit.sobc` — feed funding data into the Economic Case
- `/arckit.plan` — align the project plan to grant milestones and reporting cycles
- `/arckit.risk` — add grant-specific risks (rejection, compliance burden, match-funding gaps, post-award reporting)

---

## Comparison with /arckit.research

| Feature | `/arckit.grants` | `/arckit.research` |
|---------|------------------|--------------------|
| Scope | UK funding opportunities only | Multi-cloud, SaaS, open-source vendors |
| Source | UK funder pages + 360Giving/GrantNav (live web) | General web search across vendor and analyst material |
| Output | Eligibility-scored grants with deadlines | Build vs buy analysis with TCO |
| Cost focus | Funding *coming in* | Cost *going out* (procurement) |
| When to use | Public sector, charity, R&D, SME innovation | Vendor selection or build-vs-buy for any sector |

**Workflow**: Run `/arckit.requirements` first to give the grants agent enough context to score eligibility, then `/arckit.grants` after stakeholder analysis is in place. Feed the result into `/arckit.sobc` so the Economic Case reflects realistic funding sources.

---

## Important Caveats

- **UK-only scope**: This command searches UK funding bodies. International funding (EU Horizon, NIH, NSF, etc.) is out of scope.
- **Deadlines change frequently**: The report records the research date. Always re-verify deadlines on the funder's own site before submitting an application — do not rely on cached values.
- **Eligibility decisions are advisory**: Scores reflect public eligibility criteria, not a guarantee of acceptance. Final eligibility lies with the funder's assessment panel.
- **Markdown safety**: When writing inequality comparisons, the agent puts a space after `<` or `>` (e.g. `< 3 months`, `> £500k`) so renderers don't interpret them as HTML tags.

---

## Resources

- [UKRI funding finder](https://www.ukri.org/opportunity/) — searchable index of all UKRI calls
- [Innovate UK Edge](https://iuk-business-connect.org.uk/) — programme calendar and SME support
- [NIHR funding opportunities](https://www.nihr.ac.uk/funding) — health and care research calls
- [DASA open competitions](https://www.gov.uk/government/organisations/defence-and-security-accelerator) — defence and security innovation
- [360Giving / GrantNav](https://grantnav.threesixtygiving.org/) — open grants data from 200+ UK funders
- [Wellcome funding](https://wellcome.org/grant-funding) — health research and discovery science
- [Nesta funding](https://www.nesta.org.uk/funding/) — innovation and social impact
