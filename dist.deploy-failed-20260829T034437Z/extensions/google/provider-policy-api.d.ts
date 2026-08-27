import { At as ProviderThinkingProfile, kt as ProviderDefaultThinkingPolicyContext } from "../../acpx-D5fMZfg0.js";
import { l as ModelProviderConfig } from "../../types.openclaw-Ca71eRYk.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };