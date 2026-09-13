import {
  markReplyPayloadForSourceSuppressionDelivery,
  setReplyPayloadMetadata,
  getReplyPayloadMetadata,
  type ReplyPayloadMetadata,
} from "../../../auto-reply/reply-payload.js";
import {
  SessionTranscriptWriterClaimReboundError,
  type SessionTranscriptWriterFence,
} from "../../../config/sessions/transcript-write-context.js";
import { formatErrorMessage } from "../../../infra/errors.js";
import { isTerminalAssistantError } from "../../../llm/utils/retry.js";
import { appendAssistantMirrorMessageByIdentity } from "../../../plugin-sdk/session-transcript-runtime.js";
import { resolveSettledTurnFinalizationText } from "../../harness/settled-turn-finalization-result.js";
import type {
  AgentHarness,
  AgentHarnessSettledTurnFinalizationResult,
} from "../../harness/types.js";
import { resolveAgentTimeoutMs } from "../../timeout.js";
import { log } from "../logger.js";
import type { EmbeddedAgentRunResult } from "../types.js";
import {
  mergeAttemptRunStatsIntoAccumulator,
  mergeUsageIntoAccumulator,
} from "../usage-accumulator.js";
import { copyAttemptDeliveryState } from "./attempt-delivery-state.js";
import type { EmbeddedRunAttemptWithReceiptEvidence } from "./attempt-result.js";
import { resolveCurrentAttemptAssistant } from "./attempt-terminal-evidence.js";
import {
  resolveRuntimeModelAttempt,
  runEmbeddedSettledTurnFinalizationWithBackend,
} from "./backend.js";
import {
  resolveReasoningOnlyRetryInstruction,
  resolveSettledToolBatchEvidence,
  resolveSettledToolTerminalContinuationInstruction,
  shouldTreatEmptyAssistantReplyAsSilent,
} from "./incomplete-turn-recovery.js";
import { resolveSilentToolResultReplyPayload } from "./incomplete-turn-resolution.js";
import type { RunEmbeddedAgentInternalParams } from "./internal-params.js";
import type { createEmbeddedRunLaneController } from "./lane-controller.js";
import { RUN_SETTLED_FINALIZER_EXTENSION_MS } from "./retry-budget.js";
import {
  isEmbeddedRunTerminalAbort,
  isEmbeddedRunTerminalTimeout,
  resolveEmbeddedRunAttemptTerminalOutcome,
  type EmbeddedRunTerminalState,
} from "./terminal-outcome.js";
import { prepareEmbeddedRunTerminal } from "./terminal-preparation.js";
import { requiresVisibleTerminalReply } from "./terminal-resolution.js";
import type { EmbeddedRunAttemptParams, EmbeddedRunAttemptResult } from "./types.js";

type TerminalPreparationInput = Parameters<typeof prepareEmbeddedRunTerminal>[0];
type CreateAttemptControls = ReturnType<
  typeof createEmbeddedRunLaneController
>["createAttemptControls"];
const MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS = 2;
const SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT =
  "The tool run finished, but no final summary was produced. I did not repeat any completed actions.";
type TerminalPreparationBase = Omit<
  TerminalPreparationInput,
  | "attempt"
  | "currentAttemptCompletedAssistant"
  | "sessionIdUsed"
  | "sessionFileUsed"
  | "lastRunPromptUsage"
  | "terminalState"
>;

