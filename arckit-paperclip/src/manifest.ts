import type { PaperclipPluginManifestV1 } from "@paperclipai/plugin-sdk";
import commands from "./data/commands.json" with { type: "json" };
import { CommandEntry } from "./types.js";
import pkg from "../package.json" with { type: "json" };

const typedCommands: CommandEntry[] = commands as CommandEntry[];

const commandTools = typedCommands.map((cmd) => ({
  name: cmd.name,
  displayName: cmd.name,
  description: cmd.description,
  parametersSchema: {
    type: "object" as const,
    properties: {
      topic: {
        type: "string" as const,
        description: "Project name or topic",
      },
    },
    required: ["topic"],
  },
}));

const utilityTools = [
  {
    name: "arckit-create-project",
    displayName: "arckit-create-project",
    description: "Create a numbered ArcKit project directory",
    parametersSchema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string" as const,
          description: "Project name (will be slugified)",
        },
        force: {
          type: "boolean" as const,
          description: "Skip principles prerequisite check",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "arckit-generate-doc-id",
    displayName: "arckit-generate-doc-id",
    description: "Generate a document ID and filename",
    parametersSchema: {
      type: "object" as const,
      properties: {
        projectId: {
          type: "string" as const,
          description: "Project number (e.g., 001)",
        },
        docType: {
          type: "string" as const,
          description: "Document type code (e.g., REQ, ADR, SOBC)",
        },
        version: {
          type: "string" as const,
          description: "Version number (default: 1.0)",
        },
        projectDir: {
          type: "string" as const,
          description: "Project directory for multi-instance types (ADR, DIAG, etc.) to auto-detect next sequence number",
        },
        filename: {
          type: "boolean" as const,
          description: "Append .md extension (default: true)",
        },
      },
      required: ["projectId", "docType"],
    },
  },
  {
    name: "arckit-check-prerequisites",
    displayName: "arckit-check-prerequisites",
    description: "Validate that ArcKit prerequisites exist",
    parametersSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "arckit-list-projects",
    displayName: "arckit-list-projects",
    description: "List all ArcKit projects with artifact counts",
    parametersSchema: {
      type: "object" as const,
      properties: {
        format: {
          type: "string" as const,
          description: "Output format: table or json",
          enum: ["table", "json"],
        },
      },
    },
  },
  {
    name: "arckit-check",
    displayName: "arckit-check",
    description: "Check that ArcKit plugin data files are present and readable",
    parametersSchema: {
      type: "object" as const,
      properties: {},
    },
  },
];

const manifest: PaperclipPluginManifestV1 = {
  id: "arckit",
  apiVersion: 1,
  version: pkg.version,
  displayName: "ArcKit",
  description:
    "Enterprise Architecture Governance & Vendor Procurement Toolkit — 68 commands for generating architecture artifacts",
  author: "tractorjuice",
  categories: ["workspace", "automation"],
  capabilities: ["agent.tools.register"],
  entrypoints: {
    worker: "./dist/worker.js",
  },
  tools: [...commandTools, ...utilityTools],
};

export default manifest;
