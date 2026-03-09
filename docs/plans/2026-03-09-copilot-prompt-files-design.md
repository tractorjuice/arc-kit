# Copilot Prompt Files Integration Design

**Date**: 2026-03-09
**Issue**: [#149](https://github.com/tractorjuice/arc-kit/issues/149) — VS Code + GitHub Copilot compatibility
**Status**: Approved

## Problem

University users restricted to VS Code + GitHub Copilot cannot use ArcKit because all current distribution formats require Claude Code, Codex CLI, OpenCode CLI, or Gemini CLI.

## Solution

Add a 6th distribution format targeting GitHub Copilot's customization layer:

- **Prompt files** (`.github/prompts/*.prompt.md`) — 60 invokable commands
- **Custom agents** (`.github/agents/*.agent.md`) — 6 research agents
- **Repository instructions** (`copilot-instructions.md`) — repo-wide ArcKit context

Distributed via `arckit init --ai copilot` and a standalone `arckit-copilot/` extension directory.

## Architecture

### Converter Changes

New `"copilot"` entry in `AGENT_CONFIG` dictionary in `scripts/converter.py`:

```python
"copilot": {
    "name": "Copilot",
    "output_dir": "arckit-copilot/prompts",
    "filename_pattern": "arckit-{name}.prompt.md",
    "format": "prompt",
    "path_prefix": ".arckit",
    "extension_dir": "arckit-copilot",
    "copy_commands_to_extension": True,
    "copy_agents_to_extension": True,
    "has_context_hook": False,
    "has_sync_guides_hook": False,
}
```

### New `"prompt"` Format

`format_output()` gains a `"prompt"` format that produces Copilot-compatible YAML frontmatter:

```yaml
---
description: 'Create comprehensive business and technical requirements'
agent: 'agent'
tools: ['readFile', 'editFiles', 'runCommand', 'codebase', 'search']
argument-hint: 'Project name or topic'
---

[converted prompt body]
```

### Agent Conversion

The 6 ArcKit agents convert to `.agent.md` files:

```yaml
---
name: arckit-research
description: 'Use this agent for market research, vendor evaluation, build vs buy analysis'
tools: ['fetch', 'readFile', 'editFiles', 'runCommand', 'codebase', 'search']
user-invocable: false
---

[full agent prompt with rewritten paths]
```

Agent-backed prompt files reference the agent via frontmatter:

```yaml
---
description: 'Research technology options, vendors, and market landscape'
agent: 'arckit-research'
argument-hint: 'Research topic'
---
```

### Tool Mapping

| Command Category | Copilot Tools |
|---|---|
| Document generators | `readFile`, `editFiles`, `runCommand`, `codebase`, `search` |
| Research commands | `fetch`, `readFile`, `editFiles`, `runCommand`, `codebase`, `search` |
| Diagram commands | `readFile`, `editFiles`, `runCommand`, `codebase` |
| Analysis commands | `readFile`, `codebase`, `search`, `problems` |
| Utility commands | `readFile`, `editFiles`, `runCommand` |

Heuristic: commands whose prompt body references `WebSearch`/`WebFetch` automatically get `fetch` added.

### Handoff Format

Copilot handoffs use the prompt filename as the command reference:

```markdown
## Suggested Next Steps

- /arckit-data-model -- Create data model from data requirements *(when DR-xxx data requirements were generated)*
```

### Argument Handling

`$ARGUMENTS` → `${input:topic:Enter project name or topic}`

Commands with specific argument expectations get tailored `argument-hint` values. An optional `argument-hint:` field in source Claude command frontmatter overrides the default.

### Repository Instructions

A generated `copilot-instructions.md` provides repo-wide context:

- ArcKit conventions (project structure, document IDs, requirement prefixes)
- Template locations and customization workflow
- Instructions to use Write tool for large documents
- Kept concise (Copilot processes this on every interaction)

### Init Scaffolding

`arckit init --ai copilot` produces:

```
project/
├── .github/
│   ├── copilot-instructions.md
│   ├── prompts/arckit-*.prompt.md    (60 files)
│   └── agents/arckit-*.agent.md      (6 files)
├── .arckit/
│   ├── templates/
│   ├── references/
│   └── scripts/bash/
├── docs/                              (unless --minimal)
└── projects/
```

### Extension Directory

```
arckit-copilot/
├── VERSION
├── prompts/          (generated)
├── agents/           (generated)
├── copilot-instructions.md  (generated)
├── templates/        (copied from plugin)
├── scripts/          (copied from plugin)
├── references/       (copied from plugin)
└── guides/           (copied from plugin)
```

## Files Modified

| File | Change |
|---|---|
| `scripts/converter.py` | Add `"copilot"` to `AGENT_CONFIG`, `"prompt"` format, `generate_copilot_agents()`, `generate_copilot_instructions()`, tool heuristic, pipeline steps |
| `src/arckit_cli/__init__.py` | Add `--ai copilot` case |
| `pyproject.toml` | Add `arckit-copilot/` to shared-data |
| `scripts/bump-version.sh` | Add `arckit-copilot/VERSION` (13th version file) |

## Files Created

| File | Purpose |
|---|---|
| `arckit-copilot/VERSION` | Version tracking |
| `arckit-copilot/prompts/*.prompt.md` | 60 generated prompt files |
| `arckit-copilot/agents/*.agent.md` | 6 generated agent files |
| `arckit-copilot/copilot-instructions.md` | Generated instructions |

## Excluded (YAGNI)

- No standalone repo (`tractorjuice/arckit-copilot`)
- No MCP server integration (Copilot MCP support too limited)
- No custom `model:` field (user picks their model)
- No Copilot Extension GitHub App (prompt files cover the use case)

## Multi-AI Command Format (Updated)

| AI | Format | Location |
|---|---|---|
| Claude Code | `/arckit.requirements` (plugin) | `arckit-claude/commands/requirements.md` |
| Codex CLI | `$arckit-requirements` (skill) | `arckit-codex/skills/arckit-requirements/SKILL.md` |
| Gemini CLI | `/arckit:requirements` (extension) | `arckit-gemini/commands/arckit/requirements.toml` |
| OpenCode CLI | `/arckit.requirements` | `arckit-opencode/commands/arckit.requirements.md` |
| **Copilot** | `/arckit-requirements` (prompt) | `arckit-copilot/prompts/arckit-requirements.prompt.md` |

## Sources

- [Use prompt files in VS Code](https://code.visualstudio.com/docs/copilot/customization/prompt-files)
- [Custom agents in VS Code](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [Prompt File Format and Guidelines (awesome-copilot)](https://deepwiki.com/github/awesome-copilot/5.2-prompt-file-format-and-guidelines)
- [GitHub Copilot Instructions vs Prompts vs Custom Agents](https://dev.to/pwd9000/github-copilot-instructions-vs-prompts-vs-custom-agents-vs-skills-vs-x-vs-why-339l)
