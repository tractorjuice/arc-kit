#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildProjectContext } from "./project-context-builder.mjs";
import { runGraphInjectHook } from "./graph-inject.mjs";
import { runSyncGuidesHook } from "./sync-guides.mjs";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(SCRIPT_DIR, "..");

const SECRET_PATTERNS = [
  ["OpenAI API key", /\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/g],
  ["GitHub token", /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g],
  ["Google API key", /\bAIza[0-9A-Za-z_-]{30,}\b/g],
  ["Slack token", /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ["private key", /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g],
];

const PROTECTED_BASENAMES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".envrc",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "credentials",
  "credentials.json",
  "service-account.json",
]);

const PROTECTED_EXTENSIONS = new Set([
  ".key",
  ".pem",
  ".p12",
  ".pfx",
  ".keystore",
]);

const ALLOWED_MCP_PREFIXES = [
  "mcp__aws-knowledge__",
  "mcp__microsoft-learn__",
  "mcp__plugin_microsoft-docs_microsoft-learn__",
  "mcp__google-developer-knowledge__",
  "mcp__datacommons-mcp__",
  "mcp__govreposcrape__",
];

const PLUGIN_SCRIPT_ALLOWLIST = new Set([
  "validate-handoff.mjs",
  "bash/common.sh",
  "bash/create-project.sh",
  "bash/generate-document-id.sh",
  "bash/check-prerequisites.sh",
  "bash/list-projects.sh",
  "bash/migrate-filenames.sh",
  "bash/detect-stale-artifacts.sh",
]);

const DOC_TYPES = {
  REQ: { name: "Requirements", category: "Discovery" },
  STKE: { name: "Stakeholder Analysis", category: "Discovery" },
  RSCH: { name: "Research Findings", category: "Discovery" },
  DSCT: { name: "Data Source Discovery", category: "Discovery" },
  SOBC: { name: "Strategic Outline Business Case", category: "Planning" },
  PLAN: { name: "Project Plan", category: "Planning" },
  ROAD: { name: "Roadmap", category: "Planning" },
  STRAT: { name: "Architecture Strategy", category: "Planning" },
  BKLG: { name: "Product Backlog", category: "Planning" },
  PRIN: { name: "Architecture Principles", category: "Architecture" },
  HLDR: { name: "High-Level Design Review", category: "Architecture" },
  DLDR: { name: "Detailed Design Review", category: "Architecture" },
  DATA: { name: "Data Model", category: "Architecture" },
  WARD: { name: "Wardley Map", category: "Architecture" },
  WDOC: { name: "Wardley Doctrine Assessment", category: "Architecture" },
  WGAM: { name: "Wardley Gameplay Analysis", category: "Architecture" },
  WCLM: { name: "Wardley Climate Assessment", category: "Architecture" },
  WVCH: { name: "Wardley Value Chain", category: "Architecture" },
  DIAG: { name: "Architecture Diagrams", category: "Architecture" },
  DFD: { name: "Data Flow Diagram", category: "Architecture" },
  ADR: { name: "Architecture Decision Records", category: "Architecture" },
  PLAT: { name: "Platform Design", category: "Architecture" },
  RISK: { name: "Risk Register", category: "Governance" },
  TRAC: { name: "Traceability Matrix", category: "Governance" },
  "PRIN-COMP": { name: "Principles Compliance", category: "Governance" },
  CONF: { name: "Conformance Assessment", category: "Governance" },
  PRES: { name: "Presentation", category: "Reporting" },
  ANAL: { name: "Analysis Report", category: "Governance" },
  GAPS: { name: "Gap Analysis", category: "Governance" },
  TCOP: { name: "TCoP Assessment", category: "Compliance" },
  SECD: { name: "Secure by Design", category: "Compliance" },
  "SECD-MOD": { name: "MOD Secure by Design", category: "Compliance" },
  AIPB: { name: "AI Playbook Assessment", category: "Compliance" },
  ATRS: { name: "ATRS Record", category: "Compliance" },
  DPIA: { name: "Data Protection Impact Assessment", category: "Compliance" },
  JSP936: { name: "JSP 936 Assessment", category: "Compliance" },
  SVCASS: { name: "Service Assessment", category: "Compliance" },
  SNOW: { name: "ServiceNow Design", category: "Operations" },
  DEVOPS: { name: "DevOps Strategy", category: "Operations" },
  MLOPS: { name: "MLOps Strategy", category: "Operations" },
  FINOPS: { name: "FinOps Strategy", category: "Operations" },
  OPS: { name: "Operational Readiness", category: "Operations" },
  SOW: { name: "Statement of Work", category: "Procurement" },
  EVAL: { name: "Evaluation Criteria", category: "Procurement" },
  DOS: { name: "DOS Requirements", category: "Procurement" },
  GCLD: { name: "G-Cloud Search", category: "Procurement" },
  GCLC: { name: "G-Cloud Clarifications", category: "Procurement" },
  DMC: { name: "Data Mesh Contract", category: "Procurement" },
  VEND: { name: "Vendor Evaluation", category: "Procurement" },
  AWRS: { name: "AWS Research", category: "Research" },
  AZRS: { name: "Azure Research", category: "Research" },
  GCRS: { name: "GCP Research", category: "Research" },
  GOVR: { name: "Government Reuse Assessment", category: "Research" },
  GCSR: { name: "Government Code Search Report", category: "Research" },
  GLND: { name: "Government Landscape Analysis", category: "Research" },
  GRNT: { name: "Grants Research", category: "Research" },
  STORY: { name: "Project Story", category: "Reporting" },
  RGPD: { name: "GDPR Compliance Assessment", category: "Compliance" },
  NIS2: { name: "NIS2 Compliance Assessment", category: "Compliance" },
  AIACT: { name: "EU AI Act Compliance Assessment", category: "Compliance" },
  DORA: { name: "DORA Compliance Assessment", category: "Compliance" },
  CRA: { name: "EU Cyber Resilience Act Assessment", category: "Compliance" },
  DSA: { name: "EU Digital Services Act Assessment", category: "Compliance" },
  DATAACT: { name: "EU Data Act Compliance Assessment", category: "Compliance" },
  IRN: { name: "IRN - Indice de Resilience Numerique", category: "Governance" },
  CNIL: { name: "CNIL / French GDPR Assessment", category: "Compliance" },
  SECNUM: { name: "SecNumCloud 3.2 Assessment", category: "Compliance" },
  MARPUB: { name: "French Public Procurement", category: "Procurement" },
  DINUM: { name: "DINUM Standards Assessment", category: "Compliance" },
  EBIOS: { name: "EBIOS Risk Manager Study", category: "Governance" },
  ANSSI: { name: "ANSSI Security Posture Assessment", category: "Compliance" },
  CARTO: { name: "ANSSI Information System Cartography", category: "Architecture" },
  DR: { name: "Diffusion Restreinte Handling Assessment", category: "Compliance" },
  ALGO: { name: "Public Algorithm Transparency Notice", category: "Compliance" },
  PSSI: { name: "Information System Security Policy", category: "Compliance" },
  REUSE: { name: "Public Code Reuse Assessment", category: "Procurement" },
  ATDSG: { name: "Austrian Data Protection Assessment", category: "Compliance" },
  ATNISG: { name: "Austrian NISG Assessment", category: "Compliance" },
  BVERGG: { name: "Austrian Public Procurement", category: "Procurement" },
  PDPL: { name: "UAE PDPL Compliance Assessment", category: "Compliance" },
  IAS: { name: "UAE IAS Statement of Applicability", category: "Compliance" },
  CRES: { name: "UAE Sovereign Cloud Residency Assessment", category: "Architecture" },
  CLAS: { name: "UAE Smart Data Classification Register", category: "Governance" },
  UPASS: { name: "UAE Pass Integration Design", category: "Architecture" },
  ZBUR: { name: "UAE Zero Bureaucracy Service Review", category: "Governance" },
  DREC: { name: "UAE Digital Records Plan", category: "Governance" },
  DSHR: { name: "UAE Data Sharing Agreement", category: "Governance" },
  NPRA: { name: "UAE National Priorities Alignment Statement", category: "Governance" },
  AICH: { name: "UAE AI Charter Compliance Assessment", category: "Compliance" },
  AUTI: { name: "UAE AI Autonomy Tier Posture", category: "Architecture" },
  FPRO: { name: "UAE Federal Procurement Strategy", category: "Procurement" },
  FITAA: { name: "Canada FITAA Compliance Assessment", category: "Compliance" },
  PIA: { name: "Canada Privacy Impact Assessment", category: "Compliance" },
  ATIP: { name: "Canada ATIP Reconciliation", category: "Compliance" },
  AIA: { name: "Canada Algorithmic Impact Assessment", category: "Compliance" },
  CHRT: { name: "Canada Charter Rights Design Review", category: "Governance" },
  ITSG: { name: "Canada ITSG-33 Statement of Applicability", category: "Architecture" },
  SOIA: { name: "Canada Security of Information Act Handling Plan", category: "Compliance" },
  CACR: { name: "Canada Sovereign Cloud Residency Assessment", category: "Architecture" },
  DIGSTD: { name: "Canada GC Digital Standards Conformance", category: "Governance" },
  OLA: { name: "Canada Official Languages Act Review", category: "Compliance" },
  PROC: { name: "Canada Federal Procurement Strategy", category: "Procurement" },
  OCAP: { name: "Canada First Nations OCAP Sovereignty Assessment", category: "Governance" },
};

