import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../../config/types.openclaw.js";
import {
  initializeGlobalHookRunner,
  resetGlobalHookRunner,
} from "../../plugins/hook-runner-global.js";
import { createMockPluginRegistry } from "../../plugins/hooks.test-fixtures.js";
import { runAgentHarnessAgentEndHook } from "../harness/lifecycle-hook-helpers.js";
import type { EmbeddedAgentRunResult } from "./types.js";

type CandidateOptions = {
  allowTransientCooldownProbe?: boolean;
  isFinalFallbackAttempt?: boolean;
};

type FallbackRunnerParams = {
  provider: string;
  model: string;
  prepareAgentHarnessRuntime?: (params: {
    provider: string;
    model: string;
    agentHarnessRuntimeOverride?: string;
  }) => Promise<void> | void;
  classifyResult?: (params: {
    result: EmbeddedAgentRunResult;
    provider: string;
    model: string;
    attempt: number;
    total: number;
  }) => unknown;
  canFallbackAfterError?: (params: {
    provider: string;
    model: string;
    error: unknown;
    attempt: number;
    total: number;
  }) => boolean | Promise<boolean>;
  mergeExhaustedResult?: (params: {
    latestResult: EmbeddedAgentRunResult;
    preferredResult: EmbeddedAgentRunResult;
  }) => EmbeddedAgentRunResult;
  run: (
    provider: string,
    model: string,
    options?: CandidateOptions,
  ) => Promise<EmbeddedAgentRunResult>;
};

const state = vi.hoisted(() => ({
  runWithModelFallback: vi.fn(),
  ensureSelectedAgentHarnessPlugin: vi.fn(async (_params: unknown) => undefined),
}));

vi.mock("../model-fallback-runner.js", () => ({
  runWithModelFallback: (params: FallbackRunnerParams) => state.runWithModelFallback(params),
}));

vi.mock("../harness/runtime-plugin.js", () => ({
  ensureSelectedAgentHarnessPlugin: (params: unknown) =>
    state.ensureSelectedAgentHarnessPlugin(params),
}));

function makeResult(params: {
  provider: string;
  model: string;
  classification?: "empty";
}): EmbeddedAgentRunResult {
  return {
    payloads: params.classification ? [] : [{ text: "recovered" }],
    meta: {
      durationMs: 10,
      aborted: false,
      yielded: true,
      providerStarted: true,
      stopReason: "end_turn",
      agentHarnessResultClassification: params.classification,
      agentMeta: {
        sessionId: "session-1",
        provider: params.provider,
        model: params.model,
      },
    },
  };
}

