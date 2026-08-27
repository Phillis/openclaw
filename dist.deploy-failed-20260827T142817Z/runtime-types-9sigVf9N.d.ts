import { n as OpenClawConfig } from "./types.openclaw-CNftZ6Ix.js";
import { r as AuthProfileStore } from "./types-DdMsFybn.js";
import { t as FallbackAttempt } from "./model-fallback.types-BTmHzJn6.js";
import { r as SsrFPolicy } from "./ssrf-DMQl3JA2.js";
import { _ as ImageGenerationSourceImage, c as ImageGenerationOutputFormat, f as ImageGenerationProviderOptions, h as ImageGenerationResolution, i as ImageGenerationNormalization, n as ImageGenerationBackground, p as ImageGenerationQuality, r as ImageGenerationIgnoredOverride, t as GeneratedImageAsset } from "./types-B-aS5WAb.js";

//#region src/image-generation/runtime-types.d.ts
type GenerateImageParams = {
  cfg: OpenClawConfig;
  prompt: string;
  agentDir?: string;
  authStore?: AuthProfileStore;
  modelOverride?: string;
  count?: number;
  size?: string;
  aspectRatio?: string;
  resolution?: ImageGenerationResolution; /** Resolution inferred from reference images; omitted for incompatible fallback models. */
  inferredResolution?: ImageGenerationResolution;
  quality?: ImageGenerationQuality;
  outputFormat?: ImageGenerationOutputFormat;
  background?: ImageGenerationBackground;
  inputImages?: ImageGenerationSourceImage[];
  autoProviderFallback?: boolean; /** Optional per-request provider timeout in milliseconds. */
  timeoutMs?: number;
  providerOptions?: ImageGenerationProviderOptions; /** SSRF policy to propagate into image-generation provider HTTP calls. */
  ssrfPolicy?: SsrFPolicy;
};
type GenerateImageRuntimeResult = {
  images: GeneratedImageAsset[];
  provider: string;
  model: string;
  attempts: FallbackAttempt[];
  appliedResolution?: ImageGenerationResolution;
  normalization?: ImageGenerationNormalization;
  metadata?: Record<string, unknown>;
  ignoredOverrides: ImageGenerationIgnoredOverride[];
};
//#endregion
export { GenerateImageRuntimeResult as n, GenerateImageParams as t };