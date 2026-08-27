import { g as ProviderNormalizeResolvedModelContext, m as ProviderThinkingProfile, p as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-BZAeuuKK.js";
import { o as ModelProviderConfig } from "../../types.models-DQnz5K9u.js";
import "../../provider-model-types-Dy05kVgC.js";
//#region extensions/ollama/provider-policy-api.d.ts
type OllamaProviderConfigDraft = Partial<ModelProviderConfig>;
/**
 * Provider policy surface for Ollama: normalize provider configs used by
 * core defaults/normalizers. This runs during config defaults application and
 * normalization paths (not Zod validation).
 */
declare function normalizeConfig({ provider, providerConfig }: {
  provider: string;
  providerConfig: OllamaProviderConfigDraft;
}): OllamaProviderConfigDraft;
/**
 * Ollama's local and cloud providers do not normalize resolved models.
 * Skip full plugin activation when the model-list path asks for that no-op.
 */
declare function projectConfiguredModelRow(ctx: ProviderNormalizeResolvedModelContext): null | undefined;
declare function resolveThinkingProfile({ modelId, provider, reasoning }: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile;
//#endregion
export { normalizeConfig, projectConfiguredModelRow, resolveThinkingProfile };