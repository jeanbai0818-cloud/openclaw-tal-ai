# OpenClaw 供应商插件开发准则

> 文档来源：https://docs.openclaw.ai/llms.txt  
> 完整参考：https://docs.openclaw.ai

## 项目结构

```
openclaw-acme-provider/
├── package.json              # openclaw.providers 元数据、兼容性声明
├── openclaw.plugin.json      # 插件清单：providerAuthEnvVars、modelSupport
├── tsconfig.json             # TypeScript 配置
├── index.ts                  # definePluginEntry + registerProvider 主入口
└── src/
    ├── provider.test.ts      # Vitest 单元测试
    └── usage.ts              # 用量/计费辅助（可选）
```

---

## 1. 包清单（package.json）

`openclaw` 字段是必填的，用于插件发现和兼容性检查：

```json
{
  "openclaw": {
    "extensions": ["./index.ts"],
    "providers": ["acme-ai"],
    "compat": {
      "pluginApi": ">=2026.3.24-beta.2",
      "minGatewayVersion": "2026.3.24-beta.2"
    },
    "build": {
      "openclawVersion": "2026.3.24-beta.2",
      "pluginSdkVersion": "2026.3.24-beta.2"
    }
  }
}
```

- 发布到 ClawHub 时，`compat` 和 `build` 字段**必须**存在。
- `providers` 数组声明此插件注册的提供商 ID 列表。

---

## 2. 插件清单（openclaw.plugin.json）

```json
{
  "id": "acme-ai",
  "setup": {
    "providers": [
      { "id": "acme-ai", "envVars": ["ACME_AI_API_KEY"], "authMethods": ["api-key"] }
    ]
  },
  "providerAuthChoices": [
    {
      "provider": "acme-ai",
      "method": "api-key",
      "choiceId": "acme-ai-api-key",
      "choiceLabel": "Acme AI API key",
      "groupId": "acme-ai",
      "groupLabel": "Acme AI",
      "optionKey": "acmeAiApiKey",
      "cliFlag": "--acme-ai-api-key",
      "cliOption": "--acme-ai-api-key <key>",
      "cliDescription": "Acme AI API key"
    }
  ],
  "providerAuthAliases": {},
  "modelSupport": { "acme-ai": ["acme-large", "acme-small"] },
  "configSchema": {}
}
```

**关键字段说明（来自源码分析）：**

- `setup.providers[].authMethods`：**必须**声明 `["api-key"]`，否则提供商不会出现在 `openclaw config` 向导的选择列表中。
- `providerAuthChoices`：显式声明向导条目，支持自定义 `groupLabel`（分组显示名）和 CLI flag。
  - `cliFlag`: `"--acme-ai-api-key"` —— 向 `openclaw onboard` 注册 CLI 参数。
  - `cliOption`: `"--acme-ai-api-key <key>"` —— Commander.js 格式，**必须同时提供**才能在 `--help` 中显示并接受参数值。
  - `optionKey`: 存储到 `plugins.entries.<id>.config.<optionKey>` 的配置键。
- `providerAuthAliases`：某个提供商变体复用另一提供商 ID 凭证时使用。
- `modelSupport`：允许 OpenClaw 根据模型简写 ID 自动加载该插件。
- `configSchema`: `{}` 必须存在，否则安装失败。

**注意**：`openclaw config` 向导通过 `providerAuthChoices`（或 `setup.providers[].authMethods`）读取提供商列表，与 plugin JS 运行时无关——即插件 JS 加载前，向导就可以显示提供商选项。

**`catalog.run()` 的正确用法**：

- 返回 `{ providers: { "provider-a": {...}, "provider-b": {...} } }` 可以一次写入多个提供商配置到 `openclaw.json`。
- `openclaw onboard` / `openclaw config` 会调用 `catalog.run()` 并将结果自动合并到 `models.providers.*`，模型列表因此出现在 `openclaw models list`。
- `catalog.run()` **不**在 `models list` 命令时被调用；`models list` 只读 `openclaw.json` 的 `models.providers.*`。

---

## 3. 注册提供商

### 3.1 完整入口（支持多种能力）

```ts
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth";

export default definePluginEntry({
  id: "acme-ai",
  name: "Acme AI",
  description: "Acme AI model provider",
  register(api) {
    api.registerProvider({ /* ... */ });
  },
});
```

### 3.2 精简入口（单提供商 + API key + 单目录）

