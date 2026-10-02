#!/usr/bin/env node
/**
 * ArcKit SubagentStart Hook — Inject Project Context into ArcKit Subagents
 *
 * UserPromptSubmit hooks fire only on actual user prompts. A subagent runs
 * in an isolated context and does NOT inherit the parent thread's
 * UserPromptSubmit-injected project context, so a subagent whose prompt
 * assumes "the ArcKit Project Context hook has already detected all
 * projects, artifacts, …" would otherwise work blind.
 *
 * This hook closes that gap for ArcKit-owned subagents:
 *
 *   1. Fire on SubagentStart and read `agent_type`, plugin-scoped
 *      ("arckit:arckit-framework") or bare ("arckit-framework"). Skip if:
 *        - the bare name doesn't start with "arckit-", or the plugin scope
 *          isn't an ArcKit plugin (Plan, Explore, general-purpose and other
 *          plugins' agents never get ArcKit context they didn't ask for);
 *        - the name ends with "-reader" or "-writer" (the reader/writer
 *          tier of the orchestrator pattern takes strict JSON payloads;
 *          prose context would pollute the schema discipline).
 *   2. Build the same project-context block the UserPromptSubmit hook
 *      builds (shared module — `project-context-builder.mjs`).
 *   3. Return it as `hookSpecificOutput.additionalContext`, which Claude
 *      Code adds to the subagent's own conversation before its first prompt.
 *
 * Until 6.17.3 this was a PreToolUse hook on `Agent` that prepended the
 * context to the dispatched prompt by rewriting the Agent call. The Claude
 * plugin directory reads any PreToolUse input rewrite as the plugin acting
 * on its own behalf and declined the core plugin for it. SubagentStart
 * delivers the same context without touching the tool call.
 *
 * Hook Type: SubagentStart
 * Input (stdin):
 *   { hook_event_name: "SubagentStart", agent_type, cwd, ... }
 * Output (stdout):
 *   On inject:  {hookSpecificOutput: {hookEventName: "SubagentStart", additionalContext}}
 *   On skip:    silent pass-through (exit 0, no JSON).
 *
 * Exit code 0 always — pass-through is a non-decision, not a failure.
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { buildProjectContext } from './project-context-builder.mjs';

/** Whether a SubagentStart agent_type should receive ArcKit project context. */
export function wantsContext(agentType) {
  const name = String(agentType || '');
  const cut = name.lastIndexOf(':');
  const scope = cut < 0 ? '' : name.slice(0, cut);
  const bare = name.slice(cut + 1);
  if (scope && scope !== 'arckit' && !scope.startsWith('arckit-')) return false;
  if (!bare.startsWith('arckit-')) return false;
  return !/-(reader|writer)$/.test(bare);
}

/** Decide the hook output for one input. Returns an object to print, or null. */
export function decide(data, build = buildProjectContext) {
  if (data.hook_event_name && data.hook_event_name !== 'SubagentStart') return null;
  if (!wantsContext(data.agent_type)) return null;
  const repoRoot = findRepoRoot(data.cwd || process.cwd());
  if (!repoRoot) return null;
  const contextText = build(repoRoot);
  if (!contextText) return null;
  return {
    hookSpecificOutput: {
      hookEventName: 'SubagentStart',
      additionalContext: contextText,
    },
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const out = decide(parseHookInput());
  if (out) console.log(JSON.stringify(out));
  process.exit(0);
}
