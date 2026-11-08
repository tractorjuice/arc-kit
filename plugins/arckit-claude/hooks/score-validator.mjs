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
 *   - Integrity findings hold a type, file and location, and no supplier text
 *   - Moderation: each criterion the independent scorer scored differently has
 *     both scores, a final score that matches the stored one, and a reason
 *
 * Hook Type: PreToolUse
 * Matcher: Write
 * Input (stdin):  JSON { tool_name, tool_input: { file_path, content }, ... }
 * Output (stdout): JSON with decision 'block' (invalid JSON) or
 *                  hookSpecificOutput.additionalContext (non-blocking warnings)
 */

import { basename } from 'node:path';
import { parseHookInput } from './hook-utils.mjs';

const data = parseHookInput();

// --- Early exit: only validate scores.json files ---
const filePath = String((data.tool_input || {}).file_path || '').replace(/\\/g, '/');
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

if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
  console.log(JSON.stringify({ decision: 'block', reason: 'scores.json must hold a JSON object' }));
  process.exit(0);
}

const warnings = [];

// `/arckit:score compare` reads this file back into the context that ranks
// vendors, so a quote stored here would give planted text a second run at it.
// The quote goes in the console summary. Warnings name the field and never
// repeat its value, because they go back to the model too.
const FINDING_TYPES = ['instruction', 'hidden-text', 'forged-marker'];
const FINDING_FIELDS = ['type', 'file', 'location'];
const MAX_FINDING_FIELD = 200;

function checkFindings(vendorKey, findings) {
  if (findings === undefined) return; // scored before findings were stored
  if (!Array.isArray(findings)) {
    warnings.push(`Vendor '${vendorKey}' integrityFindings must be an array (use [] when none were found)`);
    return;
  }
  findings.forEach((finding, index) => {
    const label = `Vendor '${vendorKey}' integrity finding ${index + 1}`;
    if (!finding || typeof finding !== 'object') {
      warnings.push(`${label} must be an object`);
      return;
    }
    if (!FINDING_TYPES.includes(finding.type)) {
      warnings.push(`${label}: type must be one of ${FINDING_TYPES.join(', ')}`);
    }
    for (const field of ['file', 'location']) {
      if (!finding[field]) warnings.push(`${label}: missing ${field}`);
      else if (String(finding[field]).length > MAX_FINDING_FIELD) {
        warnings.push(`${label}: ${field} is longer than ${MAX_FINDING_FIELD} characters. Give the place, not the text`);
      }
    }
    const extra = Object.keys(finding).filter(key => !FINDING_FIELDS.includes(key));
    for (const key of extra) {
      const name = key === 'quote' ? 'quote' : '(not a finding field)';
      warnings.push(`${label}: unexpected field ${name}. Keep supplier text out of scores.json`);
    }
  });
}

// A second, independent scorer sees only the criteria and the claims; every
// criterion the two scored differently is settled with a reason. Warnings name
// fields and print numbers only, never a reason's text.
const MODERATION_SCORES = ['firstScore', 'independentScore', 'finalScore'];
const isScore = v => typeof v === 'number' && v >= 0 && v <= 3;

