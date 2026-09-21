// P0-2 watchdog module regressions: the zero-transcript window kill, the
// activity guard, probe-failure neutrality, and the config resolution
// (default-on, 0 disables, override).
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { resolveHeartbeatZeroTranscriptKillMs } from "./heartbeat-runner-config.js";
import {
  armHeartbeatZeroTranscriptWatchdog,
  DEFAULT_WATCHDOG_KILL_SETTLE_GRACE_MS,
  HEARTBEAT_ZERO_TRANSCRIPT_KILL_CONFIG_PATH,
  resolveHeartbeatZeroTranscriptProbeDefaults,
} from "./heartbeat-zero-transcript-watchdog.js";

function makeCfg(killMs: number | undefined): OpenClawConfig {
  const defaults: Record<string, unknown> = {};
  if (killMs !== undefined) {
    defaults.heartbeatZeroTranscriptKillMs = killMs;
  }
  return {
    agents: {
      defaults,
    },
  } as OpenClawConfig;
}

describe("heartbeat zero-transcript watchdog config (P0-2)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("resolves default-on 300_000 when the field is unset", () => {
    expect(resolveHeartbeatZeroTranscriptKillMs(undefined)).toBe(300_000);
    expect(resolveHeartbeatZeroTranscriptKillMs(makeCfg(undefined))).toBe(300_000);
  });

  it("honors overrides and disables at 0", () => {
    expect(resolveHeartbeatZeroTranscriptKillMs(makeCfg(0))).toBe(0);
    expect(resolveHeartbeatZeroTranscriptKillMs(makeCfg(1000))).toBe(1000);
    expect(resolveHeartbeatZeroTranscriptKillMs(makeCfg(-5))).toBe(300_000);
    expect(HEARTBEAT_ZERO_TRANSCRIPT_KILL_CONFIG_PATH).toBe(
      "agents.defaults.heartbeatZeroTranscriptKillMs",
    );
    expect(DEFAULT_WATCHDOG_KILL_SETTLE_GRACE_MS).toBe(5_000);
  });
});

