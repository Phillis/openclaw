import { t as defineSingleProviderPluginEntry } from "../../provider-entry-DXvtp32u.js";
import { a as buildSelectableNvidiaProvider, i as buildSelectableLiveNvidiaProvider, n as buildLiveNvidiaProvider, o as openclaw_plugin_default } from "../../provider-catalog-BGrWd8Sh.js";
import { n as applyNvidiaConfig, t as NVIDIA_DEFAULT_MODEL_REF } from "../../onboard-D4lzrmzU.js";
//#region extensions/nvidia/index.ts
const PROVIDER_ID = "nvidia";
function hasNvidiaApiToken(ctx) {
	return Boolean(ctx.resolveProviderApiKey?.(PROVIDER_ID).apiKey?.trim() || ctx.env.NVIDIA_API_KEY?.trim());
}
async function buildNvidiaCatalogModels(ctx) {
	return (hasNvidiaApiToken(ctx) ? await buildLiveNvidiaProvider() : buildSelectableNvidiaProvider()).models.map((model) => ({
		provider: PROVIDER_ID,
		id: model.id,
		name: model.name ?? model.id,
		contextWindow: model.contextWindow,
		reasoning: model.reasoning,
		input: model.input
	}));
}
var nvidia_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "NVIDIA Provider",
	description: "Bundled NVIDIA provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "NVIDIA",
		docsPath: "/providers/nvidia",
		preserveLiteralProviderPrefix: true,
		manifestAuth: {
			defaultModel: NVIDIA_DEFAULT_MODEL_REF,
			applyConfig: applyNvidiaConfig
		},
		catalog: {
			buildProvider: buildSelectableLiveNvidiaProvider,
			buildStaticProvider: buildSelectableNvidiaProvider
		},
		augmentModelCatalog: buildNvidiaCatalogModels,
		wizard: {
			setup: {
				choiceId: "nvidia-api-key",
				choiceLabel: "NVIDIA API key",
				groupId: "nvidia",
				groupLabel: "NVIDIA",
				groupHint: "Direct API key",
				methodId: "api-key",
				modelSelection: {
					promptWhenAuthChoiceProvided: true,
					allowKeepCurrent: false
				}
			},
			modelPicker: {
				label: "NVIDIA (custom)",
				hint: "Use NVIDIA-hosted open models",
				methodId: "api-key"
			}
		}
	}
});
//#endregion
export { nvidia_default as default };
