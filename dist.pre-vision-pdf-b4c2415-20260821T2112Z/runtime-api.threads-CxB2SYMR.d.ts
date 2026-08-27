import { m as ThreadBindingRecord } from "./thread-bindings-EOC1OZLV.js";

//#region src/channels/thread-bindings-messages.d.ts
/** Formats thread-binding timeout durations for compact user-facing messages. */
declare function formatThreadBindingDurationLabel(durationMs: number): string;
/** Builds the native thread name for a focused thread-bound session. */
declare function resolveThreadBindingThreadName(params: {
  agentId?: string;
  label?: string;
}): string;
/** Builds the system-prefixed intro text posted when a thread binding becomes active. */
declare function resolveThreadBindingIntroText(params: {
  agentId?: string;
  label?: string;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
  sessionCwd?: string;
  sessionDetails?: string[];
}): string;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.persona.d.ts
declare function resolveThreadBindingPersona(params: {
  label?: string;
  agentId?: string;
}): string;
declare function resolveThreadBindingPersonaFromRecord(record: ThreadBindingRecord): string;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.state.d.ts
declare function resolveThreadBindingIdleTimeoutMs(params: {
  record: Pick<ThreadBindingRecord, "idleTimeoutMs">;
  defaultIdleTimeoutMs: number;
}): number;
declare function resolveThreadBindingMaxAgeMs(params: {
  record: Pick<ThreadBindingRecord, "maxAgeMs">;
  defaultMaxAgeMs: number;
}): number;
declare function resolveThreadBindingInactivityExpiresAt(params: {
  record: Pick<ThreadBindingRecord, "lastActivityAt" | "idleTimeoutMs">;
  defaultIdleTimeoutMs: number;
}): number | undefined;
declare function resolveThreadBindingMaxAgeExpiresAt(params: {
  record: Pick<ThreadBindingRecord, "boundAt" | "maxAgeMs">;
  defaultMaxAgeMs: number;
}): number | undefined;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.session-updates.d.ts
declare function setThreadBindingIdleTimeoutBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  idleTimeoutMs: number;
}): ThreadBindingRecord[];
declare function setThreadBindingMaxAgeBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  maxAgeMs: number;
}): ThreadBindingRecord[];
//#endregion
export { resolveThreadBindingMaxAgeExpiresAt as a, resolveThreadBindingPersonaFromRecord as c, resolveThreadBindingThreadName as d, resolveThreadBindingInactivityExpiresAt as i, formatThreadBindingDurationLabel as l, setThreadBindingMaxAgeBySessionKey as n, resolveThreadBindingMaxAgeMs as o, resolveThreadBindingIdleTimeoutMs as r, resolveThreadBindingPersona as s, setThreadBindingIdleTimeoutBySessionKey as t, resolveThreadBindingIntroText as u };