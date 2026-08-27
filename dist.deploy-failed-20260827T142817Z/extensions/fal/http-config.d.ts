import { n as OpenClawConfig } from "../../types.openclaw-CpYrAZv3.js";
import { r as AuthProfileStore } from "../../types-CNLVqgGq.js";
import { i as ProviderRequestCapability } from "../../provider-request-config-B3PbEfcF.js";
import { t as resolveProviderHttpRequestConfig } from "../../shared-CuxFz2if.js";
//#region extensions/fal/http-config.d.ts
type FalAuthenticatedRequest = {
  cfg?: OpenClawConfig;
  agentDir?: string;
  authStore?: AuthProfileStore;
};
declare function resolveFalHttpRequestConfig(params: {
  req: FalAuthenticatedRequest;
  baseUrl?: string;
  capability: ProviderRequestCapability;
}): Promise<ReturnType<typeof resolveProviderHttpRequestConfig>>;
//#endregion
export { resolveFalHttpRequestConfig };