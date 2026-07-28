/** Public cron store load/save API backed by SQLite plus quarantine sidecars. */
import fs from "node:fs";
import path from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { isDeepStrictEqual } from "node:util";
import { isRecord } from "@openclaw/normalization-core/record-coerce";
import { normalizeOptionalString } from "@openclaw/normalization-core/string-coerce";
import { expandHomePrefix } from "../infra/home-dir.js";
import { requireNodeSqlite } from "../infra/node-sqlite.js";
import { replaceFileAtomic } from "../infra/replace-file.js";
import {
  openOpenClawStateDatabase,
  runOpenClawStateWriteTransaction,
} from "../state/openclaw-state-db.js";
import { resolveOpenClawStateSqlitePath } from "../state/openclaw-state-db.paths.js";
import { resolveConfigDir } from "../utils.js";
import { parseJsonWithJson5Fallback } from "../utils/parse-json-compat.js";
import {
  assertCronDefinitionMutationAllowed,
  assertCronDefinitionSnapshotMutationAllowed,
  cronJobDefinitionsEqual,
} from "./service/definition-mutation-guard.js";
import { readCronStoreStatePath } from "./store/config-state.js";
import { cronStoreKey } from "./store/key.js";
import {
  assertCronStoreCanPersist,
  loadedCronStoreFromRows,
  loadCronRows,
  projectCronJobDefinitionRow,
  projectCronJobReplacementThroughStorageCodec,
  projectCronJobThroughStorageCodec,
  replaceCronRows,
  updateCronRuntimeRows,
} from "./store/row-codec.js";
import type {
  CronQuarantineFile,
  LoadedCronStore,
  QuarantinedCronConfigJob,
} from "./store/types.js";
export type {
  CronConfigJobRuntimeEntry,
  LoadedCronStore,
  QuarantinedCronConfigJob,
} from "./store/types.js";
import type { CronStoreFile } from "./types.js";

function resolveDefaultCronDir(env: NodeJS.ProcessEnv): string {
  return path.join(resolveConfigDir(env), "cron");
}

function resolveDefaultCronStorePath(env: NodeJS.ProcessEnv): string {
  return path.join(resolveDefaultCronDir(env), "jobs.json");
}

/** Resolves the sidecar quarantine path used for invalid cron config rows. */
export function resolveCronQuarantinePath(storePath: string): string {
  if (storePath.endsWith(".json")) {
    return storePath.replace(/\.json$/, "-quarantine.json");
  }
  return `${storePath}-quarantine.json`;
}

/** Resolves the cron jobs store path, expanding home-relative user input. */
export function resolveCronJobsStorePath(storePath?: string, env: NodeJS.ProcessEnv = process.env) {
  const selected = storePath?.trim() || readCronStoreStatePath(env);
  if (selected) {
    const raw = selected.trim();
    if (raw.startsWith("~")) {
      return path.resolve(expandHomePrefix(raw, { env }));
    }
    return path.resolve(raw);
  }
  return resolveDefaultCronStorePath(env);
}

/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
export async function loadCronJobsStoreWithConfigJobs(storePath: string): Promise<LoadedCronStore> {
  const resolvedStorePath = path.resolve(storePath);
  const storeKey = cronStoreKey(resolvedStorePath);
  const database = openOpenClawStateDatabase().db;
  const rows = loadCronRows(database, storeKey);
  if (rows.length > 0) {
    return loadedCronStoreFromRows(rows);
  }
  return {
    store: { version: 1, jobs: [] },
    configJobs: [],
    configJobIndexes: [],
    configJobRuntimeEntries: [],
    invalidConfigRows: [],
  };
}

function emptyLoadedCronStore(): LoadedCronStore {
  return {
    store: { version: 1, jobs: [] },
    configJobs: [],
    configJobIndexes: [],
    configJobRuntimeEntries: [],
    invalidConfigRows: [],
  };
}

function tableExists(db: DatabaseSync, tableName: string): boolean {
  return (
    db
      .prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?")
      .get(tableName) !== undefined
  );
}

