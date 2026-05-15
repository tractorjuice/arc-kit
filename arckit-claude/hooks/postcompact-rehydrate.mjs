#!/usr/bin/env node
/**
 * ArcKit PostCompact Hook — Project Context Re-Injection
 *
 * Fires after /compact or auto-compaction. Re-injects the same project
 * context the UserPromptSubmit hook produces, so the summary doesn't
 * drop the active project, artifact inventory, external policies, or
 * governance state.
 *
 * Why: `keep-coding-instructions: true` (v2.1.94) preserves the static
 * command body across compaction, but dynamic project state (which
 * projects/ exist, which ARC-* artifacts each contains, which external
 * documents are cited, which global policies apply) is filesystem-derived
 * and would otherwise be lost in the summary until the user types the
 * next /arckit: prompt.
 *
 * Reuses `buildProjectContext` from project-context-builder.mjs — same
 * builder as `arckit-context.mjs` and `inject-agent-context.mjs`. No
 * new marker-file convention; the filesystem is the source of truth.
 *
 * Hook Type:  PostCompact (Claude Code v2.1.76+; v2.1.139 floor for ArcKit)
 * Input:      JSON hook input (no fields used)
 * Output:     JSON with hookSpecificOutput.additionalContext when a
 *             projects/ directory exists; empty object otherwise.
 */

import { findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { buildProjectContext } from './project-context-builder.mjs';

const data = parseHookInput();
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);

if (!repoRoot) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

const contextText = buildProjectContext(repoRoot);
if (!contextText) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

console.log(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'PostCompact',
    additionalContext: contextText,
  },
}));
process.exit(0);
