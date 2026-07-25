/**
 * ArcKit Provenance Model Helpers — pure model/effort logic for provenance-stamp.mjs.
 *
 * Kept separate (like session-nudge.mjs vs session-learner.mjs) so they can be
 * unit-tested by import without running the hook, which calls process.exit(0).
 *
 * CLAUDE-ONLY BY DESIGN: provenance-stamp.mjs is a Claude Code plugin hook. It
 * never runs under Codex, OpenCode, or any non-Claude model. Do NOT add
 * non-Claude ids (e.g. Kimi/Moonshot) to MODEL_EFFORTS — it would be a no-op.
 *
 * Pure: no fs, no git, no side effects on import. Unit-tested in
 * tests/plugin/provenance-model.test.mjs.
 */

// ── Effort downgrade matrix ────────────────────────────────────────────
// Mirrors the Claude Code harness: an effort level the active model does not
// support is silently downgraded to the highest supported level at or below the
// requested one. Ordering and per-model support are from the official docs:
// https://code.claude.com/docs/en/model-config (Adjust effort level).
//
// Levels, shallowest to deepest — `max` is the DEEPEST tier, above `xhigh`.
export const EFFORT_RANK = { low: 0, medium: 1, high: 2, xhigh: 3, max: 4 };

// Effort levels each Claude model supports, for models whose support is NOT the
// full set. Claude-only by design (see module header). A model ABSENT here is
// treated as supporting every level (no downgrade): that covers the full-support
// models (Opus 4.8 / 4.7 / 5, Sonnet 5, Fable 5) and any future model.
//
// Opus 4.6 and Sonnet 4.6 support `max` but NOT `xhigh` — a non-contiguous set a
// single cap could not express, so `xhigh` falls to `high`, not `max`. Haiku 4.5
// and other unlisted models do not support effort at all per the docs; the hook
// does not fabricate a downgrade for them (they never carry effort frontmatter
// in practice, so no effort row is stamped).
export const MODEL_EFFORTS = {
  'claude-opus-4-6': ['low', 'medium', 'high', 'max'],
  'claude-sonnet-4-6': ['low', 'medium', 'high', 'max'],
};

// Downgrade a requested effort to what the model actually runs: the requested
// level if supported, else the highest supported level at or below it.
export function downgradeEffort(requested, model) {
  if (!requested) return null;
  if (!model) return null;
  const supported = MODEL_EFFORTS[model];
  if (!supported) return requested; // full-support / unknown model: no downgrade
  if (supported.includes(requested)) return requested;
  const reqRank = EFFORT_RANK[requested];
  if (reqRank == null) return requested; // unknown level: leave untouched
  let best = null;
  let bestRank = -1;
  for (const level of supported) {
    const rank = EFFORT_RANK[level];
    if (rank <= reqRank && rank > bestRank) {
      best = level;
      bestRank = rank;
    }
  }
  return best ?? requested;
}

// Detect model from existing footer ("AI Model: claude-opus-4-7" or "Model: ...").
// Trusts the model's self-report — that's what's in the human-authored footer
// today and is the only source of truth until upstream Claude Code exposes
// the active model to hooks (see arc-kit#407).
export function extractModelFromContent(content) {
  // Character class covers provider prefixes (moonshotai/kimi-k3), colon/dot
  // versioned ids (us.anthropic.claude-...), and bracketed context suffixes
  // (claude-opus-4-8[1m]). `-` is last, brackets and slash are escaped.
  const m = content.match(/^\s*\*?\*?(?:AI )?Model\*?\*?:\s*`?([a-z0-9._:\/\[\]-]+)`?\s*$/im);
  return m ? m[1].trim() : null;
}
