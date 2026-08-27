//#region packages/memory-host-sdk/src/host/types.d.ts
type MemorySource = "memory" | "sessions";
type MemoryOriginClass = "owner" | "agent" | "untrusted" | "system";
type MemorySessionKind = "interactive" | "cron" | "heartbeat" | "subagent" | "unknown";
/** Additional memory root, optionally narrowed by a root-relative glob. */
type MemoryExtraPath = string | {
  path: string;
  pattern?: string;
};
type MemoryEntryProvenance = {
  originClass: MemoryOriginClass;
  sessionKind: MemorySessionKind;
  observedAt: number;
  supersedesKey?: string;
};
/** One ranked memory search hit with optional vector/text scoring details. */
type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  importance?: number;
  triggers?: string;
  /** Semicolon-separated stable repository identities lifted from inline annotations. */
  projectKey?: string;
  /** @deprecated Use provenance.originClass. This field is not authoritative for automatic injection. */
  originClass?: string;
  citation?: string;
  provenance?: MemoryEntryProvenance;
};
/** Automatic prompt injection is reserved for content with authoritative trusted provenance. */
declare function isMemoryOriginEligibleForAutomaticInjection(originClass: unknown): originClass is "owner" | "agent";
declare function isAutomaticMemoryEntryEligible(entry: Pick<MemorySearchResult, "provenance">): boolean;
/** Cached/probed embedding availability status. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
/** Progress event emitted during memory sync. */
type MemorySyncProgressUpdate = {
  completed: number;
  total: number;
  label?: string;
};
type MemorySessionSyncTarget = {
  /** Owning OpenClaw agent. Omit only when the active manager scope already supplies it. */
  agentId?: string;
  /** Storage-neutral transcript/session identity. */
  sessionId: string;
  /** Optional visible session-store key for callers that already carry it. */
  sessionKey?: string;
};
type MemorySyncParams = {
  reason?: string;
  force?: boolean;
  /** Storage-neutral session transcript targets to refresh. */
  sessions?: MemorySessionSyncTarget[];
  /** Archive/support transcript files to refresh without treating paths as active session identity. */
  archiveFiles?: string[];
  progress?: (update: MemorySyncProgressUpdate) => void;
};
type MemorySearchRuntimeDebug = {
  backend: "builtin";
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
  embeddingBootstrap?: {
    ok: false;
    provider: string;
    reason: string;
    degradedTo: "keyword-only";
  };
};
/** Successful memory-file excerpt, optionally paginated/truncated. */
type MemoryReadSuccessResult = {
  status: "ok";
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** An allowed memory path that does not exist. */
type MemoryReadNotFoundResult = {
  status: "not_found";
  text: "";
  path: string;
  truncated?: never;
  from?: never;
  lines?: never;
  nextFrom?: never;
};
type MemoryReadResult = MemoryReadSuccessResult | MemoryReadNotFoundResult;
/** Pre-status result accepted only from registered memory managers during migration. */
type LegacyMemoryReadResult = {
  status?: never;
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};
/** Aggregated memory backend status for CLI/UI diagnostics. */
type MemoryVectorIndexState = {
  state: "empty";
} | {
  state: "complete";
} | {
  state: "incomplete";
} | {
  state: "unverified";
};
type MemoryProviderStatus = {
  backend: "builtin";
  provider: string;
  model?: string;
  requestedProvider?: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  /** Sources currently being refreshed by an admitted sync. */
  pendingSyncSources?: MemorySource[];
  workspaceDir?: string;
  dbPath?: string;
  extraPaths?: MemoryExtraPath[];
  sources?: MemorySource[];
  sourceCounts?: Array<{
    source: MemorySource;
    files: number;
    chunks: number;
    eligible?: number | null;
    issues?: string[];
  }>;
  cache?: {
    enabled: boolean;
    entries?: number;
    maxEntries?: number;
  };
  fts?: {
    enabled: boolean;
    available: boolean;
    error?: string;
  };
  fallback?: {
    from: string;
    reason?: string;
  };
  vector?: {
    enabled: boolean;
    index?: MemoryVectorIndexState;
    storeAvailable?: boolean;
    semanticAvailable?: boolean;
    available?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  batch?: {
    enabled: boolean;
    failures: number;
    limit: number;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
    lastError?: string;
    lastProvider?: string;
  };
  custom?: Record<string, unknown>;
};
declare function resolveMemorySearchStaleness(status: Pick<MemoryProviderStatus, "dirty" | "pendingSyncSources" | "custom">, agentId?: string): {
  stale: true;
  warning: string;
  action: string;
} | null;
/** Search/read/sync/status contract implemented by memory managers. */
interface MemorySearchManager {
  search(query: string, opts?: {
    maxResults?: number;
    minScore?: number;
    sessionKey?: string;
    /**
     * Keyword/FTS scoring only: skip query embedding and vector search.
     * For reply-path recall (trigger injection) that must not add a
     * network round-trip per inbound message.
     */
    lexicalOnly?: boolean;
    /** Active repository identities used only for project-aware ranking. */
    activeProjectKeys?: string[];
    onDebug?: (debug: MemorySearchRuntimeDebug) => void;
    sources?: MemorySource[];
    /** Optional caller cancellation; managers consume it where their runtime supports cancellation. */
    signal?: AbortSignal;
  }): Promise<MemorySearchResult[]>;
  listTriggerCandidates?(opts?: {
    limit?: number;
    activeProjectKeys?: string[];
  }): Promise<MemorySearchResult[]>;
  listCuratedProjectCandidates?(opts: {
    activeProjectKeys: string[];
    limit?: number;
  }): Promise<MemorySearchResult[]>;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<MemoryReadResult>;
  status(): MemoryProviderStatus;
  sync?(params?: MemorySyncParams): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  close?(): Promise<void>;
}
//#endregion
export { isMemoryOriginEligibleForAutomaticInjection as _, MemoryProviderStatus as a, MemorySearchResult as c, MemorySessionSyncTarget as d, MemorySource as f, isAutomaticMemoryEntryEligible as g, MemoryVectorIndexState as h, MemoryOriginClass as i, MemorySearchRuntimeDebug as l, MemorySyncProgressUpdate as m, MemoryEntryProvenance as n, MemoryReadResult as o, MemorySyncParams as p, MemoryExtraPath as r, MemorySearchManager as s, LegacyMemoryReadResult as t, MemorySessionKind as u, resolveMemorySearchStaleness as v };