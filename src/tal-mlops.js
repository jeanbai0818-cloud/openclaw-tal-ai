import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const talMlopsBaseAuth = createProviderApiKeyAuthMethod({
  providerId: "tal-mlops",
  methodId: "api-key",
  label: "TAL MLOps API key",
  hint: "模型广场凭证（格式：APPID:APPKEY）",
  optionKey: "talAiApiKey",
  flagName: "--tal-ai-api-key",
  envVar: "TAL_AI_API_KEY",
  promptMessage: "输入 TAL 模型广场凭证（格式：APPID:APPKEY）",
  defaultModel: "tal-mlops/glm-5.1",
});

export const talMlopsProvider = {
  id: "tal-mlops",
  label: "TAL MLOps",
  docsPath: "/providers/tal-mlops",
  envVars: ["TAL_AI_API_KEY"],

  auth: [
    {
      ...talMlopsBaseAuth,
      run: async (ctx) => {
        const existingKey = ctx.config?.plugins?.entries?.["tal-ai"]?.config?.talAiApiKey;
        if (existingKey) {
          const masked = existingKey.length > 8 ? existingKey.slice(0, 8) + "..." : existingKey;
          const keep = await ctx.prompter.confirm({
            message: `保留现有密钥 (${masked})？`,
            initialValue: true,
          });
          if (keep) {
            return talMlopsBaseAuth.run({
              ...ctx,
              prompter: { ...ctx.prompter, text: async () => existingKey },
            });
          }
        }
        return talMlopsBaseAuth.run(ctx);
      },
    },
  ],

  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("tal-mlops");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "http://ai-service.tal.com/openai-compatible/v1",
          apiKey,
          api: "openai-completions",
          models: [
            {
              id: "MiniMax-M2.7",
              name: "MiniMax M2.7",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 8192,
            },
            {
              id: "glm-5.1",
              name: "GLM-5.1",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 65536,
            },
            {
              id: "gpt-5.2-codex",
              name: "gpt-5.2-codex",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "gpt-5.3-codex",
              name: "gpt-5.3-codex",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "gpt-5.4",
              name: "gpt-5.4",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 1050000,
              maxTokens: 128000,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "kimi-k2.5",
              name: "kimi-k2.5",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 256000,
              maxTokens: 32768,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "gemini-3-flash",
              name: "Gemini 3 Flash",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 65536,
              compat: { requiresToolResultName: true },
            },
            {
              id: "doubao-seed-2.0-lite",
              name: "doubao-seed-2.0-lite",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 256000,
              maxTokens: 128000,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "doubao-seed-2.0-pro",
              name: "doubao-seed-2.0-pro",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 256000,
              maxTokens: 128000,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
            {
              id: "qwen3.5-plus",
              name: "qwen3.5-plus",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 1000000,
              maxTokens: 65536,
              compat: {
                supportsStore: false,
                supportsDeveloperRole: false,
                supportsReasoningEffort: true,
                supportsUsageInStreaming: true,
                maxTokensField: "max_tokens",
                requiresAssistantAfterToolResult: false,
              },
            },
          ],
        },
      };
    },
  },
};
