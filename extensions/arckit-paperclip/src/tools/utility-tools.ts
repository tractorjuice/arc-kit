import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import type { PluginContext, ToolResult, ToolRunContext } from "@paperclipai/plugin-sdk";
import {
  createProject,
  generateDocumentId,
  listProjects,
  formatProjectsTable,
  checkPrerequisites,
} from "../lib/arckit.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function registerUtilityTools(ctx: PluginContext): void {
  ctx.tools.register(
    "arckit-create-project",
    {
      displayName: "arckit-create-project",
      description: "Create a numbered ArcKit project directory (e.g., 001-nhs-appointment)",
      parametersSchema: {
        type: "object",
        properties: {
          name: { type: "string", description: "Project name (will be slugified)" },
          force: { type: "boolean", description: "Skip principles prerequisite check" },
        },
        required: ["name"],
      },
    },
    async (params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
      const { name, force } = params as { name?: string; force?: boolean };
      if (!name) return { error: "name is required" };
      try {
        const result = createProject(name, { force });
        return { content: JSON.stringify(result, null, 2), data: result };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  );

  ctx.tools.register(
    "arckit-generate-doc-id",
    {
      displayName: "arckit-generate-doc-id",
      description: "Generate a document ID (e.g., ARC-001-REQ-v1.0) and filename",
      parametersSchema: {
        type: "object",
        properties: {
          projectId: { type: "string", description: "Project number (e.g., 001)" },
          docType: {
            type: "string",
            description: "Document type code (e.g., REQ, ADR, SOBC, RISK, STKE)",
          },
          version: { type: "string", description: "Version number (default: 1.0)" },
          projectDir: {
            type: "string",
            description: "Project directory for multi-instance types (ADR, DIAG, etc.)",
          },
          filename: { type: "boolean", description: "Append .md extension (default: true)" },
        },
        required: ["projectId", "docType"],
      },
    },
    async (params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
      const p = params as {
        projectId?: string;
        docType?: string;
        version?: string;
        projectDir?: string;
        filename?: boolean;
      };
      if (!p.projectId || !p.docType) {
        return { error: "projectId and docType are required" };
      }
      try {
        const docId = generateDocumentId({
          projectId: p.projectId,
          docType: p.docType,
          version: p.version,
          projectDir: p.projectDir,
          filename: p.filename ?? true,
        });
        return { content: docId, data: { docId } };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  );

  ctx.tools.register(
    "arckit-check-prerequisites",
    {
      displayName: "arckit-check-prerequisites",
      description: "Validate that ArcKit prerequisites exist (principles, templates, project structure)",
      parametersSchema: { type: "object", properties: {} },
    },
    async (_params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
      try {
        const result = checkPrerequisites();
        return { content: JSON.stringify(result, null, 2), data: result };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  );

  ctx.tools.register(
    "arckit-list-projects",
    {
      displayName: "arckit-list-projects",
      description: "List all ArcKit projects with artifact counts",
      parametersSchema: {
        type: "object",
        properties: {
          format: {
            type: "string",
            description: "Output format: table or json (default: json)",
            enum: ["table", "json"],
          },
        },
      },
    },
    async (params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
      const { format } = params as { format?: string };
      try {
        const result = listProjects();
        const content =
          format === "table" ? formatProjectsTable(result) : JSON.stringify(result, null, 2);
        return { content, data: result };
      } catch (err) {
        return { error: err instanceof Error ? err.message : String(err) };
      }
    },
  );

  ctx.tools.register(
    "arckit-check",
    {
      displayName: "arckit-check",
      description: "Check that ArcKit plugin data files are present and readable",
      parametersSchema: { type: "object", properties: {} },
    },
    async (_params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
      const checks: string[] = [];
      const dataPath = path.resolve(__dirname, "../data/commands.json");
      if (fs.existsSync(dataPath)) {
        const cmds = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        checks.push(`commands.json: OK (${cmds.length} commands)`);
      } else {
        checks.push("commands.json: MISSING");
      }
      const templatesPath = path.resolve(__dirname, "../../templates");
      if (fs.existsSync(templatesPath)) {
        const count = fs.readdirSync(templatesPath).filter((f) => f.endsWith(".md")).length;
        checks.push(`templates/: OK (${count} templates)`);
      } else {
        checks.push("templates/: MISSING");
      }
      const referencesPath = path.resolve(__dirname, "../../references");
      if (fs.existsSync(referencesPath)) {
        const count = fs.readdirSync(referencesPath).filter((f) => f.endsWith(".md")).length;
        checks.push(`references/: OK (${count} files)`);
      } else {
        checks.push("references/: MISSING");
      }
      const allOk = checks.every((c) => c.includes("OK"));
      const content = `ArcKit Plugin Health: ${allOk ? "HEALTHY" : "DEGRADED"}\n${checks.join("\n")}`;
      return { content, data: { healthy: allOk, checks } };
    },
  );
}
