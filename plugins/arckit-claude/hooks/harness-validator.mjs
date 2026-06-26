#!/usr/bin/env node
/**
 * ArcKit Self-Harness Harness Validator
 * 
 * Implements the Proposal Validation stage from Zhang et al. (2026, Section 3.4)
 * Based on: "Self-Harness: Harnesses That Improve Themselves" (arXiv:2606.09498v1)
 * 
 * Key concept from Zhang et al. (2026, Algorithm 1):
 * A candidate harness edit is accepted only if it improves at least one split
 * without degrading the other:
 *   Δ_in(j) ≥ 0 AND Δ_out(j) ≥ 0 AND max(Δ_in(j), Δ_out(j)) > 0
 * 
 * This module runs regression tests on held-out tasks to ensure robust improvement.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Validate a harness candidate using held-in/held-out testing
 * Implements the conservative acceptance rule from Zhang et al. (2026, Algorithm 1)
 * 
 * @param {Object} options - Validation options
 * @param {string} options.command - Command/agent/hook being optimized
 * @param {string} options.mode - Optimization mode
 * @param {Array} options.heldInTasks - Held-in task IDs
 * @param {Array} options.heldOutTasks - Held-out task IDs
 * @param {string} options.candidateHarnessPath - Path to candidate harness
 * @param {Object} options.taskResults - Pre-scored validation results keyed by split/task
 * @param {Object} options.baselineScores - Baseline scores {heldIn: X.X, heldOut: Y.Y}
 * @param {number} options.minDelta - Minimum delta for acceptance (default: 0.3)
 * @returns {Object} Validation result
 */
export function validateHarness(options) {
  const {
    command,
    mode = 'prompt',
    heldInTasks = [],
    heldOutTasks = [],
    candidateHarnessPath,
    taskResults = {},
    baselineScores = { heldIn: 0, heldOut: 0 },
    minDelta = 0.3,
    iteration
  } = options;
  
  const result = {
    iteration,
    command,
    mode,
    timestamp: new Date().toISOString(),
    baselineScores,
    candidateScores: { heldIn: 0, heldOut: 0 },
    deltas: { heldIn: 0, heldOut: 0 },
    accepted: false,
    reason: '',
    heldInResults: [],
    heldOutResults: []
  };
  
  // Validate held-in tasks
  const heldInResults = [];
  for (const task of heldInTasks) {
    const taskResult = executeAndScoreTask(task, {
      split: 'heldIn',
      taskResults,
      candidateHarnessPath,
      mode,
      command
    });
    heldInResults.push(taskResult);
  }
  
  // Validate held-out tasks
  const heldOutResults = [];
  for (const task of heldOutTasks) {
    const taskResult = executeAndScoreTask(task, {
      split: 'heldOut',
      taskResults,
      candidateHarnessPath,
      mode,
      command
    });
    heldOutResults.push(taskResult);
  }

  const missingScores = [...heldInResults, ...heldOutResults]
    .filter(r => !Number.isFinite(r.score));
  
  // Calculate average scores
  const heldInScores = heldInResults.map(r => r.score).filter(s => s !== null && s !== undefined);
  const heldOutScores = heldOutResults.map(r => r.score).filter(s => s !== null && s !== undefined);
  
  result.candidateScores.heldIn = heldInScores.length > 0 
    ? heldInScores.reduce((a, b) => a + b, 0) / heldInScores.length 
    : 0;
  result.candidateScores.heldOut = heldOutScores.length > 0 
    ? heldOutScores.reduce((a, b) => a + b, 0) / heldOutScores.length 
    : 0;
  
  // Calculate deltas
  result.deltas.heldIn = result.candidateScores.heldIn - baselineScores.heldIn;
  result.deltas.heldOut = result.candidateScores.heldOut - baselineScores.heldOut;

  if (heldInTasks.length === 0 || heldOutTasks.length === 0) {
    result.reason = 'Rejected: held-in and held-out task lists are both required';
    result.heldInResults = heldInResults;
    result.heldOutResults = heldOutResults;
    saveValidationResult(result);
    return result;
  }

  if (missingScores.length > 0) {
    const taskList = missingScores.map(r => `${r.split}:${r.taskId}`).join(', ');
    result.reason = `Rejected: missing scored validation result for ${taskList}`;
    result.heldInResults = heldInResults;
    result.heldOutResults = heldOutResults;
    saveValidationResult(result);
    return result;
  }
  
  // Apply conservative acceptance rule (Zhang et al., 2026, Algorithm 1)
  const deltaInNonNegative = result.deltas.heldIn >= 0;
  const deltaOutNonNegative = result.deltas.heldOut >= 0;
  const maxDeltaPositive = Math.max(result.deltas.heldIn, result.deltas.heldOut) > minDelta;
  
  result.accepted = deltaInNonNegative && deltaOutNonNegative && maxDeltaPositive;
  
  if (result.accepted) {
    result.reason = `Accepted: Δ_in=${result.deltas.heldIn.toFixed(2)}, Δ_out=${result.deltas.heldOut.toFixed(2)}, max=${Math.max(result.deltas.heldIn, result.deltas.heldOut).toFixed(2)} > ${minDelta}`;
  } else {
    // Determine rejection reason
    if (!deltaInNonNegative) {
      result.reason = `Rejected: Held-in score degraded by ${Math.abs(result.deltas.heldIn).toFixed(2)}`;
    } else if (!deltaOutNonNegative) {
      result.reason = `Rejected: Held-out score degraded by ${Math.abs(result.deltas.heldOut).toFixed(2)}`;
    } else if (!maxDeltaPositive) {
      result.reason = `Rejected: Max improvement ${Math.max(result.deltas.heldIn, result.deltas.heldOut).toFixed(2)} <= ${minDelta} threshold`;
    } else {
      result.reason = 'Rejected: Unknown reason';
    }
  }
  
  result.heldInResults = heldInResults;
  result.heldOutResults = heldOutResults;
  
  // Save validation result
  saveValidationResult(result);
  
  return result;
}

