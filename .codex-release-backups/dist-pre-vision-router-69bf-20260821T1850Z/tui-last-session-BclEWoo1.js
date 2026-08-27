import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync, r as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-gKE3myqW.js";
import { h as runOpenClawStateWriteTransaction, jt as tableExists } from "./openclaw-state-db-BciZ4rHE.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { createHash } from "node:crypto";
import fs from "node:fs";
//#region src/tui/tui-last-session.ts
function stateDatabaseOptions(stateDir) {
	return stateDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: stateDir
	} } : { env: process.env };
}
/** Builds a stable private-store key for the current TUI connection, agent, and session scope. */
function buildTuiLastSessionScopeKey(params) {
	const agentId = normalizeAgentId(params.agentId);
	const connectionUrl = params.connectionUrl.trim() || "local";
	return createHash("sha256").update(`${params.sessionScope}\n${agentId}\n${connectionUrl}`).digest("hex").slice(0, 32);
}
function isHeartbeatSessionKey(sessionKey) {
	return normalizeLowercaseStringOrEmpty(sessionKey).endsWith(":heartbeat");
}
/** Detects heartbeat/system sessions that should not become the remembered human session. */
function isHeartbeatLikeTuiSession(session) {
	if (isHeartbeatSessionKey(session.key)) return true;
	return [
		session.provider,
		session.lastProvider,
		session.lastChannel,
		session.lastTo,
		session.origin?.provider,
		session.origin?.surface,
		session.origin?.label
	].some((marker) => normalizeLowercaseStringOrEmpty(marker) === "heartbeat");
}
/** Reads the remembered session key for a scope from canonical shared state. */
async function readTuiLastSessionKey(params) {
	const options = stateDatabaseOptions(params.stateDir);
	if (!fs.existsSync(resolveOpenClawStateSqlitePath(options.env))) return null;
	return withOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "tui_last_sessions")) return null;
		const sessionKey = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("tui_last_sessions").select("session_key").where("scope_key", "=", params.scopeKey))?.session_key.trim() ?? "";
		return sessionKey && !isHeartbeatSessionKey(sessionKey) ? sessionKey : null;
	}, options);
}
/** Writes the remembered session key unless it is empty, unknown, or heartbeat-owned. */
async function writeTuiLastSessionKey(params) {
	const sessionKey = params.sessionKey.trim();
	if (!sessionKey || sessionKey === "unknown" || isHeartbeatSessionKey(sessionKey)) return;
	const updatedAt = Date.now();
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("tui_last_sessions").values({
			scope_key: params.scopeKey,
			session_key: sessionKey,
			updated_at: updatedAt
		}).onConflict((conflict) => conflict.column("scope_key").doUpdateSet({
			session_key: sessionKey,
			updated_at: updatedAt
		})));
	}, stateDatabaseOptions(params.stateDir));
}
/** Removes restore pointers that target sessions retired by doctor repair. */
function clearTuiLastSessionPointers(params) {
	if (params.sessionKeys.size === 0) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("tui_last_sessions").where("session_key", "in", [...params.sessionKeys]));
		return Number(result.numAffectedRows ?? 0n);
	}, stateDatabaseOptions(params.stateDir));
}
/** Resolves a remembered key to a currently listed session for the active agent. */
function resolveRememberedTuiSessionKey(params) {
	const rememberedKey = params.rememberedKey?.trim();
	if (!rememberedKey) return null;
	if (isHeartbeatSessionKey(rememberedKey)) return null;
	const currentAgentId = normalizeAgentId(params.currentAgentId);
	const parsed = parseAgentSessionKey(rememberedKey);
	if (parsed && normalizeAgentId(parsed.agentId) !== currentAgentId) return null;
	const rememberedRest = parsed?.rest ?? rememberedKey;
	return params.sessions.find((session) => {
		if (isHeartbeatLikeTuiSession(session)) return false;
		if (session.key === rememberedKey) return true;
		return parseAgentSessionKey(session.key)?.rest === rememberedRest;
	})?.key ?? null;
}
//#endregion
export { writeTuiLastSessionKey as a, resolveRememberedTuiSessionKey as i, clearTuiLastSessionPointers as n, readTuiLastSessionKey as r, buildTuiLastSessionScopeKey as t };
