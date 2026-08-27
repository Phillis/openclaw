import { f as normalizeGooglePreviewModelId } from "../provider-model-shared-D4cUYAoE.js";
import { n as OpenClawConfig } from "../types.openclaw-6A5yUI1l.js";
import { r as AuthProfileStore } from "../types-DdMsFybn.js";
import { Ln as ImageGenerationProviderPlugin, W as resolveApiKeyForProviderCore } from "../types-BJ8oTDFw.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { t as FallbackAttempt } from "../model-fallback.types-BTmHzJn6.js";
import { _ as ImageGenerationSourceImage, d as ImageGenerationProviderConfiguredContext, f as ImageGenerationProviderOptions, g as ImageGenerationResult, h as ImageGenerationResolution, l as ImageGenerationProvider, m as ImageGenerationRequest, t as GeneratedImageAsset } from "../types-DwSvuTEi.js";
import { n as describeFailoverError, r as isFailoverError, t as parseGenerationModelRef } from "../model-ref-gfOJy4yA.js";
import { n as getProviderEnvVars } from "../provider-env-vars-oXP7Xdm8.js";
import { i as throwCapabilityGenerationFailure, n as resolveCapabilityModelCandidates, t as buildNoCapabilityModelConfiguredMessage } from "../runtime-shared-WJ2Nv8fq.js";
import { n as resolveAgentModelPrimaryValue, t as resolveAgentModelFallbackValues } from "../model-input-C6w8-4vp.js";
import { r as listImageGenerationProviders, t as getImageGenerationProvider } from "../registry-C3I_ym-p.js";

//#region src/plugin-sdk/image-generation-core.auth.runtime.d.ts
declare namespace image_generation_core_auth_runtime_d_exports {
  export { resolveApiKeyForProviderCore as resolveApiKeyForProvider };
}
//#endregion
//#region src/plugin-sdk/image-generation-core.d.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
type ImageGenerationCoreAuthRuntimeModule = typeof image_generation_core_auth_runtime_d_exports;
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
declare function resolveApiKeyForProvider(...args: Parameters<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>): Promise<Awaited<ReturnType<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>>>;
//#endregion
export { type AuthProfileStore, type FallbackAttempt, type GeneratedImageAsset, type ImageGenerationProvider, type ImageGenerationProviderConfiguredContext, type ImageGenerationProviderOptions, type ImageGenerationProviderPlugin, type ImageGenerationRequest, type ImageGenerationResolution, type ImageGenerationResult, type ImageGenerationSourceImage, OPENAI_DEFAULT_IMAGE_MODEL, type OpenClawConfig, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getImageGenerationProvider, getProviderEnvVars, isFailoverError, listImageGenerationProviders, normalizeGooglePreviewModelId as normalizeGoogleModelId, parseGenerationModelRef as parseImageGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };