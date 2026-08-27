import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./agent-scope-DigoIwHb.js";
import { f as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveAmbientOwnerAgentId } from "./agent-scope-config-CUBiGmG3.js";
import "./model-ref-shared-D4yx0hwT.js";
import { a as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DSU8DSTr.js";
import { u as normalizeDiscoveredAgentModel } from "./prepared-model-runtime.plugin-generation-BglH_JIU.js";
import { vt as AuthStorage } from "./sessions-PHTfe5gZ.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DeG6Ut3_.js";
import { l as prepareModelRuntimeSnapshot, n as acquireReadOnlyPreparedModelRuntime } from "./prepared-model-runtime-afzKiwqZ.js";
import { r as shouldSuppressBuiltInModelCore } from "./model-suppression-CCNuXp8i.js";
import { t as formatErrorWithStack } from "./list.errors-CvTPa0Ln.js";
//#region src/agents/prepared-model-registry.ts
/** Request-isolated registry views forked from lifecycle-owned model generations. */
function usesCredentialFreeRegistry(options) {
	return options.skipCredentials === true || options.loadAvailability === false;
}
function createRegistryView(params) {
	const { registry } = params;
	const getAll = registry.getAll.bind(registry);
	const getAvailable = registry.getAvailable.bind(registry);
	const find = registry.find.bind(registry);
	const providerFilter = params.providerFilter ? normalizeProviderId(params.providerFilter) : "";
	const matchesProviderFilter = (entry) => !providerFilter || normalizeProviderId(entry.provider) === providerFilter;
	const shouldNormalize = params.normalizeModels !== false;
	const providerMetadataOwners = registry.getProviderMetadataOwners();
	const normalizeEntry = (entry) => shouldNormalize ? normalizeDiscoveredAgentModel(entry, params.agentDir, {
		config: params.config,
		...providerMetadataOwners ? { providerMetadataOwners } : {},
		...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
	}) : entry;
	let normalizedAll;
	let normalizedAvailable;
	const loadNormalizedAll = () => normalizedAll ??= getAll().map(normalizeEntry);
	const loadNormalizedAvailable = () => normalizedAvailable ??= getAvailable().map(normalizeEntry);
	const findCache = /* @__PURE__ */ new Map();
	registry.getAll = () => loadNormalizedAll().filter(matchesProviderFilter);
	registry.getAvailable = () => loadNormalizedAvailable().filter(matchesProviderFilter);
	registry.find = (provider, modelId) => {
		const key = `${normalizeProviderId(provider)}\0${modelId}`;
		if (findCache.has(key)) return findCache.get(key);
		const entry = find(provider, modelId);
		const resolved = entry ? normalizeEntry(entry) : loadNormalizedAll().find((candidate) => normalizeProviderId(candidate.provider) === normalizeProviderId(provider) && candidate.id === modelId);
		findCache.set(key, resolved);
		return resolved;
	};
	return registry;
}
function registryOwnerCandidates(input, allowConfiguredWorkspaceFallback) {
	if (!allowConfiguredWorkspaceFallback || !input.workspaceDir) return [input];
	const { workspaceDir: _workspaceDir, ...workspaceFree } = input;
	return [workspaceFree, input];
}
async function loadReadSnapshot(input, allowConfiguredWorkspaceFallback) {
	for (const candidate of registryOwnerCandidates(input, allowConfiguredWorkspaceFallback)) try {
		return {
			snapshot: await prepareModelRuntimeSnapshot(candidate),
			release: () => {}
		};
	} catch (error) {
		if (!(error instanceof PreparedModelRuntimeOwnerNotPublishedError)) throw error;
	}
	return await acquireReadOnlyPreparedModelRuntime(input);
}
function resolveInput(config, options = {}) {
	const agentId = options.agentId ?? resolveAmbientOwnerAgentId(config);
	const agentDir = options.agentDir ?? resolveAgentDir(config, agentId);
	const workspaceDir = options.workspaceDir ?? resolveAgentWorkspaceDir(config, agentId);
	return {
		agentId,
		agentDir,
		config,
		inheritedAuthDir: resolveLegacyInheritedAuthDir(config),
		...usesCredentialFreeRegistry(options) ? { skipCredentials: true } : {},
		...workspaceDir ? { workspaceDir } : {}
	};
}
/** Loads and forks one registry from the owning command lifecycle generation. */
async function loadPreparedAgentModelRegistry(config, options = {}) {
	const input = resolveInput(config, options);
	const lease = await loadReadSnapshot(input, options.workspaceDir === void 0);
	try {
		const snapshot = lease.snapshot;
		const stores = snapshot.createStores();
		const modelRegistry = usesCredentialFreeRegistry(options) ? stores.modelRegistry.fork(AuthStorage.inMemory({})) : stores.modelRegistry;
		return {
			agentDir: snapshot.agentDir,
			config: snapshot.config,
			registry: createRegistryView({
				registry: modelRegistry,
				agentDir: snapshot.agentDir,
				config: snapshot.config,
				providerFilter: options.providerFilter,
				normalizeModels: options.normalizeModels,
				workspaceDir: snapshot.workspaceDir ?? input.workspaceDir
			})
		};
	} finally {
		lease.release();
	}
}
//#endregion
//#region src/commands/models/list.registry.ts
/** Registry access for full and configured-only model lists. */
function validateAvailableModels(availableModels) {
	if (!Array.isArray(availableModels)) throw new Error("Model availability unavailable: getAvailable() returned a non-array value.");
	for (const model of availableModels) if (!model || typeof model !== "object" || typeof model.provider !== "string" || typeof model.id !== "string") throw new Error("Model availability unavailable: getAvailable() returned invalid model entries.");
	return availableModels;
}
/** Loads the full registry, discovered keys, and model-level availability. */
async function loadModelRegistry(cfg, opts) {
	const { config: runtimeConfig, registry } = await loadPreparedAgentModelRegistry(cfg, opts);
	const isVisible = (model) => !shouldSuppressBuiltInModelCore({
		provider: model.provider,
		id: model.id,
		baseUrl: model.baseUrl,
		config: runtimeConfig
	});
	const models = registry.getAll().filter(isVisible);
	const discoveredKeys = new Set(models.map((model) => modelKey(model.provider, model.id)));
	let availableKeys;
	let availabilityErrorMessage;
	try {
		const availableModels = validateAvailableModels(registry.getAvailable()).filter(isVisible);
		availableKeys = new Set(availableModels.map((model) => modelKey(model.provider, model.id)));
	} catch (err) {
		availabilityErrorMessage = `Model availability unavailable: getAvailable() failed.\n${formatErrorWithStack(err)}`;
	}
	return {
		registry,
		models,
		discoveredKeys,
		availableKeys,
		availabilityErrorMessage
	};
}
/** Loads only configured registry entries and their auth availability. */
async function loadConfiguredListModelRegistry(cfg, entries, opts) {
	const { config: runtimeConfig, registry } = await loadPreparedAgentModelRegistry(cfg, opts);
	const discoveredKeys = /* @__PURE__ */ new Set();
	const availableKeys = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const model = registry.find(entry.ref.provider, entry.ref.model);
		if (!model || shouldSuppressBuiltInModelCore({
			provider: model.provider,
			id: model.id,
			baseUrl: model.baseUrl,
			config: runtimeConfig
		})) continue;
		const key = modelKey(model.provider, model.id);
		discoveredKeys.add(key);
		if (registry.hasConfiguredAuth(model)) availableKeys.add(key);
	}
	return {
		registry,
		discoveredKeys,
		availableKeys
	};
}
//#endregion
export { loadConfiguredListModelRegistry, loadModelRegistry };
