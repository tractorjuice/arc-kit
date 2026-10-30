#!/usr/bin/env node
/** Project-scoped, offline consistency calculator. Evidence truth remains an assessor responsibility. */
import {
  openSync,
  fstatSync,
  readSync,
  closeSync,
  readFileSync,
  realpathSync,
  constants
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join } from 'node:path';
import { createHash } from 'node:crypto';

export const CALCULATION_VERSION = '1.2.0';
export const CRITERIA = Object.freeze([
  'D1',
  'D2',
  'D3',
  'D4',
  'D5',
  'D6',
  'D7'
]);
export const LIMITS = Object.freeze({
  bytes: 16 * 1024 * 1024,
  depth: 64,
  nodes: 250000,
  witnesses: 20000,
  pathSegments: 200000
});
const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const fail = (message) => {
  throw new Error(message);
};
const knownText = (value) =>
  typeof value === 'string' &&
  value.trim().length > 0 &&
  !new Set([
    'unknown',
    'pending',
    'tbd',
    'tbc',
    'not known',
    'not recorded',
    'n/a'
  ]).has(value.trim().toLowerCase());
class AssetError extends Error {}
const canonical = (value) =>
  JSON.stringify(value, (_key, item) =>
    item && !Array.isArray(item) && typeof item === 'object'
      ? Object.fromEntries(
          Object.entries(item).sort(([a], [b]) => compare(a, b))
        )
      : item
  );
const leap = (year) => year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
const days = (year, month) =>
  [31, leap(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
const isDate = (value) => {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const [y, m, d] = value.split('-').map(Number);
  return y >= 1 && m >= 1 && m <= 12 && d >= 1 && d <= days(y, m);
};
export function anniversary(date) {
  if (!isDate(date)) fail('Invalid calendar date');
  const [y, m, d] = date.split('-').map(Number);
  if (y === 9999)
    fail('Assessment year has no representable 12-month anniversary');
  return `${String(y + 1).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(Math.min(d, days(y + 1, m))).padStart(2, '0')}`;
}

// Validate the JSON data model even for imported API callers (not just JSON.parse).
function jsonTree(value) {
  const ancestors = new Set();
  let count = 0,
    textBytes = 0;
  function visit(v, depth) {
    if (++count > LIMITS.nodes || depth > LIMITS.depth)
      fail('Assessment exceeds JSON complexity limits');
    if (v === null || typeof v === 'boolean') return;
    if (typeof v === 'string') {
      if (
        (textBytes += Buffer.byteLength(v)) > LIMITS.bytes ||
        /[\uD800-\uDFFF]/u.test(v)
      )
        fail('Invalid or excessive Unicode string');
      return;
    }
    if (typeof v === 'number') {
      if (
        !Number.isFinite(v) ||
        (Number.isInteger(v) && !Number.isSafeInteger(v))
      )
        fail('Non-finite or unsafe JSON number');
      return;
    }
    if (typeof v !== 'object' || ancestors.has(v))
      fail('Expected an acyclic JSON value');
    if (
      !(Array.isArray(v)
        ? Object.getPrototypeOf(v) === Array.prototype
        : [Object.prototype, null].includes(Object.getPrototypeOf(v)))
    )
      fail('Expected plain JSON objects');
    ancestors.add(v);
    const descriptors = Object.getOwnPropertyDescriptors(v);
    if (Object.getOwnPropertySymbols(v).length)
      fail('JSON cannot contain symbol keys');
    if (Array.isArray(v) && Object.keys(v).length !== v.length)
      fail('Sparse or decorated JSON array');
    for (const [key, descriptor] of Object.entries(descriptors)) {
      if (Array.isArray(v) && key === 'length') continue;
      if (!Object.hasOwn(descriptor, 'value') || !descriptor.enumerable)
        fail('JSON cannot contain accessors or hidden properties');
      if (
        (textBytes += Buffer.byteLength(key)) > LIMITS.bytes ||
        /[\uD800-\uDFFF]/u.test(key)
      )
        fail('Invalid or excessive Unicode property name');
      visit(descriptor.value, depth + 1);
    }
    ancestors.delete(v);
  }
  visit(value, 0);
}

/** JSON.parse discards duplicate members. This bounded parser rejects them, including escaped aliases. */
export function parseAssessment(raw) {
  if (typeof raw !== 'string' || Buffer.byteLength(raw) > LIMITS.bytes)
    fail('Assessment exceeds input byte limit');
  let pos = 0,
    nodes = 0;
  const white = () => {
    while (/[\t\n\r ]/.test(raw[pos] ?? '\0')) pos++;
  };
  function string() {
    const start = pos++;
    while (pos < raw.length) {
      if (raw[pos] === '\\') {
        pos += 2;
        continue;
      }
      if (raw[pos++] === '"') return JSON.parse(raw.slice(start, pos));
    }
    fail('Unterminated JSON string');
  }
  function value(depth) {
    if (++nodes > LIMITS.nodes || depth > LIMITS.depth)
      fail('Assessment exceeds JSON complexity limits');
    white();
    const ch = raw[pos];
    if (ch === '"') return string();
    if (ch === '{' || ch === '[') {
      const object = ch === '{',
        result = object ? Object.create(null) : [],
        seen = new Set();
      pos++;
      white();
      const end = object ? '}' : ']';
      if (raw[pos] === end) {
        pos++;
        return result;
      }
      for (;;) {
        white();
        let key;
        if (object) {
          if (raw[pos] !== '"') fail('Expected JSON object member');
          key = string();
          if (seen.has(key)) fail(`Duplicate JSON member: ${key}`);
          seen.add(key);
          white();
          if (raw[pos++] !== ':') fail('Expected JSON colon');
        }
        const item = value(depth + 1);
        if (object) result[key] = item;
        else result.push(item);
        white();
        const separator = raw[pos++];
        if (separator === end) return result;
        if (separator !== ',') fail('Expected JSON comma or closing delimiter');
      }
    }
    for (const [token, result] of [
      ['true', true],
      ['false', false],
      ['null', null]
    ]) {
      if (raw.startsWith(token, pos)) {
        pos += token.length;
        return result;
      }
    }
    const number = raw
      .slice(pos)
      .match(/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/);
    if (!number) fail('Invalid JSON value');
    pos += number[0].length;
    return Number(number[0]);
  }
  const result = value(0);
  white();
  if (pos !== raw.length) fail('Trailing JSON content');
  jsonTree(result);
  return result;
}

const keywords = new Set([
  '$schema',
  '$id',
  '$defs',
  '$ref',
  'title',
  'description',
  'type',
  'enum',
  'anyOf',
  'required',
  'properties',
  'additionalProperties',
  'items',
  'minItems',
  'maxItems',
  'minLength',
  'maxLength',
  'pattern',
  'format',
  'minimum',
  'maximum'
]);
let schema;
function loadSchema() {
  if (schema) return schema;
  let candidate;
  try {
    candidate = JSON.parse(
      readFileSync(
        new URL(
          '../schemas/legacy-assessment-1.0.schema.json',
          import.meta.url
        ),
        'utf8'
      )
    );
  } catch {
    throw new AssetError(
      'Bundled legacy assessment schema is missing or unreadable'
    );
  }
  function inspect(rule) {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule))
      throw new AssetError('Malformed bundled schema rule');
    if (rule.format && rule.format !== 'date')
      throw new AssetError('Unsupported bundled schema format');
    if (
      rule.type &&
      ![rule.type]
        .flat()
        .every((t) =>
          [
            'string',
            'number',
            'integer',
            'boolean',
            'null',
            'object',
            'array'
          ].includes(t)
        )
    )
      throw new AssetError('Unsupported bundled schema type');
    for (const key of Object.keys(rule))
      if (!keywords.has(key))
        throw new AssetError(`Unsupported bundled schema keyword ${key}`);
    if (
      rule.$ref &&
      (!rule.$ref.startsWith('#/$defs/') ||
        !Object.hasOwn(candidate.$defs, rule.$ref.slice(8)))
    )
      throw new AssetError('Unresolvable bundled schema reference');
    for (const child of [
      ...Object.values(rule.properties ?? {}),
      ...Object.values(rule.$defs ?? {}),
      ...(rule.anyOf ?? []),
      ...(rule.items ? [rule.items] : [])
    ])
      inspect(child);
  }
  inspect(candidate);
  schema = candidate;
  return schema;
}
let frameworkChecked = false;
function checkFrameworkAssets() {
  if (frameworkChecked) return;
  try {
    const catalogue = JSON.parse(
      readFileSync(
        new URL('../data/legacy-frameworks-1.0.json', import.meta.url),
        'utf8'
      )
    );
    for (const [key, path, model] of [
      [
        'riskRubric',
        'legacy-risk-rubric-2026-08-17.json',
        'published-2026-08-17'
      ],
      [
        'definition',
        'legacy-definition-2026-08-17.json',
        'uk-definition-2026-08-17'
      ]
    ]) {
      const manifest = catalogue.offlineAssets?.[key];
      if (!manifest || manifest.path !== path)
        throw new Error('Missing offline framework manifest');
      const raw = readFileSync(new URL(`../data/${path}`, import.meta.url));
      if (createHash('sha256').update(raw).digest('hex') !== manifest.sha256)
        throw new Error('Offline framework integrity mismatch');
      const data = JSON.parse(raw.toString('utf8'));
      if (data.modelId !== model)
        throw new Error('Offline framework version mismatch');
      if (
        key === 'riskRubric' &&
        (data.likelihood.length !== 7 ||
          data.impact.length !== 6 ||
          data.likelihood.some((c) => c.levels.length !== 6) ||
          data.impact.some((c) => c.levels.length !== 5))
      )
        throw new Error('Incomplete offline scoring tables');
      if (
        key === 'definition' &&
        (data.criteria.length !== 7 || data.outcomes.length !== 3)
      )
        throw new Error('Incomplete offline definition');
    }
  } catch (error) {
    throw new AssetError(
      `Bundled framework material is missing or invalid: ${error.code ?? error.message}; update or reinitialise ArcKit`
    );
  }
  frameworkChecked = true;
}

function validate(value, rule, path = '$') {
  if (rule.$ref)
    return validate(value, loadSchema().$defs[rule.$ref.slice(8)], path);
  if (rule.anyOf) {
    const errors = [];
    for (const option of rule.anyOf) {
      try {
        validate(value, option, path);
        return;
      } catch (error) {
        errors.push(error.message);
      }
    }
    fail(`${path}: no allowed shape matches (${errors.join('; ')})`);
  }
  if (rule.enum && !rule.enum.includes(value))
    fail(`${path}: unsupported value`);
  const matches = (type) =>
    type === 'null'
      ? value === null
      : type === 'array'
        ? Array.isArray(value)
        : type === 'integer'
          ? Number.isInteger(value)
          : type === 'object'
            ? value !== null &&
              typeof value === 'object' &&
              !Array.isArray(value)
            : typeof value === type;
  if (rule.type && ![rule.type].flat().some(matches))
    fail(`${path}: expected ${rule.type}`);
  if (value === null) return;
  if (typeof value === 'string') {
    let length = 0;
    for (const _char of value)
      if (++length > (rule.maxLength ?? Infinity))
        fail(`${path}: invalid string length`);
    if (length < (rule.minLength ?? 0) || length > (rule.maxLength ?? Infinity))
      fail(`${path}: invalid string length`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value))
      fail(`${path}: invalid format`);
    if (rule.format === 'date' && !isDate(value))
      fail(`${path}: invalid calendar date`);
  }
  if (
    typeof value === 'number' &&
    (value < (rule.minimum ?? -Infinity) || value > (rule.maximum ?? Infinity))
  )
    fail(`${path}: out of range`);
  if (Array.isArray(value)) {
    if (
      value.length < (rule.minItems ?? 0) ||
      value.length > (rule.maxItems ?? Infinity)
    )
      fail(`${path}: invalid item count`);
    value.forEach((item, index) =>
      validate(item, rule.items, `${path}[${index}]`)
    );
  } else if (typeof value === 'object') {
    for (const key of rule.required ?? [])
      if (!Object.hasOwn(value, key)) fail(`${path}.${key}: required`);
    for (const [key, item] of Object.entries(value)) {
      if (
        rule.additionalProperties === false &&
        !Object.hasOwn(rule.properties, key)
      )
        fail(`${path}.${key}: unknown field`);
      if (rule.properties?.[key])
        validate(item, rule.properties[key], `${path}.${key}`);
    }
  }
}

export function approvalDigest(input, target = 'assessment') {
  jsonTree(input);
  const a = structuredClone(input);
  delete a.results;
  const strip = (x) => {
    if (!x || typeof x !== 'object') return;
    delete x.approvalEvidenceIds;
    delete x.approvedDigest;
    delete x.approvedOn;
    for (const v of Object.values(x))
      if (Array.isArray(v)) v.forEach(strip);
      else strip(v);
  };
  let payload;
  if (target === 'assessment') {
    a.evidence = a.evidence.filter((e) => !e.approvalFor?.length);
    payload = a;
  } else {
    const [kind, id] = target.split(':');
    const item = (
      kind === 'policy'
        ? a.policies
        : kind === 'risk-acceptance'
          ? a.riskAcceptances
          : []
    ).find((x) => x.id === id);
    if (!item) fail('Unknown approval target');
    payload =
      kind === 'policy'
        ? { kind, item }
        : { documentId: a.metadata.documentId, kind, item };
  }
  strip(payload);
  return createHash('sha256').update(canonical(payload)).digest('hex');
}

export function evidenceReasons(
  e,
  at,
  subjectIds,
  componentId = null,
  approval = false
) {
  const reasons = [];
  if (!e.date) reasons.push('date-missing');
  else if (e.date > at) reasons.push('date-future');
  if (e.validUntil && e.validUntil < at) reasons.push('expired');
  if (!['operation', 'document'].includes(e.provenance))
    reasons.push('provenance');
  if (!knownText(e.source)) reasons.push('source-missing');
  if (!approval && e.approvalFor?.length) reasons.push('approval-only');
  if (e.systemId !== null && !subjectIds.includes(e.systemId))
    reasons.push('system-scope');
  if (
    componentId !== null &&
    e.componentId !== null &&
    e.componentId !== componentId
  )
    reasons.push('component-scope');
  return reasons;
}

export function score(inputs) {
  jsonTree(inputs);
  if (!Array.isArray(inputs) || inputs.length > 13)
    fail('Risk inputs must be an array of at most thirteen criteria');
  const scores = new Map();
  for (const input of inputs) {
    validate(input, loadSchema().$defs.riskInput, '$.riskInput');
    if (scores.has(input.criterionId))
      fail(`Duplicate risk criterion: ${input.criterionId}`);
    scores.set(input.criterionId, input.value);
  }
  const missing = [
    ...Array.from({ length: 7 }, (_, i) => `L${i + 1}`),
    ...Array.from({ length: 6 }, (_, i) => `C${i + 1}`)
  ].filter((id) => scores.get(id) == null);
  if (missing.length) {
    // Sum and maximum are non-decreasing in each positive input. Their
    // positive product therefore has exact extrema at the two corners.
    const complete = (high) =>
      inputs.map((i) => ({
        ...i,
        value: i.value ?? (high ? (i.criterionId.startsWith('L') ? 6 : 5) : 1)
      }));
    const filled = (high) => {
      const list = complete(high);
      for (const id of missing)
        if (!scores.has(id))
          list.push({
            criterionId: id,
            value: high ? (id.startsWith('L') ? 6 : 5) : 1,
            evidenceIds: [],
            rationale: 'Mathematical bound only'
          });
      return score(list);
    };
    const low = filled(false),
      high = filled(true);
    let tipping = null;
    if (missing.length === 1) {
      const id = missing[0];
      for (let v = 1; v <= (id.startsWith('L') ? 6 : 5); v++) {
        const list = complete(false).filter((i) => i.criterionId !== id);
        list.push({
          criterionId: id,
          value: v,
          evidenceIds: [],
          rationale: 'Sensitivity only'
        });
        if (score(list).redRated) {
          tipping = { criterionId: id, lowestRedValue: v };
          break;
        }
      }
    }
    return {
      status: 'incomplete',
      missing,
      likelihood: null,
      impact: null,
      risk: null,
      redRated: null,
      display: null,
      bounds: {
        minimum: low.risk,
        likelihoodMinimum: low.likelihood,
        likelihoodMaximum: high.likelihood,
        impactMinimum: low.impact,
        impactMaximum: high.impact,
        maximum: high.risk,
        minimumNumerator: low.arithmetic.riskNumerator,
        maximumNumerator: high.arithmetic.riskNumerator,
        denominator: 168
      },
      thresholdAssessment: low.redRated
        ? 'always-at-or-above-16'
        : !high.redRated
          ? 'always-below-16'
          : 'depends-on-missing-inputs',
      tipping
    };
  }
  const L = Array.from({ length: 7 }, (_, i) => scores.get(`L${i + 1}`)),
    C = Array.from({ length: 6 }, (_, i) => scores.get(`C${i + 1}`));
  const ln = L.reduce((a, b) => a + b, 0) + 7 * Math.max(...L),
    cn = C.reduce((a, b) => a + b, 0) + 6 * Math.max(...C);
  return {
    status: 'complete',
    missing: [],
    likelihood: ln / 14,
    impact: cn / 12,
    risk: (ln * cn) / 168,
    redRated: ln * cn >= 2688,
    display: ((ln * cn) / 168).toFixed(2),
    arithmetic: {
      likelihoodNumerator: ln,
      likelihoodDenominator: 14,
      impactNumerator: cn,
      impactDenominator: 12,
      riskNumerator: ln * cn,
      riskDenominator: 168
    }
  };
}

