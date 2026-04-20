# Custom Commands Authoring Guide

> **Guide Origin**: Official | **ArcKit Version**: [VERSION]

This guide explains how to add a new `/arckit.<n>` command. A command is a single Markdown file that ArcKit fans out to six AI-assistant formats automatically. Read this before opening a PR that adds a command.

For template customisation (changing the output of an existing command), see [`customize.md`](customize.md). For background on why ArcKit uses commands rather than skills, see the README section "Why Commands, Not Skills".

---

## How Commands Work

You write **one** source file in `arckit-claude/commands/<n>.md`. The converter at `scripts/converter.py` reads it and produces six target-specific outputs:

| Target | Output path | Format |
|-------|-------------|--------|
| Claude Code (source — edit this) | `arckit-claude/commands/<n>.md` | Markdown with YAML frontmatter |
| Codex CLI (command) | `arckit-codex/prompts/arckit.<n>.md` | Markdown |
| Codex CLI (skill) | `arckit-codex/skills/arckit-<n>/SKILL.md` | Skill format |
| OpenCode CLI | `arckit-opencode/commands/arckit.<n>.md` | Markdown |
| Gemini CLI | `arckit-gemini/commands/arckit/<n>.toml` | TOML |
| GitHub Copilot | `arckit-copilot/prompts/arckit-<n>.prompt.md` | Prompt frontmatter |
| Paperclip | `arckit-paperclip/src/data/commands.json` (entry) | JSON |

The first row is the file you edit by hand; the converter generates all others. You do not edit the generated files directly. The converter handles argument-placeholder rewriting, path rewriting for the Gemini sandbox, frontmatter stripping for Claude-only fields, and extension-file copying.

---

## The Source File

Create `arckit-claude/commands/<n>.md` with YAML frontmatter and a prompt body.

````markdown
---
description: One-line description in imperative mood
argument-hint: "<hint shown in autocomplete>"
effort: medium
handoffs:
  - command: next-command
    description: Why a user might run this next
---

You are helping an enterprise architect do X.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. Read the template (with user override support): ...
2. Read related artifacts from the project context: ...
3. Generate the output: ...
4. Write to `projects/<project-id>/ARC-<id>-<CODE>-v<version>.md`
````

### Frontmatter Reference

| Field | Required | Notes |
|-------|----------|-------|
| `description` | Yes | Imperative, one line. Used as the slash-command description in every target. |
| `argument-hint` | Recommended | Shown in Claude Code autocomplete. Short hint showing the expected shape of input. |
| `effort` | No | `low` / `medium` / `high`. Claude Code only — stripped from other targets by the converter. |
| `handoffs` | No | List of `{command, description}` entries suggesting follow-on commands. Rendered into a handoffs section in generated outputs. |
| `paths` | No | Claude-only. Stripped from other targets. |
| `keep-coding-instructions` | No | Claude-only. Stripped from other targets. |

### The `$ARGUMENTS` Contract

Always include a `## User Input` section with a fenced `text` block containing `$ARGUMENTS`. The converter rewrites the placeholder per target:

| Target | Placeholder used |
|-------|------------------|
| Claude Code | `$ARGUMENTS` (unchanged) |
| Codex, OpenCode | `$ARGUMENTS` (unchanged) |
| Gemini | `{{args}}` |
| Copilot | `${input:topic:Enter project name or topic}` |
| Paperclip | `{topic}` |

Do not hand-write target-specific placeholders — use `$ARGUMENTS` and let the converter do the work.

> The Copilot placeholder currently hard-codes the `topic:` label regardless of what the command expects as input. If you need a command-specific label, it requires changes to `scripts/converter.py` — the converter is the right place to thread that customisation through.

### Reading Templates with User Overrides

Commands should prefer a user-customised template over the bundled default. Use this pattern in the prompt body:

```markdown
1. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/<your-template>.md` exists in the project root
   - **If found**: Read the user's customised template (user override takes precedence)
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/<your-template>.md` (default)
```

