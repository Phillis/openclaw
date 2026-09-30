import { appendCronStyleCurrentTimeLine } from "../agents/current-time.js";
import type { InternalGetReplyOptions } from "../auto-reply/reply/get-reply.types.js";
import { prepareReplyConversation } from "../auto-reply/reply/prompt-session-context.js";
import {
  REPLY_OPERATION_RUN_STATE,
  resolveReplyOperationAgentTurn,
  type ReplyOperationRunState,
} from "../auto-reply/reply/reply-operation-run-state.js";
import { withReplySystemEventContext } from "../auto-reply/reply/system-event-session-key.js";
import type { MsgContext } from "../auto-reply/templating.js";
import { formatErrorMessage } from "./errors.js";
import { resolveHeartbeatTimeoutOverrideSeconds } from "./heartbeat-config.js";
import { resolveActiveReplyRunOwnerForSignal } from "../auto-reply/reply/reply-run-registry.state.js";
import { setChannelSourceTurnId } from "../auto-reply/reply/source-turn-id.js";
import { hasHeartbeatOutcomeForRun } from "./heartbeat-outcome-store.js";
import {
  DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET,
  resolveHeartbeatTurnReceiptRequired,
} from "./heartbeat-runner-config.js";
import {
  armHeartbeatZeroTranscriptWatchdog,
  HEARTBEAT_ZERO_TRANSCRIPT_KILL_REASON,
  resolveHeartbeatZeroTranscriptProbeDefaults,
} from "./heartbeat-zero-transcript-watchdog.js";
import { createHeartbeatDispatch, deliverHeartbeatDispatch } from "./heartbeat-dispatch.js";
import { emitHeartbeatEvent, resolveIndicatorType } from "./heartbeat-events.js";
import { heartbeatLog } from "./heartbeat-log.js";
import {
  isHeartbeatTypingEnabled,
  resolveHeartbeatChannelPlugin,
  resolveHeartbeatTypingIntervalSeconds,
} from "./heartbeat-runner-config.js";
import {
  prepareHeartbeatRunStage,
  resolveHeartbeatWakeStage,
  type HeartbeatRunOptions,
} from "./heartbeat-runner-execution.js";
import { createHeartbeatTypingCallbacks } from "./heartbeat-typing.js";
import { getHeartbeatWakeAbortSignal, type HeartbeatRunResult } from "./heartbeat-wake.js";
import { markSessionEventWakeWorkStarted } from "./session-event-wake.js";

/** W2: the definitive local reason for a completed beat with no disk evidence of work. */
export const HEARTBEAT_TURN_RECEIPT_MISSING_REASON = "turn-receipt-missing";

type HeartbeatTurnReceiptScope = {
  receiptRequired: boolean;
  agentId: string;
  storePath: string;
  /** Base/policy session key the heartbeat outcome store rows are keyed by. */
  sessionKey: string;
  runSessionKey: string;
  startedAt: number;
  sawHeartbeatToolResponse: boolean;
  deps?: HeartbeatRunOptions["deps"];
  channel?: string;
  accountId?: string;
  useIndicator: boolean;
};

/**
 * W2 disk-evidence probe for one completed beat. Evidence is ANY of:
 * (a) a persisted heartbeat outcome row for this run (run_session_key match,
 * occurred_at >= run start), (b) at least one transcript event for the run
 * session since run start (the P0-2 probe; the deps seam keeps tests
 * deterministic), or (c) an explicit heartbeat tool response. Probe failures
 * are UNKNOWN evidence — never a definitive miss (the P0-2 watchdog's
 * probe-failure semantics): fail open and keep the beat's result rather than
 * failing runs on observer breakage.
 */
