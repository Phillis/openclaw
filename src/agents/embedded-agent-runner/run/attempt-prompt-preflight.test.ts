import { captureOpenAIResponsesCompaction } from "@openclaw/ai/transports";
import type { Model } from "@openclaw/llm-core";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { testing } from "../../openai-transport-stream.test-support.js";
import type { AgentMessage } from "../../runtime/index.js";
import { SessionManager } from "../../sessions/index.js";
import { makeAgentAssistantMessage } from "../../test-helpers/agent-message-fixtures.js";
import { createToolResultPromptProjectionState } from "../session-prompt-state.js";

const logMocks = vi.hoisted(() => ({
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  isEnabled: vi.fn(() => false),
}));

vi.mock("../logger.js", () => ({
  log: {
    debug: logMocks.debug,
    info: logMocks.info,
    warn: logMocks.warn,
    isEnabled: logMocks.isEnabled,
  },
}));
import {
  handleEmbeddedAttemptMidTurnPrecheck,
  prepareEmbeddedAttemptPromptPreflight,
} from "./attempt-prompt-preflight.js";
import {
  PREEMPTIVE_OVERFLOW_ERROR_TEXT,
  estimateLlmBoundaryTokenPressure,
} from "./preemptive-compaction.js";

const attempt = {
  provider: "test-provider",
  modelId: "test-model",
  sessionFile: "/tmp/openclaw-attempt-preflight-test.jsonl",
  sessionId: "session-1",
  sessionKey: "agent:test:main",
  model: {
    id: "gpt-5.6-luna",
    name: "GPT-5.6 Luna",
    provider: "openai",
    api: "openai-responses",
    baseUrl: "https://api.openai.com/v1",
    reasoning: true,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 100_000,
    maxTokens: 8_192,
  } satisfies Model,
};

const request = {
  route: "compact_only" as const,
  estimatedPromptTokens: 150,
  promptBudgetBeforeReserve: 100,
  overflowTokens: 50,
  toolResultReducibleChars: 0,
  effectiveReserveTokens: 20,
};

function makeToolResultMessage(text: string): AgentMessage {
  return {
    role: "toolResult",
    toolCallId: "call-1",
    toolName: "read",
    content: [{ type: "text", text }],
    isError: false,
    timestamp: 1,
  } as AgentMessage;
}

function createSessionManagerWithMessage(message: AgentMessage): SessionManager {
  const sessionManager = SessionManager.inMemory();
  sessionManager.appendMessage(message as Parameters<typeof sessionManager.appendMessage>[0]);
  return sessionManager;
}

