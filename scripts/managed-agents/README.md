# ArcKit Managed Agents

Deploy any of the 10 ArcKit agents as [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) via the Anthropic API.

Managed Agents run in cloud containers with built-in tools (bash, file ops, web search/fetch) and MCP servers. This enables headless governance workflows, CI/CD integration, and custom UIs.

Tracking issue: [#282](https://github.com/tractorjuice/arc-kit/issues/282)

## Prerequisites

```bash
pip install anthropic
export ANTHROPIC_API_KEY="your-api-key"
```

## Usage

```bash
# List available agents
python arckit-agent.py --list

# Deploy with a project repo (recommended — agent reads requirements, writes artifacts)
python arckit-agent.py research \
    --repo "https://github.com/tractorjuice/arckit-test-project-v1" \
    --github-token "$GITHUB_TOKEN" \
    --prompt "Research technology options for the M365 migration project"

# Deploy without a repo (web research only, no artifact access)
python arckit-agent.py grants \
    --prompt "Research UK funding for a digital identity programme"

# Resume an existing session
python arckit-agent.py research \
    --session-id "sess_abc123" \
    --prompt "Also research payment processing options"

# Reuse agent and environment from a previous run
python arckit-agent.py research \
    --agent-id "agent_abc123" \
    --environment-id "env_abc123" \
    --prompt "Research options for a new project"
```

## Available Agents

| Agent | Description | MCP Servers Used |
|---|---|---|
| `research` | Market research, vendor eval, build vs buy, TCO | govreposcrape |
| `grants` | UK government grants and funding research | (none) |
| `datascout` | Data source discovery, API catalogue search | DataCommons (optional) |
| `framework` | Transform artifacts into structured framework | (none) |
| `aws-research` | AWS service research | AWS Knowledge |
| `azure-research` | Azure service research | Microsoft Learn |
| `gcp-research` | GCP service research | Google Developer Knowledge |
| `gov-reuse` | Government code reuse assessment | govreposcrape |
| `gov-code-search` | Government code semantic search | govreposcrape |
| `gov-landscape` | Government code landscape analysis | govreposcrape |

## Architecture

```text
              API call
You / CI ──────────────> Anthropic Cloud
                              │
                    ┌─────────┴──────────┐
                    │  Managed Agent      │
                    │  (any arckit-*)     │
                    │                     │
                    │  Built-in tools:    │
                    │  - web_search/fetch │
                    │  - read/write/edit  │
                    │  - bash/glob/grep   │
                    │                     │
                    │  MCP servers:       │
                    │  - AWS Knowledge    │
                    │  - Microsoft Learn  │
                    │  - govreposcrape    │
                    │                     │
                    │  Mounted repos:     │
                    │  - /workspace/arc-kit│
                    │  - /workspace/project│
                    └─────────────────────┘
                              │
                    SSE stream (events)
                              v
                    Your terminal / app
```

## How It Works

1. **Loads the full agent prompt** from `arckit-claude/agents/arckit-{name}.md` with only `${CLAUDE_PLUGIN_ROOT}` path rewrites
2. **Registers all 5 MCP servers** (AWS Knowledge, Microsoft Learn, Google Dev Knowledge, DataCommons, govreposcrape)
3. **Mounts GitHub repos** via session resources (ArcKit for templates, project repo for artifacts)
4. **Streams events** via SSE as the agent works

## Known Limitations

- **Custom header auth**: Google Developer Knowledge (`X-Goog-Api-Key`) and DataCommons (`X-API-Key`) use custom headers that don't map to the managed agents `static_bearer` vault type. These servers connect but auth fails; agents fall back to STANDALONE mode (web search).
- **No hooks**: Managed agents don't support the hook system. Filename validation, output scoring, and session learning don't run.
- **No plugin context**: No `${CLAUDE_PLUGIN_ROOT}` expansion at runtime (rewritten to mount path at agent creation).
- **Cost**: API token billing per session, not Claude Code subscription.

## Status

Experimental prototype (Phase 1 of [#282](https://github.com/tractorjuice/arc-kit/issues/282)).
