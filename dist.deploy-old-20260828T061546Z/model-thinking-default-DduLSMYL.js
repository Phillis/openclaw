import { _ as resolvePrimaryStringValue, c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.js";
import { t as modelKey } from "./model-key-CMdQNkZf.js";
import { i as legacyModelKey, s as normalizeProviderId } from "./model-ref-shared-D4yx0hwT.js";
import { r as buildConfiguredModelCatalog } from "./model-selection-shared-DbjoXfPH.js";
import { p as resolveThinkingDefaultForModelCore } from "./thinking.shared-bHYuuc1L.js";
import { u as resolveClaudeOpus5ModelIdentity } from "./src-5i09w5fd.js";
import { c as resolveThinkingProfile, o as resolveSupportedThinkingLevel, s as resolveThinkingDefaultForModel } from "./thinking-DLPyZXEW.js";
import "./model-selection-resolve-DhyLO0Qh.js";
//#region src/agents/model-thinking-default-core.ts
function resolveConfiguredThinkingDefaultCore(params) {
	const configuredModels = params.cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(params.provider, params.model);
	const legacyKey = legacyModelKey(params.provider, params.model);
	const perModelThinking = configuredModels?.[canonicalKey]?.params?.thinking ?? (legacyKey ? configuredModels?.[legacyKey]?.params?.thinking : void 0);
	if (perModelThinking === false || perModelThinking === "disabled" || perModelThinking === "none") return "off";
	if (perModelThinking === "off" || perModelThinking === "minimal" || perModelThinking === "low" || perModelThinking === "medium" || perModelThinking === "high" || perModelThinking === "xhigh" || perModelThinking === "adaptive" || perModelThinking === "max" || perModelThinking === "ultra") return perModelThinking;
	return params.cfg.agents?.defaults?.thinkingDefault;
}
function resolveThinkingDefaultCore(params) {
	const normalizedProvider = normalizeProviderId(params.provider);
	const normalizedModel = normalizeLowercaseStringOrEmpty(params.model).replace(/\./g, "-");
	const catalog = Array.isArray(params.catalog) ? params.catalog : buildConfiguredModelCatalog({ cfg: params.cfg });
	const catalogCandidate = catalog.find((entry) => entry.provider === params.provider && entry.id === params.model);
	const configuredModels = params.cfg.agents?.defaults?.models;
	const canonicalKey = modelKey(params.provider, params.model);
	const legacyKey = legacyModelKey(params.provider, params.model);
	const normalizedCanonicalKey = normalizeLowercaseStringOrEmpty(canonicalKey);
	const normalizedLegacyKey = normalizeOptionalLowercaseString(legacyKey);
	const normalizedPrimarySelection = normalizeOptionalLowercaseString(resolvePrimaryStringValue(params.cfg.agents?.defaults?.model));
	const explicitModelConfigured = (configuredModels ? canonicalKey in configuredModels : false) || Boolean(legacyKey && configuredModels && legacyKey in configuredModels) || normalizedPrimarySelection === normalizedCanonicalKey || Boolean(normalizedLegacyKey && normalizedPrimarySelection === normalizedLegacyKey) || normalizedPrimarySelection === normalizeLowercaseStringOrEmpty(params.model);
	const configured = resolveConfiguredThinkingDefaultCore(params);
	if (configured) return configured;
	const isClaudeProvider = normalizedProvider === "anthropic" || normalizedProvider === "anthropic-vertex" || normalizedProvider === "claude-cli";
	if (isClaudeProvider && resolveClaudeOpus5ModelIdentity({ id: normalizedModel })) return "high";
	if (isClaudeProvider && (normalizedModel.startsWith("claude-opus-4-8") || normalizedModel.startsWith("claude-opus-4.8"))) return "off";
	if (isClaudeProvider && (normalizedModel.startsWith("claude-opus-4-7") || normalizedModel.startsWith("claude-opus-4.7"))) return "off";
	if (normalizedProvider === "anthropic" && explicitModelConfigured && typeof catalogCandidate?.name === "string" && /4\.6\b/.test(catalogCandidate.name) && (normalizedModel.startsWith("claude-opus-4-6") || normalizedModel.startsWith("claude-sonnet-4-6"))) return "adaptive";
	const fallbackParams = {
		provider: params.provider,
		model: params.model,
		catalog,
		agentRuntime: params.agentRuntime
	};
	if (!params.providerPolicySource) return resolveThinkingDefaultForModel(fallbackParams);
	const profile = resolveThinkingProfile({
		...fallbackParams,
		providerPolicySource: params.providerPolicySource
	});
	if (profile.defaultLevel) return profile.defaultLevel;
	if (resolveThinkingDefaultForModelCore(fallbackParams) === "off") return "off";
	return resolveSupportedThinkingLevel({
		...fallbackParams,
		level: "medium",
		providerPolicySource: params.providerPolicySource
	});
}
//#endregion
//#region src/agents/model-thinking-default.ts
/** Resolves configured thinking without consulting model capability metadata. */
function resolveConfiguredThinkingDefault(params) {
	return resolveConfiguredThinkingDefaultCore(params);
}
/** Resolves the default thinking level for a provider/model pair. */
function resolveThinkingDefault(params) {
	return resolveThinkingDefaultCore(params);
}
/** Resolves thinking default after loading runtime catalog only when needed. */
async function resolveThinkingDefaultWithRuntimeCatalog(params) {
	const configuredCatalog = buildConfiguredModelCatalog({ cfg: params.cfg });
	const configuredSelectedEntry = configuredCatalog.find((entry) => entry.provider === params.provider && entry.id === params.model);
	const runtimeCatalog = configuredCatalog.length === 0 || !configuredSelectedEntry || configuredSelectedEntry.reasoning === void 0 ? await params.loadRuntimeCatalog() : void 0;
	const catalog = runtimeCatalog?.find((entry) => entry.provider === params.provider && entry.id === params.model) || configuredCatalog.length === 0 ? runtimeCatalog ?? configuredCatalog : configuredCatalog;
	return resolveThinkingDefault({
		cfg: params.cfg,
		provider: params.provider,
		model: params.model,
		catalog,
		agentRuntime: params.agentRuntime
	});
}
//#endregion
export { resolveThinkingDefaultCore as i, resolveThinkingDefault as n, resolveThinkingDefaultWithRuntimeCatalog as r, resolveConfiguredThinkingDefault as t };
