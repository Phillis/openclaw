import { f as ProviderDefaultThinkingPolicyContext, p as ProviderThinkingProfile } from "../../types-BC3VLVBd.js";
import { l as ModelProviderConfig } from "../../types.openclaw-eGZBtvai.js";
//#region extensions/google/provider-policy-api.d.ts
declare function normalizeConfig(params: {
  provider: string;
  providerConfig: ModelProviderConfig;
}): ModelProviderConfig;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { normalizeConfig, resolveThinkingProfile };