export function assess(input) {
  jsonTree(input);
  if (input.results && input.results.calculationVersion !== CALCULATION_VERSION)
    fail(
      'Stored draft calculation version is stale; regenerate outputs from assessor input and obtain fresh approval'
    );
  validate(input, loadSchema());
  checkFrameworkAssets();
  const a = structuredClone(input);
  delete a.results;
  const inputText = canonical(a);
  if (Buffer.byteLength(inputText) > LIMITS.bytes)
    fail('Assessment exceeds input byte limit');
  const date = a.metadata.assessmentDate,
    horizon = anniversary(date);
  if (!a.metadata.documentId.startsWith(`ARC-${a.metadata.projectId}-`))
    fail('Document/project IDs disagree');
  const ids = new Set();
  function index(items) {
    const map = new Map();
    for (const item of items) {
      if (ids.has(item.id)) fail(`Duplicate ID: ${item.id}`);
      ids.add(item.id);
      map.set(item.id, item);
    }
    return map;
  }
  const systems = index(a.systems),
    evidence = index(a.evidence),
    policies = index(a.policies.map((p) => ({ ...p }))),
    findings = index(a.findings);
  const dependencies = index(a.dependencies),
    actions = index(a.actions);
  index(a.riskAcceptances);
  const components = new Map();
  for (const system of a.systems)
    for (const component of system.components) {
      index([component]);
      components.set(component.id, system.id);
    }
  function refs(values, map, label) {
    if (new Set(values).size !== values.length)
      fail(`Duplicate ${label} reference`);
    for (const id of values)
      if (!map.has(id)) fail(`Broken ${label} reference: ${id}`);
  }
  const ev = (values) => refs(values, evidence, 'evidence');
  for (const e of a.evidence) {
    if (e.systemId !== null) refs([e.systemId], systems, 'system');
    if (e.componentId !== null && components.get(e.componentId) !== e.systemId)
      fail(`Evidence ${e.id}: component outside system`);
    if (e.validUntil && e.date && e.validUntil < e.date)
      fail(`Evidence ${e.id}: expiry precedes observation`);
  }
  const dated = (e, at = date) =>
    e.date && e.date <= at && (!e.validUntil || e.validUntil >= at);
  const evidenceUses = [],
    approvals = [];
  function evidenceFor(
    values,
    subjectIds,
    componentId = null,
    label = 'Evidence',
    at = date
  ) {
    ev(values);
    const uses = values.map((id) => ({
      evidenceId: id,
      use: label,
      at,
      reasons: evidenceReasons(evidence.get(id), at, subjectIds, componentId)
    }));
    evidenceUses.push(...uses);
    for (const u of uses)
      if (u.reasons.some((r) => r.endsWith('-scope')))
        fail(
          `${label}: evidence ${u.evidenceId} is outside ${u.reasons.includes('system-scope') ? 'system' : 'component'} scope`
        );
    return uses
      .filter((u) => !u.reasons.length)
      .map((u) => evidence.get(u.evidenceId));
  }
  const rejectionDetail = () =>
    evidenceUses
      .filter((u) => u.reasons.length)
      .slice(-20)
      .map((u) => `${u.evidenceId}: ${u.reasons.join(', ')}`)
      .join('; ');
  function approval(values, target, subjectIds, owner) {
    if (!knownText(owner))
      fail(`Approval for ${target.id} requires an accountable owner`);
    ev(values);
    if (
      !values.length ||
      values.some((id) => {
        const e = evidence.get(id);
        return (
          e.provenance !== 'document' ||
          !knownText(e.source) ||
          !isDate(e.date) ||
          (target.kind !== 'assessment' && !dated(e)) ||
          !(e.approvalFor ?? []).some(
            (t) =>
              t.kind === target.kind &&
              t.id === target.id &&
              t.version === target.version &&
              knownText(t.approvedBy)
          ) ||
          (e.systemId !== null && !subjectIds.includes(e.systemId))
        );
      })
    )
      fail(
        `Approval for ${target.kind} ${target.id}@${target.version} requires matching dated documentary evidence; ` +
          values
            .map((id) => {
              const e = evidence.get(id);
              const reasons = evidenceReasons(
                e,
                target.kind === 'assessment' ? e.date : date,
                subjectIds,
                null,
                true
              );
              if (e.provenance !== 'document')
                reasons.push('document-required');
              if (
                !(e.approvalFor ?? []).some(
                  (t) =>
                    t.kind === target.kind &&
                    t.id === target.id &&
                    t.version === target.version &&
                    knownText(t.approvedBy)
                )
              )
                reasons.push('approval-target-or-approver');
              return `${id}: ${reasons.join(', ') || 'qualifies'}`;
            })
            .join('; ')
      );
    if (
      subjectIds.some(
        (s) =>
          !values.some(
            (id) =>
              evidence.get(id).systemId === null ||
              evidence.get(id).systemId === s
          )
      )
    )
      fail('Approval does not cover its full system scope');
    const key =
      target.kind === 'assessment'
        ? 'assessment'
        : `${target.kind}:${target.id}`;
    const digest = approvalDigest(a, key);
    const matched = values
      .map((id) => evidence.get(id))
      .map((e) => ({
        e,
        t: e.approvalFor.find(
          (t) =>
            t.kind === target.kind &&
            t.id === target.id &&
            t.version === target.version
        )
      }));
    const verified = matched.every(
      ({ e, t }) =>
        t.approvedDigest === digest &&
        isDate(t.approvedOn) &&
        e.date <= t.approvedOn &&
        (!e.validUntil || e.validUntil >= t.approvedOn) &&
        (target.kind !== 'assessment'
          ? t.approvedOn <= date
          : t.approvedOn >= date)
    );
    approvals.push({
      target: key,
      digest,
      status: verified
        ? 'verified'
        : matched.some(
              ({ t }) => t.approvedDigest && t.approvedDigest !== digest
            )
          ? 'stale'
          : 'pending'
    });
    return verified;
  }
  if (a.metadata.approvalEvidenceIds.length)
    approval(
      a.metadata.approvalEvidenceIds,
      {
        kind: 'assessment',
        id: a.metadata.documentId,
        version: a.metadata.documentId.split('-v').at(-1)
      },
      [...systems.keys()],
      'Supplied assessment approval'
    );
  for (const p of policies.values()) {
    refs(p.systemIds, systems, 'system');
    ev(p.approvalEvidenceIds);
    if (p.status === 'approved') {
      const verified = approval(
        p.approvalEvidenceIds,
        { kind: 'policy', id: p.id, version: p.version },
        p.systemIds.length ? p.systemIds : [...systems.keys()],
        p.owner
      );
      if (!p.effectiveDate || p.effectiveDate > date)
        fail(`Policy ${p.id}: approval requires applicable effective date`);
      if (!verified) p.status = 'draft';
    } else if (p.approvalEvidenceIds.length)
      fail(`Draft policy ${p.id} cannot claim approval`);
  }
  function ruleFor(id, criterionId, systemId) {
    if (id === null) return null;
    refs([id], policies, 'threshold');
    const p = policies.get(id);
    if (
      p.criterionId !== criterionId ||
      (p.systemIds.length && !p.systemIds.includes(systemId))
    )
      fail(`Threshold ${id}: wrong criterion or scope`);
    return p;
  }
  const bySystem = new Map(a.systems.map((s) => [s.id, []])),
    outgoing = new Map(a.systems.map((s) => [s.id, []])),
    incoming = new Map(a.systems.map((s) => [s.id, []]));
  for (const d of a.dependencies) {
    refs([d.consumerId], systems, 'system');
    if ((d.dependencyId === null) === (d.externalAssessment === null))
      fail(`Dependency ${d.id}: choose internal or external`);
    if (d.dependencyId !== null) refs([d.dependencyId], systems, 'dependency');
    if (d.dependencyId === d.consumerId)
      fail(`Dependency ${d.id}: self reliance is not an external dependency`);
    outgoing.get(d.consumerId).push(d);
    if (d.dependencyId) incoming.get(d.dependencyId).push(d);
    const p = ruleFor(d.thresholdId, 'D7', d.consumerId);
    const support = evidenceFor(
      d.evidenceIds,
      [d.consumerId, ...(d.dependencyId ? [d.dependencyId] : [])],
      null,
      `Dependency ${d.id}`
    );
    if (d.qualification !== 'unknown' && (!p || !support.length))
      fail(
        `Dependency ${d.id}: reliance decision needs threshold and current dated evidence; ${rejectionDetail()}`
      );
    if (d.externalAssessment) {
      const x = d.externalAssessment;
      ev(x.evidenceIds);
      if (x.validUntil && x.assessmentDate && x.validUntil < x.assessmentDate)
        fail(`Dependency ${d.id}: external expiry precedes assessment`);
      const support = x.assessmentDate
        ? evidenceFor(
            x.evidenceIds,
            [],
            null,
            `External assessment ${d.id}`,
            x.assessmentDate
          )
        : [];
      if (
        x.outcome !== 'Unknown' &&
        (!x.assessmentDate ||
          x.assessmentDate > date ||
          (x.validUntil && x.validUntil < date) ||
          !support.length ||
          !support.some((e) => dated(e)))
      )
        fail(
          `Dependency ${d.id}: external outcome needs a current, correctly dated attestation; ${rejectionDetail()}`
        );
    }
  }
  const subjects = new Set();
  for (const f of a.findings) {
    refs([f.systemId], systems, 'system');
    if (f.componentId !== null && components.get(f.componentId) !== f.systemId)
      fail(`Finding ${f.id}: component outside system`);
    const subject = canonical([
      f.systemId,
      f.componentId,
      f.criterionId,
      f.thresholdId
    ]);
    if (subjects.has(subject))
      fail(
        `Duplicate finding assessment for ${f.systemId}/${f.componentId ?? 'system'}/${f.criterionId}`
      );
    subjects.add(subject);
    const p = ruleFor(f.thresholdId, f.criterionId, f.systemId);
    const allowed = [
      f.systemId,
      ...(f.criterionId === 'D7'
        ? outgoing
            .get(f.systemId)
            .map((d) => d.dependencyId)
            .filter(Boolean)
        : [])
    ];
    const support = evidenceFor(
      f.evidenceIds,
      allowed,
      f.componentId,
      `Finding ${f.id}`
    );
    if (f.outcome !== 'Unknown' && (!p || !support.length))
      fail(
        `Finding ${f.id}: established outcome needs threshold and current dated evidence; ${rejectionDetail()}`
      );
    if (
      f.outcome === 'Accepted' &&
      f.componentId === null &&
      systems
        .get(f.systemId)
        .components.some(
          (c) =>
            !support.some(
              (e) => e.componentId === null || e.componentId === c.id
            )
        )
    )
      fail(
        `Finding ${f.id}: system-wide Accepted needs evidence covering all components`
      );
    if (f.contradictions.length && f.outcome !== 'Unknown')
      fail(`Finding ${f.id}: unresolved conflict must be Unknown`);
    if (f.forecastBreachDate && f.outcome !== 'Unknown') {
      const expected =
        f.forecastBreachDate <= date
          ? 'Legacy'
          : f.forecastBreachDate <= horizon
            ? 'Action-Required'
            : 'Accepted';
      if (f.outcome !== expected)
        fail(
          `Finding ${f.id}: forecast inconsistent with assessment date and 12-month horizon`
        );
    }
    bySystem.get(f.systemId).push(f);
  }
  const riskInputs = new Map();
  for (const r of a.riskInputs) {
    refs([r.systemId], systems, 'system');
    if (riskInputs.has(r.systemId))
      fail(`Duplicate risk system: ${r.systemId}`);
    score(r.inputs);
    for (const i of r.inputs)
      if (
        i.value !== null &&
        !evidenceFor(
          i.evidenceIds,
          [r.systemId],
          null,
          `Risk ${r.systemId}/${i.criterionId}`
        ).length
      )
        fail(
          `Risk ${r.systemId}/${i.criterionId}: requires current dated evidence; ${rejectionDetail()}`
        );
      else ev(i.evidenceIds);
    if (r.chartAnnotation) {
      const calculated = score(r.inputs),
        annotation = r.chartAnnotation;
      if (calculated.status !== 'incomplete')
        fail(`Risk ${r.systemId}: chart annotations require incomplete inputs`);
      const point = annotation.suspectedPosition,
        b = calculated.bounds;
      if (
        point &&
        (point.likelihood < b.likelihoodMinimum ||
          point.likelihood > b.likelihoodMaximum ||
          point.impact < b.impactMinimum ||
          point.impact > b.impactMaximum)
      )
        fail(
          `Risk ${r.systemId}: suspected position lies outside the input bounds`
        );
    }
    riskInputs.set(r.systemId, r.inputs);
  }
  if (a.metadata.riskModel === 'none' && a.riskInputs.length)
    fail('risk-model none requires empty riskInputs');
  for (const action of a.actions) {
    refs(action.findingIds, findings, 'finding');
    if (!action.findingIds.length && !action.addresses?.length)
      fail(`Action ${action.id}: needs findings or addresses`);
    for (const target of action.addresses ?? []) {
      refs([target.systemId], systems, 'system');
      if (
        target.kind === 'dependency' &&
        (!dependencies.has(target.id) ||
          dependencies.get(target.id).consumerId !== target.systemId)
      )
        fail(`Action ${action.id}: broken dependency target`);
      if (target.kind === 'coverage' && !CRITERIA.includes(target.criterionId))
        fail(`Action ${action.id}: invalid coverage criterion`);
      if (
        target.kind === 'riskInput' &&
        !/^(L[1-7]|C[1-6])$/.test(target.criterionId)
      )
        fail(`Action ${action.id}: invalid risk criterion`);
    }
    refs(action.dependencyActionIds, actions, 'action');
    const subjectIds = [
      ...new Set([
        ...action.findingIds.map((id) => findings.get(id).systemId),
        ...(action.addresses ?? []).map((t) => t.systemId)
      ])
    ];
    for (const values of [
      action.completionEvidenceIds,
      ...action.milestones.map((m) => m.completionEvidenceIds)
    ]) {
      const support = evidenceFor(
        values,
        subjectIds,
        null,
        `Action ${action.id} completion`
      );
      if (support.length !== values.length)
        fail(
          `Action ${action.id}: completion needs current operational or documentary evidence for every reference; ${rejectionDetail()}`
        );
    }
  }
  // Kahn's algorithm also handles long legitimate action chains without recursion.
  const remaining = new Map(
    a.actions.map((x) => [x.id, x.dependencyActionIds.length])
  );
  const dependents = new Map(a.actions.map((x) => [x.id, []]));
  for (const x of a.actions)
    for (const id of x.dependencyActionIds) dependents.get(id).push(x.id);
  const ready = a.actions
    .filter((x) => remaining.get(x.id) === 0)
    .map((x) => x.id);
  for (let n = 0; n < ready.length; n++)
    for (const id of dependents.get(ready[n])) {
      remaining.set(id, remaining.get(id) - 1);
      if (remaining.get(id) === 0) ready.push(id);
    }
  if (ready.length !== a.actions.length)
    fail('Action dependency cycle prevents an actionable plan');
  for (const acceptance of a.riskAcceptances) {
    refs(acceptance.findingIds, findings, 'finding');
    if (acceptance.approvalEvidenceIds.length)
      approval(
        acceptance.approvalEvidenceIds,
        {
          kind: 'risk-acceptance',
          id: acceptance.id,
          version: a.metadata.documentId
        },
        [
          ...new Set(
            acceptance.findingIds.map((id) => findings.get(id).systemId)
          )
        ],
        acceptance.owner
      );
  }

  // A shortest witness per origin/system/basis is sufficient to prove reliance.
  // Enumerating all simple paths is exponential even in a small acyclic graph.
  const paths = new Map(a.systems.map((s) => [s.id, []])),
    queue = [],
    seen = new Set();
  let segments = 0;
  function witness(path, origin) {
    const key = canonical([path.systemId, origin, path.provisional]);
    if (seen.has(key)) return;
    if (
      seen.size >= LIMITS.witnesses ||
      (segments += path.systemPath.length + path.dependencyPath.length) >
        LIMITS.pathSegments
    )
      fail(
        'Dependency witness complexity limit exceeded; narrow the assessment scope'
      );
    seen.add(key);
    queue.push({ path, origin });
    paths.get(path.systemId).push(path);
  }
  for (const f of a.findings
    .filter((f) => f.criterionId !== 'D7' && f.outcome === 'Legacy')
    .sort((a, b) => compare(a.id, b.id)))
    witness(
      {
        systemId: f.systemId,
        originFindingId: f.id,
        systemPath: [f.systemId],
        dependencyPath: [],
        provisional: policies.get(f.thresholdId).status !== 'approved'
      },
      f.id
    );
  for (const d of [...a.dependencies].sort((a, b) => compare(a.id, b.id)))
    if (
      d.externalAssessment?.outcome === 'Legacy' &&
      d.qualification === 'qualifies'
    )
      witness(
        {
          systemId: d.consumerId,
          originFindingId: null,
          systemPath: [d.consumerId, `external:${d.id}`],
          dependencyPath: [d.id],
          provisional:
            d.externalAssessment.provisional ||
            policies.get(d.thresholdId).status !== 'approved'
        },
        `external:${d.id}`
      );
  for (let n = 0; n < queue.length; n++) {
    const { path, origin } = queue[n];
    for (const d of [...incoming.get(path.systemId)].sort((a, b) =>
      compare(a.id, b.id)
    )) {
      if (
        d.qualification !== 'qualifies' ||
        path.systemPath.includes(d.consumerId)
      )
        continue;
      witness(
        {
          ...path,
          systemId: d.consumerId,
          systemPath: [d.consumerId, ...path.systemPath],
          dependencyPath: [d.id, ...path.dependencyPath],
          provisional:
            path.provisional ||
            policies.get(d.thresholdId).status !== 'approved'
        },
        origin
      );
    }
  }
  for (const f of a.findings)
    if (
      f.criterionId === 'D7' &&
      f.outcome === 'Legacy' &&
      !paths.get(f.systemId).some((p) => p.dependencyPath.length)
    )
      fail(
        `Finding ${f.id}: D7 Legacy requires an independent dependency origin`
      );

  const gaps = new Map(),
    dependencyGaps = new Map();
  const coverage = (s, c) => {
    const source = bySystem.get(s.id).filter((f) => f.criterionId === c);
    return (
      source.some((f) => f.componentId === null) ||
      (s.components.length > 0 &&
        s.components.every((comp) =>
          source.some((f) => f.componentId === comp.id)
        ))
    );
  };
  const unknown = new Set();
  for (const s of a.systems) {
    const fs = bySystem.get(s.id),
      missing = CRITERIA.filter((c) => !coverage(s, c)),
      dg = new Set();
    const gs = missing.map((c) => `Missing ${c} assessment coverage`);
    for (const f of fs)
      if (f.outcome === 'Unknown' || f.completeness === 'incomplete')
        gs.push(`Unresolved or incomplete finding ${f.id}`);
    for (const d of outgoing.get(s.id))
      if (
        d.qualification === 'unknown' ||
        (d.qualification === 'qualifies' &&
          d.externalAssessment?.outcome === 'Unknown')
      )
        dg.add(d.id);
    dependencyGaps.set(s.id, dg);
    gaps.set(s.id, gs);
    if (missing.length || fs.some((f) => f.outcome === 'Unknown') || dg.size)
      unknown.add(s.id);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const d of a.dependencies)
      if (
        d.dependencyId &&
        d.qualification === 'qualifies' &&
        unknown.has(d.dependencyId) &&
        !paths.get(d.dependencyId).length
      ) {
        dependencyGaps.get(d.consumerId).add(d.id);
        if (!unknown.has(d.consumerId)) {
          unknown.add(d.consumerId);
          changed = true;
        }
      }
  }
  for (const s of a.systems)
    for (const id of [...dependencyGaps.get(s.id)].sort(compare))
      gaps.get(s.id).push(`Unresolved dependency ${id}`);
  const results = {
    calculationVersion: CALCULATION_VERSION,
    inputDigest: createHash('sha256').update(inputText).digest('hex'),
    warningHorizon: horizon,
    evidenceUses,
    approvals,
    models: JSON.parse(
      readFileSync(
        new URL('../data/legacy-frameworks-1.0.json', import.meta.url),
        'utf8'
      )
    ).offlineAssets,
    systems: [],
    counts: {
      Accepted: 0,
      'Action-Required': 0,
      Legacy: 0,
      Undetermined: 0,
      complete: 0,
      incomplete: 0,
      provisional: 0,
      actionPlanComplete: 0,
      actionPlanIncomplete: 0
    },
    riskOrdering: []
  };
  for (const s of a.systems) {
    const fs = bySystem.get(s.id),
      ps = paths.get(s.id);
    const criteria = CRITERIA.map((criterionId) => {
      const source = fs.filter((f) => f.criterionId === criterionId),
        witnesses =
          criterionId === 'D7'
            ? ps.filter((p) => p.dependencyPath.length)
            : ps.filter((p) => source.some((f) => f.id === p.originFindingId));
      const hasLegacy = witnesses.length > 0,
        incomplete =
          !coverage(s, criterionId) ||
          source.some(
            (f) => f.outcome === 'Unknown' || f.completeness === 'incomplete'
          ) ||
          (criterionId === 'D7' && dependencyGaps.get(s.id).size > 0);
      const outcome = hasLegacy
        ? 'Legacy'
        : !coverage(s, criterionId) ||
            source.some((f) => f.outcome === 'Unknown') ||
            (criterionId === 'D7' && dependencyGaps.get(s.id).size > 0)
          ? 'Unknown'
          : source.some((f) => f.outcome === 'Action-Required')
            ? 'Action-Required'
            : 'Accepted';
      const statuses = new Set(
        [
          ...source.map((f) => f.thresholdId),
          ...(criterionId === 'D7'
            ? outgoing.get(s.id).map((d) => d.thresholdId)
            : [])
        ]
          .filter(Boolean)
          .map((id) => policies.get(id).status)
      );
      const basis =
        statuses.size === 0
          ? 'no-policy'
          : statuses.size === 2
            ? 'mixed-policy'
            : statuses.has('draft')
              ? 'draft-policy'
              : 'approved-policy';
      return {
        criterionId,
        strongestKnown: hasLegacy
          ? 'Legacy'
          : source.some((f) => f.outcome === 'Action-Required')
            ? 'Action-Required'
            : source.some((f) => f.outcome === 'Accepted')
              ? 'Accepted'
              : null,
        blockers: [
          ...source.filter((f) => f.outcome === 'Unknown').map((f) => f.id),
          ...(!coverage(s, criterionId) ? ['missing-coverage'] : []),
          ...(criterionId === 'D7' ? [...dependencyGaps.get(s.id)] : [])
        ],
        outcome,
        basis,
        provisional: hasLegacy
          ? !witnesses.some((p) => !p.provisional)
          : source.some(
              (f) =>
                f.thresholdId && policies.get(f.thresholdId).status === 'draft'
            ) ||
            (criterionId === 'D7' &&
              outgoing
                .get(s.id)
                .some(
                  (d) =>
                    (d.thresholdId &&
                      policies.get(d.thresholdId).status === 'draft') ||
                    d.externalAssessment?.provisional
                )),
        completeness: incomplete ? 'incomplete' : 'complete',
        findingIds: source.map((f) => f.id),
        dependencyPathIndexes:
          criterionId === 'D7'
            ? ps.flatMap((p, i) => (p.dependencyPath.length ? [i] : []))
            : []
      };
    });
    const legacy = ps.length > 0,
      action = criteria.some((c) => c.outcome === 'Action-Required');
    const outcome = legacy
      ? 'Legacy'
      : criteria.some((c) => c.outcome === 'Unknown')
        ? 'Undetermined'
        : action
          ? 'Action-Required'
          : 'Accepted';
    const strongestKnownFinding = legacy
      ? 'Legacy'
      : criteria.some((c) => c.strongestKnown === 'Action-Required')
        ? 'Action-Required'
        : criteria.some((c) => c.strongestKnown === 'Accepted')
          ? 'Accepted'
          : null;
    const provisional = legacy
        ? !ps.some((p) => !p.provisional)
        : criteria.some((c) => c.provisional),
      completeness = gaps.get(s.id).length ? 'incomplete' : 'complete';
    const relevantActions = a.actions.filter(
        (act) =>
          act.findingIds.some((id) => findings.get(id).systemId === s.id) ||
          (act.addresses ?? []).some((t) => t.systemId === s.id)
      ),
      acceptances = a.riskAcceptances.filter((x) =>
        x.findingIds.some((id) => findings.get(id).systemId === s.id)
      );
    const risk =
      a.metadata.riskModel === 'none'
        ? { status: 'omitted' }
        : score(riskInputs.get(s.id) ?? []);
    const managementGaps = [];
    const usedRules = new Set(
      [
        ...fs.map((f) => f.thresholdId),
        ...outgoing.get(s.id).map((d) => d.thresholdId)
      ].filter(Boolean)
    );
    for (const id of usedRules)
      if (policies.get(id).status === 'draft')
        managementGaps.push(`Threshold ${id}: owner approval pending`);
    if (risk.status === 'complete' && risk.redRated && !relevantActions.length)
      managementGaps.push(
        'Numerical red-rated risk has no recorded review action'
      );
    if (!knownText(s.businessRiskOwner))
      managementGaps.push('Accountable business risk owner is unknown');
    if (!knownText(s.deliveryOwner))
      managementGaps.push('Delivery owner is unknown');
    for (const c of criteria.filter((c) => c.outcome !== 'Accepted'))
      if (
        !relevantActions.some(
          (act) =>
            act.findingIds.some((id) => c.findingIds.includes(id)) ||
            (act.addresses ?? []).some(
              (t) =>
                t.systemId === s.id &&
                ((t.kind === 'coverage' && t.criterionId === c.criterionId) ||
                  (t.kind === 'dependency' && c.criterionId === 'D7'))
            )
        )
      )
        managementGaps.push(
          `No action recorded for ${c.criterionId} ${c.outcome}`
        );
    for (const act of relevantActions) {
      if (!knownText(act.businessRiskOwner) || !knownText(act.deliveryOwner))
        managementGaps.push(`Action ${act.id}: owners incomplete`);
      if (!knownText(act.fundingStatus))
        managementGaps.push(`Action ${act.id}: funding status unknown`);
      if (!act.targetDate)
        managementGaps.push(`Action ${act.id}: target date unknown`);
      if (act.cost !== null && !act.currency)
        managementGaps.push(`Action ${act.id}: cost currency unknown`);
      if (
        !act.containment &&
        act.findingIds.some((id) => findings.get(id).outcome === 'Legacy')
      )
        managementGaps.push(`Action ${act.id}: containment not recorded`);
    }
    for (const x of acceptances)
      if (
        !approvals.some(
          (p) =>
            p.target === `risk-acceptance:${x.id}` && p.status === 'verified'
        )
      )
        managementGaps.push(`Risk acceptance ${x.id}: approval pending`);
    const usedIds = new Set([
      ...fs.flatMap((f) => f.evidenceIds),
      ...outgoing
        .get(s.id)
        .flatMap((d) => [
          ...d.evidenceIds,
          ...(d.externalAssessment?.evidenceIds ?? [])
        ]),
      ...(riskInputs.get(s.id) ?? []).flatMap((i) => i.evidenceIds)
    ]);
    const events = [
      horizon,
      ...(legacy || (risk.status === 'complete' && risk.redRated)
        ? [date]
        : []),
      ...fs.map((f) => f.forecastBreachDate),
      ...a.policies
        .filter((p) => !p.systemIds.length || p.systemIds.includes(s.id))
        .map((p) => p.reviewDate),
      ...relevantActions.map((x) => x.nextReviewDate),
      ...acceptances.map((x) => x.reviewDate),
      ...outgoing.get(s.id).map((d) => d.externalAssessment?.validUntil),
      ...[...usedIds].map((id) => evidence.get(id).validUntil)
    ]
      .filter(Boolean)
      .map((d) => (d < date ? date : d))
      .sort(compare);
    const actionPlanCompleteness = managementGaps.length
      ? 'incomplete'
      : 'complete';
    results.systems.push({
      systemId: s.id,
      outcome,
      strongestKnownFinding,
      provisional,
      completeness,
      criterionResults: criteria,
      componentResults: deriveComponents(s, fs, policies, evidence, date),
      events: [
        {
          kind: 'review-horizon',
          sourceId: s.id,
          date: horizon,
          reviewTrigger: true
        },
        ...fs
          .filter((f) => f.forecastBreachDate)
          .map((f) => ({
            kind: 'forecast-breach',
            sourceId: f.id,
            date: f.forecastBreachDate,
            reviewTrigger: true
          })),
        ...a.policies
          .filter((p) => !p.systemIds.length || p.systemIds.includes(s.id))
          .filter((p) => p.reviewDate)
          .map((p) => ({
            kind: 'policy-review',
            sourceId: p.id,
            date: p.reviewDate,
            reviewTrigger: true
          })),
        ...relevantActions
          .flatMap((x) => [
            {
              kind: 'action-review',
              sourceId: x.id,
              date: x.nextReviewDate,
              reviewTrigger: true
            },
            {
              kind: 'delivery-target',
              sourceId: x.id,
              date: x.targetDate,
              reviewTrigger: false
            },
            ...x.milestones.map((m) => ({
              kind: 'milestone',
              sourceId: x.id,
              date: m.targetDate,
              reviewTrigger: false
            }))
          ])
          .filter((x) => x.date),
        ...acceptances
          .filter((x) => x.reviewDate)
          .map((x) => ({
            kind: 'acceptance-review',
            sourceId: x.id,
            date: x.reviewDate,
            reviewTrigger: true
          })),
        ...outgoing
          .get(s.id)
          .filter((d) => d.externalAssessment?.validUntil)
          .map((d) => ({
            kind: 'attestation-expiry',
            sourceId: d.id,
            date: d.externalAssessment.validUntil,
            reviewTrigger: true
          })),
        ...[...usedIds]
          .filter((id) => evidence.get(id).validUntil)
          .map((id) => ({
            kind: 'evidence-expiry',
            sourceId: id,
            date: evidence.get(id).validUntil,
            reviewTrigger: true
          })),
        ...(legacy || (risk.status === 'complete' && risk.redRated)
          ? [
              {
                kind: 'immediate-review',
                sourceId: s.id,
                date,
                reviewTrigger: true
              }
            ]
          : [])
      ].sort(
        (a, b) => compare(a.date, b.date) || compare(a.sourceId, b.sourceId)
      ),
      gaps: gaps.get(s.id),
      dependencyPaths: ps,
      risk,
      proposedReviewDate: events[0],
      actionPlanCompleteness,
      managementGaps
    });
    results.counts[outcome]++;
    results.counts[completeness]++;
    if (provisional) results.counts.provisional++;
    results.counts[
      actionPlanCompleteness === 'complete'
        ? 'actionPlanComplete'
        : 'actionPlanIncomplete'
    ]++;
  }
  results.riskOrdering = results.systems
    .filter((s) => s.risk.status === 'complete')
    .sort(
      (a, b) => b.risk.risk - a.risk.risk || compare(a.systemId, b.systemId)
    )
    .map((s) => s.systemId);
  a.results = results;
  validate(results, loadSchema().properties.results, '$.results');
  if (Buffer.byteLength(JSON.stringify(a, null, 2)) > LIMITS.bytes)
    fail('Enriched assessment exceeds output byte limit; narrow its scope');
  if (input.results && canonical(input.results) !== canonical(results))
    fail(
      'Supplied results disagree with current draft calculations; regenerate draft outputs from assessor input and obtain fresh approval; do not edit calculated output'
    );
  return a;
}

