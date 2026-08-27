import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as loadInstalledPluginIndex } from "./installed-plugin-index-B1BZ_yR8.js";
import { c as copyPluginInstallRecordMap, d as inspectPluginInstallRecordMap, h as setPluginInstallRecordMapEntry } from "./official-external-install-records-HG9WW4vi.js";
import { d as resolveInstalledPluginIndexStorePath, l as inspectPersistedInstalledPluginIndexInstallRecordsSync, o as loadInstalledPluginIndexInstallRecords } from "./manifest-registry-DRErrq38.js";
import { c as writePersistedInstalledPluginIndex, r as readPersistedInstalledPluginIndexSync } from "./installed-plugin-index-store-C2-lMOHF.js";
import { t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-Ca7vUCL6.js";
import "./installed-plugin-index-records-CyommlnD.js";
import fs from "node:fs";
//#region src/config/plugin-install-config-migration.ts
function pruneEmptyPluginsObject(plugins) {
	const { installs: _installs, ...rest } = plugins;
	return Object.keys(rest).length === 0 ? void 0 : rest;
}
/**
* Reads legacy shipped `plugins.installs` records for migration into the plugin index.
*
* Invalid install maps are ignored so config loading can keep using the stripped
* runtime config while doctor/write paths decide how to report or recover.
*/
function extractShippedPluginInstallConfigRecords(config) {
	const state = inspectShippedPluginInstallConfigRecords(config);
	return state.status === "valid" ? state.records : {};
}
function inspectShippedPluginInstallConfigRecords(config) {
	if (!isRecord(config) || !isRecord(config.plugins)) return { status: "missing" };
	return inspectPluginInstallRecordMap(config.plugins.installs);
}
/** Removes legacy shipped `plugins.installs` without mutating the original config object. */
function stripShippedPluginInstallConfigRecords(config) {
	if (!isRecord(config) || !isRecord(config.plugins) || !("installs" in config.plugins)) return config;
	const plugins = pruneEmptyPluginsObject(config.plugins);
	const { plugins: _plugins, ...rest } = config;
	return plugins === void 0 ? rest : {
		...rest,
		plugins
	};
}
//#endregion
//#region src/commands/doctor/shared/plugin-registry-migration.ts
const DOCTOR_PLUGIN_ID_ALIASES = { openai: ["openai-codex"] };
var InvalidPluginInstallRecordStateError = class extends Error {};
function invalidPersistedInstallRecordMessage(filePath) {
	return [`Persisted plugin install records are invalid at ${filePath}.`, "Stop the Gateway, back up this database, delete only the config_machine_state row with state_key='plugins.installedIndex' using SQLite tooling, then rerun `openclaw doctor --fix` to rebuild it."].join(" ");
}
const INVALID_CONFIG_INSTALL_RECORD_MESSAGE = "plugins.installs contains invalid records. Back up openclaw.json, correct or remove the invalid retired plugins.installs record, then rerun `openclaw doctor --fix`.";
/** Decide whether plugin install registry migration should run for this environment. */
function preflightPluginRegistryInstallMigration(params = {}) {
	const filePath = resolveInstalledPluginIndexStorePath(params);
	const persistedState = inspectPersistedInstalledPluginIndexInstallRecordsSync(params);
	if (persistedState.status === "invalid") throw new InvalidPluginInstallRecordStateError(invalidPersistedInstallRecordMessage(filePath));
	const configInstallState = params.config ? inspectShippedPluginInstallConfigRecords(params.config) : void 0;
	if (configInstallState?.status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	if ((params.existsSync ?? fs.existsSync)(filePath)) {
		const currentRegistry = readPersistedInstalledPluginIndexSync(params);
		if (currentRegistry) return {
			action: "skip-existing",
			filePath,
			current: currentRegistry
		};
		if (persistedState.status !== "missing") return {
			action: "migrate",
			filePath
		};
	}
	const hasConfigInstallRecords = configInstallState?.status === "valid" && Object.keys(configInstallState.records).length > 0;
	return {
		action: params.config && !hasConfigInstallRecords ? "initialize" : "migrate",
		filePath
	};
}
async function readMigrationConfig(params) {
	if (params.config) return params.config;
	if (params.readConfig) return await params.readConfig();
	return await (await import("./config/config.js")).readBestEffortConfig();
}
function normalizeRegistryReference(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	return trimmed ? trimmed.toLowerCase() : void 0;
}
function createMigrationPluginIdNormalizer(index, manifests) {
	const aliases = /* @__PURE__ */ new Map();
	for (const plugin of index.plugins) {
		const pluginId = normalizeRegistryReference(plugin.pluginId);
		if (!pluginId) continue;
		aliases.set(pluginId, plugin.pluginId);
	}
	for (const plugin of manifests) {
		const pluginId = normalizeRegistryReference(plugin.id);
		if (!pluginId) continue;
		aliases.set(pluginId, plugin.id);
		for (const alias of [
			...plugin.providers,
			...plugin.channels,
			...plugin.setup?.providers?.map((provider) => provider.id) ?? [],
			...plugin.cliBackends,
			...plugin.setup?.cliBackends ?? [],
			...Object.keys(plugin.modelCatalog?.providers ?? {}),
			...plugin.legacyPluginIds ?? [],
			...DOCTOR_PLUGIN_ID_ALIASES[plugin.id] ?? []
		]) {
			const normalizedAlias = normalizeRegistryReference(alias);
			if (normalizedAlias && !aliases.has(normalizedAlias)) aliases.set(normalizedAlias, plugin.id);
		}
	}
	return (pluginId) => {
		const normalized = normalizeRegistryReference(pluginId);
		return normalized ? aliases.get(normalized) ?? pluginId.trim() : pluginId.trim();
	};
}
function addPluginReference(references, normalizePluginId, value) {
	if (typeof value !== "string") return;
	const normalized = normalizePluginId(value);
	if (normalized) references.add(normalized);
}
function listConfiguredChannelIds(config) {
	const channels = config.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return /* @__PURE__ */ new Set();
	return new Set(Object.keys(channels).map((channelId) => normalizeRegistryReference(channelId)).filter((channelId) => Boolean(channelId)));
}
function listConfiguredModelProviderIds(config) {
	const providers = config.models?.providers;
	if (!providers || typeof providers !== "object" || Array.isArray(providers)) return /* @__PURE__ */ new Set();
	return new Set(Object.keys(providers).map((providerId) => normalizeProviderId(providerId)).filter(Boolean));
}
function listMigrationRelevantPluginRecords(params) {
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index: params.index,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		includeDisabled: true
	});
	const manifestByPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	const normalizePluginId = createMigrationPluginIdNormalizer(params.index, manifestRegistry.plugins);
	const referencedPluginIds = /* @__PURE__ */ new Set();
	const installedPluginIds = /* @__PURE__ */ new Set();
	for (const pluginId of Object.keys(params.installRecords)) addPluginReference(installedPluginIds, normalizePluginId, pluginId);
	const plugins = params.config.plugins;
	for (const pluginId of plugins?.allow ?? []) addPluginReference(referencedPluginIds, normalizePluginId, pluginId);
	for (const pluginId of plugins?.deny ?? []) addPluginReference(referencedPluginIds, normalizePluginId, pluginId);
	for (const pluginId of Object.keys(plugins?.entries ?? {})) addPluginReference(referencedPluginIds, normalizePluginId, pluginId);
	for (const pluginId of Object.values(plugins?.slots ?? {})) {
		if (normalizeRegistryReference(pluginId) === "none") continue;
		addPluginReference(referencedPluginIds, normalizePluginId, pluginId);
	}
	const configuredChannelIds = listConfiguredChannelIds(params.config);
	const configuredModelProviderIds = listConfiguredModelProviderIds(params.config);
	return params.index.plugins.filter((plugin) => {
		if (plugin.origin !== "bundled") return true;
		const manifest = manifestByPluginId.get(plugin.pluginId);
		if (plugin.enabledByDefault && (manifest?.providers.length ?? 0) > 0) return true;
		if (plugin.startup.memory) return true;
		if ((manifest?.commandAliases ?? []).some((alias) => alias.cliCommand)) return true;
		if ((manifest?.contracts?.migrationProviders?.length ?? 0) > 0) return true;
		if (installedPluginIds.has(plugin.pluginId) || referencedPluginIds.has(plugin.pluginId)) return true;
		if ((manifest?.channels ?? []).some((channelId) => configuredChannelIds.has(normalizeRegistryReference(channelId) ?? ""))) return true;
		return (manifest?.providers ?? []).some((providerId) => configuredModelProviderIds.has(normalizeProviderId(providerId)));
	});
}
/** Persist a migrated plugin install registry from legacy config/install records when needed. */
async function migratePluginRegistryForInstall(params = {}) {
	const preflight = preflightPluginRegistryInstallMigration(params);
	if (preflight.action === "skip-existing") return {
		status: "skip-existing",
		migrated: false,
		preflight
	};
	if (params.dryRun) return {
		status: "dry-run",
		migrated: false,
		preflight
	};
	const rawConfig = await readMigrationConfig(params);
	if (inspectShippedPluginInstallConfigRecords(rawConfig).status === "invalid") throw new InvalidPluginInstallRecordStateError(INVALID_CONFIG_INSTALL_RECORD_MESSAGE);
	const config = stripShippedPluginInstallConfigRecords(rawConfig);
	const durableInstallRecords = params.installRecords ?? await loadInstalledPluginIndexInstallRecords(params);
	const installRecords = copyPluginInstallRecordMap(extractShippedPluginInstallConfigRecords(rawConfig));
	for (const [pluginId, record] of Object.entries(durableInstallRecords)) setPluginInstallRecordMapEntry(installRecords, pluginId, record);
	const candidateIndex = loadInstalledPluginIndex({
		...params,
		config,
		installRecords
	});
	const current = {
		...candidateIndex,
		refreshReason: "migration",
		plugins: listMigrationRelevantPluginRecords({
			index: candidateIndex,
			config,
			installRecords,
			workspaceDir: params.workspaceDir,
			env: params.env
		})
	};
	await writePersistedInstalledPluginIndex(current, params);
	return {
		status: "migrated",
		migrated: true,
		preflight,
		current
	};
}
//#endregion
export { migratePluginRegistryForInstall as n, preflightPluginRegistryInstallMigration as r, InvalidPluginInstallRecordStateError as t };
