# ArcKit v4.6.4: Automated UK Funding Research with the Grants Command

**ArcKit v4.6.4 adds `/arckit.grants`, a new command that researches UK government grants, charitable foundations, and accelerator programmes, then scores each opportunity against your project's requirements.**

---

## The Problem: Funding Discovery Is Manual and Fragmented

Architecture teams in UK public sector and health projects regularly face the same question: what funding is available for this work? The answer is scattered across dozens of websites, each with different formats, eligibility criteria, and application processes.

A typical funding landscape search might involve visiting Innovate UK's competition pages, checking NIHR for health-specific programmes, browsing Wellcome Trust and Nesta for charitable grants, searching DASA for defence innovation funding, and trawling through 360Giving's GrantNav database of 200+ UK funders. Each site has its own search interface, its own terminology, and its own way of describing eligibility.

The result is predictable: teams either spend days on manual research that quickly goes stale, or they miss opportunities entirely because they didn't know where to look. A health tech project might find NIHR funding but miss that Innovate UK has a relevant competition closing in three weeks. A digital government service might overlook that NHS Digital Tools Funding covers appointment booking systems, or that a Knowledge Transfer Partnership could fund the academic collaboration they need.

The gap isn't knowledge of individual funding bodies. It's the systematic comparison of all available options against a specific project's profile, done quickly enough to meet application deadlines.

---

## What `/arckit.grants` Does

The grants command takes a project with requirements and produces a comprehensive funding research report. It searches across seven categories of UK funding bodies, gathers live data on eligibility, funding amounts, and deadlines, then scores each opportunity against the project's profile.

### The Research Process

The command delegates to the `arckit-grants` agent, which runs as an autonomous subprocess performing 30-50 web searches in isolation from your main conversation. The process follows nine steps:

1. **Read project context.** The agent reads the project's requirements (REQ), stakeholder analysis (STKE), and business case (SOBC) to understand the domain, budget, objectives, and compliance landscape.

2. **Build a funding profile.** From the requirements and user input, the agent extracts: sector (health, defence, education, digital, etc.), organisation type (public sector, SME, charity, academic, NHS trust), Technology Readiness Level (TRL 1-9), funding range sought, project timeline, and key objectives.

3. **Search UK funding bodies.** The agent searches across seven categories, skipping bodies clearly irrelevant to the project sector:

   | Category | Bodies |
   |----------|--------|
   | Government R&D | UKRI, Innovate UK, DSIT, BEIS |
   | Health | NIHR, MHRA AI Airlock, NHS England |
   | Charitable | Wellcome Trust, Nesta, Health Foundation, Nuffield Foundation |
   | Social Impact | Big Society Capital, Access Foundation, Social Enterprise UK |
   | Accelerators | Techstars, Barclays Eagle Labs, Digital Catapult, KTN |
   | Defence/Security | DASA, DSTL Innovation |
   | Open Data | 360Giving/GrantNav (200+ UK funders) |

   For each body, the agent searches for current funding opportunities pages, fetches the results, and filters for relevance to the project sector and TRL.

4. **Gather grant details.** For each relevant grant, the agent collects via live web searches: grant name and programme, funding body, funding range (min-max), eligibility criteria, application deadline, TRL requirements, application process summary, success rate (if published), and a direct URL to the application page.

5. **Score eligibility.** Each grant is rated against the project funding profile:
   - **High** — project meets all eligibility criteria, sector and TRL align, organisation type qualifies
   - **Medium** — project meets most criteria, may need minor adaptation or partner involvement
   - **Low** — partial match, significant gaps in eligibility or sector mismatch

   Every score includes a rationale explaining what matches and what gaps exist.

6. **Write the report.** The agent produces a structured document following ArcKit's standard template, written to `projects/{dir}/research/ARC-{NNN}-GRNT-{NNN}-v1.0.md`.

7. **Spawn knowledge.** For each grant programme researched in depth, the agent creates a standalone tech note in `projects/{dir}/tech-notes/`. These persist beyond the current project, so future research runs can discover and build on them. Existing notes are updated rather than duplicated.

8. **Return a summary.** The full report is written to file. Only a concise summary appears in the conversation: total grants found, top matches with funding amounts, nearest deadlines, and suggested next steps.

### The Output Document

The grants report follows ArcKit's standard document control format with these sections:

**Project Funding Profile** — a table summarising the project's sector, organisation type, TRL, funding sought, and timeline, extracted from requirements.

**Grant Opportunities** — one detailed section per grant, sorted by eligibility score (High first). Each includes a structured table (funding body, programme, range, deadline, TRL, score), eligibility criteria, score rationale, application process summary, and URL.

