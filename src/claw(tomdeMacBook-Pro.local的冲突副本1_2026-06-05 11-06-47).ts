import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

// claw: TAL unified proxy — two protocols on same base
// Anthropic: https://ai-service.tal.com/claw/v1  (openclaw appends /messages)
// OpenAI:    https://ai-service.tal.com/claw      (openclaw appends /chat/completions)
// X-Agent-Channel injected via prepareRuntimeAuth (not catalog headers — see pitfall 坑8)

const OAI_COMPAT = {
  supportsStore: false,
  supportsDeveloperRole: false,
  supportsReasoningEffort: true,
  supportsUsageInStreaming: true,
  maxTokensField: "max_tokens",
  requiresAssistantAfterToolResult: false,
} as const;

const CLAW_BASE_ANTHROPIC = "https://ai-service.tal.com/claw/v1";
const CLAW_BASE_OPENAI    = "https://ai-service.tal.com/claw";

const CLAW_MODELS = [
  // ── Anthropic-protocol models ──────────────────────────────────────────────
  { id: "claude-haiku-4.5",  name: "Claude Haiku 4.5",  api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-sonnet-4.7", name: "Claude Sonnet 4.7", api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-sonnet-4.8", name: "Claude Sonnet 4.8", api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-opus-4.5",   name: "Claude Opus 4.5",   api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 64000,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-opus-4.6",   name: "Claude Opus 4.6",   api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-opus-4.7",   name: "Claude Opus 4.7",   api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "claude-opus-4.8",   name: "Claude Opus 4.8",   api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "glm-4.7",           name: "GLM-4.7",           api: "anthropic-messages" as const, reasoning: true,  input: ["text"],          contextWindow: 200000,  maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "glm-5",             name: "GLM-5",             api: "anthropic-messages" as const, reasoning: true,  input: ["text"],          contextWindow: 200000,  maxTokens: 128000, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "glm-5.1",           name: "GLM-5.1",           api: "anthropic-messages" as const, reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 65536,  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "glm-5-turbo",       name: "GLM-5-Turbo",       api: "anthropic-messages" as const, reasoning: true,  input: ["text"],          contextWindow: 200000,  maxTokens: 131072, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },

  // ── OpenAI-compatible models (per-model baseUrl override) ──────────────────
  { id: "kimi-k2.5",              name: "kimi-k2.5",              api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 32768,  compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "kimi-k2.6",              name: "kimi-k2.6",              api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 32768,  compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "doubao-seed-2.0-lite",   name: "doubao-seed-2.0-lite",   api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "doubao-seed-2.0-pro",    name: "doubao-seed-2.0-pro",    api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "doubao-seedream-5-0-lite",name:"doubao-seedream-5-0-lite",api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "qwen3.5-plus",           name: "qwen3.5-plus",           api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 1000000, maxTokens: 65536,  compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "MiniMax-M2.7",           name: "MiniMax M2.7",           api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: false,input: ["text", "image"], contextWindow: 200000,  maxTokens: 8192,   compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "gpt-5.2",                name: "gpt-5.2",                api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "gpt-5.3",                name: "gpt-5.3",                api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "gpt-5.4",                name: "gpt-5.4",                api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 1050000, maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "gpt-5.5",                name: "gpt-5.5",                api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 1050000, maxTokens: 128000, compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
  { id: "gemini-3-flash",         name: "Gemini 3 Flash",         api: "openai-completions" as const, baseUrl: CLAW_BASE_OPENAI, reasoning: true, input: ["text", "image"], contextWindow: 400000,  maxTokens: 65536,  compat: OAI_COMPAT, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 } },
];

export const clawProvider = {
  id: "claw",
  label: "TAL Claw",
  docsPath: "/providers/claw",
  envVars: ["CLAW_API_KEY"],

  auth: [
    createProviderApiKeyAuthMethod({
      providerId: "claw",
      methodId: "api-key",
      label: "TAL Claw API key",
      hint: "模型广场 tokenplan 密钥（格式：sk-xxxx）",
      optionKey: "clawApiKey",
      flagName: "--claw-api-key",
      envVar: "CLAW_API_KEY",
      promptMessage: "输入 TAL 模型广场 tokenplan 密钥（格式：sk-xxxx）",
      defaultModel: "claw/claude-sonnet-4.6",
      wizard: {
        choiceId: "claw-api-key",
        choiceLabel: "TAL Claw (模型广场tokenplan，例如：sk-xxxx)",
        groupId: "tal-ai",
        groupLabel: "TAL AI",
      },
    }),
  ],

  // X-Agent-Channel must be injected via prepareRuntimeAuth — catalog-level headers
  // are not propagated to the transport layer (see CLAUDE.md 坑8).
  prepareRuntimeAuth: async (ctx: any) => ({
    apiKey: ctx.apiKey,
    request: {
      headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
    },
  }),

  staticCatalog: {
    order: "simple" as const,
    run: async (_ctx: any) => ({
      providers: {
        "claw": {
          baseUrl: CLAW_BASE_ANTHROPIC,
          api: "anthropic-messages" as const,
          headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
          models: CLAW_MODELS,
        },
      },
    } as any),
  },

  catalog: {
    order: "simple" as const,
    run: async (ctx: any) => {
      const { apiKey } = ctx.resolveProviderApiKey("claw");
      if (!apiKey) return null;
      return {
        providers: {
          "claw": {
            baseUrl: CLAW_BASE_ANTHROPIC,
            apiKey,
            api: "anthropic-messages" as const,
            headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
            models: CLAW_MODELS,
          },
        },
      } as any;
    },
  },
};
