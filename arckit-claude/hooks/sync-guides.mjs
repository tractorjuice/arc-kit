#!/usr/bin/env node
/**
 * ArcKit Pages Pre-processor Hook
 *
 * Fires on UserPromptSubmit for /arckit:pages commands.
 * Performs ALL expensive I/O that the pages command would otherwise do
 * via tool calls, keeping everything outside the context window.
 *
 * What it does:
 * 1. Syncs guide .md files from plugin → repo docs/guides/ (mtime skip)
 * 2. Extracts first # heading from each guide → guideTitles map
 * 3. Reads .git/config → repo name, owner, URL, content base URL
 * 4. Reads plugin VERSION file
 * 5. Processes pages-template.html → writes docs/index.html
 * 6. Scans projects/ → builds and writes docs/manifest.json
 *
 * Hook Type: UserPromptSubmit (sync, not async)
 * Input (stdin): JSON with prompt, cwd, etc.
 * Output (stdout): JSON with additionalContext containing summary
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname, resolve, relative, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOC_TYPES, SUBDIR_MAP } from '../config/doc-types.mjs';
import {
  isDir, isFile, mtimeMs, readText, listDir,
  findRepoRoot, parseHookInput,
} from './hook-utils.mjs';
import { scanAllArtifacts } from './graph-utils.mjs';

function walkMdFiles(baseDir, currentDir = baseDir) {
  const results = [];
  for (const entry of listDir(currentDir)) {
    const fullPath = join(currentDir, entry);
    if (isDir(fullPath)) {
      results.push(...walkMdFiles(baseDir, fullPath));
    } else if (entry.endsWith('.md') && isFile(fullPath)) {
      results.push({ abs: fullPath, rel: relative(baseDir, fullPath) });
    }
  }
  return results;
}

function extractTitle(content, relPath) {
  const lines = content.split('\n', 10);
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)/);
    if (m) {
      let title = m[1].trim();
      if (relPath && relPath.startsWith('roles/')) {
        title = title.replace(/\s*[—–-]\s*ArcKit Command Guide\s*$/i, '');
      }
      return title;
    }
  }
  return null;
}

function extractFirstHeading(filePath) {
  const content = readText(filePath);
  if (!content) return null;
  return extractTitle(content, null);
}

function parseRepoInfo(repoRoot) {
  const info = { repo: basename(repoRoot), owner: '', repoUrl: '', contentBaseUrl: '' };
  const gitConfig = readText(join(repoRoot, '.git', 'config'));
  if (!gitConfig) return info;

  const remoteMatch = gitConfig.match(/\[remote\s+"origin"\][^[]*?url\s*=\s*(.+)/);
  if (!remoteMatch) return info;

  const rawUrl = remoteMatch[1].trim();
  let m = rawUrl.match(/https?:\/\/github\.com\/([^/]+)\/([^/.]+)/);
  if (!m) m = rawUrl.match(/git@github\.com:([^/]+)\/([^/.]+)/);
  if (m) {
    info.owner = m[1];
    info.repo = m[2];
    info.repoUrl = `https://github.com/${m[1]}/${m[2]}`;
    info.contentBaseUrl = `https://raw.githubusercontent.com/${m[1]}/${m[2]}/main`;
  }
  return info;
}

// ── Static data tables (derived from central config) ──

// DOC_TYPE_META: { code: { category, title } } — derived from DOC_TYPES
const DOC_TYPE_META = Object.fromEntries(
  Object.entries(DOC_TYPES).map(([code, { name, category }]) => [code, { category, title: name }])
);

const GUIDE_CATEGORIES = {
  'requirements': 'Discovery', 'stakeholders': 'Discovery', 'stakeholder-analysis': 'Discovery',
  'research': 'Discovery', 'datascout': 'Discovery',
  'sobc': 'Planning', 'business-case': 'Planning', 'plan': 'Planning', 'roadmap': 'Planning',
  'backlog': 'Planning', 'strategy': 'Planning',
  'principles': 'Architecture', 'adr': 'Architecture', 'diagram': 'Architecture',
  'wardley': 'Architecture', 'data-model': 'Architecture', 'hld-review': 'Architecture',
  'dld-review': 'Architecture', 'design-review': 'Architecture', 'platform-design': 'Architecture',
  'data-mesh-contract': 'Architecture', 'c4-layout-science': 'Architecture',
  'risk': 'Governance', 'risk-management': 'Governance', 'traceability': 'Governance',
  'principles-compliance': 'Governance', 'analyze': 'Governance', 'artifact-health': 'Governance',
  'data-quality-framework': 'Governance', 'knowledge-compounding': 'Governance',
  'tcop': 'Compliance', 'secure': 'Compliance', 'mod-secure': 'Compliance', 'dpia': 'Compliance',
  'ai-playbook': 'Compliance', 'atrs': 'Compliance', 'jsp-936': 'Compliance',
  'service-assessment': 'Compliance', 'govs-007-security': 'Compliance',
  'national-data-strategy': 'Compliance', 'codes-of-practice': 'Compliance',
  'security-hooks': 'Compliance',
  'devops': 'Operations', 'mlops': 'Operations', 'finops': 'Operations',
  'servicenow': 'Operations', 'operationalize': 'Operations',
  'sow': 'Procurement', 'evaluate': 'Procurement', 'dos': 'Procurement',
  'gcloud-search': 'Procurement', 'gcloud-clarify': 'Procurement', 'procurement': 'Procurement',
  'score': 'Procurement',
  'aws-research': 'Research', 'azure-research': 'Research', 'gcp-research': 'Research',
  'search': 'Governance', 'impact': 'Governance',
  'template-builder': 'Other',
};

const GUIDE_STATUS = {};
for (const name of ['plan','principles','stakeholders','stakeholder-analysis','risk','sobc','requirements','data-model','diagram','traceability','principles-compliance','story','sow','evaluate','customize','risk-management','business-case']) GUIDE_STATUS[name] = 'live';
for (const name of ['dpia','research','strategy','roadmap','adr','hld-review','dld-review','backlog','servicenow','analyze','service-assessment','tcop','secure','presentation','artifact-health','design-review','procurement','knowledge-compounding','c4-layout-science','security-hooks','codes-of-practice','data-quality-framework','govs-007-security','national-data-strategy','upgrading','start','conformance','productivity','remote-control','mcp-servers','search','score','impact']) GUIDE_STATUS[name] = 'beta';
for (const name of ['data-mesh-contract','ai-playbook','atrs','pages','template-builder']) GUIDE_STATUS[name] = 'alpha';
for (const name of ['platform-design','wardley','azure-research','aws-research','gcp-research','datascout','dos','gcloud-search','gcloud-clarify','trello','devops','mlops','finops','operationalize','mod-secure','jsp-936','migration','pinecone-mcp']) GUIDE_STATUS[name] = 'experimental';

const ROLE_FAMILIES = {
  'enterprise-architect': 'Architecture', 'solution-architect': 'Architecture',
  'data-architect': 'Architecture', 'security-architect': 'Architecture',
  'business-architect': 'Architecture', 'technical-architect': 'Architecture',
  'network-architect': 'Architecture',
  'cto-cdio': 'Chief Digital and Data', 'cdo': 'Chief Digital and Data',
  'ciso': 'Chief Digital and Data',
  'product-manager': 'Product and Delivery', 'delivery-manager': 'Product and Delivery',
  'business-analyst': 'Product and Delivery', 'service-owner': 'Product and Delivery',
  'data-governance-manager': 'Data', 'performance-analyst': 'Data',
  'it-service-manager': 'IT Operations',
  'devops-engineer': 'Software Development',
};

const ROLE_COMMAND_COUNTS = {
  'enterprise-architect': 12, 'solution-architect': 10, 'data-architect': 4,
  'security-architect': 5, 'business-architect': 5, 'technical-architect': 5,
  'network-architect': 3, 'cto-cdio': 5, 'cdo': 4, 'ciso': 5,
  'product-manager': 5, 'delivery-manager': 6, 'business-analyst': 4,
  'service-owner': 3, 'data-governance-manager': 4, 'performance-analyst': 4,
  'it-service-manager': 3, 'devops-engineer': 3,
};

// ── Doc type extraction from filename ──

// Match compound types first (SECD-MOD, PRIN-COMP), then simple types
function extractDocType(filename) {
  // ARC-001-SECD-MOD-v1.0.md → SECD-MOD
  // ARC-001-PRIN-COMP-v1.0.md → PRIN-COMP
  // ARC-001-REQ-v1.0.md → REQ
  // ARC-001-ADR-001-v1.0.md → ADR
  const m = filename.match(/^ARC-\d{3}-(.+)-v\d+(\.\d+)?\.md$/);
  if (!m) return null;
  let rest = m[1]; // e.g. "SECD-MOD", "REQ", "ADR-001"

  // Try compound types first (longest match)
  for (const code of Object.keys(DOC_TYPE_META)) {
    if (code.includes('-') && rest.startsWith(code)) {
      return code;
    }
  }

  // Strip trailing -NNN for multi-instance types
  rest = rest.replace(/-\d{3}$/, '');

  if (DOC_TYPE_META[rest]) return rest;
  return rest; // unknown type, return as-is
}

function extractDocId(filename) {
  // ARC-001-REQ-v1.0.md → ARC-001-REQ-v1.0
  return filename.replace(/\.md$/, '');
}

// ── Manifest building ──

function buildGuides(guideTitles) {
  const guides = [];
  const roleGuides = [];

  for (const [path, title] of Object.entries(guideTitles)) {
    // Community guides from .arckit/guides-custom/ (prefixed with "community-guide:")
    if (path.startsWith('community-guide:')) {
      const stem = basename(path.replace('community-guide:', ''), '.md');
      guides.push({
        path: `.arckit/guides-custom/${stem}.md`,
        title,
        category: 'Community',
        status: 'community',
      });
      continue;
    }

    // e.g. docs/guides/roles/enterprise-architect.md
    const rel = path.replace(/^docs\/guides\//, '');

    if (rel.startsWith('roles/')) {
      const stem = basename(rel, '.md');
      if (stem === 'README') continue;
      roleGuides.push({
        path,
        title,
        family: ROLE_FAMILIES[stem] || 'Other',
        commandCount: ROLE_COMMAND_COUNTS[stem] || 0,
      });
    } else if (!rel.includes('/')) {
      // Top-level guide only (exclude uk-government/, uk-mod/ subdirs)
      const stem = basename(rel, '.md');
      guides.push({
        path,
        title,
        category: GUIDE_CATEGORIES[stem] || 'Other',
        status: GUIDE_STATUS[stem] || 'beta',
      });
    }
  }

  return { guides, roleGuides };
}

function scanGlobalDocs(repoRoot) {
  const globalDir = join(repoRoot, 'projects', '000-global');
  const global = [];
  const globalExternal = [];
  const globalPolicies = [];

  if (!isDir(globalDir)) return { global, globalExternal, globalPolicies };

  // Global ARC-*.md files
  for (const f of listDir(globalDir)) {
    const fp = join(globalDir, f);
    if (isFile(fp) && f.startsWith('ARC-') && f.endsWith('.md')) {
      const typeCode = extractDocType(f);
      const meta = DOC_TYPE_META[typeCode] || { category: 'Other', title: typeCode };
      global.push({
        path: `projects/000-global/${f}`,
        title: meta.title,
        category: meta.category,
        documentId: extractDocId(f),
      });
    }
  }

  // Global external/
  const extDir = join(globalDir, 'external');
  if (isDir(extDir)) {
    for (const f of listDir(extDir)) {
      if (f === 'README.md' || f.startsWith('.')) continue;
      if (isFile(join(extDir, f))) {
        const ext = extname(f).replace('.', '') || 'file';
        globalExternal.push({
          path: `projects/000-global/external/${f}`,
          title: f,
          type: ext,
        });
      }
    }
  }

  // Global policies/
  const polDir = join(globalDir, 'policies');
  if (isDir(polDir)) {
    for (const f of listDir(polDir)) {
      if (f.startsWith('.')) continue;
      if (isFile(join(polDir, f))) {
        const ext = extname(f).replace('.', '') || 'file';
        globalPolicies.push({
          path: `projects/000-global/policies/${f}`,
          title: f,
          type: ext,
        });
      }
    }
  }

  return { global, globalExternal, globalPolicies };
}

function scanProject(repoRoot, projectName) {
  const projectDir = join(repoRoot, 'projects', projectName);
  const projectPath = `projects/${projectName}`;

  // Derive display name: "001-fuel-prices" → "Fuel Prices"
  const displayName = projectName
    .replace(/^\d{3}-/, '')
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const project = {
    id: projectName,
    name: displayName,
    documents: [],
    diagrams: [],
    decisions: [],
    wardleyMaps: [],
    dataContracts: [],
    reviews: [],
    research: [],
    vendors: [],
    vendorProfiles: [],
    techNotes: [],
    external: [],
  };

  // Core documents in project root
  for (const f of listDir(projectDir)) {
    const fp = join(projectDir, f);
    if (!isFile(fp) || !f.startsWith('ARC-') || !f.endsWith('.md')) continue;
    const typeCode = extractDocType(f);
    const meta = DOC_TYPE_META[typeCode] || { category: 'Other', title: typeCode };
    project.documents.push({
      path: `${projectPath}/${f}`,
      title: meta.title,
      category: meta.category,
      documentId: extractDocId(f),
    });
  }

  // Subdirectories to scan: derived from SUBDIR_MAP values + reviews
  // Maps directory name → manifest JSON key (camelCase)
  const subdirMap = {};
  for (const dir of new Set(Object.values(SUBDIR_MAP))) {
    subdirMap[dir] = dir.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }
  subdirMap['reviews'] = 'reviews';

  for (const [dirName, key] of Object.entries(subdirMap)) {
    const subDir = join(projectDir, dirName);
    if (!isDir(subDir)) continue;
    for (const f of listDir(subDir)) {
      const fp = join(subDir, f);
      if (!isFile(fp) || !f.startsWith('ARC-') || !f.endsWith('.md')) continue;
      // For multi-instance types, read first heading for title
      const heading = extractFirstHeading(fp);
      const typeCode = extractDocType(f);
      const meta = DOC_TYPE_META[typeCode] || { category: 'Other', title: typeCode };
      project[key].push({
        path: `${projectPath}/${dirName}/${f}`,
        title: heading || meta.title,
        documentId: extractDocId(f),
      });
    }
  }

  // Vendors
  const vendorsDir = join(projectDir, 'vendors');
  if (isDir(vendorsDir)) {
    for (const entry of listDir(vendorsDir)) {
      const entryPath = join(vendorsDir, entry);
      if (isDir(entryPath)) {
        // Vendor subdirectory with documents
        const vendorDocs = [];
        for (const f of listDir(entryPath)) {
          const fp = join(entryPath, f);
          if (isFile(fp) && f.endsWith('.md')) {
            const heading = extractFirstHeading(fp) || basename(f, '.md');
            vendorDocs.push({
              path: `${projectPath}/vendors/${entry}/${f}`,
              title: heading,
            });
          }
        }
        if (vendorDocs.length > 0) {
          const vendorName = entry
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
          project.vendors.push({ name: vendorName, documents: vendorDocs });
        }
      } else if (isFile(entryPath) && entry.endsWith('-profile.md')) {
        // Flat vendor profile
        const vendorSlug = entry.replace(/-profile\.md$/, '');
        const profileTitle = vendorSlug
          .split('-')
          .map(w => w.toUpperCase() === w ? w : w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        project.vendorProfiles.push({
          path: `${projectPath}/vendors/${entry}`,
          title: profileTitle,
        });
      }
    }
  }

  // Vendor scores
  const scoresPath = join(projectDir, 'vendors', 'scores.json');
  if (isFile(scoresPath)) {
    try {
      const scoresRaw = readFileSync(scoresPath, 'utf8');
      const scoresData = JSON.parse(scoresRaw);
      if (scoresData.criteria && scoresData.vendors) {
        const categories = [...new Set(scoresData.criteria.map(c => c.category))];
        const vendorSummaries = [];
        for (const [slug, vendor] of Object.entries(scoresData.vendors)) {
          const categoryAverages = {};
          for (const cat of categories) {
            const catCriteria = scoresData.criteria.filter(c => c.category === cat);
            const catScores = catCriteria.map(c => {
              const s = vendor.scores.find(s => s.criterionId === c.id);
              return s ? s.score : 0;
            });
            categoryAverages[cat] = catScores.length > 0
              ? Math.round((catScores.reduce((a, b) => a + b, 0) / catScores.length) * 100) / 100
              : 0;
          }
          vendorSummaries.push({
            name: vendor.displayName || slug,
            slug,
            totalWeighted: vendor.totalWeighted || 0,
            totalRaw: vendor.totalRaw || 0,
            maxPossible: vendor.maxPossible || 0,
            categoryAverages,
          });
        }
        vendorSummaries.sort((a, b) => b.totalWeighted - a.totalWeighted);
        project.vendorScores = {
          lastUpdated: scoresData.lastUpdated || null,
          categories,
          vendors: vendorSummaries,
        };
      }
    } catch (e) {
      // Silently skip malformed scores.json
    }
  }

  // Tech notes
  const techDir = join(projectDir, 'tech-notes');
  if (isDir(techDir)) {
    for (const f of listDir(techDir)) {
      const fp = join(techDir, f);
      if (isFile(fp) && f.endsWith('.md')) {
        const heading = extractFirstHeading(fp);
        const titleFromSlug = basename(f, '.md')
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        project.techNotes.push({
          path: `${projectPath}/tech-notes/${f}`,
          title: heading || titleFromSlug,
        });
      }
    }
  }

  // External files
  const extDir = join(projectDir, 'external');
  if (isDir(extDir)) {
    for (const f of listDir(extDir)) {
      if (f === 'README.md' || f.startsWith('.')) continue;
      if (isFile(join(extDir, f))) {
        const ext = extname(f).replace('.', '') || 'file';
        project.external.push({
          path: `${projectPath}/external/${f}`,
          title: f,
          type: ext,
        });
      }
    }
  }

  // Remove empty arrays
  for (const key of ['diagrams', 'decisions', 'wardleyMaps', 'dataContracts', 'reviews', 'research', 'vendors', 'vendorProfiles', 'techNotes', 'external']) {
    if (project[key].length === 0) delete project[key];
  }

  return project;
}

function buildManifest(repoRoot, repoInfo, guideTitles) {
  const { guides, roleGuides } = buildGuides(guideTitles);
  const { global: globalDocs, globalExternal, globalPolicies } = scanGlobalDocs(repoRoot);

  // Find default document (principles if exists)
  const defaultDoc = globalDocs.find(d => d.documentId && d.documentId.includes('PRIN'));
  if (defaultDoc) defaultDoc.isDefault = true;

  // Scan numbered projects (skip 000-global)
  const projects = [];
  const projectsDir = join(repoRoot, 'projects');
  for (const entry of listDir(projectsDir)) {
    if (entry === '000-global') continue;
    if (!isDir(join(projectsDir, entry))) continue;
    if (!/^\d{3}-/.test(entry)) continue;
    projects.push(scanProject(repoRoot, entry));
  }

  const manifest = {
    generated: new Date().toISOString(),
    repository: { name: repoInfo.repo },
    defaultDocument: defaultDoc ? defaultDoc.path : '',
    guides,
    roleGuides,
    global: globalDocs,
  };

  // Type code → category map for client-side JS (pages-template.html can't import .mjs)
  manifest.typeCategories = Object.fromEntries(
    Object.entries(DOC_TYPES).map(([code, { category }]) => [code, category])
  );

  if (globalExternal.length > 0) manifest.globalExternal = globalExternal;
  if (globalPolicies.length > 0) manifest.globalPolicies = globalPolicies;
  manifest.projects = projects;

  // Dependency graph for dashboard visualization
  if (isDir(projectsDir)) {
    const graph = scanAllArtifacts(projectsDir);
    if (Object.keys(graph.nodes).length > 0) {
      manifest.dependencyGraph = {
        nodes: graph.nodes,
        edges: graph.edges,
      };
    }
  }

  return manifest;
}

// ── Main ──

const data = parseHookInput();

// Guard: hooks.json matcher triggers on substring "/arckit:pages" which can
// false-positive when another command's expanded body mentions /arckit:pages.
// Accept raw slash command OR the Skill-expanded body (unique description/heading).
// No ^ anchors — Skill tool may wrap the expanded body in XML tags.
const userPrompt = data.prompt || '';
const isRawCommand = /^\s*\/arckit[.:]+pages\b/i.test(userPrompt);
const isExpandedBody = /description:\s*Generate documentation site/i.test(userPrompt)
  || /#\s*ArcKit:\s*Documentation Site Generator/i.test(userPrompt);
if (!isRawCommand && !isExpandedBody) process.exit(0);

// Resolve roots
const __dirname_hook = dirname(fileURLToPath(import.meta.url));
const pluginRoot = process.env.CLAUDE_PLUGIN_ROOT || resolve(__dirname_hook, '..');
const sourceDir = join(pluginRoot, 'docs', 'guides');
if (!isDir(sourceDir)) process.exit(0);

const cwd = data.cwd || process.cwd();
const repoRoot = findRepoRoot(cwd);
if (!repoRoot) process.exit(0);

const destDir = join(repoRoot, 'docs', 'guides');

// ── 1. Sync guides + extract titles ──

const sourceFiles = walkMdFiles(sourceDir);
if (sourceFiles.length === 0) process.exit(0);

let copied = 0;
let skipped = 0;
let dirsCreated = 0;
const createdDirs = new Set();
const guideTitles = {};

for (const { abs: srcPath, rel: relPath } of sourceFiles) {
  const destPath = join(destDir, relPath);
  const destDirPath = dirname(destPath);

  if (!createdDirs.has(destDirPath) && !isDir(destDirPath)) {
    mkdirSync(destDirPath, { recursive: true });
    dirsCreated = dirsCreated + 1;
    createdDirs.add(destDirPath);
  } else {
    createdDirs.add(destDirPath);
  }

  const content = readFileSync(srcPath, 'utf8');
  const title = extractTitle(content, relPath);
  if (title) {
    guideTitles[`docs/guides/${relPath}`] = title;
  }

  const srcMtime = mtimeMs(srcPath);
  const destMtime = mtimeMs(destPath);
  if (destMtime >= srcMtime && destMtime > 0) {
    skipped = skipped + 1;
    continue;
  }

  writeFileSync(destPath, content, 'utf8');
  copied = copied + 1;
}

// ── 1b. Discover community guides from .arckit/guides-custom/ ──

let communityGuideCount = 0;
const communityGuidesDir = join(repoRoot, '.arckit', 'guides-custom');
if (isDir(communityGuidesDir)) {
  for (const f of listDir(communityGuidesDir)) {
    if (!f.endsWith('.md') || !isFile(join(communityGuidesDir, f))) continue;
    const content = readText(join(communityGuidesDir, f));
    if (!content) continue;
    const title = extractTitle(content, f);
    if (title) {
      // Use a special prefix so buildGuides can detect community guides
      guideTitles[`community-guide:${f}`] = title;
      communityGuideCount = communityGuideCount + 1;
    }
  }
}

// ── 2. Repo info + version ──

const repoInfo = parseRepoInfo(repoRoot);
const version = (readText(join(pluginRoot, 'VERSION')) || '').trim();

// ── 3. Template → index.html ──

let templateProcessed = false;
let templateSource = '';

const customTemplatePath = join(repoRoot, '.arckit', 'templates', 'pages-template.html');
const defaultTemplatePath = join(pluginRoot, 'templates', 'pages-template.html');
let templatePath = '';
if (isFile(customTemplatePath)) {
  templatePath = customTemplatePath;
  templateSource = 'custom override';
} else if (isFile(defaultTemplatePath)) {
  templatePath = defaultTemplatePath;
  templateSource = 'plugin default';
}

if (templatePath) {
  let html = readFileSync(templatePath, 'utf8');
  html = html.replace(/\{\{REPO\}\}/g, repoInfo.repo);
  html = html.replace(/\{\{REPO_URL\}\}/g, repoInfo.repoUrl);
  html = html.replace(/\{\{CONTENT_BASE_URL\}\}/g, repoInfo.contentBaseUrl);
  html = html.replace(/\{\{VERSION\}\}/g, version);

  const docsDir = join(repoRoot, 'docs');
  if (!isDir(docsDir)) mkdirSync(docsDir, { recursive: true });
  writeFileSync(join(repoRoot, 'docs', 'index.html'), html, 'utf8');
  templateProcessed = true;
}

// ── 4. Manifest ──

const manifest = buildManifest(repoRoot, repoInfo, guideTitles);
const docsDir = join(repoRoot, 'docs');
if (!isDir(docsDir)) mkdirSync(docsDir, { recursive: true });
writeFileSync(join(repoRoot, 'docs', 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

// Count stats
const guideCount = manifest.guides.length;
const roleCount = manifest.roleGuides.length;
const globalCount = manifest.global.length;
let projectDocCount = 0;
let diagramCount = 0;
let adrCount = 0;
let wardleyMapCount = 0;
let dataContractCount = 0;
let researchCount = 0;
let reviewCount = 0;
let vendorDocCount = 0;
let vendorProfileCount = 0;
let techNoteCount = 0;
for (const p of manifest.projects) {
  projectDocCount = projectDocCount + (p.documents ? p.documents.length : 0);
  diagramCount = diagramCount + (p.diagrams ? p.diagrams.length : 0);
  adrCount = adrCount + (p.decisions ? p.decisions.length : 0);
  wardleyMapCount = wardleyMapCount + (p.wardleyMaps ? p.wardleyMaps.length : 0);
  dataContractCount = dataContractCount + (p.dataContracts ? p.dataContracts.length : 0);
  researchCount = researchCount + (p.research ? p.research.length : 0);
  reviewCount = reviewCount + (p.reviews ? p.reviews.length : 0);
  if (p.vendors) for (const v of p.vendors) vendorDocCount = vendorDocCount + v.documents.length;
  vendorProfileCount = vendorProfileCount + (p.vendorProfiles ? p.vendorProfiles.length : 0);
  techNoteCount = techNoteCount + (p.techNotes ? p.techNotes.length : 0);
}
let scoredVendorCount = 0;
for (const p of manifest.projects) {
  if (p.vendorScores) scoredVendorCount = scoredVendorCount + p.vendorScores.vendors.length;
}

// ── 5. Output ──

const total = copied + skipped;
const message = [
  `## Pages Pre-processor Complete (hook)`,
  ``,
  `**All files written. The pages command only needs to output a summary.**`,
  ``,
  `### Files Written`,
  `- \`docs/index.html\` — ${templateProcessed ? `from ${templateSource}` : 'NOT written (template not found)'}`,
  `- \`docs/manifest.json\` — ${manifest.projects.length} project(s), ${guideCount} guides, ${roleCount} role guides`,
  ``,
  `### Guide Sync`,
  `- **${total}** guide files (**${copied}** copied, **${skipped}** up to date)`,
  communityGuideCount > 0 ? `- **${communityGuideCount}** community guide(s) from \`.arckit/guides-custom/\`` : '',
  ``,
  `### Repository Info`,
  `- **Repo**: ${repoInfo.repo}`,
  `- **URL**: ${repoInfo.repoUrl || '(no remote)'}`,
  `- **ArcKit Version**: ${version || '(unknown)'}`,
  ``,
  `### DOCUMENT STATS — use these values directly in your Step 5 summary`,
  ``,
  `| Stat | Count |`,
  `|------|-------|`,
  `| Guides | ${guideCount} |`,
  `| DDaT Role Guides | ${roleCount} |`,
  `| Global | ${globalCount} |`,
  `| Project Documents | ${projectDocCount} |`,
  `| Diagrams | ${diagramCount} |`,
  `| ADRs | ${adrCount} |`,
  `| Wardley Maps | ${wardleyMapCount} |`,
  `| Data Contracts | ${dataContractCount} |`,
  `| Research | ${researchCount} |`,
  `| Reviews | ${reviewCount} |`,
  `| Vendor Documents | ${vendorDocCount} |`,
  `| Vendor Profiles | ${vendorProfileCount} |`,
  `| Tech Notes | ${techNoteCount} |`,
  `| Scored Vendors | ${scoredVendorCount} |`,
  `| Graph Nodes | ${manifest.dependencyGraph ? Object.keys(manifest.dependencyGraph.nodes).length : 0} |`,
  `| Graph Edges | ${manifest.dependencyGraph ? manifest.dependencyGraph.edges.length : 0} |`,
  `| Projects | ${manifest.projects.length} |`,
  ``,
  `### What to do`,
  ``,
  `**Do NOT call any tools. Do NOT read manifest.json.** The stats above are complete and correct.`,
  `Output ONLY the Step 5 summary using the stats from the table above.`,
].join('\n');

const output = {
  hookSpecificOutput: {
    hookEventName: 'UserPromptSubmit',
    additionalContext: message,
  },
};
console.log(JSON.stringify(output));