/** Loads cron jobs from an existing SQLite store without creating or migrating state. */
export async function loadCronJobsStoreWithConfigJobsReadOnly(
  storePath: string,
): Promise<LoadedCronStore> {
  const statePath = resolveOpenClawStateSqlitePath(process.env);
  if (!fs.existsSync(statePath)) {
    return emptyLoadedCronStore();
  }
  const resolvedStorePath = path.resolve(storePath);
  const storeKey = cronStoreKey(resolvedStorePath);
  const sqlite = requireNodeSqlite();
  const db = new sqlite.DatabaseSync(statePath, { readOnly: true });
  try {
    if (!tableExists(db, "cron_jobs")) {
      return emptyLoadedCronStore();
    }
    const rows = loadCronRows(db, storeKey);
    if (rows.length > 0) {
      return loadedCronStoreFromRows(rows);
    }
    return emptyLoadedCronStore();
  } finally {
    db.close();
  }
}

/** Loads only the persisted cron job store payload. */
export async function loadCronJobsStore(storePath: string): Promise<CronStoreFile> {
  return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}

/** Synchronously loads only the persisted cron job store payload. */
export function loadCronJobsStoreSync(storePath: string): CronStoreFile {
  const resolvedStorePath = path.resolve(storePath);
  const storeKey = cronStoreKey(resolvedStorePath);
  const database = openOpenClawStateDatabase().db;
  const rows = loadCronRows(database, storeKey);
  if (rows.length > 0) {
    return loadedCronStoreFromRows(rows).store;
  }
  return { version: 1, jobs: [] };
}

type SaveCronStoreOptions = {
  stateOnly?: boolean;
};

class CronDefinitionCasMismatchError extends Error {
  code = "CRON_DEFINITION_CAS_MISMATCH" as const;

  constructor(jobId: string) {
    super(`cron definition changed before runtime state could persist: ${jobId}`);
    this.name = "CronDefinitionCasMismatchError";
  }
}

function storedCronJobs(
  db: DatabaseSync,
  storeKey: string,
): {
  complete: boolean;
  definitionRows: readonly Record<string, unknown>[];
  rawConfigJobs: readonly Record<string, unknown>[];
  store: CronStoreFile;
  unparseableJobIds: ReadonlySet<string>;
} {
  const rows = loadCronRows(db, storeKey);
  if (rows.length === 0) {
    return {
      complete: true,
      definitionRows: [],
      rawConfigJobs: [],
      store: { version: 1, jobs: [] },
      unparseableJobIds: new Set(),
    };
  }
  const store = loadedCronStoreFromRows(rows).store;
  const parsedJobIds = new Set(store.jobs.map((job) => job.id));
  const unparseableJobIds = new Set(
    rows.map((row) => row.job_id).filter((jobId) => !parsedJobIds.has(jobId)),
  );
  const rawConfigJobs: Record<string, unknown>[] = [];
  let rawConfigComplete = true;
  for (const row of rows) {
    try {
      const parsed = JSON.parse(row.job_json) as unknown;
      if (!isRecord(parsed) || Array.isArray(parsed)) {
        rawConfigComplete = false;
        continue;
      }
      rawConfigJobs.push(parsed);
    } catch {
      rawConfigComplete = false;
    }
  }
  return {
    complete: unparseableJobIds.size === 0 && rawConfigComplete,
    definitionRows: rows.map(projectCronJobDefinitionRow),
    rawConfigJobs,
    store,
    unparseableJobIds,
  };
}

function assertFullStoreDefinitionMutationAllowed(
  db: DatabaseSync,
  storeKey: string,
  proposed: CronStoreFile,
): void {
  const durable = storedCronJobs(db, storeKey);
  if (!durable.complete) {
    // An unparseable durable row cannot be represented by the proposed store.
    // During an active freeze, treating it as absent would silently delete it.
    assertCronDefinitionMutationAllowed();
  }
  const proposedReplacements = proposed.jobs.map((job, index) =>
    projectCronJobReplacementThroughStorageCodec(job, index),
  );
  const completeProposedReplacements = proposedReplacements.filter(
    (replacement): replacement is NonNullable<(typeof proposedReplacements)[number]> =>
      replacement !== null,
  );
  if (completeProposedReplacements.length !== proposedReplacements.length) {
    assertCronDefinitionMutationAllowed();
  }
  // Both comparisons use the same exact serialized replacement projection.
  // This closes normalization gaps between raw job_json and split columns,
  // while JSON serialization removes explicit undefined values exactly as the
  // writer does.
  assertCronDefinitionSnapshotMutationAllowed(
    { version: 1, jobs: durable.rawConfigJobs } as unknown as CronStoreFile,
    {
      version: 1,
      jobs: completeProposedReplacements.map((replacement) => replacement.configJob),
    } as unknown as CronStoreFile,
  );
  assertCronDefinitionSnapshotMutationAllowed(durable.store, {
    version: 1,
    jobs: completeProposedReplacements.map((replacement) => replacement.job),
  });
  if (
    !isDeepStrictEqual(
      durable.definitionRows,
      completeProposedReplacements.map((replacement) => replacement.definitionRow),
    )
  ) {
    assertCronDefinitionMutationAllowed();
  }
}

