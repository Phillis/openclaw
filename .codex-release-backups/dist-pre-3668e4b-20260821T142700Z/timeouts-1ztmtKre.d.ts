//#region extensions/discord/src/monitor/timeouts.d.ts
declare const DISCORD_DEFAULT_LISTENER_TIMEOUT_MS = 120000;
declare const DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS: number;
declare const DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS = 60000;
declare const DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS = 120000;
/** @deprecated Discord listener timeouts are compatibility-only. */
declare function normalizeDiscordListenerTimeoutMs(raw: number | undefined): number;
/** @deprecated Discord no longer applies channel-owned inbound run timeouts. */
declare function normalizeDiscordInboundWorkerTimeoutMs(raw: number | undefined): number | undefined;
/** @deprecated Compatibility helper for old Discord timeout integrations. */
declare function isAbortError(error: unknown): boolean;
/** @deprecated Discord no longer uses this for channel-owned message run timeouts. */
declare function runDiscordTaskWithTimeout(params: {
  run: (abortSignal: AbortSignal | undefined) => Promise<void>;
  timeoutMs?: number;
  abortSignals?: Array<AbortSignal | undefined>;
  onTimeout: (timeoutMs: number) => void | Promise<void>;
  onAbortAfterTimeout?: () => void;
  onErrorAfterTimeout?: (error: unknown) => void;
}): Promise<boolean>;
//#endregion
export { isAbortError as a, runDiscordTaskWithTimeout as c, DISCORD_DEFAULT_LISTENER_TIMEOUT_MS as i, DISCORD_ATTACHMENT_TOTAL_TIMEOUT_MS as n, normalizeDiscordInboundWorkerTimeoutMs as o, DISCORD_DEFAULT_INBOUND_WORKER_TIMEOUT_MS as r, normalizeDiscordListenerTimeoutMs as s, DISCORD_ATTACHMENT_IDLE_TIMEOUT_MS as t };