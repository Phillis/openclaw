import { n as OpenClawConfig } from "../../types.openclaw-Dbu8qmVI.js";
import "../../config-contracts-OcWhZue9.js";
//#region extensions/nextcloud-talk/configured-state.d.ts
/** Require a Nextcloud server plus its account-owned bot credential. */
declare function hasConfiguredNextcloudTalkChannelState(params: {
  cfg: OpenClawConfig;
  env?: NodeJS.ProcessEnv;
}): boolean;
//#endregion
export { hasConfiguredNextcloudTalkChannelState };