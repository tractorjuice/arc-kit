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
  //    unknown-type, allow-plugin-internals deny, ...).
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

  // 5) permissionDecision:'allow', updatedToolOutput, {} -> nothing to inject.
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

  let raw = '';
  try { raw = readFileSync(0, 'utf8'); } catch { raw = ''; }

  // Apply the path guard (Claude `if:` equivalent) before spawning anything.
  if (guard) {
    let filePath = '';
    try {
      const data = JSON.parse(raw);
      filePath = (data && data.tool_input && data.tool_input.file_path) || '';
    } catch { filePath = ''; }
    if (!pathMatchesGuard(filePath, guard)) process.exit(0);
  }

  // basename() prevents a wired target from escaping the hooks directory.
  const targetPath = join(HERE, basename(target));
  const child = spawnSync(process.execPath, [targetPath], {
    input: raw,
    encoding: 'utf8',
    timeout: 60000,
  });

  // Child crashed or was not found: fail open (Kimi treats any exit that is
  // not 2 as "allow" anyway).
  if (child.error) process.exit(0);

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
