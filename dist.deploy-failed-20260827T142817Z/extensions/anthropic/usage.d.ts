import { b as ProviderResolveUsageAuthContext, g as ProviderFetchUsageSnapshotContext, m as ProviderUsageSnapshot, x as ProviderResolvedUsageAuth } from "../../types-R6eI-mj_.js";
//#region extensions/anthropic/usage.d.ts
declare function resolveAnthropicUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchAnthropicUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchAnthropicUsage, resolveAnthropicUsageAuth };