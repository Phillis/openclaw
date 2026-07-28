import { describe, expect, it, vi } from "vitest";
import {
  noopLogger,
  setupCronRegressionFixtures,
} from "../../../test/helpers/cron/service-regression-fixtures.js";
import { openOpenClawStateDatabase } from "../../state/openclaw-state-db.js";
import { loadCronStore, saveCronStore } from "../store.js";
import type { CronJob } from "../types.js";

const guard = vi.hoisted(() => ({
  assertAllowed: vi.fn<() => void>(() => {
    throw Object.assign(new Error("mutations are frozen"), {
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
  }),
  assertSnapshotAllowed: vi.fn(),
}));

vi.mock("./definition-mutation-guard.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./definition-mutation-guard.js")>()),
  assertCronDefinitionMutationAllowed: guard.assertAllowed,
  assertCronDefinitionSnapshotMutationAllowed: guard.assertSnapshotAllowed,
}));

import { cronStreamScheduleKey } from "../stream-schedule.js";
import {
  add,
  remove,
  removeAgentJobsTransactional,
  update,
  updateExternalCounters,
  updateExternalState,
  updateWithPrecondition,
} from "./ops.js";
import { createCronServiceState, type CronEvent } from "./state.js";
import { ensureLoaded } from "./store.js";

const fixtures = setupCronRegressionFixtures({ prefix: "cron-mutation-guard-ops-" });

function allowNextFixtureDefinitionSave() {
  guard.assertAllowed.mockImplementationOnce(() => undefined);
}

function existingJob(): CronJob {
  return {
    id: "existing-job",
    agentId: "main",
    name: "existing",
    enabled: true,
    createdAtMs: 1,
    updatedAtMs: 1,
    schedule: { kind: "every", everyMs: 60_000, anchorMs: 1 },
    sessionTarget: "isolated",
    wakeMode: "next-heartbeat",
    payload: { kind: "agentTurn", message: "test" },
    delivery: { mode: "none" },
    state: { nextRunAtMs: 60_001 },
  };
}

