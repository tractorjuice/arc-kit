import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publicQuestions, requiredScore, mark } from '../../certification/worker/src/quiz.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));
const key = bank.questions.map((q) => q.answer);

test('publicQuestions never exposes answers', () => {
  const pub = publicQuestions(bank);
  assert.equal(pub.questions.length, 10);
  assert.equal(pub.bankVersion, 'sample-1');
  for (const q of pub.questions) assert.equal('answer' in q, false);
  assert.equal(JSON.stringify(pub).includes('"answer"'), false);
});

test('80% of 10 needs 8 correct', () => {
  assert.equal(requiredScore(bank), 8);
  assert.equal(requiredScore({ ...bank, passMark: 0.7, questions: Array(40).fill(bank.questions[0]) }), 28);
});

test('all correct passes', () => {
  assert.deepEqual(mark(bank, key), { score: 10, total: 10, required: 8, passed: true });
});

test('exactly 8 correct passes, 7 fails', () => {
  const eight = key.map((a, i) => (i < 2 ? (a + 1) % 4 : a));
  const seven = key.map((a, i) => (i < 3 ? (a + 1) % 4 : a));
  assert.equal(mark(bank, eight).passed, true);
  assert.equal(mark(bank, seven).passed, false);
  assert.equal(mark(bank, seven).score, 7);
});
