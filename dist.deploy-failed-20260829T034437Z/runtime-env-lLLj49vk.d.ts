import { n as OpenClawConfig } from "./types.openclaw-Ca71eRYk.js";
import "./types-D4D938Wk.js";
import "./setup-wizard-types-BoxqfOlR.js";
import "tslog";
//#region src/channels/plugins/setup-helpers.d.ts
declare function applyAccountNameToChannelSection(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
declare function migrateBaseNameToDefaultAccount(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  alwaysUseAccounts?: boolean;
}): OpenClawConfig;
/** Applies a setup patch using account-scoped config semantics. */
declare function applySetupAccountConfigPatch(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  patch: Record<string, unknown>;
}): OpenClawConfig;
//#endregion
export { applySetupAccountConfigPatch as n, migrateBaseNameToDefaultAccount as r, applyAccountNameToChannelSection as t };