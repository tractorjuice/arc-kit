import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_DATA_DIR, blankWorksheet, loadData, renderDocument } from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

// What a release has shipped, or is about to, pinned so that nothing a business holds can change:
// a changed blank worksheet makes a business's worksheet "another version's", and a changed
// document body ends its sign-off. The fixtures are never edited to make a later change pass.
//
// The first seven worksheets and documents shipped in 6.23.0. The three list worksheets (allergens,
// cleaning, suppliers) and the four documents added after it (FOODALG, FOODCS, FOODSUP, FOODREC)
// joined on 23 November 2026, in the last commit before the release that first ships them, as the
// overlay's README tells maintainers to do. From that release on their wording is as fixed as the
// first seven's. A worksheet or document added later joins the same way: in the last commit before
// the release that first ships it, and not sooner, so its wording can still change in review.
const FIXTURES = 'tests/fixtures/uk-food';
const CAFE = join(FIXTURES, 'project-cafe');
const data = loadData(DEFAULT_DATA_DIR);
const frozen = JSON.parse(readFileSync(join(FIXTURES, 'frozen.json'), 'utf8'));
const SECTIONS = ['XC', 'CL', 'CH', 'CK', 'MG', 'profile', 'own', 'allergens', 'cleaning', 'suppliers'];
const DOCS = ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN', 'FOODALG', 'FOODCS', 'FOODSUP', 'FOODREC'];
// The day the cafe's worksheets are read on: a dish's Checked-on is refused without one.
const TODAY = '2026-11-22';
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

test('the frozen file names exactly the worksheets that are frozen', () => {
  assert.deepEqual(Object.keys(frozen.blankWorksheets).sort(), [...SECTIONS].sort());
});

for (const section of SECTIONS) {
  test(`the blank ${section} worksheet is byte-identical to the one frozen`, () => {
    assert.equal(sha256(blankWorksheet(section, data)), frozen.blankWorksheets[section]);
  });
}

for (const doc of DOCS) {
  test(`${doc} renders byte-identically for the cafe`, () => {
    const result = renderDocument(doc, CAFE, data, { today: TODAY });
    assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
    assert.equal(`${result.text}\n`, readFileSync(join(CAFE, 'expected', `${doc}.body.md`), 'utf8'));
  });
}
