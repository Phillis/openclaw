import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { c as isRecord } from "./record-coerce-DItp3I4t.js";
import { f as normalizeTrimmedStringList } from "./string-normalization-e_fvmxMf.js";
import { n as assertOkOrThrowHttpError, p as readProviderJsonResponse } from "./provider-http-errors-BH2HGv8j.js";
import { p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-DRrgUN7e.js";
import { p as resolveProviderHttpRequestConfig } from "./shared-BEAvjECH.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { a as resolveApiKeyForProvider } from "./provider-auth-runtime-Bqbi48q-.js";
import "./provider-http-RuCpoOP3.js";
import { o as getCachedLiveCatalogValue } from "./provider-catalog-shared-CPf2sXrg.js";
import { t as OPENROUTER_BASE_URL } from "./provider-catalog-B39U_in7.js";
import { t as fetchOpenRouterVideoGet } from "./video-http-Bz5hWHQn.js";
//#region extensions/openrouter/video-model-catalog.ts
const DEFAULT_HTTP_TIMEOUT_MS = 6e4;
function normalizeNumberArray(value) {
	return Array.isArray(value) ? value.filter((entry) => typeof entry === "number" && Number.isFinite(entry)) : [];
}
function normalizeResolutionArray(value) {
	return normalizeTrimmedStringList(value).map((entry) => entry.toUpperCase());
}
function normalizeFrameImageRoles(value) {
	const seen = /* @__PURE__ */ new Set();
	for (const entry of normalizeTrimmedStringList(value)) if (entry === "first_frame" || entry === "last_frame") seen.add(entry);
	return [...seen];
}
function normalizeStringRecord(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const record = {};
	for (const [key, raw] of Object.entries(value)) {
		const normalized = normalizeOptionalString(raw);
		if (normalized) record[key] = normalized;
	}
	return Object.keys(record).length > 0 ? record : void 0;
}
function isOpenRouterVideoModel(value) {
	return isRecord(value);
}
function buildOpenRouterVideoModeCapabilities(params) {
	return {
		maxVideos: 1,
		...params.durations.length > 0 ? { supportedDurationSeconds: params.durations } : {},
		...params.aspectRatios.length > 0 ? {
			supportsAspectRatio: true,
			aspectRatios: params.aspectRatios
		} : {},
		...params.resolutions.length > 0 ? {
			supportsResolution: true,
			resolutions: params.resolutions
		} : {},
		...params.sizes.length > 0 ? {
			supportsSize: true,
			sizes: params.sizes
		} : {},
		...params.supportsAudio === void 0 ? {} : { supportsAudio: params.supportsAudio }
	};
}
function buildOpenRouterVideoModelCapabilities(model) {
	const aspectRatios = normalizeTrimmedStringList(model.supported_aspect_ratios);
	const durations = normalizeNumberArray(model.supported_durations);
	const frameImages = normalizeFrameImageRoles(model.supported_frame_images);
	const resolutions = normalizeResolutionArray(model.supported_resolutions);
	const sizes = normalizeTrimmedStringList(model.supported_sizes);
	const allowedPassthroughParameters = normalizeTrimmedStringList(model.allowed_passthrough_parameters);
	const modeCapabilities = buildOpenRouterVideoModeCapabilities({
		durations,
		aspectRatios,
		resolutions,
		sizes,
		supportsAudio: typeof model.generate_audio === "boolean" ? model.generate_audio : void 0
	});
	const capabilities = {
		providerOptions: {
			callback_url: "string",
			seed: "number"
		},
		generate: modeCapabilities,
		imageToVideo: {
			enabled: frameImages.length > 0,
			...modeCapabilities,
			...frameImages.length > 0 ? { maxInputImages: frameImages.length } : {}
		},
		videoToVideo: { enabled: false }
	};
	const canonicalSlug = normalizeOptionalString(model.canonical_slug);
	if (canonicalSlug) capabilities.canonicalSlug = canonicalSlug;
	const description = normalizeOptionalString(model.description);
	if (description) capabilities.description = description;
	if (typeof model.created === "number" && Number.isFinite(model.created)) capabilities.created = model.created;
	const pricingSkus = normalizeStringRecord(model.pricing_skus);
	if (pricingSkus) capabilities.pricingSkus = pricingSkus;
	if (allowedPassthroughParameters.length > 0) capabilities.allowedPassthroughParameters = allowedPassthroughParameters;
	return capabilities;
}
function projectOpenRouterVideoModelsToCatalogEntries(payload) {
	const entries = [];
	const seen = /* @__PURE__ */ new Set();
	const models = isRecord(payload) && Array.isArray(payload.data) ? payload.data : [];
	for (const model of models) {
		if (!isOpenRouterVideoModel(model)) continue;
		const id = normalizeOptionalString(model.id);
		if (!id || seen.has(id)) continue;
		seen.add(id);
		const entry = {
			kind: "video_generation",
			provider: "openrouter",
			model: id,
			source: "live",
			capabilities: buildOpenRouterVideoModelCapabilities(model)
		};
		const name = normalizeOptionalString(model.name);
		if (name) entry.label = name;
		entries.push(entry);
	}
	return entries;
}
function stableCacheKeyValue(value) {
	if (Array.isArray(value)) return value.map(stableCacheKeyValue);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(Object.entries(value).toSorted(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, stableCacheKeyValue(entry)]));
}
function buildRequestPolicyCacheKey(request) {
	return stableCacheKeyValue(request ?? null);
}
function resolveOpenRouterVideoCatalogRequest(params) {
	const request = sanitizeConfiguredModelProviderRequest(params.request);
	return {
		...resolveProviderHttpRequestConfig({
			provider: "openrouter",
			capability: "video",
			baseUrl: params.baseUrl,
			defaultBaseUrl: OPENROUTER_BASE_URL,
			defaultHeaders: {
				Authorization: `Bearer ${params.apiKey}`,
				"HTTP-Referer": "https://openclaw.ai",
				"X-OpenRouter-Title": "OpenClaw"
			},
			request
		}),
		requestPolicyCacheKey: buildRequestPolicyCacheKey(request)
	};
}
async function fetchOpenRouterVideoModels(params) {
	return await getCachedLiveCatalogValue({
		keyParts: [
			"openrouter",
			"video-models",
			params.baseUrl,
			params.apiKey,
			params.requestPolicyCacheKey
		],
		load: async () => {
			const { response, release } = await fetchOpenRouterVideoGet({
				url: "videos/models",
				baseUrl: params.baseUrl,
				headers: params.headers,
				timeoutMs: params.timeoutMs,
				allowPrivateNetwork: params.allowPrivateNetwork,
				dispatcherPolicy: params.dispatcherPolicy,
				auditContext: "openrouter-video-models"
			});
			try {
				await assertOkOrThrowHttpError(response, "OpenRouter video models request failed");
				return await readProviderJsonResponse(response, "OpenRouter video models request failed");
			} finally {
				await release();
			}
		}
	});
}
async function listOpenRouterVideoModelCatalog(ctx) {
	const { discoveryApiKey: apiKey } = ctx.resolveProviderApiKey("openrouter");
	if (!apiKey) return null;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy, requestPolicyCacheKey } = resolveOpenRouterVideoCatalogRequest({
		apiKey,
		baseUrl: ctx.config.models?.providers?.openrouter?.baseUrl,
		request: ctx.config.models?.providers?.openrouter?.request
	});
	return projectOpenRouterVideoModelsToCatalogEntries(await fetchOpenRouterVideoModels({
		baseUrl,
		apiKey,
		headers,
		requestPolicyCacheKey,
		timeoutMs: ctx.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS,
		allowPrivateNetwork,
		dispatcherPolicy
	}));
}
async function resolveOpenRouterVideoModelCapabilities(ctx) {
	const auth = await resolveApiKeyForProvider({
		provider: "openrouter",
		cfg: ctx.cfg,
		agentDir: ctx.agentDir,
		store: ctx.authStore
	});
	if (!auth.apiKey) return;
	const { baseUrl, allowPrivateNetwork, headers, dispatcherPolicy, requestPolicyCacheKey } = resolveOpenRouterVideoCatalogRequest({
		apiKey: auth.apiKey,
		baseUrl: ctx.cfg?.models?.providers?.openrouter?.baseUrl,
		request: ctx.cfg?.models?.providers?.openrouter?.request
	});
	return projectOpenRouterVideoModelsToCatalogEntries(await fetchOpenRouterVideoModels({
		baseUrl,
		apiKey: auth.apiKey,
		headers,
		requestPolicyCacheKey,
		timeoutMs: ctx.timeoutMs ?? DEFAULT_HTTP_TIMEOUT_MS,
		allowPrivateNetwork,
		dispatcherPolicy
	})).find((entry) => entry.model === ctx.model)?.capabilities;
}
//#endregion
export { resolveOpenRouterVideoModelCapabilities as n, listOpenRouterVideoModelCatalog as t };
