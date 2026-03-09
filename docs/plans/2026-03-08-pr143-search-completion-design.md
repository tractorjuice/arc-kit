# Design: Make PR 143 (Project Search) Merge-Ready

**Date**: 2026-03-08
**PR**: #143 — feat: project search command with pre-processing hook
**Branch**: `feat/project-search`

## Context

PR 143 adds `/arckit:search` — keyword, type, and requirement ID search across all project artifacts. The core implementation (hook, command, guide) is solid and follows established patterns. This design covers the missing deliverables needed to make the PR merge-ready.

## Approach

Check out `feat/project-search`, add missing items per the "Adding a New Slash Command" checklist, commit, push.

## Work Items

1. **Run `scripts/converter.py`** — generates Codex skills, OpenCode commands, and Gemini extension TOML. Converter handles path rewriting and format conversion automatically.

2. **Update `docs/DEPENDENCY-MATRIX.md`** — add `search` row. Search has no hard prerequisites but benefits from existing project artifacts.

3. **Update `docs/index.html`** — add search to the command listing.

4. **Update `README.md`** — bump command count from 57 to 58, add search to the command table.

5. **Update `CHANGELOG.md`** — add entry under next version section.

6. **Copy guide to plugin** — ensure `docs/guides/search.md` is also at `arckit-claude/guides/search.md`.

## Out of Scope

- No changes to `search-scan.mjs` (working, follows patterns)
- No changes to `search.md` command (well-structured with proper handoffs)
- No changes to `hooks.json` (correctly registered)
- No template file needed (search is a query command, doesn't generate documents)
- `extractPreview` edge case left as-is (matches existing hook patterns)
