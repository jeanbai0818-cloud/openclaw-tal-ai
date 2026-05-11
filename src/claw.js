import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const clawBaseAuth = createProviderApiKeyAuthMethod({
  providerId: "claw",
  methodId: "api-key",
  label: "TAL Claw API key",
  hint: "模型广场 tokenplan 密钥（格式：sk-xxxx）",
  optionKey: "clawApiKey",
  flagName: "--claw-api-key",
  envVar: "CLAW_API_KEY",
  promptMessage: "输入 TAL 模型广场 tokenplan 密钥（格式：sk-xxxx）",
  defaultModel: "claw/claude-sonnet-4.6",
});

export const clawProvider = {
  id: "claw",
  label: "TAL Claw",
  docsPath: "/providers/claw",
  envVars: ["CLAW_API_KEY"],

  auth: [
    {
      ...clawBaseAuth,
      run: async (ctx) => {
        const existingKey = ctx.config?.plugins?.entries?.["tal-ai"]?.config?.clawApiKey;
        if (existingKey) {
          const masked = existingKey.length > 8 ? existingKey.slice(0, 8) + "..." : existingKey;
          const keep = await ctx.prompter.confirm({
            message: `保留现有密钥 (${masked})？`,
            initialValue: true,
          });
          if (keep) {
            return clawBaseAuth.run({
              ...ctx,
              prompter: { ...ctx.prompter, text: async () => existingKey },
            });
          }
        }
        return clawBaseAuth.run(ctx);
      },
    },
  ],

  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("claw");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "http://ai-service.tal.com/claw/v1",
          apiKey,
          api: "openai-completions",
          headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
          models: [
            { id: "claude-haiku-4.5",  name: "Claude Haiku 4.5",  api: "anthropic-messages", reasoning: true, input: ["text", "image"], contextWindow: 200000, maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", api: "anthropic-messages", reasoning: true, input: ["text", "image"], contextWindow: 200000, maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "claude-opus-4.5",   name: "Claude Opus 4.5",   api: "anthropic-messages", reasoning: true, input: ["text", "image"], contextWindow: 200000, maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", api: "anthropic-messages", reasoning: true, input: ["text", "image"], contextWindow: 100000, maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "claude-opus-4.6",   name: "Claude Opus 4.6",   api: "anthropic-messages", reasoning: true, input: ["text", "image"], contextWindow: 200000, maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "glm-4.7",     name: "GLM-4.7",     api: "anthropic-messages", reasoning: true, input: ["text"], contextWindow: 200000, maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "glm-5",       name: "GLM-5",       api: "anthropic-messages", reasoning: true, input: ["text"], contextWindow: 200000, maxTokens: 128000, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "glm-5-turbo", name: "GLM-5-Turbo", api: "anthropic-messages", reasoning: true, input: ["text"], contextWindow: 200000, maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "gpt-5.3-codex",        name: "gpt-5.3-codex",        reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "gpt-5.2-codex",        name: "gpt-5.2-codex",        reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "kimi-k2.5",            name: "kimi-k2.5",            reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 32768,  compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "gemini-3-flash",       name: "Gemini 3 Flash",       reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 65536,  compat: { requiresToolResultName: true }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "doubao-seed-2.0-pro",  name: "doubao-seed-2.0-pro",  reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "qwen3.5-plus",         name: "qwen3.5-plus",         reasoning: true, input: ["text", "image"], contextWindow: 1000000, maxTokens: 65536,  compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "gpt-5.4",              name: "gpt-5.4",              reasoning: true, input: ["text", "image"], contextWindow: 1050000, maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
            { id: "doubao-seed-2.0-lite", name: "doubao-seed-2.0-lite", reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false }, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
          ],
        },
      };
    },
  },
};
