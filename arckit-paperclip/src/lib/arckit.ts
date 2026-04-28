import * as fs from "node:fs";
import * as path from "node:path";

export const MULTI_INSTANCE_TYPES = new Set([
  "ADR", "DIAG", "DFD", "WARD", "DMC", "RSCH", "AWRS", "AZRS",
  "GCRS", "DSCT", "WGAM", "WCLM", "WVCH", "GOVR", "GCSR", "GLND",
]);

export function findRepoRoot(startDir: string = process.cwd()): string {
  let dir = path.resolve(startDir);
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "projects"))) return dir;
    dir = path.dirname(dir);
  }
  throw new Error("Not in an ArcKit project (no projects/ directory found)");
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getNextProjectNumber(repoRoot: string): string {
  const projectsDir = path.join(repoRoot, "projects");
  if (!fs.existsSync(projectsDir)) return "001";
  let max = 0;
  for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const match = /^(\d{3})-/.exec(entry.name);
    if (match) {
      const n = parseInt(match[1]!, 10);
      if (n > max) max = n;
    }
  }
  return String(max + 1).padStart(3, "0");
}

export function getProjectNumberFromDir(dir: string): string | null {
  const match = /^(\d{3})-/.exec(path.basename(dir));
  return match ? match[1]! : null;
}

export interface CreateProjectResult {
  success: true;
  project_dir: string;
  project_number: string;
  project_name: string;
  requirements_file: string;
  stakeholders_file: string;
  risk_file: string;
  sobc_file: string;
  sow_file: string;
  evaluation_file: string;
  traceability_file: string;
  decisions_dir: string;
  diagrams_dir: string;
  wardley_maps_dir: string;
  reviews_dir: string;
  vendors_dir: string;
  external_dir: string;
  global_external_dir: string;
  policies_dir: string;
  next_steps: string[];
}

const EXTERNAL_README = `# External Documents

Place external reference documents here for ArcKit commands to read as context.

## Supported File Types
- PDF (.pdf), Word (.docx), Markdown (.md)
- Images (.png, .jpg), CSV (.csv), SQL (.sql)

## What to Put Here
- RFP/ITT documents
- Legacy system specifications
- User research reports
- Previous assessments and audits
- Database schemas and ERD diagrams
- Compliance evidence and certificates
- Vendor proposals and technical responses
- Performance benchmarks and test results
`;

const POLICIES_README = `# Organization Policies

Place organization-wide governance documents here. These are read by commands across ALL projects.

## What to Put Here
- Architecture principles and TOGAF standards
- Security policies and compliance frameworks
- Risk appetite statements and threat assessments
- Technology standards and approved platforms
- Procurement policies and spending thresholds
- Cloud-first mandates and approved supplier lists
- AI governance frameworks and ethical guidelines
`;

const GLOBAL_EXTERNAL_README = `# Global External Documents

Place organization-wide reference documents here. These are read by commands across ALL projects.
`;

function ensureReadme(filePath: string, content: string): void {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, content);
  }
}

function projectReadme(name: string, number: string): string {
  const today = new Date().toISOString().slice(0, 10);
  return `# ${name}

Project ID: ${number}
Created: ${today}

## Overview

[Project description to be added]

## Workflow

Use ArcKit commands to generate project artifacts in the recommended order.

Documents use: \`ARC-${number}-{TYPE}-v{VERSION}.md\`
`;
}

function hasDoc(projectDir: string, typeCode: string): boolean {
  if (!fs.existsSync(projectDir)) return false;
  const projectNumber = getProjectNumberFromDir(projectDir);
  if (!projectNumber) return false;
  const prefix = `ARC-${projectNumber}-${typeCode}-`;
  return fs
    .readdirSync(projectDir)
    .some((f) => f.startsWith(prefix) && f.endsWith(".md"));
}

function hasDirContent(dir: string): boolean {
  return fs.existsSync(dir) && fs.readdirSync(dir).length > 0;
}

function computeNextSteps(projectDir: string): string[] {
  if (!hasDoc(projectDir, "STKE") && !fs.existsSync(path.join(projectDir, "stakeholder-drivers.md"))) {
    return ["/arckit.stakeholders - Analyze stakeholder drivers and goals"];
  }
  if (!hasDoc(projectDir, "RISK") && !fs.existsSync(path.join(projectDir, "risk-register.md"))) {
    return ["/arckit.risk - Create risk register"];
  }
  if (!hasDoc(projectDir, "SOBC") && !fs.existsSync(path.join(projectDir, "sobc.md"))) {
    return ["/arckit.sobc - Create Strategic Outline Business Case"];
  }
  if (!hasDoc(projectDir, "REQ") && !fs.existsSync(path.join(projectDir, "requirements.md"))) {
    return ["/arckit.requirements - Define business and technical requirements"];
  }
  if (!hasDoc(projectDir, "DATA") && !fs.existsSync(path.join(projectDir, "data-model.md"))) {
    return ["/arckit.data-model - Design data model"];
  }
  if (!hasDirContent(path.join(projectDir, "wardley-maps"))) {
    return [
      "/arckit.research - Research technology options",
      "/arckit.wardley - Create Wardley maps",
    ];
  }
  if (!hasDoc(projectDir, "SOW") && !fs.existsSync(path.join(projectDir, "sow.md"))) {
    return ["/arckit.sow - Generate Statement of Work for RFP"];
  }
  return ["/arckit.evaluate - Create vendor evaluation framework"];
}