function assertRuntimeDefinitionCas(
  db: DatabaseSync,
  storeKey: string,
  proposed: CronStoreFile,
): void {
  const durable = storedCronJobs(db, storeKey);
  const durableById = new Map(durable.store.jobs.map((job) => [job.id, job]));
  for (const job of proposed.jobs) {
    if (durable.unparseableJobIds.has(job.id)) {
      throw new CronDefinitionCasMismatchError(job.id);
    }
    const current = durableById.get(job.id);
    // State-only writes cannot create rows. A missing target is a no-op, while
    // a present target must still be the exact definition the caller observed.
    if (!current) {
      continue;
    }
    if (!cronJobDefinitionsEqual(current, projectCronJobThroughStorageCodec(job))) {
      throw new CronDefinitionCasMismatchError(job.id);
    }
  }
}

async function atomicWrite(filePath: string, content: string, dirMode = 0o700): Promise<void> {
  await replaceFileAtomic({
    filePath,
    content,
    dirMode,
    mode: 0o600,
    tempPrefix: ".openclaw-cron",
    renameMaxRetries: 3,
    copyFallbackOnPermissionError: true,
  });
}

/** Persists cron jobs, or only mutable runtime state when stateOnly is set. */
export async function saveCronJobsStore(
  storePath: string,
  store: CronStoreFile,
  opts?: SaveCronStoreOptions,
) {
  const resolvedStorePath = path.resolve(storePath);
  const storeKey = cronStoreKey(resolvedStorePath);
  if (opts?.stateOnly) {
    // Runtime writers must prove that every target row still has the definition
    // they observed. Concurrent additions are harmless, but a changed or
    // malformed target aborts the transaction instead of attaching stale state
    // to a new definition.
    runOpenClawStateWriteTransaction(({ db }) => {
      assertRuntimeDefinitionCas(db, storeKey, store);
      updateCronRuntimeRows(db, storeKey, store);
    });
    return;
  }
  assertCronStoreCanPersist(store);
  runOpenClawStateWriteTransaction(({ db }) => {
    // Full-store callers include doctor and channel writeback paths outside the
    // cron service. Recheck durable truth inside the write transaction so none
    // can bypass an active definition freeze or race a preceding writer.
    assertFullStoreDefinitionMutationAllowed(db, storeKey, store);
    replaceCronRows(db, storeKey, store);
  });
}

/** Atomically acquire doctor migration metadata and replace cron rows only for the winner. */
export async function saveCronJobsStoreWithMetadata(
  storePath: string,
  store: CronStoreFile,
  acquireMetadata: (db: DatabaseSync) => boolean,
): Promise<boolean> {
  const resolvedStorePath = path.resolve(storePath);
  const storeKey = cronStoreKey(resolvedStorePath);
  assertCronStoreCanPersist(store);
  return runOpenClawStateWriteTransaction(({ db }) => {
    // Guard before acquiring migration metadata: a rejected definition rewrite
    // must not consume the one-time migration receipt.
    assertFullStoreDefinitionMutationAllowed(db, storeKey, store);
    if (!acquireMetadata(db)) {
      return false;
    }
    replaceCronRows(db, storeKey, store);
    return true;
  });
}

// Public plugin SDK seam; core callers use the SQLite-backed cron-jobs names above.
/** Resolves the public plugin-SDK cron store path. */
export function resolveCronStorePath(storePath?: string) {
  return resolveCronJobsStorePath(storePath);
}

/** Plugin-SDK alias for loading the cron store. */
export async function loadCronStore(storePath: string): Promise<CronStoreFile> {
  return await loadCronJobsStore(storePath);
}

/** Plugin-SDK alias for saving the cron store. */
export async function saveCronStore(
  storePath: string,
  store: CronStoreFile,
  opts?: SaveCronStoreOptions,
) {
  await saveCronJobsStore(storePath, store, opts);
}

