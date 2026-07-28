import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setCronMutationGuardPathsForTests } from "../cron/service/definition-mutation-guard.test-support.js";
import {
  closeOpenClawStateDatabaseForTest,
  openExistingOpenClawStateDatabaseReadOnly,
  openOpenClawStateDatabase,
} from "./openclaw-state-db.js";

const PLAN_SHA256 = `sha256:${"b".repeat(64)}`;
let root = "";
let databasePath = "";
let guardPath = "";
let rolloutLockPath = "";

async function writeOwnerOnlyJson(filePath: string, value: unknown, mode = 0o400) {
  await fs.writeFile(filePath, `${JSON.stringify(value)}\n`, { mode: 0o600 });
  await fs.chmod(filePath, mode);
}

async function installGuard() {
  await writeOwnerOnlyJson(guardPath, {
    schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
    status: "active",
    runId: "state-open-cron-backfill-test",
    planSha256: PLAN_SHA256,
    startsAt: "2020-01-01T00:00:00.000Z",
    expiresAt: "2099-01-01T00:00:00.000Z",
    blockedActions: ["add", "remove", "update"],
    allowScheduledExecution: true,
  });
  await writeOwnerOnlyJson(
    rolloutLockPath,
    {
      outputDir: path.join(root, "output"),
      planSha256: PLAN_SHA256,
      runId: "state-open-cron-backfill-test",
    },
    0o600,
  );
  setCronMutationGuardPathsForTests({ guardPath, rolloutLockPath });
}

beforeEach(async () => {
  root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), "state-cron-guard-")));
  databasePath = path.join(root, "state.sqlite");
  guardPath = path.join(root, "model-router-evidence-cron-mutation-guard.json");
  rolloutLockPath = path.join(root, "model-router-rollout.lock");
  await fs.chmod(root, 0o700);
});

afterEach(async () => {
  closeOpenClawStateDatabaseForTest();
  setCronMutationGuardPathsForTests();
  await fs.rm(root, { recursive: true, force: true });
});

describe("state database cron backfill mutation guard", () => {
  it("fails runtime opening closed before a legacy cron definition backfill", async () => {
    const database = openOpenClawStateDatabase({ path: databasePath });
    const job = {
      id: "legacy-backfill-job",
      name: "legacy job",
      enabled: true,
      createdAtMs: 1,
      updatedAtMs: 2,
      schedule: { kind: "every", everyMs: 60_000 },
      sessionTarget: "isolated",
      wakeMode: "now",
      payload: { kind: "agentTurn", message: "preserve me" },
      delivery: { mode: "none" },
      state: {},
    };
    database.db
      .prepare(
        `INSERT INTO cron_jobs (
          store_key, job_id, name, enabled, created_at_ms, schedule_kind,
          session_target, wake_mode, payload_kind, job_json, sort_order, updated_at
        ) VALUES (?, ?, '', 1, 0, 'manual', 'main', 'auto', 'message', ?, 0, 2)`,
      )
      .run("legacy-store", job.id, JSON.stringify(job));
    closeOpenClawStateDatabaseForTest();
    await installGuard();

    expect(() => openOpenClawStateDatabase({ path: databasePath })).toThrowError(
      expect.objectContaining({ code: "CRON_MUTATION_GUARD_ACTIVE" }),
    );
    const readOnly = openExistingOpenClawStateDatabaseReadOnly({ path: databasePath });
    expect(
      readOnly?.db
        .prepare(
          "SELECT name, schedule_kind, payload_kind FROM cron_jobs WHERE store_key = ? AND job_id = ?",
        )
        .get("legacy-store", job.id),
    ).toEqual({ name: "", schedule_kind: "manual", payload_kind: "message" });
    readOnly?.walMaintenance.close();
  });
});
