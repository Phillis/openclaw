import { r as readConfigMachineState } from "./config-machine-state-DjliVw3j.js";
import { u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-D5EZZ925.js";
import { f as saveMediaBuffer } from "./store-fXRck5jl.js";
import { b as setTtsMachinePrefsPathResolver } from "./tts-settings-BPz5yC2d.js";
import { n as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-B5djOrK5.js";
import { C as setSpeechRuntimeAvailabilityGuard, b as textToSpeechCore, u as maybeApplyTtsToPayloadCore } from "./runtime-api-Bww67amX.js";
//#region src/tts/tts-audio-store.ts
const TTS_MEDIA_SUBDIR = "tool-speech-synthesis";
const persistTtsAudioToMediaStore = async ({ audioBuffer, cfg, fileExtension }) => {
	const originalFilename = `voice${fileExtension}`;
	return (await saveMediaBuffer(audioBuffer, mimeTypeFromFilePath(originalFilename), TTS_MEDIA_SUBDIR, resolveGeneratedMediaMaxBytes(cfg, "audio"), originalFilename)).path;
};
//#endregion
//#region src/tts/tts.ts
/** Public TTS runtime barrel exposed to core callers and plugin SDK facades. */
setSpeechRuntimeAvailabilityGuard(() => {
	assertSecretOwnerAvailable("capability", "tts");
});
setTtsMachinePrefsPathResolver(() => readConfigMachineState("tts.prefsPath"));
function textToSpeech(params) {
	return textToSpeechCore(params, persistTtsAudioToMediaStore);
}
function maybeApplyTtsToPayload(params) {
	return maybeApplyTtsToPayloadCore(params, persistTtsAudioToMediaStore);
}
//#endregion
export { textToSpeech as n, maybeApplyTtsToPayload as t };
