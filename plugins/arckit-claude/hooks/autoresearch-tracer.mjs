#!/usr/bin/env node
/**
 * ArcKit Autoresearch Trace Collector
 * 
 * Captures detailed execution traces for Self-Harness analysis.
 * Based on: "Self-Harness: Harnesses That Improve Themselves" (Zhang et al., 2026, arXiv:2606.09498v1)
 * 
 * This hook collects execution traces that enable verifier-grounded weakness mining
 * as described in Zhang et al. (2026, Section 3.2).
 * 
 * Hook Type: UserPromptSubmit / PostToolUse (observational)
 * Input: JSON with execution data
 * Output: JSON with trace data (stored to file, not returned)
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Capture execution trace for autoresearch Self-Harness analysis
 * 
 * @param {Object} input - Execution data
 * @param {string} input.command - Command/agent/hook being optimized
 * @param {number} input.iteration - Current iteration number
 * @param {string} input.mode - Optimization mode (prompt, full, agent, hook)
 * @param {Array} input.toolCalls - Array of tool calls made
 * @param {number} input.tokenCount - Total tokens used
 * @param {number} input.durationMs - Execution duration in ms
 * @param {Array} input.artifacts - Artifacts created during execution
 * @param {Object} input.verifier - Verifier output
 * @param {string} input.output - Final output
 * @param {Object} input.environment - Environment info (model, effort)
 * @returns {Object} The trace object
 */
export function captureAutoresearchTrace(input) {
  const trace = {
    iteration: input.iteration || 0,
    target: input.target || input.command || 'unknown',
    mode: input.mode || 'prompt',
    timestamp: new Date().toISOString(),
    environment: {
      model: input.environment?.model || process.env.CLAUDE_MODEL || 'unknown',
      effort: input.environment?.effort || process.env.CLAUDE_EFFORT || 'unknown'
    },
    execution: {
      toolCalls: input.toolCalls || [],
      tokenCount: input.tokenCount || 0,
      durationMs: input.durationMs || 0,
      artifactsCreated: input.artifacts || [],
      errors: input.errors || []
    },
    output: input.output || '',
    verifier: input.verifier || {},
    metadata: {
      traceId: `iter-${input.iteration || 0}`,
      worktree: process.env.AUTORESEARCH_WORKTREE || process.env.AUTORESEARCH_WORTREE || process.cwd(),
      gitCommit: getGitCommit()
    }
  };

  // Save trace to file
  saveTrace(trace);

  return trace;
}

/**
 * Get current git commit hash (short)
 */
function getGitCommit() {
  try {
    return execSync('git rev-parse --short HEAD', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
  } catch {
    return 'unknown';
  }
}

/**
 * Save trace to file in .arckit/autoresearch-traces/
 */
function saveTrace(trace) {
  try {
    const target = trace.target;
    const mode = trace.mode;
    const iteration = trace.iteration;
    
    const tracesDir = join('.arckit', 'autoresearch-traces', target, mode);
    const tracePath = join(tracesDir, `iteration-${String(iteration).padStart(3, '0')}.json`);

    if (!existsSync(tracesDir)) {
      mkdirSync(tracesDir, { recursive: true });
    }

    writeFileSync(tracePath, JSON.stringify(trace, null, 2));
    
    // Also log to stderr for visibility
    process.stderr.write(`[ArcKit-SelfHarness] Trace saved: ${tracePath}\n`);
  } catch (error) {
    process.stderr.write(`[ArcKit-SelfHarness] Error saving trace: ${error.message}\n`);
  }
}

/**
 * Format trace for display in terminal
 */
export function formatTraceSummary(trace) {
  const toolSummary = trace.execution.toolCalls
    .map(tc => `${tc.name}(${tc.path || tc.query || tc.command || ''})`)
    .join(', ');
  
  return `
Trace Summary (iter ${trace.iteration}):
  Target: ${trace.target} (mode: ${trace.mode})
  Model: ${trace.environment.model}, Effort: ${trace.environment.effort}
  Duration: ${trace.execution.durationMs}ms
  Tokens: ${trace.execution.tokenCount}
  Tools: ${toolSummary || 'none'}
  Artifacts: ${trace.execution.artifactsCreated.length}
  Verifier: ${trace.verifier.passed ? 'PASSED' : 'FAILED'}
  Commit: ${trace.metadata.gitCommit}
`.trim();
}

/**
 * Load all traces for a target and mode
 */
export function loadAllTraces(target, mode) {
  const tracesDir = join('.arckit', 'autoresearch-traces', target, mode);
  
  if (!existsSync(tracesDir)) {
    return [];
  }

  const files = readdirSync(tracesDir).filter(f => f.endsWith('.json'));
  
  return files.map(file => {
    try {
      return JSON.parse(readFileSync(join(tracesDir, file), 'utf8'));
    } catch {
      return null;
    }
  }).filter(Boolean);
}

/**
 * Main entry point for hook execution
 * Reads from stdin, processes, saves trace
 */
export function processTraceInput(raw) {
  if (!raw.trim()) {
    return null;
  }

  const input = JSON.parse(raw);
  const trace = captureAutoresearchTrace(input);
  return { traceSaved: true, traceId: trace.metadata.traceId };
}

function main() {
  try {
    const result = processTraceInput(readFileSync(0, 'utf8'));
    if (result) {
      console.log(JSON.stringify(result));
    }
  } catch (error) {
    console.error(`Invalid JSON input: ${error.message}`);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default captureAutoresearchTrace;
