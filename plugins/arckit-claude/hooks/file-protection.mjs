#!/usr/bin/env node
/**
 * File Protection Hook for ArcKit
 * Blocks edits to sensitive files (environment files, credentials, private keys, lock files).
 *
 * Hook Type: PreToolUse
 * Matcher: Edit|Write
 * Blocking is via JSON {"decision": "block"} on stdout.
 * Exit code is always 0.
 */

import { basename, posix } from 'node:path';
import { parseHookInput } from './hook-utils.mjs';

// Files and paths to protect
const PROTECTED_PATHS = [
  // Environment files
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',

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
// Matched on path segment boundaries; never exempts PROTECTED_PATHS.
const ALLOWED_DIRECTORIES = [
  'arckit-claude/commands/',  // Command documentation may reference secret management
  'arckit-claude/templates/', // Templates may reference credential patterns
  'arckit-claude/agents/',    // Agent definitions
  'arckit-claude/hooks/',     // Hook scripts (including this one)
  'docs/',                    // Documentation files
  '.arckit/templates/',       // Project-level templates
  'projects/',                // ArcKit governance artifacts may discuss security topics
];

function normalizePath(filePath) {
  const normalized = posix.normalize(filePath.replace(/\\/g, '/'));
  return normalized === '.' ? '' : normalized;
}

function isInAllowedDirectory(normalizedPath) {
  const anchored = '/' + normalizedPath.replace(/^\/+/, '');
  return ALLOWED_DIRECTORIES.some(dir => anchored.includes('/' + dir));
}

function isProtected(filePath) {
  const normalizedPath = normalizePath(filePath);
  const normalizedLower = normalizedPath.toLowerCase();
  const partsLower = normalizedLower.split('/');
  const fileName = basename(normalizedPath);
  const fileNameLower = fileName.toLowerCase();

  // Protected paths are always enforced, regardless of directory or exceptions
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
  if (isInAllowedDirectory(normalizedPath)) {
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
const filePath = (inputData.tool_input || {}).file_path || '';

// Only check Edit and Write tools
if (toolName !== 'Edit' && toolName !== 'Write') process.exit(0);
if (!filePath) process.exit(0);

const [isBlocked, reason] = isProtected(filePath);

if (isBlocked) {
  const output = {
    decision: 'block',
    reason: `Protected: ${reason}\nFile: ${filePath}\nEdit manually outside Claude Code, or add an exception in file-protection.mjs.`,
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
