import { c as getCachedLiveProviderModelRows, d as readLiveModelCatalogStringField, l as readLiveModelCatalogBooleanField, n as buildLiveModelProviderConfig, u as readLiveModelCatalogPositiveSafeIntegerField } from "./provider-catalog-live-runtime-Ci3m6-12.js";
import { t as XAI_OAUTH_AUTO_MODEL_ID } from "./model-id-BJsQwvwb.js";
import { o as XAI_IMAGE_MODELS, s as buildXaiCatalogModels, t as XAI_BASE_URL, u as resolveXaiCatalogEntry } from "./model-definitions-LKzPOBHs.js";
//#region extensions/xai/provider-catalog.ts
const PROVIDER_ID = "xai";
const XAI_MODELS_ENDPOINT = `${XAI_BASE_URL}/models`;
const XAI_GROK_OAUTH_BASE_URL = "https://cli-chat-proxy.grok.com/v1";
const XAI_GROK_OAUTH_MODELS_ENDPOINT = `${XAI_GROK_OAUTH_BASE_URL}/models`;
const XAI_GROK_OAUTH_SETTINGS_ENDPOINT = `${XAI_GROK_OAUTH_BASE_URL}/settings`;
const XAI_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS = 6e4;
const XAI_GROK_OAUTH_REASONING_MODEL_IDS = /* @__PURE__ */ new Set(["grok-composer-2.5-fast"]);
const XAI_UNKNOWN_MODEL_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
function buildXaiProvider(api = "openai-responses") {
	return {
		baseUrl: XAI_BASE_URL,
		api,
		models: buildXaiCatalogModels()
	};
}
function buildXaiOAuthFallbackProvider() {
	return {
		baseUrl: XAI_GROK_OAUTH_BASE_URL,
		api: "openai-responses",
		auth: "oauth",
		models: buildXaiCatalogModels()
	};
}
function normalizeXaiOAuthModelSelector(value) {
	return value.trim().toLowerCase().replace(/[._]+/g, "-");
}
function resolveXaiOAuthAutoTarget(models, preferredModelId) {
	const candidates = models.filter((model) => model.id !== XAI_OAUTH_AUTO_MODEL_ID);
	if (preferredModelId) {
		const exact = candidates.find((model) => model.id === preferredModelId);
		if (exact) return exact;
		const selector = normalizeXaiOAuthModelSelector(preferredModelId);
		const normalizedMatches = candidates.filter((model) => normalizeXaiOAuthModelSelector(model.id) === selector);
		if (normalizedMatches.length === 1) return normalizedMatches[0];
	}
	return candidates[0];
}
function withXaiOAuthAutoModel(provider, preferredModelId) {
	const target = resolveXaiOAuthAutoTarget(provider.models, preferredModelId);
	if (!target) return provider;
	return {
		...provider,
		models: [{
			...target,
			id: XAI_OAUTH_AUTO_MODEL_ID,
			params: {
				...target.params,
				canonicalModelId: target.id
			}
		}, ...provider.models.filter((model) => model.id !== XAI_OAUTH_AUTO_MODEL_ID)]
	};
}
function readXaiOAuthDefaultModelId(value) {
	return readLiveModelCatalogStringField(value, "default_model");
}
async function fetchXaiOAuthDefaultModelId(params) {
	try {
		return readXaiOAuthDefaultModelId((await getCachedLiveProviderModelRows({
			providerId: PROVIDER_ID,
			endpoint: XAI_GROK_OAUTH_SETTINGS_ENDPOINT,
			discoveryApiKey: params.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			ttlMs: XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS,
			auditContext: "xai-grok-oauth-settings-discovery",
			cacheKeyParts: [
				PROVIDER_ID,
				"grok-oauth-settings",
				XAI_GROK_OAUTH_SETTINGS_ENDPOINT,
				params.discoveryApiKey
			],
			readRows: (body) => {
				if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("xAI OAuth settings response must be an object");
				return [body];
			},
			shouldCacheRows: (candidateRows) => readXaiOAuthDefaultModelId(candidateRows[0]) !== void 0
		}))[0]);
	} catch {
		return;
	}
}
async function buildLiveXaiProvider(params) {
	return await buildLiveModelProviderConfig({
		providerId: PROVIDER_ID,
		endpoint: XAI_MODELS_ENDPOINT,
		providerConfig: {
			baseUrl: XAI_BASE_URL,
			api: "openai-responses"
		},
		models: buildXaiCatalogModels(),
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		ttlMs: XAI_MODELS_CACHE_TTL_MS,
		auditContext: "xai-model-discovery"
	});
}
function resolveXaiOauthMetadataFallback(modelId) {
	if (modelId === "grok-build") return resolveXaiCatalogEntry("grok-build-0.1");
	return resolveXaiCatalogEntry(modelId);
}
function isXaiOAuthResponsesModel(row, fallback) {
	const modelId = readLiveModelCatalogStringField(row, "id") ?? readLiveModelCatalogStringField(row, "model");
	if (modelId && XAI_IMAGE_MODELS.includes(modelId)) return false;
	const backend = readLiveModelCatalogStringField(row, "api_backend") ?? readLiveModelCatalogStringField(row, "apiBackend") ?? readLiveModelCatalogStringField(row, "backend");
	if (backend) {
		const normalizedBackend = backend.toLowerCase();
		return normalizedBackend === "responses" || normalizedBackend === "chat" || normalizedBackend === "language";
	}
	return Boolean(fallback);
}
function buildXaiOauthModelFromLiveRow(row) {
	const modelId = readLiveModelCatalogStringField(row, "id") ?? readLiveModelCatalogStringField(row, "model");
	if (!modelId) return;
	const fallback = resolveXaiOauthMetadataFallback(modelId);
	if (!isXaiOAuthResponsesModel(row, fallback)) return;
	const contextWindow = readLiveModelCatalogPositiveSafeIntegerField(row, ["context_window", "contextWindow"]) ?? fallback?.contextWindow ?? 1e6;
	const maxTokens = readLiveModelCatalogPositiveSafeIntegerField(row, ["max_completion_tokens", "maxCompletionTokens"]) ?? fallback?.maxTokens ?? 64e3;
	const reasoning = (readLiveModelCatalogBooleanField(row, "supports_reasoning_effort") ?? readLiveModelCatalogBooleanField(row, "supportsReasoningEffort")) === true || fallback?.reasoning === true || XAI_GROK_OAUTH_REASONING_MODEL_IDS.has(modelId);
	return {
		id: modelId,
		name: readLiveModelCatalogStringField(row, "name") ?? fallback?.name ?? modelId,
		api: "openai-responses",
		baseUrl: XAI_GROK_OAUTH_BASE_URL,
		reasoning,
		input: fallback?.input ?? ["text"],
		cost: fallback?.cost ?? XAI_UNKNOWN_MODEL_COST,
		contextWindow,
		maxTokens,
		...fallback?.compat ? { compat: fallback.compat } : {},
		...fallback?.thinkingLevelMap ? { thinkingLevelMap: fallback.thinkingLevelMap } : {}
	};
}
async function buildLiveXaiOAuthProvider(params) {
	const fallback = buildXaiOAuthFallbackProvider();
	const [provider, preferredModelId] = await Promise.all([buildLiveModelProviderConfig({
		providerId: PROVIDER_ID,
		endpoint: XAI_GROK_OAUTH_MODELS_ENDPOINT,
		providerConfig: {
			baseUrl: fallback.baseUrl,
			api: fallback.api,
			auth: fallback.auth
		},
		models: fallback.models,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: params.fetchGuard,
		signal: params.signal,
		ttlMs: XAI_GROK_OAUTH_MODELS_CACHE_TTL_MS,
		auditContext: "xai-grok-oauth-model-discovery",
		cacheKeyParts: [
			PROVIDER_ID,
			"grok-oauth-model-rows",
			XAI_GROK_OAUTH_MODELS_ENDPOINT,
			params.discoveryApiKey
		],
		projectRows: (rows) => rows.map(buildXaiOauthModelFromLiveRow).filter((model) => Boolean(model))
	}), fetchXaiOAuthDefaultModelId(params)]);
	return withXaiOAuthAutoModel(provider, preferredModelId);
}
//#endregion
export { buildXaiProvider as i, buildLiveXaiOAuthProvider as n, buildLiveXaiProvider as r, XAI_GROK_OAUTH_BASE_URL as t };
