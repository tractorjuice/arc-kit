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
| `research` | Market research: options, checked facts, published costs | govreposcrape |
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

1. **Loads the full agent prompt** from `plugins/arckit-claude/agents/arckit-{name}.md` with only `${CLAUDE_PLUGIN_ROOT}` path rewrites
2. **Registers all 5 MCP servers** (AWS Knowledge, Microsoft Learn, Google Dev Knowledge, DataCommons, govreposcrape)
3. **Mounts GitHub repos** via session resources (ArcKit for templates, project repo for artifacts)
4. **Streams events** via SSE as the agent works

## Known Limitations

- **Custom header auth**: Google Developer Knowledge (`X-Goog-Api-Key`) and DataCommons (`X-API-Key`) use custom headers that don't map to the managed agents `static_bearer` vault type. These servers connect but auth fails; agents fall back to STANDALONE mode (web search).
- **No hooks**: Managed agents don't support the hook system. Filename validation, output scoring, and session learning don't run.
- **No plugin context**: No `${CLAUDE_PLUGIN_ROOT}` expansion at runtime (rewritten to mount path at agent creation).
- **Cost**: API token billing per session, not Claude Code subscription.

## Harness dreaming (`dream.py`)

`dream.py` reads finished ArcKit runs and distils the mistakes the model keeps making into a [Managed Agents memory store](https://platform.claude.com/docs/en/managed-agents/overview): one page per **harness weakness**, naming the command, skill, template, reference or hook it belongs to, with evidence quoted from the runs and a proposed gotcha. You export the store, read it, and turn the strongest entries into pull requests that add to a skill's **Gotchas** section or tighten a command. Nothing it writes is loaded into anyone's session: it is a maintainer tool, the "skills are grown, not built" loop with the reading done for you.

It follows the Claude cookbook [Dreaming with a dynamic workflow](https://platform.claude.com/cookbook/managed-agents-cma-dreaming-with-a-dynamic-workflow):

```text
transcripts ──> lead agent (read, glob only) ──writes──> workflow
                                                    ├─ transcript-analyzer × N  (≤ 20 in parallel)
                                                    └─ memory-organizer × 1
                                                            │
                         memory store (pages + _index.md) <─┘ ──export──> .dream/stores/<id>/
```

The sandbox has no network, the lead has no write tools and cannot define its own agents, workers have file tools only, and the session has a hard spend limit. The prompts are in [`dream-prompts/`](dream-prompts/).

### Sources

| Source | Where it comes from | Why it is useful |
|---|---|---|
| Eval recordings | `plugins/arckit-claude/evals/results/<timestamp>/` from `scripts/eval-headless.py` | Each recording starts with its grader results, so a failed grader is the first thing an analyzer sees |
| Claude Code transcripts | `~/.claude/projects/<project>/*.jsonl`, for example from the `arckit-test-project-v*` repos | Hook blocks, corrections and retries in real use. Subagent transcripts are skipped; the parent carries the dispatch and reply |
| Self-harness traces | `.arckit/autoresearch-traces/` | Iteration traces from the autoresearch loop |
| Plain text | `.md`, `.txt`, `.log` | Anything else you want considered |

### Usage

```bash
# 1. Dry run (the default): collect, render, redact and stage. No API calls.
python dream.py ../../plugins/arckit-claude/evals/results

# 2. Read what would be sent: .dream/runs/<timestamp>/staged/ and manifest.json

# 3. Dream into a new store (prints the store ID), then export it to .dream/stores/<id>/
python dream.py ../../plugins/arckit-claude/evals/results --run --budget-usd 10

# 4. Later runs add to the same store; transcripts it has already seen are skipped
python dream.py ~/.claude/projects/-home-me-arckit-test-project-v20 --store-id memstore_... --run

# Export a store again without dreaming
python dream.py --store-id memstore_... --export-only
```

For a nightly run, put step 4 in cron with a fixed `--store-id`. The ledger in `.dream/ledger.json` remembers which transcripts each store has dreamed over (by content hash), so a nightly run only uploads what is new. `--all` overrides it.

### What leaves the machine, and what stops it

Without `--run`, nothing does. With it, the staged transcripts and a snapshot of the plugin's surfaces (command list, skill descriptions and their existing Gotchas sections) are uploaded to the Files API for at most 24 hours and deleted when the run ends. Agents and the environment are archived and the session is deleted (`--keep-session` keeps it for debugging). The memory store is kept.

- **Secrets** that match common key formats (Anthropic, OpenAI, GitHub, AWS, Google, Slack, bearer tokens, JWTs, private keys) are replaced with `[REDACTED:<kind>]` before staging; the counts are in `manifest.json`. This is a pattern match, not a guarantee: read the staged files.
- **Classified runs** are left out. A transcript that carries a filled-in `Classification` of `OFFICIAL-SENSITIVE`, `SECRET` or `TOP SECRET` (in a Document Control row or a `Classification:` line, not the template's placeholder) is not staged unless you pass `--allow-classified`.
- **Data retention.** Managed Agents sessions are not eligible for zero data retention or HIPAA, and sessions keep what their agents read until deleted. Dream over eval recordings and public test repositories. Do not dream over a real programme's transcripts unless the organisation that owns them has agreed to send them to the Anthropic API.
- **Prompt injection.** Transcripts are untrusted. The lead never reads them, each analyzer's brief names only a file path, all three prompts treat transcript text as data, and the store is a proposal list a person reads, not context any session loads.

### Cost

Defaults are Sonnet 5.5 for the lead and Haiku 5.5 for the workers (`--lead-model`, `--worker-model`). The dry run prints a rough estimate from the cookbook's own runs (about $0.36 for 283 KB of transcripts, about $8 for 12 MB). `--budget-usd` (default 20) is a hard limit at list price: the session stops issuing model requests once it is reached. The run record in `.dream/runs/<timestamp>/run.json` carries the session's actual list cost.

### Limits

At most 499 transcripts per run (500 files per session, one for the surfaces snapshot); larger sets take several runs into the same store. Each rendered transcript is capped at 400 KB, keeping its start and end. Dreams and memory stores are beta, so request shapes may change; the request builders are pure functions covered by `tests/plugin/test_managed_agents_dream.py`, which also drives a whole run against a fake client.

## Status

Experimental prototype (Phase 1 of [#282](https://github.com/tractorjuice/arc-kit/issues/282)). `dream.py` is the first piece of Phase 2: until Managed Agents runs have hooks, session learning happens by dreaming over them afterwards.
