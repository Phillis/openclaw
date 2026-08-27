import { a as FEATHERLESS_DEFAULT_MODEL_REF, l as buildFeatherlessCatalogModels, t as FEATHERLESS_BASE_URL } from "./models-C7rsGn5b.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/featherless/onboard.ts
const { applyConfig: applyFeatherlessConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: FEATHERLESS_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "featherless",
		api: "openai-completions",
		baseUrl: FEATHERLESS_BASE_URL,
		catalogModels: buildFeatherlessCatalogModels(),
		aliases: [{
			modelRef: FEATHERLESS_DEFAULT_MODEL_REF,
			alias: "Qwen3 32B"
		}]
	})
});
//#endregion
export { FEATHERLESS_DEFAULT_MODEL_REF, applyFeatherlessConfig };