/** Independent diagnostics: structural prerequisites first, then references and evidence uses. */
export function lint(input) {
  jsonTree(input);
  checkFrameworkAssets();
  const diagnostics = [];
  const add = (code, path, ids, message, fix, severity = 'error') => {
    if (diagnostics.length >= 1000)
      fail('Diagnostic limit exceeded; narrow assessment scope');
    diagnostics.push({ code, severity, path, ids, message, fix });
  };
  function walk(v, rule, path, ids = []) {
    if (rule.$ref) rule = loadSchema().$defs[rule.$ref.slice(8)];
    const simple = { ...rule };
    delete simple.properties;
    delete simple.items;
    delete simple.required;
    delete simple.additionalProperties;
    if (Array.isArray(v)) simple.items = {};
    try {
      validate(v, simple, path);
    } catch (e) {
      add('LA-SHAPE', path, ids, e.message, 'Use the documented schema shape.');
      return;
    }
    if (v === null) return;
    if (Array.isArray(v)) {
      if (rule.items)
        v.forEach((x, i) =>
          walk(x, rule.items, `${path}[${i}]`, x?.id ? [x.id] : ids)
        );
      return;
    }
    if (typeof v === 'object') {
      for (const key of rule.required ?? [])
        if (!Object.hasOwn(v, key))
          add(
            'LA-REQUIRED',
            `${path}.${key}`,
            ids,
            'Required field missing',
            'Supply the field; use null only where permitted.'
          );
      for (const [key, value] of Object.entries(v)) {
        if (rule.properties?.[key])
          walk(
            value,
            rule.properties[key],
            `${path}.${key}`,
            v.id ? [v.id] : ids
          );
        else if (rule.additionalProperties === false)
          add(
            'LA-FIELD',
            `${path}.${key}`,
            ids,
            'Unknown field',
            'Remove the field or use a documented field.'
          );
      }
    }
  }
  walk(input, loadSchema(), '$');
  if (diagnostics.length) return diagnostics;
  const ids = new Set(),
    evidence = new Map(input.evidence.map((e) => [e.id, e]));
  for (const [key, items] of Object.entries(input))
    if (Array.isArray(items))
      items.forEach((item, i) => {
        if (item.id) {
          if (ids.has(item.id))
            add(
              'LA-DUPLICATE',
              `$.${key}[${i}].id`,
              [item.id],
              'Duplicate ID',
              'Assign a unique stable ID.'
            );
          ids.add(item.id);
        }
      });
  const uses = (
    values,
    subjects,
    component,
    path,
    id,
    at = input.metadata.assessmentDate,
    required = true
  ) => {
    let accepted = 0;
    values.forEach((ref) => {
      if (!evidence.has(ref)) return;
      const reasons = evidenceReasons(
        evidence.get(ref),
        at,
        subjects,
        component
      );
      if (!reasons.length) accepted++;
      else
        add(
          'LA-EVIDENCE',
          path,
          [id, ref],
          reasons.join(', '),
          'Supply applicable dated operational/documentary evidence; do not edit facts merely to pass validation.',
          reasons.some((r) => r.endsWith('-scope'))
            ? 'error'
            : required
              ? 'warning'
              : 'info'
        );
    });
    if (required && !accepted)
      add(
        'LA-SUPPORT',
        path,
        [id],
        'No qualifying evidence',
        'Supply qualifying evidence or record the outcome/input as unknown.'
      );
  };
  const registries = {
    evidenceIds: new Set(input.evidence.map((x) => x.id)),
    approvalEvidenceIds: new Set(input.evidence.map((x) => x.id)),
    completionEvidenceIds: new Set(input.evidence.map((x) => x.id)),
    findingIds: new Set(input.findings.map((x) => x.id)),
    dependencyActionIds: new Set(input.actions.map((x) => x.id))
  };
  const scan = (v, path, owner) => {
    if (!v || typeof v !== 'object') return;
    if (Array.isArray(v)) {
      v.forEach((x, i) => scan(x, `${path}[${i}]`, owner));
      return;
    }
    owner = v.id ?? owner;
    for (const [key, value] of Object.entries(v)) {
      if (registries[key] && Array.isArray(value)) {
        const seen = new Set();
        for (const ref of value) {
          if (!registries[key].has(ref))
            add(
              'LA-REFERENCE',
              `${path}.${key}`,
              [owner, ref].filter(Boolean),
              'Broken reference',
              'Reference an existing record ID.'
            );
          if (seen.has(ref))
            add(
              'LA-DUPLICATE',
              `${path}.${key}`,
              [owner, ref].filter(Boolean),
              'Duplicate reference',
              'List each reference once.'
            );
          seen.add(ref);
        }
      } else scan(value, `${path}.${key}`, owner);
    }
  };
  scan(input, '$', null);
  input.findings.forEach((f, i) => {
    uses(
      f.evidenceIds,
      [
        f.systemId,
        ...input.dependencies
          .filter((d) => d.consumerId === f.systemId)
          .map((d) => d.dependencyId)
      ],
      f.componentId,
      `$.findings[${i}].evidenceIds`,
      f.id,
      undefined,
      f.outcome !== 'Unknown'
    );
    if (f.thresholdId && !input.policies.some((p) => p.id === f.thresholdId))
      add(
        'LA-REFERENCE',
        `$.findings[${i}].thresholdId`,
        [f.id, f.thresholdId],
        'Broken threshold reference',
        'Reference an applicable policy ID.'
      );
  });
  input.riskInputs.forEach((r, i) =>
    r.inputs.forEach((v, j) =>
      uses(
        v.evidenceIds,
        [r.systemId],
        null,
        `$.riskInputs[${i}].inputs[${j}]`,
        `${r.systemId}/${v.criterionId}`,
        undefined,
        v.value !== null
      )
    )
  );
  input.dependencies.forEach((d, i) => {
    uses(
      d.evidenceIds,
      [d.consumerId, d.dependencyId].filter(Boolean),
      null,
      `$.dependencies[${i}]`,
      d.id,
      undefined,
      d.qualification !== 'unknown'
    );
    if (d.externalAssessment)
      uses(
        d.externalAssessment.evidenceIds,
        [],
        null,
        `$.dependencies[${i}].externalAssessment`,
        d.id,
        d.externalAssessment.assessmentDate ?? input.metadata.assessmentDate,
        d.externalAssessment.outcome !== 'Unknown'
      );
  });
  if (!diagnostics.some((d) => d.severity === 'error')) {
    try {
      assess(input);
    } catch (e) {
      add(
        'LA-CONSISTENCY',
        '$',
        [],
        e.message,
        'Resolve this consistency error and rerun lint. Dependent graph checks require valid prerequisites.'
      );
    }
  }
  return diagnostics;
}

