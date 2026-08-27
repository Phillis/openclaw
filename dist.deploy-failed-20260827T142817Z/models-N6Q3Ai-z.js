import { n as buildManifestModelDefinition } from "./provider-catalog-shared-BrsgLnt3.js";
import { t as openclaw_plugin_default } from "./openclaw.plugin-CzE7JkIG.js";
//#region extensions/together/models.ts
const TOGETHER_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.together;
const TOGETHER_BASE_URL = TOGETHER_MANIFEST_CATALOG.baseUrl;
const TOGETHER_MODEL_CATALOG = TOGETHER_MANIFEST_CATALOG.models.map(buildManifestModelDefinition({
	providerId: "together",
	catalog: TOGETHER_MANIFEST_CATALOG,
	decorate: (model) => ({
		...model,
		api: "openai-completions"
	})
}));
//#endregion
export { TOGETHER_MODEL_CATALOG as n, TOGETHER_BASE_URL as t };
