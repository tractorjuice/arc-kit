import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadData, validateData, main } from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const source = () => ({
  title: 'T', publisher: 'Food Standards Agency', url: 'https://example.test/a.pdf',
  publication: 'https://example.test/', retrieved: '2026-11-17', file: 'a.pdf',
  sha256: 'a'.repeat(64), pages: 100, licence: 'OGL-3.0', attribution: 'x'
});
const base = () => ({
  source: source(), front: null, diary: null, limits: null,
  sections: new Map([['CK', {
    schema: 'uk-food-sfbb-data-1.0', data: 'sfbb-caterers-2026-11-17',
    section: { id: 'CK', code: 'FOODCOOK', title: 'Cooking', intro: [{ text: 'x', page: 55 }] },
    methods: [{ id: 'CK-06', title: 'Hot holding', pages: [65, 66], blocks: [
      { kind: 'points', rows: [{ id: 'CK-06-P01', point: 'p', why: 'w', page: 65,
        questions: [{ id: 'CK-06-Q01', text: 'Do you?', type: 'yes-no', options: ['Yes', 'No'] }] }], page: 65 }
    ] }]
  }]])
});
const method = (d) => d.sections.get('CK').methods[0];
const row = (d) => method(d).blocks[0].rows[0];

test('valid data has no problems', () => assert.deepEqual(validateData(base()), []));

const rejects = [
  ['a duplicate identifier', (d) => { method(d).blocks[0].rows.push({ ...row(d) }); }, /duplicate identifier CK-06-P01/],
  ['a question type outside the five', (d) => { row(d).questions[0].type = 'maybe'; }, /type "maybe"/],
  ['a row with no page', (d) => { delete row(d).page; }, /no page/],
  ['a method whose identifier does not start with its section', (d) => { method(d).id = 'CL-06'; }, /does not start with CK-/],
  ['a page outside 1 to 100', (d) => { row(d).page = 101; }, /outside 1 to 100/],
  ['a method with empty pages', (d) => { method(d).pages = []; }, /pages is empty/],
  ['options that are not an array of strings', (d) => { row(d).questions[0].options = 'Yes'; }, /options is not an array of strings/]
];
for (const [name, mutate, pattern] of rejects) {
  test(`validateData rejects ${name}`, () => {
    const d = base();
    mutate(d);
    assert.match(validateData(d).join('\n'), pattern);
  });
}

test('validateData reports a missing source', () => {
  const d = base();
  d.source = null;
  assert.match(validateData(d).join('\n'), /source.json: missing/);
});

test('loadData tolerates absent files', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-'));
  writeFileSync(join(dir, 'source.json'), JSON.stringify(source()));
  const d = loadData(dir);
  assert.equal(d.sections.size, 0);
  assert.equal(d.front, null);
  assert.equal(d.diary, null);
  assert.equal(d.limits, null);
});

test('the shipped data validates from the CLI', () => {
  const r = run('validate-data');
  assert.equal(r.status, 0, r.stderr);
});

test('the CLI exits 1 on invalid data and 2 on usage errors', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-'));
  assert.equal(run('validate-data', '--data', dir).status, 1);
  assert.equal(run('frobnicate').status, 2);
  assert.match(run('frobnicate').stderr, /usage:/);
  assert.equal(run().status, 2);
  assert.equal(run('validate-data', '--bogus').status, 2);
  assert.equal(main(['nope'], { out() {}, err() {} }), 2);
});