const rangePrecision = (relativeWidth) => {
  const percent =
    Math.round(Math.max(0, Math.min(100, 100 * (1 - relativeWidth))) * 1e8) /
    1e8;
  return {
    percent,
    label: percent >= 80 ? 'high' : percent >= 50 ? 'medium' : 'low'
  };
};
const headlinePrecision = (risk) =>
  risk.status === 'complete'
    ? rangePrecision(0)
    : risk.status === 'incomplete'
      ? rangePrecision(
          Math.max(
            (risk.bounds.likelihoodMaximum - risk.bounds.likelihoodMinimum) / 5,
            (risk.bounds.impactMaximum - risk.bounds.impactMinimum) / 4
          )
        )
      : null;

/** ArcKit local plotting convention, not a government numerical classification. */
export function componentMeasure(measurements = [], context = null) {
  jsonTree(measurements);
  validate(
    measurements,
    loadSchema().$defs.system.properties.components.items.properties
      .measurements,
    '$.component.measurements'
  );
  const ids = new Set(),
    normalized = [];
  for (const m of measurements) {
    if (ids.has(m.criterionId))
      fail(`Duplicate component measurement: ${m.criterionId}`);
    ids.add(m.criterionId);
    if (
      m.lower > m.upper ||
      (m.estimate !== null && (m.estimate < m.lower || m.estimate > m.upper))
    )
      fail(`Measurement ${m.criterionId}: expected lower <= estimate <= upper`);
    const sign = m.calibration.direction === 'higher-is-worse' ? 1 : -1;
    const b = sign * m.calibration.baseline,
      w = sign * m.calibration.actionRequired,
      l = sign * m.calibration.legacy;
    if (!(b < w && w < l) || !Number.isFinite(w - b) || !Number.isFinite(l - w))
      fail(
        `Measurement ${m.criterionId}: calibration anchors must progress from baseline through action-required to legacy`
      );
    const convert = (value) => {
      const v = sign * value;
      return v <= b
        ? 0
        : v < w
          ? (v - b) / (w - b)
          : v < l
            ? 1 + (v - w) / (l - w)
            : Math.min(3, 2 + (v - l) / (l - w));
    };
    if (context) {
      if (new Set(m.evidenceIds).size !== m.evidenceIds.length)
        fail(`Measurement ${m.criterionId}: duplicate evidence`);
      const support = m.evidenceIds.map((id) => {
        const e = context.evidence.get(id);
        if (!e) fail(`Measurement ${m.criterionId}: broken evidence ${id}`);
        const reasons = evidenceReasons(
          e,
          context.date,
          [context.systemId],
          context.componentId
        );
        if (reasons.some((r) => r.endsWith('-scope')))
          fail(
            `Measurement ${m.criterionId}: evidence ${id} outside component scope`
          );
        return reasons.length === 0;
      });
      if (m.basis === 'measured' && !support.some(Boolean))
        fail(
          `Measurement ${m.criterionId}: measured values require current scoped evidence`
        );
    }
    normalized.push({
      criterionId: m.criterionId,
      lower: Math.min(convert(m.lower), convert(m.upper)),
      estimate: m.estimate === null ? null : convert(m.estimate),
      upper: Math.max(convert(m.lower), convert(m.upper)),
      basis: m.basis
    });
  }
  const missing = CRITERIA.filter((id) => !ids.has(id));
  const minimum = Math.max(0, ...normalized.map((m) => m.lower));
  const maximum = missing.length
    ? 3
    : Math.max(0, ...normalized.map((m) => m.upper));
  const position =
    missing.length || normalized.some((m) => m.estimate === null)
      ? null
      : Math.max(...normalized.map((m) => m.estimate));
  const confidencePercent =
    Math.round(
      Math.max(0, Math.min(100, 100 * (1 - (maximum - minimum) / 3))) * 1e8
    ) / 1e8;
  return {
    method: 'arckit-component-index-1',
    position,
    minimum,
    maximum,
    confidencePercent,
    confidence: measurements.length
      ? confidencePercent >= 80
        ? 'high'
        : confidencePercent >= 50
          ? 'medium'
          : 'low'
      : null,
    measurementCoverage: measurements.length,
    estimatedInputCount: normalized.filter((m) => m.basis === 'estimated')
      .length,
    missingCriteria: missing,
    indicators: normalized
  };
}

const OUTCOMES = ['Accepted', 'Action-Required', 'Legacy'];
/** Component classifications require component-scoped findings, never a system-wide inference. */
function deriveComponents(system, findings, policies, evidence, date) {
  return system.components.map((component) => {
    const fs = findings.filter((f) => f.componentId === component.id);
    const strongestKnown =
      [...OUTCOMES].reverse().find((o) => fs.some((f) => f.outcome === o)) ??
      null;
    const unknown = CRITERIA.some(
      (c) =>
        !fs.some((f) => f.criterionId === c) ||
        fs.some((f) => f.criterionId === c && f.outcome === 'Unknown')
    );
    const outcome =
      strongestKnown === 'Legacy'
        ? 'Legacy'
        : unknown
          ? 'Undetermined'
          : (strongestKnown ?? 'Undetermined');
    const provisional =
      outcome === 'Legacy'
        ? !fs.some(
            (f) =>
              f.outcome === 'Legacy' &&
              policies.get(f.thresholdId)?.status === 'approved'
          )
        : fs.some(
            (f) =>
              f.thresholdId &&
              policies.get(f.thresholdId)?.status !== 'approved'
          );
    const numerical = componentMeasure(component.measurements ?? [], {
      evidence,
      date,
      systemId: system.id,
      componentId: component.id
    });
    return {
      componentId: component.id,
      outcome,
      strongestKnown,
      provisional,
      completeness:
        unknown || fs.some((f) => f.completeness === 'incomplete')
          ? 'incomplete'
          : 'complete',
      findingIds: fs.map((f) => f.id),
      confidence: numerical.confidence,
      numerical
    };
  });
}

const escapeCell = (value) =>
  String(value ?? 'Unknown')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('|', '&#124;')
    .replaceAll('`', '&#96;')
    .replace(/[\r\n]/g, ' ');
const START = '<!-- legacy-results:start -->',
  END = '<!-- legacy-results:end -->';
const chartFilename = (a) => `${a.metadata.documentId}-risk.svg`;
const componentChartFilename = (a) => `${a.metadata.documentId}-components.svg`;
const hasComponents = (a) => a.systems.some((s) => s.components.length);
const wrapChartText = (text, width = 112) => {
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/u)) {
    let chars = [...word];
    if (line && [...line].length + chars.length + 1 > width) {
      lines.push(line);
      line = '';
    }
    while (chars.length > width) {
      lines.push(chars.splice(0, width).join(''));
    }
    if (chars.length) line += (line ? ' ' : '') + chars.join('');
  }
  if (line) lines.push(line);
  return lines;
};
const xml = (value) =>
  String(value)
    .replace(/[\u0000-\u001f\u007f-\u009f\ufffe\uffff]/g, ' ')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

