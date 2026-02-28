#!/usr/bin/env node
/**
 * ArcKit Pages Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:pages commands.
 * Performs all expensive I/O that the pages command would otherwise
 * do via tool calls, keeping ~134KB of HTML template and ~95 guide
 * files entirely outside the context window.
 *
 * What it does:
 * 1. Syncs guide .md files from plugin to repo docs/guides/ (smart mtime skip)
 * 2. Extracts first # heading from each guide → guideTitles map
 * 3. Reads .git/config → repo name, owner, URL, content base URL
 * 4. Reads plugin VERSION file
 * 5. Reads pages-template.html (custom override or default), replaces
 *    {{REPO}}, {{REPO_URL}}, {{CONTENT_BASE_URL}}, {{VERSION}} placeholders,
 *    and writes docs/index.html
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with user_prompt, cwd, etc.
 * Output (stdout): JSON with systemMessage containing all pre-computed data
 */

import { readFileSync, writeFileSync, mkdirSync, statSync, readdirSync } from 'node:fs';
import { join, dirname, resolve, relative, basename } from 'node:path';
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
function readText(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
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
      if (relPath.startsWith('roles/')) {
        title = title.replace(/\s*[—–-]\s*ArcKit Command Guide\s*$/i, '');
      }
      return title;
    }
  }
  return null;
}

/**
 * Parse .git/config to extract remote origin URL, then derive
 * repo name, owner, full URL, and raw content base URL.
 */
function parseRepoInfo(repoRoot) {
  const info = { repo: basename(repoRoot), owner: '', repoUrl: '', contentBaseUrl: '' };
  const gitConfig = readText(join(repoRoot, '.git', 'config'));
  if (!gitConfig) return info;

  // Find [remote "origin"] section and extract url
  const remoteMatch = gitConfig.match(/\[remote\s+"origin"\][^[]*?url\s*=\s*(.+)/);
  if (!remoteMatch) return info;

  const rawUrl = remoteMatch[1].trim();

  // Handle HTTPS: https://github.com/owner/repo.git
  let m = rawUrl.match(/https?:\/\/github\.com\/([^/]+)\/([^/.]+)/);
  if (m) {
    info.owner = m[1];
    info.repo = m[2];
    info.repoUrl = `https://github.com/${m[1]}/${m[2]}`;
    info.contentBaseUrl = `https://raw.githubusercontent.com/${m[1]}/${m[2]}/main`;
    return info;
  }

  // Handle SSH: git@github.com:owner/repo.git
  m = rawUrl.match(/git@github\.com:([^/]+)\/([^/.]+)/);
  if (m) {
    info.owner = m[1];
    info.repo = m[2];
    info.repoUrl = `https://github.com/${m[1]}/${m[2]}`;
    info.contentBaseUrl = `https://raw.githubusercontent.com/${m[1]}/${m[2]}/main`;
    return info;
  }

  return info;
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

// ── 1. Sync guides ──
const sourceFiles = walkMdFiles(sourceDir);
if (sourceFiles.length === 0) process.exit(0);

let copied = 0;
let skipped = 0;
let dirsCreated = 0;
const createdDirs = new Set();
const guideTitles = {};

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

  writeFileSync(destPath, content, 'utf8');
  copied = copied + 1;
}

// ── 2. Repo info ──
const repoInfo = parseRepoInfo(repoRoot);

// ── 3. Plugin version ──
const version = (readText(join(pluginRoot, 'VERSION')) || '').trim();

// ── 4. Template processing → docs/index.html ──
let templateProcessed = false;
let templateSource = '';

// Check for user override first, then plugin default
const customTemplatePath = join(repoRoot, '.arckit', 'templates', 'pages-template.html');
const defaultTemplatePath = join(pluginRoot, 'templates', 'pages-template.html');

let templatePath = '';
if (isFile(customTemplatePath)) {
  templatePath = customTemplatePath;
  templateSource = 'custom override (.arckit/templates/)';
} else if (isFile(defaultTemplatePath)) {
  templatePath = defaultTemplatePath;
  templateSource = 'plugin default';
}

if (templatePath) {
  let html = readFileSync(templatePath, 'utf8');

  // Replace all {{...}} placeholders (both quoted and unquoted forms)
  html = html.replace(/\{\{REPO\}\}/g, repoInfo.repo);
  html = html.replace(/\{\{REPO_URL\}\}/g, repoInfo.repoUrl);
  html = html.replace(/\{\{CONTENT_BASE_URL\}\}/g, repoInfo.contentBaseUrl);
  html = html.replace(/\{\{VERSION\}\}/g, version);

  // Ensure docs/ directory exists
  const docsDir = join(repoRoot, 'docs');
  if (!isDir(docsDir)) {
    mkdirSync(docsDir, { recursive: true });
  }

  writeFileSync(join(repoRoot, 'docs', 'index.html'), html, 'utf8');
  templateProcessed = true;
}

// ── 5. Build output message ──
const total = copied + skipped;
const titleCount = Object.keys(guideTitles).length;
const message = [
  `## Pages Pre-processor Complete (hook)`,
  ``,
  `### Guide Sync`,
  `- **${total}** guide files processed (**${copied}** copied, **${skipped}** up to date)`,
  dirsCreated > 0 ? `- **${dirsCreated}** directories created` : null,
  `- **${titleCount}** titles extracted`,
  ``,
  `### Repository Info`,
  `- **Repo**: ${repoInfo.repo}`,
  `- **Owner**: ${repoInfo.owner || '(unknown)'}`,
  `- **URL**: ${repoInfo.repoUrl || '(no remote)'}`,
  `- **Content Base URL**: ${repoInfo.contentBaseUrl || '(none)'}`,
  `- **ArcKit Version**: ${version || '(unknown)'}`,
  ``,
  `### Template Processing`,
  templateProcessed
    ? `- **docs/index.html written** from ${templateSource} with all placeholders replaced`
    : `- **Template not found** — command must handle Step 3 manually`,
  ``,
  `### What to skip`,
  `- **Skip Step 0** — repo info is above`,
  `- **Skip Step 1.1** — guides are synced and titles are in the guideTitles map below`,
  templateProcessed
    ? `- **Skip Step 3** — index.html is already written with placeholders replaced`
    : null,
  `- Use the guideTitles JSON map directly when building manifest.json (do NOT Read guide files)`,
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
