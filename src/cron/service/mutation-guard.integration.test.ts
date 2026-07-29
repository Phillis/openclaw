import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { CronJob } from "../types.js";

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
  const { setCronMutationGuardPathsForTests } =
    await import("./definition-mutation-guard.test-support.js");
  setCronMutationGuardPathsForTests({
    guardPath,
    rolloutLockPath,
  });
}

async function useInactiveGuardPaths() {
  const { setCronMutationGuardPathsForTests } =
    await import("./definition-mutation-guard.test-support.js");
  setCronMutationGuardPathsForTests({
    guardPath: path.join(root, "inactive-guard.json"),
    rolloutLockPath: path.join(root, "inactive-lock.json"),
  });
}

beforeEach(async () => {
  root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "cron-real-guard-")));
  stateDirectory = path.join(root, "state");
  guardPath = path.join(stateDirectory, "model-router-evidence-cron-mutation-guard.json");
  rolloutLockPath = path.join(stateDirectory, "model-router-rollout.lock");
  await fs.mkdir(stateDirectory, { recursive: true, mode: 0o700 });
  await fs.chmod(stateDirectory, 0o700);
  vi.resetModules();
  await useInactiveGuardPaths();
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
    const {
      inspectCronDefinitionMutationGuardForTests: inspectCronDefinitionMutationGuard,
      setCronMutationGuardPathsForTests,
    } = await import("./definition-mutation-guard.test-support.js");
    setCronMutationGuardPathsForTests({
      guardPath,
      rolloutLockPath,
    });

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
    await installExactGuardAndLock();
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

  it("guards both durable full-store writers while allowing runtime-only persistence", async () => {
    const [
      { loadCronStore, saveCronJobsStore, saveCronJobsStoreWithMetadata, saveCronStore },
      { openOpenClawStateDatabase },
    ] = await Promise.all([import("../store.js"), import("../../state/openclaw-state-db.js")]);
    const storePath = path.join(root, "cron-durable-writers", "jobs.json");
    const recurring = {
      id: "durable-writer-job",
      name: "original",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: {
        kind: "every" as const,
        everyMs: 60_000,
        anchorMs: NOW_MS,
      },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: {
        kind: "agentTurn" as const,
        message: "state only",
      },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS + 60_000 },
    };
    await saveCronStore(storePath, {
      version: 1,
      jobs: [recurring],
    });
    await installExactGuardAndLock();
    const database = openOpenClawStateDatabase().db;
    const beforeRuntimeWrite = database
      .prepare("SELECT schedule_identity FROM cron_jobs WHERE store_key = ? AND job_id = ?")
      .get(path.resolve(storePath), recurring.id) as { schedule_identity: string | null };

    const changedDefinition = structuredClone(recurring);
    changedDefinition.name = "bypassed";
    await expect(
      saveCronJobsStore(storePath, {
        version: 1,
        jobs: [changedDefinition],
      }),
    ).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    const acquireMetadata = vi.fn(() => true);
    await expect(
      saveCronJobsStoreWithMetadata(
        storePath,
        {
          version: 1,
          jobs: [changedDefinition],
        },
        acquireMetadata,
      ),
    ).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(acquireMetadata).not.toHaveBeenCalled();

    const runtimeOnly: CronJob = structuredClone(recurring);
    runtimeOnly.state.lastStatus = "ok";
    runtimeOnly.state.lastRunAtMs = NOW_MS;
    await expect(
      saveCronJobsStore(storePath, { version: 1, jobs: [runtimeOnly] }, { stateOnly: true }),
    ).resolves.toBeUndefined();
    expect((await loadCronStore(storePath)).jobs[0]).toMatchObject({
      name: "original",
      state: {
        lastRunAtMs: NOW_MS,
        lastStatus: "ok",
      },
    });
    expect(
      database
        .prepare("SELECT schedule_identity FROM cron_jobs WHERE store_key = ? AND job_id = ?")
        .get(path.resolve(storePath), recurring.id),
    ).toEqual(beforeRuntimeWrite);

    const staleDefinition: CronJob = structuredClone(runtimeOnly);
    staleDefinition.createdAtMs += 1;
    staleDefinition.state.lastRunAtMs = NOW_MS + 1;
    await expect(
      saveCronJobsStore(storePath, { version: 1, jobs: [staleDefinition] }, { stateOnly: true }),
    ).rejects.toMatchObject({
      code: "CRON_DEFINITION_CAS_MISMATCH",
    });
    expect((await loadCronStore(storePath)).jobs[0]?.state.lastRunAtMs).toBe(NOW_MS);
  });

  it("fails closed instead of erasing unknown durable job_json config", async () => {
    const [{ loadCronStore, saveCronJobsStore, saveCronStore }, { openOpenClawStateDatabase }] =
      await Promise.all([import("../store.js"), import("../../state/openclaw-state-db.js")]);
    const storePath = path.join(root, "cron-unknown-job-json", "jobs.json");
    const durableJob: CronJob = {
      id: "unknown-job-json-job",
      name: "unknown config must survive",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "preserve unknown config" },
      delivery: { mode: "none" },
      state: {},
    };
    await saveCronStore(storePath, { version: 1, jobs: [durableJob] });
    const database = openOpenClawStateDatabase().db;
    const row = database
      .prepare("SELECT job_json FROM cron_jobs WHERE store_key = ? AND job_id = ?")
      .get(path.resolve(storePath), durableJob.id) as { job_json: string };
    const rawConfig = JSON.parse(row.job_json) as Record<string, unknown>;
    rawConfig.notify = true;
    database
      .prepare("UPDATE cron_jobs SET job_json = ? WHERE store_key = ? AND job_id = ?")
      .run(JSON.stringify(rawConfig), path.resolve(storePath), durableJob.id);
    const decodedStore = await loadCronStore(storePath);
    expect(decodedStore.jobs[0]).not.toHaveProperty("notify");
    await installExactGuardAndLock();

    await expect(saveCronJobsStore(storePath, decodedStore)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    const preserved = database
      .prepare("SELECT job_json FROM cron_jobs WHERE store_key = ? AND job_id = ?")
      .get(path.resolve(storePath), durableJob.id) as { job_json: string };
    expect(JSON.parse(preserved.job_json)).toMatchObject({ notify: true });
  });

  it("fails closed instead of deleting an unparseable durable row", async () => {
    const [
      { saveCronJobsStore, saveCronJobsStoreWithMetadata, saveCronStore },
      { openOpenClawStateDatabase },
    ] = await Promise.all([import("../store.js"), import("../../state/openclaw-state-db.js")]);
    const storePath = path.join(root, "cron-malformed-durable-row", "jobs.json");
    const durableJob: CronJob = {
      id: "unparseable-durable-job",
      name: "unparseable durable job",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "preserve malformed row" },
      delivery: { mode: "none" },
      state: {},
    };
    const proposed = { version: 1 as const, jobs: [durableJob] };
    await saveCronStore(storePath, proposed);
    const database = openOpenClawStateDatabase().db;
    database
      .prepare(
        "UPDATE cron_jobs SET schedule_kind = 'broken', every_ms = NULL WHERE store_key = ? AND job_id = ?",
      )
      .run(path.resolve(storePath), durableJob.id);
    await installExactGuardAndLock();

    await expect(saveCronJobsStore(storePath, proposed)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    const acquireMetadata = vi.fn(() => true);
    await expect(
      saveCronJobsStoreWithMetadata(storePath, proposed, acquireMetadata),
    ).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(acquireMetadata).not.toHaveBeenCalled();
    expect(
      database
        .prepare("SELECT schedule_kind FROM cron_jobs WHERE store_key = ? AND job_id = ?")
        .get(path.resolve(storePath), durableJob.id),
    ).toEqual({ schedule_kind: "broken" });
  });

  it("rejects a pure durable job reorder while preserving sort order", async () => {
    const { loadCronStore, saveCronJobsStore, saveCronStore } = await import("../store.js");
    const storePath = path.join(root, "cron-reorder", "jobs.json");
    const first: CronJob = {
      id: "first-job",
      name: "first",
      enabled: true,
      createdAtMs: NOW_MS - 60_000,
      updatedAtMs: NOW_MS - 60_000,
      schedule: { kind: "every", everyMs: 60_000, anchorMs: NOW_MS },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "first" },
      delivery: { mode: "none" },
      state: { nextRunAtMs: NOW_MS + 60_000 },
    };
    const second: CronJob = {
      ...structuredClone(first),
      id: "second-job",
      name: "second",
      payload: { kind: "agentTurn", message: "second" },
    };
    await saveCronStore(storePath, { version: 1, jobs: [first, second] });
    await installExactGuardAndLock();

    await expect(
      saveCronJobsStore(storePath, { version: 1, jobs: [second, first] }),
    ).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect((await loadCronStore(storePath)).jobs.map((job) => job.id)).toEqual([
      first.id,
      second.id,
    ]);
  });

  it("permits recurring state persistence and rolls back auto-disable or removal without retry", async () => {
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
    await installExactGuardAndLock();
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
    await installExactGuardAndLock();
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
      state: {
        lastStatus: "ok",
      },
    });
    const persistedOneShot = (await loadCronStore(storePath)).jobs.find(
      (job) => job.id === oneShot.id,
    );
    expect(persistedOneShot?.state.queuedAtMs).toBeUndefined();
    expect(persistedOneShot?.state.runningAtMs).toBeUndefined();
    expect(persistedOneShot?.state.nextRunAtMs).toBeUndefined();
    cron.stop();
  });

  it("persists completed startup catch-up runtime state when guarded one-shot removal is rejected", async () => {
    const [
      { createNoopLogger },
      { loadCronStore, saveCronStore },
      { createCronServiceState },
      { runMissedJobs },
    ] = await Promise.all([
      import("../service.test-harness.js"),
      import("../store.js"),
      import("./state.js"),
      import("./timer.js"),
    ]);
    const storePath = path.join(root, "cron-startup-catchup", "jobs.json");
    const oneShot = {
      id: "startup-catchup-one-shot-job",
      name: "startup catch-up one shot",
      enabled: true,
      deleteAfterRun: true,
      createdAtMs: NOW_MS - 120_000,
      updatedAtMs: NOW_MS - 120_000,
      schedule: {
        kind: "at" as const,
        at: new Date(NOW_MS - 60_000).toISOString(),
      },
      sessionTarget: "isolated" as const,
      wakeMode: "now" as const,
      payload: { kind: "agentTurn" as const, message: "startup remove once" },
      delivery: { mode: "none" as const },
      state: { nextRunAtMs: NOW_MS - 60_000 },
    };
    await saveCronStore(storePath, { version: 1, jobs: [oneShot] });
    await installExactGuardAndLock();
    const runIsolatedAgentJob = vi.fn(async () => ({ status: "ok" as const }));
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log: createNoopLogger(),
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob,
    });

    await expect(runMissedJobs(state)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });

    expect(runIsolatedAgentJob).toHaveBeenCalledTimes(1);
    const persisted = (await loadCronStore(storePath)).jobs[0];
    expect(persisted).toMatchObject({
      deleteAfterRun: true,
      enabled: true,
      id: oneShot.id,
      state: {
        lastStatus: "ok",
      },
    });
    expect(persisted?.state.queuedAtMs).toBeUndefined();
    expect(persisted?.state.runningAtMs).toBeUndefined();
    expect(persisted?.state.nextRunAtMs).toBeUndefined();
  });

  it("recovers a finalized startup one-shot without deleting its guarded definition or aborting", async () => {
    const [
      { loadCronStore, saveCronStore },
      { start, stop },
      { createCronServiceState },
      { tryCreateCronTaskRun, tryFinishCronTaskRun },
    ] = await Promise.all([
      import("../store.js"),
      import("./ops.js"),
      import("./state.js"),
      import("./task-runs.js"),
    ]);
    const storePath = path.join(root, "cron-finalized-startup", "jobs.json");
    const startedAt = NOW_MS - 30_000;
    const endedAt = startedAt + 4_000;
    const oneShot: CronJob = {
      id: "finalized-startup-one-shot-job",
      name: "finalized startup one shot",
      enabled: true,
      deleteAfterRun: true,
      createdAtMs: NOW_MS - 120_000,
      updatedAtMs: NOW_MS - 120_000,
      schedule: { kind: "at", at: new Date(startedAt).toISOString() },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "already completed" },
      delivery: { mode: "none" },
      state: { runningAtMs: startedAt, nextRunAtMs: startedAt },
    };
    await saveCronStore(storePath, { version: 1, jobs: [oneShot] });
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });
    const taskRunId = tryCreateCronTaskRun({ state, job: oneShot, startedAt });
    if (!taskRunId) {
      throw new Error("expected finalized startup task run");
    }
    tryFinishCronTaskRun(state, {
      taskRunId,
      job: oneShot,
      event: {
        jobId: oneShot.id,
        action: "finished",
        job: oneShot,
        status: "ok",
        runAtMs: startedAt,
        durationMs: endedAt - startedAt,
      },
    });
    await installExactGuardAndLock();

    await expect(start(state)).resolves.toBeUndefined();

    const persisted = (await loadCronStore(storePath)).jobs[0];
    expect(persisted).toMatchObject({
      deleteAfterRun: true,
      enabled: true,
      id: oneShot.id,
      state: {
        lastStatus: "ok",
      },
    });
    expect(persisted?.state.runningAtMs).toBeUndefined();
    expect(persisted?.state.nextRunAtMs).toBeUndefined();
    stop(state);
  });

  it("does not replay an interrupted one-shot whose definition remains enabled under the guard", async () => {
    const [
      { loadCronStore, saveCronStore },
      { start, stop },
      { createCronServiceState },
      { onTimer },
    ] = await Promise.all([
      import("../store.js"),
      import("./ops.js"),
      import("./state.js"),
      import("./timer.test-support.js"),
    ]);
    const storePath = path.join(root, "cron-interrupted-startup", "jobs.json");
    const startedAt = NOW_MS - 30_000;
    const oneShot: CronJob = {
      id: "interrupted-startup-one-shot-job",
      name: "interrupted startup one shot",
      enabled: true,
      createdAtMs: NOW_MS - 120_000,
      updatedAtMs: NOW_MS - 120_000,
      schedule: { kind: "at", at: new Date(startedAt - 1_000).toISOString() },
      sessionTarget: "main",
      wakeMode: "now",
      payload: { kind: "systemEvent", text: "must not replay" },
      state: { runningAtMs: startedAt, nextRunAtMs: startedAt - 1_000 },
    };
    await saveCronStore(storePath, { version: 1, jobs: [oneShot] });
    await installExactGuardAndLock();
    const enqueueSystemEvent = vi.fn();
    const requestHeartbeat = vi.fn();
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
      nowMs: () => NOW_MS,
      enqueueSystemEvent,
      requestHeartbeat,
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    await expect(start(state)).resolves.toBeUndefined();
    await expect(onTimer(state)).resolves.toBeUndefined();

    const persisted = (await loadCronStore(storePath)).jobs[0];
    expect(persisted).toMatchObject({
      enabled: true,
      id: oneShot.id,
      state: {
        lastError: "cron: job interrupted by gateway restart",
        lastRunAtMs: startedAt,
        lastRunStatus: "error",
      },
    });
    expect(persisted?.state.runningAtMs).toBeUndefined();
    expect(persisted?.state.nextRunAtMs).toBeUndefined();
    expect(enqueueSystemEvent).not.toHaveBeenCalled();
    expect(requestHeartbeat).not.toHaveBeenCalled();
    stop(state);
  });

  it("finalizes a quiet sibling task before a guarded mixed-batch one-shot rejection escapes", async () => {
    const [
      { loadCronStore, saveCronStore },
      { createCronServiceState },
      { onTimer },
      { listTaskRecordsUnsorted },
      { resetTaskRegistryForTests },
    ] = await Promise.all([
      import("../store.js"),
      import("./state.js"),
      import("./timer.test-support.js"),
      import("../../tasks/task-registry.js"),
      import("../../tasks/task-runtime.test-helpers.js"),
    ]);
    resetTaskRegistryForTests();
    const storePath = path.join(root, "cron-mixed-quiet-batch", "jobs.json");
    const quietJob: CronJob = {
      id: "guarded-quiet-sibling-job",
      name: "guarded quiet sibling",
      enabled: true,
      createdAtMs: NOW_MS - 120_000,
      updatedAtMs: NOW_MS - 120_000,
      schedule: { kind: "every", everyMs: 60_000, anchorMs: NOW_MS - 60_000 },
      trigger: { script: "json({ fire: false })" },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "must remain quiet" },
      delivery: { mode: "none" },
      state: { nextRunAtMs: NOW_MS },
    };
    const oneShot: CronJob = {
      id: "guarded-mixed-batch-one-shot-job",
      name: "guarded mixed batch one shot",
      enabled: true,
      deleteAfterRun: true,
      createdAtMs: NOW_MS - 120_000,
      updatedAtMs: NOW_MS - 120_000,
      schedule: { kind: "at", at: new Date(NOW_MS).toISOString() },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "complete once" },
      delivery: { mode: "none" },
      state: { nextRunAtMs: NOW_MS },
    };
    await saveCronStore(storePath, { version: 1, jobs: [quietJob, oneShot] });
    await installExactGuardAndLock();
    const state = createCronServiceState({
      cronEnabled: true,
      cronConfig: { triggers: { enabled: true } },
      storePath,
      log: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
      nowMs: () => NOW_MS,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      evaluateCronTrigger: vi.fn(async () => ({
        kind: "evaluated" as const,
        fire: false,
      })),
      runIsolatedAgentJob: vi.fn(async () => ({ status: "ok" as const })),
    });

    try {
      await expect(onTimer(state)).rejects.toMatchObject({
        code: "CRON_MUTATION_GUARD_ACTIVE",
      });
      const quietTask = listTaskRecordsUnsorted().find((task) =>
        task.runId?.startsWith(`cron:${quietJob.id}:`),
      );
      expect(quietTask).toMatchObject({ status: "succeeded" });
      const persisted = await loadCronStore(storePath);
      expect(
        persisted.jobs.find((job) => job.id === quietJob.id)?.state.runningAtMs,
      ).toBeUndefined();
      const persistedOneShot = persisted.jobs.find((job) => job.id === oneShot.id);
      expect(persistedOneShot?.state.runningAtMs).toBeUndefined();
      expect(persistedOneShot?.state.nextRunAtMs).toBeUndefined();
    } finally {
      resetTaskRegistryForTests();
    }
  });

  it("clears timer reservations after one guarded auto-removal rejection without a timer storm", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(NOW_MS));
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
    await installExactGuardAndLock();
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
    await useInactiveGuardPaths();
    await saveCronStore(oneShotStorePath, { version: 1, jobs: [oneShot] });
    await installExactGuardAndLock();
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

      await vi.advanceTimersByTimeAsync(2 * 60 * 60 * 1_000 + 1);
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
