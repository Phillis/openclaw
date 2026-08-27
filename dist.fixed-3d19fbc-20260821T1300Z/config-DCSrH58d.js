import { w as resolveStateDir } from "./paths-CqeDjSA4.js";
import { _ as getNodeSqliteKysely, g as executeSqliteQueryTakeFirstSync, h as executeSqliteQuerySync } from "./openclaw-state-db.paths-gKE3myqW.js";
import { d as openOpenClawStateDatabase, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BciZ4rHE.js";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
//#region src/node-host/config.ts
/** Canonical shared-SQLite configuration for the node-host runner. */
const NODE_HOST_CONFIG_KEY = "current";
const LEGACY_NODE_HOST_CONFIG_FILE = "node.json";
const LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX = ".doctor-importing";
function databaseOptions(env) {
	return { env };
}
function resolveLegacyNodeHostConfigPath(env = process.env) {
	return path.join(resolveStateDir(env), LEGACY_NODE_HOST_CONFIG_FILE);
}
function resolveLegacyNodeHostConfigClaimPath(env = process.env) {
	return `${resolveLegacyNodeHostConfigPath(env)}${LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX}`;
}
function legacyPathMayExist(filePath) {
	try {
		fs.lstatSync(filePath);
		return true;
	} catch (error) {
		if (error.code === "ENOENT") return false;
		throw new Error(`unable to verify retired node-host state path ${filePath}`, { cause: error });
	}
}
/** Runtime must not choose between canonical SQLite state and a retired file store. */
function assertNodeHostLegacyStateMigrated(env = process.env) {
	const sourcePath = resolveLegacyNodeHostConfigPath(env);
	const claimPath = resolveLegacyNodeHostConfigClaimPath(env);
	if (!legacyPathMayExist(sourcePath) && !legacyPathMayExist(claimPath)) return;
	throw new Error(`retired node-host state remains at ${sourcePath}; stop the node host and run \`openclaw doctor --fix\``);
}
function optionalNonEmptyString(value, label) {
	if (value === null) return;
	const normalized = value.trim();
	if (!normalized) throw new Error(`invalid node-host SQLite row: ${label} must not be empty`);
	return normalized;
}
function optionalInputString(value) {
	return value?.trim() || void 0;
}
function validatePort(value, label) {
	if (value === null || value === void 0) return;
	if (!Number.isSafeInteger(value) || value <= 0 || value > 65535) throw new Error(`invalid node-host ${label}: expected an integer between 1 and 65535`);
	return value;
}
function rowToNodeHostConfig(row) {
	if (row.version !== 1) throw new Error(`invalid node-host SQLite row: unsupported version ${String(row.version)}`);
	const nodeId = row.node_id.trim();
	if (!nodeId) throw new Error("invalid node-host SQLite row: node_id must not be empty");
	if (!Number.isSafeInteger(row.updated_at_ms) || row.updated_at_ms < 0) throw new Error("invalid node-host SQLite row: updated_at_ms must be a non-negative integer");
	if (row.gateway_tls !== null && row.gateway_tls !== 0 && row.gateway_tls !== 1) throw new Error("invalid node-host SQLite row: gateway_tls must be 0, 1, or null");
	if (row.installed_apps_sharing !== 0 && row.installed_apps_sharing !== 1) throw new Error("invalid node-host SQLite row: installed_apps_sharing must be 0 or 1");
	const gateway = {
		host: optionalNonEmptyString(row.gateway_host, "gateway_host"),
		port: validatePort(row.gateway_port, "SQLite gateway_port"),
		tls: row.gateway_tls === null ? void 0 : row.gateway_tls === 1,
		tlsFingerprint: optionalNonEmptyString(row.gateway_tls_fingerprint, "gateway_tls_fingerprint"),
		contextPath: optionalNonEmptyString(row.gateway_context_path, "gateway_context_path")
	};
	const hasGateway = Object.values(gateway).some((value) => value !== void 0);
	return {
		version: 1,
		nodeId,
		displayName: optionalNonEmptyString(row.display_name, "display_name"),
		gateway: hasGateway ? gateway : void 0,
		installedAppsSharing: row.installed_apps_sharing === 1
	};
}
function normalizeGatewayConfig(gateway) {
	const normalized = {
		host: optionalInputString(gateway.host),
		port: validatePort(gateway.port, "gateway port"),
		tls: gateway.tls,
		tlsFingerprint: optionalInputString(gateway.tlsFingerprint),
		contextPath: optionalInputString(gateway.contextPath)
	};
	return Object.values(normalized).some((value) => value !== void 0) ? normalized : void 0;
}
function configToRow(params) {
	const gateway = params.config.gateway;
	return {
		config_key: NODE_HOST_CONFIG_KEY,
		version: 1,
		node_id: params.config.nodeId,
		token: null,
		display_name: params.config.displayName ?? null,
		gateway_host: gateway?.host ?? null,
		gateway_port: gateway?.port ?? null,
		gateway_tls: gateway?.tls === void 0 ? null : gateway.tls ? 1 : 0,
		gateway_tls_fingerprint: gateway?.tlsFingerprint ?? null,
		gateway_context_path: gateway?.contextPath ?? null,
		installed_apps_sharing: params.config.installedAppsSharing ? 1 : 0,
		updated_at_ms: params.updatedAtMs
	};
}
function readNodeHostConfigRow(database) {
	return executeSqliteQueryTakeFirstSync(database.db, getNodeSqliteKysely(database.db).selectFrom("node_host_config").select([
		"config_key",
		"version",
		"node_id",
		"display_name",
		"gateway_host",
		"gateway_port",
		"gateway_tls",
		"gateway_tls_fingerprint",
		"gateway_context_path",
		"installed_apps_sharing",
		"updated_at_ms"
	]).where("config_key", "=", NODE_HOST_CONFIG_KEY));
}
/** Load canonical node-host state. Legacy files block the read until Doctor migrates them. */
async function loadNodeHostConfig(env = process.env) {
	assertNodeHostLegacyStateMigrated(env);
	const row = readNodeHostConfigRow(openOpenClawStateDatabase(databaseOptions(env)));
	return row ? rowToNodeHostConfig(row) : null;
}
/**
* Atomically create or replace the complete node-host snapshot.
* Candidate facts are prepared before BEGIN; the transaction rereads the authoritative row.
*/
async function configureNodeHost(params) {
	const env = params.env ?? process.env;
	assertNodeHostLegacyStateMigrated(env);
	const explicitNodeId = optionalInputString(params.nodeId);
	const explicitDisplayName = optionalInputString(params.displayName);
	const fallbackDisplayName = optionalInputString(params.fallbackDisplayName);
	const candidateNodeId = params.candidateNodeId?.trim() || crypto.randomUUID();
	const gateway = normalizeGatewayConfig(params.gateway);
	const updatedAtMs = params.nowMs ?? Date.now();
	if (!Number.isSafeInteger(updatedAtMs) || updatedAtMs < 0) throw new Error("invalid node-host updatedAtMs: expected a non-negative integer");
	const config = runOpenClawStateWriteTransaction((database) => {
		const { db } = database;
		const existingRow = readNodeHostConfigRow(database);
		const existing = existingRow ? rowToNodeHostConfig(existingRow) : null;
		const next = {
			version: 1,
			nodeId: explicitNodeId ?? existing?.nodeId ?? candidateNodeId,
			displayName: explicitDisplayName ?? existing?.displayName ?? fallbackDisplayName,
			gateway,
			installedAppsSharing: params.installedAppsSharing ?? existing?.installedAppsSharing ?? false
		};
		const row = configToRow({
			config: next,
			updatedAtMs
		});
		const { config_key: _configKey, ...updates } = row;
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("node_host_config").values(row).onConflict((conflict) => conflict.column("config_key").doUpdateSet(updates)));
		return next;
	}, databaseOptions(env));
	assertNodeHostLegacyStateMigrated(env);
	return config;
}
//#endregion
export { loadNodeHostConfig as a, configureNodeHost as i, LEGACY_NODE_HOST_CONFIG_FILE as n, NODE_HOST_CONFIG_KEY as r, LEGACY_NODE_HOST_CONFIG_CLAIM_SUFFIX as t };
