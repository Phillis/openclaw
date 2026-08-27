import { w as resolveStateDir } from "./paths-BBSTUjD5.js";
import { An as executeSqliteQuerySync, Mn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { t as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/device-auth-store.ts
const legacyPresenceCache = /* @__PURE__ */ new Map();
function assertNoLegacyDeviceAuth(env) {
	const stateDir = resolveStateDir(env);
	let hasLegacy = legacyPresenceCache.get(stateDir);
	if (hasLegacy === void 0) {
		hasLegacy = fs.existsSync(path.join(stateDir, "identity", "device-auth.json"));
		legacyPresenceCache.set(stateDir, hasLegacy);
	}
	if (hasLegacy) throw new Error("Legacy device auth requires migration; stop the Gateway and run `openclaw doctor --fix`.");
}
/** Forget one process-local legacy-state probe after Doctor removes the source. */
function resetLegacyDeviceAuthPresenceCache(env) {
	legacyPresenceCache.delete(resolveStateDir(env));
}
function fromRow(row) {
	try {
		const scopes = JSON.parse(row.scopes_json);
		if (!Array.isArray(scopes)) return null;
		return {
			token: row.token,
			role: row.role,
			scopes: normalizeDeviceAuthScopes(scopes),
			updatedAtMs: row.updated_at_ms
		};
	} catch {
		return null;
	}
}
function readDeviceAuthTokenFromDatabase(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_auth_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return row ? fromRow(row) : null;
}
function readOriginDeviceTokenFromDatabase(db, params) {
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_origin_device_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return row ? fromRow(row) : null;
}
function createDeviceAuthEntry(params) {
	return {
		token: params.token,
		role: normalizeDeviceAuthRole(params.role),
		scopes: normalizeDeviceAuthScopes(params.scopes),
		updatedAtMs: Date.now()
	};
}
/** Load one cached device-auth token from the shared SQLite state store. */
function loadDeviceAuthToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	const { db } = openOpenClawStateDatabase({ env: params.env });
	return readDeviceAuthTokenFromDatabase(db, params);
}
/** Load one cached device-auth token without creating or joining writable state. */
function loadDeviceAuthTokenReadOnly(params) {
	assertNoLegacyDeviceAuth(params.env);
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		return readDeviceAuthTokenFromDatabase(db, params);
	}, { env: params.env }) ?? null;
}
/** List cached role tokens for one device from the shared SQLite state store. */
function loadDeviceAuthTokens(params) {
	assertNoLegacyDeviceAuth(params.env);
	const { db } = openOpenClawStateDatabase({ env: params.env });
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("device_auth_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("device_id", "=", params.deviceId).orderBy("role")).rows.flatMap((row) => {
		const entry = fromRow(row);
		return entry ? [entry] : [];
	});
}
/** Persist or replace one device-auth role token in the shared SQLite state store. */
function storeDeviceAuthToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	const entry = createDeviceAuthEntry(params);
	let stored = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		stored = (params.expectedToken === void 0 ? executeSqliteQuerySync(db, kysely.insertInto("device_auth_tokens").values({
			device_id: params.deviceId,
			role: entry.role,
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}).onConflict((conflict) => conflict.columns(["device_id", "role"]).doUpdateSet({
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}))) : executeSqliteQuerySync(db, kysely.updateTable("device_auth_tokens").set({
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}).where("device_id", "=", params.deviceId).where("role", "=", entry.role).where("token", "=", params.expectedToken))).numAffectedRows === 1n;
	}, { env: params.env });
	return stored ? entry : null;
}
/** Remove one role token for the current gateway device from shared SQLite state. */
function clearDeviceAuthToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	let cleared = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const baseQuery = getNodeSqliteKysely(db).deleteFrom("device_auth_tokens").where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role));
		cleared = executeSqliteQuerySync(db, params.expectedToken === void 0 ? baseQuery : baseQuery.where("token", "=", params.expectedToken)).numAffectedRows === 1n;
	}, { env: params.env });
	return cleared;
}
/** Load one device token bound to an exact normalized gateway origin. */
function loadOriginDeviceToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	const { db } = openOpenClawStateDatabase({ env: params.env });
	return readOriginDeviceTokenFromDatabase(db, params);
}
/** Load one origin-bound device token without schema creation or writable state access. */
function loadOriginDeviceTokenReadOnly(params) {
	assertNoLegacyDeviceAuth(params.env);
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => {
		return readOriginDeviceTokenFromDatabase(db, params);
	}, { env: params.env }) ?? null;
}
/** Persist one device token under an exact normalized gateway origin. */
function storeOriginDeviceToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	const entry = createDeviceAuthEntry(params);
	let stored = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		stored = (params.expectedToken === void 0 ? executeSqliteQuerySync(db, kysely.insertInto("gateway_origin_device_tokens").values({
			gateway_scope: params.gatewayScope,
			device_id: params.deviceId,
			role: entry.role,
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}).onConflict((conflict) => conflict.columns([
			"gateway_scope",
			"device_id",
			"role"
		]).doUpdateSet({
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}))) : executeSqliteQuerySync(db, kysely.updateTable("gateway_origin_device_tokens").set({
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}).where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", entry.role).where("token", "=", params.expectedToken))).numAffectedRows === 1n;
	}, { env: params.env });
	return stored ? entry : null;
}
/** Remove one device token only from its exact normalized gateway origin. */
function clearOriginDeviceToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	let cleared = false;
	runOpenClawStateWriteTransaction(({ db }) => {
		const baseQuery = getNodeSqliteKysely(db).deleteFrom("gateway_origin_device_tokens").where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role));
		cleared = executeSqliteQuerySync(db, params.expectedToken === void 0 ? baseQuery : baseQuery.where("token", "=", params.expectedToken)).numAffectedRows === 1n;
	}, { env: params.env });
	return cleared;
}
//#endregion
export { loadDeviceAuthTokens as a, resetLegacyDeviceAuthPresenceCache as c, loadDeviceAuthTokenReadOnly as i, storeDeviceAuthToken as l, clearOriginDeviceToken as n, loadOriginDeviceToken as o, loadDeviceAuthToken as r, loadOriginDeviceTokenReadOnly as s, clearDeviceAuthToken as t, storeOriginDeviceToken as u };