/** Offline, passive SVG. Coordinates use unrounded verified numerical results only. */
export function renderRiskChart(input) {
  const a = assess(input),
    r = a.results;
  const left = 100,
    top = 120,
    width = 800,
    height = 400;
  const numerical = r.systems.filter((s) => s.risk.status !== 'omitted');
  const xMin = Math.max(
    1,
    Math.min(
      3,
      Math.floor(
        Math.min(
          ...numerical.map((s) =>
            s.risk.status === 'complete'
              ? s.risk.likelihood
              : s.risk.bounds.likelihoodMinimum
          ),
          6
        ) * 2
      ) /
        2 -
        0.5
    )
  );
  const yMin = Math.max(
    1,
    Math.min(
      2,
      Math.floor(
        Math.min(
          ...numerical.map((s) =>
            s.risk.status === 'complete'
              ? s.risk.impact
              : s.risk.bounds.impactMinimum
          ),
          5
        ) * 2
      ) /
        2 -
        0.5
    )
  );
  const x = (v) => left + ((v - xMin) * width) / (6 - xMin);
  const y = (v) => top + ((5 - v) * height) / (5 - yMin);
  const n = (v) => v.toFixed(3);
  const names = new Map(a.systems.map((s) => [s.id, s.name]));
  const rows = r.systems.map((s, i) => {
    const risk = s.risk;
    const annotation = a.riskInputs.find(
      (r) => r.systemId === s.systemId
    )?.chartAnnotation;
    const precision = headlinePrecision(risk);
    const confidence = precision
      ? `${precision.label} confidence (${precision.percent.toFixed(0)}% range precision)`
      : 'numerical model omitted';
    const position = annotation?.suspectedPosition;

    const details =
      risk.status === 'complete'
        ? `L=${risk.likelihood.toFixed(2)}, impact=${risk.impact.toFixed(2)}, risk=${risk.display}; ${risk.redRated ? 'RED-RATED' : 'below red-rated threshold'}`
        : risk.status === 'incomplete'
          ? `INCOMPLETE: possible L=${risk.bounds.likelihoodMinimum.toFixed(2)}–${risk.bounds.likelihoodMaximum.toFixed(2)}, impact=${risk.bounds.impactMinimum.toFixed(2)}–${risk.bounds.impactMaximum.toFixed(2)}; missing ${risk.missing.join(', ')}; ${confidence}; ${position ? `suspected L=${position.likelihood.toFixed(2)}, impact=${position.impact.toFixed(2)} (judgement only)` : 'no suspected position supplied'}`
          : 'Numerical model omitted';
    const label = `P${i + 1}: ${names.get(s.systemId)} (${s.systemId}) | ${details}`;
    const name = names.get(s.systemId);
    const namePoints = [...name];
    const shortName =
      namePoints.length > 120
        ? `${namePoints.slice(0, 117).join('')}...`
        : name;
    const visible = `P${i + 1}: ${shortName} (${s.systemId}) | ${details}`;
    return {
      s,
      annotation,
      precision,
      id: `P${i + 1}`,
      label,
      lines: wrapChartText(visible)
    };
  });
  const groups = new Map();
  for (const row of rows) {
    if (row.s.risk.status !== 'complete') continue;
    const v = row.s.risk;
    const key = `${v.arithmetic.likelihoodNumerator}/${v.arithmetic.likelihoodDenominator}:${v.arithmetic.impactNumerator}/${v.arithmetic.impactDenominator}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  const legendHeight = rows.reduce(
    (h, row) => h + row.lines.length * 18 + 12,
    0
  );
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${Math.max(780, 740 + legendHeight)}" width="1000" height="${Math.max(780, 740 + legendHeight)}" role="img" aria-labelledby="title description" data-likelihood-min="${xMin}" data-impact-min="${yMin}">`,
    '<title id="title">Legacy Risk Assessment: likelihood versus impact</title>',
    `<desc id="description">${xml(a.metadata.documentId)}. Assessment date ${xml(a.metadata.assessmentDate)}. Published numerical prioritisation, separate from legacy classification. Red-rated means likelihood times impact at least 16. Solid boxes show complete scores or bounded one-axis ranges; ranges remain incomplete. Dotted indigo envelopes or range bars bound possible positions for incomplete inputs; not estimates or confidence intervals. Optional hollow circles are supplied assessor judgements, not completed scores. Confidence is range precision calculated from the widest normalized axis span, not a probability or statistical interval. Interior positions need not be attainable. All systems appear in the key. Coincident points are grouped without moving their coordinates.</desc>`,
    `<metadata>Input SHA-256: ${r.inputDigest}; calculation version: ${r.calculationVersion}; chart version: 5</metadata>`,
    '<rect width="100%" height="100%" fill="white"/>',
    '<g font-family="Arial, sans-serif" fill="#1e2549">',
    '<text x="100" y="38" font-size="25" font-weight="bold">Legacy Risk Assessment</text>',
    `<text x="100" y="66" font-size="15">${xml(a.metadata.documentId)} | ${xml(a.metadata.assessmentDate)}</text>`,
    '<text x="100" y="91" font-size="14">Published numerical model; separate from updated-definition classification</text>',
    `<rect x="${left}" y="${top}" width="${width}" height="${height}" fill="#f4f5f9" stroke="#a3a8b6"/>`
  ];
  // The only published overall band is red-rated (>=16). No invented Medium/High bands.
  const curve = Array.from({ length: 141 }, (_, i) => {
    const likelihood = 3.2 + (2.8 * i) / 140;
    return `${n(x(likelihood))},${n(y(16 / likelihood))}`;
  });
  lines.push(
    `<polygon points="${n(x(3.2))},${top} ${left + width},${top} ${[...curve].reverse().join(' ')}" fill="#f3e5e3"/>`
  );
  for (let tick = xMin; tick <= 6; tick += 0.5) {
    lines.push(
      `<path d="M ${x(tick)} ${top} V ${top + height}" stroke="#d9dce5"/>`,
      `<text x="${x(tick)}" y="${top + height + 25}" text-anchor="middle" font-size="15">${tick}</text>`
    );
  }
  for (let tick = yMin; tick <= 5; tick += 0.5) {
    lines.push(
      `<path d="M ${left} ${y(tick)} H ${left + width}" stroke="#d9dce5"/>`,
      `<text x="${left - 17}" y="${y(tick) + 5}" text-anchor="end" font-size="15">${tick}</text>`
    );
  }
  lines.push(
    `<polyline points="${curve.join(' ')}" fill="none" stroke="#8a3b2d" stroke-width="1.75"/>`,
    '<text x="730" y="111" font-size="14" font-weight="bold" fill="#8a3b2d">Red-rated: risk 16 or more</text>',
    `<text x="500" y="575" text-anchor="middle" font-size="15">Likelihood score (mean L + max L) / 2 — axis starts at ${xMin}</text>`,
    `<text transform="translate(35 320) rotate(-90)" text-anchor="middle" font-size="15">Impact score (mean C + max C) / 2 — axis starts at ${yMin}</text>`
  );
  // L and C depend on disjoint inputs. Their extrema give a bounding
  // envelope, not a probability distribution or an invented midpoint score.
  const uncertain = new Map();
  for (const row of rows.filter((row) => row.s.risk.status === 'incomplete')) {
    const b = row.s.risk.bounds;
    const key = [
      b.likelihoodMinimum,
      b.likelihoodMaximum,
      b.impactMinimum,
      b.impactMaximum
    ].join(':');
    if (!uncertain.has(key)) uncertain.set(key, []);
    uncertain.get(key).push(row);
  }
  for (const group of uncertain.values()) {
    const b = group[0].s.risk.bounds;
    const x1 = x(b.likelihoodMinimum),
      x2 = x(b.likelihoodMaximum);
    const y1 = y(b.impactMaximum),
      y2 = y(b.impactMinimum);
    const label =
      group.length === 1
        ? `${group[0].id}?`
        : `${group[0].id}? (+${group.length - 1})`;
    lines.push(
      `<g data-uncertain-system-ids="${xml(group.map((row) => row.s.systemId).join(' '))}"><title>${xml(group.map((row) => row.label).join('; '))}. Bounding envelope only; not every interior position is attainable.</title>`
    );
    if (x1 === x2) {
      lines.push(
        `<rect data-role="scored-range" x="${n(x1 - 8)}" y="${n(y1)}" width="16" height="${n(y2 - y1)}" rx="8" fill="#1e3a8a" fill-opacity="0.18" stroke="#1e3a8a"/><rect x="${n(x1 - 16)}" y="${n(y1 - 8)}" width="32" height="${n(y2 - y1 + 16)}" rx="6" fill="none" stroke="#1e3a8a" stroke-dasharray="4 4"/>`
      );
      lines.push(
        `<path d="M ${n(x1)} ${n(y1)} V ${n(y2)} M ${n(x1 - 5)} ${n(y1)} H ${n(x1 + 5)} M ${n(x1 - 5)} ${n(y2)} H ${n(x1 + 5)}" fill="none" stroke="#3e438e" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>`
      );
    } else if (y1 === y2) {
      lines.push(
        `<rect data-role="scored-range" x="${n(x1)}" y="${n(y1 - 8)}" width="${n(x2 - x1)}" height="16" rx="8" fill="#1e3a8a" fill-opacity="0.18" stroke="#1e3a8a"/><rect x="${n(x1 - 8)}" y="${n(y1 - 16)}" width="${n(x2 - x1 + 16)}" height="32" rx="6" fill="none" stroke="#1e3a8a" stroke-dasharray="4 4"/>`
      );
      lines.push(
        `<path d="M ${n(x1)} ${n(y1)} H ${n(x2)} M ${n(x1)} ${n(y1 - 5)} V ${n(y1 + 5)} M ${n(x2)} ${n(y1 - 5)} V ${n(y1 + 5)}" fill="none" stroke="#3e438e" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>`
      );
    } else {
      lines.push(
        `<rect x="${n(x1)}" y="${n(y1)}" width="${n(x2 - x1)}" height="${n(y2 - y1)}" rx="6" fill="#3e438e" fill-opacity="0.07" stroke="#3e438e" stroke-width="1.5" stroke-dasharray="3 4"/>`
      );
    }
    const confidence = `${group[0].precision.label} confidence (${group[0].precision.percent.toFixed(0)}% range precision)`;
    const labelX = n(Math.min(x1 + 4, left + width - 290)),
      labelY = n(Math.max(top + 16, y1 - 22));
    lines.push(
      `<text x="${labelX}" y="${labelY}" font-size="12" fill="#30367c" stroke="white" stroke-width="2" paint-order="stroke"><tspan x="${labelX}">${label} plausible range: risk ${b.minimum.toFixed(2)}–${b.maximum.toFixed(2)}</tspan><tspan x="${labelX}" dy="15">${confidence}${x1 === x2 ? '; likelihood fixed at ' + b.likelihoodMinimum.toFixed(2) : y1 === y2 ? '; impact fixed at ' + b.impactMinimum.toFixed(2) : ''}</tspan></text></g>`
    );
  }
  for (const row of rows.filter((row) => row.annotation?.suspectedPosition)) {
    const point = row.annotation.suspectedPosition,
      px = x(point.likelihood),
      py = y(point.impact);
    const right = px < left + width - 240;
    lines.push(
      `<g data-suspected-system-id="${xml(row.s.systemId)}"><title>${xml(row.label)}. Assessor judgement; see the report for rationale. Not a completed score.</title><circle cx="${n(px)}" cy="${n(py)}" r="8" fill="white" stroke="#3e438e" stroke-width="2.5"/><text x="${n(px + (right ? 15 : -15))}" y="${n(py + 5)}" text-anchor="${right ? 'start' : 'end'}" font-size="12" fill="#1e2549" stroke="white" stroke-width="2" paint-order="stroke">${row.id} suspected: risk ~${(point.likelihood * point.impact).toFixed(2)} (not scored)</text></g>`
    );
  }
  for (const group of groups.values()) {
    const v = group[0].s.risk,
      px = x(v.likelihood),
      py = y(v.impact);
    const label =
      group.length === 1
        ? group[0].id
        : `${group[0].id} (+${group.length - 1})`;
    lines.push(
      `<g data-system-ids="${xml(group.map((row) => row.s.systemId).join(' '))}"><title>${xml(group.map((row) => row.label).join('; '))}</title>`
    );
    lines.push(
      `<rect data-role="scored-inputs" x="${n(px - 6)}" y="${n(py - 6)}" width="12" height="12" fill="white" stroke="${v.redRated ? '#8a3b2d' : '#475569'}" stroke-width="2"/>`
    );
    lines.push(
      `<text x="${n(px + (px > 820 ? -12 : 12))}" y="${n(Math.max(top + 18, py - 10))}" text-anchor="${px > 820 ? 'end' : 'start'}" font-size="13" font-weight="bold" stroke="white" stroke-width="3" paint-order="stroke">${label}</text></g>`
    );
  }
  lines.push(
    '<g aria-label="Chart legend" font-size="14"><rect x="100" y="601" width="12" height="12" fill="white" stroke="#475569" stroke-width="2"/><text x="132" y="613">Solid box: scored inputs (complete score or one-axis range)</text>',
    '<rect x="100" y="626" width="20" height="12" rx="3" fill="#3e438e" fill-opacity="0.07" stroke="#3e438e" stroke-dasharray="3 4"/><text x="132" y="638">Dotted outline: plausible range; confidence is calculated from range width</text>',
    '<circle cx="110" cy="657" r="7" fill="white" stroke="#3e438e" stroke-width="2.5"/><text x="132" y="662">Circle: where the assessor suspects it sits (only when supplied)</text>',
    '<text x="100" y="687" font-size="13">Ranges are mathematical bounds, not confidence intervals. No estimated position is invented.</text></g>'
  );
  if (!groups.size && !uncertain.size)
    lines.push(
      `<text x="500" y="315" text-anchor="middle" font-size="19" font-weight="bold">${a.metadata.riskModel === 'none' ? 'Numerical risk model omitted' : 'No complete numerical scores to plot'}</text>`
    );
  let rowY = 724;
  for (const row of rows) {
    lines.push(`<g><title>${xml(row.label)}</title>`);
    for (const line of row.lines) {
      lines.push(
        `<text x="100" y="${rowY}" font-size="13">${xml(line)}</text>`
      );
      rowY += 18;
    }
    lines.push('</g>');
    rowY += 12;
  }
  lines.push('</g></svg>');
  const svg = `${lines.join('\n')}\n`;
  if (Buffer.byteLength(svg) > LIMITS.bytes)
    fail('Risk chart exceeds output byte limit; narrow its scope');
  return svg;
}

