import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
//#region extensions/cerebras/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "cerebras",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["cerebras"],
	providerEndpoints: [{
		"endpointClass": "cerebras-native",
		"hosts": ["api.cerebras.ai"]
	}],
	providerRequest: { "providers": { "cerebras": { "family": "cerebras" } } },
	modelCatalog: {
		"providers": { "cerebras": {
			"baseUrl": "https://api.cerebras.ai/v1",
			"api": "openai-completions",
			"defaultModel": "gemma-4-31b",
			"models": [
				{
					"id": "zai-glm-4.7",
					"name": "Z.ai GLM 4.7",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": 2.25,
						"output": 2.75,
						"cacheRead": 2.25,
						"cacheWrite": 2.75
					}
				},
				{
					"id": "gpt-oss-120b",
					"name": "GPT OSS 120B",
					"input": ["text"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": .35,
						"output": .75,
						"cacheRead": .35,
						"cacheWrite": .75
					}
				},
				{
					"id": "gemma-4-31b",
					"name": "Gemma 4 31B",
					"input": ["text", "image"],
					"reasoning": true,
					"contextWindow": 131072,
					"maxTokens": 40960,
					"cost": {
						"input": .99,
						"output": 1.49,
						"cacheRead": .99,
						"cacheWrite": 1.49
					}
				}
			]
		} },
		"discovery": { "cerebras": "static" }
	},
	setup: { "providers": [{
		"id": "cerebras",
		"envVars": ["CEREBRAS_API_KEY"]
	}] },
	providerAuthChoices: [{
		"provider": "cerebras",
		"method": "api-key",
		"choiceId": "cerebras-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Cerebras API key",
		"groupId": "cerebras",
		"groupLabel": "Cerebras",
		"groupHint": "Fast OpenAI-compatible inference",
		"optionKey": "cerebrasApiKey",
		"cliFlag": "--cerebras-api-key",
		"cliOption": "--cerebras-api-key <key>",
		"cliDescription": "Cerebras API key"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": {}
	}
};
//#endregion
//#region extensions/cerebras/provider-catalog.ts
/**
* Cerebras model provider builder.
*/
/** Builds the Cerebras OpenAI-compatible model provider config. */
function buildCerebrasProvider() {
	return buildManifestModelProviderConfig({
		providerId: "cerebras",
		catalog: openclaw_plugin_default.modelCatalog.providers.cerebras
	});
}
//#endregion
export { openclaw_plugin_default as n, buildCerebrasProvider as t };
