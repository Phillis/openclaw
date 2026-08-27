import { n as OpenClawConfig } from "../types.openclaw-BssW6c46.js";
import { t as SubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { l as VideoGenerationProvider } from "../types-CN4xEaaq.js";
import { n as getProviderEnvVars } from "../provider-env-vars-mWhYMMvj.js";
import { n as GenerateVideoRuntimeResult, t as GenerateVideoParams } from "../runtime-types-BxIVXRuL.js";
import { i as listVideoGenerationProviders, n as getVideoGenerationProvider } from "../registry-DJhwyo-l.js";
//#region src/video-generation/runtime.d.ts
declare const log: SubsystemLogger;
type VideoGenerationRuntimeDeps = {
  getProvider?: typeof getVideoGenerationProvider;
  listProviders?: typeof listVideoGenerationProviders;
  getProviderEnvVars?: typeof getProviderEnvVars;
  log?: Pick<typeof log, "debug" | "warn">;
};
declare function listRuntimeVideoGenerationProviders(params?: {
  config?: OpenClawConfig;
}, deps?: VideoGenerationRuntimeDeps): VideoGenerationProvider[];
declare function generateVideo(params: GenerateVideoParams, deps?: VideoGenerationRuntimeDeps): Promise<GenerateVideoRuntimeResult>;
//#endregion
export { type GenerateVideoParams, type GenerateVideoRuntimeResult, generateVideo, listRuntimeVideoGenerationProviders };