describe("attempt prompt preflight", () => {
  beforeEach(() => {
    for (const mock of Object.values(logMocks)) {
      mock.mockReset();
    }
    logMocks.isEnabled.mockReturnValue(false);
  });

  it("keeps the precheck active and records pressure when the engine estimate exceeds the attempt budget", async () => {
    const state: Parameters<typeof prepareEmbeddedAttemptPromptPreflight>[0]["state"] = {
      contextBudgetStatus: undefined,
      preflightRecovery: undefined,
      promptError: null,
      promptErrorSource: null,
      skipPromptSubmission: false,
    };
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      // Production case (2026-09-06): a supervision lane assembled at 421,429
      // tokens against a 524,288 budget. Under the raw budget, but over the
      // overhead-adjusted effective budget (floor(524288 * 0.8) = 419430), so
      // the precheck must not be skipped.
      contextEngineEstimatedTokens: 421_429,
      contextTokenBudget: 524_288,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "hello",
      reserveTokens: 100,
      sessionMessageCount: 0,
      state,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    // The gate keeps the precheck active: the budget check runs and records its
    // status instead of the plain skip (which would return the state unchanged).
    expect(result.contextBudgetStatus).toBeDefined();
    expect(result.skipPromptSubmission).toBe(false);
    expect(result.promptError).toBeNull();
    expect(logMocks.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        "engine estimate 421429 exceeds effective attempt budget 419430 (raw 524288, overhead ratio 0.8); keeping host precheck active",
      ),
    );
  });

  it("takes the preemptive overflow path instead of shipping when the engine estimate overflows a replay window", async () => {
    const owner = makeAgentAssistantMessage({
      content: [{ type: "text", text: "covered" }],
      model: attempt.model.id,
    });
    const item = { type: "compaction" as const, id: "cmp_gate", encrypted_content: "opaque" };
    captureOpenAIResponsesCompaction(
      owner,
      item,
      "retained-users",
      attempt.model,
      testing.buildOpenAIResponsesReasoningReplayMetadata(attempt.model, attempt),
      [
        {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text: "retained content ".repeat(130_000) }],
        },
        item,
      ],
    );
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      contextEngineEstimatedTokens: 421_429,
      contextTokenBudget: 524_288,
      hookMessagesForCurrentPrompt: [owner],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "follow-up",
      reserveTokens: 100,
      sessionMessageCount: 1,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
      state: {
        contextBudgetStatus: undefined,
        preflightRecovery: undefined,
        promptError: null,
        promptErrorSource: null,
        skipPromptSubmission: false,
      },
    });

    expect(result.skipPromptSubmission).toBe(true);
    expect(result.promptErrorSource).toBe("precheck");
    expect(result.promptError?.message).toBe(PREEMPTIVE_OVERFLOW_ERROR_TEXT);
    expect(logMocks.warn).toHaveBeenCalledWith(
      expect.stringContaining("keeping host precheck active"),
    );
  });
  it.each([
    "oversized",
    "unwindowed",
    "unwindowed-tools",
    "missing-window",
    "discarded",
    "discarded-invalid",
    "fitting-with-raw-overflow",
    "fitting-with-discarded-invalid",
  ] as const)(
    "handles a %s checkpoint when a context engine owns ordinary compaction",
    async (variant) => {
      const discarded = variant === "discarded" || variant === "discarded-invalid";
      const fitting = variant.startsWith("fitting-");
      const unwindowed = variant === "unwindowed" || variant === "unwindowed-tools";
      const owner = makeAgentAssistantMessage({
        content: [{ type: "text", text: "covered" }],
        model: attempt.model.id,
      });
      const item = { type: "compaction" as const, id: "cmp_test", encrypted_content: "opaque" };
      captureOpenAIResponsesCompaction(
        owner,
        item,
        "retained-users",
        attempt.model,
        testing.buildOpenAIResponsesReasoningReplayMetadata(attempt.model, attempt),
        variant !== "missing-window" && variant !== "discarded-invalid"
          ? [
              {
                type: "message",
                role: "user",
                content: [
                  {
                    type: "input_text",
                    text: fitting ? "small retained window" : "retained content ".repeat(8_000),
                  },
                ],
              },
              item,
            ]
          : undefined,
      );
      const discardedInvalid = makeAgentAssistantMessage({
        content: [],
        model: attempt.model.id,
      });
      captureOpenAIResponsesCompaction(
        discardedInvalid,
        { ...item, id: "cmp_discarded", encrypted_content: "discarded opaque" },
        "retained-users",
        attempt.model,
        testing.buildOpenAIResponsesReasoningReplayMetadata(attempt.model, attempt),
      );
      const result = await prepareEmbeddedAttemptPromptPreflight({
        attempt,
        compactionReplayEnabled: true,
        activeContextEngine: { info: { id: "owner", name: "Owner", ownsCompaction: true } },
        contextEngineAssemblySucceeded: true,
        contextEnginePromptAuthority:
          unwindowed || discarded || fitting ? "preassembly_may_overflow" : "assembled",
        ...(unwindowed || discarded || fitting
          ? {
              unwindowedContextEngineMessagesForPrecheck: discarded
                ? [owner]
                : [
                    ...(variant === "fitting-with-discarded-invalid"
                      ? [owner, discardedInvalid]
                      : []),
                    ...(variant === "unwindowed-tools"
                      ? [
                          makeAgentAssistantMessage({
                            content: [
                              { type: "toolCall", id: "call-1", name: "read", arguments: {} },
                            ],
                          }),
                          makeToolResultMessage("raw tool history ".repeat(40_000)),
                        ]
                      : [
                          {
                            role: "user" as const,
                            content: "raw history ".repeat(40_000),
                            timestamp: 1,
                          },
                        ]),
                  ],
            }
          : {}),
        contextTokenBudget: 1_000,
        hookMessagesForCurrentPrompt: discarded ? [] : [owner],
        includeBoundaryTimestamp: false,
        promptForPrecheck: "follow-up",
        reserveTokens: 100,
        sessionMessageCount: 1,
        systemPrompt: "",
        toolResultMaxChars: 1_000,
        state: {
          contextBudgetStatus: undefined,
          preflightRecovery: undefined,
          promptError: null,
          promptErrorSource: null,
          skipPromptSubmission: false,
        },
      });
      if (discarded || fitting) {
        expect(result.skipPromptSubmission).toBe(false);
        expect(result.promptError).toBeNull();
        expect(result.preflightRecovery).toBeUndefined();
        if (fitting) {
          expect(result.contextBudgetStatus?.estimatedPromptTokens).toBeGreaterThan(20_000);
        }
        return;
      }
      expect(result.skipPromptSubmission).toBe(true);
      expect(result.promptErrorSource).toBe("precheck");
      if (variant !== "missing-window") {
        expect(result.preflightRecovery?.route).toBe("compact_only");
        expect(result.contextBudgetStatus?.estimatedPromptTokens).toBeGreaterThan(20_000);
        if (unwindowed) {
          expect(result.preflightRecovery?.estimatedPromptTokens).toBe(
            estimateLlmBoundaryTokenPressure({
              messages: [owner],
              prompt: "follow-up",
              replay: { model: attempt.model, sessionId: attempt.sessionId, enabled: true },
            }),
          );
          if (variant === "unwindowed-tools") {
            expect(result.contextBudgetStatus?.toolResultReducibleChars).toBeGreaterThan(0);
            expect(result.contextBudgetStatus?.route).not.toBe("compact_only");
          }
        }
      } else {
        expect(result.preflightRecovery).toBeUndefined();
        expect(String(result.promptError)).toContain("Run /compact");
      }
    },
  );

  it("routes a mid-turn compaction request with its measured budget", () => {
    const outcome = handleEmbeddedAttemptMidTurnPrecheck({
      toolResultPromptProjectionState: createToolResultPromptProjectionState(),
      attempt,
      request,
      sessionAgentId: "test",
      sessionManager: SessionManager.inMemory(),
      prePromptMessageCount: 4,
      replaceSessionMessages: vi.fn(),
    });

    expect(outcome).toEqual({
      preflightRecovery: {
        route: "compact_only",
        source: "mid-turn",
        estimatedPromptTokens: 150,
        promptBudgetBeforeReserve: 100,
        overflowTokens: 50,
      },
      promptError: expect.objectContaining({ message: PREEMPTIVE_OVERFLOW_ERROR_TEXT }),
    });
  });

  it("admits a retry without changing history when persisted truncation cannot help", () => {
    const toolResult = makeToolResultMessage("already capped tool output");
    const sessionManager = createSessionManagerWithMessage(toolResult);
    const messagesBefore = sessionManager.buildSessionContext().messages;
    const replaceSessionMessages = vi.fn();
    const outcome = handleEmbeddedAttemptMidTurnPrecheck({
      toolResultPromptProjectionState: createToolResultPromptProjectionState(),
      attempt,
      request: { ...request, route: "truncate_tool_results_only" },
      sessionAgentId: "test",
      sessionManager,
      prePromptMessageCount: 4,
      replaceSessionMessages,
    });

    expect(outcome.preflightRecovery).toEqual(
      expect.objectContaining({
        route: "truncate_tool_results_only",
        source: "mid-turn",
        handled: true,
        truncatedCount: 0,
      }),
    );
    expect(outcome.promptError).toBeUndefined();
    expect(replaceSessionMessages).not.toHaveBeenCalled();
    expect(sessionManager.buildSessionContext().messages).toEqual(messagesBefore);
  });

  it("keeps the compaction fallback when persisted truncation cannot inspect history", () => {
    const outcome = handleEmbeddedAttemptMidTurnPrecheck({
      toolResultPromptProjectionState: createToolResultPromptProjectionState(),
      attempt,
      request: { ...request, route: "truncate_tool_results_only" },
      sessionAgentId: "test",
      sessionManager: SessionManager.inMemory(),
      prePromptMessageCount: 4,
      replaceSessionMessages: vi.fn(),
    });

    expect(outcome.preflightRecovery.route).toBe("compact_only");
    expect(outcome.promptError?.message).toBe(PREEMPTIVE_OVERFLOW_ERROR_TEXT);
  });

  it("handles successful mid-turn tool-result truncation without a prompt error", () => {
    const sessionManager = createSessionManagerWithMessage(
      makeToolResultMessage("large tool output ".repeat(5_000)),
    );
    const replaceSessionMessages = vi.fn();
    const outcome = handleEmbeddedAttemptMidTurnPrecheck({
      toolResultPromptProjectionState: createToolResultPromptProjectionState(),
      attempt: { ...attempt, contextTokenBudget: 100 },
      request: { ...request, route: "truncate_tool_results_only" },
      sessionAgentId: "test",
      sessionManager,
      prePromptMessageCount: 4,
      replaceSessionMessages,
    });

    expect(outcome.promptError).toBeUndefined();
    expect(outcome.preflightRecovery).toEqual(
      expect.objectContaining({
        route: "truncate_tool_results_only",
        source: "mid-turn",
        handled: true,
        truncatedCount: 1,
      }),
    );
    expect(replaceSessionMessages).toHaveBeenCalledWith(
      sessionManager.buildSessionContext().messages,
    );
  });

  it("records heuristic pressure without short-circuiting the provider attempt", async () => {
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      contextEngineAssemblySucceeded: false,
      contextEnginePromptAuthority: "assembled",
      contextTokenBudget: 100,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "x".repeat(4_000),
      reserveTokens: 20,
      sessionMessageCount: 0,
      state: {
        contextBudgetStatus: undefined,
        preflightRecovery: undefined,
        promptError: null,
        promptErrorSource: null,
        skipPromptSubmission: false,
      },
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    expect(result.skipPromptSubmission).toBe(false);
    expect(result.promptError).toBeNull();
    expect(result.promptErrorSource).toBeNull();
    expect(result.preflightRecovery).toBeUndefined();
    expect(result.contextBudgetStatus?.shouldCompact).toBe(true);
    expect(result.contextBudgetStatus?.overflowTokens).toBeGreaterThan(0);
  });

  it("defers overflow admission to a context engine that owns compaction", async () => {
    const state: Parameters<typeof prepareEmbeddedAttemptPromptPreflight>[0]["state"] = {
      contextBudgetStatus: undefined,
      preflightRecovery: undefined,
      promptError: null,
      promptErrorSource: null,
      skipPromptSubmission: false,
    };
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      contextTokenBudget: 100,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "x".repeat(4_000),
      reserveTokens: 20,
      sessionMessageCount: 0,
      state,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    expect(result).toEqual(state);
  });

  it("preserves the compaction-owner skip when the engine estimate fits the budget", async () => {
    const state: Parameters<typeof prepareEmbeddedAttemptPromptPreflight>[0]["state"] = {
      contextBudgetStatus: undefined,
      preflightRecovery: undefined,
      promptError: null,
      promptErrorSource: null,
      skipPromptSubmission: false,
    };
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      contextEngineEstimatedTokens: 1_000,
      contextTokenBudget: 524_288,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "hello",
      reserveTokens: 20,
      sessionMessageCount: 0,
      state,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    expect(result).toEqual(state);
  });

  it("preserves the compaction-owner skip when the engine estimate is just under the effective budget", async () => {
    const state: Parameters<typeof prepareEmbeddedAttemptPromptPreflight>[0]["state"] = {
      contextBudgetStatus: undefined,
      preflightRecovery: undefined,
      promptError: null,
      promptErrorSource: null,
      skipPromptSubmission: false,
    };
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      // Under floor(524288 * 0.8) = 419430, the overhead-adjusted gate keeps
      // deferring overflow admission to the compaction owner.
      contextEngineEstimatedTokens: 419_000,
      contextTokenBudget: 524_288,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "hello",
      reserveTokens: 20,
      sessionMessageCount: 0,
      state,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    expect(result).toEqual(state);
  });

  it("preserves the compaction-owner skip when no engine estimate is available", async () => {
    const state: Parameters<typeof prepareEmbeddedAttemptPromptPreflight>[0]["state"] = {
      contextBudgetStatus: undefined,
      preflightRecovery: undefined,
      promptError: null,
      promptErrorSource: null,
      skipPromptSubmission: false,
    };
    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      activeContextEngine: {
        info: { id: "owner", name: "Owner", ownsCompaction: true },
      },
      contextEngineAssemblySucceeded: true,
      contextEnginePromptAuthority: "assembled",
      contextTokenBudget: 524_288,
      hookMessagesForCurrentPrompt: [],
      includeBoundaryTimestamp: false,
      promptForPrecheck: "hello",
      reserveTokens: 20,
      sessionMessageCount: 0,
      state,
      systemPrompt: "",
      toolResultMaxChars: 1_000,
    });

    expect(result).toEqual(state);
  });

  it("does not persist heuristic pre-prompt tool-result truncation", async () => {
    const toolResult = makeToolResultMessage("alpha beta gamma delta epsilon ".repeat(2_200));
    const messages = [toolResult];
    const reserveTokens = 2_000;
    const estimatedPromptTokens = estimateLlmBoundaryTokenPressure({
      messages,
      systemPrompt: "sys",
      prompt: "hello",
    });
    const contextTokenBudget = estimatedPromptTokens - 200 + reserveTokens;
    const sessionManager = createSessionManagerWithMessage(toolResult);

    const result = await prepareEmbeddedAttemptPromptPreflight({
      attempt,
      compactionReplayEnabled: true,
      contextEngineAssemblySucceeded: false,
      contextEnginePromptAuthority: "assembled",
      contextTokenBudget,
      hookMessagesForCurrentPrompt: messages,
      includeBoundaryTimestamp: true,
      promptForPrecheck: "hello",
      reserveTokens,
      sessionMessageCount: messages.length,
      state: {
        contextBudgetStatus: undefined,
        preflightRecovery: undefined,
        promptError: null,
        promptErrorSource: null,
        skipPromptSubmission: false,
      },
      systemPrompt: "sys",
      toolResultMaxChars: 1_000,
    });

    expect(result.skipPromptSubmission).toBe(false);
    expect(result.promptError).toBeNull();
    expect(result.promptErrorSource).toBeNull();
    expect(result.preflightRecovery).toBeUndefined();
    expect(sessionManager.buildSessionContext().messages).toEqual([toolResult]);
  });
});