export function resolveSettledTurnFinalizationRequest(input: {
  runParams: RunEmbeddedAgentInternalParams;
  attempt: EmbeddedRunAttemptResult;
  activeErrorContext: { provider: string; model: string };
  modelApi: Parameters<typeof resolveReasoningOnlyRetryInstruction>[0]["modelApi"];
  executionContract: Parameters<
    typeof resolveReasoningOnlyRetryInstruction
  >[0]["executionContract"];
  payloadsWithToolMedia: EmbeddedAgentRunResult["payloads"];
  recoveredFinalAssistantPayloadsAfterPromptTimeout?: EmbeddedAgentRunResult["payloads"];
  hasTerminalToolPresentation: boolean;
  toolLoopBudgetStopped?: boolean;
  terminalState: EmbeddedRunTerminalState;
  settledTurnFinalizationAvailable: boolean;
}): string | null {
  const terminalAssistant = resolveCurrentAttemptAssistant(input.attempt);
  if (!input.settledTurnFinalizationAvailable || isTerminalAssistantError(terminalAssistant)) {
    return null;
  }
  const terminalAborted = isEmbeddedRunTerminalAbort(input.terminalState.outcome);
  const terminalTimedOut = isEmbeddedRunTerminalTimeout(input.terminalState.outcome);
  // Generated errors are fallback surfaces, not authored answers. Trust their
  // producer provenance; the recovery owner still requires exact settlement,
  // transient-failure context, and no delivery or asynchronous work.
  const hasOnlySyntheticErrorPayload = Boolean(
    input.attempt.assistantTexts.every((text) => text.trim().length === 0) &&
    (input.payloadsWithToolMedia?.length ?? 0) > 0 &&
    input.payloadsWithToolMedia?.every((payload) => {
      const metadata = getReplyPayloadMetadata(payload);
      return (
        payload.isError === true &&
        Object.keys(payload).every((key) => key === "text" || key === "isError") &&
        (metadata?.toolErrorWarning ||
          (input.attempt.terminal.kind === "failed" &&
            input.attempt.settledTurnFinalizationContext &&
            metadata?.terminalProviderError))
      );
    }),
  );
  const preparedPayloadCount = hasOnlySyntheticErrorPayload
    ? 0
    : (input.payloadsWithToolMedia?.length ?? 0);
  const silentToolResultReplyPayload = resolveSilentToolResultReplyPayload({
    isCronTrigger: input.runParams.trigger === "cron",
    payloadCount: preparedPayloadCount,
    aborted: terminalAborted,
    timedOut: terminalTimedOut,
    attempt: input.attempt,
  });
  const payloadCount = input.recoveredFinalAssistantPayloadsAfterPromptTimeout
    ? input.recoveredFinalAssistantPayloadsAfterPromptTimeout.length
    : preparedPayloadCount || (silentToolResultReplyPayload ? 1 : 0);
  const emptyAssistantReplyIsSilent = shouldTreatEmptyAssistantReplyAsSilent({
    allowEmptyAssistantReplyAsSilent: input.runParams.allowEmptyAssistantReplyAsSilent,
    terminalReplyExpectation: input.runParams.terminalReplyExpectation,
    onlyExplicitSilentReply: false,
    payloadCount,
    aborted: terminalAborted,
    timedOut: terminalTimedOut,
    attempt: input.attempt,
  });
  if (emptyAssistantReplyIsSilent) {
    return null;
  }
  return resolveSettledToolTerminalContinuationInstruction({
    provider: input.activeErrorContext.provider,
    modelId: input.activeErrorContext.model,
    modelApi: input.modelApi,
    executionContract: input.executionContract,
    allowEmptyStopContinuation: requiresVisibleTerminalReply(input.runParams),
    payloadCount,
    hasTerminalToolPresentation: input.hasTerminalToolPresentation,
    toolLoopBudgetStopped: input.toolLoopBudgetStopped === true,
    aborted: terminalAborted,
    timedOut: terminalTimedOut,
    attempt: input.attempt,
  });
}

