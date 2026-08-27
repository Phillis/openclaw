import { n as openclaw_plugin_default } from "./provider-catalog-CTPBG3Dh.js";
import { applyMistralConfig } from "./onboard.js";
import { applyMistralModelCompat } from "./api.js";
import { mistralMediaUnderstandingProvider } from "./media-understanding-provider.js";
import { mistralMemoryEmbeddingProviderAdapter } from "./memory-embedding-adapter.js";
import { buildMistralRealtimeTranscriptionProvider } from "./realtime-transcription-provider.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
//#region extensions/mistral/index.ts
const PROVIDER_ID = "mistral";
function buildMistralReplayPolicy() {
	return {
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict9"
	};
}
var mistral_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Mistral Provider",
	description: "Official Mistral provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Mistral",
		docsPath: "/providers/models",
		manifestAuth: { applyConfig: applyMistralConfig },
		catalog: {
			allowExplicitBaseUrl: true,
			liveModelDiscovery: true
		},
		matchesContextOverflowError: ({ errorMessage }) => /\bmistral\b.*(?:input.*too long|token limit.*exceeded)/i.test(errorMessage),
		normalizeResolvedModel: ({ model }) => applyMistralModelCompat(model),
		resolveThinkingProfile: ({ modelId }) => modelId === "mistral-small-latest" || modelId === "mistral-small-2603" || modelId === "mistral-medium-3-5" ? {
			levels: [{ id: "off" }, { id: "high" }],
			defaultLevel: "off"
		} : void 0,
		buildReplayPolicy: () => buildMistralReplayPolicy()
	},
	register(api) {
		api.registerEmbeddingProvider(mistralMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildMistralRealtimeTranscriptionProvider());
	}
});
//#endregion
export { mistral_default as default };
