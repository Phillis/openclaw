import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createWebSearchProviderContractFields, mergeScopedSearchConfig, resolveProviderWebSearchPluginConfig } from "openclaw/plugin-sdk/provider-web-search-config-contract";
import { isRecord, normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/perplexity/src/perplexity-web-search-provider.shared.ts
const DEFAULT_PERPLEXITY_BASE_URL = "https://openrouter.ai/api/v1";
const PERPLEXITY_DIRECT_BASE_URL = "https://api.perplexity.ai";
const PERPLEXITY_CREDENTIAL_PATH = "plugins.entries.perplexity.config.webSearch.apiKey";
const PERPLEXITY_ONBOARDING_SCOPES = ["text-inference"];
const PERPLEXITY_KEY_PREFIXES = ["pplx-"];
const OPENROUTER_KEY_PREFIXES = ["sk-or-"];
function createPerplexityWebSearchProviderBase() {
	return {
		id: "perplexity",
		label: "Perplexity Search",
		hint: "Requires Perplexity API key or OpenRouter API key · structured results",
		onboardingScopes: [...PERPLEXITY_ONBOARDING_SCOPES],
		credentialLabel: "Perplexity API key",
		envVars: ["PERPLEXITY_API_KEY", "OPENROUTER_API_KEY"],
		placeholder: "pplx-...",
		signupUrl: "https://www.perplexity.ai/settings/api",
		docsUrl: "https://docs.openclaw.ai/perplexity",
		autoDetectOrder: 50,
		credentialPath: PERPLEXITY_CREDENTIAL_PATH,
		...createWebSearchProviderContractFields({
			credentialPath: PERPLEXITY_CREDENTIAL_PATH,
			searchCredential: {
				type: "scoped",
				scopeId: "perplexity"
			},
			configuredCredential: { pluginId: "perplexity" }
		})
	};
}
function resolvePerplexityWebSearchRuntimeMetadata(ctx) {
	return { perplexityTransport: resolvePerplexityRuntimeTransport({
		searchConfig: mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity")),
		resolvedKey: ctx.resolvedCredential?.value,
		keySource: ctx.resolvedCredential?.source ?? "missing",
		fallbackEnvVar: ctx.resolvedCredential?.fallbackEnvVar
	}) };
}
function inferPerplexityBaseUrlFromApiKey(apiKey) {
	if (!apiKey) return;
	const normalized = normalizeLowercaseStringOrEmpty(apiKey);
	if (PERPLEXITY_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "direct";
	if (OPENROUTER_KEY_PREFIXES.some((prefix) => normalized.startsWith(prefix))) return "openrouter";
}
function isDirectPerplexityBaseUrl(baseUrl) {
	try {
		return normalizeLowercaseStringOrEmpty(new URL(baseUrl.trim()).hostname) === "api.perplexity.ai";
	} catch {
		return false;
	}
}
function resolvePerplexityRuntimeTransport(params) {
	const perplexity = params.searchConfig?.perplexity;
	const scoped = perplexity && typeof perplexity === "object" && !Array.isArray(perplexity) ? perplexity : void 0;
	const configuredBaseUrl = normalizeOptionalString(scoped?.baseUrl) ?? "";
	const configuredModel = normalizeOptionalString(scoped?.model) ?? "";
	const baseUrl = (() => {
		if (configuredBaseUrl) return configuredBaseUrl;
		if (params.keySource === "env") {
			if (params.fallbackEnvVar === "PERPLEXITY_API_KEY") return PERPLEXITY_DIRECT_BASE_URL;
			if (params.fallbackEnvVar === "OPENROUTER_API_KEY") return DEFAULT_PERPLEXITY_BASE_URL;
		}
		if ((params.keySource === "config" || params.keySource === "secretRef") && params.resolvedKey) return inferPerplexityBaseUrlFromApiKey(params.resolvedKey) === "openrouter" ? DEFAULT_PERPLEXITY_BASE_URL : PERPLEXITY_DIRECT_BASE_URL;
		return DEFAULT_PERPLEXITY_BASE_URL;
	})();
	return configuredBaseUrl || configuredModel || !isDirectPerplexityBaseUrl(baseUrl) ? "chat_completions" : "search_api";
}
//#endregion
//#region extensions/perplexity/src/perplexity-web-search-provider.ts
const loadPerplexityWebSearchRuntime = createLazyRuntimeModule(() => import("./perplexity-web-search-provider.runtime-C8Z5RiPA.js"));
function createPerplexityParameters(transport) {
	const properties = {
		query: {
			type: "string",
			description: "Search query string."
		},
		count: {
			type: "integer",
			description: "Number of results to return (1-10).",
			minimum: 1,
			maximum: 10
		},
		freshness: {
			type: "string",
			description: "Filter by time: 'day' (24h), 'week', 'month', or 'year'."
		}
	};
	if (transport !== "chat_completions") {
		properties.country = {
			type: "string",
			description: "Native Perplexity Search API only. 2-letter country code."
		};
		properties.language = {
			type: "string",
			description: "Native Perplexity Search API only. ISO 639-1 language code."
		};
		properties.date_after = {
			type: "string",
			description: "Native Perplexity Search API only. Only results published after this date (YYYY-MM-DD)."
		};
		properties.date_before = {
			type: "string",
			description: "Native Perplexity Search API only. Only results published before this date (YYYY-MM-DD)."
		};
		properties.domain_filter = {
			type: "array",
			items: { type: "string" },
			description: "Native Perplexity Search API only. Domain filter (max 20)."
		};
		properties.max_tokens = {
			type: "integer",
			description: "Native Perplexity Search API only. Total content budget across all results.",
			minimum: 1,
			maximum: 1e6
		};
		properties.max_tokens_per_page = {
			type: "integer",
			description: "Native Perplexity Search API only. Max tokens extracted per page.",
			minimum: 1
		};
	}
	return {
		type: "object",
		properties,
		required: ["query"]
	};
}
function hasPerplexityLegacyOverride(searchConfig) {
	const perplexity = isRecord(searchConfig?.perplexity) ? searchConfig.perplexity : void 0;
	return typeof perplexity?.baseUrl === "string" && perplexity.baseUrl.trim().length > 0 || typeof perplexity?.model === "string" && perplexity.model.trim().length > 0;
}
function createPerplexityToolDefinition(searchConfig, runtimeTransport) {
	const schemaTransport = runtimeTransport ?? (hasPerplexityLegacyOverride(searchConfig) ? "chat_completions" : void 0);
	return {
		description: schemaTransport === "chat_completions" ? "Search the web using Perplexity Sonar via Perplexity/OpenRouter chat completions. Returns AI-synthesized answers with citations from web-grounded search." : "Search the web using Perplexity. Runtime routing decides between native Search API and Sonar chat-completions compatibility. Structured filters are available on the native Search API path.",
		parameters: createPerplexityParameters(schemaTransport),
		execute: async (args, context) => {
			context?.signal?.throwIfAborted();
			const { executePerplexitySearch } = await loadPerplexityWebSearchRuntime();
			return await executePerplexitySearch(args, searchConfig, context?.signal);
		}
	};
}
function createPerplexityWebSearchProvider() {
	return {
		...createPerplexityWebSearchProviderBase(),
		resolveRuntimeMetadata: resolvePerplexityWebSearchRuntimeMetadata,
		createTool: (ctx) => createPerplexityToolDefinition(mergeScopedSearchConfig(ctx.searchConfig, "perplexity", resolveProviderWebSearchPluginConfig(ctx.config, "perplexity")), ctx.runtimeMetadata?.perplexityTransport)
	};
}
//#endregion
export { isDirectPerplexityBaseUrl as a, inferPerplexityBaseUrlFromApiKey as i, DEFAULT_PERPLEXITY_BASE_URL as n, PERPLEXITY_DIRECT_BASE_URL as r, createPerplexityWebSearchProvider as t };
