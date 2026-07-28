import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { convert } = await import(
  resolve('plugins/arckit-claude/scripts/owm-to-mermaid.mjs')
);

test('issue #508 bug 1 — evolve target preserved when quoted name contains an embedded number', () => {
  const src = [
    'title Test',
    'component "IPAD data products (Project 003)" [0.5, 0.6]',
    'evolve "IPAD data products (Project 003)" 0.74',
  ].join('\n');
  const out = convert(src);
  assert.match(out, /evolve "IPAD data products \(Project 003\)" 0\.74/);
  assert.doesNotMatch(out, /evolve "'IPAD/);
  assert.doesNotMatch(out, /\b003\s*$/m);
});

test('issue #508 bug 2 — inline (build) decorator is passed through', () => {
  const out = convert('component "X" [0.5, 0.5] (build)');
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(build\)/);
});

test('issue #508 bug 2 — inline (buy) decorator is passed through', () => {
  const out = convert('component "X" [0.5, 0.5] (buy)');
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(buy\)/);
});

test('issue #508 bug 2 — inline (outsource) decorator is passed through', () => {
  const out = convert('component "X" [0.5, 0.5] (outsource)');
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(outsource\)/);
});

test('inline (build) composes with trailing inertia', () => {
  const out = convert('component "X" [0.5, 0.5] (build) inertia');
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(build\) \(inertia\)/);
});

test('inline decorator wins over standalone sourcing line for same component', () => {
  const src = [
    'component "X" [0.5, 0.5] (build)',
    'buy "X"',
  ].join('\n');
  const out = convert(src);
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(build\)/);
  assert.doesNotMatch(out, /\(buy\)/);
});

test('standalone build "X" line still applies when no inline decorator', () => {
  const src = [
    'component "X" [0.5, 0.5]',
    'build "X"',
  ].join('\n');
  const out = convert(src);
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(build\)/);
});

test('regression — unquoted name with trailing single number still parses', () => {
  const out = convert('evolve Foo 0.5');
  assert.match(out, /evolve "Foo" 0\.5/);
});

test('regression — inertia-only component unchanged', () => {
  const out = convert('component "X" [0.5, 0.5] inertia');
  assert.match(out, /component "X" \[0\.5, 0\.5\] \(inertia\)/);
});

test('issue #693 — evolve with a free-text label is emitted, label stripped', () => {
  const out = convert('evolve Captioning and Transcription 0.86 label Commoditising fast');
  assert.match(out, /evolve "Captioning and Transcription" 0\.86\s*$/m);
  assert.doesNotMatch(out, /label/i);
});

test('issue #693 — evolve with an OWM label offset is emitted, offset stripped', () => {
  const out = convert('evolve X 0.8 label [10, -5]');
  assert.match(out, /evolve "X" 0\.8\s*$/m);
  assert.doesNotMatch(out, /label/i);
});

test('issue #693 — embedded digits and a trailing label at once (neither old pattern handled this)', () => {
  const out = convert('evolve "Foo (Project 003)" 0.74 label Moving right');
  assert.match(out, /evolve "Foo \(Project 003\)" 0\.74\s*$/m);
  assert.doesNotMatch(out, /label/i);
});

test('issue #693 — bare `label` with no trailing text is still tolerated', () => {
  const out = convert('evolve X 0.8 label');
  assert.match(out, /evolve "X" 0\.8\s*$/m);
});

test('issue #693 — a component name containing the word "label" is not truncated', () => {
  const out = convert('evolve Label Printer 0.8');
  assert.match(out, /evolve "Label Printer" 0\.8\s*$/m);
});
