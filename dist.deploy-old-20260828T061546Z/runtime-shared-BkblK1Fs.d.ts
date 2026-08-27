import { n as OpenClawConfig } from "./types.openclaw-DckSqIPo.js";
import { f as AgentModelConfig } from "./types.models-BxGvs1Ab.js";
import "./types-B4QsRB1k.js";
import { t as FallbackAttempt } from "./model-fallback.types-DRMjhurk.js";
import { n as getProviderEnvVars } from "./provider-env-vars-Ob29-zkr.js";
//#region src/media-generation/runtime-shared.d.ts
type ParsedProviderModelRef = {
  provider: string;
  model: string;
};
type CapabilityProviderCandidate = {
  id: string;
  aliases?: readonly string[];
  defaultModel?: string | null;
  models?: readonly string[];
  isConfigured?: (ctx: {
    cfg?: OpenClawConfig;
    agentDir?: string;
  }) => boolean;
};
/** Builds ordered provider/model candidates for one media capability request. */
declare function resolveCapabilityModelCandidates(params: {
  cfg: OpenClawConfig;
  modelConfig: AgentModelConfig | undefined;
  modelOverride?: string;
  parseModelRef: (raw: string | undefined) => ParsedProviderModelRef | null;
  agentDir?: string;
  listProviders?: (cfg?: OpenClawConfig) => CapabilityProviderCandidate[];
  autoProviderFallback?: boolean;
}): ParsedProviderModelRef[];
/** Chooses the closest supported size by aspect ratio and area. */
declare function resolveClosestSize(params: {
  requestedSize?: string;
  requestedAspectRatio?: string;
  supportedSizes?: readonly string[];
}): string | undefined;
/** Throws a summarized error after all provider/model candidates fail. */
declare function throwCapabilityGenerationFailure(params: {
  capabilityLabel: string;
  attempts: FallbackAttempt[];
  lastError: unknown;
}): never;
/** Formats setup guidance when no model is configured for a media capability. */
declare function buildNoCapabilityModelConfiguredMessage(params: {
  capabilityLabel: string;
  modelConfigKey: string;
  providers: Array<{
    id: string;
    defaultModel?: string | null;
  }>;
  fallbackSampleRef?: string;
  getProviderEnvVars?: typeof getProviderEnvVars;
}): string;
//#endregion
export { throwCapabilityGenerationFailure as i, resolveCapabilityModelCandidates as n, resolveClosestSize as r, buildNoCapabilityModelConfiguredMessage as t };