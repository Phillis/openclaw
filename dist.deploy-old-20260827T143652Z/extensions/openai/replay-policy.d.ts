import { F as ProviderReplayPolicyContext, P as ProviderReplayPolicy } from "../../types-CCx6rk6K.js";
//#region extensions/openai/replay-policy.d.ts
/**
 * Returns the provider-owned replay policy for OpenAI-family transports.
 */
declare function buildOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy;
//#endregion
export { buildOpenAIReplayPolicy };