const SUBDIR_TO_MANIFEST_KEY = {
  decisions: "decisions",
  diagrams: "diagrams",
  "wardley-maps": "wardleyMaps",
  "data-contracts": "dataContracts",
  reviews: "reviews",
  research: "research",
};

const ESSENTIAL_DOC_TYPES = ["REQ", "PRIN", "STKE", "RISK", "ADR", "TRAC"];
const GRAPH_COMMANDS = new Set(["health", "traceability", "analyze", "search", "impact", "navigator", "graph-report"]);
const PROV_START = "<!-- arckit-provenance:start -->";
const PROV_END = "<!-- arckit-provenance:end -->";

function readStdin() {
  try {
    return readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function readHookInput() {
  const raw = readStdin().trim();
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return { raw_input: raw };
  }
}

function writeJson(value) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
}

function emitContext(eventName, additionalContext) {
  if (!additionalContext || !additionalContext.trim()) {
    return;
  }
  writeJson({
    hookSpecificOutput: {
      hookEventName: eventName,
      additionalContext,
    },
  });
}

function blockPrompt(reason) {
  writeJson({
    decision: "block",
    reason,
  });
}

function denyTool(reason) {
  writeJson({
    decision: "block",
    reason,
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: reason,
    },
  });
}

function allowTool(reason) {
  writeJson({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "allow",
      permissionDecisionReason: reason,
    },
  });
}

function warnTool(reason) {
  writeJson({
    systemMessage: reason,
  });
}

function allowPermission() {
  writeJson({
    hookSpecificOutput: {
      hookEventName: "PermissionRequest",
      decision: {
        behavior: "allow",
      },
    },
  });
}

function hookAdditionalContext(output) {
  return output?.hookSpecificOutput?.additionalContext || output?.additionalContext || "";
}

