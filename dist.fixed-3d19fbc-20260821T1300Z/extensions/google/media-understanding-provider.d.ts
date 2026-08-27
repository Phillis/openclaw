import { i as MediaUnderstandingProvider, n as AudioTranscriptionResult, o as VideoDescriptionRequest, s as VideoDescriptionResult, t as AudioTranscriptionRequest } from "../../types-Bm_M5eS_.js";
//#region extensions/google/media-understanding-provider.d.ts
declare function transcribeGeminiAudio(params: AudioTranscriptionRequest): Promise<AudioTranscriptionResult>;
declare function describeGeminiVideo(params: VideoDescriptionRequest): Promise<VideoDescriptionResult>;
declare const googleMediaUnderstandingProvider: MediaUnderstandingProvider;
//#endregion
export { describeGeminiVideo, googleMediaUnderstandingProvider, transcribeGeminiAudio };