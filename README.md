# TAL AI — OpenClaw 提供商插件

接入好未来（TAL）模型广场的 OpenClaw 插件，提供三个提供商通道，覆盖 Anthropic Claude、国产大模型及统一代理。

## 安装

```bash
openclaw plugins install clawhub:@jeanbai0818-cloud/openclaw-tal-ai
```

安装后重启网关：

```bash
openclaw gateway restart
```

## 提供商与模型

### mlops-claude — TAL MLOps（Anthropic 专属通道）

直连模型广场 Anthropic 接口，原生 Claude API。

| 模型 | 说明 |
|------|------|
| claude-opus-4.6 | Claude Opus 4.6，支持推理模式 |
| claude-sonnet-4.6 | Claude Sonnet 4.6 |

凭证：模型广场 **APPID:APPKEY** 格式

---

### tal-mlops — TAL MLOps（OpenAI 兼容通道）

OpenAI 兼容接口，接入国产模型。

| 模型 | 说明 |
|------|------|
| MiniMax-M2.7 | MiniMax M2.7 |
| glm-5.1 | GLM-5.1，支持推理模式 |

凭证：模型广场 **APPID:APPKEY** 格式（与 mlops-claude 共用同一个 key）

---

### claw — TAL Claw（统一代理）

好未来 Claw 统一代理，零计费，覆盖主流模型。

| 模型 | 说明 |
|------|------|
| claude-haiku-4.5 | Claude Haiku 4.5 |
| claude-sonnet-4.5 | Claude Sonnet 4.5 |
| claude-opus-4.5 | Claude Opus 4.5 |
| claude-sonnet-4.6 | Claude Sonnet 4.6 |
| claude-opus-4.6 | Claude Opus 4.6 |
| glm-4.7 | GLM-4.7 |
| glm-5 | GLM-5 |
| glm-5-turbo | GLM-5-Turbo |
| gpt-5.2-codex | GPT-5.2 Codex |
| gpt-5.3-codex | GPT-5.3 Codex |
| gpt-5.4 | GPT-5.4 |
| kimi-k2.5 | Kimi K2.5 |
| gemini-3-flash | Gemini 3 Flash |
| doubao-seed-2.0-pro | 豆包 Seed 2.0 Pro |
| doubao-seed-2.0-lite | 豆包 Seed 2.0 Lite |
| qwen3.5-plus | Qwen 3.5 Plus |

凭证：模型广场 tokenplan **sk-xxxx** 格式

---

## 配置

安装后运行向导完成凭证配置：

```bash
openclaw config
```

选择 **TAL AI** 分组，按提示填入对应凭证：

- **TAL MLOps Claude / TAL MLOps**：模型广场 APPID:APPKEY
- **TAL Claw**：模型广场 tokenplan sk-xxxx

也可通过 CLI 一键配置：

```bash
openclaw onboard --tal-ai-api-key APPID:APPKEY --claw-api-key sk-xxxx
```

## 要求

- OpenClaw ≥ 2026.3.24-beta.2
- 好未来内网或 VPN 访问权限
