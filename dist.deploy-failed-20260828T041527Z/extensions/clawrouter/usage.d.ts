import { r as fetchWithSsrFGuard } from "../../fetch-guard-DNck_vGd.js";
import { t as ProviderUsageSnapshot } from "../../provider-usage.types-CXOhznMu.js";
import "../../ssrf-runtime-if6qmXwZ.js";
//#region extensions/clawrouter/usage.d.ts
type ClawRouterUsageFetchGuard = typeof fetchWithSsrFGuard;
declare function fetchClawRouterUsage(params: {
  token: string;
  baseUrl?: string;
  timeoutMs: number;
  /** Test-only seam; production keeps the shared SSRF guard owning transport. */
  fetchGuard?: ClawRouterUsageFetchGuard;
}): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchClawRouterUsage };