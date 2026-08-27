import { a as TOKENPLAN_MODEL_CATALOG, i as TOKENPLAN_BASE_URL, n as TOKENHUB_MODEL_CATALOG, o as TOKENPLAN_PROVIDER_ID, r as TOKENHUB_PROVIDER_ID, s as openclaw_plugin_default, t as TOKENHUB_BASE_URL } from "./models-B2pfwcxZ.js";
import { readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
import { createModelCatalogPresetAppliers } from "openclaw/plugin-sdk/provider-onboard";
//#region extensions/tencent/onboard.ts
const TOKENHUB_PREVIEW_MODEL_REF = `${TOKENHUB_PROVIDER_ID}/hy3-preview`;
const TOKENHUB_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, TOKENHUB_PROVIDER_ID);
const { applyConfig: applyTokenHubConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: TOKENHUB_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: TOKENHUB_PROVIDER_ID,
		api: "openai-completions",
		baseUrl: TOKENHUB_BASE_URL,
		catalogModels: structuredClone(TOKENHUB_MODEL_CATALOG),
		aliases: [{
			modelRef: TOKENHUB_DEFAULT_MODEL_REF,
			alias: "Hy3 (TokenHub)"
		}, {
			modelRef: TOKENHUB_PREVIEW_MODEL_REF,
			alias: "Hy3 preview (TokenHub)"
		}]
	})
});
const TOKENPLAN_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, TOKENPLAN_PROVIDER_ID);
const { applyConfig: applyTokenPlanConfig } = createModelCatalogPresetAppliers({
	primaryModelRef: TOKENPLAN_DEFAULT_MODEL_REF,
	resolveParams: () => ({
		providerId: TOKENPLAN_PROVIDER_ID,
		api: "openai-completions",
		baseUrl: TOKENPLAN_BASE_URL,
		catalogModels: structuredClone(TOKENPLAN_MODEL_CATALOG),
		aliases: [{
			modelRef: TOKENPLAN_DEFAULT_MODEL_REF,
			alias: "Hy3 (TokenPlan)"
		}]
	})
});
//#endregion
export { TOKENHUB_DEFAULT_MODEL_REF, TOKENPLAN_DEFAULT_MODEL_REF, applyTokenHubConfig, applyTokenPlanConfig };
