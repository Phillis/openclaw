import { n as OpenClawConfig, t as ConfigFileSnapshot } from "./types.openclaw-DRR8P0H2.js";
import "./types-cxNMThub.js";
import "./manifest-registry-BxnLUIEl.js";
import "./plugin-metadata-snapshot.types-BygsCokS.js";
import "json5";
//#region src/config/runtime-snapshot.d.ts
type ConfigWriteAfterWrite = {
  mode: "auto";
} | {
  mode: "restart";
  reason: string;
} | {
  mode: "none";
  reason: string;
};
type ConfigWriteFollowUp = {
  mode: "auto";
  requiresRestart: false;
} | {
  mode: "none";
  reason: string;
  requiresRestart: false;
} | {
  mode: "restart";
  reason: string;
  requiresRestart: true;
};
//#endregion
//#region src/config/mutate.d.ts
type ConfigReplaceResult = {
  path: string;
  previousHash: string | null;
  snapshot: ConfigFileSnapshot;
  nextConfig: OpenClawConfig;
  persistedHash: string | null;
  afterWrite: ConfigWriteAfterWrite;
  followUp: ConfigWriteFollowUp;
};
//#endregion
//#region src/config/paths.d.ts
/**
 * State directory for mutable data (sessions, logs, caches).
 * Can be overridden via OPENCLAW_STATE_DIR.
 * Default: ~/.openclaw
 */
declare function resolveStateDir(env?: NodeJS.ProcessEnv, homedir?: () => string): string;
//#endregion
//#region src/plugin-state/plugin-state-store.types.d.ts
type PluginStateEntry<T> = {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
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
  }) => Promise<boolean>;
  /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => Promise<boolean>;
  lookup(key: string): Promise<T | undefined>;
  consume(key: string): Promise<T | undefined>;
  delete(key: string): Promise<boolean>;
  entries(): Promise<PluginStateEntry<T>[]>;
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
  }) => boolean;
  /** Atomically deletes an existing entry when its current value matches. */
  deleteIf?: (key: string, predicate: (current: T) => boolean) => boolean;
  lookup(key: string): T | undefined;
  consume(key: string): T | undefined;
  delete(key: string): boolean;
  entries(): PluginStateEntry<T>[];
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
export { resolveStateDir as a, PluginStateSyncKeyedStore as i, PluginStateEntry as n, ConfigReplaceResult as o, PluginStateKeyedStore as r, ConfigWriteAfterWrite as s, OpenKeyedStoreOptions as t };