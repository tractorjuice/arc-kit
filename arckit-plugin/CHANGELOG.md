# Changelog — ArcKit Plugin

All notable changes to the ArcKit Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [2.3.1] - 2026-02-09

### Fixed

- Pass directory argument to `--next-num` in multi-instance commands (wardley, diagram, data-mesh-contract) to prevent unbound variable crash with `set -u`
- Added guard in `generate-document-id.sh` to give a clear error message when directory is missing

---

## [2.3.0] - 2026-02-09

### Added

- **Mathematical models** for Wardley Mapping skill — new `references/mathematical-models.md` with evolution scoring formulas, decision metrics (differentiation pressure, commodity leverage, dependency risk), and weak signal detection framework
- Quantitative analysis triggers in skill description (score evolution, calculate ubiquity, differentiation pressure, commodity leverage, weak signal detection, readiness score)
- Optional **Step 6: Quantitative Analysis** in SKILL.md mapping workflow
- Numeric scoring rubric (ubiquity/certainty scales) added to `references/evolution-stages.md`
- Quantitative positioning worked example added to E-Commerce Platform in `references/mapping-examples.md`

---

## [2.2.1] - 2026-02-09

### Fixed

- Added explicit `list-projects.sh --json` step to 9 commands (stakeholders, requirements, adr, sow, roadmap, strategy, dpia, platform-design, data-mesh-contract) to prevent Claude from guessing wrong script paths in plugin-based repos that no longer have `.arckit/scripts/bash/`

---

## [2.2.0] - 2026-02-09

### Added

- **Wardley Mapping skill** (`skills/wardley-mapping/`) for conversational Wardley Mapping — quick questions, evolution stage lookups, doctrine assessments, and interactive map creation with AskUserQuestion
- 5 reference files shared between skill and `/arckit:wardley` command: evolution stages, doctrine, gameplay patterns, climatic patterns, and mapping examples
- Enhanced strategic analysis in `/arckit:wardley` command — now reads shared reference files for doctrine assessment, gameplay patterns, climatic patterns, and mapping examples
- Output documents now include Doctrine Assessment Summary, Applicable Gameplay Patterns, and Climatic Pattern Analysis sections

## [2.1.9] - 2026-02-08

### Added

- Interactive configuration using AskUserQuestion for 8 key commands: backlog, diagram, plan, adr, dpia, sow, sobc, roadmap
- Commands now ask users about key decision points (prioritization approach, diagram type, contract type, evaluation weighting, etc.) before generating documents
- Questions are automatically skipped when users specify preferences via command arguments

## [2.1.8] - 2026-02-07

### Removed

- Redundant SessionStart hook that checked for already-bundled MCP servers (AWS Knowledge + Microsoft Learn are guaranteed by plugin `.mcp.json`)

## [2.1.7] - 2026-02-07

### Changed

- Plugin is now the **sole Claude Code distribution** — CLI no longer ships `.claude/commands/` or `.claude/agents/`
- All 22 test repos migrated from synced files to plugin marketplace

## [2.1.5] - 2026-02-07

### Added

- Bundled Microsoft Learn MCP server (`https://learn.microsoft.com/api/mcp`) via `.mcp.json`

### Changed

- Removed redundant MCP availability checks from Azure research commands (MCP now guaranteed by plugin)

## [2.1.4] - 2026-02-07

### Added

- Bundled AWS Knowledge MCP server (`https://knowledge-mcp.global.api.aws`) via `.mcp.json`

### Changed

- Renamed plugin commands to remove `arckit.` prefix for clean namespacing (e.g. `arckit.requirements` → `requirements`)
- Removed redundant MCP availability checks from AWS research commands (MCP now guaranteed by plugin)

## [2.1.3] - 2026-02-06

### Fixed

- Added missing `get_arckit_dir` and `get_templates_dir` functions to plugin `common.sh`
- Converted `arckit-init` from skill to slash command

## [2.1.2] - 2026-02-06

### Fixed

- Removed `hooks` field from `plugin.json` (auto-discovered from `hooks/` directory)

## [2.1.1] - 2026-02-06

### Fixed

- Reference agents by name in commands instead of `subagent_type: "general-purpose"` workaround
- Removed `agents` field from `plugin.json` (auto-discovered from `agents/` directory)
- Removed invalid `color`, `permissionMode`, `tools` fields from agent frontmatter (invalid in plugin context)

## [2.1.0] - 2026-02-06

### Added

- Initial plugin release for Claude Code marketplace
- 46 slash commands for architecture governance artifact generation
- 4 autonomous agents (research, datascout, aws-research, azure-research)
- 35 document templates with Document Control standard
- Helper scripts (`common.sh`, `create-project.sh`, `generate-document-id.sh`, etc.)
- Command usage guides
- `marketplace.json` for plugin discovery
- MIT LICENSE

### Changed

- All commands use `${CLAUDE_PLUGIN_ROOT}` for template and script references
- Agent frontmatter uses only valid plugin fields (`name`, `description`, `model`)
