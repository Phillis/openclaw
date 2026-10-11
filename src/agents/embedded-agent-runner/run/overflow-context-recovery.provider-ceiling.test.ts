import { describe, expect, it, vi } from "vitest";
import { OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST } from "../../../context-engine/host-compat.js";
import { buildContextEngineRuntimeSettings } from "../../../context-engine/runtime-settings.js";
import type { ContextEngine } from "../../../context-engine/types.js";
import { getAgentRunLifecycleGeneration } from "../../../infra/agent-run-registry.js";
import { prepareSystemAgentRunAdmission } from "../../admitted-run-context.js";
import { SessionManager } from "../../sessions/session-manager.js";
import { makeAttemptResult } from "../run.overflow-compaction.fixture.js";
import { createUsageAccumulator } from "../usage-accumulator.js";
import { createEmbeddedRunCompactionRuntime } from "./compaction-runtime.js";
import { createEmbeddedRunContextRecoveryState } from "./context-recovery-state.js";
import { recoverEmbeddedRunOverflow } from "./overflow-context-recovery.js";
import { createEmbeddedRunSessionPromptState } from "./session-prompt-state.js";

const compactEmbeddedRunForRecovery = vi.hoisted(() => vi.fn());

vi.mock("./compaction-runtime.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./compaction-runtime.js")>();
  return { ...actual, compactEmbeddedRunForRecovery };
});

// Realistic combined refusal: the prompt is over the model window AND alone exceeds
// the provider's whole TPM bucket, with both figures stated in one clause.
const TPM_CEILING_ERROR =
  "Request too large: prompt is too long for this model — tpm limit 150,000 tokens, requested 1,500,000 tokens";

