import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import { hasOnlyAssistantReasoningContent } from "@openclaw/ai/internal/shared";
import { MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE } from "../../../llm/types.js";
import { isTerminalAssistantError } from "../../../llm/utils/retry.js";
import { hasAcceptedSessionSpawn } from "../../accepted-session-spawn.js";
import { isPreDispatchToolCallRejectionMessage } from "../../failover/message-patterns.js";
import { resolveReplyCompletion, resolveReplyExpectation } from "../../reply-completion.js";
import { TOOL_FAILURE_INSTRUCTION } from "../../tool-outcome-instructions.js";
import { resolveSourceReplyDelivery } from "../delivery-evidence.js";
import { isZeroUsageEmptyStopAssistantTurn } from "../empty-assistant-turn.js";
import {
  hasAsyncActivity,
  hasAttemptTerminalState,
  isCurrentAttemptReplaySafe,
  resolveCurrentAttemptAssistant,
} from "./attempt-terminal-evidence.js";
import {
  classifyAssistantTurn,
  hasPositiveOutputTokenUsage,
  isOllamaIncompleteTurnProvider,
  isReasoningOnlyAssistantTurn,
  isUnsignedThinkingOnlyAssistantTurn,
  joinAssistantTexts,
  shouldApplyNonVisibleTurnRetryGuard,
  type IncompleteTurnAttempt,
} from "./incomplete-turn-classification.js";
import { buildTraceToolSummary } from "./run-attempt-result.js";
import type { EmbeddedRunAttemptResult } from "./types.js";

// Allow one immediate continuation plus one follow-up continuation before
// surfacing the existing incomplete-turn error path.
export const DEFAULT_REASONING_ONLY_RETRY_LIMIT = 2;
export const DEFAULT_EMPTY_RESPONSE_RETRY_LIMIT = 1;
const REASONING_ONLY_RETRY_INSTRUCTION =
  "The previous assistant turn recorded reasoning but did not produce a user-visible answer. Continue from that partial turn and produce the visible answer now. Do not restate the reasoning or restart from scratch.";
const EMPTY_RESPONSE_RETRY_INSTRUCTION =
  "The previous attempt did not produce a user-visible answer. Continue from the current state and produce the visible answer now. Do not restart from scratch.";
const SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION =
  "The previous assistant turn completed its tool calls but did not produce a user-visible answer. Continue from the current transcript and produce the final user-visible answer now. Do not repeat completed tool calls or restart from scratch. Tools are unavailable in this step: it is a text-only pass, so reply with plain text and do not attempt any tool call.";

/** Hard cap on transcript context embedded into a budget-stopped finalization prompt. */
const BUDGET_STOPPED_NARRATION_CHAR_LIMIT = 1200;
/** Hard cap on the embedded last-successful-tool-result text. */
const BUDGET_STOPPED_TOOL_RESULT_CHAR_LIMIT = 300;
/** Hard cap on the embedded per-tool outcome tally line. */
const BUDGET_STOPPED_TOOL_TALLY_CHAR_LIMIT = 600;

/**
 * Compact per-tool outcome tally from toolMetas (toolName + isError), e.g.
 * "edit: 27 call(s), 26 failed". Bounded so pathological tool mixes stay
 * within the finalizer prompt budget.
 */
function buildPerToolOutcomeTally(
  toolMetas: IncompleteTurnAttempt["toolMetas"],
): string | undefined {
  const tally = new Map<string, { calls: number; failures: number }>();
  for (const meta of toolMetas) {
    const entry = tally.get(meta.toolName) ?? { calls: 0, failures: 0 };
    entry.calls += 1;
    if (meta.isError === true) {
      entry.failures += 1;
    }
    tally.set(meta.toolName, entry);
  }
  if (tally.size === 0) {
    return undefined;
  }
  const rendered = [...tally.entries()]
    .map(([toolName, { calls, failures }]) =>
      failures > 0
        ? `${toolName}: ${calls} call(s), ${failures} failed`
        : `${toolName}: ${calls} call(s)`,
    )
    .join("; ");
  return rendered.length > BUDGET_STOPPED_TOOL_TALLY_CHAR_LIMIT
    ? `${rendered.slice(0, BUDGET_STOPPED_TOOL_TALLY_CHAR_LIMIT)}…`
    : rendered;
}

