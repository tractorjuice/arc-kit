import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  checkBank, DOMAINS, PER_DOMAIN, EXPLANATION_MAX, PROMPT_MAX, OPTION_MAX,
} from '../../certification/worker/scripts/check-bank.mjs';

const fixture = new URL('./fixtures/awareness.sample.json', import.meta.url);
const sample = JSON.parse(readFileSync(fixture, 'utf8'));
const script = fileURLToPath(new URL('../../certification/worker/scripts/check-bank.mjs', import.meta.url));
const edit = (fn) => { const b = structuredClone(sample); fn(b); return checkBank(b); };
const has = (problems, re) => problems.some((p) => re.test(p));

test('the v2 sample bank is well-formed', () => {
  assert.deepEqual(checkBank(sample), []);
  assert.equal(PER_DOMAIN, 6);
  assert.deepEqual(DOMAINS, ['basics', 'people', 'templates', 'evidence', 'traceability']);
});

test('the sample holds placeholders only', () => {
  for (const q of sample.questions) {
    assert.match(q.prompt, /^Sample [a-z]+ \d\?$/);
    assert.deepEqual(q.options, ['A', 'B', 'C', 'D']);
    assert.match(q.explanation, /^Sample explanation for [a-z]+ \d\.$/);
  }
  assert.ok(new Set(sample.questions.map((q) => q.answer)).size === 4); // answers vary
});

test('top-level fields', () => {
  assert.ok(has(edit((b) => { b.bankVersion = ''; }), /bankVersion/));
  assert.ok(has(edit((b) => { b.level = 'foundation'; }), /level/));
  assert.ok(has(edit((b) => { b.passMark = 0.7; }), /passMark/));
  assert.ok(has(edit((b) => { b.drawPerDomain = 3; }), /drawPerDomain must be 2/));
  assert.ok(has(edit((b) => { delete b.drawPerDomain; }), /drawPerDomain/));
  assert.deepEqual(checkBank(null), ['bank must be a JSON object']);
  assert.deepEqual(checkBank([]), ['bank must be a JSON object']);
});

test('exactly the five domains, each named', () => {
  assert.ok(has(edit((b) => { delete b.domains.people; }), /domains missing: people/));
  assert.ok(has(edit((b) => { b.domains.extra = 'Extra'; }), /domains not allowed: extra/));
  assert.ok(has(edit((b) => { b.domains.basics = ' '; }), /domain basics needs a name/));
  assert.ok(has(edit((b) => { delete b.domains; }), /domains must be an object/));
  assert.ok(has(edit((b) => { b.questions[0].domain = 'other'; }), /question 1: domain must be one of/));
});

test('exactly 6 questions per domain, 30 in all', () => {
  const short = edit((b) => { b.questions.pop(); });
  assert.ok(has(short, /exactly 30 questions/));
  assert.ok(has(short, /domain traceability needs exactly 6 questions, not 5/));
  // 30 questions, but 7 in one domain and 5 in another.
  const lopsided = edit((b) => { b.questions[29].domain = 'basics'; });
  assert.equal(has(lopsided, /exactly 30 questions/), false);
  assert.ok(has(lopsided, /domain basics needs exactly 6 questions, not 7/));
  assert.ok(has(lopsided, /domain traceability needs exactly 6 questions, not 5/));
  assert.ok(has(edit((b) => { delete b.questions; }), /exactly 30 questions/));
});

test('unique IDs', () => {
  assert.ok(has(edit((b) => { b.questions[1].id = b.questions[0].id; }), /duplicate id s01/));
  assert.ok(has(edit((b) => { b.questions[1].id = ''; }), /question 2: id/));
});

test('four unique, non-empty options within the length limit', () => {
  assert.ok(has(edit((b) => { b.questions[0].options = ['A', 'A', 'B', 'C']; }), /duplicate option/));
  assert.ok(has(edit((b) => { b.questions[0].options = ['A', 'B', 'C']; }), /exactly 4 options/));
  assert.ok(has(edit((b) => { b.questions[0].options = ['A', 'B', 'C', 'D', 'E']; }), /exactly 4 options/));
  assert.ok(has(edit((b) => { b.questions[0].options[2] = ''; }), /option 3 must be a non-empty string/));
  assert.ok(has(edit((b) => { b.questions[0].options[1] = 'x'.repeat(OPTION_MAX + 1); }), /option 2 longer than 160/));
  assert.deepEqual(edit((b) => { b.questions[0].options[1] = 'x'.repeat(OPTION_MAX); }), []);
});

