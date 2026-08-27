import { i as registerSecretValueForRedaction } from "./secret-redaction-registry-gIFE-2_j.js";
import { n as ENV_SECRET_REF_ID_RE } from "./types.secrets-BrIfhxSG.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { Lt as normalizeSqliteNumber, R as ensureSecretStoreSchema, d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import { t as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-BEJbbAaL.js";
import { n as ok, t as err } from "./result-BQGgYouL.js";
import { s as mintSecretSentinel } from "./sentinel-DFKnr2-n.js";
import { domainToASCII } from "node:url";
import net from "node:net";
//#region src/secrets/store/secret-store.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
const SECRET_STORE_VALUE_MAX_BYTES = 64 * 1024;
const SECRET_STORE_RETENTION_MS = 720 * 60 * 6e4;
function normalizeScope(_scope) {
	return {
		scopeKind: "team",
		scopeId: ""
	};
}
function assertSecretStoreName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertSecretStoreValue(value, kind) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (kind === "secret" && value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
function normalizeSecretAllowedHost(raw) {
	const trimmed = raw.trim().toLowerCase().replace(/\.+$/u, "");
	if (trimmed.includes("*")) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Allowed host "${raw}" cannot contain a wildcard; use one exact hostname.`);
	const unbracketed = trimmed.startsWith("[") && trimmed.endsWith("]") ? trimmed.slice(1, -1) : trimmed;
	if (net.isIP(unbracketed)) return unbracketed;
	if (!unbracketed || unbracketed.includes(":") || /[\s/?#@]/u.test(unbracketed)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Allowed host "${raw}" must be a hostname without a scheme, path, wildcard, or port.`);
	const ascii = domainToASCII(unbracketed);
	if (!ascii || ascii.length > 253 || ascii.split(".").some((label) => !label || label.length > 63 || label.startsWith("-") || label.endsWith("-") || !/^[a-z0-9-]+$/u.test(label))) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Allowed host "${raw}" is not a valid hostname.`);
	return ascii;
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
			return executeSqliteQuerySync(sqlite, query).rows.map(toMetadata);
		}, params.database ?? {}) ?? [];
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return [];
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
			for (const row of rows) {
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
		assertSecretStoreName(params.name);
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
	assertSecretStoreName(params.name);
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
	assertSecretStoreName(params.name);
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
	assertSecretStoreName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const state = openOpenClawStateDatabase(params.database);
	const now = Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).updateTable("secret_store_entries").set({
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
	try {
		return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const deleted = executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).deleteFrom("secret_store_entries").where("deleted_at_ms", "is not", null).where("deleted_at_ms", "<", threshold));
			return Number(deleted.numAffectedRows ?? 0n);
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
export { normalizeSecretAllowedHosts as a, readSecretStoreValue as c, listSecretStoreEntries as i, updateSecretStoreAllowedHosts as l, SecretStoreValidationError as n, purgeExpiredSecretStoreEntries as o, deleteSecretStoreEntry as r, readSecretStoreExecEnvironment as s, SECRET_STORE_VALUE_MAX_BYTES as t, writeSecretStoreEntry as u };
