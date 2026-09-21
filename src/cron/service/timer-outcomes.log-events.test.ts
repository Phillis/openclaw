// BUG-089 D regression: the durable pre-persist finalization pass re-applies
// the same outcome the publish pass applies — the human-visible warn/info
// lines must be gateable so each outcome logs exactly once (observed live
// 2026-09-17: identical "cron: job run returned error status" +
// "cron: applying error backoff" pairs 5ms apart, log idx 18524+18526).
import { describe, expect, it, vi } from "vitest";
import type { CronJob } from "../types.js";
import { createCronServiceState } from "./state.js";
import { applyJobResult } from "./timer.js";

function makeState() {
  return createCronServiceState({
    storePath: "/tmp/openclaw-cron-log-events-test.json",
    cronEnabled: true,
    cronConfig: {},
    log: { debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() },
    enqueueSystemEvent: vi.fn(),
    requestHeartbeat: vi.fn(),
    sendCronFailureAlert: vi.fn(async () => undefined),
    runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
  });
}

function makeJob(): CronJob {
  return {
    id: "log-events-job",
    name: "Log events job",
    enabled: true,
    createdAtMs: 1,
    updatedAtMs: 1,
    schedule: { kind: "every", everyMs: 1_800_000 },
    sessionTarget: "isolated",
    wakeMode: "next-heartbeat",
    payload: { kind: "agentTurn", message: "beat" },
    delivery: { mode: "none" },
    state: {},
  } as unknown as CronJob;
}

function makeErrorResult() {
  const now = Date.now();
  return {
    status: "error" as const,
    completionStatus: "failed" as const,
    error: "heartbeat failed: agent-runner-failure",
    executionStarted: true,
    startedAt: now - 90_000,
    endedAt: now,
  };
}

describe("applyJobResult logEvents gate (BUG-089 D)", () => {
  it("logs warn + backoff info once by default and mutates state", () => {
    const state = makeState();
    const job = makeJob();
    applyJobResult(state, job, makeErrorResult(), { deferredNotifications: [] });
    expect(job.state.consecutiveErrors).toBe(1);
    expect(job.state.lastError).toContain("agent-runner-failure");
    expect(job.state.nextRunAtMs).toBeDefined();
    expect(state.deps.log.warn).toHaveBeenCalledTimes(1);
    expect(state.deps.log.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: "log-events-job",
        error: expect.stringContaining("agent-runner-failure"),
      }),
      "cron: job run returned error status",
    );
    expect(state.deps.log.info).toHaveBeenCalledWith(
      expect.objectContaining({ jobId: "log-events-job", backoffMs: 30_000 }),
      "cron: applying error backoff",
    );
  });

  it("logEvents:false suppresses warn + backoff info but state still updates", () => {
    const state = makeState();
    const job = makeJob();
    applyJobResult(state, job, makeErrorResult(), {
      deferredNotifications: [],
      logEvents: false,
    });
    expect(job.state.consecutiveErrors).toBe(1);
    expect(job.state.lastError).toContain("agent-runner-failure");
    expect(job.state.nextRunAtMs).toBeDefined();
    expect(state.deps.log.warn).not.toHaveBeenCalled();
    expect(state.deps.log.info).not.toHaveBeenCalled();
  });
});

// P0-1 (RCA beat-wedge plan #17): the receipt's error text composes the real
// bounded runner failure text — "heartbeat failed: agent-runner-failure: <text>"
// — so the next wedge is diagnosable in one receipt query.
describe("applyJobResult failure text composition (P0-1)", () => {
  it("extends the error text with a distinctive real failure text", () => {
    const state = makeState();
    const job = makeJob();
    const result = {
      ...makeErrorResult(),
      error: "heartbeat failed: agent-runner-failure: provider hang after 60s model fetch",
    };
    applyJobResult(state, job, result, { deferredNotifications: [] });
    expect(job.state.lastError).toBe(
      "heartbeat failed: agent-runner-failure: provider hang after 60s model fetch",
    );
    expect(state.deps.log.warn).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: "log-events-job",
        error: expect.stringContaining("provider hang after 60s model fetch"),
      }),
      "cron: job run returned error status",
    );
  });

  it("persists no classified provider reason for a definitive local kill (P0-2)", () => {
    const state = makeState();
    const job = makeJob();
    const result = {
      ...makeErrorResult(),
      error: "heartbeat failed: zero-transcript-watchdog-kill",
      errorClassification: { kind: "local_transient" as const },
    };
    applyJobResult(state, job, result, { deferredNotifications: [] });
    // lastErrorReason stays undefined: the kill is circuit-neutral — never a
    // provider failover reason (BUG-002c semantics).
    expect(job.state.lastErrorReason).toBeUndefined();
    expect(job.state.lastError).toContain("zero-transcript-watchdog-kill");
  });
});
