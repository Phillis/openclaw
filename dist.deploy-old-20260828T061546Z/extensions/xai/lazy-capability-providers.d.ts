import { B as RealtimeVoiceProviderPlugin, V as SpeechProviderPlugin, z as RealtimeTranscriptionProviderPlugin } from "../../runtime-api-B8urSeFb.js";
import { i as MediaUnderstandingProvider } from "../../types-5428RBCI.js";
import { o as ImageGenerationProvider } from "../../types-jG5kg5so.js";
import { a as VideoGenerationProvider } from "../../types-CJzc75hI.js";
import "../../media-understanding-87D6GvxD.js";
import "../../realtime-transcription-QIDzlY5_.js";
import "../../image-generation-Dvao9HCS.js";
import "../../speech-Cac9vcic.js";
import "../../video-generation-DxrWG0Dk.js";
import "../../realtime-voice-QIDzlY5_.js";
//#region extensions/xai/lazy-capability-providers.d.ts
declare function createLazyXaiImageGenerationProvider(): ImageGenerationProvider;
declare function createLazyXaiMediaUnderstandingProvider(): MediaUnderstandingProvider;
declare function createLazyXaiVideoGenerationProvider(): VideoGenerationProvider;
declare function createLazyXaiSpeechProvider(): SpeechProviderPlugin;
declare function createLazyXaiRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
declare function createLazyXaiRealtimeVoiceProvider(): RealtimeVoiceProviderPlugin;
//#endregion
export { createLazyXaiImageGenerationProvider, createLazyXaiMediaUnderstandingProvider, createLazyXaiRealtimeTranscriptionProvider, createLazyXaiRealtimeVoiceProvider, createLazyXaiSpeechProvider, createLazyXaiVideoGenerationProvider };