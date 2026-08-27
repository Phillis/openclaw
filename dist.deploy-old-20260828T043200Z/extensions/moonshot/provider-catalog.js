import { t as openclaw_plugin_default } from "./openclaw.plugin-BLi5Z-ZR.js";
import { applyProviderNativeStreamingUsageCompat, buildManifestModelProviderConfig, readManifestProviderDefaultModelRef } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/moonshot/provider-catalog.ts
const MOONSHOT_BASE_URL = "https://api.moonshot.ai/v1";
const MOONSHOT_CN_BASE_URL = "https://api.moonshot.cn/v1";
const MOONSHOT_DEFAULT_MODEL_REF = readManifestProviderDefaultModelRef(openclaw_plugin_default, "moonshot");
const MOONSHOT_DEFAULT_MODEL_ID = MOONSHOT_DEFAULT_MODEL_REF.slice(9);
function isNativeMoonshotBaseUrl(baseUrl) {
	return [MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL].some((official) => baseUrl === official || baseUrl === `${official}/`);
}
function applyMoonshotNativeStreamingUsageCompat(provider) {
	return applyProviderNativeStreamingUsageCompat({
		providerId: "moonshot",
		providerConfig: provider
	});
}
function buildMoonshotProvider() {
	return buildManifestModelProviderConfig({
		providerId: "moonshot",
		catalog: openclaw_plugin_default.modelCatalog.providers.moonshot
	});
}
//#endregion
export { MOONSHOT_BASE_URL, MOONSHOT_CN_BASE_URL, MOONSHOT_DEFAULT_MODEL_ID, MOONSHOT_DEFAULT_MODEL_REF, applyMoonshotNativeStreamingUsageCompat, buildMoonshotProvider, isNativeMoonshotBaseUrl };
