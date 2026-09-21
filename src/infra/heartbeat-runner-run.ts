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
import { createHeartbeatDispatch, deliverHeartbeatDispatch } from "./heartbeat-dispatch.js";
import { emitHeartbeatEvent, resolveIndicatorType } from "./heartbeat-events.js";
import {
  DEFAULT_HEARTBEAT_TOOL_LOOP_BUDGET,
  heartbeatLog,
  isHeartbeatTypingEnabled,
  resolveHeartbeatChannelPlugin,
  resolveHeartbeatTimeoutOverrideSeconds,
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
            timeoutOverrideSeconds: resolveHeartbeatTimeoutOverrideSeconds(cfg, heartbeat),
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
      return policy.result;
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
      return policy.result;
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
