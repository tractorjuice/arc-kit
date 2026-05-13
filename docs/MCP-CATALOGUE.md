# ArcKit MCP Catalogue

Reference for every Model Context Protocol (MCP) tool exposed by ArcKit, the server that provides it, and the commands or agents that invoke it. Useful when:

- Deciding what to enable in `alwaysLoad` (eager vs deferred load)
- Spotting dead tools (referenced in docs but never called from any command)
- Auditing the prompt-injection surface area (every MCP response is untrusted input)
- Working out which API keys a given workflow needs

**Source of truth**: tool usage in `arckit-claude/commands/` and `arckit-claude/agents/`. Run `python3 scripts/check_references.py` to verify references; run `grep -rhoE "mcp__[a-z_-]+__[a-z_]+" arckit-claude/commands arckit-claude/agents` to regenerate the consumer list below.

## Servers at a glance

| Server | Endpoint | Type | Auth | `alwaysLoad` | Tools |
|---|---|---|---|---|---|
| `aws-knowledge` | `https://knowledge-mcp.global.api.aws` | http | none | **yes** | 6 |
| `microsoft-learn` | `https://learn.microsoft.com/api/mcp` | http | none | **yes** | 3 |
| `google-developer-knowledge` | `https://developerknowledge.googleapis.com/mcp` | http | `GOOGLE_API_KEY` (user_config) | no | 3 |
| `datacommons-mcp` | `https://api.datacommons.org/mcp` | http | `DATA_COMMONS_API_KEY` (user_config) | no | 2 |
| `govreposcrape` | `https://govreposcrape-api-1060386346356.us-central1.run.app/mcp` | http | none | no | 1 |

Total: **5 servers, 15 tools**.

`alwaysLoad: true` is set on `aws-knowledge` and `microsoft-learn` because the AWS and Azure research commands always reach for them; the others stay deferred to keep cold-start tool budgets lean. See `arckit-claude/.mcp.json`.

---

## aws-knowledge

AWS official Knowledge MCP server (no API key required). Backs all UK and global AWS architecture research.

| Tool | Purpose |
|---|---|
| `mcp__aws-knowledge__aws___search_documentation` | Free-text search across `docs.aws.amazon.com`, returning ranked chunks |
| `mcp__aws-knowledge__aws___read_documentation` | Fetch a specific AWS doc URL as markdown for deep reads |
| `mcp__aws-knowledge__aws___recommend` | Service-recommendation queries by capability or workload |
| `mcp__aws-knowledge__aws___list_regions` | Enumerate AWS regions |
| `mcp__aws-knowledge__aws___get_regional_availability` | Per-service regional availability (used for `eu-west-2` / `eu-west-1` / sovereign region gating) |
| `mcp__aws-knowledge__aws___retrieve_skill` | Pull structured AWS Skill Hub content |

**Consumers** (1): `arckit-aws-research`.

Triggered by `/arckit:aws-research`. Workflow: search → read → recommend → list/availability for UK region gating → retrieve_skill for Well-Architected pillar mapping.

---

## microsoft-learn

Microsoft Learn MCP server (no API key required). Backs Azure architecture research and Microsoft-platform code-sample retrieval.

| Tool | Purpose |
|---|---|
| `mcp__microsoft-learn__microsoft_docs_search` | Search official Microsoft and Azure documentation. Up to 10 chunks (500 tokens each) |
| `mcp__microsoft-learn__microsoft_docs_fetch` | Fetch a full Microsoft Learn page as markdown when search snippets are insufficient |
| `mcp__microsoft-learn__microsoft_code_sample_search` | Search official Microsoft Learn code samples; optional `language` filter |

**Consumers** (1): `arckit-azure-research`.

Triggered by `/arckit:azure-research`. Workflow per server docs: search → code-sample search (when implementation examples are needed) → fetch (when search snippets are incomplete).

---

## google-developer-knowledge

Google Developer Knowledge MCP. Backs Google Cloud architecture research. Requires the `GOOGLE_API_KEY` plugin user-config field (set via `/config` plugin settings; stored sensitive).

| Tool | Purpose |
|---|---|
| `mcp__google-developer-knowledge__search_documents` | Search Google Cloud and developer documentation |
| `mcp__google-developer-knowledge__get_document` | Fetch a single document by ID for detail |
| `mcp__google-developer-knowledge__batch_get_documents` | Fetch multiple documents in one call (used to compare services or hydrate a shortlist) |

**Consumers** (1): `arckit-gcp-research`.

Triggered by `/arckit:gcp-research`. Workflow: search → batch_get → get (for any document needing fuller content).

---

## datacommons-mcp

Google Data Commons MCP server. Backs statistical and demographic data discovery for projects that need real-world indicators (e.g. population, economic, health, environment). Requires the `DATA_COMMONS_API_KEY` plugin user-config field (stored sensitive).

