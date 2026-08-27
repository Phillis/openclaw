import { t as fetchWithSsrFGuard } from "../../fetch-guard-BT2VcYZd.js";
import { t as ProviderUsageSnapshot } from "../../provider-usage.types-BZaNBkIn.js";
//#region extensions/clawrouter/usage.d.ts
type ClawRouterUsageFetchGuard = typeof fetchWithSsrFGuard;
declare function fetchClawRouterUsage(params: {
  token: string;
  baseUrl?: string;
  timeoutMs: number; /** Test-only seam; production keeps the shared SSRF guard owning transport. */
  fetchGuard?: ClawRouterUsageFetchGuard;
}): Promise<ProviderUsageSnapshot>;
//#endregion
export { fetchClawRouterUsage };