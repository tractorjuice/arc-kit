#!/usr/bin/env node
/**
 * Generate standardized ArcKit document IDs.
 *
 * Usage: node generate-document-id.mjs PROJECT_ID DOC_TYPE [VERSION] [OPTIONS]
 *
 * Options:
 *   --filename        Return the ID with a .md extension
 *                     (ARC-001-REQ-v1.0 -> ARC-001-REQ-v1.0.md)
 *   --next-num DIR    Required for multi-instance types. Scans DIR for existing
 *                     ARC-{PID}-{TYPE}-{NNN}-*.md files and allocates the next
 *                     sequence number, starting at 001 if DIR does not exist.
 *   --relpath         Print the project-relative path rather than a bare
 *                     filename, prefixing the artefact's subdirectory when its
 *                     doc-type has one (RSCH -> research/ARC-001-RSCH-001-v1.0.md).
 *                     Implies --filename.
 *
 * Examples:
 *   generate-document-id.mjs 001 REQ                        -> ARC-001-REQ-v1.0
 *   generate-document-id.mjs 042 HLDR 2.1                   -> ARC-042-HLDR-v2.1
 *   generate-document-id.mjs 001 REQ 1.0 --filename         -> ARC-001-REQ-v1.0.md
 *   generate-document-id.mjs 001 ADR --filename --next-num ./decisions
 *                                                           -> ARC-001-ADR-001-v1.0.md
 *   generate-document-id.mjs 001 RSCH --relpath --next-num ./research
 *                                                -> research/ARC-001-RSCH-001-v1.0.md
 *
 * Replaces scripts/bash/generate-document-id.sh. The bash version restated the
 * multi-instance list as a hardcoded string in two copies, which drifted and
 * shipped three times (#566, the later GRNT miss, and the header comment fixed
 * in #722) and needed a dedicated CI guard to police. This imports the registry
 * instead, so there is one list and nothing to keep in sync (#723).
 *
 * Importing the registry also lets the generator reject a code that is not
 * registered. The bash version had no registry knowledge at all: it emitted
 * ARC-001-GLOS-v1.0.md happily, and validate-arc-filename.mjs then blocked the
 * write two steps later with no indication of what to fix. That is exactly how
 * /arckit:glossary and /arckit:framework shipped unusable (#712, #714).
 *
 * Pure Node, zero npm dependencies: the marketplace clones the plugin but never
 * runs `npm install`, so a runtime dep would force every user to install into
 * the plugin cache before ArcKit could name an artefact.
 */

import { readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';

import { KNOWN_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';

const USAGE =
  'Usage: generate-document-id.mjs PROJECT_ID DOC_TYPE [VERSION] ' +
  '[--filename] [--next-num DIR] [--relpath]';

function fail(...lines) {
  for (const line of lines) console.error(line);
  process.exit(1);
}

// --- argument parsing (positional-then-flags, order independent) -------------

const argv = process.argv.slice(2);
const positional = [];
let addExtension = false;
let relPath = false;
let nextNumDir = null;

for (let i = 0; i < argv.length; i++) {
  const arg = argv[i];
  if (arg === '--filename') {
    addExtension = true;
  } else if (arg === '--relpath') {
    relPath = true;
    addExtension = true;
  } else if (arg === '--next-num') {
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      fail('Error: --next-num requires a directory argument', USAGE);
    }
    nextNumDir = value;
    i++;
  } else if (arg.startsWith('-')) {
    fail(`Error: Unknown option: ${arg}`, USAGE);
  } else {
    positional.push(arg);
  }
}

const [projectId, docType, version = '1.0'] = positional;

if (projectId === undefined) fail('Error: PROJECT_ID required', USAGE);
if (docType === undefined) fail('Error: DOC_TYPE required', USAGE);

// The bash version reached printf with whatever it was given and died with
// "printf: FPRO: invalid number". Catching it here names the actual mistake,
// which is nearly always a doc-type passed in the PROJECT_ID slot -- the exact
// shape of the bug that made all 12 arckit-uae calls no-ops until #722.
if (!/^\d+$/.test(projectId)) {
  fail(
    `Error: PROJECT_ID must be numeric, got '${projectId}'.`,
    KNOWN_TYPES.has(projectId)
      ? `       '${projectId}' looks like a doc-type. The order is ` +
        'PROJECT_ID then DOC_TYPE.'
      : '',
    USAGE
  );
}

// The registry check the bash version could not make. An unregistered code is
// fatal downstream: validate-arc-filename.mjs blocks the write and the caller
// has no conforming name to fall back to.
if (!KNOWN_TYPES.has(docType)) {
  fail(
    `Error: '${docType}' is not a registered doc-type.`,
    '       Register it in plugins/arckit-claude/config/doc-types.mjs AND add a',
    '       row to the known-artifact-types table in commands/pages.md, or use',
    '       an existing code.'
  );
}

const paddedProjectId = String(Number(projectId)).padStart(3, '0');

// --- sequence allocation for multi-instance types ---------------------------

function nextSequence(dir, prefix) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    // Directory does not exist yet: this is the first artefact of its type.
    return '001';
  }

  let last = 0;
  const seqRe = new RegExp(`^${prefix}(\\d+)-`);
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    try {
      if (!statSync(join(dir, entry)).isFile()) continue;
    } catch {
      continue;
    }
    const match = seqRe.exec(basename(entry));
    if (!match) continue;
    const num = Number.parseInt(match[1], 10);
    if (Number.isFinite(num) && num > last) last = num;
  }
  return String(last + 1).padStart(3, '0');
}

let documentId;
if (MULTI_INSTANCE_TYPES.has(docType)) {
  if (nextNumDir === null) {
    fail(
      `Error: Multi-instance type '${docType}' requires --next-num DIR option`,
      `Usage: generate-document-id.mjs ${projectId} ${docType} ${version} --next-num ./directory`
    );
  }
  const prefix = `ARC-${paddedProjectId}-${docType}-`;
  documentId = `${prefix}${nextSequence(nextNumDir, prefix)}-v${version}`;
} else {
  documentId = `ARC-${paddedProjectId}-${docType}-v${version}`;
}

if (addExtension) documentId += '.md';

if (relPath) {
  const subdir = SUBDIR_MAP[docType];
  if (subdir) documentId = `${subdir}/${documentId}`;
}

process.stdout.write(`${documentId}\n`);
