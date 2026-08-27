import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.js";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.js";
import { O as compileSafeRegex } from "./redact-DP7p9QfH.js";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-BdjEHOKQ.js";
import { r as listAgentEntries } from "./agent-scope-config-CsnnOL14.js";
import { m as normalizeResolvedSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { c as normalizePluginsConfigWithResolverCore } from "./config-activation-shared-Br5mnoti.js";
import { a as normalizePluginId, l as resolveEffectivePluginActivationState, m as resolveSelectedContextEnginePluginIdFromConfig } from "./config-state-DLiU5GYQ.js";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.js";
import { m as hashJson } from "./installed-plugin-index-uuE4SyLf.js";
import { l as readResponseTextPrefix } from "./http-body-B0Ouh_va.js";
import "./installed-plugin-index-store-DCxz0axS.js";
import { l as createPluginRegistryIdNormalizer } from "./plugin-registry-snapshot-CxbzdC9E.js";
import { c as normalizePluginIdScope } from "./current-plugin-metadata-snapshot-CmmO-xmS.js";
import { r as normalizePluginsConfigWithRegistry } from "./plugin-registry-contributions-CyOFsuOI.js";
import { i as listModelRefsFromConfigValue, r as collectConfiguredModelRefs } from "./configured-model-refs-0XUAFjEF.js";
import { i as listPotentialConfiguredChannelPresenceSignals, n as listExplicitlyDisabledChannelIdsForConfig, r as listPotentialConfiguredChannelIds } from "./config-presence-Cq0yKkVY.js";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.js";
import { n as isPluginMetadataSnapshotCompatible, s as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DciqS8td.js";
import { t as readBundledDiscoveryMode } from "./bundled-discovery-state-Biifl0nH.js";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-5PpQ61MN.js";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-CQ4RdJXm.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { n as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-BtzNAiNr.js";
import { p as readProviderJsonResponse } from "./provider-http-errors-DwYSuIHs.js";
import { S as requireActivePluginRegistry } from "./runtime-LV4GwzTm.js";
import { n as normalizeConfiguredSpeechProviderIdForStartup, t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-BLxE91li.js";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-BpZyZ0Rr.js";
import { c as listGatewayActivatedChannelIds, n as hasExplicitChannelConfig, s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-CdpkZk_Q.js";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, l as DEFAULT_MEMORY_DREAMING_PLUGIN_ID, w as resolveMemoryDreamingPluginId } from "./dreaming-N16HL0CK.js";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-Ny09TxGQ.js";
import "./config-contracts-BLBFG-5_.js";
import { a as normalizeWorkerProviderIds, r as manifestOwnsWorkerProvider, t as collectConfiguredWorkerProviderIds } from "./worker-provider-config-B0KhVQMV.js";
//#region src/plugins/openai-compatible-embedding-provider.ts
/** Provider id for OpenAI-compatible remote embedding servers. */
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
const EMBEDDING_ERROR_BODY_MAX_BYTES = 8 * 1024;
const EMBEDDING_ERROR_BODY_MAX_CHARS = 1e3;
const EMBEDDING_ERROR_TRUNCATED_SUFFIX = "... [truncated]";
function normalizeBaseUrl(value) {
	const baseUrl = value?.trim();
	if (!baseUrl) throw new Error("openai-compatible embeddings: missing remote.baseUrl. Set it to your OpenAI-compatible embeddings server, for example http://127.0.0.1:11434/v1.");
	return baseUrl.replace(/\/+$/u, "");
}
function normalizeModel(value, providerId) {
	const model = value?.trim();
	if (!model) throw new Error("openai-compatible embeddings: missing model. Set it to the embedding model id your server expects.");
	const prefixes = new Set([
		providerId?.trim(),
		normalizeProviderId(providerId ?? ""),
		OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID
	].filter((prefix) => Boolean(prefix)).map((prefix) => `${prefix}/`));
	for (const prefix of prefixes) if (model.startsWith(prefix)) return model.slice(prefix.length);
	return model;
}
function normalizeDimensions(value) {
	if (value === void 0) return;
	if (!Number.isInteger(value) || value <= 0) throw new Error("openai-compatible embeddings: dimensions must be a positive integer.");
	return value;
}
function normalizeOptionalInputType(value) {
	const inputType = value?.trim();
	return inputType ? inputType : void 0;
}
function chooseSecretInputOverride(override, fallback) {
	if (typeof override === "string") return override.trim() ? override : fallback;
	return override ?? fallback;
}
function resolveRequestInputType(client, kind) {
	if (kind === "query") return client.queryInputType ?? client.inputType;
	if (kind === "document") return client.documentInputType ?? client.inputType;
	return client.inputType;
}
function normalizeHeaderName(name) {
	return name.trim().toLowerCase();
}
function buildHeaders(params) {
	const headers = {
		accept: "application/json",
		"content-type": "application/json"
	};
	for (const [name, rawValue] of Object.entries(params.extra ?? {})) {
		const normalizedName = normalizeHeaderName(name);
		if (!normalizedName || normalizedName === "authorization") continue;
		const value = resolveSecretString({
			value: rawValue,
			path: `models.providers.*.headers.${normalizedName}`
		});
		if (!value) continue;
		headers[normalizedName] = value;
	}
	if (params.apiKey) headers.authorization = `Bearer ${params.apiKey}`;
	return headers;
}
function isSensitiveHeaderName(name) {
	return name === "authorization" || name === "proxy-authorization" || name.includes("api-key") || name.includes("token") || name.includes("secret");
}
function sanitizeCacheHeaders(headers) {
	const safeHeaders = Object.fromEntries(Object.entries(headers).filter(([name]) => !isSensitiveHeaderName(name)));
	return Object.keys(safeHeaders).length > 0 ? safeHeaders : void 0;
}
function resolveSecretString(params) {
	return normalizeResolvedSecretInputString({
		value: params.value,
		path: params.path
	});
}
function resolveRemoteApiKey(value) {
	return resolveSecretString({
		value,
		path: "memory.search.remote.apiKey"
	});
}
function isOpenAICompatibleProviderConfig(id, provider) {
	return normalizeProviderId(id) === OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID || OPENAI_COMPATIBLE_MODEL_APIS.has(normalizeProviderId(provider.api ?? "")) || !provider.api && typeof provider.baseUrl === "string" && provider.baseUrl.trim().length > 0;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const normalizedProviderId = normalizeProviderId(providerId);
	const direct = providers[providerId];
	if (direct && isOpenAICompatibleProviderConfig(providerId, direct)) return {
		providerId,
		config: direct
	};
	const normalizedEntry = Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProviderId);
	if (!normalizedEntry) return;
	const [configuredProviderId, config] = normalizedEntry;
	return isOpenAICompatibleProviderConfig(configuredProviderId, config) ? {
		providerId: configuredProviderId,
		config
	} : void 0;
}
function embeddingInputToText(input) {
	if (typeof input === "string") return input;
	if (!input.parts || input.parts.length === 0) return input.text;
	const textParts = [];
	for (const part of input.parts) {
		if (part.type !== "text") throw new Error("openai-compatible embeddings only support text embedding inputs.");
		textParts.push(part.text);
	}
	return textParts.join("");
}
function malformedEmbeddingResponse() {
	return /* @__PURE__ */ new Error("openai-compatible embeddings failed: malformed JSON response");
}
function readEmbeddingVector(value) {
	if (!Array.isArray(value)) throw malformedEmbeddingResponse();
	for (const entry of value) if (typeof entry !== "number" || !Number.isFinite(entry)) throw malformedEmbeddingResponse();
	return value;
}
function readEmbeddingVectors(payload, expectedCount) {
	if (!Array.isArray(payload.data) || payload.data.length !== expectedCount) throw malformedEmbeddingResponse();
	return payload.data.map((entry) => {
		const record = asOptionalRecord(entry);
		if (!record) throw malformedEmbeddingResponse();
		return readEmbeddingVector(record.embedding);
	});
}
async function readJsonResponse(response) {
	return await readProviderJsonResponse(response, "openai-compatible embeddings failed");
}
async function readEmbeddingErrorBodySnippet(response) {
	if (!response.body || response.bodyUsed) return;
	const prefix = await readResponseTextPrefix(response, EMBEDDING_ERROR_BODY_MAX_BYTES).catch(() => void 0);
	if (!prefix?.text) return;
	const { text, truncated } = prefix;
	if (text.length > EMBEDDING_ERROR_BODY_MAX_CHARS) return `${truncateUtf16Safe(text, EMBEDDING_ERROR_BODY_MAX_CHARS)}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	return truncated ? `${text}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}` : text;
}
async function createEmbeddingHttpError(response) {
	const snippet = await readEmbeddingErrorBodySnippet(response);
	return /* @__PURE__ */ new Error(`openai-compatible embeddings failed: HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`);
}
async function postEmbeddingRequest(params) {
	const { client, input } = params;
	const inputType = resolveRequestInputType(client, params.inputType);
	const body = {
		model: client.model,
		input,
		...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
		...inputType ? { input_type: inputType } : {}
	};
	const localServiceLease = client.localServiceTarget && client.acquireLocalService ? await client.acquireLocalService(client.localServiceTarget, params.signal) : void 0;
	try {
		const { response, release } = await fetchWithSsrFGuard({
			url: `${client.baseUrl}/embeddings`,
			init: {
				method: "POST",
				headers: client.headers,
				body: JSON.stringify(body)
			},
			signal: params.signal,
			policy: client.ssrfPolicy,
			auditContext: "embedding-provider:openai-compatible"
		});
		try {
			if (!response.ok) throw await createEmbeddingHttpError(response);
			return readEmbeddingVectors(await readJsonResponse(response), input.length);
		} finally {
			await release();
		}
	} finally {
		localServiceLease?.release();
	}
}
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
async function createOpenAICompatibleEmbeddingClient(options) {
	const resolvedProvider = resolveConfiguredProvider(options);
	const configuredProvider = resolvedProvider?.config;
	const providerId = resolvedProvider?.providerId ?? options.provider?.trim() ?? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const remoteBaseUrl = normalizeOptionalString(options.remote?.baseUrl);
	const baseUrl = normalizeBaseUrl(remoteBaseUrl ?? configuredProvider?.baseUrl);
	const model = normalizeModel(options.model, options.provider);
	const value = resolveRemoteApiKey(chooseSecretInputOverride(options.remote?.apiKey, configuredProvider?.apiKey));
	const inputType = normalizeOptionalInputType(options.inputType);
	const queryInputType = normalizeOptionalInputType(options.queryInputType);
	const documentInputType = normalizeOptionalInputType(options.documentInputType);
	const headers = buildHeaders({
		apiKey: value,
		extra: {
			...configuredProvider?.headers,
			...options.remote?.headers
		}
	});
	const localServiceOptions = options;
	return {
		providerId,
		baseUrl,
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
		model,
		...configuredProvider?.localService && !remoteBaseUrl ? {
			localServiceTarget: {
				providerId,
				baseUrl,
				headers
			},
			acquireLocalService: localServiceOptions.acquireLocalService
		} : {},
		...options.dimensions !== void 0 ? { dimensions: normalizeDimensions(options.dimensions) } : {},
		...inputType ? { inputType } : {},
		...queryInputType ? { queryInputType } : {},
		...documentInputType ? { documentInputType } : {}
	};
}
/** Creates an OpenAI-compatible embedding provider and its backing client. */
async function createOpenAICompatibleEmbeddingProvider(options) {
	const client = await createOpenAICompatibleEmbeddingClient(options);
	const embedBatch = async (inputs, callOptions) => {
		if (inputs.length === 0) return [];
		return await postEmbeddingRequest({
			client,
			input: inputs.map(embeddingInputToText),
			signal: callOptions?.signal,
			inputType: callOptions?.inputType
		});
	};
	return {
		provider: {
			id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
			model: client.model,
			...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
			embed: async (input, callOptions) => {
				const [embedding] = await embedBatch([input], callOptions);
				if (!embedding) throw malformedEmbeddingResponse();
				return embedding;
			},
			embedBatch
		},
		client
	};
}
//#endregion
//#region src/plugins/core-embedding-providers.ts
const CORE_EMBEDDING_PROVIDERS = [{
	adapter: {
		id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
		transport: "remote",
		create: async (options) => {
			const { provider, client } = await createOpenAICompatibleEmbeddingProvider(options);
			const cacheHeaders = sanitizeCacheHeaders(client.headers);
			return {
				provider,
				runtime: {
					id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
					inlineBatchTimeoutMs: 10 * 6e4,
					cacheKeyData: {
						provider: client.providerId,
						baseUrl: client.baseUrl,
						model: client.model,
						...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
						...client.inputType ? { inputType: client.inputType } : {},
						...client.queryInputType ? { queryInputType: client.queryInputType } : {},
						...client.documentInputType ? { documentInputType: client.documentInputType } : {},
						...cacheHeaders ? { headers: cacheHeaders } : {}
					}
				}
			};
		}
	},
	ownerPluginId: "core"
}];
function getCoreEmbeddingProvider(id) {
	return CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id);
}
//#endregion
//#region src/plugins/embedding-providers.ts
function getEmbeddingProviders() {
	return requireActivePluginRegistry().embeddingProviders.map((entry) => ({
		adapter: entry.provider,
		ownerPluginId: entry.pluginId || void 0
	}));
}
/** Looks up the registered embedding provider entry, including owner metadata. */
function getRegisteredEmbeddingProvider(id) {
	return getCoreEmbeddingProvider(id) ?? getEmbeddingProviders().find((entry) => entry.adapter.id === id);
}
/** Lists registered embedding providers with core defaults merged first. */
function listRegisteredEmbeddingProviders() {
	const merged = new Map(CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]));
	for (const entry of getEmbeddingProviders()) if (!merged.has(entry.adapter.id)) merged.set(entry.adapter.id, entry);
	return Array.from(merged.values());
}
//#endregion
//#region src/plugins/provider-config-owner.ts
/** Core built-in model API ids that do not imply plugin ownership of a provider config. */
const CORE_BUILT_IN_MODEL_APIS = /* @__PURE__ */ new Set([
	"anthropic-messages",
	"azure-openai-responses",
	"google-generative-ai",
	"google-vertex",
	"mistral-conversations",
	"openai-chatgpt-responses",
	"openai-completions",
	"openai-responses"
]);
/** Returns the plugin API id that owns a provider config when it is not core built-in. */
function resolveProviderConfigApiOwnerHint(params) {
	const providers = params.config?.models?.providers;
	if (!providers) return;
	const normalizedProvider = normalizeProviderId(params.provider);
	if (!normalizedProvider) return;
	const providerConfig = providers[params.provider] ?? Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProvider)?.[1];
	const api = typeof providerConfig?.api === "string" ? normalizeProviderId(providerConfig.api) : "";
	if (!api || api === normalizedProvider || CORE_BUILT_IN_MODEL_APIS.has(api)) return;
	return api;
}
//#endregion
//#region src/plugins/gateway-startup-plugin-providers.ts
function manifestOwnsConfiguredSpeechProvider(params) {
	if (params.configuredSpeechProviderIds.size === 0) return false;
	return (params.manifest?.contracts?.speechProviders ?? []).some((providerId) => {
		const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
		return normalized ? params.configuredSpeechProviderIds.has(normalized) : false;
	});
}
function collectConfiguredWebSearchProviderIds(config) {
	const search = config.tools?.web?.search;
	if (search?.enabled === false || typeof search?.provider !== "string") return /* @__PURE__ */ new Set();
	const providerId = normalizeOptionalLowercaseString(search.provider);
	return providerId ? /* @__PURE__ */ new Set([providerId]) : /* @__PURE__ */ new Set();
}
function manifestOwnsConfiguredWebSearchProvider(params) {
	if (params.configuredWebSearchProviderIds.size === 0) return false;
	return (params.manifest?.contracts?.webSearchProviders ?? []).some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? params.configuredWebSearchProviderIds.has(normalized) : false;
	});
}
function listModelProviderRefParts(value) {
	return listModelRefsFromConfigValue(value).map(parseModelCatalogRef).filter((entry) => entry !== null).map(({ provider, modelId }) => ({
		providerId: provider,
		modelId
	}));
}
function collectModelProviderIds(value) {
	return new Set(listModelRefsFromConfigValue(value).map((ref) => {
		const slashIndex = ref.indexOf("/");
		return slashIndex > 0 ? normalizeProviderId(ref.slice(0, slashIndex)) : "";
	}).filter((providerId) => Boolean(providerId)));
}
function buildManifestModelProviderLookup(manifestRegistry, config) {
	return {
		modelApis: new Map(planEffectiveModelCatalogRows({
			registry: manifestRegistry,
			config
		}).rows.flatMap((row) => row.api ? [[row.mergeKey, row.api]] : [])),
		providerIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.map(normalizeProviderId)))
	};
}
function collectConfiguredAgentModelProviderIds(config, manifestRegistry) {
	const modelIdsByProvider = /* @__PURE__ */ new Map();
	const manifestModelProviders = buildManifestModelProviderLookup(manifestRegistry, config);
	const addModelProviderRefs = (value) => {
		for (const { providerId, modelId } of listModelProviderRefParts(value)) {
			const modelIds = modelIdsByProvider.get(providerId) ?? /* @__PURE__ */ new Set();
			modelIds.add(modelId);
			modelIdsByProvider.set(providerId, modelIds);
		}
	};
	const addModelMapProviderIds = (models) => {
		if (!isRecord(models)) return;
		for (const modelRef of Object.keys(models)) addModelProviderRefs(modelRef);
	};
	const defaults = config.agents?.defaults;
	addModelProviderRefs(defaults?.model);
	addModelProviderRefs(defaults?.utilityModel);
	addModelMapProviderIds(defaults?.models);
	for (const agent of listAgentEntries(config)) {
		if (!isRecord(agent)) continue;
		addModelProviderRefs(agent.model);
		addModelProviderRefs(agent.utilityModel);
		addModelMapProviderIds(agent.models);
	}
	return new Set([...modelIdsByProvider.entries()].filter(([providerId, modelIds]) => {
		return [...modelIds].some((modelId) => configuredModelProviderNeedsRuntimePlugin({
			config,
			manifestModelProviders,
			providerId,
			modelId
		}));
	}).map(([providerId]) => providerId));
}
function configuredModelProviderNeedsRuntimePlugin(params) {
	const providerConfig = params.config.models?.providers?.[params.providerId];
	const modelApi = (providerConfig?.models?.find((model) => model.id === params.modelId))?.api ?? providerConfig?.api ?? params.manifestModelProviders.modelApis.get(buildModelCatalogMergeKey(params.providerId, params.modelId));
	if (typeof modelApi === "string") return !CORE_BUILT_IN_MODEL_APIS.has(modelApi);
	return params.manifestModelProviders.providerIds.has(params.providerId);
}
function manifestOwnsConfiguredModelProvider(params) {
	if (params.configuredModelProviderIds.size === 0) return false;
	return (params.manifest?.providers ?? []).some((providerId) => {
		return params.configuredModelProviderIds.has(normalizeProviderId(providerId));
	});
}
function collectConfiguredGenerationProviderIds(config) {
	const defaults = config.agents?.defaults;
	return {
		imageGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.image),
		videoGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.video),
		musicGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.music)
	};
}
function collectConfiguredVoiceProviderIds(config) {
	const providerIds = collectModelProviderIds(config.agents?.defaults?.voiceModel);
	return {
		speechProviders: providerIds,
		realtimeTranscriptionProviders: providerIds,
		realtimeVoiceProviders: providerIds
	};
}
const MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS = /* @__PURE__ */ new Set(["auto", "none"]);
function normalizeMemoryEmbeddingProviderIdValue(value) {
	if (typeof value !== "string") return;
	return normalizeOptionalLowercaseString(value) || void 0;
}
function normalizeExplicitMemoryEmbeddingProviderId(value) {
	const normalized = normalizeMemoryEmbeddingProviderIdValue(value);
	return normalized && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(normalized) ? normalized : void 0;
}
function readMemorySearchEnabled(memorySearch) {
	const enabled = memorySearch?.enabled;
	return typeof enabled === "boolean" ? enabled : void 0;
}
function isMemorySlotExplicitlyDisabled(config) {
	return normalizeOptionalLowercaseString(config.plugins?.slots?.memory) === "none";
}
/**
* Resolve a configured memory embedding provider id to the adapter id(s) a
* plugin manifest contract or runtime registry can own. Mirrors runtime
* `getConfiguredMemoryEmbeddingProvider`: the raw id maps to a direct adapter,
* and a custom `models.providers.<id>` entry additionally maps to its `api`
* owner adapter (`provider: "ollama-5080"` with `api: "ollama"` -> "ollama").
* Both candidates are returned so matching covers the direct adapter and the
* API owner without the runtime adapter registry.
*/
function resolveMemoryEmbeddingProviderOwnerIds(providerId, config) {
	const ownerIds = [providerId];
	const genericOwnerId = normalizeOptionalLowercaseString(resolveConfiguredGenericEmbeddingProviderId(providerId, config));
	if (genericOwnerId && genericOwnerId !== providerId) ownerIds.push(genericOwnerId);
	const ownerApi = normalizeOptionalLowercaseString(findNormalizedProviderValue(config.models?.providers, providerId)?.api);
	if (ownerApi && ownerApi !== providerId) ownerIds.push(ownerApi);
	return ownerIds;
}
function resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override) {
	if (!(readMemorySearchEnabled(override) ?? readMemorySearchEnabled(defaults) ?? true)) return [];
	const rawProvider = normalizeMemoryEmbeddingProviderIdValue(override?.provider ?? defaults?.provider);
	const effectiveProvider = rawProvider === "auto" || !rawProvider ? "openai" : rawProvider;
	if (effectiveProvider === "none") return [];
	const entries = [];
	const provider = rawProvider && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(rawProvider) ? rawProvider : void 0;
	if (provider) entries.push({
		configuredId: provider,
		source: "provider"
	});
	const fallback = normalizeExplicitMemoryEmbeddingProviderId(override?.fallback ?? defaults?.fallback ?? "none");
	if (fallback && fallback !== effectiveProvider) entries.push({
		configuredId: fallback,
		source: "fallback"
	});
	return entries;
}
/**
* Collect explicit memory embedding provider owners required by startup. The
* resolver mirrors runtime memory-search inheritance for enablement, primary
* provider, and fallback provider, then maps custom `models.providers` ids to
* their API-owner adapter ids.
*/
function collectConfiguredMemoryEmbeddingStartupProviderOwners(config) {
	if (isMemorySlotExplicitlyDisabled(config)) return [];
	const byConfiguredIdAndSource = /* @__PURE__ */ new Map();
	const defaultsBlock = config.memory?.search;
	const defaults = isRecord(defaultsBlock) ? defaultsBlock : void 0;
	const addEffectiveProviders = (override) => {
		for (const { configuredId, source } of resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override)) {
			const key = `${source}\0${configuredId}`;
			if (byConfiguredIdAndSource.has(key)) continue;
			byConfiguredIdAndSource.set(key, {
				configuredId,
				ownerIds: new Set(resolveMemoryEmbeddingProviderOwnerIds(configuredId, config)),
				source
			});
		}
	};
	addEffectiveProviders(void 0);
	const agentEntries = listAgentEntries(config);
	if (agentEntries.length === 0) return [...byConfiguredIdAndSource.values()];
	for (const agent of agentEntries) {
		const memory = isRecord(agent.memory) ? agent.memory : void 0;
		addEffectiveProviders(isRecord(memory?.search) ? memory.search : void 0);
	}
	return [...byConfiguredIdAndSource.values()];
}
/**
* Collect configured memory embedding provider ids that map to a plugin-owned
* memory embedding provider contract, including the resolved `api` owner for
* custom `models.providers` ids so the owning plugin loads at startup.
*/
function collectConfiguredMemoryEmbeddingProviderIds(config) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const provider of collectConfiguredMemoryEmbeddingStartupProviderOwners(config)) for (const ownerId of provider.ownerIds) providerIds.add(ownerId);
	return providerIds;
}
/**
* Report configured memory embedding providers that no loaded plugin can serve.
* A provider is unregistered only when none of its resolved adapter ids (the
* configured id and its `models.providers.<id>.api` owner) was registered, so
* custom providers warn when their API-owner plugin is missing but stay quiet
* once that plugin loads.
*/
function collectUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const configured = collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config);
	if (configured.length === 0) return [];
	const registered = new Set([...params.registeredProviderIds].map((id) => normalizeOptionalLowercaseString(id)).filter((id) => Boolean(id)));
	return configured.filter((provider) => ![...provider.ownerIds].some((ownerId) => registered.has(ownerId))).map((provider) => ({
		configuredId: provider.configuredId,
		source: provider.source
	})).toSorted((left, right) => left.configuredId.localeCompare(right.configuredId) || left.source.localeCompare(right.source));
}
function collectRegisteredEmbeddingProviderIds(registry) {
	return new Set([
		...registry.memoryEmbeddingProviders ?? [],
		...registry.embeddingProviders ?? [],
		...listRegisteredEmbeddingProviders().map((entry) => ({ provider: entry.adapter }))
	].map((entry) => entry.provider.id));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-contracts.ts
function sortUniquePluginIds(values) {
	return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-config.ts
function readStartupBundledDiscoveryMode(config, env) {
	const stateMode = readBundledDiscoveryMode({ env });
	if (stateMode) return stateMode;
	const legacyMode = config.plugins?.bundledDiscovery;
	if (legacyMode === "compat" || legacyMode === "allowlist") return legacyMode;
}
function normalizePluginsConfigForInstalledIndex(config, lookup) {
	return normalizePluginsConfigWithResolverCore(config, lookup.normalizePluginId);
}
function isConfigActivationValueEnabled(value) {
	if (value === false) return false;
	if (isRecord(value) && value.enabled === false) return false;
	return true;
}
function listPotentialEnabledChannelIds(config, env, options = {}) {
	const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(config));
	const enabledSignals = [...listPotentialConfiguredChannelIds(config, env, {
		includePersistedAuthState: false,
		ambientEnvTriggers: options.ambientEnvTriggers
	}), ...listExplicitConfiguredChannelIdsForConfig(config)].map((id) => normalizeOptionalLowercaseString(id) ?? "").filter((id) => id && !disabled.has(id));
	if (options.includePersistedAuthState !== true) return sortUniquePluginIds(enabledSignals);
	const persistedSignals = listPotentialConfiguredChannelPresenceSignals(config, env, {
		includePersistedAuthState: true,
		ambientEnvTriggers: options.ambientEnvTriggers
	}).filter((signal) => signal.source === "persisted-auth").map((signal) => normalizeOptionalLowercaseString(signal.channelId) ?? "").filter(Boolean);
	return sortUniquePluginIds([...enabledSignals, ...persistedSignals]);
}
function isGatewayStartupMemoryPlugin(plugin) {
	return plugin.startup.memory;
}
function resolveGatewayStartupDreamingEngineId(config) {
	if (!resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(config),
		cfg: config
	}).enabled) return;
	if (!resolveGatewayStartupDreamingSelectedPluginId(config)) return;
	return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}
function resolveGatewayStartupDreamingSelectedPluginId(config) {
	const selectedPluginId = normalizeOptionalLowercaseString(resolveMemoryDreamingPluginId(config));
	return selectedPluginId && selectedPluginId !== "memory-core" ? selectedPluginId : void 0;
}
function blocksPluginStartup(params) {
	return params.pluginsConfig.deny.includes(params.pluginId) || params.activationSourcePlugins.deny.includes(params.pluginId) || params.pluginsConfig.entries[params.pluginId]?.enabled === false || params.activationSourcePlugins.entries[params.pluginId]?.enabled === false;
}
function resolveAuthorizedGatewayStartupDreamingPluginIds(params) {
	const engineId = resolveGatewayStartupDreamingEngineId(params.config);
	const dreamingSelectedPluginId = resolveGatewayStartupDreamingSelectedPluginId(params.config);
	if (!engineId || !params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return /* @__PURE__ */ new Set();
	if (!params.selectedMemoryPluginId || params.selectedMemoryPluginId !== dreamingSelectedPluginId || params.selectedMemoryPluginId === engineId || blocksPluginStartup({
		pluginId: engineId,
		pluginsConfig: params.pluginsConfig,
		activationSourcePlugins: params.activationSourcePlugins
	})) return /* @__PURE__ */ new Set();
	const selectedPlugin = params.index.plugins.find((plugin) => plugin.pluginId === params.selectedMemoryPluginId);
	const sidecarPlugin = params.index.plugins.find((plugin) => plugin.pluginId === engineId);
	if (!selectedPlugin?.startup.memory || !sidecarPlugin?.startup.memory) return /* @__PURE__ */ new Set();
	return resolveEffectivePluginActivationState({
		id: selectedPlugin.pluginId,
		origin: selectedPlugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedPlugin, params.platform),
		activationSource: params.activationSource
	}).enabled ? /* @__PURE__ */ new Set([engineId]) : /* @__PURE__ */ new Set();
}
function resolveMemorySlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.memory?.trim();
	if (configuredSlot?.toLowerCase() === "none") return;
	if (!configuredSlot) {
		const defaultSlot = activationSourcePlugins.slots.memory;
		if (typeof defaultSlot !== "string") return;
		if (activationSourcePlugins.allow.length > 0 && !activationSourcePlugins.allow.includes(defaultSlot)) return;
		return defaultSlot;
	}
	return normalizePluginId(configuredSlot);
}
function resolveContextEngineSlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.contextEngine?.trim();
	if (!configuredSlot) return;
	return resolveSelectedContextEnginePluginIdFromConfig(activationSourcePlugins, normalizePluginId(configuredSlot));
}
function shouldConsiderForGatewayStartup(params) {
	if (params.manifest?.activation?.onStartup === true) return true;
	if (params.contextEngineSlotStartupPluginId === params.plugin.pluginId) return true;
	if (!isGatewayStartupMemoryPlugin(params.plugin)) return false;
	if (params.startupDreamingPluginIds.has(params.plugin.pluginId)) return true;
	return params.memorySlotStartupPluginId === params.plugin.pluginId;
}
function hasConfiguredStartupChannel(params) {
	return listManifestChannelIds(params.manifestLookup, params.plugin.pluginId).some((channelId) => params.configuredChannelIds.has(channelId));
}
function createManifestRegistryLookup(manifestRegistry) {
	return new Map(manifestRegistry.plugins.map((plugin) => [plugin.id, plugin]));
}
function listManifestChannelIds(manifestLookup, pluginId) {
	return manifestLookup.get(pluginId)?.channels ?? [];
}
function findManifestPlugin(manifestLookup, pluginId) {
	return manifestLookup.get(pluginId);
}
function hasConfiguredActivationPath(params) {
	return hasConfiguredActivationPathPatterns({
		paths: params.manifest?.activation?.onConfigPaths,
		config: params.config
	});
}
function hasConfiguredActivationPathPatterns(params) {
	const paths = params.paths;
	if (!paths?.length) return false;
	return paths.some((pathPattern) => collectPluginConfigContractMatches({
		root: params.config,
		pathPattern
	}).some((match) => isConfigActivationValueEnabled(match.value)));
}
function addConfiguredActivationPathPluginIds(target, params) {
	for (const plugin of params.index.plugins) {
		if (plugin.origin !== "bundled") continue;
		if (hasConfiguredActivationPathPatterns({
			paths: plugin.startup.configPaths,
			config: params.activationSourceConfig
		})) target.add(plugin.pluginId);
	}
}
function addPluginConfigEntryIds(target, plugins) {
	for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled !== false) target.add(pluginId);
}
function addConfiguredSlotPluginIds(target, params) {
	const memorySlot = resolveMemorySlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (memorySlot) target.add(memorySlot);
	const contextEngineSlot = resolveContextEngineSlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (contextEngineSlot) target.add(contextEngineSlot);
}
function collectConfiguredStartupChannelIds(params) {
	return sortUniquePluginIds([...listPotentialEnabledChannelIds(params.config, params.env, {
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: params.includePersistedAuthState
	}), ...listPotentialEnabledChannelIds(params.activationSourceConfig, params.env, {
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: params.includePersistedAuthState
	})]);
}
function collectValidationHeartbeatTargetChannelIds(config) {
	const channelIds = [];
	const pushTarget = (target) => {
		if (typeof target !== "string") return;
		const normalized = normalizeOptionalLowercaseString(target);
		if (!normalized || normalized === "owner" || normalized === "last" || normalized === "none") return;
		channelIds.push(normalized);
	};
	pushTarget(config.agents?.defaults?.heartbeat?.target);
	for (const agent of listAgentEntries(config)) pushTarget(agent?.heartbeat?.target);
	return sortUniquePluginIds(channelIds);
}
function collectValidationChannelConfigIds(config) {
	const channels = isRecord(config.channels) ? config.channels : null;
	if (!channels) return [];
	return Object.keys(channels).filter((channelId) => channelId !== "defaults" && channelId !== "modelByChannel").map((channelId) => normalizeOptionalLowercaseString(channelId) ?? "").filter(Boolean).toSorted((left, right) => left.localeCompare(right));
}
function collectConfigValidationChannelIds(params) {
	return sortUniquePluginIds([
		...collectValidationChannelConfigIds(params.config),
		...collectConfiguredStartupChannelIds({
			config: params.config,
			activationSourceConfig: params.config,
			env: params.env,
			includePersistedAuthState: false
		}),
		...collectValidationHeartbeatTargetChannelIds(params.config)
	]);
}
function collectConfiguredProviderIds(config) {
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(config);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(config);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(config);
	return sortUniquePluginIds([
		...collectConfiguredSpeechProviderIds(config),
		...configuredWebSearchProviderIds,
		...configuredGenerationProviderIds.imageGenerationProviders,
		...configuredGenerationProviderIds.videoGenerationProviders,
		...configuredGenerationProviderIds.musicGenerationProviders,
		...configuredVoiceProviderIds.speechProviders,
		...configuredVoiceProviderIds.realtimeTranscriptionProviders,
		...configuredVoiceProviderIds.realtimeVoiceProviders,
		...collectConfiguredMemoryEmbeddingProviderIds(config)
	]);
}
function collectValidationConfiguredProviderIds(config) {
	const providerIds = [];
	const pushProviderId = (value) => {
		if (typeof value !== "string") return;
		const normalized = normalizeOptionalLowercaseString(value);
		if (normalized) providerIds.push(normalized);
	};
	const profiles = config.auth?.profiles;
	if (profiles && typeof profiles === "object") {
		for (const profile of Object.values(profiles)) if (isRecord(profile)) pushProviderId(profile.provider);
	}
	const providers = config.models?.providers;
	if (providers && typeof providers === "object") for (const providerId of Object.keys(providers)) pushProviderId(providerId);
	for (const ref of collectConfiguredModelRefs(config)) {
		const slashIndex = ref.value.indexOf("/");
		if (slashIndex > 0) pushProviderId(ref.value.slice(0, slashIndex));
	}
	pushProviderId(config.tools?.web?.search?.provider);
	pushProviderId(config.tools?.web?.fetch?.provider);
	return sortUniquePluginIds(providerIds);
}
function collectValidationConfiguredShorthandModelIds(config) {
	return sortUniquePluginIds(collectConfiguredModelRefs(config).map((ref) => ref.value).filter((ref) => !ref.includes("/")).map((ref) => splitTrailingAuthProfile(ref).model.trim()).filter(Boolean));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-activation.ts
function addRequiredAgentHarnessPluginIds(target, params) {
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(params.activationSourceConfig, { includeImplicitRuntimePreferences: false }));
	if (requiredAgentHarnessRuntimes.size === 0) return;
	for (const plugin of params.index.plugins) if (plugin.startup.agentHarnesses.some((runtime) => requiredAgentHarnessRuntimes.has(runtime)) && passesPluginStartupPolicy({
		...params,
		plugin
	}, "harness")) target.add(plugin.pluginId);
}
function resolveStartupActivationState(params, autoEnabledReason) {
	return resolveEffectivePluginActivationState({
		id: params.plugin.pluginId,
		origin: params.plugin.origin,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(params.plugin, params.platform),
		activationSource: params.activationSource,
		...autoEnabledReason ? { autoEnabledReason } : {}
	});
}
function hasExplicitHookPolicyConfig(entry) {
	return entry?.hooks?.allowConversationAccess === true || entry?.hooks?.allowPromptInjection === true || entry?.hooks?.timeoutMs !== void 0 || entry?.hooks?.timeouts !== void 0 && Object.keys(entry.hooks.timeouts).length > 0;
}
function passesPluginStartupPolicy(params, policy) {
	const { activationSource, plugin, pluginsConfig } = params;
	if (policy !== "speech" && (!pluginsConfig.enabled || !activationSource.plugins.enabled) || blocksPluginStartup({
		pluginId: plugin.pluginId,
		pluginsConfig,
		activationSourcePlugins: activationSource.plugins
	})) return false;
	if (policy === "harness" && [pluginsConfig, activationSource.plugins].some((config) => config.allow.length > 0 && !config.allow.includes(plugin.pluginId))) return false;
	const bundled = plugin.origin === "bundled";
	if (bundled && (policy === "harness" || policy === "speech" || policy === "root")) return true;
	if (policy === "root" && activationSource.plugins.allow.length > 0 && !activationSource.plugins.allow.includes(plugin.pluginId)) return false;
	const activationState = resolveStartupActivationState(params, policy === "worker" ? "cloud worker provider required" : void 0);
	if (!activationState.enabled) return false;
	if (policy === "harness" || policy === "implicit-external") return true;
	if (policy === "hook") return activationState.explicitlyEnabled || hasExplicitHookPolicyConfig(activationSource.plugins.entries[plugin.pluginId]);
	return bundled || activationState.explicitlyEnabled;
}
function manifestOwnsConfiguredContract(manifest, contractKey, configuredProviderIds) {
	return configuredProviderIds.size > 0 && (manifest?.contracts?.[contractKey] ?? []).some((providerId) => {
		const normalized = normalizeOptionalLowercaseString(providerId);
		return normalized ? configuredProviderIds.has(normalized) : false;
	});
}
function manifestOwnsConfiguredContractGroup(manifest, configuredProviderIds) {
	return Object.entries(configuredProviderIds).some(([contractKey, providerIds]) => manifestOwnsConfiguredContract(manifest, contractKey, providerIds));
}
const GATEWAY_STARTUP_ACTIVATION_POLICIES = [
	{
		policy: "harness",
		matches: ({ plugin, requiredAgentHarnessRuntimes }) => plugin.startup.agentHarnesses.some((runtime) => requiredAgentHarnessRuntimes.has(runtime))
	},
	{
		policy: "root",
		matches: ({ manifest, activationSource, config }) => hasConfiguredActivationPath({
			manifest,
			config: activationSource.rootConfig ?? config
		})
	},
	{
		policy: "worker",
		matches: ({ manifest, configuredWorkerProviderIds }) => manifestOwnsWorkerProvider(manifest, configuredWorkerProviderIds)
	},
	{
		policy: "speech",
		matches: ({ manifest, configuredSpeechProviderIds }) => manifestOwnsConfiguredSpeechProvider({
			manifest,
			configuredSpeechProviderIds
		})
	},
	{
		policy: "implicit-external",
		matches: ({ manifest, configuredWebSearchProviderIds }) => manifestOwnsConfiguredWebSearchProvider({
			manifest,
			configuredWebSearchProviderIds
		})
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredModelProviderIds }) => manifestOwnsConfiguredModelProvider({
			manifest,
			configuredModelProviderIds
		})
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredGenerationProviderIds }) => manifestOwnsConfiguredContractGroup(manifest, configuredGenerationProviderIds)
	},
	{
		policy: "provider",
		matches: ({ manifest, configuredVoiceProviderIds }) => manifestOwnsConfiguredContractGroup(manifest, configuredVoiceProviderIds)
	},
	{
		policy: "implicit-external",
		matches: ({ manifest, configuredMemoryEmbeddingProviderIds }) => manifestOwnsConfiguredContract(manifest, "memoryEmbeddingProviders", configuredMemoryEmbeddingProviderIds) || manifestOwnsConfiguredContract(manifest, "embeddingProviders", configuredMemoryEmbeddingProviderIds)
	},
	{
		policy: "hook",
		matches: ({ activationSource, manifest, plugin }) => manifest?.activation?.onCapabilities?.includes("hook") === true || hasExplicitHookPolicyConfig(activationSource.plugins.entries[plugin.pluginId])
	},
	{
		policy: "tool",
		matches: ({ manifest }) => (manifest?.contracts?.tools?.length ?? 0) > 0
	},
	{
		policy: "provider",
		matches: ({ manifest }) => (manifest?.contracts?.trustedToolPolicies?.length ?? 0) > 0
	}
];
/** Evaluates manifest-owned startup surfaces in their original precedence order. */
function canStartGatewayStartupPlugin(params) {
	return GATEWAY_STARTUP_ACTIVATION_POLICIES.some(({ matches, policy }) => matches(params) && passesPluginStartupPolicy(params, policy));
}
function canStartConfiguredChannelPlugin(params) {
	const { activationSource, config, manifestLookup, plugin, pluginsConfig } = params;
	if (!pluginsConfig.enabled || pluginsConfig.deny.includes(plugin.pluginId) || pluginsConfig.entries[plugin.pluginId]?.enabled === false) return false;
	const explicitBundledChannelConfig = plugin.origin === "bundled" && listManifestChannelIds(manifestLookup, plugin.pluginId).some((channelId) => hasExplicitChannelConfig({
		config: activationSource.rootConfig ?? config,
		channelId
	}));
	if (pluginsConfig.allow.length > 0 && !pluginsConfig.allow.includes(plugin.pluginId) && !explicitBundledChannelConfig) return false;
	if (plugin.origin === "bundled") return true;
	const activationState = resolveStartupActivationState(params);
	return activationState.enabled && activationState.explicitlyEnabled;
}
//#endregion
//#region src/plugins/installed-plugin-index-scope-lookup.ts
const PROVIDER_CONTRIBUTION_CONTRACTS = [
	"externalAuthProviders",
	"embeddingProviders",
	"memoryEmbeddingProviders",
	"speechProviders",
	"realtimeTranscriptionProviders",
	"realtimeVoiceProviders",
	"mediaUnderstandingProviders",
	"meetingNotesSourceProviders",
	"imageGenerationProviders",
	"videoGenerationProviders",
	"musicGenerationProviders",
	"webFetchProviders",
	"webSearchProviders",
	"workerProviders",
	"usageProviders"
];
function appendOwner(owners, rawKey, pluginId) {
	const key = normalizeOptionalLowercaseString(rawKey);
	if (!key) return;
	const existing = owners.get(key);
	if (existing) {
		existing.push(pluginId);
		return;
	}
	owners.set(key, [pluginId]);
}
function freezeOwnerMap(owners) {
	return new Map([...owners.entries()].map(([key, pluginIds]) => [key, Object.freeze([...new Set(pluginIds)])]));
}
function addOwners(target, owners, ids) {
	for (const id of ids) {
		const normalized = normalizeOptionalLowercaseString(id);
		if (!normalized) continue;
		for (const pluginId of owners.get(normalized) ?? []) target.add(pluginId);
	}
}
function hasOwners(owners, ids) {
	return ids.every((id) => {
		const normalized = normalizeOptionalLowercaseString(id);
		return Boolean(normalized && owners.has(normalized));
	});
}
function listContributionValues(plugin, key) {
	const value = plugin.contributions?.[key];
	return Array.isArray(value) ? value : [];
}
function listContractContributionValues(plugin, key) {
	const value = plugin.contributions?.contracts?.[key];
	return Array.isArray(value) ? value : [];
}
function compileModelSupportPatterns(patterns) {
	const compiled = [];
	for (const pattern of patterns) {
		const regex = compileSafeRegex(pattern, "u");
		if (regex) compiled.push(regex);
	}
	return compiled;
}
function modelSupportOwnerMatches(owner, modelId) {
	const trimmed = modelId.trim();
	if (!trimmed) return false;
	if (owner.prefixes.some((prefix) => trimmed.startsWith(prefix))) return true;
	return owner.patterns.some((pattern) => pattern.test(trimmed));
}
function buildLookupMaps(index) {
	const channelContributionOwners = /* @__PURE__ */ new Map();
	const directChannelOwners = /* @__PURE__ */ new Map();
	const directProviderOwners = /* @__PURE__ */ new Map();
	const pluginIdsByLowercase = /* @__PURE__ */ new Map();
	const providerContributionOwners = /* @__PURE__ */ new Map();
	const modelSupportOwners = [];
	for (const plugin of index.plugins) {
		const normalizedPluginId = normalizeOptionalLowercaseString(plugin.pluginId);
		if (normalizedPluginId) {
			pluginIdsByLowercase.set(normalizedPluginId, plugin.pluginId);
			appendOwner(directChannelOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(directProviderOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(channelContributionOwners, plugin.pluginId, plugin.pluginId);
			appendOwner(providerContributionOwners, plugin.pluginId, plugin.pluginId);
		}
		appendOwner(directChannelOwners, plugin.packageChannel?.id, plugin.pluginId);
		appendOwner(channelContributionOwners, plugin.packageChannel?.id, plugin.pluginId);
		for (const channelId of listContributionValues(plugin, "channels")) appendOwner(channelContributionOwners, channelId, plugin.pluginId);
		for (const channelId of listContributionValues(plugin, "channelConfigs")) appendOwner(channelContributionOwners, channelId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "providers")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "modelCatalogProviders")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const providerId of listContributionValues(plugin, "autoEnableProviderIds")) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		for (const contract of PROVIDER_CONTRIBUTION_CONTRACTS) for (const providerId of listContractContributionValues(plugin, contract)) appendOwner(providerContributionOwners, providerId, plugin.pluginId);
		modelSupportOwners.push({
			pluginId: plugin.pluginId,
			prefixes: listContributionValues(plugin, "modelSupportPrefixes"),
			patterns: compileModelSupportPatterns(listContributionValues(plugin, "modelSupportPatterns"))
		});
	}
	return {
		channelContributionOwners: freezeOwnerMap(channelContributionOwners),
		directChannelOwners: freezeOwnerMap(directChannelOwners),
		directProviderOwners: freezeOwnerMap(directProviderOwners),
		installedPluginIds: new Set(pluginIdsByLowercase.keys()),
		modelSupportOwners,
		pluginIdsByLowercase,
		providerContributionOwners: freezeOwnerMap(providerContributionOwners)
	};
}
function createInstalledPluginIndexScopeLookup(index) {
	const maps = buildLookupMaps(index);
	const normalizeInstalledPluginId = (pluginId) => {
		const normalized = normalizePluginId(pluginId);
		const lowercase = normalizeOptionalLowercaseString(normalized);
		return lowercase ? maps.pluginIdsByLowercase.get(lowercase) ?? normalized : normalized;
	};
	return {
		addChannelContributionOwners: (target, ids) => addOwners(target, maps.channelContributionOwners, ids),
		addDirectChannelOwners: (target, ids) => addOwners(target, maps.directChannelOwners, ids),
		addDirectProviderOwners: (target, ids) => addOwners(target, maps.directProviderOwners, ids),
		addProviderContributionOwners: (target, ids) => addOwners(target, maps.providerContributionOwners, ids),
		addShorthandModelOwners: (target, modelIds) => {
			for (const modelId of modelIds) for (const owner of maps.modelSupportOwners) if (modelSupportOwnerMatches(owner, modelId)) target.add(owner.pluginId);
		},
		canResolveDirectProviderIds: (providerIds, scopePluginIds) => {
			const normalizedScope = new Set([...scopePluginIds].map((pluginId) => normalizeOptionalLowercaseString(pluginId)).filter((pluginId) => Boolean(pluginId)));
			return providerIds.every((providerId) => {
				const normalized = normalizeOptionalLowercaseString(providerId);
				return Boolean(normalized && (maps.directProviderOwners.has(normalized) || normalizedScope.has(normalized)));
			});
		},
		hasChannelContributionOwners: (ids) => hasOwners(maps.channelContributionOwners, ids),
		hasCompleteConfigPathActivationMetadata: () => index.plugins.every((plugin) => !plugin.compat.includes("activation-config-path-hint") || plugin.startup.configPaths !== void 0),
		hasDirectChannelOwners: (ids) => hasOwners(maps.directChannelOwners, ids),
		hasInstalledPluginIds: (ids) => [...ids].every((pluginId) => {
			const normalized = normalizeOptionalLowercaseString(pluginId);
			return Boolean(normalized && maps.installedPluginIds.has(normalized));
		}),
		hasProviderContributionOwners: (ids) => hasOwners(maps.providerContributionOwners, ids),
		hasShorthandModelOwners: (modelIds) => modelIds.every((modelId) => maps.modelSupportOwners.some((owner) => modelSupportOwnerMatches(owner, modelId))),
		normalizePluginId: normalizeInstalledPluginId
	};
}
//#endregion
//#region src/plugins/gateway-startup-plugin-metadata.ts
function resolveGatewayStartupMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
	const activationSourcePlugins = normalizePluginsConfigForInstalledIndex(activationSourceConfig.plugins, lookup);
	if (!pluginsConfig.enabled || !activationSourcePlugins.enabled) return [];
	if (readStartupBundledDiscoveryMode(params.config, params.env) === "compat" || readStartupBundledDiscoveryMode(activationSourceConfig, params.env) === "compat") return;
	if (pluginsConfig.allow.length === 0 && activationSourcePlugins.allow.length === 0) return;
	const scope = /* @__PURE__ */ new Set([...pluginsConfig.allow, ...activationSourcePlugins.allow]);
	addPluginConfigEntryIds(scope, pluginsConfig);
	addPluginConfigEntryIds(scope, activationSourcePlugins);
	const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId: lookup.normalizePluginId
	});
	addConfiguredSlotPluginIds(scope, {
		activationSourceConfig,
		activationSourcePlugins,
		lookup
	});
	for (const pluginId of resolveAuthorizedGatewayStartupDreamingPluginIds({
		config: params.config,
		pluginsConfig,
		activationSource: {
			plugins: activationSourcePlugins,
			rootConfig: activationSourceConfig
		},
		activationSourcePlugins,
		selectedMemoryPluginId: memorySlotStartupPluginId,
		index: params.index,
		platform: params.platform
	})) scope.add(pluginId);
	if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
	addConfiguredActivationPathPluginIds(scope, {
		activationSourceConfig,
		index: params.index
	});
	const configuredChannelIds = collectConfiguredStartupChannelIds({
		config: params.config,
		activationSourceConfig,
		env: params.env,
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: false
	});
	if (!lookup.hasDirectChannelOwners(configuredChannelIds)) return;
	lookup.addDirectChannelOwners(scope, configuredChannelIds);
	const configuredProviderIds = sortUniquePluginIds([
		...collectConfiguredProviderIds(params.config),
		...collectConfiguredProviderIds(activationSourceConfig),
		...collectValidationConfiguredProviderIds(params.config),
		...collectValidationConfiguredProviderIds(activationSourceConfig)
	]);
	if (!lookup.canResolveDirectProviderIds(configuredProviderIds, scope)) return;
	lookup.addDirectProviderOwners(scope, configuredProviderIds);
	const workerProviderIds = normalizeWorkerProviderIds([
		...collectConfiguredWorkerProviderIds(params.config),
		...collectConfiguredWorkerProviderIds(activationSourceConfig),
		...params.workerProviderIds ?? []
	]);
	if (!lookup.hasProviderContributionOwners(workerProviderIds)) return;
	lookup.addProviderContributionOwners(scope, workerProviderIds);
	const configuredShorthandModelIds = sortUniquePluginIds([...collectValidationConfiguredShorthandModelIds(params.config), ...collectValidationConfiguredShorthandModelIds(activationSourceConfig)]);
	if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
	lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
	addRequiredAgentHarnessPluginIds(scope, {
		activationSourceConfig,
		config: params.config,
		index: params.index,
		pluginsConfig,
		activationSource: {
			plugins: activationSourcePlugins,
			rootConfig: activationSourceConfig
		},
		env: params.env,
		platform: params.platform
	});
	const deniedPluginIds = /* @__PURE__ */ new Set([...pluginsConfig.deny, ...activationSourcePlugins.deny]);
	for (const pluginId of deniedPluginIds) scope.delete(pluginId);
	for (const [pluginId, entry] of Object.entries(pluginsConfig.entries)) if (entry?.enabled === false) scope.delete(pluginId);
	for (const [pluginId, entry] of Object.entries(activationSourcePlugins.entries)) if (entry?.enabled === false) scope.delete(pluginId);
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createGatewayStartupMetadataPluginIdScope(params) {
	const configuredChannelIds = collectConfiguredStartupChannelIds({
		config: params.config,
		activationSourceConfig: params.activationSourceConfig ?? params.config,
		env: params.env,
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: false
	});
	const workerProviderIds = normalizeWorkerProviderIds(params.workerProviderIds ?? []);
	return {
		key: hashJson({
			kind: "gateway-startup",
			config: params.config,
			activationSourceConfig: params.activationSourceConfig ?? null,
			configuredChannelIds,
			workerProviderIds,
			platform: params.platform ?? null,
			ambientEnvTriggers: params.ambientEnvTriggers ?? "allow"
		}),
		resolve: ({ index }) => resolveGatewayStartupMetadataPluginIds({
			config: params.config,
			...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
			env: params.env,
			index,
			...workerProviderIds.length > 0 ? { workerProviderIds } : {},
			...params.platform !== void 0 ? { platform: params.platform } : {},
			...params.ambientEnvTriggers !== void 0 ? { ambientEnvTriggers: params.ambientEnvTriggers } : {}
		})
	};
}
function addValidationPluginConfigReferences(target, params) {
	for (const pluginId of params.pluginsConfig.allow) target.add(pluginId);
	for (const pluginId of params.pluginsConfig.deny) target.add(pluginId);
	for (const pluginId of Object.keys(params.pluginsConfig.entries)) target.add(pluginId);
	const rawSlots = isRecord(params.config.plugins?.slots) ? params.config.plugins.slots : {};
	const memorySlot = Object.hasOwn(rawSlots, "memory") ? params.pluginsConfig.slots.memory : void 0;
	if (typeof memorySlot === "string") target.add(params.normalizePluginId(memorySlot));
	const contextEngineSlot = Object.hasOwn(rawSlots, "contextEngine") ? params.pluginsConfig.slots.contextEngine : void 0;
	if (typeof contextEngineSlot === "string" && contextEngineSlot !== "legacy") target.add(params.normalizePluginId(contextEngineSlot));
}
function resolveConfigValidationMetadataPluginIds(params) {
	const lookup = createInstalledPluginIndexScopeLookup(params.index);
	const pluginsConfig = normalizePluginsConfigForInstalledIndex(params.config.plugins, lookup);
	if (readStartupBundledDiscoveryMode(params.config, params.env) === "compat" || pluginsConfig.loadPaths.length > 0) return;
	const scope = /* @__PURE__ */ new Set();
	addValidationPluginConfigReferences(scope, {
		config: params.config,
		pluginsConfig,
		normalizePluginId: lookup.normalizePluginId
	});
	if (!lookup.hasCompleteConfigPathActivationMetadata()) return;
	addConfiguredActivationPathPluginIds(scope, {
		activationSourceConfig: params.config,
		index: params.index
	});
	const configuredChannelIds = collectConfigValidationChannelIds({
		config: params.config,
		env: params.env
	});
	if (!lookup.hasChannelContributionOwners(configuredChannelIds)) return;
	lookup.addChannelContributionOwners(scope, configuredChannelIds);
	const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
	if (!lookup.hasProviderContributionOwners(configuredProviderIds)) return;
	lookup.addProviderContributionOwners(scope, configuredProviderIds);
	const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
	if (!lookup.hasShorthandModelOwners(configuredShorthandModelIds)) return;
	lookup.addShorthandModelOwners(scope, configuredShorthandModelIds);
	addRequiredAgentHarnessPluginIds(scope, {
		activationSourceConfig: params.config,
		config: params.config,
		index: params.index,
		pluginsConfig,
		activationSource: {
			plugins: pluginsConfig,
			rootConfig: params.config
		},
		env: params.env,
		platform: params.platform
	});
	if (!lookup.hasInstalledPluginIds(scope)) return;
	return sortUniquePluginIds(scope);
}
function createConfigValidationMetadataPluginIdScope(params) {
	const configuredChannelIds = collectConfigValidationChannelIds({
		config: params.config,
		env: params.env
	});
	const configuredProviderIds = collectValidationConfiguredProviderIds(params.config);
	const configuredShorthandModelIds = collectValidationConfiguredShorthandModelIds(params.config);
	return {
		key: hashJson({
			kind: "config-validation",
			config: params.config,
			configuredChannelIds,
			configuredProviderIds,
			configuredShorthandModelIds,
			platform: params.platform ?? null
		}),
		resolve: ({ index }) => resolveConfigValidationMetadataPluginIds({
			config: params.config,
			env: params.env,
			index,
			...params.platform !== void 0 ? { platform: params.platform } : {}
		})
	};
}
function isMetadataSnapshotScopedForGatewayStartup(params) {
	const expectedPluginIds = normalizePluginIdScope(params.pluginIdScope.resolve({ index: params.metadataSnapshot.index }));
	const snapshotPluginIds = normalizePluginIdScope(params.metadataSnapshot.pluginIds);
	if (expectedPluginIds === void 0 || snapshotPluginIds === void 0) return expectedPluginIds === void 0 && snapshotPluginIds === void 0;
	if (expectedPluginIds.length === 0) return snapshotPluginIds.length === 0;
	const snapshotPluginIdSet = new Set(snapshotPluginIds);
	return expectedPluginIds.every((pluginId) => snapshotPluginIdSet.has(pluginId));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-plan.ts
function resolveChannelPluginIdsFromRegistry(params) {
	const { manifestRegistry } = params;
	return manifestRegistry.plugins.filter((plugin) => plugin.channels.length > 0).map((plugin) => plugin.id);
}
function resolveGatewayStartupPluginPlanFromRegistry(params) {
	const channelPluginIds = resolveChannelPluginIdsFromRegistry({ manifestRegistry: params.manifestRegistry });
	const activationSourceConfig = params.activationSourceConfig ?? params.config;
	const configuredChannelIds = new Set(listGatewayActivatedChannelIds({
		config: params.config,
		activationSourceConfig,
		env: params.env,
		ambientEnvTriggers: params.ambientEnvTriggers,
		manifestRecords: params.manifestRegistry.plugins
	}));
	const pluginsConfig = normalizePluginsConfigWithRegistry(params.config.plugins, params.index, { manifestRegistry: params.manifestRegistry });
	const activationSourcePlugins = normalizePluginsConfigWithRegistry(activationSourceConfig.plugins, params.index, { manifestRegistry: params.manifestRegistry });
	const activationSource = {
		plugins: activationSourcePlugins,
		rootConfig: activationSourceConfig
	};
	const manifestLookup = createManifestRegistryLookup(params.manifestRegistry);
	const explicitlyDisabledChannelIds = new Set(listExplicitlyDisabledChannelIdsForConfig(params.config));
	const requiredAgentHarnessRuntimes = new Set(collectConfiguredAgentHarnessRuntimes(activationSourceConfig));
	const configuredSpeechProviderIds = collectConfiguredSpeechProviderIds(activationSourceConfig);
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(activationSourceConfig);
	const configuredModelProviderIds = collectConfiguredAgentModelProviderIds(activationSourceConfig, params.manifestRegistry);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(activationSourceConfig);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(activationSourceConfig);
	const configuredMemoryEmbeddingProviderIds = collectConfiguredMemoryEmbeddingProviderIds(activationSourceConfig);
	const configuredWorkerProviderIds = /* @__PURE__ */ new Set([...collectConfiguredWorkerProviderIds(activationSourceConfig), ...normalizeWorkerProviderIds(params.workerProviderIds ?? [])]);
	const normalizePluginId = createPluginRegistryIdNormalizer(params.index, { manifestRegistry: params.manifestRegistry });
	const memorySlotStartupPluginId = resolveMemorySlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId
	});
	const startupDreamingPluginIds = resolveAuthorizedGatewayStartupDreamingPluginIds({
		config: params.config,
		pluginsConfig,
		activationSource,
		activationSourcePlugins,
		selectedMemoryPluginId: memorySlotStartupPluginId,
		index: params.index,
		platform: params.platform
	});
	const contextEngineSlotStartupPluginId = resolveContextEngineSlotStartupPluginId({
		activationSourceConfig,
		activationSourcePlugins,
		normalizePluginId
	});
	const pluginIds = [];
	for (const plugin of params.index.plugins) {
		const manifest = findManifestPlugin(manifestLookup, plugin.pluginId);
		const hasEnabledManifestChannel = manifest?.channels?.some((channelId) => {
			const normalizedChannelId = normalizeOptionalLowercaseString(channelId);
			return normalizedChannelId ? !explicitlyDisabledChannelIds.has(normalizedChannelId) : false;
		}) ?? false;
		const hasExplicitlyEnabledNonBundledChannel = plugin.origin !== "bundled" && hasEnabledManifestChannel && pluginsConfig.entries[plugin.pluginId]?.enabled === true && !pluginsConfig.deny.includes(plugin.pluginId);
		if (hasConfiguredStartupChannel({
			plugin,
			manifestLookup,
			configuredChannelIds
		}) || hasExplicitlyEnabledNonBundledChannel) {
			if (canStartConfiguredChannelPlugin({
				plugin,
				config: params.config,
				pluginsConfig,
				activationSource,
				manifestLookup,
				platform: params.platform
			})) pluginIds.push(plugin.pluginId);
			continue;
		}
		if (canStartGatewayStartupPlugin({
			plugin,
			manifest,
			config: params.config,
			pluginsConfig,
			activationSource,
			requiredAgentHarnessRuntimes,
			configuredWorkerProviderIds,
			configuredSpeechProviderIds,
			configuredWebSearchProviderIds,
			configuredModelProviderIds,
			configuredGenerationProviderIds,
			configuredVoiceProviderIds,
			configuredMemoryEmbeddingProviderIds,
			platform: params.platform
		})) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		if (!shouldConsiderForGatewayStartup({
			plugin,
			manifest,
			startupDreamingPluginIds,
			memorySlotStartupPluginId,
			contextEngineSlotStartupPluginId
		})) continue;
		if (startupDreamingPluginIds.has(plugin.pluginId)) {
			pluginIds.push(plugin.pluginId);
			continue;
		}
		const startupPolicyOrigin = plugin.origin === "bundled" && plugin.packageBuild?.bundledDist === false ? "workspace" : plugin.origin;
		const activationState = resolveEffectivePluginActivationState({
			id: plugin.pluginId,
			origin: startupPolicyOrigin,
			config: pluginsConfig,
			rootConfig: params.config,
			enabledByDefault: isPluginEnabledByDefaultForPlatform(plugin, params.platform),
			activationSource
		});
		if (!activationState.enabled) continue;
		if (startupPolicyOrigin !== "bundled" ? activationState.explicitlyEnabled : activationState.source === "explicit" || activationState.source === "default") pluginIds.push(plugin.pluginId);
	}
	return {
		channelPluginIds,
		pluginIds
	};
}
//#endregion
//#region src/plugins/gateway-startup-plugin-loader.ts
function resolveChannelPluginIds(params) {
	return [...loadGatewayStartupPluginPlan(params).channelPluginIds];
}
function resolveGatewayStartupPluginIdsFromRegistry(params) {
	return [...resolveGatewayStartupPluginPlanFromRegistry(params).pluginIds];
}
function loadGatewayStartupPluginPlanWithMetadata(params) {
	const snapshotConfig = params.activationSourceConfig ?? params.config;
	const pluginIdScope = createGatewayStartupMetadataPluginIdScope({
		config: params.config,
		...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
		env: params.env,
		workerProviderIds: params.workerProviderIds ?? [],
		...params.platform !== void 0 ? { platform: params.platform } : {},
		...params.ambientEnvTriggers !== void 0 ? { ambientEnvTriggers: params.ambientEnvTriggers } : {}
	});
	const metadataSnapshot = params.metadataSnapshot && isPluginMetadataSnapshotCompatible({
		snapshot: params.metadataSnapshot,
		config: snapshotConfig,
		env: params.env,
		allowScopedSnapshot: true,
		workspaceDir: params.workspaceDir,
		index: params.index
	}) && isMetadataSnapshotScopedForGatewayStartup({
		metadataSnapshot: params.metadataSnapshot,
		pluginIdScope
	}) ? params.metadataSnapshot : resolvePluginMetadataSnapshot({
		config: snapshotConfig,
		workspaceDir: params.workspaceDir,
		env: params.env,
		allowWorkspaceScopedCurrent: params.workspaceDir === void 0,
		...params.index ? { index: params.index } : {},
		pluginIdScope
	});
	return {
		plan: resolveGatewayStartupPluginPlanFromRegistry({
			config: params.config,
			...params.activationSourceConfig !== void 0 ? { activationSourceConfig: params.activationSourceConfig } : {},
			env: params.env,
			index: metadataSnapshot.index,
			manifestRegistry: metadataSnapshot.manifestRegistry,
			workerProviderIds: params.workerProviderIds ?? [],
			platform: params.platform,
			ambientEnvTriggers: params.ambientEnvTriggers
		}),
		metadataSnapshot
	};
}
function loadGatewayStartupPluginPlan(params) {
	return loadGatewayStartupPluginPlanWithMetadata(params).plan;
}
//#endregion
export { resolveProviderConfigApiOwnerHint as _, resolveChannelPluginIdsFromRegistry as a, getCoreEmbeddingProvider as b, createGatewayStartupMetadataPluginIdScope as c, resolveGatewayStartupMetadataPluginIds as d, createInstalledPluginIndexScopeLookup as f, collectUnregisteredConfiguredMemoryEmbeddingProviders as g, collectRegisteredEmbeddingProviderIds as h, resolveGatewayStartupPluginIdsFromRegistry as i, isMetadataSnapshotScopedForGatewayStartup as l, collectConfiguredMemoryEmbeddingStartupProviderOwners as m, loadGatewayStartupPluginPlanWithMetadata as n, resolveGatewayStartupPluginPlanFromRegistry as o, collectConfiguredMemoryEmbeddingProviderIds as p, resolveChannelPluginIds as r, createConfigValidationMetadataPluginIdScope as s, loadGatewayStartupPluginPlan as t, resolveConfigValidationMetadataPluginIds as u, getRegisteredEmbeddingProvider as v, listRegisteredEmbeddingProviders as y };
