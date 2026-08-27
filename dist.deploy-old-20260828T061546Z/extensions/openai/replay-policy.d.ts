import { M as ProviderReplayPolicyContext, j as ProviderReplayPolicy } from "../../plugin-entry-DyrRrRy2.js";
//#region extensions/openai/replay-policy.d.ts
/**
 * Returns the provider-owned replay policy for OpenAI-family transports.
 */
declare function buildOpenAIReplayPolicy(ctx: ProviderReplayPolicyContext): ProviderReplayPolicy;
//#endregion
export { buildOpenAIReplayPolicy };