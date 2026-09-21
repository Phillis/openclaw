// P0-1 + P0-2 regressions for cron-owned heartbeat failure text and the
// zero-transcript watchdog kill (RCA beat-wedge plan #17).
//
// P0-1: the runner captures the REAL bounded failure text; the cron receipt
// error_text (composed in timer-execution) must carry it — observed live
// 2026-09-21 07:46 beat: "heartbeat failed: agent-runner-failure" with the
// actual runner/provider failure message unrecoverable from any store.
//
// P0-2: a definitive LOCAL watchdog kill must schedule the ordinary recurring
// retry (BUG-089 C machinery stays the only re-execution path) and must stay
// circuit-neutral — no provider failover reason (BUG-002c semantics), so
// lastErrorReason stays undefined and no provider attribution is persisted.
import { describe, expect, it, vi } from "vitest";
import {
  createCronRegressionState,
  createIsolatedRegressionJob,
  setupCronRegressionFixtures,
} from "../../../test/helpers/cron/service-regression-fixtures.js";
import { saveCronStore } from "../store.js";
import type { CronJob } from "../types.js";
import type { CronServiceDeps } from "./state.js";
import { onTimer } from "./timer.test-support.js";

const heartbeatFailureFixtures = setupCronRegressionFixtures({
  prefix: "cron-heartbeat-failure-detail-",
});

const DISTINCTIVE_FAILURE_TEXT =
  "zai upstream hang: request id 4a2f stalled before inference start (provider fetch 60s)";

function requireJob(state: { store?: { jobs?: CronJob[] } | null }, id: string): CronJob {
  const job = state.store?.jobs?.find((candidate) => candidate.id === id);
  if (!job) {
    throw new Error(`expected cron job ${id}`);
  }
  return job;
}

function makeMonitorJob(id: string, scheduledAt: number): CronJob {
  const job = createIsolatedRegressionJob({
    id,
    name: `failure-detail ${id}`,
    scheduledAt,
    schedule: { kind: "every", everyMs: 3_600_000, anchorMs: scheduledAt - 3_600_000 },
    payload: { kind: "heartbeat" },
    state: { nextRunAtMs: scheduledAt },
  });
  return job;
}

describe("cron heartbeat failure text persists into the run error (P0-1)", () => {
  it("composes the real bounded failure text into lastError/receipt error_text", async () => {
    const store = heartbeatFailureFixtures.makeStorePath();
    const scheduledAt = Date.parse("2026-02-06T10:05:00.000Z");
    const cronJob = makeMonitorJob("failure-text-persist", scheduledAt);
    await saveCronStore(store.storePath, { version: 1, jobs: [cronJob] });

    const state = createCronRegressionState({
      storePath: store.storePath,
      defaultAgentId: "main",
      requestHeartbeatAndWait: vi.fn<NonNullable<CronServiceDeps["requestHeartbeatAndWait"]>>(
        async () => ({
          status: "failed" as const,
          reason: "agent-runner-failure",
          failureText: DISTINCTIVE_FAILURE_TEXT,
        }),
      ),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    await onTimer(state);

    const job = requireJob(state, cronJob.id);
    // The receipt/lastError text composes classification + bounded real text.
    expect(job.state.lastError).toBe(
      `heartbeat failed: agent-runner-failure: ${DISTINCTIVE_FAILURE_TEXT}`,
    );
  });

  it("bounds the persisted failure text to 500 characters", async () => {
    const store = heartbeatFailureFixtures.makeStorePath();
    const scheduledAt = Date.parse("2026-02-06T10:05:00.000Z");
    const cronJob = makeMonitorJob("failure-text-bounded", scheduledAt);
    await saveCronStore(store.storePath, { version: 1, jobs: [cronJob] });

    const longText = `${DISTINCTIVE_FAILURE_TEXT} ${"x".repeat(600)}`;
    const state = createCronRegressionState({
      storePath: store.storePath,
      defaultAgentId: "main",
      requestHeartbeatAndWait: vi.fn<NonNullable<CronServiceDeps["requestHeartbeatAndWait"]>>(
        async () => ({
          status: "failed" as const,
          reason: "agent-runner-failure",
          failureText: longText,
        }),
      ),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    await onTimer(state);

    const job = requireJob(state, cronJob.id);
    expect(job.state.lastError).toBeDefined();
    const persisted = job.state.lastError ?? "";
    expect(persisted.startsWith("heartbeat failed: agent-runner-failure: ")).toBe(true);
    const suffix = persisted.slice("heartbeat failed: agent-runner-failure: ".length);
    expect(suffix.length).toBe(500);
    expect(suffix).toBe(longText.slice(0, 500));
  });

  it("keeps the plain classification when the runner has no failure text", async () => {
    const store = heartbeatFailureFixtures.makeStorePath();
    const scheduledAt = Date.parse("2026-02-06T10:05:00.000Z");
    const cronJob = makeMonitorJob("failure-text-absent", scheduledAt);
    await saveCronStore(store.storePath, { version: 1, jobs: [cronJob] });

    const state = createCronRegressionState({
      storePath: store.storePath,
      defaultAgentId: "main",
      requestHeartbeatAndWait: vi.fn<NonNullable<CronServiceDeps["requestHeartbeatAndWait"]>>(
        async () => ({
          status: "failed" as const,
          reason: "agent-runner-failure",
        }),
      ),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    await onTimer(state);

    expect(requireJob(state, cronJob.id).state.lastError).toBe(
      "heartbeat failed: agent-runner-failure",
    );
  });
});

describe("cron zero-transcript watchdog kill schedules the retry circuit-neutral (P0-2)", () => {
  it("schedules the recurring retry and persists no provider failover reason", async () => {
    const store = heartbeatFailureFixtures.makeStorePath();
    const scheduledAt = Date.parse("2026-02-06T10:05:00.000Z");
    const cronJob = makeMonitorJob("watchdog-kill-retry", scheduledAt);
    await saveCronStore(store.storePath, { version: 1, jobs: [cronJob] });

    const log = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
      trace: vi.fn(),
    };
    const state = createCronRegressionState({
      storePath: store.storePath,
      defaultAgentId: "main",
      log,
      requestHeartbeatAndWait: vi.fn<NonNullable<CronServiceDeps["requestHeartbeatAndWait"]>>(
        async () => ({
          status: "failed" as const,
          reason: "zero-transcript-watchdog-kill",
          failureKind: "local_kill",
        }),
      ),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    await onTimer(state);

    const job = requireJob(state, cronJob.id);
    expect(job.state.lastStatus).toBe("error");
    expect(job.state.lastError).toContain("zero-transcript-watchdog-kill");
    // Circuit-neutral: a definitive LOCAL observation is never a provider
    // failure — resolveCronRunErrorReason returns undefined for local_transient,
    // so no classified provider reason is persisted (BUG-002c semantics).
    expect(job.state.lastErrorReason).toBeUndefined();
    // The scheduled retry (BUG-089 C machinery) stays the only re-execution
    // path: consecutiveErrors=1 backs off to the 30 s first slot.
    expect(job.state.consecutiveErrors).toBe(1);
    expect(job.state.lastRunAtMs).toBeDefined();
    expect(job.state.nextRunAtMs).toBe(job.state.lastRunAtMs + 30_000);
    expect(log.info).toHaveBeenCalledWith(
      expect.objectContaining({
        jobId: cronJob.id,
        retryCategory: undefined,
      }),
      "cron: scheduling recurring retry after transient error",
    );
  });
});
