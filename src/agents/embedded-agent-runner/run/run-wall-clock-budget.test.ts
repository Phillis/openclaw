import { MAX_TIMER_TIMEOUT_MS } from "@openclaw/normalization-core/number-coercion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { RUN_DRAIN_GRACE_MS } from "./attempt-timeout-prepare.js";
import {
  createRunWallClockBudgetStop,
  RUN_SETTLED_FINALIZER_EXTENSION_MS,
} from "./retry-budget.js";
import { resolveEmbeddedRunWallClockBudget } from "./run-wall-clock-budget.js";

describe("embedded run wall-clock budget", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("stops only inside the pre-deadline reserve and stays stopped", () => {
    const startedAtMs = Date.now();
    const stop = createRunWallClockBudgetStop({
      deadlineAtMs: startedAtMs + 10_000,
      graceMs: 2_000,
    });
    expect(stop.stopped()).toBe(false);
    vi.advanceTimersByTime(7_999);
    expect(stop.shouldStopAfterTurn()).toBe(false);
    expect(stop.stopped()).toBe(false);
    vi.advanceTimersByTime(2);
    expect(stop.shouldStopAfterTurn()).toBe(true);
    expect(stop.stopped()).toBe(true);
    // The latch is sticky: later turns keep seeing the stop even if the clock
    // were somehow rolled back.
    vi.setSystemTime(Date.now() - 5_000);
    expect(stop.shouldStopAfterTurn()).toBe(true);
  });

  it("derives the run deadline from the deliberate override and clamps attempts", () => {
    const startedAtMs = Date.now();
    const budget = resolveEmbeddedRunWallClockBudget({
      runTimeoutOverrideMs: 30_000,
      startedAtMs,
      maxToolLoopAttempts: undefined,
      shouldStopAfterTurn: undefined,
    });
    expect(budget.runDeadlineAtMs).toBe(startedAtMs + 30_000);
    // No elapsed wall clock: the full attempt budget survives.
    expect(budget.resolveAttemptTimeoutMs(30_000)).toBe(30_000);
    expect(budget.resolveAttemptTimeoutMs(45_000)).toBe(30_000);
    vi.advanceTimersByTime(12_345);
    // The retry re-derives from the real clock: only the remainder is armed.
    expect(budget.resolveAttemptTimeoutMs(30_000)).toBe(30_000 - 12_345);
    // A bottomed-out budget still dispatches instead of going unbounded.
    vi.advanceTimersByTime(30_000);
    expect(budget.resolveAttemptTimeoutMs(30_000)).toBe(1);
  });

  it("keeps runs without a deliberate override unbounded", () => {
    const budget = resolveEmbeddedRunWallClockBudget({
      runTimeoutOverrideMs: undefined,
      startedAtMs: Date.now(),
      maxToolLoopAttempts: undefined,
      shouldStopAfterTurn: undefined,
    });
    expect(budget.runDeadlineAtMs).toBeUndefined();
    expect(budget.resolveAttemptTimeoutMs(30_000)).toBeUndefined();
    expect(budget.shouldStopAfterTurn).toBeUndefined();
    expect(budget.budgetStopped()).toBe(false);
  });

  it("treats the unlimited sentinel override as no deadline", () => {
    const budget = resolveEmbeddedRunWallClockBudget({
      runTimeoutOverrideMs: MAX_TIMER_TIMEOUT_MS,
      startedAtMs: Date.now(),
      maxToolLoopAttempts: undefined,
      shouldStopAfterTurn: undefined,
    });
    expect(budget.runDeadlineAtMs).toBeUndefined();
    expect(budget.resolveAttemptTimeoutMs(MAX_TIMER_TIMEOUT_MS)).toBeUndefined();
  });

  it("composes the caller hook, turn budget, and wall-clock stop into one hook", () => {
    const startedAtMs = Date.now();
    const callerStops: boolean[] = [];
    const budget = resolveEmbeddedRunWallClockBudget({
      runTimeoutOverrideMs: 300_000,
      startedAtMs,
      maxToolLoopAttempts: 3,
      shouldStopAfterTurn: () => {
        callerStops.push(true);
        return callerStops.length === 2;
      },
    });
    // Turn 1: nothing tripped yet.
    expect(budget.shouldStopAfterTurn?.()).toBe(false);
    expect(callerStops).toHaveLength(1);
    expect(budget.budgetStopped()).toBe(false);
    // Turn 2: the caller hook alone stops the loop.
    expect(budget.shouldStopAfterTurn?.()).toBe(true);
    expect(budget.budgetStopped()).toBe(false);
    // Turn 2 skipped the turn-budget hook (short-circuit), so the cap lands
    // after the third counted turn.
    expect(budget.shouldStopAfterTurn?.()).toBe(false);
    expect(budget.shouldStopAfterTurn?.()).toBe(true);
    expect(budget.budgetStopped()).toBe(true);
  });

  it("latches the wall-clock stop into budgetStopped inside the reserve", () => {
    const budget = resolveEmbeddedRunWallClockBudget({
      runTimeoutOverrideMs: 300_000,
      startedAtMs: Date.now(),
      maxToolLoopAttempts: undefined,
      shouldStopAfterTurn: undefined,
    });
    expect(budget.shouldStopAfterTurn?.()).toBe(false);
    expect(budget.budgetStopped()).toBe(false);
    // Inside the 90s reserve before the 5-minute deadline.
    vi.advanceTimersByTime(300_000 - 90_000 + 1);
    expect(budget.shouldStopAfterTurn?.()).toBe(true);
    expect(budget.budgetStopped()).toBe(true);
  });

  it("does not install a stop hook when neither cap applies", () => {
    const budget = resolveEmbeddedRunWallClockBudget({
      startedAtMs: Date.now(),
      maxToolLoopAttempts: undefined,
      shouldStopAfterTurn: undefined,
    });
    expect(budget.shouldStopAfterTurn).toBeUndefined();
  });

  it("keeps the settled-finalizer extension inside the hard drain backstop", () => {
    // Constant coordination: the protected finalizer extension must fit
    // inside the hard drain/backstop margin, so a summary turn granted past
    // the deadline is still cut by the armed backstop instead of outliving it.
    expect(RUN_SETTLED_FINALIZER_EXTENSION_MS).toBeLessThanOrEqual(RUN_DRAIN_GRACE_MS);
  });
});
