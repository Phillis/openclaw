import { i as resolveGoogleThinkingProfile, t as normalizeGoogleProviderConfig } from "../../provider-policy-B27uKd6x.js";
//#region extensions/google/provider-policy-api.ts
function normalizeConfig(params) {
	return normalizeGoogleProviderConfig(params.provider, params.providerConfig);
}
function resolveThinkingProfile(context) {
	return resolveGoogleThinkingProfile(context);
}
//#endregion
export { normalizeConfig, resolveThinkingProfile };
