import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const NOW_MS = Date.parse("2026-07-27T10:00:00.000Z");
const PLAN_SHA256 = `sha256:${"a".repeat(64)}`;
const RUN_ID = "class-simple-10-real-guard-test";

let root = "";
let stateDirectory = "";
let guardPath = "";
let rolloutLockPath = "";

function guard(overrides: Record<string, unknown> = {}) {
  return {
    schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
    status: "active",
    runId: RUN_ID,
    planSha256: PLAN_SHA256,
    startsAt: "2026-07-27T09:59:00.000Z",
    expiresAt: "2026-07-28T09:59:00.000Z",
    blockedActions: ["add", "remove", "update"],
    allowScheduledExecution: true,
    ...overrides,
  };
}

async function writeOwnerOnlyJson(filePath: string, value: unknown, mode = 0o400) {
  await fs.rm(filePath, { force: true });
  await fs.writeFile(filePath, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  await fs.chmod(filePath, mode);
}

async function installExactGuardAndLock() {
  await writeOwnerOnlyJson(guardPath, guard());
  await writeOwnerOnlyJson(
    rolloutLockPath,
    {
      outputDir: path.join(root, "output"),
      planSha256: PLAN_SHA256,
      runId: RUN_ID,
    },
    0o600,
  );
}

beforeEach(async () => {
  root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "cron-real-guard-")));
  stateDirectory = path.join(root, "state");
  guardPath = path.join(stateDirectory, "model-router-evidence-cron-mutation-guard.json");
  rolloutLockPath = path.join(stateDirectory, "model-router-rollout.lock");
  await fs.mkdir(stateDirectory, { recursive: true, mode: 0o700 });
  await fs.chmod(stateDirectory, 0o700);
  vi.resetModules();
  const { setCronMutationGuardPathsForTests } =
    await import("./definition-mutation-guard.test-support.js");
  setCronMutationGuardPathsForTests({ guardPath, rolloutLockPath });
});

afterEach(async () => {
  vi.restoreAllMocks();
  const { setCronMutationGuardPathsForTests } =
    await import("./definition-mutation-guard.test-support.js");
  setCronMutationGuardPathsForTests();
  vi.resetModules();
  await fs.rm(root, { recursive: true, force: true });
});

