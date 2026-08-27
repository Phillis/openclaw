import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { c as resolveUserPath } from "./home-dir-BFvskzn8.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { s as resolveCompatibilityHostVersion } from "./version-CkBmshxX.js";
import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { f as resolveCompatRegistryVersion, h as hashStableJson, n as hasInstalledPluginIndexWorkspaceScopeMismatch, o as refreshInstalledPluginIndex, p as resolveInstalledPluginIndexPolicyHash, s as INSTALLED_PLUGIN_INDEX_WARNING, v as extractPluginInstallRecordsFromInstalledPluginIndex, y as isPluginEnabledByDefaultForPlatform } from "./installed-plugin-index-Cr71VmpU.js";
import { d as inspectPluginInstallRecordMap, f as parsePluginInstallRecord, h as setPluginInstallRecordMapEntry, l as createPluginInstallRecordMap, m as serializePluginInstallRecordMap, p as parsePluginInstallRecordMap, s as PluginInstallRecordSchema } from "./official-external-install-records-DOxgmTy-.js";
import { n as recordInstalledPluginIndexInstallOwner, r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { d as resolveInstalledPluginIndexStorePath, u as resolveInstalledPluginIndexStateDatabaseOptions } from "./manifest-registry-DqYRJvWI.js";
import { t as clearLoadInstalledPluginIndexInstallRecordsCache } from "./installed-plugin-index-record-cache-Dy20sC-s.js";
import { Ln as isSqliteSchemaVersionError, h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-kmBThqu6.js";
import { n as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-KXgHmJVs.js";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.js";
import { t as hasMissingInstalledPluginOwnerMetadata } from "./installed-plugin-package-ownership-JNsP8Eri.js";
import { existsSync } from "node:fs";
//#region src/plugins/installed-plugin-index-config-path-scope.ts
/** Compat code marking install records that need config-path activation metadata. */
const CONFIG_PATH_ACTIVATION_COMPAT_CODE = "activation-config-path-hint";
function recordUsesConfigPathActivation(plugin) {
	return plugin.compat.includes(CONFIG_PATH_ACTIVATION_COMPAT_CODE);
}
/** True when an index still has config-path activation records missing startup metadata. */
function hasMissingConfigPathActivationMetadata(index) {
	return index.plugins.some((plugin) => recordUsesConfigPathActivation(plugin) && plugin.startup.configPaths === void 0);
}
/** True when a record migrated config-path activation startup metadata. */
function hasConfigPathActivationMetadataMigration(params) {
	return recordUsesConfigPathActivation(params.previous) && params.previous.startup.configPaths === void 0 && params.current.startup.configPaths !== void 0;
}
//#endregion
//#region src/plugins/installed-plugin-index-store.ts
/** Persists, inspects, and refreshes the installed plugin index in the state database. */
const StringArraySchema = array(string());
const INSTALLED_PLUGIN_INDEX_STATE_KEY = "plugins.installedIndex";
const InstalledPluginIndexStartupSchema = object({
	sidecar: boolean(),
	memory: boolean(),
	agentHarnesses: StringArraySchema,
	configPaths: StringArraySchema.optional()
});
const InstalledPluginIndexContributionSchema = object({
	channels: StringArraySchema,
	channelConfigs: StringArraySchema,
	providers: StringArraySchema,
	modelCatalogProviders: StringArraySchema,
	modelSupportPrefixes: StringArraySchema,
	modelSupportPatterns: StringArraySchema,
	autoEnableProviderIds: StringArraySchema,
	commandAliases: StringArraySchema,
	contracts: record(string(), StringArraySchema)
});
const InstalledPluginFileSignatureSchema = object({
	size: number(),
	mtimeMs: number(),
	ctimeMs: number().optional()
});
const InstalledPluginIndexRecordSchema = object({
	pluginId: string(),
	installOwner: string().optional(),
	installOwnerAmbiguous: literal(true).optional(),
	packageName: string().optional(),
	packageVersion: string().optional(),
	installRecord: PluginInstallRecordSchema.optional(),
	installRecordHash: string().optional(),
	packageInstall: unknown().optional(),
	packageChannel: unknown().optional(),
	packageBuild: object({ bundledDist: boolean().optional() }).optional(),
	manifestPath: string(),
	manifestHash: string(),
	doctorContractHash: string().optional(),
	doctorContractFile: InstalledPluginFileSignatureSchema.optional(),
	manifestFile: InstalledPluginFileSignatureSchema.optional(),
	format: string().optional(),
	bundleFormat: string().optional(),
	source: string().optional(),
	setupSource: string().optional(),
	packageJson: object({
		path: string(),
		hash: string(),
		fileSignature: InstalledPluginFileSignatureSchema.optional()
	}).optional(),
	rootDir: string(),
	origin: string(),
	enabled: boolean(),
	enabledByDefault: boolean().optional(),
	enabledByDefaultOnPlatforms: StringArraySchema.optional(),
	syntheticAuthRefs: StringArraySchema.optional(),
	startup: InstalledPluginIndexStartupSchema,
	contributions: InstalledPluginIndexContributionSchema.optional(),
	compat: array(string())
});
const PluginDiagnosticSchema = object({
	level: union([literal("warn"), literal("error")]),
	message: string(),
	pluginId: string().optional(),
	source: string().optional(),
	code: string().optional()
});
const InstalledPluginIndexSchema = object({
	version: literal(1),
	warning: string().optional(),
	hostContractVersion: string(),
	compatRegistryVersion: string(),
	migrationVersion: literal(1),
	policyHash: string(),
	generatedAtMs: number(),
	workspaceDir: string().optional(),
	refreshReason: string().optional(),
	installRecords: unknown().optional(),
	plugins: array(InstalledPluginIndexRecordSchema),
	diagnostics: array(PluginDiagnosticSchema)
});
function parseInstalledPluginIndex(value) {
	const parsed = safeParseWithSchema(InstalledPluginIndexSchema, value);
	if (!parsed) return null;
	const installRecords = Object.hasOwn(parsed, "installRecords") ? parsePluginInstallRecordMap(parsed.installRecords) : extractPluginInstallRecordsFromInstalledPluginIndex(parsed);
	if (!installRecords) return null;
	return {
		version: parsed.version,
		...parsed.warning ? { warning: parsed.warning } : {},
		hostContractVersion: parsed.hostContractVersion,
		compatRegistryVersion: parsed.compatRegistryVersion,
		migrationVersion: parsed.migrationVersion,
		policyHash: parsed.policyHash,
		generatedAtMs: parsed.generatedAtMs,
		...parsed.workspaceDir !== void 0 ? { workspaceDir: parsed.workspaceDir } : {},
		...parsed.refreshReason ? { refreshReason: parsed.refreshReason } : {},
		installRecords,
		plugins: parsed.plugins.map(({ installOwner, installOwnerAmbiguous, ...plugin }) => recordInstalledPluginIndexInstallOwner(plugin, installOwner, installOwnerAmbiguous === true)),
		diagnostics: parsed.diagnostics
	};
}
function assertWritableInstalledPluginIndexStoreOptions(options) {
	if (options.filePath?.endsWith(".json")) throw new Error("Explicit JSON installed plugin index paths are retired. Use the shared SQLite state DB or run openclaw doctor --fix to migrate legacy plugins/installs.json.");
}
function parseInstalledPluginIndexSqliteRow(value) {
	return value ? parseInstalledPluginIndex(value.index) : null;
}
function preparePersistedInstalledPluginIndex(index) {
	const installRecords = createPluginInstallRecordMap();
	for (const [pluginId, rawRecord] of Object.entries(index.installRecords)) {
		const record = parsePluginInstallRecord(rawRecord);
		if (!record) throw new Error("Invalid plugin install record");
		setPluginInstallRecordMapEntry(installRecords, pluginId, record);
	}
	return {
		...index,
		warning: INSTALLED_PLUGIN_INDEX_WARNING,
		installRecords
	};
}
function readInstalledPluginIndexRow(database) {
	const row = database.prepare("SELECT value_json FROM config_machine_state WHERE state_key = ?").get(INSTALLED_PLUGIN_INDEX_STATE_KEY);
	if (!row) return;
	const value = safeParseJson(row.value_json);
	if (!value || typeof value !== "object" || typeof value.revision !== "number") return;
	return value;
}
function resolveNextInstalledPluginIndexRevision(current) {
	return Math.max(Date.now(), (current ?? 0) + 1);
}
function writePersistedInstalledPluginIndexRow(database, index, revision) {
	const persistedIndex = {
		version: index.version,
		warning: index.warning ?? "DO NOT EDIT. This file is generated by OpenClaw from plugin manifests, install records, and config policy. Use `openclaw plugins registry --refresh`, `openclaw plugins install/update/uninstall`, or `openclaw plugins enable/disable` instead.",
		hostContractVersion: index.hostContractVersion,
		compatRegistryVersion: index.compatRegistryVersion,
		migrationVersion: index.migrationVersion,
		policyHash: index.policyHash,
		generatedAtMs: index.generatedAtMs,
		...index.workspaceDir !== void 0 ? { workspaceDir: index.workspaceDir } : {},
		...index.refreshReason ? { refreshReason: index.refreshReason } : {},
		installRecords: JSON.parse(serializePluginInstallRecordMap(index.installRecords)),
		plugins: index.plugins.map((plugin) => {
			const installOwner = resolveInstalledPluginIndexInstallOwner(plugin);
			return {
				...plugin,
				...installOwner ? { installOwner } : {},
				...isInstalledPluginIndexInstallOwnerAmbiguous(plugin) ? { installOwnerAmbiguous: true } : {}
			};
		}),
		diagnostics: index.diagnostics
	};
	const valueJson = JSON.stringify({
		revision,
		index: persistedIndex
	});
	database.prepare(`
        INSERT INTO config_machine_state (state_key, value_json, updated_at_ms)
        VALUES (?, ?, ?)
        ON CONFLICT(state_key) DO UPDATE SET
          value_json = excluded.value_json,
          updated_at_ms = excluded.updated_at_ms
      `).run(INSTALLED_PLUGIN_INDEX_STATE_KEY, valueJson, revision);
}
function readPersistedInstalledPluginIndexFromSqlite(options = {}) {
	if (options.filePath?.endsWith(".json")) return null;
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db }) => parseInstalledPluginIndexSqliteRow(readInstalledPluginIndexRow(db)), resolveInstalledPluginIndexStateDatabaseOptions(options)) ?? null;
	} catch (error) {
		if (isSqliteSchemaVersionError(error)) throw error;
		return null;
	}
}
function writePersistedInstalledPluginIndexToSqlite(index, options = {}, lease) {
	assertWritableInstalledPluginIndexStoreOptions(options);
	const persisted = preparePersistedInstalledPluginIndex(index);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const previousRow = readInstalledPluginIndexRow(db);
		if (previousRow) {
			const previousInstallRecords = previousRow.index?.installRecords;
			if (previousInstallRecords === void 0 || inspectPluginInstallRecordMap(previousInstallRecords).status === "invalid") throw new Error("Persisted plugin install records are invalid. Repair the state before writing plugin installation metadata.");
		}
		lease?.assertOwnedInTransaction(db);
		const revision = resolveNextInstalledPluginIndexRevision(previousRow ? previousRow.revision : null);
		writePersistedInstalledPluginIndexRow(db, persisted, revision);
		return {
			previous: parseInstalledPluginIndexSqliteRow(previousRow),
			revision
		};
	}, resolveInstalledPluginIndexStateDatabaseOptions(options));
}
function clearPersistedInstalledPluginIndexCaches() {
	clearPluginMetadataLifecycleCaches();
	clearLoadInstalledPluginIndexInstallRecordsCache();
}
async function readPersistedInstalledPluginIndex(options = {}) {
	return readPersistedInstalledPluginIndexSync(options);
}
function readPersistedInstalledPluginIndexSync(options = {}) {
	return readPersistedInstalledPluginIndexFromSqlite(options);
}
async function writePersistedInstalledPluginIndex(index, options = {}) {
	return writePersistedInstalledPluginIndexSync(index, options);
}
/** Restore a snapshot only while the caller's tentative write is still current. */
async function restorePersistedInstalledPluginIndexIfCurrent(index, expectedRevision, options) {
	const { lease, ...storeOptions } = options;
	assertWritableInstalledPluginIndexStoreOptions(storeOptions);
	if (!existsSync(resolveInstalledPluginIndexStorePath(storeOptions))) return false;
	const restored = runOpenClawStateWriteTransaction(({ db }) => {
		lease.assertOwnedInTransaction(db);
		const currentRow = readInstalledPluginIndexRow(db);
		const currentRevision = currentRow ? currentRow.revision : null;
		if (currentRevision !== expectedRevision) return false;
		if (index) writePersistedInstalledPluginIndexRow(db, preparePersistedInstalledPluginIndex(index), resolveNextInstalledPluginIndexRevision(currentRevision));
		else db.prepare("DELETE FROM config_machine_state WHERE state_key = ?").run(INSTALLED_PLUGIN_INDEX_STATE_KEY);
		return true;
	}, resolveInstalledPluginIndexStateDatabaseOptions(storeOptions));
	clearPersistedInstalledPluginIndexCaches();
	return restored;
}
function writePersistedInstalledPluginIndexSync(index, options = {}) {
	const filePath = resolveInstalledPluginIndexStorePath(options);
	writePersistedInstalledPluginIndexToSqlite(index, options);
	clearPersistedInstalledPluginIndexCaches();
	return filePath;
}
function writePersistedInstalledPluginIndexWithLeaseSync(index, options) {
	const { lease, ...storeOptions } = options;
	const filePath = resolveInstalledPluginIndexStorePath(storeOptions);
	writePersistedInstalledPluginIndexToSqlite(index, storeOptions, lease);
	clearPersistedInstalledPluginIndexCaches();
	return filePath;
}
function hasCompletePolicyRefreshProjection(persisted, policyPluginIds, env) {
	const pluginIds = new Set(persisted.plugins.map((plugin) => plugin.pluginId));
	if (policyPluginIds?.some((pluginId) => !pluginIds.has(pluginId))) return false;
	const installOwners = new Set(persisted.plugins.map(resolveInstalledPluginIndexInstallOwner));
	return Object.entries(persisted.installRecords).every(([installOwner, record]) => {
		if (installOwners.has(installOwner)) return true;
		const installedPath = record.installPath?.trim() || record.sourcePath?.trim();
		return !installedPath || !existsSync(resolveUserPath(installedPath, env));
	});
}
function canRefreshPersistedPolicyState(persisted, params) {
	if (!persisted || params.reason !== "policy-changed") return false;
	if ((params.diagnostics?.length ?? 0) > 0 || persisted.diagnostics.some((diagnostic) => diagnostic.code === "workspace-scope-omitted") || hasInstalledPluginIndexWorkspaceScopeMismatch(persisted, params.workspaceDir)) return false;
	const env = params.env ?? process.env;
	if (persisted.version !== 1 || persisted.hostContractVersion !== resolveCompatibilityHostVersion(env) || persisted.compatRegistryVersion !== resolveCompatRegistryVersion() || persisted.migrationVersion !== 1 || hasMissingConfigPathActivationMetadata(persisted) || hasMissingInstalledPluginOwnerMetadata(persisted, env)) return false;
	if (params.installRecords && hashStableJson(params.installRecords) !== hashStableJson(persisted.installRecords ?? {})) return false;
	return hasCompletePolicyRefreshProjection(persisted, params.policyPluginIds, env);
}
function refreshPersistedPolicyState(persisted, params) {
	const normalizedConfig = normalizePluginsConfig(params.config?.plugins);
	return {
		...persisted,
		policyHash: resolveInstalledPluginIndexPolicyHash(params.config),
		generatedAtMs: (params.now?.() ?? /* @__PURE__ */ new Date()).getTime(),
		refreshReason: params.reason,
		plugins: persisted.plugins.map((plugin) => ({
			...plugin,
			enabled: resolveEffectiveEnableState({
				id: plugin.pluginId,
				origin: plugin.origin,
				config: normalizedConfig,
				rootConfig: params.config,
				enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin)
			}).enabled
		}))
	};
}
async function refreshPersistedInstalledPluginIndex(params) {
	return refreshPersistedInstalledPluginIndexSync(params);
}
function resolveRefreshedPersistedInstalledPluginIndex(params) {
	const persisted = params.reason === "policy-changed" || !params.installRecords ? readPersistedInstalledPluginIndexSync(params) : null;
	if (canRefreshPersistedPolicyState(persisted, params)) return refreshPersistedPolicyState(persisted, params);
	return refreshInstalledPluginIndex({
		...params,
		installRecords: params.installRecords ?? extractPluginInstallRecordsFromInstalledPluginIndex(persisted)
	});
}
function refreshPersistedInstalledPluginIndexSync(params) {
	const index = resolveRefreshedPersistedInstalledPluginIndex(params);
	writePersistedInstalledPluginIndexSync(index, params);
	return index;
}
function refreshPersistedInstalledPluginIndexWithLeaseSync(params) {
	const { lease, ...storeParams } = params;
	const receipt = writePersistedInstalledPluginIndexToSqlite(resolveRefreshedPersistedInstalledPluginIndex(storeParams), storeParams, lease);
	clearPersistedInstalledPluginIndexCaches();
	return receipt;
}
//#endregion
export { refreshPersistedInstalledPluginIndexSync as a, writePersistedInstalledPluginIndex as c, CONFIG_PATH_ACTIVATION_COMPAT_CODE as d, hasConfigPathActivationMetadataMigration as f, refreshPersistedInstalledPluginIndex as i, writePersistedInstalledPluginIndexSync as l, readPersistedInstalledPluginIndex as n, refreshPersistedInstalledPluginIndexWithLeaseSync as o, hasMissingConfigPathActivationMetadata as p, readPersistedInstalledPluginIndexSync as r, restorePersistedInstalledPluginIndexIfCurrent as s, parseInstalledPluginIndex as t, writePersistedInstalledPluginIndexWithLeaseSync as u };
