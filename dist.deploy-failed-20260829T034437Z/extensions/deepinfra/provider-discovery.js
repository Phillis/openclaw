import { buildDeepInfraApiKeyCatalog, buildStaticDeepInfraProvider } from "./provider-catalog.js";
//#region extensions/deepinfra/provider-discovery.ts
const deepinfraProviderDiscovery = {
	id: "deepinfra",
	label: "DeepInfra",
	docsPath: "/providers/deepinfra",
	auth: [],
	catalog: {
		order: "simple",
		run: (ctx) => buildDeepInfraApiKeyCatalog(ctx)
	},
	staticCatalog: {
		order: "simple",
		run: async () => ({ provider: buildStaticDeepInfraProvider() })
	}
};
//#endregion
export { deepinfraProviderDiscovery as default };
