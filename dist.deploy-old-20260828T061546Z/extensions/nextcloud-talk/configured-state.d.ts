import { n as OpenClawConfig } from "../../types.openclaw-OHssSjQn.js";
import "../../config-contracts-CbBCWgEm.js";
//#region extensions/nextcloud-talk/configured-state.d.ts
/** Require a Nextcloud server plus its account-owned bot credential. */
declare function hasConfiguredNextcloudTalkChannelState(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): boolean;
//#endregion
export { hasConfiguredNextcloudTalkChannelState };