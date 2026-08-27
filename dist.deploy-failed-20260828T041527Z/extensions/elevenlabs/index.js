import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-e0QljxY1.js";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-1-RoBZOe.js";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-CSwbWslG.js";
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
