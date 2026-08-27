import { _ as normalizeXaiRealtimeBaseUrl, v as normalizeXaiRealtimeProviderConfig } from "../../realtime-voice-config-ReyW8iIg.js";
import { d as createXaiRealtimeVoiceProviderMetadata, s as assertXaiRealtimeVoiceRequestSupported } from "../../capability-provider-metadata-41e0KQoS.js";
import { t as resolveXaiRealtimeApiKey } from "../../realtime-voice-auth.runtime-BiFwwRJy.js";
import { t as XaiRealtimeVoiceBridge } from "../../realtime-voice-bridge-BQyxL0O6.js";
//#region extensions/xai/realtime-voice-provider.ts
function buildXaiRealtimeVoiceProvider() {
	return {
		...createXaiRealtimeVoiceProviderMetadata(),
		createBridge: (req) => {
			const config = normalizeXaiRealtimeProviderConfig(req.providerConfig);
			assertXaiRealtimeVoiceRequestSupported(req);
			return new XaiRealtimeVoiceBridge({
				...req,
				apiKey: config.apiKey,
				baseUrl: normalizeXaiRealtimeBaseUrl(config.baseUrl),
				model: config.model,
				voice: config.voice,
				vadThreshold: config.vadThreshold,
				silenceDurationMs: config.silenceDurationMs,
				prefixPaddingMs: config.prefixPaddingMs,
				reasoningEffort: config.reasoningEffort,
				sessionResumption: config.sessionResumption,
				resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg, req.agentId)
			});
		}
	};
}
//#endregion
export { buildXaiRealtimeVoiceProvider };
