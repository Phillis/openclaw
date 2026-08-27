import { _ as isMemoryOriginEligibleForAutomaticInjection, a as MemoryProviderStatus, c as MemorySearchResult, d as MemorySessionSyncTarget, f as MemorySource, g as isAutomaticMemoryEntryEligible, h as MemoryVectorIndexState, i as MemoryOriginClass, l as MemorySearchRuntimeDebug, m as MemorySyncProgressUpdate, n as MemoryEntryProvenance, o as MemoryReadResult, p as MemorySyncParams, r as MemoryExtraPath, s as MemorySearchManager, t as LegacyMemoryReadResult, u as MemorySessionKind, v as resolveMemorySearchStaleness } from "../types-Cyy1uoGn.js";
import "../types-CiLdD6DO.js";
import { a as SqliteWalMaintenance, i as SqliteConnectionPragmaOptions, o as SqliteWalMaintenanceOptions } from "../openclaw-state-db-contract-BbwGU0Ve.js";
import { _ as splitCuratedMarkdownEntries, a as buildFileEntry, c as cosineSimilarity, d as matchesExtraMemoryPathEntry, f as normalizeExtraMemoryPathEntries, g as runMemoryHostTasksWithConcurrency, h as remapChunkLines, i as MemoryFileEntry, l as ensureMemoryHostDir, m as parseEmbedding, n as MEMORY_CHUNKING_VERSION, o as buildMultimodalChunkForIndexing, p as normalizeExtraMemoryPaths, r as MemoryChunk, s as chunkMarkdown, t as CuratedMarkdownEntry, u as listMemoryFiles } from "../internal-CWnoK0BO.js";
import { a as stripMemoryAnnotationCarriers, i as normalizeProjectAnnotationKey, n as INVALID_PROJECT_ANNOTATION_KEY, r as extractProjectKeysFromCuratedEntry, t as CuratedProjectAnnotations } from "../curated-annotations-CJjk-Sha.js";
import { a as MEMORY_INDEX_STATE_TABLE, c as MEMORY_INDEX_FTS_TABLE, d as dropMemoryPathFtsTriggers, f as ensureMemoryPathFtsTriggers, i as MEMORY_INDEX_META_TABLE, l as MEMORY_INDEX_PATHS_FTS_TABLE, n as ensureMemoryIndexSchema, o as MEMORY_INDEX_VECTOR_TABLE, r as MEMORY_EMBEDDING_CACHE_TABLE, s as MEMORY_INDEX_CHUNKS_TABLE, t as loadSqliteVecExtension, u as MEMORY_INDEX_SOURCES_TABLE } from "../sqlite-vec-280lg_gC.js";
import { i as readMemoryFile, n as resolveMemoryBackendConfig, t as ResolvedMemoryBackendConfig } from "../backend-config-By8T_SLr.js";
import { Stats } from "node:fs";
import { DatabaseSync } from "node:sqlite";
//#region node_modules/@openclaw/fs-safe/dist/regular-file.d.ts
type RegularFileStatResult = {
  missing: true;
} | {
  missing: false;
  stat: Stats;
};
declare function statRegularFile(filePath: string): Promise<RegularFileStatResult>;
//#endregion
//#region packages/memory-host-sdk/src/host/hash.d.ts
/** SHA-256 hash helper for stable cache/content keys. */
declare function hashText(value: string): string;
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-recall.d.ts
declare const MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE = "memory_index_chunk_recall_metadata";
declare function ensureMemoryRecallMetadataSchema(db: DatabaseSync): void;
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-provenance.d.ts
declare const MEMORY_INDEX_CHUNK_PROVENANCE_TABLE = "memory_index_chunk_provenance";
declare function ensureMemoryChunkProvenance(db: DatabaseSync): void;
//#endregion
//#region packages/memory-host-sdk/src/host/read-file-shared.d.ts
/** Default number of lines returned by memory read helpers. */
declare const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
declare const DEFAULT_MEMORY_READ_MAX_CHARS = 12000;
/** Build a memory read result from an already-selected line slice. */
declare function buildMemoryReadResultFromSlice(params: {
  selectedLines: string[];
  relPath: string;
  startLine: number;
  moreSourceLinesRemain?: boolean;
  maxChars?: number;
  suggestReadFallback?: boolean;
}): MemoryReadResult;
/** Build a memory read result from raw file content and caller range options. */
declare function buildMemoryReadResult(params: {
  content: string;
  relPath: string;
  from?: number;
  lines?: number;
  defaultLines?: number;
  maxChars?: number;
  suggestReadFallback?: boolean;
}): MemoryReadResult;
//#endregion
//#region packages/memory-host-sdk/src/host/read-retry.d.ts
/** Return true for transient memory read failures that should be retried. */
declare function isTransientMemoryReadError(error: unknown): boolean;
/** Retry a memory read with the narrow transient error predicate. */
declare function retryTransientMemoryRead<T>(read: () => Promise<T>, label?: string): Promise<T>;
//#endregion
//#region packages/memory-host-sdk/src/host/memory-recall-metadata.d.ts
declare function readMemoryRecallMetadata(db: DatabaseSync, ids: readonly string[]): Map<string, {
  importance: number | null;
  triggers: string | null;
  project_key: string | null;
}>;
declare function readCuratedMemoryTriggerCandidates(db: DatabaseSync, limit: number, activeProjectKeys?: readonly string[]): {
  id: string;
  importance: number | null;
  triggers: string | null;
  project_key: string | null;
  path: string;
  source: string;
  start_line: number;
  end_line: number;
  text: string;
  origin_class: MemoryOriginClass;
  session_kind: MemorySessionKind;
  observed_at: number;
  supersedes_key: string | null;
}[];
declare function readCuratedProjectMemoryCandidates(db: DatabaseSync, limit: number, activeProjectKeys: readonly string[]): {
  id: string;
  importance: number | null;
  triggers: string | null;
  project_key: string | null;
  path: string;
  source: string;
  start_line: number;
  end_line: number;
  text: string;
  origin_class: MemoryOriginClass;
  session_kind: MemorySessionKind;
  observed_at: number;
  supersedes_key: string | null;
}[];
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite.d.ts
declare function requireMemoryHostNodeSqlite(): typeof import("node:sqlite");
declare function configureMemorySqliteWalMaintenance(db: DatabaseSync, options?: SqliteWalMaintenanceOptions & Pick<SqliteConnectionPragmaOptions, "busyTimeoutMs">): SqliteWalMaintenance;
declare function closeMemorySqliteWalMaintenance(db: DatabaseSync): boolean;
//#endregion
//#region packages/memory-host-sdk/src/host/fs-utils.d.ts
/**
 * True for missing-file errors emitted by Node or fs-safe.
 * The narrowed union stays stable; extra-path authorization handles `not-file` separately.
 */
