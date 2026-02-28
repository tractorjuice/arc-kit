#!/usr/bin/env node
/**
 * ArcKit Guide Sync Hook
 *
 * Fires on UserPromptSubmit for /arckit:pages commands.
 * Copies all guide .md files from the plugin to the repo's docs/guides/
 * directory using native fs operations — zero tool round-trips.
 *
 * Also extracts the first # heading from each guide file and includes
 * a title map in the systemMessage, eliminating ~95 Read tool calls
 * that the pages command would otherwise need for title extraction.
 *
 * Smart sync: skips files where destination mtime >= source mtime.
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with user_prompt, cwd, etc.
 * Output (stdout): JSON with systemMessage containing sync stats + title map
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}
function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}
function mtimeMs(p) {
  try { return statSync(p).mtimeMs; } catch { return 0; }
}

function findRepoRoot(cwd) {
  let current = resolve(cwd);
  while (true) {
    if (isDir(join(current, 'projects'))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return null;
}

/**
 * Recursively collect all .md files under a directory.
 * Returns array of { abs, rel } where rel is relative to baseDir.
 */
function walkMdFiles(baseDir, currentDir = baseDir) {
  const results = [];
  let entries;
  try {
    entries = readdirSync(currentDir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    const fullPath = join(currentDir, entry);
    if (isDir(fullPath)) {
      results.push(...walkMdFiles(baseDir, fullPath));
    } else if (entry.endsWith('.md') && isFile(fullPath)) {
      results.push({ abs: fullPath, rel: relative(baseDir, fullPath) });
    }
  }
  return results;
}

/**
 * Extract the first # heading from file content.
 * For role guides, strips the " — ArcKit Command Guide" suffix.
 */
function extractTitle(content, relPath) {
  const lines = content.split('\n', 10);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) {
      let title = m[1].trim();
      // Role guides have a suffix to strip
      if (relPath.startsWith('roles/')) {
        title = title.replace(/\s*[—–-]\s*ArcKit Command Guide\s*$/i, '');
      }
      return title;
    }
  }
  return null;
}

// --- Main ---
let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw || !raw.trim()) process.exit(0);

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

const userPrompt = data.user_prompt || '';

// Self-filter: only run for /arckit:pages (or /arckit.pages) commands
if (!/\/arckit[.:]+pages\b/i.test(userPrompt)) process.exit(0);

// Resolve plugin root
const __dirname_hook = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname_hook, '..');

const sourceDir = join(pluginRoot, 'docs', 'guides');
if (!isDir(sourceDir)) process.exit(0);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const destDir = join(repoRoot, 'docs', 'guides');

// Walk source guides
const sourceFiles = walkMdFiles(sourceDir);
if (sourceFiles.length === 0) process.exit(0);

let copied = 0;
let skipped = 0;
let dirsCreated = 0;
const createdDirs = new Set();
const guideTitles = {}; // relPath -> extracted title

for (const { abs: srcPath, rel: relPath } of sourceFiles) {
  const destPath = join(destDir, relPath);
  const destDirPath = dirname(destPath);

  // Create destination directory if needed
  if (!createdDirs.has(destDirPath) && !isDir(destDirPath)) {
    mkdirSync(destDirPath, { recursive: true });
    dirsCreated = dirsCreated + 1;
    createdDirs.add(destDirPath);
  } else {
    createdDirs.add(destDirPath);
  }

  // Read source content (needed for both copy and title extraction)
  const content = readFileSync(srcPath, 'utf8');

  // Extract title from first # heading
  const title = extractTitle(content, relPath);
  if (title) {
    guideTitles[`docs/guides/${relPath}`] = title;
  }

  // Smart sync: skip if destination is at least as new as source
  const srcMtime = mtimeMs(srcPath);
  const destMtime = mtimeMs(destPath);
  if (destMtime >= srcMtime && destMtime > 0) {
    skipped = skipped + 1;
    continue;
  }

  // Write file
  writeFileSync(destPath, content, 'utf8');
  copied = copied + 1;
}

const total = copied + skipped;
const titleCount = Object.keys(guideTitles).length;
const message = [
  `## Guide Sync Complete (hook)`,
  ``,
  `Synced guides from plugin to \`docs/guides/\`:`,
  `- **${total}** guide files processed`,
  `- **${copied}** copied (new or updated)`,
  `- **${skipped}** skipped (already up to date)`,
  copied > 0 ? `- **${dirsCreated}** directories created` : null,
  `- **${titleCount}** titles extracted`,
  ``,
  `**Skip Step 1.1 entirely** — guides are synced and titles are pre-extracted below. Do NOT use Read tool on guide files for title extraction. Use the guideTitles JSON map directly when building the guides and roleGuides arrays in manifest.json.`,
  ``,
  '```json',
  JSON.stringify({ guideTitles }, null, 2),
  '```',
].filter(Boolean).join('\n');

const output = {
  suppressOutput: true,
  systemMessage: message,
};
console.log(JSON.stringify(output));
