# Hook-Aware Converter Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the converter aware of hook dependencies so that platforms without hooks get self-contained commands instead of broken references.

**Architecture:** Extend `AGENT_CONFIG` with hook capability flags, add a `rewrite_hook_dependencies()` function that swaps the context injection note for self-scan instructions, and add a standalone command override lookup for commands that are entirely hook-dependent (pages).

**Tech Stack:** Python (`scripts/converter.py`), Markdown standalone commands (`arckit-claude/commands-standalone/`).

**Design doc:** `docs/plans/2026-03-08-hook-aware-converter-design.md`

---

### Task 1: Add hook capability flags to AGENT_CONFIG

**Files:**
- Modify: `scripts/converter.py:96-133`

**Step 1: Add flags to each config entry**

In `scripts/converter.py`, add `"has_context_hook": False` and `"has_sync_guides_hook": False` to the `codex_extension`, `codex_skills`, and `opencode` entries. Add `"has_context_hook": True` and `"has_sync_guides_hook": False` to the `gemini` entry (Gemini has `context-inject.py`).

After the change, the four entries should include:

```python
"codex_extension": {
    ...
    "has_context_hook": False,
    "has_sync_guides_hook": False,
},
"codex_skills": {
    ...
    "has_context_hook": False,
    "has_sync_guides_hook": False,
},
"opencode": {
    ...
    "has_context_hook": False,
    "has_sync_guides_hook": False,
},
"gemini": {
    ...
    "has_context_hook": True,
    "has_sync_guides_hook": False,
},
```

**Step 2: Verify syntax**

Run: `python -c "exec(open('scripts/converter.py').read()); print('valid')"`
Expected: `valid`

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat: add hook capability flags to AGENT_CONFIG"
```

---

### Task 2: Add the context hook note constants

**Files:**
- Modify: `scripts/converter.py` (add constants after `EXTENSION_FILE_ACCESS_BLOCK`)

**Step 1: Add the find/replace constants**

Add these two constants after the `EXTENSION_FILE_ACCESS_BLOCK` definition (after line 91), before the `AGENT_CONFIG` block:

```python
CONTEXT_HOOK_NOTE = (
    "> **Note**: The ArcKit Project Context hook has already detected all "
    "projects, artifacts, external documents, and global policies. Use that "
    "context below \u2014 no need to scan directories manually."
)

CONTEXT_HOOK_REPLACEMENT = (
    "> **Note**: Before generating, scan `projects/` for existing project "
    "directories. For each project, list all `ARC-*.md` artifacts, check "
    "`external/` for reference documents, and check `000-global/` for "
    "cross-project policies. If no external docs exist but they would "
    "improve output, ask the user."
)
```

**Step 2: Verify the find string matches actual commands**

Run: `python -c "exec(open('scripts/converter.py').read()); print(repr(CONTEXT_HOOK_NOTE))"`
Expected: The exact string that appears in 43 commands.

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat: add context hook note constants for replacement"
```

---

### Task 3: Add `rewrite_hook_dependencies()` function

**Files:**
- Modify: `scripts/converter.py` (add function after `rewrite_paths()`)

**Step 1: Add the function**

Insert this function after `rewrite_paths()` (after line 153):

```python
def rewrite_hook_dependencies(prompt, config):
    """Replace hook-dependent content for platforms without hooks."""
    result = prompt

    # Context injection: replace hook note with self-scan instructions
    if not config.get("has_context_hook", False):
        result = result.replace(CONTEXT_HOOK_NOTE, CONTEXT_HOOK_REPLACEMENT)

    return result
```

**Step 2: Verify syntax**

Run: `python -c "exec(open('scripts/converter.py').read()); print('valid')"`
Expected: `valid`

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat: add rewrite_hook_dependencies() function"
```

---

### Task 4: Wire `rewrite_hook_dependencies()` into `convert()` and add standalone override lookup

**Files:**
- Modify: `scripts/converter.py` — the `convert()` function

**Step 1: Add standalone override lookup at the top of the per-agent loop**

In the `convert()` function, inside the `for agent_id, config in AGENT_CONFIG.items():` loop (around line 215), before the `rewritten = rewrite_paths(prompt, config)` line, add logic to check for a standalone override:

```python
        for agent_id, config in AGENT_CONFIG.items():
            # Check for standalone command override (for hookless platforms)
            standalone_path = os.path.join(
                os.path.dirname(commands_dir), "commands-standalone", filename
            )
            if os.path.isfile(standalone_path):
                # Use standalone version if platform lacks required hook
                needs_standalone = not config.get("has_sync_guides_hook", False)
                if needs_standalone:
                    with open(standalone_path, "r") as f:
                        standalone_content = f.read()
                    _, standalone_prompt = extract_frontmatter_and_prompt(standalone_content)
                    rewritten = rewrite_paths(standalone_prompt, config)
                    # Skip rewrite_hook_dependencies — standalone is self-contained
                else:
                    rewritten = rewrite_paths(prompt, config)
            else:
                rewritten = rewrite_paths(prompt, config)
                rewritten = rewrite_hook_dependencies(rewritten, config)
