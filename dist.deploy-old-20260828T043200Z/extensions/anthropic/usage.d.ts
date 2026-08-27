import { T as ProviderUsageSnapshot, h as ProviderFetchUsageSnapshotContext, v as ProviderResolveUsageAuthContext, y as ProviderResolvedUsageAuth } from "../../plugin-entry-BZAeuuKK.js";
//#region extensions/anthropic/usage.d.ts
declare function resolveAnthropicUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchAnthropicUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchAnthropicUsage, resolveAnthropicUsageAuth };