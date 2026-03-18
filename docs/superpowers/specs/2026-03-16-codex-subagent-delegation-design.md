# Codex Subagent Delegation Design

**Date:** 2026-03-16
**Status:** Draft
**Scope:** ArcKit Codex extension (`arckit-codex/`)

## Problem

ArcKit's Codex extension has 6 agent-backed commands where the SKILL.md contains the full inline prompt (~300 lines each), duplicating the agent `.toml` file. This differs from the Claude Code plugin, which uses thin wrapper commands that delegate to named agents via the Task tool.

Codex CLI now supports a [subagent architecture](https://developers.openai.com/codex/subagents/) with explicit agent spawning, scoped MCP servers, and configurable model/sandbox per agent. ArcKit should adopt this to eliminate duplication and match the Claude Code delegation pattern.

## Goals

1. Agent-backed skills become informative wrappers that spawn the named agent
2. Agent `.toml` files use the full subagent schema (`name`, `description`, `model`, `sandbox_mode`, `mcp_servers`, `developer_instructions`)
3. `converter.py` generates both formats from existing Claude agent `.md` source files
4. Non-agent skills (~57 commands) remain unchanged
5. No changes to Claude Code plugin, Gemini, OpenCode, or Copilot extensions

## Non-Goals

- Multi-level orchestration (coordinator agents spawning sub-agents)
- Changes to `config.toml` structure or `max_depth`
- Subagent support for other extensions (Gemini, OpenCode, Copilot lack the capability)

## Design

### 1. Agent TOML Schema

Each agent `.toml` in `arckit-codex/agents/` is upgraded from single-field to full subagent schema.

**Current format:**

```toml
# Auto-generated from arckit-claude/agents/arckit-research.md
developer_instructions = """
You are an enterprise architecture market research specialist...
"""
```

**New format:**

```toml
# Auto-generated from arckit-claude/agents/arckit-research.md
# Do not edit — edit the source and re-run scripts/converter.py

name = "arckit-research"
description = "Use this agent when the user needs technology and service market research for a project, including build vs buy analysis, vendor evaluation, TCO comparison, and UK Government Digital Marketplace search"
model = "o3"
sandbox_mode = "full-auto"

mcp_servers = []

developer_instructions = """
You are an enterprise architecture market research specialist...
"""
```

**Description extraction algorithm:** Take the first line of the Claude agent's `description` frontmatter field; strip any trailing "Examples:" suffix; truncate to 200 characters if needed; strip trailing whitespace. No prefix manipulation — use the first line as-is after cleanup.

**MCP server scoping per agent:**

| Agent | `mcp_servers` | Rationale |
|-------|---------------|-----------|
| `arckit-research` | `[]` | WebSearch/WebFetch only |
| `arckit-datascout` | `["datacommons-mcp"]` | Data Commons for statistical data |
| `arckit-aws-research` | `["aws-knowledge"]` | AWS Knowledge MCP |
| `arckit-azure-research` | `["microsoft-learn"]` | Microsoft Learn MCP |
| `arckit-gcp-research` | `["google-developer-knowledge"]` | Google Developer Knowledge MCP |
| `arckit-framework` | `[]` | Reads local files only |

### 2. Thin Wrapper SKILL.md

For the 6 agent-backed commands, SKILL.md becomes an informative wrapper (~40 lines) that delegates execution to the named agent.

**Structure:**

```markdown
---
name: arckit-{command}
description: "{command description}"
---

# {Command Title}

## Purpose
{What the command does and why}

## Prerequisites
{Required artifacts and prior commands}

## What This Command Produces
{Expected output and file locations}

## Execution
Spawn the `arckit-{command}` agent to handle this request:
> {Agent invocation prompt with $ARGUMENTS}

## Suggested Next Steps
{Rendered from handoffs: frontmatter}
```

**Worked example — `arckit-research`:**

Current SKILL.md is 334 lines (full inline prompt). New thin wrapper:

```markdown
---
name: arckit-research
description: "Research technology, services, and products to meet requirements with build vs buy analysis"
---

# Technology and Service Research

## Purpose

Conduct comprehensive market research to identify available technologies, services, and
products that satisfy the project's requirements. Covers SaaS vendors, open source,
managed cloud services, and UK Government platforms (GOV.UK, Digital Marketplace).

## Prerequisites

- Requirements document (`ARC-*-REQ-*.md`) must exist — run `$arckit-requirements` first
- Architecture principles (`ARC-000-PRIN-*.md`) should exist — run `$arckit-principles` first

## What This Command Produces

- Categorised technology/vendor comparison with real pricing
- Build vs buy recommendation per category
- 3-year TCO analysis
- UK Government framework availability (G-Cloud, DOS)
- Comprehensive research document saved to `projects/{project}/`

## Execution

Spawn the `arckit-research` agent to handle this request:

> Research technology and service options for the project in projects/{project-dir}/.
> User's additional context: $ARGUMENTS
> Follow your full process: read requirements, identify categories, conduct web research,
> build vs buy analysis, TCO comparison, write document, return summary.

If the user included `--no-spawn` in their arguments, append:
"Skip Step 11b (do not spawn vendor profiles or tech notes)."

## Suggested Next Steps

- `$arckit-wardley` — Create Wardley Map from research evolution positioning
- `$arckit-sobc` — Feed TCO data into Economic Case
- `$arckit-sow` — Create RFP from vendor requirements
- `$arckit-hld-review` — Validate technology choices against HLD
```

**Key properties:**

- **Description sources differ by file:** The SKILL.md frontmatter `description` comes from the **command** frontmatter (`arckit-claude/commands/*.md`), which is a short one-liner. The agent `.toml` `description` comes from the **agent** frontmatter (`arckit-claude/agents/*.md`), which is a longer trigger description. These are deliberately different.
- Purpose/Prerequisites/Output give Codex context about when and why to use the command
- Execution section explicitly instructs Codex to spawn the named agent
- `$ARGUMENTS` is included in the spawn instruction so Codex passes the user's input to the agent. Codex substitutes `$ARGUMENTS` in skill content before execution.
- Suggested Next Steps rendered from the source command's `handoffs:` YAML
- `agents/openai.yaml` unchanged (`allow_implicit_invocation: false`)
- Non-agent skills (~57 commands) keep their full inline prompts

### 3. CODEX_AGENT_CONFIG in converter.py

A new dictionary maps each agent to its Codex-specific subagent fields. The `name` and `description` fields are NOT in this dict — they come from the Claude agent `.md` frontmatter.

```python
CODEX_AGENT_CONFIG = {
    "arckit-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": [],
    },
    "arckit-datascout": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["datacommons-mcp"],
    },
    "arckit-aws-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["aws-knowledge"],
    },
    "arckit-azure-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["microsoft-learn"],
    },
    "arckit-gcp-research": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": ["google-developer-knowledge"],
    },
    "arckit-framework": {
        "model": "o3",
        "sandbox_mode": "full-auto",
        "mcp_servers": [],
    },
}
```

**Design decisions:**

- `name`/`description` sourced from Claude agent frontmatter (single source of truth)
- `model` defaults to `"o3"` — OpenAI's reasoning model, chosen because these agents perform multi-step research requiring planning and synthesis. Can be overridden per-agent (e.g., `"o4-mini"` for lighter tasks like framework synthesis).
- `sandbox_mode` is `"full-auto"` — agents need to write files without prompting
- Adding a new agent: create Claude `.md`, add one entry here, run converter
- Agents not in this dict fall back to old format (`developer_instructions` only) — backward compatible

### 4. converter.py Function Changes

**`generate_agent_toml_files()`** — updated to emit full subagent schema:

- Currently uses `extract_agent_prompt()` (line 490) which returns only the prompt body. Updated to use `extract_frontmatter_and_prompt()` (line 31) instead, which returns both the frontmatter dict (with `name`, `description`) and the prompt body.
- Adds a `description_oneline()` helper to extract a clean one-line description from the agent's multi-line description field (algorithm: first line, strip trailing "Examples:", truncate to 200 chars)
- Merges Codex-specific fields from `CODEX_AGENT_CONFIG`
- Writes `name`, `description`, `model`, `sandbox_mode`, `mcp_servers`, then `developer_instructions`
- The `mcp_servers` values MUST match keys in `config.toml` — the converter should warn if a server referenced in `CODEX_AGENT_CONFIG` is not present in `.mcp.json`

**`convert()` function — skill-format branch** (lines 348-363) — updated with agent-detection:

The existing `if config["format"] == "skill":` branch inside `convert()` currently generates full inline skills for all commands. Updated to check `agent_map`: if the command has a matching agent, call `generate_thin_wrapper()` instead of the inline generation path.

Note: There is no standalone `generate_codex_skills()` function — the logic lives inside the `convert()` function's skill-format branch.

**New: `generate_thin_wrapper()`** — builds the informative wrapper:

- Reads **command** frontmatter for `description` (one-liner) and `handoffs` (next steps)
- Reads **agent** frontmatter for the agent name
- Builds structured SKILL.md with Purpose, Prerequisites, Output, Execution (with `$ARGUMENTS` in spawn instruction), Suggested Next Steps
- Returns the wrapper string for the `convert()` function to write

**Unchanged functions:**

- `extract_frontmatter_and_prompt()` — already parses YAML frontmatter and returns dict + prompt body
- `generate_codex_config_toml()` — `config.toml` role registry stays as-is
- `rewrite_codex_skills()` — command reference rewriting still applies to wrapper content
- `build_agent_map()` — already identifies command-to-agent mappings
- All non-Codex generation functions (Gemini, OpenCode, Copilot)

### 5. config.toml

No structural changes. Settings remain:

```toml
[agents]
max_threads = 3
max_depth = 1
job_max_runtime_seconds = 600
```

`max_depth = 1` is correct: skills spawn agents (depth 0 → 1), agents don't nest further.

## Files Changed

| File | Change |
|------|--------|
| `scripts/converter.py` | Add `CODEX_AGENT_CONFIG`, add `description_oneline()` helper, update `generate_agent_toml_files()`, update `convert()` skill-format branch, add `generate_thin_wrapper()` |
| `arckit-codex/agents/arckit-research.toml` | Regenerated with full subagent schema |
| `arckit-codex/agents/arckit-datascout.toml` | Regenerated with full subagent schema |
| `arckit-codex/agents/arckit-aws-research.toml` | Regenerated with full subagent schema |
| `arckit-codex/agents/arckit-azure-research.toml` | Regenerated with full subagent schema |
| `arckit-codex/agents/arckit-gcp-research.toml` | Regenerated with full subagent schema |
| `arckit-codex/agents/arckit-framework.toml` | Regenerated with full subagent schema |
| `arckit-codex/skills/arckit-research/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/skills/arckit-datascout/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/skills/arckit-aws-research/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/skills/arckit-azure-research/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/skills/arckit-gcp-research/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/skills/arckit-framework/SKILL.md` | Thin wrapper (was full inline) |
| `arckit-codex/config.toml` | No structural change (regenerated by converter, same format) |

## Testing

1. Run `python scripts/converter.py` — verify clean generation with no warnings
2. Inspect each `.toml` for correct `name`, `description`, `model`, `mcp_servers`, `developer_instructions`
3. Inspect each thin wrapper SKILL.md for correct structure, spawn instruction, and handoffs
4. Verify non-agent skills are unchanged (diff against previous output)
5. Run converter twice — verify idempotent output (no diff on second run)
6. Verify `rewrite_codex_skills()` correctly rewrites command references in thin wrappers (e.g., `$arckit-wardley` in Suggested Next Steps)
7. Open a test repo with the Codex extension and invoke `$arckit-research` to verify agent spawning
