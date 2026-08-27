import { DEEPINFRA_BASE_URL, DEEPINFRA_MODEL_CATALOG, buildDeepInfraModelDefinition, discoverDeepInfraModels } from "./provider-models.js";
import { buildSingleProviderApiKeyCatalog } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/deepinfra/provider-catalog.ts
function buildStaticDeepInfraProvider() {
	return {
		baseUrl: DEEPINFRA_BASE_URL,
		api: "openai-completions",
		models: DEEPINFRA_MODEL_CATALOG.map(buildDeepInfraModelDefinition)
	};
}
async function buildDeepInfraProvider(options) {
	return {
		baseUrl: DEEPINFRA_BASE_URL,
		api: "openai-completions",
		models: await discoverDeepInfraModels(options)
	};
}
function buildDeepInfraApiKeyCatalog(ctx) {
	return buildSingleProviderApiKeyCatalog({
		ctx,
		providerId: "deepinfra",
		buildProvider: () => buildDeepInfraProvider({
			hasApiKey: true,
			env: ctx.env,
			agentDir: ctx.agentDir
		})
	});
}
//#endregion
export { buildDeepInfraApiKeyCatalog, buildDeepInfraProvider, buildStaticDeepInfraProvider };
