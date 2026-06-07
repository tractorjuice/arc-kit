#!/usr/bin/env node
/**
 * ArcKit PreToolUse Hook — Inject Project Context on Agent Dispatch
 *
 * UserPromptSubmit hooks fire only on actual user prompts. When the LLM
 * dispatches a subagent via the `Agent` tool, that subagent runs in an
 * isolated context — it does NOT inherit the parent thread's
 * UserPromptSubmit-injected project context. Subagents whose prompt
 * assumes "the ArcKit Project Context hook has already detected all
 * projects, artifacts, …" silently lose that context.
 *
 * This hook closes that gap for ArcKit-owned subagents:
 *
 *   1. Match PreToolUse against tool_name === 'Agent'.
 *   2. Read tool_input.subagent_type. Skip if:
 *        - The name doesn't start with "arckit-" (we don't want to
 *          spam Plan/Explore/general-purpose agents with ArcKit-
 *          specific context they didn't ask for).
 *        - The name ends with "-reader" or "-writer" (the reader/writer
 *          tier of the orchestrator pattern takes strict JSON payloads;
 *          prepending prose context would pollute the schema discipline
 *          and confuse the subagent).
 *   3. Build the same project-context block the UserPromptSubmit hook
 *      builds (shared module — `project-context-builder.mjs`).
 *   4. Emit `updatedInput` with the context prepended to the dispatched
 *      `prompt` field. Per https://code.claude.com/docs/en/hooks.md the
 *      PreToolUse hook's `updatedInput` is the supported mechanism for
 *      mutating tool params before dispatch — `additionalContext` only
 *      lands in the parent thread, not the subagent's context.
 *
 * Hook Type: PreToolUse (matcher: Agent)
 * Input (stdin):
 *   { tool_name: "Agent", tool_input: {subagent_type, prompt, ...}, cwd, ... }
 * Output (stdout):
 *   On inject:  {hookSpecificOutput: {hookEventName, updatedInput: {...}}}
 *   On skip:    silent pass-through (exit 0, no JSON).
 *
 * Exit code 0 always — pass-through is a non-decision, not a failure.
 */

import { findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { buildProjectContext } from './project-context-builder.mjs';

const data = parseHookInput();

if (data.tool_name !== 'Agent') process.exit(0);

const input = data.tool_input || {};
const subagentType = String(input.subagent_type || '');
const dispatchedPrompt = String(input.prompt || '');

// Scope: only ArcKit-owned subagents — never spam Plan / Explore /
// general-purpose / claude-code-guide / etc. with our project context.
if (!subagentType.startsWith('arckit-')) process.exit(0);

// Skip the strict-payload tier: reader and writer subagents take
// schema-validated JSON inputs. Injecting prose context would either
// fail schema validation downstream or, worse, confuse the subagent
// into treating the context as part of the JSON payload.
if (/-(reader|writer)$/.test(subagentType)) process.exit(0);

// Build the same context block the UserPromptSubmit hook builds.
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const contextText = buildProjectContext(repoRoot);
if (!contextText) process.exit(0);

// Prepend the context to the dispatched prompt. Newline pair separates
// the injected block from the actual instruction so the subagent sees
// the boundary clearly.
const newPrompt = `${contextText}\n\n---\n\n${dispatchedPrompt}`;

const output = {
  hookSpecificOutput: {
    hookEventName: 'PreToolUse',
    updatedInput: { ...input, prompt: newPrompt },
  },
};
console.log(JSON.stringify(output));
