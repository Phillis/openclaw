import { n as OpenClawConfig } from "../types.openclaw-CNftZ6Ix.js";
import { r as AuthProfileStore } from "../types-DdMsFybn.js";
import { d as VideoGenerationRequest$1, m as VideoGenerationSourceAsset$1, p as VideoGenerationResult$1, t as GeneratedVideoAsset$1 } from "../types-CvCiRlSW.js";
import { n as ProviderOperationTimeoutMs, u as postJsonRequest } from "../shared-Db5D4Tpz.js";
//#region src/video-generation/dashscope-compatible.d.ts
declare const DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL = "wan2.6-t2v";
declare const DASHSCOPE_WAN_VIDEO_MODELS: string[];
declare const DASHSCOPE_WAN_VIDEO_CAPABILITIES: {
  generate: {
    maxVideos: number;
    maxDurationSeconds: number;
    supportedDurationSeconds: readonly [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    sizes: string[];
    aspectRatios: readonly ["16:9", "9:16", "1:1", "4:3", "3:4"];
    resolutions: readonly ["720P", "1080P"];
    supportsSize: true;
    supportsAspectRatio: true;
    supportsResolution: true;
    supportsAudio: true;
    supportsWatermark: true;
  };
  imageToVideo: {
    enabled: true;
    maxVideos: number;
    maxInputImages: number;
    maxDurationSeconds: number;
    supportedDurationSeconds: readonly [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    resolutions: readonly ["720P", "1080P"];
    supportsSize: false;
    supportsAspectRatio: false;
    supportsResolution: true;
    supportsAudio: true;
    supportsWatermark: true;
  };
  videoToVideo: {
    enabled: true;
    maxVideos: number;
    maxInputImages: number;
    maxInputVideos: number;
    maxDurationSeconds: number;
    supportedDurationSeconds: readonly [2, 3, 4, 5, 6, 7, 8, 9, 10];
    sizes: string[];
    aspectRatios: readonly ["16:9", "9:16", "1:1", "4:3", "3:4"];
    resolutions: readonly ["720P", "1080P"];
    supportsSize: true;
    supportsAspectRatio: true;
    supportsResolution: true;
    supportsAudio: true;
    supportsWatermark: true;
  };
};
declare const DEFAULT_VIDEO_GENERATION_DURATION_SECONDS = 5;
declare const DEFAULT_VIDEO_GENERATION_TIMEOUT_MS = 120000;
declare const DEFAULT_VIDEO_RESOLUTION_TO_SIZE: Record<string, string>;
type DashscopeVideoGenerationResponse = {
  output?: {
    task_id?: string;
    task_status?: string;
    submit_time?: string;
    results?: Array<{
      video_url?: string;
      orig_prompt?: string;
      actual_prompt?: string;
    }>;
    video_url?: string;
    code?: string;
    message?: string;
  };
  request_id?: string;
  code?: string;
  message?: string;
};
declare function buildDashscopeVideoGenerationInput(params: {
  providerLabel: string;
  req: VideoGenerationRequest$1;
}): Record<string, unknown>;
declare function resolveVideoGenerationReferenceUrls(inputImages: VideoGenerationSourceAsset$1[] | undefined, inputVideos: VideoGenerationSourceAsset$1[] | undefined): string[];
declare function buildDashscopeVideoGenerationParameters(req: VideoGenerationRequest$1, resolutionToSize?: Record<string, string>): Record<string, unknown> | undefined;
declare function extractDashscopeVideoUrls(payload: DashscopeVideoGenerationResponse): string[];
declare function pollDashscopeVideoTaskUntilComplete(params: {
  providerLabel: string;
  taskId: string;
  headers: Headers;
  timeoutMs?: number;
  fetchFn: typeof fetch;
  baseUrl: string;
  allowPrivateNetwork?: boolean;
  dispatcherPolicy?: Parameters<typeof postJsonRequest>[0]["dispatcherPolicy"];
  defaultTimeoutMs?: number;
}): Promise<DashscopeVideoGenerationResponse>;
declare function runDashscopeVideoGenerationTask(params: {
  providerLabel: string;
  model: string;
  req: VideoGenerationRequest$1;
  url: string;
  headers: Headers;
  baseUrl: string;
  timeoutMs?: number;
  fetchFn: typeof fetch;
  allowPrivateNetwork?: boolean;
  dispatcherPolicy?: Parameters<typeof postJsonRequest>[0]["dispatcherPolicy"];
  defaultTimeoutMs?: number;
}): Promise<VideoGenerationResult$1>;
declare function downloadDashscopeGeneratedVideos(params: {
  providerLabel: string;
  urls: string[];
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  allowPrivateNetwork?: boolean;
  dispatcherPolicy?: Parameters<typeof postJsonRequest>[0]["dispatcherPolicy"];
  defaultTimeoutMs?: number;
  maxBytes: number;
}): Promise<GeneratedVideoAsset$1[]>;
//#endregion
//#region src/plugin-sdk/video-generation.d.ts
/** Video asset returned by a provider after generation or transformation. */
type GeneratedVideoAsset = {
  /** Non-empty raw video bytes; may accompany url as a delivery fallback. */buffer?: Buffer;
  /** Provider-hosted URL returned instead of bytes or alongside them as a delivery fallback.
   * When buffer is absent, callers can forward or download without materializing the video. */
  url?: string;
  mimeType: string;
  fileName?: string;
  metadata?: Record<string, unknown>;
};
/** Resolution label accepted by video generation providers. */
type VideoGenerationResolution = "360P" | "480P" | "540P" | "720P" | "768P" | "1080P" | (string & {});
/**
 * Canonical semantic role hints for reference assets (first/last frame,
 * reference image/video/audio). Providers may accept additional role strings;
 * the asset.role type accepts both canonical values and arbitrary strings.
 */
type VideoGenerationAssetRole = "first_frame" | "last_frame" | "reference_image" | "reference_video" | "reference_audio";
/** Source media asset supplied to image/video/audio-to-video providers. */
type VideoGenerationSourceAsset = {
  url?: string;
  buffer?: Buffer;
  mimeType?: string;
  fileName?: string;
  /**
   * Optional semantic role hint forwarded to the provider. Canonical values
   * come from `VideoGenerationAssetRole`; plain strings are accepted for
   * provider-specific extensions.
   */
  role?: VideoGenerationAssetRole | (string & {});
  metadata?: Record<string, unknown>;
};
/** Context passed when checking whether a video provider is configured. */
type VideoGenerationProviderConfiguredContext = {
  cfg?: OpenClawConfig;
  agentDir?: string;
};
/** Context passed when resolving model-specific video generation capabilities. */
type VideoGenerationModelCapabilitiesContext = {
  provider: string;
  model: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
};
/** Normalized request object passed to a selected video generation provider. */
type VideoGenerationRequest = {
  provider: string;
  model: string;
  prompt: string;
  cfg: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
  timeoutMs?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[]; /** Reference audio assets (e.g. background music) forwarded to the provider. */
  inputAudios?: VideoGenerationSourceAsset[]; /** Arbitrary provider-specific parameters forwarded as-is (e.g. seed, draft, camerafixed). */
  providerOptions?: Record<string, unknown>;
};
/** Provider video generation response returned to the runtime. */
type VideoGenerationResult = {
  videos: GeneratedVideoAsset[];
  model?: string;
  metadata?: Record<string, unknown>;
};
/** Supported high-level video generation operation modes. */
type VideoGenerationMode = "generate" | "imageToVideo" | "videoToVideo";
/**
 * Primitive type tag for a declared `providerOptions` key. Keep narrow —
 * plugins that need richer shapes should leave them out of the typed contract
 * and interpret the forwarded opaque value inside their own provider code.
 */
type VideoGenerationProviderOptionType = "number" | "boolean" | "string";
/** Capability limits and supported options for one video generation mode. */
type VideoGenerationModeCapabilities = {
  maxVideos?: number;
  maxInputImages?: number;
  maxInputImagesByModel?: Readonly<Record<string, number>>;
  maxInputVideos?: number;
  maxInputVideosByModel?: Readonly<Record<string, number>>; /** Max number of reference audio assets the provider accepts (e.g. background music, voice reference). */
  maxInputAudios?: number;
  maxInputAudiosByModel?: Readonly<Record<string, number>>;
  maxDurationSeconds?: number;
  supportedDurationSeconds?: readonly number[];
  supportedDurationSecondsByModel?: Readonly<Record<string, readonly number[]>>;
  sizes?: readonly string[];
  aspectRatios?: readonly string[];
  resolutions?: readonly VideoGenerationResolution[];
  supportsSize?: boolean;
  supportsAspectRatio?: boolean;
  supportsResolution?: boolean;
  supportsAudio?: boolean;
  supportsWatermark?: boolean;
  /**
   * Declared typed schema for `VideoGenerationRequest.providerOptions`. Keys
   * listed here are accepted and validated against the declared primitive
   * type before forwarding; unknown keys or type mismatches skip the
   * candidate provider at runtime so mis-typed or provider-specific options
   * never silently reach the wrong provider.
   */
  providerOptions?: Readonly<Record<string, VideoGenerationProviderOptionType>>;
};
/** Capability block for transform modes that may be independently enabled. */
type VideoGenerationTransformCapabilities = VideoGenerationModeCapabilities & {
  enabled: boolean;
};
/** Full provider capability map including base and transform mode overrides. */
type VideoGenerationProviderCapabilities = VideoGenerationModeCapabilities & {
  generate?: VideoGenerationModeCapabilities;
  imageToVideo?: VideoGenerationTransformCapabilities;
  videoToVideo?: VideoGenerationTransformCapabilities;
};
/** Static catalog metadata that overrides provider defaults for one video model. */
type VideoGenerationCatalogModelEntry = {
  capabilities?: VideoGenerationProviderCapabilities;
  modes?: readonly VideoGenerationMode[];
};
/** Video generation provider contract implemented by provider plugins. */
type VideoGenerationProvider = {
  id: string;
  aliases?: string[];
  label?: string;
  defaultModel?: string; /** Default provider operation timeout in milliseconds when caller/config omit timeoutMs. */
  defaultTimeoutMs?: number;
  models?: string[];
  capabilities: VideoGenerationProviderCapabilities;
  catalogByModel?: Readonly<Record<string, VideoGenerationCatalogModelEntry>>;
  isConfigured?: (ctx: VideoGenerationProviderConfiguredContext) => boolean;
  resolveModelCapabilities?: (ctx: VideoGenerationModelCapabilitiesContext) => VideoGenerationProviderCapabilities | undefined | Promise<VideoGenerationProviderCapabilities | undefined>;
  generateVideo: (req: VideoGenerationRequest) => Promise<VideoGenerationResult>;
};
type DashscopeVideoGenerationProviderOptions = {
  providerId: string;
  label: string;
  taskLabel: string;
  apiKeyLabel?: string;
  defaultBaseUrl: string;
  resolveRequestBaseUrl?: (configuredBaseUrl: string | undefined) => string;
  resolveAigcBaseUrl?: (baseUrl: string) => string;
  credentialPolicy?: {
    acceptsApiKey: (apiKey: string) => boolean;
    acceptsBaseUrl?: (configuredBaseUrl: string | undefined) => boolean;
    unsupportedMessage: string;
  };
};
/** Builds one provider descriptor for the shared DashScope async video task protocol. */
declare function buildDashscopeVideoGenerationProvider(options: DashscopeVideoGenerationProviderOptions): VideoGenerationProvider;
//#endregion
export { DASHSCOPE_WAN_VIDEO_CAPABILITIES, DASHSCOPE_WAN_VIDEO_MODELS, DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL, DEFAULT_VIDEO_GENERATION_DURATION_SECONDS, DEFAULT_VIDEO_GENERATION_TIMEOUT_MS, DEFAULT_VIDEO_RESOLUTION_TO_SIZE, DashscopeVideoGenerationProviderOptions, type DashscopeVideoGenerationResponse, GeneratedVideoAsset, VideoGenerationAssetRole, VideoGenerationCatalogModelEntry, VideoGenerationMode, VideoGenerationModeCapabilities, VideoGenerationModelCapabilitiesContext, VideoGenerationProvider, VideoGenerationProviderCapabilities, VideoGenerationProviderConfiguredContext, VideoGenerationProviderOptionType, VideoGenerationRequest, VideoGenerationResolution, VideoGenerationResult, VideoGenerationSourceAsset, VideoGenerationTransformCapabilities, buildDashscopeVideoGenerationInput, buildDashscopeVideoGenerationParameters, buildDashscopeVideoGenerationProvider, downloadDashscopeGeneratedVideos, extractDashscopeVideoUrls, pollDashscopeVideoTaskUntilComplete, resolveVideoGenerationReferenceUrls, runDashscopeVideoGenerationTask };