// Every category a guide is filed under has a place in GUIDE_CATEGORY_ORDER.
//
// sync-guides.mjs sorts the guide index by that list and puts a category it does not
// name after "Community" and "Other". The UK Legacy IT Assessment Overlay's guide sat
// there, below every other overlay, from the day the overlay was added.

import test from 'node:test';
import assert from 'node:assert/strict';
import { GUIDE_CATEGORY_ORDER, GUIDE_METADATA } from '../../plugins/arckit-claude/config/guide-groups.mjs';

test('every guide category is in GUIDE_CATEGORY_ORDER', () => {
  const used = new Set(Object.values(GUIDE_METADATA).map((meta) => meta.category));
  const missing = [...used].filter((category) => !GUIDE_CATEGORY_ORDER.includes(category)).sort();
  assert.deepEqual(missing, []);
});
