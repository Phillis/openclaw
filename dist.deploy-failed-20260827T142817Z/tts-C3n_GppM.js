import { n as readConfigMachineState } from "./config-machine-state-Da8Lk82e.js";
import { u as mimeTypeFromFilePath } from "./mime-Hm4eS2i0.js";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DqIBoQI-.js";
import { d as saveMediaBuffer } from "./store-BNwuZ4Nd.js";
import { b as setTtsMachinePrefsPathResolver } from "./tts-settings-C4v4j5N-.js";
import { r as resolveGeneratedMediaMaxBytes } from "./configured-max-bytes-lO7JhHVk.js";
import { S as setSpeechRuntimeAvailabilityGuard, u as maybeApplyTtsToPayloadCore, y as textToSpeechCore } from "./runtime-api-Bw3X0kRb.js";
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
