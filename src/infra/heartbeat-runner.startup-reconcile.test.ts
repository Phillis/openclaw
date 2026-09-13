import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { loadSessionEntry, replaceSessionEntry } from "../config/sessions/session-accessor.js";
import { closeOpenClawAgentDatabasesForTest } from "../state/openclaw-agent-db.js";
import { markStartupOrphanedHeartbeatIsolatedSessions } from "./heartbeat-runner-session.js";

function seedEntry(params: { storePath: string; sessionKey: string; isolated: boolean }): {
  sessionId: string;
} {
  const sessionId = `session-${params.isolated ? "isolated" : "plain"}`;
  void replaceSessionEntry(
    { storePath: params.storePath, sessionKey: params.sessionKey },
    {
      sessionId,
      status: "running",
      startedAt: Date.now() - 60_000,
      updatedAt: Date.now() - 30_000,
      ...(params.isolated ? { heartbeatIsolatedBaseSessionKey: "agent:main:main" } : {}),
    },
  );
  return { sessionId };
}

it("marks stale running isolated heartbeat windows failed exactly once at boot", async () => {
  const stateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-hb-reconcile-"));
  const storePath = path.join(stateDir, "sessions.json");
  const isolatedKey = "agent:main:main:heartbeat";
  const plainKey = "agent:main:plain-running";
  try {
    seedEntry({ storePath, sessionKey: isolatedKey, isolated: true });
    seedEntry({ storePath, sessionKey: plainKey, isolated: false });

    const first = await markStartupOrphanedHeartbeatIsolatedSessions({
      cfg: { session: { store: storePath } },
      stateDir,
    });
    expect(first).toEqual({ marked: 1, skipped: 1 });

    const isolated = loadSessionEntry({ storePath, sessionKey: isolatedKey });
    expect(isolated).toMatchObject({
      status: "failed",
      abortedLastRun: true,
      lastRunError: "heartbeat run interrupted because the gateway restarted",
    });
    expect(isolated?.lifecycleRunId).toBeUndefined();
    expect(typeof isolated?.endedAt).toBe("number");
    expect(isolated?.runtimeMs).toBeGreaterThanOrEqual(0);

    // Owner-exact: the plain running row is main-session recovery territory.
    const plain = loadSessionEntry({ storePath, sessionKey: plainKey });
    expect(plain).toMatchObject({ status: "running" });
    expect(plain?.abortedLastRun).toBeUndefined();
    expect(plain?.lastRunError).toBeUndefined();

    // Idempotent: a second boot pass has nothing left to mark. Only the plain
    // running row (owned by main-session recovery, not this reconcile) is seen
    // and skipped; the isolated row is no longer a running candidate at all.
    const second = await markStartupOrphanedHeartbeatIsolatedSessions({
      cfg: { session: { store: storePath } },
      stateDir,
    });
    expect(second).toEqual({ marked: 0, skipped: 1 });
    expect(loadSessionEntry({ storePath, sessionKey: isolatedKey })?.status).toBe("failed");
  } finally {
    closeOpenClawAgentDatabasesForTest();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});

it("ignores terminal isolated heartbeat windows entirely", async () => {
  const stateDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-hb-reconcile-done-"));
  const storePath = path.join(stateDir, "sessions.json");
  const key = "agent:main:main:heartbeat";
  try {
    await replaceSessionEntry(
      { storePath, sessionKey: key },
      {
        sessionId: "session-done",
        status: "done",
        endedAt: Date.now() - 1_000,
        updatedAt: Date.now() - 1_000,
        heartbeatIsolatedBaseSessionKey: "agent:main:main",
      },
    );
    const result = await markStartupOrphanedHeartbeatIsolatedSessions({
      cfg: { session: { store: storePath } },
      stateDir,
    });
    expect(result).toEqual({ marked: 0, skipped: 0 });
    const untouched = loadSessionEntry({ storePath, sessionKey: key });
    expect(untouched?.status).toBe("done");
    expect(untouched?.abortedLastRun).toBeUndefined();
  } finally {
    closeOpenClawAgentDatabasesForTest();
    await fs.rm(stateDir, { recursive: true, force: true });
  }
});
