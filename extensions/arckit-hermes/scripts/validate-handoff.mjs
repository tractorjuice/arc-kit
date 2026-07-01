#!/usr/bin/env node
/**
 * Validate a JSON payload against a JSON Schema 2020-12 file.
 *
 * Usage: node validate-handoff.mjs <schema.json> <payload.json>
 *
 * Exit 0 on success: prints the validated payload as JSON on stdout.
 * Exit 1 on failure: prints {ok:false, errors:[{path,msg}]} on stdout.
 *
 * Used by arckit-claude/agents/arckit-datascout.md (the orchestrator)
 * to validate output from arckit-datascout-reader before scoring.
 *
 * Implementation note: pure Node, zero npm dependencies. The plugin
 * marketplace clones the repo but does not run `npm install`, so any
 * runtime dep would force every end user to install dependencies in
 * the plugin cache before ArcKit could validate a handoff. The supported
 * JSON Schema feature set below is exactly what
 * datascout-handoff.schema.json uses; new keywords need explicit support
 * added here.
 *
 * Supported keywords:
 *   - type (object, array, string, integer, number, boolean, null)
 *   - required, properties, additionalProperties: false
 *   - items (with $ref)
 *   - enum
 *   - pattern, maxLength, minLength
 *   - format: uri, date-time
 *   - maxItems, minItems
 *   - minimum, maximum
 *   - $ref ("#/$defs/<name>" form only)
 *
 * Unsupported keywords are silently ignored; the schema's $schema, $id,
 * title, description fields are documentation only.
 */

import { readFileSync } from 'node:fs';

const [, , schemaPath, payloadPath] = process.argv;

if (!schemaPath || !payloadPath) {
  emitErrors([{ path: '/', msg: 'Usage: validate-handoff.mjs <schema.json> <payload.json>' }]);
  process.exit(1);
}

let schema, payload;
try {
  schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
} catch (e) {
  emitErrors([{ path: '/', msg: `failed to read schema: ${e.message}` }]);
  process.exit(1);
}

try {
  payload = JSON.parse(readFileSync(payloadPath, 'utf8'));
} catch (e) {
  emitErrors([{ path: '/', msg: `failed to parse payload: ${e.message}` }]);
  process.exit(1);
}

const errors = [];
validate(payload, schema, '', schema, errors);

if (errors.length === 0) {
  console.log(JSON.stringify(payload));
  process.exit(0);
}

emitErrors(errors);
process.exit(1);

// ── Validator core ────────────────────────────────────────────────────

