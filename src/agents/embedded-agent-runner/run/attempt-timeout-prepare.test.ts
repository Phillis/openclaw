// Coverage for attempt timeout ownership and cleanup.
import { getEventListeners } from "node:events";
import { MAX_TIMER_TIMEOUT_MS } from "@openclaw/normalization-core/number-coercion";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { emitAgentEvent } from "../../../infra/agent-events.js";
import {
  clearLlmStreamActivityRun,
  notifyLlmStreamActivity,
} from "../../../shared/llm-stream-activity.js";
import { createEmbeddedAttemptRunAbort } from "./attempt-finalize.js";
import { prepareEmbeddedAttemptTimeout, RUN_DRAIN_GRACE_MS } from "./attempt-timeout-prepare.js";
import type { EmbeddedRunAttemptParams } from "./types.js";

type DeadlineChanged = NonNullable<EmbeddedRunAttemptParams["onAttemptDeadlineChanged"]>;
const timeoutCleanups: Array<() => void> = [];

function emitApproval(
  phase: "waiting-approval" | "approval-resolved",
  approvalId: string,
  runId = "run-1",
  sessionId = "session-1",
) {
  emitAgentEvent({ runId, sessionId, stream: "lifecycle", data: { phase, approvalId } });
}

function createTimeoutHarness(options?: {
  pendingCompaction?: boolean;
  compactionInFlight?: boolean;
  timeoutMs?: number;
  runAbortController?: AbortController;
  onDeadline?: DeadlineChanged;
}) {
  const state = {
    pendingCompaction: options?.pendingCompaction ?? false,
    compactionInFlight: options?.compactionInFlight ?? false,
    streaming: false,
  };
  const runAbortController = options?.runAbortController ?? new AbortController();
  const abortRun = vi.fn();
  const markTimedOutDuringCompaction = vi.fn();
  const markTimedOutByRunBudget = vi.fn();
  const onAttemptTimeoutArmed = vi.fn();
  const onAttemptDeadlineChanged = vi.fn<DeadlineChanged>(options?.onDeadline);
  const input = {
    attempt: {
      runId: "run-1",
      sessionId: "session-1",
      timeoutMs: options?.timeoutMs ?? 100,
      onAttemptTimeoutArmed,
      onAttemptDeadlineChanged,
    },
    runAbortSignal: runAbortController.signal,
    activeSession: {
      get isCompacting() {
        return state.compactionInFlight;
      },
      get isStreaming() {
        return state.streaming;
      },
    },
    compactionState: {
      isCompacting: () => state.pendingCompaction,
    },
    compactionTimeoutMs: 50,
    isProbeSession: true,
    abortRun,
    markTimedOutDuringCompaction,
    markTimedOutByRunBudget,
  };
  const timeout = prepareEmbeddedAttemptTimeout(input);
  timeoutCleanups.push(timeout.clearTimers);
  return {
    abortRun,
    markTimedOutDuringCompaction,
    markTimedOutByRunBudget,
    onAttemptTimeoutArmed,
    onAttemptDeadlineChanged,
    runAbortController,
    state,
    timeout,
  };
}