/** Pure projection of calculated component indices and numerical intervals. */
export function renderComponentChart(input) {
  const a = assess(input),
    results = a.results;
  const colours = ['#15803d', '#b45309', '#b91c1c'];
  const names = new Map(
    a.systems.flatMap((s) =>
      s.components.map((c) => [c.id, { name: c.name, system: s.id }])
    )
  );

  const rows = results.systems
    .flatMap((s) => s.componentResults)
    .sort(
      (a, b) =>
        (b.numerical.position ?? -1) - (a.numerical.position ?? -1) ||
        compare(a.componentId, b.componentId)
    );
  const left = 330,
    top = 124,
    column = 150,
    rowHeight = 42,
    bottom = top + 30 + Math.max(1, rows.length) * rowHeight;
  const position = (value) => left + value * column;
  const short = (value, n) =>
    [...String(value)].length > n
      ? [...String(value)].slice(0, n - 1).join('') + '…'
      : String(value);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1260 ${bottom + 225}" width="1260" height="${bottom + 225}" role="img" aria-labelledby="title description">`,
    '<title id="title">Component legacy assessment breakdown</title>',
    '<desc id="description">Horizontal component rows across Accepted, Action-Required and Legacy. Diamonds plot calculated central component indices; bars plot calculated lower and upper indices. Confidence is interval precision, not probability or evidence quality. The local calibration is distinct from government classification.</desc>',
    `<metadata>Input SHA-256: ${results.inputDigest}; calculation version: ${results.calculationVersion}; component chart version: 4</metadata>`,
    '<rect width="100%" height="100%" fill="white"/><g font-family="Arial, sans-serif" fill="#172b4d">',
    '<text x="30" y="38" font-size="25" font-weight="bold">Component legacy assessment</text>',
    `<text x="30" y="66" font-size="15">${xml(a.metadata.documentId)} | ${xml(a.metadata.assessmentDate)}</text>`,
    '<text x="30" y="91" font-size="14">Local calibrated component index; independent of government classification and numerical risk</text>'
  ];
  rows.forEach((_, i) => {
    if (i % 2 === 0)
      lines.push(
        `<rect x="20" y="${top + 30 + i * rowHeight}" width="1210" height="${rowHeight}" fill="#f8fafc"/>`
      );
  });
  OUTCOMES.forEach((outcome, i) => {
    lines.push(
      `<rect x="${left + i * column}" y="${top}" width="${column}" height="${bottom - top}" fill="${['#dcfce7', '#fef3c7', '#fee2e2'][i]}" stroke="#94a3b8"/>`,
      `<text x="${position(i + 0.5)}" y="${top + 18}" text-anchor="middle" font-size="13" font-weight="bold">${outcome}</text>`
    );
  });
  lines.push(
    `<text x="320" y="${top + 18}" text-anchor="end" font-size="13" font-weight="bold">Component</text>`,
    `<text x="794" y="${top + 18}" font-size="13" font-weight="bold">Confidence¹</text>`,
    `<text x="914" y="${top + 18}" font-size="13" font-weight="bold">Assessment notes</text>`
  );
  for (const [i, c] of rows.entries()) {
    const cy = top + 30 + i * rowHeight + rowHeight / 2,
      entry = names.get(c.componentId);
    const m = c.numerical,
      opacity = 0.25 + (0.75 * m.confidencePercent) / 100;
    const note = `Recorded: ${c.outcome}${c.provisional ? ' (provisional)' : ''}`;
    const px = m.position === null ? null : position(m.position),
      lo = position(m.minimum),
      hi = position(m.maximum);
    lines.push(
      `<g data-component-id="${xml(c.componentId)}"><title>${xml(entry.name)} (${xml(c.componentId)}). Actual classification ${xml(c.outcome)}. Index ${m.position === null ? 'unavailable' : m.position.toFixed(3)}, range ${m.minimum.toFixed(3)}–${m.maximum.toFixed(3)}. Local calculation, not a government score.</title>`,
      `<text x="320" y="${cy + 4}" text-anchor="end" font-size="12" font-weight="bold">${xml(short((a.systems.length > 1 ? entry.system + ' / ' : '') + entry.name, 42))}</text>`,
      `<path data-role="confidence-range" data-minimum="${m.minimum}" data-maximum="${m.maximum}" d="M ${lo} ${cy} H ${hi}" stroke="#1e3a8a" stroke-width="${m.confidencePercent >= 80 ? 6 : 9}" stroke-opacity="${opacity}" stroke-linecap="round"${m.measurementCoverage ? '' : ' stroke-dasharray="4 5"'}/>`
    );
    if (px !== null) {
      const colour = colours[Math.min(2, Math.floor(m.position))];
      lines.push(
        `<path data-marker="calculated" data-position="${m.position}" d="M ${px} ${cy - 7} L ${px + 7} ${cy} L ${px} ${cy + 7} L ${px - 7} ${cy} Z" fill="white" stroke="${colour}" stroke-width="2"/>`
      );
    }
    lines.push(
      `<text x="794" y="${cy + 4}" font-size="12">${m.confidence ? m.confidence[0].toUpperCase() + m.confidence.slice(1) : 'Unmeasured'} ${m.confidencePercent.toFixed(0)}%</text>`,
      `<text x="914" y="${cy - 9}" font-size="12">${xml(short(note, 44))}</text>`,
      `<text x="914" y="${cy + 5}" font-size="11" fill="#475569">${m.position === null ? 'No central estimate' : m.position.toFixed(2)} [${m.minimum.toFixed(2)}–${m.maximum.toFixed(2)}]</text>`,
      `<text x="914" y="${cy + 18}" font-size="10" fill="#475569">${m.measurementCoverage}/7 indicators; ${m.estimatedInputCount} estimated inputs</text></g>`
    );
  }
  for (const index of [0, 1, 2, 3])
    lines.push(
      `<path d="M ${position(index)} ${bottom} v 5" stroke="#64748b"/><text x="${position(index)}" y="${bottom + 18}" text-anchor="middle" font-size="11" fill="#475569">${index}</text>`
    );
  if (!rows.length)
    lines.push(
      `<text x="405" y="${top + 65}" font-size="14">No components inventoried</text>`
    );
  lines.push(
    `<path d="M 30 ${bottom + 45} H 90" stroke="#1e3a8a" stroke-width="6"/><text x="105" y="${bottom + 49}" font-size="12">Bar: calculated lower–upper range. Diamond: calculated central estimate, not the range midpoint.</text>`,
    `<text x="30" y="${bottom + 78}" font-size="12">¹ Confidence = range precision: 100 × (1 − interval width / 3). High ≥80%, medium ≥50%, otherwise low.</text>`,
    `<text x="30" y="${bottom + 104}" font-size="12">This is a local ArcKit plotting convention, not a probability, readiness percentage or published government score.</text>`,
    `<text x="30" y="${bottom + 130}" font-size="12">Each criterion is calibrated at baseline=0, action-required=1 and legacy=2; the strongest indicator determines the component index.</text>`,
    `<text x="30" y="${bottom + 156}" font-size="12">Missing indicators extend the upper bound to 3 and suppress the diamond. Labels retain exact bounds for narrow ranges.</text>`,
    `<text x="30" y="${bottom + 182}" font-size="12">Recorded classifications remain separate. Raw measurements, calibration and evidence references are in the report.</text>`,
    '</g></svg>'
  );
  const svg = lines.join('\n') + '\n';
  if (Buffer.byteLength(svg) > LIMITS.bytes)
    fail('Component chart exceeds output byte limit; narrow scope');
  return svg;
}

/** A reproducible report block, bound to the complete assessor input rather than copied numbers. */
export function renderResults(input) {
  const a = assess(input),
    r = a.results;
  const lines = [
    START,
    `Calculation version: ${r.calculationVersion}; input SHA-256: ${r.inputDigest}.`,
    '',
    '| System | Outcome | Strongest known | Provisional | Evidence completeness | Action plan | Proposed review |',
    '|--------|---------|-----------------|-------------|-----------------------|-------------|-----------------|'
  ];
  for (const s of r.systems)
    lines.push(
      `| ${[s.systemId, s.outcome, s.strongestKnownFinding, s.provisional, s.completeness, s.actionPlanCompleteness, s.proposedReviewDate].map(escapeCell).join(' | ')} |`
    );
  lines.push(
    '',
    `Counts: ${Object.entries(r.counts)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')}.`,
    `Evidence-use counts: qualifying=${r.evidenceUses.filter((u) => !u.reasons.length).length}; rejected=${r.evidenceUses.filter((u) => u.reasons.length).length}. Counts describe uses, not independent sources.`,
    '',
    '| System | Criterion | Effective outcome | Local policy basis | Provisional | Evidence completeness | Source findings | Dependency witnesses |',
    '|--------|-----------|-------------------|--------------------|-------------|--------------|-----------------|----------------------|'
  );
  for (const s of r.systems)
    for (const c of s.criterionResults)
      lines.push(
        `| ${[s.systemId, c.criterionId, c.outcome, c.basis, c.provisional, c.completeness, c.findingIds.join(', ') || 'None', c.dependencyPathIndexes.join(', ') || 'None'].map(escapeCell).join(' | ')} |`
      );
  lines.push(
    '',
    'Published numerical prioritisation (separate from classification):',
    '',
    '| System | Status | Likelihood | Impact | Risk | Red-rated | Exact fractions / missing inputs |',
    '|--------|--------|------------|--------|------|-----------|-------------------------------------|'
  );
  for (const s of r.systems) {
    const v = s.risk;
    lines.push(
      `| ${[s.systemId, v.status, v.likelihood, v.impact, v.display, v.redRated, v.status === 'complete' ? `L=${v.arithmetic.likelihoodNumerator}/${v.arithmetic.likelihoodDenominator}; C=${v.arithmetic.impactNumerator}/${v.arithmetic.impactDenominator}; risk=${v.arithmetic.riskNumerator}/${v.arithmetic.riskDenominator}` : (v.missing ?? []).join(', ') || 'Omitted'].map(escapeCell).join(' | ')} |`
    );
  }
  if (a.metadata.riskModel !== 'none') {
    lines.push(
      '',
      `![Legacy numerical risk chart: likelihood 1–6 versus impact 1–5; red-rated at 16. Solid boxes show scored points or one-axis ranges; dotted outlines show plausible ranges; hollow circles are supplied assessor judgement. System key in SVG.](${chartFilename(a)})`,
      '',
      '| System | Risk criterion | Supplied score | Evidence | Rationale |',
      '|--------|----------------|----------------|----------|-----------|'
    );
    for (const s of r.systems) {
      const inputs =
        a.riskInputs.find((x) => x.systemId === s.systemId)?.inputs ?? [];
      for (const id of [
        ...Array.from({ length: 7 }, (_, i) => `L${i + 1}`),
        ...Array.from({ length: 6 }, (_, i) => `C${i + 1}`)
      ]) {
        const i = inputs.find((x) => x.criterionId === id);
        lines.push(
          `| ${[s.systemId, id, i?.value, i?.evidenceIds.join(', ') || 'None', i?.rationale].map(escapeCell).join(' | ')} |`
        );
      }
    }
  }
  lines.push(
    '',
    `Numerical ordering: ${r.riskOrdering.join(', ') || 'None'}.`,
    ''
  );
  if (hasComponents(a))
    lines.push(
      '### Component classification breakdown',
      '',
      `![Component breakdown across Accepted, Action-Required and Legacy; confidence and suspected outcomes are labelled separately.](${componentChartFilename(a)})`,
      ''
    );
  lines.push(
    'Legend: Outcome is classification; Unknown is an undecided criterion; Undetermined is an undecided system. Provisional means material policy/attestation approval is pending. Evidence gaps, plan gaps and incomplete numerical scores are independent.',
    ''
  );
  const table = (title, headings, rows) => {
    lines.push(
      `### ${title}`,
      '',
      `| ${headings.join(' | ')} |`,
      `| ${headings.map(() => '---').join(' | ')} |`
    );
    for (const row of rows)
      lines.push(`| ${row.map(escapeCell).join(' | ')} |`);
    lines.push('');
  };
  table(
    'Inventory',
    [
      'System / component',
      'Name / version',
      'Boundary / services',
      'Business owner',
      'Delivery owner'
    ],
    a.systems.flatMap((s) => [
      [
        s.id,
        s.name,
        `${s.boundary}; services: ${s.services.join(', ') || 'None recorded'}`,
        s.businessRiskOwner,
        s.deliveryOwner
      ],
      ...s.components.map((c) => [
        c.id,
        `${c.name} / ${c.version ?? 'Not recorded'}`,
        `Component of ${s.id}`,
        s.businessRiskOwner,
        s.deliveryOwner
      ])
    ])
  );
  table(
    'Threshold policy register',
    [
      'Rule',
      'Criterion',
      'Source / owner / version',
      'Applicability',
      'Unacceptable / warning conditions',
      'Approval references'
    ],
    a.policies.map((p) => [
      p.id,
      p.criterionId,
      [p.source, p.owner, p.version]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      p.systemIds.join(', ') || 'Project scope',
      [p.unacceptableCondition, p.warningCondition]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      p.approvalEvidenceIds.join(', ')
    ])
  );
  table(
    'Dependency register',
    [
      'Dependency',
      'Consumer / dependency',
      'Qualification / policy',
      'Evidence / external assessment'
    ],
    a.dependencies.map((d) => [
      d.id,
      [d.consumerId, d.dependencyId]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [d.qualification, d.thresholdId, d.rationale]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [d.evidenceIds.join(', '), JSON.stringify(d.externalAssessment)].join(
        ' / '
      )
    ])
  );
  table(
    'Finding register',
    [
      'Finding / system / component',
      'Criterion / rule',
      'Recorded outcome',
      'Evidence',
      'Rationale / forecast / conflicts'
    ],
    a.findings.map((f) => [
      [f.id, f.systemId, f.componentId]
        .filter(Boolean)
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [f.criterionId, f.thresholdId]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      f.outcome,
      f.evidenceIds.join(', '),
      [f.rationale, f.forecastBreachDate, ...f.contradictions]
        .filter(Boolean)
        .join('; ')
    ])
  );
  table(
    'Action register',
    [
      'Action / targets',
      'Accountable / delivery owners',
      'Containment / remediation',
      'Priority / funding / cost',
      'Milestones / target / review',
      'Closure evidence / trigger'
    ],
    a.actions.map((x) => [
      [
        x.id,
        ...x.findingIds,
        ...(x.addresses ?? []).map(
          (t) => `${t.kind}:${t.systemId}:${t.id ?? t.criterionId}`
        )
      ].join('; '),
      [x.businessRiskOwner, x.deliveryOwner]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [x.containment, x.remediation]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [x.priority, x.fundingStatus, x.cost, x.currency]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [JSON.stringify(x.milestones), x.targetDate, x.nextReviewDate].join(
        ' / '
      ),
      [
        x.closureEvidenceRequired,
        ...x.completionEvidenceIds,
        x.reassessmentTrigger,
        'Action dependencies: ' + x.dependencyActionIds.join(', ')
      ].join('; ')
    ])
  );
  table(
    'Known findings and blockers',
    ['System', 'Criterion', 'Strongest known', 'Blockers'],
    r.systems.flatMap((s) =>
      s.criterionResults.map((c) => [
        s.systemId,
        c.criterionId,
        c.strongestKnown,
        c.blockers.join(', ') || 'None'
      ])
    )
  );
  table(
    'Approval ledger',
    ['Target', 'Status', 'Content digest'],
    r.approvals.map((x) => [x.target, x.status, x.digest])
  );
  table(
    'Numerical bounds — not completed scores',
    [
      'System',
      'Minimum / maximum',
      'Threshold sensitivity',
      'Single missing input'
    ],
    r.systems
      .filter((s) => s.risk.status === 'incomplete')
      .map((s) => [
        s.systemId,
        `${s.risk.bounds.minimumNumerator}/168 to ${s.risk.bounds.maximumNumerator}/168`,
        s.risk.thresholdAssessment,
        s.risk.tipping
          ? `${s.risk.tipping.criterionId}: red threshold from ${s.risk.tipping.lowestRedValue}`
          : 'No single crossing value'
      ])
  );
  table(
    'Chart notes — calculated precision and supplied position',
    [
      'System',
      'Range confidence',
      'Suspected position (not scored)',
      'Rationale'
    ],
    a.riskInputs
      .filter((r) => r.chartAnnotation)
      .map((r) => [
        r.systemId,
        headlinePrecision(
          a.results.systems.find((s) => s.systemId === r.systemId).risk
        ).percent.toFixed(2) + '% calculated range precision',
        r.chartAnnotation.suspectedPosition
          ? `L=${r.chartAnnotation.suspectedPosition.likelihood}; impact=${r.chartAnnotation.suspectedPosition.impact}`
          : 'Not supplied',
        r.chartAnnotation.rationale
      ])
  );
  table(
    'Component assessment',
    [
      'System / component',
      'Recorded outcome / evidence completeness',
      'Calculated position [lower–upper]',
      'Confidence (range precision)',
      'Numerical coverage / estimates',
      'Finding IDs'
    ],
    r.systems.flatMap((s) =>
      s.componentResults.map((c) => [
        s.systemId + ' / ' + c.componentId,
        [c.outcome, c.completeness, c.provisional ? 'provisional' : '']
          .filter(Boolean)
          .join(' / '),
        `${c.numerical.position ?? 'Unavailable'} [${c.numerical.minimum}–${c.numerical.maximum}]`,
        `${c.confidence ?? 'Unmeasured'}; ${c.numerical.confidencePercent.toFixed(2)}%`,
        `${c.numerical.measurementCoverage}/7; ${c.numerical.estimatedInputCount} estimated`,
        c.findingIds.join(', ')
      ])
    )
  );
  const measurementRows = [];
  for (const system of a.systems)
    for (const component of system.components)
      for (const m of component.measurements ?? [])
        measurementRows.push([
          component.id + ' / ' + m.criterionId,
          [m.lower, m.estimate, m.upper]
            .map((v) => v ?? 'Not recorded')
            .join(' / '),
          [
            m.calibration.unit,
            m.calibration.baseline,
            m.calibration.actionRequired,
            m.calibration.legacy,
            m.calibration.direction
          ].join(' / '),
          m.basis + ' / ' + m.evidenceIds.join(', '),
          m.rationale
        ]);
  table(
    'Component numerical inputs',
    [
      'Component / criterion',
      'Raw lower / central / upper',
      'Unit / calibration (baseline, action, legacy)',
      'Basis / evidence',
      'Rationale'
    ],
    measurementRows
  );
  table(
    'Dated events',
    ['System', 'Date', 'Kind', 'Source', 'Review trigger'],
    r.systems.flatMap((s) =>
      s.events.map((e) => [
        s.systemId,
        e.date,
        e.kind,
        e.sourceId,
        e.reviewTrigger
      ])
    )
  );
  lines.push(
    '<details>',
    '<summary>Evidence register and per-use qualification (assessor assertions, not verified truth)</summary>',
    ''
  );
  table(
    'Evidence register',
    [
      'ID / subject',
      'Source / locator',
      'Date / provenance / expiry',
      'Observation / limitations'
    ],
    a.evidence.map((e) => [
      [e.id, e.systemId, e.componentId]
        .filter(Boolean)
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [e.source, e.locator].map((v) => v ?? 'Not recorded').join(' / '),
      [e.date, e.provenance, e.validUntil]
        .map((v) => v ?? 'Not recorded')
        .join(' / '),
      [e.observation, ...e.limitations].join('; ')
    ])
  );
  table(
    'Evidence uses',
    ['Evidence', 'Use', 'Evaluation date', 'Rejected reasons'],
    r.evidenceUses.map((u) => [
      u.evidenceId,
      u.use,
      u.at,
      u.reasons.join(', ') || 'Qualifies for this use'
    ])
  );
  lines.push('</details>', '');

  for (const s of r.systems) {
    lines.push(
      `System ${escapeCell(s.systemId)} evidence gaps: ${s.gaps.map(escapeCell).join('; ') || 'None recorded'}.`,
      `System ${escapeCell(s.systemId)} management gaps: ${s.managementGaps.map(escapeCell).join('; ') || 'None recorded'}.`
    );
    s.dependencyPaths.forEach((p, i) =>
      lines.push(
        `Witness ${escapeCell(s.systemId)}[${i}]: ${p.systemPath.map(escapeCell).join(' → ')}; origin ${escapeCell(p.originFindingId ?? 'external attestation')}; edges ${p.dependencyPath.map(escapeCell).join(', ') || 'None'}; provisional ${p.provisional}.`
      )
    );
  }
  const block = `${lines.join('\n')}\n${END}\n`;
  if (Buffer.byteLength(block) > LIMITS.bytes)
    fail('Generated report exceeds output byte limit; narrow assessment scope');
  return block;
}
export function verifyReport(input, markdown) {
  const verified = assess(input),
    expected = renderResults(verified),
    normalized = markdown.replaceAll('\r\n', '\n');
  if (
    normalized.split(START).length !== 2 ||
    normalized.split(END).length !== 2
  )
    fail('Report must contain exactly one generated results block');
  const start = normalized.indexOf(START),
    end = normalized.indexOf(END) + END.length;
  if (`${normalized.slice(start, end)}\n` !== expected)
    fail('Report results block disagrees with verified assessment');
  const control = normalized.match(
    /^## Document Control[ \t]*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m
  )?.[1];
  if (control) {
    const cell = (field) =>
      control
        .split('\n')
        .filter((line) => line.startsWith('|'))
        .map((line) =>
          line
            .split('|')
            .slice(1, -1)
            .map((v) => v.trim().replaceAll('**', '').replaceAll('`', ''))
        )
        .find((row) => row[0] === field)?.[1];
    const id = cell('Document ID'),
      version = cell('Version'),
      status = cell('Status'),
      approvedBy = cell('Approved By');
    if (id && id !== input.metadata.documentId)
      fail('Report Document Control ID disagrees with assessment');
    if (
      version &&
      version.replace(/^v/, '') !== input.metadata.documentId.split('-v').at(-1)
    )
      fail('Report Document Control version disagrees with assessment');
    const claimsApproval =
      status && ['APPROVED', 'PUBLISHED'].includes(status.toUpperCase());
    const namesApprover =
      approvedBy &&
      !/^(pending|unknown|not (yet )?approved|not recorded|n\/a|[-—])(?:\b|$)/i.test(
        approvedBy
      );
    if (
      !verified.results.approvals.some(
        (x) => x.target === 'assessment' && x.status === 'verified'
      ) &&
      (claimsApproval || namesApprover)
    )
      fail(
        'Report claims assessment approval without matching documentary evidence'
      );
    if (namesApprover) {
      const documented = input.evidence
        .filter((e) => input.metadata.approvalEvidenceIds.includes(e.id))
        .flatMap((e) =>
          (e.approvalFor ?? [])
            .filter(
              (t) =>
                t.kind === 'assessment' && t.id === input.metadata.documentId
            )
            .map((t) => t.approvedBy)
        );
      if (
        !documented.includes(approvedBy) &&
        approvedBy !== [...new Set(documented)].sort(compare).join(', ')
      )
        fail('Report approver does not match documentary approval');
    }
  }
  return true;
}
function readBounded(path) {
  let fd;
  try {
    fd = openSync(path, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0));
    const stat = fstatSync(fd);
    if (!stat.isFile()) throw new AssetError('Input must be a regular file');
    if (stat.size > LIMITS.bytes) fail('Input exceeds byte limit');
    const chunks = [];
    let total = 0;
    for (;;) {
      const buffer = Buffer.alloc(Math.min(65536, LIMITS.bytes + 1 - total));
      const n = readSync(fd, buffer, 0, buffer.length, null);
      if (!n) break;
      total += n;
      if (total > LIMITS.bytes) fail('Input exceeds byte limit');
      chunks.push(buffer.subarray(0, n));
    }
    try {
      return new TextDecoder('utf-8', { fatal: true }).decode(
        Buffer.concat(chunks)
      );
    } catch {
      fail('Invalid UTF-8 input');
    }
  } catch (error) {
    if (error.code) throw new AssetError(`Cannot read input: ${error.code}`);
    throw error;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}
