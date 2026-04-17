# Architecture and Design

## The Seven Distribution Formats

ArcKit ships in seven formats from a single source of truth (`arckit-claude/commands/*.md`):

| # | Format | Target | Location | Install Method |
|---|--------|--------|----------|----------------|
| 1 | CLI package | pip/uv | `src/arckit_cli/` | `pip install arckit-cli` then `arckit init` |
| 2 | Claude Code plugin | Claude Code | `arckit-claude/` | Marketplace: `tractorjuice/arc-kit` |
| 3 | Gemini CLI extension | Gemini CLI | `arckit-gemini/` | `gemini extensions install tractorjuice/arckit-gemini` |
| 4 | OpenCode CLI extension | OpenCode CLI | `arckit-opencode/` | `arckit init --ai opencode` |
| 5 | Codex CLI extension | Codex CLI | `arckit-codex/` | Published as `tractorjuice/arckit-codex` |
| 6 | Copilot extension | GitHub Copilot | `arckit-copilot/` | `arckit init --ai copilot` |
| 7 | Paperclip plugin | Paperclip AI | `arckit-paperclip/` | npm: `@tractorjuice/arckit-paperclip` (not yet published) |

### The Converter -- One Source, Seven Targets

`scripts/converter.py` is the engine that makes multi-platform possible. It's config-driven via an `AGENT_CONFIG` dictionary -- adding a new AI target only requires a new dict entry.

**What it does:**

