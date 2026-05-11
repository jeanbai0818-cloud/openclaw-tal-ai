import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { mlopsClaudeProvider } from "./src/mlops-claude.js";
import { talMlopsProvider } from "./src/tal-mlops.js";
import { clawProvider } from "./src/claw.js";

export { mlopsClaudeProvider, talMlopsProvider, clawProvider };

export default definePluginEntry({
  id: "tal-ai",
  name: "TAL AI",
  description: "TAL internal AI service: mlops-claude, tal-mlops, and claw proxy",

  register(api) {
    api.registerProvider(mlopsClaudeProvider);
    api.registerProvider(talMlopsProvider);
    api.registerProvider(clawProvider);
  },
});
