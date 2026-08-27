import { f as ProviderDefaultThinkingPolicyContext, p as ProviderThinkingProfile } from "./types-CbXjz50O.js";
//#region extensions/vllm/thinking-policy.d.ts
type VllmQwenThinkingFormat = "chat-template" | "top-level";
declare function resolveVllmQwenThinkingFormatFromCompat(compat?: ProviderDefaultThinkingPolicyContext["compat"]): VllmQwenThinkingFormat | undefined;
declare function resolveThinkingProfile(ctx: ProviderDefaultThinkingPolicyContext): ProviderThinkingProfile | null;
//#endregion
export { resolveThinkingProfile as n, resolveVllmQwenThinkingFormatFromCompat as r, VllmQwenThinkingFormat as t };