import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  assess,
  anniversary,
  CRITERIA
} from '../../plugins/arckit-claude/scripts/legacy-assessment.mjs';

const helper = 'plugins/arckit-claude/scripts/legacy-assessment.mjs';
const fixture = JSON.parse(
  readFileSync('tests/fixtures/legacy-assessment/published-example.input.json')
);
const fresh = () => structuredClone(fixture);
const one = (a) => assess(a).results.systems[0];
const values = (a, l, c) => {
  a.riskInputs[0].inputs.forEach((i, n) => (i.value = n < 7 ? l : c));
  return a;
};
function addSystem(a, id) {
  a.evidence.find((e) => e.id === 'operating_record').systemId = null;
  a.systems.push({ ...structuredClone(a.systems[0]), id, name: id, components: [] });
  a.findings.push(
    ...a.findings
      .filter((f) => f.systemId === 'payments')
      .map((f) => ({ ...structuredClone(f), id: `${id}_${f.id}`, systemId: id }))
  );
}
function edge(a, consumerId, dependencyId, extra = {}) {
  a.dependencies.push({
    id: `edge_${a.dependencies.length}`,
    consumerId,
    dependencyId,
    externalAssessment: null,
    thresholdId: 'rule_D7',
    qualification: 'qualifies',
    rationale: 'Documented runtime reliance qualifies under supplied owner policy.',
    evidenceIds: ['operating_record'],
    ...extra
  });
}
function unknown(a, criterion = 'D3') {
  const f = a.findings.find((f) => f.criterionId === criterion);
  f.outcome = 'Unknown';
  f.evidenceIds = [];
  f.completeness = 'incomplete';
}

test('published example reproducible, independently Accepted but red, stored result replay stable', () => {
  const actual = assess(fresh());
  assert.deepEqual(
    actual,
    JSON.parse(readFileSync('tests/fixtures/legacy-assessment/published-example.expected.json'))
  );
  assert.equal(actual.results.systems[0].outcome, 'Accepted');
  assert.equal(actual.results.systems[0].risk.display, '26.67');
  assert.equal(actual.results.systems[0].risk.redRated, true);
  assert.deepEqual(assess(actual), actual);
  assert.deepEqual(assess(fresh()), actual);
});
test('minimum and maximum risk', () => {
  assert.equal(one(values(fresh(), 1, 1)).risk.risk, 1);
  assert.equal(one(values(fresh(), 6, 5)).risk.risk, 30);
});
test('exact 16 uses unrounded comparison and closest attainable lower score stays below', () => {
  assert.equal(one(values(fresh(), 4, 4)).risk.risk, 16);
  assert.equal(one(values(fresh(), 4, 4)).risk.redRated, true);
  // 79/14 * 34/12 = 15.988095..., displayed as 15.99.
  const a = fresh();
  [5, 5, 5, 5, 5, 6, 6, 2, 2, 3, 3, 3, 3].forEach((v, i) => (a.riskInputs[0].inputs[i].value = v));
  assert.equal(one(a).risk.display, '15.99');
  assert.equal(one(a).risk.redRated, false);
});
test('missing or null numerical score yields incomplete without affecting complete classification', () => {
  for (const remove of [true, false]) {
    const a = fresh();
    if (remove) a.riskInputs[0].inputs.pop();
    else a.riskInputs[0].inputs.at(-1).value = null;
    const result = one(a);
    assert.equal(result.outcome, 'Accepted');
    assert.equal(result.completeness, 'complete');
    assert.equal(result.risk.status, 'incomplete');
    assert.equal(result.risk.risk, null);
    assert.deepEqual(result.risk.missing, ['C6']);
  }
});
for (const criterion of CRITERIA.filter((c) => c !== 'D7'))
  test(`${criterion} can independently trigger Legacy or Action-Required`, () => {
    for (const outcome of ['Legacy', 'Action-Required']) {
      const a = fresh();
      a.findings.find((f) => f.criterionId === criterion).outcome = outcome;
      assert.equal(one(a).outcome, outcome);
    }
  });
