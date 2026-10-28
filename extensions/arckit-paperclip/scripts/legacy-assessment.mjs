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
  const x = (v) => left + ((v - 1) * width) / 5;
  const y = (v) => top + ((5 - v) * height) / 4;
  const n = (v) => v.toFixed(3);
  const names = new Map(a.systems.map((s) => [s.id, s.name]));
  const rows = r.systems.map((s, i) => {
    const risk = s.risk;
    const details =
      risk.status === 'complete'
        ? `L=${risk.likelihood.toFixed(2)}, impact=${risk.impact.toFixed(2)}, risk=${risk.display}; ${risk.redRated ? 'RED-RATED' : 'below red-rated threshold'}`
        : `NOT PLOTTED: ${risk.status}${risk.missing?.length ? `; missing ${risk.missing.join(', ')}` : ''}`;
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
      id: `P${i + 1}`,
      label,
      lines: visible.match(/[\s\S]{1,112}/gu) ?? []
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
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${730 + legendHeight}" width="1000" height="${730 + legendHeight}" role="img" aria-labelledby="title description">`,
    '<title id="title">Legacy Risk Assessment: likelihood versus impact</title>',
    `<desc id="description">${xml(a.metadata.documentId)}. Assessment date ${xml(a.metadata.assessmentDate)}. Published numerical prioritisation, separate from legacy classification. Red-rated means likelihood times impact at least 16. Only complete scores are plotted; all systems appear in the key. Coincident points are grouped without moving their coordinates.</desc>`,
    `<metadata>Input SHA-256: ${r.inputDigest}; calculation version: ${r.calculationVersion}; chart version: 1</metadata>`,
    '<rect width="100%" height="100%" fill="white"/>',
    '<g font-family="Arial, sans-serif" fill="#172b4d">',
    '<text x="100" y="38" font-size="25" font-weight="bold">Legacy Risk Assessment</text>',
    `<text x="100" y="66" font-size="15">${xml(a.metadata.documentId)} | ${xml(a.metadata.assessmentDate)}</text>`,
    '<text x="100" y="91" font-size="14">Published numerical model; separate from updated-definition classification</text>',
    `<rect x="${left}" y="${top}" width="${width}" height="${height}" fill="#f1f5f9" stroke="#475569"/>`
  ];
  // The only published overall band is red-rated (>=16). No invented Medium/High bands.
  const curve = Array.from({ length: 141 }, (_, i) => {
    const likelihood = 3.2 + (2.8 * i) / 140;
    return `${n(x(likelihood))},${n(y(16 / likelihood))}`;
  });
  lines.push(
    `<polygon points="${n(x(3.2))},${top} ${left + width},${top} ${[...curve].reverse().join(' ')}" fill="#fee2e2"/>`
  );
  for (let tick = 1; tick <= 6; tick++) {
    lines.push(
      `<path d="M ${x(tick)} ${top} V ${top + height}" stroke="#cbd5e1"/>`,
      `<text x="${x(tick)}" y="${top + height + 25}" text-anchor="middle" font-size="15">${tick}</text>`
    );
  }
  for (let tick = 1; tick <= 5; tick++) {
    lines.push(
      `<path d="M ${left} ${y(tick)} H ${left + width}" stroke="#cbd5e1"/>`,
      `<text x="${left - 17}" y="${y(tick) + 5}" text-anchor="end" font-size="15">${tick}</text>`
    );
  }
  lines.push(
    `<polyline points="${curve.join(' ')}" fill="none" stroke="#991b1b" stroke-width="2" stroke-dasharray="6 4"/>`,
    '<text x="730" y="111" font-size="14" font-weight="bold" fill="#991b1b">Red-rated: risk ≥ 16</text>',
    '<text x="500" y="575" text-anchor="middle" font-size="18" font-weight="bold">Likelihood score</text>',
    '<text transform="translate(35 320) rotate(-90)" text-anchor="middle" font-size="18" font-weight="bold">Impact score</text>'
  );
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
      v.redRated
        ? `<path d="M ${n(px)} ${n(py - 7)} L ${n(px + 7)} ${n(py)} L ${n(px)} ${n(py + 7)} L ${n(px - 7)} ${n(py)} Z" fill="#b91c1c" stroke="white" stroke-width="2"/>`
        : `<circle cx="${n(px)}" cy="${n(py)}" r="6" fill="#1d4ed8" stroke="white" stroke-width="2"/>`
    );
    lines.push(
      `<text x="${n(px + (px > 820 ? -12 : 12))}" y="${n(Math.max(top + 18, py - 10))}" text-anchor="${px > 820 ? 'end' : 'start'}" font-size="13" font-weight="bold" stroke="white" stroke-width="3" paint-order="stroke">${label}</text></g>`
    );
  }
  lines.push(
    '<text x="100" y="610" font-size="14">◆ Red-rated (≥16)   ● Below threshold. Below threshold does not mean Accepted.</text>',
    '<text x="100" y="633" font-size="14">Unrounded coordinates; displayed scores rounded. Coincident points grouped; no jitter.</text>',
    '<text x="100" y="656" font-size="14">Missing scores are unplotted, never zero. No additional official overall risk bands.</text>'
  );
  if (!groups.size)
    lines.push(
      `<text x="500" y="315" text-anchor="middle" font-size="19" font-weight="bold">${a.metadata.riskModel === 'none' ? 'Numerical risk model omitted' : 'No complete numerical scores to plot'}</text>`
    );
  let rowY = 692;
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
      `![Legacy numerical risk chart: likelihood 1–6 versus impact 1–5; red-rated at 16. Complete scores only; system key in SVG.](${chartFilename(a)})`,
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
  'Usage: node legacy-assessment.mjs --input assessment.json (--json | --markdown | --svg | --check-report report.md | --lint [--format text|json] | --explain ID | --approval-digest assessment|policy:ID|risk-acceptance:ID)\n';
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
      ['--json', '--markdown', '--svg', '--lint'].includes(args[i]) &&
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
        'Calculated report block and applicable risk chart verified; evidence truth and narrative are not verified\n'
      );
    } else
      process.stdout.write(
        mode === '--json'
          ? `${JSON.stringify(a, null, 2)}\n`
          : mode === '--svg'
            ? renderRiskChart(a)
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
