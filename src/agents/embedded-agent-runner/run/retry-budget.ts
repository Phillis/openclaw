export type RunRetryKind = "progress_continuation" | "recovery";

export type RunRetryBudget = {
  attemptsDispatched: number;
  attemptsCounted: number;
  maxAttempts: number;
};

export function createRunRetryBudget(maxAttempts: number): RunRetryBudget {
  return { attemptsDispatched: 0, attemptsCounted: 0, maxAttempts };
}

export function isRunRetryBudgetExhausted(budget: RunRetryBudget): boolean {
  return budget.attemptsCounted >= budget.maxAttempts;
}

export function beginRunAttempt(budget: RunRetryBudget): void {
  budget.attemptsDispatched += 1;
  budget.attemptsCounted += 1;
}

export function resolveRunRetryKind(params: {
  preflightRecovery: { route: string; truncatedCount?: number };
  retryingFromTranscript: boolean;
  toolMetas: Array<{ isError?: boolean; meta?: string; toolName: string }>;
}): RunRetryKind {
  return params.retryingFromTranscript &&
    params.preflightRecovery.route === "truncate_tool_results_only" &&
    params.preflightRecovery.truncatedCount === 0 &&
    params.toolMetas.some((tool) => tool.isError !== true)
    ? "progress_continuation"
    : "recovery";
}

export function recordRunRetry(budget: RunRetryBudget, kind: RunRetryKind): void {
  if (kind === "progress_continuation") {
    budget.attemptsCounted = Math.max(0, budget.attemptsCounted - 1);
  }
}

export type ToolLoopTurnBudgetStop = {
  shouldStopAfterTurn: () => boolean;
  /** True once the cap withheld the post-tool continuation round of a turn. */
  stopped: () => boolean;
};

/**
 * Hard, non-refundable harness-turn counter for bounded background runs
 * (heartbeat). The closure survives across retry attempts by design — unlike
 * runRetryBudget, exhausting it never refunds. Once it stops the loop, the
 * terminal path owes the run a graceful settled-turn finalization: the stopped
 * turn's assistant text is mid-loop narration, never the run's final answer.
 */
export function createToolLoopTurnBudgetStop(maxTurns: number): ToolLoopTurnBudgetStop {
  let dispatchedTurns = 0;
  let stopped = false;
  return {
    shouldStopAfterTurn: () => {
      stopped ||= ++dispatchedTurns >= maxTurns;
      return stopped;
    },
    stopped: () => stopped,
  };
}

/** Wall-clock reserve that soft-stops dispatch so the summary turn can still run. */
export const RUN_WALL_CLOCK_SOFT_STOP_GRACE_MS = 90_000;

/**
 * Protected finalizer room past the run wall-clock deadline. When the soft
 * stop has fired (or the in-flight turn finished after the deadline inside the
 * drain grace), the remaining budget is ~zero and clamping the tool-free
 * summary turn to it forfeits the whole run's summary. Floor the settled-turn
 * finalization timer at this extension instead. Deliberately the same size as
 * RUN_WALL_CLOCK_SOFT_STOP_GRACE_MS (the reserve the soft stop saves for the
 * summary) and strictly smaller than the hard backstop RUN_DRAIN_GRACE_MS
 * (attempt-timeout-prepare.ts), which stays armed and kills an overrunning
 * finalizer. Constant, not config — coordination with those margins is the
 * invariant, not an operator knob.
 */
export const RUN_SETTLED_FINALIZER_EXTENSION_MS = 90_000;

export type RunWallClockBudgetStop = {
  shouldStopAfterTurn: () => boolean;
  /** True once the wall-clock reserve withheld the post-tool continuation round of a turn. */
  stopped: () => boolean;
};

/**
 * Wall-clock reserve for runs with a deliberate per-run deadline (heartbeat,
 * cron, companion ask). Once the remaining run wall clock drops below the
 * grace, stop dispatching further tool rounds so the terminal path spends the
 * reserve on a tool-free settled-turn summary instead of the hard per-attempt
 * abort firing mid-answer. The hard abort stays armed as the backstop; unlike
 * the turn budget this is clock-derived, so no per-call bookkeeping is needed.
 */
export function createRunWallClockBudgetStop(params: {
  deadlineAtMs: number;
  graceMs: number;
}): RunWallClockBudgetStop {
  let stopped = false;
  return {
    shouldStopAfterTurn: () => {
      stopped ||= Date.now() >= params.deadlineAtMs - params.graceMs;
      return stopped;
    },
    stopped: () => stopped,
  };
}
