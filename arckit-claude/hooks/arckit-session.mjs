#!/usr/bin/env node
/**
 * ArcKit SessionStart Hook
 *
 * Fires once at session start (and on resume/clear/compact).
 * Injects ArcKit plugin version into the context window and exports
 * ARCKIT_VERSION as an environment variable for Bash tool calls.
 *
 * Hook Type: SessionStart
 * Input (stdin): JSON with session_id, cwd, etc.
 * Output (stdout): JSON with additionalContext
 */

import { readdirSync, appendFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isDir, isFile, mtimeMs, readText, parseHookInput } from './hook-utils.mjs';

const data = parseHookInput();

const cwd = data.cwd || '.';
const envFile = data.env_file || '';

// Read plugin version
const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname, '..');
const versionFile = join(pluginRoot, 'VERSION');

const arckitVersion = (isFile(versionFile) && readText(versionFile)?.trim()) || 'unknown';

// Export ARCKIT_VERSION so Bash tool calls can use it
if (envFile) {
  try {
    appendFileSync(envFile, `ARCKIT_VERSION=${arckitVersion}\n`);
  } catch { /* ignore */ }
}

// Build context
let context = `ArcKit Plugin v${arckitVersion} is active.`;

const projectsDir = join(cwd, 'projects');
if (isDir(projectsDir)) {
  context += `\n\nProjects directory: found at ${projectsDir}`;
} else {
  context += '\n\nNo projects/ directory found. Run /arckit:init to scaffold a new project or /arckit:create to add one.';
}

// Check for external files newer than latest artifacts
if (isDir(projectsDir)) {
  let extAlerts = '';
  const entries = readdirSync(projectsDir).sort();

  for (const entry of entries) {
    const projectDir = join(projectsDir, entry);
    if (!isDir(projectDir)) continue;
    const externalDir = join(projectDir, 'external');
    if (!isDir(externalDir)) continue;

    const projectName = entry;

    // Find newest ARC-* artifact mtime across main dir and subdirs
    let newestArtifact = 0;

    // Main dir
    for (const f of readdirSync(projectDir)) {
      const fp = join(projectDir, f);
      if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
        const mt = mtimeMs(fp);
        if (mt > newestArtifact) newestArtifact = mt;
      }
    }

    // Subdirectories
    for (const subdir of ['decisions', 'diagrams', 'wardley-maps', 'data-contracts', 'reviews']) {
      const subPath = join(projectDir, subdir);
      if (isDir(subPath)) {
        for (const f of readdirSync(subPath)) {
          const fp = join(subPath, f);
          if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
            const mt = mtimeMs(fp);
            if (mt > newestArtifact) newestArtifact = mt;
          }
        }
      }
    }

    // Compare external files against newest artifact
    const newExtFiles = [];
    for (const f of readdirSync(externalDir)) {
      const fp = join(externalDir, f);
      if (!isFile(fp)) continue;
      if (f === 'README.md') continue;
      const extMtime = mtimeMs(fp);
      if (extMtime > newestArtifact) {
        newExtFiles.push(f);
      }
    }

    if (newExtFiles.length > 0) {
      extAlerts += `\n[${projectName}] ${newExtFiles.length} external file(s) newer than latest artifact:`;
      for (const ef of newExtFiles) {
        extAlerts += `\n  - ${ef}`;
      }
      process.stderr.write(`[ArcKit] ${projectName}: ${newExtFiles.length} new external file(s) detected\n`);
    }
  }

  if (extAlerts) {
    context += `\n\n## New External Files Detected\n${extAlerts}\n\nConsider re-running relevant commands to incorporate these files. Run /arckit:health for detailed recommendations.`;
  }
}

// Surface recent session history if available
const sessionsFile = join(cwd, '.arckit', 'memory', 'sessions.md');
if (isFile(sessionsFile)) {
  const sessionsContent = readText(sessionsFile);
  if (sessionsContent) {
    // Extract last 3 session entries for context
    const sections = sessionsContent.split(/\n(?=### \d{4}-\d{2}-\d{2})/);
    const recentSessions = sections.slice(1, 4); // skip header, take 3
    if (recentSessions.length > 0) {
      context += '\n\n## Recent Sessions\n';
      context += recentSessions.join('\n');
    }
  }
}

// Output additionalContext
const output = {
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: context,
  },
};
console.log(JSON.stringify(output));
