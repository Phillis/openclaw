import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { d as asPositiveSafeInteger } from "./number-coercion-oCkfUEEq.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { c as getCachedLiveProviderModelRows } from "./provider-catalog-live-runtime-mNrTsbWq.js";
import { a as resolveGoogleStaticModelId, n as isGoogleTextGenerationModelId } from "./provider-models-CQPF1ZCE.js";
//#region extensions/google/provider-catalog.ts
const GOOGLE_GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const GOOGLE_GEMINI_MODELS_ENDPOINT = `${GOOGLE_GEMINI_BASE_URL}/models?pageSize=1000`;
const GOOGLE_VERTEX_BASE_URL = "https://{location}-aiplatform.googleapis.com";
const GOOGLE_GEMINI_MODELS_CACHE_TTL_MS = 6e4;
const GOOGLE_GEMINI_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const GOOGLE_GEMINI_TEXT_MODELS = [
	[
		"gemini-2.5-pro",
		"Gemini 2.5 Pro",
		false
	],
	[
		"gemini-2.5-flash",
		"Gemini 2.5 Flash",
		false
	],
	[
		"gemini-2.5-flash-lite",
		"Gemini 2.5 Flash-Lite",
		false
	],
	[
		"gemini-3.5-flash",
		"Gemini 3.5 Flash",
		true
	],
	[
		"gemini-3.6-flash",
		"Gemini 3.6 Flash",
		true
	],
	[
		"gemini-3.7-flash",
		"Gemini 3.7 Flash",
		true,
		{ minimal: null }
	],
	[
		"gemini-3.5-flash-lite",
		"Gemini 3.5 Flash-Lite",
		true
	],
	[
		"gemini-3.1-pro-preview",
		"Gemini 3.1 Pro Preview",
		true
	],
	[
		"gemini-3.1-flash-lite",
		"Gemini 3.1 Flash Lite",
		true
	],
	[
		"gemini-3-flash-preview",
		"Gemini 3 Flash Preview",
		true
	]
].map(([id, name, prefersCodeMode, thinkingLevelMap]) => {
	const model = {
		id,
		name,
		reasoning: true,
		input: ["text", "image"],
		cost: GOOGLE_GEMINI_COST,
		contextWindow: 1048576,
		maxTokens: 65536
	};
	if (thinkingLevelMap) model.thinkingLevelMap = thinkingLevelMap;
	if (prefersCodeMode) model.compat = { codeMode: "preferred" };
	return model;
});
const GOOGLE_GEMINI_TEXT_MODEL_BY_ID = new Map(GOOGLE_GEMINI_TEXT_MODELS.map((model) => [model.id, model]));
const GOOGLE_GEMINI_TEXT_MODEL_IDS = new Set(GOOGLE_GEMINI_TEXT_MODEL_BY_ID.keys());
function buildGoogleStaticCatalogProvider() {
	return {
		baseUrl: GOOGLE_GEMINI_BASE_URL,
		api: "google-generative-ai",
		models: GOOGLE_GEMINI_TEXT_MODELS.map((model) => ({
			...model,
			input: [...model.input, "video"]
		}))
	};
}
function readGoogleLiveModels(body) {
	if (!body || typeof body !== "object" || Array.isArray(body)) return [];
	const models = body.models;
	return Array.isArray(models) ? models : [];
}
function googleLiveModelInput(id) {
	if (!id.startsWith("gemma-")) return [
		"text",
		"image",
		"video"
	];
	return /^gemma-3-(?:4b|12b|27b)(?:-|$)/.test(id) || id.startsWith("gemma-3n-") || id.startsWith("gemma-4-") ? ["text", "image"] : ["text"];
}
function buildGoogleLiveModel(row) {
	if (!row || typeof row !== "object" || Array.isArray(row)) return;
	const record = row;
	const resourceName = normalizeOptionalString(record.name);
	const id = resourceName?.startsWith("models/") ? resourceName.slice(7) : void 0;
	const methods = record.supportedGenerationMethods;
	const contextWindow = asPositiveSafeInteger(record.inputTokenLimit);
	const maxTokens = asPositiveSafeInteger(record.outputTokenLimit);
	if (!id || !isGoogleTextGenerationModelId(id) || !Array.isArray(methods) || !methods.includes("generateContent") || !contextWindow || !maxTokens) return;
	const staticId = resolveGoogleStaticModelId(id, GOOGLE_GEMINI_TEXT_MODEL_IDS);
	const staticModel = staticId ? GOOGLE_GEMINI_TEXT_MODEL_BY_ID.get(staticId) : void 0;
	return {
		id,
		name: normalizeOptionalString(record.displayName) ?? id,
		reasoning: record.thinking === true,
		input: googleLiveModelInput(id),
		cost: GOOGLE_GEMINI_COST,
		contextWindow,
		maxTokens,
		...staticModel?.compat ? { compat: { ...staticModel.compat } } : {},
		...staticModel?.thinkingLevelMap ? { thinkingLevelMap: { ...staticModel.thinkingLevelMap } } : {}
	};
}
function parseGoogleLiveModels(rows) {
	const models = rows.map(buildGoogleLiveModel).filter((model) => Boolean(model));
	return [...new Map(models.map((model) => [model.id, model])).values()].toSorted((a, b) => a.id.localeCompare(b.id));
}
async function buildGoogleLiveCatalogProvider(params) {
	const fallback = {
		...buildGoogleStaticCatalogProvider(),
		...params.apiKey ? { apiKey: params.apiKey } : {}
	};
	try {
		const models = parseGoogleLiveModels(await getCachedLiveProviderModelRows({
			providerId: "google",
			endpoint: GOOGLE_GEMINI_MODELS_ENDPOINT,
			apiKey: params.apiKey,
			discoveryApiKey: params.discoveryApiKey,
			fetchGuard: params.fetchGuard,
			signal: params.signal,
			ttlMs: GOOGLE_GEMINI_MODELS_CACHE_TTL_MS,
			auditContext: "google-model-discovery",
			readRows: readGoogleLiveModels,
			buildRequestHeaders: ({ discoveryApiKey, apiKey }) => ({
				Accept: "application/json",
				...discoveryApiKey ?? apiKey ? { "x-goog-api-key": discoveryApiKey ?? apiKey } : {}
			}),
			shouldCacheRows: (modelRows) => parseGoogleLiveModels(modelRows).length > 0
		}));
		if (models.length === 0) return fallback;
		return {
			...fallback,
			models
		};
	} catch {
		return fallback;
	}
}
function buildGoogleVertexStaticCatalogProvider() {
	return {
		baseUrl: GOOGLE_VERTEX_BASE_URL,
		api: "google-vertex",
		models: GOOGLE_GEMINI_TEXT_MODELS
	};
}
//#endregion
export { buildGoogleStaticCatalogProvider as n, buildGoogleVertexStaticCatalogProvider as r, buildGoogleLiveCatalogProvider as t };
