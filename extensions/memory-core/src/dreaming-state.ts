// Memory Core dreaming state lives in SQLite-backed plugin state.
import { createHash } from "node:crypto";
import path from "node:path";
import { scheduler } from "node:timers/promises";
import { isDeepStrictEqual } from "node:util";
import type {
  OpenKeyedStoreOptions,
  PluginStateEntry,
  PluginStateKeyedStore,
} from "openclaw/plugin-sdk/plugin-state-runtime";

const MEMORY_CORE_PLUGIN_ID = "memory-core";
export const DREAMING_DAILY_INGESTION_NAMESPACE = "dreaming-daily-ingestion";
export const DREAMING_DAILY_PROVENANCE_NAMESPACE = "dreaming-daily-provenance";
export const DREAMING_SESSION_INGESTION_FILES_NAMESPACE = "dreaming-session-ingestion-files";
export const DREAMING_SESSION_INGESTION_SEEN_NAMESPACE = "dreaming-session-ingestion-seen";
export const SESSION_BACKFILL_REWIND_NAMESPACE = "session-backfill-rewind";
export const DREAMING_MEMORY_BACKUP_NAMESPACE = "dreaming-memory-backups";
export const SHORT_TERM_RECALL_NAMESPACE = "short-term-recall";
export const SHORT_TERM_PHASE_SIGNAL_NAMESPACE = "short-term-phase-signals";
export const SHORT_TERM_META_NAMESPACE = "short-term-meta";
export const SHORT_TERM_LOCK_NAMESPACE = "short-term-locks";

export const DREAMING_WORKSPACE_STATE_MAX_ENTRIES = 50_000;
export const SHORT_TERM_LOCK_MAX_ENTRIES = 4_096;
export const SESSION_SEEN_HASHES_PER_CHUNK = 512;

export type MemoryCoreOpenKeyedStore = <T>(
  options: OpenKeyedStoreOptions,
) => PluginStateKeyedStore<T>;

type WorkspaceValue<T> = {
  version: 1;
  workspaceKey: string;
  workspaceDir: string;
  key: string;
  value: T;
};

type MemoryCoreWorkspaceEntry<T> = { key: string; value: T };

type MemoryCoreWorkspaceParams = {
  namespace: string;
  workspaceDir: string;
};

type WriteMemoryCoreWorkspaceEntriesParams<T> = MemoryCoreWorkspaceParams & {
  entries: Array<MemoryCoreWorkspaceEntry<T>>;
};

type WriteMemoryCoreWorkspaceEntryParams<T> = MemoryCoreWorkspaceParams &
  MemoryCoreWorkspaceEntry<T>;

let configuredOpenKeyedStore: MemoryCoreOpenKeyedStore | undefined;

export function configureMemoryCoreDreamingState(openKeyedStore: MemoryCoreOpenKeyedStore): void {
  configuredOpenKeyedStore = openKeyedStore;
}

export function openMemoryCoreStateStore<T>(
  options: OpenKeyedStoreOptions,
): PluginStateKeyedStore<T> {
  if (!configuredOpenKeyedStore) {
    throw new Error("memory-core dreaming SQLite state store is not configured");
  }
  return configuredOpenKeyedStore<T>(options);
}

