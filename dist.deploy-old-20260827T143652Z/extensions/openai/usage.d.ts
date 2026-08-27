import { O as ProviderResolveUsageAuthContext, T as ProviderFetchUsageSnapshotContext, k as ProviderResolvedUsageAuth } from "../../types-CCx6rk6K.js";
import { t as ProviderUsageSnapshot } from "../../provider-usage.types-BZaNBkIn.js";
//#region extensions/openai/usage.d.ts
declare function resolveOpenAIUsageAuth(ctx: ProviderResolveUsageAuthContext): Promise<ProviderResolvedUsageAuth>;
declare function fetchOpenAIUsage(ctx: ProviderFetchUsageSnapshotContext): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenAIUsage, resolveOpenAIUsageAuth };