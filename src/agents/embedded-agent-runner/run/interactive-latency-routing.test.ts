import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { OpenClawConfig } from "../../../config/types.openclaw.js";
import {
  isInteractiveLatencyRouteHealthy,
  isInteractiveLatencyRoutingSessionKey,
  recordInteractiveLatencyRouteObservation,
  resetInteractiveLatencyRouteHealthForTests,
  resolveInteractiveLatencyRoute,
  resolveInteractiveLatencyRoutingSettings,
} from "./interactive-latency-routing.js";

const PREFERRED = [
  { provider: "ollama-cloud", model: "glm-5.3-flash" },
  { provider: "opencode-go", model: "glm-5.3-flash" },
];

function routingConfig(overrides?: {
  enabled?: boolean;
  kinds?: string[];
  prefer?: typeof PREFERRED;
  fallbackToConfigured?: boolean;
  maxFallbackLatencyMs?: number;
}): OpenClawConfig {
  return {
    models: {
      interactiveLatencyRouting: {
        enabled: overrides?.enabled ?? true,
        sessionMatch: { kinds: overrides?.kinds ?? ["slack"] },
        prefer: overrides?.prefer ?? PREFERRED,
        fallbackToConfigured: overrides?.fallbackToConfigured,
        maxFallbackLatencyMs: overrides?.maxFallbackLatencyMs,
      },
    },
  };
}

const BASE_DECISION = {
  sessionKey: "agent:oscar:slack:direct:acct1:U123",
  trigger: "user",
  incomingProvider: "zai",
  incomingModelId: "glm-5.3-flash",
  configuredProvider: "zai",
  configuredModelId: "glm-5.3-flash",
};

function decide(
  overrides: Partial<Parameters<typeof resolveInteractiveLatencyRoute>[0]> = {},
): ReturnType<typeof resolveInteractiveLatencyRoute> {
  return resolveInteractiveLatencyRoute({
    ...BASE_DECISION,
    settings: resolveInteractiveLatencyRoutingSettings(routingConfig()),
    ...overrides,
  });
}

describe("interactive latency routing settings", () => {
  it("is undefined when the config block is absent (today's behavior)", () => {
    expect(resolveInteractiveLatencyRoutingSettings({})).toBeUndefined();
    expect(
      resolveInteractiveLatencyRoutingSettings({ models: {} } as OpenClawConfig),
    ).toBeUndefined();
  });

  it("is undefined when disabled or prefer/kinds are empty", () => {
    expect(
      resolveInteractiveLatencyRoutingSettings(routingConfig({ enabled: false })),
    ).toBeUndefined();
    expect(resolveInteractiveLatencyRoutingSettings(routingConfig({ prefer: [] }))).toBeUndefined();
    expect(resolveInteractiveLatencyRoutingSettings(routingConfig({ kinds: [] }))).toBeUndefined();
  });

  it("applies documented defaults and trims entries", () => {
    const settings = resolveInteractiveLatencyRoutingSettings(routingConfig())!;
    expect(settings.enabled).toBe(true);
    expect(settings.kinds).toEqual(["slack"]);
    expect(settings.prefer).toEqual(PREFERRED);
    expect(settings.fallbackToConfigured).toBe(true);
    expect(settings.maxFallbackLatencyMs).toBe(15_000);
    const trimmed = resolveInteractiveLatencyRoutingSettings({
      models: {
        interactiveLatencyRouting: {
          enabled: true,
          sessionMatch: { kinds: [" Slack "] },
          prefer: [{ provider: " Ollama-Cloud ", model: " glm-5.3-flash " }],
        },
      },
    } as OpenClawConfig)!;
    expect(trimmed.kinds).toEqual(["slack"]);
    expect(trimmed.prefer).toEqual([{ provider: "Ollama-Cloud", model: "glm-5.3-flash" }]);
  });
});

