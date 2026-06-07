#!/usr/bin/env node
/**
 * ArcKit UserPromptSubmit Hook
 *
 * Pre-computes project context when any /arckit: command is run.
 * Injects project inventory, artifact lists, and external documents
 * via additionalContext so commands don't need to discover this themselves.
 *
 * Hook Type: UserPromptSubmit
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing project context
 *
 * Note: this hook only fires on actual user prompts. When the LLM
 * dispatches an arckit-* subagent via the Agent tool (or invokes a
 * skill), UserPromptSubmit does not fire — see inject-agent-context.mjs
 * (PreToolUse on the Agent tool) which handles that path.
 */

import { findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { buildProjectContext } from './project-context-builder.mjs';

const data = parseHookInput();

const userPrompt = data.prompt || '';

// Only run for /arckit: commands
if (!userPrompt.startsWith('/arckit:')) process.exit(0);

// Commands that don't need project context
const cmdMatch = userPrompt.match(/^\/arckit:([a-z_-]*)/);
if (cmdMatch) {
  const command = cmdMatch[1];
  if (['pages', 'customize', 'create', 'init', 'list', 'trello'].includes(command)) {
    process.exit(0);
  }
}

const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const contextText = buildProjectContext(repoRoot);
if (!contextText) process.exit(0);

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: contextText,
  },
};
console.log(JSON.stringify(output));
