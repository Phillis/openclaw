import { $ as SpeechProviderPlugin, Q as RealtimeVoiceProviderPlugin, Z as RealtimeTranscriptionProviderPlugin } from "../../types-R6eI-mj_.js";
import { n as MediaUnderstandingProvider } from "../../types-DImW1Ex1.js";
import { o as ImageGenerationProvider } from "../../types-mIdliwOA.js";
import { r as VideoGenerationProvider } from "../../video-generation-D-EGWoVy.js";
//#region extensions/xai/lazy-capability-providers.d.ts
declare function createLazyXaiImageGenerationProvider(): ImageGenerationProvider;
declare function createLazyXaiMediaUnderstandingProvider(): MediaUnderstandingProvider;
declare function createLazyXaiVideoGenerationProvider(): VideoGenerationProvider;
declare function createLazyXaiSpeechProvider(): SpeechProviderPlugin;
declare function createLazyXaiRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
declare function createLazyXaiRealtimeVoiceProvider(): RealtimeVoiceProviderPlugin;
//#endregion
export { createLazyXaiImageGenerationProvider, createLazyXaiMediaUnderstandingProvider, createLazyXaiRealtimeTranscriptionProvider, createLazyXaiRealtimeVoiceProvider, createLazyXaiSpeechProvider, createLazyXaiVideoGenerationProvider };