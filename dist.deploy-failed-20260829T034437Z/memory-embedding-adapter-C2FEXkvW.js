import { r as formatErrorMessage } from "./errors-Ccx0R-_Z.js";
import { t as createSubsystemLogger } from "./subsystem-a4KzJVZG.js";
import { d as normalizeProviderId } from "./provider-model-shared-QR1VEK28.js";
import "./ssrf-runtime-CpSMUPcn.js";
import "./logging-core-BaUBu9tm.js";
import { D as buildRemoteBaseUrlPolicy, a as normalizeEmbeddingModelWithPrefixes, f as embeddingProviderOwnsDestination, l as sanitizeEmbeddingCacheHeaders, n as createRemoteEmbeddingProvider } from "./memory-core-host-engine-embeddings-ByemCEFP.js";
import { n as resolveMemorySecretInputString } from "./secret-input-CCeh5Opz.js";
import "./memory-core-host-secret-CfbA1iim.js";
import { L as LMSTUDIO_PROVIDER_ID, S as resolveLmstudioInferenceBase, T as resolveLmstudioServerBase, d as hasLmstudioAuthorizationHeader, i as buildLmstudioAuthHeaders, k as LMSTUDIO_DEFAULT_EMBEDDING_MODEL, l as resolveLmstudioRuntimeApiKey, n as ensureLmstudioModelLoaded, o as resolveLmstudioConfiguredApiKeyForProvider, r as fetchLmstudioModels, s as resolveLmstudioProviderHeaders, u as sanitizeLmstudioStringHeaders, v as normalizeLmstudioConfiguredCatalogEntries, x as resolveLmstudioCanonicalModelKey } from "./models.fetch-Dur0uPni.js";
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
	return configuredModel?.contextWindow;
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
function resolveLmstudioEmbeddingBaseUrl(configuredBaseUrl) {
	const query = configuredBaseUrl?.match(/\?[^#]*/u)?.[0] ?? "";
	return `${resolveLmstudioInferenceBase(configuredBaseUrl)}${query}`;
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
	const baseUrl = resolveLmstudioEmbeddingBaseUrl(baseUrlSource && baseUrlSource.length > 0 ? baseUrlSource : providerBaseUrl && providerBaseUrl.length > 0 ? providerBaseUrl : void 0);
	const providerOwnedBaseUrl = resolveLmstudioEmbeddingBaseUrl(providerBaseUrl);
	const providerOwnsDestination = !baseUrlSource || embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl: providerOwnedBaseUrl
	});
	const model = normalizeLmstudioModel(options.model, resolvedProvider?.providerId);
	const providerHeaders = providerOwnsDestination ? await resolveLmstudioProviderHeaders({
		config: options.config,
		env: process.env,
		headers: providerConfig?.headers
	}) : void 0;
	const headerOverrides = Object.assign({}, providerHeaders, !isFallbackActivation ? sanitizeLmstudioStringHeaders(options.remote?.headers) : void 0);
	const apiKey = hasLmstudioAuthorizationHeader(headerOverrides) ? void 0 : !isFallbackActivation ? remoteApiKey?.trim() || (providerOwnsDestination ? await resolveLmstudioApiKey(options, resolvedProvider?.providerId) : void 0) : await resolveLmstudioApiKey(options, resolvedProvider?.providerId);
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
		models: providerConfig?.models
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
	const embed = async (input, callOptions) => await withLocalServiceLease(callOptions?.signal, async () => {
		return await remoteProvider.embed(input, callOptions);
	});
	const embedBatch = async (inputs, callOptions) => {
		if (callOptions?.inputType === "query") return await Promise.all(inputs.map((input) => embed(input, callOptions)));
		return await withLocalServiceLease(callOptions?.signal, async () => {
			return await remoteProvider.embedBatch(inputs, callOptions);
		});
	};
	return {
		provider: {
			...remoteProvider,
			embed,
			embedBatch
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
					headers: sanitizeEmbeddingCacheHeaders(client.headers, ["authorization", "x-api-key"])
				}
			}
		};
	}
};
//#endregion
export { lmstudioMemoryEmbeddingProviderAdapter as t };
