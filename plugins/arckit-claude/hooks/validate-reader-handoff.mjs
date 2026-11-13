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
 *     sanitised payload (updatedToolOutput) and adds a one-line verdict.
 *     Otherwise (invalid, no JSON, or a reader that did not complete) it
 *     replaces the result with a neutral "withheld" note and adds the errors,
 *     which the orchestrator quotes in its single re-dispatch. The errors
 *     name schema positions only and quote nothing the reader wrote. Of the
 *     result's other fields, only Claude Code's own run details keep their text. A
 *     launch receipt (`async_launched`) carries no reader output, so its
 *     result is left alone and a note says the report will arrive where this
 *     check can't see it, and how to check it.
 *
 *     This path can't hold a reply back when the hook itself doesn't run
 *     (no Node, a timeout): Claude Code has already produced the result, and
 *     a failed PostToolUse hook can only add a message. The commands
 *     therefore count a report as checked only when this hook's verdict
 *     follows it or it came through SubagentHandback, and run the validator
 *     themselves on any other. See docs/ENFORCEMENT.md.
 *
 *   PreToolUse on SubagentHandback: in auto mode (Claude Code v2.1.271+) a
 *     subagent hands its report back through this tool, and the Agent result
 *     then carries only a note. The hook runs inside the reader and validates
 *     `tool_input.message`. A hand-back that is already exactly the sanitised
 *     payload passes untouched; anything else is denied, with the schema
 *     errors or with the instruction to hand back the bare JSON (no prose, no
 *     code fence, no invisible characters), so the reader fixes its own
 *     output. A deny is a gate, not a grant: nothing is allowed that would
 *     otherwise have prompted, and no tool input is ever rewritten.
 *
 * No PreToolUse path rewrites a tool's input. The Claude
 * plugin directory reads that as the plugin acting on its own behalf, and
 * declined the core plugin for it. Until 6.17.3 this hook also rewrote Agent
 * dispatches to run in the foreground and to carry the plugin-qualified name;
 * the commands now ask for both, Claude Code itself rejects a bare name, and
 * READER-PATTERN.md has orchestrators wait for a background report.
 *
 * Anything that isn't a known reader passes through with no output.
 *
 * Hook Types: PostToolUse (matcher Agent|Task), PreToolUse (matcher SubagentHandback)
 * Exit code 0 always.
 */

import { isMainModule } from './hook-utils.mjs';
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
  'arckit-evaluate-reader': 'evaluate-handoff.schema.json',
};

// A bidder can't be scored on part of a bid, so a failed read isn't a gap to note and move past.
const ONE_BIDDER = new Set(['arckit-evaluate-reader']);

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

/** Whether a hand-back message is already the sanitised payload, byte for byte once parsed. */
function isExactPayload(message, payload) {
  if (typeof message !== 'string') return false;
  try {
    return JSON.stringify(JSON.parse(message)) === JSON.stringify(payload);
  } catch {
    return false;
  }
}

// checkHandoff's errors name schema positions and quote nothing from the
// payload (see reportable() in validate-handoff.mjs). The cut is a second
// bound, not the control: a path is short, and a message can list a schema's
// own keys or enum values.
const clip = (s, max = 200) => {
  const t = String(s);
  return t.length > max ? `${t.slice(0, max)}…` : t;
};

function formatErrors(errors) {
  const shown = errors.slice(0, 20).map((e) => `- ${clip(e.path)}: ${clip(e.msg, 600)}`);
  if (errors.length > 20) shown.push(`- … and ${errors.length - 20} more`);
  return shown.join('\n');
}

function agentText(toolResponse) {
  if (typeof toolResponse === 'string') return toolResponse;
  const content = toolResponse && Array.isArray(toolResponse.content) ? toolResponse.content : [];
  return content.filter((b) => b && b.type === 'text').map((b) => b.text).join('\n');
}

// Fields of an Agent result that Claude Code or the orchestrator wrote, never
// the reader. Read from a live result on Claude Code v2.1.323 and from the
// hooks reference.
const RESULT_FIELDS = new Set([
  'status', 'prompt', 'description', 'agentId', 'agentType', 'resolvedModel', 'modelsUsed',
  'totalDurationMs', 'totalTokens', 'totalToolUseCount', 'usage', 'canContinueAgent',
  'harnessNoteCount', 'harnessTailCount', 'harnessSectionHash', 'outputFile',
]);

/** A value with every string in it emptied: the same keys and types, no text. */
function withoutText(value) {
  if (typeof value === 'string') return '';
  if (Array.isArray(value)) return value.map(withoutText);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withoutText(v)]));
  }
  return value;
}

/**
 * Replace the reply text of an Agent result. The fields listed above are kept
 * as they are. Any other field keeps its key and its shape, so the result
 * still looks like an Agent result to Claude Code, but every string in it is
 * emptied: a field this hook has never seen can't carry reader text past the
 * check.
 */
