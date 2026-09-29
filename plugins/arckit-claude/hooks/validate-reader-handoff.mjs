#!/usr/bin/env node
/**
 * ArcKit reader handoff check — validates and sanitises reader subagent output
 * without a Bash call.
 *
 * The research commands (research, datascout, grants, the three cloud
 * commands, the gov-* commands, tenders and competitors) dispatch reader
 * subagents that return a JSON payload. The orchestrator used to validate it
 * with a Bash block (mktemp, heredoc, validate-handoff.mjs, echo, rm), which
 * could only run without a prompt because a PreToolUse hook auto-approved any
 * command mentioning a plugin script. That grant is gone; this hook does the
 * same check in-process, so no command and no permission is involved.
 *
 * It handles the two ways a reader's report reaches the orchestrator:
 *
 *   PostToolUse on Agent (Task): the report comes back as the Agent result's
 *     text. The hook validates it. When valid, it replaces the result with the
 *     sanitised payload (updatedToolOutput) and adds a one-line verdict. When
 *     invalid, it leaves the result alone and adds the errors, which the
 *     orchestrator quotes in its single re-dispatch.
 *
 *   PreToolUse on SubagentHandback: in auto mode (Claude Code v2.1.271+) a
 *     subagent hands its report back through this tool, and the Agent result
 *     then carries only a note. The hook runs inside the reader, validates
 *     `tool_input.message`, and either replaces it with the sanitised payload
 *     (updatedInput) or denies the hand-back with the errors, so the reader
 *     fixes its own output. A deny is a gate, not a grant: nothing is allowed
 *     that would otherwise have prompted.
 *
 *   PreToolUse on Agent (Task): keeps ArcKit reader and writer dispatches in
 *     the foreground (run_in_background: false) and qualifies a bare agent
 *     name, so the PostToolUse check above always sees the reader's report.
 *
 * Anything that isn't a known reader passes through with no output.
 *
 * Hook Types: PostToolUse (matcher Agent|Task), PreToolUse (matchers SubagentHandback, Agent|Task)
 * Exit code 0 always.
 */

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkHandoff } from '../scripts/validate-handoff.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMAS = resolve(__dirname, '..', 'schemas');

// Reader agent -> handoff schema. Matches each command's former validator call.
export const READER_SCHEMAS = {
  'arckit-research-reader': 'research-handoff.schema.json',
  'arckit-datascout-reader': 'datascout-handoff.schema.json',
  'arckit-grants-reader': 'grants-handoff.schema.json',
  'arckit-gov-reuse-reader': 'gov-reuse-handoff.schema.json',
  'arckit-gov-code-search-reader': 'gov-repo-handoff.schema.json',
  'arckit-gov-landscape-reader': 'gov-repo-handoff.schema.json',
  'arckit-aws-research-reader': 'cloud-research-handoff.schema.json',
  'arckit-azure-research-reader': 'cloud-research-handoff.schema.json',
  'arckit-gcp-research-reader': 'cloud-research-handoff.schema.json',
  'arckit-tenders-reader': 'tenders-handoff.schema.json',
};

/** "arckit:arckit-research-reader" or "arckit-research-reader" -> "arckit-research-reader". */
export function readerName(agentType) {
  if (!agentType || typeof agentType !== 'string') return null;
  const name = agentType.slice(agentType.lastIndexOf(':') + 1);
  return Object.hasOwn(READER_SCHEMAS, name) ? name : null;
}

/**
 * Pull the JSON payload out of a reader's reply: the whole text if it parses,
 * else the first ```json fenced block, else the outermost {...}.
 * Returns the parsed value or undefined.
 */
export function extractJson(text) {
  if (typeof text !== 'string') return undefined;
  const tryParse = (s) => {
    try {
      return JSON.parse(s);
    } catch {
      return undefined;
    }
  };
  const whole = tryParse(text.trim());
  if (whole !== undefined && typeof whole === 'object') return whole;
  const fence = text.match(/```(?:json)?[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```/);
  if (fence) {
    const v = tryParse(fence[1]);
    if (v !== undefined && typeof v === 'object') return v;
  }
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first !== -1 && last > first) {
    const v = tryParse(text.slice(first, last + 1));
    if (v !== undefined && typeof v === 'object') return v;
  }
  return undefined;
}

