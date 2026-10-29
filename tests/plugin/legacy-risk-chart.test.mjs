import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
import {
  assess,
  renderResults,
  renderRiskChart
} from '../../plugins/arckit-claude/scripts/legacy-assessment.mjs';

const helper = 'plugins/arckit-claude/scripts/legacy-assessment.mjs';
const base = JSON.parse(
  readFileSync('tests/fixtures/legacy-assessment/published-example.input.json')
);
const fresh = () => structuredClone(base);
const constantScores = (a, likelihood, impact) => {
  for (const i of a.riskInputs[0].inputs)
    i.value = i.criterionId.startsWith('L') ? likelihood : impact;
  return a;
};
const marker = (svg) =>
  svg.match(/<g data-system-ids="payments">([\s\S]*?)<\/g>/)?.[1];
function addSystem(a, id) {
  a.systems.push({
    ...structuredClone(a.systems[0]),
    id,
    name: id,
    components: []
  });
  a.evidence.push({
    ...structuredClone(a.evidence.find((e) => e.id === 'operating_record')),
    id: `e_${id}`,
    systemId: id
  });
  const risk = structuredClone(a.riskInputs[0]);
  risk.systemId = id;
  for (const i of risk.inputs) i.evidenceIds = [`e_${id}`];
  a.riskInputs.push(risk);
}

test('chart uses exact calculated coordinates, published axes and only the red-rated boundary', () => {
  const a = fresh(),
    v = assess(a).results.systems[0].risk,
    svg = renderRiskChart(a);
  const px = (100 + (v.likelihood - 1) * 160).toFixed(3);
  const py = (120 + (5 - v.impact) * 100).toFixed(3);
  assert.ok(marker(svg).includes(`M ${px} ${(Number(py) - 7).toFixed(3)}`));
  assert.match(svg, /risk=26\.67; RED-RATED/);
  assert.match(svg, /Likelihood score/);
  assert.match(svg, /Impact score/);
  assert.match(svg, /Red-rated: risk ≥ 16/);
  assert.match(svg, /452\.000,120\.000/); // 16 / 5 = 3.2
  assert.match(svg, /900\.000,353\.333/); // 16 / 6, not a diagonal or square cell boundary
  assert.doesNotMatch(svg, />Medium<|>High<|Example/);
  assert.equal(svg, renderRiskChart(a));
  assert.equal(svg, renderRiskChart(assess(a)));
});

test('minimum, maximum and exactly-16 scores keep true boundary coordinates and distinct shapes', () => {
  const minimum = renderRiskChart(constantScores(fresh(), 1, 1));
  assert.match(marker(minimum), /cx="100\.000" cy="520\.000"/);
  assert.match(minimum, /risk=1\.00; below red-rated/);
  const maximum = renderRiskChart(constantScores(fresh(), 6, 5));
  assert.match(marker(maximum), /M 900\.000 113\.000/);
  assert.match(maximum, /risk=30\.00; RED-RATED/);
  const boundary = renderRiskChart(constantScores(fresh(), 4, 4));
  assert.match(marker(boundary), /M 580\.000 213\.000/);
  assert.match(boundary, /risk=16\.00; RED-RATED/);
});

test('scores immediately below 16 stay blue and are never promoted by display rounding', () => {
  const a = constantScores(fresh(), 4, 4);
  a.riskInputs[0].inputs.find((i) => i.criterionId === 'C1').value = 3;
  const svg = renderRiskChart(a);
  assert.match(marker(svg), /<circle/);
  assert.match(svg, /risk=15\.67; below red-rated/);
});

test('incomplete risk uses an uncertainty range while omitted risk has no marks', () => {
  const a = fresh();
  a.riskInputs[0].inputs[0].value = null;
  const svg = renderRiskChart(a);
  assert.equal(marker(svg), undefined);
  assert.match(svg, /data-uncertain-system-ids="payments"/);
  assert.match(svg, /INCOMPLETE: possible L=.*missing L1/);
  assert.match(svg, /not estimates or confidence intervals/);
  assert.doesNotMatch(svg, /No complete numerical scores/);
  assert.match(renderResults(a), /\]\(ARC-001-LEGACY-v1\.0-risk\.svg\)/);
  a.metadata.riskModel = 'none';
  a.riskInputs = [];
  assert.match(renderRiskChart(a), /Numerical risk model omitted/);
  assert.doesNotMatch(renderResults(a), /!\[Legacy numerical risk chart/);
});