describe("cron service mutation boundary during model-router evidence", () => {
  it("blocks every CRUD/transaction entry before state, events, timers, or callbacks change", async () => {
    const { storePath } = fixtures.makeStorePath();
    const original = existingJob();
    allowNextFixtureDefinitionSave();
    await saveCronStore(storePath, { version: 1, jobs: [original] });
    const events: CronEvent[] = [];
    const state = createCronServiceState({
      cronEnabled: true,
      storePath,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(),
      onEvent: (event) => events.push(event),
    });
    const precondition = vi.fn();
    const externalCommit = vi.fn(async () => "committed");
    const newJob = {
      agentId: "main",
      name: "new",
      enabled: true,
      schedule: { kind: "every" as const, everyMs: 60_000 },
      sessionTarget: "isolated" as const,
      wakeMode: "next-heartbeat" as const,
      payload: { kind: "agentTurn" as const, message: "test" },
      delivery: { mode: "none" as const },
    };

    const operations = [
      () => add(state, newJob),
      () => add(state, newJob, { systemOwned: true }),
      () => update(state, original.id, { enabled: false }),
      () => update(state, "missing-job", { enabled: false }),
      () => updateWithPrecondition(state, original.id, { enabled: false }, precondition),
      () => remove(state, original.id, { systemOwned: true }),
      () => remove(state, "missing-job"),
      () => removeAgentJobsTransactional(state, "main", externalCommit),
    ];
    for (const operation of operations) {
      await expect(operation()).rejects.toMatchObject({
        code: "CRON_MUTATION_GUARD_ACTIVE",
      });
    }

    expect(precondition).not.toHaveBeenCalled();
    expect(externalCommit).not.toHaveBeenCalled();
    expect(events).toEqual([]);
    expect(state.timer).toBeNull();
    expect(await loadCronStore(storePath)).toEqual({
      version: 1,
      jobs: [original],
    });
    expect(state.store).toBeNull();
  });

  it("permits internal stream runtime updates but keeps public state patches frozen", async () => {
    guard.assertAllowed.mockClear();
    const { storePath } = fixtures.makeStorePath();
    const streamSchedule = {
      kind: "stream" as const,
      command: ["stream-source"],
    };
    const streamJob: CronJob = {
      ...existingJob(),
      id: "stream-job",
      schedule: streamSchedule,
      state: {
        streamSourceIdentity: "stream-source-identity",
        streamStatus: "running",
      },
    };
    allowNextFixtureDefinitionSave();
    await saveCronStore(storePath, {
      version: 1,
      jobs: [streamJob],
    });
    guard.assertAllowed.mockClear();
    const state = createCronServiceState({
      cronEnabled: true,
      cronConfig: {
        triggers: { enabled: true },
      },
      storePath,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(),
    });
    const scheduleKey = cronStreamScheduleKey(streamSchedule);

    await expect(
      updateExternalState(state, streamJob.id, scheduleKey, "stream-source-identity", {
        streamStatus: "stopped",
      }),
    ).resolves.toBe(true);
    await expect(
      updateExternalCounters(state, streamJob.id, {
        streamDroppedBatches: 2,
        streamCoalescedBatches: 1,
      }),
    ).resolves.toBeUndefined();
    expect(guard.assertAllowed).not.toHaveBeenCalled();
    expect((await loadCronStore(storePath)).jobs[0]?.state).toMatchObject({
      streamCoalescedBatches: 1,
      streamDroppedBatches: 2,
      streamStatus: "stopped",
    });

    await expect(
      update(state, streamJob.id, {
        state: { streamStatus: "running" },
      }),
    ).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(guard.assertAllowed).toHaveBeenCalledTimes(1);
  });

  it("updates only the stream target after an unrelated durable definition changes", async () => {
    guard.assertAllowed.mockClear();
    const { storePath } = fixtures.makeStorePath();
    const streamSchedule = {
      kind: "stream" as const,
      command: ["stream-source"],
    };
    const streamJob: CronJob = {
      ...existingJob(),
      id: "stream-target",
      schedule: streamSchedule,
      state: {
        streamSourceIdentity: "stream-source-identity",
        streamStatus: "running",
      },
    };
    const unrelatedJob: CronJob = {
      ...existingJob(),
      id: "unrelated-job",
      name: "before concurrent update",
    };
    allowNextFixtureDefinitionSave();
    await saveCronStore(storePath, {
      version: 1,
      jobs: [streamJob, unrelatedJob],
    });
    guard.assertAllowed.mockClear();
    const state = createCronServiceState({
      cronEnabled: true,
      cronConfig: {
        triggers: { enabled: true },
      },
      storePath,
      log: noopLogger,
      enqueueSystemEvent: vi.fn(),
      requestHeartbeat: vi.fn(),
      runIsolatedAgentJob: vi.fn(),
    });
    await ensureLoaded(state, { skipRecompute: true });

    openOpenClawStateDatabase()
      .db.prepare("UPDATE cron_jobs SET name = ? WHERE store_key = ? AND job_id = ?")
      .run("after concurrent update", storePath, unrelatedJob.id);

    await expect(
      updateExternalState(
        state,
        streamJob.id,
        cronStreamScheduleKey(streamSchedule),
        "stream-source-identity",
        { streamStatus: "stopped" },
      ),
    ).resolves.toBe(true);

    const persisted = await loadCronStore(storePath);
    expect(persisted.jobs.find((job) => job.id === streamJob.id)?.state.streamStatus).toBe(
      "stopped",
    );
    expect(persisted.jobs.find((job) => job.id === unrelatedJob.id)?.name).toBe(
      "after concurrent update",
    );
    expect(guard.assertAllowed).not.toHaveBeenCalled();
  });
});