/** Text of the LAST SUCCESSFUL tool result in the snapshot, truncated for the finalizer. */
function findLastSuccessfulToolResultText(
  messagesSnapshot: IncompleteTurnAttempt["messagesSnapshot"],
): string | undefined {
  for (let index = messagesSnapshot.length - 1; index >= 0; index--) {
    const message = messagesSnapshot[index];
    if (!message || (message as { role?: unknown }).role !== "toolResult") {
      continue;
    }
    if ((message as { isError?: unknown }).isError === true) {
      continue;
    }
    // SAFETY: fields are typed unknown in this probe view; the Array.isArray guard below skips any non-array content shape.
    const content = (message as { content?: unknown }).content;
    if (!Array.isArray(content)) {
      continue;
    }
    const text = content
      .flatMap((block) => {
        // SAFETY: probe view with unknown-typed fields; both reads are typeof-guarded, so non-text blocks map to nothing.
        const typed = block as { type?: unknown; text?: unknown } | null;
        return typed?.type === "text" && typeof typed.text === "string" ? [typed.text] : [];
      })
      .join("\n");
    if (text.length > 0) {
      return text.length > BUDGET_STOPPED_TOOL_RESULT_CHAR_LIMIT
        ? `${text.slice(0, BUDGET_STOPPED_TOOL_RESULT_CHAR_LIMIT)}…`
        : text;
    }
  }
  return undefined;
}

/**
 * A budget-stopped run's finalizer executes instruction-only (no transcript
 * replay), so it must carry the run's own last narration and tool activity —
 * otherwise the terminal message is confused filler about missing access.
 */
function buildBudgetStoppedFinalizationContext(attempt: IncompleteTurnAttempt): string {
  const lastNarration = joinAssistantTexts(attempt.assistantTexts);
  const toolSummary = buildTraceToolSummary({
    toolMetas: attempt.toolMetas,
    lastToolError: attempt.lastToolError,
  });
  const perToolTally = buildPerToolOutcomeTally(attempt.toolMetas);
  const lastSuccessfulToolResult = findLastSuccessfulToolResultText(attempt.messagesSnapshot);
  const contextLines = [
    "Context: the run stopped at its tool-call budget before it could produce a final answer. Summarize and report the outcome below instead of claiming missing access.",
    lastNarration
      ? `Last assistant narration (may be partial): "${lastNarration.slice(0, BUDGET_STOPPED_NARRATION_CHAR_LIMIT)}${lastNarration.length > BUDGET_STOPPED_NARRATION_CHAR_LIMIT ? "…" : ""}"`
      : undefined,
    toolSummary
      ? `Tool activity this run: ${toolSummary.calls} call(s) via ${toolSummary.tools.join(", ")}, ${toolSummary.failures} failure(s).`
      : undefined,
    perToolTally ? `Per-tool outcomes: ${perToolTally}.` : undefined,
    lastSuccessfulToolResult
      ? `Last successful tool result (may be partial): "${lastSuccessfulToolResult}"`
      : undefined,
  ];
  return contextLines.filter((line) => line !== undefined).join(" ");
}

export function shouldRetrySilentErrorAssistantTurn(params: {
  attempt: Pick<
    EmbeddedRunAttemptResult,
    | "assistantTexts"
    | "clientToolCalls"
    | "yieldDetected"
    | "didSendDeterministicApprovalPrompt"
    | "heartbeatToolResponse"
    | "lastToolError"
    | "toolMediaUrls"
    | "toolAudioAsVoice"
    | "toolTrustedLocalMedia"
    | "didDeliverSourceReplyViaMessageTool"
    | "messagingToolSourceReplyPayloads"
    | "replayMetadata"
    | "currentAttemptReplayMetadata"
  >;
  assistant: EmbeddedRunAttemptResult["lastAssistant"] | null | undefined;
}): boolean {
  // Current-attempt evidence avoids blocking on prior committed effects; older
  // harnesses retain the cumulative, fail-closed behavior.
  if (
    joinAssistantTexts(params.attempt.assistantTexts).length > 0 ||
    hasAttemptTerminalState(params.attempt) ||
    !isCurrentAttemptReplaySafe(params.attempt)
  ) {
    return false;
  }

  const assistant = params.assistant;
  if (
    !assistant ||
    assistant.stopReason !== "error" ||
    isTerminalAssistantError(assistant) ||
    // Output-limit continuation has already consulted the shared recovery budget.
    isResponsesOutputLimitToolCallError(assistant)
  ) {
    return false;
  }

  const { content } = assistant;
  if (!Array.isArray(content)) {
    return false;
  }
  if (content.every((block) => block.type === "text" && !block.text.trim())) {
    // Rejected arguments can consume tokens without output; the preceding guards own replay safety.
    return (
      !hasPositiveOutputTokenUsage(assistant) ||
      assistant.errorCode === MALFORMED_TOOL_CALL_ARGUMENTS_ERROR_CODE ||
      isPreDispatchToolCallRejectionMessage(assistant.errorMessage)
    );
  }

  return hasOnlyAssistantReasoningContent(assistant);
}

