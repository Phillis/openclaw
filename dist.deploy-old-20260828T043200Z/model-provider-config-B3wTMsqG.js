import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.js";
import { r as normalizeProviderId } from "./provider-id-DMd-TDFp.js";
//#region src/config/model-provider-config.ts
const BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS = /* @__PURE__ */ new Set([
	"amazon-bedrock",
	"amazon-bedrock-mantle",
	"anthropic",
	"anthropic-vertex",
	"arcee",
	"azure-openai-responses",
	"byteplus",
	"byteplus-plan",
	"cerebras",
	"chutes",
	"claude-cli",
	"clawrouter",
	"cloudflare-ai-gateway",
	"codex",
	"comfy",
	"copilot-proxy",
	"dashscope",
	"deepinfra",
	"deepseek",
	"fal",
	"fireworks",
	"github-copilot",
	"gmi",
	"gmi-cloud",
	"gmicloud",
	"google",
	"google-antigravity",
	"google-gemini-cli",
	"google-vertex",
	"groq",
	"huggingface",
	"kilocode",
	"kimi",
	"kimi-coding",
	"litellm",
	"lmstudio",
	"meta",
	"microsoft-foundry",
	"minimax",
	"minimax-portal",
	"mistral",
	"modelstudio",
	"moonshot",
	"moonshot-ai",
	"moonshotai",
	"nvidia",
	"novita",
	"novita-ai",
	"novitaai",
	"ollama",
	"ollama-cloud",
	"openai",
	"opencode",
	"opencode-go",
	"openrouter",
	"qianfan",
	"qwen",
	"qwen-token-plan",
	"qwencloud",
	"sglang",
	"stepfun",
	"stepfun-plan",
	"synthetic",
	"tencent-tokenhub",
	"tencent-tokenplan",
	"together",
	"venice",
	"vercel-ai-gateway",
	"vllm",
	"volcengine",
	"volcengine-plan",
	"vydra",
	"x-ai",
	"xai",
	"xiaomi",
	"xiaomi-token-plan",
	"z.ai",
	"z-ai",
	"zai"
]);
/** Identifies provider overlays already known to the bundled config contract. */
function isBuiltInModelProviderOverlayId(providerId) {
	return BUILT_IN_MODEL_PROVIDER_OVERLAY_IDS.has(normalizeProviderId(providerId));
}
/** Indexes configured model rows after caller-owned model-id normalization. */
function resolveMergedModelProviderModels(params) {
	const models = /* @__PURE__ */ new Map();
	for (const model of params.models ?? []) {
		const modelId = params.normalizeModelId(model.id);
		if (!modelId) continue;
		const existing = models.get(modelId);
		models.set(modelId, existing ? {
			...model,
			...existing
		} : model);
	}
	return models;
}
function normalizeModelId(provider, modelId) {
	const trimmed = modelId.trim();
	const slashIndex = trimmed.indexOf("/");
	return slashIndex > 0 && normalizeProviderId(trimmed.slice(0, slashIndex)) === normalizeProviderId(provider) ? trimmed.slice(slashIndex + 1).trim() : trimmed;
}
function hasNonEmptyRecord(value) {
	const record = asOptionalRecord(value);
	return record !== void 0 && Object.keys(record).length > 0;
}
function hasRequestCompatOverrides(compat) {
	return Object.entries(compat ?? {}).some(([key, value]) => {
		if (key === "supportsReasoningEffort") return value !== true;
		if (key === "supportedReasoningEfforts") return !(Array.isArray(value) && value.length > 0 && value.every((effort) => typeof effort === "string" && /^(minimal|low|medium|high|xhigh|max|ultra)$/u.test(effort)));
		return true;
	});
}
/** Projects authored request behavior without exposing values or local commands. */
function resolveModelProviderRouteOverridePresence(params) {
	const providerConfig = resolveMergedModelProviderConfig(params.authoredConfig, params.provider);
	if (!providerConfig) return "none";
	if (asOptionalRecord(providerConfig.localService) !== void 0 || hasNonEmptyRecord(providerConfig.headers) || hasNonEmptyRecord(providerConfig.request) || hasNonEmptyRecord(providerConfig.params) || typeof providerConfig.authHeader === "boolean" || typeof providerConfig.timeoutSeconds === "number") return "present";
	if (!params.modelId) return "none";
	const canonicalize = (modelId) => {
		const normalized = normalizeModelId(params.provider, modelId);
		return params.canonicalizeModelId?.(normalized).trim() || normalized;
	};
	const modelId = canonicalize(params.modelId);
	const configuredModel = resolveMergedModelProviderModels({
		models: providerConfig.models,
		normalizeModelId: canonicalize
	}).get(modelId);
	return configuredModel && (hasNonEmptyRecord(configuredModel.headers) || hasNonEmptyRecord(configuredModel.params) || hasRequestCompatOverrides(configuredModel.compat)) ? "present" : "none";
}
/** Resolves the provider entry produced by models-config key normalization. */
function resolveMergedModelProviderEntry(config, provider) {
	const requestedProvider = provider.trim();
	const normalizedProvider = normalizeProviderId(requestedProvider);
	if (!normalizedProvider) return;
	const providers = Object.entries(config?.models?.providers ?? {});
	const exactKey = providers.find(([providerId]) => providerId.trim() === requestedProvider)?.[0];
	const fallbackKey = providers.find(([providerId]) => normalizeProviderId(providerId) === normalizedProvider)?.[0];
	const providerKey = (exactKey ?? fallbackKey)?.trim();
	if (!providerKey) return;
	let matched;
	for (const [providerId, providerConfig] of providers) {
		if (providerId.trim() !== providerKey) continue;
		matched = matched ? {
			...matched,
			...providerConfig,
			models: providerConfig.models ?? matched.models
		} : providerConfig;
	}
	return matched ? {
		providerKey,
		providerConfig: matched
	} : void 0;
}
/** Resolves only the merged provider config when its canonical key is not needed. */
function resolveMergedModelProviderConfig(config, provider) {
	return resolveMergedModelProviderEntry(config, provider)?.providerConfig;
}
//#endregion
export { resolveModelProviderRouteOverridePresence as a, resolveMergedModelProviderModels as i, resolveMergedModelProviderConfig as n, resolveMergedModelProviderEntry as r, isBuiltInModelProviderOverlayId as t };
