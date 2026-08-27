import { i as MemoryCategory } from "./config-Cd958lsI.js";
import * as LanceDB from "@lancedb/lancedb";
//#region extensions/memory-lancedb/lancedb-store.d.ts
type MemoryEntry = {
  id: string;
  text: string;
  vector: number[];
  importance: number;
  category: MemoryCategory;
  createdAt: number;
};
type MemoryListEntry = Omit<MemoryEntry, "vector">;
type MemoryListOptions = {
  orderByCreatedAt?: boolean;
};
type MemorySearchResult = {
  entry: MemoryEntry;
  score: number;
};
declare const MEMORY_QUERY_COLUMNS: readonly ["id", "text", "importance", "category", "createdAt"];
type MemoryQueryColumn = (typeof MEMORY_QUERY_COLUMNS)[number];
type MemoryQueryFilter = {
  column: MemoryQueryColumn;
  operator: "=" | "!=" | "<>" | "<" | "<=" | ">" | ">=" | "LIKE";
  value: string | number;
};
type MemoryQueryOptions = {
  columns: MemoryQueryColumn[];
  filter?: MemoryQueryFilter;
  limit?: number;
};
declare class MemoryDB {
  private readonly dbPath;
  private readonly vectorDim;
  private readonly storageOptions?;
  private db;
  private table;
  private initPromise;
  constructor(dbPath: string, vectorDim: number, storageOptions?: Record<string, string> | undefined);
  private ensureInitialized;
  private doInitialize;
  store(agentId: string, entry: Omit<MemoryEntry, "id" | "createdAt">): Promise<MemoryEntry>;
  search(agentId: string, vector: number[], limit?: number, minScore?: number, executionOptions?: Pick<LanceDB.QueryExecutionOptions, "timeoutMs">): Promise<MemorySearchResult[]>;
  list(agentId: string, limit?: number, options?: MemoryListOptions): Promise<MemoryListEntry[]>;
  query(agentId: string, options: MemoryQueryOptions): Promise<Record<string, unknown>[]>;
  delete(agentId: string, id: string): Promise<boolean>;
  count(agentId: string): Promise<number>;
  close(): void;
}
//#endregion
export { MemoryQueryFilter as a, MemoryQueryColumn as i, MemoryDB as n, MemorySearchResult as o, MemoryEntry as r, MEMORY_QUERY_COLUMNS as t };