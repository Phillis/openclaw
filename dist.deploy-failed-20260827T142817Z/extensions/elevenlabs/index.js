import { t as definePluginEntry } from "../../plugin-entry-B4wzLSpS.js";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-CFtChkgb.js";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-D2WTI2vm.js";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-DJmzzCKY.js";
//#region extensions/elevenlabs/index.ts
var elevenlabs_default = definePluginEntry({
	id: "elevenlabs",
	name: "ElevenLabs Speech",
	description: "Bundled ElevenLabs speech provider",
	register(api) {
		api.registerSpeechProvider(buildElevenLabsSpeechProvider());
		api.registerMediaUnderstandingProvider(elevenLabsMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildElevenLabsRealtimeTranscriptionProvider());
	}
});
//#endregion
export { elevenlabs_default as default };
