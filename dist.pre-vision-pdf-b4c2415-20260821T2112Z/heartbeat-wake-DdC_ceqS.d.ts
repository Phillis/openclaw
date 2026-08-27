//#region src/infra/heartbeat-wake-contracts.d.ts
type HeartbeatRunResult = {
  status: "ran";
  durationMs: number;
} | {
  status: "skipped";
  reason: string;
  retryAtMs?: number;
} | {
  status: "failed";
  reason: string;
};
type HeartbeatWakeIntent = "scheduled" | "task" | "event" | "immediate" | "manual";
type HeartbeatWakeSource = "interval" | "manual" | "exec-event" | "notifications-event" | "cron" | "hook" | "background-task" | "background-task-blocked" | "acp-spawn" | "session-state" | "cli-watchdog" | "restart-sentinel" | "retry" | "other";
type HeartbeatWakeOverride = {
  target?: string;
  to?: string | undefined;
  accountId?: string | undefined;
};
/** Cron-owned periodic work carried directly into a guarded heartbeat turn. */
type HeartbeatScheduledTask = {
  jobId: string;
  name: string;
  prompt: string;
};
//#endregion
//#region src/infra/heartbeat-wake.d.ts
declare function requestHeartbeat(opts: {
  source: HeartbeatWakeSource;
  intent: HeartbeatWakeIntent;
  reason?: string;
  coalesceMs?: number;
  agentId?: string;
  sessionKey?: string;
  heartbeat?: HeartbeatWakeOverride;
  scheduledEveryMs?: number;
  scheduledAnchorMs?: number;
  tasks?: readonly HeartbeatScheduledTask[];
}): void;
//#endregion
export { HeartbeatRunResult as n, requestHeartbeat as t };