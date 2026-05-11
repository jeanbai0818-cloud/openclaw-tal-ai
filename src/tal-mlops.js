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
          ],
        },
      };
    },
  },
};