function checkModeration(vendorKey, moderation, storedScores, criteriaIds) {
  if (moderation === undefined) return; // scored before moderation existed
  const where = `Vendor '${vendorKey}' moderation`;
  if (!moderation || typeof moderation !== 'object' || Array.isArray(moderation)) {
    warnings.push(`${where} must be an object`);
    return;
  }
  const status = moderation.independentScorer;
  const ran = status === 'completed';
  if (!ran && !(typeof status === 'string' && /^not run\b/i.test(status))) {
    warnings.push(`${where}: independentScorer must be "completed" or start with "not run"`);
  }
  const moderated = moderation.moderated === undefined && !ran ? [] : moderation.moderated;
  if (!Array.isArray(moderated)) {
    warnings.push(`${where}: moderated must be an array (use [] when every score matched)`);
    return;
  }
  if (!ran && moderated.length > 0) {
    warnings.push(`${where} lists moderated criteria, but the independent scorer did not run`);
  }
  // A neutral moderator settles each difference. Absent on records made before
  // it existed; when it didn't run, the first evaluator's score stands.
  const moderator = moderation.moderator;
  const moderatorSkipped = typeof moderator === 'string' && /^not run\b/i.test(moderator);
  if (moderator !== undefined
      && moderator !== 'completed' && moderator !== 'not needed' && !moderatorSkipped) {
    warnings.push(`${where}: moderator must be "completed", "not needed" or start with "not run"`);
  }
  if (moderator === 'not needed' && moderated.length > 0) {
    warnings.push(`${where}: moderator is "not needed", but criteria were moderated`);
  }
  if (ran) {
    if (!Number.isInteger(moderation.agreed) || moderation.agreed < 0) {
      warnings.push(`${where}: agreed must be a whole number (the criteria both scorers scored the same)`);
    } else if (moderation.agreed + moderated.length !== storedScores.size) {
      warnings.push(`${where}: agreed (${moderation.agreed}) plus moderated (${moderated.length}) should equal the ${storedScores.size} scored criteria`);
    }
  }
  moderated.forEach((entry, index) => {
    const label = `${where} entry ${index + 1}`;
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      warnings.push(`${label} must be an object`);
      return;
    }
    const id = typeof entry.criterionId === 'string' && criteriaIds.has(entry.criterionId) ? entry.criterionId : null;
    if (!entry.criterionId) warnings.push(`${label}: missing criterionId`);
    else if (!id) warnings.push(`${label}: criterionId is not one of the criteria`);
    for (const field of MODERATION_SCORES) {
      if (!isScore(entry[field])) warnings.push(`${label}: ${field} must be a number from 0 to 3`);
    }
    if (isScore(entry.firstScore) && entry.firstScore === entry.independentScore) {
      warnings.push(`${label}: firstScore and independentScore match, so there is nothing to moderate`);
    }
    if (typeof entry.reason !== 'string' || !entry.reason.trim()) {
      warnings.push(`${label}: missing reason (every moderated score needs one)`);
    }
    if (id && isScore(entry.finalScore) && storedScores.has(id) && storedScores.get(id) !== entry.finalScore) {
      warnings.push(`${label}: finalScore ${entry.finalScore} differs from the score stored for ${id}`);
    }
    if (moderatorSkipped && isScore(entry.finalScore) && isScore(entry.firstScore) && entry.finalScore !== entry.firstScore) {
      warnings.push(`${label}: the moderator did not run, so finalScore should be the first evaluator's score`);
    }
  });
}

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
  const weightSum = scores.criteria.reduce((sum, c) => sum + (typeof c?.weight === 'number' ? c.weight : 0), 0);
  if (Math.abs(weightSum - 1.0) > 0.01) {
    warnings.push(`Criteria weights sum to ${weightSum.toFixed(3)} (expected ~1.0)`);
  }

  // Check each criterion has required fields
  for (const c of scores.criteria) {
    if (!c || typeof c !== 'object') {
      warnings.push('Criterion is not an object');
      continue;
    }
    if (!c.id) warnings.push(`Criterion missing id field`);
    if (!c.name) warnings.push(`Criterion ${c.id || '?'} missing name field`);
    if (typeof c.weight !== 'number') warnings.push(`Criterion ${c.id || '?'} missing numeric weight`);
  }
}

// --- Validate vendor scores ---
if (scores.vendors && typeof scores.vendors === 'object') {
  const criteriaIds = new Set((Array.isArray(scores.criteria) ? scores.criteria : []).map(c => c?.id));

  for (const [vendorKey, vendor] of Object.entries(scores.vendors)) {
    if (!vendor || typeof vendor !== 'object') {
      warnings.push(`Vendor '${vendorKey}' is not an object`);
      continue;
    }
    if (!vendor.displayName) warnings.push(`Vendor '${vendorKey}' missing displayName`);
    checkFindings(vendorKey, vendor.integrityFindings);
    if (!Array.isArray(vendor.scores)) {
      warnings.push(`Vendor '${vendorKey}' missing scores array`);
      continue;
    }

    for (const s of vendor.scores) {
      if (!s || typeof s !== 'object') {
        warnings.push(`Vendor '${vendorKey}' has a score that is not an object`);
        continue;
      }
      if (typeof s.score !== 'number' || s.score < 0 || s.score > 3) {
        warnings.push(`Vendor '${vendorKey}' criterion ${s.criterionId || '?'}: score ${s.score} out of range (must be 0-3)`);
      }
      if (typeof s.evidence !== 'string' || !s.evidence.trim()) {
        warnings.push(`Vendor '${vendorKey}' criterion ${s.criterionId || '?'}: missing evidence (every score must cite supporting evidence)`);
      }
      if (s.criterionId && !criteriaIds.has(s.criterionId)) {
        warnings.push(`Vendor '${vendorKey}' references unknown criterion: ${s.criterionId}`);
      }
    }

    const storedScores = new Map(
      vendor.scores
        .filter(s => s && typeof s === 'object' && typeof s.criterionId === 'string')
        .map(s => [s.criterionId, s.score]),
    );
    checkModeration(vendorKey, vendor.moderation, storedScores, criteriaIds);
  }
}

// --- Output ---
if (warnings.length > 0) {
  // Warn without a permission decision — normal permission flow still applies
  console.log(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      additionalContext: `Score validation warnings:\n${warnings.map(w => `- ${w}`).join('\n')}`,
    },
  }));
} else {
  // Clean pass
  process.exit(0);
}