export function createProject(name: string, opts?: { repoRoot?: string; force?: boolean }): CreateProjectResult {
  const repoRoot = opts?.repoRoot ?? findRepoRoot();
  const globalDir = path.join(repoRoot, "projects", "000-global");

  if (!opts?.force) {
    const hasPrinciples =
      fs.existsSync(globalDir) &&
      fs
        .readdirSync(globalDir)
        .some((f) => /^ARC-000-PRIN-.*\.md$/.test(f));
    if (!hasPrinciples) {
      throw new Error(
        "Prerequisites not met: Architecture principles not found. Expected projects/000-global/ARC-000-PRIN-v*.md. Run /arckit.principles first, or pass force=true to skip.",
      );
    }
  }

  if (!name || name.trim().length === 0) {
    throw new Error("Project name is required");
  }

  const projectNumber = getNextProjectNumber(repoRoot);
  const projectSlug = slugify(name);
  const projectDirName = `${projectNumber}-${projectSlug}`;
  const projectDir = path.join(repoRoot, "projects", projectDirName);

  for (const sub of [
    "",
    "vendors",
    "external",
    "final",
    "decisions",
    "diagrams",
    "wardley-maps",
    "data-contracts",
    "reviews",
  ]) {
    fs.mkdirSync(path.join(projectDir, sub), { recursive: true });
  }

  ensureReadme(path.join(projectDir, "external", "README.md"), EXTERNAL_README);
  ensureReadme(path.join(globalDir, "policies", "README.md"), POLICIES_README);
  ensureReadme(path.join(globalDir, "external", "README.md"), GLOBAL_EXTERNAL_README);
  fs.writeFileSync(path.join(projectDir, "README.md"), projectReadme(name, projectNumber));

  const docFile = (type: string) =>
    path.join(projectDir, `ARC-${projectNumber}-${type}-v1.0.md`);

  return {
    success: true,
    project_dir: projectDir,
    project_number: projectNumber,
    project_name: name,
    requirements_file: docFile("REQ"),
    stakeholders_file: docFile("STKE"),
    risk_file: docFile("RISK"),
    sobc_file: docFile("SOBC"),
    sow_file: docFile("SOW"),
    evaluation_file: docFile("EVAL"),
    traceability_file: docFile("TRAC"),
    decisions_dir: path.join(projectDir, "decisions"),
    diagrams_dir: path.join(projectDir, "diagrams"),
    wardley_maps_dir: path.join(projectDir, "wardley-maps"),
    reviews_dir: path.join(projectDir, "reviews"),
    vendors_dir: path.join(projectDir, "vendors"),
    external_dir: path.join(projectDir, "external"),
    global_external_dir: path.join(globalDir, "external"),
    policies_dir: path.join(globalDir, "policies"),
    next_steps: computeNextSteps(projectDir),
  };
}

export interface GenerateDocIdParams {
  projectId: string;
  docType: string;
  version?: string;
  projectDir?: string;
  filename?: boolean;
}

export function generateDocumentId(params: GenerateDocIdParams): string {
  const { projectId, docType, version = "1.0", projectDir, filename = true } = params;
  if (!projectId) throw new Error("projectId is required");
  if (!docType) throw new Error("docType is required");

  const typeUpper = docType.toUpperCase();
  const projectNumClean = projectId.replace(/^0+/, "") || "0";
  const projectPadded = String(parseInt(projectNumClean, 10)).padStart(3, "0");

  let docId: string;
  if (MULTI_INSTANCE_TYPES.has(typeUpper)) {
    if (!projectDir) {
      throw new Error(
        `Multi-instance type '${typeUpper}' requires projectDir to determine next sequence number`,
      );
    }
    let nextNum = 1;
    if (fs.existsSync(projectDir)) {
      const prefix = `ARC-${projectPadded}-${typeUpper}-`;
      const pattern = new RegExp(`^${prefix}(\\d+)-.*\\.md$`);
      for (const file of fs.readdirSync(projectDir)) {
        const match = pattern.exec(file);
        if (match) {
          const seq = parseInt(match[1]!, 10);
          if (seq >= nextNum) nextNum = seq + 1;
        }
      }
    }
    const seq = String(nextNum).padStart(3, "0");
    docId = `ARC-${projectPadded}-${typeUpper}-${seq}-v${version}`;
  } else {
    docId = `ARC-${projectPadded}-${typeUpper}-v${version}`;
  }

  return filename ? `${docId}.md` : docId;
}

export interface ProjectSummary {
  name: string;
  number: string | null;
  path: string;
  completion_percentage: number;
  vendor_count: number;
  external_doc_count: number;
  artifacts: Record<string, boolean>;
}

