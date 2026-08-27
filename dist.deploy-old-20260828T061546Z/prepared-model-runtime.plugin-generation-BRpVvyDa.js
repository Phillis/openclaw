import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { o as asDateTimestampMs } from "./number-coercion-CLj0HTDM.js";
import "./utils-Bw16L5tB.js";
import { s as coerceSecretRef } from "./types.secrets-Bre8L6Ts.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-D--dYlKj.js";
import { i as resolveAuthProfileOrder } from "./order-BxFkXXxj.js";
import { g as resolveProviderEnvAuthLookupMaps, h as listProviderEnvAuthLookupKeys } from "./model-auth-markers-Dy2BML3M.js";
import { h as resolveModelPluginMetadataSnapshot } from "./provider-hook-runtime-D8D6y2A9.js";
import { D as resolveProviderSyntheticAuthWithPlugin, p as normalizeProviderResolvedModelWithPlugin, t as applyProviderResolvedTransportWithPlugin } from "./provider-runtime-DERww3Gm.js";
import { i as isAmbientCredentialAllowedByProviderAuthPin } from "./external-auth-CHgvfGCk.js";
import { a as ensureAuthProfileStoreWithoutExternalProfiles, r as ensureAuthProfileStore } from "./store-C6iqqcJy.js";
import { t as buildPreparedModelCatalogSnapshot } from "./model-catalog-SLrvGBJu.js";
import { i as normalizeModelCompat } from "./provider-model-compat-C4PXDgtP.js";
import { n as resolveRuntimeSyntheticAuthProviderRefs } from "./synthetic-auth.runtime.js";
import { t as resolveEnvApiKey } from "./model-auth-env-C2cLUS85.js";
import { ct as ModelRegistry, vt as AuthStorage } from "./sessions-BLpYW515.js";
import { o as toStaticCatalogEntry } from "./prepared-model-runtime.configured-Daaw4LxM.js";
import { n as augmentPreparedModelCatalogWithAgentHarness } from "./model-catalog-BlDLqKO_.js";
import path from "node:path";
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
	for (const { provider, modelId } of params.agentFacts.configuredModelRefs) {
		const model = params.templateModelRegistry.find(provider, modelId);
		if (model) addEntry(toStaticCatalogEntry(model));
	}
	const materializedEntries = materializeRuntimeCapabilities([...entries.values()], params.agentFacts.runtimeCapabilityModels);
	const staticEntries = materializeRuntimeCapabilities(params.configuredRuntimeModels.map(({ model }) => toStaticCatalogEntry(model)), params.agentFacts.runtimeCapabilityModels);
	return {
		entries: materializedEntries,
		routeVariants: materializedEntries,
		...staticEntries.length > 0 ? { staticEntries } : {}
	};
}
/**
* Configured views omit runtime-only rows. Retain the concrete route's
* capabilities on the logical row so downstream projections do not rediscover
* or depend on an absent runtime sibling.
*/
function materializeRuntimeCapabilities(entries, runtimeCapabilityModels) {
	const runtimeByKey = new Map(runtimeCapabilityModels.map(({ provider, modelId, model }) => [modelCatalogEntryKey({
		provider,
		id: modelId
	}), toStaticCatalogEntry(model)]));
	return entries.map((entry) => {
		const runtime = runtimeByKey.get(modelCatalogEntryKey(entry));
		if (!runtime) return entry;
		const thinkingPolicyProvider = runtime.provider;
		if (entry.configuredReasoning !== void 0) return {
			...entry,
			thinkingPolicyProvider
		};
		const params = runtime.params || entry.params ? {
			...runtime.params,
			...entry.params
		} : void 0;
		const compat = runtime.compat || entry.compat ? {
			...runtime.compat,
			...entry.compat
		} : void 0;
		return {
			...entry,
			thinkingPolicyProvider,
			...runtime.reasoning !== void 0 ? { reasoning: runtime.reasoning } : {},
			...params ? { params } : {},
			...compat ? { compat } : {}
		};
	});
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
//#region src/agents/prepared-model-runtime.plugin-generation.ts
function createPreparedPluginGeneration(params) {
	const reusable = params.reusablePluginGeneration;
	if (reusable) return params.pluginMetadataSnapshot === reusable.pluginMetadataSnapshot ? reusable : Object.freeze({
		...reusable,
		pluginMetadataSnapshot: params.pluginMetadataSnapshot
	});
	return Object.freeze({
		pluginMetadataSnapshot: params.pluginMetadataSnapshot,
		inlineProviderModels: Object.freeze([...params.inlineProviderModels]),
		configuredCatalogEntries: Object.freeze([...params.configuredCatalogEntries]),
		...params.messageToolCatalog ? { messageToolCatalog: params.messageToolCatalog } : {},
		...params.runtimePluginRegistry ? { pluginRegistry: params.runtimePluginRegistry } : {},
		...params.inboundPluginRegistry ? { inboundPluginRegistry: params.inboundPluginRegistry } : {},
		...params.preferBuiltPluginArtifacts ? { preferBuiltPluginArtifacts: true } : {},
		...params.mediaCapabilityProviders ? { mediaCapabilityProviders: params.mediaCapabilityProviders } : {},
		...params.preparedStaticProviderCatalog ? { preparedStaticProviderCatalog: params.preparedStaticProviderCatalog } : {},
		...params.catalogMode === "live" ? { providerStaticModels: Object.freeze([...params.providerStaticModels ?? []]) } : {}
	});
}
async function buildPreparedPluginModelCatalog(params) {
	const { credentials, input } = params.agentFacts;
	return await withPreparedPluginGenerationScope({
		input,
		pluginGeneration: params.pluginGeneration
	}, async (metadataSnapshot) => {
		const snapshot = await buildPreparedModelCatalogSnapshot({
			agentDir: input.agentDir,
			authCredentials: credentials,
			config: input.config,
			modelRegistry: params.modelRegistry,
			metadataSnapshot,
			includeProviderPluginAugmentation: params.catalogMode === "live",
			...input.env ? { env: input.env } : {},
			...input.readOnly ? { readOnly: true } : {},
			...input.workspaceDir ? { workspaceDir: input.workspaceDir } : {}
		});
		return params.catalogMode === "live" ? await augmentPreparedModelCatalogWithAgentHarness({
			input,
			snapshot,
			pluginRegistry: params.pluginGeneration.pluginRegistry
		}) : snapshot;
	});
}
/** Runs workspace preparation against one exact, reusable plugin generation. */
function withPreparedPluginGenerationScope(params, run) {
	const { input, pluginGeneration } = params;
	const metadataSnapshot = pluginGeneration.pluginMetadataSnapshot;
	return withPluginRuntimeGenerationScope({
		config: input.config,
		metadataSnapshot,
		pluginRegistry: pluginGeneration.pluginRegistry
	}, () => run(metadataSnapshot));
}
//#endregion
export { modelCatalogEntryKey as a, discoverModels as c, resolveAmbientAgentCredentialsForDiscovery as d, resolveAgentCredentialMapFromStore as f, materializeRuntimeCapabilities as i, discoverModelsFromCapturedSources as l, createPreparedPluginGeneration as n, prepareConfiguredRuntimeFacts as o, resolveUsableAgentCredentialModes as p, withPreparedPluginGenerationScope as r, discoverAuthStorageFacts as s, buildPreparedPluginModelCatalog as t, normalizeDiscoveredAgentModel as u };