function promptMatchesCommand(prompt, command) {
  const escaped = command.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|\\s)(?:\\$arckit-${escaped}|/arckit[.:]${escaped})\\b`, "i").test(prompt);
}

function detectSecrets(text) {
  if (!text) {
    return [];
  }

  const found = new Set();
  for (const [name, pattern] of SECRET_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(text)) {
      found.add(name);
    }
  }
  return [...found].sort();
}

function stringifyToolInput(toolInput) {
  if (typeof toolInput === "string") {
    return toolInput;
  }
  if (!toolInput || typeof toolInput !== "object") {
    return "";
  }
  return [
    toolInput.command,
    toolInput.content,
    toolInput.new_string,
    toolInput.input,
    toolInput.patch,
  ]
    .filter((value) => typeof value === "string")
    .join("\n");
}

function getToolInput(data) {
  if (data.tool_input !== undefined) {
    return data.tool_input;
  }
  if (data.toolInput !== undefined) {
    return data.toolInput;
  }
  return {};
}

function pathLooksProtected(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return false;
  }

  const normal = filePath.replaceAll("\\", "/");
  const parts = normal.split("/").filter(Boolean);
  const name = basename(normal);
  const lowerName = name.toLowerCase();
  const lowerParts = parts.map((part) => part.toLowerCase());

  if (PROTECTED_BASENAMES.has(lowerName)) {
    return true;
  }
  if (lowerName.startsWith(".env.")) {
    return true;
  }
  if (lowerParts.includes(".ssh") || lowerParts.includes(".aws") || lowerParts.includes(".gnupg")) {
    return true;
  }
  return [...PROTECTED_EXTENSIONS].some((extension) => lowerName.endsWith(extension));
}

function isUnderPluginRoot(filePath) {
  if (!filePath || typeof filePath !== "string") {
    return false;
  }
  const absolute = resolve(filePath);
  return absolute === PLUGIN_ROOT || absolute.startsWith(`${PLUGIN_ROOT}/`);
}

function isArcKitTempfile(filePath) {
  return typeof filePath === "string"
    && /^\/tmp\/(?:arckit-)?[a-z][a-z0-9-]*-handoff(?:-[a-z][a-z0-9-]*)?[A-Za-z0-9.-]*\.json$/.test(filePath);
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function commandTouchesPluginScripts(command) {
  if (!command || typeof command !== "string") {
    return false;
  }
  const scriptsDir = resolve(PLUGIN_ROOT, "scripts").replaceAll("\\", "/");
  const prefixes = [
    `${scriptsDir}/`,
    "${CODEX_PLUGIN_ROOT}/scripts/",
    "${CLAUDE_PLUGIN_ROOT}/scripts/",
  ];
  const refs = [];
  for (const prefix of prefixes) {
    if (!command.includes(prefix)) {
      continue;
    }
    const re = new RegExp(`${escapeRegex(prefix)}([A-Za-z0-9_./-]+)`, "g");
    for (const match of command.matchAll(re)) {
      refs.push(match[1]);
    }
  }
  return refs.length > 0 && refs.every((ref) => PLUGIN_SCRIPT_ALLOWLIST.has(ref));
}

function extractPatchDetails(command) {
  const paths = [];
  const addedLines = [];

  for (const line of command.split(/\r?\n/)) {
    const pathMatch = line.match(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/);
    const moveMatch = line.match(/^\*\*\* Move to: (.+)$/);
    if (pathMatch) {
      paths.push(pathMatch[1].trim());
      continue;
    }
    if (moveMatch) {
      paths.push(moveMatch[1].trim());
      continue;
    }
    if (line.startsWith("+") && !line.startsWith("+++") && !line.startsWith("+***")) {
      addedLines.push(line.slice(1));
    }
  }

  return { paths, addedText: addedLines.join("\n") };
}

function extractArcDocType(filename) {
  const match = filename.match(/^ARC-\d{3}-(.+)-v\d+(?:\.\d+)?\.md$/);
  if (!match) {
    return null;
  }

  let rest = match[1];
  const compound = Object.keys(DOC_TYPES)
    .filter((code) => code.includes("-"))
    .sort((a, b) => b.length - a.length)
    .find((code) => rest.startsWith(code));
  if (compound) {
    return compound;
  }
  rest = rest.replace(/-\d{3}$/, "");
  return DOC_TYPES[rest] ? rest : rest.split("-")[0];
}

function extractDocId(filename) {
  return filename.replace(/\.md$/, "");
}

function baseDocId(documentId) {
  return documentId.replace(/-v\d+(?:\.\d+)?$/, "");
}

function extractFirstHeading(content) {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function extractControlFields(content) {
  const fields = {};
  for (const line of content.split(/\r?\n/).slice(0, 80)) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/);
    if (match && !/^[-: ]+$/.test(match[1]) && !/^[-: ]+$/.test(match[2])) {
      const key = match[1].replace(/\*\*/g, "").trim();
      const value = match[2].replace(/\*\*/g, "").trim();
      if (key && value && key.toLowerCase() !== "field") {
        fields[key] = value;
      }
    }
  }
  return fields;
}

function extractRequirementIds(content) {
  return [...new Set([...content.matchAll(/\b(?:BR|FR|NFR|DR|SR)-\d{3}\b/g)].map((match) => match[0]))].sort();
}

function validateArcFilename(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  if (!normalized.includes("/projects/") && !normalized.startsWith("projects/")) {
    return null;
  }
  const name = basename(normalized);
  if (!name.startsWith("ARC-") || !name.endsWith(".md")) {
    return null;
  }
  if (!/^ARC-\d{3}-.+-v\d+(?:\.\d+)?\.md$/.test(name)) {
    return `ArcKit blocked invalid ARC artifact filename: ${name}. Expected ARC-NNN-TYPE-vN.N.md.`;
  }
  return null;
}

function validateScoresJson(content) {
  let scores;
  try {
    scores = JSON.parse(content);
  } catch (error) {
    return { fatal: `Invalid JSON in scores.json: ${error.message}`, warnings: [] };
  }

  const warnings = [];
  if (!scores.projectId) {
    warnings.push("Missing required field: projectId");
  }
  if (!Array.isArray(scores.criteria)) {
    warnings.push("Missing or invalid field: criteria (must be an array)");
  }
  if (!scores.vendors || typeof scores.vendors !== "object" || Array.isArray(scores.vendors)) {
    warnings.push("Missing or invalid field: vendors (must be an object)");
  }

  if (Array.isArray(scores.criteria) && scores.criteria.length > 0) {
    const weightSum = scores.criteria.reduce((sum, criterion) => sum + (Number(criterion.weight) || 0), 0);
    if (Math.abs(weightSum - 1.0) > 0.01) {
      warnings.push(`Criteria weights sum to ${weightSum.toFixed(3)} (expected approximately 1.0)`);
    }
    for (const criterion of scores.criteria) {
      if (!criterion.id) {
        warnings.push("Criterion missing id field");
      }
      if (!criterion.name) {
        warnings.push(`Criterion ${criterion.id || "?"} missing name field`);
      }
      if (typeof criterion.weight !== "number") {
        warnings.push(`Criterion ${criterion.id || "?"} missing numeric weight`);
      }
    }
  }

  const criteriaIds = new Set((scores.criteria || []).map((criterion) => criterion.id));
  if (scores.vendors && typeof scores.vendors === "object" && !Array.isArray(scores.vendors)) {
    for (const [vendorKey, vendor] of Object.entries(scores.vendors)) {
      if (!vendor.displayName) {
        warnings.push(`Vendor '${vendorKey}' missing displayName`);
      }
      if (!Array.isArray(vendor.scores)) {
        warnings.push(`Vendor '${vendorKey}' missing scores array`);
        continue;
      }
      for (const score of vendor.scores) {
        if (typeof score.score !== "number" || score.score < 0 || score.score > 3) {
          warnings.push(`Vendor '${vendorKey}' criterion ${score.criterionId || "?"}: score out of range (must be 0-3)`);
        }
        if (!score.evidence || !String(score.evidence).trim()) {
          warnings.push(`Vendor '${vendorKey}' criterion ${score.criterionId || "?"}: missing evidence`);
        }
        if (score.criterionId && criteriaIds.size > 0 && !criteriaIds.has(score.criterionId)) {
          warnings.push(`Vendor '${vendorKey}' references unknown criterion: ${score.criterionId}`);
        }
      }
    }
  }

  return { fatal: null, warnings };
}

function extractExplicitPaths(toolInput) {
  if (!toolInput || typeof toolInput !== "object") {
    return [];
  }
  return [
    toolInput.file_path,
    toolInput.path,
    toolInput.absolute_path,
    toolInput.filename,
  ].filter((value) => typeof value === "string" && value.trim());
}

function commandWritesProtectedPath(command) {
  if (!command || typeof command !== "string") {
    return false;
  }
  if (!/\b(cp|mv|rm|touch|tee|chmod|chown|printf|echo|cat|sed|perl|python3?|node|openssl)\b/.test(command)) {
    return false;
  }
  return command
    .split(/\s+/)
    .some((part) => pathLooksProtected(part.replace(/^['"]|['"]$/g, "")));
}

function handlePreToolUse(data) {
  const toolName = data.tool_name || data.toolName || "";
  const toolInput = getToolInput(data);
  const command = stringifyToolInput(toolInput);
  const explicitPaths = extractExplicitPaths(toolInput);

  if (toolName === "Read") {
    const filePath = explicitPaths[0] || "";
    if (isUnderPluginRoot(filePath)) {
      allowTool(`ArcKit: auto-allowed Read of plugin-internal file (${relative(PLUGIN_ROOT, resolve(filePath))})`);
      return;
    }
    if (isArcKitTempfile(filePath)) {
      allowTool("ArcKit: auto-allowed Read of ArcKit-managed tempfile");
      return;
    }
    return;
  }

  if (toolName === "Bash" && commandTouchesPluginScripts(command)) {
    allowTool("ArcKit: auto-allowed Bash invocation of plugin-internal helper script");
    return;
  }

  if (toolName === "apply_patch" || command.includes("*** Begin Patch")) {
    const patch = extractPatchDetails(command);
    const invalidArcFilename = [...explicitPaths, ...patch.paths]
      .map(validateArcFilename)
      .find(Boolean);
    if (invalidArcFilename) {
      denyTool(invalidArcFilename);
      return;
    }

    const protectedPath = [...explicitPaths, ...patch.paths].find(pathLooksProtected);
    if (protectedPath) {
      denyTool(`ArcKit blocked editing protected credential file: ${protectedPath}`);
      return;
    }

    const scorePath = [...explicitPaths, ...patch.paths].find((path) => path.replaceAll("\\", "/").includes("/vendors/") && basename(path) === "scores.json");
    if (scorePath && patch.addedText.trim().startsWith("{")) {
      const scoreValidation = validateScoresJson(patch.addedText);
      if (scoreValidation.fatal) {
        denyTool(scoreValidation.fatal);
        return;
      }
      if (scoreValidation.warnings.length) {
        warnTool(`ArcKit score validation warnings:\n${scoreValidation.warnings.map((warning) => `- ${warning}`).join("\n")}`);
        return;
      }
    }

    const secrets = detectSecrets(patch.addedText);
    if (secrets.length) {
      denyTool(`ArcKit blocked writing apparent secret material: ${secrets.join(", ")}`);
    }
    return;
  }

  const invalidArcFilename = explicitPaths.map(validateArcFilename).find(Boolean);
  if (invalidArcFilename) {
    denyTool(invalidArcFilename);
    return;
  }

  const protectedPath = explicitPaths.find(pathLooksProtected);
  if (protectedPath) {
    denyTool(`ArcKit blocked editing protected credential file: ${protectedPath}`);
    return;
  }

  const scorePath = explicitPaths.find((path) => path.replaceAll("\\", "/").includes("/vendors/") && basename(path) === "scores.json");
  if (scorePath && command.trim().startsWith("{")) {
    const scoreValidation = validateScoresJson(command);
    if (scoreValidation.fatal) {
      denyTool(scoreValidation.fatal);
      return;
    }
    if (scoreValidation.warnings.length) {
      warnTool(`ArcKit score validation warnings:\n${scoreValidation.warnings.map((warning) => `- ${warning}`).join("\n")}`);
      return;
    }
  }

  const secrets = detectSecrets(command);
  if (secrets.length && /(?:write|edit|create|append|tee|cat\s*>|printf|echo)/i.test(command)) {
    denyTool(`ArcKit blocked writing apparent secret material: ${secrets.join(", ")}`);
    return;
  }

  if (toolName === "Bash" && commandWritesProtectedPath(command)) {
    denyTool("ArcKit blocked a shell command that appears to modify protected credential files.");
  }
}

function handlePermissionRequest(data) {
  const toolName = data.tool_name || data.toolName || "";
  if (ALLOWED_MCP_PREFIXES.some((prefix) => toolName.startsWith(prefix))) {
    allowPermission();
  }
}

function readTextIfExists(path, maxChars = 12000) {
  try {
    if (!existsSync(path)) {
      return "";
    }
    return readFileSync(path, "utf8").slice(0, maxChars);
  } catch {
    return "";
  }
}

function findWorkspaceRoot(cwd) {
  let current = resolve(cwd || process.cwd());
  for (let i = 0; i < 8; i += 1) {
    if (existsSync(join(current, ".arckit")) || existsSync(join(current, "projects")) || existsSync(join(current, ".git"))) {
      return current;
    }
    const parent = dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }
  return resolve(cwd || process.cwd());
}

function safeListDirs(path, limit = 12) {
  try {
    if (!existsSync(path)) {
      return [];
    }
    return readdirSync(path)
      .filter((entry) => {
        try {
          return statSync(join(path, entry)).isDirectory();
        } catch {
          return false;
        }
      })
      .sort()
      .slice(0, limit);
  } catch {
    return [];
  }
}

function countMarkdownFiles(path) {
  try {
    if (!existsSync(path)) {
      return 0;
    }
    let count = 0;
    const stack = [path];
    while (stack.length) {
      const current = stack.pop();
      for (const entry of readdirSync(current)) {
        const entryPath = join(current, entry);
        const stats = statSync(entryPath);
        if (stats.isDirectory()) {
          stack.push(entryPath);
        } else if (entry.toLowerCase().endsWith(".md")) {
          count += 1;
        }
      }
    }
    return count;
  } catch {
    return 0;
  }
}

function buildProjectInventory(workspaceRoot) {
  const projectsDir = join(workspaceRoot, "projects");
  const projectNames = safeListDirs(projectsDir, 8);
  if (!projectNames.length) {
    return [];
  }

  const lines = ["Project inventory:"];
  for (const projectName of projectNames) {
    const projectPath = join(projectsDir, projectName);
    lines.push(`- ${projectName}: ${countMarkdownFiles(projectPath)} markdown artifacts`);
  }
  return lines;
}

function buildContext(data) {
  const workspaceRoot = findWorkspaceRoot(data.cwd);
  const version = readTextIfExists(join(PLUGIN_ROOT, "VERSION"), 100).trim() || "unknown";
  const lines = [
    `ArcKit Codex plugin v${version} is active.`,
    "Use $arckit-* skills for ArcKit workflows. Use project-local `.arckit/templates-custom/` before base templates when customizing outputs.",
    `Workspace root: ${workspaceRoot}`,
  ];

  const projectContext = buildProjectContext(workspaceRoot);
  if (projectContext) {
    lines.push("", projectContext);
  } else {
    const inventory = buildProjectInventory(workspaceRoot);
    if (inventory.length) {
      lines.push("", ...inventory);
    }
  }

  const memoryPath = join(workspaceRoot, ".arckit", "memory", "sessions.md");
  const memory = readTextIfExists(memoryPath, 4000).trim();
  if (memory) {
    lines.push("", "Recent ArcKit session memory:", memory);
  }

  return lines.join("\n");
}

function promptNeedsArcKitContext(prompt) {
  return /\$(?:arckit-[a-z0-9-]+|architecture-workflow|mermaid-syntax|plantuml-syntax|wardley-mapping)\b/i.test(prompt)
    || /\bArcKit\b/.test(prompt);
}

function detectGraphCommand(prompt) {
  const skillMatch = prompt.match(/\$arckit-([a-z0-9-]+)\b/i);
  if (skillMatch && GRAPH_COMMANDS.has(skillMatch[1].toLowerCase())) {
    return skillMatch[1].toLowerCase();
  }
  const slashMatch = prompt.match(/\/arckit[.:]([a-z0-9-]+)\b/i);
  if (slashMatch && GRAPH_COMMANDS.has(slashMatch[1].toLowerCase())) {
    return slashMatch[1].toLowerCase();
  }
  return null;
}

function walkFiles(root, predicate, limit = 600) {
  const files = [];
  const stack = [root];
  while (stack.length && files.length < limit) {
    const current = stack.pop();
    let entries = [];
    try {
      entries = readdirSync(current);
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (entry === ".git" || entry === "node_modules") {
        continue;
      }
      const entryPath = join(current, entry);
      let stats;
      try {
        stats = statSync(entryPath);
      } catch {
        continue;
      }
      if (stats.isDirectory()) {
        stack.push(entryPath);
      } else if (predicate(entryPath, stats)) {
        files.push({ path: entryPath, stats });
      }
    }
  }
  return files;
}

function pathToProjectRelative(workspaceRoot, filePath) {
  const rel = relative(workspaceRoot, filePath).replaceAll("\\", "/");
  if (rel.startsWith("projects/")) {
    return rel;
  }
  const marker = filePath.replaceAll("\\", "/").split("/projects/")[1];
  return marker ? `projects/${marker}` : rel;
}

function scanArtifactGraph(workspaceRoot) {
  const projectsDir = join(workspaceRoot, "projects");
  const nodes = [];
  const edges = [];
  const reqIndex = new Map();
  const projects = new Set();

  if (!existsSync(projectsDir)) {
    return { nodes, edges, reqIndex, projects: [] };
  }

  for (const { path: filePath, stats } of walkFiles(projectsDir, (candidate) => basename(candidate).startsWith("ARC-") && candidate.endsWith(".md"))) {
    const filename = basename(filePath);
    const content = readTextIfExists(filePath, 160000);
    const relPath = pathToProjectRelative(workspaceRoot, filePath);
    const parts = relPath.split("/");
    const project = parts[1] || "unknown";
    const type = extractArcDocType(filename);
    const meta = DOC_TYPES[type] || { name: type || "Unknown", category: "Other" };
    const fields = extractControlFields(content);
    const documentId = extractDocId(filename);
    const reqIds = extractRequirementIds(content);
    const title = extractFirstHeading(content) || fields["Document Title"] || meta.name;
    const preview = content
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith("|") && !line.trim().startsWith("#"))
      .slice(0, 4)
      .join(" ")
      .slice(0, 500);

    projects.add(project);
    const node = {
      id: documentId,
      baseId: baseDocId(documentId),
      project,
      path: relPath,
      type,
      typeName: meta.name,
      category: meta.category,
      title,
      status: fields.Status || fields["Document Status"] || "",
      owner: fields.Owner || fields["Document Owner"] || "",
      classification: fields.Classification || "",
      lastModifiedField: fields["Last Modified"] || "",
      mtimeMs: stats.mtimeMs,
      reqIds,
      preview,
    };
    nodes.push(node);

    for (const reqId of reqIds) {
      if (!reqIndex.has(reqId)) {
        reqIndex.set(reqId, []);
      }
      reqIndex.get(reqId).push(documentId);
    }

    for (const match of content.matchAll(/\bARC-\d{3}-[A-Z][A-Z0-9-]*(?:-\d{3})?(?:-v\d+(?:\.\d+)?)?/g)) {
      const to = match[0].replace(/-v\d+(?:\.\d+)?$/, "");
      if (to !== node.baseId) {
        edges.push({ from: node.baseId, to });
      }
    }
  }

  return { nodes, edges, reqIndex, projects: [...projects].sort() };
}

function summarizeBy(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item[key] || "Unknown";
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}

function formatGraphContext(command, graph, prompt) {
  const lines = [
    `## ArcKit Artifact Graph Context (${command})`,
    "",
    `Indexed ${graph.nodes.length} artifacts across ${graph.projects.length} project(s).`,
  ];

  if (!graph.nodes.length) {
    lines.push("No ArcKit artifacts were found under `projects/` yet.");
    return lines.join("\n");
  }

  lines.push("", "### Projects", ...graph.projects.map((project) => `- ${project}`));
  lines.push("", "### Categories", ...summarizeBy(graph.nodes, "category").map(([name, count]) => `- ${name}: ${count}`));

  if (command === "search") {
    lines.push("", "### Search Index");
    lines.push("```json");
    lines.push(JSON.stringify(graph.nodes.map(({ id, path, project, type, title, status, owner, reqIds, preview }) => ({ id, path, project, type, title, status, owner, reqIds, preview })), null, 2));
    lines.push("```");
    lines.push("", `User query: ${prompt.replace(/\$arckit-search|\/arckit[.:]search/i, "").trim() || "(none)"}`);
  } else if (command === "traceability") {
    const reqDocs = graph.nodes.filter((node) => node.type === "REQ");
    const allReqIds = [...graph.reqIndex.keys()].sort();
    lines.push("", "### Requirements Coverage");
    lines.push(`- Requirement artifacts: ${reqDocs.length}`);
    lines.push(`- Referenced requirement IDs: ${allReqIds.length}`);
    lines.push("```json");
    lines.push(JSON.stringify(Object.fromEntries([...graph.reqIndex.entries()].sort()), null, 2));
    lines.push("```");
  } else if (command === "health" || command === "navigator" || command === "graph-report" || command === "analyze") {
    const byProject = new Map();
    for (const node of graph.nodes) {
      if (!byProject.has(node.project)) {
        byProject.set(node.project, new Set());
      }
      byProject.get(node.project).add(node.type);
    }
    lines.push("", "### Project Coverage");
    for (const [project, types] of [...byProject.entries()].sort()) {
      const missing = ESSENTIAL_DOC_TYPES.filter((type) => !types.has(type));
      lines.push(`- ${project}: ${types.size} artifact types; missing essentials: ${missing.length ? missing.join(", ") : "none"}`);
    }
    const now = Date.now();
    const stale = graph.nodes
      .map((node) => ({ ...node, ageDays: Math.floor((now - node.mtimeMs) / 86400000) }))
      .filter((node) => node.ageDays >= 90)
      .sort((a, b) => b.ageDays - a.ageDays)
      .slice(0, 20);
    if (stale.length) {
      lines.push("", "### Potentially Stale Artifacts");
      lines.push(...stale.map((node) => `- ${node.path}: ${node.ageDays} days old`));
    }
  } else if (command === "impact") {
    lines.push("", "### Dependency Edges");
    lines.push("```json");
    lines.push(JSON.stringify(graph.edges.slice(0, 300), null, 2));
    lines.push("```");
  }

  lines.push("", "Use this hook-provided graph as scan context before reading broad project trees.");
  return lines.join("\n");
}