const USAGE =
  'Usage: node legacy-assessment.mjs --input assessment.json (--json | --markdown | --svg | --headline-svg | --components-svg | --check-report report.md | --lint [--format text|json] | --explain ID | --approval-digest assessment|policy:ID|risk-acceptance:ID)\n';
function main(args) {
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write(USAGE);
    return 0;
  }
  let input,
    mode,
    report,
    format = 'text',
    target;
  for (let i = 0; i < args.length; i++) {
    if (
      args[i] === '--input' &&
      !input &&
      args[i + 1] &&
      !args[i + 1].startsWith('--')
    )
      input = args[++i];
    else if (
      [
        '--json',
        '--markdown',
        '--svg',
        '--headline-svg',
        '--components-svg',
        '--lint'
      ].includes(args[i]) &&
      !mode
    )
      mode = args[i];
    else if (args[i] === '--format' && ['text', 'json'].includes(args[i + 1]))
      format = args[++i];
    else if (
      ['--explain', '--approval-digest'].includes(args[i]) &&
      !mode &&
      args[i + 1] &&
      !args[i + 1].startsWith('--')
    ) {
      mode = args[i];
      target = args[++i];
    } else if (
      args[i] === '--check-report' &&
      !mode &&
      args[i + 1] &&
      !args[i + 1].startsWith('--')
    ) {
      mode = args[i];
      report = args[++i];
    } else {
      process.stderr.write(USAGE);
      return 2;
    }
  }
  if (!input || !mode || (format !== 'text' && mode !== '--lint')) {
    process.stderr.write(USAGE);
    return 2;
  }
  try {
    const parsed = parseAssessment(readBounded(input));
    if (mode === '--lint') {
      const ds = lint(parsed);
      process.stdout.write(
        format === 'json'
          ? JSON.stringify(ds, null, 2) + '\n'
          : ds
              .map(
                (d) =>
                  `${d.severity} ${d.code} ${d.path} [${d.ids.join(', ')}]: ${d.message}; ${d.fix}`
              )
              .join('\n') + '\n'
      );
      return ds.some((d) => d.severity === 'error') ? 1 : 0;
    }
    if (mode === '--approval-digest') {
      validate(parsed, loadSchema());
      process.stdout.write(approvalDigest(parsed, target) + '\n');
      return 0;
    }
    const a = assess(parsed);
    if (mode === '--explain') {
      const record =
        a.results.systems.find((s) => s.systemId === target) ??
        a.findings.find((x) => x.id === target) ??
        a.dependencies.find((x) => x.id === target) ??
        a.actions.find((x) => x.id === target);
      if (!record) fail('Unknown explain ID');
      const related = new Set([target]);
      if (record.systemId === target) {
        for (const f of a.findings.filter((x) => x.systemId === target))
          related.add(f.id);
        for (const d of a.dependencies.filter((x) => x.consumerId === target))
          related.add(d.id);
        for (const x of a.actions.filter(
          (x) =>
            x.findingIds.some((id) => related.has(id)) ||
            (x.addresses ?? []).some((t) => t.systemId === target)
        ))
          related.add(x.id);
      }
      const uses = a.results.evidenceUses.filter((u) =>
        related.has((u.use.split(' ')[1] ?? '').split('/')[0])
      );
      process.stdout.write(
        JSON.stringify({ record, evidenceUses: uses }, null, 2) + '\n'
      );
      return 0;
    }
    if (
      basename(input).startsWith('ARC-') &&
      basename(input) !== `${a.metadata.documentId}.json`
    )
      fail('Assessment filename disagrees with document ID');
    if (
      report &&
      basename(report).startsWith('ARC-') &&
      basename(report) !== `${a.metadata.documentId}.md`
    )
      fail('Report filename disagrees with document ID');
    if (mode === '--check-report') {
      if (
        hasComponents(a) &&
        readBounded(
          join(dirname(report), componentChartFilename(a))
        ).replaceAll('\r\n', '\n') !== renderComponentChart(a)
      )
        fail('Report component chart disagrees with verified assessment');
      verifyReport(a, readBounded(report));
      if (
        a.metadata.riskModel !== 'none' &&
        readBounded(join(dirname(report), chartFilename(a))).replaceAll(
          '\r\n',
          '\n'
        ) !== renderRiskChart(a)
      )
        fail('Report risk chart disagrees with verified assessment');
      process.stdout.write(
        'Calculated report block and applicable SVG companions verified; evidence truth and narrative are not verified\n'
      );
    } else
      process.stdout.write(
        mode === '--json'
          ? `${JSON.stringify(a, null, 2)}\n`
          : ['--svg', '--headline-svg'].includes(mode)
            ? renderRiskChart(a)
            : mode === '--components-svg'
              ? renderComponentChart(a)
              : renderResults(a)
      );
    return 0;
  } catch (error) {
    process.stderr.write(
      `${error instanceof AssetError ? 'Runtime failure' : 'Invalid assessment'}: ${String(
        error.message
      )
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
        .slice(0, 1600)}\n`
    );
    return error instanceof AssetError ? 2 : 1;
  }
}
if (process.argv[1]) {
  let direct = false;
  try {
    direct =
      realpathSync(process.argv[1]) ===
      realpathSync(fileURLToPath(import.meta.url));
  } catch {
    /* Imported from a virtual runner, not the CLI. */
  }
  if (direct) process.exitCode = main(process.argv.slice(2));
}
