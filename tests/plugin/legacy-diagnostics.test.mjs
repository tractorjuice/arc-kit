import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  assess,
  score,
  lint,
  approvalDigest,
  renderResults,
  verifyReport
} from '../../plugins/arckit-claude/scripts/legacy-assessment.mjs';
const fresh = () =>
  JSON.parse(
    readFileSync(
      'tests/fixtures/legacy-assessment/published-example.input.json'
    )
  );
const action = () =>
  JSON.parse(
    readFileSync(
      'plugins/arckit-claude/evals/fixtures/legacy-unsupported/projects/001-payments/assessment-input.json'
    )
  ).actions[0];

test('Unknown retains established urgency at criterion and system level', () => {
  const a = fresh();
  a.findings[0].outcome = 'Action-Required';
  a.findings.push({
    ...structuredClone(a.findings[0]),
    id: 'unresolved',
    outcome: 'Unknown',
    thresholdId: null,
    evidenceIds: [],
    completeness: 'incomplete'
  });
  const r = assess(a).results.systems[0];
  assert.equal(r.outcome, 'Undetermined');
  assert.equal(r.strongestKnownFinding, 'Action-Required');
  assert.equal(r.criterionResults[0].strongestKnown, 'Action-Required');
  assert.ok(r.criterionResults[0].blockers.includes('unresolved'));
});
test('bounds match every completion for each single missing criterion', () => {
  for (let i = 0; i < 13; i++) {
    const inputs = structuredClone(fresh().riskInputs[0].inputs);
    inputs[i].value = null;
    const r = score(inputs),
      values = [];
    for (let v = 1; v <= (i < 7 ? 6 : 5); v++) {
      const filled = structuredClone(inputs);
      filled[i].value = v;
      values.push(score(filled));
    }
    assert.equal(r.bounds.minimum, Math.min(...values.map((x) => x.risk)));
    assert.equal(r.bounds.maximum, Math.max(...values.map((x) => x.risk)));
    assert.equal(r.redRated, null);
    assert.equal(r.status, 'incomplete');
    assert.equal(
      r.tipping?.lowestRedValue ?? null,
      values.findIndex((x) => x.redRated) < 0
        ? null
        : values.findIndex((x) => x.redRated) + 1
    );
  }
});
test('fully missing scores have mathematical bounds but no red-rated finding', () => {
  const r = score([]);
  assert.equal(r.bounds.minimum, 1);
  assert.equal(r.bounds.maximum, 30);
  assert.equal(r.redRated, null);
  assert.equal(r.tipping, null);
});
test('unbound and changed policy approvals are provisional without altering assessor facts', () => {
  const a = fresh();
  delete a.evidence[0].approvalFor[0].approvedDigest;
  const r = assess(a);
  assert.equal(
    r.results.approvals.find((x) => x.target === 'policy:rule_D1').status,
    'pending'
  );
  assert.equal(r.policies[0].status, 'approved');
  assert.equal(r.results.systems[0].provisional, true);
  assert.deepEqual(assess(r), r);
  a.policies[0].unacceptableCondition += ' changed';
  assert.equal(assess(a).results.approvals[0].status, 'pending');
});
test('assessment approvals bind content and allow later signoff without moving assessment cutoff', () => {
  const a = fresh(),
    e = {
      ...structuredClone(a.evidence[0]),
      id: 'assessment_signoff',
      date: '2026-10-29',
      approvalFor: [
        {
          kind: 'assessment',
          id: a.metadata.documentId,
          version: '1.0',
          approvedBy: 'Synthetic owner',
          decision: 'approved',
          approvedOn: '2026-10-29',
          approvedDigest: approvalDigest(a)
        }
      ]
    };
  a.evidence.push(e);
  a.metadata.approvalEvidenceIds = [e.id];
  let r = assess(a);
  assert.equal(r.results.approvals[0].status, 'verified');
  assert.equal(r.metadata.assessmentDate, '2026-10-28');
  const laterEvidence = structuredClone(a);
  laterEvidence.evidence.push({
    ...structuredClone(a.evidence[1]),
    id: 'later_operation',
    date: '2026-10-29'
  });
  laterEvidence.findings[0].evidenceIds = ['later_operation'];
  assert.throws(() => assess(laterEvidence), /later_operation: date-future/);
  const approvedReport =
    '## Document Control\n\n| Field | Value |\n|---|---|\n| Status | APPROVED |\n| Approved By | Synthetic owner |\n\n## Results\n' +
    renderResults(a);
  assert.equal(verifyReport(a, approvedReport), true);
  assert.throws(
    () =>
      verifyReport(
        a,
        approvedReport.replace('Synthetic owner', 'Different approver')
      ),
    /approver/
  );
  a.findings[0].rationale += ' changed';
  r = assess(a);
  assert.equal(r.results.approvals[0].status, 'stale');
  const report =
    '## Document Control\n\n| Field | Value |\n|---|---|\n| Status | APPROVED |\n\n## Results\n' +
    renderResults(a);
  assert.throws(() => verifyReport(r, report), /approval/i);
});
test('policy approvals can be reused by exact policy content, not assessment ID', () => {
  const a = fresh(),
    digest = approvalDigest(a, 'policy:rule_D1');
  a.metadata.documentId = 'ARC-001-LEGACY-v1.1';
  assert.equal(approvalDigest(a, 'policy:rule_D1'), digest);
});
test('evidence qualifications are contextual and show rejected supporting references', () => {
  const a = fresh();
  a.evidence.push({
    ...structuredClone(a.evidence[1]),
    id: 'proposal',
    provenance: 'proposal'
  });
  a.findings[0].evidenceIds.push('proposal');
  const r = assess(a);
  assert.ok(
    r.results.evidenceUses.some(
      (x) => x.evidenceId === 'proposal' && x.reasons.includes('provenance')
    )
  );
  const ds = lint(a);
  assert.ok(
    ds.some((x) => x.code === 'LA-EVIDENCE' && x.ids.includes('proposal'))
  );
  assert.ok(!ds.some((x) => x.severity === 'error'));
});
test('lint collects independent structural failures without cascading into graph checks', () => {
  const a = fresh();
  a.findings[0].outcome = 'wrong';
  a.systems[0].name = null;
  const ds = lint(a);
  assert.equal(ds.filter((x) => x.severity === 'error').length, 2);
  assert.ok(ds.every((x) => x.path.startsWith('$.')));
});
test('lint identifies multiple broken references', () => {
  const a = fresh();
  a.findings[0].evidenceIds = ['missing_one'];
  a.findings[1].evidenceIds = ['missing_two'];
  const ds = lint(a);
  assert.equal(ds.filter((x) => x.code === 'LA-REFERENCE').length, 2);
});
test('actions can address missing coverage without falsely resolving evidence gaps', () => {
  const a = fresh();
  a.findings = a.findings.filter((x) => x.criterionId !== 'D1');
  const x = action();
  x.findingIds = [];
  x.addresses = [{ kind: 'coverage', systemId: 'payments', criterionId: 'D1' }];
  a.actions = [x];
  const r = assess(a).results.systems[0];
  assert.equal(r.outcome, 'Undetermined');
  assert.ok(!r.managementGaps.includes('No action recorded for D1 Unknown'));
  assert.equal(r.completeness, 'incomplete');
  x.addresses[0].systemId = 'missing';
  assert.throws(() => assess(a), /reference/);
});
test('generated factual sections and dated event sources are verified', () => {
  const a = fresh();
  a.evidence[1].validUntil = '2027-01-10';
  const r = assess(a),
    md = renderResults(r);
  assert.ok(
    r.results.systems[0].events.some(
      (x) => x.kind === 'evidence-expiry' && x.sourceId === 'operating_record'
    )
  );
  for (const title of [
    'Inventory',
    'Finding register',
    'Action register',
    'Evidence register',
    'Threshold policy register',
    'Dependency register'
  ])
    assert.ok(md.includes(`### ${title}`));
  assert.throws(
    () =>
      verifyReport(
        r,
        md.replace('Payments application', 'Changed application')
      ),
    /disagrees/
  );
  assert.equal(verifyReport(r, md), true);
});

test('CLI lint, digest and explain modes use the same validated behaviour', async () => {
  const { spawnSync } = await import('node:child_process');
  const helper = 'plugins/arckit-claude/scripts/legacy-assessment.mjs',
    input = 'tests/fixtures/legacy-assessment/published-example.input.json';
  const run = (...args) =>
    spawnSync('node', [helper, '--input', input, ...args], {
      encoding: 'utf8'
    });
  const l = run('--lint', '--format', 'json');
  assert.equal(l.status, 0, l.stderr);
  assert.ok(Array.isArray(JSON.parse(l.stdout)));
  const digest = run('--approval-digest', 'policy:rule_D1');
  assert.equal(digest.status, 0, digest.stderr);
  assert.equal(digest.stdout.trim(), approvalDigest(fresh(), 'policy:rule_D1'));
  const e = run('--explain', 'payments');
  assert.equal(e.status, 0, e.stderr);
  assert.equal(JSON.parse(e.stdout).record.systemId, 'payments');
  assert.equal(run('--explain', 'nonexistent').status, 1);
});
