/**
 * ArcKit Hook Utilities — Shared module for all hooks
 *
 * Extracts common file-system helpers, repo discovery, doc-type parsing,
 * metadata extraction, and stdin/JSON parsing so each hook can import
 * them instead of copy-pasting ~80 lines of identical code.
 *
 * Issue #98: "Reusable utilities could be extracted into a shared
 * hook-utils.mjs module as the hook count grows."
 */

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { DOC_TYPES } from '../config/doc-types.mjs';

// ── File System ──

export function isDir(p) {
  try { return statSync(p).isDirectory(); } catch { return false; }
}

export function isFile(p) {
  try { return statSync(p).isFile(); } catch { return false; }
}

export function readText(p) {
  try { return readFileSync(p, 'utf8'); } catch { return null; }
}

export function listDir(p) {
  try { return readdirSync(p).sort(); } catch { return []; }
}

export function mtimeMs(p) {
  try { return statSync(p).mtimeMs; } catch { return 0; }
}

// ── Repository Discovery ──

export function findRepoRoot(cwd) {
  let current = resolve(cwd);
  while (true) {
    if (isDir(join(current, 'projects'))) return current;
    const parent = resolve(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return null;
}

// ── Doc Type Extraction ──

// Derive compound types from DOC_TYPES config instead of hardcoding
const COMPOUND_TYPES = Object.keys(DOC_TYPES).filter(k => k.includes('-'));

export function extractDocType(filename) {
  const m = filename.match(/^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$/);
  if (!m) return null;
  let rest = m[1];

  // Try compound types first (e.g. SECD-MOD, PRIN-COMP)
  for (const code of COMPOUND_TYPES) {
    if (rest.startsWith(code)) return code;
  }

  // Strip trailing -NNN for multi-instance types (ADR-001, DIAG-002)
  rest = rest.replace(/-\d{3}$/, '');
  return rest;
}

export function extractVersion(filename) {
  const m = filename.match(/-v(\d+(?:\.\d+)?)\.md$/);
  return m ? m[1] : null;
}

// ── Metadata Extraction ──

const DOC_CONTROL_RE = /^\|\s*\*\*([^*]+)\*\*\s*\|\s*(.+?)\s*\|/;
// Accept 1-3 digit IDs so cross-references in non-REQ artifacts (e.g.
// "Relates To: BR-1, FR-3" in an RSCH/RISK/STKE/SOBC) populate node.reqIds
// even when the REQ document uses non-padded IDs. Cross-namespace collisions
// (e.g. Azure Security Benchmark "Backup & Recovery" historically used BR-1)
// are handled by renaming the colliding IDs in the colliding templates rather
// than constraining the scanner — see arckit-claude/templates/azure-research-template.md.
const REQ_ID_PATTERN = /\b(BR-\d{1,3}|FR-\d{1,3}|NFR-[A-Z]+-\d{1,3}|NFR-\d{1,3}|INT-\d{1,3}|DR-\d{1,3})\b/g;

export function extractDocControlFields(content) {
  const fields = {};
  for (const line of content.split('\n')) {
    const m = line.match(DOC_CONTROL_RE);
    if (m) {
      fields[m[1].trim()] = m[2].trim();
    }
  }
  return fields;
}

export function extractRequirementIds(content) {
  const ids = new Set();
  let m;
  const re = new RegExp(REQ_ID_PATTERN.source, 'g');
  while ((m = re.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

// ── Requirement Detail Extraction ──

/**
 * Parse requirement headings and details from a REQ document.
 * Looks for ### ID: Description headings and priority markers.
 * Returns array of { id, category, description, priority }
 */
export function extractRequirementDetails(content) {
  const requirements = [];
  const lines = content.split('\n');

  // Map prefix to category
  const categoryMap = {
    'BR': 'Business',
    'FR': 'Functional',
    'NFR': 'Non-Functional',
    'INT': 'Integration',
    'DR': 'Data',
  };

  // Pattern for requirement headings: ### or #### BR-001: Description text
  // Template uses ### for BR, #### for FR/NFR/INT/DR — match both levels
  const headingRe = /^#{3,4}\s+((?:BR|FR|NFR(?:-[A-Z]+)?|INT|DR)-\d{1,3}):\s*(.+)/;
  // Priority patterns in table rows or inline markers
  const priorityRe = /\b(MUST|SHOULD|MAY)\b/;

  for (let i = 0; i < lines.length; i++) {
    const headingMatch = lines[i].match(headingRe);
    if (!headingMatch) continue;

    const id = headingMatch[1];
    const description = headingMatch[2].trim();

    // Determine category from prefix
    let category = 'Unknown';
    for (const [prefix, cat] of Object.entries(categoryMap)) {
      if (id.startsWith(prefix)) {
        category = cat;
        break;
      }
    }

    // Look for priority in the next ~10 lines (table rows, inline text)
    let priority = 'SHOULD'; // default
    for (let j = i + 1; j < Math.min(i + 11, lines.length); j++) {
      // Stop if we hit another heading (h2, h3, or h4)
      if (/^#{2,4}\s+/.test(lines[j])) break;
      const pMatch = lines[j].match(priorityRe);
      if (pMatch) {
        priority = pMatch[1];
        break;
      }
    }

    requirements.push({ id, category, description, priority });
  }

  // Merge: also extract IDs via regex to catch requirements not under headings
  // (e.g. table rows, inline references, or unexpected heading levels)
  const headingIds = new Set(requirements.map(r => r.id));
  const allIds = extractRequirementIds(content);
  for (const id of allIds) {
    if (headingIds.has(id)) continue; // already captured via heading
    let category = 'Unknown';
    for (const [prefix, cat] of Object.entries(categoryMap)) {
      if (id.startsWith(prefix)) {
        category = cat;
        break;
      }
    }
    requirements.push({ id, category, description: '(extracted from content)', priority: 'SHOULD' });
  }

  return requirements;
}

// ── Principles Extraction ──

/**
 * Parse PRIN files for principle entries.
 * Extracts principle number, title, category, statement, and validation gate counts.
 * Returns array of { id, title, category, statement, gateCount, gatesPassed }
 */
export function extractPrinciples(content) {
  const principles = [];
  const lines = content.split('\n');

  let currentCategory = '';

  for (let i = 0; i < lines.length; i++) {
    // Category headings: ## N. Category Principles
    const catMatch = lines[i].match(/^##\s+\d+\.\s+(.+?)\s*Principles?\s*$/i);
    if (catMatch) {
      currentCategory = catMatch[1].trim();
      continue;
    }

    // Principle headings: ### N. Title
    const prinMatch = lines[i].match(/^###\s+(\d+)\.\s+(.+)/);
    if (!prinMatch) continue;

    const id = prinMatch[1];
    const title = prinMatch[2].trim();

    // Extract principle statement from **Principle Statement**: blocks in next ~15 lines
    let statement = '';
    let gateCount = 0;
    let gatesPassed = 0;

    for (let j = i + 1; j < Math.min(i + 40, lines.length); j++) {
      // Stop if we hit another h2 or h3
      if (/^#{2,3}\s+/.test(lines[j])) break;

      // Principle statement
      const stmtMatch = lines[j].match(/\*\*Principle Statement\*\*:\s*(.+)/i);
      if (stmtMatch) {
        statement = stmtMatch[1].trim();
      }

      // Count validation gates (checked [x] and unchecked [ ])
      if (/\[x\]/i.test(lines[j])) {
        gateCount = gateCount + 1;
        gatesPassed = gatesPassed + 1;
      } else if (/\[\s\]/.test(lines[j])) {
        gateCount = gateCount + 1;
      }
    }

    principles.push({ id, title, category: currentCategory, statement, gateCount, gatesPassed });
  }

  return principles;
}

// ── Risk Entry Extraction ──

/**
 * Parse RISK files for risk entries.
 * Extracts from ranked table rows and fallback heading format.
 * Returns array of { id, title, category, inherent, residual, owner, status, response }
 */
export function extractRiskEntries(content) {
  const risks = [];
  const seenIds = new Set();
  const lines = content.split('\n');

  // Try table rows first: | R-NNN | Title | Category | ... |
  const tableRe = /^\|\s*(R-\d{3})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/;
  for (const line of lines) {
    const m = line.match(tableRe);
    if (!m) continue;
    // Skip header rows
    if (m[1] === 'R-NNN' || /^-+$/.test(m[2].trim())) continue;
    if (seenIds.has(m[1])) continue;
    seenIds.add(m[1]);
    risks.push({
      id: m[1],
      title: m[2].trim(),
      category: m[3].trim(),
      inherent: m[4].trim(),
      residual: m[5].trim(),
      owner: m[6].trim(),
      status: m[7].trim(),
      response: m[8].trim(),
    });
  }

  // Fallback: ### Risk R-001: Title headings
  const headingRe = /^###\s+Risk\s+(R-\d{3}):\s*(.+)/i;
  for (let i = 0; i < lines.length; i++) {
    const hm = lines[i].match(headingRe);
    if (!hm || seenIds.has(hm[1])) continue;
    seenIds.add(hm[1]);

    // Scan next ~15 lines for metadata
    let category = '', inherent = '', residual = '', owner = '', status = '', response = '';
    for (let j = i + 1; j < Math.min(i + 16, lines.length); j++) {
      if (/^#{2,3}\s+/.test(lines[j])) break;
      const kvMatch = lines[j].match(/\*\*(.+?)\*\*:\s*(.+)/);
      if (!kvMatch) continue;
      const key = kvMatch[1].toLowerCase();
      const val = kvMatch[2].trim();
      if (key.includes('category')) category = val;
      else if (key.includes('inherent')) inherent = val;
      else if (key.includes('residual')) residual = val;
      else if (key.includes('owner')) owner = val;
      else if (key.includes('status')) status = val;
      else if (key.includes('response')) response = val;
    }

    risks.push({ id: hm[1], title: hm[2].trim(), category, inherent, residual, owner, status, response });
  }

  return risks;
}

// ── Hook Input ──

/**
 * Read stdin and parse as JSON. Exits the process silently on any failure
 * (empty stdin, invalid JSON). This consolidates the 12-line pattern that
 * every hook repeats.
 *
 * @returns {object} Parsed hook input data
 */
export function parseHookInput() {
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
  return data;
}
