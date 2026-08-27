import { H as MemoryEmbeddingProvider, K as EmbeddingInput, W as MemoryEmbeddingProviderRuntime, q as ResolvedMemorySearchConfig } from "../../types-R6eI-mj_.js";
import { B as MemorySearchRuntimeDebug, F as MemoryEntryProvenance, G as MemorySyncProgressUpdate, H as MemorySessionSyncTarget, L as MemoryProviderStatus, R as MemorySearchManager, U as MemorySource, V as MemorySessionKind, W as MemorySyncParams, n as OpenClawConfig, z as MemorySearchResult } from "../../types.openclaw-BrHw7tim.js";
import { t as MemoryEmbeddingProbeResult } from "../../memory-core-host-engine-storage-CsLyJ6c8.js";
import { t as MemoryCoreAcquireLocalService } from "../../embedding-local-service-BCpPp3QB.js";
import { a as EmbeddingProviderRuntime, i as EmbeddingProviderResult, n as EmbeddingProviderId, r as EmbeddingProviderRequest, t as EmbeddingProvider } from "../../embeddings-C4c-f6As.js";
import { DatabaseSync } from "node:sqlite";
import { FSWatcher } from "chokidar";

//#region extensions/memory-core/src/memory/manager-reindex-state.d.ts
type MemoryIndexMeta = {
  model: string;
  provider: string;
  providerKey?: string;
  sources?: MemorySource[];
  scopeHash?: string;
  chunkTokens: number;
  chunkOverlap: number;
  chunkingVersion?: number;
  vectorDims?: number;
  ftsTokenizer?: string;
  provenanceVersion?: number;
};
type MemoryIndexIdentityState = {
  status: "valid";
} | {
  status: "missing";
  reason: string;
} | {
  status: "mismatched";
  reason: string;
};
type MemoryIndexProviderIdentity = {
  provider: string;
  model: string;
  providerKey: string;
};
//#endregion
//#region packages/memory-host-sdk/src/host/session-transcript-corpus.d.ts
type SessionTranscriptCorpusArtifactKind = "active-session" | "retained-session" | "archive-artifact";
type SessionTranscriptCorpusEntry = {
  agentId: string;
  sessionFile: string;
  sessionId: string; /** Canonical source revision used by derived transcript consumers. */
  contentRevision?: string;
  artifactKind: SessionTranscriptCorpusArtifactKind;
  sessionKey?: string;
  storePath?: string; /** Present when an active transcript is addressed by SQLite identity, not a JSONL path. */
  transcriptSource?: "sqlite"; /** Session entry activity timestamp used when the source has no filesystem stat. */
  updatedAtMs?: number; /** True when this transcript belongs to an internal dreaming narrative run. */
  generatedByDreamingNarrative?: boolean; /** True when this transcript belongs to an isolated cron run session. */
  generatedByCronRun?: boolean;
  sessionKind?: MemorySessionKind;
};
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-state.d.ts
type MemoryProviderLifecycleState = {
  mode: "pending";
  requestedProvider: string;
} | {
  mode: "active";
  providerId: string;
} | {
  mode: "degraded";
  providerId: string;
  reason: string;
  code?: string;
} | {
  mode: "fallback-active";
  providerId: string;
  fallbackFrom: string;
  reason: string;
} | {
  mode: "fts-only";
  reason: string;
  attemptedProviderId?: string;
};
//#endregion
//#region extensions/memory-core/src/memory/watch-settle.d.ts
type MemoryWatchEventStats = {
  isDirectory?: () => boolean;
  size?: number;
  mtimeMs?: number;
};
type WatchPathSnapshot = {
  size: number;
  mtimeMs: number;
};
type MemoryWatchSettleQueue = Map<string, WatchPathSnapshot | null>;
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-base.d.ts
type MemorySyncProgressState = {
  completed: number;
  total: number;
  label?: string;
  report: (update: MemorySyncProgressUpdate) => void;
};
type MemoryIndexEntry$1 = {
  path: string;
  absPath: string;
  mtimeMs: number;
  size: number;
  hash: string;
  kind?: "markdown" | "multimodal";
  content?: string;
  contentText?: string;
  lineMap?: number[];
  lineProvenance?: MemoryEntryProvenance[];
};
type MemoryIndexWorkItem = {
  entry: MemoryIndexEntry$1;
  source: MemorySource;
  afterIndex?: () => void;
};
type MemorySourceSyncPlan = {
  indexItems: MemoryIndexWorkItem[];
  finalize: () => Promise<void> | void;
};
type MemoryReindexRetryState = {
  dirty: boolean;
  memoryFullRetryDirty: boolean;
  sessionsDirty: boolean;
  sessionsFullRetryDirty: boolean;
  sessionsReconcileDirty: boolean;
  sessionsDirtyFiles: Set<string>;
};
declare abstract class MemoryManagerSyncBase {
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected abstract readonly cfg: OpenClawConfig;
  protected abstract readonly agentId: string;
  protected abstract readonly workspaceDir: string;
  protected abstract readonly settings: ResolvedMemorySearchConfig;
  protected provider: EmbeddingProvider | null;
  protected fallbackFrom?: EmbeddingProviderId;
  protected abstract providerUnavailableReason?: string;
  protected abstract providerLifecycle: MemoryProviderLifecycleState;
  protected providerRuntime?: EmbeddingProviderRuntime;
  protected abstract batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected readonly sources: Set<MemorySource>;
  protected providerKey: string | null;
  protected abstract readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected readonly fts: {
    enabled: boolean;
    available: boolean;
    loadError?: string;
  };
  protected vectorReady: Promise<boolean> | null;
  protected watcher: FSWatcher | null;
  protected watchTimer: NodeJS.Timeout | null;
  protected sessionWatchTimer: NodeJS.Timeout | null;
  protected sessionUnsubscribe: (() => void) | null;
  protected fallbackReason?: string;
  protected intervalTimer: NodeJS.Timeout | null;
  protected memoryWatchPressureStartupTimer: NodeJS.Timeout | null;
  protected closed: boolean;
  protected dirty: boolean;
  protected memoryFullRetryDirty: boolean;
  protected pendingWatchPaths: MemoryWatchSettleQueue;
  protected sessionsDirty: boolean;
  protected sessionsFullRetryDirty: boolean;
  protected sessionsReconcileDirty: boolean;
  protected sessionsDirtyFiles: Set<string>;
  protected sessionPendingFiles: Set<string>;
  protected sessionPendingTargets: Map<string, MemorySessionSyncTarget>;
  protected vectorDegradedWriteWarningShown: boolean;
  protected lastMetaSerialized: string | null;
  protected abstract readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected abstract db: DatabaseSync;
  protected abstract computeProviderKey(): string;
  protected abstract resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  protected abstract sync(params?: MemorySyncParams): Promise<void>;
  protected abstract withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T>;
  protected abstract getIndexConcurrency(): number;
  protected abstract pruneEmbeddingCacheIfNeeded(): void;
  protected abstract resetProviderInitializationForRetry(): void;
  protected abstract assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  protected abstract indexFile(entry: MemoryIndexEntry$1, options: {
    source: MemorySource;
    content?: string;
  }): Promise<void>;
  protected abstract syncMemoryFiles(params: {
    needsFullReindex: boolean;
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
  }): Promise<MemorySourceSyncPlan>;
  protected abstract syncArchiveFiles(params: {
    needsFullReindex: boolean;
    targetArchiveFiles?: string[];
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
    prefixIndexItems?: MemoryIndexWorkItem[];
  }): Promise<MemorySourceSyncPlan>;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  protected emptySourceSyncPlan(): MemorySourceSyncPlan;
  protected snapshotReindexRetryState(): MemoryReindexRetryState;
  protected restoreReindexRetryState(snapshot: MemoryReindexRetryState): void;
  protected markFailedFullReindexRetry(params: {
    memory: boolean;
    sessions: boolean;
  }): void;
  protected clearSessionRetryState(): void;
  protected clearMemoryRetryState(): void;
  protected refreshSessionDirtyFlag(): void;
  protected shouldDeferSourceWideBatch(): boolean;
  protected advanceSyncProgress(progress: MemorySyncProgressState | undefined, count?: number): void;
  protected indexQueuedFiles(items: MemoryIndexWorkItem[], progress?: MemorySyncProgressState, label?: string): Promise<void>;
  protected executeSourceSyncPlans(plans: MemorySourceSyncPlan[], progress?: MemorySyncProgressState): Promise<void>;
  protected executeSourceWideSync(params: {
    shouldSyncMemory: boolean;
    shouldSyncSessions: boolean;
    needsFullReindex: boolean;
    needsFullSessionReindex?: boolean;
    targetArchiveFiles?: string[];
    progress?: MemorySyncProgressState;
  }): Promise<void>;
  protected hasIndexedChunks(): boolean;
  protected hasSemanticChunks(): boolean;
  protected resolveCurrentIndexIdentityState(params?: {
    meta?: MemoryIndexMeta | null;
    provider?: {
      id: string;
      model: string;
    } | null;
    providerKeyKnown?: boolean;
    vectorReady?: boolean;
    hasIndexedChunks?: boolean;
  }): MemoryIndexIdentityState;
  protected resetVectorState(): void;
  protected ensureVectorReady(dimensions?: number): Promise<boolean>;
  private loadVectorExtension;
  protected deleteVectorRowsForSource(pathname: string, source: MemorySource): void;
  protected markVectorRebuildRequired(): void;
  private hasVectorRebuildMarker;
  private markConfiguredSourcesForFullReindex;
  private ensureVectorTable;
  private dropLegacyVectorTable;
  private dropVectorTable;
  protected buildSourceFilter(alias?: string, sourcesOverride?: MemorySource[]): {
    sql: string;
    params: MemorySource[];
  };
  protected openDatabase(): DatabaseSync;
  protected seedEmbeddingCache(sourceDb: DatabaseSync): Promise<void>;
  protected ensureSchema(): void;
  protected readMeta(): MemoryIndexMeta | null;
  protected writeMeta(meta: MemoryIndexMeta): void;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-watch-ops.d.ts
declare abstract class MemoryManagerWatchOps extends MemoryManagerSyncBase {
  private nativeMemoryWatchPairs;
  private readonly memoryWatchPressureWarning;
  protected ensureWatcher(): void;
  private scheduleMemoryWatchPressureStartupCheck;
  private warnIfMemoryWatchPressure;
  private currentMemoryChokidarWatcher;
  protected attachNativeMemoryWatchForDir(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): boolean;
  protected attachLinuxMemoryDirectoryTreeWatchForDir(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): boolean;
  private attachLinuxMemoryDirectoryTreeSubtree;
  private closeNativeMemoryWatchPair;
  protected closeNativeMemoryWatchPairs(): void;
  private removeNativeMemoryParentWatch;
  private removeNativeMemoryWatchPair;
  protected attachMemoryChokidarFallback(dir: string, markDirty: (watchPath?: string, stats?: MemoryWatchEventStats) => void): void;
  protected ensureIntervalSync(): void;
  private scheduleWatchSync;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-session-sync-ops.d.ts
type MemorySessionTranscriptUpdate = {
  agentId?: string;
  sessionFile?: string;
  sessionKey?: string;
  target?: {
    agentId: string;
    sessionId: string;
    sessionKey: string;
  };
};
declare abstract class MemoryManagerSessionSyncOps extends MemoryManagerWatchOps {
  protected listSessionCorpusEntries(): Promise<SessionTranscriptCorpusEntry[]>;
  protected sessionPathForCorpusEntry(entry: SessionTranscriptCorpusEntry): string;
  protected legacyExtensionlessSessionPathForIdentity(agentId: string, sessionId: string): string;
  protected buildSessionEntryOptions(entry: SessionTranscriptCorpusEntry): {
    updatedAtMs?: number | undefined;
    sessionKey?: string | undefined;
    agentId?: string | undefined;
    sessionId?: string | undefined;
    storePath?: string | undefined;
    sessionKind?: MemorySessionKind | undefined;
    generatedByDreamingNarrative: boolean;
    generatedByCronRun: boolean;
  };
  protected ensureSessionListener(): void;
  protected subscribeSessionTranscriptUpdates(listener: (update: MemorySessionTranscriptUpdate) => void): () => void;
  private scheduleCorpusSessionFileDirty;
  protected ensureSessionStartupCatchup(): void;
  protected markSessionStartupCatchupDirtyFiles(): Promise<string[]>;
  protected runSessionStartupCatchup(): Promise<string[]>;
  private scheduleSessionDirty;
  private processSessionUpdateBatch;
  private resolveSessionTranscriptUpdateSyncTarget;
  protected normalizeTargetArchiveFiles(archiveFiles?: string[], corpusEntries?: readonly SessionTranscriptCorpusEntry[], includeSqlite?: boolean): Set<string> | null;
  private resolveArchiveFilesForSyncTargets;
  protected resolveTargetSessionSyncPlan(params: {
    sessions?: MemorySessionSyncTarget[];
    archiveFiles?: string[];
  }): Promise<{
    corpusEntries: SessionTranscriptCorpusEntry[];
    targetArchiveFiles: Set<string>;
  } | null>;
  private memorySessionSyncTargetKey;
  protected shouldSyncSessions(params?: MemorySyncParams, needsFullReindex?: boolean): boolean;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-source-sync-ops.d.ts
declare abstract class MemoryManagerSourceSyncOps extends MemoryManagerSessionSyncOps {
  protected syncMemoryFiles(params: {
    needsFullReindex: boolean;
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
  }): Promise<MemorySourceSyncPlan>;
  protected syncArchiveFiles(params: {
    needsFullReindex: boolean;
    targetArchiveFiles?: string[];
    corpusEntries?: readonly SessionTranscriptCorpusEntry[];
    progress?: MemorySyncProgressState;
    deferIndex?: boolean;
    prefixIndexItems?: MemoryIndexWorkItem[];
  }): Promise<MemorySourceSyncPlan>;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-sync-ops.d.ts
type MemorySyncProviderGenerationBase = {
  providerKey: string;
  identities: MemoryIndexProviderIdentity[];
};
type MemorySyncProviderGeneration = (MemorySyncProviderGenerationBase & {
  kind: "fts-only";
  provider: null;
}) | (MemorySyncProviderGenerationBase & {
  kind: "semantic";
  provider: EmbeddingProvider;
  runtime?: EmbeddingProviderRuntime;
});
type MemorySemanticProviderGeneration = Extract<MemorySyncProviderGeneration, {
  kind: "semantic";
}>;
declare abstract class MemoryManagerSyncOps extends MemoryManagerSourceSyncOps {
  private fallbackProviderInitPromise;
  protected syncProviderGeneration: MemorySyncProviderGeneration | null;
  protected beginSyncProviderGeneration(_options?: {
    forceFtsOnly?: boolean;
  }): void;
  protected endSyncProviderGeneration(): void;
  protected shouldDeferSourceWideBatch(): boolean;
  protected retireCurrentProvider(): Promise<void>;
  private createSyncProgress;
  private assertFtsOnlySyncAllowed;
  protected runSync(params?: MemorySyncParams): Promise<void>;
  protected shouldFallbackOnError(err: unknown): boolean;
  private hasRequestedTargetSessionSync;
  protected resolveBatchConfig(): {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected activateFallbackProvider(reason: string): Promise<boolean>;
  protected getPendingFallbackProviderInitialization(): Promise<boolean> | null;
  private activateFallbackProviderOnce;
  private runInPlaceReindex;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-embedding-ops.d.ts
type MemoryIndexEntry = MemoryIndexWorkItem["entry"];
declare abstract class MemoryManagerEmbeddingOps extends MemoryManagerSyncOps {
  protected abstract batchFailureCount: number;
  protected abstract batchFailureLastError?: string;
  protected abstract batchFailureLastProvider?: string;
  protected abstract batchFailureLock: Promise<void>;
  protected abstract markLocalEmbeddingProviderDegraded(err: unknown): void;
  private activeProviderUses;
  private providerIdleWaiters;
  private syncProviderGenerationRelease;
  private syncProviderGenerationOwners;
  protected acquireProviderUse(provider: EmbeddingProvider): () => void;
  protected withProviderUse<T>(provider: EmbeddingProvider, run: () => Promise<T>): Promise<T>;
  protected awaitProviderIdle(provider: EmbeddingProvider): Promise<void>;
  protected beginSyncProviderGeneration(options?: {
    forceFtsOnly?: boolean;
  }): void;
  protected endSyncProviderGeneration(): void;
  protected pruneEmbeddingCacheIfNeeded(): void;
  private upsertEmbeddingCacheEntries;
  private embedChunksInBatches;
  protected computeProviderKey(): string;
  protected resolveProviderIndexIdentities(): MemoryIndexProviderIdentity[];
  private buildBatchDebug;
  private embedChunksWithBatch;
  private collectCachedEmbeddings;
  protected embedBatchWithRetry(texts: string[], generation?: MemorySemanticProviderGeneration): Promise<number[][]>;
  protected embedBatchInputsWithRetry(inputs: EmbeddingInput[], generation?: MemorySemanticProviderGeneration): Promise<number[][]>;
  private runProviderBatchWithRetry;
  private waitForEmbeddingRetry;
  private resolveEmbeddingTimeout;
  protected embedQueryWithRetry(text: string, signal?: AbortSignal, providerOverride?: EmbeddingProvider, markDegraded?: boolean, providerRuntimeOverride?: MemoryEmbeddingProviderRuntime): Promise<number[]>;
  protected withTimeout<T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T>;
  private withBatchFailureLock;
  private resetBatchFailureCount;
  private recordBatchFailure;
  private runBatchWithTimeoutRetry;
  private runBatchWithFallback;
  protected getIndexConcurrency(): number;
  private clearIndexedFileData;
  private upsertFileRecord;
  private deleteFileRecord;
  /**
   * Write chunks (and optional embeddings) for a file into the index.
   * Handles both the chunks table, the vector table, and the FTS table.
   * Pass an empty embeddings array to skip vector writes (FTS-only mode).
   */
  private writeChunks;
  private prepareIndexEntry;
  private resolveChunkProvenance;
  protected indexFiles(items: MemoryIndexWorkItem[]): Promise<void>;
  private indexFilesWithGeneration;
  protected indexFile(entry: MemoryIndexEntry, options: {
    source: MemorySource;
    content?: string;
  }): Promise<void>;
  private indexFileWithGeneration;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-provider-lifecycle.d.ts
type MemoryEmbeddingProviderRequirement = {
  mode: "fts-only" | "optional" | "required";
  provider: string;
  configuredProvider?: string;
};
type MemoryEmbeddingBootstrapDebug = NonNullable<MemorySearchRuntimeDebug["embeddingBootstrap"]>;
declare abstract class MemoryProviderLifecycle extends MemoryManagerEmbeddingOps {
  protected abstract readonly cacheKey: string;
  protected abstract readonly purpose: "default" | "status" | "cli";
  protected abstract readonly providerRequirement: MemoryEmbeddingProviderRequirement;
  protected abstract readonly requestedProvider: EmbeddingProviderRequest;
  protected abstract providerInitPromise: Promise<void> | null;
  protected abstract providerInitialized: boolean;
  protected abstract embeddingBootstrapFailure?: MemoryEmbeddingBootstrapDebug;
  protected abstract providerRetirementPromise: Promise<void>;
  protected abstract providersPendingRetirement: Set<EmbeddingProvider>;
  protected abstract closing: boolean;
  protected abstract activeManagerOperations: number;
  protected abstract managerIdleWaiters: Set<() => void>;
  protected abstract indexIdentityDirty: boolean;
  protected abstract indexIdentityState: MemoryIndexIdentityState;
  protected abstract syncAdmitted(params?: MemorySyncParams, options?: {
    allowEmbeddingBootstrapFallback?: boolean;
    queuedSessionOwner?: boolean;
  }): Promise<void>;
  protected applyProviderResult(providerResult: EmbeddingProviderResult): void;
  protected markEmbeddingBootstrapFailure(err: unknown, options?: {
    retainProvider?: boolean;
    provider?: string;
  }): MemoryEmbeddingBootstrapDebug;
  protected ensureEmbeddingProviderForSearch(onDebug?: (debug: MemorySearchRuntimeDebug) => void): Promise<boolean>;
  protected clearEmbeddingBootstrapFailureAfterRecovery(): void;
  protected confirmEmbeddingBootstrapRecovery(): Promise<boolean>;
  protected ensureProviderInitialized(): Promise<void>;
  protected resetProviderInitializationForRetry(): void;
  protected markLocalEmbeddingProviderDegraded(err: unknown): void;
  protected retireCurrentProvider(): Promise<void>;
  protected drainPendingProviderRetirements(): Promise<unknown[]>;
  protected isRequiredProviderUnavailable(): boolean;
  protected buildRequiredProviderUnavailableError(operation: "search" | "sync"): Error;
  protected assertRequiredProviderAvailable(operation: "search" | "sync"): void;
  protected refreshIndexIdentityDirty(params?: {
    providerKeyKnown?: boolean;
  }): MemoryIndexIdentityState;
  protected refreshKeywordFallbackIndexIdentity(): MemoryIndexIdentityState;
  protected withManagerOperation<T>(run: () => Promise<T>): Promise<T>;
  protected awaitManagerIdle(): Promise<void>;
  probeVectorAvailability(): Promise<boolean>;
  probeVectorStoreAvailability(): Promise<boolean>;
  private probeVectorStoreAvailabilityAdmitted;
  protected cacheProbeResult(result: MemoryEmbeddingProbeResult): MemoryEmbeddingProbeResult;
  getCachedEmbeddingAvailability(): MemoryEmbeddingProbeResult | null;
  probeEmbeddingAvailability(): Promise<MemoryEmbeddingProbeResult>;
}
//#endregion
//#region extensions/memory-core/src/memory/manager-registry.d.ts
type MemoryIndexManagerPurpose = "default" | "status" | "cli";
//#endregion
//#region extensions/memory-core/src/memory/manager-search.d.ts
type ExactPathSpecificity = 0 | 1 | 2 | 3;
//#endregion
//#region extensions/memory-core/src/memory/manager-keyword-retrieval.d.ts
type KeywordSearchHit = MemorySearchResult & {
  id: string;
  textScore: number;
  pathScore: number;
  exactPathSpecificity: ExactPathSpecificity;
};
declare abstract class MemoryKeywordRetrieval extends MemoryProviderLifecycle {
  private selectScoredResults;
  listTriggerCandidates(opts?: {
    limit?: number;
    activeProjectKeys?: string[];
  }): Promise<MemorySearchResult[]>;
  listCuratedProjectCandidates(opts: {
    activeProjectKeys: string[];
    limit?: number;
  }): Promise<MemorySearchResult[]>;
  private toCuratedMemorySearchResults;
  private rankKeywordOnlyResults;
  protected finalizeKeywordOnlyResults(params: {
    results: KeywordSearchHit[];
    temporalDecay?: {
      enabled: boolean;
      halfLifeDays: number;
    };
    maxResults: number;
    minScore: number;
    activeProjectKeys?: readonly string[];
  }): Promise<MemorySearchResult[]>;
  protected attachRecallMetadata<T extends MemorySearchResult & {
    id: string;
  }>(results: T[]): T[];
  private searchKeyword;
  protected searchKeywordWithFallback(query: string, limit: number, options: {
    boostFallbackRanking?: boolean;
  } | undefined, sourceFilterList: MemorySource[]): Promise<KeywordSearchHit[]>;
  private resolveKeywordFallbackTerms;
  private mergeKeywordSearchHits;
  private limitKeywordSearchHits;
  protected toMemorySearchResults(results: KeywordSearchHit[]): MemorySearchResult[];
}
//#endregion
//#region extensions/memory-core/src/memory/manager-search-orchestration.d.ts
type MemoryIndexSearchOptions = NonNullable<Parameters<MemorySearchManager["search"]>[1]>;
declare abstract class MemorySearchOrchestration extends MemoryKeywordRetrieval {
  protected abstract sessionWarm: Set<string>;
  protected warmSession(sessionKey?: string): Promise<void>;
  search(query: string, opts?: MemoryIndexSearchOptions): Promise<MemorySearchResult[]>;
  private searchCandidates;
  private hasIndexedContent;
  private searchVector;
  private mergeHybridResults;
}
//#endregion
//#region extensions/memory-core/src/memory/manager.d.ts
declare function closeAllMemoryIndexManagers(): Promise<void>;
declare function closeMemoryIndexManagersForAgent(params: {
  agentId: string;
}): Promise<void>;
declare class MemoryIndexManager extends MemorySearchOrchestration implements MemorySearchManager {
  protected readonly cacheKey: string;
  protected readonly purpose: MemoryIndexManagerPurpose;
  protected readonly acquireLocalService?: MemoryCoreAcquireLocalService;
  protected readonly cfg: OpenClawConfig;
  protected readonly agentId: string;
  protected readonly workspaceDir: string;
  protected readonly settings: ResolvedMemorySearchConfig;
  protected readonly providerRequirement: MemoryEmbeddingProviderRequirement;
  protected readonly requestedProvider: EmbeddingProviderRequest;
  protected providerInitPromise: Promise<void> | null;
  protected providerInitialized: boolean;
  protected embeddingBootstrapFailure?: MemoryEmbeddingBootstrapDebug;
  protected providerRetirementPromise: Promise<void>;
  protected providersPendingRetirement: Set<MemoryEmbeddingProvider>;
  private closePromise;
  private closeTeardownComplete;
  protected closing: boolean;
  protected activeManagerOperations: number;
  protected managerIdleWaiters: Set<() => void>;
  protected providerUnavailableReason?: string;
  protected providerLifecycle: MemoryProviderLifecycleState;
  protected batch: {
    enabled: boolean;
    wait: boolean;
    concurrency: number;
    pollIntervalMs: number;
    timeoutMs: number;
  };
  protected batchFailureCount: number;
  protected batchFailureLastError?: string;
  protected batchFailureLastProvider?: string;
  protected batchFailureLock: Promise<void>;
  protected db: DatabaseSync;
  protected readonly cache: {
    enabled: boolean;
    maxEntries?: number;
  };
  protected readonly vector: {
    enabled: boolean;
    available: boolean | null;
    semanticAvailable?: boolean;
    extensionPath?: string;
    loadError?: string;
    dims?: number;
  };
  protected indexIdentityDirty: boolean;
  protected sessionWarm: Set<string>;
  private syncing;
  private queuedArchiveFiles;
  private queuedSessions;
  private queuedForce;
  private queuedProgressCallbacks;
  private queuedSessionSync;
  protected indexIdentityState: MemoryIndexIdentityState;
  static get(params: {
    cfg: OpenClawConfig;
    agentId: string;
    purpose?: MemoryIndexManagerPurpose;
    acquireLocalService?: MemoryCoreAcquireLocalService;
  }): Promise<MemoryIndexManager | null>;
  private constructor();
  sync(params?: MemorySyncParams): Promise<void>;
  protected syncAdmitted(params?: MemorySyncParams, options?: {
    allowEmbeddingBootstrapFallback?: boolean;
    queuedSessionOwner?: boolean;
  }): Promise<void>;
  private enqueueTargetedSessionSync;
  readFile(params: {
    relPath: string;
    from?: number;
    lines?: number;
  }): Promise<{
    text: string;
    path: string;
  }>;
  status(): MemoryProviderStatus;
  close(): Promise<void>;
  private retryFailedClose;
  private closeOnce;
}
//#endregion
export { MemoryIndexManager, closeAllMemoryIndexManagers, closeMemoryIndexManagersForAgent };