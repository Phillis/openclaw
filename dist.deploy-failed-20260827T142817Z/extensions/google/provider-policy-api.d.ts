import { f as ProviderDefaultThinkingPolicyContext, p as ProviderThinkingProfile } from "../../types-Ci1t4mxf.js";
import { l as ModelProviderConfig } from "../../types.openclaw-CpYrAZv3.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };