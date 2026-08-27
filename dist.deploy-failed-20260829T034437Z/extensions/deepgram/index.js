import { t as definePluginEntry } from "../../plugin-entry-BIDZMa3K.js";
import { t as deepgramMediaUnderstandingProvider } from "../../media-understanding-provider-CWsg8LaH.js";
import { t as buildDeepgramRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-zzIJE_QN.js";
//#region extensions/deepgram/index.ts
var deepgram_default = definePluginEntry({
	id: "deepgram",
	name: "Deepgram Media Understanding",
	description: "Bundled Deepgram audio transcription provider",
	register(api) {
		api.registerMediaUnderstandingProvider(deepgramMediaUnderstandingProvider);
		api.registerRealtimeTranscriptionProvider(buildDeepgramRealtimeTranscriptionProvider());
	}
});
//#endregion
export { deepgram_default as default };
