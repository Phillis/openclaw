import { DatabaseSync } from "node:sqlite";

//#region packages/memory-host-sdk/src/host/memory-schema-fts.d.ts
declare const MEMORY_INDEX_SOURCES_TABLE = "memory_index_sources";
declare const MEMORY_INDEX_CHUNKS_TABLE = "memory_index_chunks";
declare const MEMORY_INDEX_FTS_TABLE = "memory_index_chunks_fts";
declare const MEMORY_INDEX_PATHS_FTS_TABLE = "memory_index_paths_fts";
/** Drop the canonical source-to-path-FTS maintenance triggers. */
declare function dropMemoryPathFtsTriggers(db: DatabaseSync): void;
/** Install the canonical source-to-path-FTS maintenance triggers. */
declare function ensureMemoryPathFtsTriggers(db: DatabaseSync): void;
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema-base.d.ts
declare const MEMORY_INDEX_META_TABLE = "memory_index_meta";
declare const MEMORY_EMBEDDING_CACHE_TABLE = "memory_embedding_cache";
declare const MEMORY_INDEX_STATE_TABLE = "memory_index_state";
declare const MEMORY_INDEX_VECTOR_TABLE = "memory_index_chunks_vec";
//#endregion
//#region packages/memory-host-sdk/src/host/memory-schema.d.ts
/** Ensure canonical memory index tables and the optional FTS table exist. */
declare function ensureMemoryIndexSchema(params: {
  db: DatabaseSync; /** @deprecated Omit to use the canonical memory cache table. */
  embeddingCacheTable?: string;
  cacheEnabled: boolean; /** @deprecated Omit to use the canonical memory FTS table. */
  ftsTable?: string;
  ftsEnabled: boolean;
  ftsTokenizer?: "unicode61" | "trigram";
}): {
  ftsAvailable: boolean;
  ftsError?: string;
};
//#endregion
//#region packages/memory-host-sdk/src/host/sqlite-vec.d.ts
declare function loadSqliteVecExtension(params: {
  db: DatabaseSync;
  extensionPath?: string;
}): Promise<{
  ok: boolean;
  extensionPath?: string;
  error?: string;
}>;
//#endregion
export { MEMORY_INDEX_STATE_TABLE as a, MEMORY_INDEX_FTS_TABLE as c, dropMemoryPathFtsTriggers as d, ensureMemoryPathFtsTriggers as f, MEMORY_INDEX_META_TABLE as i, MEMORY_INDEX_PATHS_FTS_TABLE as l, ensureMemoryIndexSchema as n, MEMORY_INDEX_VECTOR_TABLE as o, MEMORY_EMBEDDING_CACHE_TABLE as r, MEMORY_INDEX_CHUNKS_TABLE as s, loadSqliteVecExtension as t, MEMORY_INDEX_SOURCES_TABLE as u };