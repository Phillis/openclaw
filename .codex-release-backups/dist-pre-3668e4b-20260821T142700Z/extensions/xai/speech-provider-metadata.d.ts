import { $ as SpeechProviderPlugin, et as SpeechProviderConfig, nt as SpeechSynthesisTarget, tt as SpeechProviderOverrides } from "../../types-CbXjz50O.js";
//#region extensions/xai/speech-provider-metadata.d.ts
declare const XAI_SPEECH_RESPONSE_FORMATS: readonly ["mp3", "wav", "pcm", "mulaw", "alaw"];
type XaiSpeechResponseFormat = (typeof XAI_SPEECH_RESPONSE_FORMATS)[number];
type XaiTtsProviderConfig = {
  apiKey?: string;
  baseUrl: string;
  voiceId: string;
  language?: string;
  speed?: number;
  responseFormat?: XaiSpeechResponseFormat;
};
type XaiTtsProviderOverrides = {
  voiceId?: string;
  language?: string;
  speed?: number;
};
declare const XAI_TTS_FALLBACK_VOICES: readonly ["ara", "eve", "leo", "rex", "sal"];
declare function normalizeXaiTtsBaseUrl(baseUrl?: string): string;
declare function isValidXaiTtsVoice(voice: string): boolean;
declare function normalizeXaiLanguageCode(value: unknown): string | undefined;
declare function resolveXaiSpeechResponseFormat(target: SpeechSynthesisTarget | undefined, configuredFormat?: XaiSpeechResponseFormat): XaiSpeechResponseFormat;
declare function xaiSpeechResponseFormatToFileExtension(format: XaiSpeechResponseFormat): ".mp3" | ".pcm" | ".wav" | ".mulaw" | ".alaw";
declare function readXaiSpeechProviderConfig(config: SpeechProviderConfig): XaiTtsProviderConfig;
declare function readXaiSpeechOverrides(overrides: SpeechProviderOverrides | undefined): XaiTtsProviderOverrides;
declare function resolveDirectXaiAudioApiKey(configApiKey?: string): string | undefined;
declare function createXaiSpeechProviderMetadata(): Omit<SpeechProviderPlugin, "listVoices" | "synthesize" | "streamSynthesize" | "synthesizeTelephony">;
//#endregion
export { XAI_TTS_FALLBACK_VOICES, XaiSpeechResponseFormat, createXaiSpeechProviderMetadata, isValidXaiTtsVoice, normalizeXaiLanguageCode, normalizeXaiTtsBaseUrl, readXaiSpeechOverrides, readXaiSpeechProviderConfig, resolveDirectXaiAudioApiKey, resolveXaiSpeechResponseFormat, xaiSpeechResponseFormatToFileExtension };