import { a as GenerateImageParams, f as getImageGenerationProvider, o as GenerateImageRuntimeResult, p as listImageGenerationProviders, st as getProviderEnvVars } from "../../plugin-entry-GuVBIlyS.js";
import { n as OpenClawConfig } from "../../types.openclaw-VfFCsbZD.js";
import { bt as SubsystemLogger, q as ImageGenerationProvider } from "../../types-BqCPJyXZ.js";

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