import { _ as getProviderEnvVars, m as GenerateImageRuntimeResult, mt as SubsystemLogger, p as GenerateImageParams } from "../../runtime-api-B8urSeFb.js";
import { n as OpenClawConfig } from "../../types.openclaw-R2xZRh0U.js";
import { o as ImageGenerationProvider } from "../../types-jG5kg5so.js";
import "../../types-DUshKpKL.js";
import "../../types-CJzc75hI.js";
//#region src/media-generation/registry.d.ts
/** Registry for image-generation providers contributed by plugin capabilities. */
declare const listImageGenerationProviders: (cfg?: OpenClawConfig) => ImageGenerationProvider[], getImageGenerationProvider: (providerId: string | undefined, cfg?: OpenClawConfig) => ImageGenerationProvider | undefined;
//#endregion
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