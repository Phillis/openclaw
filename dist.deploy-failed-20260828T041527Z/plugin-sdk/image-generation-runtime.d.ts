import { n as OpenClawConfig } from "../types.openclaw-DckSqIPo.js";
import { t as SubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { l as ImageGenerationProvider } from "../types-CBj3dJsd.js";
import { n as getProviderEnvVars } from "../provider-env-vars-Ob29-zkr.js";
import { n as GenerateImageRuntimeResult, t as GenerateImageParams } from "../runtime-types-BxSAgYIT.js";
import { r as listImageGenerationProviders, t as getImageGenerationProvider } from "../registry-CmnKTBVk.js";
//#region src/image-generation/runtime.d.ts
declare const log: SubsystemLogger;
/** Dependency seam used by image-generation runtime tests and plugin host callers. */
type ImageGenerationRuntimeDeps = {
  getProvider?: typeof getImageGenerationProvider;
  listProviders?: typeof listImageGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "warn">;
};
/** Lists image-generation providers visible for the current config. */
declare function listRuntimeImageGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: ImageGenerationRuntimeDeps): ImageGenerationProvider[];
declare function generateImage(params: GenerateImageParams, deps?: ImageGenerationRuntimeDeps): Promise<GenerateImageRuntimeResult>;
//#endregion
export { type GenerateImageParams, type GenerateImageRuntimeResult, generateImage, listRuntimeImageGenerationProviders };