describe("real model-router cron mutation guard integration", () => {
  it("fails closed for every missing, malformed, mismatched, future, expired, or insecure campaign artifact", async () => {
    const { inspectCronDefinitionMutationGuard } = await import("./definition-mutation-guard.js");

    await writeOwnerOnlyJson(
      rolloutLockPath,
      {
        outputDir: path.join(root, "output"),
        planSha256: PLAN_SHA256,
        runId: RUN_ID,
      },
      0o600,
    );
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });

    await writeOwnerOnlyJson(guardPath, { status: "active" });
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });

    await writeOwnerOnlyJson(guardPath, guard({ runId: "substituted-run" }));
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });

    await writeOwnerOnlyJson(guardPath, guard({ startsAt: "2026-07-27T10:01:00.000Z" }));
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });

    await writeOwnerOnlyJson(
      guardPath,
      guard({
        startsAt: "2026-07-26T09:59:00.000Z",
        expiresAt: "2026-07-27T09:59:59.000Z",
      }),
    );
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });

    await writeOwnerOnlyJson(guardPath, guard());
    await fs.chmod(rolloutLockPath, 0o644);
    expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
      active: true,
      failClosed: true,
    });
  });

  it("rejects malformed-job quarantine before memory, durable store, events, timers, or warnings change", async () => {
    await installExactGuardAndLock();
    const [
      cronStoreModule,
      { createCronServiceState },
      { ensureLoaded },
      { openOpenClawStateDatabase },
    ] = await Promise.all([
      import("../store.js"),
      import("./state.js"),
      import("./store.js"),
      import("../../state/openclaw-state-db.js"),
    ]);
    const { resolveCronQuarantinePath, saveCronStore } = cronStoreModule;
    const storePath = path.join(root, "cron", "jobs.json");
    const persistedJob = {
      id: "malformed-job",
      name: "malformed",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every" as const, everyMs: 60_000 },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "never run" },
      delivery: { mode: "none" as const },
      state: {},
    };
    await saveCronStore(storePath, {
      version: 1,
      jobs: [persistedJob],
    });
    vi.spyOn(cronStoreModule, "loadCronJobsStoreWithConfigJobs").mockResolvedValue({
      store: { version: 1, jobs: [] },
      configJobs: [],
      configJobIndexes: [],
      configJobRuntimeEntries: [],
      invalidConfigRows: [
        {
          sourceIndex: 0,
          reason: "invalid-schedule",
          job: { id: "malformed-job" },
        },
      ],
    });
    const saveStore = vi.spyOn(cronStoreModule, "saveCronJobsStore");
    const database = openOpenClawStateDatabase().db;
    const onEvent = vi.fn();
    const log = {
      debug: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
    };
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log,
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(),
      onEvent,
    });

    await expect(ensureLoaded(state)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(state.store).toBeNull();
    expect(state.timer).toBeNull();
    expect(state.pendingQuarantineConfigJobs).toEqual([]);
    expect(saveStore).not.toHaveBeenCalled();
    expect(onEvent).not.toHaveBeenCalled();
    expect(log.warn).not.toHaveBeenCalled();
    expect(
      database
        .prepare("SELECT COUNT(*) AS count FROM cron_jobs WHERE store_key = ? AND job_id = ?")
        .get(path.resolve(storePath), persistedJob.id),
    ).toEqual({ count: 1 });
    await expect(fs.stat(resolveCronQuarantinePath(storePath))).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("permits recurring state persistence and rolls back auto-disable or removal without retry", async () => {
    await installExactGuardAndLock();
    const [
      { saveCronStore, loadCronStore },
      { createCronServiceState },
      { ensureLoaded, persistOrRestore, snapshotStoreForRollback },
    ] = await Promise.all([import("../store.js"), import("./state.js"), import("./store.js")]);
    const storePath = path.join(root, "cron", "jobs.json");
    const recurring = {
      id: "recurring-job",
      name: "recurring",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every" as const, everyMs: 60_000, anchorMs: NOW_MS },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "state only" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS + 60_000 },
    };
    await saveCronStore(storePath, { version: 1, jobs: [recurring] });
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(),
    });
    await ensureLoaded(state, { skipRecompute: true });
    const job = state.store?.jobs[0];
    if (!job) {
      throw new Error("expected recurring job");
    }

    const stateSnapshot = snapshotStoreForRollback(state);
    job.state.lastRunAtMs = NOW_MS;
    job.state.nextRunAtMs = NOW_MS + 120_000;
    await expect(persistOrRestore(state, stateSnapshot)).resolves.toBeUndefined();
    expect((await loadCronStore(storePath)).jobs[0]?.state.nextRunAtMs).toBe(NOW_MS + 120_000);

    const disableSnapshot = snapshotStoreForRollback(state);
    job.enabled = false;
    await expect(persistOrRestore(state, disableSnapshot)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(state.store?.jobs[0]?.enabled).toBe(true);
    expect((await loadCronStore(storePath)).jobs[0]?.enabled).toBe(true);

    const removalSnapshot = snapshotStoreForRollback(state);
    state.store = { version: 1, jobs: [] };
    await expect(persistOrRestore(state, removalSnapshot)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(state.store?.jobs.map((entry) => entry.id)).toEqual(["recurring-job"]);
    expect((await loadCronStore(storePath)).jobs.map((entry) => entry.id)).toEqual([
      "recurring-job",
    ]);
  });

  it("runs one recurring scheduler call and never retries a guarded one-shot removal", async () => {
    await installExactGuardAndLock();
    const [{ CronService }, { createNoopLogger }, { loadCronStore, saveCronStore }] =
      await Promise.all([
        import("../service.js"),
        import("../service.test-harness.js"),
        import("../store.js"),
      ]);
    const storePath = path.join(root, "cron", "jobs.json");
    const recurring = {
      id: "scheduler-recurring-job",
      name: "scheduler recurring",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every" as const, everyMs: 60_000, anchorMs: NOW_MS },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "state only" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS + 60_000 },
    };
    const oneShot = {
      id: "scheduler-one-shot-job",
      name: "scheduler one shot",
      enabled: true,
      deleteAfterRun: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "at" as const, at: "2026-07-28T10:00:00.000Z" },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "remove once" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: Date.parse("2026-07-28T10:00:00.000Z") },
    };
    await saveCronStore(storePath, {
      version: 1,
      jobs: [recurring, oneShot],
    });
    const runIsolatedAgentJob = vi.fn(async () => ({ status: "ok" as const }));
    const cron = new CronService({
      cronEnabled: false,
      storePath,
      log: createNoopLogger(),
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob,
    });

    await expect(cron.run(recurring.id, "force")).resolves.toEqual({
      ok: true,
      ran: true,
    });
    expect(runIsolatedAgentJob).toHaveBeenCalledTimes(1);
    expect(
      (await loadCronStore(storePath)).jobs.find((job) => job.id === recurring.id)?.enabled,
    ).toBe(true);

    await expect(cron.run(oneShot.id, "force")).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    await new Promise((resolve) => {
      setTimeout(resolve, 25);
    });
    expect(runIsolatedAgentJob).toHaveBeenCalledTimes(2);
    expect(
      (await loadCronStore(storePath)).jobs.find((job) => job.id === oneShot.id),
    ).toMatchObject({
      enabled: true,
      deleteAfterRun: true,
    });
    cron.stop();
  });

  it("clears timer reservations after one guarded auto-removal rejection without a timer storm", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW_MS));
    await installExactGuardAndLock();
    const [{ CronService }, { createNoopLogger }, { loadCronStore, saveCronStore }] =
      await Promise.all([
        import("../service.js"),
        import("../service.test-harness.js"),
        import("../store.js"),
      ]);
    const recurringStorePath = path.join(root, "cron-recurring", "jobs.json");
    const recurringRun = vi.fn(async () => ({ status: "ok" as const }));
    const recurring = {
      id: "timer-recurring-job",
      name: "timer recurring",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every" as const, everyMs: 1_000, anchorMs: NOW_MS },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "state only" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS + 1_000 },
    };
    await saveCronStore(recurringStorePath, { version: 1, jobs: [recurring] });
    const recurringCron = new CronService({
      cronEnabled: true,
      storePath: recurringStorePath,
      log: createNoopLogger(),
      nowMs: () => Date.now(),
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: recurringRun,
    });

    try {
      await recurringCron.start();
      await vi.advanceTimersByTimeAsync(1_000);
      for (let attempt = 0; attempt < 20 && recurringRun.mock.calls.length === 0; attempt += 1) {
        await Promise.resolve();
      }
      expect(recurringRun).toHaveBeenCalledTimes(1);
      const recurringJobs = await recurringCron.list({ includeDisabled: true });
      expect(recurringJobs[0]).toMatchObject({
        enabled: true,
        id: recurring.id,
        state: {
          lastStatus: "ok",
        },
      });
      expect((await loadCronStore(recurringStorePath)).jobs[0]).toMatchObject({
        enabled: true,
        id: recurring.id,
        state: {
          lastStatus: "ok",
        },
      });
    } finally {
      recurringCron.stop();
    }

    vi.setSystemTime(new Date(NOW_MS));
    const oneShotStorePath = path.join(root, "cron-one-shot", "jobs.json");
    const oneShotRun = vi.fn(async () => ({ status: "ok" as const }));
    const oneShotLogger = createNoopLogger();
    const oneShot = {
      id: "timer-one-shot-job",
      name: "timer one shot",
      enabled: true,
      deleteAfterRun: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: {
        kind: "at" as const,
        at: new Date(NOW_MS + 1_000).toISOString(),
      },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "remove once" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS + 1_000 },
    };
    await saveCronStore(oneShotStorePath, { version: 1, jobs: [oneShot] });
    const oneShotCron = new CronService({
      cronEnabled: true,
      storePath: oneShotStorePath,
      log: oneShotLogger,
      nowMs: () => Date.now(),
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: oneShotRun,
    });

    try {
      await oneShotCron.start();
      await vi.advanceTimersByTimeAsync(1_000);
      for (let attempt = 0; attempt < 20 && oneShotRun.mock.calls.length === 0; attempt += 1) {
        await Promise.resolve();
      }
      expect(oneShotRun).toHaveBeenCalledTimes(1);
      const afterFailure = await oneShotCron.list({ includeDisabled: true });
      expect(afterFailure[0]).toMatchObject({
        deleteAfterRun: true,
        enabled: true,
        id: oneShot.id,
      });
      expect(afterFailure[0]?.state.queuedAtMs).toBeUndefined();
      expect(afterFailure[0]?.state.runningAtMs).toBeUndefined();
      expect((await loadCronStore(oneShotStorePath)).jobs[0]).toEqual(afterFailure[0]);
      expect(
        oneShotLogger.error.mock.calls.filter(
          ([, message]) => message === "cron: timer tick failed",
        ),
      ).toHaveLength(1);
      const timerCountAfterFailure = vi.getTimerCount();
      expect(timerCountAfterFailure).toBeLessThanOrEqual(2);

      await vi.advanceTimersByTimeAsync(10_000);
      expect(oneShotRun).toHaveBeenCalledTimes(1);
      expect(vi.getTimerCount()).toBeLessThanOrEqual(timerCountAfterFailure);
      expect(
        oneShotLogger.error.mock.calls.filter(
          ([, message]) => message === "cron: timer tick failed",
        ),
      ).toHaveLength(1);
    } finally {
      oneShotCron.stop();
      vi.useRealTimers();
    }
  });
});