describe("runEmbeddedAgentEntry", () => {
  beforeEach(() => {
    resetGlobalHookRunner();
    state.ensureSelectedAgentHarnessPlugin.mockClear();
    state.runWithModelFallback
      .mockReset()
      .mockImplementation(async (params: FallbackRunnerParams) => {
        await params.prepareAgentHarnessRuntime?.({
          provider: params.provider,
          model: params.model,
        });
        const primaryResult = await params.run(params.provider, params.model, {
          allowTransientCooldownProbe: true,
        });
        const classification = await params.classifyResult?.({
          result: primaryResult,
          provider: params.provider,
          model: params.model,
          attempt: 1,
          total: 2,
        });
        expect(classification).toBeTruthy();
        const fallbackProvider = "fallback-provider";
        const fallbackModel = "fallback-model";
        await params.prepareAgentHarnessRuntime?.({
          provider: fallbackProvider,
          model: fallbackModel,
        });
        const result = await params.run(fallbackProvider, fallbackModel, {
          isFinalFallbackAttempt: true,
        });
        return {
          outcome: "completed" as const,
          result,
          provider: fallbackProvider,
          model: fallbackModel,
          attempts: [
            {
              provider: params.provider,
              model: params.model,
              error: "empty result",
              reason: "format" as const,
            },
          ],
        };
      });
  });

  afterEach(() => {
    resetGlobalHookRunner();
  });

  it("keeps shared fallback and terminal behavior aligned across entry modes", async () => {
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const cfg: OpenClawConfig = {};
    const runMode = async (behavior: "channel-delivery" | "command-rpc") => {
      const candidateCalls: Array<{
        provider: string;
        model: string;
        isFallbackRetry: boolean;
      }> = [];
      const reconciled: Array<{ provider: string; model: string }> = [];
      const result = await runEmbeddedAgentEntry({
        selection: { cfg, provider: "primary-provider", model: "primary-model" },
        identity: {
          runId: `run-${behavior}`,
          agentId: "main",
          sessionId: "session-1",
        },
        harness: {
          workspaceDir: "/tmp/workspace",
          preparation: { kind: "direct" },
          resolveRuntimeOverride: () => undefined,
        },
        behavior:
          behavior === "channel-delivery"
            ? {
                kind: "channel-delivery" as const,
                readDeliveryEvidence: () => ({
                  hasDirectlySentBlockReply: false,
                  hasBlockReplyPipelineOutput: false,
                }),
              }
            : {
                kind: "command-rpc" as const,
                hasCommittedSideEffect: () => false,
              },
        sessionOverride: {
          kind: "reconcile-completed",
          reconcile: async (candidate) => {
            reconciled.push(candidate);
          },
        },
        runCandidate: async (provider, model, options) => {
          candidateCalls.push({ provider, model, isFallbackRetry: options.isFallbackRetry });
          return makeResult({
            provider,
            model,
            classification: options.isFallbackRetry ? undefined : "empty",
          });
        },
      });
      await result.settleSessionOverride();
      await result.settleSessionOverride();
      return { result, candidateCalls, reconciled };
    };

    const channel = await runMode("channel-delivery");
    const command = await runMode("command-rpc");

    expect(channel.candidateCalls).toEqual(command.candidateCalls);
    expect(channel.result.outcome).toBe("completed");
    expect(channel.result.provider).toBe("fallback-provider");
    expect(channel.result.model).toBe("fallback-model");
    expect(channel.result.attempts).toEqual(command.result.attempts);
    expect(channel.result.terminal).toEqual(command.result.terminal);
    expect(channel.reconciled).toEqual(command.reconciled);
    expect(channel.reconciled).toEqual([
      { provider: "fallback-provider", model: "fallback-model" },
    ]);
  });

  it("leaves maintenance fallback classification to thrown candidate errors", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      expect(params.classifyResult).toBeUndefined();
      expect(params.mergeExhaustedResult).toBeUndefined();
      const result = await params.run(params.provider, params.model);
      return {
        outcome: "completed" as const,
        result,
        provider: params.provider,
        model: params.model,
        attempts: [],
      };
    });
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const result = await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
      identity: { runId: "maintenance", agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: { kind: "maintenance" },
      sessionOverride: { kind: "preserve" },
      runCandidate: async (provider, model) => makeResult({ provider, model }),
    });

    expect(result.result.payloads).toEqual([{ text: "recovered" }]);
  });

  it("does not replay a thrown channel-delivery attempt that already delivered its reply (#113788)", async () => {
    const failure = new Error("insufficient quota");
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      // Mirror the fallback loop's thrown-error exit: the attempt error bypasses
      // result classification, so the error-path backstop is the only guard that
      // can stop the next candidate from replaying the delivered turn.
      await expect(params.run(params.provider, params.model)).rejects.toBe(failure);
      const allowed = await params.canFallbackAfterError?.({
        provider: params.provider,
        model: params.model,
        error: failure,
        attempt: 1,
        total: 2,
      });
      expect(allowed).toBe(false);
      throw failure;
    });
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const runCandidate = vi.fn(async (_provider: string, _model: string) => {
      throw failure;
    });

    await expect(
      runEmbeddedAgentEntry({
        selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
        identity: { runId: "channel-throw", agentId: "main", sessionId: "session-1" },
        harness: {
          workspaceDir: "/tmp/workspace",
          preparation: { kind: "direct" },
          resolveRuntimeOverride: () => undefined,
        },
        behavior: {
          kind: "channel-delivery",
          readDeliveryEvidence: () => ({
            hasDirectlySentBlockReply: true,
            hasBlockReplyPipelineOutput: false,
          }),
        },
        sessionOverride: { kind: "preserve" },
        runCandidate,
      }),
    ).rejects.toBe(failure);

    expect(runCandidate).toHaveBeenCalledTimes(1);
  });

  it("still falls back when a thrown channel-delivery attempt delivered nothing", async () => {
    const failure = new Error("insufficient quota");
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      await expect(params.run(params.provider, params.model)).rejects.toBe(failure);
      const allowed = await params.canFallbackAfterError?.({
        provider: params.provider,
        model: params.model,
        error: failure,
        attempt: 1,
        total: 2,
      });
      expect(allowed).toBe(true);
      const fallbackProvider = "fallback-provider";
      const fallbackModel = "fallback-model";
      const result = await params.run(fallbackProvider, fallbackModel, {
        isFinalFallbackAttempt: true,
      });
      return {
        outcome: "completed" as const,
        result,
        provider: fallbackProvider,
        model: fallbackModel,
        attempts: [
          {
            provider: params.provider,
            model: params.model,
            error: failure.message,
            reason: "billing" as const,
          },
        ],
      };
    });
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const runCandidate = vi.fn(async (provider: string, model: string) => {
      if (provider === "primary-provider") {
        throw failure;
      }
      return makeResult({ provider, model });
    });

    const result = await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
      identity: { runId: "channel-throw-empty", agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: {
        kind: "channel-delivery",
        readDeliveryEvidence: () => ({
          hasDirectlySentBlockReply: false,
          hasBlockReplyPipelineOutput: false,
        }),
      },
      sessionOverride: { kind: "preserve" },
      runCandidate,
    });

    expect(runCandidate).toHaveBeenCalledTimes(2);
    expect(result.outcome).toBe("completed");
    expect(result.provider).toBe("fallback-provider");
  });

  it("retains non-visible follow-up results for terminal delivery", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      const result = await params.run(params.provider, params.model);
      expect(
        params.classifyResult?.({
          result,
          provider: params.provider,
          model: params.model,
          attempt: 1,
          total: 1,
        }),
      ).toMatchObject({
        code: "empty_result",
        preserveResultOnExhaustion: true,
        preserveResultPriority: -1,
      });
      return {
        outcome: "exhausted" as const,
        result,
        provider: params.provider,
        model: params.model,
        attempts: [],
      };
    });
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const result = await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
      identity: { runId: "followup", agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: { kind: "followup-delivery" },
      sessionOverride: { kind: "preserve" },
      runCandidate: async (provider, model) =>
        makeResult({ provider, model, classification: "empty" }),
    });

    expect(result.outcome).toBe("exhausted");
    expect(result.result.payloads).toEqual([]);
  });

  it.each([
    {
      name: "embedded visible reply",
      meta: { finalAssistantVisibleText: "visible", finalAssistantRawText: "visible" },
      expected: { disposition: "visible", text: "visible" },
    },
    {
      name: "CLI exact silence",
      meta: { finalAssistantVisibleText: "NO_REPLY", finalAssistantRawText: "NO_REPLY" },
      expected: { disposition: "silent" },
    },
    {
      name: "CLI punctuation-wrapped silence",
      meta: { finalAssistantVisibleText: "NO_REPLY...", finalAssistantRawText: "NO_REPLY..." },
      expected: { disposition: "silent" },
    },
    {
      name: "clean empty reply",
      meta: {},
      expected: { disposition: "empty" },
    },
  ])("records the producer-owned terminal snapshot for $name", async ({ name, meta, expected }) => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => ({
      outcome: "completed" as const,
      result: await params.run(params.provider, params.model),
      provider: params.provider,
      model: params.model,
      attempts: [],
    }));
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");
    const result = await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "provider", model: "model" },
      identity: { runId: `terminal-${name}`, agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: { kind: "command-rpc", hasCommittedSideEffect: () => false },
      sessionOverride: { kind: "preserve" },
      runCandidate: async (provider, model) => ({
        ...makeResult({ provider, model }),
        meta: { ...makeResult({ provider, model }).meta, ...meta },
      }),
    });

    expect(result.terminal.metadata.terminalReply).toEqual(expected);
  });

  it("emits one terminal agent_end when the primary succeeds before configured fallbacks", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      const result = await params.run(params.provider, params.model, {
        isFinalFallbackAttempt: false,
      });
      return {
        outcome: "completed" as const,
        result,
        provider: params.provider,
        model: params.model,
        attempts: [],
      };
    });
    const hookRunner = {
      hasHooks: vi.fn((hookName: string) => hookName === "agent_end"),
      runAgentEnd: vi.fn(async () => undefined),
    };
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");

    await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
      identity: { runId: "primary-success", agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: { kind: "maintenance" },
      sessionOverride: { kind: "preserve" },
      runCandidate: async (provider, model) => {
        runAgentHarnessAgentEndHook({
          event: { messages: [`${provider}/${model}`], success: true, terminal: true },
          ctx: { runId: "primary-success" },
          hookRunner: hookRunner as never,
        });
        return makeResult({ provider, model });
      },
    });

    expect(hookRunner.runAgentEnd).toHaveBeenCalledOnce();
    expect(hookRunner.runAgentEnd.mock.calls[0]?.[0]).toEqual({
      messages: ["primary-provider/primary-model"],
      success: true,
      terminal: true,
      durationMs: expect.any(Number),
    });
  });

  it("emits one terminal agent_end when a middle fallback succeeds", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      await params.run(params.provider, params.model, {
        isFinalFallbackAttempt: false,
      });
      const provider = "middle-provider";
      const model = "middle-model";
      const result = await params.run(provider, model, {
        isFinalFallbackAttempt: false,
      });
      return {
        outcome: "completed" as const,
        result,
        provider,
        model,
        attempts: [],
      };
    });
    const hookRunner = {
      hasHooks: vi.fn((hookName: string) => hookName === "agent_end"),
      runAgentEnd: vi.fn(async () => undefined),
    };
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");

    await runEmbeddedAgentEntry({
      selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
      identity: { runId: "middle-success", agentId: "main", sessionId: "session-1" },
      harness: {
        workspaceDir: "/tmp/workspace",
        preparation: { kind: "direct" },
        resolveRuntimeOverride: () => undefined,
      },
      behavior: { kind: "maintenance" },
      sessionOverride: { kind: "preserve" },
      runCandidate: async (provider, model) => {
        runAgentHarnessAgentEndHook({
          event: { messages: [`${provider}/${model}`], success: true, terminal: true },
          ctx: { runId: "middle-success" },
          hookRunner: hookRunner as never,
        });
        return makeResult({ provider, model });
      },
    });

    expect(hookRunner.runAgentEnd).toHaveBeenCalledOnce();
    expect(hookRunner.runAgentEnd.mock.calls[0]?.[0]).toEqual({
      messages: ["middle-provider/middle-model"],
      success: true,
      terminal: true,
      durationMs: expect.any(Number),
    });
  });

  it("emits one terminal failed agent_end for a non-retriable outer error", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      await params.run(params.provider, params.model, {
        isFinalFallbackAttempt: false,
      });
      throw new Error("non-retriable outer failure");
    });
    const hookRunner = {
      hasHooks: vi.fn((hookName: string) => hookName === "agent_end"),
      runAgentEnd: vi.fn(async () => undefined),
    };
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");

    await expect(
      runEmbeddedAgentEntry({
        selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
        identity: { runId: "terminal-error", agentId: "main", sessionId: "session-1" },
        harness: {
          workspaceDir: "/tmp/workspace",
          preparation: { kind: "direct" },
          resolveRuntimeOverride: () => undefined,
        },
        behavior: { kind: "maintenance" },
        sessionOverride: { kind: "preserve" },
        runCandidate: async (provider, model) => {
          runAgentHarnessAgentEndHook({
            event: {
              messages: [`${provider}/${model}`],
              success: false,
              terminal: true,
              error: "candidate failed",
            },
            ctx: { runId: "terminal-error" },
            hookRunner: hookRunner as never,
          });
          return makeResult({ provider, model });
        },
      }),
    ).rejects.toThrow("non-retriable outer failure");

    expect(hookRunner.runAgentEnd).toHaveBeenCalledOnce();
    expect(hookRunner.runAgentEnd.mock.calls[0]?.[0]).toEqual({
      messages: ["primary-provider/primary-model"],
      success: false,
      terminal: true,
      error: "non-retriable outer failure",
      durationMs: expect.any(Number),
    });
  });

  it("emits one terminal agent_end when all candidates throw before agent_end", async () => {
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      await params
        .run(params.provider, params.model, {
          isFinalFallbackAttempt: false,
        })
        .catch(() => undefined);
      await params
        .run("fallback-provider", "fallback-model", {
          isFinalFallbackAttempt: true,
        })
        .catch(() => undefined);
      throw new Error("all candidates failed during setup");
    });
    const agentEndHandler = vi.fn(async () => undefined);
    initializeGlobalHookRunner(
      createMockPluginRegistry([{ hookName: "agent_end", handler: agentEndHandler }]),
    );
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");

    await expect(
      runEmbeddedAgentEntry({
        selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
        identity: { runId: "pre-agent-end-errors", agentId: "main", sessionId: "session-1" },
        harness: {
          workspaceDir: "/tmp/workspace",
          preparation: { kind: "direct" },
          resolveRuntimeOverride: () => undefined,
        },
        behavior: { kind: "maintenance" },
        sessionOverride: { kind: "preserve" },
        runCandidate: async () => {
          throw new Error("setup failed before agent_end");
        },
      }),
    ).rejects.toThrow("all candidates failed during setup");

    expect(agentEndHandler).toHaveBeenCalledOnce();
    expect(agentEndHandler.mock.calls[0]?.[0]).toEqual({
      runId: "pre-agent-end-errors",
      messages: [],
      success: false,
      terminal: true,
      error: "all candidates failed during setup",
      durationMs: expect.any(Number),
    });
  });

  it("reports outer fallback-chain duration on the terminal agent_end", async () => {
    const nowSpy = vi.spyOn(Date, "now").mockReturnValue(1_000);
    state.runWithModelFallback.mockImplementationOnce(async (params: FallbackRunnerParams) => {
      await params.run(params.provider, params.model, {
        isFinalFallbackAttempt: false,
      });
      nowSpy.mockReturnValue(1_400);
      const provider = "fallback-provider";
      const model = "fallback-model";
      const result = await params.run(provider, model, {
        isFinalFallbackAttempt: true,
      });
      nowSpy.mockReturnValue(1_750);
      return {
        outcome: "completed" as const,
        result,
        provider,
        model,
        attempts: [],
      };
    });
    const hookRunner = {
      hasHooks: vi.fn((hookName: string) => hookName === "agent_end"),
      runAgentEnd: vi.fn(async () => undefined),
    };
    const { runEmbeddedAgentEntry } = await import("./run-entry.js");

    try {
      await runEmbeddedAgentEntry({
        selection: { cfg: {}, provider: "primary-provider", model: "primary-model" },
        identity: { runId: "fallback-duration", agentId: "main", sessionId: "session-1" },
        harness: {
          workspaceDir: "/tmp/workspace",
          preparation: { kind: "direct" },
          resolveRuntimeOverride: () => undefined,
        },
        behavior: { kind: "maintenance" },
        sessionOverride: { kind: "preserve" },
        runCandidate: async (provider, model) => {
          runAgentHarnessAgentEndHook({
            event: {
              messages: [`${provider}/${model}`],
              success: true,
              terminal: true,
              durationMs: 10,
            },
            ctx: { runId: "fallback-duration" },
            hookRunner: hookRunner as never,
          });
          return makeResult({ provider, model });
        },
      });
    } finally {
      nowSpy.mockRestore();
    }

    expect(hookRunner.runAgentEnd).toHaveBeenCalledOnce();
    expect(hookRunner.runAgentEnd.mock.calls[0]?.[0]).toEqual({
      messages: ["fallback-provider/fallback-model"],
      success: true,
      terminal: true,
      durationMs: 750,
    });
  });
});
