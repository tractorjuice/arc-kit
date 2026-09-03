import test from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';

const { parseOwm, stageFor, EVOLUTION_STAGES } = await import(
  resolve('plugins/arckit-claude/scripts/owm-parse.mjs')
);
const { renderHtml, convert } = await import(
  resolve('plugins/arckit-claude/scripts/owm-to-html.mjs')
);

const SAMPLE = [
  'title Booking Platform',
  'anchor Patient [0.95, 0.63]',
  'component Web App [0.85, 0.72] label [12, -8]',
  'component Auth [0.70, 0.55] inertia',
  'component Hosting [0.20, 0.92]',
  'component Triage Model [0.55, 0.10]',
  'Patient -> Web App',
  'Web App -> Auth',
  'Auth -> Hosting',
  'evolve Triage Model 0.60 label Productised',
  'build Triage Model',
  'outsource Hosting',
  'annotation 1 [0.55, 0.10] Genesis - build only if differentiating',
  'note Watch the auth inertia [0.60, 0.40]',
  'style wardley',
].join('\n');

// ── Parser ─────────────────────────────────────────────────────────────────

test('parses components, anchors and coordinates', () => {
  const map = parseOwm(SAMPLE);
  assert.equal(map.title, 'Booking Platform');
  assert.equal(map.components.length, 5);
  const anchor = map.components.find((c) => c.name === 'Patient');
  assert.equal(anchor.kind, 'anchor');
  assert.equal(anchor.vis, 0.95);
  assert.equal(anchor.evo, 0.63);
});

test('parses label offsets', () => {
  const map = parseOwm(SAMPLE);
  const web = map.components.find((c) => c.name === 'Web App');
  assert.deepEqual(web.labelOffset, { x: 12, y: -8 });
});

test('parses inertia', () => {
  const map = parseOwm(SAMPLE);
  assert.equal(map.components.find((c) => c.name === 'Auth').inertia, true);
  assert.equal(map.components.find((c) => c.name === 'Hosting').inertia, false);
});

test('parses sourcing directives declared on their own line', () => {
  const map = parseOwm(SAMPLE);
  assert.equal(map.components.find((c) => c.name === 'Triage Model').sourcing, 'build');
  assert.equal(map.components.find((c) => c.name === 'Hosting').sourcing, 'outsource');
});

test('parses inline sourcing decorators', () => {
  const map = parseOwm('component X [0.5, 0.5] (buy)');
  assert.equal(map.components[0].sourcing, 'buy');
});

test('parses links and rejects unknown endpoints with a warning', () => {
  const map = parseOwm(SAMPLE + '\nWeb App -> Nonexistent');
  assert.equal(map.links.length, 3);
  assert.ok(map.warnings.some((w) => w.includes('Nonexistent')));
});

test('parses evolve target and label', () => {
  const map = parseOwm(SAMPLE);
  const triage = map.components.find((c) => c.name === 'Triage Model');
  assert.equal(triage.evolveTo, 0.6);
  assert.equal(triage.evolveLabel, 'Productised');
});

test('parses annotations and notes', () => {
  const map = parseOwm(SAMPLE);
  assert.equal(map.annotations.length, 1);
  assert.equal(map.annotations[0].number, 1);
  assert.match(map.annotations[0].text, /differentiating/);
  assert.equal(map.notes.length, 1);
  assert.equal(map.notes[0].text, 'Watch the auth inertia');
});

test('handles quoted names containing punctuation', () => {
  const map = parseOwm([
    'component "Real-time processing (v2)" [0.4, 0.3]',
    'component "Data / Lake" [0.2, 0.8]',
    '"Real-time processing (v2)" -> "Data / Lake"',
  ].join('\n'));
  assert.equal(map.components.length, 2);
  assert.equal(map.components[0].name, 'Real-time processing (v2)');
  assert.equal(map.links.length, 1);
  assert.equal(map.links[0].to, 'Data / Lake');
});