export function normalizeMemoryCoreWorkspaceKey(workspaceDir: string): string {
  const resolved = path.resolve(workspaceDir).replace(/\\/g, "/");
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

export function memoryCoreWorkspaceStateKey(workspaceDir: string): string {
  return createHash("sha256").update(normalizeMemoryCoreWorkspaceKey(workspaceDir)).digest("hex");
}

export function memoryCoreWorkspaceEntryKey(workspaceDir: string, logicalKey: string): string {
  const workspaceKey = memoryCoreWorkspaceStateKey(workspaceDir);
  const itemKey = createHash("sha256").update(logicalKey).digest("hex");
  return `${workspaceKey}:${itemKey}`;
}

export function memoryCoreStateReference(namespace: string, workspaceDir: string): string {
  return `plugin-state:${MEMORY_CORE_PLUGIN_ID}/${namespace}/${memoryCoreWorkspaceStateKey(workspaceDir)}`;
}

// Bounded key range covering a single workspace's rows. `';'` is the next
// ASCII code point after ':' so the range claims every key that starts with
// `${workspaceKey}:` and excludes any other workspace whose hash sorts
// between adjacent values.
function resolveWorkspaceKeyRange(workspaceDir: string): {
  keyStartInclusive: string;
  keyEndExclusive: string;
} {
  const workspaceKey = memoryCoreWorkspaceStateKey(workspaceDir);
  return {
    keyStartInclusive: `${workspaceKey}:`,
    // Exclusive upper bound: ';' is the immediate ASCII successor of ':', so
    // every key starting with `${workspaceKey}:` sorts strictly less than
    // this bound and any other workspace key sorts either below or above it.
    keyEndExclusive: `${workspaceKey};`,
  };
}

async function readWorkspaceEntriesInRange<T>(
  store: PluginStateKeyedStore<WorkspaceValue<T>>,
  workspaceDir: string,
): Promise<PluginStateEntry<WorkspaceValue<T>>[]> {
  const { keyStartInclusive, keyEndExclusive } = resolveWorkspaceKeyRange(workspaceDir);
  if (store.entriesInKeyRange) {
    return store.entriesInKeyRange({
      keyStartInclusive,
      keyEndExclusive,
      limit: DREAMING_WORKSPACE_STATE_MAX_ENTRIES,
    });
  }
  // Test-only fallback for store mocks that do not implement the range
  // method. Production memory-core always takes the range path.
  return (await store.entries()).filter(
    (entry) => entry.key >= keyStartInclusive && entry.key < keyEndExclusive,
  );
}

async function deleteWorkspaceEntries(
  store: PluginStateKeyedStore<WorkspaceValue<unknown>>,
  stateKeys: Iterable<string>,
): Promise<void> {
  let deleted = 0;
  for (const stateKey of stateKeys) {
    await store.delete(stateKey);
    deleted += 1;
    if (deleted % 256 === 0) {
      await scheduler.yield();
    }
  }
}

function openWorkspaceStore<T>(namespace: string): PluginStateKeyedStore<WorkspaceValue<T>> {
  return openMemoryCoreStateStore<WorkspaceValue<T>>({
    namespace,
    maxEntries: DREAMING_WORKSPACE_STATE_MAX_ENTRIES,
  });
}

// Caller owns typed decoding for values read from plugin state.
export function readMemoryCoreWorkspaceEntries<T>(
  params: MemoryCoreWorkspaceParams,
): Promise<Array<MemoryCoreWorkspaceEntry<T>>>;
export async function readMemoryCoreWorkspaceEntries(
  params: MemoryCoreWorkspaceParams,
): Promise<Array<MemoryCoreWorkspaceEntry<unknown>>> {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  const entries = await readWorkspaceEntriesInRange<unknown>(
    openWorkspaceStore<unknown>(params.namespace),
    params.workspaceDir,
  );
  return entries
    .filter((entry) => entry.value.workspaceKey === workspaceKey)
    .map((entry) => ({ key: entry.value.key, value: entry.value.value }));
}

export async function readMemoryCoreWorkspaceEntry<T>(
  params: MemoryCoreWorkspaceParams & { key: string },
): Promise<T | undefined> {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  const entry = await openWorkspaceStore<T>(params.namespace).lookup(
    memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key),
  );
  return entry?.workspaceKey === workspaceKey ? entry.value : undefined;
}

// Caller owns typed encoding for values written to plugin state.
// Skip register() when the canonical workspace value is unchanged so Dreaming
// does not rewrite every row (and stall the gateway) on a no-op second pass.
//
// Capacity retention policy (explicit): skipping register() also skips the
// keyed store's created_at refresh. Under DREAMING_WORKSPACE_STATE_MAX_ENTRIES
// pressure the store evicts oldest created_at first, so stable/unchanged rows
// age toward eviction instead of being retained via rewrite-based recency.
// Write-amplification reduction takes precedence over refresh-based retention.
//
// When a register can trigger capacity eviction, a previously skipped equal
// desired row may disappear mid-pass. After any write, reread authoritative
// state and restore missing/changed desired rows. True no-op passes stay at
// zero register() calls.
//
// Capacity contract (explicit): the unique desired set must fit inside the
// namespace cap. Batches that exceed DREAMING_WORKSPACE_STATE_MAX_ENTRIES
// cannot be reconciled because eviction will always drop a desired row no
// matter how the bounded rounds reorder re-registrations. Reject such
// batches up front with a clear RangeError so callers see the failure
// instead of a silently truncated namespace.
export function writeMemoryCoreWorkspaceEntries<T>(
  params: WriteMemoryCoreWorkspaceEntriesParams<T>,
): Promise<void>;
export async function writeMemoryCoreWorkspaceEntries(
  params: WriteMemoryCoreWorkspaceEntriesParams<unknown>,
): Promise<void> {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  const workspaceDir = path.resolve(params.workspaceDir);
  // Collapse duplicate logical keys before touching the store. The final value
  // still wins, without manufacturing transient SQLite writes for earlier values.
  const desiredByStateKey = new Map<string, WorkspaceValue<unknown>>();
  for (const entry of params.entries) {
    const stateKey = memoryCoreWorkspaceEntryKey(params.workspaceDir, entry.key);
    desiredByStateKey.set(stateKey, {
      version: 1,
      workspaceKey,
      workspaceDir,
      key: entry.key,
      value: entry.value,
    });
  }
  if (desiredByStateKey.size > DREAMING_WORKSPACE_STATE_MAX_ENTRIES) {
    throw new RangeError(
      `memory-core workspace entries: ${desiredByStateKey.size} unique rows exceeds namespace capacity ${DREAMING_WORKSPACE_STATE_MAX_ENTRIES}; reduce workspace state cardinality`,
    );
  }
  const store = openWorkspaceStore<unknown>(params.namespace);
  const existingByKey = new Map(
    (await readWorkspaceEntriesInRange(store, params.workspaceDir)).map(
      (entry) => [entry.key, entry.value] as const,
    ),
  );
  let wrote = false;
  for (const [stateKey, nextValue] of desiredByStateKey) {
    const current = existingByKey.get(stateKey);
    if (current !== undefined && isDeepStrictEqual(current, nextValue)) {
      continue;
    }
    await store.register(stateKey, nextValue);
    wrote = true;
  }
  await deleteWorkspaceEntries(
    store,
    existingByKey.keys().filter((stateKey) => !desiredByStateKey.has(stateKey)),
  );
  // Only reconcile after real writes. A pure equal pass must not touch the store.
  if (wrote) {
    await reconcileDesiredWorkspaceEntries({
      store,
      workspaceDir: params.workspaceDir,
      desiredByStateKey,
    });
  }
}

