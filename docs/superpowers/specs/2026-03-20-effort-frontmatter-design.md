# Design: Add `effort` Frontmatter to ArcKit Commands & Agents

**Date**: 2026-03-20
**Status**: Approved

## Summary

Add `effort` frontmatter field to ArcKit slash commands and agents to leverage Claude Code 2.1.80's new effort override feature. Focus on quality optimization — pushing complex commands to `high` or `max` effort for deeper reasoning. Simple/utility commands remain at default (no `effort` set).

## Background

Claude Code 2.1.80 introduced `effort` frontmatter support for skills and slash commands. Valid values: `low`, `medium`, `high`, `max` (Opus 4.6 required for `max`). ArcKit targets Opus 4.6, so all levels are available.

Previously, effort could only be set per-session via `/effort`. Now commands can declare their own effort level, overriding the session default when invoked.

**Requires**: Claude Code 2.1.80+

## Design

### Approach

- Only set `effort` on commands that benefit from deeper reasoning (quality optimization)
- Leave simple/utility commands without `effort` (inherits session default)
- For agent-delegated commands, set `effort` on both the slash command and the agent `.md` file (must match)
- Strip `effort` from frontmatter when converting to Codex/OpenCode/Gemini/Copilot formats

### Effort Tiers

#### `max` — Deep synthesis, critical governance documents

Commands that synthesize across many inputs, require deep analytical reasoning, or produce the most critical governance documents.

| Command | Rationale |
|---------|-----------|
| `requirements` | Full BR/FR/NFR/INT/DR taxonomy, cross-referencing |
| `sobc` | 5-case Green Book model, financial analysis |
| `strategy` | Enterprise-wide strategic analysis |
| `research` | Build vs buy, TCO, market analysis (command + agent) |
| `datascout` | Data source discovery, API scoring (command + agent) |
| `framework` | Transform artifacts into structured framework (command + agent) |
| `platform-design` | Multi-layered platform architecture |
| `service-assessment` | GDS Service Standard, 14-point assessment |
| `mlops` | ML lifecycle, governance, compliance |
| `ai-playbook` | AI adoption strategy, ethics, governance |
| `wardley` | Full Wardley Map synthesis |
| `wardley.value-chain` | Value chain analysis |
| `wardley.doctrine` | Doctrine assessment |
| `wardley.climate` | Climate pattern analysis |
| `wardley.gameplay` | Gameplay strategy |

#### `high` — Structured document generation, narrower scope

| Command | Rationale |
|---------|-----------|
| `adr` | Options analysis, MADR format |
| `risk` | Risk register, scoring, mitigations |
| `stakeholders` | Stakeholder mapping, power/interest |
| `data-model` | Entity relationships, normalization |
| `data-mesh-contract` | Data contract specification |
| `conformance` | Architecture conformance review |
| `dpia` | Data protection impact assessment |
| `evaluate` | Evaluation framework, criteria |
| `score` | Vendor scoring, comparison |
| `operationalize` | Operational readiness |
| `roadmap` | Strategic roadmap generation |
| `secure` | Security assessment |
| `mod-secure` | MOD security (JSP 440/604) |
| `jsp-936` | MOD information management |
| `devops` | DevOps pipeline design |
| `finops` | Cloud financial management |
| `backlog` | Product backlog generation |
| `traceability` | Requirements traceability matrix |
| `dld-review` | Detailed-level design review |
| `hld-review` | High-level design review |
| `sow` | Statement of work |
| `dos` | Digital Outcomes procurement |
| `tcop` | Technology Code of Practice |
| `maturity-model` | Maturity assessment |
| `atrs` | Architecture trade study |
| `plan` | Architecture plan |
| `presentation` | Presentation generation |
| `aws-research` | AWS service research (command + agent) |
| `azure-research` | Azure service research (command + agent) |
| `gcp-research` | GCP service research (command + agent) |

#### No effort set (default) — Utilities, lookups, simple generation

| Command | Rationale |
|---------|-----------|
| `customize` | Template copy utility |
| `init` | Project scaffolding |
| `start` | Onboarding/workflow selection |
| `pages` | HTML site generation |
| `search` | Artifact search |
| `impact` | Change blast radius analysis |
| `health` | Artifact health check |
| `glossary` | Terminology extraction |
| `story` | User story generation |
| `trello` | Trello board creation |
| `servicenow` | ServiceNow integration |
| `diagram` | Mermaid/PlantUML generation |
| `dfd` | Data flow diagram |
| `template-builder` | Custom template creation |
| `analyze` | Artifact analysis |
| `principles` | Architecture principles |
| `principles-compliance` | Principles compliance check |
| `gcloud-search` | GCP documentation search |
| `gcloud-clarify` | GCP documentation clarification |

### Agent Files

For the 6 agent-delegated commands, set `effort` on both files:

| Agent file | Effort |
|-----------|--------|
| `arckit-research.md` | `max` |
| `arckit-datascout.md` | `max` |
| `arckit-framework.md` | `max` |
| `arckit-aws-research.md` | `high` |
| `arckit-azure-research.md` | `high` |
| `arckit-gcp-research.md` | `high` |

### Converter Changes

Strip `effort` field from frontmatter dict after extraction, before generating output for non-Claude targets. Add to the convert loop alongside existing frontmatter field extraction:

```python
# In the convert loop, after extracting frontmatter
frontmatter.pop("effort", None)
```

### Frontmatter Example

Before:

```yaml
---
description: Create comprehensive business and technical requirements
handoffs:
  - command: data-model
    description: Create data model from data requirements
---
```

After:

```yaml
---
description: Create comprehensive business and technical requirements
effort: max
handoffs:
  - command: data-model
    description: Create data model from data requirements
---
```

## Implementation Steps

1. Add `effort` frontmatter to all `max` tier commands (15 commands)
2. Add `effort` frontmatter to all `high` tier commands (30 commands)
3. Add `effort` frontmatter to 6 agent files
4. Update `scripts/converter.py` to strip `effort` from output
5. Run `python scripts/converter.py` to regenerate all formats
6. Update CLAUDE.md: add `effort` to Slash Command System section and Handoffs Schema example
7. Test a few commands to verify effort is applied
