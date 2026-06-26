#!/usr/bin/env node
/**
 * ArcKit Self-Harness Harness Proposer
 * 
 * Implements diverse, minimal candidate harness modification generation
 * Based on: "Self-Harness: Harnesses That Improve Themselves" (Zhang et al., 2026, arXiv:2606.09498v1)
 * 
 * Specifically implements Section 3.3: Harness Proposal from the Self-Harness paper.
 * Generates diverse yet minimal harness modifications tied to identified failure mechanisms.
 * 
 * Key principles from Zhang et al. (2026, Section 3.3):
 * - Diversity: Candidates must be materially distinct
 * - Minimality: Each edit modifies only the surface needed
 * - Grounded: Each proposal tied to a specific failure mechanism
 * - Addressable: Only propose changes for addressable surfaces
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generate harness improvement proposals
 * 
 * @param {Object} options - Proposal options
 * @param {string} options.command - Target command/agent/hook
 * @param {string} options.mode - Optimization mode (prompt, full, agent, hook)
 * @param {Array} options.clusters - Top failure clusters from weakness miner
 * @param {number} options.numCandidates - Number of candidates to generate (default: 3)
 * @param {string} options.currentHarnessPath - Path to current harness file
 * @param {Object} options.resultsHistory - Previous results for context
 * @returns {Array} Array of proposal objects
 */
export function generateProposals(options) {
  const {
    command,
    mode = 'prompt',
    clusters = [],
    numCandidates = 3,
    currentHarnessPath,
    resultsHistory = {}
  } = options;
  
  const proposals = [];
  const usedClusters = new Set();
  const usedSurfaces = new Set();
  const usedMechanisms = new Set();
  
  // Sort clusters by frequency (descending)
  const sortedClusters = [...clusters].sort((a, b) => b.count - a.count);
  
  // Generate candidates
  for (let i = 0; i < numCandidates && i < sortedClusters.length; i++) {
    const cluster = sortedClusters[i];
    
    // Track diversity constraints
    if (usedClusters.has(cluster.id) || 
        usedMechanisms.has(cluster.signature.mechanism)) {
      continue;
    }
    
    // Select an addressable surface for this cluster
    const surface = selectSurface(cluster, usedSurfaces);
    if (!surface) continue;
    
    // Generate proposal based on cluster and surface
    const proposal = generateProposalForCluster(cluster, surface, mode, currentHarnessPath, resultsHistory);
    
    if (proposal) {
      proposals.push(proposal);
      usedClusters.add(cluster.id);
      usedSurfaces.add(surface);
      usedMechanisms.add(cluster.signature.mechanism);
    }
  }
  
  // If we don't have enough candidates, generate from history
  while (proposals.length < numCandidates) {
    const historicalProposal = generateFromHistory(resultsHistory, mode, usedSurfaces, usedMechanisms);
    if (historicalProposal) {
      proposals.push(historicalProposal);
      usedSurfaces.add(historicalProposal.surface);
      usedMechanisms.add(historicalProposal.cluster?.signature?.mechanism || 'unknown');
    } else {
      break;
    }
  }
  
  return proposals;
}

/**
 * Select best surface for a cluster
 */
function selectSurface(cluster, usedSurfaces) {
  const { addressableSurfaces = [] } = cluster;
  
  // Filter out already used surfaces
  const availableSurfaces = addressableSurfaces.filter(s => !usedSurfaces.has(s));
  
  if (availableSurfaces.length === 0) {
    // Try any surface if all used
    return addressableSurfaces[0];
  }
  
  // Prefer surfaces that are most addressable for this cluster
  // Order: prompt > context_injection > runtime_policy > verification_rules > templates
  const surfacePriority = {
    'prompt': 0,
    'context_injection': 1,
    'bootstrap_instruction': 1,
    'runtime_policy': 2,
    'tool_restrictions': 2,
    'verification_rules': 3,
    'templates': 4
  };
  
  availableSurfaces.sort((a, b) => 
    (surfacePriority[a] || 999) - (surfacePriority[b] || 999)
  );
  
  return availableSurfaces[0];
}