test('Unknown overrides warning, approved Legacy remains conclusive with gaps', () => {
  const a = fresh();
  a.findings[0].outcome = 'Action-Required';
  unknown(a);
  assert.equal(one(a).outcome, 'Undetermined');
  assert.equal(one(a).strongestKnownFinding, 'Action-Required');
  a.findings[0].outcome = 'Legacy';
  assert.equal(one(a).outcome, 'Legacy');
  assert.equal(one(a).completeness, 'incomplete');
});
test('draft policy provisional, approval cannot be manufactured', () => {
  const a = fresh();
  a.policies[0].status = 'draft';
  a.policies[0].approvalEvidenceIds = [];
  a.policies[0].owner = null;
  a.policies[0].effectiveDate = null;
  a.findings[0].outcome = 'Legacy';
  assert.equal(one(a).provisional, true);
  a.findings[1].outcome = 'Legacy';
  assert.equal(one(a).provisional, false);
  a.policies[1].approvalEvidenceIds = [];
  assert.throws(() => assess(a), /Approval/);
});
test('empty policy/evidence/findings is valid incomplete, never accepted', () => {
  const a = fresh();
  a.policies = [];
  a.findings = [];
  a.evidence = [];
  a.riskInputs = [];
  assert.equal(one(a).outcome, 'Undetermined');
  assert.equal(one(a).gaps.length, 7);
});
test('12-month inclusive boundary and leap day use calendar arithmetic', () => {
  assert.equal(anniversary('2024-02-29'), '2025-02-28');
  const a = values(fresh(), 1, 1);
  a.findings[0].forecastBreachDate = '2027-10-28';
  a.findings[0].outcome = 'Action-Required';
  assert.equal(one(a).outcome, 'Action-Required');
  assert.equal(one(a).proposedReviewDate, '2027-10-28');
  a.findings[0].forecastBreachDate = '2027-10-29';
  assert.throws(() => assess(a), /forecast/);
  a.findings[0].outcome = 'Accepted';
  assert.equal(one(a).outcome, 'Accepted');
  a.findings[0].forecastBreachDate = '2026-10-28';
  a.findings[0].outcome = 'Legacy';
  assert.equal(one(a).proposedReviewDate, '2026-10-28');
});
test('historical assessment rejects future approval; leap horizon can be assessed historically', () => {
  const a = fresh();
  a.metadata.assessmentDate = '2024-02-29';
  assert.throws(() => assess(a), /Approval/);
  a.evidence.forEach((e) => (e.date = '2024-02-01'));
  a.policies.forEach((p) => (p.effectiveDate = '2024-02-01'));
  a.findings[0].outcome = 'Action-Required';
  a.findings[0].forecastBreachDate = '2025-02-28';
  assert.equal(assess(a).results.warningHorizon, '2025-02-28');
});
test('earlier owner review and overdue events propose timely review', () => {
  const a = values(fresh(), 1, 1);
  a.policies[0].reviewDate = '2026-11-01';
  assert.equal(one(a).proposedReviewDate, '2026-11-01');
  a.policies[0].reviewDate = '2026-10-01';
  assert.equal(one(a).proposedReviewDate, '2026-10-28');
});
test('unresolved contradictions cannot masquerade as established outcomes', () => {
  const a = fresh();
  a.findings[0].contradictions = ['Vendor and operator disagree on version.'];
  assert.throws(() => assess(a), /conflict/);
  a.findings[0].outcome = 'Unknown';
  assert.equal(one(a).outcome, 'Undetermined');
});
test('risk acceptance does not change a finding', () => {
  const a = fresh();
  a.findings[0].outcome = 'Legacy';
  a.riskAcceptances.push({
    id: 'acceptance_one',
    findingIds: ['finding_D1'],
    owner: null,
    rationale: 'Tolerated temporarily',
    approvalEvidenceIds: [],
    compensatingControls: ['Verified segmentation'],
    reviewDate: null
  });
  assert.equal(one(a).outcome, 'Legacy');
});
for (const name of [
  'Older supported platform',
  'Recently introduced application',
  'Cloud service',
  'SaaS',
  'Open-source product',
  'Extended-support system'
])
  test(`${name}: evidence determines outcome`, () => {
    const a = fresh();
    a.systems[0].name = name;
    assert.equal(one(a).outcome, 'Accepted');
    a.findings[0].outcome = 'Legacy';
    assert.equal(one(a).outcome, 'Legacy');
  });
