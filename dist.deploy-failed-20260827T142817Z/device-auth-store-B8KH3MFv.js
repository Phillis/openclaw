import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import fs from "node:fs";
import path from "node:path";
//#region src/infra/device-auth-store.ts
const legacyPresenceCache = /* @__PURE__ */ new Map();
const ensuredOriginDatabases = /* @__PURE__ */ new WeakSet();
const ORIGIN_DEVICE_AUTH_SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS gateway_origin_device_tokens (
  gateway_scope TEXT NOT NULL,
  device_id TEXT NOT NULL,
  role TEXT NOT NULL,
  token TEXT NOT NULL,
  scopes_json TEXT NOT NULL,
  updated_at_ms INTEGER NOT NULL,
  PRIMARY KEY (gateway_scope, device_id, role)
) STRICT;
`;
function ensureOriginDeviceAuthSchema(env) {
	assertNoLegacyDeviceAuth(env);
	const options = env ? { env } : {};
	const database = openOpenClawStateDatabase(options);
	if (ensuredOriginDatabases.has(database.db)) return;
	runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(ORIGIN_DEVICE_AUTH_SCHEMA_SQL);
	}, options, { operationLabel: "device-auth.origin.schema.ensure" });
	ensuredOriginDatabases.add(database.db);
}
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
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_auth_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return row ? fromRow(row) : null;
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
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("device_auth_tokens").values({
			device_id: params.deviceId,
			role: entry.role,
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		}).onConflict((conflict) => conflict.columns(["device_id", "role"]).doUpdateSet({
			token: entry.token,
			scopes_json: JSON.stringify(entry.scopes),
			updated_at_ms: entry.updatedAtMs
		})));
	}, { env: params.env });
	return entry;
}
/** Remove one role token for the current gateway device from shared SQLite state. */
function clearDeviceAuthToken(params) {
	assertNoLegacyDeviceAuth(params.env);
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("device_auth_tokens").where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	}, { env: params.env });
}
/** Load one device token bound to an exact normalized gateway origin. */
function loadOriginDeviceToken(params) {
	ensureOriginDeviceAuthSchema(params.env);
	const { db } = openOpenClawStateDatabase({ env: params.env });
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("gateway_origin_device_tokens").select([
		"token",
		"role",
		"scopes_json",
		"updated_at_ms"
	]).where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	return row ? fromRow(row) : null;
}
/** Persist one device token under an exact normalized gateway origin. */
function storeOriginDeviceToken(params) {
	ensureOriginDeviceAuthSchema(params.env);
	const entry = createDeviceAuthEntry(params);
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("gateway_origin_device_tokens").values({
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
		})));
	}, { env: params.env });
	return entry;
}
/** Remove one device token only from its exact normalized gateway origin. */
function clearOriginDeviceToken(params) {
	ensureOriginDeviceAuthSchema(params.env);
	runOpenClawStateWriteTransaction(({ db }) => {
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("gateway_origin_device_tokens").where("gateway_scope", "=", params.gatewayScope).where("device_id", "=", params.deviceId).where("role", "=", normalizeDeviceAuthRole(params.role)));
	}, { env: params.env });
}
//#endregion
export { loadOriginDeviceToken as a, storeOriginDeviceToken as c, loadDeviceAuthTokens as i, clearOriginDeviceToken as n, resetLegacyDeviceAuthPresenceCache as o, loadDeviceAuthToken as r, storeDeviceAuthToken as s, clearDeviceAuthToken as t };
