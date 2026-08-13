import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SCANNER = resolve('plugins/arckit-claude/hooks/secret-file-scanner.mjs');
const DETECTION = resolve('plugins/arckit-claude/hooks/secret-detection.mjs');

// Test vectors are assembled from fragments at runtime so this source file
// contains no key/separator/value adjacency or token literal — otherwise the
// scanner (rightly) blocks the Write of this very file. The key, the separator
// and the value are always passed as separate arguments and joined at runtime.
const J = (...parts) => parts.join('');
const kv = (key, val, sep = ' = ') => `${key}${sep}${val}`;

// Run the PreToolUse file scanner with a Write of `content`. Returns true if blocked.
function scannerBlocks(content) {
  const input = JSON.stringify({
    tool_name: 'Write',
    tool_input: { file_path: 'main.tf', content },
  });
  const r = spawnSync('node', [SCANNER], { input, encoding: 'utf-8' });
  return r.stdout.includes('"decision":"block"');
}

// Run the UserPromptSubmit detection hook with `prompt`. Returns true if blocked.
function detectionBlocks(prompt) {
  const input = JSON.stringify({ prompt });
  const r = spawnSync('node', [DETECTION], { input, encoding: 'utf-8' });
  return r.stdout.includes('"decision":"block"');
}

// --- The bug: references to secrets are not secret material and must be allowed ---
const REFERENCES_ALLOWED = [
  kv('secret', 'module.sm.secret_ids["my-secret"]'),                  // Terraform data source
  kv('client_secret', 'google_iam_oauth_client_credential.x.client_secret'),
  kv('password', 'var.db_password'),                                  // Terraform variable
  kv('api_key', 'process.env.API_KEY'),                               // app code
  kv('secret', 'config.requireSecret("db")'),                         // Pulumi
  kv('password', 'secretKeyRef.name'),                                // Kubernetes
  kv('token', 'Token.fromAsset(path)'),                               // AWS CDK
  kv('api_key', 'local.api_key'),                                     // Terraform local
  kv('password', 'os.environ["DB_PASSWORD"]'),                        // Python
  kv('aws_secret_access_key', 'var.aws_secret'),                      // Terraform
  kv('atlassian_token', 'process.env.ATLASSIAN_TOKEN'),              // app code
  kv('jira_token', 'config.get("jira.token")'),                      // app code
];

for (const line of REFERENCES_ALLOWED) {
  test(`scanner allows reference: ${line}`, () => {
    assert.equal(scannerBlocks(line), false);
  });
  test(`detection allows reference: ${line}`, () => {
    assert.equal(detectionBlocks(line), false);
  });
}

// --- Declared capability levels are not secret material ---
// GitHub Actions spells an OIDC permission as the id-token key set to the
// value `write`, so the generic key-value rule blocked every workflow that
// publishes without a stored credential — including this repo's own release
// workflow. The value is a permission level, never credential material.
const CAPABILITY_VALUES_ALLOWED = [
  kv('id-token', 'write', ': '),
  kv('id-token', 'none', ': '),
  kv('token', 'read', ': '),
  kv('password', 'none', ': '),
];

for (const line of CAPABILITY_VALUES_ALLOWED) {
  test(`scanner allows capability level: ${line}`, () => {
    assert.equal(scannerBlocks(line), false);
  });
  test(`detection allows capability level: ${line}`, () => {
    assert.equal(detectionBlocks(line), false);
  });
}

// --- Capability levels stay exempt anywhere in the input, not only at the end ---
// The exemption was anchored with `$` under `gi` and no `m`, so it only fired
// when the permission line was the last content in the string. Real input is
// multi-line: a workflow has jobs after the permissions block, and an audit
// report quotes the line mid-paragraph. Both were blocked (#737), which meant
// the file scanner — whose input is multi-line by definition — never got the
// OIDC exemption at all.
const OIDC = kv('id-token', 'write', ': ');
const MULTILINE_CAPABILITY_ALLOWED = [
  ['workflow with jobs after the permissions block',
    ['permissions:', '  contents: read', `  ${OIDC}`, 'jobs:', '  publish:', '    runs-on: ubuntu-latest'].join('\n')],
  ['permission line quoted mid-prose',
    ['The release workflow grants', `  ${OIDC}`, 'so it can publish without a stored credential.'].join('\n')],
  ['permission line with trailing whitespace',
    [`${OIDC}   `, 'jobs:'].join('\n')],
];

