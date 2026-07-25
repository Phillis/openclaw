import { describe, expect, it, vi } from "vitest";
import { completeEmbeddedAttemptResult } from "./attempt-result.js";

function completeResult(params?: {
  latestMcpAppChannelView?: { viewId: string };
  clientToolCallSlots?: Array<{
    toolCallId: string;
    name: string;
    params?: Record<string, unknown>;
    completed: boolean;
  }>;
  pendingToolMediaReply?: { mediaUrls?: string[]; audioAsVoice?: boolean };
  toolMetas?: Array<{
    toolName: string;
    meta?: string;
    replaySafe?: boolean;
    isError?: true;
    asyncStarted?: boolean;
    asyncTaskRunId?: string;
    asyncTaskId?: string;
  }>;
  attempt?: Record<string, unknown>;
  attemptUsage?: Record<string, number>;
  assistantTexts?: string[];
  hookRunner?: {
    hasHooks: (hookName: string) => boolean;
    runLlmOutput: ReturnType<typeof vi.fn>;
  };
}) {
  return completeEmbeddedAttemptResult({
    attempt: {
      runId: "run-1",
      sessionId: "session-1",
      provider: "test",
      modelId: "model",
      model: { api: "openai-responses" },
      trigger: "user",
      ...params?.attempt,
    } as never,
    subscription: {
      assistantTexts: params?.assistantTexts ?? [],
      didSendDeterministicApprovalPrompt: () => false,
      didSendViaMessagingTool: () => false,
      getAcceptedSessionSpawns: () => [],
      getAssistantTurnCount: () => 0,
      getCompactionCount: () => 0,
      getHeartbeatToolResponse: () => undefined,
      getItemLifecycle: () => undefined,
      getLastAssistantTextMessageIndex: () => undefined,
      getLastCompactionTokensAfter: () => undefined,
      getLastToolError: () => undefined,
      getLatestMcpAppChannelView: () => params?.latestMcpAppChannelView,
      getMessagingToolSentMediaUrls: () => [],
      getMessagingToolSentTargets: () => [],
      getMessagingToolSentTexts: () => [],
      getMessagingToolSourceReplyPayloads: () => [],
      getPendingToolMediaReply: () => params?.pendingToolMediaReply,
      getReplayState: () => ({ replayInvalid: false, hadPotentialSideEffects: false }),
      getSuccessfulCronAdds: () => [],
      getVisibleBlockReplyCount: () => 0,
      hasToolMediaBlockReply: () => false,
      setTerminalLifecycleMeta: () => {},
      toolMetas: params?.toolMetas ?? [],
    } as never,
    state: {
      terminal: { kind: "ok" },
      sessionIdUsed: "session-1",
      messagesSnapshot: [],
      yieldDetected: false,
      didDeliverSourceReplyViaMessageTool: false,
      attemptUsage: params?.attemptUsage,
      diagnosticTrace: { traceId: "trace-1", spanId: "span-1" },
    } as never,
    clientToolCallSlots: params?.clientToolCallSlots ?? [],
    hookRunner: params?.hookRunner as never,
    hookAgentId: "main",
    bootstrapPromptWarning: {},
    cache: {
      observabilityEnabled: false,
      trace: null,
      break: null,
      changesForTurn: null,
      streamStrategy: "default",
    },
  });
}

describe("attempt result projection", () => {
  it("keeps completed client tool calls in reserved source order", () => {
    expect(
      completeResult({
        clientToolCallSlots: [
          { toolCallId: "first", name: "search", params: { query: "one" }, completed: true },
          { toolCallId: "second", name: "search", completed: false },
          { toolCallId: "third", name: "fetch", params: { id: 3 }, completed: true },
        ],
      }).clientToolCalls,
    ).toEqual([
      { name: "search", params: { query: "one" } },
      { name: "fetch", params: { id: 3 } },
    ]);
  });

  it("filters invalid tool metadata and preserves terminal flags", () => {
    expect(
      completeResult({
        toolMetas: [
          { toolName: "", replaySafe: true },
          {
            toolName: "exec",
            meta: "done",
            replaySafe: true,
            isError: true,
            asyncStarted: true,
            asyncTaskRunId: "run-1",
            asyncTaskId: "task-1",
          },
        ],
      }).toolMetas,
    ).toEqual([
      {
        toolName: "exec",
        meta: "done",
        replaySafe: true,
        isError: true,
        asyncStarted: true,
        asyncTaskRunId: "run-1",
        asyncTaskId: "task-1",
      },
    ]);
  });

  it("projects pending media and voice fields", () => {
    expect(completeResult().toolMediaUrls).toBeUndefined();
    expect(completeResult({ pendingToolMediaReply: { mediaUrls: [" "] } }).toolMediaUrls).toEqual([
      " ",
    ]);
    expect(
      completeResult({ pendingToolMediaReply: { mediaUrls: ["file:///tmp/result.png"] } })
        .toolMediaUrls,
    ).toEqual(["file:///tmp/result.png"]);
    expect(completeResult({ pendingToolMediaReply: { audioAsVoice: true } }).toolAudioAsVoice).toBe(
      true,
    );
  });

  it("projects the latest MCP App channel view without result data", () => {
    expect(
      completeResult({
        latestMcpAppChannelView: { viewId: "view-latest" },
      }).latestMcpAppChannelView,
    ).toEqual({ viewId: "view-latest" });
  });

  it("reports effective controls, fallback attribution, and usage to llm_output", () => {
    const runLlmOutput = vi.fn(async () => undefined);
    completeResult({
      hookRunner: {
        hasHooks: (hookName) => hookName === "llm_output",
        runLlmOutput,
      },
      assistantTexts: ["done"],
      attemptUsage: {
        input: 20,
        output: 4,
        cacheRead: 10,
        reasoningTokens: 2,
        total: 34,
      },
      attempt: {
        requestedProvider: "anthropic",
        requestedModel: "claude-sonnet-4-6",
        fallbackActive: true,
        fallbackReason: "rate_limit",
        thinkLevel: "low",
        fastMode: () => true,
      },
    });

    expect(runLlmOutput).toHaveBeenCalledTimes(1);
    expect(runLlmOutput.mock.calls[0]?.[0]).toMatchObject({
      runId: "run-1",
      requestedProvider: "anthropic",
      requestedModel: "claude-sonnet-4-6",
      effectiveProvider: "test",
      effectiveModel: "model",
      fallbackUsed: true,
      fallbackReason: "rate_limit",
      reasoningEffort: "low",
      fastMode: true,
      usage: {
        input: 20,
        output: 4,
        cacheRead: 10,
        reasoningTokens: 2,
        total: 34,
      },
    });
  });

  it("omits plugin-defined fallback reasons from the closed telemetry contract", () => {
    const runLlmOutput = vi.fn(async () => undefined);
    completeResult({
      hookRunner: {
        hasHooks: (hookName) => hookName === "llm_output",
        runLlmOutput,
      },
      attempt: {
        fallbackActive: true,
        fallbackReason: "plugin_specific_failover",
      },
    });

    expect(runLlmOutput).toHaveBeenCalledTimes(1);
    expect(runLlmOutput.mock.calls[0]?.[0]).toMatchObject({
      fallbackUsed: true,
    });
    expect(runLlmOutput.mock.calls[0]?.[0]).not.toHaveProperty("fallbackReason");
  });
});
