# govreposcrape Integration Design

**Date**: 2026-03-23
**Status**: APPROVED
**Author**: AI-assisted design

## Summary

Integrate [govreposcrape](https://github.com/chrisns/govreposcrape) — a semantic search system over 24,500+ UK government open-source repositories — into ArcKit. This adds a "government reuse" dimension to ArcKit's architecture governance, letting users discover existing government code before building from scratch.

## Approach

**Approach 1 (selected): Standalone agents + step injection**

- Add govreposcrape as a 5th MCP server
- Create 3 new commands with dedicated agents
- Enrich 5 existing research agents with govreposcrape steps

## Components

### 1. MCP Server Addition

Add `govreposcrape` to `arckit-claude/.mcp.json`:

```json
"govreposcrape": {
  "type": "http",
  "url": "https://govreposcrape-api-1060386346356.us-central1.run.app/mcp"
}
```

No API key required. Public endpoint. Tool: `search` — accepts `query` (string, 3-500 chars), `limit` (1-100, default 20), `resultMode` (`minimal`/`snippets`/`full`).

### 2. New Command: `/arckit.gov-reuse`

**Purpose**: "Before we build X, who in government already built it?"

**Files**:
- Command: `arckit-claude/commands/gov-reuse.md`
- Agent: `arckit-claude/agents/arckit-gov-reuse.md`
- Template: `arckit-claude/templates/gov-reuse-template.md` + `.arckit/templates/gov-reuse-template.md`
- Guide: `docs/guides/gov-reuse.md` + `arckit-claude/guides/gov-reuse.md`

**Document type**: `GOVR` (Government Reuse Assessment)
**Document ID pattern**: `ARC-{ID}-GOVR-v{VERSION}.md`
**Output location**: `projects/{project-dir}/research/`

**Command frontmatter**:
- `description`: Discover reusable UK government code before building from scratch
- `argument-hint`: "<capability or domain, e.g. 'case management', 'appointment booking NHS'>"
- `tags`: [gov, reuse, open-source, uk-gov, code-discovery, government-code]
- `effort`: max
- `handoffs`: (as listed below)

**Agent frontmatter**:
- `name: arckit-gov-reuse`
- `description`: Multi-line with `<example>` tags showing triggering conditions (e.g., user wants to check if government has existing code before building, user asks "has anyone in government built X?")
- `model: sonnet`
- `maxTurns: 40`
- `disallowedTools: ["Edit"]`
- `effort: max`

**Agent process**:
1. Read project requirements (mandatory) and principles
2. Extract key capabilities/features from requirements
3. Search govreposcrape for each capability (multiple queries per capability — e.g., "case management system", "appointment booking NHS", "form builder GOV.UK Design System")
4. For each hit: use WebFetch on GitHub repo pages to assess reusability (license, activity/last commit, code quality, documentation, tech stack compatibility, star count)
5. Produce a Reuse Assessment Document with:
   - Reuse candidates per capability, scored
   - License compatibility matrix
   - Tech stack alignment analysis
   - Recommended reuse strategy (fork, library, reference, none) per candidate
   - Estimated effort saved vs building from scratch
   - Gap analysis — capabilities with no reusable code found
6. Check quality checklist, write document, return summary

**Handoffs**:
- `research` — feed reuse findings into build vs buy
- `adr` — record reuse decisions
- `requirements` — refine requirements based on discovered capabilities

### 3. New Command: `/arckit.gov-code-search`

**Purpose**: General-purpose natural language search across government repos.

**Files**:
- Command: `arckit-claude/commands/gov-code-search.md`
- Agent: `arckit-claude/agents/arckit-gov-code-search.md`
- Template: `arckit-claude/templates/gov-code-search-template.md` + `.arckit/templates/gov-code-search-template.md`
- Guide: `docs/guides/gov-code-search.md` + `arckit-claude/guides/gov-code-search.md`

**Document type**: `GCSR` (Government Code Search Report)
**Document ID pattern**: `ARC-{ID}-GCSR-v{VERSION}.md`
**Output location**: `projects/{project-dir}/research/`

**Command frontmatter**:
- `description`: Search 24,500+ UK government repositories using natural language queries
- `argument-hint`: "<query, e.g. 'FHIR patient data integration', 'GOV.UK Design System form components'>"
- `tags`: [gov, code-search, uk-gov, government-code, semantic-search, repositories]
- `effort`: high

**Agent frontmatter**:
- `name: arckit-gov-code-search`
- `description`: Multi-line with `<example>` tags showing triggering conditions (e.g., user wants to search government code, user asks "how did gov teams implement X?")
- `model: sonnet`
- `maxTurns: 40`
- `disallowedTools: ["Edit"]`
- `effort: high`

**Agent process**:
1. Take user's query directly (project context optional but read if available)
2. Search govreposcrape with the query and variations (broaden/narrow automatically)
3. For each result: extract repo name, org, description, relevance
4. Produce a Government Code Search Report with:
   - Search results grouped by relevance
   - Repository profiles (org, language, last activity, stars, license)
   - Code patterns identified across results
   - Implementation approaches compared
5. Check quality checklist, write document, return summary

**Handoffs**:
- `gov-reuse` — deep reuse assessment of interesting finds
- `research` — broader market research
- `adr` — record pattern decisions

### 4. New Command: `/arckit.gov-landscape`

**Purpose**: Map what government has built in a domain — patterns, standards, common dependencies, maturity.

**Files**:
- Command: `arckit-claude/commands/gov-landscape.md`
- Agent: `arckit-claude/agents/arckit-gov-landscape.md`
- Template: `arckit-claude/templates/gov-landscape-template.md` + `.arckit/templates/gov-landscape-template.md`
- Guide: `docs/guides/gov-landscape.md` + `arckit-claude/guides/gov-landscape.md`

**Document type**: `GLND` (Government Landscape Analysis)
**Document ID pattern**: `ARC-{ID}-GLND-v{VERSION}.md`
**Output location**: `projects/{project-dir}/research/`

**Command frontmatter**:
- `description`: Map the UK government code landscape for a domain — who built what, common patterns, standards, maturity
- `argument-hint`: "<domain, e.g. 'health data integration', 'citizen identity verification'>"
- `tags`: [gov, landscape, uk-gov, government-code, patterns, standards, discovery]
- `effort`: max

**Agent frontmatter**:
- `name: arckit-gov-landscape`
- `description`: Multi-line with `<example>` tags showing triggering conditions (e.g., user wants to understand what government has built in a domain, user asks "what's the government landscape for X?")
- `model: sonnet`
- `maxTurns: 50`
- `disallowedTools: ["Edit"]`
- `effort: max`

**Agent process**:
1. Read project requirements and principles for domain context
2. Search govreposcrape across multiple domain-related queries
3. For each result: use WebFetch on GitHub repo pages to gather detail (tech stack, activity, stars, contributors)
4. Synthesize into a landscape view: which departments built what, common tech stacks, shared dependencies, standards adopted
5. Produce a Government Landscape Analysis with:
   - Domain landscape map (which orgs, what they built)
   - Technology stack analysis (most common languages, frameworks, databases)
   - Standards and patterns adopted (GDS, FHIR, UPRN, etc.)
   - Maturity assessment (active vs abandoned, documentation quality)
   - Collaboration opportunities (teams working on similar problems)
   - Gaps and opportunities
5. Check quality checklist, write document, return summary

**Handoffs**:
- `gov-reuse` — assess specific repos for reuse
- `framework` — incorporate patterns into architecture framework
- `wardley` — map landscape evolution

### 5. Enrich `arckit-research` Agent

Add new **Step 5b: Government Code Reuse Check** (after Step 5 vendor research, before Step 6 Build vs Buy):

> For each research category identified in Step 4, search govreposcrape for existing UK government implementations:
> - Query: "[category] UK government implementation" and variations
> - For each relevant result: note repo, org, tech stack, activity level, license
> - Feed findings into Build vs Buy analysis as a 5th option: **Reuse Government Code** alongside Build Custom / Buy SaaS / Adopt Open Source / GOV.UK Platform
> - Include in the TCO comparison — reuse typically has lower license cost but integration/adaptation effort

This extends the existing build-vs-buy matrix with a "government reuse" column.

### 6. Enrich `arckit-datascout` Agent

Add new **Step 5e: Government Code for Data Integration** (after Step 5d Data Commons, before Step 6 Category-Specific Research):

> Search govreposcrape for existing government code that integrates with the data sources being researched:
> - Query: "[data source] API integration", "[department] data pipeline", "[API name] client library"
> - Discover existing API client libraries, data adapters, ETL pipelines that government teams have already built
> - Include in source evaluation cards: "Existing Government Integration Code" field with repo links
> - This reduces integration effort estimates for sources where reusable integration code exists

### 7. Enrich Cloud Research Agents

Add a new step to `arckit-aws-research`, `arckit-azure-research`, and `arckit-gcp-research` — after service research, before cost estimation:

> **Step N: Government Implementation Patterns**
> Search govreposcrape for existing UK government implementations using [AWS/Azure/GCP] services recommended above:
> - Query: "[service name] UK government", "[cloud] [service] [capability]"
> - Note: which departments use these services, architecture patterns observed, common configurations
> - Include as a "Government Precedent" section in the output
> - If no government precedent found for a recommended service, note it as a consideration (not a blocker)

This is a lightweight step — 3-5 govreposcrape queries per cloud agent.

## New Files Summary

| Type | File | Location |
|------|------|----------|
| MCP config | `.mcp.json` | `arckit-claude/.mcp.json` (edit existing) |
| Command | `gov-reuse.md` | `arckit-claude/commands/` |
| Command | `gov-code-search.md` | `arckit-claude/commands/` |
| Command | `gov-landscape.md` | `arckit-claude/commands/` |
| Agent | `arckit-gov-reuse.md` | `arckit-claude/agents/` |
| Agent | `arckit-gov-code-search.md` | `arckit-claude/agents/` |
| Agent | `arckit-gov-landscape.md` | `arckit-claude/agents/` |
| Template | `gov-reuse-template.md` | `arckit-claude/templates/` + `.arckit/templates/` |
| Template | `gov-code-search-template.md` | `arckit-claude/templates/` + `.arckit/templates/` |
| Template | `gov-landscape-template.md` | `arckit-claude/templates/` + `.arckit/templates/` |
| Guide | `gov-reuse.md` | `docs/guides/` + `arckit-claude/guides/` |
| Guide | `gov-code-search.md` | `docs/guides/` + `arckit-claude/guides/` |
| Guide | `gov-landscape.md` | `docs/guides/` + `arckit-claude/guides/` |

### Multi-Instance vs Single-Instance

All three new types are **single-instance** per project (like RSCH, DSCT). A project has one reuse assessment, one landscape analysis, and one code search report at a time, versioned with major/minor increments. They are NOT multi-instance (no sequence numbers like ADR-001). However, they must be registered in `MULTI_INSTANCE_TYPES` for consistency with the existing research types (RSCH, AWRS, AZRS, GCRS, DSCT are all in this set despite being single-instance — the set is used by hooks for subdirectory routing).

### WebSearch/WebFetch Usage

All three new agents use govreposcrape's `search` tool as their primary discovery mechanism. Additionally:
- **gov-reuse** and **gov-landscape** use WebFetch on GitHub repository pages to assess reusability/maturity (license, last commit, stars, contributors, documentation quality). govreposcrape returns search summaries, not deep repo analysis.
- **gov-code-search** may use WebFetch on specific repos if the user needs deeper detail, but primarily relies on govreposcrape results.

### MCP Propagation to Extensions

Adding govreposcrape to `arckit-claude/.mcp.json` means `converter.py` will automatically include it in the Codex extension's `config.toml`. This is **desired** — the endpoint is public, free, requires no API key, and benefits all distribution formats. If the service becomes unreliable, it can be removed from `.mcp.json` in a future update.

## Modified Files Summary

| File | Change |
|------|--------|
| `arckit-claude/.mcp.json` | Add govreposcrape server |
| `arckit-claude/config/doc-types.mjs` | Add GOVR, GCSR, GLND to `DOC_TYPES` (Research category, alongside AWRS/AZRS/GCRS), `MULTI_INSTANCE_TYPES`, and `SUBDIR_MAP` (→ `'research'`) |
| `arckit-claude/agents/arckit-research.md` | Add Step 5b: Government Code Reuse Check |
| `arckit-claude/agents/arckit-datascout.md` | Add Step 5e: Government Code for Data Integration |
| `arckit-claude/agents/arckit-aws-research.md` | Add Government Implementation Patterns step |
| `arckit-claude/agents/arckit-azure-research.md` | Add Government Implementation Patterns step |
| `arckit-claude/agents/arckit-gcp-research.md` | Add Government Implementation Patterns step |
| `arckit-claude/scripts/bash/generate-document-id.sh` | Register GOVR, GCSR, GLND in MULTI_INSTANCE_TYPES (plugin copy, source of truth) |
| `arckit-claude/scripts/python/generate-document-id.py` | Register GOVR, GCSR, GLND in MULTI_INSTANCE_TYPES |
| `scripts/bash/generate-document-id.sh` | Register GOVR, GCSR, GLND in MULTI_INSTANCE_TYPES (root copy) |
| `README.md` | Add 3 commands, update count (64 → 67), add MCP server |
| `CLAUDE.md` | Update "Current Agents" table (add 3 new agents), update "64 slash commands" → 67 |
| `docs/index.html` | Add 3 commands |
| `docs/DEPENDENCY-MATRIX.md` | Add 3 rows |
| `docs/WORKFLOW-DIAGRAMS.md` | Add gov commands to workflow paths |
| `CHANGELOG.md` | New feature entries |

## Post-Implementation Steps

1. Run `python scripts/converter.py` to generate Codex/OpenCode/Gemini/Copilot formats (auto-discovers new commands, propagates `generate-document-id.sh` to extension dirs)
2. Update MEMORY.md (command count 67, agent count 9, MCP server count 5)
3. Test plugin with a test repo