test('coincident systems share an unjittered marker and every system remains in the key', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  addSystem(a, 'unknown_system');
  a.riskInputs[2].inputs[0].value = null;
  const svg = renderRiskChart(a);
  assert.match(svg, /data-system-ids="payments reporting"/);
  assert.equal((svg.match(/data-system-ids=/g) ?? []).length, 1);
  assert.match(svg, /P1 \(\+1\)/);
  assert.match(svg, /P2: reporting/);
  assert.match(svg, /P3: unknown_system.*INCOMPLETE/);
});

test('chart escapes hostile labels and has no scripts, external images or executable attributes', () => {
  const a = fresh();
  a.systems[0].name = '<script>alert("private")</script>&\u0001';
  const svg = renderRiskChart(a);
  assert.match(
    svg,
    /&lt;script&gt;alert\(&quot;private&quot;\)&lt;\/script&gt;&amp;/
  );
  assert.doesNotMatch(
    svg,
    /<script|<foreignObject|<image|href=|onload=|<style|\u0001/
  );
  a.systems[0].name = 'A'.repeat(20000);
  assert.ok(
    renderRiskChart(a).length < 70000,
    'long labels must not make the legend unbounded'
  );
  a.systems[0].name = 'A'.repeat(116) + '🛠'.repeat(20) + '\ufffe\uffff';
  const unicode = renderRiskChart(a);
  assert.equal(
    Buffer.from(unicode).toString('utf8'),
    unicode,
    'truncation must preserve Unicode code points'
  );
  assert.doesNotMatch(unicode, /\ufffe|\uffff/);
});

