import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateName, validateAnswers, NAME_MAX } from '../../certification/worker/src/validate.mjs';

const bank = JSON.parse(readFileSync(new URL('./fixtures/awareness.sample.json', import.meta.url), 'utf8'));

test('accepts and tidies ordinary names', () => {
  assert.deepEqual(validateName('  Mark   Craddock '), { ok: true, value: 'Mark Craddock' });
});

test('keeps non-ASCII names exactly (NFC)', () => {
  for (const n of ['José María Blázquez', 'Armağan Tekin', 'Jürgen Schmidt', 'Théo Bekhedda']) {
    assert.deepEqual(validateName(n), { ok: true, value: n.normalize('NFC') });
  }
  assert.equal(validateName('José').value, 'José'); // decomposed accent is normalised
});

test('rejects HTML, links and control characters', () => {
  for (const n of ['<script>alert(1)</script>', '"><img src=x onerror=alert(1)>', 'Visit https://x.test', 'www.spam.example']) {
    assert.equal(validateName(n).ok, false, n);
  }
  assert.equal(validateName('Mark\u0000Craddock').value, 'MarkCraddock');
});

test('rejects missing, short and long names', () => {
  assert.equal(validateName(undefined).ok, false);
  assert.equal(validateName(' A ').ok, false);
  assert.equal(validateName('x'.repeat(NAME_MAX + 1)).ok, false);
  assert.equal(validateName('x'.repeat(NAME_MAX)).ok, true);
});

test('answers must be one in-range integer per question', () => {
  const good = bank.questions.map(() => 0);
  assert.deepEqual(validateAnswers(good, bank), { ok: true, value: good });
  assert.equal(validateAnswers(good.slice(1), bank).ok, false);       // too few
  assert.equal(validateAnswers([...good, 0], bank).ok, false);        // too many
  assert.equal(validateAnswers(good.map((_, i) => (i === 3 ? 4 : 0)), bank).ok, false); // out of range
  assert.equal(validateAnswers(good.map((_, i) => (i === 3 ? '1' : 0)), bank).ok, false); // string
  assert.equal(validateAnswers(good.map((_, i) => (i === 3 ? null : 0)), bank).ok, false); // unanswered
  assert.match(validateAnswers(good.map((_, i) => (i === 3 ? null : 0)), bank).error, /question 4/);
  assert.equal(validateAnswers('0,0,0', bank).ok, false);
});

test('line breaks and tabs become spaces before control characters are stripped', () => {
  assert.equal(validateName('Mark\nCraddock').value, 'Mark Craddock');
  assert.equal(validateName('Mark\tCraddock').value, 'Mark Craddock');
  assert.equal(validateName('Mark\r\nCraddock').value, 'Mark Craddock');
});

test('strips invisible format and bidi controls, keeps ZWNJ and ZWJ', () => {
  assert.equal(validateName('Mark\u202ECraddock').value, 'MarkCraddock'); // right-to-left override
  assert.equal(validateName('\u200BAl').value, 'Al'); // zero-width space
  for (const c of ['\u061C', '\u200E', '\u200F', '\u202A', '\u2060', '\u2064', '\u2066', '\u2069', '\uFEFF']) {
    assert.equal(validateName(`Sam${c}Ng`).value.includes(c), false, c.codePointAt(0).toString(16));
  }
  assert.equal(validateName('\u200B\u200B').ok, false); // nothing visible left
  const zwnj = 'Mehdi\u200Czadeh';
  assert.equal(validateName(zwnj).value, zwnj);
  const zwj = 'Ka\u200Dmala';
  assert.equal(validateName(zwj).value, zwj);
});

test('a decomposed accent is composed (NFC)', () => {
  const out = validateName('Jose\u0301');
  assert.equal(out.value, 'Jos\u00E9');
  assert.equal(out.value.length, 4);
});