function buildGraphContext(data, command, prompt) {
  const workspaceRoot = findWorkspaceRoot(data.cwd);
  return formatGraphContext(command, scanArtifactGraph(workspaceRoot), prompt);
}

function handleUserPromptSubmit(data) {
  const prompt = data.prompt || data.user_prompt || "";
  const secrets = detectSecrets(prompt);
  if (secrets.length) {
    blockPrompt(`ArcKit blocked a prompt that appears to contain secret material: ${secrets.join(", ")}. Remove the secret and reference it via an environment variable or secret manager instead.`);
    return;
  }

  const contexts = [];
  if (promptNeedsArcKitContext(prompt)) {
    contexts.push(buildContext(data));
  }

  const graphContext = hookAdditionalContext(runGraphInjectHook(data));
  if (graphContext) {
    contexts.push(graphContext);
  } else {
    const graphCommand = detectGraphCommand(prompt);
    if (graphCommand) {
      contexts.push(buildGraphContext(data, graphCommand, prompt));
    }
  }

  if (promptMatchesCommand(prompt, "pages")) {
    const pagesContext = hookAdditionalContext(runSyncGuidesHook(data));
    if (pagesContext) {
      contexts.push(pagesContext);
    }
  }

  if (contexts.length) {
    emitContext("UserPromptSubmit", contexts.join("\n\n---\n\n"));
  }
}