export async function prepareTerminalWithSettledTurnFinalization(input: {
  initial: {
    attempt: EmbeddedRunAttemptWithReceiptEvidence;
    attemptAssistant: EmbeddedRunAttemptWithReceiptEvidence["lastAssistant"];
    currentAttemptCompletedAssistant: EmbeddedRunAttemptWithReceiptEvidence["currentAttemptCompletedAssistant"];
    sessionIdUsed: string;
    sessionFileUsed?: string;
    terminalState: EmbeddedRunTerminalState;
    attemptCompactionCount: number;
  };
  terminalBase: TerminalPreparationBase;
  lastRunPromptUsage: TerminalPreparationInput["lastRunPromptUsage"];
  finalization: {
    preparedAttempt: EmbeddedRunAttemptParams;
    sessionTarget?: EmbeddedRunAttemptParams["sessionTarget"];
    sessionWriterFence?: SessionTranscriptWriterFence;
    harness: AgentHarness;
    modelApi: Parameters<typeof resolveSettledTurnFinalizationRequest>[0]["modelApi"];
    executionContract: Parameters<
      typeof resolveSettledTurnFinalizationRequest
    >[0]["executionContract"];
    hasTerminalToolPresentation: boolean;
    /**
     * A bounded-run budget cap (tool-loop turn budget or run wall-clock soft
     * stop) withheld the post-tool continuation round, so narration payloads
     * are not a final answer and the run still owes a graceful terminal turn.
     */
    toolLoopBudgetStopped?: boolean;
    /**
     * Run wall-clock deadline for bounded background runs; when set, the
     * tool-free summary turn's timer is clamped to the remaining wall clock
     * with a protected extension floor past the deadline, so a turn that
     * straddled the deadline still settles a summary. The hard deadline
     * stays armed as the backstop.
     */
    runDeadlineAtMs?: number;
    createAttemptControls: CreateAttemptControls;
    abortSignal: AbortSignal;
  };
}) {
  const initial = input.initial;
  let attempt = initial.attempt;
  let lastRunPromptUsage = input.lastRunPromptUsage;
  let prepared = prepareEmbeddedRunTerminal({
    ...input.terminalBase,
    attempt,
    currentAttemptCompletedAssistant: initial.currentAttemptCompletedAssistant,
    sessionIdUsed: initial.sessionIdUsed,
    sessionFileUsed: initial.sessionFileUsed,
    lastRunPromptUsage,
    terminalState: initial.terminalState,
  });
  const prompt = resolveSettledTurnFinalizationRequest({
    runParams: input.terminalBase.runParams,
    attempt,
    activeErrorContext: input.terminalBase.activeErrorContext,
    modelApi: input.finalization.modelApi,
    executionContract: input.finalization.executionContract,
    payloadsWithToolMedia: prepared.payloadsWithToolMedia,
    recoveredFinalAssistantPayloadsAfterPromptTimeout:
      prepared.recoveredFinalAssistantPayloadsAfterPromptTimeout,
    hasTerminalToolPresentation: input.finalization.hasTerminalToolPresentation,
    toolLoopBudgetStopped: input.finalization.toolLoopBudgetStopped === true,
    terminalState: initial.terminalState,
    settledTurnFinalizationAvailable:
      typeof input.finalization.harness.finalizeSettledTurn === "function",
  });
  if (!prompt) {
    return {
      ...initial,
      prepared,
      lastRunPromptUsage,
      finalizationOutcome: "not-attempted" as const,
    };
  }
  const settledFailureSignal = prepared.failureSignal;
  const settledTerminalToolFailure = prepared.terminalToolFailure;
  const committedSessionTarget = resolveCommittedSessionTarget({
    preparedAttempt: input.finalization.preparedAttempt,
    sessionTarget: input.finalization.sessionTarget,
    sessionWriterFence: input.finalization.sessionWriterFence,
  });
  const sessionWriterDeliveryAuthority = resolveSessionWriterDeliveryAuthority({
    attempt: input.finalization.preparedAttempt,
    sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
    sessionTarget: committedSessionTarget,
  });

  const runParams = input.terminalBase.runParams;
  const errorContext = input.terminalBase.activeErrorContext;
  // Silent helper runs may consume a real finalizer answer internally, but a
  // host fallback would turn their semantic failure into synthetic success.
  const terminalFallbackAllowed = input.finalization.preparedAttempt.silentExpected !== true;
  log.warn(
    `settled post-tool turn lacked a final answer: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
      `provider=${errorContext.provider}/${errorContext.model} — running isolated finalization`,
  );
  let finalizationOutcome: "answered" | "empty" | "failed" = "failed";
  try {
    let finalization: Awaited<ReturnType<typeof runPreparedSettledTurnFinalization>>;
    let finalizationAttempt = 0;
    do {
      finalizationAttempt += 1;
      finalization = await runPreparedSettledTurnFinalization({
        attempt: input.finalization.preparedAttempt,
        settledAttempt: initial.attempt,
        harness: input.finalization.harness,
        prompt,
        ...(input.finalization.runDeadlineAtMs !== undefined
          ? { runDeadlineAtMs: input.finalization.runDeadlineAtMs }
          : {}),
        createAttemptControls: input.finalization.createAttemptControls,
        abortSignal: input.finalization.abortSignal,
      });
      attempt = finalization.attempt;
      mergeUsageIntoAccumulator(input.terminalBase.usageAccumulator, attempt.attemptUsage);
      mergeAttemptRunStatsIntoAccumulator(input.terminalBase.usageAccumulator, attempt);
      lastRunPromptUsage = attempt.attemptUsage ?? lastRunPromptUsage;
      if (
        finalization.outcome === "empty" &&
        finalizationAttempt < MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS
      ) {
        log.warn(
          `settled-turn finalization completed without a visible answer: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
            `provider=${errorContext.provider}/${errorContext.model} — retrying ${finalizationAttempt}/${MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS - 1} with tools disabled`,
        );
      }
    } while (
      finalization.outcome === "empty" &&
      finalizationAttempt < MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS
    );
    finalizationOutcome = finalization.outcome;
    if (finalization.outcome === "empty") {
      log.warn(
        `settled-turn finalization completed without a visible answer: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
          `provider=${errorContext.provider}/${errorContext.model} attempts=${finalizationAttempt}/${MAX_EMPTY_SETTLED_FINALIZATION_ATTEMPTS} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving silent helper failure"}`,
      );
    }
  } catch (error) {
    if (input.finalization.abortSignal.aborted) {
      log.warn(
        `settled-turn finalization was cancelled: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
          `provider=${errorContext.provider}/${errorContext.model} error=${formatErrorMessage(error)} — preserving cancellation`,
      );
      return {
        ...initial,
        prepared,
        lastRunPromptUsage,
        finalizationOutcome: "failed" as const,
      };
    }
    log.warn(
      `settled-turn finalization failed: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
        `provider=${errorContext.provider}/${errorContext.model} error=${formatErrorMessage(error)} — ${terminalFallbackAllowed ? "using terminal fallback reply" : "preserving silent helper failure"}`,
    );
  }
  if (finalizationOutcome !== "answered" && terminalFallbackAllowed) {
    if (input.finalization.abortSignal.aborted) {
      log.warn(
        `settled-turn fallback was cancelled before transcript persistence: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
          `provider=${errorContext.provider}/${errorContext.model} — preserving cancellation`,
      );
      return {
        ...initial,
        prepared,
        lastRunPromptUsage,
        finalizationOutcome: "failed" as const,
      };
    }
    const transcriptIdempotencyKey = await persistSettledToolFallbackTranscript({
      attempt: input.finalization.preparedAttempt,
      abortSignal: input.finalization.abortSignal,
      sessionId: committedSessionTarget?.sessionId ?? initial.sessionIdUsed,
      sessionTarget: committedSessionTarget,
    });
    if (input.finalization.abortSignal.aborted) {
      log.warn(
        `settled-turn fallback was cancelled during transcript persistence: runId=${runParams.runId} sessionId=${runParams.sessionId} ` +
          `provider=${errorContext.provider}/${errorContext.model} — preserving cancellation`,
      );
      return {
        ...initial,
        prepared,
        lastRunPromptUsage,
        finalizationOutcome: "failed" as const,
      };
    }
    attempt = buildSettledToolFallbackAttemptResult({
      settledAttempt: initial.attempt,
      sourceAttempt: attempt,
      prompt,
      agentHarnessId: input.finalization.preparedAttempt.agentHarnessId,
      runtimePlan: input.finalization.preparedAttempt.runtimePlan,
      transcriptIdempotencyKey,
    });
  }
  // Isolated finalization owns a fresh terminal, never the original abort signal.
  const terminalState: EmbeddedRunTerminalState = {
    outcome: resolveEmbeddedRunAttemptTerminalOutcome({
      attempt,
      assistant: attempt.currentAttemptAssistant,
    }),
    signalOwnedInterruption: false,
  };
  const finalizedPrepared = prepareEmbeddedRunTerminal({
    ...input.terminalBase,
    attempt,
    currentAttemptCompletedAssistant: attempt.currentAttemptCompletedAssistant,
    sessionIdUsed: attempt.sessionIdUsed,
    sessionFileUsed: attempt.sessionFileUsed,
    lastRunPromptUsage,
    terminalState,
  });
  // The isolated finalizer cannot call a message tool. Its answer is
  // host-owned recovery output and must cross that source-reply suppression.
  finalizedPrepared.payloadsWithToolMedia?.forEach((payload) => {
    markReplyPayloadForSourceSuppressionDelivery(payload);
    if (sessionWriterDeliveryAuthority) {
      setReplyPayloadMetadata(payload, { sessionWriterDeliveryAuthority });
    }
  });
  // A failure-honest final answer cannot turn a settled cron denial into success.
  prepared = {
    ...finalizedPrepared,
    failureSignal: settledFailureSignal,
    terminalToolFailure: settledTerminalToolFailure,
  };
  return {
    attempt,
    attemptAssistant: attempt.currentAttemptAssistant,
    currentAttemptCompletedAssistant: attempt.currentAttemptCompletedAssistant,
    terminalState,
    attemptCompactionCount: 0,
    sessionIdUsed: attempt.sessionIdUsed,
    sessionFileUsed: attempt.sessionFileUsed,
    prepared,
    lastRunPromptUsage,
    finalizationOutcome:
      finalizationOutcome === "empty" ? ("completed-empty" as const) : finalizationOutcome,
  };
}

function resolveSessionWriterDeliveryAuthority(input: {
  attempt: EmbeddedRunAttemptParams;
  sessionId: string;
  sessionTarget?: EmbeddedRunAttemptParams["sessionTarget"];
}): ReplyPayloadMetadata["sessionWriterDeliveryAuthority"] {
  const target = input.sessionTarget ?? input.attempt.sessionTarget;
  const sessionKey = target?.sessionKey ?? input.attempt.sessionKey;
  const expectedLifecycleRevision = target?.expectedLifecycleRevision;
  const expectedWriterRunId = target?.expectedWriterRunId;
  if (
    !sessionKey ||
    (expectedLifecycleRevision === undefined && expectedWriterRunId === undefined)
  ) {
    return undefined;
  }
  return {
    ...(target?.agentId || input.attempt.agentId
      ? { agentId: target?.agentId ?? input.attempt.agentId }
      : {}),
    expectedSessionId: input.sessionId,
    ...(expectedLifecycleRevision !== undefined ? { expectedLifecycleRevision } : {}),
    ...(expectedWriterRunId !== undefined ? { expectedWriterRunId } : {}),
    sessionKey,
    ...(target?.storePath ? { storePath: target.storePath } : {}),
  };
}

function resolveCommittedSessionTarget(input: {
  preparedAttempt: EmbeddedRunAttemptParams;
  sessionTarget?: EmbeddedRunAttemptParams["sessionTarget"];
  sessionWriterFence?: SessionTranscriptWriterFence;
}): EmbeddedRunAttemptParams["sessionTarget"] {
  const preparedTarget = input.preparedAttempt.sessionTarget;
  if (!preparedTarget && !input.sessionTarget && !input.sessionWriterFence) {
    return undefined;
  }
  return {
    ...preparedTarget,
    ...input.sessionTarget,
    ...input.sessionWriterFence,
  };
}

async function runPreparedSettledTurnFinalization(input: {
  attempt: EmbeddedRunAttemptParams;
  settledAttempt: EmbeddedRunAttemptWithReceiptEvidence;
  harness: AgentHarness;
  prompt: string;
  /** Remaining run wall-clock bound; undefined keeps the attempt's own deadline. */
  runDeadlineAtMs?: number;
  createAttemptControls: CreateAttemptControls;
  abortSignal: AbortSignal;
}): Promise<{ outcome: "answered" | "empty"; attempt: EmbeddedRunAttemptWithReceiptEvidence }> {
  // The original attempt is closed. Each tool-free retry owns its own deadline
  // and Stop callbacks, while queue cancellation remains authoritative throughout.
  const attempt = clampSettledFinalizationTimeoutMs(input.attempt, input.runDeadlineAtMs);
  const controls = input.createAttemptControls({
    admittedRunContext: attempt.admittedRunContext,
    abortSignal: input.abortSignal,
    initialTimeoutMs: resolveAgentTimeoutMs({
      cfg: attempt.config,
      overrideMs: attempt.timeoutMs,
    }),
  });
  try {
    const finalization = await runEmbeddedSettledTurnFinalizationWithBackend(
      {
        ...attempt,
        abortSignal: controls.abortSignal,
        onAttemptDeadlineChanged: controls.onAttemptDeadlineChanged,
        onAttemptTimeout: controls.onAttemptTimeout,
        onAttemptAbort: controls.onAttemptAbort,
        onAttemptTimeoutArmed: undefined,
        operation: "settled-tool-finalization",
        prompt: input.prompt,
        disableTools: true,
        skipPreparedUserTurnMessage: true,
        suppressNextUserMessagePersistence: true,
        initialReplayState: { replayInvalid: false, hadPotentialSideEffects: false },
      },
      input.settledAttempt,
      input.harness,
    );
    return {
      outcome: finalization.outcome,
      attempt: buildSettledTurnFinalizationAttemptResult({
        outcome: finalization.outcome,
        result: finalization.result,
        settledAttempt: input.settledAttempt,
        prompt: input.prompt,
        agentHarnessId: attempt.agentHarnessId,
        runtimePlan: attempt.runtimePlan,
      }),
    };
  } finally {
    controls.close();
  }
}

/**
 * Binds the tool-free summary turn to the remaining run wall clock (never
 * below 1ms), floored at the protected extension: once the soft stop has
 * fired — or the in-flight turn finished after the deadline inside the drain
 * grace — the raw remainder is ~zero and clamping to it forfeits the run's
 * summary. The extension fits inside the hard backstop (RUN_DRAIN_GRACE_MS),
 * which stays armed and kills an overrunning finalizer.
 */
function clampSettledFinalizationTimeoutMs(
  attempt: EmbeddedRunAttemptParams,
  runDeadlineAtMs: number | undefined,
): EmbeddedRunAttemptParams {
  if (runDeadlineAtMs === undefined) {
    return attempt;
  }
  const remainingMs = runDeadlineAtMs - Date.now();
  const boundedMs = Math.max(RUN_SETTLED_FINALIZER_EXTENSION_MS, remainingMs);
  return {
    ...attempt,
    timeoutMs: Math.max(1, Math.min(attempt.timeoutMs, boundedMs)),
  };
}

function buildSettledTurnFinalizationAttemptResult(input: {
  outcome: "answered" | "empty";
  result: AgentHarnessSettledTurnFinalizationResult;
  settledAttempt: EmbeddedRunAttemptWithReceiptEvidence;
  prompt: string;
  agentHarnessId?: string;
  runtimePlan?: EmbeddedRunAttemptParams["runtimePlan"];
}): EmbeddedRunAttemptWithReceiptEvidence {
  const { result, settledAttempt } = input;
  const text = input.outcome === "empty" ? "" : resolveSettledTurnFinalizationText(result);
  // Finalization replaces terminal ownership, not host-private facts from settled tools.
  // Its response model does not replace the original runtime-owned selection.
  // Replay, abort, and lifecycle state remain finalizer-local.
  return {
    terminal: { kind: "ok" },
    sessionIdUsed: settledAttempt.sessionIdUsed,
    sessionFileUsed: settledAttempt.sessionFileUsed,
    ...(input.agentHarnessId ? { agentHarnessId: input.agentHarnessId } : {}),
    modelAttempt: resolveRuntimeModelAttempt(input.runtimePlan),
    ...(settledAttempt.runtimeModelSelection
      ? { runtimeModelSelection: settledAttempt.runtimeModelSelection }
      : {}),
    contextTokens: settledAttempt.contextTokens,
    contextTokensSource: settledAttempt.contextTokensSource,
    authBindingFingerprint: settledAttempt.authBindingFingerprint,
    runtimeArtifact: settledAttempt.runtimeArtifact,
    systemPromptReport: settledAttempt.systemPromptReport,
    finalPromptText: input.prompt,
    ...copyAttemptDeliveryState(settledAttempt),
    messagesSnapshot: [...settledAttempt.messagesSnapshot, result.assistant],
    assistantTexts: [text],
    assistantTranscriptOwned: result.assistantTranscriptOwned,
    assistantTranscriptIdempotencyKey: result.assistantTranscriptIdempotencyKey,
    lastAssistantTextMessageIndex: result.assistantMessageIndex,
    lastAssistant: result.assistant,
    currentAttemptAssistant: result.assistant,
    currentAttemptCompletedAssistant: result.assistant,
    toolMetas: settledAttempt.toolMetas,
    successfulNestedToolNames: settledAttempt.successfulNestedToolNames,
    hasToolMediaBlockReply: false,
    cloudCodeAssistFormatError: false,
    attemptUsage: result.usage,
    codeModeEngaged: settledAttempt.codeModeEngaged,
    assistantTurns: 1,
    replayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
    currentAttemptReplayMetadata: { hadPotentialSideEffects: false, replaySafe: true },
    itemLifecycle: { startedCount: 0, completedCount: 0, activeCount: 0 },
    diagnosticTrace: result.diagnosticTrace,
  };
}

function buildSettledToolFallbackAttemptResult(input: {
  settledAttempt: EmbeddedRunAttemptWithReceiptEvidence;
  sourceAttempt: EmbeddedRunAttemptWithReceiptEvidence;
  prompt: string;
  agentHarnessId?: string;
  runtimePlan?: EmbeddedRunAttemptParams["runtimePlan"];
  transcriptIdempotencyKey?: string;
}): EmbeddedRunAttemptWithReceiptEvidence {
  // Command-only harnesses retain assistant identity in the settled tool batch,
  // even when neither visible-assistant field exists.
  const sourceAssistant =
    input.sourceAttempt.currentAttemptAssistant ??
    input.sourceAttempt.lastAssistant ??
    input.settledAttempt.currentAttemptAssistant ??
    input.settledAttempt.lastAssistant ??
    resolveSettledToolBatchEvidence(input.settledAttempt).assistant;
  if (!sourceAssistant) {
    throw new Error("Settled-turn fallback has no assistant identity");
  }
  const assistant = {
    ...sourceAssistant,
    content: [{ type: "text" as const, text: SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT }],
    openclawDelivery: undefined,
    stopReason: "stop" as const,
    errorMessage: undefined,
    errorCode: undefined,
    errorType: undefined,
    errorBody: undefined,
    timestamp: Date.now(),
  };
  return buildSettledTurnFinalizationAttemptResult({
    outcome: "answered",
    result: {
      assistant,
      usage: input.sourceAttempt.attemptUsage,
      diagnosticTrace: input.sourceAttempt.diagnosticTrace,
      ...(input.transcriptIdempotencyKey
        ? {
            assistantTranscriptOwned: true,
            assistantTranscriptIdempotencyKey: input.transcriptIdempotencyKey,
          }
        : {}),
    },
    settledAttempt: input.settledAttempt,
    prompt: input.prompt,
    agentHarnessId: input.agentHarnessId,
    runtimePlan: input.runtimePlan,
  });
}

async function persistSettledToolFallbackTranscript(input: {
  attempt: EmbeddedRunAttemptParams;
  abortSignal: AbortSignal;
  sessionId: string;
  sessionTarget?: EmbeddedRunAttemptParams["sessionTarget"];
}): Promise<string | undefined> {
  const target = input.sessionTarget ?? input.attempt.sessionTarget;
  const sessionKey = target?.sessionKey ?? input.attempt.sessionKey;
  const hasWriterFence =
    target?.expectedLifecycleRevision !== undefined || target?.expectedWriterRunId !== undefined;
  if (!sessionKey) {
    if (hasWriterFence) {
      throw new SessionTranscriptWriterClaimReboundError();
    }
    return undefined;
  }
  const idempotencyKey = `${input.attempt.runId}:settled-finalization-fallback`;
  try {
    const result = await appendAssistantMirrorMessageByIdentity({
      ...(target?.agentId || input.attempt.agentId
        ? { agentId: target?.agentId ?? input.attempt.agentId }
        : {}),
      sessionId: input.sessionId,
      sessionKey,
      ...(target?.storePath ? { storePath: target.storePath } : {}),
      ...(target?.expectedLifecycleRevision !== undefined
        ? { expectedLifecycleRevision: target.expectedLifecycleRevision }
        : {}),
      ...(target?.expectedWriterRunId !== undefined
        ? { expectedWriterRunId: target.expectedWriterRunId }
        : {}),
      config: input.attempt.config,
      idempotencyKey,
      signal: input.abortSignal,
      text: SETTLED_TOOL_FINALIZATION_FALLBACK_TEXT,
    });
    if (!result.ok) {
      if (hasWriterFence || result.code === "session-rebound") {
        throw new SessionTranscriptWriterClaimReboundError();
      }
      log.warn(
        `settled-turn fallback transcript append skipped: runId=${input.attempt.runId} sessionId=${input.sessionId} reason=${result.reason}`,
      );
      return undefined;
    }
    return idempotencyKey;
  } catch (error) {
    if (error instanceof SessionTranscriptWriterClaimReboundError) {
      throw error;
    }
    log.warn(
      `settled-turn fallback transcript append failed: runId=${input.attempt.runId} sessionId=${input.sessionId} error=${formatErrorMessage(error)}`,
    );
    return undefined;
  }
}
