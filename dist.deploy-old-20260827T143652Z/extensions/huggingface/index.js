import { t as defineSingleProviderPluginEntry } from "../../provider-entry-DsU4bRDp.js";
import { n as applyHuggingfaceConfig, t as HUGGINGFACE_DEFAULT_MODEL_REF } from "../../onboard-B1ESPWEh.js";
import { t as buildHuggingfaceProvider } from "../../provider-catalog-BaQ6y9u6.js";
//#region extensions/huggingface/openclaw.plugin.json
var openclaw_plugin_default = {
	id: "huggingface",
	icon: "https://cdn.simpleicons.org/huggingface",
	activation: { "onStartup": false },
	enabledByDefault: true,
	providers: ["huggingface"],
	modelCatalog: { "discovery": { "huggingface": "refreshable" } },
	modelIdNormalization: { "providers": { "huggingface": { "stripPrefixes": ["huggingface/"] } } },
	setup: { "providers": [{
		"id": "huggingface",
		"envVars": ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"]
	}] },
	providerAuthChoices: [{
		"provider": "huggingface",
		"method": "api-key",
		"choiceId": "huggingface-api-key",
		"appGuidedSecret": true,
		"choiceLabel": "Hugging Face API key",
		"choiceHint": "Inference API (HF token)",
		"groupId": "huggingface",
		"groupLabel": "Hugging Face",
		"groupHint": "Inference API (HF token)",
		"optionKey": "huggingfaceApiKey",
		"cliFlag": "--huggingface-api-key",
		"cliOption": "--huggingface-api-key <key>",
		"cliDescription": "Hugging Face API key (HF token)"
	}],
	configSchema: {
		"type": "object",
		"additionalProperties": false,
		"properties": { "discovery": {
			"type": "object",
			"additionalProperties": false,
			"properties": { "enabled": { "type": "boolean" } }
		} }
	},
	uiHints: {
		"discovery": {
			"label": "Model Discovery",
			"help": "Plugin-owned controls for Hugging Face model auto-discovery."
		},
		"discovery.enabled": {
			"label": "Enable Discovery",
			"help": "When false, OpenClaw keeps the Hugging Face plugin available but skips implicit startup discovery from ambient Hugging Face credentials."
		}
	}
};
//#endregion
//#region extensions/huggingface/index.ts
const PROVIDER_ID = "huggingface";
var huggingface_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Hugging Face Provider",
	description: "Bundled Hugging Face provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Hugging Face",
		docsPath: "/providers/huggingface",
		envVars: ["HUGGINGFACE_HUB_TOKEN", "HF_TOKEN"],
		manifestAuth: {
			defaultModel: HUGGINGFACE_DEFAULT_MODEL_REF,
			applyConfig: applyHuggingfaceConfig
		},
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const pluginEntry = ctx.config?.plugins?.entries?.[PROVIDER_ID];
				if ((pluginEntry && typeof pluginEntry === "object" && pluginEntry.config ? pluginEntry.config : void 0)?.discovery?.enabled === false) return null;
				const { apiKey, discoveryApiKey } = ctx.resolveProviderApiKey(PROVIDER_ID);
				if (!apiKey) return null;
				return { provider: {
					...await buildHuggingfaceProvider(discoveryApiKey),
					apiKey
				} };
			}
		}
	}
});
//#endregion
export { huggingface_default as default };
