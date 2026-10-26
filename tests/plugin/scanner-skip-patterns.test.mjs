import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const REPO = resolve('.');
const SCANNER = resolve('plugins/arckit-claude/hooks/secret-file-scanner.mjs');

// Assembled at runtime so this file itself does not trip the scanner.
const SECRET_CONTENT = ['pass', 'word', ' = ', 'hunter2-literal'].join('');

function scannerBlocks(filePath, cwd = REPO) {
  const input = JSON.stringify({
    tool_name: 'Write',
    cwd,
    tool_input: { file_path: filePath, content: SECRET_CONTENT },
  });
  const r = spawnSync('node', [SCANNER], { input, encoding: 'utf-8', cwd });
  return r.stdout.includes('"decision":"block"');
}

const SCANNED = [
  'projects/001-demo/docs/leak.md',
  'mydocs/leak.md',
  'EVIL-README.md',
  'x-CHANGELOG.md',
  'projects/001-demo/README.md',
  'projects/001-demo/CHANGELOG.md',
  'projects/001-demo/secret-detection.mjs',
  'projects/001-demo/.secrets.baseline',
  'projects/001-demo/.pre-commit-config.yaml',
  'plugins/arckit-claude/commands/sub/leak.md',
  'plugins/arckit-claude/commands/../../../leak.md',
  'plugins/arckit-claude/docs/leak.txt',
  'other/arckit-claude/commands/leak.md',
  '/tmp/somewhere/docs/leak.md',
  '/tmp/somewhere/README.md',
];

for (const p of SCANNED) {
  test(`scanner scans ${p}`, () => {
    assert.equal(scannerBlocks(p), true);
  });
}

const SKIPPED = [
  'plugins/arckit-claude/commands/research.md',
  'plugins/arckit-claude/templates/research-template.md',
  'plugins/arckit-claude/docs/guides/security-hooks.md',
  'plugins/arckit-claude/README.md',
  'plugins/arckit-claude/CHANGELOG.md',
  'plugins/arckit-claude/hooks/secret-detection.mjs',
  'plugins/arckit-claude/hooks/secret-file-scanner.mjs',
  'plugins/arckit-claude/hooks/file-protection.mjs',
  'docs/guides/security-hooks.md',
  'README.md',
  'CHANGELOG.md',
  '.pre-commit-config.yaml',
  '.secrets.baseline',
];

for (const p of SKIPPED) {
  test(`scanner skips ArcKit's own ${p}`, () => {
    assert.equal(scannerBlocks(p), false);
    assert.equal(scannerBlocks(resolve(REPO, p), '/tmp'), false);
  });
}
