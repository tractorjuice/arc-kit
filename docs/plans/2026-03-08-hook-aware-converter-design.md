# Hook-Aware Converter Design

**Date:** 2026-03-08
**Issues:** #138, #139
**Scope:** Converter changes only — no modifications to Claude Code source commands

## Summary

The converter (`scripts/converter.py`) blindly copies command prompts with path rewrites, ignoring hook dependencies. 42 commands reference a context injection hook that doesn't exist on Codex/OpenCode, and `/arckit.pages` is a complete no-op on all non-Claude platforms because it assumes the `sync-guides` hook did all the work.

## Architecture

```text
converter.py
  ├── AGENT_CONFIG (extended with hook capability flags)
  ├── rewrite_paths()          — existing, unchanged
  ├── rewrite_hook_dependencies()  — NEW
  │     ├── Context injection: replace standard block with self-scan instructions
  │     └── Other hook refs: strip gracefully
  └── convert()
        └── For each command:
              ├── Check commands-standalone/ for platform override
              ├── If override exists → use it instead of source command
              └── If no override → run rewrite_paths() + rewrite_hook_dependencies()
```

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where to fix | Converter only | Don't modify source commands — they're correct for Claude Code |
| Context injection (42 cmds) | Standard block replacement | One paragraph swap, no duplicate files needed |
| Pages command | Standalone override file | Too different for a text replacement — pre-hook version had full inline logic |
| Hook capability tracking | Flags in AGENT_CONFIG | Consistent with existing config-driven approach |
| Self-scan instructions | Single standard block for all 42 commands | Simple, consistent, sufficient |

## AGENT_CONFIG Changes

Add two flags per platform:

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
    "has_context_hook": True,   # context-inject.py exists
    "has_sync_guides_hook": False,
},
```

## `rewrite_hook_dependencies(prompt, config)`

New function called after `rewrite_paths()`.

### Context Injection Replacement

For platforms where `has_context_hook` is `False`, find and replace the standard block.

**Find:**
```
> **Note**: The ArcKit Project Context hook has already detected all projects, artifacts, external documents, and global policies. Use that context below — no need to scan directories manually.
```

**Replace with:**
```
> **Note**: Before generating, scan `projects/` for existing project directories. For each project, list all `ARC-*.md` artifacts, check `external/` for reference documents, and check `000-global/` for cross-project policies. If no external docs exist but they would improve output, ask the user.
```

### Other Hook References

Strip gracefully — remove lines that reference specific hooks by name if the platform doesn't support them.

## `commands-standalone/` Directory

```text
arckit-claude/
  commands/                  ← hook-dependent (source of truth for Claude Code)
  commands-standalone/       ← self-contained overrides for hookless platforms
    pages.md                 ← based on pre-hook version (commit c40418a^)
```

The converter checks `commands-standalone/{name}.md` first. If it exists, uses that for platforms without the required hook. Otherwise falls back to the standard command with `rewrite_hook_dependencies()` applied.

## What Gets Fixed

| Issue | Fix |
|-------|-----|
| #138 — 42 commands reference missing context hook | Standard block replacement in `rewrite_hook_dependencies()` |
| #139 — pages is a no-op | Standalone `pages.md` used for Codex/OpenCode/Gemini |
| Future hook-heavy commands | Add standalone version to `commands-standalone/` |

## Out of Scope

- Gemini context injection (already works via `context-inject.py`)
- Governance/health/traceability scan hooks (graceful fallback already exists)
- Post-processing manifest hook (low priority)
- Changes to Claude Code source commands
