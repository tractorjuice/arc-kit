# ArcKit Managed Agents

Prototype scripts for deploying ArcKit agents as [Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/overview) via the Anthropic API.

Managed Agents run in cloud containers with built-in tools (bash, file ops, web search/fetch) and support long-running, asynchronous execution. This enables headless governance workflows, CI/CD integration, and custom UIs.

Tracking issue: [#282](https://github.com/tractorjuice/arc-kit/issues/282)

## Prerequisites

```bash
pip install anthropic
export ANTHROPIC_API_KEY="your-api-key"
```

## Scripts

### `research-agent.py`

Deploys the `arckit-research` agent for market research, vendor evaluation, build vs buy analysis, and TCO comparison.

```bash
# With a project repo (agent reads requirements, writes research doc)
python research-agent.py \
    --repo "https://github.com/tractorjuice/arckit-test-project-v1" \
    --github-token "$GITHUB_TOKEN" \
    --prompt "Research technology options for the M365 migration project"

# Without a repo (web research only)
python research-agent.py \
    --prompt "Research authentication solutions for a UK Government project"

# Resume an existing session
python research-agent.py \
    --session-id "sess_abc123" \
    --prompt "Also research payment processing options"

# Reuse agent and environment from a previous run
python research-agent.py \
    --agent-id "agent_abc123" \
    --environment-id "env_abc123" \
    --prompt "Research options for a new project"
```

## Architecture

```text
              API call
You / CI ──────────────> Anthropic Cloud
                              │
                    ┌─────────┴──────────┐
                    │  Managed Agent      │
                    │  (arckit-research)  │
                    │                     │
                    │  Tools:             │
                    │  - web_search       │
                    │  - web_fetch        │
                    │  - read/write/edit  │
                    │  - bash/glob/grep   │
                    │                     │
                    │  Mounted repos:     │
                    │  - /workspace/arc-kit (templates)
                    │  - /workspace/project (artifacts)
                    └─────────────────────┘
                              │
                    SSE stream (events)
                              │
                              v
                    Your terminal / app
```

## Differences from Plugin Agents

| Feature | Plugin (Claude Code) | Managed Agent (API) |
|---|---|---|
| Execution | Local, interactive | Cloud, async |
| MCP servers | Local stdio (npx) | Remote HTTP only |
| Hooks | 18 hooks supported | Not supported |
| Templates | `${CLAUDE_PLUGIN_ROOT}/` | Mounted via GitHub repo |
| Skills | Plugin auto-discovery | Custom skill upload |
| Auth | Claude Code session | API key + vaults |
| Cost | Subscription | Per-token API billing |

## Status

This is an experimental prototype (Phase 1 of [#282](https://github.com/tractorjuice/arc-kit/issues/282)). The research agent runs without MCP servers, using web search for all data gathering.
