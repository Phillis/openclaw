import { n as OpenClawConfig } from "./types.openclaw-DckSqIPo.js";
import { r as AuthProfileStore } from "./types-ZIfSo0I1.js";
import { c as VideoGenerationNormalization, g as VideoGenerationSourceAsset, i as VideoGenerationIgnoredOverride, m as VideoGenerationResolution, t as GeneratedVideoAsset } from "./types-BGSj9yXQ.js";
import { t as FallbackAttempt } from "./model-fallback.types-DRMjhurk.js";
//#region src/video-generation/runtime-types.d.ts
type GenerateVideoParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  size?: string;
  aspectRatio?: string;
  resolution?: VideoGenerationResolution;
  durationSeconds?: number;
  audio?: boolean;
  watermark?: boolean;
  inputImages?: VideoGenerationSourceAsset[];
  inputVideos?: VideoGenerationSourceAsset[];
  inputAudios?: VideoGenerationSourceAsset[];
  autoProviderFallback?: boolean;
  /** Arbitrary provider-specific options forwarded as-is to provider.generateVideo. */
  providerOptions?: Record<string, unknown>;
  /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
};
type GenerateVideoRuntimeResult = {
  videos: GeneratedVideoAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  normalization?: VideoGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: VideoGenerationIgnoredOverride[];
};
//#endregion
export { GenerateVideoRuntimeResult as n, GenerateVideoParams as t };