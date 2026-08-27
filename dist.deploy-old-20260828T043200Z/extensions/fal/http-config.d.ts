import "../../acpx-BA25QFjp.js";
import { n as OpenClawConfig } from "../../types.openclaw-Ca71eRYk.js";
import "../../types-D4D938Wk.js";
import "../../config-CxevWhLB.js";
import { r as AuthProfileStore } from "../../types-DeG9PxQi.js";
import { r as ProviderRequestCapability } from "../../provider-request-config-BAddg9J0.js";
import "../../provider-auth-helpers-BCJZFgum.js";
import { r as resolveProviderHttpRequestConfig } from "../../shared-7_Odzgui.js";
import "../../provider-http-CyNYsG6w.js";
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