test('strips trailing comments but keeps URLs intact', () => {
  const map = parseOwm('component Foo [0.5, 0.5] // a comment');
  assert.equal(map.components.length, 1);
  assert.equal(map.components[0].name, 'Foo');
});

test('resolves coordinate-form pipeline children by proximity', () => {
  const map = parseOwm([
    'component Platform [0.50, 0.40]',
    'pipeline Platform [0.30, 0.70]',
    'component Option A [0.50, 0.35]',
    'component Option B [0.50, 0.65]',
    'component Elsewhere [0.90, 0.50]',
  ].join('\n'));
  assert.equal(map.pipelines.length, 1);
  assert.deepEqual(map.pipelines[0].children, ['Option A', 'Option B']);
  assert.equal(map.components.find((c) => c.name === 'Elsewhere').pipelineParent, null);
});

test('resolves explicit-block pipeline children', () => {
  const map = parseOwm([
    'component Platform [0.50, 0.40]',
    'pipeline Platform',
    '{',
    '  component Choice A [0.50, 0.20]',
    '  component Choice B [0.50, 0.80]',
    '}',
  ].join('\n'));
  assert.deepEqual(map.pipelines[0].children, ['Choice A', 'Choice B']);
});

test('stageFor maps evolution coordinates to Wardley stages', () => {
  assert.equal(stageFor(0.1), 'Genesis');
  assert.equal(stageFor(0.3), 'Custom Built');
  assert.equal(stageFor(0.6), 'Product (+rental)');
  assert.equal(stageFor(0.9), 'Commodity (+utility)');
  assert.equal(stageFor(1.0), 'Commodity (+utility)');
  assert.equal(EVOLUTION_STAGES.length, 4);
});

test('duplicate component declarations warn rather than double-render', () => {
  const map = parseOwm('component X [0.5, 0.5]\ncomponent X [0.1, 0.1]');
  assert.equal(map.components.length, 1);
  assert.ok(map.warnings.some((w) => w.includes('Duplicate')));
});

// ── Renderer ───────────────────────────────────────────────────────────────

test('renders a self-contained HTML document', () => {
  const html = convert(SAMPLE);
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<svg id="map"/);
  assert.match(html, /<\/html>/);
});

test('output makes no external requests', () => {
  const html = convert(SAMPLE);
  // No remote sources of any kind — the artifact must open offline.
  assert.doesNotMatch(html, /<script[^>]+src=/i);
  assert.doesNotMatch(html, /<link[^>]+href=/i);
  assert.doesNotMatch(html, /https?:\/\/(?!www\.w3\.org)/i);
});

test('escapes markup in component names when rendering the SVG', () => {
  const html = convert('component <img src=x onerror=alert(1)> [0.5, 0.5]');
  const svg = html.slice(html.indexOf('<svg'), html.indexOf('</svg>'));
  assert.doesNotMatch(svg, /<img/);
  assert.match(svg, /&lt;img/);
});

test('the embedded OWM source cannot break out of its script block', () => {
  // Every form the HTML tokenizer accepts as a script-data terminator.
  for (const payload of ['</script>', '</script >', '</script/>', '</SCRIPT>']) {
    const html = convert(`component Foo [0.5, 0.5]\nnote ${payload}<b>x</b> [0.2, 0.2]`);
    const start = html.indexOf('application/vnd.arckit.owm');
    const block = html.slice(start, html.indexOf('</script>', start));
    assert.doesNotMatch(block, /<\/script[\s/>]/i, `escaped for payload ${payload}`);
  }
});

test('a trailing closing-script tag at end of source is neutralised', () => {
  const html = convert('component Foo [0.5, 0.5]\nnote x [0.2, 0.2]\n</script');
  const start = html.indexOf('application/vnd.arckit.owm');
  const block = html.slice(start, html.indexOf('</script>', start));
  assert.doesNotMatch(block, /<\/script/i);
});

