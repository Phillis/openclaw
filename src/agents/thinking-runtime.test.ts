import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  clearAgentHarnesses,
  listRegisteredAgentHarnesses,
  registerAgentHarness,
} from "./harness/registry.js";
import { restoreRegisteredAgentHarnesses } from "./harness/registry.test-support.js";
import type { AgentHarness } from "./harness/types.js";
import {
  hasResolvedThinkingCatalogEntry,
  isMinimaxM3Model,
  resolveCandidateThinkingLevel,
  resolveEffectiveAgentRuntime,
} from "./thinking-runtime.js";

describe("isMinimaxM3Model", () => {
  it("recognizes native and alias M3 model ids by normalized basename", () => {
    for (const modelId of [
      "MiniMax-M3",
      "minimax-m3",
      "minimax/minimax-m3",
      "MiniMax-M3.5",
      "minimax-m3:cloud",
      "minimax/MiniMax-M3",
    ]) {
      expect(isMinimaxM3Model(modelId)).toBe(true);
    }
  });

  it.each(["MiniMax-M2.7", "minimax-m2", "minimax-m35", "MiniMax-M3x", "music-2.6"])(
    "rejects non-M3 name %s",
    (modelId) => {
      expect(isMinimaxM3Model(modelId)).toBe(false);
    },
  );

  it("rejects missing model ids", () => {
    expect(isMinimaxM3Model(undefined)).toBe(false);
    expect(isMinimaxM3Model(null)).toBe(false);
    expect(isMinimaxM3Model("")).toBe(false);
  });
});

describe("resolveCandidateThinkingLevel MiniMax M3", () => {
  it("forces native minimax M3 candidates to adaptive", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "minimax",
        modelId: "MiniMax-M3",
        level: "high",
      }),
    ).toBe("adaptive");
  });

  it("recognizes minimax-portal and minimax-cn M3 aliases", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "minimax-portal",
        modelId: "MiniMax-M3",
        level: "max",
      }),
    ).toBe("adaptive");
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "minimax-cn",
        modelId: "minimax-m3",
        level: "high",
      }),
    ).toBe("adaptive");
  });

  it("recognizes openrouter vendor-prefixed M3 ids", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "openrouter",
        modelId: "minimax/minimax-m3",
        level: "high",
      }),
    ).toBe("adaptive");
  });

  it("recognizes the ollama M3 cloud alias", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "ollama",
        modelId: "minimax-m3:cloud",
        level: "max",
      }),
    ).toBe("adaptive");
  });

  it("normalizes every inherited level including unset to adaptive", () => {
    for (const level of [
      undefined,
      "off",
      "minimal",
      "low",
      "medium",
      "high",
      "xhigh",
      "max",
      "ultra",
    ]) {
      expect(
        resolveCandidateThinkingLevel({
          cfg: {},
          provider: "minimax",
          modelId: "MiniMax-M3",
          level,
        }),
      ).toBe("adaptive");
    }
  });

  it("leaves false-positive non-M3 names unchanged", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "openrouter",
        modelId: "minimax/MiniMax-M2.7",
        level: "high",
      }),
    ).toBe("high");
  });

  it("keeps an ordinary compatible fallback unchanged", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "demo",
        modelId: "demo-model",
        level: "medium",
      }),
    ).toBe("medium");
  });
});

describe("hasResolvedThinkingCatalogEntry", () => {
  it("requires authoritative reasoning metadata for the selected model", () => {
    const catalog = [
      { provider: "ollama", id: "unknown", reasoning: true },
      { provider: "OLLAMA", id: "minimax-m3:cloud" },
    ];

    expect(
      hasResolvedThinkingCatalogEntry({
        catalog,
        provider: "ollama",
        model: "minimax-m3:cloud",
      }),
    ).toBe(false);
    expect(
      hasResolvedThinkingCatalogEntry({
        catalog: [{ provider: "OLLAMA", id: "minimax-m3:cloud", reasoning: false }],
        provider: "ollama",
        model: "minimax-m3:cloud",
      }),
    ).toBe(true);
  });
});

function openAIConfig(runtime: string): OpenClawConfig {
  return {
    agents: {
      defaults: {
        models: {
          "openai/gpt-5.6-luna": { agentRuntime: { id: runtime } },
        },
      },
    },
  };
}

