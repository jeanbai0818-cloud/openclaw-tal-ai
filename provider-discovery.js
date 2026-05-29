const MLOPS_CLAUDE_MODELS = [
  { id: "claude-haiku-4.5",  name: "Claude Haiku 4.5",  reasoning: true,  input: ["text", "image"], contextWindow: 200000, maxTokens: 64000 },
  { id: "claude-sonnet-4.5", name: "Claude Sonnet 4.5", reasoning: true,  input: ["text", "image"], contextWindow: 200000, maxTokens: 64000 },
  { id: "claude-opus-4.5",   name: "Claude Opus 4.5",   reasoning: true,  input: ["text", "image"], contextWindow: 200000, maxTokens: 64000 },
  { id: "claude-sonnet-4.6", name: "Claude Sonnet 4.6", reasoning: false, input: ["text", "image"], contextWindow: 400000, maxTokens: 128000 },
  { id: "claude-opus-4.6",   name: "Claude Opus 4.6",   reasoning: true,  input: ["text", "image"], contextWindow: 400000, maxTokens: 128000 },
  { id: "glm-4.7",           name: "GLM-4.7",           reasoning: true,  input: ["text"],          contextWindow: 200000, maxTokens: 131072 },
  { id: "glm-5",             name: "GLM-5",             reasoning: true,  input: ["text"],          contextWindow: 200000, maxTokens: 128000 },
  { id: "glm-5-turbo",       name: "GLM-5-Turbo",       reasoning: true,  input: ["text"],          contextWindow: 200000, maxTokens: 131072 },
];

const TAL_MLOPS_MODELS = [
  { id: "MiniMax-M2.7",         name: "MiniMax M2.7",         reasoning: false, input: ["text", "image"], contextWindow: 200000,  maxTokens: 8192 },
  { id: "glm-5.1",              name: "GLM-5.1",              reasoning: true,  input: ["text", "image"], contextWindow: 200000,  maxTokens: 65536 },
  { id: "gpt-5.2-codex",        name: "gpt-5.2-codex",        reasoning: true,  input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "gpt-5.3-codex",        name: "gpt-5.3-codex",        reasoning: true,  input: ["text", "image"], contextWindow: 400000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "gpt-5.4",              name: "gpt-5.4",              reasoning: true,  input: ["text", "image"], contextWindow: 1050000, maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "kimi-k2.5",            name: "kimi-k2.5",            reasoning: true,  input: ["text", "image"], contextWindow: 256000,  maxTokens: 32768,  compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "gemini-3-flash",       name: "Gemini 3 Flash",       reasoning: true,  input: ["text", "image"], contextWindow: 400000,  maxTokens: 65536,  compat: { requiresToolResultName: true } },
  { id: "doubao-seed-2.0-lite", name: "doubao-seed-2.0-lite", reasoning: true,  input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "doubao-seed-2.0-pro",  name: "doubao-seed-2.0-pro",  reasoning: true,  input: ["text", "image"], contextWindow: 256000,  maxTokens: 128000, compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
  { id: "qwen3.5-plus",         name: "qwen3.5-plus",         reasoning: true,  input: ["text", "image"], contextWindow: 1000000, maxTokens: 65536,  compat: { supportsStore: false, supportsDeveloperRole: false, supportsReasoningEffort: true, supportsUsageInStreaming: true, maxTokensField: "max_tokens", requiresAssistantAfterToolResult: false } },
];

const CLAW_MODELS = [
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
];

const mlopsClaudeDiscovery = {
  id: "mlops-claude",
  label: "TAL MLOps Claude",
  docsPath: "/providers/mlops-claude",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("mlops-claude");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "https://ai-service.tal.com",
          api: "anthropic-messages",
          apiKey,
          models: MLOPS_CLAUDE_MODELS,
        },
      };
    },
  },
  staticCatalog: {
    order: "simple",
    run: async () => ({
      provider: {
        baseUrl: "https://ai-service.tal.com",
        api: "anthropic-messages",
        models: MLOPS_CLAUDE_MODELS,
      },
    }),
  },
};

const talMlopsDiscovery = {
  id: "tal-mlops",
  label: "TAL MLOps",
  docsPath: "/providers/tal-mlops",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("tal-mlops");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "https://ai-service.tal.com/openai-compatible/v1",
          api: "openai-completions",
          apiKey,
          models: TAL_MLOPS_MODELS,
        },
      };
    },
  },
  staticCatalog: {
    order: "simple",
    run: async () => ({
      provider: {
        baseUrl: "https://ai-service.tal.com/openai-compatible/v1",
        api: "openai-completions",
        models: TAL_MLOPS_MODELS,
      },
    }),
  },
};

const clawDiscovery = {
  id: "claw",
  label: "TAL Claw",
  docsPath: "/providers/claw",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("claw");
      if (!apiKey) return null;
      return {
        provider: {
          baseUrl: "https://ai-service.tal.com/claw",
          api: "openai-completions",
          headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
          apiKey,
          models: CLAW_MODELS,
        },
      };
    },
  },
  staticCatalog: {
    order: "simple",
    run: async () => ({
      provider: {
        baseUrl: "https://ai-service.tal.com/claw",
        api: "openai-completions",
        headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
        models: CLAW_MODELS,
      },
    }),
  },
};

export default [mlopsClaudeDiscovery, talMlopsDiscovery, clawDiscovery];
