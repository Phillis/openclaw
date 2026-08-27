import { n as OpenClawConfig } from "../../types.openclaw-eGZBtvai.js";
import { r as AuthProfileStore } from "../../types-BwtKGa6t.js";
import { i as ProviderRequestCapability } from "../../provider-request-config-B7W6uKKc.js";
import { t as resolveProviderHttpRequestConfig } from "../../shared-CwwHrGiU.js";
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