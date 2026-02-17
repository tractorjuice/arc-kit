# Changelog — ArcKit Plugin

All notable changes to the ArcKit Claude Code plugin will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.6.0] - 2026-02-17

### Added

- **SessionStart hook for version injection** — new `hooks/arckit-session.sh` fires once at session start (and on resume/clear/compact), injecting the ArcKit plugin version into Claude's context and exporting `ARCKIT_VERSION` as an environment variable; also detects whether a `projects/` directory exists

### Changed

- **Removed per-command VERSION file reads from 46 commands** — commands no longer instruct Claude to read `${CLAUDE_PLUGIN_ROOT}/VERSION`; the version is now provided via `{ARCKIT_VERSION}` from the SessionStart hook context, eliminating a redundant Read tool call on every command invocation
- Updated `hooks.json` to include `SessionStart` event alongside existing `UserPromptSubmit` and `PreToolUse` hooks
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.1] - 2026-02-17

### Changed

- **Removed `generate-document-id.sh` calls from 29 commands** — replaced bash script invocations with inline document ID format strings (e.g., `ARC-{PROJECT_ID}-REQ-v{VERSION}`); the PreToolUse hook now auto-corrects ARC filenames, making script calls redundant. The script itself is retained for `arckit init` and standalone use.
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.5.0] - 2026-02-17

### Added

- **UserPromptSubmit hook for project context** — new `hooks/arckit-context.sh` hook automatically detects all projects, artifacts, external documents, and global policies before any `/arckit:` command runs, injecting structured context via `systemMessage`
- **Plugin hooks configuration** — new `hooks/hooks.json` firing `arckit-context.sh` on every `UserPromptSubmit` event (skips non-arckit and utility commands)
- **PreToolUse (Write) hook for filename enforcement** — new `hooks/validate-arc-filename.sh` auto-corrects ARC filenames before the Write tool creates them: zero-pads project IDs, normalizes version format, moves multi-instance types (ADR, DIAG, DFD, WARD, DMC) to correct subdirectories, assigns next sequence numbers, and blocks unknown doc type codes

### Changed

- **Refactored 39 commands to use hook-provided context** — removed boilerplate directory scanning, `ARC-*-TYPE-*.md` glob patterns, verbose external docs blocks, and `list-projects.sh` calls; replaced with compact hook-aware references (net -1,071 lines, 66% boilerplate reduction)
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.5] - 2026-02-15

### Added

- **New `/arckit:dfd` command** — Data Flow Diagram (DFD) generation with multi-instance support, document control, and DFD-specific template
- **DFD multi-instance document type** — `DFD` added to `generate-document-id.sh` for sequential numbering (ARC-001-DFD-001, ARC-001-DFD-002, etc.)

### Changed

- **Explicit VERSION file path in all commands and agents** — all 49 commands and 5 agents now reference `${CLAUDE_PLUGIN_ROOT}/VERSION` instead of bare `VERSION`, ensuring the ArcKit version is always read from the plugin's authoritative file regardless of project state
- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.4] - 2026-02-12

### Fixed

- **Windows cp1252 encoding fix** — added explicit `encoding='utf-8'` to all file I/O operations in `arckit init` to prevent `UnicodeEncodeError` on Windows (fixes #49)

### Changed

- Version bump across all distribution formats (CLI, plugin, extension, marketplace)

---

## [2.4.3] - 2026-02-11

### Added

- **Data Commons MCP server for Gemini extension** — added `datacommons-mcp` to the Gemini extension MCP configuration, matching the Claude plugin

### Changed

- Version bump across all distribution formats (plugin, extension, marketplace)

---

## [2.4.2] - 2026-02-11

### Added

- **Data Commons MCP server** — bundled as a plugin MCP server for statistical data access (population, economics, health, etc.)

### Fixed

- Version bump to force plugin cache refresh for MCP server testing

---

## [2.4.1] - 2026-02-10

### Added

- **Gemini CLI native extension** — ArcKit is now available as a Gemini CLI extension at [`tractorjuice/arckit-gemini`](https://github.com/tractorjuice/arckit-gemini), giving Gemini users the same zero-config experience as the Claude Code plugin
  - Install: `gemini extensions install https://github.com/tractorjuice/arckit-gemini`
  - Bundled MCP servers (AWS Knowledge, Microsoft Learn via mcp-remote), optional Google Developer Knowledge
  - All 48 commands, templates, scripts, guides, and Wardley Mapping skill included
  - Extension version tracks plugin version (v2.4.1)
- `scripts/converter.py` now generates extension output alongside Codex format, with path rewriting (`${CLAUDE_PLUGIN_ROOT}` -> `~/.gemini/extensions/arckit`)

### Fixed

- **Gemini extension workspace sandbox fix**: Extension commands prepend a file access instruction block telling the model to use `run_shell_command` instead of `read_file` for extension paths (Gemini CLI sandboxes `read_file` to the project directory). `Read` instructions are also rewritten to `cat` commands in extension output.

### Changed

- **CLI is now Codex-only**: Gemini CLI removed from the CLI package — Gemini users should use the native extension instead. The converter now generates 2 output formats (Codex + Extension) instead of 3.

---

## [2.4.0] - 2026-02-09

### Added

- **Google Cloud Research** (`/arckit:gcp-research`) — new command + agent for GCP-specific technology research using the [Google Developer Knowledge MCP](https://developerknowledge.googleapis.com/mcp) server
  - Mirrors the existing AWS and Azure research commands (thin wrapper + autonomous agent)
  - Architecture Framework assessment (6 pillars: Operational Excellence, Security/Privacy/Compliance, Reliability, Cost Optimization, Performance Optimization, Sustainability)
  - Security Command Center mapping (CIS Benchmark for GCP, vulnerability/misconfiguration/threat findings)
  - UK Government: G-Cloud procurement, europe-west2 (London) data residency, NCSC alignment
  - Cost optimization: Committed Use Discounts (CUDs), Sustained Use Discounts (SUDs), Spot VMs, E2 machine types
  - IaC: Terraform (primary), Cloud Build CI/CD pipelines
  - Doc type code: `GCRS`
- Added `google-developer-knowledge` MCP server to plugin `.mcp.json` (requires `GOOGLE_API_KEY` env var)
- Added GCP research template, guide, and dependency matrix entry

---

## [2.3.1] - 2026-02-09

### Fixed

- Pass directory argument to `--next-num` in multi-instance commands (wardley, diagram, data-mesh-contract) to prevent unbound variable crash with `set -u`
- Added guard in `generate-document-id.sh` to give a clear error message when directory is missing
- Replace Mermaid `gitGraph` with `flowchart` in devops template — gitGraph has limited renderer support and fails with "No diagram type detected" errors in GitHub/VS Code
- Added diagram guidelines to devops command to prevent gitGraph usage in generated documents

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
