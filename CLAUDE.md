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

---

## 13. 踩坑记录（本项目实战）

> 以下问题均通过阅读 `/opt/homebrew/lib/node_modules/openclaw/dist/` 源码确认根因。

### 坑1：HTTP → HTTPS（端点 URL）

**现象**：请求报错，连接被拒绝。  
**原因**：所有 TAL AI 端点必须使用 HTTPS，不能使用 HTTP。  
**修复**：将 `baseUrl` 中的 `http://` 全部改为 `https://`。

---

### 坑2：`openclaw.plugin.json` 缺少顶级 `"providers"` 数组（**最关键**）

**现象**：`openclaw config` 向导能正常显示 TAL AI 的 auth 选项（因为 `providerAuthChoices` 是独立查找路径），但 `/model picker` 多选步骤完全不出现，或只显示 `amazon-bedrock/*` 模型。

**根因**（源码：`providers-ChCs1dXB.js`）：
```javascript
function resolveProviderSurfacePluginIdSet(params) {
  return new Set(registry.plugins.flatMap(
    (plugin) => plugin.providers.length > 0 ? [plugin.id] : []
  ));
}
```
`plugin.providers` 来自 manifest 顶级的 `"providers"` 字段。缺失时值为 `[]`，该插件被完全排除在 provider surface 之外，model picker、catalog hooks、owner resolution 全部失效。

`setup.providers[].id` **不等于**顶级 `providers`，两者是不同字段，都必须填写。

**修复**：在 `openclaw.plugin.json` 顶级加入：
```json
"providers": ["mlops-claude", "tal-mlops", "claw"]
```

---

### 坑3：`openclaw.plugin.json` 缺少 `"enabledByDefault"` 和 `"activation"`

**现象**：插件安装后行为不稳定，在某些环境下发现系统跳过该插件。  
**根因**：外部插件若不设 `"enabledByDefault": true`，`isActivatedManifestOwner` 返回 false，插件不满足发现资格。`"activation"` 是所有内置 provider 的标准字段。  
**修复**：
```json
"activation": { "onStartup": false },
"enabledByDefault": true
```

---

### 坑4：缺少 `providerDiscoveryEntry` 和 `provider-discovery.js`

**现象**：`/model picker` 卡在"正在加载可用模型"或显示 amazon-bedrock 模型。  
**根因**（源码：`provider-discovery.runtime-_FlNT3d8.js`）：  
无 `providerDiscoveryEntry` 时，插件没有 `providerDiscoverySource`，不进入快速发现路径。回退的 `resolvePluginProviders(bundledProviderAllowlistCompat:true)` 只加载内置插件，外部插件被 allowlist 拦截，返回空列表。

**修复**：
1. 在 `openclaw.plugin.json` 顶级添加 `"providerDiscoveryEntry": "./provider-discovery.js"`
2. 创建 `provider-discovery.js`，导出包含 `catalog` + `staticCatalog` 的 provider 对象数组

参考 moonshot 模式，但**必须同时有 `catalog.run` 和 `staticCatalog`**（见坑5）。

---

### 坑5：`provider-discovery.js` 只有 `staticCatalog` 不够，必须同时有 `catalog.run`

**现象**：加了 `providerDiscoveryEntry` 后模型选择器仍不显示。  
**根因**（源码：`provider-discovery.runtime-_FlNT3d8.js`）：
```javascript
function hasLiveProviderDiscoveryHook(provider) {
  return typeof provider.catalog?.run === "function"
      || typeof provider.discovery?.run === "function";
}
```
只有 `staticCatalog` 时 `hasLiveProviderDiscoveryHook` 返回 false，provider 不进入 `liveEntryProviders`。对外部插件而言，回退路径 `resolvePluginProviders(bundledProviderAllowlistCompat:true)` 同样被 allowlist 拦截，最终返回空。

**修复**：`provider-discovery.js` 中每个 provider 必须同时声明：
- `catalog.run(ctx)`：调用 `ctx.resolveProviderApiKey(id)`，有 key 返回配置，无 key 返回 null
- `staticCatalog.run()`：无参数，返回静态模型列表（用于未认证时展示）

```javascript
const myDiscovery = {
  id: "my-provider",
  label: "My Provider",
  auth: [],
  catalog: {
    order: "simple",
    run: async (ctx) => {
      const { apiKey } = ctx.resolveProviderApiKey("my-provider");
      if (!apiKey) return null;
      return { provider: { baseUrl: "...", api: "openai-completions", apiKey, models: MODELS } };
    },
  },
  staticCatalog: {
    order: "simple",
    run: async () => ({
      provider: { baseUrl: "...", api: "openai-completions", models: MODELS },
    }),
  },
};
export default [myDiscovery];  // 多个 provider 导出数组
```