function handleSessionStart(data) {
  emitContext("SessionStart", buildContext(data));
}

function resolveChangedPath(workspaceRoot, candidate) {
  if (!candidate || typeof candidate !== "string") {
    return null;
  }
  const stripped = candidate.replace(/^['"]|['"]$/g, "");
  const absolute = stripped.startsWith("/") ? stripped : resolve(workspaceRoot, stripped);
  return existsSync(absolute) ? absolute : null;
}

function getChangedPaths(data) {
  const workspaceRoot = findWorkspaceRoot(data.cwd);
  const toolInput = getToolInput(data);
  const command = stringifyToolInput(toolInput);
  const patch = extractPatchDetails(command);
  const candidates = [...extractExplicitPaths(toolInput), ...patch.paths];
  return [...new Set(candidates.map((candidate) => resolveChangedPath(workspaceRoot, candidate)).filter(Boolean))];
}

function isArcProjectArtifact(filePath) {
  const normalized = filePath.replaceAll("\\", "/");
  return normalized.includes("/projects/")
    && /^ARC-\d{3}-.+-v\d+(?:\.\d+)?\.md$/.test(basename(normalized));
}

function updateManifestForArtifact(workspaceRoot, filePath) {
  const manifestPath = join(workspaceRoot, "docs", "manifest.json");
  if (!existsSync(manifestPath)) {
    return null;
  }

  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  } catch {
    return null;
  }

  const relPath = pathToProjectRelative(workspaceRoot, filePath);
  const parts = relPath.split("/");
  if (parts[0] !== "projects" || parts.length < 3) {
    return null;
  }

  const filename = basename(filePath);
  const documentId = extractDocId(filename);
  const docType = extractArcDocType(filename);
  const meta = DOC_TYPES[docType] || { name: docType || "Unknown", category: "Other" };
  const content = readTextIfExists(filePath, 80000);
  const title = extractFirstHeading(content) || meta.name;
  const entry = { path: relPath, title, documentId };
  const projectId = parts[1];
  const subdir = parts.length > 3 ? parts[2] : null;
  const targetKey = subdir && SUBDIR_TO_MANIFEST_KEY[subdir] ? SUBDIR_TO_MANIFEST_KEY[subdir] : "documents";
  const entryBaseId = baseDocId(documentId);

  if (projectId === "000-global") {
    entry.category = meta.category;
    if (!Array.isArray(manifest.global)) {
      manifest.global = [];
    }
    manifest.global = manifest.global.filter((item) => baseDocId(item.documentId || "") !== entryBaseId);
    manifest.global.push(entry);
    if (docType === "PRIN") {
      entry.isDefault = true;
      manifest.defaultDocument = relPath;
    }
  } else {
    if (!Array.isArray(manifest.projects)) {
      manifest.projects = [];
    }
    let project = manifest.projects.find((candidate) => candidate.id === projectId);
    if (!project) {
      project = {
        id: projectId,
        name: projectId.replace(/^\d{3}-/, "").split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" "),
        documents: [],
      };
      manifest.projects.push(project);
    }
    if (!Array.isArray(project[targetKey])) {
      project[targetKey] = [];
    }
    if (targetKey === "documents") {
      entry.category = meta.category;
    }
    project[targetKey] = project[targetKey].filter((item) => baseDocId(item.documentId || "") !== entryBaseId);
    project[targetKey].push(entry);
  }

  manifest.generated = new Date().toISOString();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf8");
  return `${documentId} -> ${relPath}`;
}

