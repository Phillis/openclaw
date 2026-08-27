import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, Yt as resolveOpenClawStateSqlitePath, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync, zt as tableExists } from "./openclaw-state-db-CeAO_dqo.js";
import { existsSync } from "node:fs";
import { randomUUID } from "node:crypto";
//#region src/state/backup-run-records.ts
function boundedText(value, maxLength) {
	const trimmed = value?.trim();
	return trimmed ? trimmed.slice(0, maxLength) : void 0;
}
function parseBackupRun(row) {
	if (row.status !== "ok" && row.status !== "failed") return;
	let manifest;
	try {
		manifest = JSON.parse(row.manifest_json);
	} catch {
		return;
	}
	if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) return;
	const value = manifest;
	if (value.kind !== "archive" && value.kind !== "sqlite-snapshot" && value.kind !== "git") return;
	return {
		id: row.id,
		createdAt: row.created_at,
		archivePath: row.archive_path,
		status: row.status,
		kind: value.kind,
		...typeof value.target === "string" ? { target: value.target } : {},
		...typeof value.error === "string" ? { error: value.error } : {},
		...value.pushFailed === true ? { pushFailed: true } : {}
	};
}
/** Record one best-effort backup outcome in the shared bounded operational log. */
function recordBackupRunOutcome(params) {
	if (!existsSync(resolveOpenClawStateSqlitePath(params.env ?? process.env))) return;
	const manifest = JSON.stringify({
		kind: params.kind,
		...boundedText(params.target, 512) ? { target: boundedText(params.target, 512) } : {},
		...boundedText(params.error, 1200) ? { error: boundedText(params.error, 1200) } : {},
		...params.pushFailed === true ? { pushFailed: true } : {}
	});
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.insertInto("backup_runs").values({
			id: randomUUID(),
			created_at: params.createdAt ?? Date.now(),
			archive_path: params.archivePath,
			status: params.status,
			manifest_json: manifest
		}));
		executeSqliteQuerySync(db, kysely.deleteFrom("backup_runs").where("id", "in", kysely.selectFrom("backup_runs").select("id").orderBy("created_at", "desc").orderBy("id", "desc").limit(2147483647).offset(200)));
	}, { env: params.env });
}
function readBackupRun(database, status) {
	if (!tableExists(database, "backup_runs")) return;
	let query = getNodeSqliteKysely(database).selectFrom("backup_runs").selectAll();
	if (status) query = query.where("status", "=", status);
	const row = executeSqliteQueryTakeFirstSync(database, query.orderBy("created_at", "desc").orderBy("id", "desc").limit(1));
	return row ? parseBackupRun(row) : void 0;
}
/** Read the newest recorded backup attempt from an already-open database. */
function readLatestBackupRun(database) {
	return readBackupRun(database);
}
/** Read the newest successful backup from an already-open database. */
function readLatestSuccessfulBackupRun(database) {
	return readBackupRun(database, "ok");
}
//#endregion
export { readLatestSuccessfulBackupRun as n, recordBackupRunOutcome as r, readLatestBackupRun as t };
