import { Mn as executeSqliteQueryTakeFirstSync, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { y as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-BEQsKM0c.js";
import { $ as publishSessionEntryCacheInvalidation, C as ensureTranscriptGenerationInTransaction, b as writeSessionEntry, k as touchTranscriptMutationInTransaction, w as ensureTranscriptSessionRoot, x as advanceTranscriptMutationAtInTransaction } from "./session-accessor.sqlite-entry-store-BIW-GrsF.js";
import { c as resolveSqliteScope, i as getSessionKysely, m as toDatabaseOptions, p as runExclusiveSqliteSessionWrite, r as formatSqliteSessionReferenceForScope } from "./session-accessor.sqlite-scope-C7NrJaPh.js";
import { c as reconcileSessionTranscriptIndexInTransaction } from "./session-transcript-index-_z9fjL8c.js";
import { n as replaceSessionOwnerInTransaction, o as readExactSessionEntryRowForCanonicalRepair } from "./session-accessor.sqlite-owner-C4EZWikF.js";
import { E as readTranscriptEventJsonSetInTransaction, t as appendTranscriptEventInTransaction } from "./session-accessor.sqlite-transcript-store-CZRFPUnE.js";
//#region src/config/sessions/session-accessor.sqlite-import.ts
function prepareSqliteSessionImport(params) {
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
	const exactTranscriptRows = params.readExactTranscriptRows ? new Array() : void 0;
	params.readExactTranscriptRows?.((row) => exactTranscriptRows?.push(row));
	const transcriptEvents = params.readTranscriptEvents ? new Array() : void 0;
	params.readTranscriptEvents?.((event) => transcriptEvents?.push(event));
	return {
		exactTranscriptRows,
		params,
		resolved,
		transcriptEvents
	};
}
function importSqliteSessionRowsInTransaction(database, prepared) {
	const { params, resolved } = prepared;
	let transcriptEvents = 0;
	const currentEntry = readExactSessionEntryRowForCanonicalRepair(database, resolved.sessionKey, { allowMalformedRowRepair: params.allowMalformedRowRepair === true })?.entry;
	if (params.skipIfExists === true && currentEntry) return {
		sessionId: params.entry.sessionId,
		sessionKey: resolved.sessionKey,
		skippedExisting: true,
		transcriptEvents
	};
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
	const exactTranscriptRows = prepared.exactTranscriptRows;
	if (exactTranscriptRows) {
		replaceSessionOwnerInTransaction(database, resolved.sessionKey, params.entry.owner);
		const transcriptScope = {
			...resolved,
			sessionId: params.entry.sessionId
		};
		const db = getSessionKysely(database.db);
		if (!executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("transcript_events").select("seq").where("session_id", "=", params.entry.sessionId).limit(1)) && exactTranscriptRows.length > 0) {
			ensureTranscriptSessionRoot(database, transcriptScope, exactTranscriptRows[0].createdAt, { allowStoredAlias: true });
			ensureTranscriptGenerationInTransaction(database, params.entry.sessionId);
			for (const [seq, row] of exactTranscriptRows.entries()) executeSqliteQuerySync(database.db, db.insertInto("transcript_events").values({
				session_id: params.entry.sessionId,
				seq,
				event_json: row.eventJson,
				created_at: row.createdAt
			}));
			transcriptEvents = exactTranscriptRows.length;
			reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
			publishSessionEntryCacheInvalidation(database);
		}
	} else if (prepared.transcriptEvents) {
		const transcriptScope = {
			...resolved,
			sessionId: params.entry.sessionId
		};
		const existingEventJson = readTranscriptEventJsonSetInTransaction(database, params.entry.sessionId);
		for (const event of prepared.transcriptEvents) {
			const eventJson = JSON.stringify(event);
			if (existingEventJson.has(eventJson)) continue;
			if (appendTranscriptEventInTransaction(database, transcriptScope, event, {
				allowStoredAlias: true,
				scheduleProjectionReconcile: false,
				touchMutation: false
			})) {
				existingEventJson.add(eventJson);
				transcriptEvents += 1;
			}
		}
		reconcileSessionTranscriptIndexInTransaction(database.db, params.entry.sessionId);
		publishSessionEntryCacheInvalidation(database);
	}
	if (params.transcriptMtimeMs !== void 0) advanceTranscriptMutationAtInTransaction(database, params.entry.sessionId, params.transcriptMtimeMs);
	else if (transcriptEvents > 0) touchTranscriptMutationInTransaction(database, params.entry.sessionId);
	return {
		sessionId: params.entry.sessionId,
		sessionKey: resolved.sessionKey,
		transcriptEvents
	};
}
/** Imports legacy session rows that share one SQLite store in one durable transaction. */
async function importSqliteSessionRowsBatch(params) {
	if (params.length === 0) return [];
	const prepared = params.map(prepareSqliteSessionImport);
	const resolved = prepared[0].resolved;
	if (prepared.some((row) => row.resolved.path !== resolved.path)) throw new Error("SQLite session import batch spans multiple stores");
	return await runExclusiveSqliteSessionWrite(resolved, async () => runOpenClawAgentWriteTransaction((database) => prepared.map((row) => importSqliteSessionRowsInTransaction(database, row)), toDatabaseOptions(resolved)));
}
/** Imports one legacy session entry and its transcript rows for doctor migration. */
async function importSqliteSessionRows(params) {
	return (await importSqliteSessionRowsBatch([params]))[0];
}
//#endregion
export { importSqliteSessionRowsBatch as n, importSqliteSessionRows as t };
