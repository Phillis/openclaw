import { describe, expect, it, vi } from "vitest";
import {
  noopLogger,
  setupCronRegressionFixtures,
} from "../../../test/helpers/cron/service-regression-fixtures.js";
import { loadCronStore, saveCronStore } from "../store.js";
import type { CronJob } from "../types.js";

const guard = vi.hoisted(() => ({
  assertAllowed: vi.fn(() => {
    throw Object.assign(new Error("mutations are frozen"), {
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
  }),
}));

vi.mock("./definition-mutation-guard.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./definition-mutation-guard.js")>()),
  assertCronDefinitionMutationAllowed: guard.assertAllowed,
}));

import {
  add,
  remove,
  removeAgentJobsTransactional,
  update,
  updateWithPrecondition,
} from "./ops.js";
import { createCronServiceState, type CronEvent } from "./state.js";

const fixtures = setupCronRegressionFixtures({ prefix: "cron-mutation-guard-ops-" });

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
});
