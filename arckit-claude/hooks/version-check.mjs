#!/usr/bin/env node
/**
 * ArcKit Version Check Hook
 *
 * Fires at SessionStart. Compares the local plugin version against
 * the latest GitHub release tag for tractorjuice/arc-kit.
 * Emits a notification if a newer version is available.
 *
 * Hook Type: SessionStart
 * Input (stdin): JSON with session_id, cwd, etc.
 * Output (stdout): JSON with additionalContext (only if update available)
 */

import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isFile, readText, parseHookInput } from './hook-utils.mjs';

parseHookInput(); // consume stdin (required by hook protocol)

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const versionFile = join(pluginRoot, 'VERSION');
const localVersion = (isFile(versionFile) && readText(versionFile)?.trim()) || null;

if (!localVersion) {
  // Can't determine local version — skip silently
  console.log(JSON.stringify({}));
  process.exit(0);
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

  if (!res.ok) {
    // API error (rate limit, network) — skip silently
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  const data = await res.json();
  const latestTag = data.tag_name || '';
  const latestVersion = latestTag.replace(/^v/, '');

  if (!latestVersion) {
    console.log(JSON.stringify({}));
    process.exit(0);
  }

  if (compareVersions(latestVersion, localVersion) > 0) {
    const context = `## ArcKit Update Available\n\nYou are running **v${localVersion}**. The latest release is **v${latestVersion}**.\n\nTo update, restart Claude Code — the plugin marketplace will pull the latest version automatically.\n\nRelease notes: https://github.com/${REPO}/releases/tag/${latestTag}`;

    process.stderr.write(`[ArcKit] Update available: v${localVersion} → v${latestVersion}\n`);

    console.log(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: context,
      },
    }));
  } else {
    console.log(JSON.stringify({}));
  }
} catch {
  // Network failure, timeout, etc. — skip silently
  console.log(JSON.stringify({}));
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