function shouldSkipNonVisibleTurnRetry(params: {
  aborted: boolean;
  timedOut: boolean;
  attempt: IncompleteTurnAttempt;
  /** Silent classification can tolerate completed effects, never unfinished work or replay. */
  tolerateSideEffects?: boolean;
}): boolean {
  return Boolean(
    params.aborted ||
    params.timedOut ||
    params.attempt.terminal.kind === "failed" ||
    params.attempt.clientToolCalls ||
    params.attempt.yieldDetected ||
    params.attempt.didSendDeterministicApprovalPrompt ||
    params.attempt.lastToolError ||
    hasAcceptedSessionSpawn(params.attempt.acceptedSessionSpawns) ||
    params.attempt.itemLifecycle.activeCount > 0 ||
    params.attempt.itemLifecycle.completedCount < params.attempt.itemLifecycle.startedCount ||
    hasAsyncActivity(params.attempt.toolMetas) ||
    (params.tolerateSideEffects !== true && params.attempt.replayMetadata.hadPotentialSideEffects),
  );
}

/** Allows configured silent handling for replay-safe empty, reasoning-only, or explicit silent turns. */
export function shouldTreatEmptyAssistantReplyAsSilent(params: {
  allowEmptyAssistantReplyAsSilent?: boolean;
  onlyExplicitSilentReply?: boolean;
  terminalReplyExpectation?: "required" | "optional";
  payloadCount: number;
  aborted: boolean;
  timedOut: boolean;
  attempt: IncompleteTurnAttempt;
}): boolean {
  const completion = resolveReplyCompletion(
    resolveReplyExpectation(params),
    params.payloadCount === 0 ? "empty" : "ready",
  );
  const assistant = classifyAssistantTurn(params);
  return (
    completion.outcome === "silent" &&
    !shouldSkipNonVisibleTurnRetry({ ...params, tolerateSideEffects: true }) &&
    resolveSourceReplyDelivery(params.attempt) === "missing" &&
    (!params.onlyExplicitSilentReply || assistant.silent) &&
    assistant.nonVisibleEligibleForSilentReply
  );
}

/**
 * Builds the retry instruction for reasoning-only turns that consumed provider
 * output budget but produced no visible assistant text.
 */
export function resolveReasoningOnlyRetryInstruction(params: {
  provider?: string;
  modelId?: string;
  modelApi?: string;
  executionContract?: string;
  aborted: boolean;
  timedOut: boolean;
  attempt: IncompleteTurnAttempt;
}): string | null {
  if (shouldSkipNonVisibleTurnRetry(params) || !shouldApplyNonVisibleTurnRetryGuard(params)) {
    return null;
  }

  const assistant = resolveCurrentAttemptAssistant(params.attempt);
  return joinAssistantTexts(params.attempt.assistantTexts).length === 0 &&
    assistant?.stopReason !== "error" &&
    (isReasoningOnlyAssistantTurn(assistant) || isUnsignedThinkingOnlyAssistantTurn(assistant))
    ? REASONING_ONLY_RETRY_INSTRUCTION
    : null;
}

type SettledToolCall = { id: string | null; name: string | null };
type SettledToolResult = { toolCallId?: unknown; toolName?: unknown; isError?: unknown };

function readSettledToolCalls(
  message: EmbeddedRunAttemptResult["currentAttemptAssistant"] | null | undefined,
): SettledToolCall[] {
  if (!Array.isArray(message?.content)) {
    return [];
  }
  return message.content.flatMap((item) => {
    const block = item as { type?: unknown; id?: unknown; name?: unknown } | null;
    return block?.type === "toolCall"
      ? [
          {
            id: typeof block.id === "string" ? block.id : null,
            name: typeof block.name === "string" ? block.name : null,
          },
        ]
      : [];
  });
}

