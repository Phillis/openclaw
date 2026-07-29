import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import type { CronJob, CronStoreFile } from "../types.js";
import { assertCronDefinitionSnapshotMutationAllowed } from "./definition-mutation-guard.js";
import { inspectCronDefinitionMutationGuardForTests as inspectCronDefinitionMutationGuard } from "./definition-mutation-guard.test-support.js";

const NOW_MS = Date.parse("2026-07-27T10:00:00.000Z");
const PLAN_SHA256 = `sha256:${"a".repeat(64)}`;

function job(overrides: Partial<CronJob> = {}): CronJob {
  return {
    id: "job-1",
    agentId: "main",
    name: "test",
    enabled: true,
    createdAtMs: 1,
    updatedAtMs: 1,
    schedule: { kind: "every", everyMs: 60_000, anchorMs: 1 },
    sessionTarget: "isolated",
    wakeMode: "now",
    payload: { kind: "agentTurn", message: "test" },
    delivery: { mode: "none" },
    state: { nextRunAtMs: 60_001 },
    ...overrides,
  };
}

function store(jobs: CronJob[]): CronStoreFile {
  return { version: 1, jobs };
}

async function fixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mutation-guard-"));
  const guardPath = path.join(directory, "guard.json");
  const rolloutLockPath = path.join(directory, "rollout.lock");
  const guard = {
    schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
    status: "active",
    runId: "class-simple-10-test",
    planSha256: PLAN_SHA256,
    startsAt: "2026-07-27T09:59:00.000Z",
    expiresAt: "2026-07-28T09:59:00.000Z",
    blockedActions: ["add", "remove", "update"],
    allowScheduledExecution: true,
  };
  await fs.writeFile(guardPath, `${JSON.stringify(guard)}\n`, { mode: 0o400 });
  return {
    directory,
    guardPath,
    rolloutLockPath,
    options: { guardPath, rolloutLockPath, nowMs: NOW_MS },
  };
}

describe("model-router evidence cron definition mutation guard", () => {
  it("blocks definition changes but permits runtime-state persistence", async () => {
    const value = await fixture();
    try {
      const before = store([job()]);
      const stateOnly = store([
        job({
          state: { nextRunAtMs: 120_001, lastRunAtMs: 60_001 },
          updatedAtMs: 2,
        }),
      ]);
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(before, stateOnly, value.options),
      ).not.toThrow();
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(
          before,
          store([job({ enabled: false })]),
          value.options,
        ),
      ).toThrow(/mutations are frozen/u);
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(
          before,
          store([job({ createdAtMs: 2 })]),
          value.options,
        ),
      ).toThrow(/mutations are frozen/u);
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(before, store([]), value.options),
      ).toThrow(/mutations are frozen/u);
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(
          before,
          store([job(), job({ id: "job-2" })]),
          value.options,
        ),
      ).toThrow(/mutations are frozen/u);
      expect(() =>
        assertCronDefinitionSnapshotMutationAllowed(
          store([job({ id: "job-1" }), job({ id: "job-2" })]),
          store([job({ id: "job-2" }), job({ id: "job-1" })]),
          value.options,
        ),
      ).toThrow(/mutations are frozen/u);
    } finally {
      await fs.rm(value.directory, { recursive: true, force: true });
    }
  });

  it("uses the canonical state root and treats a missing fresh-home parent as inactive", async () => {
    const freshHome = await fs.mkdtemp(path.join(os.tmpdir(), "cron-mutation-guard-home-"));
    const stateRoot = path.join(freshHome, "openclaw-state");
    vi.stubEnv("OPENCLAW_STATE_DIR", stateRoot);
    try {
      expect(inspectCronDefinitionMutationGuard({ nowMs: NOW_MS })).toEqual({
        active: false,
      });
    } finally {
      vi.unstubAllEnvs();
      await fs.rm(freshHome, { recursive: true, force: true });
    }
  });

  it("requires an exact guard identity whenever the rollout lock exists", async () => {
    const value = await fixture();
    try {
      await fs.writeFile(
        value.rolloutLockPath,
        `${JSON.stringify({
          planSha256: PLAN_SHA256,
          outputDir: "/private/test/output",
          runId: "class-simple-10-test",
        })}\n`,
        { mode: 0o600 },
      );
      expect(inspectCronDefinitionMutationGuard(value.options)).toMatchObject({
        active: true,
        failClosed: false,
        planSha256: PLAN_SHA256,
        runId: "class-simple-10-test",
      });
      await fs.chmod(value.guardPath, 0o600);
      expect(inspectCronDefinitionMutationGuard(value.options)).toEqual({
        active: true,
        failClosed: true,
      });
      await fs.rm(value.guardPath);
      expect(inspectCronDefinitionMutationGuard(value.options)).toEqual({
        active: true,
        failClosed: true,
      });
    } finally {
      await fs.rm(value.directory, { recursive: true, force: true });
    }
  });

  it("allows normal operations only when no campaign is active or an unlocked guard is expired", async () => {
    const value = await fixture();
    try {
      await fs.rm(value.guardPath);
      expect(inspectCronDefinitionMutationGuard(value.options)).toEqual({
        active: false,
      });
      await fs.writeFile(
        value.guardPath,
        `${JSON.stringify({
          schemaVersion: "model-router-evidence-cron-mutation-guard/v1",
          status: "active",
          runId: "class-simple-10-test",
          planSha256: PLAN_SHA256,
          startsAt: "2026-07-26T09:59:00.000Z",
          expiresAt: "2026-07-27T09:59:59.000Z",
          blockedActions: ["add", "remove", "update"],
          allowScheduledExecution: true,
        })}\n`,
        { mode: 0o400 },
      );
      expect(inspectCronDefinitionMutationGuard(value.options)).toEqual({
        active: false,
      });
    } finally {
      await fs.rm(value.directory, { recursive: true, force: true });
    }
  });
});
