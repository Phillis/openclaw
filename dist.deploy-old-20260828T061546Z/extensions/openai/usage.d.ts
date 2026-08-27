import { A as ProviderResolvedUsageAuth, E as ProviderFetchUsageSnapshotContext, I as ProviderUsageSnapshot, k as ProviderResolveUsageAuthContext } from "../../plugin-entry-DyrRrRy2.js";
//#region extensions/openai/usage.d.ts
declare function resolveOpenAIUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchOpenAIUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenAIUsage, resolveOpenAIUsageAuth };