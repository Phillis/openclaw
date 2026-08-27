import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { o as asDateTimestampMs } from "./number-coercion-oCkfUEEq.js";
import "./src-BkwWvwB2.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { t as stableStringify } from "./stable-stringify-DoZ6Yalc.js";
import "./utils-DEqefz4f.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { v as extractPluginInstallRecordsFromInstalledPluginIndex } from "./installed-plugin-index-BC03OFwf.js";
import { n as sha256Base64Url } from "./crypto-digest-PR8Utwzg.js";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-DT9x3Cg2.js";
import { s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-BfWhFzZN.js";
import { A as getPreparedMessageToolCatalog, j as getPreparedMessageToolCatalogForRegistry } from "./runtime-CTbL314X.js";
import { a as withPluginRuntimeRegistryScope } from "./gateway-request-scope-BULcX9xX.js";
import { u as hashRuntimeConfigValue } from "./runtime-snapshot-Dp7mvsA3.js";
import { i as resolveAuthProfileOrder } from "./order-CPoPeUTn.js";
import { g as resolveProviderEnvAuthLookupMaps, h as listProviderEnvAuthLookupKeys } from "./model-auth-markers-DJWHSR2r.js";
import { i as resolvePluginRuntimeLoadContext } from "./load-context-CjeR28RQ.js";
import { g as resolveModelPluginMetadataSnapshot, o as resolveLoadedProviderRuntimePlugin } from "./provider-hook-runtime-Dr_msAqW.js";
import { A as resolveProviderSyntheticAuthWithPlugin, g as normalizeProviderResolvedModelWithPlugin, r as applyProviderResolvedTransportWithPlugin } from "./provider-runtime-DStPs6cE.js";
import { i as isAmbientCredentialAllowedByProviderAuthPin } from "./external-auth-BI_6Rz-P.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore, s as getPreparedRuntimeAuthProfileStoreSnapshot } from "./store-DOJuehrg.js";
import { t as buildPreparedModelCatalogSnapshot } from "./model-catalog-D1JZ_G7y.js";
import { n as prepareMediaCapabilityProviders } from "./capability-provider-runtime-CmN5L8jb.js";
import { n as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { t as resolveEnvApiKey } from "./model-auth-env-CZG3X768.js";
import { i as normalizeModelCompat } from "./provider-model-compat-B1p8TIBp.js";
import { at as ModelRegistry, gt as AuthStorage } from "./sessions-CfDirsu7.js";
import { s as loadPersistedPluginModelCatalogsReadOnly, u as resolvePluginModelCatalogOwnerPluginId } from "./plugin-model-catalog-D6SwPimH.js";
import { t as buildInlineProviderModels } from "./model.inline-provider-4t3N1epE.js";
import { c as createStaticModelIdMatcher, i as loadBundledProviderStaticCatalogContextModels, r as createBundledStaticCatalogModelResolver } from "./model.static-catalog-puRJUJrg.js";
import { n as planOpenClawModelsJsonSource, r as prepareImplicitProviderStaticCatalog, t as ensureOpenClawModelsJson } from "./models-config-DlfDJ7xA.js";
import { a as toStaticCatalogEntry, i as prepareConfiguredRuntimeModels, n as collectPreparedModelRuntimeConfiguredRefs, r as collectPreparedModelRuntimeProviderIds, t as collectConfiguredProviderIdsNeedingStaticCatalog } from "./prepared-model-runtime.configured-CFJOGbF7.js";
import { t as loadAgentRuntimePluginRegistryHandle } from "./runtime-plugins-CotwbLmq.js";
import fs from "node:fs";
import path from "node:path";
import { performance } from "node:perf_hooks";
//#region src/agents/agent-auth-credentials.ts
/** Converts auth-profile credentials into agent runtime credential maps. */
const AGENT_SECRET_REF_CONFIGURED_MARKER = "openclaw-secret-ref-configured";
/** Records only credential modes whose secret material is usable by a prepared runtime owner. */
function resolveUsableAgentCredentialModes(credentials) {
	const modes = {};
	for (const [rawProvider, credential] of Object.entries(credentials)) {
		const provider = normalizeProviderId(rawProvider);
		if (!provider) continue;
		if (credential.type === "api_key" && credential.key && credential.key !== AGENT_SECRET_REF_CONFIGURED_MARKER) modes[provider] = "api_key";
		else if (credential.type === "token" && credential.token && (credential.expires === void 0 || credential.expires > Date.now())) modes[provider] = "token";
		else if (credential.type === "oauth" && credential.access && credential.refresh && credential.expires > 0) modes[provider] = "oauth";
	}
	return Object.freeze(modes);
}
function hasConfiguredSecretRef(value) {
	return coerceSecretRef(value) !== null;
}
function secretRefPlaceholder(options) {
	if (options?.includeSecretRefPlaceholders === true) return {
		type: "api_key",
		key: AGENT_SECRET_REF_CONFIGURED_MARKER
	};
	return null;
}
function convertAuthProfileCredentialToAgent(cred, options) {
	if (cred.type === "api_key") {
		const key = normalizeOptionalString(cred.key) ?? "";
		if (!key) return hasConfiguredSecretRef(cred.keyRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key
		};
	}
	if (cred.type === "token") {
		if (cred.expires !== void 0) {
			const expires = asDateTimestampMs(cred.expires);
			if (expires === void 0 || Date.now() >= expires) return null;
		}
		const token = normalizeOptionalString(cred.token) ?? "";
		if (!token) return hasConfiguredSecretRef(cred.tokenRef) ? secretRefPlaceholder(options) : null;
		return {
			type: "api_key",
			key: token
		};
	}
	if (cred.type === "oauth") {
		const access = normalizeOptionalString(cred.access) ?? "";
		const refresh = normalizeOptionalString(cred.refresh) ?? "";
		const expires = asDateTimestampMs(cred.expires);
		if (!access || !refresh || expires === void 0 || expires <= 0) return null;
		return {
			type: "oauth",
			access,
			refresh,
			expires
		};
	}
	return null;
}
/** Build one canonically selected credential per normalized provider. */
function resolveAgentCredentialMapFromStore(store, options) {
	const credentials = {};
	for (const credential of Object.values(store.profiles)) {
		const provider = normalizeProviderId(credential.provider ?? "");
		if (!provider) continue;
		if (credentials[provider]) continue;
		const profileIds = resolveAuthProfileOrder({
			cfg: options?.config,
			store,
			provider,
			...options?.includeSecretRefPlaceholders === true ? { readinessMode: "read-only" } : {}
		});
		for (const profileId of profileIds) {
			const profile = store.profiles[profileId];
			if (!profile) continue;
			const converted = convertAuthProfileCredentialToAgent(profile, options);
			if (converted) {
				credentials[provider] = converted;
				break;
			}
		}
	}
	return credentials;
}
//#endregion
//#region src/agents/agent-auth-discovery-core.ts
/** Adds provider credentials resolvable from env/config without mutating existing credentials. */
function addEnvBackedAgentCredentials(credentials, options = {}) {
	const env = options.env ?? process.env;
	const { aliasMap, envCandidateMap: candidateMap, authEvidenceMap } = resolveProviderEnvAuthLookupMaps({
		config: options.config,
		workspaceDir: options.workspaceDir,
		env
	});
	const next = { ...credentials };
	for (const provider of listProviderEnvAuthLookupKeys({
		envCandidateMap: candidateMap,
		authEvidenceMap
	})) {
		if (next[provider]) continue;
		const resolved = resolveEnvApiKey(provider, env, {
			config: options.config,
			workspaceDir: options.workspaceDir,
			aliasMap,
			candidateMap,
			authEvidenceMap
		});
		if (!resolved?.apiKey) continue;
		next[provider] = {
			type: "api_key",
			key: resolved.apiKey
		};
	}
	return next;
}
//#endregion
//#region src/agents/agent-auth-discovery.ts
/** Discovers agent runtime credentials from auth profiles, env, and synthetic providers. */
/** Resolves workspace/config/env-stable credentials independently of agent-local profiles. */
function resolveAmbientAgentCredentialsForDiscovery(options = {}) {
	const credentials = addEnvBackedAgentCredentials({}, options);
	const syntheticAuthProviderRefs = options.syntheticAuthProviderRefs ?? resolveRuntimeSyntheticAuthProviderRefs();
	const resolveSyntheticAuth = options.resolveSyntheticAuth ?? ((provider) => resolveProviderSyntheticAuthWithPlugin({
		provider,
		config: options.config,
		workspaceDir: options.workspaceDir,
		env: options.env,
		context: {
			config: options.config,
			provider,
			providerConfig: options.config?.models?.providers?.[provider]
		}
	}));
	for (const provider of syntheticAuthProviderRefs) {
		if (credentials[provider]) continue;
		if (!isAmbientCredentialAllowedByProviderAuthPin({
			config: options.config,
			authAliasLookupParams: {
				...options.env ? { env: options.env } : {},
				...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {}
			},
			provider,
			type: "api_key"
		})) continue;
		const apiKey = resolveSyntheticAuth(provider)?.apiKey?.trim();
		if (!apiKey) continue;
		credentials[provider] = {
			type: "api_key",
			key: apiKey
		};
	}
	return credentials;
}
/** Resolves the effective auth store and provider credentials for one discovery generation. */
function resolveAgentDiscoveryAuthFacts(agentDir, options) {
	const storeOptions = {
		allowKeychainPrompt: false,
		...options?.config ? { config: options.config } : {},
		...options?.externalCli ? { externalCli: options.externalCli } : {},
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {}
	};
	const store = options?.preparedStore ? options.preparedStore : options?.skipExternalAuthProfiles === true ? ensureAuthProfileStoreWithoutExternalProfiles(agentDir, {
		allowKeychainPrompt: false,
		...options?.inheritedAuthDir ? { inheritedAuthDir: options.inheritedAuthDir } : {},
		...options?.readOnly === true ? { readOnly: true } : {}
	}) : ensureAuthProfileStore(agentDir, {
		...storeOptions,
		...options?.readOnly === true ? { readOnly: true } : {}
	});
	const credentials = resolveAgentCredentialMapFromStore(store, {
		includeSecretRefPlaceholders: options?.readOnly === true,
		config: options?.config
	});
	const ambientCredentials = options?.ambientCredentials ?? resolveAmbientAgentCredentialsForDiscovery({
		config: options?.config,
		workspaceDir: options?.workspaceDir,
		env: options?.env,
		syntheticAuthProviderRefs: options?.syntheticAuthProviderRefs
	});
	for (const [provider, credential] of Object.entries(ambientCredentials)) {
		if (credentials[provider]) continue;
		credentials[provider] = credential;
	}
	return {
		store,
		credentials
	};
}
//#endregion
//#region src/agents/agent-model-discovery.ts
/** Discovers agent models and auth storage with provider/plugin normalization hooks. */
const CAPTURED_MODELS_JSON_SOURCE_PATH = "captured:models.json";
/** Applies plugin model normalization and transport hooks to discovered agent models. */
function normalizeDiscoveredAgentModel(value, agentDir, options) {
	if (!isRecord(value)) return value;
	if (typeof value.id !== "string" || typeof value.name !== "string" || typeof value.provider !== "string") return value;
	const model = value;
	const runtimeContext = {
		...options?.config !== void 0 ? { config: options.config } : {},
		...options?.workspaceDir !== void 0 ? { workspaceDir: options.workspaceDir } : {}
	};
	const pluginNormalized = normalizeProviderResolvedModelWithPlugin({
		provider: model.provider,
		modelId: model.id,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model,
			agentDir
		}
	}) ?? model;
	const transportNormalized = applyProviderResolvedTransportWithPlugin({
		provider: model.provider,
		modelId: model.id,
		...runtimeContext,
		context: {
			provider: model.provider,
			modelId: model.id,
			model: pluginNormalized,
			agentDir
		}
	}) ?? pluginNormalized;
	if (!isRecord(transportNormalized) || typeof transportNormalized.id !== "string" || typeof transportNormalized.name !== "string" || typeof transportNormalized.provider !== "string" || typeof transportNormalized.api !== "string") return value;
	return normalizeModelCompat(transportNormalized, options?.providerMetadataOwners);
}
function createOpenClawModelRegistry(authStorage, modelsJsonPath, agentDir, options) {
	const pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
		...options?.config ? { config: options.config } : {},
		...options?.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
		...options?.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
		allowWorkspaceScopedCurrent: options?.workspaceDir === void 0,
		useRuntimeConfig: options?.config === void 0
	});
	const registryOptions = {
		...pluginMetadataSnapshot ? { pluginMetadataSnapshot } : {},
		...options?.includePluginCatalogs !== void 0 ? { includePluginCatalogs: options.includePluginCatalogs } : {},
		...options?.modelsJsonContents !== void 0 ? { modelsJsonContents: options.modelsJsonContents } : {},
		...options?.pluginCatalogs !== void 0 ? { pluginCatalogs: options.pluginCatalogs } : {}
	};
	const registry = ModelRegistry.create(authStorage, modelsJsonPath, registryOptions);
	const getAll = registry.getAll.bind(registry);
	const getAvailable = registry.getAvailable.bind(registry);
	const find = registry.find.bind(registry);
	const refresh = registry.refresh.bind(registry);
	const providerFilter = options?.providerFilter ? normalizeProviderId(options.providerFilter) : "";
	const matchesProviderFilter = (entry) => !providerFilter || normalizeProviderId(entry.provider) === providerFilter;
	const shouldNormalize = options?.normalizeModels !== false;
	const findCache = /* @__PURE__ */ new Map();
	const normalizeEntry = (entry) => {
		if (!shouldNormalize) return entry;
		if (!agentDir) throw new Error("agent directory is required for model normalization");
		return normalizeDiscoveredAgentModel(entry, agentDir, {
			...options,
			...pluginMetadataSnapshot?.owners ? { providerMetadataOwners: pluginMetadataSnapshot.owners } : {}
		});
	};
	registry.getAll = () => {
		const entries = getAll().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.getAvailable = () => {
		const entries = getAvailable().filter((entry) => matchesProviderFilter(entry));
		return shouldNormalize ? entries.map(normalizeEntry) : entries;
	};
	registry.find = (provider, modelId) => {
		const key = `${normalizeProviderId(provider)}\0${modelId}`;
		if (findCache.has(key)) return findCache.get(key);
		const fallbackEntry = find(provider, modelId);
		const resolved = fallbackEntry ? normalizeEntry(fallbackEntry) : void 0;
		findCache.set(key, resolved);
		return resolved;
	};
	registry.refresh = () => {
		findCache.clear();
		return refresh();
	};
	return registry;
}
/** Captures the effective profile store and its AuthStorage projection as one generation. */
function discoverAuthStorageFacts(agentDir, options) {
	const facts = options?.skipCredentials === true ? {
		store: {
			version: 1,
			profiles: {}
		},
		credentials: {}
	} : resolveAgentDiscoveryAuthFacts(agentDir, options);
	return {
		...facts,
		authStorage: AuthStorage.inMemory(facts.credentials)
	};
}
/** Creates the model registry used by agent model discovery. */
/** Creates a model registry for one agent directory, optionally filtered and plugin-normalized. */
function discoverModels(authStorage, agentDir, options) {
	return createOpenClawModelRegistry(authStorage, path.join(agentDir, "models.json"), agentDir, options);
}
/**
* Parses complete lifecycle-captured sources without retaining an agent-directory dependency.
* Callers may share the resulting immutable catalog snapshot across exact source generations.
*/
function discoverModelsFromCapturedSources(authStorage, options) {
	return createOpenClawModelRegistry(authStorage, CAPTURED_MODELS_JSON_SOURCE_PATH, void 0, {
		...options,
		normalizeModels: false
	});
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-catalog.ts
function modelCatalogEntryKey(entry) {
	return `${normalizeProviderId(entry.provider)}\0${entry.id.trim().toLowerCase()}`;
}
function createConfiguredModelCatalogSnapshot(params) {
	const entries = /* @__PURE__ */ new Map();
	const addEntry = (entry) => {
		const key = modelCatalogEntryKey(entry);
		if (!entries.has(key)) entries.set(key, entry);
	};
	for (const entry of params.workspaceFacts.configuredCatalogEntries) addEntry(entry);
	for (const configured of params.configuredRuntimeModels) addEntry(toStaticCatalogEntry(configured.model));
	for (const { value } of params.agentFacts.configuredModelRefs) {
		const separator = value.indexOf("/");
		if (separator <= 0 || separator >= value.length - 1) continue;
		const provider = normalizeProviderId(value.slice(0, separator));
		const modelId = value.slice(separator + 1).trim();
		if (!provider || !modelId) continue;
		const model = params.templateModelRegistry.find(provider, modelId);
		if (model) addEntry(toStaticCatalogEntry(model));
	}
	const configuredEntries = [...entries.values()];
	const staticEntries = params.configuredRuntimeModels.map(({ model }) => toStaticCatalogEntry(model));
	return {
		entries: configuredEntries,
		routeVariants: configuredEntries,
		...staticEntries.length > 0 ? { staticEntries } : {}
	};
}
function prepareConfiguredRuntimeFacts(params) {
	return {
		templateModelRegistry: params.templateModelRegistry,
		modelCatalog: createConfiguredModelCatalogSnapshot(params),
		configuredRuntimeModels: params.configuredRuntimeModels,
		inlineProviderModels: params.workspaceFacts.inlineProviderModels
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.configured-completion.ts
function completeConfiguredRuntimeModels(params) {
	const existing = new Map(params.configuredRuntimeModels.map((configured) => [buildModelCatalogMergeKey(configured.provider, configured.modelId), configured]));
	const completed = [];
	const seen = /* @__PURE__ */ new Set();
	for (const { value } of params.configuredModelRefs) {
		const parsed = parseModelCatalogRef(value);
		if (!parsed) continue;
		const key = buildModelCatalogMergeKey(parsed.provider, parsed.modelId);
		if (seen.has(key)) continue;
		seen.add(key);
		const model = existing.get(key)?.model ?? params.resolveDynamicModel(parsed);
		if (model) completed.push({
			provider: parsed.provider,
			modelId: parsed.modelId,
			model
		});
	}
	return completed;
}
//#endregion
//#region src/agents/prepared-model-runtime.inbound-registry.ts
function inboundRegistryIdentity(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true
	});
}
/** Groups model-selected workspace facts while keeping generic inbound identity narrower. */
function preparedModelRuntimeWorkspaceFactsKey(input) {
	return JSON.stringify({
		config: hashRuntimeConfigValue(input.config),
		env: hashRuntimeConfigValue(input.env ?? process.env),
		readOnly: input.readOnly === true,
		loadRuntimePlugins: input.loadRuntimePlugins === true,
		workspaceDir: input.workspaceDir,
		allowGatewaySubagentBinding: input.allowGatewaySubagentBinding === true,
		runtimePluginSelections: input.runtimePluginSelections
	});
}
/** Creates one lifecycle-batch loader that shares exact generic registry identities. */
function createPreparedInboundRegistryLoader() {
	const registries = /* @__PURE__ */ new Map();
	return (input) => {
		const key = inboundRegistryIdentity(input);
		const existing = registries.get(key);
		if (existing) return existing;
		const registry = loadAgentRuntimePluginRegistryHandle({
			config: input.config,
			env: input.env ?? process.env,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
			...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {}
		});
		registries.set(key, registry);
		return registry;
	};
}
/** Prepares distinct generic-inbound and model-selected registries for one workspace generation. */
function prepareWorkspacePluginRegistries(input, loadInboundRegistry) {
	if (input.readOnly && !input.loadRuntimePlugins && !input.runtimePluginSelections) return {};
	const inboundPluginRegistry = input.readOnly ? void 0 : loadInboundRegistry?.(input);
	return {
		runtimePluginRegistry: input.runtimePluginSelections || !inboundPluginRegistry ? loadAgentRuntimePluginRegistryHandle({
			config: input.config,
			env: input.env ?? process.env,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
			...input.allowGatewaySubagentBinding ? { allowGatewaySubagentBinding: true } : {},
			selections: input.runtimePluginSelections
		}) : inboundPluginRegistry,
		...inboundPluginRegistry ? { inboundPluginRegistry } : {}
	};
}
//#endregion
//#region src/agents/prepared-model-runtime.plugin-context.ts
const preparedPluginRuntimeLoadContext = Symbol("preparedPluginRuntimeLoadContext");
const emptyPluginDiscovery = {
	candidates: [],
	diagnostics: []
};
function setPreparedPluginRuntimeLoadContext(registry, context) {
	registry[preparedPluginRuntimeLoadContext] = context;
}
function preparePluginLoadContext(input, env, registry, metadataSnapshot) {
	const { config, workspaceDir } = input;
	const context = {
		...resolvePluginRuntimeLoadContext({
			config,
			env,
			workspaceDir,
			metadataSnapshot: metadataSnapshot.discovery ? metadataSnapshot : {
				...metadataSnapshot,
				discovery: emptyPluginDiscovery
			},
			manifestRegistry: metadataSnapshot.manifestRegistry
		}),
		metadataSnapshot,
		installRecords: extractPluginInstallRecordsFromInstalledPluginIndex(metadataSnapshot.index)
	};
	if (registry) setPreparedPluginRuntimeLoadContext(registry, context);
	return context;
}
/** Resolves and attaches the plugin facts owned by one prepared workspace generation. */
function prepareOwnedPluginLoadContext(input, env, registry) {
	const metadataSnapshot = resolvePluginMetadataSnapshot({
		config: input.config,
		env,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.workspacePluginRootPresent === void 0 ? {} : { workspacePluginRootPresent: input.workspacePluginRootPresent }
	});
	preparePluginLoadContext(input, env, registry, metadataSnapshot);
	return metadataSnapshot;
}
/** Reads plugin facts carried by a lifecycle-owned prepared runtime snapshot. */
const getPreparedPluginRuntimeLoadContext = (registry) => registry?.[preparedPluginRuntimeLoadContext];
//#endregion
//#region src/agents/prepared-model-runtime.synthetic-auth.ts
/** Synthetic-auth provider ref selection and prepared-catalog resolution for model-runtime builds. */
function scopeSyntheticAuthProviderRefs(refs, providerDiscoveryProviderIds) {
	if (!providerDiscoveryProviderIds) return [...refs];
	const scoped = new Set(providerDiscoveryProviderIds.map((id) => normalizeProviderId(id)));
	return refs.filter((ref) => scoped.has(normalizeProviderId(ref)));
}
function listPreparedSyntheticAuthProviderRefs(providers) {
	return [...new Set(providers.flatMap((provider) => typeof provider.resolveSyntheticAuth === "function" ? [
		provider.id,
		...provider.aliases ?? [],
		...provider.hookAliases ?? []
	] : []))].toSorted((left, right) => left.localeCompare(right));
}
function resolvePreparedSyntheticAuth(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	return params.providers.find((candidate) => [
		candidate.id,
		...candidate.aliases ?? [],
		...candidate.hookAliases ?? []
	].some((ref) => normalizeProviderId(ref) === normalizedProvider))?.resolveSyntheticAuth?.({
		config: params.config,
		provider: params.provider,
		providerConfig: Object.entries(params.config.models?.providers ?? {}).find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[1]
	}) ?? void 0;
}
//#endregion
//#region src/agents/prepared-model-runtime.facts.ts
const MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS = 5e3;
const fullModelCatalogSnapshots = /* @__PURE__ */ new WeakSet();
function prepareAgentFacts(input, catalogMode, ambientCredentials, additionalProviderIds = []) {
	const env = input.env ?? process.env;
	const publishedStore = getPreparedRuntimeAuthProfileStoreSnapshot(input.agentDir, input.inheritedAuthDir);
	const preparedStore = publishedStore && (publishedStore.runtimeExternalProfileIds !== void 0 || publishedStore.runtimeExternalProfileIdsAuthoritative === true) ? publishedStore : void 0;
	const authFacts = discoverAuthStorageFacts(input.agentDir, {
		config: input.config,
		readOnly: true,
		ambientCredentials,
		...preparedStore ? { preparedStore } : {},
		...input.skipCredentials ? { skipCredentials: true } : {},
		...input.inheritedAuthDir ? { inheritedAuthDir: input.inheritedAuthDir } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {}
	});
	const credentials = authFacts.credentials;
	const templateAuthStorage = authFacts.authStorage;
	const configuredModelRefs = collectPreparedModelRuntimeConfiguredRefs(input.config, input.agentId);
	return {
		input,
		env,
		authStore: authFacts.store,
		templateAuthStorage,
		credentials,
		configuredModelRefs,
		providerIds: [.../* @__PURE__ */ new Set([...collectPreparedModelRuntimeProviderIds(input.config, credentials, catalogMode === "live", configuredModelRefs), ...additionalProviderIds.map(normalizeProviderId).filter(Boolean)])].toSorted((left, right) => left.localeCompare(right))
	};
}
async function prepareWorkspaceBuildGroup(inputs, catalogMode, options = {}, loadInboundPluginRegistry, reusablePluginGeneration) {
	const input = inputs[0];
	if (!input) throw new Error("prepared model runtime workspace group is empty");
	const env = input.env ?? process.env;
	const runtimePluginStartedAt = performance.now();
	const { inboundPluginRegistry, runtimePluginRegistry } = reusablePluginGeneration ? {
		inboundPluginRegistry: reusablePluginGeneration.inboundPluginRegistry,
		runtimePluginRegistry: reusablePluginGeneration.pluginRegistry
	} : prepareWorkspacePluginRegistries(input, loadInboundPluginRegistry);
	const runtimePluginMs = reusablePluginGeneration ? 0 : performance.now() - runtimePluginStartedAt;
	return await withPluginRuntimeRegistryScope(runtimePluginRegistry, async () => {
		const pluginMetadataStartedAt = performance.now();
		const pluginMetadataSnapshot = reusablePluginGeneration?.pluginMetadataSnapshot ?? prepareOwnedPluginLoadContext(input, env, runtimePluginRegistry);
		const pluginMetadataMs = reusablePluginGeneration ? 0 : performance.now() - pluginMetadataStartedAt;
		const matchesStaticModelId = createStaticModelIdMatcher({ manifestPlugins: pluginMetadataSnapshot.plugins });
		const mediaCapabilityProviders = reusablePluginGeneration ? reusablePluginGeneration.mediaCapabilityProviders : input.readOnly || !runtimePluginRegistry ? void 0 : prepareMediaCapabilityProviders({
			cfg: input.config,
			pluginMetadataSnapshot,
			registry: runtimePluginRegistry
		});
		const messageToolCatalog = reusablePluginGeneration ? reusablePluginGeneration.messageToolCatalog : runtimePluginRegistry ? getPreparedMessageToolCatalogForRegistry(runtimePluginRegistry) : catalogMode === "live" ? getPreparedMessageToolCatalog() : void 0;
		const resolveManifestStaticCatalogModel = createBundledStaticCatalogModelResolver({
			cfg: input.config,
			env,
			includeRuntimeDiscovery: true,
			metadataSnapshot: pluginMetadataSnapshot,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const configuredManifestModels = /* @__PURE__ */ new Map();
		const resolveConfiguredManifestModel = (lookup) => {
			const key = `${normalizeProviderId(lookup.provider)}\0${lookup.modelId.trim().toLowerCase()}`;
			if (configuredManifestModels.has(key)) return configuredManifestModels.get(key);
			const model = resolveManifestStaticCatalogModel(lookup);
			configuredManifestModels.set(key, model);
			return model;
		};
		const configuredProviderIds = [.../* @__PURE__ */ new Set([...collectPreparedModelRuntimeProviderIds(input.config, {}, false), ...(options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean)])].toSorted((left, right) => left.localeCompare(right));
		const staticCatalogProviderIds = [.../* @__PURE__ */ new Set([...collectConfiguredProviderIdsNeedingStaticCatalog({
			config: input.config,
			matchesStaticModelId,
			resolveStaticCatalogModel: resolveConfiguredManifestModel
		}), ...(options.providerDiscoveryProviderIds ?? []).map(normalizeProviderId).filter(Boolean)])].toSorted((left, right) => left.localeCompare(right));
		const staticProviderCatalogStartedAt = performance.now();
		const preparedStaticProviderCatalog = reusablePluginGeneration ? reusablePluginGeneration.preparedStaticProviderCatalog : catalogMode === "static" ? await prepareImplicitProviderStaticCatalog({
			config: input.config,
			env,
			pluginMetadataSnapshot,
			providerDiscoveryProviderIds: configuredProviderIds,
			staticCatalogProviderIds,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		}) : void 0;
		const staticProviderCatalogMs = reusablePluginGeneration ? 0 : performance.now() - staticProviderCatalogStartedAt;
		const preparedSyntheticAuthProviders = preparedStaticProviderCatalog?.providers ?? [];
		const ambientCredentialsStartedAt = performance.now();
		const ambientCredentials = resolveAmbientAgentCredentialsForDiscovery({
			config: input.config,
			env,
			syntheticAuthProviderRefs: catalogMode === "static" ? listPreparedSyntheticAuthProviderRefs(preparedSyntheticAuthProviders) : scopeSyntheticAuthProviderRefs(resolveRuntimeSyntheticAuthProviderRefs({
				config: input.config,
				env,
				index: pluginMetadataSnapshot.index,
				registryDiagnostics: pluginMetadataSnapshot.registryDiagnostics,
				...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
			}), options.providerDiscoveryProviderIds),
			...catalogMode === "static" ? { resolveSyntheticAuth: (provider) => resolvePreparedSyntheticAuth({
				config: input.config,
				provider,
				providers: preparedSyntheticAuthProviders
			}) } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const ambientCredentialsMs = performance.now() - ambientCredentialsStartedAt;
		const agentFactsStartedAt = performance.now();
		const agentBaseFacts = inputs.map((candidate) => prepareAgentFacts(candidate, catalogMode, ambientCredentials, options.providerDiscoveryProviderIds));
		const agentFactsMs = performance.now() - agentFactsStartedAt;
		const configuredProjectionStartedAt = performance.now();
		const providerStaticModels = reusablePluginGeneration?.providerStaticModels ?? (catalogMode === "static" ? [] : await loadBundledProviderStaticCatalogContextModels({
			cfg: input.config,
			env,
			metadataSnapshot: pluginMetadataSnapshot,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		}));
		const inlineProviderModels = reusablePluginGeneration?.inlineProviderModels ?? buildInlineProviderModels(input.config.models?.providers ?? {}, { providerMetadataOwners: pluginMetadataSnapshot.owners });
		const configuredCatalogEntries = reusablePluginGeneration?.configuredCatalogEntries ?? buildConfiguredModelCatalog({
			cfg: input.config,
			manifestPlugins: pluginMetadataSnapshot.plugins,
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		const agentFacts = [];
		for (const facts of agentBaseFacts) {
			const configuredRuntimeModels = prepareConfiguredRuntimeModels({
				config: facts.input.config,
				configuredModelRefs: facts.configuredModelRefs,
				metadataSnapshot: pluginMetadataSnapshot,
				...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
				providerStaticModels,
				matchesStaticModelId,
				resolveStaticCatalogModel: resolveConfiguredManifestModel
			});
			const configuredEntryKeys = new Set(configuredCatalogEntries.map(modelCatalogEntryKey));
			for (const configured of configuredRuntimeModels) configuredEntryKeys.add(modelCatalogEntryKey({
				provider: configured.provider,
				id: configured.modelId
			}));
			const configuredGeneratedCatalogPluginIds = [...new Set(facts.configuredModelRefs.flatMap(({ value }) => {
				const separator = value.indexOf("/");
				if (separator <= 0 || separator >= value.length - 1) return [];
				const provider = normalizeProviderId(value.slice(0, separator));
				const modelId = value.slice(separator + 1).trim();
				if (!provider || !modelId || configuredEntryKeys.has(modelCatalogEntryKey({
					provider,
					id: modelId
				}))) return [];
				const pluginId = resolvePluginModelCatalogOwnerPluginId({
					providerId: provider,
					pluginMetadataSnapshot
				});
				return pluginId ? [pluginId] : [];
			}))].toSorted((left, right) => left.localeCompare(right));
			agentFacts.push({
				...facts,
				configuredRuntimeModels,
				configuredGeneratedCatalogPluginIds
			});
		}
		const configuredProjectionMs = performance.now() - configuredProjectionStartedAt;
		const pluginGeneration = reusablePluginGeneration ?? Object.freeze({
			pluginMetadataSnapshot,
			messageToolCatalog,
			inlineProviderModels: Object.freeze([...inlineProviderModels]),
			configuredCatalogEntries: Object.freeze([...configuredCatalogEntries]),
			...runtimePluginRegistry ? { pluginRegistry: runtimePluginRegistry } : {},
			...inboundPluginRegistry ? { inboundPluginRegistry } : {},
			...mediaCapabilityProviders ? { mediaCapabilityProviders } : {},
			...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
			...catalogMode === "live" ? { providerStaticModels: Object.freeze([...providerStaticModels]) } : {}
		});
		return {
			agentFacts,
			buildStats: {
				runtimePluginMs,
				pluginMetadataMs,
				staticProviderCatalogMs,
				ambientCredentialsMs,
				agentFactsMs,
				configuredProjectionMs
			},
			pluginGeneration
		};
	});
}
async function prepareFullCatalogFacts(agentFacts, pluginGeneration, catalogMode, catalogSource) {
	const { credentials, env, input, templateAuthStorage } = agentFacts;
	const { pluginMetadataSnapshot, preparedStaticProviderCatalog } = pluginGeneration;
	const templateModelRegistry = discoverModels(templateAuthStorage, input.agentDir, {
		config: input.config,
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		pluginMetadataSnapshot,
		...catalogMode === "static" ? { normalizeModels: false } : {},
		...catalogSource ? {
			includePluginCatalogs: true,
			modelsJsonContents: catalogSource.modelsJsonContents,
			pluginCatalogs: catalogSource.pluginCatalogs
		} : {}
	});
	const modelCatalog = await buildPreparedModelCatalogSnapshot({
		agentDir: input.agentDir,
		authCredentials: credentials,
		config: input.config,
		modelRegistry: templateModelRegistry,
		metadataSnapshot: pluginMetadataSnapshot,
		includeProviderPluginAugmentation: catalogMode === "live",
		...input.env ? { env } : {},
		...input.readOnly ? { readOnly: true } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	const providerStaticModels = pluginGeneration.providerStaticModels ?? await loadBundledProviderStaticCatalogContextModels({
		cfg: input.config,
		env,
		metadataSnapshot: pluginMetadataSnapshot,
		...preparedStaticProviderCatalog ? { preparedStaticProviderCatalog } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
	});
	const configuredRuntimeModels = agentFacts.configuredRuntimeModels;
	const staticModels = /* @__PURE__ */ new Map();
	for (const model of [...configuredRuntimeModels.map((configured) => configured.model), ...providerStaticModels]) {
		const modelKey = `${normalizeProviderId(model.provider)}\0${model.id.trim().toLowerCase()}`;
		if (!staticModels.has(modelKey)) staticModels.set(modelKey, model);
	}
	const staticEntries = [...staticModels.values()].map(toStaticCatalogEntry);
	const providerOutcomes = catalogSource?.providerOutcomes ?? [];
	const completeModelCatalog = {
		...modelCatalog,
		staticEntries,
		...providerOutcomes.length > 0 ? { providerOutcomes } : {}
	};
	if (catalogMode === "live") fullModelCatalogSnapshots.add(completeModelCatalog);
	return {
		templateModelRegistry,
		modelCatalog: completeModelCatalog,
		configuredRuntimeModels,
		inlineProviderModels: pluginGeneration.inlineProviderModels
	};
}
/** Reports whether a catalog came from the complete prepared-catalog build path. */
function isPreparedModelCatalogFull(snapshot) {
	return fullModelCatalogSnapshots.has(snapshot);
}
/** Restores process-local provenance after a complete catalog crosses a worker boundary. */
function markPreparedModelCatalogFull(snapshot) {
	fullModelCatalogSnapshots.add(snapshot);
	return snapshot;
}
function captureModelsJsonContents(agentDir) {
	try {
		return fs.readFileSync(path.join(agentDir, "models.json"), "utf8");
	} catch (error) {
		if (error.code === "ENOENT") return null;
		throw error;
	}
}
function fingerprintPreparedRuntimeFacts(value) {
	return sha256Base64Url(stableStringify(value));
}
function hasSameOAuthProviderGeneration(left, right) {
	return left.length === right.length && left.every((provider, index) => {
		const candidate = right[index];
		return candidate !== void 0 && provider.id === candidate.id && provider.name === candidate.name && provider.usesCallbackServer === candidate.usesCallbackServer && provider.login === candidate.login && provider.refreshToken === candidate.refreshToken && provider.getApiKey === candidate.getApiKey && provider.modifyModels === candidate.modifyModels;
	});
}
function groupConfiguredRegistrySources(agentFacts) {
	const groups = /* @__PURE__ */ new Map();
	for (const facts of agentFacts) {
		const modelsJsonContents = captureModelsJsonContents(facts.input.agentDir);
		const oauthProviders = facts.templateAuthStorage.getOAuthProviders();
		const pluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(facts.input.agentDir, facts.configuredGeneratedCatalogPluginIds);
		const key = fingerprintPreparedRuntimeFacts({
			credentials: facts.credentials,
			modelsJsonContents,
			pluginCatalogs
		});
		const candidates = groups.get(key) ?? [];
		const group = candidates.find((candidate) => hasSameOAuthProviderGeneration(candidate.oauthProviders, oauthProviders));
		if (group) group.agentFacts.push(facts);
		else {
			candidates.push({
				agentFacts: [facts],
				modelsJsonContents,
				oauthProviders,
				pluginCatalogs
			});
			groups.set(key, candidates);
		}
	}
	return [...groups.values()].flat();
}
function prepareConfiguredRuntimeFactsBatch(params) {
	const catalogs = /* @__PURE__ */ new Map();
	let registryCount = 0;
	for (const group of groupConfiguredRegistrySources(params.agentFacts)) {
		const representative = group.agentFacts[0];
		if (!representative) continue;
		const templateModelRegistry = discoverModelsFromCapturedSources(representative.templateAuthStorage, {
			config: representative.input.config,
			includePluginCatalogs: true,
			modelsJsonContents: group.modelsJsonContents,
			pluginCatalogs: group.pluginCatalogs,
			pluginMetadataSnapshot: params.pluginGeneration.pluginMetadataSnapshot,
			...representative.input.workspaceDir ? { workspaceDir: representative.input.workspaceDir } : {}
		});
		registryCount += 1;
		withPluginRuntimeRegistryScope(params.pluginGeneration.pluginRegistry, () => {
			for (const facts of group.agentFacts) {
				const { input } = facts;
				const configuredRuntimeModels = params.pluginGeneration.pluginRegistry ? completeConfiguredRuntimeModels({
					configuredModelRefs: facts.configuredModelRefs,
					configuredRuntimeModels: facts.configuredRuntimeModels,
					resolveDynamicModel: ({ provider, modelId }) => {
						const providerConfig = input.config.models?.providers?.[provider] ?? findNormalizedProviderValue(input.config.models?.providers, provider);
						return resolveLoadedProviderRuntimePlugin({
							provider,
							modelId,
							config: input.config,
							workspaceDir: input.workspaceDir,
							env: facts.env
						})?.resolveDynamicModel?.({
							config: input.config,
							agentDir: input.agentDir,
							workspaceDir: input.workspaceDir,
							provider,
							modelId,
							modelRegistry: templateModelRegistry,
							providerConfig
						}) ?? void 0;
					}
				}) : facts.configuredRuntimeModels;
				catalogs.set(input, prepareConfiguredRuntimeFacts({
					agentFacts: facts,
					workspaceFacts: params.pluginGeneration,
					templateModelRegistry,
					configuredRuntimeModels
				}));
			}
		});
	}
	return {
		catalogs,
		registryCount
	};
}
async function prepareAgentCatalogSource(agentFacts, pluginGeneration, catalogMode, persist = true, sourceOptions = {}) {
	const { env, input, providerIds } = agentFacts;
	const providerOutcomes = /* @__PURE__ */ new Map();
	const recordProviderOutcome = (outcome) => {
		const provider = normalizeProviderId(outcome.provider);
		if (provider) providerOutcomes.set(`${provider}\0${outcome.profileId ?? ""}`, {
			...outcome,
			provider
		});
	};
	const resultOutcomes = () => [...providerOutcomes.values()].toSorted((left, right) => left.provider.localeCompare(right.provider) || (left.profileId ?? "").localeCompare(right.profileId ?? ""));
	const options = {
		pluginMetadataSnapshot: pluginGeneration.pluginMetadataSnapshot,
		...pluginGeneration.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: pluginGeneration.preparedStaticProviderCatalog } : {},
		...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {},
		...input.env ? { env } : {},
		...catalogMode === "static" ? {
			providerDiscoveryEntriesOnly: true,
			providerDiscoveryProviderIds: sourceOptions.providerDiscoveryProviderIds ?? providerIds
		} : {
			providerDiscoveryTimeoutMs: MODEL_RUNTIME_PROVIDER_DISCOVERY_TIMEOUT_MS,
			...sourceOptions.providerDiscoveryProviderIds ? { providerDiscoveryProviderIds: sourceOptions.providerDiscoveryProviderIds } : {}
		}
	};
	if (!persist) {
		const source = await planOpenClawModelsJsonSource(input.config, input.agentDir, {
			...options,
			...sourceOptions.authStore ? { authStore: sourceOptions.authStore } : {},
			...catalogMode === "live" ? { onProviderCatalogOutcome: recordProviderOutcome } : {}
		});
		return {
			modelsJsonContents: source.modelsJsonContents,
			pluginCatalogs: source.pluginCatalogs,
			providerOutcomes: resultOutcomes()
		};
	}
	if (!input.readOnly) await ensureOpenClawModelsJson(input.config, input.agentDir, {
		...options,
		...catalogMode === "live" ? { onProviderCatalogOutcome: recordProviderOutcome } : {}
	});
	return {
		modelsJsonContents: captureModelsJsonContents(input.agentDir),
		pluginCatalogs: loadPersistedPluginModelCatalogsReadOnly(input.agentDir),
		providerOutcomes: resultOutcomes()
	};
}
//#endregion
export { prepareConfiguredRuntimeFactsBatch as a, getPreparedPluginRuntimeLoadContext as c, normalizeDiscoveredAgentModel as d, resolveAmbientAgentCredentialsForDiscovery as f, prepareAgentCatalogSource as i, createPreparedInboundRegistryLoader as l, resolveUsableAgentCredentialModes as m, isPreparedModelCatalogFull as n, prepareFullCatalogFacts as o, resolveAgentCredentialMapFromStore as p, markPreparedModelCatalogFull as r, prepareWorkspaceBuildGroup as s, fingerprintPreparedRuntimeFacts as t, preparedModelRuntimeWorkspaceFactsKey as u };
