import "../../acpx-hsLTUlEK.js";
import { n as OpenClawConfig } from "../../types.openclaw-n6JIVcIK.js";
import "../../types-CebnZ6B4.js";
import "../../config-C7SD4JcX.js";
import { r as AuthProfileStore } from "../../types-DPIbwdZr.js";
import { r as ProviderRequestCapability } from "../../provider-request-config-B67tGHJd.js";
import "../../provider-auth-helpers-6ijGucIR.js";
import { r as resolveProviderHttpRequestConfig } from "../../shared-EqvQs-V9.js";
import "../../provider-http-BQ0nquFZ.js";
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