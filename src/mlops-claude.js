import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

const mlopsClaudeBaseAuth = createProviderApiKeyAuthMethod({
  providerId: "mlops-claude",
  methodId: "api-key",
  label: "TAL MLOps Claude API key",
  hint: "模型广场凭证（格式：APPID:APPKEY）",
  optionKey: "talAiApiKey",
  flagName: "--tal-ai-api-key",
  envVar: "TAL_AI_API_KEY",
  promptMessage: "输入 TAL 模型广场凭证（格式：APPID:APPKEY）",
  defaultModel: "mlops-claude/claude-sonnet-4.6",
});

export const mlopsClaudeProvider = {
  id: "mlops-claude",
  label: "TAL MLOps Claude",
  docsPath: "/providers/mlops-claude",
  envVars: ["TAL_AI_API_KEY"],

  auth: [
    {
      ...mlopsClaudeBaseAuth,
      run: async (ctx) => {
        const existingKey = ctx.config?.plugins?.entries?.["tal-ai"]?.config?.talAiApiKey;
        if (existingKey) {
          const masked = existingKey.length > 8 ? existingKey.slice(0, 8) + "..." : existingKey;
          const keep = await ctx.prompter.confirm({
            message: `保留现有密钥 (${masked})？`,
            initialValue: true,
          });
          if (keep) {
            return mlopsClaudeBaseAuth.run({
              ...ctx,
              prompter: { ...ctx.prompter, text: async () => existingKey },
            });
          }
        }
        return mlopsClaudeBaseAuth.run(ctx);
      },
    },
  ],

  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("mlops-claude");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "http://ai-service.tal.com",
          apiKey,
          api: "anthropic-messages",
          models: [
            {
              id: "claude-haiku-4.5",
              name: "Claude Haiku 4.5",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 64000,
            },
            {
              id: "claude-sonnet-4.5",
              name: "Claude Sonnet 4.5",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 64000,
            },
            {
              id: "claude-opus-4.5",
              name: "Claude Opus 4.5",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 200000,
              maxTokens: 64000,
            },
            {
              id: "claude-sonnet-4.6",
              name: "Claude Sonnet 4.6",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
            },
            {
              id: "claude-opus-4.6",
              name: "Claude Opus 4.6",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
            },
            {
              id: "glm-4.7",
              name: "GLM-4.7",
              reasoning: true,
              input: ["text"],
              contextWindow: 200000,
              maxTokens: 131072,
            },
            {
              id: "glm-5",
              name: "GLM-5",
              reasoning: true,
              input: ["text"],
              contextWindow: 200000,
              maxTokens: 128000,
            },
            {
              id: "glm-5-turbo",
              name: "GLM-5-Turbo",
              reasoning: true,
              input: ["text"],
              contextWindow: 200000,
              maxTokens: 131072,
            },
          ],
        },
      };
    },
  },
};
