import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { t as filterStringEntries } from "./string-normalization-e_fvmxMf.js";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-CQ4RdJXm.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-IFayOKvf.js";
import { l as normalizeBaseUrl, p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-BR35Bqmj.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-DEePW_9S.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./ssrf-runtime-D3OHU1vE.js";
import "./provider-http-D7FntVgP.js";
import { n as buildLiveModelProviderConfig } from "./provider-catalog-live-runtime-Ci3m6-12.js";
//#region extensions/openrouter/provider-catalog.ts
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const OPENROUTER_LEGACY_BASE_URL = "https://openrouter.ai/v1";
const OPENROUTER_MODELS_CACHE_TTL_MS = 6e4;
const OPENROUTER_DEFAULT_MODEL_ID = "openrouter/auto";
const OPENROUTER_DEFAULT_CONTEXT_WINDOW = 2e5;
const OPENROUTER_DEFAULT_MAX_TOKENS = 8192;
const OPENROUTER_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const OPENROUTER_PROXY_REASONING_UNSUPPORTED_MODEL_IDS = /* @__PURE__ */ new Set(["openrouter/hunter-alpha"]);
const OPENROUTER_KIMI_K2_6_COST = {
	input: .8,
	output: 3.5,
	cacheRead: .2,
	cacheWrite: 0
};
const OPENROUTER_KIMI_K2_5_COST = {
	input: .44,
	output: 2,
	cacheRead: .22,
	cacheWrite: 0
};
function normalizeOpenRouterBaseUrl(baseUrl) {
	const normalized = baseUrl?.trim().replace(/\/+$/, "");
	if (!normalized) return;
	if (normalized === "https://openrouter.ai/api/v1" || normalized === OPENROUTER_LEGACY_BASE_URL) return OPENROUTER_BASE_URL;
}
function resolveOpenRouterApiBaseUrl(baseUrl) {
	const normalized = normalizeOpenRouterBaseUrl(baseUrl) ?? normalizeBaseUrl(baseUrl, "https://openrouter.ai/api/v1");
	const parsed = URL.canParse(normalized) ? new URL(normalized) : void 0;
	if (!parsed || parsed.protocol !== "http:" && parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash) throw new Error("Invalid OpenRouter API base URL");
	return normalized;
}
function resolveOpenRouterSsrfPolicy(requestConfig, request) {
	return requestConfig.allowPrivateNetwork ? { allowPrivateNetwork: true } : request?.allowPrivateNetwork === false ? {} : ssrfPolicyFromHttpBaseUrlAllowedOrigin(requestConfig.baseUrl);
}
function isOpenRouterProxyReasoningUnsupportedModel(modelId) {
	const normalized = (modelId ?? "").trim().toLowerCase();
	if (!normalized) return false;
	return OPENROUTER_PROXY_REASONING_UNSUPPORTED_MODEL_IDS.has(normalized) || normalized.startsWith("openrouter/hunter-alpha:");
}
function buildOpenrouterProvider() {
	return {
		baseUrl: OPENROUTER_BASE_URL,
		api: "openai-completions",
		models: [
			{
				id: OPENROUTER_DEFAULT_MODEL_ID,
				name: "OpenRouter Auto",
				reasoning: false,
				input: ["text", "image"],
				cost: OPENROUTER_DEFAULT_COST,
				contextWindow: OPENROUTER_DEFAULT_CONTEXT_WINDOW,
				maxTokens: OPENROUTER_DEFAULT_MAX_TOKENS
			},
			{
				id: "moonshotai/kimi-k2.6",
				name: "MoonshotAI: Kimi K2.6",
				reasoning: true,
				input: ["text", "image"],
				cost: OPENROUTER_KIMI_K2_6_COST,
				contextWindow: 262144,
				maxTokens: 262144
			},
			{
				id: "moonshotai/kimi-k2.5",
				name: "MoonshotAI: Kimi K2.5",
				reasoning: true,
				input: ["text", "image"],
				cost: OPENROUTER_KIMI_K2_5_COST,
				contextWindow: 262144,
				maxTokens: 262144
			}
		]
	};
}
function readStringArray(record, key) {
	return filterStringEntries(record?.[key]);
}
function readTokenPrice(record, key) {
	const value = record?.[key];
	const parsed = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	return Number.isFinite(parsed) && parsed >= 0 ? parsed * 1e6 : 0;
}
function readOpenRouterModalities(architecture, direction) {
	const explicit = readStringArray(architecture, `${direction}_modalities`);
	if (explicit.length > 0) return explicit;
	const modality = normalizeOptionalString(architecture?.modality);
	if (!modality) return [];
	const [input = "", output = ""] = modality.split("->", 2);
	return (direction === "input" ? input : output).split("+").filter(Boolean);
}
function buildOpenRouterLiveModel(row) {
	const record = asOptionalRecord(row);
	const id = normalizeOptionalString(record?.id);
	const architecture = asOptionalRecord(record?.architecture);
	const outputModalities = readOpenRouterModalities(architecture, "output");
	if (!id || outputModalities.length > 0 && !outputModalities.includes("text")) return;
	const inputModalities = readOpenRouterModalities(architecture, "input");
	const supportedParameters = readStringArray(record, "supported_parameters");
	const topProvider = asOptionalRecord(record?.top_provider);
	const pricing = asOptionalRecord(record?.pricing);
	return {
		id,
		name: normalizeOptionalString(record?.name) ?? id,
		reasoning: supportedParameters.includes("reasoning") || supportedParameters.includes("include_reasoning"),
		input: inputModalities.includes("image") ? ["text", "image"] : ["text"],
		cost: {
			input: readTokenPrice(pricing, "prompt"),
			output: readTokenPrice(pricing, "completion"),
			cacheRead: readTokenPrice(pricing, "input_cache_read"),
			cacheWrite: readTokenPrice(pricing, "input_cache_write")
		},
		contextWindow: asPositiveSafeInteger(topProvider?.context_length) ?? asPositiveSafeInteger(record?.context_length) ?? OPENROUTER_DEFAULT_CONTEXT_WINDOW,
		maxTokens: asPositiveSafeInteger(topProvider?.max_completion_tokens) ?? asPositiveSafeInteger(record?.max_completion_tokens) ?? asPositiveSafeInteger(record?.max_output_tokens) ?? OPENROUTER_DEFAULT_MAX_TOKENS
	};
}
async function buildOpenrouterLiveProvider(params) {
	const fallback = buildOpenrouterProvider();
	const baseUrl = resolveOpenRouterApiBaseUrl(params.baseUrl);
	const request = sanitizeConfiguredModelProviderRequest(params.request);
	const resolveRequest = (apiKey) => resolveProviderHttpRequestConfig({
		provider: "openrouter",
		capability: "llm",
		baseUrl,
		defaultBaseUrl: OPENROUTER_BASE_URL,
		defaultHeaders: {
			Accept: "application/json",
			...apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
		},
		request
	});
	const requestConfig = resolveRequest();
	const endpoint = `${requestConfig.baseUrl}/models`;
	return await buildLiveModelProviderConfig({
		providerId: "openrouter",
		endpoint,
		providerConfig: {
			baseUrl: requestConfig.baseUrl,
			api: fallback.api,
			...params.request ? { request: params.request } : {}
		},
		models: fallback.models,
		apiKey: params.apiKey,
		discoveryApiKey: params.discoveryApiKey,
		fetchGuard: async (fetchParams) => await (params.fetchGuard ?? fetchWithSsrFGuard)({
			...fetchParams,
			...requestConfig.dispatcherPolicy ? { dispatcherPolicy: requestConfig.dispatcherPolicy } : {}
		}),
		signal: params.signal,
		ttlMs: OPENROUTER_MODELS_CACHE_TTL_MS,
		auditContext: "openrouter-model-discovery",
		policy: resolveOpenRouterSsrfPolicy(requestConfig, params.request),
		cacheKeyParts: [
			"openrouter",
			"model-rows",
			endpoint,
			params.discoveryApiKey ?? params.apiKey,
			request ?? null
		],
		buildRequestHeaders: ({ apiKey, discoveryApiKey }) => resolveRequest(discoveryApiKey ?? apiKey).headers,
		projectRows: (rows, fallbackProvider) => {
			const liveModels = rows.flatMap((row) => {
				const model = buildOpenRouterLiveModel(row);
				return model ? [model] : [];
			});
			if (liveModels.length === 0) return [];
			return [...new Map([...fallbackProvider.models, ...liveModels].map((model) => [model.id, model])).values()].toSorted((a, b) => a.id.localeCompare(b.id));
		}
	});
}
//#endregion
export { normalizeOpenRouterBaseUrl as a, isOpenRouterProxyReasoningUnsupportedModel as i, buildOpenrouterLiveProvider as n, resolveOpenRouterApiBaseUrl as o, buildOpenrouterProvider as r, resolveOpenRouterSsrfPolicy as s, OPENROUTER_BASE_URL as t };
