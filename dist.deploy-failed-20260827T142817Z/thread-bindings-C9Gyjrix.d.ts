import { n as OpenClawConfig } from "./types.openclaw-Djf9z9fV.js";
import { a as SessionEntry, x as SessionAcpMeta } from "./types-BlSI-hFu.js";
import { DatabaseSync } from "node:sqlite";
//#region extensions/discord/src/monitor/thread-bindings.types.d.ts
type ThreadBindingTargetKind = "subagent" | "acp";
type ThreadBindingRecord = {
  accountId: string;
  channelId: string;
  threadId: string;
  targetKind: ThreadBindingTargetKind;
  targetSessionKey: string;
  agentId: string;
  label?: string;
  webhookId?: string;
  webhookToken?: string;
  boundBy: string;
  boundAt: number;
  lastActivityAt: number; /** Inactivity timeout window in milliseconds (0 disables inactivity auto-unfocus). */
  idleTimeoutMs?: number; /** Hard max-age window in milliseconds from bind time (0 disables hard cap). */
  maxAgeMs?: number;
  metadata?: Record<string, unknown>;
};
type ThreadBindingManager = {
  accountId: string;
  getIdleTimeoutMs: () => number;
  getMaxAgeMs: () => number;
  getByThreadId: (threadId: string) => ThreadBindingRecord | undefined;
  getBySessionKey: (targetSessionKey: string) => ThreadBindingRecord | undefined;
  listBySessionKey: (targetSessionKey: string) => ThreadBindingRecord[];
  listBindings: () => ThreadBindingRecord[];
  touchThread: (params: {
    threadId: string;
    at?: number;
    persist?: boolean;
  }) => ThreadBindingRecord | null;
  bindTarget: (params: {
    threadId?: string | number;
    channelId?: string;
    createThread?: boolean;
    threadName?: string;
    targetKind: ThreadBindingTargetKind;
    targetSessionKey: string;
    agentId?: string;
    label?: string;
    boundBy?: string;
    introText?: string;
    webhookId?: string;
    webhookToken?: string;
    metadata?: Record<string, unknown>;
  }) => Promise<ThreadBindingRecord | null>;
  unbindThread: (params: {
    threadId: string;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord | null;
  unbindBySessionKey: (params: {
    targetSessionKey: string;
    targetKind?: ThreadBindingTargetKind;
    reason?: string;
    sendFarewell?: boolean;
    farewellText?: string;
  }) => ThreadBindingRecord[];
  stop: () => void;
};
//#endregion
//#region src/channels/thread-bindings-policy.d.ts
/** Resolves the effective enabled flag for thread bindings. */
declare function resolveThreadBindingsEnabled(params: {
  channelEnabledRaw: unknown;
  sessionEnabledRaw: unknown;
}): boolean;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.config.d.ts
declare function resolveDiscordThreadBindingIdleTimeoutMs(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): number;
declare function resolveDiscordThreadBindingMaxAgeMs(params: {
  cfg: OpenClawConfig;
  accountId?: string;
}): number;
//#endregion
//#region src/acp/runtime/session-meta.d.ts
type AcpSessionStoreEntry = {
  cfg: OpenClawConfig;
  agentId?: string;
  storePath: string;
  sessionKey: string;
  storeSessionKey: string;
  entry?: SessionEntry;
  acp?: SessionAcpMeta;
  storeReadFailed?: boolean;
};
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.lifecycle.d.ts
type AcpThreadBindingReconciliationResult = {
  checked: number;
  removed: number;
  staleSessionKeys: string[];
};
type AcpThreadBindingHealthStatus = "healthy" | "stale" | "uncertain";
type AcpThreadBindingHealthProbe = (params: {
  cfg: OpenClawConfig;
  accountId: string;
  sessionKey: string;
  binding: ThreadBindingRecord;
  session: AcpSessionStoreEntry;
}) => Promise<{
  status: AcpThreadBindingHealthStatus;
  reason?: string;
}>;
declare function listThreadBindingsForAccount(accountId?: string): ThreadBindingRecord[];
declare function listThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
}): ThreadBindingRecord[];
declare function autoBindSpawnedDiscordSubagent(params: {
  cfg: OpenClawConfig;
  accountId?: string;
  channel?: string;
  to?: string;
  threadId?: string | number;
  childSessionKey: string;
  agentId: string;
  label?: string;
  boundBy?: string;
}): Promise<ThreadBindingRecord | null>;
declare function unbindThreadBindingsBySessionKey(params: {
  targetSessionKey: string;
  accountId?: string;
  targetKind?: ThreadBindingTargetKind;
  reason?: string;
  sendFarewell?: boolean;
  farewellText?: string;
}): ThreadBindingRecord[];
declare function reconcileAcpThreadBindingsOnStartup(params: {
  cfg: OpenClawConfig;
  accountId?: string;
  sendFarewell?: boolean;
  healthProbe?: AcpThreadBindingHealthProbe;
}): Promise<AcpThreadBindingReconciliationResult>;
//#endregion
//#region extensions/discord/src/monitor/thread-bindings.manager.d.ts
declare function createThreadBindingManager(params: {
  accountId?: string;
  token?: string;
  cfg: OpenClawConfig;
  persist?: boolean;
  enableSweeper?: boolean;
  idleTimeoutMs?: number;
  maxAgeMs?: number;
}): ThreadBindingManager;
declare function createNoopThreadBindingManager(accountId?: string): ThreadBindingManager;
declare function getThreadBindingManager(accountId?: string): ThreadBindingManager | null;
//#endregion
export { autoBindSpawnedDiscordSubagent as a, reconcileAcpThreadBindingsOnStartup as c, resolveDiscordThreadBindingMaxAgeMs as d, resolveThreadBindingsEnabled as f, ThreadBindingTargetKind as h, AcpThreadBindingReconciliationResult as i, unbindThreadBindingsBySessionKey as l, ThreadBindingRecord as m, createThreadBindingManager as n, listThreadBindingsBySessionKey as o, ThreadBindingManager as p, getThreadBindingManager as r, listThreadBindingsForAccount as s, createNoopThreadBindingManager as t, resolveDiscordThreadBindingIdleTimeoutMs as u };