test('embeds the OWM source for round-tripping', () => {
  const html = convert(SAMPLE);
  assert.match(html, /type="application\/vnd\.arckit\.owm"/);
  assert.match(html, /anchor Patient \[0\.95, 0\.63\]/);
});

test('renders one node group per component', () => {
  const html = convert(SAMPLE);
  assert.equal((html.match(/class="node /g) || []).length, 5);
});

test('renders an evolve arrow only for components that evolve', () => {
  const html = convert(SAMPLE);
  assert.equal((html.match(/class="evolve"/g) || []).length, 1);
  assert.match(html, /Productised/);
});

test('renders inertia marker only for components with inertia', () => {
  const html = convert(SAMPLE);
  assert.equal((html.match(/class="inertia"/g) || []).length, 1);
});

test('annotation markers are offset so they do not hide the component dot', () => {
  // Annotation 1 sits on Triage Model's exact coordinate.
  const html = convert(SAMPLE);
  const marker = html.match(/<g class="annotation"[^>]*>(.*?)<\/g>/s);
  assert.ok(marker, 'annotation group rendered');
  const circle = marker[1].match(/<circle cx="([\d.]+)" cy="([\d.]+)"/);
  const dot = html.match(/class="node component sourcing-build"[\s\S]*?<circle class="dot" cx="([\d.]+)" cy="([\d.]+)"/);
  assert.ok(dot, 'component dot rendered');
  const dx = Math.abs(Number(circle[1]) - Number(dot[1]));
  const dy = Math.abs(Number(circle[2]) - Number(dot[2]));
  assert.ok(Math.hypot(dx, dy) > 13, `marker should clear the node halo, got ${Math.hypot(dx, dy)}`);
});

test('counts sourcing decisions in the legend', () => {
  const html = convert(SAMPLE);
  assert.match(html, /Build \(1\)/);
  assert.match(html, /Outsource \(1\)/);
  assert.match(html, /Buy \(0\)/);
});

test('surfaces parser warnings in the page', () => {
  const html = convert('component X [0.5, 0.5]\nX -> Ghost');
  assert.match(html, /Parser warnings/);
  assert.match(html, /Ghost/);
});

test('title falls back through option, map title, then a default', () => {
  assert.match(renderHtml(parseOwm(SAMPLE), { title: 'Override' }), /<title>Override<\/title>/);
  assert.match(renderHtml(parseOwm(SAMPLE)), /<title>Booking Platform<\/title>/);
  assert.match(renderHtml(parseOwm('component X [0.5, 0.5]')), /<title>Wardley Map<\/title>/);
});

test('rendering is deterministic for a fixed generated date', () => {
  const map = parseOwm(SAMPLE);
  const a = renderHtml(map, { generated: '2026-01-01', source: SAMPLE });
  const b = renderHtml(map, { generated: '2026-01-01', source: SAMPLE });
  assert.equal(a, b);
});

test('components stay inside the plot area for extreme coordinates', () => {
  const html = convert('component Low [0, 0]\ncomponent High [1, 1]');
  const dots = [...html.matchAll(/<circle class="dot" cx="([\d.]+)" cy="([\d.]+)"/g)];
  assert.equal(dots.length, 2);
  for (const [, cx, cy] of dots) {
    assert.ok(Number(cx) >= 132 && Number(cx) <= 1220, `x in plot: ${cx}`);
    assert.ok(Number(cy) >= 56 && Number(cy) <= 808, `y in plot: ${cy}`);
  }
});

test('out-of-range coordinates are clamped rather than escaping the plot', () => {
  const html = convert('component Weird [5, -3]');
  const dot = html.match(/<circle class="dot" cx="([\d.]+)" cy="([\d.]+)"/);
  assert.equal(Number(dot[1]), 132);
  assert.equal(Number(dot[2]), 56);
});

test('empty input parses without throwing', () => {
  const map = parseOwm('');
  assert.equal(map.components.length, 0);
  assert.equal(map.links.length, 0);
});
