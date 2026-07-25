/**
 * ArcKit Provenance Model Helpers — pure model/effort logic for provenance-stamp.mjs.
 *
 * Kept separate (like session-nudge.mjs vs session-learner.mjs) so they can be
 * unit-tested by import without running the hook, which calls process.exit(0).
 *
 * CLAUDE-ONLY BY DESIGN: provenance-stamp.mjs is a Claude Code plugin hook. It
 * never runs under Codex, OpenCode, or any non-Claude model. Do NOT add
 * non-Claude ids (e.g. Kimi/Moonshot) to MODEL_MAX_EFFORT — it would be a no-op.
 *
 * Pure: no fs, no git, no side effects on import. Unit-tested in
 * tests/plugin/provenance-model.test.mjs.
 */

// ── Effort downgrade matrix ────────────────────────────────────────────
// Mirrors the Claude Code harness behaviour: effort levels not supported
// by the active model are silently downgraded to the highest supported.
//
// KNOWN ISSUE (#669): this ranks `xhigh` above `max`, but CLAUDE.md documents
// `max` as the deepest tier, above `xhigh`. As a result `xhigh` on Opus 4.6
// downgrades to `max` here, where CLAUDE.md says it should fall to `high`. Left
// as-is pending verification against the actual harness; see #669.
export const EFFORT_RANK = { low: 0, medium: 1, high: 2, max: 3, xhigh: 4 };

// Claude-only by design (see module header). `claude-opus-4-8`: 'xhigh' is the
// top rank, so it never downgrades — the row is for explicitness, not behaviour.
//
// NOTE: these caps are entangled with the EFFORT_RANK ordering above. When #669
// corrects that ordering, revisit every cap here (models that support `max`
// must cap at 'max'), and note that this single-cap shape cannot represent
// Opus 4.6 / Sonnet 4.6 at all — they support `max` but not `xhigh`, a gap only
// a per-model supported set can express. See #669.
export const MODEL_MAX_EFFORT = {
  'claude-opus-4-8': 'xhigh',
  'claude-opus-4-7': 'xhigh',
  'claude-opus-4-6': 'max',
  'claude-sonnet-4-6': 'high',
  'claude-haiku-4-5': 'medium',
};

export function downgradeEffort(requested, model) {
  if (!requested) return null;
  if (!model) return null;
  const cap = MODEL_MAX_EFFORT[model];
  if (!cap) return requested;
  if (EFFORT_RANK[requested] <= EFFORT_RANK[cap]) return requested;
  return cap;
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
