# Government Code Landscape Analysis Guide

> **Guide Origin**: Official | **ArcKit Version**: 4.4.0

`/arckit.gov-landscape` maps what UK government has built in a domain — organisations active in the space, common technology patterns, adopted standards, maturity levels, and collaboration opportunities — giving architects a broad situational picture before making design decisions.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent issues 8-12 govreposcrape queries across the domain, uses WebFetch to inspect representative repositories at depth, and synthesises findings into a structured landscape report, keeping the main conversation clean. The slash command is a thin wrapper that delegates to the agent.

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
/arckit.gov-landscape <domain>
```

Outputs: `projects/<id>/research/ARC-<id>-GLND-v1.0.md`

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version.

---

## How It Works

The agent uses a broad-to-specific search strategy across the govreposcrape semantic search API:

| Step | Action |
|------|--------|
| 1 | Generate 8-12 domain-spanning queries covering different facets |
| 2 | Run all queries, collecting a wide pool of repositories |
| 3 | Cluster results by organisation and technology theme |
| 4 | Fetch GitHub repo details via WebFetch for representative samples in each cluster |
| 5 | Score each organisation's activity on domain maturity (depth, recency, documentation) |
| 6 | Synthesise findings into a landscape map with technology breakdown and gap analysis |

### Maturity Scoring

Each active organisation in the domain is rated on three dimensions:

| Dimension | High | Low |
|-----------|------|-----|
| Depth | Multiple repos, clear investment | Single exploratory repo |
| Recency | Active commits within 12 months | No activity in 2+ years |
| Documentation | Architecture docs, guides, READMEs | Minimal or no documentation |

---

## Output Highlights

- **Landscape map** showing organisations active in the domain and their relative maturity
- **Technology stack analysis** with language and framework distribution across repos
- **Standards adoption** summary — which standards are widely, partially, or not yet adopted
- **Maturity scores** per organisation for depth, recency, and documentation
- **Collaboration opportunities** identifying teams solving similar problems
- **Gap analysis** for capabilities or standards with little or no existing government code

---

## Follow-on Actions

- Run `/arckit.gov-reuse` to perform a scored reuse assessment for specific capabilities identified in the landscape
- Run `/arckit.framework` to transform landscape findings into architectural principles and patterns
- Run `/arckit.wardley` to map domain components onto a Wardley Map for evolution analysis

---

## Comparison with /arckit.gov-reuse and /arckit.gov-code-search

| Feature | `/arckit.gov-landscape` | `/arckit.gov-reuse` | `/arckit.gov-code-search` |
|---------|------------------------|--------------------|--------------------------|
| Purpose | Map an entire domain | Assess candidates for a project | Discover repos matching a query |
| Scope | Domain-wide (8-12 queries) | Capability-specific (3-5 queries) | Query-specific (3-5 queries) |
| Output | Landscape map + maturity scores | Scored reuse assessment per capability | Search results + repo profiles |
| Project required | No (recommended) | Yes (requirements MANDATORY) | No |
| When to use | Early-stage situational awareness | Before building a capability | Exploratory or ad-hoc search |

**Workflow**: Use `/arckit.gov-landscape` to understand the domain, `/arckit.gov-code-search` for targeted queries, and `/arckit.gov-reuse` for project-specific reuse decisions.

---

## Resources

- [govreposcrape](https://github.com/chrisns/govreposcrape) - Semantic search over UK government repositories
- [govreposcrape API](https://govreposcrape-api-1060386346356.us-central1.run.app/openapi.json) - OpenAPI specification
