/**
 * ArcKit Kimi hook adapter
 *
 * Kimi Code CLI plugin hooks share Claude Code's snake_case stdin contract
 * (`hook_event_name`, `tool_name`, `tool_input`, `cwd`, `session_id`) but
 * differ on OUTPUT. Kimi attaches a hook's stdout to context on exit 0 and
 * blocks on exit 2 (stderr becomes the reason) or a
 * `hookSpecificOutput.permissionDecision: "deny"` payload. ArcKit's hooks were
 * written for Claude, which instead reads structured stdout JSON
 * (`decision: "block"`, `hookSpecificOutput.additionalContext`, `updatedInput`,
 * `updatedToolOutput`, `permissionDecision`).
 *
 * This wrapper lets the UNMODIFIED Claude hooks run under Kimi. Kimi invokes:
 *
 *     node ./hooks/kimi-hook-adapter.mjs <target-hook>.mjs [path-guard]
 *
 * The adapter pipes Kimi's stdin straight to the child hook, captures the
 * child's Claude-shaped stdout, and re-expresses it in Kimi's contract. The
 * Claude hooks themselves are never edited, so their behaviour under Claude is
 * unchanged; every Claude->Kimi translation lives (and is unit-tested) in the
 * pure `translate()` below.
 *
 * Kimi's file tools are not Claude's. `WriteFile` takes `{path, content, mode}`
 * and `StrReplaceFile` takes `{path, edit: {old, new} | [{old, new}, ...]}`,
 * where Claude's `Write`/`Edit` take `file_path`, `content` and `new_string`.
 * `normalisePayload()` rewrites the stdin payload into Claude's shape before
 * the child sees it, so the hooks' `tool_name === 'Write'` checks and
 * `tool_input.file_path` reads work unchanged.
 *
 * The security guards (`SECURITY_GUARDS`) fail closed: when the payload cannot
 * be parsed, names no single target path, or the child crashes or times out,
 * the adapter blocks (exit 2) instead of allowing. Every other hook keeps
 * failing open so a broken validator never derails the user's turn.
 *
 * The optional third argument replaces Claude's per-hook `if:` path condition
 * (e.g. `Write(/projects/**)`), which Kimi's flat hook schema cannot express.
 * It is a substring matched against the normalised `tool_input.file_path`; when
 * it does not match, the child hook is skipped entirely. This is why hooks that
 * must only fire under the projects tree, the vendors/scores.json file, or the
 * wardley-maps directory stay scoped under Kimi.
 *
 * NOTE: this path has not yet been exercised against a live Kimi Code runtime
 * (project memory: the Kimi extension has never been smoke-tested). The
 * translation logic is unit-tested in isolation
 * (tests/plugin/test_kimi_hook_adapter.mjs); the end-to-end wiring still needs
 * one manual run against Kimi before it can be trusted.
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, basename } from 'node:path';
import { readFileSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Hooks that guard writes and must block when they cannot run. */
export const SECURITY_GUARDS = new Set(['file-protection.mjs', 'secret-file-scanner.mjs']);

// Tool names compared lowercased with separators stripped, so `WriteFile`,
// `write_file` and `Write` all map to the same Claude tool.
const WRITE_TOOLS = new Set(['write', 'writefile', 'createfile']);
const EDIT_TOOLS = new Set(['edit', 'editfile', 'multiedit', 'strreplacefile', 'strreplace', 'replacefile']);

const PATH_FIELDS = ['file_path', 'path', 'filePath', 'absolute_path', 'filename', 'file', 'target_file'];
const CONTENT_FIELDS = ['content', 'text', 'file_text'];
const NEW_TEXT_FIELDS = ['new_string', 'newString', 'new_str', 'new_text', 'new'];

