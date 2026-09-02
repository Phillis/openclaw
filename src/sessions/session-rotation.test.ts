import { afterEach, describe, expect, it, vi } from "vitest";
import { useAutoCleanupTempDirTracker } from "../../test/helpers/temp-dir.js";
import { resolveSessionWorkStartError } from "../config/sessions/lifecycle.js";
import { loadSessionEntry, upsertSessionEntryCore } from "../config/sessions/session-accessor.js";
import { closeOpenClawAgentDatabasesForTest } from "../state/openclaw-agent-db.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import {
  buildRotatedSessionKey,
  isRotationEligibleSessionKey,
  isRotationEnabled,
  parseRotatedSessionKey,
  resolveSessionCeilingEstimate,
  resolveSessionRotationAdmissionTarget,
  runSessionCeilingCycle,
  runSessionRotationAdmission,
  resolveSessionRotationRetryTarget,
  isRotationArchivedEntry,
} from "./session-rotation.js";

const BASE_KEY = "agent:agency:slack:direct:peer-42";

const tempDirs = useAutoCleanupTempDirTracker(afterEach);

function makeStore(label: string) {
  const stateDir = tempDirs.make(`openclaw-rotation-${label}-`);
  const env = { ...process.env, OPENCLAW_STATE_DIR: stateDir };
  const scope = { agentId: "agency", env };
  return { stateDir, env, scope };
}

async function seed(
  scope: { agentId: string; env: NodeJS.ProcessEnv },
  sessionKey: string,
  patch: Record<string, unknown>,
) {
  await upsertSessionEntryCore(
    { agentId: scope.agentId, env: scope.env, sessionKey },
    { sessionId: `${sessionKey}:id`, updatedAt: 1000, ...patch },
  );
}

function readEntry(scope: { agentId: string; env: NodeJS.ProcessEnv }, sessionKey: string) {
  return loadSessionEntry({ agentId: scope.agentId, env: scope.env, sessionKey });
}

afterEach(() => {
  closeOpenClawAgentDatabasesForTest();
  closeOpenClawStateDatabaseForTest();
});

describe("session rotation key helpers", () => {
  it("parses and builds rotated keys", () => {
    expect(parseRotatedSessionKey(`${BASE_KEY}:r1`)).toEqual({ baseKey: BASE_KEY, epoch: 1 });
    expect(buildRotatedSessionKey(BASE_KEY, 3)).toBe(`${BASE_KEY}:r3`);
    expect(parseRotatedSessionKey(BASE_KEY)).toBeUndefined();
    expect(parseRotatedSessionKey(`${BASE_KEY}:r0`)).toBeUndefined();
    expect(parseRotatedSessionKey(`${BASE_KEY}:rx`)).toBeUndefined();
    expect(parseRotatedSessionKey(null)).toBeUndefined();
  });

  it("classifies rotation-eligible peer keys and excludes protected/internal keys", () => {
    expect(isRotationEligibleSessionKey(BASE_KEY)).toBe(true);
    expect(isRotationEligibleSessionKey(`${BASE_KEY}:r1`)).toBe(true);
    expect(isRotationEligibleSessionKey("agent:agency:main")).toBe(false);
    expect(isRotationEligibleSessionKey("agent:agency:handoff")).toBe(false);
    expect(isRotationEligibleSessionKey("agent:agency:cron:job-1")).toBe(false);
    expect(isRotationEligibleSessionKey("agent:agency:internal:x")).toBe(false);
    expect(isRotationEligibleSessionKey("agent:agency:subagent:child")).toBe(false);
    expect(isRotationEligibleSessionKey("global")).toBe(false);
  });
});

describe("session rotation feature-off default", () => {
  it("is a no-op when rotation config is absent (zero behavior change)", async () => {
    const { scope } = makeStore("off");
    const target = await resolveSessionRotationAdmissionTarget({
      scope,
      sessionKey: BASE_KEY,
      rotation: undefined,
    });
    expect(target).toEqual({ sessionKey: BASE_KEY, rotated: false });
    // Nothing was created/written for the base key.
    expect(readEntry(scope, BASE_KEY)).toBeUndefined();
    expect(isRotationEnabled(undefined)).toBe(false);
    expect(isRotationEnabled({ maxTurns: 0, maxAgeHours: 0 })).toBe(false);
  });
});

