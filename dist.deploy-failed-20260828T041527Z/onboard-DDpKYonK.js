import { m as createModelCatalogPresetAppliers } from "./provider-onboard-B4dg7cZS.js";
import { n as HUGGINGFACE_MODEL_CATALOG, t as HUGGINGFACE_BASE_URL } from "./models-UrVJq5-C.js";
//#region extensions/huggingface/onboard.ts
const HUGGINGFACE_DEFAULT_MODEL_REF = "huggingface/deepseek-ai/DeepSeek-R1";
const { applyConfig: applyHuggingfaceConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "huggingface",
		api: "openai-completions",
		baseUrl: HUGGINGFACE_BASE_URL,
		catalogModels: HUGGINGFACE_MODEL_CATALOG.map((model) => Object.assign({}, model)),
		aliases: [{
			modelRef: HUGGINGFACE_DEFAULT_MODEL_REF,
			alias: "Hugging Face"
		}]
	})
});
//#endregion
export { applyHuggingfaceConfig as n, HUGGINGFACE_DEFAULT_MODEL_REF as t };
