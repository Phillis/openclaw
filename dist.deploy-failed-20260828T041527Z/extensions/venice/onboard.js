import { n as VENICE_DEFAULT_MODEL_REF, r as VENICE_MODEL_CATALOG, t as VENICE_BASE_URL } from "./models-DF-6-fio.js";
import "./api.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/venice/onboard.ts
const { applyConfig: applyVeniceConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: VENICE_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "venice",
		api: "openai-completions",
		baseUrl: VENICE_BASE_URL,
		catalogModels: structuredClone(VENICE_MODEL_CATALOG),
		aliases: [{
			modelRef: VENICE_DEFAULT_MODEL_REF,
			alias: "GLM 4.7"
		}]
	})
});
//#endregion
export { applyVeniceConfig };
