# Procurement Market Intelligence Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit:tenders` discovers procurement market intelligence — award-value benchmarks, top suppliers, incumbency patterns, and concentration — from live UK procurement notices via the UK Tenders MCP.

> **Agent Architecture**: This command uses a three-tier reader/writer subagent split. The **`arckit-tenders-reader`** subagent fetches evidence from the UK Tenders MCP (keeping that I/O isolated from your main context window). The orchestrator tier (the slash command) validates the reader's JSON payload against the `tenders-handoff.schema.json` schema and computes deterministic derived fields. The **`arckit-tenders-writer`** subagent then renders the final artefact. The slash command launches and coordinates both agents.

---

## What is Procurement Market Intelligence?

Procurement market intelligence is the systematic collection and analysis of real awarded-contract data to understand the supply landscape before a procurement or business case is prepared.

**Key questions answered:**

- What has this capability been procured for, and at what value?
- Who are the current incumbent suppliers, and how concentrated is the market?
- What is the median award value — a useful anchor for the Economic Case?
- Has the buying organisation previously awarded this work, and to whom?

> **Mandatory caveat.** Awarded value is not actual spend; figures are for market context and benchmarking, not the costed Economic Case. Never use TNDR figures as the cost line in a Green Book / Orange Book Economic Case without independent substantiation.

---

## When to Use

- **Before drafting the Economic Case** in a Strategic Outline Business Case — award-value benchmarks anchor the costing range
- **Before scoping a procurement** — understand the supply base, concentration, and typical award size
- **When assessing build vs buy** — quantify the commercial market depth before recommending a build
- **When requesting approval for a sole-source** or direct award — evidence the supply landscape
- **As early-stage market engagement intelligence** — complement formal Prior Information Notices

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

**CPV code format:** eight digits, optionally followed by a division suffix (`NNNNNNNN-N`). Common codes:

| Code | Category |
|------|----------|
| 72200000 | Software-related services |
| 72300000 | Data services |
| 72600000 | IT support and consultancy |
| 48000000 | Software packages and systems |
| 79000000 | Business services |
| 73000000 | R&D services |

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

Outputs: `projects/<id>/research/ARC-<id>-TNDR-<NNN>-v1.0.md`

> **Multi-instance type**: `TNDR` artefacts are sequenced within the project's `research/` directory. Re-running produces a new numbered artefact (`TNDR-001`, `TNDR-002`, …) rather than overwriting the previous run.

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
| **MCP server** | `uk-tenders` (keyless, deferred load) |
| **Coverage** | ~677,000 UK contracting processes across five national portals |
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