test('direct/transitive reliance preserves complete causal path and provisional origin', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  addSystem(a, 'dashboard');
  edge(a, 'reporting', 'payments');
  edge(a, 'dashboard', 'reporting');
  a.findings[0].outcome = 'Legacy';
  a.policies[0].status = 'draft';
  a.policies[0].approvalEvidenceIds = [];
  const r = assess(a).results.systems.find((s) => s.systemId === 'dashboard');
  assert.equal(r.outcome, 'Legacy');
  assert.equal(r.provisional, true);
  const dependency = r.criterionResults.find((c) => c.criterionId === 'D7');
  assert.equal(dependency.outcome, 'Legacy');
  assert.equal(dependency.provisional, true);
  assert.deepEqual(dependency.dependencyPathIndexes, [0]);
  assert.deepEqual(r.dependencyPaths[0].systemPath, ['dashboard', 'reporting', 'payments']);
  assert.equal(r.dependencyPaths[0].originFindingId, 'finding_D1');
  // L7 incidents are independently unchanged.
  assert.equal(one(a).risk.display, '26.67');
});
test('cycles without an origin do not invent Legacy; with one terminate and propagate', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  edge(a, 'reporting', 'payments');
  edge(a, 'payments', 'reporting');
  assert.equal(one(a).outcome, 'Accepted');
  a.findings[0].outcome = 'Legacy';
  assert.ok(assess(a).results.systems.every((s) => s.outcome === 'Legacy'));
  assert.equal(one(a).dependencyPaths.length, 1);
});
test('non-qualifying diagram connection does not propagate', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  edge(a, 'reporting', 'payments', { qualification: 'does-not-qualify' });
  a.findings[0].outcome = 'Legacy';
  assert.equal(assess(a).results.systems[1].outcome, 'Accepted');
});
test('external unknown and transitive unknown make consuming assessment incomplete', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  edge(a, 'payments', null, {
    qualification: 'unknown',
    thresholdId: null,
    externalAssessment: {
      name: 'External identity provider',
      outcome: 'Unknown',
      assessmentDate: null,
      provisional: false,
      evidenceIds: []
    }
  });
  edge(a, 'reporting', 'payments');
  assert.ok(
    assess(a).results.systems.every(
      (s) => s.outcome === 'Undetermined' && s.completeness === 'incomplete'
    )
  );
});
test('external attestation can establish provisional Legacy path', () => {
  const a = fresh();
  a.evidence.push({ ...structuredClone(a.evidence[1]), id: 'external_record', systemId: null });
  edge(a, 'payments', null, {
    externalAssessment: {
      name: 'Identity provider',
      outcome: 'Legacy',
      assessmentDate: '2026-10-27',
      provisional: true,
      evidenceIds: ['external_record']
    }
  });
  assert.equal(one(a).outcome, 'Legacy');
  assert.equal(one(a).provisional, true);
});
for (const [label, mutate] of [
  ['fractional', (a) => (a.riskInputs[0].inputs[0].value = 1.5)],
  ['likelihood high', (a) => (a.riskInputs[0].inputs[0].value = 7)],
  ['impact high', (a) => (a.riskInputs[0].inputs[7].value = 6)],
  ['zero', (a) => (a.riskInputs[0].inputs[0].value = 0)],
  ['string score', (a) => (a.riskInputs[0].inputs[0].value = '5')],
  ['duplicate criterion', (a) => a.riskInputs[0].inputs.push(a.riskInputs[0].inputs[0])],
  ['duplicate risk system', (a) => a.riskInputs.push(a.riskInputs[0])],
  ['duplicate ID', (a) => (a.findings[0].id = a.systems[0].id)],
  ['broken evidence', (a) => (a.findings[0].evidenceIds = ['missing'])],
  [
    'duplicate references',
    (a) => (a.findings[0].evidenceIds = ['operating_record', 'operating_record'])
  ],
  ['broken dependency', (a) => edge(a, 'payments', 'unselected')],
  ['wrong criterion threshold', (a) => (a.findings[0].thresholdId = 'rule_D2')],
  [
    'wrong threshold scope',
    (a) => {
      addSystem(a, 'reporting');
      a.policies[0].systemIds = ['reporting'];
    }
  ],
  ['bad date', (a) => (a.metadata.assessmentDate = '2026-02-29')],
  ['date shape', (a) => (a.metadata.assessmentDate = '2026-1-1')],
  ['unsupported schema', (a) => (a.schemaVersion = '2.0')],
  ['unknown field', (a) => (a.claimApproved = true)],
  ['wrong project', (a) => (a.metadata.projectId = '002')],
  ['broken component', (a) => (a.findings[0].componentId = 'missing')],
  ['assertion-only finding', (a) => (a.evidence[1].provenance = 'assertion')],
  ['proposal approval', (a) => (a.evidence[0].provenance = 'proposal')],
  ['stale computed output', (a) => (a.results = {})]
])
  test(`reject ${label}`, () => {
    const a = fresh();
    mutate(a);
    assert.throws(() => assess(a));
  });