/**
 * Generate a proposal for a specific cluster and surface
 */
function generateProposalForCluster(cluster, surface, mode, currentHarnessPath, resultsHistory) {
  const { signature, count, frequency, severity } = cluster;
  const { verifierCause, agentBehavior, mechanism } = signature;
  
  // Read current harness
  let currentContent = '';
  if (currentHarnessPath && existsSync(currentHarnessPath)) {
    currentContent = readFileSync(currentHarnessPath, 'utf8');
  }
  
  // Generate proposal based on surface and mechanism
  const proposal = {
    id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    cluster: {
      id: cluster.id,
      count,
      frequency,
      severity,
      signature
    },
    surface,
    mechanism,
    description: '',
    changes: [],
    expectedImpact: '',
    risk: '',
    mode
  };
  
  // Generate surface-specific proposal
  switch (surface) {
    case 'prompt':
      generatePromptProposal(proposal, currentContent, verifierCause, mechanism);
      break;
    case 'context_injection':
      generateContextProposal(proposal, currentContent, mechanism);
      break;
    case 'bootstrap_instruction':
      generateBootstrapProposal(proposal, currentContent, mechanism);
      break;
    case 'runtime_policy':
      generateRuntimeProposal(proposal, currentContent, mechanism);
      break;
    case 'tool_restrictions':
      generateToolProposal(proposal, currentContent, mechanism);
      break;
    case 'verification_rules':
      generateVerificationProposal(proposal, currentContent, mechanism);
      break;
    case 'templates':
      generateTemplateProposal(proposal, currentContent, mechanism);
      break;
    default:
      return null; // Unknown surface
  }
  
  // Apply mode-specific adjustments
  applyModeAdjustments(proposal, mode, currentHarnessPath);
  
  return proposal;
}

/**
 * Generate prompt modification proposal
 */
