import { a as buildProviderReplayFamilyHooks } from "../../provider-model-shared-Br4ZCuuk.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-C87pT-oh.js";
import { t as opencodeGoMediaUnderstandingProvider } from "../../media-understanding-provider-C042i7zv.js";
import { t as OPENCODE_GO_DEFAULT_MODEL_REF } from "../../onboard-Bp8A_rOc.js";
import { a as normalizeOpencodeGoBaseUrl, c as resolveOpencodeGoStarterModel, i as listOpencodeGoModelCatalogEntries, n as buildStaticOpencodeGoProviderConfig, o as normalizeOpencodeGoResolvedModel, s as resolveOpencodeGoModel, t as buildOpencodeGoLiveProviderConfig } from "../../provider-catalog-DzZhDE6c.js";
import { r as resolveThinkingProfile } from "../../provider-policy-api-DgyFUSEt.js";
import { t as createOpencodeGoWrapper } from "../../stream-CH2RxqVW.js";
//#region extensions/opencode-go/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "opencode-go",
	icon: "https://cdn.simpleicons.org/opencode",
	activation: { "onStartup": false },
	providerCatalogEntry: "./provider-discovery.ts",
	enabledByDefault: true,
	providers: ["opencode-go"],
	providerEndpoints: [{
		"endpointClass": "opencode-native",
		"hostSuffixes": ["opencode.ai"]
	}],
	providerRequest: { "providers": { "opencode-go": { "family": "opencode" } } },
	modelCatalog: {
		"providers": { "opencode-go": {
			"baseUrl": "https://opencode.ai/zen/go/v1",
			"api": "openai-completions",
			"models": [
				{
					"id": "deepseek-v4-pro",
					"name": "DeepSeek V4 Pro",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .435,
						"output": .87,
						"cacheRead": .003625,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["high", "max"],
						"maxTokensField": "max_tokens",
						"supportsDeveloperRole": false,
						"supportsStrictMode": false,
						"codeMode": "capable"
					}
				},
				{
					"id": "deepseek-v4-flash",
					"name": "DeepSeek V4 Flash",
					"reasoning": true,
					"input": ["text"],
					"contextWindow": 1e6,
					"maxTokens": 384e3,
					"cost": {
						"input": .14,
						"output": .28,
						"cacheRead": .0028,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"low",
							"high",
							"max"
						],
						"maxTokensField": "max_tokens",
						"supportsDeveloperRole": false,
						"supportsStrictMode": false,
						"codeMode": "capable"
					}
				},
				{
					"id": "kimi-k3",
					"name": "Kimi K3",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1048576,
					"maxTokens": 131072,
					"cost": {
						"input": 3,
						"output": 15,
						"cacheRead": .3,
						"cacheWrite": 0
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": ["max"],
						"maxTokensField": "max_tokens",
						"supportsDeveloperRole": false,
						"supportsStrictMode": false,
						"codeMode": "capable"
					}
				},
				{
					"id": "gpt-5.6-luna",
					"name": "GPT-5.6 Luna",
					"api": "openai-responses",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 105e4,
					"contextTokens": 922e3,
					"maxTokens": 128e3,
					"cost": {
						"input": .2,
						"output": 1.2,
						"cacheRead": .02,
						"cacheWrite": .25,
						"tieredPricing": [{
							"input": .2,
							"output": 1.2,
							"cacheRead": .02,
							"cacheWrite": .25,
							"range": [0, 272e3]
						}, {
							"input": .4,
							"output": 1.8,
							"cacheRead": .04,
							"cacheWrite": .5,
							"range": [272e3]
						}]
					},
					"compat": {
						"supportsUsageInStreaming": true,
						"supportsReasoningEffort": true,
						"supportedReasoningEfforts": [
							"none",
							"low",
							"medium",
							"high",
							"xhigh",
							"max"
						],
						"maxTokensField": "max_tokens",
						"codeMode": "capable"
					}
				},
				{
					"id": "qwen3.8-max",
					"name": "Qwen3.8 Max",
					"api": "anthropic-messages",
					"baseUrl": "https://opencode.ai/zen/go",
					"reasoning": true,
					"input": ["text", "image"],
					"contextWindow": 1e6,
					"maxTokens": 131072,
					"cost": {
						"input": 2,
						"output": 6,
						"cacheRead": .25,
						"cacheWrite": 2.5
					},
					"compat": {
						"thinkingFormat": "qwen",
						"codeMode": "capable"
					}
				}
			]
		} },
		"discovery": { "opencode-go": "runtime" }
	},
	setup: { "providers": [{
		"id": "opencode-go",
		"envVars": ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "opencode-go",
		"method": "api-key",
		"choiceId": "opencode-go",
		"appGuidedSecret": true,
		"choiceLabel": "OpenCode Go catalog",
		"groupId": "opencode",
		"groupLabel": "OpenCode",
		"groupHint": "Shared API key infrastructure for Zen + Go",
		"optionKey": "opencodeGoApiKey",
		"cliFlag": "--opencode-go-api-key",
		"cliOption": "--opencode-go-api-key <key>",
		"cliDescription": "OpenCode API key (Go catalog)"
	}],
	contracts: { "mediaUnderstandingProviders": ["opencode-go"] },
	mediaUnderstandingProviderMetadata: { "opencode-go": {
		"capabilities": ["image"],
		"defaultModels": { "image": "kimi-k2.6" }
	} },
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/opencode-go/index.ts
const PROVIDER_ID = "opencode-go";
function resolveOpencodeGoCatalogAuth(resolveProviderApiKey) {
	const own = resolveProviderApiKey(PROVIDER_ID);
	if (own.apiKey || own.discoveryApiKey) return own;
	const shared = resolveProviderApiKey("opencode");
	return shared.apiKey || shared.discoveryApiKey ? shared : void 0;
}
var opencode_go_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "OpenCode Go Provider",
	description: "Official OpenCode Go provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "OpenCode Go",
		docsPath: "/providers/models",
		envVars: ["OPENCODE_API_KEY", "OPENCODE_ZEN_API_KEY"],
		manifestAuth: {
			hint: "Shared API key infrastructure for Zen + Go",
			promptMessage: "Enter OpenCode API key",
			profileIds: ["opencode:default", "opencode-go:default"],
			defaultModel: OPENCODE_GO_DEFAULT_MODEL_REF,
			resolveDefaultModel: async ({ apiKey, signal }) => await resolveOpencodeGoStarterModel({
				apiKey,
				preferredModelRef: OPENCODE_GO_DEFAULT_MODEL_REF,
				...signal ? { signal } : {}
			}),
			expectedProviders: ["opencode", "opencode-go"],
			noteMessage: [
				"OpenCode Go is a separate paid subscription that uses the shared OpenCode API key.",
				"Go focuses on Kimi, GLM, and MiniMax coding models.",
				"Get your API key at: https://opencode.ai/auth"
			].join("\n"),
			noteTitle: "OpenCode"
		},
		normalizeConfig: ({ providerConfig }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: providerConfig.api,
				baseUrl: providerConfig.baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== providerConfig.baseUrl ? {
				...providerConfig,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		normalizeResolvedModel: ({ model }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: model.api,
				baseUrl: model.baseUrl
			});
			const baseUrlNormalized = normalizedBaseUrl && normalizedBaseUrl !== model.baseUrl ? {
				...model,
				baseUrl: normalizedBaseUrl
			} : model;
			const modelNormalized = normalizeOpencodeGoResolvedModel(baseUrlNormalized);
			if (modelNormalized) return modelNormalized;
			return baseUrlNormalized !== model ? baseUrlNormalized : void 0;
		},
		normalizeTransport: ({ api: apiLocal, baseUrl }) => {
			const normalizedBaseUrl = normalizeOpencodeGoBaseUrl({
				api: apiLocal,
				baseUrl
			});
			return normalizedBaseUrl && normalizedBaseUrl !== baseUrl ? {
				api: apiLocal,
				baseUrl: normalizedBaseUrl
			} : void 0;
		},
		resolveDynamicModel: ({ modelId }) => resolveOpencodeGoModel(modelId),
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const auth = resolveOpencodeGoCatalogAuth(ctx.resolveProviderApiKey);
				if (!auth) return null;
				if (!auth.discoveryApiKey) return { provider: buildStaticOpencodeGoProviderConfig(auth.apiKey) };
				return { provider: await buildOpencodeGoLiveProviderConfig({
					apiKey: auth.apiKey ?? auth.discoveryApiKey,
					discoveryApiKey: auth.discoveryApiKey
				}) };
			}
		},
		augmentModelCatalog: () => listOpencodeGoModelCatalogEntries(),
		...buildProviderReplayFamilyHooks({ family: "passthrough-gemini" }),
		resolveThinkingProfile,
		wrapStreamFn: (ctx) => createOpencodeGoWrapper(ctx.streamFn, ctx.thinkingLevel),
		isModernModelRef: () => true
	},
	register(api) {
		api.registerMediaUnderstandingProvider(opencodeGoMediaUnderstandingProvider);
	}
});
//#endregion
export { opencode_go_default as default };
