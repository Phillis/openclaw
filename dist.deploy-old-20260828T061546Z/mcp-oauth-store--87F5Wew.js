import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { Bt as tableExists, L as ensureMcpOAuthPendingSchema, Mn as executeSqliteQueryTakeFirstSync, Nn as getNodeSqliteKysely, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQuerySync } from "./openclaw-state-db-kmBThqu6.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { a as sanitizeServerName } from "./agent-bundle-mcp-names-CP3ugHLh.js";
import { createHash } from "node:crypto";
import { OAuthClientInformationSchema, OAuthMetadataSchema, OAuthProtectedResourceMetadataSchema, OAuthTokensSchema, OpenIdProviderDiscoveryMetadataSchema } from "@modelcontextprotocol/sdk/shared/auth.js";
//#region src/agents/mcp-oauth-identity.ts
function operatorMcpOAuthIdentity(serverName, serverUrl) {
	return {
		storeKey: `${sanitizeServerName(serverName, /* @__PURE__ */ new Set())}-${createHash("sha256").update(serverName).update("\0").update(serverUrl).digest("hex").slice(0, 16)}`,
		principal: "operator",
		serverName,
		serverUrl
	};
}
function requesterMcpOAuthIdentity(serverName, serverUrl, scope) {
	const operator = operatorMcpOAuthIdentity(serverName, serverUrl);
	const requesterHash = createHash("sha256").update(scope.messageChannel ?? "").update("\0").update(scope.agentAccountId ?? "").update("\0").update(scope.requesterSenderId).digest("hex");
	return {
		...operator,
		storeKey: `${operator.storeKey}-r-${requesterHash.slice(0, 16)}`,
		principal: "requester"
	};
}
function requesterMcpOAuthStoreKeyPrefix(serverName, serverUrl) {
	return `${operatorMcpOAuthIdentity(serverName, serverUrl).storeKey}-r-`;
}
function mcpOAuthStoreKeyFromLegacyFileName(fileName) {
	return /^[A-Za-z][A-Za-z0-9_-]{0,29}-[0-9a-f]{16}\.json$/u.test(fileName) ? fileName.slice(0, -5) : null;
}
//#endregion
//#region src/agents/mcp-oauth-store.ts
const MCP_OAUTH_STORE_FORMAT_VERSION = 1;
const UNINITIALIZED_STORE_FIELDS = /* @__PURE__ */ new Set(["credentialState", "pendingAuthorizationChallenge"]);
const pendingSchemaDatabases = /* @__PURE__ */ new WeakSet();
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
function assertOptionalString(storeKey, store, field) {
	const value = store[field];
	if (value !== void 0 && (typeof value !== "string" || value.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, `${field} must be a non-empty string`);
}
function assertDiscoveryState(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value) || typeof value.authorizationServerUrl !== "string") throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState is invalid");
	if (!URL.canParse(value.authorizationServerUrl)) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadataUrl !== void 0 && (typeof value.resourceMetadataUrl !== "string" || !URL.canParse(value.resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState URLs are invalid");
	if (value.resourceMetadata !== void 0 && !OAuthProtectedResourceMetadataSchema.safeParse(value.resourceMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState resource metadata is invalid");
	if (value.authorizationServerMetadata !== void 0 && !OAuthMetadataSchema.safeParse(value.authorizationServerMetadata).success && !OpenIdProviderDiscoveryMetadataSchema.safeParse(value.authorizationServerMetadata).success) throw new McpOAuthStoreCorruptionError(storeKey, "discoveryState authorization server metadata is invalid");
}
function assertAuthorizationChallenge(storeKey, value) {
	if (value === void 0) return;
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge is invalid");
	const resourceMetadataUrl = value.resourceMetadataUrl;
	if (resourceMetadataUrl !== void 0 && (typeof resourceMetadataUrl !== "string" || !URL.canParse(resourceMetadataUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge URL is invalid");
	const scope = value.scope;
	if (scope !== void 0 && (typeof scope !== "string" || scope.length === 0)) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge scope is invalid");
	if (value.requiresAuthorization !== void 0 && value.requiresAuthorization !== true) throw new McpOAuthStoreCorruptionError(storeKey, "pendingAuthorizationChallenge requiresAuthorization must be true");
}
/** Parse a canonical row without discarding SDK extension fields. */
function parseMcpOAuthStoreJson(storeKey, raw) {
	let value;
	try {
		value = JSON.parse(raw);
	} catch (error) {
		throw new McpOAuthStoreCorruptionError(storeKey, "store_json is not valid JSON", { cause: error });
	}
	if (!isRecord(value)) throw new McpOAuthStoreCorruptionError(storeKey, "store_json must contain an object");
	if (value.clientInformation !== void 0 && !OAuthClientInformationSchema.safeParse(value.clientInformation).success) throw new McpOAuthStoreCorruptionError(storeKey, "clientInformation is invalid");
	if (value.tokens !== void 0 && !OAuthTokensSchema.safeParse(value.tokens).success) throw new McpOAuthStoreCorruptionError(storeKey, "tokens are invalid");
	if (value.credentialState !== void 0 && value.credentialState !== "uninitialized" && value.credentialState !== "cleared") throw new McpOAuthStoreCorruptionError(storeKey, "credentialState is invalid");
	if (value.credentialState !== void 0 && value.tokens !== void 0) throw new McpOAuthStoreCorruptionError(storeKey, "credentialState cannot coexist with tokens");
	if (value.credentialState === "uninitialized" && Object.keys(value).some((field) => !UNINITIALIZED_STORE_FIELDS.has(field))) throw new McpOAuthStoreCorruptionError(storeKey, "uninitialized credential state contains authoritative OAuth fields");
	if (value.tokenExpiresAt !== void 0 && (!Number.isFinite(value.tokenExpiresAt) || value.tokenExpiresAt < 0)) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt is invalid");
	if (value.tokenExpiresAt !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokenExpiresAt requires tokens");
	if (value.tokensAuthorizationServerUrl !== void 0 && (typeof value.tokensAuthorizationServerUrl !== "string" || !URL.canParse(value.tokensAuthorizationServerUrl))) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl is invalid");
	if (value.tokensAuthorizationServerUrl !== void 0 && value.tokens === void 0) throw new McpOAuthStoreCorruptionError(storeKey, "tokensAuthorizationServerUrl requires tokens");
	assertOptionalString(storeKey, value, "codeVerifier");
	assertOptionalString(storeKey, value, "lastAuthorizationUrl");
	assertOptionalString(storeKey, value, "redirectUrl");
	assertDiscoveryState(storeKey, value.discoveryState);
	assertAuthorizationChallenge(storeKey, value.pendingAuthorizationChallenge);
	return value;
}
function storeFromRow(storeKey, row) {
	if (!row) return {};
	if (row.format_version !== MCP_OAUTH_STORE_FORMAT_VERSION) throw new McpOAuthStoreCorruptionError(storeKey, `unsupported format version ${row.format_version}`);
	return parseMcpOAuthStoreJson(storeKey, row.store_json);
}
function readFromDatabase(database, storeKey) {
	return storeFromRow(storeKey, executeSqliteQueryTakeFirstSync(database, getNodeSqliteKysely(database).selectFrom("mcp_oauth_stores").select(["format_version", "store_json"]).where("store_key", "=", storeKey)));
}
/** Read canonical state, opening the writable lifecycle when runtime owns it. */
function readMcpOAuthStore(storeKey) {
	return readFromDatabase(openOpenClawStateDatabase().db, storeKey);
}
/** Read status state without creating or repairing the shared database. */
function readMcpOAuthStoreReadOnly(storeKey) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "mcp_oauth_stores")) return {};
		return readFromDatabase(db, storeKey);
	}) ?? {};
}
/** List canonical store keys matching one server/principal prefix without creating state. */
function listMcpOAuthStoreKeysByPrefix(prefix) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "mcp_oauth_stores")) return [];
		return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("mcp_oauth_stores").select("store_key").orderBy("store_key", "asc")).rows.map((row) => row.store_key).filter((storeKey) => storeKey.startsWith(prefix));
	}) ?? [];
}
function ensurePendingSchema(database) {
	if (pendingSchemaDatabases.has(database)) return;
	ensureMcpOAuthPendingSchema(database);
	pendingSchemaDatabases.add(database);
}
function runPendingWrite(run) {
	ensurePendingSchema(openOpenClawStateDatabase().db);
	return runOpenClawStateWriteTransaction(({ db }) => run(db));
}
function deletePendingForStore(database, storeKey, assertOwnedInTransaction) {
	assertOwnedInTransaction?.(database);
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", storeKey));
}
/**
* Sign-in links are channel-visible bearer state; a bounded lifetime caps how
* long a copied link stays completable. Enforced at lookup AND claim.
*/
const MCP_OAUTH_PENDING_STATE_TTL_MS = 600 * 1e3;
/** Resolve one OAuth callback state without scanning credential JSON. */
function readMcpOAuthPendingAuthorization(state) {
	return withExistingOpenClawStateDatabaseReadOnly(({ db }) => {
		if (!tableExists(db, "mcp_oauth_pending_authorizations")) return;
		return executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("mcp_oauth_pending_authorizations").select("store_key").where("state", "=", state).where("create_time", ">", Date.now() - MCP_OAUTH_PENDING_STATE_TTL_MS))?.store_key;
	});
}
/** Claim one exact unexpired callback state while its store lease is still owned. */
function consumeOAuthState(storeKey, state, assertOwnedInTransaction) {
	return runPendingWrite((database) => {
		assertOwnedInTransaction?.(database);
		return executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "=", storeKey).where("state", "=", state).where("create_time", ">", Date.now() - MCP_OAUTH_PENDING_STATE_TTL_MS)).numAffectedRows === 1n;
	});
}
/** Replace one store's pending callback state after OAuth persisted its session. */
function writeMcpOAuthPendingAuthorization(storeKey, state, assertOwnedInTransaction) {
	runPendingWrite((database) => {
		const now = Date.now();
		assertOwnedInTransaction?.(database);
		executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("create_time", "<=", now - MCP_OAUTH_PENDING_STATE_TTL_MS));
		deletePendingForStore(database, storeKey);
		executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("mcp_oauth_pending_authorizations").values({
			state,
			store_key: storeKey,
			create_time: now
		}));
	});
}
/** Delete callback correlation for one settled or cleared OAuth store. */
function deleteMcpOAuthPendingAuthorization(storeKey, assertOwnedInTransaction) {
	runPendingWrite((database) => {
		deletePendingForStore(database, storeKey, assertOwnedInTransaction);
	});
}
/** Delete callback correlation for every requester store under one server key prefix. */
function deleteMcpOAuthPendingAuthorizationsByPrefix(prefix) {
	runPendingWrite((database) => {
		executeSqliteQuerySync(database, getNodeSqliteKysely(database).deleteFrom("mcp_oauth_pending_authorizations").where("store_key", "like", `${prefix}%`));
	});
}
function replaceMcpOAuthStore(database, storeKey, next, assertOwnedInTransaction) {
	const storeJson = JSON.stringify(next);
	parseMcpOAuthStoreJson(storeKey, storeJson);
	assertOwnedInTransaction?.(database);
	const updatedAt = Date.now();
	executeSqliteQuerySync(database, getNodeSqliteKysely(database).insertInto("mcp_oauth_stores").values({
		store_key: storeKey,
		format_version: MCP_OAUTH_STORE_FORMAT_VERSION,
		store_json: storeJson,
		updated_at: updatedAt
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		format_version: MCP_OAUTH_STORE_FORMAT_VERSION,
		store_json: storeJson,
		updated_at: updatedAt
	})));
	return next;
}
/** Atomically read, modify, and replace one OAuth session row. */
function updateMcpOAuthStore(storeKey, update, assertOwnedInTransaction) {
	return runOpenClawStateWriteTransaction(({ db }) => {
		return replaceMcpOAuthStore(db, storeKey, update(readFromDatabase(db, storeKey)), assertOwnedInTransaction);
	});
}
/** Clear one OAuth session while retaining an authoritative canonical row. */
function clearMcpOAuthStore(storeKey, assertOwnedInTransaction) {
	runPendingWrite((db) => {
		replaceMcpOAuthStore(db, storeKey, { credentialState: "cleared" }, assertOwnedInTransaction);
		deletePendingForStore(db, storeKey, assertOwnedInTransaction);
	});
}
//#endregion
export { listMcpOAuthStoreKeysByPrefix as a, readMcpOAuthStore as c, writeMcpOAuthPendingAuthorization as d, mcpOAuthStoreKeyFromLegacyFileName as f, requesterMcpOAuthStoreKeyPrefix as h, deleteMcpOAuthPendingAuthorizationsByPrefix as i, readMcpOAuthStoreReadOnly as l, requesterMcpOAuthIdentity as m, consumeOAuthState as n, parseMcpOAuthStoreJson as o, operatorMcpOAuthIdentity as p, deleteMcpOAuthPendingAuthorization as r, readMcpOAuthPendingAuthorization as s, clearMcpOAuthStore as t, updateMcpOAuthStore as u };
