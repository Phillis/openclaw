import { n as OpenClawConfig } from "../../types.openclaw-D3Ap19Na.js";
import "../../config-contracts-yQGnmAhr.js";
//#region extensions/msteams/configured-state.d.ts
/** Mirror Teams auth-mode requirements without loading the Azure SDK or full channel. */
declare function hasConfiguredMSTeamsChannelState(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): boolean;
//#endregion
export { hasConfiguredMSTeamsChannelState };