describe("interactive lane classification", () => {
  it("matches delivery-shaped lanes on configured kinds (dm, channel, group, direct)", () => {
    for (const key of [
      "agent:oscar:slack:direct:acct1:U123",
      "agent:oscar:slack:dm:acct1:U123",
      "agent:oscar:slack:channel:acct1:C456",
      "agent:oscar:slack:group:acct1:G789",
      "agent:oscar:slack:channel:acct1:C456:thread:123.456",
    ]) {
      expect(isInteractiveLatencyRoutingSessionKey(key, ["slack"])).toBe(true);
    }
  });

  it("never matches non-interactive key shapes", () => {
    for (const key of [
      "agent:oscar:cron:nightly:run:r1",
      "agent:oscar:subagent:spawn1",
      "subagent:spawn1",
      "agent:oscar:acp:session1",
      "incognito:private",
      "agent:oscar:main",
    ]) {
      expect(isInteractiveLatencyRoutingSessionKey(key, ["slack"])).toBe(false);
    }
  });

  it("requires the channel to be one of the configured kinds", () => {
    expect(
      isInteractiveLatencyRoutingSessionKey("agent:oscar:telegram:direct:a:U1", ["slack"]),
    ).toBe(false);
    expect(
      isInteractiveLatencyRoutingSessionKey("agent:oscar:telegram:direct:a:U1", [
        "slack",
        "telegram",
      ]),
    ).toBe(true);
  });
});

