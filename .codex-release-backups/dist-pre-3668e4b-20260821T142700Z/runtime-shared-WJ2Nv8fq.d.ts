import { n as OpenClawConfig } from "./types.openclaw-6A5yUI1l.js";
import { f as AgentModelConfig } from "./types.models-Dfmf90bZ.js";
import { t as FallbackAttempt } from "./model-fallback.types-BTmHzJn6.js";
import { n as getProviderEnvVars } from "./provider-env-vars-oXP7Xdm8.js";

//#region src/media-generation/runtime-shared.d.ts
type ParsedProviderModelRef = {
  provider: string;
  model: string;
};
/** Records one provider/model failure in the common fallback-attempt shape. */
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