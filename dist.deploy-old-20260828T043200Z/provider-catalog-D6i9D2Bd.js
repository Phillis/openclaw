import { i as MINIMAX_TEXT_MODEL_ORDER, r as MINIMAX_TEXT_MODEL_CATALOG } from "./provider-models-XT9t8Doj.js";
import { f as resolveMinimaxApiCost, n as DEFAULT_MINIMAX_MAX_TOKENS, r as MINIMAX_API_BASE_URL } from "./model-definitions-BOLM2Ftf.js";
//#region extensions/minimax/provider-catalog.ts
function buildMinimaxModelDiscovery(authMode = "api_key") {
	return {
		endpointPath: "v1/models",
		buildRequestHeaders: ({ apiKey, discoveryApiKey }) => {
			const requestApiKey = discoveryApiKey ?? apiKey;
			if (!requestApiKey) return {};
			return authMode === "oauth" ? { Authorization: `Bearer ${requestApiKey}` } : { "X-Api-Key": requestApiKey };
		}
	};
}
function resolveMinimaxCatalogBaseUrl(env = process.env) {
	const rawHost = env.MINIMAX_API_HOST?.trim();
	if (!rawHost) return MINIMAX_API_BASE_URL;
	try {
		const url = new URL(rawHost);
		const basePath = url.pathname.replace(/\/+$/, "");
		if (basePath.endsWith("/anthropic")) return `${url.origin}${basePath}`;
		return `${url.origin}/anthropic`;
	} catch {
		return MINIMAX_API_BASE_URL;
	}
}
function buildMinimaxModel(params) {
	return {
		id: params.id,
		name: params.name,
		reasoning: params.reasoning,
		input: params.input,
		cost: params.cost,
		contextWindow: params.contextWindow,
		maxTokens: DEFAULT_MINIMAX_MAX_TOKENS
	};
}
function buildMinimaxTextModel(params) {
	return buildMinimaxModel(params);
}
function buildMinimaxCatalog() {
	return MINIMAX_TEXT_MODEL_ORDER.map((id) => {
		const model = MINIMAX_TEXT_MODEL_CATALOG[id];
		return buildMinimaxTextModel({
			id,
			name: model.name,
			reasoning: model.reasoning,
			input: [...model.input],
			cost: resolveMinimaxApiCost(id),
			contextWindow: model.contextWindow
		});
	});
}
function buildMinimaxProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
function buildMinimaxPortalProvider(env) {
	return {
		baseUrl: resolveMinimaxCatalogBaseUrl(env),
		api: "anthropic-messages",
		authHeader: true,
		models: buildMinimaxCatalog()
	};
}
//#endregion
export { resolveMinimaxCatalogBaseUrl as i, buildMinimaxPortalProvider as n, buildMinimaxProvider as r, buildMinimaxModelDiscovery as t };
