import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-Bre8L6Ts.js";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.js";
import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.js";
import { An as executeSqliteQuerySync, L as ensureSecretStoreSchema, Mn as getNodeSqliteKysely, Zt as normalizeSqliteNumber, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction, jn as executeSqliteQueryTakeFirstSync } from "./openclaw-state-db-CeAO_dqo.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BYdd0aMm.js";
import { s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 64 * 1024;
//#endregion
//#region src/secrets/store/secret-store-hidden-github.ts
const GITHUB_SETUP_HANDOFF_MAX_AGE_MS = 10 * 6e4;
const GITHUB_DEVICE_STORE_MAX_AGE_MS = 15 * 6e4;
const HIDDEN_GITHUB_STORE_NAME_PATTERN = /^github-(setup|device|oauth)-[a-f0-9]{32}$/u;
function classifyHiddenGitHubStoreName(name) {
	const kind = HIDDEN_GITHUB_STORE_NAME_PATTERN.exec(name)?.[1];
	return kind === "setup" || kind === "device" || kind === "oauth" ? kind : void 0;
}
function assertHiddenGitHubSecretRecordName(name) {
	const kind = classifyHiddenGitHubStoreName(name);
	if (kind !== "device" && kind !== "oauth") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record name must match github-device-<32 lowercase hex characters> or github-oauth-<32 lowercase hex characters>.");
	return kind;
}
function hiddenGitHubStoreKindFromPrefix(prefix) {
	if (prefix === "github-device") return "device";
	if (prefix === "github-oauth") return "oauth";
	throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record prefix must be \"github-device\" or \"github-oauth\".");
}
function isMissingSecretStoreTableError$1(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: secret_store_entries";
}
function validateHiddenGitHubSecretValue(value) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
function isLiveHiddenGitHubStoreRow(row, kind, now) {
	const createdAtMs = normalizeSqliteNumber(row.created_at_ms);
	const updatedAtMs = normalizeSqliteNumber(row.updated_at_ms);
	return createdAtMs !== void 0 && updatedAtMs !== void 0 && createdAtMs <= now && (kind !== "device" || createdAtMs > now - 9e5);
}
/** Writes one hidden GitHub authorization record without exposing a generic mutation path. */
function writeHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	validateHiddenGitHubSecretValue(params.value);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).insertInto("secret_store_entries").values({
			scope_kind: "team",
			scope_id: "",
			name: params.name,
			value: params.value,
			kind: "secret",
			created_at_ms: now,
			updated_at_ms: now,
			updated_by: params.updatedBy ?? null,
			deleted_at_ms: null,
			allowed_hosts: null
		}).onConflict((conflict) => conflict.columns([
			"scope_kind",
			"scope_id",
			"name"
		]).doUpdateSet({
			value: params.value,
			kind: "secret",
			updated_at_ms: now,
			updated_by: params.updatedBy ?? null,
			deleted_at_ms: null,
			allowed_hosts: null
		})));
	}, params.database, { operationLabel: "secrets.store.write" });
	registerSecretValueForRedaction(params.value);
}
/** Reads one exact live hidden GitHub authorization record. */
function readHiddenGitHubSecretRecord(params) {
	const kind = assertHiddenGitHubSecretRecordName(params.name);
	try {
		const row = withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			return executeSqliteQueryTakeFirstSync(sqlite, getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select([
				"name",
				"value",
				"created_at_ms",
				"updated_at_ms"
			]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null));
		}, params.database ?? {});
		if (!row || !isLiveHiddenGitHubStoreRow(row, kind, Date.now())) return;
		registerSecretValueForRedaction(row.value);
		return row.value;
	} catch (error) {
		if (isMissingSecretStoreTableError$1(error)) return;
		throw error;
	}
}
/** Lists live hidden GitHub authorization records of one exact class. */
function listHiddenGitHubSecretRecordNames(params) {
	try {
		const now = Date.now();
		const kind = hiddenGitHubStoreKindFromPrefix(params.prefix);
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			return executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select([
				"name",
				"value",
				"created_at_ms",
				"updated_at_ms"
			]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null).orderBy("name", "asc")).rows.flatMap((row) => {
				if (classifyHiddenGitHubStoreName(row.name) !== kind || !isLiveHiddenGitHubStoreRow(row, kind, now)) return [];
				registerSecretValueForRedaction(row.value);
				return [row.name];
			});
		}, params.database ?? {}) ?? [];
	} catch (error) {
		if (isMissingSecretStoreTableError$1(error)) return [];
		throw error;
	}
}
/** Hard-deletes one exact hidden GitHub authorization record. */
function deleteHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name));
		}, params.database, { operationLabel: "secrets.store.delete-hidden-github" });
	} catch (error) {
		if (!isMissingSecretStoreTableError$1(error)) throw error;
	}
}
//#endregion
//#region src/secrets/store/secret-store.ts
const SECRET_STORE_RETENTION_MS = 720 * 60 * 6e4;
function normalizeScope(_scope) {
	return {
		scopeKind: "team",
		scopeId: ""
	};
}
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertSecretStoreMutationName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name) && classifyHiddenGitHubStoreName(name) !== "setup") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)} or github-setup-<32 lowercase hex characters>.`);
}
function assertSecretStoreValue(value, kind) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (kind === "secret" && value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
function normalizeSecretAllowedHost(raw) {
	try {
		return normalizeExactAllowedHost(raw);
	} catch (error) {
		throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", error instanceof Error ? error.message : `Allowed host "${raw}" is not a valid hostname.`);
	}
}
function normalizeSecretAllowedHosts(hosts) {
	if (hosts.length > 128) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `A secret can allow at most 128 hosts.`);
	return [...new Set(hosts.map(normalizeSecretAllowedHost))].toSorted();
}
function parseSecretAllowedHosts(raw) {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every((host) => typeof host === "string") ? normalizeSecretAllowedHosts(parsed) : [];
	} catch {
		return [];
	}
}
function isMissingSecretStoreTableError(error) {
	return error instanceof Error && error.code === "ERR_SQLITE_ERROR" && error.message === "no such table: secret_store_entries";
}
function toMetadata(row) {
	if (row.kind === "secret") registerSecretValueForRedaction(row.value);
	return {
		name: row.name,
		kind: row.kind,
		scopeKind: row.scope_kind,
		scopeId: row.scope_id,
		updatedAtMs: normalizeSqliteNumber(row.updated_at_ms) ?? 0,
		createdAtMs: normalizeSqliteNumber(row.created_at_ms) ?? 0,
		updatedBy: row.updated_by,
		...row.kind === "secret" ? { allowedHosts: parseSecretAllowedHosts(row.allowed_hosts) } : {},
		...row.kind === "env" ? { valuePreview: row.value } : {}
	};
}
function listSecretStoreEntries(params) {
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			let query = getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").selectAll().where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).orderBy("name", "asc");
			if (!params.includeDeleted) query = query.where("deleted_at_ms", "is", null);
			return executeSqliteQuerySync(sqlite, query).rows.filter((row) => classifyHiddenGitHubStoreName(row.name) === void 0).map(toMetadata);
		}, params.database ?? {}) ?? [];
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return [];
		throw error;
	}
}
/** Atomically returns and hard-deletes one exact fresh, non-egress GitHub setup handoff. */
function consumeGitHubSetupHandoff(params) {
	if (classifyHiddenGitHubStoreName(params.name) !== "setup") return;
	const now = params.nowMs ?? Date.now();
	try {
		let value;
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const row = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select("value").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("created_at_ms", ">=", now - GITHUB_SETUP_HANDOFF_MAX_AGE_MS).where("created_at_ms", "<=", now).where("deleted_at_ms", "is", null));
			if (!row) return;
			executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name));
			value = row.value;
		}, params.database, { operationLabel: "secrets.store.consume-github-setup-handoff" });
		if (value !== void 0) registerSecretValueForRedaction(value);
		return value;
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return;
		throw error;
	}
}
/** Captures one coherent team-store snapshot for an agent run's exec environment. */
function readSecretStoreExecEnvironment(params) {
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const rows = executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").selectAll().where("scope_kind", "=", "team").where("scope_id", "=", "").where("deleted_at_ms", "is", null).orderBy("name", "asc")).rows;
			const env = {};
			const secretSentinels = {};
			const secretEgressBindings = [];
			const excludedNames = new Set(params.excludeNames ?? []);
			for (const row of rows) {
				if (classifyHiddenGitHubStoreName(row.name) !== void 0 || excludedNames.has(row.name)) continue;
				if (row.kind === "env") {
					env[row.name] = row.value;
					continue;
				}
				registerSecretValueForRedaction(row.value);
				if (params.includeSecretSentinels) {
					const sentinel = mintSecretSentinel(row.value, { label: `exec-store:${row.name}` });
					secretSentinels[row.name] = sentinel;
					secretEgressBindings.push({
						name: row.name,
						sentinel,
						allowedHosts: parseSecretAllowedHosts(row.allowed_hosts)
					});
				}
			}
			return {
				...Object.keys(env).length > 0 ? { env } : {},
				...Object.keys(secretSentinels).length > 0 ? { secretSentinels } : {},
				...secretEgressBindings.length > 0 ? { secretEgressBindings } : {}
			};
		}, params.database ?? {}) ?? {};
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return {};
		throw error;
	}
}
function readSecretStoreValue(params) {
	try {
		assertSecretStoreEnvName(params.name);
		const { scopeKind, scopeId } = normalizeScope(params.scope);
		const row = withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			return executeSqliteQueryTakeFirstSync(sqlite, getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select(["value", "kind"]).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null));
		}, params.database ?? {});
		if (!row) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (row.kind === "secret") registerSecretValueForRedaction(row.value);
		return ok(row.value);
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (error instanceof SecretStoreValidationError) return err({
			code: "SECRET_STORE_INVALID_NAME",
			message: error.message
		});
		return err({
			code: "SECRET_STORE_UNAVAILABLE",
			message: "Secret store database is unavailable.",
			cause: error
		});
	}
}
function writeSecretStoreEntry(params) {
	assertSecretStoreMutationName(params.name);
	assertSecretStoreValue(params.value, params.kind);
	if (params.kind === "env" && params.allowedHosts !== void 0) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", "Allowed hosts apply only to secret entries.");
	const allowedHosts = params.kind === "secret" && params.allowedHosts !== void 0 ? normalizeSecretAllowedHosts(params.allowedHosts) : void 0;
	const allowedHostsJson = allowedHosts?.length ? JSON.stringify(allowedHosts) : null;
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).insertInto("secret_store_entries").values({
			scope_kind: scopeKind,
			scope_id: scopeId,
			name: params.name,
			value: params.value,
			kind: params.kind,
			created_at_ms: now,
			updated_at_ms: now,
			updated_by: params.updatedBy,
			deleted_at_ms: null,
			allowed_hosts: allowedHostsJson
		}).onConflict((conflict) => conflict.columns([
			"scope_kind",
			"scope_id",
			"name"
		]).doUpdateSet({
			value: params.value,
			kind: params.kind,
			updated_at_ms: now,
			updated_by: params.updatedBy,
			deleted_at_ms: null,
			...params.kind === "env" ? { allowed_hosts: null } : allowedHosts !== void 0 ? { allowed_hosts: allowedHostsJson } : {}
		})));
	}, params.database, { operationLabel: "secrets.store.write" });
}
function updateSecretStoreAllowedHosts(params) {
	assertSecretStoreEnvName(params.name);
	const allowedHosts = normalizeSecretAllowedHosts(params.allowedHosts);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		const updated = executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).updateTable("secret_store_entries").set({
			allowed_hosts: allowedHosts.length ? JSON.stringify(allowedHosts) : null,
			updated_at_ms: now,
			updated_by: params.updatedBy
		}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("kind", "=", "secret").where("deleted_at_ms", "is", null));
		if (Number(updated.numAffectedRows ?? 0n) !== 1) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Secret store entry "${params.name}" is missing or is not a secret entry.`);
	}, params.database, { operationLabel: "secrets.store.allowed-hosts" });
}
function deleteSecretStoreEntry(params) {
	assertSecretStoreMutationName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const state = openOpenClawStateDatabase(params.database);
	const now = Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			executeSqliteQuerySync(sqlite, classifyHiddenGitHubStoreName(params.name) === "setup" ? db.deleteFrom("secret_store_entries").where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name) : db.updateTable("secret_store_entries").set({
				deleted_at_ms: now,
				updated_at_ms: now
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null));
		}, {
			...params.database,
			database: state
		}, { operationLabel: "secrets.store.delete" });
	} catch (error) {
		if (!isMissingSecretStoreTableError(error)) throw error;
	}
}
function purgeExpiredSecretStoreEntries(params = {}) {
	const state = openOpenClawStateDatabase(params.database);
	const threshold = Date.now() - SECRET_STORE_RETENTION_MS;
	const handoffThreshold = Date.now() - GITHUB_SETUP_HANDOFF_MAX_AGE_MS;
	const deviceThreshold = Date.now() - GITHUB_DEVICE_STORE_MAX_AGE_MS;
	try {
		return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const deleted = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("deleted_at_ms", "is not", null).where("deleted_at_ms", "<", threshold));
			const hiddenRows = executeSqliteQuerySync(sqlite, db.selectFrom("secret_store_entries").select([
				"scope_kind",
				"scope_id",
				"name",
				"created_at_ms"
			]).where("deleted_at_ms", "is", null).where("created_at_ms", "<=", Math.max(handoffThreshold, deviceThreshold))).rows.filter((row) => {
				const kind = classifyHiddenGitHubStoreName(row.name);
				const createdAtMs = normalizeSqliteNumber(row.created_at_ms);
				return createdAtMs !== void 0 && (kind === "setup" && createdAtMs < handoffThreshold || kind === "device" && createdAtMs <= deviceThreshold);
			});
			let expiredHidden = 0;
			for (const row of hiddenRows) {
				const result = executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", row.scope_kind).where("scope_id", "=", row.scope_id).where("name", "=", row.name));
				expiredHidden += Number(result.numAffectedRows ?? 0n);
			}
			return Number(deleted.numAffectedRows ?? 0n) + expiredHidden;
		}, {
			...params.database,
			database: state
		}, { operationLabel: "secrets.store.purge" });
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return 0;
		throw error;
	}
}
//#endregion
export { normalizeSecretAllowedHosts as a, readSecretStoreValue as c, deleteHiddenGitHubSecretRecord as d, listHiddenGitHubSecretRecordNames as f, SecretStoreValidationError as g, SECRET_STORE_VALUE_MAX_BYTES as h, listSecretStoreEntries as i, updateSecretStoreAllowedHosts as l, writeHiddenGitHubSecretRecord as m, consumeGitHubSetupHandoff as n, purgeExpiredSecretStoreEntries as o, readHiddenGitHubSecretRecord as p, deleteSecretStoreEntry as r, readSecretStoreExecEnvironment as s, assertSecretStoreValue as t, writeSecretStoreEntry as u };
