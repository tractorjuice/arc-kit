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
