import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerCommandTools } from '../dist/tools/command-tools.js';

const callbacks = new Map();
registerCommandTools({ tools: { register: (name, schema, fn) => callbacks.set(name, fn) } });
// The assessment moved into the optional UK overlay as uk-legacy-assessment.
const run = callbacks.get('arckit-uk-legacy-assessment');
assert.ok(run, 'arckit-uk-legacy-assessment is registered');

test('malformed tool input returns an error rather than throwing', async () => {
  for (const input of [
    null,
    42,
    [],
    {},
    { topic: 7 },
    { topic: ' ' },
    { topic: 'x'.repeat(20001) }
  ])
    assert.ok((await run(input, {})).error);
});
test('user topics preserve JavaScript replacement tokens literally', async () => {
  const topic = "$& $' $` {arckit_package_root}";
  const response = await run({ topic }, {});
  assert.equal(response.data.topic, topic);
  assert.ok(response.content.includes(topic));
  assert.ok(response.content.includes('/scripts/legacy-assessment.mjs'));
});
test('the built command resolves every required runtime asset', async () => {
  const { existsSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const response = await run({ topic: '001' }, {});
  for (const relative of [
    'scripts/legacy-assessment.mjs',
    'schemas/legacy-assessment-1.0.schema.json',
    'data/legacy-frameworks-1.0.json',
    'data/legacy-risk-rubric-2026-08-17.json',
    'data/legacy-definition-2026-08-17.json'
  ]) {
    assert.ok(existsSync(new URL(`../${relative}`, import.meta.url)));
    assert.ok(response.content.includes(root + relative));
  }
});
test('every command resolves its package assets to files the package publishes', async () => {
  const { existsSync, readFileSync } = await import('node:fs');
  const { fileURLToPath } = await import('node:url');
  const root = fileURLToPath(new URL('../', import.meta.url));
  const published = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
    .files.map((entry) => entry.replace(/\/$/, ''));
  const escaped = root.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const assetPath = new RegExp(escaped + "([^\\s`'\")\\]]+)", 'g');
  assert.ok(callbacks.size > 100, 'every converted command is registered');
  for (const [name, command] of callbacks) {
    const { content } = await command({ topic: '001' }, {});
    assert.ok(!content.includes('{arckit_package_root}'), `${name}: package root substituted`);
    assert.ok(!/scripts\/bash\/(references|templates|schemas|data|skills)\//.test(content),
      `${name}: no asset resolves under scripts/bash`);
    for (const [, match] of content.matchAll(assetPath)) {
      const relative = match.replace(/[.,;:]+$/, '');
      // /arckit-customize lists glob patterns for overlay template folders,
      // which are not files.
      if (/[*{]/.test(relative) || relative.startsWith('..')) continue;
      assert.ok(existsSync(root + relative), `${name}: ${relative} exists`);
      assert.ok(published.includes(relative.split('/')[0]) || published.includes(relative),
        `${name}: ${relative} is in package.json files`);
    }
  }
});
