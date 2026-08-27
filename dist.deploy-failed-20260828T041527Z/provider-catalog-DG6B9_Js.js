import { i as discoverHuggingfaceModels, n as HUGGINGFACE_MODEL_CATALOG, t as HUGGINGFACE_BASE_URL } from "./models-UrVJq5-C.js";
//#region extensions/huggingface/provider-catalog.ts
async function buildHuggingfaceProvider(discoveryApiKey) {
	const resolvedSecret = discoveryApiKey?.trim() ?? "";
	return {
		baseUrl: HUGGINGFACE_BASE_URL,
		api: "openai-completions",
		models: resolvedSecret !== "" ? await discoverHuggingfaceModels(resolvedSecret) : HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model))
	};
}
//#endregion
export { buildHuggingfaceProvider as t };