**Summary Comparison Table** — all grants in a single table for quick comparison across funder, amount, deadline, eligibility, TRL, and score.

**Recommended Funding Strategy** — the top three grants with rationale, an application timeline with specific dates and actions, complementary funding combinations (e.g., Innovate UK for the security layer plus KTP for capability building), and total potential funding if all recommended applications succeed.

**Risks and Considerations** — application effort vs probability, co-funding requirements, reporting obligations, and timeline alignment with project milestones.

**Spawned Knowledge** — a list of tech notes created or updated from this research.

**External References** — citation traceability linking findings back to source documents using ArcKit's `[DOC_ID-CN]` marker format.

---

## 360Giving and GrantNav Integration

One of the most valuable search sources is 360Giving's GrantNav database. 360Giving is the UK's open standard for grants data, and GrantNav aggregates published grant information from over 200 UK funders, including many smaller foundations and trusts that don't appear in the major funding body lists.

The agent searches GrantNav with project-relevant keywords to discover funders not in the hardcoded list and to find historical grants that indicate active programmes in the project's domain. A search for "digital government appointment booking" might surface grants from local authority innovation funds, NHS trust digital transformation budgets, or regional growth funds that a manual search of the big national bodies would miss entirely.

---

## Real-World Example

Running `/arckit.grants 001` against a UK government Digital Appointment Booking Service project (a citizen-facing booking, rescheduling, and cancellation service as part of a digital transformation programme), the agent found 12 grants across government R&D, health, and accelerator categories:

- **3 High-scoring grants**: GDS Modern Digital Government Funding Pilots, NHS Digital Tools Funding, and NHS Unified Tech Fund
- **4 Medium-scoring grants**: Innovate UK Secure Software for Resilient Growth (deadline 29 April), Knowledge Transfer Partnership, Frontier AI Discovery Phase 1, and NIHR i4i FAST
- **5 Low-scoring grants**: filtered out as poor fit due to startup focus, wrong sector, or insufficient funding scale

The recommended strategy combined three non-conflicting funding streams: GDS departmental funding for core delivery, Innovate UK's Secure Software grant for security hardening (leveraging the project's GOV.UK One Login and TLS 1.3 requirements), and a KTP for capability building. Total competitive grant funding potential: £377,000 to £1,106,000, excluding departmental allocations.

The report included an application timeline with specific dates, identified that Smart Grants (historically the best general-purpose Innovate UK fund) are paused for 2025/26, and flagged the imminent Secure Software deadline as requiring immediate SME partner identification.

---

## Integration with the ArcKit Workflow

The grants command fits into the existing architecture governance workflow through three handoffs:

- **`/arckit.sobc`** — feed grant funding data into the Strategic Outline Business Case's Economic Case, updating cost-benefit analysis with confirmed or potential funding streams
- **`/arckit.plan`** — create a project plan aligned to grant milestones and application deadlines
- **`/arckit.risk`** — add grant-specific risks to the risk register: application rejection, co-funding requirements, reporting obligations, and compliance constraints

The GRNT document type is a multi-instance research artifact (like RSCH), stored in the project's `research/` subdirectory. It appears in the pages documentation site under the Research category, and the new version display feature (also in v4.6.4) means multiple versions of a grants report are distinguishable in the sidebar.

---

## Also in v4.6.4

This release also includes improvements from v4.6.3:

**Document version badges in the pages sidebar.** Every document now shows its version number (e.g., v1.0) in the sidebar navigation. When multiple versions of the same document type exist, they collapse into a single entry with an inline dropdown selector, defaulting to the latest version.

**Citation traceability for external documents.** All 43 commands and 7 research agents now support inline citation markers (`[DOC_ID-CN]`) when reading external documents from `external/`, `policies/`, or `vendors/` directories. Generated artifacts include a structured External References section with a Document Register, Citations table, and Unreferenced Documents list, providing full traceability from findings back to source material.

---

## Getting Started

Install or update the ArcKit plugin in Claude Code:

```text
/plugin marketplace add tractorjuice/arc-kit
```

Run the grants command against any project with requirements:

```text
/arckit.grants 001
```

Or describe a project domain directly:

```text
/arckit.grants health tech AI appointment booking
```

The command works with or without existing requirements. Project context improves results by enabling sector classification and eligibility matching, but a descriptive argument is sufficient to get started.

Use `--no-spawn` to skip tech note creation if you want the report only:

```text
/arckit.grants 001 --no-spawn
```

ArcKit v4.6.4 is available now across all six distribution formats: Claude Code (plugin), Gemini CLI (extension), GitHub Copilot (prompt files), OpenAI Codex CLI (skills), OpenCode CLI (commands), and Paperclip (TypeScript plugin).