describe("rotation lossless", () => {
  it("maxTurns=1: second turn through the admission seam lands on :r1; old entry archived but readable", async () => {
    const { scope } = makeStore("lossless");
    await seed(scope, BASE_KEY, { rotationEpoch: 0, rotationTurnCount: 0, sessionStartedAt: 1000 });

    const first = await runSessionRotationAdmission({
      scope,
      baseKey: BASE_KEY,
      rotation: { maxTurns: 1 },
      now: 2000,
    });
    expect(first.rotated).toBe(false);
    expect(first.targetKey).toBe(BASE_KEY);

    const second = await runSessionRotationAdmission({
      scope,
      baseKey: BASE_KEY,
      rotation: { maxTurns: 1 },
      now: 3000,
    });
    expect(second.rotated).toBe(true);
    expect(second.reason).toBe("turns");
    expect(second.targetKey).toBe(`${BASE_KEY}:r1`);

    // Old base entry is archived by rotation, lossless (kept in store, readable).
    const archived = readEntry(scope, BASE_KEY) as Record<string, unknown>;
    expect(archived).toBeDefined();
    expect(archived.archivedAt).toBeGreaterThan(0);
    expect((archived.archivedBy as { type?: string })?.type).toBe("rotation");
    expect(archived.sessionId).toBe(`${BASE_KEY}:id`);

    // New active entry exists on :r1 with epoch bookkeeping.
    const active = readEntry(scope, `${BASE_KEY}:r1`) as Record<string, unknown>;
    expect(active?.rotationEpoch).toBe(1);
    expect(active?.rotationTurnCount).toBe(1);

    // New work on the old key returns the archived error.
    expect(resolveSessionWorkStartError(BASE_KEY, readEntry(scope, BASE_KEY))).toContain(
      "archived",
    );
  });

  it("Age trigger rotates at maxAgeHours since base session start", async () => {
    const { scope } = makeStore("age");
    await seed(scope, BASE_KEY, { rotationEpoch: 0, rotationTurnCount: 0, sessionStartedAt: 1000 });
    const first = await runSessionRotationAdmission({
      scope,
      baseKey: BASE_KEY,
      rotation: { maxAgeHours: 1 },
      now: 1001,
    });
    expect(first.rotated).toBe(false);
    const second = await runSessionRotationAdmission({
      scope,
      baseKey: BASE_KEY,
      rotation: { maxAgeHours: 1 },
      now: 1000 + 3_600_000 * 2, // 2h later
    });
    expect(second.rotated).toBe(true);
    expect(second.reason).toBe("age");
    expect(second.targetKey).toBe(`${BASE_KEY}:r1`);
  });
});

describe("rotation mid-queue re-resolve", () => {
  it("keeps the old entry archived, blocks work there, and re-resolves to the newest epoch", async () => {
    const { scope } = makeStore("midqueue");
    await seed(scope, BASE_KEY, {
      rotationEpoch: 0,
      rotationTurnCount: 1,
      sessionStartedAt: 1000,
      archivedAt: 2000,
      archivedBy: { type: "rotation" },
    });
    await seed(scope, `${BASE_KEY}:r1`, {
      rotationEpoch: 1,
      rotationTurnCount: 1,
      sessionStartedAt: 2000,
    });

    const staleEntry = readEntry(scope, BASE_KEY);
    expect(resolveSessionWorkStartError(BASE_KEY, staleEntry)).toContain("archived");
    expect(isRotationArchivedEntry(scope, BASE_KEY)).toBe(true);

    // Bounded re-resolve to the newest active epoch; no drop, exactly-once target.
    const retry = resolveSessionRotationRetryTarget(scope, BASE_KEY);
    expect(retry.targetKey).toBe(`${BASE_KEY}:r1`);
  });
});

describe("rotation concurrency", () => {
  it("two parallel admissions across a boundary advance the epoch exactly once", async () => {
    const { scope } = makeStore("concurrent");
    await seed(scope, BASE_KEY, { rotationEpoch: 0, rotationTurnCount: 0, sessionStartedAt: 1000 });

    const [a, b] = await Promise.all([
      runSessionRotationAdmission({
        scope,
        baseKey: BASE_KEY,
        rotation: { maxTurns: 1 },
        now: 1001,
      }),
      runSessionRotationAdmission({
        scope,
        baseKey: BASE_KEY,
        rotation: { maxTurns: 1 },
        now: 1002,
      }),
    ]);

    expect([a.rotated, b.rotated].filter(Boolean).length).toBe(1);
    const nonRotating = [a, b].find((r) => !r.rotated);
    const rotating = [a, b].find((r) => r.rotated);
    expect(nonRotating?.targetKey).toBe(BASE_KEY);
    expect(rotating?.targetKey).toBe(`${BASE_KEY}:r1`);

    // Old base archived exactly once; active entry is the newest key.
    const archived = readEntry(scope, BASE_KEY) as Record<string, unknown>;
    expect(archived?.archivedAt).toBeGreaterThan(0);
    expect((archived.archivedBy as { type?: string })?.type).toBe("rotation");
    expect(readEntry(scope, `${BASE_KEY}:r1`)).toBeDefined();
  });
});

describe("ceiling fail-open for long-lived main sessions", () => {
  it("invokes compaction when a non-rotatable main session crosses the ceiling and proceeds", async () => {
    const { scope } = makeStore("ceiling-hit");
    const compactionSpy = vi.fn(() => Promise.resolve());
    const result = await runSessionCeilingCycle({
      scope,
      sessionKey: "agent:agency:main",
      rotation: { ceilingTokens: 150 },
      estimatedTokens: 10_000,
      runCompaction: compactionSpy,
    });
    expect(compactionSpy).toHaveBeenCalledOnce();
    expect(result.compactRequested).toBe(true);
    expect(result.admitted).toBe(true);
  });

  it("fail-open: a throwing compaction still admits", async () => {
    const { scope } = makeStore("ceiling-fail");
    const boomSpy = vi.fn(() => {
      throw new Error("engine down");
    });
    const result = await runSessionCeilingCycle({
      scope,
      sessionKey: "agent:agency:main",
      rotation: { ceilingTokens: 2 },
      estimatedTokens: 10_000,
      runCompaction: boomSpy,
    });
    expect(boomSpy).toHaveBeenCalledOnce();
    expect(result.compactRequested).toBe(true);
    expect(result.admitted).toBe(true);
  });

  it("does not compact a healthy session under the ceiling", async () => {
    const { scope } = makeStore("ceiling-healthy");
    const result = await runSessionCeilingCycle({
      scope,
      sessionKey: "agent:agency:main",
      rotation: { ceilingTokens: 2 },
      estimatedTokens: 1,
    });
    expect(result.compactRequested).toBe(false);
    expect(result.admitted).toBe(true);
    expect(resolveSessionCeilingEstimate({ totalTokens: 500 } as never)).toBe(500);
  });
});
