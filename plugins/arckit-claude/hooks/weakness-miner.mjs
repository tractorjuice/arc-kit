#!/usr/bin/env node
/**
 * ArcKit Self-Harness Weakness Miner
 * 
 * Implements verifier-grounded failure signature extraction and clustering
 * Based on: "Self-Harness: Harnesses That Improve Themselves" (Zhang et al., 2026, arXiv:2606.09498v1)
 * 
 * Specifically implements Section 3.2: Weakness Mining from the Self-Harness paper.
 * This module identifies model-specific failure patterns from execution traces,
 * clusters them by verifier-grounded signatures, and maps them to addressable
 * harness surfaces.
 * 
 * Hook Type: Standalone (called from program-selfharness.md)
 * Input: trace path, verifier output, score
 * Output: weakness analysis with cluster assignment
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Main weakness mining function
 * Implements the Weakness Mining stage from Zhang et al. (2026, Section 3.2)
 * 
 * @param {string} command - Command/agent/hook being optimized
 * @param {number} iteration - Current iteration number
 * @param {string} mode - Optimization mode (prompt, full, agent, hook)
 * @param {string} tracePath - Path to execution trace JSON file
 * @param {Object} verifierOutput - Verifier results
 * @param {number} score - LLM-as-judge score (0-10)
 * @param {number} prevBestScore - Previous best score
 * @returns {Object} Weakness analysis with cluster info
 */
export function mineWeaknesses(command, iteration, mode, tracePath, verifierOutput, score, prevBestScore) {
  // Load the execution trace
  const trace = loadTrace(tracePath);
  
  // Extract failure signature (Zhang et al., 2026, Section 3.2)
  const signature = extractFailureSignature(trace, verifierOutput, score, prevBestScore);
  
  if (!signature) {
    // No weakness detected (score improved sufficiently)
    return {
      iteration,
      hasWeakness: false,
      signature: null,
      cluster: null
    };
  }
  
  // Get or create cluster
  const cluster = getOrCreateCluster(command, mode, signature, iteration);
  
  return {
    iteration,
    hasWeakness: true,
    signature,
    cluster: cluster.id,
    clusterDetails: cluster,
    addressableSurfaces: cluster.addressableSurfaces,
    severity: cluster.severity
  };
}

/**
 * Load execution trace from file
 */
