import { ANTHROPIC_MESSAGES_API, CachedTokenEntry, FOUNDRY_ANTHROPIC_SCOPE, TOKEN_REFRESH_MARGIN_MS, buildFoundryProviderBaseUrl, extractFoundryEndpoint, isFoundryProviderApi, resolveConfiguredModelNameHint } from "./shared.js";

//#region extensions/microsoft-foundry/shared-runtime.d.ts
declare function getFoundryTokenCacheKey(params?: {
  scope?: string;
  subscriptionId?: string;
  tenantId?: string;
}): string;
//#endregion
export { ANTHROPIC_MESSAGES_API, type CachedTokenEntry, FOUNDRY_ANTHROPIC_SCOPE, TOKEN_REFRESH_MARGIN_MS, buildFoundryProviderBaseUrl, extractFoundryEndpoint, getFoundryTokenCacheKey, isFoundryProviderApi, resolveConfiguredModelNameHint };