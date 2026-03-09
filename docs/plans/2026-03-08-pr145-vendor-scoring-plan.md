# PR 145 Vendor Scoring Completion — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make PR 145 (`feat/vendor-scoring`) merge-ready by fixing review issues and adding missing deliverables.

**Architecture:** Cherry-pick PR 145's commit onto `feat/project-search` (which has 58 commands), fix code issues in score-validator.mjs, fix hooks.json structure, then add all missing documentation and converter output for 58→59 count.

**Tech Stack:** Node.js/ESM (hook fixes), Python (converter), Markdown/HTML (docs), Git

---

### Task 1: Create branch and cherry-pick PR 145

**Files:**
- No file changes

**Step 1: Create branch from feat/project-search**

Run: `git checkout feat/project-search && git checkout -b feat/vendor-scoring`
Expected: New branch created

**Step 2: Cherry-pick PR 145's commit**

Run: `gh pr view 145 --json commits --jq '.commits[0].oid'`
Then: `git fetch origin pull/145/head:pr-145-temp && git cherry-pick <SHA>`
Expected: Commit applied (may need conflict resolution on hooks.json)

**Step 3: If hooks.json conflicts, resolve**

Our `feat/project-search` branch already has the search hook entry. The PR 145 diff adds a new Write matcher block under PreToolUse. Take both changes, but we'll restructure the hooks.json in the next task.

---

### Task 2: Fix score-validator.mjs — use parseHookInput()

**Files:**
- Modify: `arckit-claude/hooks/score-validator.mjs`

**Step 1: Replace manual stdin parsing with parseHookInput()**

Replace lines 18-38 (the manual stdin read + JSON parse) with:

```javascript
import { basename } from 'node:path';
import { isDir, isFile, parseHookInput } from './hook-utils.mjs';
import { DOC_TYPES } from '../config/doc-types.mjs';

const data = parseHookInput();
```

Remove the `import { readFileSync } from 'node:fs';` line since `parseHookInput()` handles it.

**Step 2: Add evidence non-empty validation**

In the vendor scores validation loop (after the score range check), add:

```javascript
      if (!s.evidence || !s.evidence.trim()) {
        warnings.push(`Vendor '${vendorKey}' criterion ${s.criterionId || '?'}: missing evidence (every score must cite supporting evidence)`);
      }
```

**Step 3: Verify ESM imports work**

Run: `node -e "import('./arckit-claude/hooks/score-validator.mjs')" 2>&1 || echo "Import check done"`
Expected: No syntax errors

---

### Task 3: Fix hooks.json — merge into existing Write block

**Files:**
- Modify: `arckit-claude/hooks/hooks.json`

**Step 1: Remove the duplicate Write matcher block**

PR 145 adds a separate `"matcher": "Write"` block under PreToolUse. Instead, add `score-validator.mjs` to the **existing** `"matcher": "Write"` block (the one with `validate-arc-filename.mjs`).

The existing PreToolUse Write block should become:

```json
{
  "matcher": "Write",
  "hooks": [
    {
      "type": "command",
      "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/validate-arc-filename.mjs",
      "timeout": 5
    },
    {
      "type": "command",
      "command": "node ${CLAUDE_PLUGIN_ROOT}/hooks/score-validator.mjs",
      "timeout": 5
    }
  ]
}
```

Remove the duplicate standalone Write matcher block that PR 145 added.

**Step 2: Validate JSON**

Run: `node -e "JSON.parse(require('fs').readFileSync('arckit-claude/hooks/hooks.json','utf8')); console.log('Valid JSON')"`
Expected: "Valid JSON"

---

### Task 4: Copy guide to plugin directory

**Files:**
- Copy: `docs/guides/score.md` → `arckit-claude/docs/guides/score.md`

**Step 1: Copy and verify**

Run: `cp docs/guides/score.md arckit-claude/docs/guides/score.md && diff docs/guides/score.md arckit-claude/docs/guides/score.md`
Expected: No differences

---

### Task 5: Run converter

**Files:**
- Generated: `arckit-codex/skills/arckit-score/SKILL.md` (and agents/openai.yaml)
- Generated: `arckit-opencode/commands/arckit.score.md`
- Generated: `arckit-gemini/commands/arckit/score.toml`

**Step 1: Run converter**

Run: `python scripts/converter.py`
Expected: Converter runs without errors

**Step 2: Verify score files generated**

Run: `ls arckit-codex/skills/arckit-score/SKILL.md arckit-opencode/commands/arckit.score.md arckit-gemini/commands/arckit/score.toml`
Expected: All 3 exist

---

### Task 6: Update all documentation (58→59)

**Files:**
- Modify: `docs/DEPENDENCY-MATRIX.md`
- Modify: `README.md`
- Modify: `docs/commands.html`
- Modify: `docs/index.html`
- Modify: `docs/README.md`
- Modify: `CHANGELOG.md`
- Modify: `CLAUDE.md`
- Modify: All extension/plugin/guide files with "58" command counts

**Step 1: DEPENDENCY-MATRIX.md**

a) Update "Commands Documented: 58" → "Commands Documented: 59"