async function hasHeartbeatTurnReceiptEvidence(scope: HeartbeatTurnReceiptScope): Promise<boolean> {
  try {import { appendCronStyleCurrentTimeLine } from "../agents/current-time.js";
import type { InternalGetReplyOptions } from "../auto-reply/reply/get-reply.types.js";
import { prepareReplyConversation } from "../auto-reply/reply/prompt-session-context.js";
import {
  REPLY_OPERATION_RUN_STATE,
  resolveReplyOperationAgentTurn,
  type ReplyOperationRunState,
} from "../auto-reply/reply/reply-operation-run-state.js";
import { withReplySystemEventContext } from "../auto-reply/reply/system-event-session-key.js";
import type { MsgContext } from "../auto-reply/templating.js";
import { formatErrorMessage } from "./errors.js";
import { resolveHeartbeatTimeoutOverrideSeconds } from "./heartbeat-config.js";
import { resolveActiveReplyRunOwnerForSignal } from "../auto-reply/reply/reply-run-registry.state.js";
import { setChannelSourceTurnId } from "../auto-reply/reply/source-turn-id.js";
import { hasHeartbeatOutcomeForRun } from "./heartbeat-outcome-store.js";
import {
  DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET,
  resolveHeartbeatTurnReceiptRequired,
} from "./heartbeat-runner-config.js";
import {
  armHeartbeatZeroTranscriptWatchdog,
  HEARTBEAT_ZERO_TRANSCRIPT_KILL_REASON,
  resolveHeartbeatZeroTranscriptProbeDefaults,
} from "./heartbeat-zero-transcript-watchdog.js";
import { createHeartbeatDispatch, deliverHeartbeatDispatch } from "./heartbeat-dispatch.js";
import { emitHeartbeatEvent, resolveIndicatorType } from "./heartbeat-events.js";
import { heartbeatLog } from "./heartbeat-log.js";
import {
  isHeartbeatTypingEnabled,
  resolveHeartbeatChannelPlugin,
  resolveHeartbeatTypingIntervalSeconds,
} from "./heartbeat-runner-config.js";
import {
  prepareHeartbeatRunStage,
  resolveHeartbeatWakeStage,
  type HeartbeatRunOptions,
} from "./heartbeat-runner-execution.js";
import { createHeartbeatTypingCallbacks } from "./heartbeat-typing.js";
import { getHeartbeatWakeAbortSignal, type HeartbeatRunResult } from "./heartbeat-wake.js";
import { markSessionEventWakeWorkStarted } from "./session-event-wake.js";

/** W2: the definitive local reason for a completed beat with no disk evidence of work. */
export const HEARTBEAT_TURN_RECEIPT_MISSING_REASON = "turn-receipt-missing";

type HeartbeatTurnReceiptScope = {
  receiptRequired: boolean;
  agentId: string;
  storePath: string;
  /** Base/policy session key the heartbeat outcome store rows are keyed by. */
  sessionKey: string;
  runSessionKey: string;
  startedAt: number;
  sawHeartbeatToolResponse: boolean;
  deps?: HeartbeatRunOptions["deps"];
  channel?: string;
  accountId?: string;
  useIndicator: boolean;
};

/**
 * W2 disk-evidence probe for one completed beat. Evidence is ANY of:
 * (a) a persisted heartbeat outcome row for this run (run_session_key match,
 * occurred_at >= run start), (b) at least one transcript event for the run
 * session since run start (the P0-2 probe; the deps seam keeps tests
 * deterministic), or (c) an explicit heartbeat tool response. Probe failures
 * are UNKNOWN evidence — never a definitive miss (the P0-2 watchdog's
 * probe-failure semantics): fail open and keep the beat's result rather than
 * failing runs on observer breakage.
 */
async function hasHeartbeatTurnReceiptEvidence(scope: HeartbeatTurnReceiptScope): Promise<boolean> {
  try {
    const dispatchPromise = (async () => {
    await dispatchInboundMessageWithRoutedChannelDispatcher({
      cfg,
      ctx: heartbeatContext,
      replyResolver: opts.deps?.getReplyFromConfig,
      suppressOutboundHooks: true,
      replyOptions: withReplySystemEventContext<InternalGetReplyOptions>(
        {
          isHeartbeat: true,
          // Isolated heartbeats mint a fresh session ID per run, so nothing later
          // reuses this run's bundle MCP runtime; retire it at settlement.
          ...(prepared.run.kind === "isolated" ? { cleanupBundleMcpOnRunEnd: true } : {}),
          replyConversation: prepareReplyConversation({
            ctx: heartbeatContext,
            sessionEntry: suppressOriginatingContext ? undefined : prepared.conversationEntry,
            isHeartbeat: true,
          }),
          [REPLY_OPERATION_RUN_STATE]: state,
          heartbeatModelOverride: heartbeat?.model?.trim(),
          ...(prepared.usesHeartbeatResponseTool
            ? {
                enableHeartbeatTool: true,
                forceHeartbeatTool: true,
                sourceReplyDeliveryMode: "message_tool_only",
              }
            : {}),
          abortSignal: signal,
          // Background wakes get a hard non-refundable tool-call budget; user and
          // manual turns never enter this path and keep unbounded deep work.
          maxToolLoopAttempts: DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET,
          // Admitted task continuations retain their ordinary agent budget even after wake coalescing.
          timeoutOverrideSeconds: prepared.hasTaskContinuation
            ? undefined
            : resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat),
          bootstrapContextMode: heartbeat?.lightContext === true ? "lightweight" : undefined,
          disableBlockStreaming: true,
          suppressToolProgressMessages: true,
          suppressDefaultToolProgressMessages: true,
          onModelSelected: prepared.replyPrefix.onModelSelected,
          onSessionPrepared: (binding) => {
            // Capture initialization's exact identity once; later replacements cannot inherit delivery.
            if (
              !policy.prepared.policySessionEntry &&
              !prepared.outboundPolicySessionKey &&
              binding.sessionKey === prepared.sessionKey &&
              binding.storePath === prepared.storePath &&
              binding.lifecycleRevision !== undefined
            ) {
              policy.prepared = {
                ...prepared,
                policySessionEntry: {
                  sessionId: binding.sessionId,
                  lifecycleRevision: binding.lifecycleRevision,
                  updatedAt: startedAt,
                },
              };
            }
          },
        },
        {
          sessionKey: prepared.inspectsRunQueue ? prepared.sessionKey : runSessionKey,
          events: prepared.inspectsRunQueue ? prepared.genericEvents : [],
        },
      ),
      dispatcherOptions: {
        deliver: (payload) =>
          deliverHeartbeatDispatch(policy, payload, state.agentTurnOwner?.abortSignal ?? signal),
      },
    });
    })();
    if (watchdog) {
      const outcome = await watchdog.race(dispatchPromise);
      if (outcome === "watchdog_kill") {
        // The kill is authoritative by construction: the probe observed zero
        // transcript events at the window. A later cancelled settlement of the
        // abandoned turn must never author a skipped outcome (that would hide
        // the wedge and skip the retry); author the failed result now.
        policy.watchdogKillAuthoritative = true;
        const reason = HEARTBEAT_ZERO_TRANSCRIPT_KILL_REASON;
        emitHeartbeatEvent({
          status: "failed",
          reason,
          durationMs: Date.now() - startedAt,
          channel,
          accountId: delivery.accountId,
          indicatorType: visibility.useIndicator ? resolveIndicatorType("failed") : undefined,
        });
        heartbeatLog.error(`heartbeat failed: ${reason}`, { reason });
        return { status: "failed", reason, failureKind: "local_kill" };
      }
    }
    await dispatchPromise;
    if (policy.result) {
      return await settleTurnReceiptEnforcedResult(policy.result);
    }
    const execution = resolveReplyOperationAgentTurn(state);
    const reason =
      execution === "superseded"
        ? "preempted"
        : execution === "cancelled"
          ? "agent-runner-cancelled"
          : "requests-in-flight";
    emitHeartbeatEvent({ status: "skipped", reason, durationMs: Date.now() - startedAt });
    return { status: "skipped", reason };
  } catch (error) {
    if (policy.result) {
      return await settleTurnReceiptEnforcedResult(policy.result);
    }
    const reason = formatErrorMessage(error);
    emitHeartbeatEvent({
      status: "failed",
      reason,
      durationMs: Date.now() - startedAt,
      channel,
      accountId: delivery.accountId,
      indicatorType: visibility.useIndicator ? resolveIndicatorType("failed") : undefined,
    });
    heartbeatLog.error(`heartbeat failed: ${reason}`, { error: reason });
    return { status: "failed", reason };
  } finally {
    typing?.onCleanup?.();
    watchdog?.dispose();
  }
}
