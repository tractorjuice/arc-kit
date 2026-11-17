import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  FORMS, FROM_IMAGE_PAGES, QUESTION_TYPES, loadData, validateData, main
} from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

const helper = 'plugins/arckit-uk-food/scripts/uk-food.mjs';
const run = (...args) => spawnSync('node', [helper, ...args], { encoding: 'utf8' });
const source = () =>
  JSON.parse(readFileSync('plugins/arckit-uk-food/data/sfbb-caterers-2026-11-17/source.json', 'utf8'));
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
  ['a question type outside the six', (d) => { row(d).questions[0].type = 'maybe'; }, /type "maybe"/],
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

// The shared fixture and mutation table, also run by tests/plugin/test_uk_food_data.py,
// keep validateData and the JSON schema accepting and rejecting the same files.
const shared = (name) => JSON.parse(readFileSync(`tests/fixtures/uk-food/${name}`, 'utf8'));
const asData = (doc) => ({
  source: doc.source, front: doc.front ?? null, diary: doc.diary ?? null, limits: null,
  sections: new Map([[doc.section.section.id, doc.section]])
});
const apply = (doc, ops) => {
  const copy = structuredClone(doc);
  for (const { op, path, value } of ops) {
    const keys = path.split('/').slice(1).map((k) => (/^\d+$/.test(k) ? Number(k) : k));
    const last = keys.pop();
    const parent = keys.reduce((node, key) => node[key], copy);
    if (op === 'delete') delete parent[last];
    else parent[last] = value;
  }
  return copy;
};

test('the shared all-fields fixture validates', () => {
  assert.deepEqual(validateData(asData(shared('data-every-field.json'))), []);
});

// validateData and the JSON schema each write out the form names and the question types; the two
// copies must stay the same list.
const schema = () =>
  JSON.parse(readFileSync('plugins/arckit-uk-food/schemas/uk-food-sfbb-data-1.0.schema.json', 'utf8'));

test('the form names in validateData are the schema\'s form names', () => {
  assert.deepEqual(FORMS, schema().$defs.form.enum);
});

test('the question types in validateData are the schema\'s question types', () => {
  assert.deepEqual(QUESTION_TYPES, schema().$defs.question.properties.type.enum);
});

// fromImage hides a block from the coverage test, so only the diary pages named here may use it.
test('the pages allowed fromImage are diary pages, in order, each once', () => {
  assert.ok(Array.isArray(FROM_IMAGE_PAGES));
  for (const [i, page] of FROM_IMAGE_PAGES.entries()) {
    assert.ok(Number.isInteger(page) && page >= 78 && page <= 100, `${page} is not a diary page`);
    if (i > 0) assert.ok(page > FROM_IMAGE_PAGES[i - 1], `${page} is out of order or repeated`);
  }
});

test('loadData returns front.json as its page objects, and validateData checks them', () => {
  const dir = mkdtempSync(join(tmpdir(), 'uk-food-'));
  const { front } = shared('data-every-field.json');
  writeFileSync(join(dir, 'source.json'), JSON.stringify(source()));
  writeFileSync(join(dir, 'front.json'), JSON.stringify(front));
  const d = loadData(dir);
  assert.deepEqual(d.front, front);
  assert.equal(d.diary, null);
  assert.deepEqual(validateData(d), []);
  d.front.part = 'diary';
  assert.match(validateData(d).join('\n'), /front\.json: part "diary" is not front/);
});

for (const mutation of shared('data-mutations.json')) {
  if (!(mutation.checkedBy ?? ['node', 'schema']).includes('node')) continue;
  test(`validateData rejects: ${mutation.name}`, () => {
    const doc = apply(shared('data-every-field.json'), mutation.ops);
    assert.notDeepEqual(validateData(asData(doc)), []);
  });
}