function toolKey(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function strings(obj, fields) {
  if (!obj || typeof obj !== 'object') return [];
  return fields.map((f) => obj[f]).filter((v) => typeof v === 'string');
}

function editTexts(toolInput) {
  const texts = strings(toolInput, NEW_TEXT_FIELDS);
  for (const key of ['edit', 'edits']) {
    const value = toolInput[key];
    const list = Array.isArray(value) ? value : [value];
    for (const item of list) texts.push(...strings(item, NEW_TEXT_FIELDS));
  }
  return texts;
}

/**
 * Rewrite a Kimi PreToolUse/PostToolUse payload into the Claude shape the
 * hooks read. Pure for testing.
 *
 * - `tool_name`: Kimi `WriteFile` -> `Write`; `StrReplaceFile` (and other edit
 *   aliases) -> `Edit`. `WriteFile` in `append` mode becomes `Edit`, since the
 *   content is a fragment, not the whole file.
 * - `tool_input.file_path`: copied from Kimi's `path` (or another known path
 *   field) when absent.
 * - `tool_input.content` / `tool_input.new_string`: every text field the tool
 *   could write, joined, so the secret scanner sees all of it.
 *
 * @param {object} data  Parsed hook stdin.
 * @returns {{payload: object, kind: 'Write'|'Edit'|null, paths: string[]}}
 *   `kind` is null when the tool is not a recognised file write/edit; `paths`
 *   lists every distinct target path named in `tool_input`.
 */
export function normalisePayload(data) {
  if (!data || typeof data !== 'object') return { payload: data, kind: null, paths: [] };
  const toolInput = data.tool_input && typeof data.tool_input === 'object' ? data.tool_input : {};
  const paths = [...new Set(strings(toolInput, PATH_FIELDS).filter((p) => p.trim()))];

  const key = toolKey(data.tool_name);
  let kind = null;
  if (WRITE_TOOLS.has(key)) kind = toolInput.mode === 'append' ? 'Edit' : 'Write';
  else if (EDIT_TOOLS.has(key)) kind = 'Edit';
  if (!kind) return { payload: data, kind: null, paths };

  const input = { ...toolInput };
  if (paths.length) input.file_path = paths[0];
  const texts = [...strings(toolInput, CONTENT_FIELDS), ...editTexts(toolInput)];
  const joined = [...new Set(texts)].join('\n');
  if (kind === 'Write') {
    input.content = joined;
  } else {
    // An append fragment must not reach the whole-file Write validators.
    delete input.content;
    input.new_string = joined;
  }

  return { payload: { ...data, tool_name: kind, tool_input: input }, kind, paths };
}

/**
 * Decide, before spawning, whether a security guard must block because it
 * cannot inspect the call. Pure for testing.
 *
 * @param {object|null} data  Parsed stdin, or null when it did not parse.
 * @param {{kind: string|null, paths: string[]}} normalised
 * @returns {string|null} a block reason, or null to run the guard.
 */
export function securityPrecheck(data, normalised) {
  if (!data || typeof data !== 'object') {
    return 'ArcKit: could not parse the hook payload, so the write was not checked. Blocked.';
  }
  if (data.hook_event_name && data.hook_event_name !== 'PreToolUse') return null;
  const { kind, paths } = normalised;
  if (!kind && !paths.length) {
    return `ArcKit: unrecognised file tool '${data.tool_name || ''}' with no target path, `
      + 'so the protected-file and secret checks could not run. Blocked.';
  }
  if (!paths.length) {
    return `ArcKit: no target path found in the '${data.tool_name || ''}' call, `
      + 'so the protected-file and secret checks could not run. Blocked.';
  }
  if (paths.length > 1) {
    return `ArcKit: the '${data.tool_name || ''}' call names more than one target path `
      + `(${paths.join(', ')}). Use a single path. Blocked.`;
  }
  return null;
}

/**
 * Translate a Claude hook's result into a Kimi action. Pure: no I/O, no spawn,
 * so it is fully unit-testable without a running hook or a live Kimi.
 *
 * @param {string|null} childStdout  Raw stdout the Claude hook printed.
 * @param {number|null} childStatus  Child process exit code.
 * @param {string|null} childStderr  Raw stderr the Claude hook printed.
 * @returns {{stdout?: string, stderr?: string, exitCode: number}}
 *   `exitCode` 2 blocks the tool/prompt (stderr is the reason); `exitCode` 0
 *   allows, optionally attaching `stdout` as context.
 */
export function translate(childStdout, childStatus, childStderr) {
  // A child that already blocked via a non-zero exit is honoured verbatim.
  if (childStatus === 2) {
    return { stderr: String(childStderr || 'Blocked by ArcKit hook.'), exitCode: 2 };
  }

  let out = null;
  if (childStdout && childStdout.trim()) {
    try { out = JSON.parse(childStdout); } catch { out = null; }
  }
  // Non-JSON, empty, or `{}` output: nothing to inject, allow silently.
  if (!out || typeof out !== 'object') return { exitCode: 0 };

  const hso = out.hookSpecificOutput && typeof out.hookSpecificOutput === 'object'
    ? out.hookSpecificOutput
    : {};

  const decision = out.decision || hso.permissionDecision;
  const reason = out.reason || hso.permissionDecisionReason;

  // 1) Hard block (secret-detection, secret-file-scanner, validate-arc-filename
  //    unknown-type, file-protection deny, ...).
  if (decision === 'block' || decision === 'deny') {
    return { stderr: String(reason || 'Blocked by ArcKit hook.'), exitCode: 2 };
  }

  // 2) Input mutation (validate-arc-filename auto-correct). Kimi cannot rewrite
  //    tool input, so translate the intended fix into a block that names the
  //    correct filename.
  if (out.updatedInput && out.updatedInput.file_path) {
    return {
      stderr: `ArcKit: rename the file to '${basename(out.updatedInput.file_path)}' `
        + 'to match the naming convention, then retry.',
      exitCode: 2,
    };
  }

  // 3) Context injection -> Kimi attaches stdout text on exit 0.
  if (hso.additionalContext) {
    return { stdout: String(hso.additionalContext), exitCode: 0 };
  }

  // 4) Allow-with-warning (score-validator) -> surface as context, don't block.
  if (decision === 'allow' && reason) {
    return { stdout: String(reason), exitCode: 0 };
  }

  // 5) an allow decision, updatedToolOutput, {} -> nothing to inject.
  //    The hook's file-system side effects (provenance stamp, manifest, tidy)
  //    already ran inside the child; just allow.
  return { exitCode: 0 };
}

/**
 * Replicate Claude's per-hook `if:` path condition. `guard` is a substring
 * (e.g. `/projects/`, `/vendors/scores.json`, `/wardley-maps/`) that must
 * appear in the normalised file path for the hook to run. Pure for testing.
 *
 * @param {string} filePath  tool_input.file_path from the hook payload.
 * @param {string} guard     Required path substring, or empty/undefined.
 * @returns {boolean} true when the hook should run.
 */
export function pathMatchesGuard(filePath, guard) {
  if (!guard) return true;
  if (!filePath) return false;
  const norm = ('/' + String(filePath).replace(/\\/g, '/')).replace(/\/+/g, '/');
  return norm.includes(guard);
}

function main() {
  const target = process.argv[2];
  // Misconfiguration must never derail the user's turn.
  if (!target) process.exit(0);
  const guard = process.argv[3];
  const isSecurityGuard = SECURITY_GUARDS.has(basename(target));

  let raw = '';
  try { raw = readFileSync(0, 'utf8'); } catch { raw = ''; }

  let data = null;
  try { data = JSON.parse(raw); } catch { data = null; }
  let normalised = normalisePayload(data);

  if (isSecurityGuard) {
    const reason = securityPrecheck(data, normalised);
    if (reason) {
      process.stderr.write(reason);
      process.exit(2);
    }
    // An unrecognised tool that still names a path is checked as a Write.
    if (!normalised.kind) {
      normalised = normalisePayload({ ...data, tool_name: 'Write' });
    }
  }

  // Apply the path guard (Claude `if:` equivalent) before spawning anything.
  if (guard) {
    const payload = normalised.payload;
    const filePath = (payload && payload.tool_input && payload.tool_input.file_path) || '';
    if (!pathMatchesGuard(filePath, guard)) process.exit(0);
  }

  const input = data && typeof data === 'object' ? JSON.stringify(normalised.payload) : raw;

  // basename() prevents a wired target from escaping the hooks directory.
  const targetPath = join(HERE, basename(target));
  const child = spawnSync(process.execPath, [targetPath], {
    input,
    encoding: 'utf8',
    timeout: 60000,
  });

  // Child crashed, timed out or was not found: security guards fail closed,
  // everything else fails open.
  const crashed = child.error || child.signal || (child.status !== 0 && child.status !== 2);
  if (crashed) {
    if (isSecurityGuard) {
      process.stderr.write(`ArcKit: ${basename(target)} could not run, so the write was not checked. Blocked.`);
      process.exit(2);
    }
    process.exit(0);
  }

  const action = translate(child.stdout, child.status, child.stderr);
  if (action.stdout) process.stdout.write(action.stdout);
  if (action.stderr) process.stderr.write(action.stderr);
  process.exit(action.exitCode || 0);
}

// Run only when executed directly, so importing the module for unit tests does
// not read stdin or spawn a child.
if (process.argv[1] && basename(process.argv[1]) === 'kimi-hook-adapter.mjs') {
  main();
}
