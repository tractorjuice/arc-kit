# Design: Make PR 145 (Vendor Scoring) Merge-Ready

**Date**: 2026-03-08
**PR**: #145 — feat: vendor scoring with structured storage and audit trail
**Branch**: `feat/vendor-scoring` (based on `feat/project-search` for 58→59 count)

## Context

PR 145 adds `/arckit:score` — vendor scoring with structured JSON storage, side-by-side comparison, sensitivity analysis, and audit trail. Includes a PreToolUse validator hook for scores.json integrity. Core code is solid; needs code fixes from review and missing deliverables.

## Code Fixes

1. **`score-validator.mjs`**: Replace manual stdin parsing (lines 22-38) with `parseHookInput()` from `hook-utils.mjs`
2. **`score-validator.mjs`**: Add `evidence` non-empty validation — warn if empty string, don't block
3. **`hooks.json`**: Merge score-validator into existing `"matcher": "Write"` PreToolUse block (line 75) instead of creating a duplicate matcher block

## Missing Deliverables

4. **Run `scripts/converter.py`** — generate Codex skills, OpenCode commands, Gemini TOML
5. **Copy guide** — `docs/guides/score.md` → `arckit-claude/docs/guides/score.md`
6. **Update `docs/DEPENDENCY-MATRIX.md`**:
   - Add `score` row and column to DSM (Tier 5 Procurement)
   - Dependencies: evaluate (M), requirements (M)
   - Consumed by: sow (O), pages (R)
   - Update count 58→59
   - Add changelog entry
7. **Update `README.md`** — count 58→59, add score to Procurement table
8. **Update `docs/commands.html`** — count 58→59, add table row
9. **Update `docs/index.html`** — count 58→59 in meta descriptions
10. **Update `CHANGELOG.md`** — add entry under [Unreleased]
11. **Update all extension/plugin/guide 58→59** (same sweep as PR 146)
12. **Update `CLAUDE.md`** — count 58→59

## Out of Scope

- No changes to `score.md` command (well-structured)
- No template file (outputs JSON, not markdown)
- Guide content unchanged (clear with good examples)