export function checkReader(reader, text) {
  const schema = JSON.parse(readFileSync(resolve(SCHEMAS, READER_SCHEMAS[reader]), 'utf8'));
  const payload = extractJson(text);
  if (payload === undefined) {
    return { ok: false, errors: [{ path: '/', msg: 'no JSON payload found in the reply' }], schema: READER_SCHEMAS[reader] };
  }
  return { ...checkHandoff(schema, payload), schema: READER_SCHEMAS[reader] };
}

function formatErrors(errors) {
  const shown = errors.slice(0, 20).map((e) => `- ${e.path}: ${e.msg}`);
  if (errors.length > 20) shown.push(`- … and ${errors.length - 20} more`);
  return shown.join('\n');
}

function agentText(toolResponse) {
  if (typeof toolResponse === 'string') return toolResponse;
  const content = toolResponse && Array.isArray(toolResponse.content) ? toolResponse.content : [];
  return content.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
}

/** Decide the hook output for one input. Returns an object to print, or null. */
export function decide(data) {
  const event = data.hook_event_name;
  const tool = data.tool_name;

  // Keep ArcKit's reader and writer dispatches in the foreground. Since Claude
  // Code v2.1.198 a subagent runs in the background unless told otherwise; its
  // report then arrives as a notification rather than as the Agent result, so
  // the PostToolUse check below never sees it, and the notification ends the
  // command's turn-scoped allowed-tools grants. Also qualify a bare agent name
  // ("arckit-x-reader" -> "arckit:arckit-x-reader"), which Claude Code rejects
  // as "not found". This rewrites the tool's arguments; it grants nothing.
  if (event === 'PreToolUse' && (tool === 'Agent' || tool === 'Task')) {
    const input = data.tool_input || {};
    const type = input.subagent_type;
    if (typeof type !== 'string') return null;
    const bare = type.slice(type.lastIndexOf(':') + 1);
    if (!/^arckit-[a-z0-9-]+-(reader|writer)$/.test(bare)) return null;
    const qualified = type.includes(':') ? type : `arckit:${bare}`;
    if (input.run_in_background === false && qualified === type) return null;
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        updatedInput: { ...input, subagent_type: qualified, run_in_background: false },
      },
    };
  }

  if (event === 'PreToolUse' && tool === 'SubagentHandback') {
    const reader = readerName(data.agent_type);
    if (!reader) return null;
    const input = data.tool_input || {};
    const result = checkReader(reader, input.message);
    if (result.ok) {
      return {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          updatedInput: { ...input, message: JSON.stringify(result.payload) },
        },
      };
    }
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          `ArcKit handoff check: your report does not match ${result.schema}. ` +
          `Fix these and hand back only the corrected JSON payload:\n${formatErrors(result.errors)}`,
      },
    };
  }

  if (event === 'PostToolUse' && (tool === 'Agent' || tool === 'Task')) {
    const reader = readerName((data.tool_input || {}).subagent_type);
    if (!reader) return null;
    const response = data.tool_response;
    if (response && typeof response === 'object' && response.status && response.status !== 'completed') return null;
    const text = agentText(response);
    const result = checkReader(reader, text);
    if (result.ok) {
      const replaced = typeof response === 'object' && response !== null
        ? { ...response, content: [{ type: 'text', text: JSON.stringify(result.payload) }] }
        : JSON.stringify(result.payload);
      return {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          updatedToolOutput: replaced,
          additionalContext: `ArcKit handoff check (${reader}, ${result.schema}): valid. The reply above is the sanitised payload; use it as the validated handoff.`,
        },
      };
    }
    const noJson = result.errors.length === 1 && result.errors[0].msg === 'no JSON payload found in the reply';
    return {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: noJson
          ? `ArcKit handoff check (${reader}): no JSON in this reply. If the reader handed its report back through SubagentHandback, that report was validated and sanitised at hand-back; use it. Otherwise re-dispatch the reader once, asking for the JSON payload only.`
          : `ArcKit handoff check (${reader}, ${result.schema}): INVALID. Re-dispatch the reader once, quoting these errors:\n${formatErrors(result.errors)}`,
      },
    };
  }
  return null;
}

function main() {
  let raw = '';
  try {
    raw = readFileSync(0, 'utf8');
  } catch {
    process.exit(0);
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    process.exit(0);
  }
  let out = null;
  try {
    out = decide(data);
  } catch (e) {
    process.stderr.write(`[ArcKit] handoff check failed: ${e.message}\n`);
  }
  if (out) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
