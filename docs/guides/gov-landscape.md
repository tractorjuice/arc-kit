# Government Code Landscape Analysis Guide

> **Guide Origin**: Official | **ArcKit Version**: 4.4.0

`/arckit:gov-landscape` maps what UK government has built in a domain — organisations active in the space, common technology patterns, adopted standards, maturity levels, and collaboration opportunities — giving architects a broad situational picture before making design decisions.

> **Agent Architecture**: In Claude Code the command runs in your main session. It sends reader subagents to gather evidence, and a writer subagent with no network tools then writes the document, which keeps the research out of your main context. Other assistants run a single combined prompt instead. The command splits the domain into 4 to 6 organisation and technology buckets, one per reader. Each reader runs govreposcrape searches and vulnerability-exposure queries and uses WebFetch to inspect representative repositories.

---

## Prerequisites

### govreposcrape MCP Server (AUTO-INSTALLED)

This command uses the govreposcrape MCP server which is **automatically included** with the ArcKit plugin. No manual setup required.

**Endpoint**: `https://govreposcrape-api-1060386346356.us-central1.run.app/mcp`

### Project Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) - Recommended (used to anchor domain focus)
- Architecture principles (`ARC-000-PRIN-*.md`) - Recommended
- Stakeholder analysis (`ARC-*-STKE-*.md`) - Optional

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Domain mapping | "Map the government landscape for `<domain>`" | Breadth of activity across departments |
| Technology survey | "Survey technology used in government `<domain>`" | Language, framework, and platform spread |
| Standards adoption | "Which government teams have adopted `<standard>`?" | Compliance patterns and gaps |
| Collaboration discovery | "Find government teams working on `<problem>`" | Potential reuse partners or communities of practice |
| Gap analysis | "What is missing from the government `<domain>` landscape?" | Under-served capabilities and build opportunities |

Add a time qualifier ("in the last 2 years") or a department name to scope the landscape further.

---

## Command

```bash
/arckit:gov-landscape <domain>
```

Outputs: `projects/<id>/research/ARC-<id>-GLND-<NNN>-v1.0.md`

> **Re-running**: each run writes a new report with the next sequence number (`GLND-001`, `GLND-002` and so on), so earlier reports are kept.

---

## How It Works

The command uses a broad-to-specific search strategy across the govreposcrape semantic search API:

| Step | Action |
|------|--------|
| 1 | Split the domain into 4-6 buckets (organisations and technology facets), each searched with up to 3 queries |
| 2 | Run the searches, and query vulnerability exposure for 3-5 organisation or package scopes, collecting a wide pool of repositories |
| 3 | Cluster results by organisation and technology theme |
| 4 | Fetch GitHub repo details via WebFetch for representative samples in each cluster |
| 5 | Score each repository's maturity from a fixed rubric (activity, documentation, tests, CI/CD, community) |
| 6 | Synthesise findings into a landscape map with technology breakdown and gap analysis |

### Maturity Scoring

Each repository is scored from a fixed rubric (`gov-landscape-generic`) on five weighted dimensions, so the same evidence gives the same score on a re-run. The scores roll up into a band: Production-Grade, Mature, Developing or Experimental. The domain gets no overall grade, only the median and the distribution.

| Dimension | Weight | What it looks at |
|-----------|--------|------------------|
| Activity | 25% | Time since the last commit |
| Documentation | 20% | README and docs tree |
| Tests | 20% | Whether the repository has tests |
| CI/CD | 15% | Whether it has a pipeline |
| Community | 20% | Contributors and forks |

---

## Output Highlights

- **Landscape map** showing organisations active in the domain and their relative maturity
- **Technology stack analysis** with language and framework distribution across repos
- **Standards adoption** summary — which standards are widely, partially, or not yet adopted
- **Maturity scores** per repository across the five dimensions, with the median for the domain
- **Supply-chain exposure** — known vulnerabilities in dependencies, counted by severity for the queried organisations and packages. A scope that returns no data is reported as unknown exposure, not as clean
- **Collaboration opportunities** identifying teams solving similar problems
- **Gap analysis** for capabilities or standards with little or no existing government code

---

## Follow-on Actions

- Run `/arckit:gov-reuse` to perform a scored reuse assessment for specific capabilities identified in the landscape
- Run `/arckit:framework` to transform landscape findings into architectural principles and patterns
- Run `/arckit:wardley` to map domain components onto a Wardley Map for evolution analysis

---

## Comparison with /arckit:gov-reuse and /arckit:gov-code-search

| Feature | `/arckit:gov-landscape` | `/arckit:gov-reuse` | `/arckit:gov-code-search` |
|---------|------------------------|--------------------|--------------------------|
| Purpose | Map an entire domain | Assess candidates for a project | Discover repos matching a query |
| Scope | Domain-wide (4-6 buckets) | Capability-specific (3-5 queries) | Query-specific (3-5 queries) |
| Output | Landscape map + maturity scores + exposure | Scored reuse assessment per capability | Search results + repo profiles |
| Project required | No (recommended) | Yes (requirements MANDATORY) | No |
| When to use | Early-stage situational awareness | Before building a capability | Exploratory or ad-hoc search |

**Workflow**: Use `/arckit:gov-landscape` to understand the domain, `/arckit:gov-code-search` for targeted queries, and `/arckit:gov-reuse` for project-specific reuse decisions.

---

## Resources

- [govreposcrape](https://github.com/chrisns/govreposcrape) - Semantic search over UK government repositories
- [govreposcrape API](https://govreposcrape-api-1060386346356.us-central1.run.app/openapi.json) - OpenAPI specification
