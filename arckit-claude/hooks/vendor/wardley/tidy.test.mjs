import test from 'node:test';
import assert from 'node:assert/strict';
import { tidyMap, tidyToFixpoint } from './tidy.mjs';

test('adds label offsets to untuned components', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.55, 0.50]',
    '',
  ].join('\n');
  const { text, changed } = tidyMap(src);
  assert.match(text, /component Alpha Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.match(text, /component Beta Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.ok(changed >= 1, 'expected at least one line changed');
});

test('is idempotent — tidying a tidied map changes nothing further', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.40, 0.65]',
    '',
  ].join('\n');
  const once = tidyMap(src).text;
  const twice = tidyMap(once).text;
  assert.equal(twice, once);
});

test('keeps a collision-free authored label unchanged', () => {
  const src = [
    'wardley-beta',
    'size [900, 600]',
    'component Lonely [0.50, 0.50] label [40, -20]',
    '',
  ].join('\n');
  const { text } = tidyMap(src);
  assert.match(text, /component Lonely \[0\.50, 0\.50\] label \[40, -20\]/);
});

test('tidyToFixpoint output is stable under a further tidyMap pass', () => {
  // A pipeline map: the first tidyMap pass auto-places, the second re-reads
  // every result as a manualRect — exactly the case a single pass does not
  // converge on. tidyToFixpoint must iterate until stable.
  const src = [
    'wardley-beta',
    'size [1100, 800]',
    'component Kettle [0.57, 0.45]',
    'component Power [0.10, 0.70]',
    'Kettle -> Power',
    'pipeline Kettle {',
    '  component Campfire Kettle [0.30]',
    '  component Electric Kettle [0.52]',
    '  component Smart Kettle [0.74]',
    '}',
    '',
  ].join('\n');
  const fixed = tidyToFixpoint(src).text;
  // tidyToFixpoint must be idempotent — re-tidying its output yields the same
  // text and reports no change (holds for converging and oscillating maps).
  const again = tidyToFixpoint(fixed);
  assert.equal(again.text, fixed, 'fixpoint output must be unchanged by a further tidy');
  assert.equal(again.changed, false, 'a fixpoint map must report no change');
});

test('leaves non-component lines verbatim', () => {
  const src = [
    'wardley-beta',
    'title My Map',
    'size [900, 600]',
    'component Solo [0.50, 0.50]',
    '',
  ].join('\n');
  const { text } = tidyMap(src);
  assert.match(text, /^wardley-beta$/m);
  assert.match(text, /^title My Map$/m);
  assert.match(text, /^size \[900, 600\]$/m);
});