describe("recoverEmbeddedRunOverflow provider request-size ceiling", () => {
  it("attempts compaction against the parsed ceiling instead of failing terminal", async () => {
    const state = createEmbeddedRunContextRecoveryState();
    const sessionManager = SessionManager.inMemory("/tmp/workspace");
    const sessionId = sessionManager.getSessionId();
    const target = {
      agentId: "main",
      sessionId,
      sessionKey: "agent:main:ceiling-1",
      storePath: "/tmp/unused-in-memory-recovery.sqlite",
    };
    const admission = prepareSystemAgentRunAdmission(
      {},
      "run-ceiling-compaction",
      "main",
      "recovery-ceiling-test",
    );
    try {
      const runParams = {
        admittedRunContext: await admission.admit("embedded"),
        runId: "run-ceiling-compaction",
        sessionId,
        sessionKey: target.sessionKey,
        sessionFile: target.sessionKey,
        sessionTarget: target,
        sessionManager,
        config: {},
        workspaceDir: "/tmp/workspace",
        prompt: "continue",
        timeoutMs: 1_000,
      };
      await using sessionPromptState = await createEmbeddedRunSessionPromptState({
        runParams,
        sessionAgentId: "main",
        resolvedSessionKey: target.sessionKey,
        lifecycleGeneration: getAgentRunLifecycleGeneration(),
        onInterrupt: () => {},
      });
      const contextEngine: ContextEngine = {
        info: { id: "fixture", name: "Fixture engine" },
        ingest: async () => ({ ingested: true }),
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 0 }),
        compact: async () => ({ ok: true, compacted: false, reason: "fixture-not-needed" }),
      };
      const runtime = createEmbeddedRunCompactionRuntime({
        runParams,
        contextEngine,
        hookRunner: null,
        hookContext: {
          agentId: "main",
          sessionId,
          sessionKey: target.sessionKey,
          workspaceDir: runParams.workspaceDir,
        },
        sessionPromptState,
      });
      compactEmbeddedRunForRecovery.mockResolvedValue({
        result: {
          ok: true,
          compacted: true,
          result: { summary: "done", tokensBefore: 1_500_000, tokensAfter: 90_000 },
        },
        runtimeContext: {},
        runtimeSettings: {},
        previousSessionId: undefined,
      });
      const outcome = await recoverEmbeddedRunOverflow({
        ...runtime,
        runParams,
        state,
        usageAccumulator: createUsageAccumulator(),
        contextEngine,
        contextTokenBudget: 200_000,
        genericCompactionRecoveryAllowed: true,
        aborted: false,
        signalOwnedInterruption: false,
        promptError: new Error(TPM_CEILING_ERROR),
        attempt: makeAttemptResult({
          promptError: new Error(TPM_CEILING_ERROR),
          promptErrorSource: "prompt",
          replayMetadata: { replaySafe: true, hadPotentialSideEffects: false },
        }),
        attemptCompactionCount: 0,
        runtimeAuthPlan: undefined,
        resolvedSessionKey: target.sessionKey,
        sessionAgentId: "main",
        agentDir: "/tmp/agent",
        workspaceDir: "/tmp/workspace",
        modelSelection: {
          provider: "fixture-provider",
          model: "fixture-model",
          authProfileIdSource: "auto",
        },
        harnessRuntime: "openclaw",
        thinkLevel: "off",
        resolveContextEnginePluginId: () => undefined,
        getActiveSession: () => ({
          id: sessionPromptState.sessionId,
          file: sessionPromptState.sessionFile,
          target: sessionPromptState.sessionTarget,
        }),
        prepareCompactedTranscriptRetry: async () => {},
        armPostCompactionGuard: vi.fn(),
        buildRuntimeSettings: ({ tokenBudget, degradedReason }) =>
          buildContextEngineRuntimeSettings({
            contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
            promptTokenBudget: tokenBudget,
            degradedReason,
          }),
        prepareCurrentTranscriptRetry: vi.fn(),
        markOwnedTranscriptRetry: vi.fn(),
      });
      expect(compactEmbeddedRunForRecovery).toHaveBeenCalledTimes(1);
      const recovery = compactEmbeddedRunForRecovery.mock.calls[0]![1] as {
        tokenBudget: number;
        trigger: string;
      };
      // The compaction budget is capped at the provider's stated TPM ceiling.
      expect(recovery.tokenBudget).toBe(150_000);
      expect(recovery.trigger).toBe("overflow");
      expect(outcome).toEqual({ action: "retry" });
      expect(state.overflowCompactionAttempts).toBe(1);
    } finally {
      admission.close();
    }
  });

  it("still surfaces terminal when in-attempt compaction already ran under a ceiling refusal", async () => {
    const state = createEmbeddedRunContextRecoveryState();
    const sessionManager = SessionManager.inMemory("/tmp/workspace");
    const sessionId = sessionManager.getSessionId();
    const target = {
      agentId: "main",
      sessionId,
      sessionKey: "agent:main:ceiling-2",
      storePath: "/tmp/unused-in-memory-recovery.sqlite",
    };
    const admission = prepareSystemAgentRunAdmission(
      {},
      "run-ceiling-unparseable",
      "main",
      "recovery-ceiling-test",
    );
    try {
      const runParams = {
        admittedRunContext: await admission.admit("embedded"),
        runId: "run-ceiling-unparseable",
        sessionId,
        sessionKey: target.sessionKey,
        sessionFile: target.sessionKey,
        sessionTarget: target,
        sessionManager,
        config: {},
        workspaceDir: "/tmp/workspace",
        prompt: "continue",
        timeoutMs: 1_000,
      };
      await using sessionPromptState = await createEmbeddedRunSessionPromptState({
        runParams,
        sessionAgentId: "main",
        resolvedSessionKey: target.sessionKey,
        lifecycleGeneration: getAgentRunLifecycleGeneration(),
        onInterrupt: () => {},
      });
      const contextEngine: ContextEngine = {
        info: { id: "fixture", name: "Fixture engine" },
        ingest: async () => ({ ingested: true }),
        assemble: async ({ messages }) => ({ messages, estimatedTokens: 0 }),
        compact: async () => ({ ok: true, compacted: false, reason: "fixture-not-needed" }),
      };
      const runtime = createEmbeddedRunCompactionRuntime({
        runParams,
        contextEngine,
        hookRunner: null,
        hookContext: {
          agentId: "main",
          sessionId,
          sessionKey: target.sessionKey,
          workspaceDir: runParams.workspaceDir,
        },
        sessionPromptState,
      });
      compactEmbeddedRunForRecovery.mockClear();
      const outcome = await recoverEmbeddedRunOverflow({
        ...runtime,
        runParams,
        state,
        usageAccumulator: createUsageAccumulator(),
        contextEngine,
        contextTokenBudget: 200_000,
        genericCompactionRecoveryAllowed: true,
        aborted: false,
        signalOwnedInterruption: false,
        promptError: new Error(TPM_CEILING_ERROR),
        attempt: makeAttemptResult({
          promptError: new Error(TPM_CEILING_ERROR),
          promptErrorSource: "prompt",
          replayMetadata: { replaySafe: true, hadPotentialSideEffects: false },
        }),
        // In-attempt compaction already ran and the refusal persisted; a blind
        // retry would re-send the same rejected payload, so recovery must surface.
        attemptCompactionCount: 1,
        runtimeAuthPlan: undefined,
        resolvedSessionKey: target.sessionKey,
        sessionAgentId: "main",
        agentDir: "/tmp/agent",
        workspaceDir: "/tmp/workspace",
        modelSelection: {
          provider: "fixture-provider",
          model: "fixture-model",
          authProfileIdSource: "auto",
        },
        harnessRuntime: "openclaw",
        thinkLevel: "off",
        resolveContextEnginePluginId: () => undefined,
        getActiveSession: () => ({
          id: sessionPromptState.sessionId,
          file: sessionPromptState.sessionFile,
          target: sessionPromptState.sessionTarget,
        }),
        prepareCompactedTranscriptRetry: async () => {},
        armPostCompactionGuard: vi.fn(),
        buildRuntimeSettings: ({ tokenBudget, degradedReason }) =>
          buildContextEngineRuntimeSettings({
            contextEngineHost: OPENCLAW_EMBEDDED_CONTEXT_ENGINE_HOST,
            promptTokenBudget: tokenBudget,
            degradedReason,
          }),
        prepareCurrentTranscriptRetry: vi.fn(),
        markOwnedTranscriptRetry: vi.fn(),
      });
      expect(outcome).toMatchObject({ action: "surface", kind: "context_overflow" });
      expect(compactEmbeddedRunForRecovery).not.toHaveBeenCalled();
    } finally {
      admission.close();
    }
  });
});
