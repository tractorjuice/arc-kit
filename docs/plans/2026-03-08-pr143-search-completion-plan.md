# PR 143 Search Command Completion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make PR 143 (`feat/project-search`) merge-ready by adding missing deliverables per the "Adding a New Slash Command" checklist.

**Architecture:** The core search implementation (hook, command, guide) is already written and solid. This plan only adds the surrounding documentation, converter output, and plugin guide copy that the checklist requires.

**Tech Stack:** Python (converter), Markdown (docs), HTML (commands.html, index.html), Git

---

### Task 1: Check out the PR branch

**Files:**
- No file changes

**Step 1: Fetch and check out the branch**

Run: `git fetch origin feat/project-search && git checkout feat/project-search`
Expected: Branch checked out successfully

**Step 2: Verify PR files exist**

Run: `ls arckit-claude/commands/search.md arckit-claude/hooks/search-scan.mjs docs/guides/search.md`
Expected: All 3 files listed

---

### Task 2: Copy guide to plugin directory

**Files:**
- Copy: `docs/guides/search.md` → `arckit-claude/guides/search.md`

**Step 1: Copy the guide**

Run: `cp docs/guides/search.md arckit-claude/guides/search.md`
Expected: File copied

**Step 2: Verify the copy**

Run: `diff docs/guides/search.md arckit-claude/guides/search.md`
Expected: No differences

---

### Task 3: Run the converter

**Files:**
- Generated: `arckit-codex/skills/arckit-search/SKILL.md`
- Generated: `arckit-opencode/commands/arckit.search.md`
- Generated: `arckit-gemini/commands/arckit/search.toml`
- Generated: `.codex/prompts/arckit.search.md` (Codex CLI format)
- Generated: `.opencode/commands/arckit.search.md` (OpenCode CLI format)

**Step 1: Run converter**

Run: `python scripts/converter.py`
Expected: Converter runs without errors, outputs summary of converted commands

**Step 2: Verify search files were generated**

Run: `ls arckit-codex/skills/arckit-search/SKILL.md arckit-opencode/commands/arckit.search.md arckit-gemini/commands/arckit/search.toml`
Expected: All 3 extension files exist

---

### Task 4: Update DEPENDENCY-MATRIX.md

**Files:**
- Modify: `docs/DEPENDENCY-MATRIX.md`

Search is a **diagnostic/utility command** — it queries existing artifacts but produces no output consumed by other commands. It has no mandatory dependencies. Per the existing pattern (health, customize, template-builder, start, init), it should NOT be added to the DSM table but noted in the utility exclusion list.

**Step 1: Update the Version section**

In `docs/DEPENDENCY-MATRIX.md`, update:

```markdown
- **Commands Documented**: 57
```

to:

```markdown
- **Commands Documented**: 58
```

**Step 2: Add search to the utility command exclusion note**

Update the note at line ~355:

```markdown
- **Note**: `/arckit.customize`, `/arckit.template-builder`, `/arckit.health`, `/arckit.init`, and `/arckit.start` are utility/diagnostic commands not in the matrix — they have no dependencies and produce no outputs consumed by other commands
```

to:

```markdown
- **Note**: `/arckit.customize`, `/arckit.template-builder`, `/arckit.health`, `/arckit.search`, `/arckit.init`, and `/arckit.start` are utility/diagnostic commands not in the matrix — they have no dependencies and produce no outputs consumed by other commands
```

**Step 3: Add changelog entry**

Add to the Changelog section at the top (after the DFD entry):

```markdown
### 2026-03-08 - Added Project Search Command

- **Added**: `/arckit.search` command (58th ArcKit command) for keyword, type, and requirement ID search across all project artifacts
- **Not in matrix**: Diagnostic/query command with console-only output — no dependencies and no outputs consumed by other commands
- **Updated**: Commands Documented count from 57 to 58
- **Note**: Uses UserPromptSubmit pre-processing hook (`search-scan.mjs`) to index artifacts before search
```

---

### Task 5: Update README.md

**Files:**
- Modify: `README.md`

**Step 1: Bump command count**

Find all instances of "57 commands" or "57 " (in context of command counts) and update to 58. Key locations:

- Line 43: `all 57 commands` → `all 58 commands`
- Any other "57" references in the command count context

**Step 2: Add search to the Quality & Governance command table**

In the Quality & Governance table (around line 1016, after the `/arckit.health` row), add:

```markdown
| `/arckit.search` | Search across all project artifacts by keyword, document type, or requirement ID | — | 🔵 Beta |
```

---

### Task 6: Update docs/commands.html

**Files:**
- Modify: `docs/commands.html`

**Step 1: Bump command count in heading**

Update line ~515:

```html
<h2 class="govuk-heading-l">57 ArcKit AI Commands</h2>
```

to:

```html
<h2 class="govuk-heading-l">58 ArcKit AI Commands</h2>
```

**Step 2: Add search command row**

In the Diagnostics section (after the `/arckit.health` row, around line 1247), add:

```html
                    <tr data-status="beta" data-category="governance">
                        <td><code>/arckit.search</code></td>
                        <td class="description">Search across all project artifacts by keyword, document type, or requirement ID</td>
                        <td>Quality & Governance</td>
                        <td class="examples">—</td>
                        <td><span class="app-status-tag app-status-beta">Beta</span></td>
                    </tr>
```

---

### Task 7: Update docs/index.html

**Files:**
- Modify: `docs/index.html`

**Step 1: Bump command count**

Update all "57" references in meta descriptions and content to "58":

- Line 7: `meta name="description"` — `57 AI-assisted commands` → `58 AI-assisted commands`
- Line 11: `og:description` — same change
- Line 18: `twitter:description` — same change
- Line 315: JSON-LD description — same change
- Line 392: body text — `57 AI-assisted commands` → `58 AI-assisted commands`

---

### Task 8: Update CHANGELOG.md

**Files:**
- Modify: `CHANGELOG.md`

**Step 1: Add entry under [Unreleased]**

After the `## [Unreleased]` heading (line 8), add:

```markdown

### Added

- `/arckit.search` command for keyword, type, and requirement ID search across all project artifacts with pre-processing hook
```

---

### Task 9: Commit and push

**Files:**
- No new files

**Step 1: Stage all changes**

Run: `git add arckit-claude/guides/search.md arckit-codex/ arckit-opencode/ arckit-gemini/ .codex/ .opencode/ docs/DEPENDENCY-MATRIX.md docs/commands.html docs/index.html README.md CHANGELOG.md`
Expected: Files staged

**Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
docs: complete search command deliverables for merge readiness

- Run converter to generate Codex/OpenCode/Gemini extension formats
- Copy guide to plugin directory (arckit-claude/guides/)
- Update DEPENDENCY-MATRIX.md (58 commands, utility exclusion note)
- Update README.md (command count, Quality & Governance table)
- Update commands.html and index.html (command count, table row)
- Update CHANGELOG.md with search command entry

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Step 3: Push**

Run: `git push origin feat/project-search`
Expected: Push succeeds

---

### Task 10: Verify

**Step 1: Confirm PR is updated**

Run: `gh pr view 143 --json commits --jq '.commits | length'`
Expected: 2 (original + our commit)

**Step 2: Run markdownlint on changed files**

Run: `npx markdownlint-cli2 "docs/DEPENDENCY-MATRIX.md" "CHANGELOG.md" "README.md"`
Expected: No errors
