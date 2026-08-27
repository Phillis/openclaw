import { n as buildGoogleStaticCatalogProvider, r as buildGoogleVertexStaticCatalogProvider } from "../../provider-catalog-Cm9aUSyM.js";
import { r as resolveGoogleVertexConfigApiKey } from "../../vertex-adc-CiH3WTeV.js";
//#region extensions/google/provider-discovery.ts
const googleProviderDiscovery = {
	id: "google",
	label: "Google AI Studio",
	docsPath: "/providers/models",
	auth: [],
	resolveConfigApiKey: ({ provider, env }) => provider === "google-vertex" ? resolveGoogleVertexConfigApiKey(env) : void 0,
	staticCatalog: {
		order: "simple",
		run: async () => ({ providers: {
			google: buildGoogleStaticCatalogProvider(),
			"google-vertex": buildGoogleVertexStaticCatalogProvider()
		} })
	}
};
//#endregion
export { googleProviderDiscovery as default };
