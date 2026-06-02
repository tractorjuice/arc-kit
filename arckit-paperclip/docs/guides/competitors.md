# Competitor Landscape Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

`/arckit.competitors` discovers competitor landscape intelligence — rival suppliers, awarded-value market share, head-to-head comparison, and concentration — from live UK procurement notices via the UK Tenders MCP.

> **Agent Architecture**: This command uses a three-tier reader/writer subagent split. The **`arckit-tenders-reader`** subagent fetches evidence from the UK Tenders MCP (shared with `/arckit.tenders`, keeping that I/O isolated from your main context window). The orchestrator tier (the slash command) validates the reader's JSON payload against the `tenders-handoff.schema.json` schema and computes deterministic derived fields, including the supplier-rivalry head-to-head. The **`arckit-competitors-writer`** subagent then renders the final artefact. The slash command launches and coordinates both agents.

---

## What is Competitor Landscape Intelligence?

Competitor landscape intelligence is the systematic analysis of real awarded-contract data to understand who else is winning work in a capability space — their share of awarded value, which buyers they serve, and how a focal supplier compares against each rival.

**Key questions answered:**

- Who are the rival suppliers in this capability space, and what is their awarded-value share?
- How does a named supplier compare against each rival (shared buyers, recent wins)?
- How concentrated is the competitive landscape — is one supplier dominant?
- Which government buyers are active in this space?

> **Mandatory caveat.** Awarded value is not actual spend; figures are for market context and benchmarking, not the costed Economic Case. Never use CMPT figures as the cost line in a Green Book / Orange Book Economic Case without independent substantiation.

---

## When to Use

- **Before a vendor evaluation** — understand who has already won similar work and at what scale
- **Before scoping a competition** — know the realistic supplier pool and whether concentration is a risk
- **When building a Company Experience scorecard** — rival award history provides comparative context for `/arckit.score`
- **When assessing a sole-source or incumbent renewal** — evidence the broader competitive landscape
- **As part of a build-vs-buy analysis** — quantify the commercial supply depth alongside `/arckit.research`

---

## Prerequisites and Dependencies

| Artefact | Dependency | Why |
|----------|-----------|-----|
| Requirements (`ARC-*-REQ-*.md`) | OPTIONAL | Capability keywords and CPV codes can be derived from DR/FR/INT requirements |
| Architecture Principles (`ARC-000-PRIN-*.md`) | OPTIONAL | Identifies the organisational context for capability scoping |
| Vendor Profiles (`vendors/{slug}-profile.md`) | ENRICHED | Pre-existing vendor profiles gain an enriched Government Award History section |
| Risk Register (`ARC-*-RISK-*.md`) | DOWNSTREAM | Supplier-concentration findings feed R-xxx concentration/single-supplier-dependency risks |

---

## Inputs

The command accepts three input forms, which can be combined:

| Input | Flag / Form | Example |
|-------|-------------|---------|
| Supplier focus (focal supplier) | `--supplier 'Name'` | `/arckit.competitors --supplier 'Acme Cloud Ltd'` |
| Capability (free text) | bare arguments | `/arckit.competitors cloud hosting` |
| CPV code | `--cpv NNNNNNNN` | `/arckit.competitors --cpv 72200000` |

Use `--supplier 'Name'` to run a **supplier-focus** query: the named supplier becomes the focal point and the command produces a head-to-head comparison against each rival. Without `--supplier`, the command runs in **capability-focus** mode: it returns the full competitive set ranked by awarded-value share, with no focal supplier or head-to-head.

You can combine flags: `/arckit.competitors cloud hosting --cpv 72200000 --supplier 'Acme Cloud Ltd'`.

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
| Capability landscape | `/arckit.competitors digital identity verification` | Rival suppliers ranked by awarded-value share |
| Supplier head-to-head | `/arckit.competitors --supplier 'Acme Cloud Ltd'` | Focal supplier vs each rival |
| Scoped supplier analysis | `/arckit.competitors --cpv 72600000 --supplier 'Acme Cloud Ltd'` | Focal supplier vs rivals in a specific CPV |
| Market concentration check | `/arckit.competitors cloud hosting --cpv 72200000` | Concentration flag and supply-base depth |
| Vendor evaluation context | `/arckit.competitors managed security operations` | Who is winning, at what value, for which buyers |

---

## Command

```bash
/arckit.competitors [project-number-or-name] <--supplier 'Name' | capability | --cpv NNNNNNNN>
```

Outputs: `projects/<id>/research/ARC-<id>-CMPT-<NNN>-v1.0.md`

> **Multi-instance type**: `CMPT` artefacts are sequenced within the project's `research/` directory. Re-running produces a new numbered artefact (`CMPT-001`, `CMPT-002`, …) rather than overwriting the previous run.

---

## Artefact Sections

