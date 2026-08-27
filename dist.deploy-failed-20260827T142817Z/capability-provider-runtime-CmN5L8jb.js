import { _ as sortUniqueStrings } from "./string-normalization-e_fvmxMf.js";
import { n as discoverOpenClawPlugins } from "./discovery-C2Bhkw0t.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import { n as loadPluginManifestRegistryCore } from "./manifest-registry-DH1L0Z7Y.js";
import { n as isManifestPluginAvailableForControlPlane, o as loadManifestContractSnapshot, r as isManifestPluginOwnerAllowedByControlPlanePolicy, t as hasManifestContractValue } from "./manifest-contract-eligibility-DppTp7ET.js";
import { a as resolveRuntimePluginRegistry, s as loadOpenClawPluginsWithInternalOverrides, w as resolveVoiceModelRefs } from "./loader-CwiP0Igf.js";
import { r as normalizeCapabilityProviderId } from "./provider-registry-shared-CYfJZ_PT.js";
import { t as withBundledPluginEnablementCompat } from "./bundled-compat-C_RyeoZF.js";
import { a as registryContainsRuntimePluginIds, n as getLoadedRuntimePluginRegistry } from "./active-runtime-registry-DA-5LJYr.js";
//#region src/plugins/bundled-capability-runtime.ts
/** Loads capability providers through the canonical scoped plugin loader. */
const log = createSubsystemLogger("plugins");
function createCapabilityRegistrationRuntime(config) {
	return { config: {
		current: () => config,
		mutateConfigFile: async () => {
			throw new Error("Capability discovery cannot mutate plugin configuration.");
		},
		replaceConfigFile: async () => {
			throw new Error("Capability discovery cannot replace plugin configuration.");
		}
	} };
}
function loadBundledCapabilityRuntimeRegistry(params) {
	const env = params.env ?? process.env;
	const config = params.config?.plugins?.enabled === false ? params.config : withBundledPluginEnablementCompat({
		config: params.config,
		pluginIds: params.pluginIds
	}) ?? {};
	const discovery = params.discovery ?? discoverOpenClawPlugins({ env });
	const pluginIds = new Set(params.pluginIds);
	const manifestRegistry = loadPluginManifestRegistryCore({
		config,
		env,
		candidates: discovery.candidates,
		diagnostics: discovery.diagnostics
	});
	const scopedManifestRegistry = {
		plugins: manifestRegistry.plugins.filter((plugin) => plugin.origin === "bundled" && pluginIds.has(plugin.id)),
		diagnostics: manifestRegistry.diagnostics
	};
	return loadOpenClawPluginsWithInternalOverrides({
		config,
		env,
		onlyPluginIds: [...params.pluginIds],
		pluginSdkResolution: params.pluginSdkResolution,
		cache: false,
		activate: false,
		channelPluginLoadIntent: "full",
		manifestRegistry: scopedManifestRegistry,
		logger: {
			info: (message) => log.info(message),
			warn: (message) => log.warn(message),
			error: (message) => log.error(message),
			debug: (message) => log.debug(message)
		}
	}, {
		runtime: createCapabilityRegistrationRuntime(config),
		moduleLoader: {
			installNativeSdkResolver: false,
			loaderFilename: import.meta.url
		}
	});
}
//#endregion
//#region src/plugins/capability-provider-runtime.ts
const CAPABILITY_CONTRACT_KEY = {
	embeddingProviders: "embeddingProviders",
	memoryEmbeddingProviders: "memoryEmbeddingProviders",
	speechProviders: "speechProviders",
	realtimeTranscriptionProviders: "realtimeTranscriptionProviders",
	realtimeVoiceProviders: "realtimeVoiceProviders",
	mediaUnderstandingProviders: "mediaUnderstandingProviders",
	transcriptSourceProviders: "transcriptSourceProviders",
	imageGenerationProviders: "imageGenerationProviders",
	videoGenerationProviders: "videoGenerationProviders",
	musicGenerationProviders: "musicGenerationProviders"
};
function shouldMergeManifestProvidersWhenActive(key) {
	return key === "imageGenerationProviders" || key === "videoGenerationProviders" || key === "musicGenerationProviders";
}
function shouldSkipCapabilityResolution(params) {
	return params.cfg?.plugins?.enabled === false && params.key !== "speechProviders";
}
/** Loads the manifest snapshot used to resolve capability-provider ownership. */
function loadCapabilityManifestSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	return loadManifestContractSnapshot({
		config: params.cfg,
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	});
}
function resolveCapabilityPluginIds(params) {
	const contractKey = CAPABILITY_CONTRACT_KEY[params.key];
	const snapshot = loadCapabilityManifestSnapshot(params);
	const availableContractPlugins = snapshot.plugins.filter((plugin) => hasManifestContractValue({
		plugin,
		contract: contractKey,
		value: params.providerId
	}) && isManifestPluginAvailableForControlPlane({
		snapshot,
		plugin,
		config: params.cfg,
		allowRestrictiveAllowlistBypass: params.key === "speechProviders" && params.cfg?.plugins?.enabled === false
	}));
	return {
		runtimePluginIds: sortUniqueStrings(availableContractPlugins.map((plugin) => plugin.id)),
		bundledCompatPluginIds: sortUniqueStrings(availableContractPlugins.filter((plugin) => plugin.origin === "bundled").map((plugin) => plugin.id))
	};
}
function createCapabilityProviderLoadOptions(params) {
	const pluginIds = params.resolution.bundledCompatPluginIds;
	const config = withBundledPluginEnablementCompat({
		config: params.cfg,
		pluginIds
	});
	return {
		...config === void 0 ? {} : { config },
		onlyPluginIds: params.resolution.runtimePluginIds,
		activate: false
	};
}
function findProviderById(entries, providerId) {
	const normalizedProviderId = normalizeCapabilityProviderId(providerId);
	if (!normalizedProviderId) return;
	const providerEntries = entries;
	for (const entry of providerEntries) if (typeof entry.provider.id === "string" && normalizeCapabilityProviderId(entry.provider.id) === normalizedProviderId) return entry.provider;
	for (const entry of providerEntries) if ((Array.isArray(entry.provider.aliases) ? entry.provider.aliases : []).some((alias) => typeof alias === "string" && normalizeCapabilityProviderId(alias) === normalizedProviderId)) return entry.provider;
}
function mergeCapabilityProviders(left, right) {
	const merged = /* @__PURE__ */ new Map();
	const unnamed = [];
	const addEntries = (entries) => {
		for (const entry of entries) {
			const provider = entry.provider;
			if (!provider.id) {
				unnamed.push(provider);
				continue;
			}
			if (!merged.has(provider.id)) merged.set(provider.id, provider);
		}
	};
	addEntries(left);
	addEntries(right);
	return [...merged.values(), ...unnamed];
}
function mergeCapabilityProviderEntries(left, right) {
	const merged = /* @__PURE__ */ new Map();
	const unnamed = [];
	const addEntries = (entries) => {
		for (const entry of entries) {
			const provider = entry.provider;
			if (!provider.id) {
				unnamed.push(entry);
				continue;
			}
			if (!merged.has(provider.id)) merged.set(provider.id, entry);
		}
	};
	addEntries(left);
	addEntries(right);
	return [...merged.values(), ...unnamed];
}
function addObjectKeys(target, value) {
	if (typeof value !== "object" || value === null || Array.isArray(value)) return;
	for (const key of Object.keys(value)) {
		const normalized = key.trim().toLowerCase();
		if (normalized) target.add(normalized);
	}
}
function addStringValue(target, value) {
	if (typeof value !== "string") return;
	const normalized = value.trim().toLowerCase();
	if (normalized) target.add(normalized);
}
function addModelConfigProviderIds(target, value) {
	for (const ref of resolveVoiceModelRefs(value)) addStringValue(target, ref.provider);
}
function collectRequestedSpeechProviderIds(cfg, options) {
	const requested = /* @__PURE__ */ new Set();
	const tts = typeof cfg?.tts === "object" && cfg.tts !== null ? cfg.tts : void 0;
	addStringValue(requested, tts?.provider);
	addObjectKeys(requested, tts?.providers);
	if (options.includeVoiceModel) addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	addObjectKeys(requested, cfg?.models?.providers);
	return requested;
}
function collectRequestedVoiceModelProviderIds(cfg) {
	const requested = /* @__PURE__ */ new Set();
	addModelConfigProviderIds(requested, cfg?.agents?.defaults?.voiceModel);
	return requested;
}
function addMediaModelProviders(target, value) {
	if (!Array.isArray(value)) return;
	for (const entry of value) if (typeof entry === "object" && entry !== null) addStringValue(target, entry.provider);
}
function collectRequestedMediaUnderstandingProviderIds(cfg) {
	const requested = /* @__PURE__ */ new Set();
	const media = cfg?.tools?.media;
	addMediaModelProviders(requested, media?.models);
	return requested;
}
function collectRequestedCapabilityProviderIds(params) {
	switch (params.key) {
		case "speechProviders": return collectRequestedSpeechProviderIds(params.cfg, { includeVoiceModel: params.includeVoiceModel ?? false });
		case "realtimeTranscriptionProviders":
		case "realtimeVoiceProviders": return params.includeVoiceModel ? collectRequestedVoiceModelProviderIds(params.cfg) : void 0;
		case "mediaUnderstandingProviders": return collectRequestedMediaUnderstandingProviderIds(params.cfg);
		default: return;
	}
}
function nonEmptyRequestedProviders(requested) {
	return requested && requested.size > 0 ? requested : void 0;
}
function shouldScopeCapabilityLoadToRequestedProviders(key) {
	return key === "speechProviders" || key === "realtimeTranscriptionProviders" || key === "realtimeVoiceProviders";
}
function removeActiveProviderIds(requested, entries) {
	for (const entry of entries) {
		const provider = entry.provider;
		if (typeof provider.id === "string") requested.delete(provider.id.toLowerCase());
		if (Array.isArray(provider.aliases)) {
			for (const alias of provider.aliases) if (typeof alias === "string") requested.delete(alias.toLowerCase());
		}
	}
}
function filterLoadedProvidersForRequestedConfig(params) {
	if (params.key !== "speechProviders" && params.key !== "realtimeTranscriptionProviders" && params.key !== "realtimeVoiceProviders" && params.key !== "mediaUnderstandingProviders") return [];
	if (params.requested.size === 0) return [];
	return params.entries.filter((entry) => {
		const provider = entry.provider;
		if (typeof provider.id === "string" && params.requested.has(provider.id.toLowerCase())) return true;
		if (Array.isArray(provider.aliases)) return provider.aliases.some((alias) => typeof alias === "string" && params.requested.has(alias.toLowerCase()));
		return false;
	});
}
function resolveRequestedCapabilityPluginIds(params) {
	if (!params.requested || params.requested.size === 0) return;
	const runtimePluginIds = /* @__PURE__ */ new Set();
	const bundledCompatPluginIds = /* @__PURE__ */ new Set();
	for (const providerId of params.requested) {
		const resolution = resolveCapabilityPluginIds({
			key: params.key,
			cfg: params.cfg,
			providerId,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		});
		for (const pluginId of resolution.runtimePluginIds) runtimePluginIds.add(pluginId);
		for (const pluginId of resolution.bundledCompatPluginIds) bundledCompatPluginIds.add(pluginId);
	}
	return runtimePluginIds.size > 0 ? {
		runtimePluginIds: sortUniqueStrings(runtimePluginIds),
		bundledCompatPluginIds: sortUniqueStrings(bundledCompatPluginIds)
	} : void 0;
}
function filterPolicyAllowedCapabilityProviders(params) {
	if (!params.cfg?.plugins) return params.entries;
	const origins = new Map((params.registry?.plugins ?? []).map((plugin) => [plugin.id, plugin.origin]));
	return params.entries.filter((entry) => {
		const origin = origins.get(entry.pluginId) ?? (params.bundledPluginIds?.has(entry.pluginId) ? "bundled" : "global");
		return isManifestPluginOwnerAllowedByControlPlanePolicy({
			plugin: {
				id: entry.pluginId,
				origin
			},
			config: params.cfg,
			allowRestrictiveAllowlistBypass: params.key === "speechProviders" && params.cfg?.plugins?.enabled === false
		});
	});
}
function loadCapabilityProviderEntries(params) {
	const allowedPluginIds = new Set(params.loadOptions.onlyPluginIds);
	const filterAllowedEntries = (registry) => (registry?.[params.key] ?? []).filter((entry) => allowedPluginIds.has(entry.pluginId));
	const loadedRegistry = getLoadedRuntimePluginRegistry({
		env: params.loadOptions.env,
		loadOptions: params.loadOptions,
		workspaceDir: params.loadOptions.workspaceDir,
		requiredPluginIds: params.loadOptions.onlyPluginIds
	});
	const loadedEntries = filterAllowedEntries(loadedRegistry);
	const coldEntries = filterAllowedEntries(loadedRegistry ? void 0 : resolveRuntimePluginRegistry(params.loadOptions));
	const entries = loadedEntries.length > 0 && coldEntries.length > 0 ? mergeCapabilityProviderEntries(loadedEntries, coldEntries) : loadedEntries.length > 0 ? loadedEntries : coldEntries;
	const missingRequested = params.requested && params.requested.size > 0 ? new Set(params.requested) : void 0;
	if (missingRequested) removeActiveProviderIds(missingRequested, entries);
	if (entries.length > 0 && (!missingRequested || missingRequested.size === 0)) return entries;
	if (params.bundledCompatPluginIds.length === 0) return entries;
	const captured = filterAllowedEntries(loadBundledCapabilityRuntimeRegistry({
		pluginIds: params.bundledCompatPluginIds,
		env: process.env,
		...params.loadOptions.config ? { config: params.loadOptions.config } : {},
		pluginSdkResolution: params.loadOptions.pluginSdkResolution
	}));
	return entries.length > 0 ? mergeCapabilityProviderEntries(entries, captured) : captured;
}
function resolvePluginCapabilityProvider(params) {
	if (shouldSkipCapabilityResolution(params)) return;
	const activeRegistry = getLoadedRuntimePluginRegistry();
	const activeProvider = findProviderById(filterPolicyAllowedCapabilityProviders({
		entries: activeRegistry?.[params.key] ?? [],
		registry: activeRegistry,
		cfg: params.cfg,
		key: params.key
	}), params.providerId);
	if (activeProvider) return activeProvider;
	const pluginMetadataSnapshot = loadCapabilityManifestSnapshot({ cfg: params.cfg });
	let pluginIds = resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		providerId: params.providerId,
		pluginMetadataSnapshot
	});
	if (pluginIds.runtimePluginIds.length === 0) {
		pluginIds = resolveCapabilityPluginIds({
			key: params.key,
			cfg: params.cfg,
			pluginMetadataSnapshot
		});
		if (pluginIds.runtimePluginIds.length === 0) return;
	}
	const loadOptions = createCapabilityProviderLoadOptions({
		cfg: params.cfg,
		resolution: pluginIds
	});
	return findProviderById(loadCapabilityProviderEntries({
		key: params.key,
		bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
		loadOptions,
		requested: /* @__PURE__ */ new Set([params.providerId.toLowerCase()])
	}), params.providerId);
}
function resolvePluginCapabilityProviders(params) {
	if (shouldSkipCapabilityResolution(params)) return [];
	const activeRegistry = getLoadedRuntimePluginRegistry();
	const activeProviders = filterPolicyAllowedCapabilityProviders({
		entries: activeRegistry?.[params.key] ?? [],
		registry: activeRegistry,
		cfg: params.cfg,
		key: params.key
	});
	const missingRequestedProviders = activeProviders.length > 0 ? nonEmptyRequestedProviders(collectRequestedCapabilityProviderIds({
		key: params.key,
		cfg: params.cfg,
		includeVoiceModel: true
	})) : void 0;
	if (activeProviders.length > 0 && params.key !== "memoryEmbeddingProviders") {
		if (!missingRequestedProviders && !shouldMergeManifestProvidersWhenActive(params.key)) return activeProviders.map((entry) => entry.provider);
		if (missingRequestedProviders) {
			removeActiveProviderIds(missingRequestedProviders, activeProviders);
			if (missingRequestedProviders.size === 0) return activeProviders.map((entry) => entry.provider);
		}
	}
	const requestedProviders = missingRequestedProviders ?? (activeProviders.length === 0 ? nonEmptyRequestedProviders(collectRequestedCapabilityProviderIds({
		key: params.key,
		cfg: params.cfg
	})) : void 0);
	const requestedProviderLoadScope = requestedProviders && shouldScopeCapabilityLoadToRequestedProviders(params.key) ? requestedProviders : void 0;
	const pluginMetadataSnapshot = loadCapabilityManifestSnapshot({ cfg: params.cfg });
	const requestedPluginIds = resolveRequestedCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		requested: requestedProviderLoadScope,
		pluginMetadataSnapshot
	});
	const requestedProviderFilter = requestedProviders && (!shouldScopeCapabilityLoadToRequestedProviders(params.key) || requestedPluginIds) ? requestedProviders : void 0;
	const pluginIds = requestedPluginIds ?? resolveCapabilityPluginIds({
		key: params.key,
		cfg: params.cfg,
		pluginMetadataSnapshot
	});
	const loadOptions = createCapabilityProviderLoadOptions({
		cfg: params.cfg,
		resolution: pluginIds
	});
	const loadedProviders = loadCapabilityProviderEntries({
		key: params.key,
		bundledCompatPluginIds: pluginIds.bundledCompatPluginIds,
		loadOptions,
		requested: requestedProviderFilter
	});
	if (params.key !== "memoryEmbeddingProviders") {
		const requestedLoadedProviders = requestedProviderFilter ? filterLoadedProvidersForRequestedConfig({
			key: params.key,
			requested: requestedProviderFilter,
			entries: loadedProviders
		}) : loadedProviders;
		return mergeCapabilityProviders(activeProviders, activeProviders.length > 0 && missingRequestedProviders ? filterLoadedProvidersForRequestedConfig({
			key: params.key,
			requested: missingRequestedProviders,
			entries: requestedLoadedProviders
		}) : requestedLoadedProviders);
	}
	return mergeCapabilityProviders(activeProviders, loadedProviders);
}
function prepareMediaCapabilityProviders(params) {
	const providers = (key) => {
		if (shouldSkipCapabilityResolution({
			key,
			cfg: params.cfg
		})) return [];
		const resolution = resolveCapabilityPluginIds({
			key,
			cfg: params.cfg,
			pluginMetadataSnapshot: params.pluginMetadataSnapshot
		});
		const requiredPluginIds = resolution.runtimePluginIds;
		if (requiredPluginIds.length === 0 && params.pluginMetadataSnapshot.plugins.some((plugin) => hasManifestContractValue({
			plugin,
			contract: CAPABILITY_CONTRACT_KEY[key]
		}))) return Object.freeze([]);
		if (!params.registry || !registryContainsRuntimePluginIds(params.registry, requiredPluginIds)) return;
		const eligiblePluginIds = new Set(requiredPluginIds);
		const availableEntries = filterPolicyAllowedCapabilityProviders({
			entries: params.registry[key],
			registry: params.registry,
			cfg: params.cfg,
			key,
			bundledPluginIds: new Set(resolution.bundledCompatPluginIds)
		});
		if (availableEntries.some((entry) => !eligiblePluginIds.has(entry.pluginId))) return;
		return Object.freeze(availableEntries.map((entry) => entry.provider));
	};
	return Object.freeze({
		mediaUnderstandingProviders: providers("mediaUnderstandingProviders"),
		imageGenerationProviders: providers("imageGenerationProviders"),
		videoGenerationProviders: providers("videoGenerationProviders"),
		musicGenerationProviders: providers("musicGenerationProviders")
	});
}
//#endregion
export { resolvePluginCapabilityProviders as i, prepareMediaCapabilityProviders as n, resolvePluginCapabilityProvider as r, loadCapabilityManifestSnapshot as t };
