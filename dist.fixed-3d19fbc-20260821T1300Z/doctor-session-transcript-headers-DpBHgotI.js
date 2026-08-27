import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import "./agent-scope-D9GLFAyB.js";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CsnnOL14.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { g as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-C8vnaZ56.js";
import { o as resolveAllAgentSessionStoreTargetsSync } from "./targets-CdQ3kEkv.js";
import { i as getSessionKysely } from "./session-accessor.sqlite-scope-kLvPv-zX.js";
import { g as isSessionTranscriptLeafControl, h as isCanonicalSessionTranscriptEntry } from "./session-transcript-index-B7GQuTh4.js";
import { A as readTranscriptStorageRows, p as createSessionTranscriptHeader, u as replaceSqliteTranscriptEventsInTransaction } from "./session-accessor.sqlite-transcript-store-Cgnm_AHf.js";
import { r as isIndexedSessionEntry } from "./session-manager-codec-CBbtVKV-.js";
import { t as note } from "./note-C_xoKlB9.js";
import { c as readOnlySqliteTranscriptSessionIds, f as resolveTargetSqlitePath, u as readOnlySqliteTranscriptStorageSnapshot } from "./doctor-session-sqlite-readers-BZLOJiry.js";
import fs from "node:fs";
//#region src/commands/doctor-session-transcript-headers.ts
const NOTE_TITLE = "Session transcript headers";
function parseCanonicalHeaderlessEvents(rows, sessionId) {
	if (rows.length === 0) return;
	const events = [];
	const eventIds = /* @__PURE__ */ new Set([sessionId]);
	let indexedEntries = 0;
	for (const row of rows) {
		let event;
		try {
			event = JSON.parse(row.eventJson);
		} catch {
			return;
		}
		if (!event || typeof event !== "object" || Array.isArray(event)) return;
		const record = event;
		if (record.type === "session") return;
		if (isCanonicalSessionTranscriptEntry(record)) {
			if (!isIndexedSessionEntry(event)) return;
			indexedEntries += 1;
		} else if (record.type === "leaf" && !isSessionTranscriptLeafControl(record)) return;
		if (typeof record.id === "string") {
			const eventId = record.id.trim();
			if (!eventId || eventIds.has(eventId)) return;
			eventIds.add(eventId);
		}
		events.push(event);
	}
	return indexedEntries > 0 ? events : void 0;
}
function snapshotsMatch(expected, current) {
	return expected.length === current.length && expected.every((row, index) => row.seq === current[index]?.seq && row.createdAt === current[index]?.createdAt && row.eventJson === current[index]?.eventJson);
}
function readHeaderRepairContext(database, sessionId) {
	const db = getSessionKysely(database.db);
	const window = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows").select("session_key").where("session_id", "=", sessionId).limit(1));
	if (!window?.session_key) return;
	const node = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_nodes").select(["current_session_id", "entry_json"]).where("session_key", "=", window.session_key).limit(1));
	let spawnedCwd;
	if (node?.current_session_id === sessionId && node.entry_json) try {
		const entry = JSON.parse(node.entry_json);
		if (entry.sessionId === sessionId && typeof entry.spawnedCwd === "string" && entry.spawnedCwd.trim()) spawnedCwd = entry.spawnedCwd.trim();
	} catch {}
	return {
		sessionKey: window.session_key,
		...spawnedCwd ? { spawnedCwd } : {}
	};
}
function formatHeaderTimestamp(createdAt) {
	if (!Number.isFinite(createdAt)) return;
	try {
		return new Date(createdAt).toISOString();
	} catch {
		return;
	}
}
function assertRepairPreservedEvents(params) {
	const after = readTranscriptStorageRows(params.database, params.sessionId);
	if (after.length !== params.before.length + 1) throw new Error(`header repair changed the event count for ${params.sessionId}`);
	for (const [index, beforeRow] of params.before.entries()) {
		const afterRow = after[index + 1];
		if (!afterRow || afterRow.createdAt !== beforeRow.createdAt) throw new Error(`header repair changed row timestamps for ${params.sessionId}`);
		const beforeEvent = JSON.parse(beforeRow.eventJson);
		const afterEvent = JSON.parse(afterRow.eventJson);
		if (beforeEvent.id !== afterEvent.id || beforeEvent.parentId !== afterEvent.parentId || beforeEvent.targetId !== afterEvent.targetId || beforeEvent.appendParentId !== afterEvent.appendParentId) throw new Error(`header repair changed event identity for ${params.sessionId}`);
	}
}
function formatCount(count, singular) {
	return `${count} ${singular}${count === 1 ? "" : "s"}`;
}
/** Reports or repairs canonical SQLite transcripts whose first header was never persisted. */
async function noteSessionTranscriptHeaderHealth(params) {
	const env = params.env ?? process.env;
	let found = 0;
	let repaired = 0;
	const targetsBySqlitePath = /* @__PURE__ */ new Map();
	for (const target of resolveAllAgentSessionStoreTargetsSync(params.cfg, { env })) {
		const sqlitePath = resolveTargetSqlitePath(target);
		if (!targetsBySqlitePath.has(sqlitePath)) targetsBySqlitePath.set(sqlitePath, target);
	}
	for (const [sqlitePath, target] of targetsBySqlitePath) {
		if (!fs.existsSync(sqlitePath)) continue;
		const databaseOptions = {
			agentId: target.agentId,
			env,
			path: sqlitePath
		};
		try {
			for (const sessionId of readOnlySqliteTranscriptSessionIds(sqlitePath)) {
				const snapshot = readOnlySqliteTranscriptStorageSnapshot(sqlitePath, sessionId);
				if (!snapshot.ok) {
					const detail = formatErrorMessage(snapshot.error).replace(/\s+/g, " ").trim();
					note(`- Failed to read transcript ${sessionId} (${target.agentId}): ${detail}`, NOTE_TITLE);
					continue;
				}
				if (!snapshot.sessionKey || !parseCanonicalHeaderlessEvents(snapshot.rows, sessionId)) continue;
				const headerTimestamp = formatHeaderTimestamp(snapshot.rows[0]?.createdAt ?? NaN);
				if (!headerTimestamp) {
					note(`- Failed to repair transcript ${sessionId} (${target.agentId}): invalid first-row timestamp`, NOTE_TITLE);
					continue;
				}
				found += 1;
				if (!params.shouldRepair) continue;
				const logicalAgentId = parseAgentSessionKey(snapshot.sessionKey)?.agentId ?? target.agentId;
				const workspaceCwd = resolveAgentWorkspaceDir(params.cfg, logicalAgentId, env);
				try {
					runOpenClawAgentWriteTransaction((database) => {
						const currentRows = readTranscriptStorageRows(database, sessionId);
						if (!snapshotsMatch(snapshot.rows, currentRows)) throw new Error(`transcript changed while preparing header repair for ${sessionId}`);
						const events = parseCanonicalHeaderlessEvents(currentRows, sessionId);
						if (!events) throw new Error(`transcript is no longer a canonical headerless session: ${sessionId}`);
						const context = readHeaderRepairContext(database, sessionId);
						if (!context || context.sessionKey !== snapshot.sessionKey) throw new Error(`session binding changed while preparing header repair for ${sessionId}`);
						const header = createSessionTranscriptHeader({
							cwd: context.spawnedCwd ?? workspaceCwd,
							sessionId,
							timestamp: headerTimestamp
						});
						replaceSqliteTranscriptEventsInTransaction(database, {
							agentId: target.agentId,
							env,
							path: sqlitePath,
							sessionId,
							sessionKey: context.sessionKey
						}, [header, ...events], {
							createdAtByIndex: [currentRows[0]?.createdAt ?? Date.parse(headerTimestamp), ...currentRows.map((row) => row.createdAt)],
							preserveSessionWindowRecency: true
						});
						assertRepairPreservedEvents({
							before: currentRows,
							database,
							sessionId
						});
					}, databaseOptions, { operationLabel: "doctor.session-transcript-headers" });
					repaired += 1;
				} catch (error) {
					const detail = formatErrorMessage(error).replace(/\s+/g, " ").trim();
					note(`- Failed to repair transcript ${sessionId} (${target.agentId}): ${detail}`, NOTE_TITLE);
				}
			}
		} catch (error) {
			const detail = formatErrorMessage(error).replace(/\s+/g, " ").trim();
			note(`- Failed to inspect transcript headers for ${target.agentId} (${sqlitePath}): ${detail}`, NOTE_TITLE);
		}
	}
	if (params.shouldRepair && repaired > 0) note(`- Prepended current headers to ${formatCount(repaired, "session transcript")}.`, NOTE_TITLE);
	else if (!params.shouldRepair && found > 0) note([`- Found ${formatCount(found, "canonical session transcript")} without a header.`, `- Run "openclaw doctor --fix" to repair ${found === 1 ? "it" : "them"} before resuming the session.`].join("\n"), NOTE_TITLE);
	return {
		found,
		repaired
	};
}
//#endregion
export { noteSessionTranscriptHeaderHealth };
