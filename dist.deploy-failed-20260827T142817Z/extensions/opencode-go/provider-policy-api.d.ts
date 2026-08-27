import { f as ProviderDefaultThinkingPolicyContext, p as ProviderThinkingProfile } from "../../types-Ci1t4mxf.js";
//#region extensions/opencode-go/provider-policy-api.d.ts
declare function isOpencodeGoFixedAnthropicReasoningModelId(modelId: unknown): boolean;
declare function resolveOpencodeGoThinkingProfile(modelId: string, context?: Pick<ProviderDefaultThinkingPolicyContext, "api" | "reasoning" | "compat">): ProviderThinkingProfile | undefined;
declare function resolveThinkingProfile(context: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | undefined;
//#endregion
export { isOpencodeGoFixedAnthropicReasoningModelId, resolveOpencodeGoThinkingProfile, resolveThinkingProfile };