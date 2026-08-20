// Public plugin-state store contracts. Stores are keyed by plugin id and
// namespace, persist JSON-compatible values, and enforce per-namespace limits.
export type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
};

export type PluginStateKeyRangeQuery = {
  keyStartInclusive: string;
  keyEndExclusive: string;
  limit: number;
  order?: "asc" | "desc";
};

/** Async plugin state API exposed to plugin runtimes. */
export type PluginStateKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): Promise<void>;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): Promise<boolean>;
  update?: (
    key: string,
    updateValue: (current: T | undefined) => T | undefined,
    opts?: { ttlMs?: number },
  ) => Promise<boolean>;
  /** Atomically deletes an existing entry when its current value matches. */
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
export type PluginStateSyncKeyedStore<T> = {
  register(key: string, value: T, opts?: { ttlMs?: number }): void;
  registerIfAbsent(key: string, value: T, opts?: { ttlMs?: number }): boolean;
  update?: (
    key: string,
    updateValue: (current: T | undefined) => T | undefined,
    opts?: { ttlMs?: number },
  ) => boolean;
  /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[];
  /** Bounded key-range read; same contract as the async variant. */
  entriesInKeyRange?: (query: PluginStateKeyRangeQuery) => PluginStateEntry<T>[];
  clear(): void;
};

/** Options for opening a keyed plugin-state namespace. */
export type PluginStateOverflowPolicy = "evict-oldest" | "reject-new";

export type OpenKeyedStoreOptions = {
  namespace: string;
  maxEntries: number;
  overflowPolicy?: PluginStateOverflowPolicy;
  defaultTtlMs?: number;
  env?: NodeJS.ProcessEnv;
};

export type PluginStateStoreErrorCode =
  | "PLUGIN_STATE_SQLITE_UNAVAILABLE"
  | "PLUGIN_STATE_OPEN_FAILED"
  | "PLUGIN_STATE_WRITE_FAILED"
  | "PLUGIN_STATE_READ_FAILED"
  | "PLUGIN_STATE_CORRUPT"
  | "PLUGIN_STATE_LIMIT_EXCEEDED"
  | "PLUGIN_STATE_INVALID_INPUT";

export type PluginStateStoreOperation =
  | "load-sqlite"
  | "open"
  | "ensure-schema"
  | "register"
  | "lookup"
  | "consume"
  | "delete"
  | "entries"
  | "clear"
  | "sweep"
  | "probe"
  | "close";

type PluginStateStoreErrorOptions = {
  code: PluginStateStoreErrorCode;
  operation: PluginStateStoreOperation;
  path?: string;
  cause?: unknown;
};

/** Typed error thrown for plugin-state validation and sqlite failures. */
export class PluginStateStoreError extends Error {
  readonly code: PluginStateStoreErrorCode;
  readonly operation: PluginStateStoreOperation;
  readonly path?: string;

  constructor(message: string, options: PluginStateStoreErrorOptions) {
    super(message, { cause: options.cause });
    this.name = "PluginStateStoreError";
    this.code = options.code;
    this.operation = options.operation;
    if (options.path) {
      this.path = options.path;
    }
  }
}

export type PluginStateStoreProbeStep = {
  name: string;
  ok: boolean;
  code?: PluginStateStoreErrorCode;
  message?: string;
};

export type PluginStateStoreProbeResult = {
  ok: boolean;
  databasePath: string;
  steps: PluginStateStoreProbeStep[];
};
