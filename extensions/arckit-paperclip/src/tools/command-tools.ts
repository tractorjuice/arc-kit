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
            },
          },
          required: ["topic"],
        },
      },
      async (params: unknown, _runCtx: ToolRunContext): Promise<ToolResult> => {
        const { topic } = params as { topic?: string };
        if (!topic || topic.trim().length === 0) {
          return { error: "topic is required" };
        }
        const prompt = cmd.prompt.replaceAll("{topic}", topic);
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
