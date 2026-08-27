import { r as VENICE_MODEL_CATALOG, t as VENICE_BASE_URL } from "./models-DF-6-fio.js";
//#region extensions/venice/provider-catalog.ts
function buildStaticVeniceProvider() {
	return {
		baseUrl: VENICE_BASE_URL,
		api: "openai-completions",
		models: structuredClone(VENICE_MODEL_CATALOG)
	};
}
//#endregion
export { buildStaticVeniceProvider };
