import { _ as normalizeXaiRealtimeBaseUrl, v as normalizeXaiRealtimeProviderConfig } from "../../realtime-voice-config-R0wFggXp.js";
import { d as createXaiRealtimeVoiceProviderMetadata, s as assertXaiRealtimeVoiceRequestSupported } from "../../capability-provider-metadata-CYOUw5_5.js";
import { t as resolveXaiRealtimeApiKey } from "../../realtime-voice-auth.runtime-DoelNEtC.js";
import { t as XaiRealtimeVoiceBridge } from "../../realtime-voice-bridge-DsCWjXc1.js";
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
				resolveApiKey: () => resolveXaiRealtimeApiKey(config.apiKey, req.cfg)
			});
		}
	};
}
//#endregion
export { buildXaiRealtimeVoiceProvider };
