import { r as createLazyRuntimeModule } from "./lazy-runtime-CgCh8H_K.js";
import "./subsystem-DNgaGOch.js";
import "./provider-env-vars-BN1Fc4Xk.js";
import "./failover-error-DKFCUqL9.js";
import "./runtime-shared-BH6rbtOk.js";
import "./registry-D6B6dZui.js";
import "./provider-model-shared-BRD_qtgE.js";
//#region src/plugin-sdk/image-generation-core.ts
/** Default OpenAI image model used when image-generation provider config omits one. */
const OPENAI_DEFAULT_IMAGE_MODEL = "gpt-image-2";
const loadImageGenerationCoreAuthRuntime = createLazyRuntimeModule(() => import("./image-generation-core.auth.runtime.js"));
/** Resolve image-generation provider API keys through the lazy auth runtime helper. */
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as n, OPENAI_DEFAULT_IMAGE_MODEL as t };