| Tool | Purpose |
|---|---|
| `mcp__datacommons-mcp__search_indicators` | Search the Data Commons knowledge graph for statistical indicators by name or topic |
| `mcp__datacommons-mcp__get_observations` | Fetch observation values (numeric data points) for a given indicator and entity |

**Consumers** (1): `arckit-datascout-reader`.

Triggered indirectly via `/arckit:datascout` (which dispatches the reader subagent). The reader returns schema-validated handoffs to the orchestrator and writer; raw observations never reach the writer's context unfiltered.

---

## govreposcrape

ArcKit-hosted MCP server fronting a semantic search index over 24,500+ UK government open-source repositories on GitHub.

| Tool | Purpose |
|---|---|
| `mcp__govreposcrape__search_uk_gov_code` | Natural-language semantic search across UK government repos. Returns repo URL, language, owner, snippet |

**Consumers** (6):

- `arckit-gov-code-search` — general-purpose UK government code search
- `arckit-gov-reuse` (orchestrator) — declares the tool in its toolchain for context; does not call it directly
- `arckit-gov-reuse-reader` — actually invokes the tool, returns schema-validated handoffs
- `arckit-gov-landscape` — domain landscape mapping (who built what)
- `arckit-datascout-reader` — checks for UK gov data implementations alongside other data sources
- `commands/gov-reuse.md` — declares the tool in its guardrails ("only the reader subagent calls this; orchestrator never sees raw output")

Triggered by `/arckit:gov-reuse`, `/arckit:gov-code-search`, `/arckit:gov-landscape`, and indirectly by `/arckit:datascout`.

---

## Tool → command cross-reference

Reverse lookup, by tool, for the linter to grep against.

| Tool | Consumed by |
|---|---|
| `mcp__aws-knowledge__aws___get_regional_availability` | `arckit-aws-research` |
| `mcp__aws-knowledge__aws___list_regions` | `arckit-aws-research` |
| `mcp__aws-knowledge__aws___read_documentation` | `arckit-aws-research` |
| `mcp__aws-knowledge__aws___recommend` | `arckit-aws-research` |
| `mcp__aws-knowledge__aws___retrieve_skill` | `arckit-aws-research` |
| `mcp__aws-knowledge__aws___search_documentation` | `arckit-aws-research` |
| `mcp__datacommons-mcp__get_observations` | `arckit-datascout-reader` |
| `mcp__datacommons-mcp__search_indicators` | `arckit-datascout-reader` |
| `mcp__google-developer-knowledge__batch_get_documents` | `arckit-gcp-research` |
| `mcp__google-developer-knowledge__get_document` | `arckit-gcp-research` |
| `mcp__google-developer-knowledge__search_documents` | `arckit-gcp-research` |
| `mcp__govreposcrape__search_uk_gov_code` | `arckit-datascout-reader`, `arckit-gov-code-search`, `arckit-gov-landscape`, `arckit-gov-reuse`, `arckit-gov-reuse-reader`, `gov-reuse` |
| `mcp__microsoft-learn__microsoft_code_sample_search` | `arckit-azure-research` |
| `mcp__microsoft-learn__microsoft_docs_fetch` | `arckit-azure-research` |
| `mcp__microsoft-learn__microsoft_docs_search` | `arckit-azure-research` |

---

## Security posture

Every MCP response is **untrusted input** under the reader/orchestrator/writer pattern (#442 item 1):

- For commands with the three-tier split (`/arckit:datascout`, `/arckit:gov-reuse`), only the reader subagent calls MCP tools. The reader returns schema-validated, length-capped JSON via `validate-handoff.mjs`. The orchestrator and writer never see raw MCP output.
- For single-tier research agents (`arckit-aws-research`, `arckit-azure-research`, `arckit-gcp-research`, `arckit-gov-code-search`, `arckit-gov-landscape`), the agent's `## Guardrails` section names MCP responses as untrusted bytes and requires citation traceability for any figure pulled from them. Extending the reader/writer split to these agents is the next slice of #442 item 1.
- Tool allowlist (#442 item 18, shipped in #445): every research agent now declares MCP tools explicitly in its `tools:` frontmatter. No agent inherits MCP tools by default.

## User-config keys

Two MCP servers need keys. They are declared in `arckit-claude/.claude-plugin/plugin.json` under `userConfig` with `sensitive: true`:

- `GOOGLE_API_KEY` for `google-developer-knowledge`
- `DATA_COMMONS_API_KEY` for `datacommons-mcp`

Set via Claude Code's plugin settings UI (`/config` → plugins → `arckit`). Sensitive values are stored in keychain and never substituted into prompt content. The converter rewrites `${user_config.KEY}` to `${KEY}` for non-Claude extensions, which fall back to shell environment variables.
