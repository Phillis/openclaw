import { o as buildStaticBasetenModels, r as BASETEN_DEFAULT_MODEL_REF, t as BASETEN_BASE_URL } from "./models-u5dtUSfP.js";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/baseten/onboard.ts
/** Baseten onboarding config helpers. */
/** Applies Baseten's provider catalog, Inkling alias, and default model. */
const { applyConfig: applyBasetenConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: BASETEN_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "baseten",
		api: "openai-completions",
		baseUrl: BASETEN_BASE_URL,
		catalogModels: buildStaticBasetenModels(),
		aliases: [{
			modelRef: BASETEN_DEFAULT_MODEL_REF,
			alias: "Inkling"
		}]
	})
});
//#endregion
export { applyBasetenConfig };
