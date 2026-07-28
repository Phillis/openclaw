import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { openOpenClawStateDatabase } from "../../state/openclaw-state-db.js";
import { loadCronStore, saveCronJobsStore, saveCronStore } from "../store.js";
import type { CronJob } from "../types.js";
import { setCronMutationGuardPathsForTests } from "./definition-mutation-guard.test-support.js";

const NOW_MS = Date.parse("2026-07-27T10:00:00.000Z");
const PLAN_SHA256 = `sha256:${"a".repeat(64)}`;
let root = "";
let guardPath = "";
let rolloutLockPath = "";

async function writeOwnerOnlyJson(filePath: string, value: unknown, mode = 0o400) {
  await fs.writeFile(filePath, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  await fs.chmod(filePath, mode);
}

async function installExactGuardAndLock() {
  await writeOwnerOnlyJson(guardPath, {
    schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
    status: "active",
    runId: "store-replacement-normalization-test",
    planSha256: PLAN_SHA256,
    startsAt: "2026-07-27T09:59:00.000Z",
    expiresAt: "2026-07-28T09:59:00.000Z",
    blockedActions: ["add", "remove", "update"],
    allowScheduledExecution: true,
  });
  await writeOwnerOnlyJson(
    rolloutLockPath,
    {
      outputDir: path.join(root, "output"),
      planSha256: PLAN_SHA256,
      runId: "store-replacement-normalization-test",
    },
    0o600,
  );
}

function makeJob(overrides: Partial<CronJob> = {}): CronJob {
  return {
    id: "store-replacement-job",
    name: "before",
    enabled: true,
    createdAtMs: NOW_MS - 60_000,
    updatedAtMs: NOW_MS - 60_000,
    schedule: { kind: "every", everyMs: 60_000 },
    sessionTarget: "isolated",
    wakeMode: "now",
    payload: { kind: "agentTurn", message: "preserve definition" },
    delivery: { mode: "none" },
    state: {},
    ...overrides,
  };
}

beforeEach(async () => {
  root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "cron-store-replacement-")));
  const stateDirectory = path.join(root, "state");
  guardPath = path.join(stateDirectory, "model-router-evidence-cron-mutation-guard.json");
  rolloutLockPath = path.join(stateDirectory, "model-router-rollout.lock");
  await fs.mkdir(stateDirectory, { recursive: true, mode: 0o700 });
  await fs.chmod(stateDirectory, 0o700);
  setCronMutationGuardPathsForTests({ guardPath, rolloutLockPath });
});

afterEach(async () => {
  setCronMutationGuardPathsForTests();
  await fs.rm(root, { recursive: true, force: true });
});

describe("full cron store replacement mutation guard", () => {
  it("fails closed when raw and split definitions disagree across normalization", async () => {
    const storePath = path.join(root, "cron-inconsistent-normalization", "jobs.json");
    const durableJob = makeJob();
    await saveCronStore(storePath, { version: 1, jobs: [durableJob] });
    const database = openOpenClawStateDatabase().db;
    database
      .prepare("UPDATE cron_jobs SET name = ? WHERE store_key = ? AND job_id = ?")
      .run(" before ", path.resolve(storePath), durableJob.id);
    const decodedStore = await loadCronStore(storePath);
    expect(decodedStore.jobs[0]?.name).toBe(" before ");
    await installExactGuardAndLock();

    await expect(saveCronJobsStore(storePath, decodedStore)).rejects.toMatchObject({
      code: "CRON_MUTATION_GUARD_ACTIVE",
    });
    expect(
      database
        .prepare("SELECT name FROM cron_jobs WHERE store_key = ? AND job_id = ?")
        .get(path.resolve(storePath), durableJob.id),
    ).toEqual({ name: " before " });
  });

  it("allows unchanged explicit undefined config after exact JSON serialization", async () => {
    const storePath = path.join(root, "cron-explicit-undefined", "jobs.json");
    const unchanged = {
      version: 1 as const,
      jobs: [makeJob({ description: undefined })],
    };
    await saveCronStore(storePath, unchanged);
    await installExactGuardAndLock();

    await expect(saveCronJobsStore(storePath, unchanged)).resolves.toBeUndefined();
  });

  it("fails closed when schedule identity or ordered position would be rewritten", async () => {
    const identityStorePath = path.join(root, "cron-schedule-identity", "jobs.json");
    const orderedStorePath = path.join(root, "cron-sort-order", "jobs.json");
    const identityJob = makeJob({ id: "schedule-identity-job" });
    const orderedJobs = [
      makeJob({ id: "ordered-first", name: "first" }),
      makeJob({ id: "ordered-second", name: "second" }),
    ];
    await saveCronStore(identityStorePath, { version: 1, jobs: [identityJob] });
    await saveCronStore(orderedStorePath, { version: 1, jobs: orderedJobs });
    const database = openOpenClawStateDatabase().db;
    database
      .prepare("UPDATE cron_jobs SET schedule_identity = ? WHERE store_key = ? AND job_id = ?")
      .run("corrupted-schedule-identity", path.resolve(identityStorePath), identityJob.id);
    database
      .prepare("UPDATE cron_jobs SET sort_order = sort_order + 10 WHERE store_key = ?")
      .run(path.resolve(orderedStorePath));
    await installExactGuardAndLock();

    await expect(
      saveCronJobsStore(identityStorePath, { version: 1, jobs: [identityJob] }),
    ).rejects.toMatchObject({ code: "CRON_MUTATION_GUARD_ACTIVE" });
    await expect(
      saveCronJobsStore(orderedStorePath, { version: 1, jobs: orderedJobs }),
    ).rejects.toMatchObject({ code: "CRON_MUTATION_GUARD_ACTIVE" });
    expect(
      database
        .prepare("SELECT schedule_identity FROM cron_jobs WHERE store_key = ? AND job_id = ?")
        .get(path.resolve(identityStorePath), identityJob.id),
    ).toEqual({ schedule_identity: "corrupted-schedule-identity" });
    expect(
      database
        .prepare("SELECT job_id, sort_order FROM cron_jobs WHERE store_key = ? ORDER BY sort_order")
        .all(path.resolve(orderedStorePath)),
    ).toEqual([
      { job_id: "ordered-first", sort_order: 10 },
      { job_id: "ordered-second", sort_order: 11 },
    ]);
  });
});
