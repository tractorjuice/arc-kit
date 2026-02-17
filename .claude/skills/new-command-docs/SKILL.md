---
name: new-command-docs
description: "This skill should be used when a new ArcKit command has been added and documentation needs updating across the repository. Triggers: update documentation for new command, update command count, add command to README, update DEPENDENCY-MATRIX, update docs/index.html, new command documentation checklist, update all docs for new command, add command to dependency matrix, update command tables, sync documentation after adding command, I added a new command what do I update, post-command documentation, new slash command docs."
---

# New Command Documentation Checklist

When a new ArcKit command is added, **11 files** across the repository must be updated to reflect the new command. This skill provides the complete checklist and exact patterns for each update.

## Pre-flight Checks

Before starting, verify these files exist for the new command:

1. **Command file**: `arckit-plugin/commands/{name}.md` (required)
2. **Template file**: `.arckit/templates/{name}-template.md` AND `arckit-plugin/templates/{name}-template.md` (required for document-generating commands, skip for utility commands like `customize`, `pages`, `trello`)
3. **Guide file**: `docs/guides/{name}.md` AND `arckit-plugin/guides/{name}.md` (create if missing, see Guide Creation below)

If any required file is missing, create it before proceeding. Templates should be identical between `.arckit/templates/` and `arckit-plugin/templates/`. Guides should be identical between `docs/guides/` and `arckit-plugin/guides/` (except `migration.md` and `customize.md` which have path differences).

## Determine the New Count

Read the current count from `arckit-plugin/.claude-plugin/plugin.json` (the `description` field contains the current count, e.g., "48 slash commands"). The new count is current + 1.

## Update Checklist

Work through these 11 files in order. For exact grep patterns, insertion formats, and line-level detail, see [references/file-locations.md](references/file-locations.md).

### 1. README.md (root)

Update **4 count locations** and add a **command table row**:

- **Line ~35**: `"all {N} commands, autonomous agents"` (Claude Code plugin section)
- **Line ~41**: `"all {N} commands, templates, scripts"` (Gemini extension section)
- **Line ~742**: `"All {N} ArcKit commands with maturity status"` (Command Reference intro)
- **Line ~995**: `"the {N}x{N} command matrix"` (Reference packs section)
- **Command table**: Add a row in the appropriate category section (Foundation, Strategic Context, Requirements & Data, Research & Strategy, Cloud Research, Data Source Discovery, Procurement, Design & Architecture, Implementation, Quality & Governance, UK Government, UK MOD, Documentation & Publishing). Insert alphabetically within the category.

**Table row format**:
```markdown
| `/arckit.{name}` | Description of what the command does | [v1](link) [v2](link) | Status |
```

Status values: `Live`, `Beta`, `Experimental`

### 2. docs/index.html

Update **8 count locations** and add an **HTML command card**. See [references/html-patterns.md](references/html-patterns.md) for the full HTML template.

Count locations (search for the old number):
- `<meta name="description">` tag (~line 6)
- `<meta property="og:description">` tag (~line 10)
- Intro paragraph "{N} AI-assisted commands" (~line 459)
- `<h2>` heading "{N} ArcKit Commands" (~line 670)
- `<span id="visible-count">` and adjacent text (~line 729): `Showing <span id="visible-count">{N}</span> of {N} commands` (TWO numbers on this line)
- Gemini CLI section "all {N} commands" (~line 1423)
- Footer "All {N} commands documented" (~line 1558)

**Important**: The `visible-count` span and its adjacent count BOTH need updating. The JavaScript filter counter uses the span, while the static text shows the total.

### 3. arckit-plugin/.claude-plugin/plugin.json

Update the `description` field count:
```json
"description": "Enterprise Architecture Governance & Vendor Procurement Toolkit - {N} slash commands for generating architecture artifacts"
```

### 4. .claude-plugin/marketplace.json (root)

Update the `description` field count:
```json
"description": "{N} slash commands for enterprise architecture artifacts, vendor procurement, and UK Government compliance"
```

### 5. arckit-plugin/README.md

Check for any command count references and update. Look for patterns like "{N} commands" or "{N} slash commands".

### 6. DEPENDENCY-MATRIX.md

This is the most complex update. See [references/dependency-matrix-format.md](references/dependency-matrix-format.md) for detailed format.

