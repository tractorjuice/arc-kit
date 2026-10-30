import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import type { PluginContext, ToolResult, ToolRunContext } from "@paperclipai/plugin-sdk";
import commands from "../data/commands.json" with { type: "json" };
import { CommandEntry } from "../types.js";

const typedCommands: CommandEntry[] = commands as CommandEntry[];

export function registerCommandTools(ctx: PluginContext): void {
  for (const cmd of typedCommands) {
    ctx.tools.register(
      cmd.name,
      {
        displayName: cmd.name,
        description: cmd.description,
        parametersSchema: {
          type: "object",
          properties: {
            topic: {
              type: "string",
              description: "Project name or topic",
              maxLength: 20000,
            },
          },
          required: ["topic"],
        },
      },
      async (params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
        const topic = params && typeof params === "object" && !Array.isArray(params)
          ? (params as { topic?: unknown }).topic : undefined;
        if (typeof topic !== "string" || topic.trim().length === 0 || topic.length > 20000) {
          return { error: "topic must be a non-empty string of at most 20,000 characters" };
        }
        const packageRoot = resolve(fileURLToPath(new URL("../../", import.meta.url)));
        const prompt = cmd.prompt.replaceAll("{arckit_package_root}", () => packageRoot)
          .replaceAll("{topic}", () => topic);
        const parts: string[] = [`## Instructions\n\n${prompt}`];
        if (cmd.template) {
          parts.push(`## Template\n\n${cmd.template}`);
        }
        if (cmd.handoffs && cmd.handoffs.length > 0) {
          const next = cmd.handoffs
            .map((h) => {
              let line = `- **${h.command}**: ${h.description}`;
              if (h.condition) {
                line += ` *(when ${h.condition})*`;
              }
              return line;
            })
            .join("\n");
          parts.push(`## Suggested Next Steps\n\n${next}`);
        }
        return {
          content: parts.join("\n\n---\n\n"),
          data: { command: cmd.name, topic },
        };
      },
    );
  }
}
