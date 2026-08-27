import { D as ProviderNormalizeResolvedModelContext, Dt as ProviderResolveModelRoutesContext, Et as ProviderNormalizeModelCatalogIdContext, Ot as ProviderResponseModelEquivalenceContext, T as ProviderThinkingProfile, Tt as ProviderModelRouteResolution, w as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-bE5OaTNY.js";
import { l as ModelProviderConfig } from "../../types.openclaw-D3Ap19Na.js";
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