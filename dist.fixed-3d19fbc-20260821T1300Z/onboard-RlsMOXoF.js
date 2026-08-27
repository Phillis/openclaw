import { m as createModelCatalogPresetAppliers } from "./provider-onboard-DSzC4JPQ.js";
import { c as readManifestProviderDefaultModelRef } from "./provider-catalog-shared-DQtlsVxE.js";
import { t as openclaw_plugin_default } from "./openclaw.plugin-CzE7JkIG.js";
import { n as TOGETHER_MODEL_CATALOG, t as TOGETHER_BASE_URL } from "./models-iSjZ3Vhk.js";
//#region extensions/together/onboard.ts
const TOGETHER_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "together");
const { applyConfig: applyTogetherConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: TOGETHER_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: "together",
		api: "openai-completions",
		baseUrl: TOGETHER_BASE_URL,
		catalogModels: structuredClone(TOGETHER_MODEL_CATALOG),
		aliases: [{
			modelRef: TOGETHER_DEFAULT_MODEL_REF,
			alias: "Together AI"
		}]
	})
});
//#endregion
export { applyTogetherConfig as n, TOGETHER_DEFAULT_MODEL_REF as t };
