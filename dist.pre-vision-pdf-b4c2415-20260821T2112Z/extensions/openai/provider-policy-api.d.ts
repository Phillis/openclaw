import { E as ProviderNormalizeResolvedModelContext, _ as ProviderResponseModelEquivalenceContext, b as ProviderDefaultThinkingPolicyContext, g as ProviderResolveModelRoutesContext, h as ProviderNormalizeModelCatalogIdContext, m as ProviderModelRouteResolution, x as ProviderThinkingProfile } from "../../types-CCx6rk6K.js";
import { l as ModelProviderConfig } from "../../types.openclaw-LvSHMCsQ.js";
//#region extensions/openai/provider-policy-api.d.ts
/** Canonical logical id for OpenAI catalog projection. */
declare function normalizeModelCatalogId(params: ProviderNormalizeModelCatalogIdContext): string | null;
declare function isResponseModelEquivalent(params: ProviderResponseModelEquivalenceContext): boolean;
/** Resolves authored OpenAI provider config without activating the runtime plugin. */
declare function resolveAuthoredOpenAIProviderConfig(params: {
  provider: string;
  config?: {
    models?: {
      providers?: Record<string, ModelProviderConfig | undefined>;
    };
  };
}): ModelProviderConfig | undefined;
/**
 * Skips full runtime loading only when OpenAI normalization is provably a no-op.
 * Transport-sensitive routes and legacy model aliases still use the runtime hook.
 */
declare function projectConfiguredModelRow(ctx: ProviderNormalizeResolvedModelContext): null | undefined;
/** Resolves every physical row for one logical OpenAI model in provider order. */
declare function resolveModelRoutes(context: ProviderResolveModelRoutesContext): ProviderModelRouteResolution;
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(params: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | null;
//#endregion
export { isResponseModelEquivalent, normalizeConfig, normalizeModelCatalogId, projectConfiguredModelRow, resolveAuthoredOpenAIProviderConfig, resolveModelRoutes, resolveThinkingProfile };