/** Proves settlement and intentional termination for the exact current-turn tool-call batch. */
export function resolveSettledToolBatchEvidence(attempt: IncompleteTurnAttempt) {
  const snapshot = attempt.messagesSnapshot ?? [];
  const latestUserIndex = snapshot.findLastIndex((message) => message.role === "user");
  let assistant = attempt.currentAttemptAssistant;
  let assistantIndex = assistant ? snapshot.indexOf(assistant) : -1;
  if (assistantIndex <= latestUserIndex || readSettledToolCalls(assistant).length === 0) {
    assistantIndex = snapshot.findLastIndex(
      (message, index) =>
        index > latestUserIndex &&
        message.role === "assistant" &&
        readSettledToolCalls(message).length > 0,
    );
    const candidate = assistantIndex >= 0 ? snapshot[assistantIndex] : undefined;
    assistant = candidate?.role === "assistant" ? candidate : undefined;
  }
  const requestedToolCalls = readSettledToolCalls(assistant);
  // Results must follow their owning assistant; session-wide reused ids cannot settle a new turn.
  const settledToolResults = new Map(
    (assistantIndex >= 0 ? snapshot.slice(assistantIndex + 1) : []).flatMap((message) => {
      // SAFETY: destructure reads only probe fields; the role check and typeof guards below discard non-toolResult rows.
      const { toolCallId, toolName, isError } = message as SettledToolResult;
      return message.role === "toolResult" &&
        typeof toolCallId === "string" &&
        typeof toolName === "string"
        ? [[toolCallId, { toolName, isError: isError === true }] as const]
        : [];
    }),
  );
  // Transcript proof: every call in the batch has its result persisted. Nested
  // code-mode work (exec status "waiting") keeps lifecycle items active while
  // the outer result is already recorded, so this is the weaker of the two.
  const allToolCallsRecorded =
    requestedToolCalls.length > 0 &&
    requestedToolCalls.every(
      ({ id, name }) =>
        id !== null && name !== null && settledToolResults.get(id)?.toolName === name,
    );
  const allToolsProvenSettled =
    allToolCallsRecorded &&
    attempt.itemLifecycle.startedCount > 0 &&
    attempt.itemLifecycle.completedCount === attempt.itemLifecycle.startedCount &&
    attempt.itemLifecycle.activeCount === 0;
  // Producer-recorded fact from the tool completion handler: one of this batch's
  // exec results parked a Code Mode run, which is the only legitimate reason a
  // fully recorded batch still shows active lifecycle items.
  const parkedCodeModeRun =
    allToolCallsRecorded &&
    requestedToolCalls.some(({ id }) =>
      attempt.toolMetas.some(
        (entry) => entry.toolCallId === id && entry.codeModeSuspended === true,
      ),
    );
  const failedToolNames = new Set(
    requestedToolCalls.flatMap(({ id, name }) =>
      id !== null && name !== null && settledToolResults.get(id)?.isError === true ? [name] : [],
    ),
  );
  const hasStaleToolError = Boolean(
    attempt.lastToolError &&
    assistant?.stopReason === "toolUse" &&
    allToolsProvenSettled &&
    failedToolNames.size === 0,
  );
  // ToolErrorSummary has no call id: its owner must match a failed result in the
  // proven terminal batch, or a stale/unrelated error could authorize continuation.
  // A fully settled successful batch proves that a retained error belongs to an
  // earlier tool and cannot block text-only finalization of the current batch.
  const hasUnsettledToolError = Boolean(
    attempt.lastToolError &&
    !hasStaleToolError &&
    (assistant?.stopReason !== "toolUse" ||
      !allToolsProvenSettled ||
      !failedToolNames.has(attempt.lastToolError.toolName)),
  );
  const intentionalTermination =
    allToolsProvenSettled &&
    assistant?.stopReason === "toolUse" &&
    failedToolNames.size === 0 &&
    !hasUnsettledToolError &&
    !hasAsyncActivity(attempt.toolMetas) &&
    requestedToolCalls.every(({ id, name }) => {
      const metadata = attempt.toolMetas.findLast(
        (entry) => entry.toolCallId === id && entry.toolName === name,
      );
      return metadata?.terminate === true && metadata.isError !== true;
    });
  return {
    assistant,
    allToolCallsRecorded,
    allToolsProvenSettled,
    parkedCodeModeRun,
    failedToolNames,
    hasStaleToolError,
    hasUnsettledToolError,
    intentionalTermination,
  };
}

