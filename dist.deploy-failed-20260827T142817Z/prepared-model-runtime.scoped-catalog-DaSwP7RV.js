import { i as prepareAgentCatalogSource, o as prepareFullCatalogFacts, s as prepareWorkspaceBuildGroup } from "./prepared-model-runtime.facts-Bz0xgyUJ.js";
//#region src/agents/prepared-model-runtime.scoped-catalog.ts
async function prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, catalogMode) {
	const { agentFacts, pluginGeneration } = await prepareWorkspaceBuildGroup([input.readOnly ? input : {
		...input,
		readOnly: true
	}], catalogMode, { providerDiscoveryProviderIds });
	const agentFactsForInput = agentFacts[0];
	if (!agentFactsForInput) throw new Error("scoped prepared model catalog facts are missing");
	return (await prepareFullCatalogFacts(agentFactsForInput, pluginGeneration, catalogMode, await prepareAgentCatalogSource(agentFactsForInput, pluginGeneration, catalogMode, false, catalogMode === "live" ? { providerDiscoveryProviderIds } : {}))).modelCatalog;
}
/** Builds a request-scoped read-only catalog without executing live provider discovery. */
function prepareScopedReadOnlyModelCatalog(input, providerDiscoveryProviderIds) {
	return prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, "static");
}
/** Builds a request-scoped read-only catalog with live discovery for selected providers. */
function prepareScopedReadOnlyLiveModelCatalog(input, providerDiscoveryProviderIds) {
	return prepareScopedReadOnlyModelCatalogWithMode(input, providerDiscoveryProviderIds, "live");
}
//#endregion
export { prepareScopedReadOnlyModelCatalog as n, prepareScopedReadOnlyLiveModelCatalog as t };
