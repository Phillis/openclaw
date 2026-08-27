import { m as createModelCatalogPresetAppliers } from "./provider-onboard-B4dg7cZS.js";
import { t as XAI_OAUTH_AUTO_MODEL_ID } from "./model-id-BJsQwvwb.js";
import { a as XAI_DEFAULT_MODEL_ID, l as isLegacyXaiBuiltinModel, s as buildXaiCatalogModels, t as XAI_BASE_URL } from "./model-definitions-C0Hkobsg.js";
//#region extensions/xai/onboard.ts
const XAI_DEFAULT_MODEL_REF = `xai/${XAI_DEFAULT_MODEL_ID}`;
const XAI_OAUTH_DEFAULT_MODEL_REF = `xai/${XAI_OAUTH_AUTO_MODEL_ID}`;
function createXaiPresetAppliers(primaryModelRef) {
	return createModelCatalogPresetAppliers({
		primaryModelRef,
		resolveParams: (_cfg, api) => ({
			providerId: "xai",
			api,
			baseUrl: XAI_BASE_URL,
			catalogModels: buildXaiCatalogModels(),
			aliases: [{
				modelRef: primaryModelRef,
				alias: "Grok"
			}]
		})
	});
}
const xaiPresetAppliers = createXaiPresetAppliers(XAI_DEFAULT_MODEL_REF);
const xaiOAuthPresetAppliers = createXaiPresetAppliers(XAI_OAUTH_DEFAULT_MODEL_REF);
function pruneRetiredXaiBuiltinModels(cfg) {
	const provider = cfg.models?.providers?.xai;
	if (!provider || !Array.isArray(provider.models)) return cfg;
	const models = provider.models.filter((model) => !isLegacyXaiBuiltinModel(model));
	if (models.length === provider.models.length) return cfg;
	return {
		...cfg,
		models: {
			...cfg.models,
			providers: {
				...cfg.models?.providers,
				xai: {
					...provider,
					models
				}
			}
		}
	};
}
function applyXaiProviderConfig(cfg) {
	return xaiPresetAppliers.applyProviderConfig(pruneRetiredXaiBuiltinModels(cfg), "openai-responses");
}
function applyXaiConfig(cfg) {
	return xaiPresetAppliers.applyConfig(pruneRetiredXaiBuiltinModels(cfg), "openai-responses");
}
function applyXaiOAuthConfig(cfg) {
	return xaiOAuthPresetAppliers.applyConfig(pruneRetiredXaiBuiltinModels(cfg), "openai-responses");
}
//#endregion
export { applyXaiProviderConfig as a, applyXaiOAuthConfig as i, XAI_OAUTH_DEFAULT_MODEL_REF as n, applyXaiConfig as r, XAI_DEFAULT_MODEL_REF as t };
