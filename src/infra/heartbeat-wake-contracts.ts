export type HeartbeatRunResult =
  | { status: "ran"; durationMs: number }
  | { status: "skipped"; reason: string; retryAtMs?: number }
  | {
      status: "failed";
      reason: string;
      /**
       * Bounded real failure text carried by runner-level failures (P0-1).
       * The cron receipt composes it into error_text so the next wedge is
       * diagnosable in one query. Absent when the runner has no reply text.
       */
      failureText?: string;
      /**
       * Marker for definitive LOCAL kills (P0-2, zero-transcript watchdog).
       * Cron semantics: circuit-neutral — never a provider failover reason;
       * the scheduled retry machinery stays the only re-execution path.
       */
      failureKind?: "local_kill";
    };

export type HeartbeatWakeIntent = "scheduled" | "task" | "event" | "immediate" | "manual";

export type HeartbeatWakeSource =
  | "interval"
  | "manual"
  | "exec-event"
  | "notifications-event"
  | "cron"
  | "hook"
  | "background-task"
  | "background-task-blocked"
  | "acp-spawn"
  | "session-state"
  | "cli-watchdog"
  | "restart-sentinel"
  | "retry"
  | "other";

type HeartbeatWakeOverride = {
  target?: string;
  to?: string | undefined;
  accountId?: string | undefined;
};

/** Cron-owned periodic work carried directly into a guarded heartbeat turn. */
export type HeartbeatScheduledTask = {
  jobId: string;
  name: string;
  prompt: string;
};

export type HeartbeatWakeRequest = {
  source: HeartbeatWakeSource;
  intent: HeartbeatWakeIntent;
  reason?: string;
  agentId?: string;
  sessionKey?: string;
  heartbeat?: HeartbeatWakeOverride;
  /** Persisted cron monitor cadence carried with a scheduled heartbeat tick. */
  scheduledEveryMs?: number;
  tasks?: readonly HeartbeatScheduledTask[];
  /** Internal marker for work retained after a spacing/cooldown deferral. */
  retainedWork?: boolean;
};

export type HeartbeatWakeHandler = (opts: HeartbeatWakeRequest) => Promise<HeartbeatRunResult>;
