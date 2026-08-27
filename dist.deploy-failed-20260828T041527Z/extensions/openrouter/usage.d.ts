import { u as ModelProviderDeclarationConfig } from "../../types.openclaw-R2xZRh0U.js";
import { t as ProviderUsageSnapshot } from "../../provider-usage.types-CXOhznMu.js";
import "../../provider-model-shared-Cgf15Gsj.js";
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