/** Loads the cron quarantine sidecar, validating its persisted v1 shape. */
export async function loadCronQuarantineFile(pathLocal: string): Promise<CronQuarantineFile> {
  try {
    const raw = await fs.promises.readFile(pathLocal, "utf-8");
    const parsed = parseJsonWithJson5Fallback(raw);
    if (!isRecord(parsed) || parsed.version !== 1 || !Array.isArray(parsed.jobs)) {
      throw new Error(`Unsupported cron quarantine file shape at ${pathLocal}`);
    }
    const jobs = parsed.jobs.map((entry, index) => {
      if (
        !isRecord(entry) ||
        typeof entry.reason !== "string" ||
        (!isRecord(entry.job) && !("raw" in entry))
      ) {
        throw new Error(`Unsupported cron quarantine entry at ${pathLocal} index ${index}`);
      }
      const sourceIndex = typeof entry.sourceIndex === "number" ? entry.sourceIndex : -1;
      const quarantinedAtMs =
        typeof entry.quarantinedAtMs === "number" && Number.isFinite(entry.quarantinedAtMs)
          ? entry.quarantinedAtMs
          : Date.now();
      const quarantined: CronQuarantineFile["jobs"][number] = {
        quarantinedAtMs,
        sourceIndex,
        reason: entry.reason,
      };
      if (isRecord(entry.job)) {
        quarantined.job = entry.job;
      }
      if ("raw" in entry) {
        quarantined.raw = entry.raw;
      }
      if (isRecord(entry.state)) {
        quarantined.state = entry.state;
      }
      if (typeof entry.updatedAtMs === "number" && Number.isFinite(entry.updatedAtMs)) {
        quarantined.updatedAtMs = entry.updatedAtMs;
      }
      if (typeof entry.scheduleIdentity === "string") {
        quarantined.scheduleIdentity = entry.scheduleIdentity;
      }
      return quarantined;
    });
    return { version: 1, jobs };
  } catch (err) {
    if ((err as { code?: unknown })?.code === "ENOENT") {
      return { version: 1, jobs: [] };
    }
    throw err;
  }
}

function quarantineEntryKey(entry: QuarantinedCronConfigJob): string {
  const rawId = entry.job
    ? (normalizeOptionalString(entry.job.id) ?? normalizeOptionalString(entry.job.jobId))
    : null;
  return JSON.stringify({
    id: rawId ?? null,
    sourceIndex: entry.sourceIndex,
    reason: entry.reason,
    job: entry.job ?? null,
    raw: entry.raw ?? null,
    state: entry.state ?? null,
    updatedAtMs: entry.updatedAtMs ?? null,
    scheduleIdentity: entry.scheduleIdentity ?? null,
  });
}

/** Appends new invalid cron config rows to the quarantine sidecar without duplicating entries. */
export async function saveCronQuarantineFile(params: {
  storePath: string;
  entries: QuarantinedCronConfigJob[];
  nowMs: number;
}) {
  if (params.entries.length === 0) {
    return null;
  }
  const quarantinePath = resolveCronQuarantinePath(params.storePath);
  const existing = await loadCronQuarantineFile(quarantinePath);
  const seen = new Set(existing.jobs.map(quarantineEntryKey));
  const nextJobs = existing.jobs.slice();
  let appended = false;
  for (const entry of params.entries.toSorted((a, b) => a.sourceIndex - b.sourceIndex)) {
    const key = quarantineEntryKey(entry);
    if (seen.has(key)) {
      continue;
    }
    // Deduplicate by the original invalid row shape so repeated loads do not
    // keep appending the same quarantined config job.
    seen.add(key);
    appended = true;
    nextJobs.push({
      quarantinedAtMs: params.nowMs,
      sourceIndex: entry.sourceIndex,
      reason: entry.reason,
      ...(entry.job ? { job: structuredClone(entry.job) } : {}),
      ...("raw" in entry ? { raw: structuredClone(entry.raw) } : {}),
      ...(entry.state ? { state: structuredClone(entry.state) } : {}),
      ...(entry.updatedAtMs !== undefined ? { updatedAtMs: entry.updatedAtMs } : {}),
      ...(entry.scheduleIdentity !== undefined ? { scheduleIdentity: entry.scheduleIdentity } : {}),
    });
  }
  if (!appended) {
    return quarantinePath;
  }
  const payload = JSON.stringify({ version: 1, jobs: nextJobs }, null, 2);
  await atomicWrite(quarantinePath, payload);
  return quarantinePath;
}
