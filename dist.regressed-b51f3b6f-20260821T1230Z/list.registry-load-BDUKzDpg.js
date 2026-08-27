import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import "./agent-scope-BizOtGGz.js";
import { b as tryResolveLegacyCompatibilityAgentId, d as resolveAgentWorkspaceDir, l as resolveAgentDir, p as resolveDefaultAgentId } from "./agent-scope-config-BdXMWufB.js";
import "./model-ref-shared-poyRjWh_.js";
import { i as resolveLegacyInheritedAuthDir } from "./legacy-inherited-auth-dir-DqCM942-.js";
import { t as PreparedModelRuntimeOwnerNotPublishedError } from "./prepared-model-runtime.errors-DUOk3SoP.js";
import { d as normalizeDiscoveredAgentModel } from "./prepared-model-runtime.facts-B4cEu5oN.js";
import { gt as AuthStorage } from "./sessions-DNOIAOJW.js";
import { c as prepareModelRuntimeSnapshot, n as acquireReadOnlyPreparedModelRuntime } from "./prepared-model-runtime-WYGCGgEu.js";
import { i as shouldSuppressBuiltInModelFromManifest, r as shouldSuppressBuiltInModelCore } from "./model-suppression-BAHzgnL2.js";
import { n as formatErrorWithStack, r as shouldFallbackToAuthHeuristics, t as MODEL_AVAILABILITY_UNAVAILABLE_CODE } from "./list.errors-DDA-CnZS.js";
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
	const agentId = options.agentId ?? tryResolveLegacyCompatibilityAgentId(config) ?? resolveDefaultAgentId(config);
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
/** Model registry access helpers for `openclaw models list`. */
function createAvailabilityUnavailableError(message) {
	const err = new Error(message);
	err.code = MODEL_AVAILABILITY_UNAVAILABLE_CODE;
	return err;
}
function normalizeAvailabilityError(err) {
	if (shouldFallbackToAuthHeuristics(err) && err instanceof Error) return err;
	return createAvailabilityUnavailableError(`Model availability unavailable: getAvailable() failed.\n${formatErrorWithStack(err)}`);
}
function validateAvailableModels(availableModels) {
	if (!Array.isArray(availableModels)) throw createAvailabilityUnavailableError("Model availability unavailable: getAvailable() returned a non-array value.");
	for (const model of availableModels) if (!model || typeof model !== "object" || typeof model.provider !== "string" || typeof model.id !== "string") throw createAvailabilityUnavailableError("Model availability unavailable: getAvailable() returned invalid model entries.");
	return availableModels;
}
function loadAvailableModels(registry, cfg, opts) {
	let availableModels;
	try {
		availableModels = registry.getAvailable();
	} catch (err) {
		throw normalizeAvailabilityError(err);
	}
	try {
		return validateAvailableModels(availableModels).filter((model) => opts?.runtimeSuppression === false ? !shouldSuppressBuiltInModelFromManifest({
			provider: model.provider,
			id: model.id,
			baseUrl: model.baseUrl,
			config: cfg
		}) : !shouldSuppressBuiltInModelCore({
			provider: model.provider,
			id: model.id,
			baseUrl: model.baseUrl,
			config: cfg
		}));
	} catch (err) {
		throw normalizeAvailabilityError(err);
	}
}
/** Loads registry models and optional availability keys with suppression applied. */
async function loadModelRegistry(cfg, opts) {
	const runtimeSuppression = opts?.normalizeModels !== false;
	const skipDiscovery = opts?.loadAvailability === false;
	const { config: runtimeConfig, registry } = await loadPreparedAgentModelRegistry(cfg, {
		...opts?.agentId ? { agentId: opts.agentId } : {},
		...opts?.agentDir ? { agentDir: opts.agentDir } : {},
		skipCredentials: skipDiscovery,
		workspaceDir: opts?.workspaceDir,
		providerFilter: opts?.providerFilter,
		normalizeModels: opts?.normalizeModels
	});
	const models = registry.getAll().filter((model) => runtimeSuppression ? !shouldSuppressBuiltInModelCore({
		provider: model.provider,
		id: model.id,
		baseUrl: model.baseUrl,
		config: runtimeConfig
	}) : !shouldSuppressBuiltInModelFromManifest({
		provider: model.provider,
		id: model.id,
		baseUrl: model.baseUrl,
		config: runtimeConfig
	}));
	let availableKeys;
	let availabilityErrorMessage;
	if (opts?.loadAvailability !== false) try {
		const availableModels = loadAvailableModels(registry, runtimeConfig, { runtimeSuppression });
		availableKeys = new Set(availableModels.map((model) => modelKey(model.provider, model.id)));
	} catch (err) {
		if (!shouldFallbackToAuthHeuristics(err)) throw err;
		availableKeys = void 0;
		if (!availabilityErrorMessage) availabilityErrorMessage = formatErrorWithStack(err);
	}
	return {
		registry,
		models,
		availableKeys,
		availabilityErrorMessage
	};
}
//#endregion
//#region src/commands/models/list.registry-load.ts
/** Registry-loading adapters for model-list row construction. */
/** Loads the full model registry and tracks discovered provider/model keys. */
async function loadListModelRegistry(cfg, opts) {
	const loaded = await loadModelRegistry(cfg, opts);
	return {
		...loaded,
		discoveredKeys: new Set(loaded.models.map((model) => modelKey(model.provider, model.id)))
	};
}
function findConfiguredRegistryModel(params) {
	const model = params.registry.find(params.entry.ref.provider, params.entry.ref.model);
	if (!model) return;
	if (shouldSuppressBuiltInModelCore({
		provider: model.provider,
		id: model.id,
		baseUrl: model.baseUrl,
		config: params.cfg
	})) return;
	return model;
}
/** Loads only configured registry entries and their auth availability. */
async function loadConfiguredListModelRegistry(cfg, entries, opts) {
	const { config: runtimeConfig, registry } = await loadPreparedAgentModelRegistry(cfg, {
		...opts?.agentId ? { agentId: opts.agentId } : {},
		...opts?.agentDir ? { agentDir: opts.agentDir } : {},
		...opts?.workspaceDir ? { workspaceDir: opts.workspaceDir } : {},
		...opts?.providerFilter ? { providerFilter: opts.providerFilter } : {}
	});
	const discoveredKeys = /* @__PURE__ */ new Set();
	const availableKeys = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const model = findConfiguredRegistryModel({
			registry,
			entry,
			cfg: runtimeConfig
		});
		if (!model) continue;
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
export { loadConfiguredListModelRegistry, loadListModelRegistry };
