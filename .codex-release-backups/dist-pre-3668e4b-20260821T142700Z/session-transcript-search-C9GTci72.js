import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import "./utils-D9gvQMP6.js";
import { g as openOpenClawAgentDatabase } from "./openclaw-agent-db-C8vnaZ56.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BhHIMU5g.js";
import { i as listSessionsNeedingTranscriptIndexReconcile } from "./session-transcript-index-B7GQuTh4.js";
import { r as startSessionTranscriptIndexReconcile, t as isSessionTranscriptIndexReconcileRunning } from "./session-transcript-reconcile-BZJL8ACd.js";
//#region src/config/sessions/session-transcript-search.ts
const SEARCH_SNIPPET_MAX_CHARS = 500;
const SEARCH_LIMIT_MAX = 25;
const SEARCH_QUERY_MAX_CHARS = 4096;
function toFtsQuery(query) {
	return query.trim().split(/\s+/u).map((token) => `"${token.replaceAll("\"", "\"\"")}"`).join(" AND ");
}
/** Search the per-agent FTS index; kicks off one background reconcile when the index lags. */
function searchSessionTranscripts(params) {
	const query = params.query.trim();
	if (!query) throw new Error("query must not be empty");
	if (query.length > SEARCH_QUERY_MAX_CHARS) throw new Error(`query must not exceed ${SEARCH_QUERY_MAX_CHARS} characters`);
	const databasePath = params.storePath ? resolveSqliteTargetFromSessionStorePath(params.storePath, { agentId: params.agentId }).path : void 0;
	const databaseOptions = {
		agentId: params.agentId,
		...params.env ? { env: params.env } : {},
		...databasePath ? { path: databasePath } : {}
	};
	const database = openOpenClawAgentDatabase(databaseOptions);
	const dirtySessions = listSessionsNeedingTranscriptIndexReconcile(database.db);
	if (dirtySessions.length > 0) startSessionTranscriptIndexReconcile(databaseOptions);
	const indexing = dirtySessions.length > 0 || isSessionTranscriptIndexReconcileRunning(databaseOptions);
	const limit = Math.min(Math.max(1, params.limit ?? 10), SEARCH_LIMIT_MAX);
	const sessionKeys = params.sessionKeys ?? [];
	const whereSession = sessionKeys.length > 0 ? ` AND session_windows.session_key IN (${sessionKeys.map(() => "?").join(", ")})` : "";
	const statement = database.db.prepare(`
    SELECT session_windows.session_key AS session_key, session_transcript_fts.session_id AS session_id,
      message_id, role, timestamp,
      snippet(session_transcript_fts, 0, '', '', ' … ', 48) AS snippet,
      bm25(session_transcript_fts) AS rank
    FROM session_transcript_fts
    JOIN session_windows ON session_windows.session_id = session_transcript_fts.session_id
    WHERE session_transcript_fts MATCH ?${whereSession}
      AND session_transcript_fts.session_id NOT IN (
        SELECT session_id FROM session_transcript_index_state WHERE needs_rebuild != 0
      )
    ORDER BY rank ASC, timestamp DESC, message_id ASC
    LIMIT ?
  `);
	const values = [
		toFtsQuery(query),
		...sessionKeys,
		limit + 1
	];
	const hits = statement.all(...values).flatMap((row) => {
		if (typeof row.session_key !== "string" || typeof row.session_id !== "string" || typeof row.message_id !== "string" || row.role !== "user" && row.role !== "assistant" || typeof row.snippet !== "string") return [];
		const timestamp = typeof row.timestamp === "number" ? row.timestamp : Number(row.timestamp);
		const rank = typeof row.rank === "number" ? row.rank : Number(row.rank);
		return [{
			sessionKey: row.session_key,
			sessionId: row.session_id,
			messageId: row.message_id,
			role: row.role,
			timestamp: Number.isFinite(timestamp) ? timestamp : 0,
			snippet: row.snippet.length > SEARCH_SNIPPET_MAX_CHARS ? `${truncateUtf16Safe(row.snippet, SEARCH_SNIPPET_MAX_CHARS)}…` : row.snippet,
			score: Number.isFinite(rank) ? -rank : 0
		}];
	});
	return {
		hits: hits.slice(0, limit),
		indexing,
		truncated: hits.length > limit
	};
}
//#endregion
export { searchSessionTranscripts as t };
