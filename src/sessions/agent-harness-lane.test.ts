import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { loadSessionEntry, upsertSessionEntry } from "../config/sessions/session-accessor.js";
import { ensureAgentHarnessLaneEpoch } from "./agent-harness-lane.js";

const temporaryPaths: string[] = [];

async function createStoredSession(entry: Record<string, unknown> = {}) {
  const dir = await mkdtemp(path.join(tmpdir(), "openclaw-harness-lane-"));
  temporaryPaths.push(dir);
  const storePath = path.join(dir, "sessions.json");
  const sessionKey = "agent:oscar:main";
  const sessionId = "session-1";
  await upsertSessionEntry(
    { agentId: "oscar", sessionKey, storePath },
    { sessionId, updatedAt: Date.now(), ...entry },
    { skipMaintenance: true, requireWriteSuccess: true },
  );
  return { storePath, sessionKey, sessionId };
}

afterEach(async () => {
  await Promise.all(temporaryPaths.splice(0).map((target) => rm(target, { recursive: true })));
});

describe("ensureAgentHarnessLaneEpoch", () => {
  it("durably claims the first lane without changing the active owner", async () => {
    const target = await createStoredSession({
      agentHarnessId: "openclaw",
      agentHarnessEpoch: "openclaw-active",
    });
    const claim = await ensureAgentHarnessLaneEpoch({
      agentId: "oscar",
      ...target,
      agentHarnessId: "codex",
    });
    const reloaded = loadSessionEntry({
      storePath: target.storePath,
      sessionKey: target.sessionKey,
    });
    expect(reloaded?.agentHarnessLaneEpochs?.codex).toBe(claim.epoch);
    expect(reloaded?.agentHarnessId).toBe("openclaw");
    expect(reloaded?.agentHarnessEpoch).toBe("openclaw-active");
  });

  it("concurrent claims converge on one epoch and preserve independent lanes", async () => {
    const target = await createStoredSession();
    const [first, second] = await Promise.all([
      ensureAgentHarnessLaneEpoch({ agentId: "oscar", ...target, agentHarnessId: "codex" }),
      ensureAgentHarnessLaneEpoch({ agentId: "oscar", ...target, agentHarnessId: "codex" }),
    ]);
    expect(first.epoch).toBe(second.epoch);
    const openclaw = await ensureAgentHarnessLaneEpoch({
      agentId: "oscar",
      ...target,
      agentHarnessId: "openclaw",
    });
    const reloaded = loadSessionEntry({
      storePath: target.storePath,
      sessionKey: target.sessionKey,
    });
    expect(reloaded?.agentHarnessLaneEpochs).toEqual({
      codex: first.epoch,
      openclaw: openclaw.epoch,
    });
  });

  it("rejects stale session identity and locked harness mismatches", async () => {
    const target = await createStoredSession({
      modelSelectionLocked: true,
      agentHarnessId: "codex",
      agentHarnessEpoch: "codex-active",
    });
    await expect(
      ensureAgentHarnessLaneEpoch({
        agentId: "oscar",
        ...target,
        sessionId: "replaced-session",
        agentHarnessId: "codex",
      }),
    ).rejects.toThrow(/missing or replaced session/);
    await expect(
      ensureAgentHarnessLaneEpoch({
        agentId: "oscar",
        ...target,
        agentHarnessId: "openclaw",
        modelSelectionLocked: true,
      }),
    ).rejects.toThrow(/Locked session harness mismatch/);
  });
});
