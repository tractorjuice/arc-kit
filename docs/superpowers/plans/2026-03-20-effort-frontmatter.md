# Effort Frontmatter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `effort` frontmatter to 45 ArcKit commands and 6 agents, and strip it in the converter for non-Claude targets.

**Architecture:** Add `effort: max` or `effort: high` as a YAML frontmatter field to existing command/agent `.md` files. Update `scripts/converter.py` to pop `effort` before generating output. Update CLAUDE.md to document the field.

**Tech Stack:** YAML frontmatter, Python (converter.py), Markdown

**Spec:** `docs/superpowers/specs/2026-03-20-effort-frontmatter-design.md`

---

## Task 1: Add `effort: max` to 15 commands

**Files:**

- Modify: `arckit-claude/commands/requirements.md` (line 2, after `description:`)
- Modify: `arckit-claude/commands/sobc.md` (line 2)
- Modify: `arckit-claude/commands/strategy.md` (line 2)
- Modify: `arckit-claude/commands/research.md` (line 2)
- Modify: `arckit-claude/commands/datascout.md` (line 2)
- Modify: `arckit-claude/commands/framework.md` (line 2)
- Modify: `arckit-claude/commands/platform-design.md` (line 2)
- Modify: `arckit-claude/commands/service-assessment.md` (line 2)
- Modify: `arckit-claude/commands/mlops.md` (line 2)
- Modify: `arckit-claude/commands/ai-playbook.md` (line 2)
- Modify: `arckit-claude/commands/wardley.md` (line 2)
- Modify: `arckit-claude/commands/wardley.value-chain.md` (line 2)
- Modify: `arckit-claude/commands/wardley.doctrine.md` (line 2)
- Modify: `arckit-claude/commands/wardley.climate.md` (line 2)
- Modify: `arckit-claude/commands/wardley.gameplay.md` (line 2)

For each file, add `effort: max` as a new line in the YAML frontmatter block, immediately after the `description:` line (or after `tags:` if present, but before `handoffs:`).

- [ ] **Step 1: Add `effort: max` to all 15 command files**

The pattern for each file: insert `effort: max` after the `description` (and `tags`/`argument-hint` if present) line but before `handoffs:` (if present). Example for `requirements.md`:

```yaml
---
description: Create comprehensive business and technical requirements
argument-hint: "<project ID or feature, e.g. '001', 'authentication module'>"
effort: max
handoffs:
```

Apply the same pattern to all 15 files listed above. The `effort: max` line goes after description/argument-hint/tags but before handoffs (if any).

- [ ] **Step 2: Verify all 15 files have effort: max**

Run:

```bash
grep -l "effort: max" arckit-claude/commands/*.md | wc -l
```

Expected: `15`

Run:

```bash
grep -l "effort: max" arckit-claude/commands/*.md
```

