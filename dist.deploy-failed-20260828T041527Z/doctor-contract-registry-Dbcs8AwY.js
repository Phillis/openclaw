import { c as normalizeOptionalLowercaseString } from "./string-coerce-CIXf7egm.js";
import { r as asNullableRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { a as parseProviderModelRef } from "./model-catalog-refs-BdjEHOKQ.js";
import { t as isChannelConfigMetadataKey } from "./config-metadata-aX1D2IMg.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { n as registerPluginMetadataProcessMemoLifecycleClear } from "./plugin-metadata-lifecycle-DQWVBcP_.js";
import { n as createPluginModuleLoaderCache, r as getCachedPluginModuleLoader, t as clearPluginModuleLoaderLifecycleCache } from "./plugin-module-loader-cache-DNYw5tMM.js";
import { l as coerceDoctorSessionRouteStateOwners } from "./manifest-DFeZvDdx.js";
import { s as normalizePluginsConfig } from "./config-state-Bgpvw0Q6.js";
import { d as resolvePluginDoctorContractArtifactPath } from "./installed-plugin-index-Cr71VmpU.js";
import { n as loadPluginManifestRegistryForPluginRegistry } from "./plugin-registry-contributions-JopjOY3b.js";
import "./plugin-registry-BcpcjwxL.js";
import { t as unwrapDefaultModuleExport } from "./module-export-DsZgGIbX.js";
import { n as loadBundledPluginPublicArtifactModuleSync } from "./public-surface-loader-Zllbp6of.js";
import { r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { i as passesManifestOwnerBasePolicy, n as isActivatedManifestOwner } from "./manifest-owner-policy-BL1Kt38K.js";
import { t as definePluginDoctorMigrationFromPlans } from "./doctor-migration-plan-adapter-ICX9BMuD.js";
//#region src/channels/plugins/doctor-contract-api.ts
/**
* Loads a bundled channel's public doctor contract.
*/
function loadBundledChannelDoctorContractApi(channelId) {
	try {
		return loadBundledPluginPublicArtifactModuleSync({
			dirName: channelId,
			artifactBasename: "doctor-contract-api.js"
		});
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Unable to resolve bundled plugin public surface ")) return;
		throw error;
	}
}
//#endregion
//#region src/channels/plugins/bundled-setup-policy.ts
function shouldIncludeChannelSetupFeatureForConfig(params) {
	if (!params.config) return true;
	const pluginId = params.plugin.id;
	if (!passesManifestOwnerBasePolicy({
		plugin: { id: pluginId },
		normalizedConfig: normalizePluginsConfig(params.config.plugins),
		allowRestrictiveAllowlistBypass: true
	})) return false;
	let hasExplicitChannelDisable = false;
	for (const channelId of params.plugin.channels ?? [pluginId]) {
		const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
		if (!normalizedChannelId) continue;
		const channelConfig = params.config.channels?.[normalizedChannelId];
		if (!channelConfig || typeof channelConfig !== "object" || Array.isArray(channelConfig)) continue;
		if (channelConfig.enabled === false) {
			hasExplicitChannelDisable = true;
			continue;
		}
		return true;
	}
	return !hasExplicitChannelDisable;
}
//#endregion
//#region src/plugins/doctor-contract-module.ts
function coerceLegacyConfigRules(value) {
	if (!Array.isArray(value)) return [];
	return value.filter((entry) => {
		if (!entry || typeof entry !== "object") return false;
		const candidate = entry;
		return Array.isArray(candidate.path) && typeof candidate.message === "string";
	});
}
function coerceNormalizeCompatibilityConfig(value) {
	return typeof value === "function" ? value : void 0;
}
function coerceSessionStoreAgentIdsResolver(value) {
	return typeof value === "function" ? value : void 0;
}
function isPluginDoctorStateMigration(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return typeof candidate.id === "string" && candidate.id.trim().length > 0 && typeof candidate.label === "string" && candidate.label.trim().length > 0 && typeof candidate.detectLegacyState === "function" && typeof candidate.migrateLegacyState === "function";
}
function coercePluginDoctorStateMigrations(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isPluginDoctorStateMigration).map((migration) => ({
		id: migration.id.trim(),
		label: migration.label.trim(),
		doctorOnly: migration.doctorOnly === true ? true : void 0,
		phase: migration.phase === "after-session-repair" ? migration.phase : void 0,
		detectLegacyState: migration.detectLegacyState,
		migrateLegacyState: migration.migrateLegacyState
	}));
}
/** Coerce a loaded doctor contract once for both registry use and declaration validation. */
function coercePluginDoctorContractModule(mod) {
	const defaultExport = mod.default;
	const rules = coerceLegacyConfigRules(defaultExport?.legacyConfigRules ?? mod.legacyConfigRules);
	const normalizeCompatibilityConfig = coerceNormalizeCompatibilityConfig(mod.normalizeCompatibilityConfig ?? defaultExport?.normalizeCompatibilityConfig);
	const resolveSessionStoreAgentIds = coerceSessionStoreAgentIdsResolver(mod.resolveSessionStoreAgentIds ?? defaultExport?.resolveSessionStoreAgentIds);
	const sessionRouteStateOwners = coerceDoctorSessionRouteStateOwners(mod.sessionRouteStateOwners ?? defaultExport?.sessionRouteStateOwners);
	const stateMigrations = coercePluginDoctorStateMigrations(mod.stateMigrations ?? defaultExport?.stateMigrations);
	return {
		rules,
		normalizeCompatibilityConfig,
		resolveSessionStoreAgentIds,
		sessionRouteStateOwners,
		stateMigrations,
		summary: {
			configRepair: rules.length > 0 || Boolean(normalizeCompatibilityConfig),
			resolveSessionStoreAgentIds: Boolean(resolveSessionStoreAgentIds),
			sessionRouteStateOwners: sessionRouteStateOwners.length > 0,
			stateMigrations: stateMigrations.length > 0
		}
	};
}
//#endregion
//#region src/plugins/doctor-contract-registry-loader-state.ts
/** Shared loader state for plugin doctor contracts and test fixtures. */
const pluginDoctorContractRegistryLoaderState = {
	moduleLoaders: createPluginModuleLoaderCache(),
	moduleRoots: /* @__PURE__ */ new Map(),
	moduleLoaderFactory: void 0
};
registerPluginMetadataProcessMemoLifecycleClear(() => {
	clearPluginModuleLoaderLifecycleCache(pluginDoctorContractRegistryLoaderState);
});
//#endregion
//#region src/plugins/doctor-contract-registry.ts
const log = createSubsystemLogger("plugins/doctor-contracts");
function loadPluginDoctorContractModule(params) {
	pluginDoctorContractRegistryLoaderState.moduleRoots.set(params.modulePath, params.rootDir);
	return getCachedPluginModuleLoader({
		cache: pluginDoctorContractRegistryLoaderState.moduleLoaders,
		modulePath: params.modulePath,
		importerUrl: import.meta.url,
		...pluginDoctorContractRegistryLoaderState.moduleLoaderFactory ? { createLoader: pluginDoctorContractRegistryLoaderState.moduleLoaderFactory } : {}
	})(params.modulePath);
}
function hasLegacyElevenLabsTalkFields(raw) {
	const talk = asNullableRecord(asNullableRecord(raw)?.talk);
	if (!talk) return false;
	return [
		"voiceId",
		"voiceAliases",
		"modelId",
		"outputFormat",
		"apiKey"
	].some((key) => Object.hasOwn(talk, key));
}
function collectMediaProviderIds(root, ids) {
	const media = asNullableRecord(asNullableRecord(root.tools)?.media);
	if (!media) return;
	const modelLists = [
		media.models,
		asNullableRecord(media.audio)?.models,
		asNullableRecord(media.image)?.models,
		asNullableRecord(media.video)?.models
	];
	for (const models of modelLists) {
		if (!Array.isArray(models)) continue;
		for (const model of models) {
			const provider = asNullableRecord(model)?.provider;
			if (typeof provider === "string" && provider.trim()) ids.add(normalizeProviderId(provider));
		}
	}
}
function collectConfiguredModelProviderIds(params) {
	const addRef = (value) => {
		const parsed = typeof value === "string" ? parseProviderModelRef(value) : null;
		if (parsed) params.ids.add(normalizeProviderId(parsed.provider));
	};
	for (const ref of collectConfiguredModelRefs(params.root)) addRef(ref.value);
	const collectAgentPolicy = (value) => {
		const allow = asNullableRecord(asNullableRecord(value)?.modelPolicy)?.allow;
		if (Array.isArray(allow)) allow.forEach(addRef);
	};
	const agents = asNullableRecord(params.root.agents) ?? {};
	collectAgentPolicy(agents.defaults);
	if (Object.hasOwn(agents, "entries")) {
		const entries = asNullableRecord(agents.entries);
		if (entries) Object.values(entries).forEach(collectAgentPolicy);
	} else if (Array.isArray(agents.list)) agents.list.forEach(collectAgentPolicy);
}
function collectRelevantDoctorPluginIds(raw) {
	const ids = /* @__PURE__ */ new Set();
	const root = asNullableRecord(raw);
	if (!root) return [];
	const channels = asNullableRecord(root.channels);
	if (channels) for (const rawChannelId of Object.keys(channels)) {
		const channelId = rawChannelId.trim();
		if (channelId && !isChannelConfigMetadataKey(channelId)) ids.add(channelId);
	}
	const pluginsEntries = asNullableRecord(asNullableRecord(root.plugins)?.entries);
	if (pluginsEntries) for (const pluginId of Object.keys(pluginsEntries)) ids.add(pluginId);
	const modelProviders = asNullableRecord(asNullableRecord(root.models)?.providers);
	if (modelProviders) for (const providerId of Object.keys(modelProviders)) ids.add(providerId);
	collectMediaProviderIds(root, ids);
	collectConfiguredModelProviderIds({
		root,
		ids
	});
	if (hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
	return [...ids].toSorted();
}
function collectRelevantDoctorPluginIdsForTouchedPaths(params) {
	const root = asNullableRecord(params.raw);
	if (!root) return [];
	const ids = /* @__PURE__ */ new Set();
	collectConfiguredModelProviderIds({
		root,
		ids
	});
	for (const touchedPath of params.touchedPaths) {
		const [first, second, third] = touchedPath;
		if (first === "channels") {
			if (!second) return collectRelevantDoctorPluginIds(params.raw);
			const channelId = second.trim();
			if (channelId && !isChannelConfigMetadataKey(channelId)) ids.add(channelId);
			continue;
		}
		if (first === "plugins") {
			if (second !== "entries" || !third) return collectRelevantDoctorPluginIds(params.raw);
			ids.add(third);
			continue;
		}
		if (first === "models") {
			if (second !== "providers" || !third) return collectRelevantDoctorPluginIds(params.raw);
			ids.add(third);
			continue;
		}
		if (first === "tools" && second === "media") {
			collectMediaProviderIds(root, ids);
			continue;
		}
		if (first === "talk" && hasLegacyElevenLabsTalkFields(root)) ids.add("elevenlabs");
	}
	return [...ids].toSorted();
}
function loadPluginDoctorContractEntry(record) {
	const contractSource = resolvePluginDoctorContractArtifactPath(record.rootDir);
	if (!contractSource) return null;
	let mod;
	try {
		mod = loadPluginDoctorContractModule({
			modulePath: contractSource,
			rootDir: record.rootDir
		});
	} catch (error) {
		log.warn(`failed to load doctor contract for ${record.id} from ${contractSource}: ${formatErrorMessage(error)}`);
		return null;
	}
	const { summary, ...contract } = coercePluginDoctorContractModule(mod);
	if (!Object.values(summary).some(Boolean)) return null;
	return {
		pluginId: record.id,
		...contract
	};
}
function resolvePluginDoctorManifestRecords(params) {
	const env = params?.env ?? process.env;
	if (params?.pluginIds && params.pluginIds.length === 0) return [];
	const manifestRegistry = loadPluginManifestRegistryForPluginRegistry({
		config: params?.config,
		workspaceDir: params?.workspaceDir,
		env,
		includeDisabled: true
	});
	const scopedPluginIds = params?.pluginIds ? new Set(params.pluginIds) : null;
	return manifestRegistry.plugins.filter((record) => !(scopedPluginIds && !scopedPluginIds.has(record.id) && !(record.packageName && scopedPluginIds.has(record.packageName)) && !record.legacyPluginIds?.some((pluginId) => scopedPluginIds.has(pluginId)) && !record.channels.some((channelId) => scopedPluginIds.has(channelId)) && !record.providers.some((providerId) => scopedPluginIds.has(providerId))));
}
function resolvePluginDoctorContracts(params) {
	return loadPluginDoctorContractEntries({
		records: resolvePluginDoctorManifestRecords(params),
		surface: params.surface
	});
}
function loadPluginDoctorContractEntries(params) {
	const entries = [];
	for (const record of params.records) {
		const declaration = record.doctorContract;
		if (declaration && declaration[params.surface] !== true) continue;
		const entry = loadPluginDoctorContractEntry(record);
		if (entry) entries.push(entry);
	}
	return entries;
}
function listPluginDoctorLegacyConfigRules(params) {
	return resolvePluginDoctorContracts({
		...params,
		surface: "configRepair"
	}).flatMap((entry) => entry.rules);
}
function listPluginDoctorSessionRouteStateOwners(params) {
	const owners = /* @__PURE__ */ new Map();
	const records = resolvePluginDoctorManifestRecords(params ?? {});
	const manifestOwners = records.flatMap((record) => record.sessionRouteStateOwners ?? []);
	const legacyModuleOwners = loadPluginDoctorContractEntries({
		records: records.filter((record) => record.sessionRouteStateOwners === void 0),
		surface: "sessionRouteStateOwners"
	}).flatMap((entry) => entry.sessionRouteStateOwners);
	for (const owner of [...manifestOwners, ...legacyModuleOwners]) if (!owners.has(owner.id)) owners.set(owner.id, owner);
	return [...owners.values()].toSorted((left, right) => left.id.localeCompare(right.id));
}
/** Resolve plugin-owned agent IDs whose core session stores need migration. */
function listPluginDoctorSessionStoreAgentIds(params) {
	const cfg = params?.config ?? {};
	const agentIds = /* @__PURE__ */ new Set();
	for (const entry of resolvePluginDoctorContracts({
		...params,
		surface: "resolveSessionStoreAgentIds"
	})) {
		let resolved;
		try {
			resolved = entry.resolveSessionStoreAgentIds?.({ cfg });
		} catch {
			continue;
		}
		for (const agentId of normalizeTrimmedStringList(resolved)) agentIds.add(agentId);
	}
	return [...agentIds].toSorted();
}
function loadLegacyChannelStateMigrationDetector(record) {
	if (!record.setupSource) return null;
	try {
		const entry = unwrapDefaultModuleExport(loadPluginDoctorContractModule({
			modulePath: record.setupSource,
			rootDir: record.rootDir
		}));
		if (entry?.kind !== "bundled-channel-setup-entry" || typeof entry.loadSetupPlugin !== "function") return null;
		const directDetector = typeof entry.loadLegacyStateMigrationDetector === "function" ? entry.loadLegacyStateMigrationDetector() : void 0;
		if (typeof directDetector === "function") return directDetector;
		if (entry.features?.legacyStateMigrations !== true) return null;
		const lifecycleDetector = entry.loadSetupPlugin().lifecycle?.detectLegacyStateMigrations;
		return typeof lifecycleDetector === "function" ? lifecycleDetector : null;
	} catch (error) {
		log.warn(`failed to load legacy state migration for ${record.id} from ${record.setupSource}: ${formatErrorMessage(error)}`);
		return null;
	}
}
function listPluginDoctorStateMigrationEntries(params) {
	const entries = [];
	const normalizedConfig = normalizePluginsConfig(params?.config?.plugins);
	for (const record of resolvePluginDoctorManifestRecords(params ?? {})) {
		const channelOwner = record.channels.length > 0;
		if (channelOwner && !shouldIncludeChannelSetupFeatureForConfig({
			plugin: record,
			config: params?.config
		})) continue;
		if (record.origin !== "bundled" && !isActivatedManifestOwner({
			plugin: record,
			normalizedConfig,
			rootConfig: params?.config
		})) continue;
		const modernEntries = loadPluginDoctorContractEntries({
			records: [record],
			surface: "stateMigrations"
		}).flatMap((entry) => entry.stateMigrations.map((migration) => ({
			pluginId: entry.pluginId,
			migration
		})));
		if (modernEntries.length > 0) {
			entries.push(...modernEntries);
			continue;
		}
		if (record.doctorContract?.stateMigrations === true) continue;
		if (!channelOwner) continue;
		const detector = loadLegacyChannelStateMigrationDetector(record);
		if (!detector) continue;
		entries.push({
			pluginId: record.id,
			migration: definePluginDoctorMigrationFromPlans({
				id: `${record.id}-legacy-channel-state`,
				label: `${record.id} legacy channel state`,
				resolvePlans: detector
			})
		});
	}
	return entries;
}
function applyPluginDoctorCompatibilityMigrations(cfg, params) {
	let nextCfg = cfg;
	const changes = [];
	for (const entry of resolvePluginDoctorContracts({
		...params,
		surface: "configRepair"
	})) {
		const mutation = entry.normalizeCompatibilityConfig?.({ cfg: nextCfg });
		if (!mutation || mutation.changes.length === 0) continue;
		nextCfg = mutation.config;
		changes.push(...mutation.changes);
	}
	return {
		config: nextCfg,
		changes
	};
}
//#endregion
export { listPluginDoctorSessionRouteStateOwners as a, shouldIncludeChannelSetupFeatureForConfig as c, listPluginDoctorLegacyConfigRules as i, loadBundledChannelDoctorContractApi as l, collectRelevantDoctorPluginIds as n, listPluginDoctorSessionStoreAgentIds as o, collectRelevantDoctorPluginIdsForTouchedPaths as r, listPluginDoctorStateMigrationEntries as s, applyPluginDoctorCompatibilityMigrations as t };
