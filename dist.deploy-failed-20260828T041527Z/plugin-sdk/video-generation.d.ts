import { _ as VideoGenerationTransformCapabilities, a as VideoGenerationMode, d as VideoGenerationProviderConfiguredContext, f as VideoGenerationProviderOptionType, g as VideoGenerationSourceAsset, h as VideoGenerationResult, l as VideoGenerationProvider, m as VideoGenerationResolution, n as VideoGenerationAssetRole, o as VideoGenerationModeCapabilities, p as VideoGenerationRequest, r as VideoGenerationCatalogModelEntry, s as VideoGenerationModelCapabilitiesContext, t as GeneratedVideoAsset, u as VideoGenerationProviderCapabilities } from "../types-BGSj9yXQ.js";
import { n as ProviderOperationTimeoutMs, u as postJsonRequest } from "../shared-DNWHpPzM.js";
import "../provider-http-CLjJIxin.js";
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
  req: VideoGenerationRequest;
}): Record<string, unknown>;
declare function resolveVideoGenerationReferenceUrls(inputImages: VideoGenerationSourceAsset[] | undefined, inputVideos: VideoGenerationSourceAsset[] | undefined): string[];
declare function buildDashscopeVideoGenerationParameters(req: VideoGenerationRequest, resolutionToSize?: Record<string, string>): Record<string, unknown> | undefined;
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
  req: VideoGenerationRequest;
  url: string;
  headers: Headers;
  baseUrl: string;
  timeoutMs?: number;
  fetchFn: typeof fetch;
  allowPrivateNetwork?: boolean;
  dispatcherPolicy?: Parameters<typeof postJsonRequest>[0]["dispatcherPolicy"];
  defaultTimeoutMs?: number;
}): Promise<VideoGenerationResult>;
declare function downloadDashscopeGeneratedVideos(params: {
  providerLabel: string;
  urls: string[];
  timeoutMs?: ProviderOperationTimeoutMs;
  fetchFn: typeof fetch;
  allowPrivateNetwork?: boolean;
  dispatcherPolicy?: Parameters<typeof postJsonRequest>[0]["dispatcherPolicy"];
  defaultTimeoutMs?: number;
  maxBytes: number;
}): Promise<GeneratedVideoAsset[]>;
//#endregion
//#region src/plugin-sdk/video-generation.d.ts
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
export { DASHSCOPE_WAN_VIDEO_CAPABILITIES, DASHSCOPE_WAN_VIDEO_MODELS, DEFAULT_DASHSCOPE_WAN_VIDEO_MODEL, DEFAULT_VIDEO_GENERATION_DURATION_SECONDS, DEFAULT_VIDEO_GENERATION_TIMEOUT_MS, DEFAULT_VIDEO_RESOLUTION_TO_SIZE, DashscopeVideoGenerationProviderOptions, type DashscopeVideoGenerationResponse, type GeneratedVideoAsset, type VideoGenerationAssetRole, type VideoGenerationCatalogModelEntry, type VideoGenerationMode, type VideoGenerationModeCapabilities, type VideoGenerationModelCapabilitiesContext, type VideoGenerationProvider, type VideoGenerationProviderCapabilities, type VideoGenerationProviderConfiguredContext, type VideoGenerationProviderOptionType, type VideoGenerationRequest, type VideoGenerationResolution, type VideoGenerationResult, type VideoGenerationSourceAsset, type VideoGenerationTransformCapabilities, buildDashscopeVideoGenerationInput, buildDashscopeVideoGenerationParameters, buildDashscopeVideoGenerationProvider, downloadDashscopeGeneratedVideos, extractDashscopeVideoUrls, pollDashscopeVideoTaskUntilComplete, resolveVideoGenerationReferenceUrls, runDashscopeVideoGenerationTask };