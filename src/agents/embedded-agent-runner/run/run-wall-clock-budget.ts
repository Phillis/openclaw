/** Run-level wall-clock enforcement for bounded background runs. */
import { MAX_TIMER_TIMEOUT_MS } from "@openclaw/normalization-core/number-coercion";
import {
  createRunWallClockBudgetStop,
  createToolLoopTurnBudgetStop,
  RUN_WALL_CLOCK_SOFT_STOP_GRACE_MS,
} from "./retry-budget.js";

export type EmbeddedRunWallClockBudget = {
  /** Absolute run deadline; undefined when the run carries no deliberate wall clock. */
  runDeadlineAtMs: number | undefined;
  /**
   * Clamps one attempt timeout onto the remaining run wall clock (undefined =
   * unbounded run). Dispatch re-derives it from the real clock each attempt,
   * so a retry chain can never re-arm the full override past the deadline.
   */
  resolveAttemptTimeoutMs: (timeoutMs: number) => number | undefined;
  /** True once any run cap (turn budget or wall clock) withheld the continuation round. */
  budgetStopped: () => boolean;
  /** Composed per-turn stop hook; undefined when neither cap applies. */
  shouldStopAfterTurn: (() => boolean) | undefined;
};

/**
 * Bounded background runs carry a deliberate per-run wall clock (heartbeat,
 * cron, companion ask). Enforce it at the run level: each attempt's timer is
 * clamped to the remaining wall clock so a retry cannot re-arm the full
 * override past the deadline, and a soft stop reserves the final grace for
 * the settled-turn summary instead of the hard abort firing mid-answer. The
 * hard per-attempt abort stays armed as the backstop. User/manual turns keep
 * today's per-attempt semantics — only runs that carry the override get a
 * run deadline.
 */
export function resolveEmbeddedRunWallClockBudget(params: {
  runTimeoutOverrideMs?: number;
  maxToolLoopAttempts?: number;
  shouldStopAfterTurn?: () => boolean;
  startedAtMs: number;
}): EmbeddedRunWallClockBudget {
  const toolLoopBudgetStop =
    params.maxToolLoopAttempts !== undefined
      ? createToolLoopTurnBudgetStop(params.maxToolLoopAttempts)
      : undefined;
  // The unlimited sentinel (`agents.defaults.timeoutSeconds: 0`) is not a
  // deadline: clamping against it would silently re-arm a ~24.8-day timer on
  // explicitly unlimited runs.
  const runDeadlineAtMs =
    params.runTimeoutOverrideMs !== undefined &&
    params.runTimeoutOverrideMs > 0 &&
    params.runTimeoutOverrideMs < MAX_TIMER_TIMEOUT_MS
      ? params.startedAtMs + params.runTimeoutOverrideMs
      : undefined;
  const runWallClockBudgetStop =
    runDeadlineAtMs !== undefined
      ? createRunWallClockBudgetStop({
          deadlineAtMs: runDeadlineAtMs,
          graceMs: RUN_WALL_CLOCK_SOFT_STOP_GRACE_MS,
        })
      : undefined;
  const shouldStopAfterTurnHooks = [
    ...(params.shouldStopAfterTurn ? [params.shouldStopAfterTurn] : []),
    ...(toolLoopBudgetStop ? [toolLoopBudgetStop.shouldStopAfterTurn] : []),
    ...(runWallClockBudgetStop ? [runWallClockBudgetStop.shouldStopAfterTurn] : []),
  ];
  return {
    runDeadlineAtMs,
    resolveAttemptTimeoutMs: (timeoutMs) =>
      runDeadlineAtMs === undefined
        ? undefined
        : Math.max(1, Math.min(timeoutMs, runDeadlineAtMs - Date.now())),
    budgetStopped: () =>
      toolLoopBudgetStop?.stopped() === true || runWallClockBudgetStop?.stopped() === true,
    shouldStopAfterTurn:
      shouldStopAfterTurnHooks.length > 0
        ? () => shouldStopAfterTurnHooks.some((hook) => hook())
        : undefined,
  };
}
