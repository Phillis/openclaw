import { n as buildManifestModelProviderConfig } from "./provider-catalog-shared-DkuIv-OV.js";
import { t as openclaw_plugin_default } from "./openclaw.plugin-CzE7JkIG.js";
//#region extensions/together/models.ts
const TOGETHER_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.together;
const TOGETHER_BASE_URL = TOGETHER_MANIFEST_CATALOG.baseUrl;
const TOGETHER_MODEL_CATALOG = buildManifestModelProviderConfig({
	providerId: "together",
	catalog: TOGETHER_MANIFEST_CATALOG
}).models.map((model) => Object.assign(model, { api: "openai-completions" }));
//#endregion
export { TOGETHER_MODEL_CATALOG as n, TOGETHER_BASE_URL as t };