describe("interactive route selection matrix", () => {
  beforeEach(() => {
    resetInteractiveLatencyRouteHealthForTests();
  });
  afterEach(() => {
    resetInteractiveLatencyRouteHealthForTests();
  });

  it("routes a slack user turn on the configured default to the first healthy preferred mirror", () => {
    expect(decide()).toEqual({
      provider: "ollama-cloud",
      modelId: "glm-5.3-flash",
      routed: true,
      reason: "preferred-healthy",
    });
  });

  it("keeps cron, subagent, incognito, acp, and heartbeat lanes unchanged", () => {
    for (const sessionKey of [
      "agent:oscar:cron:nightly:run:r1",
      "agent:oscar:subagent:spawn1",
      "incognito:private",
      "agent:oscar:acp:session1",
    ]) {
      const decision = decide({ sessionKey });
      expect(decision.routed).toBe(false);
      expect(decision.reason).toBe("session-not-interactive");
    }
    const heartbeat = decide({ trigger: "heartbeat" });
    expect(heartbeat.routed).toBe(false);
    expect(heartbeat.reason).toBe("trigger-not-interactive");
    for (const trigger of ["cron", "memory", "overflow"] as const) {
      expect(decide({ trigger }).routed).toBe(false);
    }
  });

  it("keeps non-configured channels and non-interactive triggers unchanged", () => {
    expect(decide({ sessionKey: "agent:oscar:telegram:direct:a:U1" }).routed).toBe(false);
    expect(decide({ sessionKey: undefined }).routed).toBe(false);
  });

  it("keeps the selection when routing is disabled", () => {
    const decision = decide({ settings: undefined });
    expect(decision).toEqual({
      provider: "zai",
      modelId: "glm-5.3-flash",
      routed: false,
    });
  });

  it("respects plugin hook overrides, model locks, native ownership, and session pins", () => {
    for (const overrides of [
      { hookSelectionChanged: true },
      { modelSelectionLocked: true },
      { nativeSessionOwned: true },
      { sessionModelOverride: true },
      { incomingProvider: "synthetic", incomingModelId: "hf:moonshotai/Kimi-K3" },
      { incomingModelId: "glm-5.3" },
    ]) {
      const decision = decide(overrides);
      expect(decision.routed).toBe(false);
      expect(decision.provider).toBe(overrides.incomingProvider ?? BASE_DECISION.incomingProvider);
      expect(decision.modelId).toBe(overrides.incomingModelId ?? BASE_DECISION.incomingModelId);
    }
  });

  it("falls back to the configured model when every preferred mirror is unhealthy", () => {
    for (const mirror of PREFERRED) {
      for (let i = 0; i < 2; i += 1) {
        recordInteractiveLatencyRouteObservation({
          provider: mirror.provider,
          model: mirror.model,
          durationMs: 20_000,
          errored: false,
        });
      }
      expect(isInteractiveLatencyRouteHealthy(mirror.provider, mirror.model)).toBe(false);
    }
    const decision = decide();
    expect(decision.routed).toBe(false);
    expect(decision.reason).toBe("preferred-unhealthy-fallback-configured");
    expect(decision.provider).toBe("zai");
  });

  it("prefers the second mirror when the first has errored twice", () => {
    for (let i = 0; i < 2; i += 1) {
      recordInteractiveLatencyRouteObservation({
        provider: "ollama-cloud",
        model: "glm-5.3-flash",
        durationMs: 1_000,
        errored: true,
      });
    }
    expect(isInteractiveLatencyRouteHealthy("ollama-cloud", "glm-5.3-flash")).toBe(false);
    expect(decide()).toEqual({
      provider: "opencode-go",
      modelId: "glm-5.3-flash",
      routed: true,
      reason: "preferred-healthy",
    });
  });

  it("recovers a parked mirror after a within-budget success", () => {
    for (let i = 0; i < 2; i += 1) {
      recordInteractiveLatencyRouteObservation({
        provider: "ollama-cloud",
        model: "glm-5.3-flash",
        durationMs: 20_000,
        errored: false,
      });
    }
    expect(isInteractiveLatencyRouteHealthy("ollama-cloud", "glm-5.3-flash")).toBe(false);
    recordInteractiveLatencyRouteObservation({
      provider: "ollama-cloud",
      model: "glm-5.3-flash",
      durationMs: 2_000,
      errored: false,
    });
    expect(isInteractiveLatencyRouteHealthy("ollama-cloud", "glm-5.3-flash")).toBe(true);
  });

  it("honors a custom maxFallbackLatencyMs for the slow-call threshold", () => {
    const settings = resolveInteractiveLatencyRoutingSettings(
      routingConfig({ maxFallbackLatencyMs: 1_000 }),
    )!;
    expect(settings.maxFallbackLatencyMs).toBe(1_000);
    for (let i = 0; i < 2; i += 1) {
      recordInteractiveLatencyRouteObservation({
        provider: "opencode-go",
        model: "glm-5.3-flash",
        durationMs: 1_500,
        errored: false,
        maxFallbackLatencyMs: 1_000,
      });
    }
    expect(isInteractiveLatencyRouteHealthy("opencode-go", "glm-5.3-flash")).toBe(false);
  });

  it("keeps the sticky preferred mirror when fallbackToConfigured is false", () => {
    for (let i = 0; i < 2; i += 1) {
      recordInteractiveLatencyRouteObservation({
        provider: "ollama-cloud",
        model: "glm-5.3-flash",
        durationMs: 20_000,
        errored: false,
      });
      recordInteractiveLatencyRouteObservation({
        provider: "opencode-go",
        model: "glm-5.3-flash",
        durationMs: 20_000,
        errored: false,
      });
    }
    const settings = resolveInteractiveLatencyRoutingSettings(
      routingConfig({ fallbackToConfigured: false }),
    )!;
    const decision = resolveInteractiveLatencyRoute({
      ...BASE_DECISION,
      settings,
    });
    expect(decision).toEqual({
      provider: "ollama-cloud",
      modelId: "glm-5.3-flash",
      routed: true,
      reason: "preferred-sticky",
    });
  });

  it("never changes manual-trigger interactive turns that carry explicit selections", () => {
    const decision = decide({
      trigger: "manual",
      incomingProvider: "zai",
      incomingModelId: "glm-5.3",
    });
    expect(decision.routed).toBe(false);
    expect(decision.reason).toBe("explicit-selection");
  });
});
