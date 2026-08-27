import { QWEN_CN_BASE_URL, QWEN_DEFAULT_MODEL_REF, QWEN_GLOBAL_BASE_URL, QWEN_STANDARD_CN_BASE_URL, QWEN_STANDARD_GLOBAL_BASE_URL, QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF, QWEN_TOKEN_PLAN_PROVIDER_ID, resolveQwenTokenPlanBaseUrl } from "./models.js";
import { buildQwenProvider, buildQwenTokenPlanProvider } from "./provider-catalog.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/qwen/onboard.ts
const qwenPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: QWEN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const provider = buildQwenProvider({ baseUrl });
		return {
			providerId: "qwen",
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: provider.models ?? [],
			aliases: [...(provider.models ?? []).flatMap((model) => [`qwen/${model.id}`, `modelstudio/${model.id}`]), {
				modelRef: QWEN_DEFAULT_MODEL_REF,
				alias: "Qwen"
			}]
		};
	}
});
const qwenTokenPlanPresetAppliers = createModelCatalogPresetAppliers({
	primaryModelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
	resolveParams: (_cfg, baseUrl) => {
		const provider = buildQwenTokenPlanProvider({ baseUrl });
		return {
			providerId: QWEN_TOKEN_PLAN_PROVIDER_ID,
			api: provider.api ?? "openai-completions",
			baseUrl,
			catalogModels: provider.models ?? [],
			aliases: [...(provider.models ?? []).map((model) => `${QWEN_TOKEN_PLAN_PROVIDER_ID}/${model.id}`), {
				modelRef: QWEN_TOKEN_PLAN_DEFAULT_MODEL_REF,
				alias: "Qwen Token Plan"
			}]
		};
	}
});
function applyQwenConfig(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_GLOBAL_BASE_URL);
}
function applyQwenConfigCn(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_CN_BASE_URL);
}
function applyQwenStandardConfig(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_GLOBAL_BASE_URL);
}
function applyQwenStandardConfigCn(cfg) {
	return qwenPresetAppliers.applyConfig(cfg, QWEN_STANDARD_CN_BASE_URL);
}
function applyQwenTokenPlanConfig(cfg, region) {
	return qwenTokenPlanPresetAppliers.applyConfig(cfg, resolveQwenTokenPlanBaseUrl(region));
}
//#endregion
export { applyQwenConfig, applyQwenConfigCn, applyQwenStandardConfig, applyQwenStandardConfigCn, applyQwenTokenPlanConfig };