for (const [name, content] of MULTILINE_CAPABILITY_ALLOWED) {
  test(`scanner allows capability level in multi-line content: ${name}`, () => {
    assert.equal(scannerBlocks(content), false);
  });
  test(`detection allows capability level in multi-line prompt: ${name}`, () => {
    assert.equal(detectionBlocks(content), false);
  });
}

// --- ...but a literal value is still caught when it is not the last line ---
const MULTILINE_LITERALS_BLOCKED = [
  ['literal value mid-file',
    ['jobs:', `  ${kv('auth_token', 'l1teralcredentialvalue', ': ')}`, 'runs-on: ubuntu-latest'].join('\n')],
  ['value that merely starts with a level word',
    [kv('token', 'writeKeyABC123', ': '), 'jobs:'].join('\n')],
];

for (const [name, content] of MULTILINE_LITERALS_BLOCKED) {
  test(`scanner blocks literal in multi-line content: ${name}`, () => {
    assert.equal(scannerBlocks(content), true);
  });
  test(`detection blocks literal in multi-line prompt: ${name}`, () => {
    assert.equal(detectionBlocks(content), true);
  });
}

// --- Literal secrets must STILL be blocked (no regression) ---
const LITERALS_BLOCKED = [
  kv('pwd', 'hunter2', '='),                            // no whitespace
  kv('secret', 'AbingoSuperSecretValue123'),
  kv('password', 'correcthorsebatterystaple', ': '),
];

for (const line of LITERALS_BLOCKED) {
  test(`scanner blocks literal: ${line}`, () => {
    assert.equal(scannerBlocks(line), true);
  });
  test(`detection blocks literal: ${line}`, () => {
    assert.equal(detectionBlocks(line), true);
  });
}

// --- Provider token formats must STILL be blocked (untouched rules) ---
const TOKENS_BLOCKED = [
  J('sk-ant-', 'api03', 'abcdefghijklmnopqrstuvwxyz0123456789'),       // Anthropic
  J('ghp_', 'abcdefghijklmnopqrstuvwxyz0123456789AB'),                 // GitHub PAT
  J('AIza', 'Sy', 'A1234567890abcdefghijklmnopqrstuvw'),               // Google
  J('AKIA', 'IOSFODNN7EXAMPLE'),                                       // AWS access key id
  J('-----BEGIN RSA ', 'PRIVATE KEY-----'),                            // PEM header
];

for (const line of TOKENS_BLOCKED) {
  test(`scanner blocks provider-token format ${line.slice(0, 16)}…`, () => {
    assert.equal(scannerBlocks(line), true);
  });
}

// --- The two pattern libraries must stay in sync (header comments say so) ---
function extractPatternBlock(file) {
  const src = readFileSync(file, 'utf-8');
  const start = src.indexOf(J('const SECRET_', 'PATTERNS = ['));
  assert.notEqual(start, -1, `pattern block not found in ${file}`);
  const end = src.indexOf('];', start);
  assert.notEqual(end, -1, `pattern block not closed in ${file}`);
  return src.slice(start, end + 2);
}

test('secret-file-scanner and secret-detection share an identical pattern block', () => {
  assert.equal(extractPatternBlock(SCANNER), extractPatternBlock(DETECTION));
});

// The pattern block interpolates two guard constants declared above it, so
// comparing the block alone let the copies drift on the guards themselves —
// which is where #737 lived.
function extractGuards(file) {
  const src = readFileSync(file, 'utf-8');
  const guards = src.match(/^const (?:REF|LEVEL) = String\.raw`.*`;$/gm);
  assert.ok(guards, `guard constants not found in ${file}`);
  assert.equal(guards.length, 2, `expected 2 guard constants in ${file}, found ${guards.length}`);
  return guards.join('\n');
}

test('secret-file-scanner and secret-detection share identical guard constants', () => {
  assert.equal(extractGuards(SCANNER), extractGuards(DETECTION));
});
