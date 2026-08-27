import { createWebSearchProviderContractFields, enablePluginInConfig } from "openclaw/plugin-sdk/provider-web-search-contract";
//#region extensions/firecrawl/web-search-shared.ts
const FIRECRAWL_CREDENTIAL_PATH = "plugins.entries.firecrawl.config.webSearch.apiKey";
const FIRECRAWL_FETCH_CREDENTIAL_PATH = "plugins.entries.firecrawl.config.webFetch.apiKey";
function getConfiguredFirecrawlFetchCredentialFallback(config) {
	const apiKey = (config?.plugins?.entries?.firecrawl?.config)?.webFetch?.apiKey;
	return apiKey === void 0 ? void 0 : {
		path: FIRECRAWL_FETCH_CREDENTIAL_PATH,
		value: apiKey
	};
}
function buildFirecrawlWebSearchProviderBase() {
	const contractFields = createWebSearchProviderContractFields({
		credentialPath: FIRECRAWL_CREDENTIAL_PATH,
		searchCredential: {
			type: "scoped",
			scopeId: "firecrawl"
		},
		configuredCredential: { pluginId: "firecrawl" }
	});
	return {
		id: "firecrawl",
		label: "Firecrawl Search",
		hint: "Structured results with optional result scraping",
		onboardingScopes: ["text-inference"],
		credentialLabel: "Firecrawl API key",
		envVars: ["FIRECRAWL_API_KEY"],
		placeholder: "fc-...",
		signupUrl: "https://www.firecrawl.dev/",
		docsUrl: "https://docs.openclaw.ai/tools/firecrawl",
		autoDetectOrder: 60,
		credentialPath: FIRECRAWL_CREDENTIAL_PATH,
		...contractFields,
		applySelectionConfig: (config) => {
			const enabled = enablePluginInConfig(config, "firecrawl");
			if (!enabled.enabled || enabled.config.tools?.web?.fetch?.provider) return enabled.config;
			return {
				...enabled.config,
				tools: {
					...enabled.config.tools,
					web: {
						...enabled.config.tools?.web,
						fetch: {
							...enabled.config.tools?.web?.fetch,
							provider: "firecrawl"
						}
					}
				}
			};
		},
		getConfiguredCredentialFallback: getConfiguredFirecrawlFetchCredentialFallback
	};
}
function buildFirecrawlFreeWebSearchProviderBase() {
	return {
		id: "firecrawl-free",
		label: "Firecrawl Search (Free)",
		hint: "Free web search via Firecrawl's hosted starter tier — no API key required",
		onboardingScopes: ["text-inference"],
		requiresCredential: false,
		envVars: [],
		placeholder: "(no key needed)",
		signupUrl: "https://www.firecrawl.dev/",
		docsUrl: "https://docs.openclaw.ai/tools/firecrawl",
		credentialPath: "",
		...createWebSearchProviderContractFields({
			credentialPath: "",
			searchCredential: {
				type: "scoped",
				scopeId: "firecrawl-free"
			},
			selectionPluginId: "firecrawl"
		})
	};
}
//#endregion
export { buildFirecrawlFreeWebSearchProviderBase, buildFirecrawlWebSearchProviderBase };
