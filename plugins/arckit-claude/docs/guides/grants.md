# Innovate UK grants and UK government funding: a research guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Innovate UK, part of UK Research and Innovation (UKRI), is the UK's innovation agency. It funds businesses through competitions on the Innovation Funding Service. This guide explains where to find Innovate UK and other UK government grants, and how `/arckit:grants` scores funding programmes against your project.

---

## What Innovate UK is

[Innovate UK](https://www.ukri.org/councils/innovate-uk/) describes itself as "the UK's innovation agency", backing "the nation's most promising deep tech businesses" with funding, expert support and connections. It is one of the nine councils of [UK Research and Innovation](https://www.ukri.org/about-us/), alongside the seven research councils and Research England.

Businesses compete for Innovate UK funding through competitions, each with its own scope, dates and funding. UKRI also publishes [guidance for three specific funds](https://www.ukri.org/councils/innovate-uk/guidance-for-applicants/guidance-for-specific-funds/):

- **Innovation loans**, which [aim to provide](https://www.ukri.org/councils/innovate-uk/guidance-for-applicants/general-guidance/) "affordable, flexible and patient capital to SMEs".
- **Knowledge Transfer Partnerships (KTPs)**, which fund projects between businesses and academic institutions, research and technology organisations or Catapults.
- **Smart grants**, which are closed. UKRI's [Smart grants guidance](https://www.ukri.org/councils/innovate-uk/guidance-for-applicants/guidance-for-specific-funds/smart-innovation-funding-guidance/) says: "Smart grants are now closed for new applications as funding is being aligned to Innovate UK's new strategic direction."

## Where Innovate UK competitions are listed

- **[Innovation Funding Service](https://apply-for-innovation-funding.service.gov.uk/competition/search)**: Innovate UK's service for finding and applying to its competitions, marked as opening soon, open now or closing soon. You apply there, and sign back in to continue an application.
- **[UKRI Funding finder](https://www.ukri.org/opportunity/)**: open, upcoming and closed opportunities across UKRI, which you can filter by funding council (including Innovate UK) and by funding type (grant, loan, fellowship).
- **[Apply for innovation funding](https://www.gov.uk/apply-funding-innovation)** on GOV.UK: "If you're a UK-based business or research organisation, you may be able to compete for government-backed funding" to research and develop a process, product or service, test your innovation ideas, or collaborate with other organisations.

Eligibility is set competition by competition, so read each competition's scope before you start.

## Other UK government grants for businesses

GOV.UK's [Find a grant](https://www.find-government-grants.service.gov.uk/) service lets you search government grants and check whether you are eligible to apply.

---

## Using /arckit:grants

`/arckit:grants` researches UK government grants, charitable funding, and accelerator programmes for the project, with eligibility scoring per programme. It produces one grants report and a reusable tech-note for each programme it scores.

> **Agent Architecture**: This command uses a three-tier reader/writer subagent split. The slash command dispatches one **`arckit-grants-reader`** subagent per funder category relevant to the project; each reader gathers evidence from funders' websites and returns it as JSON. The command validates each payload against the `grants-handoff.schema.json` schema and scores programmes from a fixed rubric. The **`arckit-grants-writer`** subagent then writes the report and tech-notes. On runtimes without subagent dispatch (Codex, Gemini, OpenCode, Copilot, Paperclip, Vibe, Kimi), the command ships as the equivalent single-agent `arckit-grants` prompt instead.

### Inputs

| Artefact | Purpose |
|----------|---------|
| Requirements (`ARC-<id>-REQ-v1.0.md`) | Project scope and outcomes |
| SOBC (`ARC-<id>-SOBC-v*.md`) | Strategic case and funding ask |
| Architecture principles (`ARC-000-PRIN-*.md`) | Eligibility-relevant principles (open source, accessibility, etc.) |

### Command

```bash
/arckit:grants <project ID or domain>
```

Outputs:

- `projects/<id>/research/ARC-<id>-GRNT-NNN-v1.0.md` — the grants report, covering every programme researched, ranked by eligibility score
- `projects/<id>/tech-notes/<grant-slug>.md` — reusable knowledge note, one per scored programme (created, or updated if it already exists)

---

## Long runs: Remote Control + push notifications

`/arckit:grants` frequently exceeds 10 minutes as the agent crawls UKRI, Innovate UK, NIHR, charitable foundations, and accelerator programmes for live deadlines and eligibility criteria. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion or when the agent reaches a decision point (programme shortlist confirmation, eligibility ambiguity). ArcKit's minimum Claude Code floor (v2.1.287) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## Report Structure

| Section | Contents |
|---------|----------|
| Project Funding Profile | Sector, organisation type, TRL, funding sought, timeline, key objectives |
| Grant Opportunities | One block per programme: funding body, programme, funding range, deadline, TRL requirement, eligibility criteria, eligibility score with rationale, application process, URL |
| Summary Comparison | All programmes side by side: funder, amount, deadline, eligibility, TRL, score |
| Recommended Funding Strategy | Top recommendations, application timeline, complementary funding, total potential funding |
| Risks and Considerations | Application effort, co-funding, reporting and compliance obligations, timeline alignment |
| Spawned Knowledge | The tech-notes created or updated by this run |
| External References | Programme guidance and other sources cited |

---

## Funder Coverage

Typical programmes researched:

| Funder | Examples |
|--------|----------|
| UKRI | EPSRC, ESRC, MRC, NERC, Innovate UK |
| Innovate UK | Competitions on the Innovation Funding Service, innovation loans, KTPs (Smart grants are closed to new applications) |
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

- **Reader/writer command**: Heavy WebSearch / WebFetch runs inside the `arckit-grants-reader` subagents, so the research stays out of your main conversation; the slash command scores and validates, and the writer subagent renders.
- **Tech notes**: Every scored programme gets a reusable tech-note that future projects can read without re-running the research.
- **Plan alignment**: Grants impose milestone and reporting cadences that must be reflected in the project plan — do not skip the `/arckit:plan` handoff.
- **Multi-instance numbering**: `GRNT` is a multi-instance type, so reports are numbered `GRNT-001`, `GRNT-002`, and so on, generated automatically.
- **Deadlines change often**: The report is a snapshot. Check each programme's page before you apply.

---

## Useful Links

- [Innovate UK](https://www.ukri.org/councils/innovate-uk/) (UKRI)
- [Innovation Funding Service: search competitions](https://apply-for-innovation-funding.service.gov.uk/competition/search)
- [UKRI Funding finder](https://www.ukri.org/opportunity/)
- [Find a grant](https://www.find-government-grants.service.gov.uk/) (GOV.UK)
