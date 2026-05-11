import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

// tal-mlops: TAL internal OpenAI-compatible endpoint
// baseUrl: http://ai-service.tal.com/openai-compatible/v1, api: openai-completions
// Shares TAL_AI_API_KEY with mlops-claude (same key, different path and protocol)
export const talMlopsProvider = {
  id: "tal-mlops",
  label: "TAL MLOps",
  docsPath: "/providers/tal-mlops",
  envVars: ["TAL_AI_API_KEY"],

  auth: [
    createProviderApiKeyAuthMethod({
      providerId: "tal-mlops",
      methodId: "api-key",
      label: "TAL AI API key",
      hint: "Internal TAL AI service key (format: uid:token)",
      optionKey: "talAiApiKey",
      flagName: "--tal-ai-api-key",
      envVar: "TAL_AI_API_KEY",
      promptMessage: "Enter your TAL AI API key",
      defaultModel: "tal-mlops/glm-5.1",
    }),
  ],

  catalog: {
    order: "simple" as const,
    run: async (ctx: any) => {
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
