// Runtime-llm-complete caller authority: process-owned background completions
// must not assert the launching turn's gateway tool caller identity.
import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveContextEngineCapabilities } from "../../agents/embedded-agent-runner/context-engine-capabilities.js";
import { withGatewayToolCallerIdentity } from "../../agents/tools/gateway-caller-context.js";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import { withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope.js";
import { createRuntimeLlm } from "./runtime-llm.runtime.js";

const hoisted = vi.hoisted(() => ({
  acquireSimpleCompletionModelForAgent:
    vi.fn<
      typeof import("../../agents/simple-completion-runtime.js").acquireSimpleCompletionModelForAgent
    >(),
  completeWithPreparedSimpleCompletionModel: vi.fn(),
  resolveSimpleCompletionSelectionForAgent: vi.fn(),
}));

// mock-isolation: fork test fakes this module by design; the real module performs IO.
vi.mock("../../agents/simple-completion-runtime.js", () => ({
  acquireSimpleCompletionModelForAgent: hoisted.acquireSimpleCompletionModelForAgent,
  completeWithPreparedSimpleCompletionModel: hoisted.completeWithPreparedSimpleCompletionModel,
  resolveSimpleCompletionSelectionForAgent: hoisted.resolveSimpleCompletionSelectionForAgent,
}));

const cfg = {
  agents: {
    defaults: {
      model: "openai/gpt-5.5",
    },
  },
} satisfies OpenClawConfig;

const cfgWithLosslessClawPolicy = {
  ...cfg,
  plugins: {
    entries: {
      "lossless-claw": {
        llm: { allowAgentIdOverride: true, allowModelOverride: true },
      },
    },
  },
} satisfies OpenClawConfig;

function createPreparedModel() {
  return {
    async [Symbol.asyncDispose]() {},
    selection: { provider: "openai", modelId: "gpt-5.5", agentDir: "/tmp/openclaw-agent" },
    model: {
      provider: "openai",
      id: "gpt-5.5",
      name: "gpt-5.5",
      api: "openai",
      baseUrl: "https://fixture.invalid/v1",
      input: ["text"],
      reasoning: false,
      contextWindow: 128_000,
      maxTokens: 4096,
      cost: { input: 1, output: 2, cacheRead: 0.1, cacheWrite: 0.2 },
    },
    auth: { apiKey: "test-api-key", source: "test", mode: "api-key" },
  };
}

// A finished turn's caller identity: the operational run is retained while its
// receipt authority is gone, exactly like compaction scheduled by an ended turn.
const staleGatewayToolCallerIdentity = {
  agentId: "ada",
  sessionKey: "agent:ada:session:abc",
  operationalRunInstance: {
    runId: "run-1",
    instanceId: "instance-1",
  } as never,
} as never;

describe("runtime-llm-complete caller authority", () => {
  beforeEach(() => {
    hoisted.acquireSimpleCompletionModelForAgent.mockReset();
    hoisted.completeWithPreparedSimpleCompletionModel.mockReset();
    hoisted.resolveSimpleCompletionSelectionForAgent.mockReset();
    hoisted.acquireSimpleCompletionModelForAgent.mockResolvedValue(createPreparedModel() as never);
    hoisted.resolveSimpleCompletionSelectionForAgent.mockReturnValue({
      provider: "openai",
      modelId: "gpt-5.5",
      agentDir: "/tmp/ada",
    });
    hoisted.completeWithPreparedSimpleCompletionModel.mockResolvedValue({
      content: [{ type: "text", text: "done" }],
      responseModel: "gpt-5.5-2026-08-01",
      stopReason: "stop",
      usage: { input: 1, output: 1, total: 2 },
    });
  });

  it("completes context-engine runtime-llm-complete work detached from a stale gateway tool caller identity", async () => {
    const runtimeContext = resolveContextEngineCapabilities({
      config: cfg,
      sessionKey: "agent:ada:session:abc",
      purpose: "context-engine.compaction",
    });
    let ambientCallerIdentityDuringAcquire: unknown = "sentinel";
    hoisted.acquireSimpleCompletionModelForAgent.mockImplementation(async () => {
      const { getGatewayToolCallerIdentity } =
        await import("../../agents/tools/gateway-caller-context.js");
      ambientCallerIdentityDuringAcquire = getGatewayToolCallerIdentity();
      return createPreparedModel() as never;
    });

    const result = await withGatewayToolCallerIdentity(staleGatewayToolCallerIdentity, async () =>
      runtimeContext.llm!.complete({
        messages: [{ role: "user", content: "summarize" }],
      }),
    );

    expect(result.agentId).toBe("ada");
    expect(ambientCallerIdentityDuringAcquire).toBeUndefined();
  });

  it("completes plugin-scope background summarizer calls that inherit a stale gateway tool caller identity", async () => {
    const runtime = createRuntimeLlm({
      getConfig: () => cfg,
      authority: { allowComplete: true },
    });

    const result = await withGatewayToolCallerIdentity(staleGatewayToolCallerIdentity, async () =>
      runtime.complete({
        messages: [{ role: "user", content: "summarize" }],
        purpose: "lossless-claw compaction summarization",
      }),
    );

    expect(result.agentId).toBe("main");
    expect(result.audit.caller).toEqual({ kind: "unknown" });
  });

  it("completes plugin-scope background summarizer calls under a finished gateway request scope while keeping plugin attribution", async () => {
    const runtime = createRuntimeLlm({
      getConfig: () => cfgWithLosslessClawPolicy,
      authority: { allowComplete: true },
    });

    const result = await withPluginRuntimeGatewayRequestScope(
      {
        isWebchatConnect: () => false,
        pluginId: "lossless-claw",
        hasCurrentClientAuthority: () => false,
      },
      async () =>
        runtime.complete({
          messages: [{ role: "user", content: "summarize" }],
          purpose: "lossless-claw compaction summarization",
          agentId: "ada",
        }),
    );

    expect(result.agentId).toBe("ada");
    expect(result.audit.caller).toEqual({ kind: "plugin", id: "lossless-claw" });
  });

  it("keeps asserting a live caller identity that dies while the completion is in flight", async () => {
    let current = true;
    const liveIdentity = {
      agentId: "ada",
      sessionKey: "agent:ada:session:abc",
      operationalRunInstance: { runId: "run-2", instanceId: "instance-2" } as never,
      receiptAuthority: () => current,
    } as never;
    hoisted.acquireSimpleCompletionModelForAgent.mockImplementation(async () => {
      current = false;
      return createPreparedModel() as never;
    });
    const runtime = createRuntimeLlm({
      getConfig: () => cfg,
      authority: { allowComplete: true },
    });

    await expect(
      withGatewayToolCallerIdentity(liveIdentity, async () =>
        runtime.complete({
          messages: [{ role: "user", content: "summarize" }],
        }),
      ),
    ).rejects.toThrow("agent tool caller authority is no longer active");
  });

  it("keeps asserting in-turn tool dispatch under the same stale gateway tool caller identity", async () => {
    const { bindAgentToolGatewayRequest } =
      await import("../../agents/tools/in-process-gateway.js");

    await withGatewayToolCallerIdentity(staleGatewayToolCallerIdentity, async () => {
      const caller = bindAgentToolGatewayRequest();
      await expect(caller({ method: "ping", params: {} })).rejects.toThrow(
        "agent tool caller authority is no longer active",
      );
    });
  });
});
