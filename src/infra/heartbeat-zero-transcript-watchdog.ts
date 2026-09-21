/**
 * Zero-transcript watchdog for heartbeat beats (P0-2, RCA beat-wedge plan #17).
 *
 * Signature fact: for EVERY observed beat-wedge failure the receipt went
 * `running` and the run produced ZERO `transcript_events` for its session
 * across the whole window — no prompt render, no model call, no tool result.
 * Both receipt classes (cap timeout, runner failure) waited 1685-1800 s for
 * exactly the observation this watchdog polls in ~30 s: if a RUNNING beat has
 * produced zero transcript events for its session within
 * `agents.defaults.heartbeatZeroTranscriptKillMs` (default 300_000, 0
 * disables) of run start, the run is killed locally and the ordinary cron
 * retry (BUG-089 C machinery) is scheduled immediately.
 *
 * Kill semantics: the kill is a definitive LOCAL observation — circuit-neutral,
 * never a provider failover (BUG-002c). The kill lever is the sanctioned scoped
 * run cancel (`resolveActiveReplyRunOwnerForSignal(signal)?.abort()`), the same
 * lever the agent-run-control endpoints use; the wake abort signal itself is
 * never aborted, so the wake bus performs no re-execution and the scheduled
 * cron retry stays the only re-execution path.
 */
import type { OpenClawConfig } from "../config/types.openclaw.js";
import {
  DEFAULT_HEARTBEAT_ZERO_TRANSCRIPT_KILL_MS,
  resolveHeartbeatZeroTranscriptKillMs,
} from "./heartbeat-runner-config.js";
import type { HeartbeatDeps } from "./heartbeat-runner-execution.js";

export const HEARTBEAT_ZERO_TRANSCRIPT_KILL_REASON = "zero-transcript-watchdog-kill";

/** Config surface for doctor copy and tests. */
export const HEARTBEAT_ZERO_TRANSCRIPT_KILL_CONFIG_PATH =
  "agents.defaults.heartbeatZeroTranscriptKillMs";

/** Poll cadence in production; tests derive a finer cadence from the kill window. */
const WATCHDOG_POLL_INTERVAL_MS = 30_000;

/** Bounded wait after the kill so the aborted turn owns its settlement before the fast retry lands. */
export const DEFAULT_WATCHDOG_KILL_SETTLE_GRACE_MS = 5_000;

/** Never poll faster than this, even for tiny test kill windows. */
const MIN_WATCHDOG_POLL_INTERVAL_MS = 20;

export type HeartbeatZeroTranscriptWatchdogScope = {
  cfg?: OpenClawConfig;
  agentId: string;
  storePath: string;
  sessionKey: string;
  startedAt: number;
  /**
   * Resolves the run's session transcript activity; tests inject counts. May
   * return a promise when the production probe resolves a dynamic import.
   */
  countTranscriptEvents: (scope: {
    agentId: string;
    storePath: string;
    sessionKey: string;
    sinceMs: number;
  }) => number | Promise<number>;
  /** Scoped definitive local kill lever; returns true when a run owner was cancelled. */
  kill: () => boolean;
  log?: {
    warn: (message: string, details?: Record<string, unknown>) => void;
  };
  /** Test-only kill settle grace override. */
  killSettleGraceMs?: number;
};

export type ArmedHeartbeatZeroTranscriptWatchdog = {
  /** Races the dispatch settlement against the watchdog kill. */
  race: (dispatch: Promise<unknown>) => Promise<"watchdog_kill" | "settled">;
  /** Stops polling; idempotent. */
  dispose: () => void;
  /** Test observation: the number of activity probes run so far. */
  probes: () => number;
};

function resolveWatchdogPollIntervalMs(killMs: number) {
  const derived = Math.floor(killMs / 4);
  if (!Number.isFinite(derived) || derived <= 0) {
    return WATCHDOG_POLL_INTERVAL_MS;
  }
  return Math.min(WATCHDOG_POLL_INTERVAL_MS, Math.max(MIN_WATCHDOG_POLL_INTERVAL_MS, derived));
}

/**
 * Arms the watchdog for one beat. Returns undefined when the kill window is 0
 * (disabled). The watchdog is disarmed by race() on settlement, so a healthy
 * beat pays at most one derived-cadence probe per window quarter.
 */
