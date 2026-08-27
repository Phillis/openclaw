import { _ as DeliveryContext } from "./types-CheMd8wT.js";
import { t as ChannelId } from "./channel-id.types-CjcGKHk0.js";
//#region src/infra/system-events.d.ts
type SystemEvent = {
  /**
   * OpenClaw-assigned opaque identity for one queued occurrence. Preserve it when returning a
   * snapshot to consume. It changes on replacement or re-enqueue; optional only for legacy
   * ID-less compatibility.
   */
  id?: string;
  text: string;
  ts: number;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
};
type SystemEventOptions = {
  sessionKey: string;
  contextKey?: string | null;
  deliveryContext?: DeliveryContext;
  /** Replace the pending event for this context and delivery route. Requires contextKey. */
  replace?: boolean;
};
declare function isSystemEventContextChanged(sessionKey: string, contextKey?: string | null): boolean;
declare function enqueueSystemEventEntry(text: string, options: SystemEventOptions): SystemEvent | null;
declare function enqueueSystemEvent(text: string, options: SystemEventOptions): boolean;
declare function drainSystemEventEntries(sessionKey: string): SystemEvent[];
declare function consumeSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[]): SystemEvent[];
declare function consumeSelectedSystemEventEntries(sessionKey: string, consumedEntries: readonly SystemEvent[]): SystemEvent[];
declare function drainSystemEvents(sessionKey: string): string[];
declare function peekSystemEventEntries(sessionKey: string): SystemEvent[];
declare function peekSystemEvents(sessionKey: string): string[];
declare function hasSystemEvents(sessionKey: string): boolean;
declare function resolveSystemEventDeliveryContext(events: readonly SystemEvent[]): DeliveryContext | undefined;
declare function resetSystemEventsForTest(): void;
//#endregion
//#region src/infra/channel-activity.d.ts
/** Direction of the last observed activity for a channel/account pair. */
type ChannelDirection = "inbound" | "outbound";
type ActivityEntry = {
  inboundAt: number | null;
  outboundAt: number | null;
};
/** Records the latest inbound or outbound activity timestamp for a channel/account. */
declare function recordChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
  direction: ChannelDirection;
  at?: number;
}): void;
/** Returns the latest known inbound/outbound activity timestamps for a channel/account. */
declare function getChannelActivity(params: {
  channel: ChannelId;
  accountId?: string | null;
}): ActivityEntry;
//#endregion
//#region src/infra/dedupe.d.ts
/** Small in-memory TTL/LRU-style cache for replay and duplicate suppression. */
type DedupeCache = {
  /** Returns true for a recent duplicate; records the key and optional owner when absent. */
  check: (key: string | undefined | null, now?: number, ownerToken?: object) => boolean;
  /** Returns true for a recent duplicate without refreshing or recording the key. */
  peek: (key: string | undefined | null, now?: number) => boolean;
  delete: (key: string | undefined | null, ownerToken?: object) => void;
  clear: () => void;
  size: () => number;
};
/** Dedupe cache bounds; ttlMs <= 0 disables expiry, maxSize <= 0 disables storage. */
type DedupeCacheOptions = {
  ttlMs: number;
  maxSize: number;
};
/** Creates a bounded in-memory dedupe cache with optional TTL expiry. */
declare function createDedupeCache(options: DedupeCacheOptions): DedupeCache;
/** Resolves a process-global dedupe cache for hot paths that can load this module twice. */
declare function resolveGlobalDedupeCache(key: symbol, options: DedupeCacheOptions): DedupeCache;
//#endregion
//#region src/infra/secure-random.d.ts
/** Generates a cryptographically secure UUID for runtime ids and cache keys. */
declare function generateSecureUuid(): string;
/** Generates a URL-safe cryptographic token from the requested byte count. */
declare function generateSecureToken(bytes?: number): string;
/** Generates a hex-encoded cryptographic token from the requested byte count. */
declare function generateSecureHex(bytes?: number): string;
/** Returns a cryptographically secure fraction in the range [0, 1). */
declare function generateSecureFraction(): number;
/** Generates a cryptographically secure integer in `[0, maxExclusive)`. */
declare function generateSecureInt(maxExclusive: number): number;
/** Generates a cryptographically secure integer in `[minInclusive, maxExclusive)`. */
declare function generateSecureInt(minInclusive: number, maxExclusive: number): number;
//#endregion
export { peekSystemEvents as C, peekSystemEventEntries as S, resolveSystemEventDeliveryContext as T, drainSystemEvents as _, generateSecureUuid as a, hasSystemEvents as b, createDedupeCache as c, getChannelActivity as d, recordChannelActivity as f, drainSystemEventEntries as g, consumeSystemEventEntries as h, generateSecureToken as i, resolveGlobalDedupeCache as l, consumeSelectedSystemEventEntries as m, generateSecureHex as n, DedupeCache as o, SystemEvent as p, generateSecureInt as r, DedupeCacheOptions as s, generateSecureFraction as t, ChannelDirection as u, enqueueSystemEvent as v, resetSystemEventsForTest as w, isSystemEventContextChanged as x, enqueueSystemEventEntry as y };