Expected: All 15 filenames listed above.

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/commands/requirements.md arckit-claude/commands/sobc.md arckit-claude/commands/strategy.md arckit-claude/commands/research.md arckit-claude/commands/datascout.md arckit-claude/commands/framework.md arckit-claude/commands/platform-design.md arckit-claude/commands/service-assessment.md arckit-claude/commands/mlops.md arckit-claude/commands/ai-playbook.md arckit-claude/commands/wardley.md arckit-claude/commands/wardley.value-chain.md arckit-claude/commands/wardley.doctrine.md arckit-claude/commands/wardley.climate.md arckit-claude/commands/wardley.gameplay.md
git commit -m "feat: add effort: max frontmatter to 15 complex commands"
```

---

## Task 2: Add `effort: high` to 30 commands

**Files:**

- Modify: `arckit-claude/commands/adr.md`
- Modify: `arckit-claude/commands/risk.md`
- Modify: `arckit-claude/commands/stakeholders.md`
- Modify: `arckit-claude/commands/data-model.md`
- Modify: `arckit-claude/commands/data-mesh-contract.md`
- Modify: `arckit-claude/commands/conformance.md`
- Modify: `arckit-claude/commands/dpia.md`
- Modify: `arckit-claude/commands/evaluate.md`
- Modify: `arckit-claude/commands/score.md`
- Modify: `arckit-claude/commands/operationalize.md`
- Modify: `arckit-claude/commands/roadmap.md`
- Modify: `arckit-claude/commands/secure.md`
- Modify: `arckit-claude/commands/mod-secure.md`
- Modify: `arckit-claude/commands/jsp-936.md`
- Modify: `arckit-claude/commands/devops.md`
- Modify: `arckit-claude/commands/finops.md`
- Modify: `arckit-claude/commands/backlog.md`
- Modify: `arckit-claude/commands/traceability.md`
- Modify: `arckit-claude/commands/dld-review.md`
- Modify: `arckit-claude/commands/hld-review.md`
- Modify: `arckit-claude/commands/sow.md`
- Modify: `arckit-claude/commands/dos.md`
- Modify: `arckit-claude/commands/tcop.md`
- Modify: `arckit-claude/commands/maturity-model.md`
- Modify: `arckit-claude/commands/atrs.md`
- Modify: `arckit-claude/commands/plan.md`
- Modify: `arckit-claude/commands/presentation.md`
- Modify: `arckit-claude/commands/aws-research.md`
- Modify: `arckit-claude/commands/azure-research.md`
- Modify: `arckit-claude/commands/gcp-research.md`

- [ ] **Step 1: Add `effort: high` to all 30 command files**

Same pattern as Task 1: insert `effort: high` after description/argument-hint/tags, before handoffs. Example for `adr.md`:

```yaml
---
description: Document architectural decisions with options analysis and traceability
argument-hint: "<decision topic, e.g. 'API gateway selection', 'database platform'>"
effort: high
handoffs:
```

- [ ] **Step 2: Verify all 30 files have effort: high**

Run:

```bash
grep -l "effort: high" arckit-claude/commands/*.md | wc -l
```

Expected: `30`

- [ ] **Step 3: Verify total effort commands (45)**

Run:

```bash
grep -l "effort:" arckit-claude/commands/*.md | wc -l
```

Expected: `45`

- [ ] **Step 4: Commit**

```bash
git add arckit-claude/commands/adr.md arckit-claude/commands/risk.md arckit-claude/commands/stakeholders.md arckit-claude/commands/data-model.md arckit-claude/commands/data-mesh-contract.md arckit-claude/commands/conformance.md arckit-claude/commands/dpia.md arckit-claude/commands/evaluate.md arckit-claude/commands/score.md arckit-claude/commands/operationalize.md arckit-claude/commands/roadmap.md arckit-claude/commands/secure.md arckit-claude/commands/mod-secure.md arckit-claude/commands/jsp-936.md arckit-claude/commands/devops.md arckit-claude/commands/finops.md arckit-claude/commands/backlog.md arckit-claude/commands/traceability.md arckit-claude/commands/dld-review.md arckit-claude/commands/hld-review.md arckit-claude/commands/sow.md arckit-claude/commands/dos.md arckit-claude/commands/tcop.md arckit-claude/commands/maturity-model.md arckit-claude/commands/atrs.md arckit-claude/commands/plan.md arckit-claude/commands/presentation.md arckit-claude/commands/aws-research.md arckit-claude/commands/azure-research.md arckit-claude/commands/gcp-research.md
git commit -m "feat: add effort: high frontmatter to 30 structured commands"
```

---

## Task 3: Add `effort` to 6 agent files

**Files:**

- Modify: `arckit-claude/agents/arckit-research.md` — add `effort: max` after `disallowedTools:` line
- Modify: `arckit-claude/agents/arckit-datascout.md` — add `effort: max`
- Modify: `arckit-claude/agents/arckit-framework.md` — add `effort: max`
- Modify: `arckit-claude/agents/arckit-aws-research.md` — add `effort: high`
- Modify: `arckit-claude/agents/arckit-azure-research.md` — add `effort: high`
- Modify: `arckit-claude/agents/arckit-gcp-research.md` — add `effort: high`

- [ ] **Step 1: Add effort to all 6 agent files**

Insert `effort:` line after existing frontmatter fields (`maxTurns`, `disallowedTools`) but before `description:`. Example for `arckit-research.md`:

```yaml
---
name: arckit-research
maxTurns: 50
disallowedTools: ["Edit"]
effort: max
description: |
```

For `arckit-aws-research.md` (and azure/gcp):

```yaml
---
name: arckit-aws-research
maxTurns: 40
disallowedTools: ["Edit"]
effort: high
description: |
```

- [ ] **Step 2: Verify all 6 agent files have effort**

Run:

```bash
grep -c "effort:" arckit-claude/agents/arckit-*.md | grep -v ":0"
```

Expected: 6 files shown, none with `:0`.

Run:

```bash
grep "effort: max" arckit-claude/agents/arckit-*.md
```

Expected: `arckit-research.md`, `arckit-datascout.md`, `arckit-framework.md`

Run:

```bash
grep "effort: high" arckit-claude/agents/arckit-*.md
```

Expected: `arckit-aws-research.md`, `arckit-azure-research.md`, `arckit-gcp-research.md`

- [ ] **Step 3: Commit**

```bash
git add arckit-claude/agents/arckit-research.md arckit-claude/agents/arckit-datascout.md arckit-claude/agents/arckit-framework.md arckit-claude/agents/arckit-aws-research.md arckit-claude/agents/arckit-azure-research.md arckit-claude/agents/arckit-gcp-research.md
git commit -m "feat: add effort frontmatter to 6 agent files"
```

---

## Task 4: Update converter to strip `effort` from output

**Files:**

- Modify: `scripts/converter.py:268-270` — add `frontmatter.pop("effort", None)` after extracting frontmatter fields

- [ ] **Step 1: Add effort stripping to converter**

In `scripts/converter.py`, in the `convert()` function, after line 270 (`handoffs = frontmatter.get("handoffs", [])`), add:

```python
        handoffs = frontmatter.get("handoffs", [])

        # Strip effort field — only meaningful for Claude Code plugin
        frontmatter.pop("effort", None)
```

This ensures `effort` is not passed through to any of the format_output calls or included in generated frontmatter for Codex/OpenCode/Gemini/Copilot.

- [ ] **Step 2: Verify converter runs without errors**

Run:

```bash
python scripts/converter.py
```

Expected: Completes successfully, printing conversion output for all formats.

- [ ] **Step 3: Verify effort is NOT in generated output**

Run:

```bash
grep -r "effort:" .codex/ .opencode/ arckit-gemini/ arckit-codex/ arckit-opencode/ arckit-copilot/ 2>/dev/null | grep -v ".pyc" | head -20
```

Expected: No matches (effort stripped from all non-Claude output).

- [ ] **Step 4: Verify effort IS still in plugin source files**

Run:

```bash
grep -c "effort:" arckit-claude/commands/*.md arckit-claude/agents/*.md | grep -v ":0" | wc -l
```

Expected: `51` (45 commands + 6 agents)

- [ ] **Step 5: Commit converter change and regenerated files**

```bash
git add scripts/converter.py .codex/ .opencode/ arckit-gemini/ arckit-codex/ arckit-opencode/ arckit-copilot/
git commit -m "feat: strip effort frontmatter in converter for non-Claude targets"
```

---

## Task 5: Update CLAUDE.md documentation

**Files:**

- Modify: `CLAUDE.md:90` — add `effort` to Slash Command System description
- Modify: `CLAUDE.md:108-119` — add `effort` to Handoffs Schema example
- Modify: `CLAUDE.md:160` — already documents `effort` for agents, no change needed

- [ ] **Step 1: Update Slash Command System section**

At line 90 in CLAUDE.md, update the plugin description to mention `effort`:

Change:

```text
**Plugin (Claude Code)**: `arckit-claude/commands/{name}.md` - YAML frontmatter + prompt, loaded via plugin auto-discovery. Frontmatter supports `handoffs:` for machine-readable next-step workflow metadata (see schema below)
```

To:

```text
**Plugin (Claude Code)**: `arckit-claude/commands/{name}.md` - YAML frontmatter + prompt, loaded via plugin auto-discovery. Frontmatter supports `effort:` for model effort override and `handoffs:` for machine-readable next-step workflow metadata (see schema below)
```

- [ ] **Step 2: Add `effort` to Handoffs Schema example**

In the Handoffs Schema section (around line 108), update the example to include `effort`:

Change:

```yaml
---
description: Create comprehensive business and technical requirements
handoffs:
  - command: data-model
```

To:

```yaml
---
description: Create comprehensive business and technical requirements
effort: max
handoffs:
  - command: data-model
```

- [ ] **Step 3: Add effort field documentation to Handoffs Schema section**

After the handoffs field descriptions, add documentation for the `effort` field. After the closing of the handoffs fields list, add:

```markdown
**Effort field** (optional): Overrides the session effort level when the command is invoked. Valid values: `low`, `medium`, `high`, `max` (requires Opus 4.6). Only set on commands that benefit from deeper reasoning — simple utility commands inherit the session default. The converter strips this field for non-Claude targets.
```

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document effort frontmatter field in CLAUDE.md"
```

---

## Task 6: Final verification

- [ ] **Step 1: Count all commands with effort vs without**

Run:

```bash
echo "Commands with effort: $(grep -l 'effort:' arckit-claude/commands/*.md | wc -l)"
echo "Commands without effort: $(ls arckit-claude/commands/*.md | wc -l | xargs -I{} expr {} - $(grep -l 'effort:' arckit-claude/commands/*.md | wc -l))"
echo "Agents with effort: $(grep -l 'effort:' arckit-claude/agents/*.md | wc -l)"
```

Expected: 45 with effort, 19 without, 6 agents with effort.

- [ ] **Step 2: Verify no effort in non-Claude outputs**

Run:

```bash
grep -r "^effort:" arckit-gemini/ arckit-codex/ arckit-opencode/ arckit-copilot/ .codex/ .opencode/ 2>/dev/null
```

Expected: No output (all stripped).

- [ ] **Step 3: Spot-check a max command**

Run:

```bash
head -6 arckit-claude/commands/requirements.md
```

Expected: Frontmatter includes `effort: max`.

- [ ] **Step 4: Spot-check a high command**

Run:

```bash
head -6 arckit-claude/commands/adr.md
```

Expected: Frontmatter includes `effort: high`.

- [ ] **Step 5: Spot-check a default command (no effort)**

Run:

```bash
head -6 arckit-claude/commands/customize.md
```

Expected: No `effort:` line in frontmatter.
