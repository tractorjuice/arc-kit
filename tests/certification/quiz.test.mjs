import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  drawIds, isDrawable, isWholeDraw, mark, publicDraw, randomInt, requiredScore, resolveDraw, shuffle,
} from '../../certification/worker/src/quiz.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));
const byId = new Map(bank.questions.map((q) => [q.id, q]));
const keyFor = (ids) => ids.map((id) => byId.get(id).answer);
const wrong = (a) => (a + 1) % 4;

// Every key anywhere in a JSON value, however deeply nested.
function allKeys(value, out = new Set()) {
  if (Array.isArray(value)) value.forEach((v) => allKeys(v, out));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) { out.add(k); allKeys(v, out); }
  }
  return out;
}

test('a draw is always 2 per domain: 10 distinct IDs from the bank', () => {
  for (let n = 0; n < 500; n++) {
    const ids = drawIds(bank);
    assert.equal(ids.length, 10);
    assert.equal(new Set(ids).size, 10);
    const perDomain = {};
    for (const id of ids) {
      assert.ok(byId.has(id), id);
      const d = byId.get(id).domain;
      perDomain[d] = (perDomain[d] || 0) + 1;
    }
    assert.deepEqual(perDomain, { basics: 2, people: 2, templates: 2, evidence: 2, traceability: 2 });
  }
});

test('draws vary in which questions they pick and in their order', () => {
  const orders = new Set();
  const firstDomains = new Set();
  const seen = new Set();
  for (let n = 0; n < 500; n++) {
    const ids = drawIds(bank);
    orders.add(ids.join(','));
    firstDomains.add(byId.get(ids[0]).domain);
    ids.forEach((id) => seen.add(id));
  }
  assert.ok(orders.size > 450, `only ${orders.size} distinct orders in 500 draws`);
  assert.equal(firstDomains.size, 5); // the order is shuffled, not grouped by domain
  assert.equal(seen.size, 30); // every question gets drawn (each has a 1-in-3 chance per draw)
});

test('randomInt rejects values in the biased tail instead of folding them in', () => {
  const values = [0xFFFFFFFF, 0xFFFFFFFE, 7];
  const fill = (a) => { a[0] = values.shift(); return a; };
  // 2^32 % 3 === 1, so only 0xFFFFFFFF is above the last whole multiple of 3.
  assert.equal(randomInt(3, fill), 0xFFFFFFFE % 3);
  assert.deepEqual(values, [7]);
  assert.equal(randomInt(1), 0);
  assert.throws(() => randomInt(0), RangeError);
  for (let n = 0; n < 1000; n++) {
    const r = randomInt(6);
    assert.ok(Number.isInteger(r) && r >= 0 && r < 6);
  }
});

