import "./src-BkwWvwB2.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { t as pruneMapToMaxSize } from "./map-size-DAGm21RM.js";
import { t as expandHomePrefix } from "./home-dir-DcrXWQPU.js";
import { d as resolveConfigDir } from "./utils-DEqefz4f.js";
import { t as openNodeSqliteDatabase } from "./node-sqlite-sCL6pEgr.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DmtKty-F.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jt as tableExists$1 } from "./openclaw-state-db-DlCMR4eQ.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BixM8L1u.js";
import { n as readConfigMachineState } from "./config-machine-state-DtXnQEX3.js";
import { t as createSqliteAuditRecordStore } from "./sqlite-audit-record-store-CrkC3cur.js";
import { J as cronStoreKey, L as normalizeCronScheduledToolPolicy, V as normalizeCronRuntimeAuthority, a as loadedCronStoreFromRows, c as replaceCronRows, i as loadCronRows, l as updateCronRuntimeRows, r as deleteStaleCronJobFamilyRows, t as assertCronStoreCanPersist } from "./row-codec-BXU8Ei5n.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/cron/store/config-state.ts
function readCronStoreStatePath(env = process.env) {
	const value = readConfigMachineState("cron.store", { env });
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
//#endregion
//#region src/cron/store/quarantine.ts
/** Durable malformed-cron recovery records stored in the shared SQLite database. */
function cronQuarantineScope(storePath) {
	return `cron.quarantine:${cronStoreKey(storePath)}`;
}
function cronQuarantineEntryKey(entry) {
	const identity = JSON.stringify({
		sourceIndex: entry.sourceIndex,
		reason: entry.reason,
		job: entry.job ?? null,
		raw: entry.raw ?? null,
		state: entry.state ?? null,
		updatedAtMs: entry.updatedAtMs ?? null,
		scheduleIdentity: entry.scheduleIdentity ?? null
	});
	return createHash("sha256").update(identity).digest("hex");
}
/** Reads quarantined cron rows without creating or migrating a state database. */
function loadCronQuarantinedJobs(storePath, env = process.env) {
	const scope = cronQuarantineScope(storePath);
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("diagnostic_events").select("payload_json").where("scope", "=", scope).orderBy("sequence", "asc")).rows.map((row) => JSON.parse(row.payload_json)), { env }) ?? [];
}
/** Writes recovery records into the caller-owned SQLite transaction when provided. */
function saveCronQuarantinedJobs(params) {
	if (params.entries.length === 0) return;
	const store = createSqliteAuditRecordStore({
		scope: cronQuarantineScope(params.storePath),
		maxEntries: Number.MAX_SAFE_INTEGER,
		...params.database ? { database: params.database } : {}
	});
	const records = params.entries.map((entry) => {
		const quarantinedAtMs = "quarantinedAtMs" in entry ? entry.quarantinedAtMs : params.nowMs;
		return {
			key: cronQuarantineEntryKey(entry),
			value: {
				...entry,
				quarantinedAtMs
			},
			createdAt: quarantinedAtMs
		};
	});
	store.registerLegacyMany(records);
}
//#endregion
//#region src/cron/tools-allow.ts
/** Returns whether a cron job can construct or execute OpenClaw agent tools. */
function cronJobUsesToolRuntime(job) {
	return job.payload.kind === "agentTurn" || job.payload.kind === "script" || Boolean(job.trigger?.script.trim());
}
/** Stamps an explicit unrestricted cap without changing jobs that already carry one. */
function applyDefaultCronToolsAllow(job) {
	if (cronJobUsesToolRuntime(job) && job.payload.toolsAllow === void 0) job.payload.toolsAllow = ["*"];
}
//#endregion
//#region src/cron/store/runtime-authority-store.ts
/** Downgrade-stable persistence for runtime-private cron authority. */
const CRON_RUNTIME_AUTHORITY_TABLE = "cron_job_runtime_authorities";
const CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION = 1;
const CRON_RUNTIME_AUTHORITY_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS cron_job_runtime_authorities (
  store_key TEXT NOT NULL,
  job_id TEXT NOT NULL,
  authority_json TEXT,
  authority_input_fingerprint TEXT,
  recovery_required INTEGER NOT NULL,
  PRIMARY KEY (store_key, job_id),
  FOREIGN KEY (store_key, job_id)
    REFERENCES cron_jobs(store_key, job_id) ON DELETE CASCADE,
  CHECK (recovery_required IN (0, 1)),
  CHECK (
    (recovery_required = 0 AND authority_json IS NOT NULL AND authority_input_fingerprint IS NOT NULL)
    OR
    (recovery_required = 1 AND authority_json IS NULL AND authority_input_fingerprint IS NULL)
  )
) STRICT;
`;
function getCronAuthorityKysely(db) {
	return getNodeSqliteKysely(db);
}
function normalizedToolsAllow(job) {
	const toolsAllow = job.payload.toolsAllow;
	return toolsAllow === void 0 ? null : [...toolsAllow].toSorted();
}
function normalizedToolsAllowProvenance(value) {
	return value?.version === 1 && value.source === "final-executable-surface" ? {
		version: 1,
		source: "final-executable-surface"
	} : null;
}
/** Binds authority to only the canonical inputs that can change its authorization meaning. */
function cronRuntimeAuthorityInputFingerprint(job) {
	const scheduledToolPolicy = normalizeCronScheduledToolPolicy(job.scheduledToolPolicy) ?? null;
	const canonical = {
		version: CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION,
		usesToolRuntime: cronJobUsesToolRuntime(job),
		toolsAllow: normalizedToolsAllow(job),
		toolsAllowIsDefault: job.payload.toolsAllowIsDefault === true,
		scheduledToolPolicy,
		toolsAllowProvenance: normalizedToolsAllowProvenance(job.toolsAllowProvenance)
	};
	return `v${CRON_RUNTIME_AUTHORITY_FINGERPRINT_VERSION}:${createHash("sha256").update(JSON.stringify(canonical), "utf8").digest("hex")}`;
}
/** Creates the additive table only when authority state is first persisted. */
function ensureCronRuntimeAuthorityTable(db) {
	db.exec(CRON_RUNTIME_AUTHORITY_SCHEMA_SQL);
}
function loadCronRuntimeAuthorityRows(db, storeKey) {
	if (!tableExists$1(db, CRON_RUNTIME_AUTHORITY_TABLE)) return [];
	return executeSqliteQuerySync(db, getCronAuthorityKysely(db).selectFrom("cron_job_runtime_authorities").selectAll().where("store_key", "=", storeKey)).rows;
}
function applyCronRuntimeAuthorityRow(job, row) {
	delete job.runtimeAuthority;
	delete job.runtimeAuthorityRecoveryRequired;
	if (row.recovery_required === 1) {
		job.runtimeAuthorityRecoveryRequired = true;
		return "ok";
	}
	const authority = normalizeCronRuntimeAuthority(safeParseJson(row.authority_json ?? ""));
	if (!authority || row.authority_input_fingerprint !== cronRuntimeAuthorityInputFingerprint(job)) {
		job.runtimeAuthorityRecoveryRequired = true;
		return "repair";
	}
	job.runtimeAuthority = authority;
	return "ok";
}
/** Applies stored authority only when its authorization inputs still match exactly. */
function loadCronRuntimeAuthorities(params) {
	const jobsById = new Map(params.jobs.map((job) => [job.id, job]));
	const repairJobIds = [];
	for (const row of loadCronRuntimeAuthorityRows(params.db, params.storeKey)) {
		const job = jobsById.get(row.job_id);
		if (!job) continue;
		if (applyCronRuntimeAuthorityRow(job, row) === "repair") repairJobIds.push(job.id);
	}
	return { repairJobIds };
}
function writeRecoveryRow(db, storeKey, jobId) {
	executeSqliteQuerySync(db, getCronAuthorityKysely(db).insertInto("cron_job_runtime_authorities").values({
		store_key: storeKey,
		job_id: jobId,
		authority_json: null,
		authority_input_fingerprint: null,
		recovery_required: 1
	}).onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet({
		authority_json: null,
		authority_input_fingerprint: null,
		recovery_required: 1
	})));
}
/** Revalidates downgrade-detected drift before retiring stale authority durably. */
function repairCronRuntimeAuthorityRows(params) {
	if (!tableExists$1(params.db, CRON_RUNTIME_AUTHORITY_TABLE)) return false;
	const requested = new Set(params.jobIds);
	const jobsById = new Map(params.jobs.map((job) => [job.id, job]));
	let repaired = false;
	for (const row of loadCronRuntimeAuthorityRows(params.db, params.storeKey)) {
		if (!requested.has(row.job_id)) continue;
		const job = jobsById.get(row.job_id);
		if (!job) continue;
		if (applyCronRuntimeAuthorityRow(job, row) === "repair") {
			writeRecoveryRow(params.db, params.storeKey, job.id);
			repaired = true;
		}
	}
	return repaired;
}
/** Reconciles child rows inside the same transaction as their owning cron rows. */
function replaceCronRuntimeAuthorityRows(params) {
	if (!params.jobs.some((job) => job.runtimeAuthority || job.runtimeAuthorityRecoveryRequired === true) && !tableExists$1(params.db, CRON_RUNTIME_AUTHORITY_TABLE)) return;
	ensureCronRuntimeAuthorityTable(params.db);
	const database = getCronAuthorityKysely(params.db);
	for (const job of params.jobs) {
		if (job.runtimeAuthorityRecoveryRequired === true) {
			writeRecoveryRow(params.db, params.storeKey, job.id);
			continue;
		}
		const authority = normalizeCronRuntimeAuthority(job.runtimeAuthority);
		if (authority) {
			const authorityJson = JSON.stringify(authority);
			const authorityInputFingerprint = cronRuntimeAuthorityInputFingerprint(job);
			executeSqliteQuerySync(params.db, database.insertInto("cron_job_runtime_authorities").values({
				store_key: params.storeKey,
				job_id: job.id,
				authority_json: authorityJson,
				authority_input_fingerprint: authorityInputFingerprint,
				recovery_required: 0
			}).onConflict((conflict) => conflict.columns(["store_key", "job_id"]).doUpdateSet({
				authority_json: authorityJson,
				authority_input_fingerprint: authorityInputFingerprint,
				recovery_required: 0
			})));
			continue;
		}
		executeSqliteQuerySync(params.db, database.deleteFrom("cron_job_runtime_authorities").where("store_key", "=", params.storeKey).where("job_id", "=", job.id));
	}
}
//#endregion
//#region src/cron/store.ts
/** Public cron store load/save API backed entirely by shared SQLite state. */
const MAX_TRACKED_CRON_STORE_REVISIONS = 64;
const cronStoreRevisions = /* @__PURE__ */ new Map();
let nextCronStoreRevision = 0;
/** Reads the process-local committed revision for one canonical SQLite partition. */
function getCronJobsStoreRevision(storePath) {
	return cronStoreRevisions.get(cronStoreKey(storePath)) ?? 0;
}
function noteCronJobsStoreCommit(storeKey) {
	cronStoreRevisions.delete(storeKey);
	cronStoreRevisions.set(storeKey, ++nextCronStoreRevision);
	pruneMapToMaxSize(cronStoreRevisions, MAX_TRACKED_CRON_STORE_REVISIONS);
}
function resolveDefaultCronDir(env) {
	return path.join(resolveConfigDir(env), "cron");
}
function resolveDefaultCronStorePath(env) {
	return path.join(resolveDefaultCronDir(env), "jobs.json");
}
/** Resolves the cron jobs store path, expanding home-relative user input. */
function resolveCronJobsStorePath(storePath, env = process.env) {
	const selected = storePath?.trim() || readCronStoreStatePath(env);
	if (selected) {
		const raw = selected.trim();
		if (raw.startsWith("~")) return path.resolve(expandHomePrefix(raw, { env }));
		return path.resolve(raw);
	}
	return resolveDefaultCronStorePath(env);
}
/** Resolves the active cron partition from runtime config and environment. */
function resolveCronJobsStorePathFromConfig(cfg, env = process.env) {
	const store = cfg.cron?.store;
	return resolveCronJobsStorePath(typeof store === "string" ? store : void 0, env);
}
/** Loads cron jobs plus config/runtime sidecars from the SQLite-backed store. */
async function loadCronJobsStoreWithConfigJobs(storePath) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	const database = openOpenClawStateDatabase().db;
	const rows = loadCronRows(database, storeKey);
	if (rows.length > 0) {
		const loaded = loadedCronStoreFromRows(rows);
		repairLoadedCronRuntimeAuthority({
			storeKey,
			jobIds: loadCronRuntimeAuthorities({
				db: database,
				storeKey,
				jobs: loaded.store.jobs
			}).repairJobIds
		});
		return loaded;
	}
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
function repairLoadedCronRuntimeAuthority(params) {
	if (params.jobIds.length === 0) return;
	if (runOpenClawStateWriteTransaction(({ db }) => {
		const rows = loadCronRows(db, params.storeKey);
		if (rows.length === 0) return false;
		const loaded = loadedCronStoreFromRows(rows);
		return repairCronRuntimeAuthorityRows({
			db,
			storeKey: params.storeKey,
			jobs: loaded.store.jobs,
			jobIds: params.jobIds
		});
	}, {}, { operationLabel: "cron.runtime-authority-repair" })) noteCronJobsStoreCommit(params.storeKey);
}
/** Removes an owned declarative job family left under obsolete absolute store keys. */
function removeStaleCronJobFamilyRows(storePath, family) {
	const activeStoreKey = cronStoreKey(path.resolve(storePath));
	return runOpenClawStateWriteTransaction(({ db }) => deleteStaleCronJobFamilyRows(db, activeStoreKey, family), {}, { operationLabel: "cron.job-family-adoption" });
}
function emptyLoadedCronStore() {
	return {
		store: {
			version: 1,
			jobs: []
		},
		configJobs: [],
		configJobIndexes: [],
		configJobRuntimeEntries: [],
		invalidConfigRows: []
	};
}
function tableExists(db, tableName) {
	return db.prepare("SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?").get(tableName) !== void 0;
}
/** Loads cron jobs from an existing SQLite store without creating or migrating state. */
async function loadCronJobsStoreWithConfigJobsReadOnly(storePath, env = process.env) {
	const statePath = resolveOpenClawStateSqlitePath(env);
	if (!fs.existsSync(statePath)) return emptyLoadedCronStore();
	const storeKey = cronStoreKey(path.resolve(storePath));
	const db = openNodeSqliteDatabase(statePath, { readOnly: true });
	try {
		if (!tableExists(db, "cron_jobs")) return emptyLoadedCronStore();
		const rows = loadCronRows(db, storeKey);
		if (rows.length > 0) {
			const loaded = loadedCronStoreFromRows(rows);
			loadCronRuntimeAuthorities({
				db,
				storeKey,
				jobs: loaded.store.jobs
			});
			return loaded;
		}
		return emptyLoadedCronStore();
	} finally {
		db.close();
	}
}
/** Loads only the persisted cron job store payload. */
async function loadCronJobsStore(storePath) {
	return (await loadCronJobsStoreWithConfigJobs(storePath)).store;
}
/** Synchronously loads only the persisted cron job store payload. */
function loadCronJobsStoreSync(storePath) {
	const storeKey = cronStoreKey(path.resolve(storePath));
	const database = openOpenClawStateDatabase().db;
	const rows = loadCronRows(database, storeKey);
	if (rows.length > 0) {
		const loaded = loadedCronStoreFromRows(rows);
		repairLoadedCronRuntimeAuthority({
			storeKey,
			jobIds: loadCronRuntimeAuthorities({
				db: database,
				storeKey,
				jobs: loaded.store.jobs
			}).repairJobIds
		});
		return loaded.store;
	}
	return {
		version: 1,
		jobs: []
	};
}
async function saveCronJobsStore(storePath, store, opts) {
	const resolvedStorePath = path.resolve(storePath);
	const storeKey = cronStoreKey(resolvedStorePath);
	const stateOnly = opts?.stateOnly === true && !opts.quarantine?.entries.length;
	if (!stateOnly) assertCronStoreCanPersist(store);
	runOpenClawStateWriteTransaction((database) => {
		opts?.transactionHooks?.beforeWrite?.(database.db);
		if (opts?.quarantine?.entries.length) saveCronQuarantinedJobs({
			storePath: resolvedStorePath,
			entries: opts.quarantine.entries,
			nowMs: opts.quarantine.nowMs,
			database
		});
		if (stateOnly) {
			updateCronRuntimeRows(database.db, storeKey, store);
			opts?.transactionHooks?.afterWrite?.(database.db);
			return;
		}
		const normalizedJobs = replaceCronRows(database.db, storeKey, store);
		replaceCronRuntimeAuthorityRows({
			db: database.db,
			storeKey,
			jobs: normalizedJobs
		});
		opts?.transactionHooks?.afterWrite?.(database.db);
	});
	opts?.transactionHooks?.afterCommit?.();
	noteCronJobsStoreCommit(storeKey);
}
/** Atomically acquire doctor migration metadata and replace cron rows only for the winner. */
async function saveCronJobsStoreWithMetadata(storePath, store, acquireMetadata, quarantine) {
	const resolvedStorePath = path.resolve(storePath);
	const storeKey = cronStoreKey(resolvedStorePath);
	assertCronStoreCanPersist(store);
	const committed = runOpenClawStateWriteTransaction((database) => {
		if (!acquireMetadata(database.db)) return false;
		if (quarantine?.entries.length) saveCronQuarantinedJobs({
			storePath: resolvedStorePath,
			entries: quarantine.entries,
			nowMs: quarantine.nowMs,
			database
		});
		const normalizedJobs = replaceCronRows(database.db, storeKey, store);
		replaceCronRuntimeAuthorityRows({
			db: database.db,
			storeKey,
			jobs: normalizedJobs
		});
		return true;
	});
	if (committed) noteCronJobsStoreCommit(storeKey);
	return committed;
}
/** Resolves the public plugin-SDK cron store path. */
function resolveCronStorePath(storePath) {
	return resolveCronJobsStorePath(storePath);
}
/** Plugin-SDK alias for loading the cron store. */
async function loadCronStore(storePath) {
	return await loadCronJobsStore(storePath);
}
/** Plugin-SDK alias for saving the cron store. */
async function saveCronStore(storePath, store, opts) {
	await saveCronJobsStore(storePath, store, opts);
}
//#endregion
export { loadCronQuarantinedJobs as _, loadCronJobsStoreWithConfigJobsReadOnly as a, removeStaleCronJobFamilyRows as c, resolveCronStorePath as d, saveCronJobsStore as f, cronJobUsesToolRuntime as g, applyDefaultCronToolsAllow as h, loadCronJobsStoreWithConfigJobs as i, resolveCronJobsStorePath as l, saveCronStore as m, loadCronJobsStore as n, loadCronStore as o, saveCronJobsStoreWithMetadata as p, loadCronJobsStoreSync as r, noteCronJobsStoreCommit as s, getCronJobsStoreRevision as t, resolveCronJobsStorePathFromConfig as u, saveCronQuarantinedJobs as v };