```

This replaces the existing `rewritten = rewrite_paths(prompt, config)` line.

**Step 2: Verify syntax**

Run: `python -c "exec(open('scripts/converter.py').read()); print('valid')"`
Expected: `valid`

**Step 3: Commit**

```bash
git add scripts/converter.py
git commit -m "feat: wire rewrite_hook_dependencies and standalone overrides into convert()"
```

---

### Task 5: Create standalone pages command

**Files:**
- Create: `arckit-claude/commands-standalone/pages.md`

**Step 1: Extract the pre-hook pages command**

Run: `git show 'c40418a^:arckit-plugin/commands/pages.md' > arckit-claude/commands-standalone/pages.md`

This gets the 568-line version that had full inline logic for scanning projects, reading artifacts, and generating the docs site — before the sync-guides hook replaced all that with "Steps 0-4: Handled by Hook".

**Step 2: Verify the file has the full inline logic**

Run: `wc -l arckit-claude/commands-standalone/pages.md`
Expected: 568 lines

Run: `head -10 arckit-claude/commands-standalone/pages.md`
Expected: Frontmatter with description, then the full command prompt.

**Step 3: Rewrite paths for standalone context**

The extracted file uses `${CLAUDE_PLUGIN_ROOT}` paths. These will be rewritten automatically by `rewrite_paths()` during conversion, so no manual changes needed.

**Step 4: Commit**

```bash
git add arckit-claude/commands-standalone/pages.md
git commit -m "feat: add standalone pages command for hookless platforms"
```

---

### Task 6: Run converter and verify output

**Files:** None modified (verification only)

**Step 1: Run the converter**

Run: `python scripts/converter.py`
Expected: Normal output showing all commands converted for all 4 targets. No errors.

**Step 2: Verify context hook replacement in Codex output**

Run: `grep -l "Before generating, scan" arckit-codex/prompts/*.md | wc -l`
Expected: 43 (all commands that had the hook note now have the self-scan replacement)

Run: `grep -l "ArcKit Project Context hook has already" arckit-codex/prompts/*.md | wc -l`
Expected: 0 (no commands still reference the hook)

**Step 3: Verify context hook NOT replaced in Gemini output**

Run: `grep -l "ArcKit Project Context hook has already" arckit-gemini/commands/arckit/*.toml | wc -l`
Expected: 43 (Gemini has the context hook, so the note should remain)

**Step 4: Verify pages standalone used for Codex**

Run: `wc -l arckit-codex/prompts/arckit.pages.md`
Expected: Significantly longer than other commands (close to 568 lines of content)

Run: `grep -c "Handled by Hook" arckit-codex/prompts/arckit.pages.md`
Expected: 0 (standalone version has no hook references)

**Step 5: Verify pages standalone used for OpenCode**

Run: `grep -c "Handled by Hook" arckit-opencode/commands/arckit.pages.md`
Expected: 0

**Step 6: Commit converted output**

```bash
git add arckit-codex/ arckit-opencode/ arckit-gemini/
git commit -m "chore: regenerate extension commands with hook-aware converter"
```

---

### Task 7: Update GitHub issues

**Files:** None

**Step 1: Close issue #138**

```bash
gh issue close 138 --comment "Fixed in $(git log --oneline -1 HEAD). The converter now replaces the context hook note with self-scan instructions for platforms without hooks (Codex, OpenCode). Gemini retains the original note since it has context-inject.py."
```

**Step 2: Close issue #139**

```bash
gh issue close 139 --comment "Fixed in $(git log --oneline -1 HEAD). The converter now uses a standalone pages command from commands-standalone/pages.md for platforms without the sync-guides hook. The standalone version has full inline logic for scanning projects and generating the docs site."
```

**Step 3: No commit needed**

Issues are closed on GitHub, no file changes.
