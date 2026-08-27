import { $ as RealtimeVoiceProviderResolveConfigContext, Q as RealtimeVoiceProviderConfiguredContext, X as RealtimeVoiceBridgeCreateRequest, nt as RealtimeTranscriptionProviderConfiguredContext, rt as RealtimeTranscriptionProviderResolveConfigContext, tt as RealtimeTranscriptionProviderConfig } from "../../runtime-api-IAhSVA75.js";
import { r as VideoGenerationModelCapabilitiesContext, s as VideoGenerationProviderConfiguredContext } from "../../types-ByYsr5MU.js";
import "../../realtime-transcription-Ckz4sTPJ.js";
import "../../video-generation-s9wBFnyO.js";
import "../../realtime-voice-Ckz4sTPJ.js";
//#region extensions/xai/capability-provider-metadata.d.ts
declare const XAI_IMAGE_DEFAULT_TIMEOUT_MS = 600000;
declare const XAI_SUPPORTED_IMAGE_ASPECT_RATIOS: readonly ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "2:1", "1:2", "19.5:9", "9:19.5", "20:9", "9:20"];
declare function createXaiImageGenerationProviderMetadata(): {
  id: string;
  label: string;
  defaultModel: string;
  defaultTimeoutMs: number;
  models: ("grok-imagine-image" | "grok-imagine-image-quality")[];
  capabilities: {
    generate: {
      maxCount: number;
      supportsAspectRatio: true;
      supportsResolution: true;
      supportsSize: false;
    };
    edit: {
      enabled: true;
      maxCount: number;
      maxInputImages: number;
      supportsAspectRatio: true;
      supportsResolution: true;
      supportsSize: false;
    };
    geometry: {
      aspectRatios: ("1:1" | "16:9" | "9:16" | "4:3" | "3:4" | "3:2" | "2:3" | "2:1" | "1:2" | "19.5:9" | "9:19.5" | "20:9" | "9:20")[];
      resolutions: ("1K" | "2K")[];
    };
  };
};
declare function createXaiMediaUnderstandingProviderMetadata(): {
  id: string;
  capabilities: "audio"[];
  autoPriority: {
    audio: number;
  };
};
declare const DEFAULT_XAI_VIDEO_BASE_URL = "https://api.x.ai/v1";
declare const DEFAULT_XAI_VIDEO_MODEL = "grok-imagine-video";
declare const XAI_VIDEO_DEFAULT_TIMEOUT_MS = 600000;
declare const XAI_VIDEO_ASPECT_RATIOS: Set<string>;
declare function isXaiVideo15Model(model: string | undefined): boolean;
declare function createXaiVideoGenerationProviderMetadata(): {
  id: string;
  label: string;
  defaultModel: string;
  defaultTimeoutMs: number;
  models: string[];
  catalogByModel: {
    "grok-imagine-video-1.5": {
      capabilities: {
        imageToVideo: {
          enabled: true;
          maxVideos: number;
          maxInputImages: number;
          maxDurationSeconds: number;
          aspectRatios: string[];
          resolutions: ("480P" | "720P" | "1080P")[];
          supportsAspectRatio: true;
          supportsResolution: true;
        };
        videoToVideo: {
          enabled: false;
        };
      };
      modes: "imageToVideo"[];
    };
  };
  isConfigured: (ctx: VideoGenerationProviderConfiguredContext) => boolean;
  capabilities: {
    generate: {
      maxVideos: number;
      maxDurationSeconds: number;
      aspectRatios: string[];
      resolutions: ("480P" | "720P")[];
      supportsAspectRatio: true;
      supportsResolution: true;
    };
    imageToVideo: {
      enabled: true;
      maxVideos: number;
      maxInputImages: number;
      maxDurationSeconds: number;
      aspectRatios: string[];
      resolutions: ("480P" | "720P")[];
      supportsAspectRatio: true;
      supportsResolution: true;
    };
    videoToVideo: {
      enabled: true;
      maxVideos: number;
      maxInputVideos: number;
      maxDurationSeconds: number;
      supportsAspectRatio: false;
      supportsResolution: false;
    };
  };
  resolveModelCapabilities: ({ model }: VideoGenerationModelCapabilitiesContext) => {
    imageToVideo: {
      enabled: true;
      maxVideos: number;
      maxInputImages: number;
      maxDurationSeconds: number;
      aspectRatios: string[];
      resolutions: ("480P" | "720P" | "1080P")[];
      supportsAspectRatio: true;
      supportsResolution: true;
    };
    videoToVideo: {
      enabled: false;
    };
  } | undefined;
};
type XaiRealtimeTranscriptionEncoding = "pcm" | "mulaw" | "alaw";
type XaiRealtimeTranscriptionProviderConfig = {
  apiKey?: string;
  baseUrl?: string;
  sampleRate?: number;
  encoding?: XaiRealtimeTranscriptionEncoding;
  interimResults?: boolean;
  endpointingMs?: number;
  language?: string;
};
declare function normalizeXaiRealtimeTranscriptionProviderConfig(config: RealtimeTranscriptionProviderConfig): XaiRealtimeTranscriptionProviderConfig;
declare function createXaiRealtimeTranscriptionProviderMetadata(): {
  id: string;
  label: string;
  aliases: string[];
  autoSelectOrder: number;
  resolveConfig: ({ rawConfig }: RealtimeTranscriptionProviderResolveConfigContext) => XaiRealtimeTranscriptionProviderConfig;
  isConfigured: ({ providerConfig, cfg }: RealtimeTranscriptionProviderConfiguredContext) => boolean;
};
declare function createXaiRealtimeVoiceProviderMetadata(): {
  id: string;
  label: string;
  aliases: string[];
  defaultModel: string;
  voices: readonly ["eve", "ara", "rex", "sal", "leo"];
  autoSelectOrder: number;
  capabilities: {
    transports: "gateway-relay"[];
    inputAudioFormats: ({
      encoding: "g711_ulaw";
      sampleRateHz: 8000;
      channels: 1;
    } | {
      encoding: "pcm16";
      sampleRateHz: 24000;
      channels: 1;
    })[];
    outputAudioFormats: ({
      encoding: "g711_ulaw";
      sampleRateHz: 8000;
      channels: 1;
    } | {
      encoding: "pcm16";
      sampleRateHz: 24000;
      channels: 1;
    })[];
    supportsBargeIn: true;
    handlesInputAudioBargeIn: true;
    supportsToolCalls: true;
    supportsSessionResumption: true;
  };
  resolveConfig: ({ rawConfig }: RealtimeVoiceProviderResolveConfigContext) => {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    voice?: string;
    vadThreshold?: number;
    silenceDurationMs?: number;
    prefixPaddingMs?: number;
    interruptResponseOnInputAudio?: boolean;
    reasoningEffort?: "none" | "high";
    sessionResumption?: boolean;
  };
  isConfigured: ({ providerConfig, cfg, agentId }: RealtimeVoiceProviderConfiguredContext) => boolean;
};
declare function assertXaiRealtimeVoiceRequestSupported(req: RealtimeVoiceBridgeCreateRequest): void;
//#endregion
export { DEFAULT_XAI_VIDEO_BASE_URL, DEFAULT_XAI_VIDEO_MODEL, XAI_IMAGE_DEFAULT_TIMEOUT_MS, XAI_SUPPORTED_IMAGE_ASPECT_RATIOS, XAI_VIDEO_ASPECT_RATIOS, XAI_VIDEO_DEFAULT_TIMEOUT_MS, XaiRealtimeTranscriptionEncoding, assertXaiRealtimeVoiceRequestSupported, createXaiImageGenerationProviderMetadata, createXaiMediaUnderstandingProviderMetadata, createXaiRealtimeTranscriptionProviderMetadata, createXaiRealtimeVoiceProviderMetadata, createXaiVideoGenerationProviderMetadata, isXaiVideo15Model, normalizeXaiRealtimeTranscriptionProviderConfig };