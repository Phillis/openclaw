import { rt as SpeechVoiceOption } from "../../types-R6eI-mj_.js";
//#region extensions/xai/tts.d.ts
declare function listXaiTtsVoices(params: {
  apiKey: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
type XaiTtsResponseFormat = "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
declare function xaiTTSStream(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: XaiTtsResponseFormat;
  timeoutMs: number;
  maxBytes?: number;
}): Promise<{
  audioStream: ReadableStream<Uint8Array>;
  release: () => Promise<void>;
}>;
declare function xaiTTS(params: {
  text: string;
  apiKey: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: "mp3" | "wav" | "pcm" | "mulaw" | "alaw";
  timeoutMs: number;
  maxBytes?: number;
}): Promise<Buffer>;
//#endregion
export { listXaiTtsVoices, xaiTTS, xaiTTSStream };