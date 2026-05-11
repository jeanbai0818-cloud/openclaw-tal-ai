import { describe, it, expect } from "vitest";
import { mlopsClaudeProvider } from "../index.js";
import { talMlopsProvider } from "../index.js";
import { clawProvider } from "../index.js";

const withKey = { resolveProviderApiKey: () => ({ apiKey: "300004631:test" }) } as any;
const withoutKey = { resolveProviderApiKey: () => ({ apiKey: undefined }) } as any;

describe("mlops-claude", () => {
  it("returns anthropic-messages provider when key is present", async () => {
    const result = await mlopsClaudeProvider.catalog.run(withKey);
    expect(result?.provider?.api).toBe("anthropic-messages");
    expect(result?.provider?.baseUrl).toBe("http://ai-service.tal.com");
  });

  it("includes expected Claude models", async () => {
    const result = await mlopsClaudeProvider.catalog.run(withKey);
    const ids = result?.provider?.models?.map((m: any) => m.id);
    expect(ids).toContain("claude-opus-4.6");
    expect(ids).toContain("claude-sonnet-4.6");
  });

  it("returns null when no key", async () => {
    expect(await mlopsClaudeProvider.catalog.run(withoutKey)).toBeNull();
  });
});

describe("tal-mlops", () => {
  it("returns openai-completions provider when key is present", async () => {
    const result = await talMlopsProvider.catalog.run(withKey);
    expect(result?.provider?.api).toBe("openai-completions");
    expect(result?.provider?.baseUrl).toBe("http://ai-service.tal.com/openai-compatible/v1");
  });

  it("includes MiniMax and GLM models", async () => {
    const result = await talMlopsProvider.catalog.run(withKey);
    const ids = result?.provider?.models?.map((m: any) => m.id);
    expect(ids).toContain("MiniMax-M2.7");
    expect(ids).toContain("glm-5.1");
  });

  it("returns null when no key", async () => {
    expect(await talMlopsProvider.catalog.run(withoutKey)).toBeNull();
  });
});

describe("claw", () => {
  it("uses openai-completions as provider-level api", async () => {
    const result = await clawProvider.catalog.run(withKey);
    expect(result?.provider?.api).toBe("openai-completions");
    expect(result?.provider?.baseUrl).toBe("http://ai-service.tal.com/claw/v1");
  });

  it("includes X-Agent-Channel custom header", async () => {
    const result = await clawProvider.catalog.run(withKey);
    expect(result?.provider?.headers?.["X-Agent-Channel"]).toBe("jcfwzt-sre-openclaw");
  });

  it("claude models have per-model api override to anthropic-messages", async () => {
    const result = await clawProvider.catalog.run(withKey);
    const models = result?.provider?.models ?? [];
    const claudeModels = models.filter((m: any) =>
      m.id.startsWith("claude-") || m.id.startsWith("glm-")
    );
    for (const m of claudeModels) {
      expect(m.api).toBe("anthropic-messages");
    }
  });

  it("openai-compat models have no api override (inherit provider default)", async () => {
    const result = await clawProvider.catalog.run(withKey);
    const models = result?.provider?.models ?? [];
    const oaiModels = models.filter((m: any) =>
      ["gpt-5.3-codex", "gpt-5.2-codex", "kimi-k2.5", "gemini-3-flash",
       "doubao-seed-2.0-pro", "doubao-seed-2.0-lite", "qwen3.5-plus", "gpt-5.4"]
        .includes(m.id)
    );
    for (const m of oaiModels) {
      expect(m.api).toBeUndefined();
    }
  });

  it("gemini-3-flash has requiresToolResultName compat flag", async () => {
    const result = await clawProvider.catalog.run(withKey);
    const gemini = result?.provider?.models?.find((m: any) => m.id === "gemini-3-flash");
    expect(gemini?.compat?.requiresToolResultName).toBe(true);
  });

  it("has 16 total models", async () => {
    const result = await clawProvider.catalog.run(withKey);
    expect(result?.provider?.models).toHaveLength(16);
  });

  it("returns null when no key", async () => {
    expect(await clawProvider.catalog.run(withoutKey)).toBeNull();
  });
});
