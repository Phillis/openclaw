import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-C2UoeqsI.js";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-mj-Qt8cY.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-CUgsIItY.js";
import { t as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-CNi1zU93.js";
import { t as openAiMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-DNHWYZF_.js";
import { t as buildOpenAIProvider } from "../../openai-provider-B4JuFuRY.js";
import { n as resolveOpenAISystemPromptContribution, t as resolveOpenAIPromptOverlayMode } from "../../prompt-overlay-Bw6pB8yF.js";
import { n as OPENAI_QUICKSILVER_OFFER_PATH } from "../../realtime-quicksilver-session-tC5aSPM7.js";
import { n as releaseOpenAIQuicksilverBrowserSessionBroker, t as acquireOpenAIQuicksilverBrowserSessionBroker } from "../../realtime-quicksilver-session-owner-BeuUEBK4.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-CnLGLoUv.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-Dobg4rHr.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-CwvzPBc8.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-BNgccke4.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const quicksilverSession = api.registrationMode === "full" ? acquireOpenAIQuicksilverBrowserSessionBroker({
			getConfig: () => api.runtime.config.current(),
			logger: api.logger
		}) : void 0;
		if (quicksilverSession) {
			api.registerHttpRoute({
				path: OPENAI_QUICKSILVER_OFFER_PATH,
				auth: "plugin",
				match: "exact",
				handler: quicksilverSession.handler
			});
			api.lifecycle.registerRuntimeLifecycle({
				id: "openai-quicksilver-realtime-browser-session",
				description: "Close OpenAI browser sidebands when the plugin stops",
				cleanup: (ctx) => {
					if (ctx.reason !== "disable") return;
					return releaseOpenAIQuicksilverBrowserSessionBroker(quicksilverSession);
				}
			});
		}
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const buildProviderWithPromptContribution = (provider) => ({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => {
				const pluginConfig = resolvePluginConfigObject(ctx.config, "openai") ?? (ctx.config ? void 0 : api.pluginConfig);
				return resolveOpenAISystemPromptContribution({
					config: ctx.config,
					legacyPluginConfig: pluginConfig,
					mode: resolveOpenAIPromptOverlayMode(pluginConfig),
					modelProviderId: provider.id,
					modelId: ctx.modelId,
					trigger: ctx.trigger
				});
			}
		});
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
		api.registerEmbeddingProvider(openAiMemoryEmbeddingProviderAdapter);
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider({
			quicksilverBrowserSessionBroker: quicksilverSession?.broker,
			logger: api.logger
		}));
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