test('CLI rejects missing, tampered, stale or swapped charts and verifies the complete report bundle', () => {
  const dir = mkdtempSync(join(tmpdir(), 'legacy-chart-'));
  try {
    const a = fresh(),
      input = join(dir, 'input.json'),
      report = join(dir, 'report.md');
    const chart = join(dir, 'ARC-001-LEGACY-v1.0-risk.svg');
    const run = (...flags) =>
      spawnSync('node', [helper, '--input', input, ...flags], {
        encoding: 'utf8'
      });
    writeFileSync(input, JSON.stringify(a));
    writeFileSync(report, renderResults(a));
    assert.equal(
      run('--check-report', report).status,
      2,
      'missing chart is a file-reading failure'
    );
    const output = run('--svg');
    assert.equal(output.status, 0, output.stderr);
    assert.equal(output.stdout, renderRiskChart(a));
    writeFileSync(chart, output.stdout);
    assert.equal(run('--check-report', report).status, 0);
    writeFileSync(chart, output.stdout.replace('26.67', '26.68'));
    assert.equal(run('--check-report', report).status, 1);
    a.metadata.scope += ' changed';
    writeFileSync(input, JSON.stringify(a));
    writeFileSync(report, renderResults(a));
    writeFileSync(chart, output.stdout);
    assert.equal(
      run('--check-report', report).status,
      1,
      'same scores with a stale assessment digest still fail'
    );
    writeFileSync(chart, renderRiskChart(a));
    assert.equal(run('--check-report', report).status, 0);
    a.metadata.riskModel = 'none';
    a.riskInputs = [];
    writeFileSync(input, JSON.stringify(a));
    writeFileSync(report, renderResults(a));
    rmSync(chart);
    assert.equal(
      run('--check-report', report).status,
      0,
      'omitted model needs no chart'
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test('Pages resolves the generated chart beside its report while leaving absolute images alone', () => {
  for (const path of [
    'plugins/arckit-claude/templates/pages-template.html',
    '.arckit/templates/pages-template.html'
  ]) {
    const html = readFileSync(path, 'utf8');
    const fn = html.slice(
      html.indexOf('        function documentImagePath('),
      html.indexOf('        function getDocumentId(')
    );
    const resolve = runInNewContext(`${fn}\ndocumentImagePath`);
    const doc = 'projects/001-payments/ARC-001-LEGACY-v1.0.md';
    assert.equal(
      resolve(doc, 'ARC-001-LEGACY-v1.0-risk.svg'),
      'projects/001-payments/ARC-001-LEGACY-v1.0-risk.svg'
    );
    assert.equal(
      resolve(doc, './images/chart.svg'),
      'projects/001-payments/images/chart.svg'
    );
    assert.equal(resolve(doc, '../chart.svg'), 'projects/chart.svg');
    for (const src of [
      'https://example.org/a.svg',
      '//example.org/a.svg',
      '/a.svg',
      '#x',
      'data:image/svg+xml,test',
      'javascript:alert(1)',
      '../../../escape.svg',
      '..\\escape.svg'
    ])
      assert.equal(resolve(doc, src), null);
    assert.match(html, /img\.src = getRawUrl\(imagePath\)/);
    assert.match(html, /img\.src = fallback;.*once: true/);
  }
});

test('uncertain envelopes bound every completion without adding a precise marker', () => {
  const a = constantScores(fresh(), 4, 4);
  a.riskInputs[0].inputs.find((i) => i.criterionId === 'L1').value = null;
  a.riskInputs[0].inputs.find((i) => i.criterionId === 'C1').value = null;
  const r = assess(a).results.systems[0].risk,
    svg = renderRiskChart(a),
    b = r.bounds;
  assert.equal(r.redRated, null);
  assert.equal(marker(svg), undefined);
  assert.match(svg, /fill="url\(#uncertainty-hatch\)"/);
  assert.match(svg, /P1\?/);
  for (let l = 1; l <= 6; l++)
    for (let c = 1; c <= 5; c++) {
      const complete = structuredClone(a);
      complete.riskInputs[0].inputs.find((i) => i.criterionId === 'L1').value =
        l;
      complete.riskInputs[0].inputs.find((i) => i.criterionId === 'C1').value =
        c;
      const v = assess(complete).results.systems[0].risk;
      assert.ok(
        v.likelihood >= b.likelihoodMinimum &&
          v.likelihood <= b.likelihoodMaximum
      );
      assert.ok(v.impact >= b.impactMinimum && v.impact <= b.impactMaximum);
    }
  const geometry = `x="${(100 + (b.likelihoodMinimum - 1) * 160).toFixed(3)}" y="${(120 + (5 - b.impactMaximum) * 100).toFixed(3)}" width="${((b.likelihoodMaximum - b.likelihoodMinimum) * 160).toFixed(3)}" height="${((b.impactMaximum - b.impactMinimum) * 100).toFixed(3)}"`;
  assert.ok(svg.includes(geometry));
  assert.equal(svg, readFileSync('tests/fixtures/legacy-assessment/uncertainty-example.svg', 'utf8'));
});

test('one unknown axis draws a range bar; no inputs draw the whole domain', () => {
  const a = fresh();
  a.riskInputs[0].inputs[0].value = null;
  let svg = renderRiskChart(a);
  assert.match(svg, /data-uncertain-system-ids="payments"/);
  assert.match(svg, /stroke-width="3" stroke-dasharray="5 4"/);
  a.riskInputs[0].inputs[0].value = 5;
  a.riskInputs[0].inputs.find((i) => i.criterionId === 'C1').value = null;
  svg = renderRiskChart(a);
  assert.match(svg, /stroke-width="3" stroke-dasharray="5 4"/);
  a.riskInputs = [];
  svg = renderRiskChart(a);
  assert.match(svg, /x="100.000" y="120.000" width="800.000" height="400.000"/);
  assert.match(svg, /missing L1, L2/);
  assert.equal(marker(svg), undefined);
  a.metadata.riskModel = 'none';
  svg = renderRiskChart(a);
  assert.doesNotMatch(svg, /data-uncertain-system-ids=/);
});

test('chart verification rejects an altered uncertainty envelope', () => {
  const a = fresh();
  a.riskInputs = [];
  const dir = mkdtempSync(join(tmpdir(), 'legacy-envelope-'));
  try {
    const input = join(dir, 'input.json'),
      report = join(dir, 'report.md'),
      chart = join(dir, 'ARC-001-LEGACY-v1.0-risk.svg');
    writeFileSync(input, JSON.stringify(a));
    writeFileSync(report, renderResults(a));
    const svg = renderRiskChart(a);
    writeFileSync(chart, svg);
    const check = () =>
      spawnSync('node', [helper, '--input', input, '--check-report', report], {
        encoding: 'utf8'
      });
    assert.equal(check().status, 0);
    writeFileSync(
      chart,
      svg.replace(
        'width="800.000" height="400.000"',
        'width="400.000" height="400.000"'
      )
    );
    assert.equal(check().status, 1);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