function validate(value, schemaNode, path, root, errors) {
  if (schemaNode == null) return;

  // Resolve $ref before doing anything else.
  if (schemaNode.$ref) {
    const resolved = resolveRef(schemaNode.$ref, root);
    if (!resolved) {
      errors.push({ path: pathOrRoot(path), msg: `cannot resolve $ref: ${schemaNode.$ref}` });
      return;
    }
    return validate(value, resolved, path, root, errors);
  }

  // type check
  if (schemaNode.type) {
    const actualType = jsonType(value);
    const expected = schemaNode.type;
    const ok = Array.isArray(expected)
      ? expected.some(t => typeMatches(t, value, actualType))
      : typeMatches(expected, value, actualType);
    if (!ok) {
      errors.push({ path: pathOrRoot(path), msg: `must be ${formatType(expected)}, got ${actualType}` });
      return; // type mismatch invalidates downstream checks
    }
  }

  // enum
  if (schemaNode.enum) {
    if (!schemaNode.enum.some(allowed => deepEqual(allowed, value))) {
      errors.push({
        path: pathOrRoot(path),
        msg: `must be one of allowlist (${schemaNode.enum.length} values); got ${JSON.stringify(value)}`,
      });
    }
  }

  // string-specific
  if (typeof value === 'string') {
    if (schemaNode.minLength !== undefined && value.length < schemaNode.minLength) {
      errors.push({ path: pathOrRoot(path), msg: `string length ${value.length} below minLength ${schemaNode.minLength}` });
    }
    if (schemaNode.maxLength !== undefined && value.length > schemaNode.maxLength) {
      errors.push({ path: pathOrRoot(path), msg: `string length ${value.length} exceeds maxLength ${schemaNode.maxLength}` });
    }
    if (schemaNode.pattern) {
      let re;
      try { re = new RegExp(schemaNode.pattern); }
      catch (e) {
        errors.push({ path: pathOrRoot(path), msg: `schema pattern invalid: ${e.message}` });
        return;
      }
      if (!re.test(value)) {
        errors.push({ path: pathOrRoot(path), msg: `must match pattern ${schemaNode.pattern}` });
      }
    }
    if (schemaNode.format === 'uri' && !isLikelyUri(value)) {
      errors.push({ path: pathOrRoot(path), msg: 'must be valid URI' });
    }
    if (schemaNode.format === 'date-time' && !isIsoDateTime(value)) {
      errors.push({ path: pathOrRoot(path), msg: 'must be valid ISO 8601 date-time' });
    }
  }

  // numeric-specific
  if (typeof value === 'number') {
    if (schemaNode.minimum !== undefined && value < schemaNode.minimum) {
      errors.push({ path: pathOrRoot(path), msg: `must be >= ${schemaNode.minimum}` });
    }
    if (schemaNode.maximum !== undefined && value > schemaNode.maximum) {
      errors.push({ path: pathOrRoot(path), msg: `must be <= ${schemaNode.maximum}` });
    }
  }

  // array-specific
  if (Array.isArray(value)) {
    if (schemaNode.minItems !== undefined && value.length < schemaNode.minItems) {
      errors.push({ path: pathOrRoot(path), msg: `array length ${value.length} below minItems ${schemaNode.minItems}` });
    }
    if (schemaNode.maxItems !== undefined && value.length > schemaNode.maxItems) {
      errors.push({ path: pathOrRoot(path), msg: `array length ${value.length} exceeds maxItems ${schemaNode.maxItems}` });
    }
    if (schemaNode.items) {
      value.forEach((item, i) => validate(item, schemaNode.items, `${path}/${i}`, root, errors));
    }
  }

  // object-specific
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    if (schemaNode.required) {
      for (const key of schemaNode.required) {
        if (!(key in value)) {
          errors.push({ path: `${pathOrRoot(path)}/${key}`, msg: 'required property missing' });
        }
      }
    }
    if (schemaNode.additionalProperties === false && schemaNode.properties) {
      const allowed = new Set(Object.keys(schemaNode.properties));
      for (const key of Object.keys(value)) {
        if (!allowed.has(key)) {
          errors.push({
            path: `${pathOrRoot(path)}/${key}`,
            msg: `unknown property (additionalProperties: false) {"additionalProperty":"${key}"}`,
          });
        }
      }
    }
    if (schemaNode.properties) {
      for (const [key, subschema] of Object.entries(schemaNode.properties)) {
        if (key in value) {
          validate(value[key], subschema, `${path}/${key}`, root, errors);
        }
      }
    }
  }
}

// ── Helpers ────────────────────────────────────────────────────────────

function emitErrors(errs) {
  console.log(JSON.stringify({ ok: false, errors: errs }, null, 2));
}

function pathOrRoot(path) {
  return path === '' ? '/' : path;
}

function jsonType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (Number.isInteger(value)) return 'integer';
  return typeof value; // 'string' | 'number' | 'boolean' | 'object'
}

function typeMatches(expected, value, actualType) {
  if (expected === 'integer') return Number.isInteger(value);
  if (expected === 'number') return typeof value === 'number';
  return expected === actualType;
}

function formatType(t) {
  return Array.isArray(t) ? `one of [${t.join(', ')}]` : t;
}

function resolveRef(ref, root) {
  if (!ref.startsWith('#/')) return null;
  const parts = ref.slice(2).split('/').map(decodeJsonPointer);
  let node = root;
  for (const p of parts) {
    if (node == null || !(p in node)) return null;
    node = node[p];
  }
  return node;
}

function decodeJsonPointer(token) {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return a === b;
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    return a.every((el, i) => deepEqual(el, b[i]));
  }
  if (typeof a === 'object') {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every(k => deepEqual(a[k], b[k]));
  }
  return false;
}

function isLikelyUri(value) {
  // Permissive scheme + ":" + something (RFC 3986 absolute URI shape).
  // Permissive on purpose — the goal is to reject obvious non-URIs (free
  // text, missing scheme), not to fully validate every RFC corner case.
  return /^[A-Za-z][A-Za-z0-9+.-]*:\S+$/.test(value);
}

function isIsoDateTime(value) {
  // ISO 8601 UTC ("Z") or with offset ("+HH:MM" / "-HH:MM"). Permissive
  // on the fractional-seconds component.
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})$/.test(value);
}