describe("prepareEmbeddedAttemptTimeout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
    clearLlmStreamActivityRun("run-1");
  });

  afterEach(() => {
    for (const cleanup of timeoutCleanups.splice(0)) {
      cleanup();
    }
    vi.useRealTimers();
  });

  it("publishes the exact execution deadline before firing the run budget timeout", async () => {
    const harness = createTimeoutHarness();

    expect(harness.onAttemptTimeoutArmed).toHaveBeenCalledOnce();
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
    ]);
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBe(100);
    await vi.advanceTimersByTimeAsync(100);

    expect(harness.markTimedOutByRunBudget).toHaveBeenCalledOnce();
    expect(harness.abortRun).toHaveBeenCalledWith(
      true,
      expect.objectContaining({
        name: "TimeoutError",
        message: "request timed out",
        code: "OPENCLAW_RUN_BUDGET_TIMEOUT",
      }),
    );
    // The run-budget marker must be recorded before the abort so settlement
    // can re-confirm terminal ownership before committing partial output; the
    // timeout callback itself never commits buffered text.
    const markOrder = harness.markTimedOutByRunBudget.mock.invocationCallOrder[0];
    const abortOrder = harness.abortRun.mock.invocationCallOrder[0];
    expect(markOrder).toBeDefined();
    expect(abortOrder).toBeDefined();
    expect(markOrder ?? -1).toBeLessThan(abortOrder ?? -1);
    harness.timeout.clearTimers();
  });

  it("propagates the built-in deadline reason", async () => {
    const runAbortController = new AbortController();
    const abortRun = createEmbeddedAttemptRunAbort({
      abortActiveSession: vi.fn(async () => {}),
      activeSession: { abortCompaction: vi.fn(), isCompacting: false },
      attempt: {
        runId: "run-deadline",
        sessionFile: "agent:main:main",
        sessionId: "session-deadline",
        sessionKey: "agent:main:main",
      },
      getQueueHandle: () => undefined,
      isProbeSession: true,
      log: { warn: vi.fn() },
      runAbortController,
      state: { terminal: { kind: "ok" } },
    });
    const input = {
      attempt: {
        runId: "run-deadline",
        sessionId: "session-deadline",
        timeoutMs: 100,
      },
      runAbortSignal: runAbortController.signal,
      activeSession: { isCompacting: false, isStreaming: false },
      compactionState: { isCompacting: () => false },
      compactionTimeoutMs: 50,
      isProbeSession: true,
      abortRun,
      markTimedOutDuringCompaction: vi.fn(),
      markTimedOutByRunBudget: vi.fn(),
    };
    const timeout = prepareEmbeddedAttemptTimeout(input);
    timeoutCleanups.push(timeout.clearTimers);

    await vi.advanceTimersByTimeAsync(100);

    expect(runAbortController.signal.reason).toEqual(
      expect.objectContaining({
        name: "TimeoutError",
        message: "request timed out",
        code: "OPENCLAW_RUN_BUDGET_TIMEOUT",
      }),
    );
    timeout.clearTimers();
  });

  it("pauses exactly the original run budget until all scoped approvals resolve", async () => {
    const harness = createTimeoutHarness();

    await vi.advanceTimersByTimeAsync(30);
    emitApproval("waiting-approval", "first");
    emitApproval("waiting-approval", "second");
    await vi.advanceTimersByTimeAsync(500);
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBeUndefined();
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
      [{ kind: "unlimited" }],
    ]);

    emitApproval("approval-resolved", "first", "another-run");
    emitApproval("approval-resolved", "first", "run-1", "another-session");
    emitApproval("approval-resolved", "first");
    await vi.advanceTimersByTimeAsync(100);
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(harness.onAttemptDeadlineChanged).toHaveBeenCalledTimes(2);

    emitApproval("approval-resolved", "second");
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBe(700);
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
      [{ kind: "unlimited" }],
      [{ kind: "bounded", deadlineAtMs: 700 }],
    ]);
    await vi.advanceTimersByTimeAsync(69);
    expect(harness.abortRun).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);

    expect(harness.markTimedOutByRunBudget).toHaveBeenCalledOnce();
    expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
    harness.timeout.clearTimers();
  });

  it("pauses only the unused compaction grace budget during inline approval", async () => {
    const harness = createTimeoutHarness({ pendingCompaction: true });
    await vi.advanceTimersByTimeAsync(120);
    emitApproval("waiting-approval", "grace");
    await vi.advanceTimersByTimeAsync(500);
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBeUndefined();

    harness.state.pendingCompaction = false;
    emitApproval("approval-resolved", "grace");
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
      [{ kind: "bounded", deadlineAtMs: 150 }],
      [{ kind: "unlimited" }],
      [{ kind: "bounded", deadlineAtMs: 650 }],
    ]);
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBe(650);
    await vi.advanceTimersByTimeAsync(29);
    expect(harness.abortRun).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);

    expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
    harness.timeout.clearTimers();
  });

  it.each([
    { name: "pending", pendingCompaction: true },
    { name: "in-flight", compactionInFlight: true },
  ])("publishes only one grace deadline for $name compaction", async (options) => {
    const harness = createTimeoutHarness(options);

    await vi.advanceTimersByTimeAsync(100);
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBe(150);
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
      [{ kind: "bounded", deadlineAtMs: 150 }],
    ]);

    await vi.advanceTimersByTimeAsync(50);
    expect(harness.markTimedOutDuringCompaction).toHaveBeenCalledOnce();
    expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
    expect(harness.onAttemptDeadlineChanged).toHaveBeenCalledTimes(2);
  });

  it("publishes an unlimited run without arming a timer or inventing a finite deadline", async () => {
    const harness = createTimeoutHarness({ timeoutMs: MAX_TIMER_TIMEOUT_MS });

    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([[{ kind: "unlimited" }]]);
    expect(harness.onAttemptTimeoutArmed).toHaveBeenCalledOnce();
    expect(harness.timeout.getRunAbortDeadlineAtMs()).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
    emitApproval("waiting-approval", "unlimited");
    await vi.advanceTimersByTimeAsync(MAX_TIMER_TIMEOUT_MS + 1);
    emitApproval("approval-resolved", "unlimited");

    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(harness.markTimedOutByRunBudget).not.toHaveBeenCalled();
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([[{ kind: "unlimited" }]]);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([100, MAX_TIMER_TIMEOUT_MS])(
    "does not publish or arm a pre-aborted run with budget %i",
    async (timeoutMs) => {
      const runAbortController = new AbortController();
      runAbortController.abort(new Error("cancelled before timer preparation"));
      const harness = createTimeoutHarness({ timeoutMs, runAbortController });

      emitApproval("waiting-approval", "late");
      emitApproval("approval-resolved", "late");
      await vi.advanceTimersByTimeAsync(200);

      expect(harness.onAttemptDeadlineChanged).not.toHaveBeenCalled();
      expect(harness.onAttemptTimeoutArmed).not.toHaveBeenCalled();
      expect(harness.abortRun).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
      expect(getEventListeners(runAbortController.signal, "abort")).toHaveLength(0);
    },
  );

  it.each(["running", "approval-paused", "compaction-grace"] as const)(
    "closes a %s deadline on local run abort without late approval resurrection",
    async (phase) => {
      const harness = createTimeoutHarness({ pendingCompaction: phase === "compaction-grace" });
      await vi.advanceTimersByTimeAsync(phase === "compaction-grace" ? 120 : 30);
      if (phase === "approval-paused") {
        emitApproval("waiting-approval", "pending");
      }
      const published = harness.onAttemptDeadlineChanged.mock.calls.slice();

      harness.runAbortController.abort(new Error("local run cancelled"));
      emitApproval("approval-resolved", "pending");
      emitApproval("waiting-approval", "late");
      emitApproval("approval-resolved", "late");
      await vi.advanceTimersByTimeAsync(200);

      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual(published);
      expect(harness.markTimedOutByRunBudget).not.toHaveBeenCalled();
      expect(harness.abortRun).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
      expect(getEventListeners(harness.runAbortController.signal, "abort")).toHaveLength(0);
    },
  );

  it("does not retain scheduling when deadline publication synchronously aborts the owner", async () => {
    const runAbortController = new AbortController();
    const harness = createTimeoutHarness({
      runAbortController,
      onDeadline: () => runAbortController.abort(new Error("owner closed during publication")),
    });

    await vi.advanceTimersByTimeAsync(200);

    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
    ]);
    expect(harness.onAttemptTimeoutArmed).not.toHaveBeenCalled();
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(getEventListeners(runAbortController.signal, "abort")).toHaveLength(0);
  });

  it("does not resurrect timers or deadline publications during synchronous timeout cleanup", async () => {
    const harness = createTimeoutHarness();
    harness.abortRun.mockImplementation(() => {
      emitApproval("waiting-approval", "late");
      emitApproval("approval-resolved", "late");
      harness.timeout.clearTimers();
    });

    await vi.advanceTimersByTimeAsync(100);

    expect(harness.abortRun).toHaveBeenCalledOnce();
    expect(vi.getTimerCount()).toBe(0);
    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
      [{ kind: "bounded", deadlineAtMs: 100 }],
    ]);
    await vi.advanceTimersByTimeAsync(20_000);
    expect(harness.abortRun).toHaveBeenCalledOnce();
  });

  it.each([false, true])("cleans up the run deadline permanently (paused=%s)", async (paused) => {
    const harness = createTimeoutHarness();
    if (paused) {
      emitApproval("waiting-approval", "pending");
    }
    const published = harness.onAttemptDeadlineChanged.mock.calls.slice();

    harness.timeout.clearTimers();
    harness.timeout.clearTimers();
    emitApproval("approval-resolved", "pending");
    emitApproval("waiting-approval", "late");
    emitApproval("approval-resolved", "late");
    await vi.advanceTimersByTimeAsync(100);

    expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual(published);
    expect(harness.markTimedOutByRunBudget).not.toHaveBeenCalled();
    expect(harness.abortRun).not.toHaveBeenCalled();
    expect(vi.getTimerCount()).toBe(0);
    expect(getEventListeners(harness.runAbortController.signal, "abort")).toHaveLength(0);
  });

  describe("stream drain grace", () => {
    // Second-scale clock: the 30s active-stream window must be able to
    // discriminate chunks from silence, so every deadline here lives at t=60s.
    const DEADLINE_MS = 60_000;

    it("grants the drain grace once for an actively producing stream and hard-aborts at deadline+grace", async () => {
      const harness = createTimeoutHarness({ timeoutMs: DEADLINE_MS });
      harness.state.streaming = true;

      // Chunk 1s before the deadline: the fire sees an actively producing
      // stream and grants the once-per-attempt grace instead of killing
      // mid-token. Chunks keep arriving, so the grace is spent in 30s slices
      // until the full RUN_DRAIN_GRACE_MS budget is consumed, then the hard
      // abort (backstop) fires exactly once.
      await vi.advanceTimersByTimeAsync(DEADLINE_MS - 1_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(harness.abortRun).not.toHaveBeenCalled();
      for (const sliceFire of [90_000, 120_000, 150_000, 180_000]) {
        await vi.advanceTimersByTimeAsync(29_000);
        notifyLlmStreamActivity("run-1");
        await vi.advanceTimersByTimeAsync(1_000);
        if (sliceFire < 180_000) {
          expect(harness.abortRun).not.toHaveBeenCalled();
        }
      }

      expect(harness.abortRun).toHaveBeenCalledOnce();
      expect(harness.abortRun).toHaveBeenCalledWith(
        true,
        expect.objectContaining({
          code: "OPENCLAW_RUN_BUDGET_TIMEOUT",
        }),
      );
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: 60_000 }],
        [{ kind: "bounded", deadlineAtMs: 90_000 }],
        [{ kind: "bounded", deadlineAtMs: 120_000 }],
        [{ kind: "bounded", deadlineAtMs: 150_000 }],
        [{ kind: "bounded", deadlineAtMs: 180_000 }],
      ]);
      expect(180_000 - 60_000).toBe(RUN_DRAIN_GRACE_MS);
      await vi.advanceTimersByTimeAsync(60_000);
      expect(harness.abortRun).toHaveBeenCalledOnce();
      harness.timeout.clearTimers();
    });

    it("lets the turn complete inside the drain grace without aborting", async () => {
      const harness = createTimeoutHarness({ timeoutMs: DEADLINE_MS });
      harness.state.streaming = true;

      await vi.advanceTimersByTimeAsync(DEADLINE_MS - 1_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(harness.abortRun).not.toHaveBeenCalled();

      // The turn finishes mid-grace: normal run teardown aborts the run signal,
      // which must clear the grace timer — no late abort, no double fire.
      harness.runAbortController.abort(new Error("turn completed"));
      await vi.advanceTimersByTimeAsync(RUN_DRAIN_GRACE_MS);

      expect(harness.abortRun).not.toHaveBeenCalled();
      expect(harness.markTimedOutByRunBudget).not.toHaveBeenCalled();
      expect(vi.getTimerCount()).toBe(0);
    });

    it("does not grant the drain grace to an idle (stalled) stream", async () => {
      const harness = createTimeoutHarness({ timeoutMs: DEADLINE_MS });
      // Streaming is open but no chunk has ever arrived (last-activity epoch
      // is 0 and the clock sits 60s past it): the stream is stalled, so the
      // deadline owns the kill immediately instead of lending it grace.
      harness.state.streaming = true;

      await vi.advanceTimersByTimeAsync(DEADLINE_MS);

      expect(harness.abortRun).toHaveBeenCalledOnce();
      expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: DEADLINE_MS }],
      ]);
      harness.timeout.clearTimers();
    });

    it("aborts a stream that stalls during the drain grace at the next slice", async () => {
      const harness = createTimeoutHarness({ timeoutMs: DEADLINE_MS });
      harness.state.streaming = true;

      await vi.advanceTimersByTimeAsync(DEADLINE_MS - 1_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(harness.abortRun).not.toHaveBeenCalled();

      // Chunks stop after the grant: the first 30s slice fire sees a stalled
      // stream (30s+ of silence) and aborts instead of riding out the
      // remaining 90s of grace.
      await vi.advanceTimersByTimeAsync(100_000);

      expect(harness.abortRun).toHaveBeenCalledOnce();
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: DEADLINE_MS }],
        [{ kind: "bounded", deadlineAtMs: 90_000 }],
      ]);
      await vi.advanceTimersByTimeAsync(RUN_DRAIN_GRACE_MS);
      expect(harness.abortRun).toHaveBeenCalledOnce();
      harness.timeout.clearTimers();
    });

    it("composes compaction grace and drain grace without double extension", async () => {
      const harness = createTimeoutHarness({ pendingCompaction: true, timeoutMs: DEADLINE_MS });
      harness.state.streaming = true;

      // t=60s fires into a pending compaction: the compaction grace extends
      // first (existing ownership unchanged).
      await vi.advanceTimersByTimeAsync(DEADLINE_MS - 1_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(harness.abortRun).not.toHaveBeenCalled();
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: 60_000 }],
        [{ kind: "bounded", deadlineAtMs: 60_050 }],
      ]);

      // Compaction settles; the still-producing stream now earns its (single)
      // drain grace from the compaction-grace fire.
      harness.state.pendingCompaction = false;
      harness.state.compactionInFlight = false;
      await vi.advanceTimersByTimeAsync(49);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1);
      for (const sliceFire of [90_050, 120_050, 150_050, 180_050]) {
        await vi.advanceTimersByTimeAsync(29_000);
        notifyLlmStreamActivity("run-1");
        await vi.advanceTimersByTimeAsync(1_000);
        if (sliceFire < 180_050) {
          expect(harness.abortRun).not.toHaveBeenCalled();
        }
      }

      expect(harness.abortRun).toHaveBeenCalledOnce();
      expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: 60_000 }],
        [{ kind: "bounded", deadlineAtMs: 60_050 }],
        [{ kind: "bounded", deadlineAtMs: 90_050 }],
        [{ kind: "bounded", deadlineAtMs: 120_050 }],
        [{ kind: "bounded", deadlineAtMs: 150_050 }],
        [{ kind: "bounded", deadlineAtMs: 180_050 }],
      ]);
      expect(harness.markTimedOutDuringCompaction).not.toHaveBeenCalled();
      harness.timeout.clearTimers();
    });

    it("carries the remaining drain budget through an approval pause/resume", async () => {
      const harness = createTimeoutHarness({ timeoutMs: DEADLINE_MS });
      harness.state.streaming = true;

      await vi.advanceTimersByTimeAsync(DEADLINE_MS - 1_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      await vi.advanceTimersByTimeAsync(29_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      // t=90s slice consumed; next deadline t=120s with 60s grace left.
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: 60_000 }],
        [{ kind: "bounded", deadlineAtMs: 90_000 }],
        [{ kind: "bounded", deadlineAtMs: 120_000 }],
      ]);

      // Human review pauses mid-grace at t=100s (20s until the slice fire).
      await vi.advanceTimersByTimeAsync(10_000);
      emitApproval("waiting-approval", "g1");
      await vi.advanceTimersByTimeAsync(500_000);
      expect(harness.abortRun).not.toHaveBeenCalled();

      // Resume at t=600s with a fresh chunk: the paused 20s slice remainder
      // plus the 60s unused drain budget must survive — a lost state would
      // grant a fresh 120s grace and abort at t=740s instead of t=680s.
      notifyLlmStreamActivity("run-1");
      emitApproval("approval-resolved", "g1");
      await vi.advanceTimersByTimeAsync(20_000);
      await vi.advanceTimersByTimeAsync(29_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);
      expect(harness.abortRun).not.toHaveBeenCalled();
      await vi.advanceTimersByTimeAsync(29_000);
      notifyLlmStreamActivity("run-1");
      await vi.advanceTimersByTimeAsync(1_000);

      expect(harness.abortRun).toHaveBeenCalledOnce();
      expect(harness.abortRun).toHaveBeenCalledWith(true, expect.any(Error));
      expect(harness.onAttemptDeadlineChanged.mock.calls).toEqual([
        [{ kind: "bounded", deadlineAtMs: 60_000 }],
        [{ kind: "bounded", deadlineAtMs: 90_000 }],
        [{ kind: "bounded", deadlineAtMs: 120_000 }],
        [{ kind: "unlimited" }],
        [{ kind: "bounded", deadlineAtMs: 620_000 }],
        [{ kind: "bounded", deadlineAtMs: 650_000 }],
        [{ kind: "bounded", deadlineAtMs: 680_000 }],
      ]);
      harness.timeout.clearTimers();
    });
  });
});
