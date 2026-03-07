#!/usr/bin/env node
/**
 * Secret File Scanner Hook for ArcKit
 * Scans file content being written for potential secrets.
 *
 * Hook Type: PreToolUse
 * Matcher: Edit|Write
 * Blocking is via JSON {"decision": "block"} on stdout.
 * Exit code is always 0.
 */

import { parseHookInput } from './hook-utils.mjs';

// Secret patterns - synced with secret-detection.mjs
const SECRET_PATTERNS = [
  // Explicit key-value patterns
  [/\b(password|passwd|pwd)\s*[:=]\s*\S+/gi, 'password'],
  [/\b(secret|api_?secret)\s*[:=]\s*\S+/gi, 'secret'],
  [/\b(api_?key|apikey)\s*[:=]\s*\S+/gi, 'API key'],
  [/\b(token|auth_?token|access_?token)\s*[:=]\s*\S+/gi, 'token'],
  [/\b(private_?key)\s*[:=]\s*\S+/gi, 'private key'],

  // Common API key formats
  [/sk-[a-zA-Z0-9]{20,}/g, 'OpenAI API key'],
  [/sk-ant-[a-zA-Z0-9-]{20,}/g, 'Anthropic API key'],
  [/ghp_[a-zA-Z0-9]{36}/g, 'GitHub personal access token'],
  [/gho_[a-zA-Z0-9]{36}/g, 'GitHub OAuth token'],
  [/ghs_[a-zA-Z0-9]{36}/g, 'GitHub server token'],
  [/AKIA[0-9A-Z]{16}/g, 'AWS access key ID'],
  [/aws_secret_access_key\s*[:=]\s*\S+/gi, 'AWS secret key'],

  // Notion tokens
  [/ntn_[a-zA-Z0-9]{40,}/g, 'Notion integration token'],
  [/secret_[a-zA-Z0-9]{40,}/g, 'potential secret token'],

  // Atlassian tokens
  [/atlassian[-_]?token\s*[:=]\s*\S+/gi, 'Atlassian token'],
  [/confluence[-_]?token\s*[:=]\s*\S+/gi, 'Confluence token'],
  [/jira[-_]?token\s*[:=]\s*\S+/gi, 'Jira token'],
  [/ATATT[a-zA-Z0-9]{20,}/g, 'Atlassian API token'],

  // Slack tokens
  [/xox[baprs]-[0-9A-Za-z\-]{10,}/g, 'Slack token'],

  // Google API keys
  [/AIza[0-9A-Za-z\-_]{35}/g, 'Google API key'],

  // Bearer tokens
  [/bearer\s+[a-zA-Z0-9\-_.]{20,}/gi, 'Bearer token'],

  // Connection strings
  [/(mongodb|postgres|mysql|redis):\/\/[^\s]+:[^\s]+@/gi, 'database connection string'],

  // Private keys (PEM format headers)
  [/-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g, 'private key (PEM)'],
  [/-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----/g, 'SSH private key'],

  // Generic high-entropy credentials
  [/(api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9+/=]{32,}['"]?/gi, 'high-entropy credential'],
];

// Files to skip scanning (legitimate security tool files, documentation, etc.)
const SKIP_PATTERNS = [
  /\.pre-commit-config\.yaml$/,
  /secret-detection\.mjs$/,
  /secret-file-scanner\.mjs$/,
  /file-protection\.mjs$/,
  /\.secrets\.baseline$/,
  /arckit-claude\/commands\/.*\.md$/,
  /arckit-claude\/templates\/.*\.md$/,
  /docs\/.*\.md$/,
  /CHANGELOG\.md$/,
  /README\.md$/,
];

function shouldSkipFile(filePath) {
  return SKIP_PATTERNS.some(pattern => pattern.test(filePath));
}

function checkContentForSecrets(content) {
  const findings = [];
  for (const [pattern, secretType] of SECRET_PATTERNS) {
    // Reset lastIndex for global regexps
    pattern.lastIndex = 0;
    const matches = content.match(pattern);
    if (matches) {
      findings.push([secretType, matches.length]);
    }
  }
  return findings;
}

// --- Main ---
const inputData = parseHookInput();

const toolName = inputData.tool_name || '';
const toolInput = inputData.tool_input || {};

// Only check Edit and Write tools
if (toolName !== 'Edit' && toolName !== 'Write') process.exit(0);

const filePath = toolInput.file_path || '';

// Skip certain files (documentation, security tools themselves)
if (shouldSkipFile(filePath)) process.exit(0);

// Get the content being written
let content = '';
if (toolName === 'Write') {
  content = toolInput.content || '';
} else if (toolName === 'Edit') {
  content = toolInput.new_string || '';
}

if (!content) process.exit(0);

const findings = checkContentForSecrets(content);

if (findings.length > 0) {
  const secretTypes = findings.map(([stype, count]) => `${stype} (${count}x)`);
  const warning = `Potential secrets detected in file content: ${secretTypes.join(', ')}`;

  const output = {
    decision: 'block',
    reason: `Warning: ${warning}\n\nFile: ${filePath}\n\nPlease remove sensitive data before writing.`,
  };
  console.log(JSON.stringify(output));
  process.exit(0);
}

// No secrets found - allow the write
process.exit(0);
