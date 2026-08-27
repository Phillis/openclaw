import { t as openclaw_plugin_default } from "./openclaw.plugin-F3v5rB_A.js";
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/longcat/models.ts
const LONGCAT_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
	providerId: "longcat",
	catalog: openclaw_plugin_default.modelCatalog.providers.longcat
});
const LONGCAT_BASE_URL = LONGCAT_MANIFEST_PROVIDER.baseUrl;
const LONGCAT_MODEL_CATALOG = LONGCAT_MANIFEST_PROVIDER.models;
const LONGCAT_DEFAULT_MODEL_ID = "LongCat-2.0";
const LONGCAT_DEFAULT_MODEL_REF = `longcat/${LONGCAT_DEFAULT_MODEL_ID}`;
//#endregion
export { LONGCAT_BASE_URL, LONGCAT_DEFAULT_MODEL_ID, LONGCAT_DEFAULT_MODEL_REF, LONGCAT_MODEL_CATALOG };