function replaceText(response, text) {
  if (typeof response !== 'object' || response === null) return text;
  const kept = {};
  for (const [k, v] of Object.entries(response)) {
    if (k !== 'content') kept[k] = RESULT_FIELDS.has(k) ? v : withoutText(v);
  }
  return { ...kept, content: [{ type: 'text', text }] };
}

/** How the orchestrator checks a report this hook never saw. */
function selfCheck(reader) {
  const script = resolve(__dirname, '..', 'scripts', 'validate-handoff.mjs');
  const schema = resolve(SCHEMAS, READER_SCHEMAS[reader]);
  return `save the report's JSON to a temporary file and run: node "${script}" "${schema}" <that file>. Use only what it prints: on exit 0 the sanitised payload, otherwise its errors[], which use up the reader's one re-dispatch`;
}

/** A background or teammate launch receipt: Claude Code's own text, no reader output yet. */
const isLaunchReceipt = (status) => /_(?:launched|spawned)$/.test(status);

export const WITHHELD = '[ArcKit: reader reply withheld because it did not pass the handoff check]';

/** Decide the hook output for one input. Returns an object to print, or null. */
export function decide(data) {
  const event = data.hook_event_name;
  const tool = data.tool_name;

  if (event === 'PreToolUse' && tool === 'SubagentHandback') {
    const reader = readerName(data.agent_type);
    if (!reader) return null;
    const input = data.tool_input || {};
    const result = checkReader(reader, input.message);
    if (result.ok) {
      if (isExactPayload(input.message, result.payload)) return null;
      return {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason:
            `ArcKit handoff check: your report is valid against ${result.schema}, but the hand-back must be the bare JSON payload. ` +
            'Hand back only the JSON object: no prose around it, no code fence, and no invisible or control characters.',
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
    const status = response && typeof response === 'object' ? response.status : undefined;
    if (status && status !== 'completed') {
      if (isLaunchReceipt(status)) {
        return {
          hookSpecificOutput: {
            hookEventName: 'PostToolUse',
            additionalContext: `ArcKit handoff check (${reader}): this reader was not run in the foreground, so its report will arrive later in a notification, which this check does not see. Wait for it. A report the reader handed back through SubagentHandback was validated at hand-back; use it. Any other report is unchecked: don't use it as it stands and don't pass it to a writer. Instead, ${selfCheck(reader)}. If it still can't be checked, ${ONE_BIDDER.has(reader) ? 'leave this vendor unscored and state why' : 'log the gap'}.`,
          },
        };
      }
      return {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          updatedToolOutput: replaceText(response, WITHHELD),
          additionalContext: `ArcKit handoff check (${reader}): the reader did not complete (status ${clip(JSON.stringify(status))}), so its reply was withheld unvalidated. Re-dispatch the reader once; if that also fails, ${ONE_BIDDER.has(reader) ? 'leave this vendor unscored and state why' : 'log the gap'}.`,
        },
      };
    }
    const text = agentText(response);
    const result = checkReader(reader, text);
    if (result.ok) {
      return {
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          updatedToolOutput: replaceText(response, JSON.stringify(result.payload)),
          additionalContext: `ArcKit handoff check (${reader}, ${result.schema}): valid. The reply above is the sanitised payload; use it as the validated handoff.`,
        },
      };
    }
    const noJson = result.errors.length === 1 && result.errors[0].msg === 'no JSON payload found in the reply';
    const verdict = noJson
      ? `ArcKit handoff check (${reader}): no JSON in this reply, so it was withheld. If the reader handed its report back through SubagentHandback, that report was validated and sanitised at hand-back; use it. Otherwise re-dispatch the reader once, asking for the JSON payload only.`
      : `ArcKit handoff check (${reader}, ${result.schema}): INVALID. The reply was withheld. Re-dispatch the reader once, quoting these errors:\n${formatErrors(result.errors)}`;
    return {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        updatedToolOutput: replaceText(response, WITHHELD),
        additionalContext: verdict,
      },
    };
  }
  return null;
}

/**
 * What to do when the check itself breaks. A reader's reply is untrusted until
 * checked, so it's held back rather than passed on unvalidated. Anything that
 * isn't one of our readers is left alone.
 */
export function onCheckFailed(data) {
  if (data.hook_event_name === 'PreToolUse' && data.tool_name === 'SubagentHandback') {
    if (!readerName(data.agent_type)) return null;
    return {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: 'ArcKit handoff check: the check itself failed, so your report can\'t be accepted. Stop and report that it failed.',
      },
    };
  }
  if (data.hook_event_name === 'PostToolUse' && readerName((data.tool_input || {}).subagent_type)) {
    return {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        updatedToolOutput: replaceText(data.tool_response, WITHHELD),
        additionalContext: 'ArcKit handoff check: the check itself failed, so the reply was withheld unvalidated.',
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
  if (!data || typeof data !== 'object') process.exit(0);
  let out = null;
  try {
    out = decide(data);
  } catch (e) {
    process.stderr.write(`[ArcKit] handoff check failed: ${e.message}\n`);
    out = onCheckFailed(data);
  }
  if (out) process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

if (isMainModule(import.meta.url)) {
  main();
}
