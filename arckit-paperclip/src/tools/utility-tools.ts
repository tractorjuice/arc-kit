import { execFileSync } from "node:child_process";
import * as path from "node:path";
import * as fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCRIPTS_DIR = path.resolve(__dirname, "../../scripts/bash");

export function registerUtilityTools(ctx: any): void {
  // 1. Create a numbered project directory
  ctx.tools.register(
    "arckit-create-project",
    {
      name: "arckit-create-project",
      displayName: "arckit-create-project",
      description:
        "Create a numbered ArcKit project directory (e.g., 001-nhs-appointment)",
      parametersSchema: {
        type: "object",
        properties: {
          name: {
            type: "string",
            description: "Project name (will be slugified)",
          },
        },
        required: ["name"],
      },
    },
    async (params: { name: string }) => {
      const result = execFileSync(
        "bash",
        [path.join(SCRIPTS_DIR, "create-project.sh"), "--name", params.name, "--json"],
        { encoding: "utf-8", timeout: 30000 }
      );
      let data;
      try {
        data = JSON.parse(result);
      } catch {
        data = { raw: result.trim() };
      }
      return { content: result.trim(), data };
    }
  );

  // 2. Generate a document ID and filename
  ctx.tools.register(
    "arckit-generate-doc-id",
    {
      name: "arckit-generate-doc-id",
      displayName: "arckit-generate-doc-id",
      description:
        "Generate a document ID (e.g., ARC-001-REQ-v1.0) and filename",
      parametersSchema: {
        type: "object",
        properties: {
          projectId: {
            type: "string",
            description: "Project number (e.g., 001)",
          },
          docType: {
            type: "string",
            description:
              "Document type code (e.g., REQ, ADR, SOBC, RISK, STKE)",
          },
          version: {
            type: "string",
            description: "Version number (default: 1.0)",
          },
          projectDir: {
            type: "string",
            description:
              "Project directory path for multi-instance types (ADR, DIAG, DFD, WARD, DMC, etc.) to auto-detect next sequence number",
          },
        },
        required: ["projectId", "docType"],
      },
    },
    async (params: { projectId: string; docType: string; version?: string; projectDir?: string }) => {
      const ver = params.version || "1.0";
      const MULTI_INSTANCE_TYPES = [
        "ADR", "DIAG", "DFD", "WARD", "DMC", "RSCH", "AWRS", "AZRS",
        "GCRS", "DSCT", "WGAM", "WCLM", "WVCH", "GOVR", "GCSR", "GLND",
      ];
      const args = [
        path.join(SCRIPTS_DIR, "generate-document-id.sh"),
        params.projectId,
        params.docType,
        ver,
        "--filename",
      ];
      if (MULTI_INSTANCE_TYPES.includes(params.docType.toUpperCase()) && params.projectDir) {
        args.push("--next-num", params.projectDir);
      }
      const result = execFileSync("bash", args, {
        encoding: "utf-8",
        timeout: 10000,
      });
      return {
        content: result.trim(),
        data: { docId: result.trim() },
      };
    }
  );

  // 3. Check prerequisites
  ctx.tools.register(
    "arckit-check-prerequisites",
    {
      name: "arckit-check-prerequisites",
      displayName: "arckit-check-prerequisites",
      description:
        "Validate that ArcKit prerequisites exist (principles, templates, project structure)",
      parametersSchema: {
        type: "object",
        properties: {},
      },
    },
    async () => {
      const result = execFileSync(
        "bash",
        [path.join(SCRIPTS_DIR, "check-prerequisites.sh")],
        { encoding: "utf-8", timeout: 15000 }
      );
      return { content: result.trim(), data: { output: result.trim() } };
    }
  );

  // 4. List projects
  ctx.tools.register(
    "arckit-list-projects",
    {
      name: "arckit-list-projects",
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
    async (params: { format?: string }) => {
      const fmt = params.format || "json";
      const args = [path.join(SCRIPTS_DIR, "list-projects.sh")];
      if (fmt === "json") {
        args.push("--json");
      }
      const result = execFileSync("bash", args, {
        encoding: "utf-8",
        timeout: 15000,
      });
      let data;
      if (fmt === "json") {
        try {
          data = JSON.parse(result);
        } catch {
          data = { raw: result.trim() };
        }
      } else {
        data = { raw: result.trim() };
      }
      return { content: result.trim(), data };
    }
  );

  // 5. Check plugin health
  ctx.tools.register(
    "arckit-check",
    {
      name: "arckit-check",
      displayName: "arckit-check",
      description:
        "Check that ArcKit plugin files are present and readable",
      parametersSchema: {
        type: "object",
        properties: {},
      },
    },
    async () => {
      const checks: string[] = [];
      const scriptsExist = fs.existsSync(SCRIPTS_DIR);
      checks.push(
        scriptsExist
          ? `scripts/bash/: OK (${fs.readdirSync(SCRIPTS_DIR).length} files)`
          : "scripts/bash/: MISSING"
      );
      const dataPath = path.resolve(__dirname, "../data/commands.json");
      if (fs.existsSync(dataPath)) {
        const commands = JSON.parse(
          fs.readFileSync(dataPath, "utf-8")
        );
        checks.push(`commands.json: OK (${commands.length} commands)`);
      } else {
        checks.push("commands.json: MISSING");
      }
      const allOk = checks.every((c) => c.includes("OK"));
      const content = `ArcKit Plugin Health: ${allOk ? "HEALTHY" : "DEGRADED"}\n${checks.join("\n")}`;
      return { content, data: { healthy: allOk, checks } };
    }
  );
}
