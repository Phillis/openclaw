/** Owns the execution deadline, approval pauses, one compaction grace, and one stream drain grace. */
import { MAX_TIMER_TIMEOUT_MS } from "@openclaw/normalization-core/number-coercion";
import { getLastLlmStreamActivityMs } from "../../../shared/llm-stream-activity.js";
import { observeAgentRunApprovalWait } from "../../agent-run-approval-wait.js";
import type { AgentSession } from "../../sessions/index.js";
import { log } from "../logger.js";
import { createRunBudgetTimeoutError } from "./attempt-finalize.js";
import {
  resolveRunTimeoutDuringCompaction,
  shouldFlagCompactionTimeout,
} from "./compaction-timeout.js";
import type { EmbeddedRunAttemptParams } from "./types.js";

/**
 * Drain grace for an attempt deadline that fires while the model stream is
 * actively producing. Killing a healthy mid-token turn forfeits the entire
 * billed generation and yields zero output, so the deadline extends once per
 * attempt by this budget instead. Constant, not config — product default,
 * same rationale as the compaction grace. The hard abort stays the backstop.
 */
export const RUN_DRAIN_GRACE_MS = 120_000;
/** Chunk recency that qualifies a stream as actively producing. */
const RUN_DRAIN_ACTIVE_WINDOW_MS = 30_000;

interface DrainGraceState {
  used: boolean;
  remainingMs: number;
}

const NO_DRAIN_GRACE: DrainGraceState = { used: false, remainingMs: 0 };

type ExecutionDeadline =
  | {
      kind: "bounded";
      deadlineAtMs: number;
      compactionGraceUsed: boolean;
      drainGrace: DrainGraceState;
    }
  | {
      kind: "paused";
      remainingMs: number;
      compactionGraceUsed: boolean;
      drainGrace: DrainGraceState;
    }
  | { kind: "unlimited" }
  | { kind: "closed" };

type EmbeddedAttemptTimeoutParams = Pick<
  EmbeddedRunAttemptParams,
  "onAttemptDeadlineChanged" | "onAttemptTimeoutArmed" | "runId" | "sessionId" | "timeoutMs"
>;

