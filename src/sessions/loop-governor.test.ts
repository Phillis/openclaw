// Tests for the per-agent non-interactive loop governor.
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAutoCleanupTempDirTracker } from "../../test/helpers/temp-dir.js";
import {
  clearRuntimeConfigSnapshot,
  setRuntimeConfigSnapshot,
} from "../config/runtime-snapshot.js";
import type { OpenClawConfig } from "../config/types.openclaw.js";
import { closeOpenClawStateDatabaseForTest } from "../state/openclaw-state-db.js";
import {
  checkLoopGovernorAdmission,
  loopGovernorHourBucket,
  LoopGovernorBudgetExceededError,
} from "./loop-governor.js";
import {
  beginSessionWorkAdmission,
  type SessionWorkAdmissionLease,
} from "./session-lifecycle-admission.js";

const tempDirs = useAutoCleanupTempDirTracker(afterEach);

function stateOptions() {
  return { path: join(tempDirs.make("openclaw-loop-governor-"), "openclaw.sqlite") };
}

function makeCfg(maxTurnsPerHour = 3, agents = ["oscar"]): OpenClawConfig {
  return { agents: { loopGovernor: { agents, maxTurnsPerHour } } } as OpenClawConfig;
}

const CRON_KEYS = ["agent:oscar:cron:daily:run:abc123", "agent:oscar:cron:watch:run:xyz"];
const SUBAGENT_REQUEST_KEY = "agent:oscar:subagent:leaf";
const INC0GNITO_KEY = "agent:oscar:dashboard:incognito-automation";
const INTERACTIVE_KEY = "agent:oscar:discord:dm:someuser";
const NON_GOVERNED_KEY = "agent:bob:cron:job:run:1";

afterEach(() => {
  closeOpenClawStateDatabaseForTest();
  clearRuntimeConfigSnapshot();
});

describe("loop governor via session work admission", () => {
  it("parks non-interactive admissions after the hourly budget; interactive never", async () => {
    const cfg = makeCfg(2, ["oscar"]);
    // The admission chokepoint resolves the shared state DB via env, so point
    // the global state dir at the temp dir for this integration test.
    const prevDir = process.env.OPENCLAW_STATE_DIR;
    process.env.OPENCLAW_STATE_DIR = tempDirs.make("openclaw-loop-governor-admission-");
    setRuntimeConfigSnapshot(cfg as OpenClawConfig);
    const leases: SessionWorkAdmissionLease[] = [];
    try {
      leases.push(
        await beginSessionWorkAdmission({
          scope: "scope",
          identities: [CRON_KEYS[0]],
          assertAllowed: () => {},
        }),
      );
      leases.push(
        await beginSessionWorkAdmission({
          scope: "scope",
          identities: [CRON_KEYS[1]],
          assertAllowed: () => {},
        }),
      );
      // Third non-interactive admission parked with the typed error.
      await expect(
        beginSessionWorkAdmission({
          scope: "scope",
          identities: [SUBAGENT_REQUEST_KEY],
          assertAllowed: () => {},
        }),
      ).rejects.toThrow(LoopGovernorBudgetExceededError);
      // Interactive DM-shaped admission still admitted at breach.
      const interactive = await beginSessionWorkAdmission({
        scope: "scope",
        identities: [INTERACTIVE_KEY],
        assertAllowed: () => {},
      });
      leases.push(interactive);
    } finally {
      for (const lease of leases) {
        lease.release();
      }
      if (prevDir === undefined) {
        delete process.env.OPENCLAW_STATE_DIR;
      } else {
        process.env.OPENCLAW_STATE_DIR = prevDir;
      }
    }
  });
});

