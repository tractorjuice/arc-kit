import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  assess,
  renderComponentChart,
  renderRiskChart,
  renderResults,
  componentMeasure
} from '../../plugins/arckit-claude/scripts/legacy-assessment.mjs';
import { formatExample } from '../fixtures/legacy-assessment/format-example.mjs';
const base = () =>
  JSON.parse(
    readFileSync(
      'tests/fixtures/legacy-assessment/published-example.input.json'
    )
  );

test('system classification is never silently inherited by a component', () => {
  const a = assess(base()),
    c = a.results.systems[0].componentResults[0];
  assert.equal(a.results.systems[0].outcome, 'Accepted');
  assert.equal(c.outcome, 'Undetermined');
  assert.deepEqual(c.findingIds, []);
  assert.equal(c.confidence, null);
  assert.equal(c.numerical.position, null);
  assert.equal(c.numerical.minimum, 0);
  assert.equal(c.numerical.maximum, 3);
  const svg = renderComponentChart(a);
  assert.match(svg, /Unmeasured/);
  assert.doesNotMatch(svg, /data-marker=/);
});
test('component chart derives all three classifications and keeps hypotheses separate', () => {
  const a = formatExample(),
    r = assess(a).results.systems[0].componentResults;
  assert.deepEqual(
    r.slice(0, 3).map((c) => c.outcome),
    ['Legacy', 'Action-Required', 'Accepted']
  );
  assert.ok(
    r
      .slice(3)
      .every(
        (c) => c.outcome === 'Undetermined' && c.completeness === 'incomplete'
      )
  );
  const svg = renderComponentChart(a);
  assert.match(svg, /data-marker="calculated"/);
  assert.match(svg, /data-role="confidence-range"/);
  for (const label of [
    'Accepted',
    'Action-Required',
    'Legacy',
    'Confidence¹',
    'Assessment notes'
  ])
    assert.ok(svg.includes('>' + label + '<'));
  assert.equal(
    svg,
    readFileSync(
      'tests/fixtures/legacy-assessment/component-format.svg',
      'utf8'
    )
  );
  assert.equal(
    renderRiskChart(a),
    readFileSync('tests/fixtures/legacy-assessment/headline-format.svg', 'utf8')
  );
});
test('component annotation cannot change actual system classifications or rank', () => {
  const a = formatExample(),
    r = assess(a).results;
  for (const c of a.systems[0].components) delete c.measurements;
  const bare = assess(a).results;
  assert.deepEqual(r.counts, bare.counts);
  assert.deepEqual(r.riskOrdering, bare.riskOrdering);
  assert.deepEqual(
    r.systems.map((s) => s.outcome),
    bare.systems.map((s) => s.outcome)
  );
  assert.deepEqual(
    r.systems[0].componentResults.map((c) => c.outcome),
    bare.systems[0].componentResults.map((c) => c.outcome)
  );
});
test('numerical intervals and calibrations are validated', () => {
  const a = formatExample();
  a.systems[0].components[0].measurements[0].estimate = -1;
  assert.throws(() => assess(a), /lower <= estimate/);
  const b = formatExample();
  b.systems[0].components[0].measurements[0].calibration.actionRequired = 100;
  assert.throws(() => assess(b), /calibration anchors/);
  const c = formatExample();
  c.systems[0].components[0].measurements[0].basis = 'measured';
  assert.throws(() => assess(c), /current scoped evidence/);
});
test('component labels are inert and rationale is kept out of SVG', () => {
  const a = formatExample();
  a.systems[0].components[0].name = '<script>not code</script>';
  const svg = renderComponentChart(a);
  assert.match(svg, /&lt;script&gt;/);
  assert.doesNotMatch(svg, /<script|Invented numerical interval/);
});
test('headline explicitly focuses axes while containing all score bounds', () => {
  const a = formatExample(),
    svg = renderRiskChart(a);
  assert.match(svg, /data-likelihood-min="3" data-impact-min="2"/);
  assert.match(svg, /axis starts at 3/);
  assert.match(svg, /axis starts at 2/);
  a.riskInputs = [];
  const full = renderRiskChart(a);
  assert.match(full, /data-likelihood-min="1" data-impact-min="1"/);
});
test('CLI verifies both companions and component charts remain available with risk omitted', () => {
  const dir = mkdtempSync(join(tmpdir(), 'legacy-format-'));
  try {
    const a = formatExample();
    a.metadata.riskModel = 'none';
    a.riskInputs = [];
    const input = join(dir, 'input.json'),
      report = join(dir, 'report.md'),
      chart = join(dir, 'ARC-001-LEGACY-v1.0-components.svg');
    writeFileSync(input, JSON.stringify(a));
    writeFileSync(report, renderResults(a));
    const run = (...args) =>
      spawnSync(
        'node',
        [
          'plugins/arckit-claude/scripts/legacy-assessment.mjs',
          '--input',
          input,
          ...args
        ],
        { encoding: 'utf8' }
      );
    assert.equal(run('--check-report', report).status, 2);
    const svg = run('--components-svg');
    assert.equal(svg.status, 0, svg.stderr);
    writeFileSync(chart, svg.stdout);
    assert.equal(run('--check-report', report).status, 0);
    writeFileSync(
      chart,
      svg.stdout.replace('Component legacy assessment', 'Tampered')
    );
    assert.equal(run('--check-report', report).status, 1);
    assert.equal(run('--headline-svg').stdout, run('--svg').stdout);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('diamond is calculated independently of bar midpoint and can be low in Action-Required', () => {
  const a = formatExample(),
    c = assess(a).results.systems[0].componentResults[3];
  assert.ok(Math.abs(c.numerical.position - 1.16) < 1e-12);
  assert.equal(c.numerical.minimum, 0.45);
  assert.equal(c.numerical.maximum, 2.55);
  assert.notEqual(
    c.numerical.position,
    (c.numerical.minimum + c.numerical.maximum) / 2
  );
  const svg = renderComponentChart(a),
    row = svg.match(/<g data-component-id="example_4">([\s\S]*?)<\/g>/)[1];
  const position = Number(row.match(/data-position="([^"]+)"/)[1]);
  assert.ok(position > 1 && position < 1.3);
  assert.match(row, /data-maximum="2.55"/);
});

test('confidence follows numeric interval width; narrow and zero-width ranges retain exact bounds', () => {
  const a = formatExample(),
    values = a.systems[0].components[1].measurements;
  const high = componentMeasure(values);
  assert.equal(high.confidence, 'high');
  values[0].lower = 0;
  values[0].upper = 100;
  const low = componentMeasure(values);
  assert.equal(low.confidence, 'low');
  assert.ok(low.confidencePercent < high.confidencePercent);
  for (const m of values) m.lower = m.upper = m.estimate;
  const exact = componentMeasure(values);
  assert.equal(exact.confidencePercent, 100);
  assert.equal(exact.minimum, exact.maximum);
  const svg = renderComponentChart(a);
  assert.match(svg, /Labels retain exact bounds for narrow ranges/);
  assert.doesNotMatch(svg, /d="M [^"]* V /);
  assert.match(svg, /data-role="confidence-range"/);
});

test('lower-is-worse measurements normalize monotonically and missing criteria suppress estimates', () => {
  const values = structuredClone(
    formatExample().systems[0].components[0].measurements
  );
  values[0] = {
    ...values[0],
    lower: 20,
    estimate: 40,
    upper: 60,
    calibration: {
      unit: 'invented remaining units',
      baseline: 100,
      actionRequired: 50,
      legacy: 0,
      direction: 'lower-is-worse'
    }
  };
  for (let i = 1; i < values.length; i++)
    values[i].lower = values[i].estimate = values[i].upper = 0;
  const r = componentMeasure(values);
  assert.equal(r.position, 1.2);
  assert.equal(r.minimum, 0.8);
  assert.equal(r.maximum, 1.6);
  values.pop();
  const missing = componentMeasure(values);
  assert.equal(missing.position, null);
  assert.equal(missing.maximum, 3);
  assert.deepEqual(missing.missingCriteria, ['D7']);
});

test('component maxima are calculated independently across indicator intervals', () => {
  const values = structuredClone(
    formatExample().systems[0].components[3].measurements
  );
  values[1].lower = 36;
  values[1].estimate = 40;
  values[1].upper = 108;
  const r = componentMeasure(values);
  assert.equal(r.minimum, 0.9);
  assert.ok(Math.abs(r.position - 1.16) < 1e-12);
  assert.equal(r.maximum, 2.7);
});

test('component plotting is invariant to an equivalent change of measurement units', () => {
  const values = structuredClone(
    formatExample().systems[0].components[3].measurements
  );
  const expected = componentMeasure(values);
  for (const m of values) {
    for (const key of ['lower', 'estimate', 'upper'])
      m[key] = 10 * m[key] + 500;
    for (const key of ['baseline', 'actionRequired', 'legacy'])
      m.calibration[key] = 10 * m.calibration[key] + 500;
    m.calibration.unit = 'equivalent invented units';
  }
  const actual = componentMeasure(values);
  for (const key of ['position', 'minimum', 'maximum', 'confidencePercent'])
    assert.ok(Math.abs(actual[key] - expected[key]) < 1e-10, key);
});

test('duplicate indicators and invalid references cannot create apparently measured confidence', () => {
  const a = formatExample();
  a.systems[0].components[0].measurements[6].criterionId = 'D1';
  assert.throws(() => assess(a), /Duplicate component measurement/);
  const b = formatExample();
  b.systems[0].components[0].measurements[0].evidenceIds = ['missing_source'];
  assert.throws(() => assess(b), /broken evidence/);
  const c = formatExample();
  c.systems[0].components[0].measurements[0].estimate = null;
  const result = assess(c).results.systems[0].componentResults[0].numerical;
  assert.equal(result.position, null);
  assert.equal(result.minimum, 2.3);
  assert.equal(result.maximum, 2.9);
});
