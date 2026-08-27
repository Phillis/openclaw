import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import { r as formatErrorMessage } from "./errors-CSNUPl5U.js";
import { t as createSubsystemLogger } from "./subsystem-CDLhGl2-.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-DEEsG6Hl.js";
import "./logging-core-DsSMdQDP.js";
import { d as normalizeProviderId } from "./provider-model-shared-T9VIzWk7.js";
import { T as buildRemoteBaseUrlPolicy, a as normalizeEmbeddingModelWithPrefixes, t as createRemoteEmbeddingProvider, u as sanitizeEmbeddingCacheHeaders } from "./memory-core-host-engine-embeddings-B5qjfb6N.js";
import { n as resolveMemorySecretInputString } from "./secret-input-DoknW-xw.js";
import { I as LMSTUDIO_PROVIDER_ID, O as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, _ as normalizeLmstudioConfiguredCatalogEntries, b as resolveLmstudioCanonicalModelKey, i as buildLmstudioAuthHeaders, l as resolveLmstudioRuntimeApiKey, n as ensureLmstudioModelLoaded, o as resolveLmstudioConfiguredApiKeyForProvider, r as fetchLmstudioModels, s as resolveLmstudioProviderHeaders, w as resolveLmstudioServerBase, x as resolveLmstudioInferenceBase } from "./models.fetch-DPS2XC98.js";
//#region extensions/lmstudio/src/embedding-provider.ts
const log = createSubsystemLogger("memory/embeddings");
const DEFAULT_LMSTUDIO_EMBEDDING_MODEL = LMSTUDIO_DEFAULT_EMBEDDING_MODEL;
/** Normalizes LM Studio embedding model refs and accepts `lmstudio/` prefix. */
function normalizeLmstudioModel(model, providerId) {
	return normalizeEmbeddingModelWithPrefixes({
		model,
		defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
		prefixes: [`${providerId?.trim() || "lmstudio"}/`, `${LMSTUDIO_PROVIDER_ID}/`]
	});
}
function hasAuthorizationHeader(headers) {
	if (!headers) return false;
	return Object.entries(headers).some(([headerName, value]) => headerName.trim().toLowerCase() === "authorization" && value.trim().length > 0);
}
/** Resolves API key (real or synthetic placeholder) from runtime/provider auth config. */
async function resolveLmstudioApiKey(options, providerId) {
	const selectedProviderId = providerId?.trim();
	const selectedApiKey = selectedProviderId && selectedProviderId !== "lmstudio" ? options.config.models?.providers?.[selectedProviderId]?.apiKey : void 0;
	if (selectedProviderId && selectedProviderId !== "lmstudio") return selectedApiKey === void 0 || selectedApiKey === null ? void 0 : await resolveLmstudioConfiguredApiKeyForProvider({
		providerId: selectedProviderId,
		config: options.config,
		env: process.env
	});
	try {
		return await resolveLmstudioRuntimeApiKey({
			config: options.config,
			agentDir: options.agentDir
		});
	} catch (error) {
		if (/LM Studio API key is required/i.test(formatErrorMessage(error))) return;
		throw error;
	}
}
function resolveEmbeddingPreloadContextLength(params) {
	const configuredModel = normalizeLmstudioConfiguredCatalogEntries(params.models).find((entry) => normalizeLmstudioModel(entry.id) === params.model);
	if (configuredModel?.contextTokens !== void 0) return configuredModel.contextTokens;
	const providerContextTokens = asPositiveSafeInteger(params.providerContextTokens);
	if (configuredModel?.contextWindow !== void 0 && providerContextTokens !== void 0) return Math.min(configuredModel.contextWindow, providerContextTokens);
	return providerContextTokens ?? configuredModel?.contextWindow ?? asPositiveSafeInteger(params.providerContextWindow);
}
function resolveConfiguredLmstudioProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || "lmstudio";
	const direct = providers[providerId];
	if (direct) return {
		providerId,
		config: direct
	};
	const normalized = normalizeProviderId(providerId);
	for (const [candidateId, candidate] of Object.entries(providers)) if (normalizeProviderId(candidateId) === normalized) return {
		providerId: candidateId,
		config: candidate
	};
	const fallback = providers[LMSTUDIO_PROVIDER_ID];
	return fallback ? {
		providerId: LMSTUDIO_PROVIDER_ID,
		config: fallback
	} : void 0;
}
function resolveLmstudioLocalServiceBaseUrl(configuredBaseUrl, inferenceBaseUrl) {
	const configured = configuredBaseUrl?.trim();
	if (!configured) return inferenceBaseUrl;
	const configuredPath = configured.replace(/[?#].*$/u, "").replace(/\/+$/u, "");
	const serverBaseUrl = resolveLmstudioServerBase(configured);
	return /\/api\/v1$/iu.test(configuredPath) ? `${serverBaseUrl}/api/v1` : `${serverBaseUrl}/v1`;
}
async function resolveLmstudioEmbeddingModelKey(params) {
	const discovered = await fetchLmstudioModels({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		ssrfPolicy: params.ssrfPolicy
	});
	if (!discovered.reachable || discovered.status !== void 0 && discovered.status >= 400) return params.model;
	return resolveLmstudioCanonicalModelKey({
		modelKey: params.model,
		models: discovered.models
	});
}
/** Creates the LM Studio embedding provider client and preloads the target model before return. */
async function createLmstudioEmbeddingProvider(options) {
	const resolvedProvider = resolveConfiguredLmstudioProvider(options);
	const providerConfig = resolvedProvider?.config;
	const providerBaseUrl = providerConfig?.baseUrl?.trim();
	const isFallbackActivation = options.fallback === "lmstudio" && options.provider !== "lmstudio";
	const remoteBaseUrl = options.remote?.baseUrl?.trim();
	const remoteApiKey = !isFallbackActivation ? resolveMemorySecretInputString({
		value: options.remote?.apiKey,
		path: "memory.search.remote.apiKey"
	}) : void 0;
	const baseUrlSource = !isFallbackActivation ? remoteBaseUrl : void 0;
	const baseUrl = resolveLmstudioInferenceBase(baseUrlSource && baseUrlSource.length > 0 ? baseUrlSource : providerBaseUrl && providerBaseUrl.length > 0 ? providerBaseUrl : void 0);
	const model = normalizeLmstudioModel(options.model, resolvedProvider?.providerId);
	const providerHeaders = await resolveLmstudioProviderHeaders({
		config: options.config,
		env: process.env,
		headers: Object.assign({}, providerConfig?.headers, !isFallbackActivation ? options.remote?.headers : {})
	});
	const apiKey = hasAuthorizationHeader(providerHeaders) ? void 0 : !isFallbackActivation ? remoteApiKey?.trim() || await resolveLmstudioApiKey(options, resolvedProvider?.providerId) : await resolveLmstudioApiKey(options, resolvedProvider?.providerId);
	const headerOverrides = Object.assign({}, providerHeaders);
	const headers = buildLmstudioAuthHeaders({
		apiKey,
		json: true,
		headers: headerOverrides
	}) ?? {};
	const ssrfPolicy = buildRemoteBaseUrlPolicy(baseUrl);
	const client = {
		baseUrl,
		model,
		headers,
		ssrfPolicy
	};
	const requestedContextLength = resolveEmbeddingPreloadContextLength({
		model,
		models: providerConfig?.models,
		providerContextTokens: providerConfig?.contextTokens,
		providerContextWindow: providerConfig?.contextWindow
	});
	const localServiceTarget = providerConfig?.localService && !baseUrlSource ? {
		providerId: resolvedProvider?.providerId ?? "lmstudio",
		baseUrl: resolveLmstudioLocalServiceBaseUrl(providerBaseUrl, baseUrl),
		headers
	} : void 0;
	const acquireLocalService = options.acquireLocalService;
	const withLocalServiceLease = async (signal, action) => {
		const lease = localServiceTarget && acquireLocalService ? await acquireLocalService(localServiceTarget, signal) : void 0;
		try {
			return await action();
		} finally {
			lease?.release();
		}
	};
	if (providerConfig?.params?.preload !== false) await withLocalServiceLease(void 0, async () => {
		try {
			client.model = await ensureLmstudioModelLoaded({
				baseUrl,
				apiKey,
				headers: headerOverrides,
				ssrfPolicy,
				modelKey: model,
				requestedContextLength,
				timeoutMs: 12e4
			});
		} catch (error) {
			if (error instanceof Error && "resolvedModelKey" in error) {
				const resolvedModelKey = error.resolvedModelKey;
				if (typeof resolvedModelKey === "string" && resolvedModelKey.trim()) client.model = resolvedModelKey.trim();
			}
			log.warn("lmstudio embeddings warmup failed; continuing without preload", {
				baseUrl,
				model,
				error: formatErrorMessage(error)
			});
		}
	});
	else if (model.includes("@")) try {
		await withLocalServiceLease(void 0, async () => {
			client.model = await resolveLmstudioEmbeddingModelKey({
				baseUrl,
				apiKey,
				headers: headerOverrides,
				ssrfPolicy,
				model
			});
		});
	} catch (error) {
		log.debug("lmstudio embedding variant discovery failed; using requested model", {
			baseUrl,
			model,
			error: formatErrorMessage(error)
		});
	}
	const remoteProvider = createRemoteEmbeddingProvider({
		id: LMSTUDIO_PROVIDER_ID,
		client,
		errorPrefix: "lmstudio embeddings failed"
	});
	return {
		provider: {
			...remoteProvider,
			embedQuery: async (text, callOptions) => await withLocalServiceLease(callOptions?.signal, async () => {
				return await remoteProvider.embedQuery(text, callOptions);
			}),
			embedBatch: async (texts, callOptions) => await withLocalServiceLease(callOptions?.signal, async () => {
				return await remoteProvider.embedBatch(texts, callOptions);
			}),
			...remoteProvider.embedBatchInputs ? { embedBatchInputs: async (inputs, callOptions) => await withLocalServiceLease(callOptions?.signal, async () => {
				return await remoteProvider.embedBatchInputs(inputs, callOptions);
			}) } : {}
		},
		client
	};
}
//#endregion
//#region extensions/lmstudio/memory-embedding-adapter.ts
const lmstudioMemoryEmbeddingProviderAdapter = {
	id: "lmstudio",
	defaultModel: DEFAULT_LMSTUDIO_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "lmstudio",
	allowExplicitWhenConfiguredAuto: true,
	create: async (options) => {
		const providerId = options.provider?.trim() || "lmstudio";
		const { provider, client } = await createLmstudioEmbeddingProvider({
			...options,
			provider: providerId,
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "lmstudio",
				inlineBatchTimeoutMs: 10 * 6e4,
				cacheKeyData: {
					provider: providerId,
					baseUrl: client.baseUrl,
					model: client.model,
					headers: sanitizeEmbeddingCacheHeaders(client.headers, ["authorization"])
				}
			}
		};
	}
};
//#endregion
export { lmstudioMemoryEmbeddingProviderAdapter as t };
