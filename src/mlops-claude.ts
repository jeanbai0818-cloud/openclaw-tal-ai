import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

// mlops-claude: TAL internal Anthropic-protocol endpoint
// baseUrl: http://ai-service.tal.com, api: anthropic-messages
// Shares TAL_AI_API_KEY with tal-mlops and claw (same key, different routing)
export const mlopsClaudeProvider = {
  id: "mlops-claude",
  label: "TAL MLOps Claude",
  docsPath: "/providers/mlops-claude",
  envVars: ["TAL_AI_API_KEY"],

  auth: [
    createProviderApiKeyAuthMethod({
      providerId: "mlops-claude",
      methodId: "api-key",
      label: "TAL AI API key",
      hint: "Internal TAL AI service key (format: uid:token)",
      optionKey: "talAiApiKey",
      flagName: "--tal-ai-api-key",
      envVar: "TAL_AI_API_KEY",
      promptMessage: "Enter your TAL AI API key",
      defaultModel: "mlops-claude/claude-sonnet-4.6",
    }),
  ],

  catalog: {
    order: "simple" as const,
    run: async (ctx: any) => {
      const { apiKey } = ctx.resolveProviderApiKey("mlops-claude");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "http://ai-service.tal.com",
          apiKey,
          api: "anthropic-messages",
          models: [
            {
              id: "claude-opus-4.6",
              name: "Claude Opus 4.6",
              reasoning: true,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
            },
            {
              id: "claude-sonnet-4.6",
              name: "Claude Sonnet 4.6",
              reasoning: false,
              input: ["text", "image"],
              contextWindow: 400000,
              maxTokens: 128000,
            },
          ],
        },
      };
    },
  },
};
