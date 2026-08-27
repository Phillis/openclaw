import { T as ProviderThinkingProfile, w as ProviderDefaultThinkingPolicyContext } from "../../plugin-entry-bE5OaTNY.js";
//#region extensions/openai/thinking-policy.d.ts
type OpenAIThinkingCompat = ProviderDefaultThinkingPolicyContext["compat"];
type OpenAIThinkingApi = ProviderDefaultThinkingPolicyContext["api"];
declare function resolveOpenAICodexThinkingProfile(modelId: string, agentRuntime?: string | null, compat?: OpenAIThinkingCompat, api?: OpenAIThinkingApi): ProviderThinkingProfile;
declare function resolveUnifiedOpenAIThinkingProfile(modelId: string, agentRuntime?: string | null, compat?: OpenAIThinkingCompat, api?: OpenAIThinkingApi): ProviderThinkingProfile;
//#endregion
export { resolveOpenAICodexThinkingProfile, resolveUnifiedOpenAIThinkingProfile };