function loadTrace(tracePath) {
  try {
    return JSON.parse(readFileSync(tracePath, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Extract failure signature
 * Based on Zhang et al. (2026, Section 3.2):
 * "The evaluation system analyzes the trace as evidence for why the evaluator
 *  rejected the run. It identifies the terminal failure reason exposed by the
 *  verifier, the agent-side behavior connected to that terminal failure, and
 *  the causal status of that behavior within the trace."
 */
function extractFailureSignature(trace, verifierOutput, score, prevBestScore) {
  // Case 1: Structural failure (score = 0.0)
  if (score === 0.0) {
    return {
      verifierCause: getVerifierCause(verifierOutput),
      agentBehavior: getAgentBehavior(trace),
      mechanism: 'structural_violation'
    };
  }
  
  // Case 2: Discarded (no improvement or negative improvement)
  const improvement = score - prevBestScore;
  if (improvement < 0 || improvement < 0.3) {
    return {
      verifierCause: 'quality_insufficient',
      agentBehavior: getAgentBehavior(trace),
      mechanism: inferMechanism(trace, verifierOutput)
    };
  }
  
  // Case 3: Accepted with marginal improvement
  if (improvement <= 0.3) {
    return {
      verifierCause: 'marginal_improvement',
      agentBehavior: getAgentBehavior(trace),
      mechanism: inferMechanism(trace, verifierOutput)
    };
  }
  
  // No weakness detected
  return null;
}

/**
 * Get verifier cause from structural checks
 * Maps to Zhang et al. (2026) "terminal verifier-level cause"
 */
function getVerifierCause(verifierOutput) {
  const { passed, failures, error } = verifierOutput || {};
  
  if (!passed && failures) {
    if (failures.includes('Document Control')) return 'missing_document_control';
    if (failures.includes('ID format')) return 'invalid_id_format';
    if (failures.includes('Revision History')) return 'missing_revision_history';
    if (failures.includes('footer')) return 'missing_footer';
    if (failures.includes('sections')) return 'missing_sections';
    if (failures.includes('path')) return 'wrong_path';
    if (failures.includes('IDs')) return 'invalid_ids';
    if (failures.includes('Wardley') || failures.includes('wardley')) return 'wardley_math_error';
  }
  
  if (error) {
    return 'execution_error';
  }
  
  return 'unknown';
}

/**
 * Get agent behavior from execution trace
 * Maps to Zhang et al. (2026) "agent-side behavior connected to that terminal failure"
 */
function getAgentBehavior(trace) {
  const { execution, output } = trace || {};
  const { toolCalls = [], durationMs = 0, artifactsCreated = [] } = execution || {};
  
  // Early termination: few tool calls, short duration, incomplete output
  if (toolCalls.length < 3 && durationMs < 10000) {
    if (output && output.length < 500) {
      return 'early_termination';
    }
  }
  
  // Excessive tool use: many tool calls, long duration
  if (toolCalls.length > 20 || durationMs > 120000) {
    return 'excessive_tool_use';
  }
  
  // Wrong tool selection: specific tool patterns
  if (toolCalls.some(tc => tc.name === 'Bash' && tc.command && 
      (tc.command.includes('rm -rf') || tc.command.includes('del ') ||
       tc.command.includes('chmod')))) {
    return 'wrong_tool_selection';
  }
  
  // Repetitive actions: same tool called multiple times with same args
  const toolCallCounts = {};
  toolCalls.forEach(tc => {
    const key = `${tc.name}:${tc.path || tc.query || tc.command || ''}`;
    toolCallCounts[key] = (toolCallCounts[key] || 0) + 1;
  });
  if (Object.values(toolCallCounts).some(count => count > 3)) {
    return 'repetitive_actions';
  }
  
  // Insufficient exploration: few artifacts created
  if (artifactsCreated.length === 0 && toolCalls.length < 5) {
    return 'insufficient_exploration';
  }
  
  // Missing context: output doesn't reference project
  if (output && !output.includes('001') && !output.includes('ARC-')) {
    return 'missing_context';
  }
  
  return 'standard_execution';
}

/**
 * Infer mechanism from trace and verifier output
 * Maps to Zhang et al. (2026) "causal status of that behavior within the trace"
 */
function inferMechanism(trace, verifierOutput) {
  const { output, execution } = trace || {};
  const { toolCalls = [], artifactsCreated = [] } = execution || {};
  const { passed, failures } = verifierOutput || {};
  
  // Structural issues
  if (failures) {
    if (failures.some(f => f.includes('Document Control') || f.includes('Revision') || f.includes('footer'))) {
      return 'missing_guidance';
    }
    if (failures.some(f => f.includes('ID') || f.includes('format'))) {
      return 'format_violation';
    }
    if (failures.some(f => f.includes('Wardley') || f.includes('wardley'))) {
      return 'coordinate_mismatch';
    }
  }
  
  // Content issues
  if (output) {
    // Check for generic output
    const genericPhrases = ['tbd', 'todo', 'placeholder', 'example', 'sample', 'generic'];
    const lowerOutput = output.toLowerCase();
    if (genericPhrases.some(p => lowerOutput.includes(p)) && 
        lowerOutput.includes('placeholder')) {
      return 'insufficient_context';
    }
    
    // Check for cross-references
    if (!lowerOutput.includes('arc-') && !lowerOutput.includes('br-') && 
        !lowerOutput.includes('fr-') && !lowerOutput.includes('nfr-')) {
      return 'cross_ref_missing';
    }
  }
  
  // Tool use issues
  if (toolCalls.length > 15) {
    return 'unbounded_exploration';
  }
  
  // Insufficient context in tools
  if (toolCalls.length > 0 && artifactsCreated.length === 0) {
    return 'insufficient_context';
  }
  
  return 'unknown';
}

/**
 * Get or create cluster for a failure signature
 * Implements clustering by "exact agreement of this signature" (Zhang et al., 2026, Section 3.2)
 */
function getOrCreateCluster(command, mode, signature, iteration) {
  const clustersPath = getClustersPath(command, mode);
  let clusters = loadClusters(clustersPath);
  
  // Find existing cluster with matching signature
  const signatureKey = JSON.stringify(signature);
  let cluster = clusters.find(c => JSON.stringify(c.signature) === signatureKey);
  
  if (!cluster) {
    cluster = createNewCluster(signature, iteration);
    clusters.push(cluster);
  } else {
    // Update existing cluster
    cluster.count++;
    cluster.traces.push(iteration);
  }

  calculateFrequency(clusters);
  saveClusters(clustersPath, clusters);
  
  return cluster;
}

/**
 * Create new cluster from signature
 */
function createNewCluster(signature, iteration) {
  const id = `cluster-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
  
  return {
    id,
    signature,
    count: 1,
    traces: [iteration],
    frequency: 1.0, // Will be recalculated
    addressableSurfaces: mapSignatureToSurfaces(signature),
    severity: determineSeverity(signature),
    createdAt: new Date().toISOString()
  };
}

/**
 * Map failure signature to addressable harness surfaces
 * Based on Zhang et al. (2026) concept that failures should map to
 * "editable surfaces" of the harness
 */
function mapSignatureToSurfaces(signature) {
  const { verifierCause, agentBehavior, mechanism } = signature;
  
  // Mapping based on failure signature components
  const mappings = {
    // Verifier cause mappings
    'missing_document_control': ['prompt', 'templates', 'verification_rules'],
    'invalid_id_format': ['prompt', 'verification_rules', 'templates'],
    'missing_revision_history': ['prompt', 'templates', 'verification_rules'],
    'missing_footer': ['prompt', 'templates', 'verification_rules'],
    'missing_sections': ['prompt', 'templates', 'verification_rules'],
    'wrong_path': ['prompt', 'runtime_policy'],
    'invalid_ids': ['prompt', 'verification_rules'],
    'wardley_math_error': ['verification_rules', 'templates'],
    'execution_error': ['runtime_policy', 'tool_restrictions', 'prompt'],
    'quality_insufficient': ['prompt', 'context_injection'],
    'marginal_improvement': ['prompt', 'effort', 'model'],
    
    // Agent behavior mappings
    'early_termination': ['prompt', 'runtime_policy'],
    'excessive_tool_use': ['runtime_policy', 'tool_restrictions'],
    'insufficient_exploration': ['prompt', 'runtime_policy'],
    'wrong_tool_selection': ['prompt', 'tool_restrictions'],
    'repetitive_actions': ['runtime_policy', 'prompt'],
    'missing_context': ['prompt', 'context_injection', 'bootstrap_instruction'],
    'ignored_guidance': ['prompt'],
    
    // Mechanism mappings
    'structural_violation': ['prompt', 'verification_rules', 'templates'],
    'missing_guidance': ['prompt', 'templates'],
    'unbounded_exploration': ['runtime_policy', 'tool_restrictions'],
    'format_violation': ['verification_rules', 'prompt'],
    'insufficient_context': ['prompt', 'context_injection', 'bootstrap_instruction'],
    'cross_ref_missing': ['prompt', 'context_injection', 'verification_rules'],
    'generic_output': ['prompt', 'context_injection'],
    'coordinate_mismatch': ['verification_rules', 'templates']
  };
  
  const surfaces = new Set();
  
  // Add surfaces based on each component
  if (mappings[verifierCause]) {
    mappings[verifierCause].forEach(s => surfaces.add(s));
  }
  if (mappings[agentBehavior]) {
    mappings[agentBehavior].forEach(s => surfaces.add(s));
  }
  if (mappings[mechanism]) {
    mappings[mechanism].forEach(s => surfaces.add(s));
  }
  
  // Always include 'prompt' as it's the primary editable surface
  surfaces.add('prompt');
  
  return Array.from(surfaces);
}

/**
 * Determine severity based on signature
 */
function determineSeverity(signature) {
  const { verifierCause, mechanism } = signature;
  
  const highSeverity = [
    'structural_violation',
    'execution_error',
    'missing_guidance',
    'format_violation'
  ];
  
  const mediumSeverity = [
    'unbounded_exploration',
    'insufficient_context',
    'cross_ref_missing'
  ];
  
  if (highSeverity.includes(mechanism) || 
      highSeverity.includes(verifierCause)) {
    return 'high';
  }
  
  if (mediumSeverity.includes(mechanism) || 
      mediumSeverity.includes(verifierCause)) {
    return 'medium';
  }
  
  return 'low';
}

/**
 * Calculate cluster frequency (percentage of total failures)
 */
function calculateFrequency(clusters) {
  const total = clusters.reduce((sum, c) => sum + c.count, 0);
  for (const cluster of clusters) {
    cluster.frequency = total > 0 ? cluster.count / total : 0;
  }
  return clusters;
}

/**
 * Get clusters file path
 */
function getClustersPath(command, mode) {
  return join('.arckit', 'autoresearch-traces', command, mode, 'clusters.json');
}

/**
 * Load clusters from file
 */
function loadClusters(clustersPath) {
  try {
    if (existsSync(clustersPath)) {
      return JSON.parse(readFileSync(clustersPath, 'utf8'));
    }
  } catch {
    // Corrupted file, return empty
  }
  return [];
}

/**
 * Save clusters to file
 */
function saveClusters(clustersPath, clusters) {
  try {
    const dir = dirname(clustersPath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    writeFileSync(clustersPath, JSON.stringify(clusters, null, 2));
  } catch (error) {
    process.stderr.write(`[ArcKit-SelfHarness] Error saving clusters: ${error.message}\n`);
  }
}

/**
 * Get all clusters for a command/mode
 */
export function getAllClusters(command, mode) {
  const clustersPath = getClustersPath(command, mode);
  return loadClusters(clustersPath);
}

/**
 * Get top clusters by frequency
 */
export function getTopClusters(command, mode, limit = 5) {
  const clusters = getAllClusters(command, mode);
  return clusters
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Format cluster for display
 */
export function formatCluster(cluster, index) {
  const freqPercent = (cluster.frequency * 100).toFixed(1);
  const signatureStr = JSON.stringify(cluster.signature, null, 2);
  
  return `
Cluster #${index + 1}: ${cluster.id}
  Frequency: ${cluster.count} (${freqPercent}%)
  Severity: ${cluster.severity}
  Signature: ${signatureStr}
  Addressable Surfaces: ${cluster.addressableSurfaces.join(', ')}
  Traces: ${cluster.traces.join(', ')}
`.trim();
}

/**
 * Main entry point
 */
function main() {
  // Read from command line arguments or stdin
  const args = process.argv.slice(2);
  
  if (args.length < 4) {
    console.log('Usage: node weakness-miner.mjs <command> <iteration> <mode> <tracePath> [verifierJson] [score] [prevBestScore]');
    process.exit(1);
  }
  
  const [command, iteration, mode, tracePath, verifierJson, score, prevBestScore] = args;
  
  const verifierOutput = verifierJson ? JSON.parse(verifierJson) : {};
  const scoreNum = score ? parseFloat(score) : 0;
  const prevBestNum = prevBestScore ? parseFloat(prevBestScore) : 0;
  
  const result = mineWeaknesses(command, parseInt(iteration), mode, tracePath, verifierOutput, scoreNum, prevBestNum);
  
  console.log(JSON.stringify(result, null, 2));
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default mineWeaknesses;