function buildProvenanceBlock(data) {
  const rows = [
    ["Stamped at", new Date().toISOString()],
    ["Hook", "ArcKit Codex PostToolUse"],
  ];
  if (data.model) {
    rows.push(["Model", `\`${data.model}\``]);
  }
  if (data.tool_name || data.toolName) {
    rows.push(["Tool", `\`${data.tool_name || data.toolName}\``]);
  }
  if (data.session_id) {
    rows.push(["Session", `\`${data.session_id}\``]);
  }
  if (data.turn_id) {
    rows.push(["Turn", `\`${data.turn_id}\``]);
  }

  const tableRows = rows.map(([key, value]) => `| ${key} | ${value} |`).join("\n");
  return `${PROV_START}\n\n## Build Provenance\n\n_Stamped automatically by the ArcKit Codex PostToolUse hook. This records runtime context that should not be manually invented in generated artifacts._\n\n| Field | Value |\n|-------|-------|\n${tableRows}\n\n${PROV_END}\n`;
}

function stampProvenance(filePath, data) {
  let content = readTextIfExists(filePath, 1000000);
  if (!content) {
    return false;
  }
  const block = buildProvenanceBlock(data);
  const start = content.indexOf(PROV_START);
  const end = content.indexOf(PROV_END);
  let next;
  if (start >= 0 && end > start) {
    const afterEnd = end + PROV_END.length;
    next = `${content.slice(0, start).trimEnd()}\n\n${block}${content.slice(afterEnd).replace(/^\s+/, "\n")}`;
  } else {
    next = `${content.trimEnd()}\n\n${block}`;
  }
  if (next === content) {
    return false;
  }
  writeFileSync(filePath, next, "utf8");
  return true;
}

