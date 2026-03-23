# Government Code Search Guide

> **Guide Origin**: Official | **ArcKit Version**: 4.4.0

`/arckit.gov-code-search` provides general-purpose natural language search across 24,500+ UK government open-source repositories, returning matching repositories, patterns, and implementation approaches without requiring an active project.

> **Agent Architecture**: This command runs as an autonomous agent via the Task tool. The agent performs multiple govreposcrape searches, uses WebFetch to inspect top results on GitHub, and synthesises findings into a structured report, keeping the main conversation clean. The slash command is a thin wrapper that delegates to the agent.

---

## Prerequisites

### govreposcrape MCP Server (AUTO-INSTALLED)

This command uses the govreposcrape MCP server which is **automatically included** with the ArcKit plugin. No manual setup required.

**Endpoint**: `https://govreposcrape-api-1060386346356.us-central1.run.app/mcp`

### Project Prerequisites

Project context is **OPTIONAL** for this command. It can be run without any existing ArcKit project to perform exploratory research.

- Requirements document (`ARC-*-REQ-*.md`) - Optional (used when available to focus results)
- Architecture principles (`ARC-000-PRIN-*.md`) - Optional

---

## Scenario Matrix

| Scenario | Prompt seed | Focus |
|---------|-------------|-------|
| Implementation discovery | "How did gov teams implement `<X>`?" | Real-world implementations and approaches |
| Technology survey | "Who uses `<Y>` technology in UK government?" | Adoption across departments |
| Pattern research | "Show me government examples of `<pattern>`" | Design and architectural patterns |
| Standards discovery | "Find government implementations of `<standard>`" | Standard adoption and compliance examples |
| Framework comparison | "Compare government use of `<framework A>` vs `<framework B>`" | Framework adoption and trade-offs |

Add domain qualifiers (NHS, HMRC, MoD, GDS) in the prompt to narrow results to specific departments or sectors.

---

## Command

```bash
/arckit.gov-code-search <query>
```

Outputs: `projects/<id>/research/ARC-<id>-GOVS-v1.0.md` (if a project exists), or to a timestamped file in the current directory.

> **Auto-versioning**: Re-running this command when a document already exists automatically increments the version.

---

## Search Tips

Govreposcrape uses semantic search, so query quality directly affects result quality:

| Tip | Example |
|-----|---------|
| Be descriptive and domain-specific | "NHS FHIR API patient data integration" (not "API") |
| Include the technology and context | "Django REST framework benefit payment service" |
| Name the department or sector | "HMRC self-assessment tax calculation" |
| Use full names, not acronyms alone | "Government Digital Service design system components" |
| Describe the problem, not just the solution | "real-time vehicle location tracking public transport" |

Avoid vague single-word queries such as "authentication" or "database" — these return too many unrelated results.

---

## How It Works

The agent issues multiple query variations against the govreposcrape semantic search API:

| Step | Action |
|------|--------|
| 1 | Generate 3-5 semantically varied queries from the user's input |
| 2 | Run each query against govreposcrape, collecting top results |
| 3 | De-duplicate and rank repositories by relevance score |
| 4 | Fetch GitHub repo details via WebFetch for the top candidates |
| 5 | Summarise patterns, languages, and licensing across results |

---

## Output Highlights

- **Search results** ranked by semantic relevance with repository profiles
- **Repository profiles** including language, license, last commit, and activity level
- **Implementation patterns** observed across matching repositories
- **Departmental adoption** showing which government organisations have tackled similar problems
- **Key findings** and recommended repositories to inspect further

---

## Follow-on Actions

- Run `/arckit.gov-reuse` to perform a full scored reuse assessment for a specific project
- Run `/arckit.research` to broaden the search to commercial and open-source options
- Run `/arckit.adr` to document technology or pattern decisions informed by findings

---

## Comparison with /arckit.gov-reuse and /arckit.gov-landscape

| Feature | `/arckit.gov-code-search` | `/arckit.gov-reuse` | `/arckit.gov-landscape` |
|---------|--------------------------|--------------------|-----------------------|
| Purpose | Search and discover | Assess and score for reuse | Map an entire domain |
| Project required | No | Yes (requirements MANDATORY) | No (recommended) |
| Output | Search results + repo profiles | Scored reuse assessment | Domain landscape map |
| Scoring | None (relevance only) | 5-criteria scored assessment | Maturity scoring per org |
| When to use | Exploratory research | Before building a capability | Understanding a whole domain |

**Workflow**: Use `/arckit.gov-code-search` for quick discovery, `/arckit.gov-reuse` for project-specific reuse decisions, and `/arckit.gov-landscape` for domain-level situational awareness.

---

## Resources

- [govreposcrape](https://github.com/chrisns/govreposcrape) - Semantic search over UK government repositories
- [govreposcrape API](https://govreposcrape-api-1060386346356.us-central1.run.app/openapi.json) - OpenAPI specification