function generatePromptProposal(proposal, currentContent, verifierCause, mechanism) {
  const { cluster } = proposal;
  
  // Analyze current prompt
  const hasCrossRefs = currentContent.includes('cross-reference') || 
                       currentContent.includes('ARC-') ||
                       currentContent.includes('BR-') ||
                       currentContent.includes('FR-');
  
  const hasExamples = currentContent.includes('Example:') || 
                      currentContent.includes('For example');
  
  const hasContext = currentContent.includes('project') || 
                     currentContent.includes('context');
  
  // Generate based on mechanism
  switch (mechanism) {
    case 'missing_guidance':
      if (!hasCrossRefs) {
        proposal.description = 'Add explicit cross-reference requirements';
        proposal.changes = [{
          type: 'add',
          location: 'end of instructions',
          content: 'ALWAYS include at least 3 cross-references to other artifacts (use format: See [ARC-XXX-TYPE-v1.0] for details)'
        }];
        proposal.expectedImpact = 'Improve traceability score by 0.5-1.0';
        proposal.risk = 'Low';
      } else {
        proposal.description = 'Strengthen cross-reference guidance';
        proposal.changes = [{
          type: 'modify',
          pattern: 'cross-reference',
          replacement: 'cross-reference to at least 3 other artifacts in this project'
        }];
        proposal.expectedImpact = 'Improve traceability score by 0.3-0.5';
        proposal.risk = 'Low';
      }
      break;
    
    case 'insufficient_context':
      if (!hasContext) {
        proposal.description = 'Add project context injection requirement';
        proposal.changes = [{
          type: 'add',
          location: 'beginning of instructions',
          content: 'BEGIN by reading all existing project artifacts to establish context. Reference specific project details in your output.'
        }];
        proposal.expectedImpact = 'Improve specificity score by 0.5-1.0';
        proposal.risk = 'Low';
      } else {
        proposal.description = 'Strengthen context requirements';
        proposal.changes = [{
          type: 'add',
          location: 'beginning of instructions',
          content: 'For every section, include at least one specific reference to existing project artifacts or requirements.'
        }];
        proposal.expectedImpact = 'Improve specificity and traceability scores';
        proposal.risk = 'Low';
      }
      break;
    
    case 'cross_ref_missing':
      proposal.description = 'Add cross-reference reminder in each section header';
      proposal.changes = [{
        type: 'add',
        location: 'section template',
        content: '## {Section Name}\n\n[Cross-reference: Add links to related artifacts here]'
      }];
      proposal.expectedImpact = 'Ensure all sections have cross-references';
      proposal.risk = 'Low';
      break;
    
    case 'format_violation':
      proposal.description = 'Add explicit format requirements';
      proposal.changes = [{
        type: 'add',
        location: 'instructions',
        content: 'FORMAT REQUIREMENTS:\n- Document ID must follow ARC-NNN-TYPE-vX.Y pattern\n- All tables must have headers\n- Use Markdown lists for enumerations'
      }];
      proposal.expectedImpact = 'Reduce structural failures';
      proposal.risk = 'Low';
      break;
    
    case 'generic_output':
      proposal.description = 'Ban generic placeholder text';
      proposal.changes = [{
        type: 'add',
        location: 'instructions',
        content: 'NEVER use placeholder text like "TBD", "TODO", "example", or "sample". All content must be project-specific.'
      }];
      proposal.expectedImpact = 'Improve specificity and completeness scores';
      proposal.risk = 'Low';
      break;
    
    default:
      // Generic prompt improvement
      proposal.description = 'Add completeness checklist';
      proposal.changes = [{
        type: 'add',
        location: 'end of instructions',
        content: 'BEFORE FINALIZING:\n- [ ] All required sections are present\n- [ ] All cross-references are correct\n- [ ] Document Control table is complete\n- [ ] No placeholder text remains'
      }];
      proposal.expectedImpact = 'Improve completeness and reduce errors';
      proposal.risk = 'Low';
  }
}

/**
 * Generate context injection proposal
 */
function generateContextProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Add automated context injection';
  
  switch (mechanism) {
    case 'insufficient_context':
      proposal.changes = [{
        type: 'add',
        location: 'bootstrap',
        content: 'Auto-inject project context: Read all ARC-* files from projects/{project}/ before generating output'
      }];
      proposal.expectedImpact = 'Improve specificity by providing more context';
      break;
    case 'cross_ref_missing':
      proposal.changes = [{
        type: 'add',
        location: 'bootstrap',
        content: 'Auto-inject cross-reference context: Provide list of all existing artifacts with their IDs'
      }];
      proposal.expectedImpact = 'Improve traceability by making references available';
      break;
    default:
      proposal.changes = [{
        type: 'add',
        location: 'bootstrap',
        content: 'Auto-inject: Project principles, stakeholder analysis, existing requirements'
      }];
      proposal.expectedImpact = 'Improve project-specific output';
  }
  
  proposal.risk = 'Low';
}

/**
 * Generate bootstrap instruction proposal
 */
function generateBootstrapProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Modify bootstrap instruction';
  
  switch (mechanism) {
    case 'early_termination':
      proposal.changes = [{
        type: 'modify',
        location: 'bootstrap_instruction',
        current: 'Start by inspecting the workspace',
        replacement: 'Start by identifying ALL required output artifacts and create initial versions early'
      }];
      proposal.expectedImpact = 'Prevent early termination by setting expectations';
      break;
    case 'insufficient_exploration':
      proposal.changes = [{
        type: 'modify',
        location: 'bootstrap_instruction',
        current: 'Start by inspecting the workspace',
        replacement: 'Start by thoroughly exploring all relevant project artifacts and external resources'
      }];
      proposal.expectedImpact = 'Encourage more complete exploration';
      break;
    default:
      proposal.changes = [{
        type: 'add',
        location: 'bootstrap_instruction',
        content: 'Identify the smallest relevant edit surface for this task'
      }];
      proposal.expectedImpact = 'Improve focus and efficiency';
  }
  
  proposal.risk = 'Low';
}

