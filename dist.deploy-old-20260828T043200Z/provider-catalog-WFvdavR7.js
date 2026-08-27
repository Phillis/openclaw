import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-DkuIv-OV.js";
import { t as openclaw_plugin_default } from "./openclaw.plugin-CzE7JkIG.js";
//#region extensions/together/provider-catalog.ts
function buildTogetherProvider() {
	return buildManifestModelProviderConfig({
		providerId: "together",
		catalog: openclaw_plugin_default.modelCatalog.providers.together
	});
}
//#endregion
export { buildTogetherProvider as t };
