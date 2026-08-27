//#region src/plugin-state/plugin-state-store.types.d.ts
type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};
type PluginStateKeyRangeQuery = {
  keyStartInclusive: string;
  keyEndExclusive: string;
  limit: number;
  order?: "asc" | "desc";
};
/** Async plugin state API exposed to plugin runtimes. */
type PluginStateKeyedStore<T> = {
  register(key: string, value: T, opts?: {
    ttlMs?: number;
  }): Promise<void>;
  registerIfAbsent(key: string, value: T, opts?: {
    ttlMs?: number;
  }): Promise<boolean>;
  update?: (key: string, updateValue: (current: T | undefined) => T | undefined, opts?: {
    ttlMs?: number;
  }) => Promise<boolean>; /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
  /**
   * Bounded key-range read for owners with sortable keys. Production stores
   * provide this; owner code must treat absence as a fallback to `entries()`
   * with prefix filtering. Start is inclusive, end is exclusive, and end must
   * sort strictly greater than start.
   */
  entriesInKeyRange?: (query: PluginStateKeyRangeQuery) => Promise<PluginStateEntry<T>[]>;
  clear(): Promise<void>;
};
/** Sync plugin state API used by trusted core/plugin bootstrap paths. */
type PluginStateSyncKeyedStore<T> = {
  register(key: string, value: T, opts?: {
    ttlMs?: number;
  }): void;
  registerIfAbsent(key: string, value: T, opts?: {
    ttlMs?: number;
  }): boolean;
  update?: (key: string, updateValue: (current: T | undefined) => T | undefined, opts?: {
    ttlMs?: number;
  }) => boolean; /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[]; /** Bounded key-range read; same contract as the async variant. */
  entriesInKeyRange?: (query: PluginStateKeyRangeQuery) => PluginStateEntry<T>[];
  clear(): void;
};
/** Options for opening a keyed plugin-state namespace. */
type PluginStateOverflowPolicy = "evict-oldest" | "reject-new";
type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  overflowPolicy?: PluginStateOverflowPolicy;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};
//#endregion
export { PluginStateSyncKeyedStore as a, PluginStateKeyedStore as i, PluginStateEntry as n, PluginStateKeyRangeQuery as r, OpenKeyedStoreOptions as t };