#!/usr/bin/env node
/**
 * ArcKit Version Check Hook
 *
 * Fires at SessionStart. Two checks:
 *   1. Plugin self-update — compares local plugin version against the latest
 *      GitHub release tag for tractorjuice/arc-kit.
 *   2. Claude Code minimum — reads `$CLAUDE_CODE_VERSION` (if set) or runs
 *      `claude --version` via spawnSync, and warns when the client is below
 *      MIN_CLAUDE_CODE_VERSION (features like userConfig, hook `if:`, skill
 *      `paths:` depend on v2.1.83+/v2.1.121+). Silent on detection failure.
 *
 * Hook Type: SessionStart
 * Input (stdin): JSON with session_id, cwd, etc.
 * Output (stdout): JSON with additionalContext (only when a warning fires).
 */

import { spawnSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFile, readText, parseHookInput } from './hook-utils.mjs';

const MIN_CLAUDE_CODE_VERSION = '2.1.139';

parseHookInput(); // consume stdin (required by hook protocol)

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const versionFile = join(pluginRoot, 'VERSION');
const localVersion = (isFile(versionFile) && readText(versionFile)?.trim()) || null;

const warnings = [];

const clientVersion = detectClaudeCodeVersion();
if (clientVersion && compareVersions(clientVersion, MIN_CLAUDE_CODE_VERSION) < 0) {
  warnings.push(
    `## Claude Code Version Warning\n\n` +
    `You are running Claude Code **v${clientVersion}**. ArcKit requires **v${MIN_CLAUDE_CODE_VERSION}** or later.\n\n` +
    `Features affected on older versions:\n` +
    `- Plugin \`userConfig\` prompts for API keys and org defaults (needs v2.1.83)\n` +
    `- Skill \`paths:\` globs for scoped auto-activation (needs v2.1.84)\n` +
    `- Hook \`if:\` conditions that narrow triggering (needs v2.1.85)\n` +
    `- Opus 4.7 \`xhigh\` effort tier and Auto mode (needs v2.1.111)\n` +
    `- Opus 4.7 \`/context\` correctly sized to 1M instead of 200K — long research sessions no longer autocompact early (needs v2.1.117)\n` +
    `- Agent frontmatter \`mcpServers\` loaded for \`--agent\` sessions (needs v2.1.117)\n` +
    `- \`claude plugin tag\` validates plugin/marketplace version agreement before release (needs v2.1.118)\n` +
    `- Hook \`duration_ms\` recorded on PostToolUse for session telemetry (needs v2.1.119)\n` +
    `- MCP server \`alwaysLoad\` skips tool-search deferral so AWS Knowledge / Microsoft Learn tools are loaded eagerly (needs v2.1.121)\n` +
    `- PostToolUse \`hookSpecificOutput.updatedToolOutput\` for all tools — provenance and manifest hooks now surface their work to the model (needs v2.1.121)\n` +
    `- Plugin \`monitors\` declared under the \`experimental\` block — ArcKit's \`stale-artifact-scan\` monitor will not load on older clients (needs v2.1.129)\n` +
    `- 1-hour prompt cache TTL fix — \`ENABLE_PROMPT_CACHING_1H\` was being silently downgraded to 5 minutes on earlier versions (needs v2.1.129)\n` +
    `- Subagent skill discovery fix — ArcKit's 13 agents could not discover project / user / plugin skills on earlier versions (needs v2.1.133)\n` +
    `- SessionStart hook env vars going stale fix — the \`inject-arckit-context\` pattern relies on env vars surviving across the session (needs v2.1.136)\n` +
    `- Hook \`args: string[]\` exec form — ArcKit hooks now use the exec form to avoid shell-string parsing; older clients only understand the legacy \`command\` string form (needs v2.1.139)\n\n` +
    `Update with: \`claude update\``
  );
  process.stderr.write(`[ArcKit] Claude Code v${clientVersion} is below required v${MIN_CLAUDE_CODE_VERSION}\n`);
}

if (!localVersion) {
  // Can't determine plugin version — emit client-version warnings (if any) and exit
  emitAndExit();
}

const REPO = 'tractorjuice/arc-kit';
const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;

try {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  const res = await fetch(API_URL, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'arckit-version-check',
    },
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (res.ok) {
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    const latestTag = data?.tag_name || '';
    const latestVersion = latestTag.replace(/^v/, '');

    if (latestVersion && compareVersions(latestVersion, localVersion) > 0) {
      warnings.push(
        `## ArcKit Update Available\n\n` +
        `You are running **v${localVersion}**. The latest release is **v${latestVersion}**.\n\n` +
        `To update, restart Claude Code — the plugin marketplace will pull the latest version automatically.\n\n` +
        `Release notes: https://github.com/${REPO}/releases/tag/${latestTag}`
      );
      process.stderr.write(`[ArcKit] Update available: v${localVersion} → v${latestVersion}\n`);
    }
  }
} catch {
  // Network failure, timeout, etc. — skip silently
}

emitAndExit();

function emitAndExit() {
  if (warnings.length === 0) {
    console.log(JSON.stringify({}));
  } else {
    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: warnings.join('\n\n---\n\n'),
      },
    }));
  }
  process.exit(0);
}

/**
 * Try to detect the running Claude Code version.
 *
 * Preferred: env var `CLAUDE_CODE_VERSION` if set by the harness.
 * Fallback: invoke `claude --version` with a short timeout, arguments
 * passed as an array (no shell interpolation). Returns null on failure.
 */
function detectClaudeCodeVersion() {
  if (process.env.CLAUDE_CODE_VERSION) {
    return parseVersion(process.env.CLAUDE_CODE_VERSION);
  }
  try {
    const result = spawnSync('claude', ['--version'], {
      encoding: 'utf8',
      timeout: 2000,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (result.status !== 0) return null;
    return parseVersion(result.stdout);
  } catch {
    return null;
  }
}

function parseVersion(text) {
  const match = /(\d+\.\d+\.\d+)/.exec(text || '');
  return match ? match[1] : null;
}

/**
 * Compare two semver strings (major.minor.patch).
 * Returns > 0 if a > b, < 0 if a < b, 0 if equal.
 */
function compareVersions(a, b) {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va !== vb) return va - vb;
  }
  return 0;
}
