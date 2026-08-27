import { n as OpenClawConfig } from "../types.openclaw-CNftZ6Ix.js";
import { t as SubsystemLogger } from "../subsystem-RmDRaRJV.js";
import { c as VideoGenerationProvider } from "../types-CvCiRlSW.js";
import { n as getProviderEnvVars } from "../provider-env-vars-CkP8f8Dv.js";
import { n as GenerateVideoRuntimeResult, t as GenerateVideoParams } from "../runtime-types-CI_O3Sif.js";
import { i as listVideoGenerationProviders, n as getVideoGenerationProvider } from "../registry-CQ-NQwqp.js";

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