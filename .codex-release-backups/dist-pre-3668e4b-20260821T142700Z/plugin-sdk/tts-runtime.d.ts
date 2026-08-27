import { _ as ReplyPayload } from "../types-CoqV37wL.js";
import { A as TtsAutoMode, N as TtsModelOverrideConfig, P as TtsProvider, k as ResolvedTtsPersona, n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { Bn as SpeechProviderPlugin, Kn as SpeechProviderConfig, b as TtsConfigResolutionContext, cr as TtsDirectiveParseResult, or as SpeechVoiceOption, sr as TtsDirectiveOverrides, v as ResolvedTtsConfig, y as ResolvedTtsModelOverrides } from "../types-BJ8oTDFw.js";
import { c as TtsAutoSchema, d as TtsProviderSchema, l as TtsConfigSchema, u as TtsModeSchema } from "../zod-schema.core-BwpU3Me1.js";
import { t as summarizeText } from "../tts-core-DvSWAwGu.js";
import { o as parseTtsDirectives } from "../provider-registry-CKDV-yzf.js";

//#region src/tts/tts-runtime-types.d.ts
type TtsAttemptReasonCode = "success" | "no_provider_registered" | "not_configured" | "unsupported_for_streaming" | "unsupported_for_telephony" | "timeout" | "provider_error";
type TtsProviderAttempt = {
  provider: string;
  outcome: "success" | "skipped" | "failed";
  reasonCode: TtsAttemptReasonCode;
  persona?: string;
  personaBinding?: "applied" | "missing" | "none";
  latencyMs?: number;
  error?: string;
};
type TtsAttemptOutcome = {
  success: boolean;
  error?: string;
  latencyMs?: number;
  provider?: string;
  persona?: string;
  fallbackFrom?: string;
  attemptedProviders?: string[];
  attempts?: TtsProviderAttempt[];
};
type TtsMediaOutcome = TtsAttemptOutcome & {
  outputFormat?: string;
};
type TtsProviderMediaOutcome = TtsMediaOutcome & {
  providerModel?: string;
  providerVoice?: string;
};
type TtsVoiceMediaOutcome = TtsProviderMediaOutcome & {
  voiceCompatible?: boolean;
  fileExtension?: string;
  target?: "audio-file" | "voice-note";
};
type TtsResult = TtsMediaOutcome & {
  audioPath?: string;
  voiceCompatible?: boolean;
  audioAsVoice?: boolean;
  target?: "audio-file" | "voice-note";
};
type TtsSynthesisResult = TtsVoiceMediaOutcome & {
  audioBuffer?: Buffer;
};
type TtsStreamResult = TtsVoiceMediaOutcome & {
  audioStream?: ReadableStream<Uint8Array>;
  release?: () => Promise<void>;
};
type TtsSynthesisStreamResult = TtsStreamResult;
type TtsTelephonyResult = TtsProviderMediaOutcome & {
  audioBuffer?: Buffer;
  sampleRate?: number;
};
type TtsStatusEntry = TtsAttemptOutcome & {
  timestamp: number;
  textLength: number;
  summarized: boolean;
};
//#endregion
//#region src/tts/tts-settings.d.ts
declare function resolveModelOverridePolicy(overrides: TtsModelOverrideConfig | undefined): ResolvedTtsModelOverrides;
declare function resolveTtsConfig(cfgInput: OpenClawConfig, contextOrAgentId?: string | TtsConfigResolutionContext): ResolvedTtsConfig;
declare function resolveTtsPrefsPath(config: ResolvedTtsConfig): string;
declare function resolveTtsAutoMode(params: {
  config: ResolvedTtsConfig;
  prefsPath: string;
  sessionAuto?: string;
}): TtsAutoMode;
declare function buildTtsSystemPromptHint(cfg: OpenClawConfig, agentId?: string): string | undefined;
declare function isTtsEnabled(config: ResolvedTtsConfig, prefsPath: string, sessionAuto?: string): boolean;
declare function getTtsPersona(config: ResolvedTtsConfig, prefsPath: string): ResolvedTtsPersona | undefined;
declare function listTtsPersonas(config: ResolvedTtsConfig): ResolvedTtsPersona[];
declare function getTtsMaxLength(prefsPath: string): number;
declare function isSummarizationEnabled(prefsPath: string): boolean;
//#endregion
//#region src/tts/tts-synthesis.d.ts
type TtsAudioPersistence = (params: {
  audioBuffer: Buffer;
  cfg: OpenClawConfig;
  fileExtension: string;
  outputFormat?: string;
}) => Promise<string>;
declare function supportsNativeVoiceNoteTts(channel: string | undefined): boolean;
declare function supportsTranscodedVoiceNoteTts(channel: string | undefined): boolean;
declare function resolveTtsSynthesisTarget(channel: string | undefined): "audio-file" | "voice-note";
declare function shouldDeliverTtsAsVoice(params: {
  channel: string | undefined;
  target: "audio-file" | "voice-note" | undefined;
  voiceCompatible: boolean | undefined;
  fileExtension?: string;
  outputFormat?: string;
}): boolean;
declare function textToSpeechCore(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}, persistTtsAudio: TtsAudioPersistence): Promise<TtsResult>;
declare function synthesizeSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsSynthesisResult>;
//#endregion
//#region src/tts/tts-payload.d.ts
declare function getLastTtsAttempt(): TtsStatusEntry | undefined;
declare function setLastTtsAttempt(entry: TtsStatusEntry | undefined): void;
declare function listSpeechVoices(params: {
  provider: string;
  cfg?: OpenClawConfig;
  config?: ResolvedTtsConfig;
  apiKey?: string;
  baseUrl?: string;
}): Promise<SpeechVoiceOption[]>;
declare function maybeApplyTtsToPayloadCore(params: {
  payload: ReplyPayload;
  cfg: OpenClawConfig;
  channel?: string;
  kind?: "tool" | "block" | "final";
  inboundAudio?: boolean;
  ttsAuto?: string;
  agentId?: string;
  accountId?: string;
}, persistTtsAudio: TtsAudioPersistence): Promise<ReplyPayload>;
//#endregion
//#region src/tts/tts-provider-resolution.d.ts
declare function getResolvedSpeechProviderConfig(config: ResolvedTtsConfig, providerId: string, cfg?: OpenClawConfig): SpeechProviderConfig;
declare function resolveTtsProviderOrder(primary: TtsProvider, cfg?: OpenClawConfig, providers?: readonly SpeechProviderPlugin[]): TtsProvider[];
declare function isTtsProviderConfigured(config: ResolvedTtsConfig, provider: TtsProvider | SpeechProviderPlugin, cfg?: OpenClawConfig): boolean;
//#endregion
//#region src/tts/tts-synthesis-support.d.ts
declare function formatTtsProviderError(provider: TtsProvider, err: unknown): string;
declare function sanitizeTtsErrorForLog(err: unknown): string;
//#endregion
//#region src/tts/tts-settings-writes.d.ts
declare function setTtsAutoMode(prefsPath: string, mode: TtsAutoMode): void;
declare function setTtsEnabled(prefsPath: string, enabled: boolean): void;
declare function setTtsPersona(prefsPath: string, persona: string | null | undefined): void;
declare function setTtsProvider(prefsPath: string, provider: TtsProvider): void;
declare function setTtsMaxLength(prefsPath: string, maxLength: number): void;
declare function setSummarizationEnabled(prefsPath: string, enabled: boolean): void;
//#endregion
//#region src/tts/tts-request.d.ts
declare function resolveExplicitTtsOverrides(params: {
  cfg: OpenClawConfig;
  prefsPath?: string;
  provider?: string;
  modelId?: string;
  voiceId?: string;
  agentId?: string;
  channelId?: string;
  accountId?: string;
}): TtsDirectiveOverrides;
//#endregion
//#region src/tts/tts-streaming.d.ts
declare function streamSpeech(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsSynthesisStreamResult>;
declare function textToSpeechStream(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  channel?: string;
  overrides?: TtsDirectiveOverrides;
  disableFallback?: boolean;
  timeoutMs?: number;
  agentId?: string;
  accountId?: string;
}): Promise<TtsStreamResult>;
//#endregion
//#region src/tts/tts-telephony.d.ts
declare function textToSpeechTelephony(params: {
  text: string;
  cfg: OpenClawConfig;
  prefsPath?: string;
  overrides?: TtsDirectiveOverrides;
  timeoutMs?: number;
}): Promise<TtsTelephonyResult>;
//#endregion
//#region src/tts/runtime-api.d.ts
declare function getTtsProvider(config: ResolvedTtsConfig, prefsPath: string): TtsProvider;
declare const testApi: {
  parseTtsDirectives: typeof parseTtsDirectives;
  resolveModelOverridePolicy: typeof resolveModelOverridePolicy;
  supportsNativeVoiceNoteTts: typeof supportsNativeVoiceNoteTts;
  supportsTranscodedVoiceNoteTts: typeof supportsTranscodedVoiceNoteTts;
  resolveTtsSynthesisTarget: typeof resolveTtsSynthesisTarget;
  shouldDeliverTtsAsVoice: typeof shouldDeliverTtsAsVoice;
  summarizeText: typeof summarizeText;
  getResolvedSpeechProviderConfig: typeof getResolvedSpeechProviderConfig;
  formatTtsProviderError: typeof formatTtsProviderError;
  sanitizeTtsErrorForLog: typeof sanitizeTtsErrorForLog;
};
//#endregion
//#region src/tts/tts.d.ts
declare function textToSpeech(params: Parameters<typeof textToSpeechCore>[0]): Promise<TtsResult>;
declare function maybeApplyTtsToPayload(params: Parameters<typeof maybeApplyTtsToPayloadCore>[0]): Promise<ReplyPayload>;
//#endregion
//#region src/plugin-sdk/tts-runtime.d.ts
/** Compatibility no-op retained for callers that prewarm facade runtimes generically. */
declare function prewarmTtsRuntimeFacade(): void;
//#endregion
export { type ResolvedTtsConfig, type ResolvedTtsModelOverrides, TtsAutoSchema, TtsConfigSchema, type TtsDirectiveOverrides, type TtsDirectiveParseResult, TtsModeSchema, TtsProviderSchema, type TtsResult, type TtsStreamResult, type TtsSynthesisResult, type TtsSynthesisStreamResult, type TtsTelephonyResult, testApi as _test, testApi, buildTtsSystemPromptHint, getLastTtsAttempt, getResolvedSpeechProviderConfig, getTtsMaxLength, getTtsPersona, getTtsProvider, isSummarizationEnabled, isTtsEnabled, isTtsProviderConfigured, listSpeechVoices, listTtsPersonas, maybeApplyTtsToPayload, prewarmTtsRuntimeFacade, resolveExplicitTtsOverrides, resolveTtsAutoMode, resolveTtsConfig, resolveTtsPrefsPath, resolveTtsProviderOrder, setLastTtsAttempt, setSummarizationEnabled, setTtsAutoMode, setTtsEnabled, setTtsMaxLength, setTtsPersona, setTtsProvider, streamSpeech, synthesizeSpeech, textToSpeech, textToSpeechStream, textToSpeechTelephony };