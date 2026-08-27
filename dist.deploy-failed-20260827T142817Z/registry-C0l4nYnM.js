import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { Mt as tableExists, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { t as isLockOwnerDefinitelyStale } from "./stale-lock-file-CEuvanrm.js";
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function kyselyProvisionedFor(db) {
	return getNodeSqliteKysely(db);
}
function kyselyLeaseFor(db) {
	return getNodeSqliteKysely(db);
}
function parseRunEndCleanup(raw) {
	if (raw == null) return;
	try {
		const parsed = JSON.parse(raw);
		if (!isRecord(parsed) || !Number.isInteger(parsed.at) || parsed.at < 0) return;
		const at = parsed.at;
		switch (parsed.outcome) {
			case "failed": return typeof parsed.reason === "string" && parsed.reason.length > 0 && parsed.reason.length <= 500 ? {
				outcome: parsed.outcome,
				at,
				reason: parsed.reason
			} : void 0;
			case "removed-lossless":
			case "retained-busy":
			case "retained-dirty":
			case "retained-unpushed":
			case "retained-provisioned-drift": return parsed.reason === void 0 ? {
				outcome: parsed.outcome,
				at
			} : void 0;
			default: return;
		}
	} catch {
		return;
	}
}
function rowToRecord(row) {
	const runEndCleanup = parseRunEndCleanup(row.run_end_cleanup_json);
	return {
		id: row.id,
		name: row.path.split(/[\\/]/).at(-1) ?? row.id,
		repoFingerprint: row.repo_fingerprint,
		repoRoot: row.repo_root,
		path: row.path,
		branch: row.branch,
		baseRef: row.base_ref,
		ownerKind: row.owner_kind,
		...row.owner_id ? { ownerId: row.owner_id } : {},
		...row.snapshot_ref ? { snapshotRef: row.snapshot_ref } : {},
		createdAt: row.created_at,
		lastActiveAt: row.last_active_at,
		...row.removed_at == null ? {} : { removedAt: row.removed_at },
		...runEndCleanup ? { runEndCleanup } : {}
	};
}
function recordToRow(record, provisionedPaths) {
	return {
		id: record.id,
		repo_fingerprint: record.repoFingerprint,
		repo_root: record.repoRoot,
		path: record.path,
		branch: record.branch,
		base_ref: record.baseRef,
		owner_kind: record.ownerKind,
		owner_id: record.ownerId ?? null,
		snapshot_ref: record.snapshotRef ?? null,
		created_at: record.createdAt,
		last_active_at: record.lastActiveAt,
		removed_at: record.removedAt ?? null,
		provisioned_paths_json: provisionedPaths === void 0 ? null : JSON.stringify(provisionedPaths),
		run_end_cleanup_json: record.runEndCleanup === void 0 ? null : JSON.stringify(record.runEndCleanup)
	};
}
function parseProvisionedData(raw) {
	if (raw === null) return;
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return;
		return parsed.every((entry) => typeof entry === "string" || typeof entry === "object" && entry !== null && typeof entry.path === "string" && (entry.mode === null || Number.isInteger(entry.mode) && entry.mode >= 0 && entry.mode <= 4095) && Number.isInteger(entry.chunks) && entry.chunks >= 0) ? parsed : void 0;
	} catch {
		return;
	}
}
function listRegistryWorktrees(env) {
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("created_at", "desc").orderBy("id", "asc")).rows.map(rowToRecord);
}
function listRegistryWorktreesForMigration(env) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "worktrees")) return [];
		return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("created_at", "desc").orderBy("id", "asc")).rows.map(rowToRecord);
	}, { env }) ?? [];
}
function getRegistryWorktree(env, id) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("id", "=", id)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function getRegistryWorktreeProvisionedPaths(env, id) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").select("provisioned_paths_json").where("id", "=", id)).rows[0];
	return parseProvisionedData(row?.provisioned_paths_json ?? null)?.map((entry) => typeof entry === "string" ? entry : entry.path);
}
function hasLegacyRegistryWorktrees(env) {
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").select("id").where("provisioned_paths_json", "is", null).limit(1)).rows.length > 0;
}
function discardLegacyRegistryWorktrees(env) {
	const db = dbFor(env);
	return runOpenClawStateWriteTransaction(() => Number(executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("provisioned_paths_json", "is", null)).numAffectedRows ?? 0n), { env });
}
function rewriteRegistryWorktreePathsForMigration(env, rewrites) {
	if (rewrites.length === 0) return 0;
	const db = dbFor(env);
	return runOpenClawStateWriteTransaction(() => rewrites.reduce((count, rewrite) => count + Number(executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktrees").set({ path: rewrite.toPath }).where("id", "=", rewrite.id).where("path", "=", rewrite.fromPath)).numAffectedRows ?? 0n), 0), { env });
}
function getRegistryWorktreeProvisionedState(env, id) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").select("provisioned_paths_json").where("id", "=", id)).rows[0];
	const data = row ? parseProvisionedData(row.provisioned_paths_json) : void 0;
	return data?.every((entry) => typeof entry !== "string") ? data : void 0;
}
function clearRegistryWorktreeProvisionedChunks(env, worktreeId) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", worktreeId));
	});
}
function insertRegistryWorktreeProvisionedChunk(env, params) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).insertInto("worktree_provisioned_file_chunks").values({
			worktree_id: params.worktreeId,
			path: params.path,
			chunk_index: params.chunkIndex,
			data: params.data
		}));
	});
}
function getRegistryWorktreeProvisionedChunk(env, params) {
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyProvisionedFor(db).selectFrom("worktree_provisioned_file_chunks").select("data").where("worktree_id", "=", params.worktreeId).where("path", "=", params.path).where("chunk_index", "=", params.chunkIndex)).rows[0]?.data;
}
function findLiveRegistryWorktreeByPath(env, worktreePath) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("path", "=", worktreePath).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByOwner(env, ownerKind, ownerId) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("owner_kind", "=", ownerKind).where("owner_id", "=", ownerId).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findRegistryWorktreeByPath(env, worktreePath) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("path", "=", worktreePath).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function insertRegistryWorktree(env, record, options = {}) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktrees").values(recordToRow(record, options.provisionedPaths)));
	});
}
function updateRegistryWorktree(env, id, patch, options = {}) {
	const db = dbFor(env);
	const values = {};
	if (patch.lastActiveAt !== void 0) values.last_active_at = patch.lastActiveAt;
	if ("removedAt" in patch) values.removed_at = patch.removedAt ?? null;
	if ("snapshotRef" in patch) values.snapshot_ref = patch.snapshotRef ?? null;
	if ("runEndCleanup" in patch) values.run_end_cleanup_json = patch.runEndCleanup === void 0 ? null : JSON.stringify(patch.runEndCleanup);
	if (patch.provisionedState !== void 0) values.provisioned_paths_json = JSON.stringify(patch.provisionedState);
	else if (patch.provisionedPaths !== void 0) values.provisioned_paths_json = JSON.stringify(patch.provisionedPaths);
	runOpenClawStateWriteTransaction(() => {
		let update = kyselyFor(db).updateTable("worktrees").set(values).where("id", "=", id);
		if (options.onlyIfLive) update = update.where("removed_at", "is", null);
		if (options.onlyIfActiveAt !== void 0) update = update.where("last_active_at", "=", options.onlyIfActiveAt);
		executeSqliteQuerySync(db, update);
	});
}
function deleteRegistryWorktree(env, id) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyProvisionedFor(db).deleteFrom("worktree_provisioned_file_chunks").where("worktree_id", "=", id));
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("id", "=", id));
	});
}
const WORKTREE_RUN_LEASE_SCOPE_PREFIX = "worktree-run:";
const WORKTREE_REMOVING_LEASE_KEY = "__removing__";
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalContentionError";
	}
};
function worktreeRunLeaseScope(worktreeId) {
	return `${WORKTREE_RUN_LEASE_SCOPE_PREFIX}${worktreeId}`;
}
function parseLeaseOwnerPayload(payloadJson) {
	if (!payloadJson) return {};
	try {
		const parsed = JSON.parse(payloadJson);
		return {
			pid: typeof parsed.pid === "number" ? parsed.pid : void 0,
			starttime: typeof parsed.starttime === "number" ? parsed.starttime : void 0
		};
	} catch {
		return {};
	}
}
function collectLiveRunLeases(db, k, scope, checks) {
	const rows = executeSqliteQuerySync(db, k.selectFrom("state_leases").select([
		"lease_key",
		"owner",
		"payload_json"
	]).where("scope", "=", scope)).rows;
	const livePids = [];
	const staleKeys = [];
	let removingToken;
	for (const row of rows) {
		const payload = parseLeaseOwnerPayload(row.payload_json);
		const stale = isLockOwnerDefinitelyStale({
			payload,
			isPidDefinitelyDead: checks.isPidDefinitelyDead,
			getProcessStartTime: checks.getProcessStartTime
		});
		if (row.lease_key === WORKTREE_REMOVING_LEASE_KEY) {
			if (stale) staleKeys.push(row.lease_key);
			else removingToken = row.owner;
			continue;
		}
		if (stale) {
			staleKeys.push(row.lease_key);
			continue;
		}
		if (payload.pid !== void 0) livePids.push(payload.pid);
	}
	if (staleKeys.length > 0) executeSqliteQuerySync(db, k.deleteFrom("state_leases").where("scope", "=", scope).where("lease_key", "in", staleKeys));
	return {
		livePids,
		...removingToken !== void 0 ? { removingToken } : {}
	};
}
function admitWorktreeRunLeaseRow(env, params) {
	runOpenClawStateWriteTransaction((database) => {
		const db = database.db;
		const k = kyselyLeaseFor(db);
		const scope = worktreeRunLeaseScope(params.worktreeId);
		const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select(["path", "removed_at"]).where("id", "=", params.worktreeId)).rows[0];
		const worktreePath = record?.path ?? params.worktreeId;
		if (!record || record.removed_at != null) throw new Error(`managed worktree was removed: ${worktreePath}`);
		const { removingToken } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
		if (removingToken !== void 0) throw new Error(`managed worktree was removed: ${worktreePath}`);
		executeSqliteQuerySync(db, k.insertInto("state_leases").values({
			scope,
			lease_key: params.token,
			owner: `${params.pid}:${params.startTime ?? ""}`,
			expires_at: null,
			heartbeat_at: null,
			payload_json: JSON.stringify({
				pid: params.pid,
				starttime: params.startTime ?? void 0
			}),
			created_at: params.now,
			updated_at: params.now
		}));
	}, { env });
}
function claimWorktreeRemovalRow(env, params) {
	runOpenClawStateWriteTransaction((database) => {
		const db = database.db;
		const k = kyselyLeaseFor(db);
		const scope = worktreeRunLeaseScope(params.worktreeId);
		const record = executeSqliteQuerySync(db, k.selectFrom("worktrees").select([
			"id",
			"path",
			"removed_at"
		]).where("id", "=", params.worktreeId)).rows[0];
		if (!record || record.removed_at != null) throw new WorktreeRemovalContentionError("finalized", `managed worktree was removed: ${record?.path ?? params.worktreeId}`);
		const { livePids, removingToken } = collectLiveRunLeases(db, k, scope, params.checks ?? {});
		if (!params.force && livePids.length > 0) throw new WorktreeRemovalContentionError("busy", `worktree is busy: locked by live pid ${livePids[0]}`);
		if (removingToken !== void 0 && removingToken !== params.token) throw new WorktreeRemovalContentionError("busy", "worktree removal is already in progress");
		const payloadJson = JSON.stringify({
			pid: params.pid,
			starttime: params.startTime ?? void 0
		});
		executeSqliteQuerySync(db, k.insertInto("state_leases").values({
			scope,
			lease_key: WORKTREE_REMOVING_LEASE_KEY,
			owner: params.token,
			expires_at: null,
			heartbeat_at: null,
			payload_json: payloadJson,
			created_at: params.now,
			updated_at: params.now
		}).onConflict((conflict) => conflict.columns(["scope", "lease_key"]).doUpdateSet({
			owner: params.token,
			payload_json: payloadJson,
			updated_at: params.now
		})));
	}, { env });
}
function releaseWorktreeRunLeaseRow(env, worktreeId, token) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", token));
	}, { env });
}
function finalizeWorktreeRemovalRows(env, worktreeId) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)));
	}, { env });
}
function abortWorktreeRemovalRow(env, worktreeId, token) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyLeaseFor(db).deleteFrom("state_leases").where("scope", "=", worktreeRunLeaseScope(worktreeId)).where("lease_key", "=", WORKTREE_REMOVING_LEASE_KEY).where("owner", "=", token));
	}, { env });
}
function hasLiveWorktreeRunLeaseRow(env, worktreeId, checks) {
	return runOpenClawStateWriteTransaction((database) => {
		const db = database.db;
		const { livePids } = collectLiveRunLeases(db, kyselyLeaseFor(db), worktreeRunLeaseScope(worktreeId), checks ?? {});
		return livePids.length > 0;
	}, { env });
}
//#endregion
export { rewriteRegistryWorktreePathsForMigration as C, releaseWorktreeRunLeaseRow as S, hasLiveWorktreeRunLeaseRow as _, clearRegistryWorktreeProvisionedChunks as a, listRegistryWorktrees as b, finalizeWorktreeRemovalRows as c, findRegistryWorktreeByPath as d, getRegistryWorktree as f, hasLegacyRegistryWorktrees as g, getRegistryWorktreeProvisionedState as h, claimWorktreeRemovalRow as i, findLiveRegistryWorktreeByOwner as l, getRegistryWorktreeProvisionedPaths as m, abortWorktreeRemovalRow as n, deleteRegistryWorktree as o, getRegistryWorktreeProvisionedChunk as p, admitWorktreeRunLeaseRow as r, discardLegacyRegistryWorktrees as s, WorktreeRemovalContentionError as t, findLiveRegistryWorktreeByPath as u, insertRegistryWorktree as v, updateRegistryWorktree as w, listRegistryWorktreesForMigration as x, insertRegistryWorktreeProvisionedChunk as y };
