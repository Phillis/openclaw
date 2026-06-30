// Public memory host contracts shared by runtime, QMD, builtin search, and
// package consumers.
import type { MemoryFeedbackKind, MemoryLifecycle, MemoryScope } from "./memory-metadata.js";

export type MemorySource = "memory" | "sessions";

export type MemorySearchTrace = {
  query: string;
  backend: "builtin" | "qmd";
  included: boolean;
  scope?: MemoryScope;
  lifecycle?: MemoryLifecycle;
  source: MemorySource;
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  feedbackScore?: number;
  freshness?: "valid" | "future" | "expired";
  reason: string;
};

/** One ranked memory search hit with optional vector/text scoring details. */
export type MemorySearchResult = {
  path: string;
  startLine: number;
  endLine: number;
  score: number;
  vectorScore?: number;
  textScore?: number;
  snippet: string;
  source: MemorySource;
  scope?: MemoryScope;
  lifecycle?: MemoryLifecycle;
  confidence?: number;
  feedbackScore?: number;
  feedbackCount?: number;
  supersededBy?: string;
  citation?: string;
  trace?: MemorySearchTrace;
};

/** Cached/probed embedding availability status. */
export type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};

/** Progress event emitted during memory sync. */
export type MemorySyncProgressUpdate = {
  completed: number;
  total: number;
  label?: string;
};

/** Runtime backend/mode diagnostics for memory search. */
export type MemorySearchRuntimeDebug = {
  backend: "builtin" | "qmd";
  configuredMode?: string;
  effectiveMode?: string;
  fallback?: string;
};

/** Result of reading a memory file, optionally paginated/truncated. */
export type MemoryReadResult = {
  text: string;
  path: string;
  truncated?: boolean;
  from?: number;
  lines?: number;
  nextFrom?: number;
};

/** Aggregated memory backend status for CLI/UI diagnostics. */
export type MemoryProviderStatus = {
  backend: "builtin" | "qmd";
  provider: string;
  model?: string;
  requestedProvider?: string;
  files?: number;
  chunks?: number;
  dirty?: boolean;
  workspaceDir?: string;
  dbPath?: string;
  extraPaths?: string[];
  sources?: MemorySource[];
  sourceCounts?: Array<{ source: MemorySource; files: number; chunks: number }>;
  scopeCounts?: Array<{ scope: MemoryScope; chunks: number }>;
  lifecycleCounts?: Array<{ lifecycle: MemoryLifecycle; chunks: number }>;
  cache?: { enabled: boolean; entries?: number; maxEntries?: number };
  fts?: { enabled: boolean; available: boolean; error?: string };
  fallback?: { from: string; reason?: string };
  vector?: {
    enabled: boolean;
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

export type MemoryFeedbackResult = {
  updated: number;
  lifecycle?: MemoryLifecycle;
  scope?: MemoryScope;
  feedbackScore?: number;
  feedbackCount?: number;
};

export type MemoryDoctorCheck = {
  id: string;
  status: "ok" | "warn" | "error";
  message: string;
  detail?: string;
};

export type MemoryDoctorReport = {
  backend: "builtin" | "qmd";
  checkedAtMs: number;
  checks: MemoryDoctorCheck[];
};

/** Search/read/sync/status contract implemented by memory managers. */
export interface MemorySearchManager {
  search(
    query: string,
    opts?: {
      maxResults?: number;
      minScore?: number;
      sessionKey?: string;
      qmdSearchModeOverride?: "query" | "search" | "vsearch";
      onDebug?: (debug: MemorySearchRuntimeDebug) => void;
      sources?: MemorySource[];
      scopes?: MemoryScope[];
      explain?: boolean;
      /** Optional caller cancellation; managers consume it where their runtime supports cancellation. */
      signal?: AbortSignal;
    },
  ): Promise<MemorySearchResult[]>;
  readFile(params: { relPath: string; from?: number; lines?: number }): Promise<MemoryReadResult>;
  status(): MemoryProviderStatus;
  sync?(params?: {
    reason?: string;
    force?: boolean;
    sessionFiles?: string[];
    progress?: (update: MemorySyncProgressUpdate) => void;
  }): Promise<void>;
  getCachedEmbeddingAvailability?(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
  probeVectorStoreAvailability?(): Promise<boolean>;
  probeVectorAvailability(): Promise<boolean>;
  feedback?(params: {
    path: string;
    source?: MemorySource;
    startLine?: number;
    endLine?: number;
    kind: MemoryFeedbackKind;
    scope?: MemoryScope;
    supersededBy?: string;
    duplicateOf?: string;
  }): Promise<MemoryFeedbackResult>;
  doctor?(params?: { deep?: boolean }): Promise<MemoryDoctorReport>;
  close?(): Promise<void>;
}