export function armHeartbeatZeroTranscriptWatchdog(
  scope: HeartbeatZeroTranscriptWatchdogScope,
): ArmedHeartbeatZeroTranscriptWatchdog | undefined {
  const killMs = resolveHeartbeatZeroTranscriptKillMs(scope.cfg);
  if (killMs <= 0) {
    return undefined;
  }
  const pollMs = resolveWatchdogPollIntervalMs(killMs);
  const graceMs = Math.max(
    0,
    Math.floor(scope.killSettleGraceMs ?? DEFAULT_WATCHDOG_KILL_SETTLE_GRACE_MS),
  );
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let fired = false;
  let probeCount = 0;
  let warnedProbeFailure = false;
  const killed = createWatchdogKillSignal();

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };
  const dispose = () => {
    disposed = true;
    clear();
  };

  const poll = async () => {
    if (disposed || fired) {
      return;
    }
    try {
      probeCount += 1;
      const count = await Promise.resolve(
        scope.countTranscriptEvents({
          agentId: scope.agentId,
          storePath: scope.storePath,
          sessionKey: scope.sessionKey,
          sinceMs: scope.startedAt,
        }),
      );
      if (count > 0) {
        // Transcript activity observed: the beat is executing. No kill signal.
        return;
      }
      if (Date.now() - scope.startedAt >= killMs) {
        fired = true;
        scope.log?.warn("heartbeat: zero transcript activity within the watchdog window", {
          agentId: scope.agentId,
          sessionKey: scope.sessionKey,
          windowMs: killMs,
        });
        killed.resolve("kill");
        return;
      }
    } catch (error) {
      // Unknown activity must never wedge-kill a beat: log once and keep polling.
      if (!warnedProbeFailure) {
        warnedProbeFailure = true;
        scope.log?.warn("heartbeat: zero-transcript watchdog probe failed", {
          agentId: scope.agentId,
          sessionKey: scope.sessionKey,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    if (!disposed && !fired) {
      timer = setTimeout(() => {
        void poll();
      }, pollMs);
      timer.unref?.();
    }
  };

  timer = setTimeout(() => {
    void poll();
  }, pollMs);
  timer.unref?.();

  return {
    race: async (dispatch) => {
      const dispatchSettled = dispatch.then(
        () => "settled" as const,
        () => "settled" as const,
      );
      const winner = await Promise.race([dispatchSettled, killed.promise]);
      dispose();
      if (winner !== "kill") {
        return "settled";
      }
      // Definitive local kill: scoped run cancel only. Never the wake abort
      // signal — aborting it would reject the wake dispatch and re-enqueue the
      // beat through the wake bus, adding a re-execution path beside the
      // scheduled cron retry.
      scope.kill();
      const killSettled = dispatch.then(
        () => "settled" as const,
        () => "settled" as const,
      );
      // The kill is definitive even when the aborted turn needs longer than the
      // grace to settle; the wrapper authors the run result at race() return.
      await Promise.race([killSettled, createWatchdogGrace(graceMs)]);
      // Release the dispatch's background rejection (if any) once the race has
      // made its decision, so the run result stays authoritative.
      void dispatch.catch(() => {});
      return "watchdog_kill";
    },
    dispose,
    probes: () => probeCount,
  };
}

/**
 * Production activity probe defaults shared by the run wrapper. The probe may
 * return a promise (it resolves a dynamic import); read failures are
 * caller-owned unknown activity, surfaced as a rejection for the poll loop's
 * once-per-watchdog warn.
 */
export function resolveHeartbeatZeroTranscriptProbeDefaults(params: {
  cfg?: OpenClawConfig;
  deps?: HeartbeatDeps;
}): Pick<HeartbeatZeroTranscriptWatchdogScope, "countTranscriptEvents"> {
  return {
    countTranscriptEvents: (scope) => {
      const injected = params.deps?.countRunTranscriptEvents;
      if (injected) {
        return injected(scope);
      }
      return import("../config/sessions/session-accessor.sqlite-transcript-probe.js").then(
        (module) =>
          module.countTranscriptEventsSince(
            {
              agentId: scope.agentId,
              storePath: scope.storePath,
              sessionKey: scope.sessionKey,
            },
            scope.sinceMs,
          ),
      );
    },
  };
}

function createWatchdogKillSignal() {
  let resolvePromise: ((value: "kill") => void) | undefined;
  const promise = new Promise<"kill">((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: (value: "kill") => resolvePromise?.(value) };
}

function createWatchdogGrace(ms: number): Promise<"grace"> {
  if (ms <= 0) {
    return Promise.resolve("grace");
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve("grace"), ms);
    timer.unref?.();
  });
}

/** Default watchdog window constant exported for doctor copy. */
export const HEARTBEAT_ZERO_TRANSCRIPT_DEFAULT_KILL_MS = DEFAULT_HEARTBEAT_ZERO_TRANSCRIPT_KILL_MS;
