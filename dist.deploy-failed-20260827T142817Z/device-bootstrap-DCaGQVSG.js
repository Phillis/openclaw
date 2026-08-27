import { D as resolveExpiresAtMsFromDurationMs, o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import { t as asNonArrayRecord } from "./record-coerce-DItp3I4t.js";
import { t as createAsyncLock } from "./async-lock-CaiUOILd.js";
import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./json-files-C6dF5uZO.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-D5QeoU_L.js";
import { F as ensureDevicePairSetupCompletionSchema, Mt as tableExists, Nt as tableHasColumn, P as ensureDevicePairSetupBootstrapSchema, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { t as safeEqualSecret } from "./secret-equal-DRsL8lKD.js";
import { n as normalizeDeviceAuthScopes, t as normalizeDeviceAuthRole } from "./device-auth-C-STNejO.js";
import { a as normalizeDevicePublicKeyBase64Url } from "./device-identity-BTcjEaGA.js";
import { r as roleScopesAllow } from "./operator-scope-compat-C7_b0yme.js";
import { randomBytes, randomUUID } from "node:crypto";
import path from "node:path";
//#region src/shared/device-bootstrap-profile.ts
/** Operator scopes allowed to cross the short-lived bootstrap handoff boundary. */
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPES = [
	"operator.approvals",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET = new Set(BOOTSTRAP_HANDOFF_OPERATOR_SCOPES);
/** Full browser-owner scopes allowed only by the host-issued Control UI profile. */
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES = [
	"operator.admin",
	"operator.approvals",
	"operator.pairing",
	"operator.questions",
	"operator.read",
	"operator.talk.secrets",
	"operator.write"
];
const CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET = new Set(CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES);
/** Full native-mobile operator scopes allowed only by the closed mobile setup profile. */
const MOBILE_FULL_ACCESS_OPERATOR_SCOPES = ["operator.admin", ...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES];
const MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET = new Set(MOBILE_FULL_ACCESS_OPERATOR_SCOPES);
const VOICE_NODE_OPERATOR_SCOPE_SET = /* @__PURE__ */ new Set(["operator.read", "operator.talk"]);
/** Existing least-privilege setup-code/QR profile. */
const PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...BOOTSTRAP_HANDOFF_OPERATOR_SCOPES]
};
/** Full browser-owner profile issued only by dashboard and graphical onboarding. */
const CONTROL_UI_OWNER_BOOTSTRAP_PROFILE = {
	roles: ["operator"],
	scopes: [...CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPES],
	purpose: "control-ui-owner"
};
/** Full native-mobile setup profile for explicitly authorized setup surfaces. */
const FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: [...MOBILE_FULL_ACCESS_OPERATOR_SCOPES],
	purpose: "mobile-full"
};
/** Node-only setup profile for companions that never act as operators. */
const NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node"],
	scopes: []
};
/** Room/embedded voice profile: node capabilities plus least-privilege Talk RPCs. */
const VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE = {
	roles: ["node", "operator"],
	scopes: ["operator.read", "operator.talk"],
	purpose: "voice-node"
};
/** Compare normalized bootstrap profiles, including their closed purpose. */
function deviceBootstrapProfilesEqual(left, right) {
	const profile = normalizeDeviceBootstrapProfile(left);
	const expected = normalizeDeviceBootstrapProfile(right);
	return profile.purpose === expected.purpose && profile.roles.length === expected.roles.length && profile.scopes.length === expected.scopes.length && profile.roles.every((role, index) => role === expected.roles[index]) && profile.scopes.every((scope, index) => scope === expected.scopes[index]);
}
function matchesBootstrapProfile(input, expected) {
	return deviceBootstrapProfilesEqual(input, expected);
}
/** Return whether an input matches either supported native-mobile setup profile. */
function isMobilePairingSetupBootstrapProfile(input) {
	return isPairingSetupBootstrapProfile(input) || matchesBootstrapProfile(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the existing limited setup profile. */
function isPairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Return whether an input exactly matches the node-only companion setup profile. */
function isNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
function resolvePairingSetupAccess(input) {
	if (deviceBootstrapProfilesEqual(input, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "full";
	if (deviceBootstrapProfilesEqual(input, NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE)) return "node";
	return "limited";
}
/** Return whether an input exactly matches the embedded voice-node setup profile. */
function isVoiceNodePairingSetupBootstrapProfile(input) {
	return matchesBootstrapProfile(input, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE);
}
/** Resolve the subset of requested scopes a bootstrap profile may carry for one role. */
function resolveBootstrapProfileScopesForRole(role, scopes, purpose) {
	const normalizedRole = normalizeDeviceAuthRole(role);
	const normalizedScopes = normalizeDeviceAuthScopes(Array.from(scopes));
	if (normalizedRole === "operator") {
		const allowedScopes = purpose === "control-ui-owner" ? CONTROL_UI_OWNER_BOOTSTRAP_OPERATOR_SCOPE_SET : purpose === "mobile-full" ? MOBILE_FULL_ACCESS_OPERATOR_SCOPE_SET : purpose === "voice-node" ? VOICE_NODE_OPERATOR_SCOPE_SET : BOOTSTRAP_HANDOFF_OPERATOR_SCOPE_SET;
		return normalizedScopes.filter((scope) => allowedScopes.has(scope));
	}
	return [];
}
/** Resolve bounded bootstrap handoff scopes across a role set. */
function resolveBootstrapProfileScopesForRoles(roles, scopes, purpose) {
	return normalizeDeviceAuthScopes(roles.flatMap((role) => resolveBootstrapProfileScopesForRole(role, scopes, purpose)));
}
/** Resolve one role's scopes directly from a normalized bootstrap profile. */
function resolveDeviceProfileRoleScopes(profile, role, scopes = profile.scopes) {
	return resolveBootstrapProfileScopesForRole(role, scopes, profile.purpose);
}
/** Resolve role-set scopes directly from a normalized bootstrap profile. */
function resolveDeviceProfileScopes(profile, roles, scopes = profile.scopes) {
	return resolveBootstrapProfileScopesForRoles(roles, scopes, profile.purpose);
}
/** Normalize a requested bootstrap profile and strip scopes outside the handoff allowlist. */
function normalizeDeviceBootstrapHandoffProfile(input) {
	const profile = normalizeDeviceBootstrapProfile(input);
	return {
		roles: profile.roles,
		scopes: resolveBootstrapProfileScopesForRoles(profile.roles, profile.scopes, profile.purpose),
		...profile.purpose ? { purpose: profile.purpose } : {}
	};
}
function normalizeBootstrapRoles(roles) {
	if (!Array.isArray(roles)) return [];
	const out = /* @__PURE__ */ new Set();
	for (const role of roles) {
		const normalized = normalizeDeviceAuthRole(role);
		if (normalized) out.add(normalized);
	}
	return [...out].toSorted();
}
/** Normalize caller-provided bootstrap roles/scopes without applying handoff bounds. */
function normalizeDeviceBootstrapProfile(input) {
	const purpose = input?.purpose === "control-ui" || input?.purpose === "control-ui-owner" || input?.purpose === "mobile-full" || input?.purpose === "voice-node" ? input.purpose : void 0;
	return {
		roles: normalizeBootstrapRoles(input?.roles),
		scopes: normalizeDeviceAuthScopes(input?.scopes ? [...input.scopes] : []),
		...purpose ? { purpose } : {}
	};
}
//#endregion
//#region src/infra/push-apns-store-transaction.ts
/** Advances a registration/tombstone version without reusing an observed owner version. */
function nextApnsRegistrationVersion(nodeId, previousVersions) {
	let latest = -1;
	for (const version of previousVersions) {
		if (!Number.isSafeInteger(version) || version < 0) throw new Error(`invalid APNs registration version for node ${nodeId}`);
		latest = Math.max(latest, version);
	}
	if (latest === Number.MAX_SAFE_INTEGER) throw new Error(`APNs registration version exhausted for node ${nodeId}`);
	return Math.max(Date.now(), latest + 1);
}
/** Tombstones and deletes one APNs owner inside the caller's shared-state transaction. */
function clearApnsRegistrationFromDatabase(db, nodeId) {
	const normalizedNodeId = nodeId.trim();
	if (!normalizedNodeId) return false;
	const stateDb = getNodeSqliteKysely(db);
	const currentRow = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registrations").select("updated_at_ms").where("node_id", "=", normalizedNodeId));
	const tombstone = executeSqliteQueryTakeFirstSync(db, stateDb.selectFrom("apns_registration_tombstones").select("deleted_at_ms").where("node_id", "=", normalizedNodeId));
	const deletedAtMs = nextApnsRegistrationVersion(normalizedNodeId, [currentRow?.updated_at_ms, tombstone?.deleted_at_ms].filter((version) => version !== void 0));
	executeSqliteQuerySync(db, stateDb.insertInto("apns_registration_tombstones").values({
		node_id: normalizedNodeId,
		deleted_at_ms: deletedAtMs
	}).onConflict((conflict) => conflict.column("node_id").doUpdateSet({ deleted_at_ms: deletedAtMs })));
	executeSqliteQuerySync(db, stateDb.deleteFrom("apns_registrations").where("node_id", "=", normalizedNodeId));
	return currentRow !== void 0;
}
//#endregion
//#region src/infra/device-pairing-store.ts
const DEVICE_BOOTSTRAP_TOKEN_COLUMNS_WITHOUT_SETUP = [
	"device_id",
	"issued_at_ms",
	"last_used_at_ms",
	"pending_profile_json",
	"profile_json",
	"public_key",
	"redeemed_profile_json",
	"token",
	"token_key",
	"ts"
];
let devicePairingStoreCache;
/** Route an explicit pairing base dir (tests, alternate state roots) to that dir's DB. */
function resolveDevicePairingStateDbOptions(baseDir) {
	return baseDir ? { env: {
		...process.env,
		OPENCLAW_STATE_DIR: baseDir
	} } : {};
}
function readDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
function readTotalChanges(database) {
	const row = database.prepare("SELECT total_changes() AS value").get();
	if (typeof row.value !== "number") throw new Error("SQLite did not return a numeric total_changes() value");
	return row.value;
}
function readDevicePairingStoreValidityToken(database) {
	return {
		dataVersion: readDataVersion(database),
		totalChanges: readTotalChanges(database)
	};
}
function devicePairingStoreValidityTokensEqual(left, right) {
	return left.dataVersion === right.dataVersion && left.totalChanges === right.totalChanges;
}
function invalidateDevicePairingStoreCache(database) {
	if (devicePairingStoreCache?.connection === database.db && devicePairingStoreCache.path === database.path) devicePairingStoreCache = void 0;
}
function runDevicePairingStoreMutation(baseDir, mutate) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	const result = runOpenClawStateWriteTransaction(mutate, {
		...databaseOptions,
		database
	});
	if (result.mutated) invalidateDevicePairingStoreCache(database);
	return result.value;
}
const APPROVAL_KINDS = new Set(Object.keys({
	owner: true,
	silent: true,
	"trusted-cidr": true,
	"trusted-proxy": true,
	"ssh-verified": true,
	bootstrap: true
}));
function toJsonColumn(value) {
	return value === void 0 ? null : JSON.stringify(value);
}
function fromJsonColumn(value) {
	return value === null ? void 0 : JSON.parse(value);
}
function toBooleanColumn(value) {
	return value === void 0 ? null : value ? 1 : 0;
}
function optional(key, value) {
	return value === null ? {} : { [key]: value };
}
function toPendingRow(record) {
	return {
		request_id: record.requestId,
		device_id: record.deviceId,
		public_key: record.publicKey,
		display_name: record.displayName ?? null,
		platform: record.platform ?? null,
		device_family: record.deviceFamily ?? null,
		client_id: record.clientId ?? null,
		client_mode: record.clientMode ?? null,
		browser_origin: record.browserOrigin ?? null,
		role: record.role ?? null,
		roles_json: toJsonColumn(record.roles),
		scopes_json: toJsonColumn(record.scopes),
		remote_ip: record.remoteIp ?? null,
		silent: toBooleanColumn(record.silent),
		is_repair: toBooleanColumn(record.isRepair),
		ts: record.ts,
		refreshed_at_ms: record.refreshedAtMs ?? null
	};
}
function fromPendingRow(row) {
	return {
		requestId: row.request_id,
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("silent", row.silent === null ? null : row.silent !== 0),
		...optional("isRepair", row.is_repair === null ? null : row.is_repair !== 0),
		ts: row.ts,
		...optional("refreshedAtMs", row.refreshed_at_ms)
	};
}
function toPairedRow(device) {
	return {
		device_id: device.deviceId,
		public_key: device.publicKey,
		display_name: device.displayName ?? null,
		operator_label: device.operatorLabel ?? null,
		platform: device.platform ?? null,
		device_family: device.deviceFamily ?? null,
		client_id: device.clientId ?? null,
		client_mode: device.clientMode ?? null,
		browser_origin: device.browserOrigin ?? null,
		role: device.role ?? null,
		roles_json: toJsonColumn(device.roles),
		scopes_json: toJsonColumn(device.scopes),
		approved_scopes_json: toJsonColumn(device.approvedScopes),
		remote_ip: device.remoteIp ?? null,
		tokens_json: toJsonColumn(device.tokens),
		approved_via: device.approvedVia ?? null,
		node_surface_json: toJsonColumn(device.nodeSurface),
		pending_node_surface_json: toJsonColumn(device.pendingNodeSurface),
		created_at_ms: device.createdAtMs,
		approved_at_ms: device.approvedAtMs,
		last_seen_at_ms: device.lastSeenAtMs ?? null,
		last_seen_reason: device.lastSeenReason ?? null
	};
}
function fromApprovedViaColumn(value) {
	return value !== null && APPROVAL_KINDS.has(value) ? value : null;
}
const PAIRING_SETUP_ACCESS_VALUES = new Set(Object.keys({
	full: true,
	limited: true,
	node: true
}));
function fromSetupCompletionAccessColumn(value) {
	return PAIRING_SETUP_ACCESS_VALUES.has(value) ? value : "limited";
}
function fromSetupCompletionDeliveryStateColumn(value) {
	return value === "confirmed" ? "confirmed" : "uncertain";
}
function fromPairedRow(row) {
	return {
		deviceId: row.device_id,
		publicKey: row.public_key,
		...optional("displayName", row.display_name),
		...optional("operatorLabel", row.operator_label),
		...optional("platform", row.platform),
		...optional("deviceFamily", row.device_family),
		...optional("clientId", row.client_id),
		...optional("clientMode", row.client_mode),
		...optional("browserOrigin", row.browser_origin),
		...optional("role", row.role),
		...optional("roles", fromJsonColumn(row.roles_json) ?? null),
		...optional("scopes", fromJsonColumn(row.scopes_json) ?? null),
		...optional("approvedScopes", fromJsonColumn(row.approved_scopes_json) ?? null),
		...optional("remoteIp", row.remote_ip),
		...optional("tokens", fromJsonColumn(row.tokens_json) ?? null),
		...optional("approvedVia", fromApprovedViaColumn(row.approved_via)),
		...optional("nodeSurface", fromJsonColumn(row.node_surface_json) ?? null),
		...optional("pendingNodeSurface", fromJsonColumn(row.pending_node_surface_json) ?? null),
		createdAtMs: row.created_at_ms,
		approvedAtMs: row.approved_at_ms,
		...optional("lastSeenAtMs", row.last_seen_at_ms),
		...optional("lastSeenReason", row.last_seen_reason)
	};
}
function toBootstrapRow(tokenKey, record) {
	return {
		token_key: tokenKey,
		token: record.token,
		setup_id: record.setupId ?? null,
		ts: record.ts,
		device_id: record.deviceId ?? null,
		public_key: record.publicKey ?? null,
		profile_json: toJsonColumn(record.profile),
		redeemed_profile_json: toJsonColumn(record.redeemedProfile),
		pending_profile_json: toJsonColumn(record.pendingProfile),
		issued_at_ms: record.issuedAtMs,
		last_used_at_ms: record.lastUsedAtMs ?? null
	};
}
function fromBootstrapRow(row) {
	return {
		token: row.token,
		...optional("setupId", row.setup_id),
		ts: row.ts,
		...optional("deviceId", row.device_id),
		...optional("publicKey", row.public_key),
		...optional("profile", fromJsonColumn(row.profile_json) ?? null),
		...optional("redeemedProfile", fromJsonColumn(row.redeemed_profile_json) ?? null),
		...optional("pendingProfile", fromJsonColumn(row.pending_profile_json) ?? null),
		issuedAtMs: row.issued_at_ms,
		...optional("lastUsedAtMs", row.last_used_at_ms)
	};
}
/** Load the full pending + paired device snapshot from the shared state DB. */
function loadDevicePairingStoreState(baseDir) {
	const database = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	const { db } = database;
	const validityToken = readDevicePairingStoreValidityToken(db);
	if (devicePairingStoreCache?.connection === db && devicePairingStoreCache.path === database.path && devicePairingStoreValidityTokensEqual(devicePairingStoreCache.validityToken, validityToken)) return structuredClone(devicePairingStoreCache.state);
	const kysely = getNodeSqliteKysely(db);
	const pendingById = {};
	for (const row of executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_pending").selectAll()).rows) pendingById[row.request_id] = fromPendingRow(row);
	const pairedByDeviceId = {};
	for (const row of executeSqliteQuerySync(db, kysely.selectFrom("device_pairing_paired").selectAll()).rows) pairedByDeviceId[row.device_id] = fromPairedRow(row);
	const state = {
		pendingById,
		pairedByDeviceId
	};
	devicePairingStoreCache = {
		connection: db,
		path: database.path,
		state: structuredClone(state),
		validityToken
	};
	return state;
}
/** Load one paired-device row without materializing either pairing table. */
function loadPairedDevicePairingStoreRecord(deviceId, baseDir) {
	const { db } = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	return loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId);
}
/** Load one paired-device row from an existing shared-state transaction. */
function loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId) {
	const normalizedDeviceId = deviceId.trim();
	if (!normalizedDeviceId) return null;
	const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("device_pairing_paired").selectAll().where("device_id", "=", normalizedDeviceId));
	return row ? fromPairedRow(row) : null;
}
/** Read, validate, and update one paired node surface in a single cross-process transaction. */
function updatePairedDeviceNodeSurfaceInTransaction(deviceId, baseDir, update) {
	return runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const normalizedDeviceId = deviceId.trim();
		const device = normalizedDeviceId ? loadPairedDevicePairingStoreRecordFromDatabase(db, normalizedDeviceId) : null;
		const result = update(device);
		if (!result.persist) return {
			mutated: false,
			value: result.value
		};
		if (!device) throw new Error("cannot update a missing paired-device node surface");
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("device_pairing_paired").set({ node_surface_json: toJsonColumn(result.nodeSurface) }).where("device_id", "=", normalizedDeviceId));
		return {
			mutated: true,
			value: result.value
		};
	});
}
/** Read, validate, and update one paired-device presence row in one transaction. */
function updatePairedDevicePresenceInTransaction(deviceId, baseDir, update) {
	return runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const normalizedDeviceId = deviceId.trim();
		const device = normalizedDeviceId ? loadPairedDevicePairingStoreRecordFromDatabase(db, normalizedDeviceId) : null;
		const result = update(device);
		if (!result.persist) return {
			mutated: false,
			value: result.value
		};
		if (!device) throw new Error("cannot update presence for a missing paired device");
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).updateTable("device_pairing_paired").set({
			last_seen_at_ms: result.lastSeenAtMs,
			last_seen_reason: result.lastSeenReason
		}).where("device_id", "=", normalizedDeviceId));
		return {
			mutated: true,
			value: result.value
		};
	});
}
/** Replace the pending and/or paired table contents with the given snapshot. */
function persistDevicePairingStoreState(state, baseDir, target, options) {
	runDevicePairingStoreMutation(baseDir, ({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		if (target !== "paired") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_pending"));
			const rows = Object.values(state.pendingById).map(toPendingRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_pending").values(rows));
		}
		if (target !== "pending") {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pairing_paired"));
			const rows = Object.values(state.pairedByDeviceId).map(toPairedRow);
			if (rows.length > 0) executeSqliteQuerySync(db, kysely.insertInto("device_pairing_paired").values(rows));
		}
		for (const nodeId of new Set(options?.clearApnsNodeIds ?? [])) clearApnsRegistrationFromDatabase(db, nodeId);
		return {
			mutated: true,
			value: void 0
		};
	});
}
/** Load all bootstrap token records keyed by token key. */
function loadDeviceBootstrapTokenRecords(baseDir) {
	const { db } = openOpenClawStateDatabase(resolveDevicePairingStateDbOptions(baseDir));
	const kysely = getNodeSqliteKysely(db);
	const state = {};
	const rows = tableHasColumn(db, "device_bootstrap_tokens", "setup_id") ? executeSqliteQuerySync(db, kysely.selectFrom("device_bootstrap_tokens").selectAll()).rows : executeSqliteQuerySync(db, kysely.selectFrom("device_bootstrap_tokens").select(DEVICE_BOOTSTRAP_TOKEN_COLUMNS_WITHOUT_SETUP)).rows.map((row) => Object.assign(row, { setup_id: null }));
	for (const row of rows) state[row.token_key] = fromBootstrapRow(row);
	return state;
}
/** Replace the bootstrap token table contents with the given snapshot. */
function persistDeviceBootstrapTokenRecords(state, baseDir) {
	runOpenClawStateWriteTransaction(({ db }) => {
		const rows = Object.entries(state).map(([tokenKey, record]) => toBootstrapRow(tokenKey, record));
		if (rows.some((row) => row.setup_id !== null)) ensureDevicePairSetupBootstrapSchema(db);
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_bootstrap_tokens"));
		if (rows.length > 0) if (tableHasColumn(db, "device_bootstrap_tokens", "setup_id")) executeSqliteQuerySync(db, kysely.insertInto("device_bootstrap_tokens").values(rows));
		else {
			const rowsWithoutSetup = rows.map(({ setup_id: _setupId, ...row }) => row);
			executeSqliteQuerySync(db, kysely.insertInto("device_bootstrap_tokens").values(rowsWithoutSetup));
		}
	}, resolveDevicePairingStateDbOptions(baseDir));
}
/** Consume one bound bootstrap credential and record its setup outcome atomically. */
function consumeDeviceBootstrapTokenWithSetupCompletionInTransaction(params) {
	const token = params.token.trim();
	const deviceId = params.deviceId.trim();
	if (!token || !deviceId) return null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureDevicePairSetupBootstrapSchema(db);
		ensureDevicePairSetupCompletionSchema(db);
		const kysely = getNodeSqliteKysely(db);
		const tokenRow = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_bootstrap_tokens").selectAll().where("token_key", "=", token).where("issued_at_ms", ">=", params.oldestValidIssuedAtMs));
		if (!tokenRow || tokenRow.token !== token || tokenRow.device_id?.trim() !== deviceId) return null;
		const record = fromBootstrapRow(tokenRow);
		const paired = record.setupId || params.pairedDeviceMatches ? loadPairedDevicePairingStoreRecordFromDatabase(db, deviceId) : null;
		if (params.pairedDeviceMatches && !params.pairedDeviceMatches(paired)) return null;
		const deviceName = paired?.operatorLabel ?? paired?.displayName;
		const completion = record.setupId ? {
			setupId: record.setupId,
			deviceId,
			...deviceName ? { deviceName } : {},
			access: resolvePairingSetupAccess(record.profile),
			completedAtMs: params.completedAtMs,
			deliveryState: "uncertain",
			retainUntilMs: params.retainUntilMs
		} : void 0;
		executeSqliteQuerySync(db, kysely.deleteFrom("device_bootstrap_tokens").where("token_key", "=", tokenRow.token_key));
		if (completion) {
			executeSqliteQuerySync(db, kysely.deleteFrom("device_pair_setup_completions").where((eb) => eb.or([eb("retain_until_ms", "<=", params.retentionNowMs), eb("setup_id", "=", completion.setupId)])));
			executeSqliteQuerySync(db, kysely.insertInto("device_pair_setup_completions").values({
				setup_id: completion.setupId,
				device_id: completion.deviceId,
				device_name: completion.deviceName ?? null,
				access: completion.access,
				completed_at_ms: completion.completedAtMs,
				delivery_state: completion.deliveryState,
				retain_until_ms: completion.retainUntilMs
			}));
		}
		return {
			record,
			...completion ? { completion } : {}
		};
	}, resolveDevicePairingStateDbOptions(params.baseDir));
}
/** Mark one consumed setup handoff as delivered without reviving an expired or replaced row. */
function confirmDevicePairSetupCompletionDeliveryInTransaction(params) {
	const setupId = params.setupId.trim();
	const deviceId = params.deviceId.trim();
	if (!setupId || !deviceId) return null;
	return runOpenClawStateWriteTransaction(({ db }) => {
		ensureDevicePairSetupCompletionSchema(db);
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.updateTable("device_pair_setup_completions").set({ delivery_state: "confirmed" }).where("setup_id", "=", setupId).where("device_id", "=", deviceId).where("retain_until_ms", ">", params.nowMs));
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pair_setup_completions").selectAll().where("setup_id", "=", setupId).where("device_id", "=", deviceId).where("retain_until_ms", ">", params.nowMs));
		return row ? {
			setupId: row.setup_id,
			deviceId: row.device_id,
			...optional("deviceName", row.device_name),
			access: fromSetupCompletionAccessColumn(row.access),
			completedAtMs: row.completed_at_ms,
			deliveryState: fromSetupCompletionDeliveryStateColumn(row.delivery_state),
			retainUntilMs: row.retain_until_ms
		} : null;
	}, resolveDevicePairingStateDbOptions(params.baseDir));
}
/** Prune retained setup outcomes when the Gateway maintenance owner ticks. */
function pruneExpiredDevicePairSetupCompletionRecords(nowMs, baseDir) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	if (!tableExists(database.db, "device_pair_setup_completions")) return 0;
	return runOpenClawStateWriteTransaction(({ db }) => {
		const result = executeSqliteQuerySync(db, getNodeSqliteKysely(db).deleteFrom("device_pair_setup_completions").where("retain_until_ms", "<=", nowMs));
		return Number(result.numAffectedRows ?? 0);
	}, {
		...databaseOptions,
		database
	});
}
/** Prune elapsed setup completions, then read one live record. */
function loadDevicePairSetupCompletionRecord(setupId, nowMs, baseDir) {
	const databaseOptions = resolveDevicePairingStateDbOptions(baseDir);
	const database = openOpenClawStateDatabase(databaseOptions);
	ensureDevicePairSetupCompletionSchema(database.db);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const kysely = getNodeSqliteKysely(db);
		executeSqliteQuerySync(db, kysely.deleteFrom("device_pair_setup_completions").where("retain_until_ms", "<=", nowMs));
		const row = executeSqliteQueryTakeFirstSync(db, kysely.selectFrom("device_pair_setup_completions").selectAll().where("setup_id", "=", setupId));
		return row ? {
			setupId: row.setup_id,
			deviceId: row.device_id,
			...optional("deviceName", row.device_name),
			access: fromSetupCompletionAccessColumn(row.access),
			completedAtMs: row.completed_at_ms,
			deliveryState: fromSetupCompletionDeliveryStateColumn(row.delivery_state),
			retainUntilMs: row.retain_until_ms
		} : null;
	}, {
		...databaseOptions,
		database
	});
}
//#endregion
//#region src/infra/pairing-files.ts
/** Resolve pending/paired JSON file locations for one pairing namespace. */
function resolvePairingPaths(baseDir, subdir) {
	const root = baseDir ?? resolveStateDir();
	const dir = path.join(root, subdir);
	return {
		dir,
		pendingPath: path.join(dir, "pending.json"),
		pairedPath: path.join(dir, "paired.json")
	};
}
/** Coerce persisted pairing maps, treating malformed arrays/scalars as empty state. */
function coercePairingStateRecord(value) {
	return asNonArrayRecord(value);
}
/** Remove pending requests older than the caller's pairing TTL. */
function pruneExpiredPending(pendingById, nowMs, ttlMs) {
	for (const [id, req] of Object.entries(pendingById)) if (nowMs - (req.refreshedAtMs ?? req.ts) > ttlMs) delete pendingById[id];
}
//#endregion
//#region src/infra/pairing-token.ts
/** Random byte length for base64url device/node/bootstrap bearer tokens. */
const PAIRING_TOKEN_BYTES = 32;
/** Generate a URL-safe bearer token for pairing and bootstrap flows. */
function generatePairingToken() {
	return randomBytes(PAIRING_TOKEN_BYTES).toString("base64url");
}
/** Verify nonblank pairing tokens with constant-time secret comparison. */
function verifyPairingToken(provided, expected) {
	if (provided.trim().length === 0 || expected.trim().length === 0) return false;
	return safeEqualSecret(provided, expected);
}
//#endregion
//#region src/infra/device-bootstrap.ts
/** Bootstrap pairing tokens are short-lived bearer credentials for first device auth. */
const DEVICE_BOOTSTRAP_TOKEN_TTL_MS = 600 * 1e3;
const DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS = 2 * DEVICE_BOOTSTRAP_TOKEN_TTL_MS;
const withLock = createAsyncLock();
const log = createSubsystemLogger("device-bootstrap");
function resolveIssuedBootstrapProfileInput(params) {
	if (params.profile) return params.profile;
	if (params.roles || params.scopes) return {
		roles: params.roles,
		scopes: params.scopes
	};
}
function resolvePersistedBootstrapProfile(record) {
	return normalizeDeviceBootstrapProfile(record.profile);
}
function resolvePersistedRedeemedProfile(record) {
	return normalizeDeviceBootstrapProfile(record.redeemedProfile);
}
function resolvePersistedPendingProfile(record) {
	return record.pendingProfile ? normalizeDeviceBootstrapProfile(record.pendingProfile) : null;
}
function resolveRequestedBootstrapProfile(params) {
	return normalizeDeviceBootstrapProfile({
		roles: [params.role],
		scopes: resolveBootstrapProfileScopesForRole(params.role, params.scopes, params.purpose),
		purpose: params.purpose
	});
}
function resolveIssuedBootstrapProfile(params) {
	const input = resolveIssuedBootstrapProfileInput(params);
	if (input) return normalizeDeviceBootstrapHandoffProfile(input);
	return PAIRING_SETUP_BOOTSTRAP_PROFILE;
}
function warnIfIssuedBootstrapScopesWereStripped(params) {
	if (!params.input) return;
	const requestedProfile = normalizeDeviceBootstrapProfile(params.input);
	const requestedScopes = requestedProfile.scopes;
	if (requestedScopes.length === 0) return;
	const retainedScopeSet = new Set(params.profile.scopes);
	const strippedScopes = requestedScopes.filter((scope) => !retainedScopeSet.has(scope));
	if (strippedScopes.length === 0) return;
	log.warn("bootstrap_token_scopes_stripped", {
		roles: requestedProfile.roles,
		requestedScopes,
		retainedScopes: params.profile.scopes,
		strippedScopes,
		consoleMessage: "bootstrap token scopes stripped to bootstrap handoff allowlist"
	});
}
function bootstrapProfileAllowsRequest(params) {
	return params.allowedProfile.roles.includes(params.requestedRole) && roleScopesAllow({
		role: params.requestedRole,
		requestedScopes: params.requestedScopes,
		allowedScopes: params.allowedProfile.scopes
	});
}
function bootstrapProfileSatisfiesProfile(params) {
	for (const requiredRole of params.requiredProfile.roles) {
		if (!params.actualProfile.roles.includes(requiredRole)) return false;
		const requiredScopes = resolveBootstrapProfileScopesForRole(requiredRole, params.requiredProfile.scopes, params.requiredProfile.purpose);
		if (requiredScopes.length > 0 && !bootstrapProfileAllowsRequest({
			allowedProfile: params.actualProfile,
			requestedRole: requiredRole,
			requestedScopes: requiredScopes
		})) return false;
	}
	return true;
}
function normalizeBootstrapPublicKey(publicKey) {
	const trimmed = publicKey.trim();
	if (!trimmed) return "";
	if (trimmed.includes("BEGIN") || /[+/=]/.test(trimmed)) return normalizeDevicePublicKeyBase64Url(trimmed) ?? trimmed;
	return trimmed;
}
async function loadState(baseDir) {
	const state = loadDeviceBootstrapTokenRecords(baseDir);
	pruneExpiredPending(state, asDateTimestampMs(Date.now()) ?? 0, DEVICE_BOOTSTRAP_TOKEN_TTL_MS);
	return state;
}
async function issueDeviceBootstrapTokenRecord(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const token = generatePairingToken();
		const issuedAtMs = asDateTimestampMs(Date.now());
		const expiresAtMs = issuedAtMs === void 0 ? void 0 : resolveExpiresAtMsFromDurationMs(DEVICE_BOOTSTRAP_TOKEN_TTL_MS, { nowMs: issuedAtMs });
		if (issuedAtMs === void 0 || expiresAtMs === void 0) throw new Error("Device bootstrap token expiry could not be resolved.");
		const profileInput = resolveIssuedBootstrapProfileInput(params);
		const profile = resolveIssuedBootstrapProfile(params);
		warnIfIssuedBootstrapScopesWereStripped({
			input: profileInput,
			profile
		});
		state[token] = {
			token,
			...params.setupId ? { setupId: params.setupId } : {},
			ts: issuedAtMs,
			profile,
			redeemedProfile: normalizeDeviceBootstrapProfile(void 0),
			issuedAtMs
		};
		persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return {
			token,
			expiresAtMs
		};
	});
}
/** Issue a short-lived generic bootstrap token with a bounded role/scope handoff profile. */
async function issueDeviceBootstrapToken(params = {}) {
	return await issueDeviceBootstrapTokenRecord(params);
}
/**
* Issue a setup bootstrap token plus an opaque correlation id. `setupId` is
* minted here, beside the credential, so the presenting client can follow one
* exact credential without ever handling the bearer token. Generic bootstrap
* handoffs stay uncorrelated: only setup codes have a presenting client.
*/
async function issueDevicePairSetupBootstrapToken(params) {
	const setupId = randomUUID();
	return {
		...await issueDeviceBootstrapTokenRecord({
			...params,
			setupId
		}),
		setupId
	};
}
/**
* Retire one setup bearer and record that credential delivery is not yet known.
* The transport confirms delivery only after its response finishes; a crash or
* disconnect therefore cannot turn replay safety into a false operator success.
*/
async function consumeDeviceBootstrapTokenWithSetupCompletion(params) {
	return await withLock(async () => {
		const nowMs = Date.now();
		return consumeDeviceBootstrapTokenWithSetupCompletionInTransaction({
			token: params.token,
			deviceId: params.deviceId,
			completedAtMs: params.completedAtMs,
			oldestValidIssuedAtMs: nowMs - DEVICE_BOOTSTRAP_TOKEN_TTL_MS,
			retentionNowMs: nowMs,
			retainUntilMs: nowMs + DEVICE_PAIR_SETUP_COMPLETION_RETENTION_MS,
			...params.pairedDeviceMatches ? { pairedDeviceMatches: params.pairedDeviceMatches } : {},
			...params.baseDir ? { baseDir: params.baseDir } : {}
		});
	});
}
/** Confirm that the pairing client received the credential-bearing handoff response. */
async function confirmDevicePairSetupCompletionDelivery(params) {
	return await withLock(async () => confirmDevicePairSetupCompletionDeliveryInTransaction({
		setupId: params.setupId,
		deviceId: params.deviceId,
		nowMs: Date.now(),
		...params.baseDir ? { baseDir: params.baseDir } : {}
	}));
}
/**
* Read the terminal outcome for one setup credential, or null while none is
* recorded. Shares this module's lock with issuance and revocation so a status
* query never observes a setup mid-settlement.
*/
async function readDevicePairSetupCompletion(params) {
	return await withLock(async () => loadDevicePairSetupCompletionRecord(params.setupId, Date.now(), params.baseDir));
}
/** Remove retained setup outcomes independently of status requests or later pairings. */
async function pruneExpiredDevicePairSetupCompletions(params = {}) {
	return await withLock(async () => pruneExpiredDevicePairSetupCompletionRecords(params.nowMs ?? Date.now(), params.baseDir));
}
/** Remove every outstanding bootstrap token from the pairing state file. */
async function clearDeviceBootstrapTokens(params = {}) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const removed = Object.keys(state).length;
		persistDeviceBootstrapTokenRecords({}, params.baseDir);
		return { removed };
	});
}
/** Revoke one bootstrap token and return its record for best-effort restore flows. */
async function revokeDeviceBootstrapToken(params) {
	return await withLock(async () => {
		const providedToken = params.token.trim();
		if (!providedToken) return { removed: false };
		const state = await loadState(params.baseDir);
		const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
		if (!found) return { removed: false };
		const [tokenKey, record] = found;
		delete state[tokenKey];
		persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return {
			removed: true,
			record
		};
	});
}
/** Revoke bootstrap tokens that are already bound to a specific device identity. */
async function revokeDeviceBootstrapTokensForDevice(params) {
	return await withLock(async () => {
		const deviceId = params.deviceId.trim();
		const publicKey = normalizeBootstrapPublicKey(params.publicKey);
		if (!deviceId || !publicKey) return { removed: 0 };
		const state = await loadState(params.baseDir);
		let removed = 0;
		for (const [tokenKey, record] of Object.entries(state)) {
			const recordPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
			if (record.deviceId?.trim() === deviceId && recordPublicKey === publicKey) {
				delete state[tokenKey];
				removed += 1;
			}
		}
		if (removed > 0) persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return { removed };
	});
}
/** Restore an uncorrelated bootstrap bearer when its credential response was not delivered. */
async function restoreGenericDeviceBootstrapToken(params) {
	if (params.record.setupId) return false;
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		state[params.record.token] = params.record;
		persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return true;
	});
}
/** Read the issued profile for a valid token without binding or redeeming it. */
async function getDeviceBootstrapTokenProfile(params) {
	return await withLock(async () => {
		const providedToken = params.token.trim();
		if (!providedToken) return null;
		const state = await loadState(params.baseDir);
		const found = Object.values(state).find((candidate) => verifyPairingToken(providedToken, candidate.token));
		return found ? resolvePersistedBootstrapProfile(found) : null;
	});
}
/** Record that one role/scope leg of a multi-role bootstrap handoff was redeemed. */
async function redeemDeviceBootstrapTokenProfile(params) {
	return await withLock(async () => {
		const providedToken = params.token.trim();
		if (!providedToken) return {
			recorded: false,
			fullyRedeemed: false
		};
		const state = await loadState(params.baseDir);
		const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
		if (!found) return {
			recorded: false,
			fullyRedeemed: false
		};
		const [tokenKey, record] = found;
		const issuedProfile = resolvePersistedBootstrapProfile(record);
		const pendingProfile = resolvePersistedPendingProfile(record);
		const redeemedProfile = normalizeDeviceBootstrapProfile({
			roles: [...resolvePersistedRedeemedProfile(record).roles, params.role],
			scopes: [...resolvePersistedRedeemedProfile(record).scopes, ...resolveBootstrapProfileScopesForRole(params.role, params.scopes, issuedProfile.purpose)],
			purpose: issuedProfile.purpose
		});
		const nextPendingProfile = pendingProfile && !bootstrapProfileSatisfiesProfile({
			actualProfile: redeemedProfile,
			requiredProfile: pendingProfile
		}) ? pendingProfile : void 0;
		const nextRecord = {
			...record,
			profile: issuedProfile,
			redeemedProfile
		};
		if (nextPendingProfile) nextRecord.pendingProfile = nextPendingProfile;
		else delete nextRecord.pendingProfile;
		state[tokenKey] = nextRecord;
		persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return {
			recorded: true,
			fullyRedeemed: bootstrapProfileSatisfiesProfile({
				actualProfile: redeemedProfile,
				requiredProfile: issuedProfile
			})
		};
	});
}
/** Verify a bootstrap token, bind it to the first device identity, and stage requested scopes. */
async function verifyDeviceBootstrapToken(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const providedToken = params.token.trim();
		if (!providedToken) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
		if (!found) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const [tokenKey, record] = found;
		const deviceId = params.deviceId.trim();
		const publicKey = normalizeBootstrapPublicKey(params.publicKey);
		const role = params.role.trim();
		if (!deviceId || !publicKey || !role) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const allowedProfile = resolvePersistedBootstrapProfile(record);
		const requestedProfile = resolveRequestedBootstrapProfile({
			role,
			scopes: params.scopes,
			purpose: allowedProfile.purpose
		});
		if (allowedProfile.roles.length === 0 || deviceBootstrapProfilesEqual(allowedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) && !deviceBootstrapProfilesEqual(requestedProfile, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE) || !bootstrapProfileAllowsRequest({
			allowedProfile,
			requestedRole: role,
			requestedScopes: params.scopes
		})) return {
			ok: false,
			reason: "bootstrap_token_invalid"
		};
		const boundDeviceId = record.deviceId?.trim();
		const boundPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
		if (boundDeviceId || boundPublicKey) {
			if (boundDeviceId !== deviceId || boundPublicKey !== publicKey) return {
				ok: false,
				reason: "bootstrap_token_invalid"
			};
			const pendingProfile = resolvePersistedPendingProfile(record);
			if (pendingProfile && !deviceBootstrapProfilesEqual(pendingProfile, requestedProfile)) return {
				ok: false,
				reason: "bootstrap_token_invalid"
			};
			state[tokenKey] = {
				...record,
				profile: allowedProfile,
				pendingProfile: pendingProfile ?? requestedProfile,
				deviceId,
				publicKey,
				lastUsedAtMs: Date.now()
			};
			persistDeviceBootstrapTokenRecords(state, params.baseDir);
			return { ok: true };
		}
		state[tokenKey] = {
			...record,
			profile: allowedProfile,
			pendingProfile: requestedProfile,
			deviceId,
			publicKey,
			lastUsedAtMs: Date.now()
		};
		persistDeviceBootstrapTokenRecords(state, params.baseDir);
		return { ok: true };
	});
}
/**
* Reads the already-bound bootstrap profile for a verified device identity.
*
* Call this only after `verifyDeviceBootstrapToken()` has returned `{ ok: true }`
* for the same `token` / `deviceId` / `publicKey` tuple in the current handshake.
*/
async function getBoundDeviceBootstrapProfile(params) {
	return await withLock(async () => {
		const state = await loadState(params.baseDir);
		const providedToken = params.token.trim();
		if (!providedToken) return null;
		const found = Object.entries(state).find(([, candidate]) => verifyPairingToken(providedToken, candidate.token));
		if (!found) return null;
		const [, record] = found;
		const deviceId = params.deviceId.trim();
		const publicKey = normalizeBootstrapPublicKey(params.publicKey);
		if (!deviceId || !publicKey) return null;
		const recordPublicKey = typeof record.publicKey === "string" ? normalizeBootstrapPublicKey(record.publicKey) : void 0;
		if (record.deviceId?.trim() !== deviceId || recordPublicKey !== publicKey) return null;
		return resolvePersistedBootstrapProfile(record);
	});
}
//#endregion
export { NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as A, resolveDeviceProfileRoleScopes as B, persistDevicePairingStoreState as C, BOOTSTRAP_HANDOFF_OPERATOR_SCOPES as D, nextApnsRegistrationVersion as E, isNodePairingSetupBootstrapProfile as F, resolvePairingSetupAccess as H, isVoiceNodePairingSetupBootstrapProfile as I, normalizeDeviceBootstrapProfile as L, VOICE_NODE_PAIRING_SETUP_BOOTSTRAP_PROFILE as M, deviceBootstrapProfilesEqual as N, CONTROL_UI_OWNER_BOOTSTRAP_PROFILE as O, isMobilePairingSetupBootstrapProfile as P, resolveBootstrapProfileScopesForRole as R, loadPairedDevicePairingStoreRecordFromDatabase as S, updatePairedDevicePresenceInTransaction as T, resolveDeviceProfileScopes as V, coercePairingStateRecord as _, getDeviceBootstrapTokenProfile as a, loadDevicePairingStoreState as b, pruneExpiredDevicePairSetupCompletions as c, restoreGenericDeviceBootstrapToken as d, revokeDeviceBootstrapToken as f, verifyPairingToken as g, generatePairingToken as h, getBoundDeviceBootstrapProfile as i, PAIRING_SETUP_BOOTSTRAP_PROFILE as j, FULL_ACCESS_PAIRING_SETUP_BOOTSTRAP_PROFILE as k, readDevicePairSetupCompletion as l, verifyDeviceBootstrapToken as m, confirmDevicePairSetupCompletionDelivery as n, issueDeviceBootstrapToken as o, revokeDeviceBootstrapTokensForDevice as p, consumeDeviceBootstrapTokenWithSetupCompletion as r, issueDevicePairSetupBootstrapToken as s, clearDeviceBootstrapTokens as t, redeemDeviceBootstrapTokenProfile as u, pruneExpiredPending as v, updatePairedDeviceNodeSurfaceInTransaction as w, loadPairedDevicePairingStoreRecord as x, resolvePairingPaths as y, resolveBootstrapProfileScopesForRoles as z };
