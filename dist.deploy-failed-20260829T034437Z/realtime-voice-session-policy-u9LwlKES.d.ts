import { $t as RealtimeVoiceTool, At as PluginLogger, Ht as OpenAICompatibleRealtimeAudioFormat, Qt as RealtimeVoiceProviderConfig, Wt as RealtimeVoiceAudioFormat, Yt as RealtimeVoiceBrowserSessionCreateRequest, Zt as RealtimeVoiceProviderCapabilities, qt as RealtimeVoiceBridgeCreateRequest } from "./plugin-entry-DF9X1uwv.js";
import "./realtime-voice-BaoYop3s.js";
//#region extensions/openai/realtime-voice-session-policy.d.ts
type OpenAIRealtimeVoice = "alloy" | "ash" | "ballad" | "cedar" | "coral" | "echo" | "marin" | "sage" | "shimmer" | "verse";
type OpenAIRealtimeUserMessageOptions = {
  toolChoice?: {
    type: "function";
    name: string;
  };
};
type OpenAIRealtimeVoiceProviderConfig = {
  apiKey?: string;
  model?: string;
  voice?: OpenAIRealtimeVoice;
  temperature?: number;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  interruptResponseOnInputAudio?: boolean;
  minBargeInAudioEndMs?: number;
  reasoningEffort?: string;
  azureEndpoint?: string;
  azureDeployment?: string;
  azureApiVersion?: string;
};
type OpenAIRealtimeVoiceBridgeConfig = RealtimeVoiceBridgeCreateRequest & {
  apiKey?: string;
  callId?: string;
  gaSessionPolicy?: RealtimeGaSessionPolicy;
  model?: string;
  voice?: OpenAIRealtimeVoice;
  temperature?: number;
  vadThreshold?: number;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  interruptResponseOnInputAudio?: boolean;
  minBargeInAudioEndMs?: number;
  reasoningEffort?: string;
  azureEndpoint?: string;
  azureDeployment?: string;
  azureApiVersion?: string;
  logger: Pick<PluginLogger, "warn">;
};
declare const OPENAI_REALTIME_DEFAULT_MODEL = "gpt-realtime-2.1";
declare const OPENAI_REALTIME_MODELS: readonly ["gpt-realtime-2.1", "gpt-realtime-2.1-mini", "gpt-realtime-2", "gpt-live-1-codex", "gpt-live-1-boulder-alpha"];
declare const OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL = "gpt-4o-mini-transcribe";
declare const OPENAI_REALTIME_CAPABILITIES: RealtimeVoiceProviderCapabilities;
declare const OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX = "Conversation already has an active response in progress:";
declare const OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR = "Cancellation failed: no active response found";
declare const OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES: number;
declare const OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES: number;
declare const OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS = 250;
declare const AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH = 64;
declare const OPENAI_REALTIME_VOICES: readonly ["alloy", "ash", "ballad", "coral", "echo", "sage", "shimmer", "verse", "marin", "cedar"];
declare function normalizeOpenAIRealtimeVoice(value: unknown): OpenAIRealtimeVoice | undefined;
type RealtimeEvent = {
  type: string;
  delta?: string;
  data?: string;
  text?: string;
  transcript?: string;
  item_id?: string;
  response_id?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
  session?: unknown;
  item?: {
    id?: string;
    type?: string;
    name?: string;
    call_id?: string;
    arguments?: string;
  };
  response?: {
    id?: string;
    status?: string;
    status_details?: unknown;
    output?: unknown[];
  };
  error?: unknown;
};
type RealtimeTurnDetectionConfig = {
  type: "server_vad";
  threshold: number;
  prefix_padding_ms: number;
  silence_duration_ms: number;
  create_response: boolean;
  interrupt_response?: boolean;
};
type RealtimeGaSessionPolicy = {
  type: "realtime";
  model: string;
  instructions?: string;
  output_modalities: string[];
  audio: {
    input: {
      format: OpenAICompatibleRealtimeAudioFormat;
      turn_detection: RealtimeTurnDetectionConfig;
      noise_reduction: {
        type: "near_field";
      } | null;
      transcription: {
        model: string;
        language?: string;
      };
    };
    output: {
      format: OpenAICompatibleRealtimeAudioFormat;
      voice: OpenAIRealtimeVoice;
    };
  };
  reasoning?: {
    effort: string;
  };
  tools?: RealtimeVoiceTool[];
  tool_choice?: string;
};
type RealtimeGaSessionUpdate = {
  type: "session.update";
  session: RealtimeGaSessionPolicy;
};
type RealtimeAzureDeploymentSessionUpdate = {
  type: "session.update";
  session: {
    modalities: string[];
    instructions?: string;
    voice: OpenAIRealtimeVoice;
    input_audio_format: "g711_ulaw" | "pcm16";
    output_audio_format: "g711_ulaw" | "pcm16";
    input_audio_transcription?: {
      model: string;
      language?: string;
    };
    turn_detection: RealtimeTurnDetectionConfig;
    temperature: number;
    tools?: RealtimeVoiceTool[];
    tool_choice?: string;
  };
};
declare function normalizeProviderConfig(config: RealtimeVoiceProviderConfig): OpenAIRealtimeVoiceProviderConfig;
type OpenAIRealtimeApiKeyResolution = {
  status: "available";
  value: string;
} | {
  status: "missing";
};
declare const OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED = "OpenAI Realtime voice requires an OpenAI Platform API key";
declare const OPENAI_REALTIME_API_KEY_REQUIRED = "OpenAI Realtime voice requires an API key";
declare const OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED = "OpenAI Realtime rejected the selected API key. Update or remove the active OpenAI API-key source";
declare function isDirectOpenAIRealtimeWebSocketUrl(value: string): boolean;
declare function isOpenAIRealtimeStartupAuthFailure(error: unknown): boolean;
declare function resolveOpenAIRealtimeSecretInput(configuredApiKey: string | undefined): OpenAIRealtimeApiKeyResolution;
declare function resolveOpenAIRealtimeEnvApiKey(): OpenAIRealtimeApiKeyResolution;
declare function requireOpenAIRealtimeApiKey(configuredApiKey: string | undefined, errorMessage?: string): string;
declare function hasOpenAIRealtimeConfiguredApiKeyInput(configuredApiKey: string | undefined): boolean;
declare function hasOpenAIRealtimeApiKeyInput(configuredApiKey: string | undefined): boolean;
declare function normalizeOpenAIRealtimeTools(tools: RealtimeVoiceTool[] | undefined, maxNameLength?: number): RealtimeVoiceTool[] | undefined;
declare function buildOpenAIRealtimeTurnDetectionConfig(params: {
  autoRespondToAudio?: boolean;
  createResponse?: boolean;
  includeInterruptResponse?: boolean;
  interruptResponseOnInputAudio?: boolean;
  prefixPaddingMs?: number;
  silenceDurationMs?: number;
  vadThreshold?: number;
}): RealtimeTurnDetectionConfig;
declare function buildOpenAIRealtimeGaSessionPolicy(params: {
  audioFormat?: RealtimeVoiceAudioFormat;
  autoRespondToAudio?: boolean;
  instructions?: string;
  interruptResponseOnInputAudio?: boolean;
  language?: string;
  model: string;
  noiseReduction: {
    type: "near_field";
  } | null;
  prefixPaddingMs?: number;
  reasoningEffort?: string;
  silenceDurationMs?: number;
  tools?: RealtimeVoiceTool[];
  vadThreshold?: number;
  voice: OpenAIRealtimeVoice;
}): RealtimeGaSessionPolicy;
declare function resolveOpenAIRealtimePlatformAuth(params: {
  configuredApiKey: string | undefined;
  cfg: RealtimeVoiceBrowserSessionCreateRequest["cfg"] | undefined;
  agentId?: string;
}): Promise<OpenAIRealtimeApiKeyResolution>;
declare function requireOpenAIRealtimePlatformAuth(params: {
  configuredApiKey: string | undefined;
  cfg: RealtimeVoiceBrowserSessionCreateRequest["cfg"] | undefined;
  agentId?: string;
}): Promise<Extract<OpenAIRealtimeApiKeyResolution, {
  status: "available";
}>>;
declare function resolveOpenAIQuicksilverBridgeAuth(params: {
  configuredApiKey: string | undefined;
  cfg: RealtimeVoiceBridgeCreateRequest["cfg"] | undefined;
  agentId?: string;
}): Promise<{
  type: "oauth";
  token: string;
  accountId: string;
} | {
  type: "api-key";
  token: string;
}>;
declare function hasOpenAIRealtimePlatformAuthInput(params: {
  configuredApiKey: string | undefined;
  cfg: RealtimeVoiceBrowserSessionCreateRequest["cfg"] | undefined;
  agentId?: string;
}): boolean;
declare function hasOpenAIChatGptSubscriptionAuthInput(params: {
  cfg: RealtimeVoiceBrowserSessionCreateRequest["cfg"] | undefined;
  agentId?: string;
}): boolean;
declare function isOpenAIRealtimeMaxSessionDurationError(detail: string): boolean;
declare function readRealtimeErrorEventId(error: unknown): string | undefined;
declare function parsePlaybackMarkSequence(markName: string): number | undefined;
//#endregion
export { isOpenAIRealtimeMaxSessionDurationError as A, resolveOpenAIRealtimeEnvApiKey as B, buildOpenAIRealtimeGaSessionPolicy as C, hasOpenAIRealtimeConfiguredApiKeyInput as D, hasOpenAIRealtimeApiKeyInput as E, parsePlaybackMarkSequence as F, resolveOpenAIRealtimeSecretInput as H, readRealtimeErrorEventId as I, requireOpenAIRealtimeApiKey as L, normalizeOpenAIRealtimeTools as M, normalizeOpenAIRealtimeVoice as N, hasOpenAIRealtimePlatformAuthInput as O, normalizeProviderConfig as P, requireOpenAIRealtimePlatformAuth as R, RealtimeTurnDetectionConfig as S, hasOpenAIChatGptSubscriptionAuthInput as T, resolveOpenAIRealtimePlatformAuth as V, OpenAIRealtimeVoiceBridgeConfig as _, OPENAI_REALTIME_CONFIGURED_API_KEY_REJECTED as a, RealtimeEvent as b, OPENAI_REALTIME_INPUT_TRANSCRIPTION_MODEL as c, OPENAI_REALTIME_PLATFORM_AUTH_REQUIRED as d, OPENAI_REALTIME_SIDEBAND_STARTUP_MAX_BYTES as f, OpenAIRealtimeVoice as g, OpenAIRealtimeUserMessageOptions as h, OPENAI_REALTIME_CAPABILITIES as i, isOpenAIRealtimeStartupAuthFailure as j, isDirectOpenAIRealtimeWebSocketUrl as k, OPENAI_REALTIME_MODELS as l, OPENAI_VOICE_WS_MAX_PAYLOAD_BYTES as m, OPENAI_REALTIME_ACTIVE_RESPONSE_ERROR_PREFIX as n, OPENAI_REALTIME_DEFAULT_MIN_BARGE_IN_AUDIO_END_MS as o, OPENAI_REALTIME_VOICES as p, OPENAI_REALTIME_API_KEY_REQUIRED as r, OPENAI_REALTIME_DEFAULT_MODEL as s, AZURE_OPENAI_REALTIME_TOOL_NAME_MAX_LENGTH as t, OPENAI_REALTIME_NO_ACTIVE_RESPONSE_CANCEL_ERROR as u, OpenAIRealtimeVoiceProviderConfig as v, buildOpenAIRealtimeTurnDetectionConfig as w, RealtimeGaSessionUpdate as x, RealtimeAzureDeploymentSessionUpdate as y, resolveOpenAIQuicksilverBridgeAuth as z };