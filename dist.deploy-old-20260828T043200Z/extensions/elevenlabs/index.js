import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as elevenLabsMediaUnderstandingProvider } from "../../media-understanding-provider-4muBh6qy.js";
import { t as buildElevenLabsRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-DVupXx_t.js";
import { t as buildElevenLabsSpeechProvider } from "../../speech-provider-DVxJTVL7.js";
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
