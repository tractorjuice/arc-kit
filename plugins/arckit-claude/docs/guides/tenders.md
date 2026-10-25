# Find a Tender and Contracts Finder: UK public contract award data

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

Find a Tender is the free GOV.UK service where UK public sector buyers publish procurement notices, and Contracts Finder holds older notices for England. This guide explains both services, how notices are published under the Procurement Act 2023, and how `/arckit:tenders` turns their award data into market intelligence.

---

## What Find a Tender is

[Find a Tender](https://www.find-tender.service.gov.uk/) is "where public sector buyers publish notices about procurement opportunities and contracts". Since 24 February 2025 it has also been the central digital platform for the Procurement Act 2023. All UK contracting authorities publish their procurement information there, and suppliers register and hold the business information they share with buyers ([Central Digital Platform factsheet](https://www.gov.uk/government/publications/procurement-act-2023-short-guides/central-digital-platform-factsheet-html)). It is free for everyone, and you should not pay to view public sector opportunities.

Find a Tender publishes:

- notices about new UK procurements from 24 February 2025, above and below threshold (below-threshold notices in Scotland are the exception)
- above-threshold notices for older procurements, across the contract life cycle from pipeline to termination
- searchable views of opportunities, contracts and commercial tools (framework agreements, dynamic markets and dynamic purchasing systems)

It also offers [notice data through an API](https://www.find-tender.service.gov.uk/Developer/Documentation).

## What Contracts Finder is

[Contracts Finder](https://www.gov.uk/contracts-finder) lets you search for information about contracts with the government and its agencies: current and forthcoming opportunities, and details of previous tenders and contracts. [Search Contracts Finder](https://www.contractsfinder.service.gov.uk/).

Its role has narrowed since the Procurement Act 2023 came in. [PPN 019](https://www.gov.uk/government/publications/ppn-019-requirements-to-publish-on-contracts-finder/update-to-legal-requirements-to-publish-procurement-information-on-contracts-finder) (updated 31 March 2025) says no new procurements are run under the Public Contracts Regulations 2015 after 24 February 2025. For procurements started under those regulations, organisations in scope still publish award information on Contracts Finder. Find a Tender points to Contracts Finder for below-threshold information on older procurements in England and other non-devolved territories.

## How notices are published under the Procurement Act 2023

The Act's rules took effect on 24 February 2025 ([Procurement Act 2023: short guide for suppliers](https://www.gov.uk/government/publications/procurement-act-2023-short-guides/the-procurement-act-2023-a-short-guide-for-suppliers-html)). For a procurement that starts on or after that date, the buyer publishes a series of notices on Find a Tender through the life of the contract ([Find a Tender notice types](https://www.find-tender.service.gov.uk/Home/NoticeTypes)):

| Stage | Notices |
|-------|---------|
| Before the tender | UK1 pipeline notice, UK2 preliminary market engagement notice, UK3 planned procurement notice |
| Tender or direct award | UK4 tender notice, UK5 transparency notice |
| Award | UK6 contract award notice, UK7 contract details notice |
| During the contract | UK9 contract performance notice, UK10 contract change notice, UK11 contract termination notice |
| Other | UK12 procurement termination notice, UK13 to UK16 dynamic market notices, UK17 payments compliance notice |

- Every below-threshold contract needs a UK7 contract details notice.
- The Act's notices don't apply where Scottish rules apply, where Northern Irish rules apply to a below-threshold contract, or to frameworks, dynamic purchasing systems and qualification systems set up under earlier legislation.
- A procurement that started under earlier legislation keeps using that legislation's notice types.

---

## Using /arckit:tenders

`/arckit:tenders` discovers procurement market intelligence — award-value benchmarks, top suppliers, incumbency patterns, and concentration — from live UK procurement notices via the UK Tenders MCP. That MCP mirrors notices from Find a Tender, Contracts Finder and the three devolved portals (see [Data Source](#data-source)).

> **Agent Architecture**: This command uses a three-tier reader/writer subagent split. The **`arckit-tenders-reader`** subagent fetches evidence from the UK Tenders MCP (keeping that I/O isolated from your main context window). The orchestrator tier (the slash command) validates the reader's JSON payload against the `tenders-handoff.schema.json` schema and computes deterministic derived fields. The **`arckit-tenders-writer`** subagent then renders the final artefact. The slash command launches and coordinates both agents. On runtimes without subagent dispatch (Codex, Gemini, OpenCode, Copilot, Paperclip, Vibe, Kimi), the command ships as the equivalent single-agent `arckit-tenders` prompt instead, which does the same discovery, derivation and rendering in one role.

---

## What is Procurement Market Intelligence?

Procurement market intelligence is the systematic collection and analysis of real awarded-contract data to understand the supply landscape before a procurement or business case is prepared.

**Key questions answered:**

- What has this capability been procured for, and at what value?
- Who are the current incumbent suppliers, and how concentrated is the market?
- What is the median award value — a useful anchor for the Economic Case?
- Has the buying organisation previously awarded this work, and to whom?

> **Mandatory caveat.** Awarded value is not actual spend; figures are for market context and benchmarking, not the costed Economic Case. Never use TNDR figures as the cost line in a Green Book Economic Case without independent substantiation.

---

## When to Use

- **Before drafting the Economic Case** in a Strategic Outline Business Case — award-value benchmarks anchor the costing range
- **Before scoping a procurement** — understand the supply base, concentration, and typical award size
- **When assessing build vs buy** — quantify the commercial market depth before recommending a build
- **When requesting approval for a sole-source** or direct award — evidence the supply landscape
- **As early-stage market engagement intelligence** — complement formal preliminary market engagement (a UK2 notice under the Procurement Act 2023)

---

## Prerequisites and Dependencies

| Artefact | Dependency | Why |
|----------|-----------|-----|
| Requirements (`ARC-*-REQ-*.md`) | OPTIONAL | CPV codes and capability keywords can be derived from DR/FR/INT requirements |
| Architecture Principles (`ARC-000-PRIN-*.md`) | OPTIONAL | Identifies the commissioning buyer for buyer-focused queries |
| SOBC (`ARC-*-SOBC-*.md`) | DOWNSTREAM | Median award values anchor the Economic Case cost range |
| Risk Register (`ARC-*-RISK-*.md`) | DOWNSTREAM | Supplier-concentration findings feed R-xxx concentration/single-supplier-dependency risks |

---

## Inputs

The command accepts four input forms, which can be combined:

| Input | Flag / Form | Example |
|-------|-------------|---------|
| Capability (free text) | bare arguments | `/arckit:tenders cloud hosting` |
| CPV code | `--cpv NNNNNNNN` | `/arckit:tenders --cpv 72200000` |
| Buyer organisation | `--buyer 'Name'` | `/arckit:tenders --buyer 'HMRC'` |
| Supplier name | `--supplier 'Name'` | `/arckit:tenders --supplier 'Acme Cloud Ltd'` |

You can combine flags: `/arckit:tenders cloud hosting --cpv 72200000 --buyer 'DVLA'`.

**CPV code format:** eight digits, optionally followed by a hyphen and the check digit (`NNNNNNNN-N`). In the [Common Procurement Vocabulary](https://ted.europa.eu/en/simap/cpv), the first two digits identify the division and the ninth digit verifies the others. Common codes:

| Code | Category |
|------|----------|
| 72200000 | Software programming and consultancy services |
| 72300000 | Data services |
| 72600000 | Computer support and consultancy services |
| 48000000 | Software package and information systems |
| 79000000 | Business services: law, marketing, consulting, recruitment, printing and security |
| 73000000 | Research and development services and related consultancy services |

---

## Scenario Matrix

| Scenario | Prompt | Focus |
|---------|--------|-------|
| Capability benchmark | `/arckit:tenders digital identity verification` | Median award value, top suppliers |
| CPV-scoped benchmark | `/arckit:tenders --cpv 72600000 --buyer 'HMRC'` | Awards by this buyer in this CPV |
| Incumbent research | `/arckit:tenders --supplier 'Acme Cloud Ltd'` | All awards to this supplier |
| Build-vs-buy evidence | `/arckit:tenders --buyer 'DVLA' --cpv 72200000` | Prior buyer activity |
| Sole-source justification | `/arckit:tenders specialist radar maintenance` | Supply-base depth evidence |

---

## Command

```bash
/arckit:tenders [project-number-or-name] <capability | --cpv NNNNNNNN | --buyer 'Name' | --supplier 'Name'>
```

Output: `projects/<id>/research/ARC-<id>-TNDR-<NNN>-v1.0.md`

> **Multi-instance type**: `TNDR` artefacts are sequenced within the project's `research/` directory. Re-running produces a new numbered artefact (`TNDR-001`, `TNDR-002`, …) rather than overwriting the previous run.

---

## Long runs: Remote Control + push notifications

`/arckit:tenders` can take several minutes when the UK Tenders MCP needs to page through large result sets. To avoid babysitting the terminal, pair it with [Claude Code Remote Control](https://code.claude.com/docs/en/remote-control):

```bash
claude remote-control
```

Drive the session from claude.ai/code or the mobile app, then enable `/config → Push when Claude decides` so your phone gets a notification on completion. ArcKit's minimum Claude Code floor (v2.1.287) already covers the v2.1.110 RC requirement.

Caveats: Pro/Max plans only (no API keys, no Bedrock/Vertex/Foundry), push is a single on/off so chatty agents can over-notify, and the local `claude` process must keep running.

---

## Artefact Sections

A completed TNDR artefact contains:

1. **Executive Summary** — 3–5 key findings, median award value, concentration flag.
2. **Query Scope** — recorded focus, CPV, buyer, supplier, date range so the run is reproducible.
3. **Market Size and Median Benchmarks** — total and median awarded value, award count, date range covered.
4. **Top Suppliers by Awarded Value** — ranked table with share %, key buyers, and notice-URL citations.
5. **Incumbency** — one-sentence narrative on the dominant supplier, or a statement that there is no clear incumbent.
6. **Concentration** — top-1 / top-3 share and a `HIGH` / `MEDIUM` / `LOW` flag with the rule applied.
7. **Award Trend** — awarded value and count per period (financial year or calendar year).
8. **Representative Notices** — sample award notices with their `notice_url` (required for OGL attribution).
9. **Data Freshness and Source Health** — `Data current as of <ISO datetime>` or a freshness-unavailable note when the status endpoint was unreachable.
10. **Caveats** — including the mandatory awarded-value caveat.

### Concentration Flag Rules

| Flag | Condition |
|------|-----------|
| `HIGH` | Top-1 supplier share > 50% **or** top-3 supplier share > 80% |
| `MEDIUM` | Top-3 supplier share > 60% (and HIGH conditions not met) |
| `LOW` | All other cases |

A `HIGH` concentration flag should be registered as a supplier-dependency risk in the project Risk Register (`/arckit:risk`).

---

## Data Source

| Property | Detail |
|----------|--------|
| **MCP server** | `uk-tenders` (keyless, always loaded) |
| **Coverage** | About 726,000 UK contracting processes across five national portals (25 October 2026); Contracts Finder from November 2016, Find a Tender from January 2021 |
| **Portals covered** | Find a Tender Service (FTS), Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI |
| **Refresh cadence** | Nightly |
| **Availability** | Best-effort single Cloud Run instance — no formal SLA. A dead endpoint degrades gracefully (the reader returns partial data and the artefact renders with degraded-source notes). |
| **Licence** | Open Government Licence v3.0 (OGL v3.0) |
| **Attribution** | Every notice record carries its official `notice_url`; artefacts must include the OGL v3.0 attribution line |

### OGL Attribution

Every TNDR artefact includes the attribution line:

> Contains public sector information licensed under the Open Government Licence v3.0.

The source data is re-published by the UK Tenders MCP from official UK procurement portals verbatim under the OGL v3.0. Every supplier figure and benchmark in the artefact traces to a `notice_url` citation from the relevant portal.

---

## Evaluation Criteria Explained

The reader returns evidence across five procurement portals, ranked internally by:

| Criterion | Purpose |
|-----------|---------|
| **Awarded value** | Primary ranking signal for suppliers and benchmarks |
| **Award count** | Proxy for market depth (many small awards vs few large awards) |
| **Share %** | Concentration measurement; feeds the top-1 / top-3 concentration flag |
| **Date range coverage** | Assesses recency and whether the market has changed materially |
| **Source health** | Flags which portal feeds were degraded at fetch time |

---

## Integration with Other Commands

| Direction | Command | Integration |
|-----------|---------|-------------|
| **Input** | `/arckit:requirements` | CPV codes and capability keywords derived from DR/FR/INT |
| **Input** | `/arckit:principles` | Commissioning buyer identified from ARC-000-PRIN |
| **Output** | `/arckit:sobc` | Median award value anchors the Economic Case cost range |
| **Output** | `/arckit:risk` | Concentration / single-supplier-dependency risk |
| **Output** | `/arckit:research` | Build-vs-buy market context; TCO comparison |
| **Output** | `/arckit:adr` | Data source, make-vs-buy, or route-to-market recorded as decisions |

---

## Follow-on Actions

- Anchor the Economic Case with real median award values (`/arckit:sobc`)
- Register supplier-concentration or single-supplier-dependency risks (`/arckit:risk`)
- Use market depth evidence in build-vs-buy analysis (`/arckit:research`)
- Record route-to-market decisions as ADRs (`/arckit:adr`)
- Escalate `HIGH` concentration findings to commercial lead before procurement scoping

---

## Useful Links

- [Find a Tender](https://www.find-tender.service.gov.uk/) and its [GOV.UK start page](https://www.gov.uk/find-tender)
- [Contracts Finder](https://www.gov.uk/contracts-finder)
- [Procurement Act 2023: short guides](https://www.gov.uk/government/publications/procurement-act-2023-short-guides) (GOV.UK)
- [Find a Tender notice types and sequences](https://www.find-tender.service.gov.uk/Home/NoticeTypes)
- [PPN 019: requirements to publish on Contracts Finder](https://www.gov.uk/government/publications/ppn-019-requirements-to-publish-on-contracts-finder/update-to-legal-requirements-to-publish-procurement-information-on-contracts-finder)