declare function isFileMissingError(err: unknown): err is NodeJS.ErrnoException & {
  code: "ENOENT" | "ENOTDIR" | "not-file" | "not-found";
};
//#endregion
//#region src/plugin-sdk/memory-core-host-engine-storage.d.ts
/** Health probe result for embedding provider availability checks. */
type MemoryEmbeddingProbeResult = {
  ok: boolean;
  error?: string;
  checked?: boolean;
  cached?: boolean;
  checkedAtMs?: number;
  cacheExpiresAtMs?: number;
};
//#endregion
export { type CuratedMarkdownEntry, type CuratedProjectAnnotations, DEFAULT_MEMORY_READ_LINES, DEFAULT_MEMORY_READ_MAX_CHARS, INVALID_PROJECT_ANNOTATION_KEY, type LegacyMemoryReadResult, MEMORY_CHUNKING_VERSION, MEMORY_EMBEDDING_CACHE_TABLE, MEMORY_INDEX_CHUNKS_TABLE, MEMORY_INDEX_CHUNK_PROVENANCE_TABLE, MEMORY_INDEX_CHUNK_RECALL_METADATA_TABLE, MEMORY_INDEX_FTS_TABLE, MEMORY_INDEX_META_TABLE, MEMORY_INDEX_PATHS_FTS_TABLE, MEMORY_INDEX_SOURCES_TABLE, MEMORY_INDEX_STATE_TABLE, MEMORY_INDEX_VECTOR_TABLE, type MemoryChunk, MemoryEmbeddingProbeResult, type MemoryEntryProvenance, type MemoryExtraPath, type MemoryFileEntry, type MemoryOriginClass, type MemoryProviderStatus, type MemoryReadResult, type MemorySearchManager, type MemorySearchResult, type MemorySearchRuntimeDebug, type MemorySessionKind, type MemorySessionSyncTarget, type MemorySource, type MemorySyncParams, type MemorySyncProgressUpdate, type MemoryVectorIndexState, type ResolvedMemoryBackendConfig, buildFileEntry, buildMemoryReadResult, buildMemoryReadResultFromSlice, buildMultimodalChunkForIndexing, chunkMarkdown, closeMemorySqliteWalMaintenance, configureMemorySqliteWalMaintenance, cosineSimilarity, dropMemoryPathFtsTriggers, ensureMemoryHostDir as ensureDir, ensureMemoryChunkProvenance, ensureMemoryIndexSchema, ensureMemoryPathFtsTriggers, ensureMemoryRecallMetadataSchema, extractProjectKeysFromCuratedEntry, hashText, isAutomaticMemoryEntryEligible, isFileMissingError, isMemoryOriginEligibleForAutomaticInjection, isTransientMemoryReadError, listMemoryFiles, loadSqliteVecExtension, matchesExtraMemoryPathEntry, normalizeExtraMemoryPathEntries, normalizeExtraMemoryPaths, normalizeProjectAnnotationKey, parseEmbedding, readCuratedMemoryTriggerCandidates, readCuratedProjectMemoryCandidates, readMemoryFile, readMemoryRecallMetadata, remapChunkLines, requireMemoryHostNodeSqlite as requireNodeSqlite, resolveMemoryBackendConfig, resolveMemorySearchStaleness, retryTransientMemoryRead, runMemoryHostTasksWithConcurrency as runWithConcurrency, splitCuratedMarkdownEntries, statRegularFile, stripMemoryAnnotationCarriers };