import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { checkBank } from '../../certification/worker/scripts/check-bank.mjs';

const sample = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));

test('sample bank is well-formed', () => {
  assert.deepEqual(checkBank(sample), []);
});

test('catches structural problems', () => {
  assert.ok(checkBank({ ...sample, bankVersion: '' }).length > 0);
  assert.ok(checkBank({ ...sample, questions: sample.questions.slice(1) }).some((p) => /10 questions/.test(p)));
  const dupId = structuredClone(sample); dupId.questions[1].id = dupId.questions[0].id;
  assert.ok(checkBank(dupId).some((p) => /duplicate id/.test(p)));
  const badAns = structuredClone(sample); badAns.questions[0].answer = 9;
  assert.ok(checkBank(badAns).some((p) => /answer/.test(p)));
  const dupOpt = structuredClone(sample); dupOpt.questions[0].options = ['A', 'A', 'B', 'C'];
  assert.ok(checkBank(dupOpt).some((p) => /duplicate option/.test(p)));
});