export function prepareEmbeddedAttemptTimeout(input: {
  attempt: EmbeddedAttemptTimeoutParams;
  activeSession: Pick<AgentSession, "isCompacting" | "isStreaming">;
  compactionState: { isCompacting(): boolean };
  compactionTimeoutMs: number;
  runAbortSignal: AbortSignal;
  isProbeSession: boolean;
  abortRun: (isTimeout?: boolean, reason?: unknown) => void;
  markTimedOutDuringCompaction: () => void;
  markTimedOutByRunBudget: () => void;
}) {
  const { activeSession, attempt, runAbortSignal } = input;
  let deadline: ExecutionDeadline = { kind: "unlimited" };
  let abortTimer: NodeJS.Timeout | undefined;
  let abortWarnTimer: NodeJS.Timeout | undefined;
  const approvalWait = observeAgentRunApprovalWait(attempt);
  const clearTimers = () => {
    deadline = { kind: "closed" };
    approvalWait.dispose();
    runAbortSignal.removeEventListener("abort", clearTimers);
    clearTimeout(abortTimer);
    clearTimeout(abortWarnTimer);
  };
  const timeout = {
    getRunAbortDeadlineAtMs: () =>
      deadline.kind === "bounded" ? deadline.deadlineAtMs : undefined,
    clearTimers,
  };
  if (runAbortSignal.aborted) {
    clearTimers();
    return timeout;
  }
  runAbortSignal.addEventListener("abort", clearTimers, { once: true });

  const scheduleAbortTimer = (
    delayMs: number,
    compactionGraceUsed: boolean,
    drainGrace: DrainGraceState = NO_DRAIN_GRACE,
  ) => {
    const armed = {
      kind: "bounded" as const,
      deadlineAtMs: Date.now() + Math.max(1, delayMs),
      compactionGraceUsed,
      drainGrace,
    };
    deadline = armed;
    abortTimer = setTimeout(
      () => {
        if (deadline !== armed) {
          return;
        }
        const compaction = {
          isCompactionPendingOrRetrying: input.compactionState.isCompacting(),
          isCompactionInFlight: activeSession.isCompacting,
        };
        const timeoutAction = resolveRunTimeoutDuringCompaction({
          ...compaction,
          graceAlreadyUsed: armed.compactionGraceUsed,
        });
        if (timeoutAction === "extend") {
          if (!input.isProbeSession) {
            log.warn(
              `embedded run timeout reached during compaction; extending deadline: ` +
                `runId=${attempt.runId} sessionId=${attempt.sessionId} extraMs=${input.compactionTimeoutMs}`,
            );
          }
          scheduleAbortTimer(input.compactionTimeoutMs, true, armed.drainGrace);
          return;
        }

        // Drain grace: the deadline fired while the model stream was actively
        // producing. Extend once per attempt; mid-grace, re-check in 30s slices
        // so a stream that stalls aborts promptly instead of riding out the
        // full window (the idle watchdog is the parallel stall owner).
        const streamActivelyProducing = () =>
          activeSession.isStreaming &&
          Date.now() - getLastLlmStreamActivityMs(attempt.runId) < RUN_DRAIN_ACTIVE_WINDOW_MS;
        if (armed.drainGrace.remainingMs > 0) {
          if (streamActivelyProducing()) {
            const sliceMs = Math.min(RUN_DRAIN_ACTIVE_WINDOW_MS, armed.drainGrace.remainingMs);
            scheduleAbortTimer(sliceMs, armed.compactionGraceUsed, {
              used: true,
              remainingMs: armed.drainGrace.remainingMs - sliceMs,
            });
            return;
          }
        } else if (!armed.drainGrace.used && streamActivelyProducing()) {
          if (!input.isProbeSession) {
            log.warn(
              `embedded run timeout during active model stream; granting drain grace: ` +
                `runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs} ` +
                `drainGraceMs=${RUN_DRAIN_GRACE_MS}`,
            );
          }
          scheduleAbortTimer(RUN_DRAIN_ACTIVE_WINDOW_MS, armed.compactionGraceUsed, {
            used: true,
            remainingMs: RUN_DRAIN_GRACE_MS - RUN_DRAIN_ACTIVE_WINDOW_MS,
          });
          return;
        }

        // Close scheduling before abort callbacks can resolve approvals or dispose
        // the attempt. Arm the warning first so synchronous cleanup can clear it.
        clearTimers();
        abortWarnTimer = setTimeout(() => {
          if (activeSession.isStreaming && !input.isProbeSession) {
            log.warn(
              `embedded run abort still streaming: runId=${attempt.runId} sessionId=${attempt.sessionId}`,
            );
          }
        }, 10_000);
        if (!input.isProbeSession) {
          log.warn(
            armed.drainGrace.used
              ? `embedded run timeout after stream drain grace: runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs} drainGraceMs=${RUN_DRAIN_GRACE_MS}`
              : armed.compactionGraceUsed
                ? `embedded run timeout after compaction grace: runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs} compactionGraceMs=${input.compactionTimeoutMs}`
                : `embedded run timeout: runId=${attempt.runId} sessionId=${attempt.sessionId} timeoutMs=${attempt.timeoutMs}`,
          );
        }
        if (shouldFlagCompactionTimeout({ isTimeout: true, ...compaction })) {
          input.markTimedOutDuringCompaction();
        }
        // Settlement revalidates timeout ownership before publishing partial output.
        input.markTimedOutByRunBudget();
        // Tag the abort as a run-budget kill so telemetry distinguishes the
        // runner's own wall clock from a provider-side timeout (provider
        // stalls arrive with their own untagged reason and classify as plain
        // `timeout`).
        input.abortRun(true, createRunBudgetTimeoutError());
      },
      Math.max(1, delayMs),
    );
    attempt.onAttemptDeadlineChanged?.({ kind: "bounded", deadlineAtMs: armed.deadlineAtMs });
  };

  approvalWait.onChange = (pending) => {
    if (pending && deadline.kind === "bounded") {
      // Human review preserves the unused execution, compaction-grace, and
      // drain-grace budget; the lane and async-task waiter must not retain its
      // old wall-clock deadline.
      deadline = {
        kind: "paused",
        remainingMs: Math.max(1, deadline.deadlineAtMs - Date.now()),
        compactionGraceUsed: deadline.compactionGraceUsed,
        drainGrace: deadline.drainGrace,
      };
      clearTimeout(abortTimer);
      attempt.onAttemptDeadlineChanged?.({ kind: "unlimited" });
    } else if (!pending && deadline.kind === "paused") {
      scheduleAbortTimer(deadline.remainingMs, deadline.compactionGraceUsed, deadline.drainGrace);
    }
  };
  if (attempt.timeoutMs >= MAX_TIMER_TIMEOUT_MS) {
    attempt.onAttemptDeadlineChanged?.({ kind: "unlimited" });
  } else {
    scheduleAbortTimer(attempt.timeoutMs, false);
  }
  if (!runAbortSignal.aborted) {
    attempt.onAttemptTimeoutArmed?.();
  }
  return timeout;
}
