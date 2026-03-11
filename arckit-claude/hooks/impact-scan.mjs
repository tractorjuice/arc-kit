#!/usr/bin/env node
/**
 * ArcKit Impact Analysis Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:impact commands.
 * Builds a dependency graph from cross-references between ARC documents,
 * enabling reverse traversal to determine the blast radius of changes.
 *
 * Hook Type: UserPromptSubmit (sync)
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing dependency graph
 */

import { join } from 'node:path';
import { isDir, findRepoRoot, parseHookInput } from './hook-utils.mjs';
import { scanAllArtifacts } from './graph-utils.mjs';

// ── Argument parsing ──

function parseArguments(prompt) {
  const text = prompt.replace(/^\/arckit[.:]+impact\s*/i, '');
  return text.trim();
}

// ── Main ──

const data = parseHookInput();

// Guard: only fire for /arckit:impact
const userPrompt = data.prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+impact\b/i.test(userPrompt);
const isExpandedBody = /description:\s*Analyse the blast radius/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

const query = parseArguments(userPrompt);

// Find repo root
const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const projectsDir = join(repoRoot, 'projects');
if (!isDir(projectsDir)) process.exit(0);

// Build dependency graph
const { nodes, edges, reqIndex, projects } = scanAllArtifacts(projectsDir);

const nodeCount = Object.keys(nodes).length;
const edgeCount = edges.length;
const reqCount = Object.keys(reqIndex).length;

// Build output
const lines = [];
lines.push('## Impact Pre-processor Complete (hook)');
lines.push('');
lines.push(`**Dependency graph built: ${nodeCount} documents, ${edgeCount} cross-references, ${reqCount} requirement IDs across ${projects.length} project(s).**`);
lines.push('');
lines.push(`**User query:** ${query || '(no query provided)'}`);
lines.push('');
lines.push('### DEPENDENCY GRAPH (JSON)');
lines.push('');
lines.push('```json');
lines.push(JSON.stringify({ nodes, edges, reqIndex }, null, 2));
lines.push('```');
lines.push('');
lines.push('### Impact Severity Classification');
lines.push('| Category | Severity | Document Types |');
lines.push('|----------|----------|---------------|');
lines.push('| Compliance/Governance | HIGH | TCOP, SECD, DPIA, SVCASS, RISK, TRAC, CONF |');
lines.push('| Architecture | MEDIUM | HLDR, DLDR, ADR, DATA, DIAG, PLAT |');
lines.push('| Planning/Other | LOW | PLAN, ROAD, BKLG, SOBC, OPS, PRES |');
lines.push('');
lines.push('### Instructions');
lines.push('- Parse query: ARC document ID, requirement ID (e.g. BR-003), or type+project');
lines.push('- Perform reverse traversal through edges (max depth 5)');
lines.push('- Classify impact severity using node severity field');
lines.push('- Output impact chain table, summary counts, and recommended actions');
lines.push('- Suggest specific /arckit commands to re-run for HIGH severity impacts');

const message = lines.join('\n');

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: message,
  },
};
console.log(JSON.stringify(output));