test('omitted risk model has no inputs or numerical score', () => {
  const a = fresh();
  a.metadata.riskModel = 'none';
  assert.throws(() => assess(a));
  a.riskInputs = [];
  assert.deepEqual(one(a).risk, { status: 'omitted' });
  assert.deepEqual(assess(a).results.riskOrdering, []);
});
test('CLI exit codes and no input mutation', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'legacy-assessment-'));
  try {
    assert.equal(spawnSync('node', [helper]).status, 2);
    assert.equal(spawnSync('node', [helper, '--input', join(tmp, 'absent'), '--json']).status, 2);
    const path = join(tmp, 'input.json'),
      raw = JSON.stringify(fresh());
    writeFileSync(path, raw);
    const result = spawnSync('node', [helper, '--input', path, '--json'], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(path, 'utf8'), raw);
    assert.equal(JSON.parse(result.stdout).results.systems[0].risk.display, '26.67');
    writeFileSync(path, '{');
    assert.equal(spawnSync('node', [helper, '--input', path, '--json']).status, 1);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('draft non-reliance rule remains material to an Accepted consumer', () => {
  const a = fresh();
  addSystem(a, 'reporting');
  a.findings[0].outcome = 'Legacy';
  a.policies.push({
    ...structuredClone(a.policies[6]),
    id: 'draft_reliance',
    status: 'draft',
    approvalEvidenceIds: []
  });
  edge(a, 'reporting', 'payments', {
    qualification: 'does-not-qualify',
    thresholdId: 'draft_reliance'
  });
  const r = assess(a).results.systems[1];
  assert.equal(r.outcome, 'Accepted');
  assert.equal(r.provisional, true);
  assert.equal(r.criterionResults.find((c) => c.criterionId === 'D7').provisional, true);
});

test('CLI invoked through a symlink still emits verified JSON', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'legacy-linked-'));
  try {
    const linked = join(tmp, 'legacy-assessment.mjs');
    symlinkSync(resolve(helper), linked);
    const result = spawnSync(
      'node',
      [
        linked,
        '--input',
        'tests/fixtures/legacy-assessment/published-example.input.json',
        '--json'
      ],
      { encoding: 'utf8' }
    );
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout).results.systems[0].risk.display, '26.67');
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