describe("armHeartbeatZeroTranscriptWatchdog", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  function arm(params: {
    killMs: number;
    count: (sinceMs: number) => number;
    log?: { warn: (message: string, details?: Record<string, unknown>) => void };
  }) {
    vi.useFakeTimers();
    const startedAt = Date.now();
    const kill = vi.fn(() => false);
    const watchdog = armHeartbeatZeroTranscriptWatchdog({
      cfg: makeCfg(params.killMs),
      agentId: "main",
      storePath: "/tmp/watchdog-test-store",
      sessionKey: "agent:main:main:heartbeat",
      startedAt,
      countTranscriptEvents: (scope) => params.count(scope.sinceMs),
      kill,
      log: params.log,
      killSettleGraceMs: 0,
    });
    return { watchdog, kill, startedAt };
  }

  it("is disabled when the kill window is 0", () => {
    vi.useFakeTimers();
    const watchdog = armHeartbeatZeroTranscriptWatchdog({
      cfg: makeCfg(0),
      agentId: "main",
      storePath: "/tmp",
      sessionKey: "agent:main:main:heartbeat",
      startedAt: Date.now(),
      countTranscriptEvents: () => 0,
      kill: () => false,
    });
    expect(watchdog).toBeUndefined();
  });

  it("fires the scoped kill and returns watchdog_kill after zero activity at the window", async () => {
    const log = { warn: vi.fn() };
    const { watchdog, kill } = arm({ killMs: 200, count: () => 0, log });
    expect(watchdog).toBeDefined();
    const hungDispatch = new Promise<never>(() => {});
    const racePromise = watchdog!.race(hungDispatch);
    let settled = false;
    void racePromise.then((outcome) => {
      settled = true;
      expect(outcome).toBe("watchdog_kill");
    });
    // Derived poll cadence = window/4 = 50ms; polls at 50/100/150 stay under
    // the window, the poll at 200 fires the kill.
    await vi.advanceTimersByTimeAsync(250);
    expect(settled).toBe(true);
    expect(kill).toHaveBeenCalledTimes(1);
    expect(watchdog!.probes()).toBeGreaterThanOrEqual(4);
    expect(log.warn).toHaveBeenCalledWith(
      "heartbeat: zero transcript activity within the watchdog window",
      expect.objectContaining({ sessionKey: "agent:main:main:heartbeat", windowMs: 200 }),
    );
    // Dispose is idempotent and stops further polling.
    watchdog!.dispose();
  });

  it("keeps a zero-activity beat alive before the window elapses and settles normally", async () => {
    const { watchdog, kill } = arm({ killMs: 500, count: () => 0 });
    expect(watchdog).toBeDefined();
    const dispatch = Promise.withResolvers<void>();
    const racePromise = watchdog!.race(dispatch.promise);
    let settled = false;
    void racePromise.then((outcome) => {
      settled = true;
      expect(outcome).toBe("settled");
    });
    // Under the window: no kill even though every probe sees zero events.
    await vi.advanceTimersByTimeAsync(300);
    expect(settled).toBe(false);
    expect(kill).not.toHaveBeenCalled();
    dispatch.resolve();
    await racePromise;
    expect(settled).toBe(true);
    expect(kill).not.toHaveBeenCalled();
  });

  it("stays alive once transcript activity is observed and settles normally", async () => {
    const { watchdog, kill } = arm({ killMs: 200, count: () => 1 });
    expect(watchdog).toBeDefined();
    const dispatch = Promise.withResolvers<void>();
    const racePromise = watchdog!.race(dispatch.promise);
    let settled = false;
    void racePromise.then((outcome) => {
      settled = true;
      expect(outcome).toBe("settled");
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(settled).toBe(false);
    expect(kill).not.toHaveBeenCalled();
    dispatch.resolve();
    await racePromise;
    expect(settled).toBe(true);
  });

  it("never kills on probe failures — unknown activity keeps polling", async () => {
    const log = { warn: vi.fn() };
    let calls = 0;
    const { watchdog, kill } = arm({
      killMs: 200,
      count: () => {
        calls += 1;
        throw new Error("probe db busy");
      },
      log,
    });
    expect(watchdog).toBeDefined();
    const dispatch = Promise.withResolvers<void>();
    const racePromise = watchdog!.race(dispatch.promise);
    let settled = false;
    void racePromise.then((outcome) => {
      settled = true;
      expect(outcome).toBe("settled");
    });
    await vi.advanceTimersByTimeAsync(1000);
    expect(settled).toBe(false);
    expect(kill).not.toHaveBeenCalled();
    expect(calls).toBeGreaterThanOrEqual(3);
    expect(log.warn).toHaveBeenCalledWith(
      "heartbeat: zero-transcript watchdog probe failed",
      expect.objectContaining({ error: "probe db busy" }),
    );
    dispatch.resolve();
    await racePromise;
    expect(settled).toBe(true);
  });

  it("kills through the scoped lever even when the probe lever reports no owner", async () => {
    vi.useFakeTimers();
    const startedAt = Date.now();
    const kill = vi.fn(() => false);
    const watchdog = armHeartbeatZeroTranscriptWatchdog({
      cfg: makeCfg(100),
      agentId: "main",
      storePath: "/tmp/watchdog-test-store",
      sessionKey: "agent:main:main:heartbeat",
      startedAt,
      countTranscriptEvents: () => 0,
      kill,
      killSettleGraceMs: 0,
    });
    expect(watchdog).toBeDefined();
    // A hung dispatch that NEVER settles (settlement arrives only via the
    // watchdog grace path): the race must still return watchdog_kill and fire
    // the scoped lever even with zero settle grace.
    const hungDispatch = Promise.withResolvers<void>();
    hungDispatch.promise.catch(() => {});
    const racePromise = watchdog!.race(hungDispatch.promise);
    let settled = false;
    void racePromise.then((outcome) => {
      settled = true;
      expect(outcome).toBe("watchdog_kill");
    });
    await vi.advanceTimersByTimeAsync(500);
    expect(settled).toBe(true);
    expect(kill).toHaveBeenCalledTimes(1);
    watchdog!.dispose();
  });
});

describe("resolveHeartbeatZeroTranscriptProbeDefaults", () => {
  it("prefers the injected test probe and otherwise resolves the production count", async () => {
    const injected = vi.fn(() => 7);
    const injectedDefaults = resolveHeartbeatZeroTranscriptProbeDefaults({
      deps: { countRunTranscriptEvents: injected },
    });
    await expect(
      Promise.resolve(
        injectedDefaults.countTranscriptEvents({
          agentId: "main",
          storePath: "/tmp",
          sessionKey: "agent:main:main:heartbeat",
          sinceMs: 123,
        }),
      ),
    ).resolves.toBe(7);
    expect(injected).toHaveBeenCalledWith({
      agentId: "main",
      storePath: "/tmp",
      sessionKey: "agent:main:main:heartbeat",
      sinceMs: 123,
    });

    const productionDefaults = resolveHeartbeatZeroTranscriptProbeDefaults({});
    await expect(
      Promise.resolve(
        productionDefaults.countTranscriptEvents({
          agentId: "main",
          storePath: "/tmp/watchdog-missing-store",
          sessionKey: "agent:main:main:heartbeat",
          sinceMs: 5,
        }),
      ).catch(() => 0),
    ).resolves.toBeDefined();
  });
});
