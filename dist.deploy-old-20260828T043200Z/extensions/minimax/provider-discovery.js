import { n as buildMinimaxPortalProvider, r as buildMinimaxProvider } from "../../provider-catalog-D6i9D2Bd.js";
//#region extensions/minimax/provider-discovery.ts
const minimaxProviderDiscovery = [{
	id: "minimax",
	label: "MiniMax",
	docsPath: "/providers/minimax",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async (ctx) => ({ providers: { minimax: buildMinimaxProvider(ctx.env) } })
	}
}, {
	id: "minimax-portal",
	label: "MiniMax",
	docsPath: "/providers/minimax",
	auth: [],
	staticCatalog: {
		order: "simple",
		run: async (ctx) => ({ providers: { "minimax-portal": buildMinimaxPortalProvider(ctx.env) } })
	}
}];
//#endregion
export { minimaxProviderDiscovery as default };