function handlePostToolUse(data) {
  const workspaceRoot = findWorkspaceRoot(data.cwd);
  const changedArtifacts = getChangedPaths(data).filter(isArcProjectArtifact);
  if (!changedArtifacts.length) {
    return;
  }

  const notes = [];
  for (const artifactPath of changedArtifacts) {
    if (stampProvenance(artifactPath, data)) {
      notes.push(`Provenance stamped: ${pathToProjectRelative(workspaceRoot, artifactPath)}`);
    }
    const manifestUpdate = updateManifestForArtifact(workspaceRoot, artifactPath);
    if (manifestUpdate) {
      notes.push(`Manifest updated: ${manifestUpdate}`);
    }
  }

  if (notes.length) {
    emitContext("PostToolUse", `ArcKit post-tool maintenance completed:\n${notes.map((note) => `- ${note}`).join("\n")}`);
  }
}

function classifySessionFromFiles(files) {
  const categories = new Set();
  for (const file of files) {
    const type = extractArcDocType(basename(file));
    if (type && DOC_TYPES[type]) {
      categories.add(DOC_TYPES[type].category);
    }
  }
  for (const category of ["Compliance", "Governance", "Research", "Procurement", "Architecture", "Planning", "Discovery", "Operations"]) {
    if (categories.has(category)) {
      return category.toLowerCase();
    }
  }
  return "general";
}