async function reconcileDesiredWorkspaceEntries(params: {
  store: PluginStateKeyedStore<WorkspaceValue<unknown>>;
  workspaceDir: string;
  desiredByStateKey: Map<string, WorkspaceValue<unknown>>;
}): Promise<void> {
  const desiredSize = params.desiredByStateKey.size;
  if (desiredSize === 0) {
    return;
  }
  // Each capacity register can re-evict another desired row. Bound rounds by
  // unique desired size so we cannot thrash forever when desired > maxEntries.
  const maxRounds = desiredSize;
  for (let round = 0; round < maxRounds; round += 1) {
    const liveByKey = new Map(
      (await readWorkspaceEntriesInRange(params.store, params.workspaceDir)).map(
        (entry) => [entry.key, entry.value] as const,
      ),
    );
    let missingCount = 0;
    for (const [stateKey, nextValue] of params.desiredByStateKey) {
      const current = liveByKey.get(stateKey);
      if (current !== undefined && isDeepStrictEqual(current, nextValue)) {
        continue;
      }
      await params.store.register(stateKey, nextValue);
      missingCount += 1;
    }
    if (missingCount === 0) {
      return;
    }
  }
  // Bound exhausted with desired rows still missing; verify and report.
  const finalLiveByKey = new Map(
    (await readWorkspaceEntriesInRange(params.store, params.workspaceDir)).map(
      (entry) => [entry.key, entry.value] as const,
    ),
  );
  const stillMissing: string[] = [];
  for (const [stateKey, nextValue] of params.desiredByStateKey) {
    const current = finalLiveByKey.get(stateKey);
    if (current === undefined || !isDeepStrictEqual(current, nextValue)) {
      stillMissing.push(stateKey);
    }
  }
  if (stillMissing.length === 0) {
    return;
  }
  throw new Error(
    `memory-core workspace reconcile failed to converge after ${maxRounds} rounds; ${stillMissing.length} of ${desiredSize} desired rows still missing (namespace capacity may be exceeded by desired set)`,
  );
}

// Caller owns typed encoding for values written to plugin state.
export function writeMemoryCoreWorkspaceEntry<T>(
  params: WriteMemoryCoreWorkspaceEntryParams<T>,
): Promise<void>;
export async function writeMemoryCoreWorkspaceEntry(
  params: WriteMemoryCoreWorkspaceEntryParams<unknown>,
): Promise<void> {
  const workspaceKey = memoryCoreWorkspaceStateKey(params.workspaceDir);
  await openWorkspaceStore<unknown>(params.namespace).register(
    memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key),
    {
      version: 1,
      workspaceKey,
      workspaceDir: path.resolve(params.workspaceDir),
      key: params.key,
      value: params.value,
    },
  );
}

export async function clearMemoryCoreWorkspaceNamespace(params: {
  namespace: string;
  workspaceDir: string;
}): Promise<void> {
  const store = openWorkspaceStore(params.namespace);
  const entries = await readWorkspaceEntriesInRange(store, params.workspaceDir);
  await deleteWorkspaceEntries(
    store,
    entries.map((entry) => entry.key),
  );
}

export async function deleteMemoryCoreWorkspaceEntry(params: {
  namespace: string;
  workspaceDir: string;
  key: string;
}): Promise<void> {
  await openWorkspaceStore(params.namespace).delete(
    memoryCoreWorkspaceEntryKey(params.workspaceDir, params.key),
  );
}