适用于只注册一个带 API key 凭证的文本提供商：

```ts
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";

export default defineSingleProviderPluginEntry({
  id: "acme-ai",
  name: "Acme AI",
  provider: {
    label: "Acme AI",
    auth: [{ /* auth method */ }],
    catalog: {
      buildProvider: () => ({ api: "openai-completions", baseUrl: "...", models: [] }),
      buildStaticProvider: () => ({ api: "openai-completions", baseUrl: "...", models: [] }),
    },
  },
});
```

- `buildProvider`：有凭证时执行，可发起网络请求。
- `buildStaticProvider`：离线展示用，**不得**使用凭证或发起请求。

---

## 4. 目录（Catalog）

### 4.1 目录顺序参考

| order    | 时机          | 用例                          |
|----------|---------------|-------------------------------|
| simple   | 第一轮        | 普通 API key 提供商            |
| profile  | simple 之后   | 受身份验证档案限制的提供商     |
| paired   | profile 之后  | 合成多个相关条目               |
| late     | 最后一轮      | 覆盖现有提供商（冲突时胜出）   |

### 4.2 模型字段说明

```ts
{
  id: "acme-large",        // 模型 ID（用于 API 调用）
  name: "Acme Large",      // 展示名称
  reasoning: true,         // 是否支持推理/思考模式
  input: ["text", "image"],// 支持的输入模态
  cost: {
    input: 3,              // 每百万 token 输入价格（美元）
    output: 15,            // 每百万 token 输出价格
    cacheRead: 0.3,        // 缓存读取价格
    cacheWrite: 3.75,      // 缓存写入价格
  },
  contextWindow: 200000,   // 上下文窗口大小（token）
  maxTokens: 32768,        // 最大输出 token 数
}
```

---

## 5. 动态模型解析

适用于代理或路由器类提供商（接受任意模型 ID）：

```ts
resolveDynamicModel: (ctx) => ({
  id: ctx.modelId,
  name: ctx.modelId,
  provider: "acme-ai",
  api: "openai-completions",
  baseUrl: "https://api.acme-ai.com/v1",
  reasoning: false,
  input: ["text"],
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
  contextWindow: 128000,
  maxTokens: 8192,
}),
```

- 若解析需要网络调用，使用 `prepareDynamicModel` 进行异步预热，完成后 `resolveDynamicModel` 会再次运行。

---

## 6. 运行时钩子

### 6.1 令牌交换（Token Exchange）

每次推理调用前需要令牌交换：

```ts
prepareRuntimeAuth: async (ctx) => {
  const exchanged = await exchangeToken(ctx.apiKey);
  return {
    apiKey: exchanged.token,
    baseUrl: exchanged.baseUrl,
    expiresAt: exchanged.expiresAt,
  };
},
```

### 6.2 文本变换（Token Rewrites）

上游使用不同控制令牌时，注册双向文本变换：

```ts
api.registerTextTransforms({
  input: [
    { from: /red basket/g, to: "blue basket" },
  ],
  output: [
    { from: /blue basket/g, to: "red basket" },
  ],
});
```

- `input`：在传输前重写系统提示词和文本消息内容。
- `output`：在 OpenClaw 解析控制标记之前重写助手文本增量。

### 6.3 共享系列构建器

优先使用共享辅助构建器，减少手动接线：

```ts
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderStreamFamilyHooks } from "openclaw/plugin-sdk/provider-stream";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";

const GOOGLE_FAMILY_HOOKS = {
  ...buildProviderReplayFamilyHooks({ family: "google-gemini" }),
  ...buildProviderStreamFamilyHooks("google-thinking"),
  ...buildProviderToolCompatFamilyHooks("gemini"),
};

api.registerProvider({ id: "acme-gemini-compatible", ...GOOGLE_FAMILY_HOOKS });
```

**重放系列参考：**

| 系列                    | 用途                                                    |
|-------------------------|---------------------------------------------------------|
| openai-compatible       | OpenAI 兼容传输：工具调用 ID 清理、assistant-first 修复 |
| anthropic-by-model      | 按 modelId 选择的 Claude 重放策略                       |
| google-gemini           | 原生 Gemini 重放 + 引导重放清理                         |
| passthrough-gemini      | 通过 OpenAI 兼容代理运行的 Gemini 模型                  |
| hybrid-anthropic-openai | 混合 Anthropic 消息 + OpenAI 兼容模型的提供商           |

