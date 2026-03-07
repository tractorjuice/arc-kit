# Codex Skills Migration Design: Commands to Skills

**Date**: 2026-03-07
**Status**: Approved
**Author**: Claude Code

## Summary

Migrate ArcKit's 57 Codex CLI commands from deprecated custom prompts (`.codex/prompts/`) to the Open Agent Skills format (`.agents/skills/`). This eliminates the `CODEX_HOME` requirement and reduces installation to three steps.

## Background

Codex CLI has deprecated custom prompts (`~/.codex/prompts/`). Skills are the replacement. Skills auto-discover from `.agents/skills/` in the project root -- no environment variable configuration needed.

**Current install (4 steps, broken without step 4):**

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai codex
cd my-project
export CODEX_HOME="$PWD/.codex"   # easy to forget, nothing works without it
```

**New install (3 steps, zero config):**

```bash
pip install git+https://github.com/tractorjuice/arc-kit.git
arckit init my-project --ai codex
cd my-project
# codex auto-discovers skills from .agents/skills/
```

Sources:
- [Codex Custom Prompts (deprecated)](https://developers.openai.com/codex/custom-prompts/)
- [Codex Agent Skills](https://developers.openai.com/codex/skills/)

## Skill Structure Per Command

Each command becomes a skill directory:

```
.agents/skills/arckit-requirements/
├── SKILL.md              # name + description + command prompt
└── agents/
    └── openai.yaml       # policy: allow_implicit_invocation: false
```

### SKILL.md Format

```yaml
---
name: arckit-requirements
description: "Create comprehensive business and technical requirements (BR/FR/NFR/INT/DR) with stakeholder traceability. Use when: user asks to create requirements, define project needs, or document functional/non-functional requirements."
---

[Full command prompt from the existing .md file, with paths rewritten]
```

### agents/openai.yaml (shared across all 57 skills)

```yaml
policy:
  allow_implicit_invocation: false
```

This ensures skills are only invoked explicitly via `$arckit-requirements`, not automatically triggered by conversation context. With 57 skills, implicit invocation would cause false triggers.

### Invocation

Users type `$arckit-requirements` (or any `$arckit-*` skill name) in Codex CLI. The `$` prefix triggers explicit skill invocation.

## Naming Convention

| Old (prompt) | New (skill) | Invocation |
|--------------|-------------|------------|
| `arckit.requirements.md` | `arckit-requirements/SKILL.md` | `$arckit-requirements` |
| `arckit.adr.md` | `arckit-adr/SKILL.md` | `$arckit-adr` |
| `arckit.stakeholders.md` | `arckit-stakeholders/SKILL.md` | `$arckit-stakeholders` |

Pattern: filename `arckit.{name}.md` becomes directory `arckit-{name}/`.

## Converter Changes

### New Output Format

Add a new AGENT_CONFIG entry or modify the existing `codex_extension` entry to generate skill directories instead of prompt files:

```python
"codex_skills": {
    "name": "Codex Skills",
    "output_dir": "arckit-codex/skills",
    "format": "skill",          # new format type
    "path_prefix": ".arckit",
    "extension_dir": "arckit-codex",
}
```

### New format_output for skills

For `format == "skill"`:
1. Create directory `arckit-codex/skills/arckit-{name}/`
2. Write `SKILL.md` with frontmatter (name, description) + prompt body
3. Write `agents/openai.yaml` with `allow_implicit_invocation: false`

### What changes in the converter

- `format_output()` gains a `"skill"` format that returns a tuple of (skill_md_content, yaml_content) instead of a single string
- `convert()` handles `"skill"` format by creating directories instead of files
- Agent-delegating commands get their agent prompt inlined (same as current behavior for non-Claude targets)

## Directory Layout After Init

```
my-project/
├── .agents/
│   └── skills/
│       ├── arckit-requirements/
│       │   ├── SKILL.md
│       │   └── agents/openai.yaml
│       ├── arckit-adr/
│       │   ├── SKILL.md
│       │   └── agents/openai.yaml
│       ├── ... (57 command skills)
│       ├── architecture-workflow/    # existing reference skill
│       │   ├── SKILL.md
│       │   └── references/
│       ├── mermaid-syntax/           # existing reference skill
│       │   ├── SKILL.md
│       │   └── references/
│       ├── plantuml-syntax/          # existing reference skill
│       │   ├── SKILL.md
│       │   └── references/
│       └── wardley-mapping/          # existing reference skill
│           ├── SKILL.md
│           └── references/
├── .codex/
│   ├── agents/                       # agent configs (unchanged)
│   └── config.toml                   # MCP + agent roles (unchanged)
├── .arckit/
│   ├── templates/
│   └── scripts/
└── projects/
```

## CLI Changes

### arckit init --ai codex

1. Copy 57 command skills + 4 reference skills to `.agents/skills/`
2. Copy agent configs to `.codex/agents/`
3. Copy config.toml to `.codex/config.toml`
4. Copy templates + scripts to `.arckit/`
5. Remove `.envrc` generation (no longer needed)
6. Remove `CODEX_HOME` references from "Next Steps" output
7. Update "Next Steps" to show `$arckit-principles` instead of `/arckit.principles`

### pyproject.toml

Update shared-data to include the new skill directories (replace or supplement existing `.codex/prompts/` data).

## Standalone Repo Update

`arckit-codex/` and the GitHub repo `tractorjuice/arckit-codex` would contain:
- `skills/` with all 61 skills (57 commands + 4 references)
- `agents/` with agent configs
- `config.toml` with MCP + agent roles
- `prompts/` removed (deprecated)

## Backward Compatibility

The existing `.codex/prompts/` output can remain in the converter for users who haven't migrated, but the CLI (`arckit init`) would switch to skills-only output. The old `codex` AGENT_CONFIG entry stays; the new `codex_skills` entry is added.

## What Stays the Same

- Agent configs (`.codex/agents/`) -- unchanged
- MCP servers (`config.toml`) -- unchanged
- Templates (`.arckit/templates/`) -- unchanged
- Scripts (`.arckit/scripts/`) -- unchanged
- 4 reference skills (architecture-workflow, mermaid-syntax, plantuml-syntax, wardley-mapping) -- already in correct format