- Reads plugin commands (`arckit-claude/commands/*.md`) with YAML frontmatter
- Rewrites `${CLAUDE_PLUGIN_ROOT}` paths per target
- Extracts agent prompts and inlines them for non-Claude targets (which don't support the Task/agent architecture)
- Generates format-specific output: Markdown (Codex/OpenCode), TOML (Gemini), `.prompt.md` (Copilot), JSON (Paperclip)
- Copies supporting files (templates, scripts, docs) to each extension directory
- For Codex: generates `config.toml` (MCP servers + agent roles), per-agent `.toml` files, rewrites skill command references
- For Gemini: generates agents, hooks, policies with GDS theme
- Renders `handoffs:` frontmatter as "Suggested Next Steps" sections

**Key functions**: `rewrite_paths()`, `format_output()`, `convert()`, `copy_extension_files()`, `generate_codex_config_toml()`, `generate_agent_toml_files()`, `rewrite_codex_skills()`, `generate_gemini_agents()`, `generate_gemini_hooks()`, `generate_gemini_policies()`, `generate_copilot_agents()`, `generate_copilot_instructions()`

## The Plugin Architecture (Claude Code)

### Command System

68 slash commands in `arckit-claude/commands/*.md`. Each has:

- **YAML frontmatter**: `description`, optional `effort` (low/medium/high/max), optional `handoffs` (next steps)
- **Prompt body**: Instructions for the AI, referencing templates via `${CLAUDE_PLUGIN_ROOT}/templates/`
- **Template-driven**: Every command reads from `.arckit/templates/` -- never generates freeform documents

### Agent System -- Context Isolation for Heavy Research

10 autonomous agents in `arckit-claude/agents/arckit-{name}.md`. Agents exist because research-heavy commands (>10 WebSearch/WebFetch calls) would flood the main conversation's context window.

**Pattern**: The slash command is a thin wrapper that launches the agent via the Task tool. The agent runs autonomously in its own context, performs web research, writes the document via Write tool, and returns only a summary.

| Agent | Purpose | Key Detail |
|-------|---------|------------|
| arckit-research | Market research, vendor eval, build vs buy, TCO | Adds "Reuse Government Code" as 5th build-vs-buy option |
| arckit-datascout | Data source discovery, API catalogues | Discovers existing gov API client libraries |
| arckit-aws-research | AWS service research | Uses AWS Knowledge MCP |
| arckit-azure-research | Azure service research | Uses Microsoft Learn MCP |
| arckit-gcp-research | GCP service research | Uses Google Developer Knowledge MCP |
| arckit-framework | Transform artifacts into structured framework | Systems thinking foundations (Ashby, Conant-Ashby, Gall, Conway) |
| arckit-gov-reuse | Government code reuse assessment | Uses govreposcrape MCP |
| arckit-gov-code-search | Government code semantic search | Uses govreposcrape MCP |
| arckit-gov-landscape | Government code landscape analysis | Uses govreposcrape MCP |
| arckit-grants | UK grants, funding, accelerators | Searches UKRI, Innovate UK, NIHR, DSIT, DASA, Wellcome, Nesta, etc. |

**Agent frontmatter** (valid fields): `name`, `description`, `model`, `effort`, `maxTurns`, `disallowedTools`. As of v4.6.0, all agents use `model: inherit` -- they run on whatever model the user has selected.

### Hooks System -- 18 Handlers Across 7 Event Types

The hooks system provides reactive automation. Handlers are `.mjs` files in `arckit-claude/hooks/`, registered in `hooks.json`.

| Event | Handlers | Purpose |
|-------|----------|---------|
| SessionStart | arckit-session, version-check | Context injection, update notifications |
| UserPromptSubmit | arckit-context, secret-detection, + 6 command-specific | Pre-processing, secret detection, command-aware scanning |
| PreToolUse | validate-arc-filename, score-validator, file-protection, secret-file-scanner | Validation before Write/Edit operations |
| PostToolUse | update-manifest | Auto-update manifest.json after Write |
| Stop | session-learner | Capture session insights |
| StopFailure | session-learner | Capture insights even on failure |
| PermissionRequest | allow-mcp-tools | Auto-allow MCP tool prefixes |

**Utility files** (not handlers): `hook-utils.mjs`, `graph-utils.mjs`, `hooks.json`

**One unwired hook**: `validate-wardley-math.mjs` -- exists since v4.0.0 for Wardley Map coordinate/stage validation but was never registered in `hooks.json`.

### MCP Servers -- External Knowledge Integration

5 MCP servers provide real-time research capabilities:

| Server | API Key Required | Purpose |
|--------|-----------------|---------|
| AWS Knowledge | No | AWS service documentation and guidance |
| Microsoft Learn | No | Azure and Microsoft documentation |
| Google Developer Knowledge | Yes (GOOGLE_API_KEY) | GCP documentation |
| Data Commons | Yes (DATA_COMMONS_API_KEY) | Statistical data |
| govreposcrape | No | 24,500+ UK government repositories |

### Skills System

4 skills provide reference knowledge:

1. **architecture-workflow** -- End-to-end governance workflow
2. **mermaid-syntax** -- Mermaid diagram syntax reference
3. **plantuml-syntax** -- PlantUML C4 diagram syntax
4. **wardley-mapping** -- Wardley Map syntax and mathematical models

### Data Path Resolution

The CLI resolves data paths in this order:

1. Source/dev mode: `{repo_root}/` (if `.arckit` and `.codex` dirs exist)
2. uv tool install: `~/.local/share/uv/tools/arckit-cli/share/arckit/`
3. pip install: `{site-packages}/share/arckit/`
4. platformdirs: `{user_data_dir}/arckit/`
5. Fallback to source: `{repo_root}/`

## The Document System

### Document Control Standard

Every template starts with a standardized 14-field table:

Document ID, Document Type, Project, Classification (PUBLIC/OFFICIAL/OFFICIAL-SENSITIVE/SECRET), Status (DRAFT/IN_REVIEW/APPROVED/PUBLISHED/SUPERSEDED/ARCHIVED), Version, Created Date, Last Modified, Review Cycle, Next Review Date, Owner, Reviewed By, Approved By, Distribution.

Domain-specific fields go after standard fields.

### Document ID Format

Generated by `scripts/bash/generate-document-id.sh`:

```text
ARC-{project_number}-{type_code}-v{version}
```

Examples: `ARC-001-REQ-v1.0`, `ARC-001-ADR-001-v1.0` (multi-instance types get sequential numbers)

### Requirement ID Prefixes

- **BR-xxx**: Business Requirements
- **FR-xxx**: Functional Requirements
- **NFR-xxx**: Non-Functional Requirements (with subcategories: NFR-P-xxx Performance, NFR-SEC-xxx Security, etc.)
- **INT-xxx**: Integration Requirements
- **DR-xxx**: Data Requirements

### Traceability Chain

```text
Stakeholders -> Goals -> Requirements (BR/FR/NFR/INT/DR) -> Data Model -> Components -> User Stories
```

### Citation Traceability (v4.6.3)

When commands read external documents (`external/`, `policies/`, `vendors/`), they add:

- Inline citation markers: `[DOC_ID-CN]` (e.g., `[SOBC-C1]`, `[RISK-C3]`)
- External References section with three tables:
  1. **Document Register** -- all referenced documents
  2. **Citations** -- where each citation appears
  3. **Unreferenced Documents** -- documents that were available but not cited

Shared logic lives in `arckit-claude/references/citation-instructions.md`, referenced by all 43 commands and 7 agents.

### Template Customization

- Defaults: `.arckit/templates/` (shipped with ArcKit)
- User overrides: `.arckit/templates-custom/` (preserved across updates)
- Commands check custom first, fall back to defaults
- `/arckit.customize` command copies templates for editing

### Handoffs Schema

Commands declare suggested next steps in frontmatter:

```yaml
handoffs:
  - command: data-model
    description: Create data model from data requirements
    condition: "DR-xxx data requirements were generated"
```

The converter renders these as "Suggested Next Steps" sections in non-Claude formats.