**流系列参考：**

| 系列                     | 用途                                      |
|--------------------------|-------------------------------------------|
| google-thinking          | Gemini 思考载荷规范化                     |
| kilocode-thinking        | Kilo 推理包装器                           |
| moonshot-thinking        | Moonshot 二进制原生思考载荷               |
| minimax-fast-mode        | MiniMax 快速模式模型重写                  |
| openai-responses-defaults| 原生 OpenAI/Codex Responses 包装器        |
| openrouter-thinking      | OpenRouter 推理包装器                     |
| tool-stream-default-on   | 默认开启工具流式传输                      |

---

## 7. HTTP 错误处理

对提供商 HTTP 失败统一使用 SDK 辅助函数：

```ts
import {
  assertOkOrThrowProviderError,
  postJsonRequest,
} from "openclaw/plugin-sdk/provider-http";

const { response, release } = await postJsonRequest({
  url: "https://api.acme-ai.com/v1/endpoint",
  headers: new Headers({ "Content-Type": "application/json" }),
  body: { /* payload */ },
  timeoutMs: req.timeoutMs,
  fetchFn: fetch,
  auditContext: "acme endpoint",
});
try {
  await assertOkOrThrowProviderError(response, "Acme API error");
  // handle response
} finally {
  await release();
}
```

---

## 8. 额外能力（可选）

在同一个 `register(api)` 内与 `registerProvider` 并列注册：

| 能力           | 方法                        |
|----------------|-----------------------------|
| 语音合成（TTS）| `api.registerSpeechProvider` |
| 实时转写       | `api.registerTranscriptionProvider` |
| 实时语音       | `api.registerRealtimeSpeechProvider` |
| 媒体理解       | `api.registerMediaProvider` |
| 图像生成       | `api.registerImageProvider` |
| 视频生成       | `api.registerVideoProvider` |
| Web 抓取       | `api.registerWebFetchProvider` |
| Web 搜索       | `api.registerWebSearchProvider` |

> 同时注册多项能力的插件称为**混合能力插件**，这是公司插件（每个供应商一个插件）的推荐模式。

---

## 9. 测试规范

使用 Vitest 编写单元测试，**从 index.ts 导出** provider 配置对象以便测试：

```ts
// src/provider.test.ts
import { describe, it, expect } from "vitest";
import { acmeProvider } from "../index.js";

describe("acme-ai provider", () => {
  it("resolves dynamic models", () => {
    const model = acmeProvider.resolveDynamicModel!({ modelId: "acme-beta-v3" } as any);
    expect(model.id).toBe("acme-beta-v3");
    expect(model.provider).toBe("acme-ai");
  });

  it("returns catalog when key is available", async () => {
    const result = await acmeProvider.catalog!.run({
      resolveProviderApiKey: () => ({ apiKey: "test-key" }),
    } as any);
    expect(result?.provider?.models).toHaveLength(2);
  });

  it("returns null catalog when no key", async () => {
    const result = await acmeProvider.catalog!.run({
      resolveProviderApiKey: () => ({ apiKey: undefined }),
    } as any);
    expect(result).toBeNull();
  });
});
```

---

## 10. 发布到 ClawHub

```bash
# 预览发布（不实际提交）
clawhub package publish your-org/your-plugin --dry-run

# 正式发布
clawhub package publish your-org/your-plugin
```

> 使用 `clawhub package publish`，**不要**使用旧版仅限技能的发布别名。

---

## 11. 开发流程速查

```bash
# 安装依赖
npm install

# 类型检查
npm run typecheck

# 运行测试
npm test

# 构建
npm run build
```

---

## 12. 注意事项

1. **不要将守护进程协议细节放入核心**：若模型必须通过拥有线程、压缩或工具事件的原生智能体守护进程运行，将该提供商与 agent harness 搭配使用。
2. **`buildStaticProvider` 不得联网**：仅用于离线展示，不得请求凭证或发起网络请求。
3. **优先使用共享辅助函数**：`supportsNativeStreamingUsageCompat` 和 `applyProviderNativeStreamingUsageCompat` 可自动检测端点能力，无需硬编码提供商 ID 检查。
4. **错误处理统一用 `assertOkOrThrowProviderError`**：确保有上限的错误正文读取、JSON 错误解析和请求 ID 后缀。
5. **发布前必须填写 compat/build 字段**：ClawHub 发布校验依赖这些字段。
