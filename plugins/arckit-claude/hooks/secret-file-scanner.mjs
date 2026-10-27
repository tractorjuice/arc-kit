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

import { realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHookInput } from './hook-utils.mjs';

// Secret patterns - synced with secret-detection.mjs
// Reference guard: treat a value as a (non-secret) reference — not literal
// secret material — when it is an identifier followed by a property access
// (.x), an index ([...]) or a call (...), or a ${...}/$(...) interpolation.
// Covers Terraform (var./local./module./data.), Pulumi (config.requireSecret),
// app code (process.env.X, os.environ[...]), k8s (secretKeyRef.name), CDK, etc.
// Applied only to the generic key-value rules; token-format/PEM/high-entropy
// rules are left untouched so literal credentials are still caught.
const REF = String.raw`(?![A-Za-z_$][\w$]*(?:\.[\w$]|\[|\()|\$\{|\$\()`;
// Capability guard: a declared permission level is not credential material.
// GitHub Actions spells an OIDC grant as the id-token key set to `write`, so
// without this every workflow publishing via OIDC was blocked. Also covers the
// literal placeholders that appear in config templates.
// End of LINE is spelled out rather than written `$`: these rules are built
// with `gi` and no `m`, so `$` anchors to end of input and the exemption only
// fired when the permission line was the last content in the string (#737).
const LEVEL = String.raw`(?!(?:read|write|none|true|false|null)\b[^\S\r\n]*(?:\r?\n|$))`;

const SECRET_PATTERNS = [
  // Explicit key-value patterns (reference-guarded — literal values only)
  [new RegExp(String.raw`\b(password|passwd|pwd)\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'password'],
  [new RegExp(String.raw`\b(secret|api_?secret)\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'secret'],
  [new RegExp(String.raw`\b(api_?key|apikey)\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'API key'],
  [new RegExp(String.raw`\b(token|auth_?token|access_?token)\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'token'],
  [new RegExp(String.raw`\b(private_?key)\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'private key'],

  // Common API key formats
  [/sk-[a-zA-Z0-9]{20,}/g, 'OpenAI API key'],
  [/sk-ant-[a-zA-Z0-9-]{20,}/g, 'Anthropic API key'],
  [/ghp_[a-zA-Z0-9]{36}/g, 'GitHub personal access token'],
  [/gho_[a-zA-Z0-9]{36}/g, 'GitHub OAuth token'],
  [/ghs_[a-zA-Z0-9]{36}/g, 'GitHub server token'],
  [/AKIA[0-9A-Z]{16}/g, 'AWS access key ID'],
  [new RegExp(String.raw`aws_secret_access_key\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'AWS secret key'],

  // Notion tokens
  [/ntn_[a-zA-Z0-9]{40,}/g, 'Notion integration token'],
  [/secret_[a-zA-Z0-9]{40,}/g, 'potential secret token'],

  // Atlassian tokens
  [new RegExp(String.raw`atlassian[-_]?token\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'Atlassian token'],
  [new RegExp(String.raw`confluence[-_]?token\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'Confluence token'],
  [new RegExp(String.raw`jira[-_]?token\s*[:=]\s*${REF}${LEVEL}\S+`, 'gi'), 'Jira token'],
  [/ATATT[a-zA-Z0-9]{20,}/g, 'Atlassian API token'],

  // Slack tokens
  [/xox[baprs]-[0-9A-Za-z\-]{10,}/g, 'Slack token'],

  // Google API keys
  [/AIza[0-9A-Za-z\-_]{35}/g, 'Google API key'],

  // Bearer tokens
  [/bearer\s+[a-zA-Z0-9\-_.]{20,}/gi, 'Bearer token'],

  // Connection strings
  [/(mongodb|postgres|mysql|redis):\/\/[^\s:@]{1,256}:[^\s@]{1,2048}@/gi, 'database connection string'],

  // Private keys (PEM format headers)
  [/-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/g, 'private key (PEM)'],
  [/-----BEGIN\s+OPENSSH\s+PRIVATE\s+KEY-----/g, 'SSH private key'],

  // Generic high-entropy credentials
  [/(api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9+/=]{32,}['"]?/gi, 'high-entropy credential'],
];

// Files to skip scanning: only ArcKit's own security tooling and documentation
// (which legitimately discuss secret formats). Paths are resolved and matched
// relative to the plugin root — and, when the plugin runs from an ArcKit source
// checkout (<repo>/plugins/arckit-claude), the repo root — so user project files
// such as projects/x/docs/*.md or a README.md elsewhere are always scanned.
const PLUGIN_ROOT = canonicalPath(resolve(dirname(fileURLToPath(import.meta.url)), '..'));
const SOURCE_REPO_ROOT = basename(dirname(PLUGIN_ROOT)) === 'plugins'
  ? dirname(dirname(PLUGIN_ROOT))
  : null;

const PLUGIN_SKIP_PATTERNS = [
  /^hooks\/(?:secret-detection|secret-file-scanner|file-protection)\.mjs$/,
  /^commands\/[^/]+\.md$/,
  /^templates\/[^/]+\.md$/,
  /^docs\/(?:[^/]+\/)*[^/]+\.md$/,
  /^(?:README|CHANGELOG)\.md$/,
];

const SOURCE_REPO_SKIP_PATTERNS = [
  /^\.pre-commit-config\.yaml$/,
  /^\.secrets\.baseline$/,
  /^docs\/(?:[^/]+\/)*[^/]+\.md$/,
  /^(?:README|CHANGELOG)\.md$/,
];

function canonicalPath(p) {
  try { return realpathSync(p); } catch { /* not on disk yet */ }
  try { return join(realpathSync(dirname(p)), basename(p)); } catch { return p; }
}

function relativeWithin(root, absPath) {
  const rel = relative(root, absPath);
  if (!rel || rel.startsWith('..') || isAbsolute(rel)) return null;
  return rel.split(sep).join('/');
}

function shouldSkipFile(filePath, cwd) {
  if (!filePath) return false;
  const absPath = canonicalPath(resolve(cwd, filePath));
  const inPlugin = relativeWithin(PLUGIN_ROOT, absPath);
  if (inPlugin !== null && PLUGIN_SKIP_PATTERNS.some(p => p.test(inPlugin))) return true;
  if (SOURCE_REPO_ROOT) {
    const inRepo = relativeWithin(SOURCE_REPO_ROOT, absPath);
    if (inRepo !== null && SOURCE_REPO_SKIP_PATTERNS.some(p => p.test(inRepo))) return true;
  }
  return false;
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
if (shouldSkipFile(filePath, inputData.cwd || process.cwd())) process.exit(0);

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
