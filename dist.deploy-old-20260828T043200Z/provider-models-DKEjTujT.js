import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { i as normalizeModelCompat } from "./provider-model-compat-VkF92U2_.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./provider-model-shared-QR1VEK28.js";
import { a as resolveXaiOAuthAutoModelId, i as normalizeXaiModelId } from "./model-id-BJsQwvwb.js";
import { u as resolveXaiCatalogEntry } from "./model-definitions-C0Hkobsg.js";
import { t as applyXaiRuntimeModelCompat } from "./runtime-model-compat-CVIhXsR_.js";
//#region extensions/xai/provider-models.ts
const XAI_MODERN_MODEL_PREFIXES = [
	"grok-4.6",
	"grok-4.5",
	"grok-build-0.1",
	"grok-4.3",
	"grok-4.20"
];
function isModernXaiModel(modelId) {
	const lower = normalizeOptionalLowercaseString(normalizeXaiModelId(modelId.trim())) ?? "";
	if (!lower || lower.includes("multi-agent")) return false;
	return XAI_MODERN_MODEL_PREFIXES.some((prefix) => lower.startsWith(prefix));
}
function resolveXaiForwardCompatModel(params) {
	const definition = resolveXaiCatalogEntry(params.ctx.modelId);
	if (!definition) return;
	return applyXaiRuntimeModelCompat(normalizeModelCompat({
		id: definition.id,
		name: definition.name,
		api: params.ctx.providerConfig?.api ?? "openai-responses",
		provider: params.providerId,
		baseUrl: normalizeOptionalString(params.ctx.providerConfig?.baseUrl) ?? "https://api.x.ai/v1",
		reasoning: definition.reasoning,
		input: definition.input,
		cost: definition.cost,
		contextWindow: definition.contextWindow,
		maxTokens: definition.maxTokens
	}));
}
function normalizeXaiResolvedModel(model) {
	const resolvedModelId = resolveXaiOAuthAutoModelId(model.id, model.params);
	return applyXaiRuntimeModelCompat(resolvedModelId === model.id ? model : {
		...model,
		id: resolvedModelId
	});
}
//#endregion
export { normalizeXaiResolvedModel as n, resolveXaiForwardCompatModel as r, isModernXaiModel as t };