test('shuffle is a permutation and leaves its input alone', () => {
  const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const out = shuffle(input);
  assert.deepEqual([...out].sort((a, b) => a - b), input);
  assert.deepEqual(input, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  // Fisher–Yates asks for a value in [0, i + 1) for i = n-1 down to 1. The
  // biased Sattolo variant asks for [0, i) and would record 3, 2, 1.
  const bounds = [];
  shuffle([1, 2, 3, 4], (n) => { bounds.push(n); return 0; });
  assert.deepEqual(bounds, [4, 3, 2]);
});

test('isDrawable and drawIds agree on bad banks, so the Worker answers 503 not 500', () => {
  assert.equal(isDrawable(bank), true);
  const nullQuestion = structuredClone(bank);
  nullQuestion.questions[0] = null;
  assert.equal(isDrawable(nullQuestion), false);
  for (const v of [undefined, 7, null, '']) {
    const b = structuredClone(bank);
    b.bankVersion = v;
    assert.equal(isDrawable(b), false, String(v));
  }
});

test('isWholeDraw wants drawPerDomain from every domain', () => {
  const ids = drawIds(bank);
  assert.equal(isWholeDraw(bank, resolveDraw(bank, ids)), true);
  assert.equal(isWholeDraw(bank, resolveDraw(bank, ids.slice(0, 1))), false);
  const inDomain = bank.questions.filter((q) => q.domain === 'basics').slice(0, 10).map((q) => q.id);
  assert.equal(isWholeDraw(bank, resolveDraw(bank, inDomain)), false);
  assert.equal(isWholeDraw(bank, null), false);
});

test('the public view of a draw holds no answer or explanation, at any depth', () => {
  for (let n = 0; n < 50; n++) {
    const ids = drawIds(bank);
    const pub = publicDraw(bank, ids);
    const keys = allKeys(pub);
    assert.equal(keys.has('answer'), false);
    assert.equal(keys.has('explanation'), false);
    assert.doesNotMatch(JSON.stringify(pub), /"answer"|"explanation"|Sample explanation/);
    assert.deepEqual(Object.keys(pub), ['level', 'bankVersion', 'total', 'required', 'questions']);
    assert.equal(pub.total, 10);
    assert.equal(pub.required, 8);
    assert.equal(pub.bankVersion, 'sample-2');
    assert.deepEqual(pub.questions.map((q) => q.id), ids);
    for (const q of pub.questions) {
      assert.deepEqual(Object.keys(q), ['id', 'domain', 'domainName', 'prompt', 'options']);
      assert.equal(q.domainName, bank.domains[q.domain]);
    }
  }
});

test('the public view copies options, so it cannot reach back into the bank', () => {
  const ids = drawIds(bank);
  const pub = publicDraw(bank, ids);
  pub.questions[0].options.push('E');
  assert.equal(byId.get(ids[0]).options.length, 4);
});

test('80% of 10 needs 8 correct; 70% of 40 needs 28', () => {
  assert.equal(requiredScore(0.8, 10), 8);
  assert.equal(requiredScore(0.7, 40), 28);
});

test('resolveDraw refuses unknown, repeated or empty ID lists', () => {
  assert.equal(resolveDraw(bank, ['s01', 'nope']), null);
  assert.equal(resolveDraw(bank, ['s01', 's01']), null);
  assert.equal(resolveDraw(bank, []), null);
  assert.equal(resolveDraw(bank, 's01'), null);
  assert.deepEqual(resolveDraw(bank, ['s03', 's01']).map((q) => q.id), ['s03', 's01']);
});

test('all correct passes, with a review of every drawn question in draw order', () => {
  const ids = drawIds(bank);
  const out = mark(bank, ids, keyFor(ids));
  assert.equal(out.score, 10);
  assert.equal(out.passed, true);
  assert.deepEqual(out.areasToRevisit, []);
  assert.equal(out.review.length, 10);
  out.review.forEach((r, i) => {
    const q = byId.get(ids[i]);
    assert.deepEqual(r, {
      id: q.id, prompt: q.prompt, yourAnswer: q.options[q.answer], correctAnswer: q.options[q.answer], correct: true, explanation: q.explanation,
    });
  });
});

test('exactly 8 correct passes, 7 fails', () => {
  const ids = drawIds(bank);
  const key = keyFor(ids);
  const eight = key.map((a, i) => (i < 2 ? wrong(a) : a));
  const seven = key.map((a, i) => (i < 3 ? wrong(a) : a));
  assert.equal(mark(bank, ids, eight).passed, true);
  assert.equal(mark(bank, ids, seven).passed, false);
  assert.equal(mark(bank, ids, seven).score, 7);
  const r = mark(bank, ids, eight).review[0];
  assert.equal(r.correct, false);
  assert.equal(r.yourAnswer, byId.get(ids[0]).options[eight[0]]);
  assert.notEqual(r.yourAnswer, r.correctAnswer);
});

test('areasToRevisit names each missed domain once, in the bank\'s domain order', () => {
  // The draw order puts traceability before basics on purpose.
  const ids = ['s25', 's01', 's26', 's02', 's07', 's08', 's13', 's14', 's19', 's20'];
  const key = keyFor(ids);
  const answers = key.map((a, i) => (i < 3 ? wrong(a) : a)); // two traceability, one basics
  const out = mark(bank, ids, answers);
  assert.equal(out.score, 7);
  assert.deepEqual(out.areasToRevisit, ['Basics (sample)', 'Traceability (sample)']);
});

test('isDrawable accepts a v2 bank and refuses the old shape or a thin domain', () => {
  assert.equal(isDrawable(bank), true);
  assert.equal(isDrawable(null), false);
  const { domains, drawPerDomain, ...v1 } = bank;
  assert.equal(isDrawable(v1), false);
  const thin = { ...bank, questions: bank.questions.filter((q) => q.domain !== 'basics' || q.id === 's06') };
  assert.equal(isDrawable(thin), false);
  assert.throws(() => drawIds(thin), /too few/);
});
