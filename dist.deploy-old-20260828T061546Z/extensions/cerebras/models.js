import { n as openclaw_plugin_default, t as buildCerebrasProvider } from "./provider-catalog-DvAgfZ4t.js";
//#region extensions/cerebras/models.ts
const CEREBRAS_MANIFEST_CATALOG = openclaw_plugin_default.modelCatalog.providers.cerebras;
/** Base URL for Cerebras OpenAI-compatible inference. */
const CEREBRAS_BASE_URL = CEREBRAS_MANIFEST_CATALOG.baseUrl;
/** Cerebras model catalog entries from the plugin manifest. */
const CEREBRAS_MODEL_CATALOG = CEREBRAS_MANIFEST_CATALOG.models;
/** Builds normalized Cerebras catalog model definitions. */
function buildCerebrasCatalogModels() {
	return buildCerebrasProvider().models;
}
//#endregion
export { CEREBRAS_BASE_URL, CEREBRAS_MODEL_CATALOG, buildCerebrasCatalogModels };
