import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import { r as official_external_provider_catalog_default } from "./official-external-plugin-bundled-catalogs-B1B9VBeU.js";
import { n as resolveActivePluginInstallRoots } from "./install-root-context-BK8PKHqw.js";
import { m as hashJson, p as resolveInstalledPluginIndexPolicyHash } from "./installed-plugin-index-uuE4SyLf.js";
import { n as resolveInstalledManifestRegistryIndexFingerprint, t as loadPluginManifestRegistryForInstalledIndex } from "./manifest-registry-installed-DozKX1OI.js";
import { a as loadPluginRegistrySnapshotWithMetadata, l as createPluginRegistryIdNormalizer } from "./plugin-registry-snapshot-CxbzdC9E.js";
import { n as resolvePluginControlPlaneFingerprint } from "./plugin-control-plane-context-7rdLh1wQ.js";
import { n as registerPluginMetadataSnapshotReaders } from "./plugin-metadata-snapshot.runtime.js";
import { c as normalizePluginIdScope, l as serializePluginIdScope, t as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { o as measureDiagnosticsTimelineSpanSync, r as getActiveDiagnosticsTimelineSpan } from "./diagnostics-timeline-DXKu_9VY.js";
//#region src/plugins/official-external-provider-endpoints.ts
/**
* Provider endpoint metadata for officially externalized provider plugins.
*
* Endpoint classification (SSRF, attribution, payload-compat policy) keys off
* base URLs and must keep working when the owning plugin is not installed:
* dist packages exclude externalized plugins, so their manifests are invisible
* to bundled discovery. Only the repo-bundled catalog JSON feeds this table;
* hosted marketplace feeds must never influence endpoint classification.
* Kept separate from official-external-plugin-catalog.ts so provider
* transports do not pull the ClawHub install/marketplace module graph.
*/
/**
* Lists manifest-shaped catalog metadata blocks that declare provider endpoints.
*
* The catalog mirrors manifests faithfully, including endpoint classes core
* does not (yet) recognize (e.g. deepinfra-native, gmi-native). The endpoint
* reader filters unknown classes exactly as it does for installed manifests,
* so they stay inert instead of complicating the mirror contract.
*/
function listOfficialExternalProviderEndpointManifests() {
	const entries = official_external_provider_catalog_default.entries;
	if (!Array.isArray(entries)) return [];
	const manifests = [];
	for (const entry of entries) {
		if (!isRecord(entry)) continue;
		const manifest = entry[MANIFEST_KEY];
		if (isRecord(manifest) && Array.isArray(manifest.providerEndpoints)) manifests.push(manifest);
	}
	return manifests;
}
//#endregion
//#region src/plugins/plugin-metadata-provider-facts.ts
const PROVIDER_ENDPOINT_CLASSES = new Set("anthropic-public cerebras-native chutes-native deepseek-native github-copilot-native groq-native meta-native mistral-public minimax-native moonshot-native modelstudio-native nvidia-native openai-public openai opencode-native azure-openai openrouter xai-native xiaomi-native zai-native google-generative-ai google-vertex".split(" "));
function normalizeProviderHosts(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "string").map((entry) => entry.trim().toLowerCase()).filter(Boolean) : [];
}
function normalizePluginProviderBaseUrl(value) {
	const trimmed = normalizeOptionalString(value);
	const schemeless = trimmed && /^[a-z0-9.[\]-]+(?::\d+)?(?:[/?#].*)?$/i.test(trimmed);
	const url = trimmed ? URL.parse(schemeless ? `https://${trimmed}` : trimmed) : null;
	if (!url || url.protocol !== "http:" && url.protocol !== "https:") return;
	url.hash = "";
	url.search = "";
	return normalizeOptionalLowercaseString(url.toString().replace(/\/+$/, ""));
}
function prepareProviderEndpoints(value) {
	if (!Array.isArray(value)) return [];
	return value.filter(isRecord).filter((endpoint) => {
		const endpointClass = normalizeOptionalString(endpoint.endpointClass);
		return endpointClass ? PROVIDER_ENDPOINT_CLASSES.has(endpointClass) : false;
	}).map((endpoint) => {
		const endpointClass = normalizeOptionalString(endpoint.endpointClass);
		const googleVertexRegion = normalizeOptionalString(endpoint.googleVertexRegion);
		const googleVertexRegionHostSuffix = normalizeOptionalString(endpoint.googleVertexRegionHostSuffix)?.toLowerCase();
		return Object.assign({
			endpointClass,
			hosts: normalizeProviderHosts(endpoint.hosts),
			hostSuffixes: normalizeProviderHosts(endpoint.hostSuffixes),
			baseUrls: normalizeProviderHosts(endpoint.baseUrls).map(normalizePluginProviderBaseUrl).filter((baseUrl) => baseUrl !== void 0)
		}, googleVertexRegion ? { googleVertexRegion } : {}, googleVertexRegionHostSuffix ? { googleVertexRegionHostSuffix } : {});
	});
}
function buildPluginMetadataProviderFacts(plugins) {
	const providerEndpoints = plugins.flatMap((plugin) => prepareProviderEndpoints(plugin.providerEndpoints));
	const providerRequests = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		const requests = isRecord(plugin.providerRequest?.providers) ? plugin.providerRequest.providers : {};
		for (const [rawProvider, request] of Object.entries(requests)) {
			if (!isRecord(request)) continue;
			const provider = normalizeLowercaseStringOrEmpty(rawProvider);
			if (!provider) continue;
			const supportsStreamingUsage = isRecord(request.openAICompletions) ? request.openAICompletions.supportsStreamingUsage : void 0;
			providerRequests.set(provider, {
				...normalizeOptionalString(request.family) ? { family: normalizeOptionalString(request.family) } : {},
				...normalizeOptionalString(request.compatibilityFamily) === "moonshot" ? { compatibilityFamily: "moonshot" } : {},
				...typeof supportsStreamingUsage === "boolean" ? { openAICompletions: { supportsStreamingUsage } } : {}
			});
		}
	}
	for (const manifest of listOfficialExternalProviderEndpointManifests()) providerEndpoints.push(...prepareProviderEndpoints(manifest.providerEndpoints));
	return {
		providerEndpoints,
		providerRequests
	};
}
//#endregion
//#region src/plugins/plugin-metadata-snapshot.ts
const PLUGIN_METADATA_ENV_KEYS = [
	"APPDATA",
	"HOME",
	"OPENCLAW_BUNDLED_PLUGINS_DIR",
	"OPENCLAW_COMPATIBILITY_HOST_VERSION",
	"OPENCLAW_CONFIG_PATH",
	"OPENCLAW_DISABLE_BUNDLED_PLUGINS",
	"OPENCLAW_DISABLE_BUNDLED_SOURCE_OVERLAYS",
	"OPENCLAW_HOME",
	"OPENCLAW_NIX_MODE",
	"OPENCLAW_STATE_DIR",
	"USERPROFILE",
	"XDG_CONFIG_HOME"
];
function pickPluginMetadataEnv(env) {
	return Object.fromEntries(PLUGIN_METADATA_ENV_KEYS.flatMap((key) => {
		const value = env[key];
		return value === void 0 ? [] : [[key, value]];
	}));
}
function resolvePluginMetadataEnvFingerprint(env) {
	return hashJson({
		env: pickPluginMetadataEnv(env),
		installRoots: resolveActivePluginInstallRoots(env)
	});
}
function throwReadonlyPluginMetadataMutation() {
	throw new TypeError("Plugin metadata snapshots are immutable");
}
function freezeSnapshotValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	if (value instanceof Map) {
		for (const [key, entry] of value) {
			freezeSnapshotValue(key, seen);
			freezeSnapshotValue(entry, seen);
		}
		Object.defineProperties(value, {
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation },
			set: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	if (value instanceof Set) {
		for (const entry of value) freezeSnapshotValue(entry, seen);
		Object.defineProperties(value, {
			add: { value: throwReadonlyPluginMetadataMutation },
			clear: { value: throwReadonlyPluginMetadataMutation },
			delete: { value: throwReadonlyPluginMetadataMutation }
		});
		return Object.freeze(value);
	}
	for (const entry of Object.values(value)) freezeSnapshotValue(entry, seen);
	return Object.freeze(value);
}
function indexesMatch(left, right) {
	if (!left || !right) return true;
	return resolveInstalledManifestRegistryIndexFingerprint(left) === resolveInstalledManifestRegistryIndexFingerprint(right);
}
function resolvePluginMetadataSnapshotPluginIds(params) {
	const direct = normalizePluginIdScope(params.params.pluginIds);
	if (direct !== void 0) return direct;
	return normalizePluginIdScope(params.params.pluginIdScope?.resolve({ index: params.index }));
}
function isPluginMetadataSnapshotCompatible(params) {
	const env = params.env ?? process.env;
	const requestedPluginIds = normalizePluginIdScope(params.pluginIds);
	const snapshotPluginIds = normalizePluginIdScope(params.snapshot.pluginIds);
	return (snapshotPluginIds === void 0 || params.allowScopedSnapshot === true || requestedPluginIds !== void 0 && serializePluginIdScope(snapshotPluginIds) === serializePluginIdScope(requestedPluginIds)) && params.snapshot.policyHash === resolveInstalledPluginIndexPolicyHash(params.config) && (!params.snapshot.configFingerprint || params.snapshot.configFingerprint === resolvePluginControlPlaneFingerprint({
		config: params.config,
		env,
		index: params.index ?? params.snapshot.index,
		policyHash: params.snapshot.policyHash,
		workspaceDir: params.workspaceDir
	})) && (params.snapshot.workspaceDir ?? "") === (params.workspaceDir ?? "") && indexesMatch(params.snapshot.index, params.index);
}
function appendOwner(owners, ownedId, pluginId) {
	const existing = owners.get(ownedId);
	if (existing) {
		if (existing.includes(pluginId)) return;
		existing.push(pluginId);
		return;
	}
	owners.set(ownedId, [pluginId]);
}
function freezeOwnerMap(owners) {
	return new Map([...owners.entries()].map(([ownedId, pluginIds]) => [ownedId, Object.freeze([...pluginIds])]));
}
function buildPluginMetadataOwnerMaps(plugins) {
	const channels = /* @__PURE__ */ new Map();
	const channelConfigs = /* @__PURE__ */ new Map();
	const providers = /* @__PURE__ */ new Map();
	const modelCatalogProviders = /* @__PURE__ */ new Map();
	const cliBackends = /* @__PURE__ */ new Map();
	const setupProviders = /* @__PURE__ */ new Map();
	const commandAliases = /* @__PURE__ */ new Map();
	const contracts = /* @__PURE__ */ new Map();
	for (const plugin of plugins) {
		for (const channelId of plugin.channels ?? []) appendOwner(channels, channelId, plugin.id);
		for (const channelId of Object.keys(plugin.channelConfigs ?? {})) appendOwner(channelConfigs, channelId, plugin.id);
		for (const providerId of plugin.providers ?? []) appendOwner(providers, providerId, plugin.id);
		for (const [rawAlias, target] of Object.entries(plugin.providerAuthAliases ?? {})) {
			const alias = normalizeProviderId(rawAlias);
			const targetProvider = normalizeProviderId(target);
			if (alias && targetProvider && (plugin.providers ?? []).some((providerId) => normalizeProviderId(providerId) === targetProvider)) appendOwner(providers, alias, plugin.id);
		}
		for (const providerId of Object.keys(plugin.modelCatalog?.providers ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
		for (const providerId of Object.keys(plugin.modelCatalog?.aliases ?? {})) appendOwner(modelCatalogProviders, providerId, plugin.id);
		for (const cliBackendId of plugin.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
		for (const cliBackendId of plugin.setup?.cliBackends ?? []) appendOwner(cliBackends, cliBackendId, plugin.id);
		for (const setupProvider of plugin.setup?.providers ?? []) appendOwner(setupProviders, setupProvider.id, plugin.id);
		for (const commandAlias of plugin.commandAliases ?? []) appendOwner(commandAliases, commandAlias.name, plugin.id);
		for (const [contract, values] of Object.entries(plugin.contracts ?? {})) if (Array.isArray(values) && values.length > 0) appendOwner(contracts, contract, plugin.id);
	}
	return {
		channels: freezeOwnerMap(channels),
		channelConfigs: freezeOwnerMap(channelConfigs),
		providers: freezeOwnerMap(providers),
		modelCatalogProviders: freezeOwnerMap(modelCatalogProviders),
		cliBackends: freezeOwnerMap(cliBackends),
		setupProviders: freezeOwnerMap(setupProviders),
		commandAliases: freezeOwnerMap(commandAliases),
		contracts: freezeOwnerMap(contracts),
		...buildPluginMetadataProviderFacts(plugins)
	};
}
function listPluginOriginsFromMetadataSnapshot(snapshot) {
	return new Map(snapshot.plugins.map((record) => [record.id, record.origin]));
}
/** Rebuilds every manifest-derived snapshot fact from one authoritative registry. */
function rebasePluginMetadataSnapshotManifestRegistry(snapshot, manifestRegistry) {
	const plugins = manifestRegistry.plugins;
	return {
		...snapshot,
		manifestRegistry,
		plugins,
		diagnostics: manifestRegistry.diagnostics,
		byPluginId: new Map(plugins.map((plugin) => [plugin.id, plugin])),
		normalizePluginId: snapshot.index ? createPluginRegistryIdNormalizer(snapshot.index, { manifestRegistry }) : snapshot.normalizePluginId,
		owners: buildPluginMetadataOwnerMaps(plugins),
		...snapshot.metrics ? { metrics: {
			...snapshot.metrics,
			manifestPluginCount: plugins.length
		} } : {}
	};
}
function loadPluginMetadataSnapshot(params) {
	const activeTimelineSpan = getActiveDiagnosticsTimelineSpan();
	const snapshot = measureDiagnosticsTimelineSpanSync("plugins.metadata.scan", () => loadPluginMetadataSnapshotImpl(params), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			hasWorkspaceDir: params.workspaceDir !== void 0,
			hasInstalledIndex: params.index !== void 0
		}
	});
	return measureDiagnosticsTimelineSpanSync("plugins.metadata.freeze", () => freezeSnapshotValue(snapshot), {
		phase: activeTimelineSpan?.phase ?? "startup",
		config: params.config,
		env: params.env,
		attributes: {
			indexPluginCount: snapshot.index.plugins.length,
			manifestPluginCount: snapshot.plugins.length
		}
	});
}
/** Promotes a planning-scoped graph to the complete process-lifecycle metadata snapshot. */
function completePluginMetadataSnapshot(params) {
	if (!params.snapshot || params.snapshot.pluginIds === void 0) return params.snapshot;
	const workspaceDir = params.workspaceDir ?? params.snapshot.workspaceDir;
	return loadPluginMetadataSnapshot({
		config: params.config,
		env: params.env ?? process.env,
		index: params.snapshot.index,
		...workspaceDir ? { workspaceDir } : {}
	});
}
function resolvePluginMetadataSnapshot(params) {
	if (params.allowCurrent !== false && params.stateDir === void 0 && params.preferPersisted !== false) {
		const current = getCurrentPluginMetadataSnapshot({
			config: params.config,
			env: params.env,
			...params.config === void 0 ? { requireDefaultDiscoveryContext: true } : {},
			...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
			...params.pluginIdScope !== void 0 ? { pluginIdScope: params.pluginIdScope } : {},
			...params.workspaceDir !== void 0 ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent === true ? { allowWorkspaceScopedSnapshot: true } : {}
		});
		if (!current) {
			const lifecycleSnapshot = getCurrentPluginMetadataSnapshot({
				config: params.config,
				env: params.env,
				...params.pluginIds !== void 0 ? { pluginIds: params.pluginIds } : {},
				...params.pluginIdScope !== void 0 ? { pluginIdScope: params.pluginIdScope } : {},
				allowWorkspaceScopedSnapshot: true
			});
			const targetWorkspace = params.workspaceDir;
			const hasWorkspacePlugin = lifecycleSnapshot?.index.plugins.some((plugin) => plugin.origin === "workspace");
			if (lifecycleSnapshot && targetWorkspace && targetWorkspace !== lifecycleSnapshot.workspaceDir && !hasWorkspacePlugin && params.workspacePluginRootPresent === false) {
				const index = Object.freeze({
					...lifecycleSnapshot.index,
					workspaceDir: targetWorkspace
				});
				return Object.freeze({
					...lifecycleSnapshot,
					configFingerprint: resolvePluginControlPlaneFingerprint({
						config: params.config,
						env: params.env,
						index,
						policyHash: lifecycleSnapshot.policyHash,
						workspaceDir: targetWorkspace
					}),
					index,
					workspaceDir: targetWorkspace
				});
			}
			return loadPluginMetadataSnapshot(params);
		}
		if (!params.index) return current;
		if (isPluginMetadataSnapshotCompatible({
			snapshot: current,
			config: params.config,
			env: params.env,
			allowScopedSnapshot: params.pluginIds !== void 0 || params.pluginIdScope !== void 0,
			workspaceDir: params.workspaceDir ?? (params.allowWorkspaceScopedCurrent === true ? current.workspaceDir : void 0),
			index: params.index
		})) return current;
	}
	return loadPluginMetadataSnapshot(params);
}
function loadPluginMetadataSnapshotImpl(params) {
	const totalStartedAt = performance.now();
	const registryStartedAt = performance.now();
	const registryResult = loadPluginRegistrySnapshotWithMetadata({
		config: params.config,
		workspaceDir: params.workspaceDir,
		...params.stateDir ? { stateDir: params.stateDir } : {},
		env: params.env,
		...params.preferPersisted !== void 0 ? { preferPersisted: params.preferPersisted } : {},
		...params.allowCurrent !== void 0 ? { allowCurrent: params.allowCurrent } : {},
		...params.index ? { index: params.index } : {}
	});
	const registrySnapshotMs = performance.now() - registryStartedAt;
	const index = structuredClone(registryResult.snapshot);
	index.diagnostics ??= [];
	const pluginIds = resolvePluginMetadataSnapshotPluginIds({
		params,
		index
	});
	const manifestStartedAt = performance.now();
	const manifestRegistry = loadPluginManifestRegistryForInstalledIndex({
		index,
		...registryResult.manifestRegistry ? { manifestRegistry: registryResult.manifestRegistry } : {},
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env,
		...pluginIds !== void 0 ? { pluginIds } : {},
		includeDisabled: true
	});
	const manifestRegistryMs = performance.now() - manifestStartedAt;
	const normalizePluginId = createPluginRegistryIdNormalizer(index, { manifestRegistry });
	const byPluginId = new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
	const ownerMapsStartedAt = performance.now();
	const owners = buildPluginMetadataOwnerMaps(manifestRegistry.plugins);
	const ownerMapsMs = performance.now() - ownerMapsStartedAt;
	const totalMs = performance.now() - totalStartedAt;
	return {
		policyHash: index.policyHash,
		registrySource: registryResult.source,
		configFingerprint: resolvePluginControlPlaneFingerprint({
			config: params.config,
			env: params.env,
			index,
			policyHash: index.policyHash,
			workspaceDir: params.workspaceDir
		}),
		...pluginIds !== void 0 ? { pluginIds } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
		index,
		registryDiagnostics: registryResult.diagnostics,
		manifestRegistry,
		plugins: manifestRegistry.plugins,
		diagnostics: manifestRegistry.diagnostics,
		byPluginId,
		normalizePluginId,
		owners,
		metrics: {
			registrySnapshotMs,
			manifestRegistryMs,
			ownerMapsMs,
			totalMs,
			indexPluginCount: index.plugins.length,
			manifestPluginCount: manifestRegistry.plugins.length
		},
		discovery: registryResult.discovery
	};
}
registerPluginMetadataSnapshotReaders({ resolvePluginMetadataSnapshot });
//#endregion
export { rebasePluginMetadataSnapshotManifestRegistry as a, normalizePluginProviderBaseUrl as c, loadPluginMetadataSnapshot as i, isPluginMetadataSnapshotCompatible as n, resolvePluginMetadataEnvFingerprint as o, listPluginOriginsFromMetadataSnapshot as r, resolvePluginMetadataSnapshot as s, completePluginMetadataSnapshot as t };
