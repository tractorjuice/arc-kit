#!/usr/bin/env node
/**
 * File Protection Hook for ArcKit
 * Blocks edits to sensitive files (environment files, credentials, private keys, lock files).
 *
 * Hook Type: PreToolUse
 * Matcher: Edit|Write (plus NotebookEdit)
 * Blocking is via JSON {"decision": "block"} on stdout.
 * Exit code is always 0.
 *
 * The target is checked twice: as requested and with symlinks resolved, so a
 * harmless-looking link (docs/notes.md -> ../.git/config) is still blocked.
 */

import { existsSync, lstatSync, readlinkSync, realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHookInput } from './hook-utils.mjs';

// Environment files: `.env` and every `.env.*` variant, except placeholders
// that are meant to be committed without real values.
const ENV_TEMPLATE_FILES = ['.env.example', '.env.sample', '.env.template'];

// Files and paths to protect
const PROTECTED_PATHS = [
  // Lock files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'Gemfile.lock',
  'poetry.lock',
  'Cargo.lock',

  // Version control
  '.git/',

  // Credentials directories
  '.aws/',
  '.ssh/',
  '.gnupg/',

  // Common secret files
  'credentials',
  'credentials.json',
  'secrets.json',
  'secrets.yaml',
  'secrets.yml',
  '.secrets',

  // Private keys and certificates
  '*.pem',
  '*.key',
  '*.p12',
  '*.pfx',
  'id_rsa',
  'id_ed25519',
  'id_ecdsa',

  // Token files
  '.npmrc',
  '.pypirc',
  '.netrc',

  // Local configuration with secrets
  'config.local.json',
];

// Sensitive keywords in filenames - block creation of files containing these
// Case-insensitive matching
const SENSITIVE_FILENAME_KEYWORDS = [
  'api key',
  'apikey',
  'api-key',
  'api_key',
  'password',
  'passwd',
  'secret',
  'token',
  'credential',
  'private key',
  'privatekey',
];

// Keywords that must match as whole words only (using word boundary regex)
// to avoid false positives like "pin" in "Mapping" or "pat" in "Pattern"
const SENSITIVE_WHOLE_WORD_KEYWORDS = [
  'pin',
  'pat',
];

// Files that are allowed exceptions to the sensitive keyword rule
// These are legitimate security tool files, not actual secrets
const ALLOWED_EXCEPTIONS = [
  '.secrets.baseline',           // detect-secrets baseline file
  '.pre-commit-config.yaml',    // pre-commit config may reference secrets detection
  'secret-detection.mjs',       // secret detection hook itself
  'secret-file-scanner.mjs',    // secret file scanner hook itself
];

// Directories where sensitive keywords in filenames are allowed
// (documentation/skill files that discuss secrets, not actual secrets).
// Anchored to a root, never matched anywhere in the path, and never exempts
// PROTECTED_PATHS.
const ALLOWED_PLUGIN_DIRECTORIES = [
  'commands/',  // Command documentation may reference secret management
  'templates/', // Templates may reference credential patterns
  'agents/',    // Agent definitions
  'hooks/',     // Hook scripts (including this one)
];
const ALLOWED_REPO_DIRECTORIES = [
  'docs/',                    // Documentation files
  '.arckit/templates/',       // Project-level templates
  'projects/',                // ArcKit governance artifacts may discuss security topics
];

const MAX_SYMLINK_HOPS = 40;

// Resolves symlinks, including dangling ones and links in missing parents,
// so the path names the file a write would actually land in.
function canonicalPath(p, hops = 0) {
  try { return realpathSync(p); } catch { /* missing, dangling or looping */ }
  if (hops < MAX_SYMLINK_HOPS) {
    try {
      if (lstatSync(p).isSymbolicLink()) {
        return canonicalPath(resolve(dirname(p), readlinkSync(p)), hops + 1);
      }
    } catch { /* not on disk */ }
  }
  const parent = dirname(p);
  if (parent === p) return p;
  return join(canonicalPath(parent, hops), basename(p));
}

function relativeWithin(root, absPath) {
  const rel = relative(root, absPath);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return null;
  return rel.split(sep).join('/');
}

function findRepoRoot(cwd) {
  let current = cwd;
  while (true) {
    if (existsSync(join(current, '.git'))) return current;
    const parent = dirname(current);
    if (parent === current) return cwd;
    current = parent;
  }
}

function rootPair(p) {
  return [p, canonicalPath(p)];
}

const PLUGIN_ROOTS = rootPair(resolve(dirname(fileURLToPath(import.meta.url)), '..'));

