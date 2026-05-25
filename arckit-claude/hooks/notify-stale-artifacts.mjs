#!/usr/bin/env node
/**
 * ArcKit Desktop Notification for Stale Artefacts
 *
 * Fires at SessionStart. Gated on the `desktop_notifications` userConfig
 * field being literally "true", read from the
 * `CLAUDE_PLUGIN_OPTION_DESKTOP_NOTIFICATIONS` env var that Claude Code
 * exports to plugin subprocesses. The env-var path degrades cleanly to
 * `undefined` when the field is unset, unlike `${user_config.*}`
 * substitution in hooks.json args which raises
 * `plugin option "desktop_notifications" isnt set` and aborts the hook
 * before it can run.
 *
 * When enabled and the existing detect-stale-artifacts.sh scan reports
 * stale items, this hook emits a SessionStart `terminalSequence` (Claude
 * Code v2.1.141+) carrying OSC 9 (iTerm2 / Windows Terminal / WezTerm /
 * ConEmu) and OSC 777 (urxvt / Ghostty / Warp) notification escapes,
 * stacked so any compatible terminal picks one. Terminals that ignore
 * the unfamiliar OSC code silently drop it — the allowlist guarantees
 * no cursor or color sequence ever reaches the screen.
 *
 * Complements the existing `stale-artifact-scan` monitor: the monitor
 * still streams per-line notifications mid-session; this hook only
 * pings the OS at session start when there is something to investigate.
 *
 * Hook Type: SessionStart
 * Input (stdin): JSON with session_id, cwd, etc.
 * Output (stdout): {} when disabled / no findings, otherwise JSON with
 *   hookSpecificOutput.terminalSequence and a short additionalContext.
 */

import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHookInput, isDir } from './hook-utils.mjs';

const data = parseHookInput();

const enabled = (process.env.CLAUDE_PLUGIN_OPTION_DESKTOP_NOTIFICATIONS || '').toLowerCase() === 'true';
if (!enabled) {
  process.stdout.write('{}');
  process.exit(0);
}

const cwd = data.cwd || process.cwd();
if (!isDir(join(cwd, 'projects'))) {
  process.stdout.write('{}');
  process.exit(0);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const detector = join(pluginRoot, 'scripts', 'bash', 'detect-stale-artifacts.sh');

const res = spawnSync('bash', [detector], {
  cwd,
  encoding: 'utf8',
  timeout: 5000,
  stdio: ['ignore', 'pipe', 'ignore'],
});

const stale = (res.stdout || '')
  .split('\n')
  .filter((l) => l.startsWith('[ArcKit monitor] STALE:'));

if (stale.length === 0) {
  process.stdout.write('{}');
  process.exit(0);
}

const title = 'ArcKit';
const body =
  stale.length === 1
    ? `1 stale artefact — run /arckit:health`
    : `${stale.length} stale artefacts — run /arckit:health`;

const BEL = String.fromCharCode(0x07);
const ESC = String.fromCharCode(0x1b);

// OSC 9: iTerm2 / Windows Terminal / WezTerm / ConEmu — single-arg "title: body"
const osc9 = `${ESC}]9;${title}: ${body}${BEL}`;
// OSC 777: urxvt / Ghostty / Warp — notify;title;body form
const osc777 = `${ESC}]777;notify;${title};${body}${BEL}`;
const terminalSequence = osc9 + osc777;

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      terminalSequence,
      additionalContext: `[ArcKit] Desktop notification sent: ${stale.length} stale artefact(s) detected at session start. Run \`/arckit:health\` for the full list.`,
    },
  })
);
process.exit(0);
