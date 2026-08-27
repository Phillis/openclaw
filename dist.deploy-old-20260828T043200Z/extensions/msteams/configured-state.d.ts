import { n as OpenClawConfig } from "../../types.openclaw-BjZ8Xxcu.js";
import "../../config-contracts-DBboNIpX.js";
//#region extensions/msteams/configured-state.d.ts
/** Mirror Teams auth-mode requirements without loading the Azure SDK or full channel. */
declare function hasConfiguredMSTeamsChannelState(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): boolean;
//#endregion
export { hasConfiguredMSTeamsChannelState };