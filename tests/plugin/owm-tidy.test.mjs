import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { tidyOwm, tidyOwmToFixpoint } = await import(
  resolve('plugins/arckit-claude/hooks/owm-tidy.mjs')
);

test('adds label offsets to untuned components', () => {
  const src = [
    'title Test',
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.55, 0.50]',
    'style wardley',
  ].join('\n');
  const { text, changed } = tidyOwm(src);
  assert.match(text, /component Alpha Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.match(text, /component Beta Component \[0\.55, 0\.50\] label \[-?\d+, -?\d+\]/);
  assert.ok(changed >= 1, 'expected at least one line changed');
});

test('is idempotent — tidying a tidied map changes nothing further', () => {
  const src = [
    'component Alpha Component [0.55, 0.50]',
    'component Beta Component [0.40, 0.65]',
    'component Gamma Component [0.30, 0.20]',
  ].join('\n');
  const once = tidyOwm(src).text;
  const twice = tidyOwm(once).text;
  assert.equal(twice, once);
});

test('keeps a collision-free authored label unchanged', () => {
  const src = 'component Lonely [0.50, 0.50] label [40, -20]';
  const { text } = tidyOwm(src);
  assert.match(text, /component Lonely \[0\.50, 0\.50\] label \[40, -20\]/);
});

test('tidyOwmToFixpoint output is stable under a further pass', () => {
  const src = [
    'title Crowded',
    'component Identity Service [0.70, 0.50]',
    'component Identity Provider [0.69, 0.51]',
    'component Auth Gateway [0.71, 0.49]',
    'component Session Store [0.70, 0.52]',
    'Identity Service->Auth Gateway',
    'style wardley',
  ].join('\n');
  const fixed = tidyOwmToFixpoint(src).text;
  const again = tidyOwmToFixpoint(fixed);
  assert.equal(again.text, fixed, 'fixpoint output must be unchanged by a further tidy');
  assert.equal(again.changed, false, 'a fixpoint map must report no change');
});

test('leaves non-component lines verbatim', () => {
  const src = [
    'title My Map',
    'anchor Business [0.95, 0.63]',
    'component Solo [0.50, 0.50]',
    'Business->Solo',
    'style wardley',
  ].join('\n');
  const { text } = tidyOwm(src);
  assert.match(text, /^title My Map$/m);
  assert.match(text, /^anchor Business \[0\.95, 0\.63\]$/m);
  assert.match(text, /^Business->Solo$/m);
  assert.match(text, /^style wardley$/m);
});

test('preserves a trailing newline', () => {
  const src = 'component Solo [0.50, 0.50]\n';
  const { text } = tidyOwm(src);
  assert.ok(text.endsWith('\n'), 'trailing newline must survive');
  assert.ok(!text.endsWith('\n\n'), 'must not accumulate blank lines');
});

test('only the wardley fenced block of a markdown file is rewritten', async () => {
  const { tidyMarkdown } = await import(resolve('plugins/arckit-claude/hooks/owm-tidy.mjs'));
  const md = [
    '# Wardley Map',
    '',
    'Prose mentioning `component Fake [0.1, 0.1]` must not change.',
    '',
    '```wardley',
    'component Real [0.50, 0.50]',
    'style wardley',
    '```',
    '',
    '```mermaid',
    'wardley-beta',
    'component Mermaid Side [0.50, 0.50]',
    '```',
  ].join('\n');
  const out = tidyMarkdown(md);
  assert.match(out, /component Fake \[0\.1, 0\.1\]/, 'prose left verbatim');
  assert.match(out, /component Real \[0\.50, 0\.50\] label \[-?\d+, -?\d+\]/, 'owm block tidied');
  assert.match(out, /component Mermaid Side \[0\.50, 0\.50\]\n```/, 'mermaid block untouched');
});
