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
    // Anthropic-protocol endpoint (claude-opus-4.6, claude-sonnet-4.6)
    api.registerProvider(mlopsClaudeProvider);

    // OpenAI-compatible endpoint (MiniMax-M2.7, glm-5.1)
    api.registerProvider(talMlopsProvider);

    // Unified proxy endpoint — mixed per-model api + custom X-Agent-Channel header
    api.registerProvider(clawProvider);
  },
});
