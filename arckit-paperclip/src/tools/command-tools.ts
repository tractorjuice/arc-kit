import commands from "../data/commands.json" with { type: "json" };
import { CommandEntry } from "../types.js";

const typedCommands: CommandEntry[] = commands as CommandEntry[];

export function registerCommandTools(ctx: any): void {
  for (const cmd of typedCommands) {
    ctx.tools.register(
      cmd.name,
      {
        name: cmd.name,
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
      async (params: { topic: string }) => {
        const prompt = cmd.prompt.replaceAll("{topic}", params.topic);
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
          data: { command: cmd.name, topic: params.topic },
        };
      }
    );
  }
}
