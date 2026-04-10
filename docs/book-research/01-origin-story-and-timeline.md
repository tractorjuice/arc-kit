# Origin Story and Timeline

## The Beginning

- **First commit**: 14 October 2025 -- "Initial commit: ArcKit CLI with templates and infrastructure"
- **First commands** (same day, within 20 minutes): `principles`, `requirements`, `sow` -- the core triad that defined ArcKit's purpose
- **First full command suite**: 7 minutes later -- "feat: add complete slash command suite for enterprise architecture governance"
- ArcKit was born as a CLI tool (`pip install arckit-cli`) with templates and bash scripts

## Project Scale

- **971 total commits** across 6 months (Oct 2025 -- Apr 2026)
- **129 tagged releases** -- an extraordinary cadence of roughly one release every 1.4 days
- **243 feature commits**, **247 fix commits**
- **Primary author**: tractorjuice (950 commits)
- **Contributors**: David R Oliver (11 commits), Magistr/@umag (5 commits), Yehuda Korotkin/@alefbt (4 commits), Claude (1 commit)

## Commit Cadence by Month

| Month | Commits | Notes |
|-------|---------|-------|
| Oct 2025 | 175 | Launch month -- CLI, first UK Gov compliance commands |
| Nov 2025 | 86 | Documentation, dependency matrix, ADR/roadmap guides |
| Dec 2025 | 3 | Quiet month |
| Jan 2026 | 143 | MCP servers, cloud research, plugin groundwork |
| Feb 2026 | 306 | **Peak month** -- plugin architecture, 5 extensions, hooks, pages dashboard |
| Mar 2026 | 241 | Wardley suite, govreposcrape, autoresearch, dependency maps |
| Apr 2026 | 17 | Citation traceability, grants command, managed agents |

## Version Evolution

### v0.x Era (Oct 2025) -- 22 releases

The CLI-only era. Commands lived as `.claude/commands/*.md` files copied into user projects. Key additions:

- v0.1.0: Core command suite (principles, requirements, sow, stakeholders, diagrams)
- v0.2.0: UK Government Compliance Edition (TCoP, ATRS, AI Playbook, Secure by Design)
- v0.2.2: First Codex CLI support (@umag)
- v0.3.0: SOBC (Strategic Outline Business Case), risk management (Orange Book)
- v0.3.2: MOD Secure by Design with CAAT process, technology research command
- v0.3.4: First external contribution merged (Gemini support from @umag)
- v0.4.0: "Plan First, Execute Right" -- planning workflow introduced

### v0.8.x--v0.11.x Era (Nov 2025 -- Jan 2026) -- 8 releases

Stabilization and documentation. Dependency matrix, document control standards, ADR/roadmap guides.

### v1.x Era (Jan--Feb 2026) -- 8 releases

MCP servers arrive, turning ArcKit from a template generator into a research-capable toolkit:

- v1.0.1: First stable 1.0 release
- v1.0.3: `/arckit.aws-research` with AWS Knowledge MCP -- first cloud research command
- v1.1.0: Microsoft Learn MCP integration
- v1.2.0--v1.5.0: Azure research, GCP research, Data Commons MCP

### v2.x Era (Feb--Mar 2026) -- 56 releases (most prolific)

The plugin era. The most transformative period:

- **v2.0.0** (7 Feb): Claude Code becomes plugin-only -- the biggest architectural shift
- v2.1.9: Unified CLI and plugin versions
- v2.3.0: Wardley Mapping mathematical models
- v2.4.x: Gemini extension with full parity
- v2.5.1: Removed generate-document-id.sh from 29 commands (simplification)
- v2.7.0: Presentation command, UK Gov frameworks, MCP integrations
- v2.8.x: Knowledge compounding, health command, security hooks, C4 layout science, dark mode, PlantUML, Mermaid zoom/pan
- v2.9.0: Architecture conformance assessment
- v2.10.0--v2.22.x: Rapid iteration on pages dashboard, hook system, template standardization

### v3.x Era (Mar 2026) -- 13 releases

Consolidation and cleanup:

- v3.0.0: Template builder, hook-utils extraction
- v3.0.8: Shared `hook-utils.mjs` module extracted
- v3.1.0: Doc type configuration centralized

### v4.x Era (Mar--Apr 2026) -- 30 releases

Maturity and advanced features:

- **v4.0.0** (7 Mar): Plugin renamed `arckit-plugin` to `arckit-claude`, repo cleanup
- v4.1.1: Copilot extension, vendor scoring, search, impact analysis, session learner
- v4.2.0: Interactive dependency map visualization in pages dashboard
- v4.3.0: Wardley mapping suite (4 new commands from 3 Wardley books)
- v4.4.0: Autoresearch system, effort frontmatter
- v4.5.0: govreposcrape MCP (24,500+ UK gov repos), 3 government code discovery commands
- v4.6.0: Agents inherit session model, autoresearch tuning
- v4.6.2: Mermaid wardley-beta test suite (98% pass, 147 real maps)
- v4.6.3: Citation traceability for external documents
- v4.6.4: Grants command (68th command, 10th agent)
- v4.6.6: Managed agent deployment via Anthropic API
