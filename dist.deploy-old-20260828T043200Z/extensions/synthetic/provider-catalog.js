import { SYNTHETIC_BASE_URL, SYNTHETIC_MODEL_CATALOG, buildSyntheticModelDefinition } from "./models.js";
//#region extensions/synthetic/provider-catalog.ts
function buildSyntheticProvider() {
	return {
		baseUrl: SYNTHETIC_BASE_URL,
		api: "anthropic-messages",
		models: SYNTHETIC_MODEL_CATALOG.map(buildSyntheticModelDefinition)
	};
}
//#endregion
export { buildSyntheticProvider };