describe("resolveEffectiveAgentRuntime", () => {
  let registeredHarnesses: ReturnType<typeof listRegisteredAgentHarnesses>;

  beforeAll(() => {
    registeredHarnesses = listRegisteredAgentHarnesses();
  });

  beforeEach(() => {
    clearAgentHarnesses();
  });

  afterAll(() => {
    restoreRegisteredAgentHarnesses(registeredHarnesses);
  });

  it("keeps cold-start official OpenAI Luna on implicit Codex policy", () => {
    expect(
      resolveEffectiveAgentRuntime({
        cfg: {},
        provider: "openai",
        modelId: "gpt-5.6-luna",
      }),
    ).toBe("codex");
  });

  it("resolves residual auto to OpenClaw when no plugin harness is registered", () => {
    expect(
      resolveEffectiveAgentRuntime({
        cfg: {
          models: {
            providers: {
              openai: {
                baseUrl: "http://127.0.0.1:8080/v1",
                models: [],
              },
            },
          },
        },
        provider: "openai",
        modelId: "gpt-5.6-luna",
      }),
    ).toBe("openclaw");
  });

  it("uses static auto-selection facts before resolving provider routes", () => {
    const supports = vi.fn<AgentHarness["supports"]>(() => ({ supported: true, priority: 100 }));
    registerAgentHarness({
      id: "codex",
      label: "Codex",
      autoSelection: { providerIds: ["openai", "codex"] },
      supports,
      runAttempt: async () => {
        throw new Error("not exercised");
      },
    });

    expect(
      resolveEffectiveAgentRuntime({
        cfg: {},
        provider: "deepseek",
        modelId: "deepseek-v4-pro",
      }),
    ).toBe("openclaw");
    expect(supports).not.toHaveBeenCalled();
  });

  it("keeps an authored custom route on OpenClaw before registered harness selection", () => {
    const supports = vi.fn<AgentHarness["supports"]>(({ provider }) =>
      provider === "openai" ? { supported: true, priority: 100 } : { supported: false },
    );
    const codexHarness: AgentHarness = {
      id: "codex",
      label: "Codex",
      supports,
      runAttempt: async () => {
        throw new Error("not exercised");
      },
    };
    registerAgentHarness(codexHarness);

    expect(
      resolveEffectiveAgentRuntime({
        cfg: {
          models: {
            providers: {
              openai: {
                baseUrl: "http://127.0.0.1:8080/v1",
                models: [],
              },
            },
          },
        },
        provider: "openai",
        modelId: "gpt-5.6-luna",
      }),
    ).toBe("openclaw");
    expect(supports).not.toHaveBeenCalled();
  });

  it("prefers explicit session overrides", () => {
    const cfg = openAIConfig("openclaw");
    expect(
      resolveEffectiveAgentRuntime({
        cfg,
        provider: "openai",
        modelId: "gpt-5.6-luna",
        sessionEntry: { agentRuntimeOverride: "codex", agentHarnessId: "openclaw" },
      }),
    ).toBe("codex");
  });

  it("ignores legacy harness ids when choosing a runtime", () => {
    const cfg = openAIConfig("openclaw");
    expect(
      resolveEffectiveAgentRuntime({
        cfg,
        provider: "openai",
        modelId: "gpt-5.6-luna",
        sessionEntry: { agentHarnessId: "codex" },
      }),
    ).toBe("openclaw");
  });

  it("uses configured runtime policy without session hints", () => {
    const cfg = openAIConfig("openclaw");
    expect(
      resolveEffectiveAgentRuntime({
        cfg,
        provider: "openai",
        modelId: "gpt-5.6-luna",
      }),
    ).toBe("openclaw");
  });

  it("lets an explicit OpenClaw override replace configured Codex policy", () => {
    expect(
      resolveEffectiveAgentRuntime({
        cfg: openAIConfig("codex"),
        provider: "openai",
        modelId: "gpt-5.6-luna",
        sessionEntry: { agentRuntimeOverride: "openclaw", agentHarnessId: "codex" },
      }),
    ).toBe("openclaw");
  });

  it("keeps a supported candidate level unchanged", () => {
    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "demo",
        modelId: "demo-model",
        level: "medium",
      }),
    ).toBe("medium");
  });

  it("clamps an unsupported candidate level without changing the requested value", () => {
    const requested = "ultra" as const;

    expect(
      resolveCandidateThinkingLevel({
        cfg: {},
        provider: "demo",
        modelId: "demo-model",
        level: requested,
      }),
    ).toBe("high");
    expect(requested).toBe("ultra");
  });

  it("re-evaluates every candidate from the immutable request so later support can upgrade", () => {
    const cfg: OpenClawConfig = {
      agents: {
        defaults: {
          models: {
            "openai/gpt-5.6-luna": { agentRuntime: { id: "codex" } },
            "openai/gpt-5.6-sol": { agentRuntime: { id: "codex" } },
          },
        },
      },
    };
    const requested = "ultra" as const;

    expect(
      resolveCandidateThinkingLevel({
        cfg,
        provider: "openai",
        modelId: "gpt-5.6-luna",
        level: requested,
      }),
    ).toBe("max");
    expect(
      resolveCandidateThinkingLevel({
        cfg,
        provider: "openai",
        modelId: "gpt-5.6-sol",
        level: requested,
      }),
    ).toBe("ultra");
  });
});