The converter rewrites `${CLAUDE_PLUGIN_ROOT}` paths to the correct location for each target (for example, shell commands against `~/.gemini/extensions/arckit/` for Gemini because that directory sits outside Gemini's workspace sandbox).

Put the template file alongside the command: `arckit-claude/templates/<your-template>-template.md`. The filename convention is `<command-name>-template.md`.

How the template reaches each target:

- **Paperclip** embeds the template content directly into its generated `commands.json` via `read_template_for_command()` in the converter.
- **All other targets** receive the whole `templates/` tree copied verbatim into each extension directory by `copy_extension_files()`, and the command reads the file at runtime via the target's path prefix (`${CLAUDE_PLUGIN_ROOT}`, `~/.gemini/extensions/arckit/`, etc.).

---

## Worked Example: `/arckit.sla`

Say you want a command that generates a Service Level Agreement skeleton from existing non-functional requirements.

**1. Create `arckit-claude/commands/sla.md`:**

````markdown
---
description: Generate an SLA skeleton from non-functional requirements
argument-hint: "<project ID, e.g. '001'>"
effort: medium
handoffs:
  - command: servicenow
    description: Feed SLAs into ServiceNow service design
  - command: dld-review
    description: Validate SLA coverage in detailed design review
---

You are helping an enterprise architect draft a Service Level Agreement (SLA) that inherits its targets from previously documented non-functional requirements.

## User Input

```text
$ARGUMENTS
```

## Instructions

1. **Read the template** (with user override support):
   - **First**, check if `.arckit/templates/sla-template.md` exists in the project root
   - **If found**: Read the user's customised template
   - **If not found**: Read `${CLAUDE_PLUGIN_ROOT}/templates/sla-template.md` (default)

2. **Read the project requirements**:
   - Locate `projects/<project-id>/ARC-<id>-REQ-v*.md`
   - Extract all NFR-* entries (availability, latency, throughput, RTO/RPO)
   - If no requirements file exists, ask the user to run `/arckit.requirements` first

3. **Generate the SLA** using the extracted NFRs:
   - One row per NFR, mapped to an SLA target
   - Include measurement method, reporting cadence, and breach consequences
   - Maintain traceability: every SLA row cites its source NFR ID

4. **Detect version** and write to `projects/<project-id>/ARC-<id>-SLA-v<version>.md`.
````

**2. Create `arckit-claude/templates/sla-template.md`** with the document skeleton (document-control header, SLA table, review cadence, and signature block).

**3. Run the converter:**

```bash
python scripts/converter.py
```

This writes out the six target files with correct placeholders and paths.

**4. Add the user-facing guide** at `arckit-claude/docs/guides/sla.md` following the house style (see `arckit-claude/docs/guides/principles.md` or `arckit-claude/docs/guides/adr.md` for examples). This is the source location; the `sync-guides` hook and converter mirror it to `docs/guides/` and into every extension's `docs/guides/` tree.

**5. Update `CHANGELOG.md`** under `## [Unreleased]`.

---

## Commands, Skills, Agents, and Hooks — When to Use Which

| You want to... | Use | Location |
|-------|-----|----------|
| Generate a specific artifact on explicit invocation | **Command** | `arckit-claude/commands/` |
| Share procedural knowledge across multiple commands | **Skill** | `arckit-claude/skills/<skill-name>/` |
| Run heavy research in an isolated context window | **Agent** | `arckit-claude/agents/arckit-<n>.md` |
| React to lifecycle events (session start, file write, prompt submit) | **Hook** | `arckit-claude/hooks/` |
| Override a command's behaviour on non-Claude targets only | **Standalone command** | `arckit-claude/commands-standalone/` |

A command and an agent with matching names are linked automatically: the converter uses the agent's prompt as the command body for non-Claude targets (which lack Claude Code's agent architecture). See `arckit-claude/agents/arckit-research.md` paired with `arckit-claude/commands/research.md` for the canonical example.

---

## Conventions

Taken from [`CONTRIBUTING.md`](../../CONTRIBUTING.md). Repeated here because they matter most for commands:

- **Naming**: lowercase with hyphens (`data-model`, not `dataModel`). Verbs for actions (`analyse`, `review`). Nouns for artifacts (`requirements`, `runbook`). Group related commands with shared prefixes (`hld-review`, `dld-review`).
- **UK English** throughout (`organisation`, `analyse`, `colour`).
- **MUST / SHOULD / MAY** for normative language — aligns with the wider ArcKit tone and with GDS content design.
- **Technology-agnostic** — describe qualities and patterns, not specific vendors or products.
- **Traceability** — every generated artifact should cite its inputs (requirement IDs, risk IDs, principle IDs).
- **Commit message**: `feat(commands): add /arckit.<n> command`.

---

## Testing a New Command

Before opening the PR, verify the command works across at least Claude Code and one other target:

```bash
# 1. Regenerate all target files
python scripts/converter.py

# 2. Test in Claude Code (requires the plugin installed from marketplace)
/arckit.<n> Test scenario description

# 3. Test in Gemini CLI
gemini extensions install .
/arckit:<n> Test scenario description

# 4. Inspect the generated output
cat projects/001-<test-project>/ARC-001-<CODE>-v1.0.md
```

Check:

- [ ] The command reads the template (customised or default) correctly
- [ ] The output contains every section the template specifies
- [ ] Every reference to a source artifact uses a real ID that exists in the project
- [ ] Re-running the command with an existing output file correctly bumps the version
- [ ] `python scripts/converter.py` regenerates cleanly with no diff noise
- [ ] Generated TOML and prompt files look sensible on a quick read

---

## Submitting the PR

1. Branch: pick a short descriptive name — recent history uses both `feat/` and `docs/` prefixes, either is fine.
2. Commit the source command, the template, the guide, the converter-regenerated files, and the CHANGELOG entry together.
3. PR title follows conventional commits: `feat(commands): add /arckit.<n> command`.
4. PR description should include: the use case, a link to any related issue, and at least one screenshot or pasted output showing the command running in Claude Code.

See [`CONTRIBUTING.md`](../../CONTRIBUTING.md) for the broader contribution process.
