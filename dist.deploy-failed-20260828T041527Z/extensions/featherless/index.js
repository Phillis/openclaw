import { a as FEATHERLESS_DEFAULT_MODEL_REF, d as openclaw_plugin_default, o as FEATHERLESS_DYNAMIC_COMPAT, t as FEATHERLESS_BASE_URL, u as isFeatherlessCatalogModelId } from "./models-C7rsGn5b.js";
import { applyFeatherlessConfig } from "./onboard.js";
import "./provider-catalog.js";
import { readConfiguredProviderCatalogEntries } from "openclaw/plugin-sdk/provider-catalog-shared";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks, cloneFirstTemplateModel, normalizeModelCompat } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
//#region extensions/featherless/index.ts
const PROVIDER_ID = "featherless";
function resolveFeatherlessDynamicModel(ctx) {
	const modelId = ctx.modelId.trim();
	if (!modelId || isFeatherlessCatalogModelId(modelId)) return;
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId,
		templateIds: ["Qwen/Qwen3-32B"],
		ctx,
		patch: {
			provider: PROVIDER_ID,
			reasoning: false,
			input: ["text"],
			contextWindow: 4096,
			maxTokens: 1024,
			compat: FEATHERLESS_DYNAMIC_COMPAT
		}
	}) ?? normalizeModelCompat({
		id: modelId,
		name: modelId,
		provider: PROVIDER_ID,
		api: "openai-completions",
		baseUrl: FEATHERLESS_BASE_URL,
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 4096,
		maxTokens: 1024,
		compat: FEATHERLESS_DYNAMIC_COMPAT
	});
}
function normalizeFeatherlessResolvedModel(model) {
	return {
		...model,
		compat: {
			...FEATHERLESS_DYNAMIC_COMPAT,
			...model.compat
		}
	};
}
var featherless_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Featherless AI Provider",
	description: "Featherless AI provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Featherless AI",
		docsPath: "/providers/featherless",
		manifestAuth: {
			defaultModel: FEATHERLESS_DEFAULT_MODEL_REF,
			applyConfig: applyFeatherlessConfig,
			noteTitle: "Featherless AI",
			noteMessage: ["Featherless AI serves open models through an OpenAI-compatible API.", "Create an API key at: https://featherless.ai/account/api-keys"].join("\n")
		},
		catalog: {
			allowExplicitBaseUrl: true,
			liveModelDiscovery: {
				endpointPath: "models?capabilities=chat",
				buildRequestHeaders: ({ apiKey }) => ({
					Accept: "application/json",
					"User-Agent": "openclaw",
					...apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
				})
			}
		},
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		normalizeResolvedModel: ({ model }) => normalizeFeatherlessResolvedModel(model),
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai"),
		resolveDynamicModel: (ctx) => resolveFeatherlessDynamicModel(ctx),
		isModernModelRef: () => true
	}
});
//#endregion
export { featherless_default as default };
