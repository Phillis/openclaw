import { applyProviderNativeStreamingUsageCompat, supportsNativeStreamingUsageCompat } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/qwen/models.ts
const QWEN_BASE_URL = "https://coding-intl.dashscope.aliyuncs.com/v1";
const QWEN_GLOBAL_BASE_URL = QWEN_BASE_URL;
const QWEN_CN_BASE_URL = "https://coding.dashscope.aliyuncs.com/v1";
const QWEN_STANDARD_CN_BASE_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1";
const QWEN_STANDARD_GLOBAL_BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
const QWEN_TOKEN_PLAN_PROVIDER_ID = "qwen-token-plan";
const QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID = "bailian-token-plan";
const QWEN_TOKEN_PLAN_GLOBAL_BASE_URL = "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_TOKEN_PLAN_CN_BASE_URL = "https://token-plan.cn-beijing.maas.aliyuncs.com/compatible-mode/v1";
const QWEN_DEFAULT_MODEL_ID = "qwen3.5-plus";
const QWEN_36_FLASH_MODEL_ID = "qwen3.6-flash";
const QWEN_36_PLUS_MODEL_ID = "qwen3.6-plus";
const QWEN_37_MAX_MODEL_ID = "qwen3.7-max";
const QWEN_37_PLUS_MODEL_ID = "qwen3.7-plus";
const QWEN_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
const QWEN_DEFAULT_MODEL_REF = `qwen/${QWEN_DEFAULT_MODEL_ID}`;
const QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID = QWEN_37_PLUS_MODEL_ID;
const QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF = `${QWEN_TOKEN_PLAN_PROVIDER_ID}/${QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID}`;
function isQwenTokenPlanThinkingOnlyModelId(modelId) {
	const normalized = modelId.trim().toLowerCase();
	return normalized === "minimax-m2.5" || normalized.startsWith("kimi-k2.7-code");
}
function isQwenTokenPlanDeepSeekV4ModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("deepseek-v4");
}
function isQwenTokenPlanKimiModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("kimi-");
}
function isQwenTokenPlanGlmModelId(modelId) {
	return modelId.trim().toLowerCase().startsWith("glm-");
}
function supportsQwenTokenPlanGlmMaxThinking(modelId) {
	return modelId.trim().toLowerCase() === "glm-5.2";
}
const QWEN_TOKEN_PLAN_BASE_URLS = {
	global: QWEN_TOKEN_PLAN_GLOBAL_BASE_URL,
	cn: QWEN_TOKEN_PLAN_CN_BASE_URL
};
function resolveQwenTokenPlanBaseUrl(region) {
	return QWEN_TOKEN_PLAN_BASE_URLS[region];
}
function buildQwenCatalogModels(rows) {
	return rows.map(([id, reasoning, input, contextWindow, maxTokens]) => ({
		id,
		name: id,
		reasoning,
		input,
		cost: QWEN_DEFAULT_COST,
		contextWindow,
		maxTokens
	}));
}
const QWEN_TOKEN_PLAN_MODEL_CATALOG = buildQwenCatalogModels([
	[
		QWEN_37_PLUS_MODEL_ID,
		true,
		["text", "image"],
		1e6,
		65536
	],
	[
		QWEN_36_PLUS_MODEL_ID,
		true,
		["text", "image"],
		1e6,
		65536
	],
	[
		"qwen3-coder-next",
		true,
		["text"],
		262144,
		65536
	],
	[
		"kimi-k2.5",
		true,
		["text", "image"],
		262144,
		98304
	],
	[
		"glm-5",
		true,
		["text"],
		202752,
		16384
	],
	[
		"MiniMax-M2.5",
		true,
		["text"],
		196608,
		32768
	]
]);
const QWEN_MODEL_CATALOG = buildQwenCatalogModels([
	[
		QWEN_DEFAULT_MODEL_ID,
		false,
		["text", "image"],
		1e6,
		65536
	],
	[
		QWEN_36_FLASH_MODEL_ID,
		true,
		["text", "image"],
		1e6,
		65536
	],
	[
		QWEN_36_PLUS_MODEL_ID,
		true,
		["text", "image"],
		1e6,
		65536
	],
	[
		QWEN_37_MAX_MODEL_ID,
		true,
		["text"],
		1e6,
		65536
	],
	[
		QWEN_37_PLUS_MODEL_ID,
		true,
		["text", "image"],
		1e6,
		65536
	],
	[
		"qwen3-max-2026-01-23",
		false,
		["text"],
		262144,
		65536
	],
	[
		"qwen3-coder-next",
		false,
		["text"],
		262144,
		65536
	],
	[
		"qwen3-coder-plus",
		false,
		["text"],
		1e6,
		65536
	],
	[
		"MiniMax-M2.5",
		true,
		["text"],
		1e6,
		65536
	],
	[
		"glm-5",
		false,
		["text"],
		202752,
		16384
	],
	[
		"glm-4.7",
		false,
		["text"],
		202752,
		16384
	],
	[
		"kimi-k2.5",
		false,
		["text", "image"],
		262144,
		32768
	]
]);
function isQwenCodingPlanBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return false;
	try {
		const hostname = new URL(trimmed).hostname.toLowerCase().replace(/\.+$/, "");
		return hostname === "coding.dashscope.aliyuncs.com" || hostname === "coding-intl.dashscope.aliyuncs.com";
	} catch {
		return false;
	}
}
function isQwen36PlusSupportedBaseUrl(_baseUrl) {
	return true;
}
const QWEN_STANDARD_ONLY_MODEL_IDS = /* @__PURE__ */ new Set([QWEN_36_FLASH_MODEL_ID, QWEN_37_MAX_MODEL_ID]);
function isQwenStandardOnlyModelId(modelId) {
	return QWEN_STANDARD_ONLY_MODEL_IDS.has(modelId);
}
function buildQwenModelCatalogForBaseUrl(baseUrl) {
	return isQwenCodingPlanBaseUrl(baseUrl) ? QWEN_MODEL_CATALOG.filter((model) => !isQwenStandardOnlyModelId(model.id)) : QWEN_MODEL_CATALOG;
}
function isNativeQwenBaseUrl(baseUrl) {
	return supportsNativeStreamingUsageCompat({
		providerId: "qwen",
		baseUrl
	});
}
function applyQwenNativeStreamingUsageCompat(provider) {
	return applyProviderNativeStreamingUsageCompat({
		providerId: "qwen",
		providerConfig: provider
	});
}
function buildQwenModelDefinition(params) {
	const catalog = QWEN_MODEL_CATALOG.find((model) => model.id === params.id);
	return {
		id: params.id,
		name: params.name ?? catalog?.name ?? params.id,
		reasoning: params.reasoning ?? catalog?.reasoning ?? false,
		input: params.input ?? (catalog?.input ? [...catalog.input] : ["text"]),
		cost: params.cost ?? catalog?.cost ?? QWEN_DEFAULT_COST,
		contextWindow: params.contextWindow ?? catalog?.contextWindow ?? 262144,
		maxTokens: params.maxTokens ?? catalog?.maxTokens ?? 65536
	};
}
function buildQwenDefaultModelDefinition() {
	return buildQwenModelDefinition({ id: QWEN_DEFAULT_MODEL_ID });
}
/** @deprecated Use QWEN_BASE_URL. */
const MODELSTUDIO_BASE_URL = QWEN_BASE_URL;
/** @deprecated Use QWEN_GLOBAL_BASE_URL. */
const MODELSTUDIO_GLOBAL_BASE_URL = QWEN_GLOBAL_BASE_URL;
/** @deprecated Use QWEN_CN_BASE_URL. */
const MODELSTUDIO_CN_BASE_URL = QWEN_CN_BASE_URL;
/** @deprecated Use QWEN_STANDARD_CN_BASE_URL. */
const MODELSTUDIO_STANDARD_CN_BASE_URL = QWEN_STANDARD_CN_BASE_URL;
/** @deprecated Use QWEN_STANDARD_GLOBAL_BASE_URL. */
const MODELSTUDIO_STANDARD_GLOBAL_BASE_URL = QWEN_STANDARD_GLOBAL_BASE_URL;
/** @deprecated Use QWEN_DEFAULT_MODEL_ID. */
const MODELSTUDIO_DEFAULT_MODEL_ID = QWEN_DEFAULT_MODEL_ID;
/** @deprecated Use QWEN_DEFAULT_COST. */
const MODELSTUDIO_DEFAULT_COST = QWEN_DEFAULT_COST;
/** @deprecated Use qwen/${QWEN_DEFAULT_MODEL_ID}. */
const MODELSTUDIO_DEFAULT_MODEL_REF = `modelstudio/${QWEN_DEFAULT_MODEL_ID}`;
/** @deprecated Use QWEN_MODEL_CATALOG. */
const MODELSTUDIO_MODEL_CATALOG = QWEN_MODEL_CATALOG;
const isNativeModelStudioBaseUrl = isNativeQwenBaseUrl;
const applyModelStudioNativeStreamingUsageCompat = applyQwenNativeStreamingUsageCompat;
const buildModelStudioModelDefinition = buildQwenModelDefinition;
const buildModelStudioDefaultModelDefinition = buildQwenDefaultModelDefinition;
//#endregion
export { MODELSTUDIO_BASE_URL, MODELSTUDIO_CN_BASE_URL, MODELSTUDIO_DEFAULT_COST, MODELSTUDIO_DEFAULT_MODEL_ID, MODELSTUDIO_DEFAULT_MODEL_REF, MODELSTUDIO_GLOBAL_BASE_URL, MODELSTUDIO_MODEL_CATALOG, MODELSTUDIO_STANDARD_CN_BASE_URL, MODELSTUDIO_STANDARD_GLOBAL_BASE_URL, QWEN_36_FLASH_MODEL_ID, QWEN_36_PLUS_MODEL_ID, QWEN_37_MAX_MODEL_ID, QWEN_37_PLUS_MODEL_ID, QWEN_BASE_URL, QWEN_CN_BASE_URL, QWEN_DEFAULT_COST, QWEN_DEFAULT_MODEL_ID, QWEN_DEFAULT_MODEL_REF, QWEN_GLOBAL_BASE_URL, QWEN_MODEL_CATALOG, QWEN_STANDARD_CN_BASE_URL, QWEN_STANDARD_GLOBAL_BASE_URL, QWEN_TOKEN_PLAN_CN_BASE_URL, QWEN_TOKEN_PLAN_DEFAULT_MODEL_ID, QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF, QWEN_TOKEN_PLAN_GLOBAL_BASE_URL, QWEN_TOKEN_PLAN_LEGACY_PROVIDER_ID, QWEN_TOKEN_PLAN_MODEL_CATALOG, QWEN_TOKEN_PLAN_PROVIDER_ID, applyModelStudioNativeStreamingUsageCompat, applyQwenNativeStreamingUsageCompat, buildModelStudioDefaultModelDefinition, buildModelStudioModelDefinition, buildQwenDefaultModelDefinition, buildQwenModelCatalogForBaseUrl, buildQwenModelDefinition, isNativeModelStudioBaseUrl, isNativeQwenBaseUrl, isQwen36PlusSupportedBaseUrl, isQwenCodingPlanBaseUrl, isQwenStandardOnlyModelId, isQwenTokenPlanDeepSeekV4ModelId, isQwenTokenPlanGlmModelId, isQwenTokenPlanKimiModelId, isQwenTokenPlanThinkingOnlyModelId, resolveQwenTokenPlanBaseUrl, supportsQwenTokenPlanGlmMaxThinking };