function relativeToAny(roots, absPath) {
  for (const root of roots) {
    const rel = relativeWithin(root, absPath);
    if (rel !== null) return rel;
  }
  return null;
}

function isInAllowedDirectory(absPath, repoRoots) {
  const inPlugin = relativeToAny(PLUGIN_ROOTS, absPath);
  if (inPlugin !== null && ALLOWED_PLUGIN_DIRECTORIES.some(dir => inPlugin.startsWith(dir))) {
    return true;
  }
  const inRepo = relativeToAny(repoRoots, absPath);
  return inRepo !== null && ALLOWED_REPO_DIRECTORIES.some(dir => inRepo.startsWith(dir));
}

function isEnvFile(fileNameLower) {
  if (ENV_TEMPLATE_FILES.includes(fileNameLower)) return false;
  return fileNameLower === '.env' || fileNameLower.startsWith('.env.');
}

function isProtected(absPath, repoRoots) {
  const normalizedLower = absPath.replace(/\\/g, '/').toLowerCase();
  const partsLower = normalizedLower.split('/');
  const fileName = basename(absPath.replace(/\\/g, '/'));
  const fileNameLower = fileName.toLowerCase();

  // Protected paths are always enforced, regardless of directory or exceptions
  if (isEnvFile(fileNameLower)) {
    return [true, 'Protected file: .env*'];
  }
  for (const protected_ of PROTECTED_PATHS) {
    const protectedLower = protected_.toLowerCase();
    if (protectedLower.startsWith('*')) {
      // Wildcard suffix match (e.g., *.pem)
      if (fileNameLower.endsWith(protectedLower.slice(1))) {
        return [true, `Protected file type: ${protected_}`];
      }
    } else if (protectedLower.endsWith('/')) {
      // Directory match - check if directory appears as a path segment
      if (partsLower.includes(protectedLower.slice(0, -1))) {
        return [true, `Protected directory: ${protected_}`];
      }
    } else if (fileNameLower === protectedLower) {
      // Exact filename match (not substring)
      return [true, `Protected file: ${protected_}`];
    }
  }

  // Exceptions and allowed directories only relax the sensitive-keyword heuristic
  if (ALLOWED_EXCEPTIONS.includes(fileName)) {
    return [false, ''];
  }
  if (isInAllowedDirectory(absPath, repoRoots)) {
    return [false, ''];
  }

  // Check for sensitive keywords in filename (case-insensitive substring match)
  for (const keyword of SENSITIVE_FILENAME_KEYWORDS) {
    if (fileNameLower.includes(keyword)) {
      return [true, `Sensitive keyword in filename: '${keyword}'`];
    }
  }

  // Check for whole-word sensitive keywords (avoids "pin" in "Mapping", "pat" in "Pattern")
  for (const keyword of SENSITIVE_WHOLE_WORD_KEYWORDS) {
    const re = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (re.test(fileNameLower)) {
      return [true, `Sensitive keyword in filename: '${keyword}'`];
    }
  }

  return [false, ''];
}

// --- Main ---
const inputData = parseHookInput();

const toolName = inputData.tool_name || '';
const toolInput = inputData.tool_input || {};
const filePath = toolInput.file_path || toolInput.notebook_path || '';

// Check Write and every editing tool (Edit, MultiEdit, NotebookEdit, ...)
if (toolName !== 'Write' && !toolName.endsWith('Edit')) process.exit(0);
if (!filePath || typeof filePath !== 'string') process.exit(0);

const cwd = resolve(inputData.cwd || process.cwd());
const repoRoots = rootPair(findRepoRoot(cwd));
const requestedPath = resolve(cwd, filePath);
const resolvedPath = canonicalPath(requestedPath);

let [isBlocked, reason] = isProtected(requestedPath, repoRoots);
if (!isBlocked && resolvedPath !== requestedPath) {
  [isBlocked, reason] = isProtected(resolvedPath, repoRoots);
}

if (isBlocked) {
  const target = resolvedPath !== requestedPath ? `\nResolves to: ${resolvedPath}` : '';
  const output = {
    decision: 'block',
    reason: `Protected: ${reason}\nFile: ${filePath}${target}\nEdit manually outside Claude Code, or add an exception in file-protection.mjs.`,
  };
  console.log(JSON.stringify(output));
  process.exit(0);
}

// Return additionalContext for allowed files with hints
const filePathLower = filePath.toLowerCase();
if (['config', 'settings', 'setup'].some(kw => filePathLower.includes(kw))) {
  const output = {
    additionalContext: `Note: ${filePath} may contain configuration. Ensure no secrets are included.`,
  };
  console.log(JSON.stringify(output));
}

process.exit(0);
