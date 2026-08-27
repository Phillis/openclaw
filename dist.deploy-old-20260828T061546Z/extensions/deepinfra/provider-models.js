import { t as modelCatalog } from "./openclaw.plugin-DomWf43f.js";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import { asPositiveSafeInteger } from "openclaw/plugin-sdk/string-coerce-runtime";
import { withTrustedEnvProxyGuardedFetchMode } from "openclaw/plugin-sdk/fetch-runtime";
import { isProviderApiKeyConfigured } from "openclaw/plugin-sdk/provider-auth";
import { LiveModelCatalogHttpError, getCachedLiveProviderModelRows } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { hasConfiguredSecretInput } from "openclaw/plugin-sdk/secret-input";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
//#region extensions/deepinfra/provider-models.ts
const log = createSubsystemLogger("deepinfra-models");
const DEEPINFRA_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "deepinfra",
	catalog: modelCatalog.providers.deepinfra
});
const DEEPINFRA_BASE_URL = DEEPINFRA_MANIFEST_PROVIDER.baseUrl;
const DEEPINFRA_MODELS_URL = `${DEEPINFRA_BASE_URL}/models?sort_by=openclaw&filter=with_meta`;
const DEEPINFRA_DEFAULT_MODEL_REF = `deepinfra/deepseek-ai/DeepSeek-V4-Flash`;
const DEEPINFRA_DEFAULT_CONTEXT_WINDOW = 128e3;
const DEEPINFRA_DEFAULT_MAX_TOKENS = 8192;
const DEEPINFRA_MODEL_CATALOG = DEEPINFRA_MANIFEST_PROVIDER.models;
const DISCOVERY_TIMEOUT_MS = 5e3;
const DISCOVERY_CACHE_TTL_MS = 300 * 1e3;
const SURFACE_FOR_TAG = {
	chat: "chat",
	vlm: "vlm",
	embed: "embed",
	"image-gen": "image-gen",
	"video-gen": "video-gen",
	tts: "tts",
	stt: "stt"
};
function entryToSurfaceModel(entry) {
	const id = typeof entry?.id === "string" ? entry.id.trim() : "";
	if (!id) return null;
	const metadata = entry.metadata;
	if (!metadata) return null;
	const tags = Array.isArray(metadata.tags) ? metadata.tags.filter((t) => typeof t === "string") : [];
	const pricing = metadata.pricing ?? {};
	return {
		id,
		name: id,
		description: metadata.description ?? void 0,
		tags,
		contextWindow: asPositiveSafeInteger(metadata.context_length),
		maxTokens: asPositiveSafeInteger(metadata.max_tokens),
		pricing,
		defaultWidth: asPositiveSafeInteger(metadata.default_width),
		defaultHeight: asPositiveSafeInteger(metadata.default_height),
		defaultIterations: asPositiveSafeInteger(metadata.default_iterations)
	};
}
function bucketBySurface(models) {
	const catalog = {
		chat: [],
		vlm: [],
		embed: [],
		imageGen: [],
		videoGen: [],
		tts: [],
		stt: [],
		live: true
	};
	const buckets = {
		chat: catalog.chat,
		vlm: catalog.vlm,
		embed: catalog.embed,
		"image-gen": catalog.imageGen,
		"video-gen": catalog.videoGen,
		tts: catalog.tts,
		stt: catalog.stt
	};
	for (const model of models) {
		const seen = /* @__PURE__ */ new Set();
		for (const tag of model.tags) {
			const surface = SURFACE_FOR_TAG[tag];
			if (surface && !seen.has(surface)) {
				seen.add(surface);
				buckets[surface].push(model);
			}
		}
	}
	return catalog;
}
function hasDeepInfraSurfaceModelRows(rows) {
	return rows.some((entry) => entryToSurfaceModel(entry) !== null);
}
function manifestChatEntryToSurfaceModel(entry) {
	const cost = entry.cost ?? {};
	const pricing = {};
	if (typeof cost.input === "number") pricing.input_tokens = cost.input;
	if (typeof cost.output === "number") pricing.output_tokens = cost.output;
	if (typeof cost.cacheRead === "number" && cost.cacheRead > 0) pricing.cache_read_tokens = cost.cacheRead;
	const tags = ["chat"];
	if (entry.input?.includes("image")) tags.push("vlm");
	if (entry.reasoning) tags.push("reasoning");
	return {
		id: entry.id,
		name: entry.name ?? entry.id,
		tags,
		contextWindow: entry.contextWindow,
		maxTokens: entry.maxTokens,
		pricing
	};
}
const STATIC_NON_CHAT_FALLBACK = [
	{
		id: "black-forest-labs/FLUX-1-schnell",
		name: "black-forest-labs/FLUX-1-schnell",
		tags: ["image-gen"],
		pricing: { per_image_unit: .003 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 4
	},
	{
		id: "black-forest-labs/FLUX-1-dev",
		name: "black-forest-labs/FLUX-1-dev",
		tags: ["image-gen"],
		pricing: { per_image_unit: .025 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 28
	},
	{
		id: "Qwen/Qwen-Image-Max",
		name: "Qwen/Qwen-Image-Max",
		tags: ["image-gen"],
		pricing: { per_image_unit: .075 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 28
	},
	{
		id: "stabilityai/sdxl-turbo",
		name: "stabilityai/sdxl-turbo",
		tags: ["image-gen"],
		pricing: { per_image_unit: 2e-4 },
		defaultWidth: 1024,
		defaultHeight: 1024,
		defaultIterations: 4
	},
	{
		id: "hexgrad/Kokoro-82M",
		name: "hexgrad/Kokoro-82M",
		tags: ["tts"],
		pricing: { input_characters: .65 }
	},
	{
		id: "Qwen/Qwen3-TTS",
		name: "Qwen/Qwen3-TTS",
		tags: ["tts"],
		pricing: { input_characters: .65 }
	},
	{
		id: "ResembleAI/chatterbox-turbo",
		name: "ResembleAI/chatterbox-turbo",
		tags: ["tts"],
		pricing: { input_characters: 1 }
	},
	{
		id: "sesame/csm-1b",
		name: "sesame/csm-1b",
		tags: ["tts"],
		pricing: { input_characters: 7 }
	},
	{
		id: "openai/whisper-large-v3-turbo",
		name: "openai/whisper-large-v3-turbo",
		tags: ["stt"],
		pricing: { input_seconds: 4e-5 }
	},
	{
		id: "BAAI/bge-m3",
		name: "BAAI/bge-m3",
		tags: ["embed"],
		pricing: { input_tokens: .01 },
		maxTokens: 8192,
		contextWindow: 8192
	}
];
function manifestFallbackCatalog() {
	const catalog = bucketBySurface([...(modelCatalog.providers.deepinfra.models ?? []).map(manifestChatEntryToSurfaceModel), ...STATIC_NON_CHAT_FALLBACK]);
	catalog.live = false;
	return catalog;
}
function getDeepInfraSurfaceFallbackCatalog() {
	return manifestFallbackCatalog();
}
function resolveDeepInfraThinkingFormat(modelId) {
	return (modelId ?? "").toLowerCase().split("/")[0] === "deepseek-ai" ? "deepseek" : void 0;
}
function buildDeepInfraModelDefinition(model) {
	const thinkingFormat = model.compat?.thinkingFormat ?? resolveDeepInfraThinkingFormat(model.id);
	return {
		...model,
		compat: {
			...model.compat,
			supportsUsageInStreaming: model.compat?.supportsUsageInStreaming ?? true,
			...thinkingFormat ? { thinkingFormat } : {}
		}
	};
}
function chatSurfaceModelToModelDefinition(model) {
	const manifestModel = DEEPINFRA_MODEL_CATALOG.find((entry) => entry.id === model.id);
	const input = model.tags.includes("vlm") ? ["text", "image"] : ["text"];
	const reasoning = model.tags.includes("reasoning") || model.tags.includes("reasoning_effort");
	return buildDeepInfraModelDefinition({
		id: model.id,
		name: model.name,
		reasoning: manifestModel?.reasoning ?? reasoning,
		input,
		...manifestModel?.compat ? { compat: manifestModel.compat } : {},
		contextWindow: model.contextWindow ?? DEEPINFRA_DEFAULT_CONTEXT_WINDOW,
		maxTokens: model.maxTokens ?? DEEPINFRA_DEFAULT_MAX_TOKENS,
		cost: {
			input: model.pricing.input_tokens ?? 0,
			output: model.pricing.output_tokens ?? 0,
			cacheRead: model.pricing.cache_read_tokens ?? 0,
			cacheWrite: 0
		}
	});
}
function hasDeepInfraApiKey(options) {
	const fromEnv = (options?.env ?? process.env).DEEPINFRA_API_KEY;
	if (typeof fromEnv === "string" && fromEnv.trim() !== "") return true;
	const providers = options?.config?.models?.providers;
	for (const [providerId, provider] of Object.entries(providers ?? {})) if (providerId.trim().toLowerCase() === "deepinfra" && hasConfiguredSecretInput(provider?.apiKey, options?.config?.secrets?.defaults)) return true;
	return isProviderApiKeyConfigured({
		provider: "deepinfra",
		agentDir: options?.agentDir
	});
}
async function discoverDeepInfraSurfaces(options) {
	const env = options?.env ?? process.env;
	if (env.NODE_ENV === "test" || env.VITEST) return manifestFallbackCatalog();
	if (!(options?.hasApiKey ?? hasDeepInfraApiKey({
		env,
		agentDir: options?.agentDir
	}))) return manifestFallbackCatalog();
	try {
		const data = await getCachedLiveProviderModelRows({
			providerId: "deepinfra",
			endpoint: DEEPINFRA_MODELS_URL,
			timeoutMs: DISCOVERY_TIMEOUT_MS,
			ttlMs: DISCOVERY_CACHE_TTL_MS,
			buildRequestHeaders: () => ({ Accept: "application/json" }),
			auditContext: "deepinfra-model-discovery",
			shouldCacheRows: hasDeepInfraSurfaceModelRows,
			fetchGuard: (params) => fetchWithSsrFGuard(withTrustedEnvProxyGuardedFetchMode(params))
		});
		if (data.length === 0) {
			log.warn("No models found from DeepInfra agent-projection endpoint, using static catalog");
			return manifestFallbackCatalog();
		}
		const seenIds = /* @__PURE__ */ new Set();
		const surfaceModels = [];
		for (const entry of data) {
			const model = entryToSurfaceModel(entry);
			if (!model || seenIds.has(model.id)) continue;
			seenIds.add(model.id);
			surfaceModels.push(model);
		}
		if (surfaceModels.length === 0) return manifestFallbackCatalog();
		return bucketBySurface(surfaceModels);
	} catch (error) {
		if (error instanceof LiveModelCatalogHttpError) {
			log.warn(`Failed to discover models: HTTP ${error.status}, using static catalog`);
			return manifestFallbackCatalog();
		}
		log.warn(`Discovery failed: ${String(error)}, using static catalog`);
		return manifestFallbackCatalog();
	}
}
async function discoverDeepInfraModels(options) {
	const catalog = await discoverDeepInfraSurfaces(options);
	if (!catalog.live) return DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition);
	const chatModels = catalog.chat.length > 0 ? catalog.chat : [...catalog.chat, ...catalog.vlm];
	if (chatModels.length === 0) return DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition);
	const liveModels = chatModels.map(chatSurfaceModelToModelDefinition);
	const seen = new Set(liveModels.map((model) => model.id));
	const manifestModels = DEEPINFRA_MODEL_CATALOG.filter((model) => {
		const unseen = !seen.has(model.id);
		seen.add(model.id);
		return unseen;
	}).map(buildDeepInfraModelDefinition);
	return [...liveModels, ...manifestModels];
}
//#endregion
export { DEEPINFRA_BASE_URL, DEEPINFRA_DEFAULT_MODEL_REF, DEEPINFRA_MODEL_CATALOG, buildDeepInfraModelDefinition, discoverDeepInfraModels, discoverDeepInfraSurfaces, getDeepInfraSurfaceFallbackCatalog, hasDeepInfraApiKey };
