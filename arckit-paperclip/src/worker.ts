import { definePlugin, runWorker } from "@paperclipai/plugin-sdk";
import { registerCommandTools } from "./tools/command-tools.js";
import { registerUtilityTools } from "./tools/utility-tools.js";

const plugin = definePlugin({
  async setup(ctx) {
    registerCommandTools(ctx);
    registerUtilityTools(ctx);
    ctx.logger.info("ArcKit plugin setup complete");
  },
  async onHealth() {
    return { status: "ok", message: "ArcKit plugin ready" };
  },
});

export default plugin;
runWorker(plugin, import.meta.url);
