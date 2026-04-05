import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import { registerCommandTools } from "./tools/command-tools.js";
import { registerUtilityTools } from "./tools/utility-tools.js";

const plugin = definePlugin({
  async setup(ctx) {
    registerCommandTools(ctx);
    registerUtilityTools(ctx);
  },
  async onHealth() {
    return { status: "ok" };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
