import { r as createLazyRuntimeModule } from "../lazy-runtime-CgCh8H_K.js";
import { a as resolveAgentModelPrimaryValue, i as resolveAgentModelFallbackValues } from "../model-input-ILUprkGk.js";
import { t as createSubsystemLogger } from "../subsystem-a4KzJVZG.js";
import { t as getProviderEnvVars } from "../provider-env-vars-CHIRS9qE.js";
import { a as describeFailoverError, c as isFailoverError } from "../failover-error-DVBvcQuA.js";
import { a as resolveCapabilityModelCandidates, d as throwCapabilityGenerationFailure, n as buildNoCapabilityModelConfiguredMessage } from "../runtime-shared-Dspu19ia.js";
import { i as listImageGenerationProviders, s as parseGenerationModelRef, t as getImageGenerationProvider } from "../registry-BIaJrYjd.js";
import { u as normalizeGooglePreviewModelId } from "../provider-model-shared-CF2CrQqB.js";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("../image-generation-core.auth.runtime-INu69cA3.js"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { OPENAI_DEFAULT_IMAGE_MODEL, buildNoCapabilityModelConfiguredMessage, createSubsystemLogger, describeFailoverError, getImageGenerationProvider, getProviderEnvVars, isFailoverError, listImageGenerationProviders, normalizeGooglePreviewModelId as normalizeGoogleModelId, parseGenerationModelRef as parseImageGenerationModelRef, resolveAgentModelFallbackValues, resolveAgentModelPrimaryValue, resolveApiKeyForProvider, resolveCapabilityModelCandidates, throwCapabilityGenerationFailure };
