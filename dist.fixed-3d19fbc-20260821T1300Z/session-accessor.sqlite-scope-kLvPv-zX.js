import { n as normalizeAgentId } from "./agent-id-Db0rqw_J.js";
import { c as parseAgentSessionKey } from "./session-key-utils-D8x_bjrd.js";
import { t as isIncognitoSessionKey } from "./incognito-session-key-BwpD1Lwd.js";
import { b as toAgentStoreSessionKey, f as resolveAgentIdFromSessionKey } from "./session-key-D8GLfPr_.js";
import { i as getChildLogger } from "./logger-CufStxi-.js";
import { _ as getNodeSqliteKysely } from "./openclaw-state-db.paths-gKE3myqW.js";
import "./openclaw-agent-db-C8vnaZ56.js";
import { A as resolveOpenClawAgentSqlitePath, k as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db-maintenance-CAGHh5rr.js";
import { a as normalizeStoreSessionKey, l as runQueuedStoreWrite } from "./store-entry-BB6W2GxL.js";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.js";
import { r as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-BhHIMU5g.js";
import path from "node:path";
//#region src/config/sessions/session-accessor.sqlite-scope.ts
const SQLITE_SESSION_SLOW_WRITE_MS = 1e3;
const SQLITE_SESSION_WRITER_QUEUES = /* @__PURE__ */ new Map();
function getSessionKysely(database) {
	return getNodeSqliteKysely(database);
}
async function runExclusiveSqliteSessionWrite(scope, fn) {
	const storePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const startedAt = Date.now();
	try {
		const result = await runQueuedStoreWrite({
			queues: SQLITE_SESSION_WRITER_QUEUES,
			storePath,
			label: "runExclusiveSqliteSessionWrite",
			fn
		});
		const elapsedMs = Date.now() - startedAt;
		if (elapsedMs >= SQLITE_SESSION_SLOW_WRITE_MS) getChildLogger({ subsystem: "session-sqlite" }).warn("slow SQLite session write", {
			agentId: scope.agentId,
			elapsedMs,
			storePath
		});
		return result;
	} catch (error) {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session write failed", {
			agentId: scope.agentId,
			elapsedMs: Date.now() - startedAt,
			error,
			storePath
		});
		throw error;
	}
}
function resolveSqliteScope(scope) {
	const parsedAgentId = parseAgentSessionKey(scope.sessionKey)?.agentId;
	const scopedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : parsedAgentId;
	const incognitoAgentId = isIncognitoSessionKey(scope.sessionKey) ? resolveAgentIdFromSessionKey(scope.sessionKey) : void 0;
	const effectiveStorePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : scope.storePath;
	const effectiveAgentId = incognitoAgentId ?? scopedAgentId;
	const storeTarget = effectiveStorePath ? resolveSqliteTargetFromSessionStorePath(effectiveStorePath, {
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		...scope.env ? { env: scope.env } : {}
	}) : void 0;
	const agentId = resolveSqliteAgentId({
		scopedAgentId: effectiveAgentId,
		sessionKey: scope.sessionKey,
		storeAgentId: storeTarget?.agentId,
		storeShared: storeTarget?.shared
	});
	if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
	const normalizedSessionKey = normalizeSqliteSessionKey(scope.sessionKey);
	const sessionKey = !normalizedSessionKey || normalizedSessionKey === "global" || normalizedSessionKey === "unknown" || parseAgentSessionKey(normalizedSessionKey) ? normalizedSessionKey : toAgentStoreSessionKey({
		agentId,
		requestKey: normalizedSessionKey
	});
	return {
		agentId,
		...storeTarget?.shared && storeTarget.agentId ? { databaseAgentId: storeTarget.agentId } : {},
		...scope.env ? { env: scope.env } : {},
		...storeTarget ? { path: storeTarget.path } : {},
		sessionKey
	};
}
function resolveSqliteReadScope(scope, targetCache) {
	const sessionKey = scope.sessionKey ? normalizeSqliteSessionKey(scope.sessionKey) : void 0;
	const parsedAgentId = parseAgentSessionKey(sessionKey)?.agentId;
	const scopedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : parsedAgentId;
	const incognitoAgentId = isIncognitoSessionKey(sessionKey) ? resolveAgentIdFromSessionKey(sessionKey) : void 0;
	const effectiveStorePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : scope.storePath;
	const effectiveAgentId = incognitoAgentId ?? scopedAgentId;
	const storeTarget = effectiveStorePath ? resolveCachedSqliteStoreTarget({
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		env: scope.env,
		storePath: effectiveStorePath
	}, targetCache) : void 0;
	const agentId = resolveSqliteAgentId({
		scopedAgentId: effectiveAgentId,
		sessionKey,
		storeAgentId: storeTarget?.agentId,
		storeShared: storeTarget?.shared
	});
	if (!agentId) throw new Error("Cannot resolve SQLite transcript read scope without an agent id");
	return {
		agentId,
		...storeTarget?.shared && storeTarget.agentId ? { databaseAgentId: storeTarget.agentId } : {},
		...scope.env ? { env: scope.env } : {},
		...storeTarget ? { path: storeTarget.path } : {},
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveCachedSqliteStoreTarget(params, targetCache) {
	if (!targetCache) return resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	const envCache = targetCache.get(params.env) ?? /* @__PURE__ */ new Map();
	targetCache.set(params.env, envCache);
	const cacheKey = JSON.stringify([
		params.storePath,
		params.agentId,
		params.defaultAgentId
	]);
	const cached = envCache.get(cacheKey);
	if (cached) return cached;
	const resolved = resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	envCache.set(cacheKey, resolved);
	return resolved;
}
function resolveSqliteStoreScope(storePath, options = {}) {
	return resolveSqliteScope({
		...options.agentId ? { agentId: options.agentId } : {},
		sessionKey: "",
		storePath
	});
}
function resolveSqliteAgentId(params) {
	const scopedAgentId = params.scopedAgentId ? normalizeAgentId(params.scopedAgentId) : void 0;
	if (scopedAgentId && params.storeAgentId && scopedAgentId !== params.storeAgentId && !params.storeShared) throw new Error(`SQLite session store path belongs to agent ${params.storeAgentId}; requested agent ${scopedAgentId}.`);
	const parsedAgentId = params.sessionKey ? parseAgentSessionKey(params.sessionKey)?.agentId : void 0;
	return scopedAgentId ?? params.storeAgentId ?? parsedAgentId;
}
function resolveSqliteTranscriptArchiveDirectory(scope) {
	const databasePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const databaseDir = path.dirname(databasePath);
	if (path.basename(databaseDir) !== "agent") return databaseDir;
	return path.join(path.dirname(databaseDir), "sessions");
}
function resolveSqliteTranscriptScope(scope) {
	if (!scope.sessionId) throw new Error(`Cannot resolve SQLite transcript scope without a session id: ${scope.sessionKey}`);
	if (!scope.sessionKey) throw new Error(`Cannot resolve SQLite transcript scope without a session key: ${scope.sessionId}`);
	return {
		...resolveSqliteScope({
			...scope,
			sessionKey: scope.sessionKey
		}),
		sessionId: scope.sessionId
	};
}
function resolveSqliteTranscriptReadScope(scope, targetCache) {
	return {
		...resolveSqliteReadScope(scope, targetCache),
		sessionId: scope.sessionId
	};
}
function toDatabaseOptions(scope) {
	return {
		agentId: scope.databaseAgentId ?? scope.agentId,
		...scope.env ? { env: scope.env } : {},
		...scope.path ? { path: scope.path } : {}
	};
}
function normalizeSqliteSessionKey(sessionKey) {
	return normalizeStoreSessionKey(sessionKey);
}
function cloneSessionEntry(entry) {
	return structuredClone(entry);
}
function formatSqliteSessionReferenceForScope(scope) {
	return scope.sessionKey;
}
/** Legacy identity string retained only for transcript artifact metadata and plugin contracts. */
function formatLegacySqliteSessionMarkerForScope(scope) {
	return formatSqliteSessionFileMarker({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		storePath: scope.path ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope))
	});
}
//#endregion
export { normalizeSqliteSessionKey as a, resolveSqliteStoreScope as c, resolveSqliteTranscriptScope as d, runExclusiveSqliteSessionWrite as f, getSessionKysely as i, resolveSqliteTranscriptArchiveDirectory as l, formatLegacySqliteSessionMarkerForScope as n, resolveSqliteReadScope as o, toDatabaseOptions as p, formatSqliteSessionReferenceForScope as r, resolveSqliteScope as s, cloneSessionEntry as t, resolveSqliteTranscriptReadScope as u };