A completed CMPT artefact contains:

1. **Executive Summary** — 3–5 key findings, concentration flag, focal supplier position (supplier-focus runs only).
2. **Query Scope** — recorded focus, CPV, supplier, keywords, date range so the run is reproducible.
3. **Competitive Set** — rival suppliers ranked by awarded-value share %, with award counts and key buyers.
4. **Focal Supplier** — on supplier-focus runs, the named supplier's awarded value, award count, and share pulled out of the competitive set.
5. **Head-to-Head** — on supplier-focus runs, the focal supplier compared against each rival: shared buyers, rival's most recent win. Renders not-applicable on capability-focus runs.
6. **Per-Rival Buyer Relationships and Recent Wins** — short prose per rival derived from the data.
7. **Concentration** — top-1 / top-3 share and a `HIGH` / `MEDIUM` / `LOW` flag with the rule applied.
8. **Representative Notices** — sample award notices with their `notice_url` (required for OGL attribution).
9. **Data Freshness and Source Health** — `Data current as of <ISO datetime>` or a freshness-unavailable note when the status endpoint was unreachable.
10. **Caveats** — including the mandatory awarded-value caveat.

### Concentration Flag Rules

| Flag | Condition |
|------|-----------|
| `HIGH` | Top-1 supplier share > 50% **or** top-3 supplier share > 80% |
| `MEDIUM` | Top-3 supplier share > 60% (and HIGH conditions not met) |
| `LOW` | All other cases |

A `HIGH` concentration flag should be registered as a supplier-dependency risk in the project Risk Register (`/arckit.risk`).

---

## Vendor Profile Enrichment

When a project already has a vendor profile (`vendors/{slug}-profile.md`) for a rival supplier, the `arckit-competitors-writer` subagent enriches that profile's **Government Award History** section with the award data from the competitive set. This means running `/arckit.competitors` before `/arckit.score` gives the score command richer comparative evidence to work with.

The writer performs a bounded section-merge — it updates only the `## Government Award History` section of pre-existing profiles. It does **not** create new profile files.

---

## Data Source

| Property | Detail |
|----------|--------|
| **MCP server** | `uk-tenders` (keyless, deferred load, shared with `/arckit.tenders`) |
| **Coverage** | ~677,000 UK contracting processes across five national portals |
| **Portals covered** | Find a Tender Service (FTS), Contracts Finder, Public Contracts Scotland, Sell2Wales, eTendersNI |
| **Refresh cadence** | Nightly |
| **Availability** | Best-effort single Cloud Run instance — no formal SLA. A dead endpoint degrades gracefully (the reader returns partial data and the artefact renders with degraded-source notes). |
| **Licence** | Open Government Licence v3.0 (OGL v3.0) |
| **Attribution** | Every notice record carries its official `notice_url`; artefacts must include the OGL v3.0 attribution line |

### OGL Attribution

Every CMPT artefact includes the attribution line:

> Contains public sector information licensed under the Open Government Licence v3.0.

The source data is re-published by the UK Tenders MCP from official UK procurement portals verbatim under the OGL v3.0. Every supplier figure and share percentage in the artefact traces to a `notice_url` citation from the relevant portal.

---

## Evaluation Criteria Explained

The reader returns evidence across five procurement portals, ranked internally by:

| Criterion | Purpose |
|-----------|---------|
| **Awarded value** | Primary ranking signal for rivals and share calculations |
| **Award count** | Proxy for market depth (many small awards vs few large awards) |
| **Share %** | Concentration measurement; feeds the top-1 / top-3 concentration flag |
| **Date range coverage** | Assesses recency and whether the competitive landscape has changed materially |
| **Source health** | Flags which portal feeds were degraded at fetch time |

---

## Integration with Other Commands

| Direction | Command | Integration |
|-----------|---------|-------------|
| **Input** | `/arckit.requirements` | CPV codes and capability keywords derived from DR/FR/INT |
| **Input** | `/arckit.tenders` | TNDR artefact narrows the capability scope and provides market benchmarks |
| **Output** | `/arckit.research` | Feed the competitive set into build-vs-buy analysis and TCO comparison |
| **Output** | `/arckit.score` | Rival award history used as comparative Company Experience evidence |
| **Output** | `/arckit.risk` | Concentration / single-supplier-dependency risk |
| **Output** | `/arckit.adr` | Competitive landscape and route-to-market decisions recorded as ADRs |

---

## Follow-on Actions

- Feed the competitive set into build-vs-buy analysis (`/arckit.research`)
- Use rival award history as Company Experience evidence in a vendor scorecard (`/arckit.score`)
- Register supplier-concentration or single-supplier-dependency risks (`/arckit.risk`)
- Record route-to-market decisions as ADRs (`/arckit.adr`)
- Escalate `HIGH` concentration findings to commercial lead before procurement scoping
