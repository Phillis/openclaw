import { _ as getNodeSqliteKysely, h as executeSqliteQuerySync } from "../../openclaw-state-db.paths-D5QeoU_L.js";
import { t as withOpenClawAgentDatabaseReadOnly } from "../../openclaw-agent-db-readonly-DTj1P3q4.js";
import { i as writeTranscriptArchive, r as sqliteSessionStateDeleteSnapshotsEqual, t as readSessionStateDeleteSnapshot } from "../../session-accessor.sqlite-delete-snapshot-DMKpYR0y.js";
import { t as serializeJsonlLines } from "../../transcript-jsonl-QKucbXZu.js";
import { parentPort, workerData } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-archive.worker.ts
/** Worker entrypoint for SQLite transcript archive materialization off the gateway event loop. */
function isSqliteTranscriptArchiveWorkerData(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value) && value.type === "sqlite-transcript-archive-v1";
}
function parseSessionStateDeleteSnapshot(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return null;
	const snapshot = value;
	if (typeof snapshot.acpParentStreamEventCount !== "number" || snapshot.generation !== null && typeof snapshot.generation !== "string" || snapshot.lastSeq !== null && typeof snapshot.lastSeq !== "number" || snapshot.sessionUpdatedAt !== null && typeof snapshot.sessionUpdatedAt !== "number" || snapshot.trajectoryLastSeq !== null && typeof snapshot.trajectoryLastSeq !== "number" || snapshot.transcriptUpdatedAt !== null && typeof snapshot.transcriptUpdatedAt !== "number") return null;
	return {
		acpParentStreamEventCount: snapshot.acpParentStreamEventCount,
		generation: snapshot.generation,
		lastSeq: snapshot.lastSeq,
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
	return {
		archivedPath: content.length > 0 ? writeTranscriptArchive({
			archiveDirectory: plan.archiveDirectory,
			content,
			reason: plan.reason,
			sessionId: plan.sessionId
		}) : null,
		sessionId: plan.sessionId
	};
}
function runWorkerPort(port, plans) {
	const results = plans.map((plan) => materializeTranscriptArchiveInWorker(plan));
	port.postMessage({
		type: "done",
		results
	});
	port.close();
}
if (isSqliteTranscriptArchiveWorkerData(workerData)) {
	if (!parentPort) throw new Error("SQLite transcript archive worker requires a parent port");
	const plans = parseWorkerPlans(workerData);
	if (!plans) throw new Error("SQLite transcript archive worker requires valid worker data");
	runWorkerPort(parentPort, plans);
}
//#endregion
export { materializeTranscriptArchiveInWorker };