/**
 * Generate runtime policy proposal
 */
function generateRuntimeProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Modify runtime policy';
  
  switch (mechanism) {
    case 'unbounded_exploration':
    case 'excessive_tool_use':
      proposal.changes = [{
        type: 'add',
        location: 'runtime_policy',
        content: 'max_total_tool_messages: 15'
      }];
      proposal.expectedImpact = 'Prevent runaway tool use and timeouts';
      proposal.risk = 'Low';
      break;
    case 'repetitive_actions':
      proposal.changes = [{
        type: 'add',
        location: 'runtime_policy',
        content: 'max_recent_tool_errors: 3'
      }];
      proposal.expectedImpact = 'Prevent repetitive failed actions';
      proposal.risk = 'Low';
      break;
    default:
      proposal.changes = [{
        type: 'add',
        location: 'runtime_policy',
        content: 'enabled: true'
      }];
      proposal.expectedImpact = 'Enable basic runtime constraints';
      proposal.risk = 'Low';
  }
}

/**
 * Generate tool restrictions proposal
 */
function generateToolProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Modify tool configuration';
  
  switch (mechanism) {
    case 'wrong_tool_selection':
      proposal.changes = [{
        type: 'restrict',
        tools: ['Bash', 'WebSearch'],
        action: 'require_justification',
        content: 'Before using Bash or WebSearch, explain why it is necessary'
      }];
      proposal.expectedImpact = 'Reduce incorrect tool usage';
      break;
    case 'execution_error':
      proposal.changes = [{
        type: 'disable',
        tools: ['Bash'],
        content: 'Disable Bash tool for this command'
      }];
      proposal.expectedImpact = 'Prevent dangerous operations';
      proposal.risk = 'Medium - may limit functionality';
      break;
    default:
      proposal.changes = [{
        type: 'add_tool',
        tools: ['WebSearch'],
        content: 'Enable WebSearch for external research'
      }];
      proposal.expectedImpact = 'Enable additional research capabilities';
  }
  
  if (!proposal.risk) proposal.risk = 'Low';
}

/**
 * Generate verification rules proposal
 */
function generateVerificationProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Add/strengthen verification rules';
  
  switch (mechanism) {
    case 'format_violation':
    case 'invalid_id_format':
      proposal.changes = [{
        type: 'add',
        rule: 'id_format_check',
        content: 'Verify Document ID matches ARC-NNN-TYPE-vX.Y pattern'
      }];
      proposal.expectedImpact = 'Catch format violations early';
      break;
    case 'missing_sections':
      proposal.changes = [{
        type: 'add',
        rule: 'section_completeness',
        content: 'Verify all template sections are present and non-empty'
      }];
      proposal.expectedImpact = 'Ensure complete documents';
      break;
    default:
      proposal.changes = [{
        type: 'add',
        rule: 'cross_reference_check',
        content: 'Verify at least 3 cross-references to other artifacts'
      }];
      proposal.expectedImpact = 'Improve traceability';
  }
  
  proposal.risk = 'Low';
}

/**
 * Generate template proposal
 */
function generateTemplateProposal(proposal, currentContent, mechanism) {
  proposal.description = 'Modify template';
  
  switch (mechanism) {
    case 'missing_guidance':
      proposal.changes = [{
        type: 'add',
        location: 'section headers',
        content: 'Add guidance text to each section header'
      }];
      proposal.expectedImpact = 'Provide clearer section expectations';
      break;
    case 'cross_ref_missing':
      proposal.changes = [{
        type: 'add',
        location: 'all sections',
        content: 'Add "Related Artifacts:" field to each section'
      }];
      proposal.expectedImpact = 'Encourage cross-referencing';
      break;
    default:
      proposal.changes = [{
        type: 'add',
        location: 'header',
        content: 'Add explicit cross-reference requirements'
      }];
      proposal.expectedImpact = 'Clarify expectations';
  }
  
  proposal.risk = 'Low';
}