/** Builds one fresh continuation after settled tools ended without a visible final answer. */
export function resolveSettledToolTerminalContinuationInstruction(params: {
  provider?: string;
  modelId?: string;
  modelApi?: string;
  executionContract?: string;
  allowEmptyStopContinuation?: boolean;
  payloadCount: number;
  hasTerminalToolPresentation?: boolean;
  /**
   * A bounded-run budget cap (tool-loop turn budget or run wall-clock soft
   * stop) withheld this turn's post-tool continuation round, so the turn's
   * narration text payloads are not a final answer and must not disqualify
   * the graceful terminal turn.
   */
  toolLoopBudgetStopped?: boolean;
  aborted: boolean;
  timedOut: boolean;
  attempt: IncompleteTurnAttempt;
}): string | null {
  const { attempt } = params;
  const {
    assistant: toolBatchAssistant,
    allToolsProvenSettled,
    failedToolNames,
    hasUnsettledToolError,
    intentionalTermination,
  } = resolveSettledToolBatchEvidence(attempt);
  const terminal = attempt.terminal;
  const idlePromptTimeout =
    terminal.kind === "timeout" &&
    terminal.phase === "prompt" &&
    terminal.source === "idle" &&
    attempt.currentAttemptReplayMetadata?.hadPotentialSideEffects === true;
  const emptyStopAfterSettledTools = Boolean(
    params.allowEmptyStopContinuation &&
    attempt.currentAttemptAssistant?.stopReason === "stop" &&
    attempt.toolMetas.length > 0 &&
    attempt.toolMetas.every((tool) => tool.isError !== true && tool.asyncStarted !== true) &&
    attempt.itemLifecycle.startedCount > 0 &&
    attempt.itemLifecycle.completedCount === attempt.itemLifecycle.startedCount &&
    attempt.itemLifecycle.activeCount === 0 &&
    !hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) &&
    classifyAssistantTurn(params).emptyResponse,
  );
  if (
    (params.payloadCount !== 0 && !params.toolLoopBudgetStopped) ||
    // Fork (empty-stop continuation): classifyAssistantTurn's `silent`
    // (output.isSilent) is the 9.6 shape of the removed
    // hasOnlySilentAssistantReply(attempt.assistantTexts) helper.
    (!params.allowEmptyStopContinuation && classifyAssistantTurn(params).silent) ||
    params.hasTerminalToolPresentation ||
    params.aborted ||
    ((params.timedOut || terminal.kind === "timeout") && !idlePromptTimeout) ||
    (terminal.kind === "failed" && !attempt.settledTurnFinalizationContext) ||
    (toolBatchAssistant?.stopReason === "toolUse"
      ? !allToolsProvenSettled
      : !emptyStopAfterSettledTools) ||
    intentionalTermination ||
    hasUnsettledToolError ||
    hasAsyncActivity(attempt.toolMetas) ||
    hasAcceptedSessionSpawn(attempt.acceptedSessionSpawns) ||
    attempt.clientToolCalls ||
    attempt.yieldDetected ||
    attempt.didSendDeterministicApprovalPrompt
  ) {
    return null;
  }
  if (attempt.hasToolMediaBlockReply || resolveSourceReplyDelivery(attempt) !== "missing") {
    return null;
  }
  if (!shouldApplyNonVisibleTurnRetryGuard(params)) {
    return null;
  }
  const baseInstruction =
    allToolsProvenSettled && failedToolNames.size > 0
      ? `${SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION} ${TOOL_FAILURE_INSTRUCTION}`
      : SETTLED_TOOL_TERMINAL_CONTINUATION_INSTRUCTION;
  // The budget-stopped finalizer sees only this instruction, so embed the run's
  // own last narration and tool activity; without it the terminal message is
  // confused filler ("I don't have access to the earlier portion...").
  return params.toolLoopBudgetStopped === true
    ? `${baseInstruction} ${buildBudgetStoppedFinalizationContext(attempt)}`
    : baseInstruction;
}

/**
 * Builds the retry instruction for empty assistant turns when the provider/model
 * is eligible for non-visible turn recovery.
 */
export function resolveEmptyResponseRetryInstruction(params: {
  provider?: string;
  modelId?: string;
  modelApi?: string;
  executionContract?: string;
  payloadCount: number;
  aborted: boolean;
  timedOut: boolean;
  attempt: IncompleteTurnAttempt;
}): string | null {
  if (shouldSkipNonVisibleTurnRetry(params)) {
    return null;
  }

  const assistantState = classifyAssistantTurn(params);
  if (!assistantState.emptyResponse) {
    return null;
  }

  const assistant = assistantState.assistant ?? null;
  if (
    assistant?.stopReason === "stop" &&
    isOllamaIncompleteTurnProvider(params.provider) &&
    !hasPositiveOutputTokenUsage(assistant)
  ) {
    return null;
  }

  if (
    shouldApplyNonVisibleTurnRetryGuard(params) ||
    // Keep the generic zero-usage stop retry for providers that expose a
    // provider-neutral "nothing was generated" signal, even outside the
    // provider allowlist above.
    isZeroUsageEmptyStopAssistantTurn(assistant)
  ) {
    return EMPTY_RESPONSE_RETRY_INSTRUCTION;
  }

  return null;
}
