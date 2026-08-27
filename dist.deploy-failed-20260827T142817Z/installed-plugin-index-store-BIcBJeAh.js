import "./src-BkwWvwB2.js";
import { t as safeParseJson } from "./json-coercion-ighRFv8Y.js";
import { At as boolean, Et as array, Nn as record, Rn as string, Tn as object, Xn as union, Zn as unknown, dn as literal, wn as number } from "./schemas-CZ9Toj_c.js";
import { t as clearPluginMetadataLifecycleCaches } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { s as resolveCompatibilityHostVersion } from "./version-o4XN9fka.js";
import { c as resolveEffectiveEnableState, s as normalizePluginsConfig } from "./config-state-CpuWFwzR.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { a as inspectPluginInstallRecordMap, c as serializePluginInstallRecordMap, l as setPluginInstallRecordMapEntry, o as parsePluginInstallRecord, r as createPluginInstallRecordMap, s as parsePluginInstallRecordMap, t as PluginInstallRecordSchema } from "./plugin-install-record-map-B3dUHyOF.js";
import { f as resolveCompatRegistryVersion, i as loadInstalledPluginIndex, m as hashJson, n as hasInstalledPluginIndexWorkspaceScopeMismatch, o as refreshInstalledPluginIndex, p as resolveInstalledPluginIndexPolicyHash, s as INSTALLED_PLUGIN_INDEX_WARNING, v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-BC03OFwf.js";
import { n as recordInstalledPluginIndexInstallOwner, r as resolveInstalledPluginIndexInstallOwner, t as isInstalledPluginIndexInstallOwnerAmbiguous } from "./installed-plugin-index-install-owner-Bd-Byre8.js";
import { l as clearLoadInstalledPluginIndexInstallRecordsCache, o as resolveInstalledPluginIndexStateDatabaseOptions, s as resolveInstalledPluginIndexStorePath } from "./installed-plugin-index-record-reader-DArXGVRI.js";
import { h as runOpenClawStateWriteTransaction } from "./openclaw-state-db-CXrhNigN.js";
import { n as withOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DzZaraqY.js";
import { n as safeParseWithSchema } from "./zod-parse-Bip-sZi_.js";
import { t as hasMissingInstalledPluginOwnerMetadata } from "./installed-plugin-package-ownership-DMNKpP-8.js";
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
//#region src/plugins/installed-plugin-index-invalidation.ts
function diffInstalledPluginIndexInvalidationReasons(previous, current) {
	const reasons = /* @__PURE__ */ new Set();
	if (previous.version !== current.version) reasons.add("missing");
	if (previous.hostContractVersion !== current.hostContractVersion) reasons.add("host-contract-changed");
	if (previous.compatRegistryVersion !== current.compatRegistryVersion) reasons.add("compat-registry-changed");
	if (previous.migrationVersion !== current.migrationVersion) reasons.add("migration");
	if (previous.policyHash !== current.policyHash) reasons.add("policy-changed");
	if (hashJson(previous.installRecords ?? {}) !== hashJson(current.installRecords ?? {})) reasons.add("source-changed");
	const previousByPluginId = new Map(previous.plugins.map((plugin) => [plugin.pluginId, plugin]));
	const currentByPluginId = new Map(current.plugins.map((plugin) => [plugin.pluginId, plugin]));
	for (const [pluginId, previousPlugin] of previousByPluginId) {
		const currentPlugin = currentByPluginId.get(pluginId);
		if (!currentPlugin) {
			reasons.add("source-changed");
			continue;
		}
		if (previousPlugin.rootDir !== currentPlugin.rootDir || previousPlugin.manifestPath !== currentPlugin.manifestPath || resolveInstalledPluginIndexInstallOwner(previousPlugin) !== resolveInstalledPluginIndexInstallOwner(currentPlugin) || isInstalledPluginIndexInstallOwnerAmbiguous(previousPlugin) !== isInstalledPluginIndexInstallOwnerAmbiguous(currentPlugin) || previousPlugin.installRecordHash !== currentPlugin.installRecordHash) reasons.add("source-changed");
		if (previousPlugin.enabled !== currentPlugin.enabled) reasons.add("policy-changed");
		if (hasConfigPathActivationMetadataMigration({
			previous: previousPlugin,
			current: currentPlugin
		})) reasons.add("migration");
		if (previousPlugin.manifestHash !== currentPlugin.manifestHash || previousPlugin.doctorContractHash !== currentPlugin.doctorContractHash) reasons.add("stale-manifest");
		if (previousPlugin.packageVersion !== currentPlugin.packageVersion || previousPlugin.packageJson?.path !== currentPlugin.packageJson?.path || previousPlugin.packageJson?.hash !== currentPlugin.packageJson?.hash) reasons.add("stale-package");
	}
	for (const pluginId of currentByPluginId.keys()) if (!previousByPluginId.has(pluginId)) {
		if (currentByPluginId.get(pluginId)?.enabled === false) continue;
		reasons.add("source-changed");
	}
	return Array.from(reasons).toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/installed-plugin-index-store.ts
/** Persists, inspects, and refreshes the installed plugin index in the state database. */
const StringArraySchema = array(string());
const INSTALLED_PLUGIN_INDEX_SQLITE_KEY = "installed-plugin-index";
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
function parseInstalledPluginIndexSqliteRow(row) {
	if (!row) return null;
	return parseInstalledPluginIndex({
		version: Number(row.version),
		...row.warning ? { warning: row.warning } : {},
		hostContractVersion: row.host_contract_version,
		compatRegistryVersion: row.compat_registry_version,
		migrationVersion: Number(row.migration_version),
		policyHash: row.policy_hash,
		generatedAtMs: Number(row.generated_at_ms),
		...row.workspace_dir !== null ? { workspaceDir: row.workspace_dir } : {},
		...row.refresh_reason ? { refreshReason: row.refresh_reason } : {},
		installRecords: safeParseJson(row.install_records_json),
		plugins: safeParseJson(row.plugins_json),
		diagnostics: safeParseJson(row.diagnostics_json)
	});
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
	return database.prepare(`
        SELECT version, warning, host_contract_version, compat_registry_version,
               migration_version, policy_hash, generated_at_ms, workspace_dir,
               refresh_reason,
               install_records_json, plugins_json, diagnostics_json, updated_at_ms
          FROM installed_plugin_index
         WHERE index_key = ?
      `).get(INSTALLED_PLUGIN_INDEX_SQLITE_KEY);
}
function resolveNextInstalledPluginIndexRevision(current) {
	return Math.max(Date.now(), (current ?? 0) + 1);
}
function writePersistedInstalledPluginIndexRow(database, index, revision) {
	database.prepare(`
        INSERT INTO installed_plugin_index (
          index_key, version, host_contract_version, compat_registry_version,
          migration_version, policy_hash, generated_at_ms, workspace_dir, refresh_reason,
          install_records_json, plugins_json, diagnostics_json, warning, updated_at_ms
        ) VALUES (
          @index_key, @version, @host_contract_version, @compat_registry_version,
          @migration_version, @policy_hash, @generated_at_ms, @workspace_dir, @refresh_reason,
          @install_records_json, @plugins_json, @diagnostics_json, @warning, @updated_at_ms
        )
        ON CONFLICT(index_key) DO UPDATE SET
          version = excluded.version,
          host_contract_version = excluded.host_contract_version,
          compat_registry_version = excluded.compat_registry_version,
          migration_version = excluded.migration_version,
          policy_hash = excluded.policy_hash,
          generated_at_ms = excluded.generated_at_ms,
          workspace_dir = excluded.workspace_dir,
          refresh_reason = excluded.refresh_reason,
          install_records_json = excluded.install_records_json,
          plugins_json = excluded.plugins_json,
          diagnostics_json = excluded.diagnostics_json,
          warning = excluded.warning,
          updated_at_ms = excluded.updated_at_ms
      `).run({
		index_key: INSTALLED_PLUGIN_INDEX_SQLITE_KEY,
		version: index.version,
		host_contract_version: index.hostContractVersion,
		compat_registry_version: index.compatRegistryVersion,
		migration_version: index.migrationVersion,
		policy_hash: index.policyHash,
		generated_at_ms: index.generatedAtMs,
		workspace_dir: index.workspaceDir ?? null,
		refresh_reason: index.refreshReason ?? null,
		install_records_json: serializePluginInstallRecordMap(index.installRecords),
		plugins_json: JSON.stringify(index.plugins.map((plugin) => {
			const installOwner = resolveInstalledPluginIndexInstallOwner(plugin);
			return {
				...plugin,
				...installOwner ? { installOwner } : {},
				...isInstalledPluginIndexInstallOwnerAmbiguous(plugin) ? { installOwnerAmbiguous: true } : {}
			};
		})),
		diagnostics_json: JSON.stringify(index.diagnostics),
		warning: index.warning ?? "DO NOT EDIT. This file is generated by OpenClaw from plugin manifests, install records, and config policy. Use `openclaw plugins registry --refresh`, `openclaw plugins install/update/uninstall`, or `openclaw plugins enable/disable` instead.",
		updated_at_ms: revision
	});
}
function readPersistedInstalledPluginIndexFromSqlite(options = {}) {
	if (options.filePath?.endsWith(".json")) return null;
	if (!existsSync(resolveInstalledPluginIndexStorePath(options))) return null;
	try {
		return withOpenClawStateDatabaseReadOnly(({ db }) => parseInstalledPluginIndexSqliteRow(readInstalledPluginIndexRow(db)), resolveInstalledPluginIndexStateDatabaseOptions(options));
	} catch {
		return null;
	}
}
function writePersistedInstalledPluginIndexToSqlite(index, options = {}, lease) {
	assertWritableInstalledPluginIndexStoreOptions(options);
	const persisted = preparePersistedInstalledPluginIndex(index);
	return runOpenClawStateWriteTransaction(({ db }) => {
		const previousRow = readInstalledPluginIndexRow(db);
		if (previousRow) {
			const previousInstallRecords = safeParseJson(previousRow.install_records_json);
			if (previousInstallRecords === void 0 || inspectPluginInstallRecordMap(previousInstallRecords).status === "invalid") throw new Error("Persisted plugin install records are invalid. Repair the state before writing plugin installation metadata.");
		}
		lease?.assertOwnedInTransaction(db);
		const revision = resolveNextInstalledPluginIndexRevision(previousRow ? Number(previousRow.updated_at_ms) : null);
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
		const currentRevision = currentRow ? Number(currentRow.updated_at_ms) : null;
		if (currentRevision !== expectedRevision) return false;
		if (index) writePersistedInstalledPluginIndexRow(db, preparePersistedInstalledPluginIndex(index), resolveNextInstalledPluginIndexRevision(currentRevision));
		else db.prepare(`
          DELETE FROM installed_plugin_index
           WHERE index_key = ?
        `).run(INSTALLED_PLUGIN_INDEX_SQLITE_KEY);
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
function hasPolicyRefreshTargets(persisted, policyPluginIds) {
	if (!policyPluginIds || policyPluginIds.length === 0) return true;
	const pluginIds = new Set(persisted.plugins.map((plugin) => plugin.pluginId));
	return policyPluginIds.every((pluginId) => pluginIds.has(pluginId));
}
function canRefreshPersistedPolicyState(persisted, params) {
	if (!persisted || params.reason !== "policy-changed") return false;
	if ((params.diagnostics?.length ?? 0) > 0 || persisted.diagnostics.some((diagnostic) => diagnostic.code === "workspace-scope-omitted") || hasInstalledPluginIndexWorkspaceScopeMismatch(persisted, params.workspaceDir)) return false;
	const env = params.env ?? process.env;
	if (persisted.version !== 1 || persisted.hostContractVersion !== resolveCompatibilityHostVersion(env) || persisted.compatRegistryVersion !== resolveCompatRegistryVersion() || persisted.migrationVersion !== 1 || hasMissingConfigPathActivationMetadata(persisted) || hasMissingInstalledPluginOwnerMetadata(persisted, env)) return false;
	if (params.installRecords && hashJson(params.installRecords) !== hashJson(persisted.installRecords ?? {})) return false;
	return hasPolicyRefreshTargets(persisted, params.policyPluginIds);
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
async function inspectPersistedInstalledPluginIndex(params = {}) {
	const persisted = await readPersistedInstalledPluginIndex(params);
	const current = loadInstalledPluginIndex({
		...params,
		installRecords: params.installRecords ?? extractPluginInstallRecordsFromInstalledPluginIndex(persisted)
	});
	if (!persisted) return {
		state: "missing",
		refreshReasons: ["missing"],
		persisted: null,
		current
	};
	const refreshReasons = diffInstalledPluginIndexInvalidationReasons(persisted, current);
	return {
		state: refreshReasons.length > 0 ? "stale" : "fresh",
		refreshReasons,
		persisted,
		current
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
export { refreshPersistedInstalledPluginIndex as a, restorePersistedInstalledPluginIndexIfCurrent as c, writePersistedInstalledPluginIndexWithLeaseSync as d, diffInstalledPluginIndexInvalidationReasons as f, readPersistedInstalledPluginIndexSync as i, writePersistedInstalledPluginIndex as l, hasMissingConfigPathActivationMetadata as m, parseInstalledPluginIndex as n, refreshPersistedInstalledPluginIndexSync as o, CONFIG_PATH_ACTIVATION_COMPAT_CODE as p, readPersistedInstalledPluginIndex as r, refreshPersistedInstalledPluginIndexWithLeaseSync as s, inspectPersistedInstalledPluginIndex as t, writePersistedInstalledPluginIndexSync as u };
