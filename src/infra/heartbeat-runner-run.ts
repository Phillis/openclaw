import { appendCronStyleCurrentTimeLine } from "../agents/current-time.js";
import type { InternalGetReplyOptions } from "../auto-reply/reply/get-reply.types.js";
import { prepareReplyConversation } from "../auto-reply/reply/prompt-session-context.js";
import {
  REPLY_OPERATION_RUN_STATE,
  resolveReplyOperationAgentTurn,
  type ReplyOperationRunState,
} from "../auto-reply/reply/reply-operation-run-state.js";
import { resolveActiveReplyRunOwnerForSignal } from "../auto-reply/reply/reply-run-registry.state.js";
import { setChannelSourceTurnId } from "../auto-reply/reply/source-turn-id.js";
import { withReplySystemEventContext } from "../auto-reply/reply/system-event-session-key.js";
import type { MsgContext } from "../auto-reply/templating.js";
import { formatErrorMessage } from "./errors.js";
import { resolveHeartbeatTimeoutOverrideSeconds } from "./heartbeat-config.js";
import { createHeartbeatDispatch, deliverHeartbeatDispatch } from "./heartbeat-dispatch.js";
import { emitHeartbeatEvent, resolveIndicatorType } from "./heartbeat-events.js";
import { heartbeatLog } from "./heartbeat-log.js";
import { hasHeartbeatOutcomeForRun } from "./heartbeat-outcome-store.js";
import {
  DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET,
  isHeartbeatTypingEnabled,
  resolveHeartbeatChannelPlugin,
  resolveHeartbeatTurnReceiptRequired,
  resolveHeartbeatTypingIntervalSeconds,
} from "./heartbeat-runner-config.js";
import {
  prepareHeartbeatRunStage,
  resolveHeartbeatWakeStage,
  type HeartbeatRunOptions,
} from "./heartbeat-runner-execution.js";
import { createHeartbeatTypingCallbacks } from "./heartbeat-typing.js";
import { getHeartbeatWakeAbortSignal, type HeartbeatRunResult } from "./heartbeat-wake.js";
import {
  armHeartbeatZeroTranscriptWatchdog,
  HEARTBEAT_ZERO_TRANSCRIPT_KILL_REASON,
  resolveHeartbeatZeroTranscriptProbeDefaults,
} from "./heartbeat-zero-transcript-watchdog.js";
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
    if (scope.sawHeartbeatToolResponse) {
      return true;
    }
    const injectedOutcomeProbe = scope.deps?.hasHeartbeatRunOutcome;
    const hasOutcome = injectedOutcomeProbe
      ? await Promise.resolve(
          injectedOutcomeProbe({
            agentId: scope.agentId,
            storePath: scope.storePath,
            sessionKey: scope.sessionKey,
            runSessionKey: scope.runSessionKey,
            sinceMs: scope.startedAt,
          }),
        )
      : hasHeartbeatOutcomeForRun({
          agentId: scope.agentId,
          storePath: scope.storePath,
          sessionKey: scope.sessionKey,
          runSessionKey: scope.runSessionKey,
          minOccurredAt: scope.startedAt,
        });
    if (hasOutcome) {
      return true;
    }
    const countTranscriptEvents = resolveHeartbeatZeroTranscriptProbeDefaults({
      deps: scope.deps,
    }).countTranscriptEvents;
    const events = await Promise.resolve(
      countTranscriptEvents({
        agentId: scope.agentId,
        storePath: scope.storePath,
        sessionKey: scope.runSessionKey,
        sinceMs: scope.startedAt,
      }),
    );
    return events > 0;
  } catch (error) {
    heartbeatLog.warn("heartbeat: turn-receipt evidence probe failed", {
      agentId: scope.agentId,
      runSessionKey: scope.runSessionKey,
      error: error instanceof Error ? error.message : String(error),
    });
    return true;
  }
}

/**
 * W2 turn-receipt enforcement: when enabled, a `ran` beat result requires
 * disk evidence of the beat's work. A quiet beat with NO evidence is the
 * 3x-confirmed dropped step: its result becomes a definitive LOCAL failure
 * (circuit-neutral — failureKind local_kill, never a provider failover
 * reason) so the cron retry re-runs the beat and the receipt error_text
 * carries the missing-receipt reason (P0-1 composition). Non-ran results
 * pass through untouched; enforcement off is a no-op.
 */
