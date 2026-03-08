#!/usr/bin/env node
/**
 * ArcKit PreToolUse (Write) Hook — Score Validator
 *
 * Validates scores.json files before they are written to ensure
 * data integrity of vendor scoring records.
 *
 * Checks:
 *   - Valid JSON structure with required fields
 *   - Score values are 0-3
 *   - Weights sum to approximately 1.0
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON with decision (allow/block)
 */

import { basename } from 'node:path';
import { parseHookInput } from './hook-utils.mjs';

const data = parseHookInput();

// --- Early exit: only validate scores.json files ---
const filePath = (data.tool_input || {}).file_path || '';
if (!filePath.endsWith('/scores.json') && basename(filePath) !== 'scores.json') {
  process.exit(0);
}
if (!filePath.includes('/vendors/')) process.exit(0);

const content = (data.tool_input || {}).content || '';
if (!content) process.exit(0);

// --- Validate JSON ---
let scores;
try {
  scores = JSON.parse(content);
} catch (e) {
  console.log(JSON.stringify({
    decision: 'block',
    reason: `Invalid JSON in scores.json: ${e.message}`,
  }));
  process.exit(0);
}

const warnings = [];

// --- Validate required top-level fields ---
if (!scores.projectId) warnings.push('Missing required field: projectId');
if (!scores.criteria || !Array.isArray(scores.criteria)) {
  warnings.push('Missing or invalid field: criteria (must be an array)');
}
if (!scores.vendors || typeof scores.vendors !== 'object') {
  warnings.push('Missing or invalid field: vendors (must be an object)');
}

// --- Validate criteria weights ---
if (Array.isArray(scores.criteria) && scores.criteria.length > 0) {
  const weightSum = scores.criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
  if (Math.abs(weightSum - 1.0) > 0.01) {
    warnings.push(`Criteria weights sum to ${weightSum.toFixed(3)} (expected ~1.0)`);
  }

  // Check each criterion has required fields
  for (const c of scores.criteria) {
    if (!c.id) warnings.push(`Criterion missing id field`);
    if (!c.name) warnings.push(`Criterion ${c.id || '?'} missing name field`);
    if (typeof c.weight !== 'number') warnings.push(`Criterion ${c.id || '?'} missing numeric weight`);
  }
}

// --- Validate vendor scores ---
if (scores.vendors && typeof scores.vendors === 'object') {
  const criteriaIds = new Set((scores.criteria || []).map(c => c.id));

  for (const [vendorKey, vendor] of Object.entries(scores.vendors)) {
    if (!vendor.displayName) warnings.push(`Vendor '${vendorKey}' missing displayName`);
    if (!Array.isArray(vendor.scores)) {
      warnings.push(`Vendor '${vendorKey}' missing scores array`);
      continue;
    }

    for (const s of vendor.scores) {
      if (typeof s.score !== 'number' || s.score < 0 || s.score > 3) {
        warnings.push(`Vendor '${vendorKey}' criterion ${s.criterionId || '?'}: score ${s.score} out of range (must be 0-3)`);
      }
      if (!s.evidence || !s.evidence.trim()) {
        warnings.push(`Vendor '${vendorKey}' criterion ${s.criterionId || '?'}: missing evidence (every score must cite supporting evidence)`);
      }
      if (s.criterionId && !criteriaIds.has(s.criterionId)) {
        warnings.push(`Vendor '${vendorKey}' references unknown criterion: ${s.criterionId}`);
      }
    }
  }
}

// --- Output ---
if (warnings.length > 0) {
  // Allow but warn — don't block data writes
  console.log(JSON.stringify({
    decision: 'allow',
    reason: `Score validation warnings:\n${warnings.map(w => `- ${w}`).join('\n')}`,
  }));
} else {
  // Clean pass
  process.exit(0);
}
