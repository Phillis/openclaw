import { ct as PluginRuntime } from "./plugin-entry-GuVBIlyS.js";
import { Xt as MediaFact, Zt as MediaFactLegacyProjection } from "./types.adapters-BCj_O1Hf.js";
//#region src/channels/plugins/media-payload.d.ts
/** Input media item used by channel outbound payload builders. */
type MediaPayloadInput = Required<Pick<MediaFact, "path">> & Pick<MediaFact, "contentType">;
/**
 * Legacy-compatible media payload shape consumed by plugin send helpers.
 * @deprecated Inbound contexts use `media`; outbound replies use lowercase
 * `ReplyPayload.mediaUrl`/`mediaUrls`.
 */
type MediaPayload = Omit<MediaFactLegacyProjection, "MediaTranscribedIndexes">;
/**
 * Builds single-item and list legacy media fields.
 * @deprecated Inbound contexts use `media`; outbound replies use lowercase
 * `ReplyPayload.mediaUrl`/`mediaUrls`.
 */
declare function buildMediaPayload(mediaList: MediaPayloadInput[], opts?: {
  preserveMediaTypeCardinality?: boolean;
}): MediaPayload;
//#endregion
//#region packages/normalization-core/src/string-normalization.d.ts
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
//#endregion
//#region src/channels/logging.d.ts
/**
 * Shared channel diagnostic formatters exposed through the plugin SDK.
 * Keep messages compact and stable enough for plugin logs without making them machine contracts.
 */
/** Minimal logger callback shape exposed through channel SDK helpers. */
type LogFn = (message: string) => void;
/** Emits a normalized typing-indicator failure diagnostic for channel plugins. */
declare function logTypingFailure(params: {
  log: LogFn;
  channel: string;
  target?: string;
  action?: "start" | "stop";
  error: unknown;
}): void;
//#endregion
//#region src/channels/channel-config.d.ts
/** How a channel config entry was selected. */
type ChannelMatchSource = "direct" | "parent" | "wildcard";
/** Match result carrying direct, parent, and wildcard candidates for channel config lookup. */
type ChannelEntryMatch<T> = {
  entry?: T;
  key?: string;
  wildcardEntry?: T;
  wildcardKey?: string;
  parentEntry?: T;
  parentKey?: string;
  matchKey?: string;
  matchSource?: ChannelMatchSource;
};
/** Normalizes human channel names into config-safe slugs. */
declare function normalizeChannelSlug(value: string): string;
/** Builds unique config lookup keys from optional channel/account identifiers. */
declare function buildChannelKeyCandidates(...keys: Array<string | undefined | null>): string[];
/** Resolves config entry precedence: direct, normalized direct, parent, normalized parent, wildcard. */
declare function resolveChannelEntryMatchWithFallback<T>(params: {
  entries?: Record<string, T>;
  keys: string[];
  parentKeys?: string[];
  wildcardKey?: string;
  normalizeKey?: (value: string) => string;
}): ChannelEntryMatch<T>;
/** Resolves nested allowlists where an inner list only applies after the outer list matches. */
declare function resolveNestedAllowlistDecision(params: {
  outerConfigured: boolean;
  outerMatched: boolean;
  innerConfigured: boolean;
  innerMatched: boolean;
}): boolean;
//#endregion
//#region src/plugin-sdk/file-lock.d.ts
/** Retry and stale-recovery policy for acquiring a filesystem lock. */
type FileLockOptions = {
  /** Retry policy used while waiting for another process or logical holder to release. */retries: {
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    randomize?: boolean;
  }; /** Milliseconds used to classify contended sidecars as stale. */
  stale: number; /** Fail closed for security-sensitive state; generic locks retain shipped stale recovery. */
  staleRecovery?: "fail-closed" | "remove-if-unchanged";
  /**
   * Logical operation identity for intentional nested acquisition.
   * Reuse one key only within that call chain; omit it for ordinary contention.
   */
  reentrantOwner?: string;
};
/** Run an async callback while holding a file lock, always releasing the lock afterward. */
declare function withFileLock<T>(filePath: string, options: FileLockOptions, fn: () => Promise<T>): Promise<T>;
//#endregion
//#region extensions/msteams/src/runtime.d.ts
declare const setMSTeamsRuntime: (next: PluginRuntime) => void, getMSTeamsRuntime: () => PluginRuntime, getOptionalMSTeamsRuntime: () => PluginRuntime | null;
//#endregion
export { resolveChannelEntryMatchWithFallback as a, normalizeStringEntries as c, normalizeChannelSlug as i, buildMediaPayload as l, withFileLock as n, resolveNestedAllowlistDecision as o, buildChannelKeyCandidates as r, logTypingFailure as s, setMSTeamsRuntime as t };