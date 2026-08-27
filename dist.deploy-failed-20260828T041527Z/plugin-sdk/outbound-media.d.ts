import { P as OutboundMediaAccess } from "../types.core-D9YiZM0R.js";
import { mt as WebMediaResult } from "../types-DP7cDwEi.js";
import { r as PluginStateKeyedStore } from "../plugin-state-store.types-DnCvxs0P.js";
import "../plugin-state-runtime-DVCEWQRH.js";
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
type HostedOutboundMediaMetadata = {
  routePath: string;
  token: string;
  contentType?: string;
  fileName?: string;
  expiresAt: number;
  byteLength: number;
};
type HostedOutboundMediaEntry = {
  metadata: HostedOutboundMediaMetadata;
  buffer: Buffer;
};
type HostedOutboundMediaMetaRecord = HostedOutboundMediaMetadata & {
  id: string;
  chunkCount: number;
};
type HostedOutboundMediaChunkRecord = {
  id: string;
  index: number;
  dataBase64: string;
};
/**
 * Capacity handling for hosted media.
 * `"evict-oldest"` is the compatibility default; `"reject-new"` preserves live issued URLs.
 */
type HostedOutboundMediaOverflowPolicy = "evict-oldest" | "reject-new";
type HostedOutboundMediaStore = {
  prepareUrl: (params: {
    mediaUrl: string;
    routePath: string;
    publicBaseUrl: string;
    maxBytes: number;
    /** Host-authorized local media access forwarded to the shared outbound loader. */
    mediaAccess?: OutboundMediaAccess;
    proxyUrl?: string;
    requestInit?: RequestInit;
    /** Validate the exact loaded bytes before capability creation or persistence. */
    validateBeforePersist?: (media: {
      buffer: Buffer;
      contentType?: string;
      fileName?: string;
    }) => void | Promise<void>;
  }) => Promise<string>;
  readMetadata: (id: string, nowMs?: number) => Promise<HostedOutboundMediaMetadata | null>;
  read: (id: string, nowMs?: number) => Promise<HostedOutboundMediaEntry | null>;
  delete: (id: string) => Promise<void>;
  cleanupExpired: (nowMs?: number) => Promise<void>;
  clear: () => Promise<void>;
};
type CreateHostedOutboundMediaStoreOptions = {
  metadataStore: PluginStateKeyedStore<HostedOutboundMediaMetaRecord>;
  chunkStore: PluginStateKeyedStore<HostedOutboundMediaChunkRecord>;
  ttlMs: number;
  resolveExpiresAtMs: (ttlMs: number) => number | undefined;
  createId?: () => string;
  createToken?: () => string;
  rawChunkBytes?: number;
  maxEntries?: number;
  maxChunkRows?: number;
  /** Aggregate live payload budget. Omit only when the backing owner enforces an equivalent cap. */
  maxTotalBytes?: number;
  chunkRowsPerEntryBudget?: number;
  /** Physical retention after logical URL expiry, used to finish already-admitted readers. */
  postExpiryRetentionMs?: number;
  /**
   * Capacity action before storing a new entry. Defaults to `"evict-oldest"`.
   * With `"reject-new"`, configure both backing stores to reject overflow too.
   */
  overflowPolicy?: HostedOutboundMediaOverflowPolicy;
};
declare function createHostedOutboundMediaStore(options: CreateHostedOutboundMediaStoreOptions): HostedOutboundMediaStore;
/** Build download-only response headers for immutable hosted outbound media. */
declare function buildHostedOutboundMediaResponseHeaders(metadata: Pick<HostedOutboundMediaMetadata, "byteLength" | "contentType" | "fileName">, options?: {
  fallbackFileName?: string;
}): Record<string, string>;
//#endregion
export { CreateHostedOutboundMediaStoreOptions, HostedOutboundMediaChunkRecord, HostedOutboundMediaEntry, HostedOutboundMediaMetaRecord, HostedOutboundMediaMetadata, HostedOutboundMediaOverflowPolicy, HostedOutboundMediaStore, OutboundMediaLoadOptions, buildHostedOutboundMediaResponseHeaders, createHostedOutboundMediaStore, loadOutboundMediaFromUrl };