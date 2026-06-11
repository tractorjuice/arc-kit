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
 *      `paths:`, plugin dependency enforcement, `defaultEnabled`, and the
 *      Opus 4.8 thinking-block fix, Claude Fable 5 runtime, and the
 *      WebFetch wildcard-domain fix depend on
 *      v2.1.83+/v2.1.121+/v2.1.143+/v2.1.154+/v2.1.156+/v2.1.172+). Silent on
 *      detection failure.
 *
 * Side effect: when inside an ArcKit project, persists the detected client
 * version to `.arckit/memory/.cc-version` so the Stop hook
 * (session-learner.mjs) can version-gate its end-of-turn nudge (which needs
 * v2.1.163+) without re-detecting. Best-effort; never created elsewhere.
 *
 * Hook Type: SessionStart
 * Input (stdin): JSON with session_id, cwd, etc.
 * Output (stdout): JSON with additionalContext (only when a warning fires).
 */

import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDir, isFile, readText, parseHookInput, parseVersion, compareVersions } from './hook-utils.mjs';

const MIN_CLAUDE_CODE_VERSION = '2.1.172';

const data = parseHookInput(); // consume stdin (required by hook protocol)
const cwd = data.cwd || '.';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const versionFile = join(pluginRoot, 'VERSION');
const localVersion = (isFile(versionFile) && readText(versionFile)?.trim()) || null;

const warnings = [];

const clientVersion = detectClaudeCodeVersion();

// Persist the detected client version so the Stop hook (session-learner.mjs)
// can gate its end-of-turn nudge on it without re-detecting. Best-effort:
// only inside an ArcKit project (so we never create .arckit/ elsewhere), and
// every failure is swallowed — version detection must never break startup.
if (clientVersion && (isDir(join(cwd, '.arckit')) || isDir(join(cwd, 'projects')))) {
  try {
    const memoryDir = join(cwd, '.arckit', 'memory');
    mkdirSync(memoryDir, { recursive: true });
    writeFileSync(join(memoryDir, '.cc-version'), clientVersion);
  } catch {
    // Non-fatal — the nudge simply stays dormant if we can't persist.
  }
}

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
    `- Hook \`args: string[]\` exec form — ArcKit hooks now use the exec form to avoid shell-string parsing; older clients only understand the legacy \`command\` string form (needs v2.1.139)\n` +
    `- Plugin dependency enforcement — \`claude plugin disable arckit\` warns when a community overlay depends on it, instead of silently breaking the overlay (needs v2.1.143)\n` +
    `- Session title bug fix — ArcKit's \`stale-artifact-scan\` monitor was being used to name new sessions instead of the user's first prompt (needs v2.1.144)\n` +
    `- Skill tool headless permission fix — \`/arckit:*\` commands run via \`claude -p\` / CI failed with permission errors on v2.1.141–v2.1.143 (needs v2.1.144)\n` +
    `- Plugin \`defaultEnabled: false\` — ArcKit's 9 community overlays no longer auto-enable on marketplace install; users opt in to only the jurisdiction/sector they need (needs v2.1.154)\n` +
    `- Opus 4.8 thinking-block API-error fix — modified thinking blocks caused API errors on earlier clients; affects \`/arckit:*\` commands and research agents using extended thinking (needs v2.1.156)\n` +
    `- Claude Fable 5 general availability — ArcKit defaults to the latest model tier and standardises on the Fable 5-era runtime (needs v2.1.170)\n` +
    `- WebFetch wildcard-domain fix — \`WebFetch(domain:*.gov.uk)\`-style allow rules ArcKit recommends for OFFICIAL-SENSITIVE deployments never matched subdomains on earlier clients (needs v2.1.172)\n\n` +
    `Update with: \`claude update\`\n\n` +
    `**Tip — stop drifting back below the floor:** after updating, add ` +
    `\`"minimumVersion": "${MIN_CLAUDE_CODE_VERSION}"\` to your \`.claude/settings.json\`. ` +
    `Claude Code then refuses to auto-update or \`claude update\` to anything below ArcKit's floor. ` +
    `(This is a per-user/project setting — distinct from the org-only \`requiredMinimumVersion\` managed setting that hard-refuses startup fleet-wide.)`
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