async function enforceHeartbeatTurnReceiptResult(
  result: HeartbeatRunResult,
  scope: HeartbeatTurnReceiptScope,
): Promise<HeartbeatRunResult> {
  if (result.status !== "ran" || !scope.receiptRequired) {
    return result;
  }
  if (await hasHeartbeatTurnReceiptEvidence(scope)) {
    return result;
  }
  const reason = HEARTBEAT_TURN_RECEIPT_MISSING_REASON;
  emitHeartbeatEvent({
    status: "failed",
    reason,
    durationMs: Date.now() - scope.startedAt,
    channel: scope.channel,
    accountId: scope.accountId,
    indicatorType: scope.useIndicator ? resolveIndicatorType("failed") : undefined,
  });
  heartbeatLog.warn(`heartbeat failed: ${reason}`, {
    agentId: scope.agentId,
    runSessionKey: scope.runSessionKey,
  });
  return { status: "failed", reason, failureKind: "local_kill" };
}
export async function runHeartbeatOnce(opts: HeartbeatRunOptions): Promise<HeartbeatRunResult> {
  const wake = await resolveHeartbeatWakeStage(opts);
  if (wake.kind === "skipped") {
    return { status: "skipped", reason: wake.reason };
  }
  // Preparation can admit isolated work; later busy skips must retain the occurrence.
  markSessionEventWakeWorkStarted();
  const prepared = await prepareHeartbeatRunStage(wake);
  if (prepared.kind === "skipped") {
    return { status: "skipped", reason: prepared.reason };
  }
  const { cfg, agentId, heartbeat, startedAt } = wake;
  const { delivery, visibility, sender, runSessionKey, suppressOriginatingContext } = prepared;
  const { storePath, sessionKey, outboundPolicySessionKey } = prepared;
  if (!visibility.showAlerts && !visibility.showOk && !visibility.useIndicator) {
    emitHeartbeatEvent({
      status: "skipped",
      reason: "alerts-disabled",
      durationMs: Date.now() - startedAt,
      channel: delivery.channel !== "none" ? delivery.channel : undefined,
      accountId: delivery.accountId,
    });
    return { status: "skipped", reason: "alerts-disabled" };
  }
  const policy = createHeartbeatDispatch(opts, wake, prepared);
  const state: ReplyOperationRunState = { heartbeat: policy };
  const signal = getHeartbeatWakeAbortSignal();
  const channel = delivery.channel !== "none" ? delivery.channel : undefined;
  const typing =
    channel &&
    isHeartbeatTypingEnabled({
      cfg,
      agentId,
      hasChatDelivery: Boolean(delivery.to && (visibility.showAlerts || visibility.showOk)),
    })
      ? createHeartbeatTypingCallbacks({
          cfg,
          target: { ...delivery, channel },
          plugin: resolveHeartbeatChannelPlugin(channel),
          deps: opts.deps,
          typingIntervalSeconds: resolveHeartbeatTypingIntervalSeconds(cfg),
          log: heartbeatLog,
        })
      : undefined;
  const watchdog = armHeartbeatZeroTranscriptWatchdog({
    cfg,
    agentId,
    storePath: prepared.storePath,
    sessionKey: prepared.runSessionKey,
    startedAt,
    ...resolveHeartbeatZeroTranscriptProbeDefaults({ cfg, deps: opts.deps }),
    kill: () => {
      // Scoped definitive local cancel (P0-2): the recorded run owner is the
      // sanctioned lever; the signal-mapped owner covers the pre-record window.
      // The wake abort signal itself is never aborted, so the wake bus performs
      // no re-execution — the scheduled cron retry stays the only re-execution
      // path.
      const owner = state.agentTurnOwner;
      if (owner) {
        return owner.abortByUser();
      }
      const viaSignal = signal ? resolveActiveReplyRunOwnerForSignal(signal) : undefined;
      return viaSignal ? viaSignal.abort() : false;
    },
    killSettleGraceMs: 0,
    log: heartbeatLog,
  });
  const settleTurnReceiptEnforcedResult = async (
    result: HeartbeatRunResult,
  ): Promise<HeartbeatRunResult> =>
    enforceHeartbeatTurnReceiptResult(result, {
      receiptRequired: resolveHeartbeatTurnReceiptRequired(cfg),
      agentId,
      storePath,
      sessionKey: outboundPolicySessionKey ?? sessionKey,
      runSessionKey,
      startedAt,
      sawHeartbeatToolResponse: policy.sawHeartbeatToolResponse === true,
      deps: opts.deps,
      channel,
      accountId: delivery.accountId,
      useIndicator: visibility.useIndicator,
    });
  try {
    const dispatchPromise = (async () => {
      const { dispatchInboundMessageWithRoutedChannelDispatcher } =
        await import("../auto-reply/dispatch.js");
      await typing?.onReplyStart();
      const heartbeatContext = {
        Body: appendCronStyleCurrentTimeLine(prepared.prompt, cfg, startedAt),
        From: sender,
        To: sender,
        // BUG-089 C: label the dispatch diagnostics with the real channel —
        // without Surface/Provider the embedded beat dispatch logs
        // `channel=unknown` (dispatch-from-config.gather.ts falls back to
        // "unknown") even though delivery resolution is exact.
        Surface: channel,
        Provider: channel,
        OriginatingChannel: !suppressOriginatingContext ? channel : undefined,
        OriginatingTo: !suppressOriginatingContext ? delivery.to : undefined,
        AccountId: delivery.accountId,
        ChatType: delivery.chatType,
        MessageThreadId: delivery.threadId,
        InternalTurnSource: prepared.hasExecCompletion
          ? "exec"
          : prepared.hasCronEvents
            ? "cron"
            : "heartbeat",
        InputProvenance: {
          kind: "internal_system",
          sourceTool: prepared.hasExecCompletion
            ? "exec"
            : prepared.hasCronEvents
              ? "cron"
              : opts.intent === "scheduled" ||
                  !wake.wakeSource ||
                  wake.wakeSource === "interval" ||
                  wake.wakeSource === "manual"
                ? "heartbeat"
                : wake.wakeSource,
        },
        SessionKey: runSessionKey,
        AgentId: agentId,
      } satisfies MsgContext;
      // One idempotent source-turn id per beat (BUG-070-era invariant): without it
      // internal beats carry no provider message id, the poll prompt cannot mint a
      // channel turn id, and pre-persisted-turn reconciliation re-persists the
      // same prompt (duplicate user prompt per beat).
      setChannelSourceTurnId(heartbeatContext, `heartbeat-beat:v1:${agentId}:${startedAt}`);
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
