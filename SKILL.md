# TAL AI Provider Plugin

TAL internal AI service provider plugin for OpenClaw.

Provides access to three providers:
- **TAL Claw** (`claw`): Unified proxy, 16 models including Claude, GLM, GPT, Kimi, Gemini, Doubao, Qwen
- **TAL MLOps** (`tal-mlops`): OpenAI-compatible, MiniMax M2.7 and GLM-5.1
- **TAL MLOps Claude** (`mlops-claude`): Anthropic-native, Claude Opus/Sonnet 4.6

## Setup

Run `openclaw config` and select **TAL AI** to configure your credentials.

- **Claw**: 模型广场 tokenplan 密钥（格式：sk-xxxx）
- **MLOps / MLOps Claude**: 模型广场凭证（格式：APPID:APPKEY）
