import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import { registerCommandTools } from "./tools/command-tools";
import { registerUtilityTools } from "./tools/utility-tools";

const plugin = definePlugin({
  async setup(ctx) {
    registerCommandTools(ctx);
    registerUtilityTools(ctx);
  },
  async onHealth() {
    return { status: "ok" };
  },
});

runWorker(plugin);
