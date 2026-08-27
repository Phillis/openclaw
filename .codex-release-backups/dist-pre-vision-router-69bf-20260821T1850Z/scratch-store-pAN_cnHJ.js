import { h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { J as cronStoreKey, d as getCronStoreKysely } from "./row-codec-RY4IJt5w.js";
import { n as assertCronJobScratchContent } from "./scratch-contract-DyG_7g0F.js";
import { createHash } from "node:crypto";
//#region src/cron/scratch-store.ts
/** Database-backed per-job scratch storage, kept outside public cron job state. */
function rowToState(row) {
	if (row.content === null) return { currentRevision: row.revision };
	return {
		currentRevision: row.revision,
		scratch: {
			content: row.content,
			revision: row.revision,
			...row.source_sha256 ? { sourceSha256: row.source_sha256 } : {},
			updatedAtMs: row.updated_at_ms
		}
	};
}
function readScratchStateFromDatabase(db, storeKey, jobId) {
	const row = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_job_scratch").select([
		"content",
		"revision",
		"source_sha256",
		"updated_at_ms"
	]).where("store_key", "=", storeKey).where("job_id", "=", jobId)).rows[0];
	return row ? rowToState(row) : { currentRevision: 0 };
}
/** Reads one job's scratch state without exposing it through cron list/history surfaces. */
function readCronJobScratchState(storePath, jobId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	return readScratchStateFromDatabase(db, cronStoreKey(storePath), jobId);
}
/** Resolves the current heartbeat monitor and its scratch with one narrow SQLite query. */
function readHeartbeatMonitorScratch(storePath, agentId, options = {}) {
	const { db } = openOpenClawStateDatabase(options);
	const storeKey = cronStoreKey(storePath);
	const row = executeSqliteQuerySync(db, getCronStoreKysely(db).selectFrom("cron_jobs").leftJoin("cron_job_scratch", (join) => join.onRef("cron_job_scratch.store_key", "=", "cron_jobs.store_key").onRef("cron_job_scratch.job_id", "=", "cron_jobs.job_id")).select([
		"cron_jobs.job_id as job_id",
		"cron_job_scratch.content as content",
		"cron_job_scratch.revision as revision",
		"cron_job_scratch.source_sha256 as source_sha256",
		"cron_job_scratch.updated_at_ms as updated_at_ms"
	]).where("cron_jobs.store_key", "=", storeKey).where("cron_jobs.declaration_key", "=", `heartbeat:${agentId}`).where("cron_jobs.payload_kind", "=", "heartbeat")).rows[0];
	if (!row) return;
	if (row.revision === null || row.updated_at_ms === null) return {
		jobId: row.job_id,
		state: { currentRevision: 0 }
	};
	return {
		jobId: row.job_id,
		state: rowToState({
			content: row.content,
			revision: row.revision,
			source_sha256: row.source_sha256,
			updated_at_ms: row.updated_at_ms
		})
	};
}
/** Writes, clears, or compare-and-swaps one scratch row. */
function writeCronJobScratch(params) {
	if (params.content !== null) assertCronJobScratchContent(params.content);
	const storeKey = cronStoreKey(params.storePath);
	const nowMs = params.nowMs ?? Date.now();
	return runOpenClawStateWriteTransaction(({ db }) => {
		const cronDb = getCronStoreKysely(db);
		const { currentRevision } = readScratchStateFromDatabase(db, storeKey, params.jobId);
		if (!executeSqliteQuerySync(db, cronDb.selectFrom("cron_jobs").select("job_id").where("store_key", "=", storeKey).where("job_id", "=", params.jobId)).rows[0] || params.expectedRevision !== void 0 && params.expectedRevision !== currentRevision) return {
			ok: false,
			reason: "revision-conflict",
			currentRevision
		};
		if (params.content === null && currentRevision === 0) return {
			ok: true,
			currentRevision
		};
		const revision = currentRevision + 1;
		const sourceSha256 = params.content !== null ? params.sourceSha256?.trim() : void 0;
		if (currentRevision > 0) executeSqliteQuerySync(db, cronDb.deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", params.jobId));
		executeSqliteQuerySync(db, cronDb.insertInto("cron_job_scratch").values({
			store_key: storeKey,
			job_id: params.jobId,
			content: params.content,
			revision,
			...sourceSha256 ? { source_sha256: sourceSha256 } : {},
			updated_at_ms: nowMs
		}));
		if (params.content === null) return {
			ok: true,
			currentRevision: revision
		};
		return {
			ok: true,
			currentRevision: revision,
			scratch: {
				content: params.content,
				revision,
				...sourceSha256 ? { sourceSha256 } : {},
				updatedAtMs: nowMs
			}
		};
	}, params.options, { operationLabel: "cron.scratch.write" });
}
/**
* Deletes scratch when its owning job is removed, or — with expectedRevision —
* atomically reverts a migration write back to the no-row state. Returns false
* when the guarded revision moved.
*/
function deleteCronJobScratch(storePath, jobId, options = {}, guard) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		const storeKey = cronStoreKey(storePath);
		if (guard) {
			const { currentRevision } = readScratchStateFromDatabase(db, storeKey, jobId);
			if (currentRevision !== guard.expectedRevision) return false;
		}
		executeSqliteQuerySync(db, getCronStoreKysely(db).deleteFrom("cron_job_scratch").where("store_key", "=", storeKey).where("job_id", "=", jobId));
		return true;
	}, options, { operationLabel: "cron.scratch.delete" });
}
/** Hash used by doctor to prove the file it removes is the file it migrated. */
function hashCronScratchSource(content) {
	return createHash("sha256").update(content, "utf8").digest("hex");
}
//#endregion
export { writeCronJobScratch as a, readHeartbeatMonitorScratch as i, hashCronScratchSource as n, readCronJobScratchState as r, deleteCronJobScratch as t };
