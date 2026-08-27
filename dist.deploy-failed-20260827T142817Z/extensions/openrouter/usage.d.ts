import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-3CDavCPO.js";
import { t as ProviderUsageSnapshot } from "../../provider-usage.types-BZaNBkIn.js";
//#region extensions/openrouter/usage.d.ts
declare function fetchOpenRouterUsage(params: {
  token: string;
  baseUrl?: string;
  request?: ModelProviderDeclarationConfig["request"];
  timeoutMs: number;
  fetchFn: typeof fetch;
}): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchOpenRouterUsage };