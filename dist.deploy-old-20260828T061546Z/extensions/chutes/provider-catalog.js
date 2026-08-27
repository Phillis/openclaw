import { n as CHUTES_MODEL_CATALOG, r as discoverChutesModels, t as CHUTES_BASE_URL } from "./models-Df7LGSwe.js";
//#region extensions/chutes/provider-catalog.ts
/** Builds the static Chutes provider catalog from bundled model metadata. */
function buildStaticChutesProvider() {
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: structuredClone(CHUTES_MODEL_CATALOG)
	};
}
/**
* Build the Chutes provider with dynamic model discovery.
* Falls back to the static catalog on failure.
* Accepts an optional access token (API key or OAuth access token) for authenticated discovery.
*/
async function buildChutesProvider(accessToken) {
	const models = await discoverChutesModels(accessToken);
	return {
		baseUrl: CHUTES_BASE_URL,
		api: "openai-completions",
		models: models.length > 0 ? models : structuredClone(CHUTES_MODEL_CATALOG)
	};
}
//#endregion
export { buildChutesProvider, buildStaticChutesProvider };
