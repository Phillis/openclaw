import { LONGCAT_BASE_URL, LONGCAT_DEFAULT_MODEL_REF, LONGCAT_MODEL_CATALOG } from "./models.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/longcat/onboard.ts
const { applyConfig: applyLongCatConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: LONGCAT_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "longcat",
		api: "openai-completions",
		baseUrl: LONGCAT_BASE_URL,
		catalogModels: LONGCAT_MODEL_CATALOG,
		aliases: [{
			modelRef: LONGCAT_DEFAULT_MODEL_REF,
			alias: "LongCat 2.0"
		}]
	})
});
//#endregion
export { applyLongCatConfig };
