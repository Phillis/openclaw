import { $ as SpeechProviderPlugin, Q as RealtimeVoiceProviderPlugin, Z as RealtimeTranscriptionProviderPlugin } from "../../types-CbXjz50O.js";
import { n as MediaUnderstandingProvider } from "../../types-D3PmlgxB.js";
import { o as ImageGenerationProvider } from "../../types-CBfE62Vi.js";
import { r as VideoGenerationProvider } from "../../video-generation-CPTNQvcn.js";
//#region extensions/xai/lazy-capability-providers.d.ts
declare function createLazyXaiImageGenerationProvider(): ImageGenerationProvider;
declare function createLazyXaiMediaUnderstandingProvider(): MediaUnderstandingProvider;
declare function createLazyXaiVideoGenerationProvider(): VideoGenerationProvider;
declare function createLazyXaiSpeechProvider(): SpeechProviderPlugin;
declare function createLazyXaiRealtimeTranscriptionProvider(): RealtimeTranscriptionProviderPlugin;
declare function createLazyXaiRealtimeVoiceProvider(): RealtimeVoiceProviderPlugin;
//#endregion
export { createLazyXaiImageGenerationProvider, createLazyXaiMediaUnderstandingProvider, createLazyXaiRealtimeTranscriptionProvider, createLazyXaiRealtimeVoiceProvider, createLazyXaiSpeechProvider, createLazyXaiVideoGenerationProvider };