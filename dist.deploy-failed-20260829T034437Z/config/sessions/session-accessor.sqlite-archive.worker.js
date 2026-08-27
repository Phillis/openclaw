import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely } from "../../openclaw-state-db-CeAO_dqo.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "../../openclaw-agent-db-readonly-CRlF3oxo.js";
import { n as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "../../session-accessor.sqlite-delete-snapshot-BmM7ZPNr.js";
import { a as publishEncodedSessionTranscriptArchive, n as encodeMaterializedSessionTranscriptArchive, r as hashSessionArchiveBytes, t as MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES } from "../../session-accessor.sqlite-archive-CVw8YIdK.js";
import { t as serializeJsonlLines } from "../../transcript-jsonl-QKucbXZu.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-archive.worker.ts
/** Worker entrypoint for SQLite transcript archive materialization off the gateway event loop. */
function isSqliteTranscriptArchiveWorkerData(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && value.type === "sqlite-transcript-archive-v2";
}
function parsePublishWorkerPlans(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const plans = value.plans;
	if (!Array.isArray(plans)) return;
	const parsed = [];
	for (const planValue of plans) {
		if (!planValue || typeof planValue !== "object" || Array.isArray(planValue)) return;
		const plan = planValue;
		if (typeof plan.agentId !== "string" || typeof plan.archiveDirectory !== "string" || typeof plan.databasePath !== "string" || typeof plan.generation !== "string" || typeof plan.sessionId !== "string") return;
		parsed.push({
			agentId: plan.agentId,
			archiveDirectory: plan.archiveDirectory,
			databasePath: plan.databasePath,
			generation: plan.generation,
			sessionId: plan.sessionId
		});
	}
	return parsed;
}
function parseSessionStateDeleteSnapshot(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const snapshot = value;
	if (typeof snapshot.acpParentStreamEventCount !== "number" || snapshot.generation !== null && typeof snapshot.generation !== "string" || snapshot.lastSeq !== null && typeof snapshot.lastSeq !== "number" || snapshot.sessionKey !== null && typeof snapshot.sessionKey !== "string" || snapshot.sessionUpdatedAt !== null && typeof snapshot.sessionUpdatedAt !== "number" || snapshot.trajectoryLastSeq !== null && typeof snapshot.trajectoryLastSeq !== "number" || snapshot.transcriptUpdatedAt !== null && typeof snapshot.transcriptUpdatedAt !== "number") return null;
	return {
		acpParentStreamEventCount: snapshot.acpParentStreamEventCount,
		generation: snapshot.generation,
		lastSeq: snapshot.lastSeq,
		sessionKey: snapshot.sessionKey,
		sessionUpdatedAt: snapshot.sessionUpdatedAt,
		trajectoryLastSeq: snapshot.trajectoryLastSeq,
		transcriptUpdatedAt: snapshot.transcriptUpdatedAt
	};
}
function parseWorkerPlans(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const plans = value.plans;
	if (!Array.isArray(plans)) return;
	const parsed = [];
	for (const planValue of plans) {
		if (!planValue || typeof planValue !== "object" || Array.isArray(planValue)) return;
		const plan = planValue;
		const snapshot = parseSessionStateDeleteSnapshot(plan.snapshot);
		if (typeof plan.agentId !== "string" || typeof plan.archiveDirectory !== "string" || typeof plan.databasePath !== "string" || plan.reason !== "deleted" && plan.reason !== "reset" || typeof plan.sessionId !== "string" || !snapshot) return;
		parsed.push({
			agentId: plan.agentId,
			archiveDirectory: plan.archiveDirectory,
			databasePath: plan.databasePath,
			reason: plan.reason,
			sessionId: plan.sessionId,
			snapshot
		});
	}
	return parsed;
}
function readTranscriptArchiveContent(database, sessionId) {
	return serializeJsonlLines(executeSqliteQuerySync(database, getNodeSqliteKysely(database).selectFrom("transcript_events").select("event_json").where("session_id", "=", sessionId).orderBy("seq", "asc")).rows.map((row) => row.event_json));
}
function materializeTranscriptArchiveInWorker(plan) {
	const opened = withOpenClawAgentDatabaseReadOnly((database) => {
		let transactionOpen = false;
		try {
			database.db.exec("BEGIN");
			transactionOpen = true;
			const snapshot = readSessionStateDeleteSnapshot(database.db, plan.sessionId);
			if (!sqliteSessionStateDeleteSnapshotsEqual(snapshot, plan.snapshot)) throw new Error(`SQLite session state changed before archive materialization for ${plan.sessionId}`);
			const content = readTranscriptArchiveContent(database.db, plan.sessionId);
			database.db.exec("COMMIT");
			transactionOpen = false;
			return {
				content,
				snapshot
			};
		} catch (error) {
			if (transactionOpen) database.db.exec("ROLLBACK");
			throw error;
		}
	}, {
		agentId: plan.agentId,
		path: plan.databasePath
	});
	if (!opened.found) throw new Error(`Cannot archive SQLite transcript ${plan.sessionId}: ${opened.reason.replaceAll("-", " ")}`);
	const { content } = opened.value;
	const generation = plan.snapshot.generation;
	if (content.length > 0 && !generation) throw new Error(`Cannot archive SQLite transcript without a generation for ${plan.sessionId}`);
	return {
		archive: content.length > 0 && generation ? encodeMaterializedSessionTranscriptArchive({
			archiveDirectory: plan.archiveDirectory,
			content,
			generation,
			reason: plan.reason,
			sessionId: plan.sessionId
		}) : null,
		sessionId: plan.sessionId
	};
}
function publishTranscriptArchiveInWorker(plan) {
	try {
		const opened = withOpenClawAgentDatabaseReadOnly((database) => {
			const db = getNodeSqliteKysely(database.db);
			return executeSqliteQuerySync(database.db, db.selectFrom("session_transcript_archives").select([
				"archive_blob",
				"archive_name",
				"archive_sha256"
			]).where("session_id", "=", plan.sessionId).where("generation", "=", plan.generation)).rows[0];
		}, {
			agentId: plan.agentId,
			path: plan.databasePath
		});
		if (!opened.found || !opened.value) throw new Error(`Canonical SQLite transcript archive is missing for ${plan.sessionId}`);
		if (hashSessionArchiveBytes(opened.value.archive_blob) !== opened.value.archive_sha256) throw new Error(`Canonical SQLite transcript archive is corrupt for ${plan.sessionId}`);
		return {
			archivedPath: publishEncodedSessionTranscriptArchive({
				archiveDirectory: plan.archiveDirectory,
				archiveName: opened.value.archive_name,
				bytes: opened.value.archive_blob,
				sha256: opened.value.archive_sha256
			}),
			generation: plan.generation,
			sessionId: plan.sessionId
		};
	} catch (error) {
		return {
			error: error instanceof Error ? error.message : String(error),
			generation: plan.generation,
			sessionId: plan.sessionId
		};
	}
}
function runWorkerPort(port, plans) {
	let materializedBytes = 0;
	for (const plan of plans) {
		const result = materializeTranscriptArchiveInWorker(plan);
		materializedBytes += result.archive?.bytes.byteLength ?? 0;
		if (materializedBytes > 268435456) throw new Error(`Archive batch exceeds ${MAX_MATERIALIZED_ARCHIVE_BATCH_BYTES} bytes; use fewer sessions`);
		port.postMessage({
			type: "done",
			results: [result]
		});
	}
	port.close();
}
function runPublishWorkerPort(port, plans) {
	const results = plans.map((plan) => publishTranscriptArchiveInWorker(plan));
	port.postMessage({
		type: "published",
		results
	});
	port.close();
}
if (isSqliteTranscriptArchiveWorkerData(workerData)) {
	if (!parentPort) throw new Error("SQLite transcript archive worker requires a parent port");
	const operation = workerData.operation;
	if (operation === "materialize") {
		const plans = parseWorkerPlans(workerData);
		if (!plans) throw new Error("SQLite transcript archive worker requires valid materialization data");
		runWorkerPort(parentPort, plans);
	} else if (operation === "publish") {
		const plans = parsePublishWorkerPlans(workerData);
		if (!plans) throw new Error("SQLite transcript archive worker requires valid publication data");
		runPublishWorkerPort(parentPort, plans);
	} else throw new Error("SQLite transcript archive worker requires a supported operation");
}
//#endregion
export { materializeTranscriptArchiveInWorker, publishTranscriptArchiveInWorker };