/**
 * Execute a task and score the result
 */
function executeAndScoreTask(task, context) {
  const { split, taskResults, candidateHarnessPath, mode, command } = context;
  const taskId = typeof task === 'string' ? task : task?.id || task?.taskId;
  const scoredResult = resolveTaskResult(task, split, taskResults);

  return {
    taskId: taskId || 'unknown',
    split,
    executedAt: new Date().toISOString(),
    harnessPath: candidateHarnessPath,
    structural: scoredResult?.structural || scoredResult?.status || 'UNSCORED',
    score: Number.isFinite(scoredResult?.score) ? scoredResult.score : null,
    tracePath: scoredResult?.tracePath || `.arckit/autoresearch-traces/${command}/${mode}/${taskId || 'unknown'}.json`,
    error: scoredResult ? undefined : 'No scored validation result supplied'
  };
}

function resolveTaskResult(task, split, taskResults) {
  if (task && typeof task === 'object' && Number.isFinite(task.score)) {
    return task;
  }

  if (task && typeof task === 'object' && task.resultPath) {
    return loadResultFile(task.resultPath);
  }

  if (typeof task === 'string' && existsSync(task)) {
    return loadResultFile(task);
  }

  const taskId = typeof task === 'string' ? task : task?.id || task?.taskId;
  return taskResults?.[split]?.[taskId] || taskResults?.[taskId] || null;
}

