import { test } from 'node:test';
import assert from 'node:assert/strict';
import { registerCommandTools } from '../dist/tools/command-tools.js';

const callbacks = new Map();
registerCommandTools({ tools: { register: (name, schema, fn) => callbacks.set(name, fn) } });
const run = callbacks.get('arckit-legacy-assessment');

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
