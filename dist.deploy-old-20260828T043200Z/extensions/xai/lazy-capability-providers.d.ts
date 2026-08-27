import { B as RealtimeVoiceProviderPlugin, V as SpeechProviderPlugin, z as RealtimeTranscriptionProviderPlugin } from "../../runtime-api-IAhSVA75.js";
import { i as MediaUnderstandingProvider } from "../../types-BydkmfS6.js";
import { o as ImageGenerationProvider } from "../../types-D7Gv2zfx.js";
import { a as VideoGenerationProvider } from "../../types-ByYsr5MU.js";
import "../../media-understanding-CUfPI0A8.js";
import "../../realtime-transcription-Ckz4sTPJ.js";
import "../../image-generation-dErLL0RW.js";
import "../../speech-DjqZQzge.js";
import "../../video-generation-s9wBFnyO.js";
import "../../realtime-voice-Ckz4sTPJ.js";
//#region extensions/xai/lazy-capability-providers.d.ts
declare function createLazyXaiImageGenerationProvider(): ImageGenerationProvider;
declare function createLazyXaiMediaUnderstandingProvider(): MediaUnderstandingProvider;
declare function createLazyXaiVideoGenerationProvider(): VideoGenerationProvider;
declare function createLazyXaiSpeechProvider(): SpeechProviderPlugin;
declare function createLazyXaiRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
declare function createLazyXaiRealtimeVoiceProvider(): RealtimeVoiceProviderPlugin;
//#endregion
export { createLazyXaiImageGenerationProvider, createLazyXaiMediaUnderstandingProvider, createLazyXaiRealtimeTranscriptionProvider, createLazyXaiRealtimeVoiceProvider, createLazyXaiSpeechProvider, createLazyXaiVideoGenerationProvider };