注意：`catalog.run` / `staticCatalog.run` 返回 `{ provider: {...} }`（单数）而非 `{ providers: {...} }`（复数）。

---

### 坑6：多个 Provider 共享同一 API Key 时反复提示输入

**现象**：`mlops-claude` 配置完 key 后，配置 `tal-mlops` 时再次弹出输入框。  
**根因**：`createProviderApiKeyAuthMethod` 中 `expectedProviders` 默认是 `[providerId]`（只找自己的 profile）。两个 provider 各自的 profile 互相不知道，找不到对方已存的凭证就重新提示。  
**修复**：在两个 provider 的 auth method 里都设置：
```javascript
expectedProviders: ["mlops-claude", "tal-mlops"]
```
任意一个配置后，另一个会复用已存凭证，不再重复提示。

---

### 坑7：`clawhub package publish` 必须传绝对路径

**现象**：`clawhub package publish . --family code-plugin ...` 报错 `package.json required`。  
**修复**：传绝对路径：
```bash
clawhub package publish /absolute/path/to/plugin \
  --family code-plugin \
  --version 2026.5.x \
  --source-repo owner/repo \
  --source-commit $(git rev-parse HEAD)
```

---

### 坑8：`catalog.run()` 写入 `models.json`，但 provider headers 只从 `openclaw.json` 读取

**现象**：插件配置了 `headers: { "X-Agent-Channel": "..." }`，curl 手动测试完全正常，但 openclaw agent 发出的请求缺少该 header，服务端返回 403。

**根因**（源码：`model-CybbPGvR.js` + `models-config-CAklyV4-.js`）：

`catalog.run()` 的结果（含 provider-level `headers`）写入的是 `~/.openclaw/agents/main/agent/models.json`（运行时缓存）。

但请求时，`providerConfig`（包含 `headers`）是通过 `resolveConfiguredProviderConfig(cfg, provider)` 从 **`openclaw.json` 的 `models.providers.<id>`** 读取的：

```js
const providerHeaders = sanitizeModelHeaders(providerConfig.headers, { stripSecretRefMarkers: true });
```

如果 `openclaw.json` 里没有该 provider 的条目，`providerConfig` 为 undefined，`providerHeaders` 为 undefined，headers 完全丢失。

`models.json` 里 provider-level 的 `headers` 字段在 `normalizePersistedModelCatalogEntry` 中被忽略，永远不会传递到 transport 层。

**修复**：在 provider 上注册 `prepareRuntimeAuth` hook，通过 `request.headers` 在每次请求前注入 header：

```js
prepareRuntimeAuth: async (ctx) => ({
  apiKey: ctx.apiKey,
  request: {
    headers: { "X-Agent-Channel": "jcfwzt-sre-openclaw" },
  },
}),
```

`prepareRuntimeAuth` 的 `request` 字段由 `applyPreparedRuntimeRequestOverrides` 处理（源码：`pi-embedded-CJ87lW5R.js`），最终通过 `resolveProviderRequestConfig` 合并进 transport headers。此路径不依赖 `openclaw.json`，每次请求均有效。

**教训**：需要随每次请求发送的 custom header，必须用 `prepareRuntimeAuth`，不能只依赖 `catalog.run()` 的 `headers` 字段。

---

### 坑9：`openclaw plugins uninstall` 必须用 manifest id，不能用 clawhub 包名

**现象**：`openclaw plugins uninstall clawhub:@jeanbai0818-cloud/openclaw-tal-ai` 报错 `Plugin not found`。

**根因**：安装时日志提示 `Plugin manifest id "tal-ai" differs from npm package name`，config key 用的是 manifest id `tal-ai`，不是 npm 包名。

**修复**：用 manifest id 卸载：
```bash
openclaw plugins uninstall tal-ai --force
```

---

### 完整 `openclaw.plugin.json` 顶级必填字段速查

外部 provider 插件的 manifest 必须包含以下顶级字段，缺一不可：

| 字段 | 作用 |
|------|------|
| `"providers": [...]` | 注册 provider surface，进入发现系统的门槛 |
| `"enabledByDefault": true` | 安装后自动激活，无需手动 enable |
| `"activation": {"onStartup": false}` | 标准 provider 激活模式 |
| `"providerDiscoveryEntry": "./provider-discovery.js"` | 快速发现路径入口，model picker 依赖此项 |
| `"providerAuthChoices": [...]` | config 向导的 auth 选项列表 |
| `"setup": {"providers": [...]}` | envVars 和 authMethods 声明（与顶级 providers 不同） |
| `"configSchema": {}` | 必须存在，否则安装失败 |