function loadResultFile(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

/**
 * Save validation result to file
 */
function saveValidationResult(result) {
  try {
    const { command, mode, iteration } = result;
    const resultsDir = join('.arckit', 'autoresearch-validations', command, mode);
    const resultPath = join(resultsDir, `iteration-${String(iteration).padStart(3, '0')}.json`);
    
    if (!existsSync(resultsDir)) {
      mkdirSync(resultsDir, { recursive: true });
    }
    
    writeFileSync(resultPath, JSON.stringify(result, null, 2));
    process.stderr.write(`[ArcKit-SelfHarness] Validation result saved: ${resultPath}\n`);
  } catch (error) {
    process.stderr.write(`[ArcKit-SelfHarness] Error saving validation result: ${error.message}\n`);
  }
}

/**
 * Load validation results for a command/mode
 */
export function loadValidationResults(command, mode) {
  const resultsDir = join('.arckit', 'autoresearch-validations', command, mode);
  
  if (!existsSync(resultsDir)) {
    return [];
  }
  
  const files = readdirSync(resultsDir).filter(f => f.endsWith('.json'));
  
  return files.map(file => {
    try {
      return JSON.parse(readFileSync(join(resultsDir, file), 'utf8'));
    } catch {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Format validation result for display
 */
export function formatValidationResult(result) {
  const { accepted, deltas, candidateScores, baselineScores, reason } = result;
  
  const status = accepted ? '✓ ACCEPTED' : '✗ REJECTED';
  
  return `
Validation Result: ${status}
  Baseline: held-in=${baselineScores.heldIn.toFixed(2)}, held-out=${baselineScores.heldOut.toFixed(2)}
  Candidate: held-in=${candidateScores.heldIn.toFixed(2)}, held-out=${candidateScores.heldOut.toFixed(2)}
  Deltas: Δ_in=${deltas.heldIn > 0 ? '+' : ''}${deltas.heldIn.toFixed(2)}, Δ_out=${deltas.heldOut > 0 ? '+' : ''}${deltas.heldOut.toFixed(2)}
  Reason: ${reason}
`.trim();
}

/**
 * Calculate acceptance statistics
 */
export function calculateAcceptanceStats(command, mode) {
  const results = loadValidationResults(command, mode);
  
  const total = results.length;
  const accepted = results.filter(r => r.accepted).length;
  const rejected = total - accepted;
  
  const acceptanceRate = total > 0 ? (accepted / total * 100) : 0;
  
  const avgDeltaIn = results.length > 0 
    ? results.reduce((sum, r) => sum + r.deltas.heldIn, 0) / results.length 
    : 0;
  const avgDeltaOut = results.length > 0 
    ? results.reduce((sum, r) => sum + r.deltas.heldOut, 0) / results.length 
    : 0;
  
  return {
    command,
    mode,
    total,
    accepted,
    rejected,
    acceptanceRate: acceptanceRate.toFixed(1),
    avgDeltaIn: avgDeltaIn.toFixed(2),
    avgDeltaOut: avgDeltaOut.toFixed(2)
  };
}

/**
 * Merge accepted candidates into active harness
 * This implements the "MergeAccepted" step from Zhang et al. (2026, Algorithm 1)
 */
export function mergeAcceptedCandidates(baseHarnessPath, acceptedCandidates) {
  if (!existsSync(baseHarnessPath)) {
    throw new Error(`Base harness not found: ${baseHarnessPath}`);
  }
  
  let baseContent = readFileSync(baseHarnessPath, 'utf8');
  const changes = [];
  
  for (const candidate of acceptedCandidates) {
    if (!candidate.accepted || !candidate.proposal) continue;
    
    // Apply each change from the proposal
    for (const change of candidate.proposal.changes) {
      baseContent = applyChange(baseContent, change);
      changes.push({
        candidateId: candidate.id,
        change: change,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Write merged harness
  writeFileSync(baseHarnessPath, baseContent);
  
  return {
    mergedContent: baseContent,
    changesApplied: changes.length,
    changes
  };
}

/**
 * Apply a single change to content
 * Reused from harness-proposer.mjs for consistency
 */
function applyChange(content, change) {
  switch (change.type) {
    case 'add':
      if (change.location === 'beginning') {
        return change.content + '\n\n' + content;
      } else if (change.location === 'end') {
        return content + '\n\n' + change.content;
      }
      // Default: append
      return content + '\n\n' + change.content;
    
    case 'modify':
      if (change.pattern) {
        const regex = new RegExp(change.pattern, 'i');
        return content.replace(regex, change.replacement);
      }
      if (change.current) {
        return content.replace(change.current, change.replacement);
      }
      return content;
    
    case 'remove':
      if (change.pattern) {
        const regex = new RegExp(change.pattern, 'i');
        return content.replace(regex, '');
      }
      return content;
    
    default:
      return content;
  }
}

/**
 * Validate acceptance rule manually
 * Useful for testing and debugging
 */
export function checkAcceptanceRule(deltaIn, deltaOut, minDelta = 0.3) {
  return deltaIn >= 0 && deltaOut >= 0 && Math.max(deltaIn, deltaOut) > minDelta;
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.log('Usage: node harness-validator.mjs <options.json>');
    console.log('  options.json: {command, mode, heldInTasks, heldOutTasks, candidateHarnessPath, baselineScores, minDelta, iteration}');
    process.exit(1);
  }
  
  const optionsPath = args[0];
  
  try {
    const options = JSON.parse(readFileSync(optionsPath, 'utf8'));
    const result = validateHarness(options);
    
    console.log(JSON.stringify(result, null, 2));
    console.error('\n' + formatValidationResult(result));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default validateHarness;