function runGit(cwd, args) {
  try {
    return execFileSync("git", args, { cwd, encoding: "utf8", timeout: 5000 }).trim();
  } catch {
    return "";
  }
}

function handleStop(data) {
  const workspaceRoot = findWorkspaceRoot(data.cwd);
  if (!existsSync(join(workspaceRoot, ".arckit")) && !existsSync(join(workspaceRoot, "projects"))) {
    return;
  }

  const memoryDir = join(workspaceRoot, ".arckit", "memory");
  const lastSessionFile = join(memoryDir, ".last-session");
  const since = readTextIfExists(lastSessionFile, 100).trim() || "4 hours ago";
  const commits = runGit(workspaceRoot, ["log", `--since=${since}`, "--oneline", "--no-merges"]);
  const changed = runGit(workspaceRoot, ["log", `--since=${since}`, "--no-merges", "--name-only", "--pretty=format:"]);
  const files = [...new Set(changed.split(/\r?\n/).filter(Boolean))];
  const failureReason = data.error?.message || data.error?.type || data.reason || "";

  if (!commits && !failureReason) {
    mkdirSync(memoryDir, { recursive: true });
    writeFileSync(lastSessionFile, new Date().toISOString(), "utf8");
    return;
  }

  const now = new Date();
  const sessionType = failureReason ? `failure (${failureReason})` : classifySessionFromFiles(files);
  const commitLines = commits.split(/\r?\n/).filter(Boolean);
  const entry = [
    `### ${now.toISOString().slice(0, 10)} ${now.toISOString().slice(11, 16)} - ${sessionType}`,
    "",
    `- **Commits:** ${commitLines.length} | **Files changed:** ${files.length}`,
    `- **Artifacts touched:** ${files.filter((file) => /^ARC-\d{3}-.+-v\d+(?:\.\d+)?\.md$/.test(basename(file))).length}`,
    ...(failureReason ? [`- **Status:** interrupted by ${failureReason}`] : []),
    ...(commitLines.length ? ["- **Summary:**", ...commitLines.slice(0, 8).map((line) => `  - ${line.replace(/^[0-9a-f]+\s+/, "")}`)] : []),
    "",
  ].join("\n");

  mkdirSync(memoryDir, { recursive: true });
  const sessionsFile = join(memoryDir, "sessions.md");
  const existing = readTextIfExists(sessionsFile, 200000).trim();
  const header = existing && existing.startsWith("# Session Log")
    ? existing.split(/\n(?=### \d{4}-\d{2}-\d{2})/)[0].trimEnd()
    : "# Session Log\n\nAutomated session summaries captured by the ArcKit Codex Stop hook.";
  const oldEntries = existing && existing.startsWith("# Session Log")
    ? existing.split(/\n(?=### \d{4}-\d{2}-\d{2})/).slice(1)
    : [];
  writeFileSync(sessionsFile, `${header}\n\n${[entry, ...oldEntries].slice(0, 30).join("\n").trimEnd()}\n`, "utf8");
  writeFileSync(lastSessionFile, now.toISOString(), "utf8");
}

function main() {
  const data = readHookInput();
  const eventName = process.argv[2] || data.hook_event_name || data.hookEventName || "";

  if (eventName === "SessionStart") {
    handleSessionStart(data);
  } else if (eventName === "UserPromptSubmit") {
    handleUserPromptSubmit(data);
  } else if (eventName === "PreToolUse") {
    handlePreToolUse(data);
  } else if (eventName === "PostToolUse") {
    handlePostToolUse(data);
  } else if (eventName === "PermissionRequest") {
    handlePermissionRequest(data);
  } else if (eventName === "Stop") {
    handleStop(data);
  }
}

main();
