import { QWEN_TOKEN_PLAN_MODEL_CATALOG, buildQwenModelCatalogForBaseUrl } from "./models.js";
//#region extensions/qwen/provider-catalog.ts
function buildQwenProvider(params) {
	const baseUrl = params?.baseUrl ?? "https://coding-intl.dashscope.aliyuncs.com/v1";
	return {
		baseUrl,
		api: "openai-completions",
		models: buildQwenModelCatalogForBaseUrl(baseUrl).map((model) => Object.assign({}, model))
	};
}
function buildQwenTokenPlanProvider(params) {
	return {
		baseUrl: params?.baseUrl ?? "https://token-plan.ap-southeast-1.maas.aliyuncs.com/compatible-mode/v1",
		api: "openai-completions",
		models: QWEN_TOKEN_PLAN_MODEL_CATALOG.map((model) => Object.assign({}, model))
	};
}
const buildModelStudioProvider = buildQwenProvider;
//#endregion
export { buildModelStudioProvider, buildQwenProvider, buildQwenTokenPlanProvider };