Steps:
1. **Add column**: Add `| {name} ` to the header row (line 20) in alphabetical position among existing commands
2. **Add cells**: Add `|  |` (empty cell) to every existing row at the same column position
3. **Fill dependencies**: In each existing command's row, fill in M/R/O if the new command consumes that command's output
4. **Add row**: Add a new row for the command with its dependencies on other commands
5. **Update tier groupings**: Add the command to the appropriate tier section (Tier 0-12)
6. **Update critical paths**: Add to relevant workflow paths if applicable
7. **Update version section**: Bump "Commands Documented" count
8. **Add changelog entry**: Add a dated entry at the top of the Changelog section

**Changelog entry format**:
```markdown
### YYYY-MM-DD - Added {Command Name} Command
- **Added**: `/arckit.{name}` command ({N}th ArcKit command) for {description}
- **Added**: {name} row and column to dependency matrix
- **Updated**: Tier {X} {Tier Name} to include {name} command
- **Dependencies**: {dep1} (M), {dep2} (R), {dep3} (O)
- **Consumed by**: {consumer1} (M/R/O), {consumer2} (M/R/O)
```

### 7. WORKFLOW-DIAGRAMS.md

If the new command fits into existing workflow paths, add it to the relevant Mermaid diagrams. See [references/dependency-matrix-format.md](references/dependency-matrix-format.md) for Mermaid node format and style colors.

Not all commands need to appear in workflow diagrams. Skip if the command is a utility (customize, pages) or doesn't fit the sequential workflow model.

### 8. docs/README.md

Add a row to the **Documentation Coverage** table and update the **coverage count**:

```markdown
| `/arckit.{name}` | [{name}.md](guides/{name}.md) | Complete |
```

Insert alphabetically or in the same position as other files in its category. Update the coverage line:
```markdown
**Coverage**: {N}/{N} commands documented (100%)
```

### 9. CLAUDE.md

Update if needed:
- **Command count references**: Search for "48 commands" or similar counts
- **Multi-instance types list**: If the new command supports multi-instance documents (like ADR, DIAG, WARD, DMC, DFD), add it to the multi-instance list in the `generate-document-id.sh` section
- **Agent System table**: If the command delegates to an agent, add it to the agent table

### 10. CHANGELOG.md (root - CLI changelog)

Add an entry under a new or existing version section:
```markdown
### Added
- `/arckit.{name}` command for {description}
```

### 11. arckit-plugin/CHANGELOG.md (plugin changelog)

Add an entry under a new or existing version section:
```markdown
### Added
- `/arckit.{name}` command for {description}
```

## Guide Creation

If `docs/guides/{name}.md` doesn't exist, create one based on an existing guide as a template. Good templates to copy from:

- **Simple command**: `docs/guides/plan.md` or `docs/guides/adr.md`
- **Research command**: `docs/guides/research.md` or `docs/guides/aws-research.md`
- **Compliance command**: `docs/guides/principles-compliance.md`
- **Operations command**: `docs/guides/devops.md`

A guide should contain:
1. Title and description
2. Prerequisites (which artifacts should exist first)
3. Usage examples with sample arguments
4. What the command produces (document type, filename pattern)
5. Tips and best practices

Remember to copy the guide to both `docs/guides/` and `arckit-plugin/guides/`.

## Post-Update Verification

After completing all updates, verify no old counts remain:

1. **Grep for old count**: Search the entire repo for the old number pattern (e.g., "48 commands", "48 slash commands", "48 AI-assisted"). Any remaining matches are locations you missed.
2. **Grep for new count**: Verify the new count appears in all expected locations.
3. **Check the command exists in**: README.md table, docs/index.html card, DEPENDENCY-MATRIX.md row/column, docs/README.md coverage table.

```bash
# Example verification (replace 48 with old count, 49 with new count)
grep -rn "48 commands\|48 slash commands\|48 AI-assisted\|48/48" README.md docs/index.html arckit-plugin/.claude-plugin/plugin.json .claude-plugin/marketplace.json docs/README.md DEPENDENCY-MATRIX.md
```

## Run Converter

After all documentation updates, regenerate Codex and Gemini formats:

```bash
python scripts/converter.py
```

## References

- [references/file-locations.md](references/file-locations.md) - Exact file paths, grep patterns, and insertion points
- [references/html-patterns.md](references/html-patterns.md) - HTML command card template for docs/index.html
- [references/dependency-matrix-format.md](references/dependency-matrix-format.md) - DSM format, changelog format, Mermaid diagram format