b) Add score to the Tier 5 Procurement section description:
```markdown
- **score** → Depends on: evaluate (M), requirements (M)
  - Note: Structured vendor scoring with JSON storage, comparison, and audit trail
  - Integrates with evaluate criteria; scores stored in `projects/{id}/vendors/scores.json`
```

c) Add changelog entry at top of Changelog section:
```markdown
### 2026-03-08 - Added Vendor Scoring Command

- **Added**: `/arckit.score` command (59th ArcKit command) for structured vendor scoring with JSON storage, comparison, and audit trail
- **Added**: score row and column to dependency matrix
- **Updated**: Tier 5 Procurement to include score command
- **Dependencies**: evaluate (M), requirements (M)
- **Consumed by**: sow (O), pages (R)
- **Updated**: Commands Documented count from 58 to 59
- **Note**: First command to use structured JSON output instead of Markdown; includes PreToolUse validator hook for scores.json integrity
```

**Step 2: README.md**

a) Update all "58" command count references to "59"

b) Add score row to Procurement table (after `/arckit.evaluate`):
```markdown
| `/arckit.score` | Score vendor proposals with structured storage, side-by-side comparison, sensitivity analysis, and audit trail | — | 🔵 Beta |
```

**Step 3: docs/commands.html**

a) Update "58 ArcKit AI Commands" → "59 ArcKit AI Commands" in heading and all meta/count references

b) Add score row in Procurement section (after evaluate row):
```html
                    <tr data-status="beta" data-category="procurement">
                        <td><code>/arckit.score</code></td>
                        <td class="description">Score vendor proposals with structured storage, side-by-side comparison, sensitivity analysis, and audit trail</td>
                        <td>Procurement</td>
                        <td class="examples">—</td>
                        <td><span class="app-status-tag app-status-beta">Beta</span></td>
                    </tr>
```

**Step 4: docs/index.html**

Update all "58" meta description and body text references to "59"

**Step 5: docs/README.md**

a) Add to documentation coverage table:
```markdown
| `/arckit.score` | [score.md](guides/score.md) | ✅ Complete |
```

b) Update "58/58 commands documented" → "59/59 commands documented"

**Step 6: CHANGELOG.md**

Add under [Unreleased] → Added:
```markdown
- `/arckit.score` command for structured vendor scoring with JSON storage, comparison, sensitivity analysis, and audit trail
```

**Step 7: CLAUDE.md**

Update "58 slash commands" → "59 slash commands"

**Step 8: Sweep all "58" command count references to "59"**

Same pattern as PR 146's sweep — update all extension READMEs, plugin files, guides, marketplace.json, getting-started.html, etc.

---

### Task 7: Commit and push

**Step 1: Stage all changes**

Run: `git add -A` (then verify no sensitive files with `git diff --cached --name-only`)

**Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
feat: vendor scoring with structured storage and audit trail

Cherry-picked from PR #145 with fixes:
- Use parseHookInput() instead of manual stdin parsing
- Add evidence non-empty validation to score-validator
- Merge score-validator into existing Write matcher block (not duplicate)
- Run converter for Codex/OpenCode/Gemini extension formats
- Copy guide to plugin directory
- Update DEPENDENCY-MATRIX.md (59 commands, Tier 5 Procurement entry)
- Update all docs and command counts (58→59)
- Add CHANGELOG entry

Supersedes #145.

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

**Step 3: Push**

Run: `git push -u origin feat/vendor-scoring`

---

### Task 8: Create PR and verify

**Step 1: Create PR**

```bash
gh pr create --base main --head feat/vendor-scoring --title "feat: vendor scoring with structured storage and audit trail" --body "$(cat <<'EOF'
## Summary

Adds `/arckit:score` for persistent, auditable vendor scoring — completing the procurement workflow chain (`evaluate → score → compare → sow`).

Cherry-picked from #145 with code fixes and complete documentation.

### Code fixes from review
- Use `parseHookInput()` from hook-utils.mjs (consistent with all other hooks)
- Add `evidence` non-empty validation to score-validator
- Merge score-validator into existing Write matcher block (was duplicate)

### Deliverables added
- Converter output for Codex/OpenCode/Gemini extensions
- Guide copied to plugin directory
- DEPENDENCY-MATRIX entry (Tier 5 Procurement, depends on evaluate (M))
- Command counts 58→59 across all docs, extensions, and manifests
- CHANGELOG entry

Supersedes #145 (fork PR).

## Test plan

- [ ] JSON validation of hooks.json
- [ ] ESM import validation of score-validator.mjs
- [ ] Score a vendor and verify scores.json structure
- [ ] Compare sub-action with 2+ vendors
- [ ] Validator catches out-of-range scores and missing evidence
- [ ] Converter output validates

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Step 2: Comment on PR 145**

Run: `gh pr comment 145 --body "Superseded by #<NEW_PR> ..."`

**Step 3: Run markdownlint**

Run: `npx markdownlint-cli2 "docs/DEPENDENCY-MATRIX.md" "CHANGELOG.md" "README.md" "docs/README.md"`
Expected: 0 errors
