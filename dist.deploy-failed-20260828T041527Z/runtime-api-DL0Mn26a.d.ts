import { m as PluginRuntime, xt as WebMediaResult } from "./plugin-entry-bE5OaTNY.js";
import "./types.openclaw-D3Ap19Na.js";
import "./config-contracts-yQGnmAhr.js";
import { k as RuntimeEnv } from "./manifest-registry-DdCvbEOK.js";
import { Bt as MediaFact, Vt as MediaFactLegacyProjection, ut as OutboundMediaAccess } from "./types.adapters-DVrIc5zd.js";
import "./types.public-DowZo4tb.js";
import "./fetch-C3O_qIWc.js";
import "./channel-contract-gwjjjQO_.js";
import "./media-runtime-Cd0ecysR.js";
import "./channel-core-DtM7Q8Be.js";
import "./plugin-state-runtime-B2sLDTQY.js";
import "./runtime-vfwkTnFP.js";
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
//#region packages/normalization-core/src/string-normalization.d.ts
/** Coerces entries to strings, trims them, and drops empty results. */
declare function normalizeStringEntries(list?: ReadonlyArray<unknown>): string[];
//#endregion
//#region src/channels/allowlists/resolve-utils.d.ts
declare function mergeAllowlist(params: {
  existing?: Array<string | number>;
  additions: string[];
}): string[];
/** Logs a compact resolved/unresolved allowlist lookup summary when there is anything to report. */
declare function summarizeMapping(label: string, mapping: string[], unresolved: string[], runtime: RuntimeEnv): void;
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
  /** Retry policy used while waiting for another process or logical holder to release. */
  retries: {
    retries: number;
    factor: number;
    minTimeout: number;
    maxTimeout: number;
    randomize?: boolean;
  };
  /** Milliseconds used to classify contended sidecars as stale. */
  stale: number;
  /** Fail closed for security-sensitive state; generic locks retain shipped stale recovery. */
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
//#region src/plugin-sdk/outbound-media.d.ts
/** Media loading policy used before plugin media is handed to channel delivery. */
type OutboundMediaLoadOptions = {
  /** Maximum allowed media payload size before the load is rejected. */
  maxBytes?: number;
  /** Whether callers may load remote URLs, local files, or both. */
  mediaAccess?: OutboundMediaAccess;
  /** Approved local roots for file/path media; `"any"` disables root restriction. */
  mediaLocalRoots?: readonly string[] | "any";
  /** Optional local file reader used by tests or plugin-specific filesystem adapters. */
  mediaReadFile?: (filePath: string) => Promise<Buffer>;
  /** Workspace root used when resolving relative local media paths. */
  workspaceDir?: string;
  /** Explicit proxy URL forwarded to shared outbound media loading policy. */
  proxyUrl?: string;
  /** Fetch implementation for remote media loads. */
  fetchImpl?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
  /** Extra fetch options merged into remote media requests. */
  requestInit?: RequestInit;
  /** Whether shared media loading may optimize image payloads. */
  optimizeImages?: boolean;
  /** Allows explicit proxy DNS behavior to be trusted by the media fetch guard. */
  trustExplicitProxyDns?: boolean;
};
/** Load outbound media from a remote URL or approved local path using the shared web-media policy. */
declare function loadOutboundMediaFromUrl(mediaUrl: string, options?: OutboundMediaLoadOptions): Promise<WebMediaResult>;
//#endregion
//#region extensions/msteams/src/runtime.d.ts
declare const setMSTeamsRuntime: (next: PluginRuntime) => void, getMSTeamsRuntime: () => PluginRuntime, getOptionalMSTeamsRuntime: () => PluginRuntime | null;
//#endregion
export { normalizeChannelSlug as a, mergeAllowlist as c, logTypingFailure as d, buildMediaPayload as f, buildChannelKeyCandidates as i, summarizeMapping as l, loadOutboundMediaFromUrl as n, resolveChannelEntryMatchWithFallback as o, withFileLock as r, resolveNestedAllowlistDecision as s, setMSTeamsRuntime as t, normalizeStringEntries as u };