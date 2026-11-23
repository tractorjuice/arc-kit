import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEFAULT_DATA_DIR, blankWorksheet, loadData, renderDocument } from '../../plugins/arckit-uk-food/scripts/uk-food.mjs';

// What the first release ships, pinned so that nothing a business already holds can change:
// a changed blank worksheet makes a business's worksheet "another version's", and a changed
// document body ends its sign-off. The fixtures are never edited to make a later change pass.
//
// Not here yet, on purpose: the three list worksheets (allergens, cleaning, suppliers) and the four
// documents Plan 2 adds (FOODALG, FOODCS, FOODSUP, FOODREC). No release has shipped them, and the
// owner may still overturn a ruling that changes their wording. Their wording freezes the day a
// release first ships them, for the same reasons as the seven above, so they are added to frozen.json
// and to SECTIONS and DOCS in the last commit before the release that first ships them. Until then
// nothing stops a change to them, and nothing needs to.
const FIXTURES = 'tests/fixtures/uk-food';
const CAFE = join(FIXTURES, 'project-cafe');
const data = loadData(DEFAULT_DATA_DIR);
const frozen = JSON.parse(readFileSync(join(FIXTURES, 'frozen.json'), 'utf8'));
const SECTIONS = ['XC', 'CL', 'CH', 'CK', 'MG', 'profile', 'own'];
const DOCS = ['FOODPROF', 'FOODXC', 'FOODCLN', 'FOODCHL', 'FOODCOOK', 'FOODMGT', 'FOODOWN'];
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

test('the frozen file names exactly the seven Plan 1 worksheets', () => {
  assert.deepEqual(Object.keys(frozen.blankWorksheets).sort(), [...SECTIONS].sort());
});

for (const section of SECTIONS) {
  test(`the blank ${section} worksheet is byte-identical to the one 6.23.0 ships`, () => {
    assert.equal(sha256(blankWorksheet(section, data)), frozen.blankWorksheets[section]);
  });
}

for (const doc of DOCS) {
  test(`${doc} renders byte-identically for the cafe`, () => {
    const result = renderDocument(doc, CAFE, data);
    assert.equal(result.exit, 0, (result.messages ?? []).join('\n'));
    assert.equal(`${result.text}\n`, readFileSync(join(CAFE, 'expected', `${doc}.body.md`), 'utf8'));
  });
}
