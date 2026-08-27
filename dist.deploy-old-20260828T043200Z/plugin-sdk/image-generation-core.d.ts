import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { r as AuthProfileStore } from "../types-0052hDHj.js";
import { Gr as ImageGenerationProviderPlugin, xn as resolveApiKeyForProviderCore } from "../types-CiLdD6DO.js";
import { n as createSubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { t as FailoverReason } from "../signal-DTFr3i_8.js";
import { _ as ImageGenerationSourceImage, d as ImageGenerationProviderConfiguredContext, f as ImageGenerationProviderOptions, g as ImageGenerationResult, h as ImageGenerationResolution, l as ImageGenerationProvider, m as ImageGenerationRequest, t as GeneratedImageAsset } from "../types-ZH8i034d.js";
import { t as FallbackAttempt } from "../model-fallback.types-DRMjhurk.js";
import { V as ProviderModelRef, f as normalizeGooglePreviewModelId } from "../provider-model-shared-KuDu2ZW5.js";
import { n as getProviderEnvVars } from "../provider-env-vars-mWhYMMvj.js";
import { i as throwCapabilityGenerationFailure, n as resolveCapabilityModelCandidates, t as buildNoCapabilityModelConfiguredMessage } from "../runtime-shared-B7CzEHyU.js";
import { n as resolveAgentModelPrimaryValue, t as resolveAgentModelFallbackValues } from "../model-input-BKqwqbJE.js";
import { r as listImageGenerationProviders, t as getImageGenerationProvider } from "../registry-DJhwyo-l.js";
//#region src/agents/failover-error.d.ts
type CliTimeoutContext = {
  mode: "overall" | "no-output";
  timeoutSeconds: number;
  observedActivity: boolean;
  activeToolCount: number;
  backgroundTaskCount: number;
};
type FallbackAttemptRecord = {
  provider: string;
  model: string;
  reason: FailoverReason;
  status?: number;
  error?: string;
};
/** Structured error used to carry model fallback/failover metadata across layers. */
declare class FailoverError extends Error {
  readonly reason: FailoverReason;
  readonly provider?: string;
  readonly model?: string;
  readonly profileId?: string;
  readonly authMode?: string;
  readonly status?: number;
  readonly code?: string;
  readonly rawError?: string;
  readonly authProfileFailure?: {
    allInCooldown: boolean;
  };
  readonly sessionId?: string;
  readonly lane?: string;
  readonly suspend?: boolean;
  readonly cliTimeout?: CliTimeoutContext;
  readonly attempts?: readonly FallbackAttemptRecord[];
  readonly soonestCooldownExpiry?: number | null;
  constructor(message: string, params: {
    reason: FailoverReason;
    provider?: string;
    model?: string;
    profileId?: string;
    authMode?: string;
    status?: number;
    code?: string;
    rawError?: string;
    authProfileFailure?: {
      allInCooldown: boolean;
    };
    sessionId?: string;
    lane?: string;
    cause?: unknown;
    suspend?: boolean;
    cliTimeout?: CliTimeoutContext;
    attempts?: readonly FallbackAttemptRecord[];
    soonestCooldownExpiry?: number | null;
  });
}
/** Return true for native or serialized failover errors. */
declare function isFailoverError(err: unknown): err is FailoverError;
/** Convert a failover or raw error into structured fields for logs/UI. */
declare function describeFailoverError(err: unknown): {
  message: string;
  rawError?: string;
  reason?: FailoverReason;
  status?: number;
  code?: string;
  provider?: string;
  model?: string;
  profileId?: string;
  authMode?: string;
  sessionId?: string;
  lane?: string;
};
declare namespace image_generation_core_auth_runtime_d_exports {
  export { resolveApiKeyForProviderCore as resolveApiKeyForProvider };
}
//#endregion
//#region packages/media-generation-core/src/model-ref.d.ts
/** Parses strict generation model refs and rejects missing provider or model segments. */
declare function parseGenerationModelRef(raw: string | undefined): ProviderModelRef | null;
//#endregion
//#region src/plugin-sdk/image-generation-core.d.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
declare const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
type ImageGenerationCoreAuthRuntimeModule = typeof image_generation_core_auth_runtime_d_exports;
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
declare function resolveApiKeyForProvider(...args: Parameters<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>): Promise<Awaited<ReturnType<ImageGenerationCoreAuthRuntimeModule["resolveApiKeyForProvider"]>>>;
//#endregion
export { type AuthProfileStore, type FallbackAttempt, type GeneratedImageAsset, type ImageGenerationProvider, type ImageGenerationProviderConfiguredContext, type ImageGenerationProviderOptions, type ImageGenerationProviderPlugin, type ImageGenerationRequest, type ImageGenerationResolution, type ImageGenerationResult, type ImageGenerationSourceImage, OPENAI_DEFAULT_IMAGE_MODEL, type OpenClawConfig, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getImageGenerationProvider, getProviderEnvVars, isFailoverError, listImageGenerationProviders, normalizeGooglePreviewModelId as normalizeGoogleModelId, parseGenerationModelRef as parseImageGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };