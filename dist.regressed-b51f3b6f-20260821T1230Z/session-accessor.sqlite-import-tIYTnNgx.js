import { g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-DmtKty-F.js";
import { v as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-lxLIE6rA.js";
import { H as touchTranscriptMutationInTransaction, I as ensureTranscriptGenerationInTransaction, L as ensureTranscriptSessionRoot, N as writeSessionEntry, P as advanceTranscriptMutationAtInTransaction, nt as publishSessionEntryCacheInvalidation } from "./targets-DxP0vsft.js";
import { f as runExclusiveSqliteSessionWrite, i as getSessionKysely, p as toDatabaseOptions, r as formatSqliteSessionReferenceForScope, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-kI2NyJDH.js";
import { a as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-Bfc_6ADm.js";
import { T as readTranscriptEventJsonSetInTransaction, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-E-m-_aAq.js";
import { i as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-canonical-repair-DPsLdhK1.js";
//#region src/config/sessions/session-accessor.sqlite-import.ts
/** Imports one legacy session entry and its transcript rows for doctor migration. */
async function importSqliteSessionRows(params) {
	if (params.readExactTranscriptRows && params.readTranscriptEvents) throw new Error("SQLite session import accepts only one transcript row source");
	const resolvedScope = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		...params.env ? { env: params.env } : {},
		sessionKey: params.sessionKey,
		...params.storePath ? { storePath: params.storePath } : {}
	});
	const resolved = params.preserveExactStoredKey ? {
		...resolvedScope,
		sessionKey: params.sessionKey
	} : resolvedScope;
	return await runExclusiveSqliteSessionWrite(resolved, async () => {
		let transcriptEvents = 0;
		let skippedExisting = false;
		runOpenClawAgentWriteTransaction((database) => {
			const currentEntry = readExactSessionEntryRowForCanonicalRepair(database, resolved.sessionKey, { allowMalformedRowRepair: params.allowMalformedRowRepair === true })?.entry;
			if (params.skipIfExists === true && currentEntry) {
				skippedExisting = true;
				return;
			}
			const preservedHarnessId = params.entry.agentHarnessId === void 0 && currentEntry?.sessionId === params.entry.sessionId && currentEntry.lifecycleRevision === params.entry.lifecycleRevision ? currentEntry.agentHarnessId?.trim() : void 0;
			const importedEntry = {
				...params.entry,
				...preservedHarnessId ? { agentHarnessId: preservedHarnessId } : {},
				sessionFile: formatSqliteSessionReferenceForScope({
					...resolved,
					sessionId: params.entry.sessionId
				})
			};
			writeSessionEntry(database, resolved.sessionKey, importedEntry, {
				allowStoredAliases: true,
				previousEntry: currentEntry ?? null
			});
			if (params.readExactTranscriptRows) {
				const transcriptScope = {
					...resolved,
					sessionId: params.entry.sessionId
				};
				const db = getSessionKysely(database.db);
				if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1))) {
					const rows = [];
					params.readExactTranscriptRows((row) => rows.push(row));
					if (rows.length > 0) {
						ensureTranscriptSessionRoot(database, transcriptScope, rows[0].createdAt, { allowStoredAlias: true });
						ensureTranscriptGenerationInTransaction(database, params.entry.sessionId);
						for (const [seq, row] of rows.entries()) executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
							session_id: params.entry.sessionId,
							seq,
							event_json: row.eventJson,
							created_at: row.createdAt
						}));
						transcriptEvents = rows.length;
						reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
						publishSessionEntryCacheInvalidation(database);
					}
				}
			} else if (params.readTranscriptEvents) {
				const transcriptScope = {
					...resolved,
					sessionId: params.entry.sessionId
				};
				const existingEventJson = readTranscriptEventJsonSetInTransaction(database, params.entry.sessionId);
				params.readTranscriptEvents((event) => {
					const eventJson = JSON.stringify(event);
					if (existingEventJson.has(eventJson)) return;
					if (appendTranscriptEventInTransaction(database, transcriptScope, event, {
						allowStoredAlias: true,
						scheduleProjectionReconcile: false,
						touchMutation: false
					})) {
						existingEventJson.add(eventJson);
						transcriptEvents += 1;
					}
				});
				reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
				publishSessionEntryCacheInvalidation(database);
			}
			if (params.transcriptMtimeMs !== void 0) advanceTranscriptMutationAtInTransaction(database, params.entry.sessionId, params.transcriptMtimeMs);
			else if (transcriptEvents > 0) touchTranscriptMutationInTransaction(database, params.entry.sessionId);
		}, toDatabaseOptions(resolved));
		return {
			sessionId: params.entry.sessionId,
			sessionKey: resolved.sessionKey,
			...skippedExisting ? { skippedExisting: true } : {},
			transcriptEvents
		};
	});
}
//#endregion
export { importSqliteSessionRows as t };