describe("loop governor", () => {
  it("feature-off default: no policy => every turn admitted", () => {
    const options = stateOptions();
    for (let i = 0; i < 6; i += 1) {
      expect(
        checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg: null, stateOptions: options }),
      ).toBe(true);
    }
  });

  it("feature-off default: absent agents list => every turn admitted", () => {
    const options = stateOptions();
    const cfg = { agents: {} } as OpenClawConfig;
    expect(
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: options }),
    ).toBe(true);
  });

  it("enforces the budget on a synthetic runaway cron loop", () => {
    const options = stateOptions();
    const cfg = makeCfg(3, ["oscar"]);
    const alert = vi.fn();
    for (let i = 0; i < 3; i += 1) {
      expect(
        checkLoopGovernorAdmission({
          sessionKey: CRON_KEYS[0],
          cfg,
          stateOptions: options,
          onAlert: alert,
        }),
      ).toBe(true);
    }
    // Further non-interactive admissions rejected with the typed error.
    for (let i = 0; i < 2; i += 1) {
      expect(() =>
        checkLoopGovernorAdmission({
          sessionKey: CRON_KEYS[0],
          cfg,
          stateOptions: options,
          onAlert: alert,
        }),
      ).toThrow(LoopGovernorBudgetExceededError);
    }
    // Alert fires once per breach-hour, not per turned-away turn.
    expect(alert).toHaveBeenCalledTimes(1);
  });

  it("counts all non-interactive key shapes (cron/subagent/incognito) together", () => {
    const options = stateOptions();
    const cfg = makeCfg(3, ["oscar"]);
    expect(
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: options }),
    ).toBe(true);
    expect(
      checkLoopGovernorAdmission({ sessionKey: SUBAGENT_REQUEST_KEY, cfg, stateOptions: options }),
    ).toBe(true);
    expect(
      checkLoopGovernorAdmission({ sessionKey: INC0GNITO_KEY, cfg, stateOptions: options }),
    ).toBe(true);
    // A further non-interactive admission now exceeds the budget.
    expect(() =>
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[1], cfg, stateOptions: options }),
    ).toThrow(LoopGovernorBudgetExceededError);
  });

  it("never blocks interactive DM-shaped admissions even at breach", () => {
    const options = stateOptions();
    const cfg = makeCfg(1, ["oscar"]);
    expect(
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: options }),
    ).toBe(true);
    // Budget exhausted for non-interactive.
    expect(() =>
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[1], cfg, stateOptions: options }),
    ).toThrow(LoopGovernorBudgetExceededError);
    // Interactive DM is immune even at breach.
    expect(
      checkLoopGovernorAdmission({ sessionKey: INTERACTIVE_KEY, cfg, stateOptions: options }),
    ).toBe(true);
  });

  it("ignores agents not in the governed list", () => {
    const options = stateOptions();
    const cfg = makeCfg(1, ["oscar"]);
    for (let i = 0; i < 4; i += 1) {
      expect(
        checkLoopGovernorAdmission({ sessionKey: NON_GOVERNED_KEY, cfg, stateOptions: options }),
      ).toBe(true);
    }
  });

  it("is durable across state re-open (restart)", () => {
    const options = stateOptions();
    const cfg = makeCfg(3, ["oscar"]);
    for (let i = 0; i < 2; i += 1) {
      expect(
        checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: options }),
      ).toBe(true);
    }
    closeOpenClawStateDatabaseForTest();
    // Re-open the same db file and a fresh process-equivalent module state.
    expect(
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: options }),
    ).toBe(true);
    expect(() =>
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[1], cfg, stateOptions: options }),
    ).toThrow(LoopGovernorBudgetExceededError);
  });

  it("fails open to admit when the state store cannot persist", () => {
    const cfg = makeCfg(1, ["oscar"]);
    // An invalid state path that cannot resolve must not block admission.
    const badOptions = {
      path: "/nonexistent-bad-path/should/fail/x.sqlite",
      env: { OPENCLAW_STATE_DIR: "/nonexistent/x" },
    };
    expect(
      checkLoopGovernorAdmission({ sessionKey: CRON_KEYS[0], cfg, stateOptions: badOptions }),
    ).toBe(true);
  });

  it("exposes the hour bucket reset at a UTC hour boundary", () => {
    const options = stateOptions();
    const cfg = makeCfg(1, ["oscar"]);
    const hourMs = 3_600_000;
    const now0 = hourMs;
    expect(
      checkLoopGovernorAdmission({
        sessionKey: CRON_KEYS[0],
        cfg,
        stateOptions: options,
        nowMs: now0,
      }),
    ).toBe(true);
    expect(() =>
      checkLoopGovernorAdmission({
        sessionKey: CRON_KEYS[1],
        cfg,
        stateOptions: options,
        nowMs: now0,
      }),
    ).toThrow(LoopGovernorBudgetExceededError);
    // Next hour bucket resets the budget.
    expect(loopGovernorHourBucket(now0)).not.toBe(loopGovernorHourBucket(now0 + hourMs));
    expect(
      checkLoopGovernorAdmission({
        sessionKey: CRON_KEYS[0],
        cfg,
        stateOptions: options,
        nowMs: now0 + hourMs,
      }),
    ).toBe(true);
  });
});
