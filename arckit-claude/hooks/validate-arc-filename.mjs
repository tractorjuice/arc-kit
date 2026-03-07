#!/usr/bin/env node
/**
 * ArcKit PreToolUse (Write) Hook - ARC Filename Convention Enforcement
 *
 * Intercepts Write tool calls targeting ARC-* files under projects/ and auto-corrects
 * filenames to match the ArcKit naming convention (ARC-{PID}-{TYPE}[-{SEQ}]-v{VER}.md).
 *
 * Corrections applied:
 *   - Zero-pads project ID to 3 digits (1 -> 001)
 *   - Normalizes version format (v1 -> v1.0)
 *   - Corrects project ID to match directory number (ARC-999 in 001-foo/ -> ARC-001)
 *   - Moves multi-instance types to correct subdirectory (ADR -> decisions/)
 *   - Assigns next sequence number for multi-instance types missing one
 *   - Creates subdirectories as needed (mkdir -p)
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON with updatedInput for corrected path, or empty for pass-through
 * Exit codes:      0 = allow (with or without corrections), 2 = block (invalid type code)
 */

import { readFileSync, readdirSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { KNOWN_TYPES, MULTI_INSTANCE_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';

// --- Main ---
let raw = '';
try {
  raw = readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}
if (!raw || !raw.trim()) process.exit(0);

let data;
try {
  data = JSON.parse(raw);
} catch {
  process.exit(0);
}

let filePath = (data.tool_input || {}).file_path || '';
if (!filePath) process.exit(0);

// Resolve relative paths using cwd
if (!filePath.startsWith('/')) {
  const cwd = data.cwd || '';
  if (cwd) filePath = join(cwd, filePath);
}

const filename = basename(filePath);
const dirpath = dirname(filePath);

// Early exit: only process ARC-*.md files under a projects/ directory
if (!filePath.includes('/projects/')) process.exit(0);
if (!filename.startsWith('ARC-')) process.exit(0);
if (!filename.endsWith('.md')) process.exit(0);

// --- Extract project directory info ---
// Path format: .../projects/{NNN-name}/[subdir/]ARC-*.md
const afterProjects = filePath.split('projects/')[1];
const projectDirName = afterProjects.split('/')[0];
const projectsBase = filePath.split('projects/')[0] + 'projects';
const projectDir = join(projectsBase, projectDirName);

// Extract project number from directory name
let dirProjectNum = '';
const dirMatch = projectDirName.match(/^(\d+)-/);
if (dirMatch) dirProjectNum = dirMatch[1];

// --- Parse ARC filename ---
// Patterns: ARC-001-REQ-v1.0.md, ARC-001-ADR-001-v1.0.md, ARC-001-SECD-MOD-v1.0.md
let core = filename.slice(4);   // Strip "ARC-"
core = core.slice(0, -3);      // Strip ".md"

// Extract version: match last -vN.N or -vN
const vm = core.match(/^(.+)-v(\d+\.?\d*)$/);
if (!vm) {
  // Can't parse version - not a standard ARC filename, pass through
  process.exit(0);
}
const preVersion = vm[1];
const rawVersion = vm[2];

// Extract project ID (first numeric segment)
const pm = preVersion.match(/^(\d+)-(.+)$/);
if (!pm) process.exit(0);
const rawProjectId = pm[1];
const typeAndSeq = pm[2];

// --- Determine doc type code and optional sequence number ---
let docType = '';
let seqNum = '';

const tm = typeAndSeq.match(/^(.+)-(\d{3})$/);
if (tm) {
  const potentialType = tm[1];
  const potentialSeq = tm[2];
  if (MULTI_INSTANCE_TYPES.has(potentialType)) {
    docType = potentialType;
    seqNum = potentialSeq;
  } else {
    docType = typeAndSeq;
  }
} else {
  docType = typeAndSeq;
}

// --- Validate doc type code ---
if (!KNOWN_TYPES.has(docType)) {
  const validList = [...KNOWN_TYPES].sort().join(' ');
  process.stderr.write(
    `ArcKit: Unknown document type code '${docType}'. Valid codes: ${validList}\n`
  );
  process.exit(2);
}

// --- Normalize project ID (3-digit zero-padded) ---
let pidClean;
if (dirProjectNum) {
  pidClean = parseInt(dirProjectNum.replace(/^0+/, '') || '0', 10);
} else {
  pidClean = parseInt(rawProjectId.replace(/^0+/, '') || '0', 10);
}
const paddedPid = String(pidClean).padStart(3, '0');

// --- Normalize version (ensure N.N format) ---
const normVersion = /^\d+$/.test(rawVersion) ? `${rawVersion}.0` : rawVersion;

// --- Route to correct directory and filename ---
let correctedPath;
if (MULTI_INSTANCE_TYPES.has(docType)) {
  // Multi-instance types: route to subdirectory with sequence number
  const requiredSubdir = SUBDIR_MAP[docType];
  const targetDir = join(projectDir, requiredSubdir);

  if (!seqNum) {
    // Claude omitted sequence number - scan directory and assign next available
    mkdirSync(targetDir, { recursive: true });
    let lastNum = 0;

    try {
      for (const fname of readdirSync(targetDir)) {
        if (!fname.endsWith('.md')) continue;
        const escapedType = docType.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const nm = fname.match(new RegExp(`ARC-${paddedPid}-${escapedType}-(\\d+)-`));
        if (nm) {
          const num = parseInt(nm[1], 10);
          if (num > lastNum) lastNum = num;
        }
      }
    } catch { /* directory may not exist yet */ }

    seqNum = String(lastNum + 1).padStart(3, '0');
  } else {
    // Claude provided a sequence number - keep it, ensure directory exists
    mkdirSync(targetDir, { recursive: true });
  }

  const correctedFilename = `ARC-${paddedPid}-${docType}-${seqNum}-v${normVersion}.md`;
  correctedPath = join(targetDir, correctedFilename);
} else if (SUBDIR_MAP[docType]) {
  // Single-instance type with required subdirectory (e.g. RSCH → research/)
  const requiredSubdir = SUBDIR_MAP[docType];
  const targetDir = join(projectDir, requiredSubdir);
  mkdirSync(targetDir, { recursive: true });
  const correctedFilename = `ARC-${paddedPid}-${docType}-v${normVersion}.md`;
  correctedPath = join(targetDir, correctedFilename);
} else {
  // Single-instance type in project root
  const correctedFilename = `ARC-${paddedPid}-${docType}-v${normVersion}.md`;
  correctedPath = join(dirpath, correctedFilename);
}

// --- Compare and output ---
if (correctedPath === filePath) process.exit(0);

// Return updatedInput with corrected file_path (preserves original content)
const toolInput = { ...(data.tool_input || {}) };
toolInput.file_path = correctedPath;
console.log(JSON.stringify({ updatedInput: toolInput }));
process.exit(0);