/**
 * Apply mode-specific adjustments
 */
function applyModeAdjustments(proposal, mode, currentHarnessPath) {
  switch (mode) {
    case 'agent':
      // For agent mode, proposals affect agent definition
      proposal.targetFile = `plugins/arckit-claude/agents/${proposal.cluster?.target || 'agent'}.md`;
      break;
    case 'hook':
      // For hook mode, proposals affect hook file
      const hookName = basename(currentHarnessPath, '.mjs');
      proposal.targetFile = `plugins/arckit-claude/hooks/${hookName}.mjs`;
      break;
    case 'full':
      // For full mode, determine which file to modify
      proposal.targetFile = determineTargetFile(proposal.surface, currentHarnessPath);
      break;
    default:
      // Prompt mode - default
      proposal.targetFile = currentHarnessPath;
  }
}

/**
 * Determine which file to modify for full mode
 */
function determineTargetFile(surface, currentHarnessPath) {
  const surfaceToFile = {
    'prompt': currentHarnessPath,
    'context_injection': 'hooks/arckit-context.mjs',
    'bootstrap_instruction': 'commands/bootstrap.md',
    'runtime_policy': 'hooks/runtime-policy.mjs',
    'tool_restrictions': '.mcp.json',
    'verification_rules': 'hooks/verification-rules.mjs',
    'templates': 'templates/standard-template.md'
  };
  
  return surfaceToFile[surface] || currentHarnessPath;
}

/**
 * Generate proposal from results history
 */
function generateFromHistory(resultsHistory, mode, usedSurfaces, usedMechanisms) {
  const history = Object.values(resultsHistory);
  
  // Find near-misses (discards with high scores)
  const nearMisses = history.filter(h => 
    h.status === 'discard' && 
    h.score > 8.0 &&
    !usedMechanisms.has(h.cluster?.signature?.mechanism)
  );
  
  if (nearMisses.length > 0) {
    // Pick highest-scoring near-miss
    nearMisses.sort((a, b) => b.score - a.score);
    const nearMiss = nearMisses[0];
    
    return {
      id: `hist-${Date.now()}`,
      cluster: nearMiss.cluster,
      surface: nearMiss.surface || 'prompt',
      mechanism: nearMiss.cluster?.signature?.mechanism || 'unknown',
      description: `Retry near-miss: ${nearMiss.description}`,
      changes: nearMiss.changes || [],
      expectedImpact: `Potential improvement based on previous score of ${nearMiss.score}`,
      risk: 'Low - previously tested',
      mode,
      targetFile: nearMiss.targetFile,
      isHistorical: true
    };
  }
  
  return null;
}

/**
 * Format proposal for display
 */
export function formatProposal(proposal, index) {
  return `
Proposal #${index + 1}: ${proposal.id}
  Cluster: ${proposal.cluster?.id} (${proposal.cluster?.signature?.mechanism})
  Surface: ${proposal.surface}
  Description: ${proposal.description}
  Target File: ${proposal.targetFile || 'N/A'}
  Expected Impact: ${proposal.expectedImpact}
  Risk: ${proposal.risk}
  Changes: ${proposal.changes.length} modification(s)
`.trim();
}

/**
 * Apply a proposal to a harness file
 */
export function applyProposal(proposal, harnessPath) {
  if (!existsSync(harnessPath)) {
    throw new Error(`Harness file not found: ${harnessPath}`);
  }
  
  let content = readFileSync(harnessPath, 'utf8');
  const originalContent = content;
  
  // Apply changes in order
  for (const change of proposal.changes) {
    content = applyChange(content, change);
  }
  
  // Write modified content
  writeFileSync(harnessPath, content);
  
  return {
    originalContent,
    modifiedContent: content,
    changesApplied: proposal.changes.length
  };
}