const ARTIFACT_TO_TYPE: Record<string, string> = {
  stakeholder_drivers: "STKE",
  risk_register: "RISK",
  sobc: "SOBC",
  requirements: "REQ",
  data_model: "DATA",
  research_findings: "RSCH",
  sow: "SOW",
  evaluation_criteria: "EVAL",
};

const LEGACY_FILENAME: Record<string, string> = {
  stakeholder_drivers: "stakeholder-drivers.md",
  risk_register: "risk-register.md",
  sobc: "sobc.md",
  requirements: "requirements.md",
  data_model: "data-model.md",
  research_findings: "research-findings.md",
  sow: "sow.md",
  evaluation_criteria: "evaluation-criteria.md",
};

function countFilesMatching(dir: string, predicate: (name: string) => boolean): number {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isFile() && predicate(e.name)).length;
}

function countSubdirs(dir: string): number {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory()).length;
}

function describeProject(projectDir: string): ProjectSummary {
  const name = path.basename(projectDir);
  const number = getProjectNumberFromDir(projectDir);
  const vendorCount = countSubdirs(path.join(projectDir, "vendors"));
  const extExts = /\.(pdf|docx|md|csv|sql|png|jpg)$/i;
  const externalDocCount = countFilesMatching(
    path.join(projectDir, "external"),
    (f) => extExts.test(f) && f !== "README.md",
  );

  const artifacts: Record<string, boolean> = {};
  let completed = 0;
  const total = 10;

  for (const [key, typeCode] of Object.entries(ARTIFACT_TO_TYPE)) {
    const legacy = LEGACY_FILENAME[key]!;
    const present =
      fs.existsSync(path.join(projectDir, legacy)) || hasDoc(projectDir, typeCode);
    artifacts[key] = present;
    if (present) completed++;
  }

  const wardley = hasDirContent(path.join(projectDir, "wardley-maps"));
  artifacts.wardley_maps = wardley;
  if (wardley) completed++;

  const vendors = hasDirContent(path.join(projectDir, "vendors"));
  artifacts.vendors = vendors;
  if (vendors) completed++;

  return {
    name,
    number,
    path: projectDir,
    completion_percentage: Math.floor((completed * 100) / total),
    vendor_count: vendorCount,
    external_doc_count: externalDocCount,
    artifacts,
  };
}

export interface ListProjectsResult {
  repository_root: string;
  projects_dir: string;
  project_count: number;
  projects: ProjectSummary[];
}

export function listProjects(repoRoot?: string): ListProjectsResult {
  const root = repoRoot ?? findRepoRoot();
  const projectsDir = path.join(root, "projects");
  if (!fs.existsSync(projectsDir)) {
    return { repository_root: root, projects_dir: projectsDir, project_count: 0, projects: [] };
  }
  const projects: ProjectSummary[] = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => describeProject(path.join(projectsDir, e.name)))
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    repository_root: root,
    projects_dir: projectsDir,
    project_count: projects.length,
    projects,
  };
}

export function formatProjectsTable(result: ListProjectsResult): string {
  const lines = [
    `ArcKit Projects`,
    `===============`,
    ``,
    `Repository: ${result.repository_root}`,
    `Projects found: ${result.project_count}`,
    ``,
  ];
  for (const p of result.projects) {
    const emoji =
      p.completion_percentage === 100 ? "DONE"
      : p.completion_percentage >= 75 ? "HIGH"
      : p.completion_percentage >= 50 ? "MID"
      : p.completion_percentage >= 25 ? "LOW"
      : "NEW";
    lines.push(`[${emoji}] [${p.number ?? "---"}] ${p.name} (${p.completion_percentage}% complete)`);
  }
  return lines.join("\n");
}

export interface PrerequisiteCheck {
  repo_root: string;
  arckit_dir: string;
  projects_dir: string;
  memory_dir: string;
  templates_dir: string;
  principles_present: boolean;
  templates_present: boolean;
  project_count: number;
}

export function checkPrerequisites(repoRoot?: string): PrerequisiteCheck {
  const root = repoRoot ?? findRepoRoot();
  const arckitDir = path.join(root, ".arckit");
  const projectsDir = path.join(root, "projects");
  const memoryDir = path.join(projectsDir, "000-global");
  const templatesDir = path.join(arckitDir, "templates");

  const principlesPresent =
    fs.existsSync(memoryDir) &&
    fs.readdirSync(memoryDir).some((f) => /^ARC-000-PRIN-.*\.md$/.test(f));

  const templatesPresent = fs.existsSync(templatesDir);

  const projectCount = fs.existsSync(projectsDir)
    ? fs.readdirSync(projectsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).length
    : 0;

  return {
    repo_root: root,
    arckit_dir: arckitDir,
    projects_dir: projectsDir,
    memory_dir: memoryDir,
    templates_dir: templatesDir,
    principles_present: principlesPresent,
    templates_present: templatesPresent,
    project_count: projectCount,
  };
}