test('the answer is an integer from 0 to 3', () => {
  for (const bad of [4, -1, 1.5, '1', null]) {
    assert.ok(has(edit((b) => { b.questions[0].answer = bad; }), /answer out of range/), String(bad));
  }
});

test('prompt length limits', () => {
  assert.ok(has(edit((b) => { b.questions[0].prompt = 'Short?'; }), /prompt too short/));
  assert.ok(has(edit((b) => { b.questions[0].prompt = 'x'.repeat(PROMPT_MAX + 1); }), /prompt longer than 200/));
  assert.deepEqual(edit((b) => { b.questions[0].prompt = 'x'.repeat(PROMPT_MAX); }), []);
});

test('every question has an explanation of at most 300 characters', () => {
  assert.ok(has(edit((b) => { delete b.questions[3].explanation; }), /question 4: explanation missing/));
  assert.ok(has(edit((b) => { b.questions[3].explanation = '   '; }), /question 4: explanation missing/));
  assert.ok(has(edit((b) => { b.questions[3].explanation = 'x'.repeat(EXPLANATION_MAX + 1); }), /explanation longer than 300/));
  assert.deepEqual(edit((b) => { b.questions[3].explanation = 'x'.repeat(EXPLANATION_MAX); }), []);
});

test('a question that is not an object is reported, not thrown', () => {
  assert.ok(has(edit((b) => { b.questions[5] = 'oops'; }), /question 6: must be an object/));
  assert.ok(has(edit((b) => { b.questions[5] = null; }), /question 6: must be an object/));
});

test('the CLI prints "Bank OK" or the problems and exits 1', () => {
  const ok = spawnSync(process.execPath, [script, fileURLToPath(fixture)], { encoding: 'utf8' });
  assert.equal(ok.status, 0);
  assert.equal(ok.stdout.trim(), 'Bank OK');

  const dir = mkdtempSync(join(tmpdir(), 'check-bank-'));
  try {
    const badPath = join(dir, 'bad.json');
    const bad = structuredClone(sample);
    bad.questions[0].answer = 9;
    writeFileSync(badPath, JSON.stringify(bad));
    const out = spawnSync(process.execPath, [script, badPath], { encoding: 'utf8' });
    assert.equal(out.status, 1);
    assert.match(out.stderr, /question 1: answer out of range/);

    const brokenPath = join(dir, 'broken.json');
    writeFileSync(brokenPath, '{"questions": [ "the answer is B"');
    const broken = spawnSync(process.execPath, [script, brokenPath], { encoding: 'utf8' });
    assert.equal(broken.status, 1);
    assert.doesNotMatch(broken.stderr, /the answer is B/); // never echoes the file
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
  const none = spawnSync(process.execPath, [script], { encoding: 'utf8' });
  assert.equal(none.status, 1);
  assert.match(none.stderr, /Usage/);
});

test('a lopsided answer spread warns on stdout but still passes', () => {
  const dir = mkdtempSync(join(tmpdir(), 'check-bank-'));
  try {
    const path = join(dir, 'skewed.json');
    const skewed = structuredClone(sample);
    skewed.questions.forEach((q, i) => { q.answer = i < 27 ? i % 3 : 3; });
    writeFileSync(path, JSON.stringify(skewed));
    const out = spawnSync(process.execPath, [script, path], { encoding: 'utf8' });
    assert.equal(out.status, 0);
    assert.match(out.stdout, /Warning: answer position D holds only 3 of 30/);
    assert.match(out.stdout, /Bank OK/);
    const fine = spawnSync(process.execPath, [script, fileURLToPath(fixture)], { encoding: 'utf8' });
    assert.doesNotMatch(fine.stdout, /Warning/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