/**
 * Apply a single change to content
 */
function applyChange(content, change) {
  switch (change.type) {
    case 'add':
      // Add at specific location
      if (change.location === 'beginning') {
        return change.content + '\n\n' + content;
      } else if (change.location === 'end') {
        return content + '\n\n' + change.content;
      } else if (change.location.includes('of')) {
        // Insert at section
        const section = change.location.split(' of ')[0];
        const afterPattern = new RegExp(`(#{1,3}\\s+${section}[\\s\\S]*?)\\n\\n`);
        const match = content.match(afterPattern);
        if (match) {
          const before = content.substring(0, match.index + match[0].length);
          const after = content.substring(match.index + match[0].length);
          return before + change.content + '\n\n' + after;
        }
      }
      // Default: append
      return content + '\n\n' + change.content;
    
    case 'modify':
      // Replace pattern
      if (change.pattern) {
        const regex = new RegExp(change.pattern, 'i');
        return content.replace(regex, change.replacement);
      }
      // Replace current with replacement
      if (change.current) {
        return content.replace(change.current, change.replacement);
      }
      return content;
    
    case 'remove':
      // Remove pattern
      if (change.pattern) {
        const regex = new RegExp(change.pattern, 'i');
        return content.replace(regex, '');
      }
      return content;
    
    case 'restrict':
    case 'disable':
    case 'add_tool':
      // Tool configuration changes
      return modifyToolConfig(content, change);
    
    default:
      return content;
  }
}

/**
 * Modify tool configuration in .mcp.json or similar
 */
function modifyToolConfig(content, change) {
  try {
    const config = JSON.parse(content);
    
    switch (change.type) {
      case 'restrict':
        config.toolRestrictions = config.toolRestrictions || {};
        change.tools.forEach(t => {
          config.toolRestrictions[t] = {
            action: change.action || 'require_justification',
            reason: change.content || ''
          };
        });
        break;
      case 'disable':
        if (config.mcpServers) {
          if (Array.isArray(config.mcpServers)) {
            config.mcpServers = config.mcpServers.filter(s =>
              !change.tools.includes(s));
          } else {
            change.tools.forEach(t => {
              delete config.mcpServers[t];
            });
          }
        }
        config.disabledTools = Array.from(new Set([
          ...(config.disabledTools || []),
          ...change.tools
        ]));
        break;
      case 'add_tool':
        config.allowedTools = Array.from(new Set([
          ...(config.allowedTools || []),
          ...change.tools
        ]));
        if (Array.isArray(config.mcpServers)) {
          change.tools.forEach(t => {
            if (!config.mcpServers.includes(t)) {
              config.mcpServers.push(t);
            }
          });
        }
        break;
    }
    
    return JSON.stringify(config, null, 2);
  } catch {
    return content; // Not JSON, return unchanged
  }
}

/**
 * Main entry point
 */
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node harness-proposer.mjs <options.json> [numCandidates]');
    console.log('  options.json: {"command": "...", "mode": "...", "clusters": [...], "currentHarnessPath": "..."}');
    process.exit(1);
  }
  
  const optionsPath = args[0];
  const numCandidates = args[1] ? parseInt(args[1]) : 3;
  
  try {
    const options = JSON.parse(readFileSync(optionsPath, 'utf8'));
    options.numCandidates = numCandidates;
    
    const proposals = generateProposals(options);
    
    console.log(JSON.stringify(proposals, null, 2));
    
    // Also print summary
    console.error(`\nGenerated ${proposals.length} proposals:\n`);
    proposals.forEach((p, i) => {
      console.error(formatProposal(p, i));
      console.error('');
    });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default generateProposals;
