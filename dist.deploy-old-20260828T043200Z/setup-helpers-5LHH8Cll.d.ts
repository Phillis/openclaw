import { r as OpenClawConfig } from "./types.openclaw-Cjm06lg9.js";
import { d as ChannelSetupInput, u as ChannelSetupAdapter } from "./manifest-registry-BQiYh3fz.js";
import "./types.core-CECrTHHY.js";
import "./types.adapters-DkCKs5U0.js";
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
/** Applies setup-time account naming and optional root-name migration in one step. */
declare function prepareScopedSetupConfig(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  name?: string;
  alwaysUseAccounts?: boolean;
  migrateBaseName?: boolean;
}): OpenClawConfig;
/** Applies a setup patch using account-scoped config semantics. */
declare function applySetupAccountConfigPatch(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  patch: Record<string, unknown>;
}): OpenClawConfig;
/** Creates a setup adapter that turns validated setup input into an account config patch. */
declare function createPatchedAccountSetupAdapter<Input extends {
  name?: string;
} = ChannelSetupInput>(params: {
  channelKey: string;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  validateInput?: ChannelSetupAdapter<Input>["validateInput"];
  buildPatch: (input: Input) => Record<string, unknown>;
}): ChannelSetupAdapter<Input>;
type SetupInputPresenceRequirement = {
  someOf: string[];
  message: string;
};
declare function createSetupInputPresenceValidator<Input extends {
  name?: string;
  useEnv?: boolean;
} = ChannelSetupInput>(params: {
  defaultAccountOnlyEnvError?: string;
  whenNotUseEnv?: SetupInputPresenceRequirement[];
  validate?: (params: {
    cfg: OpenClawConfig;
    accountId: string;
    input: Input;
  }) => string | null;
}): NonNullable<ChannelSetupAdapter<Input>["validateInput"]>;
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
declare function createEnvPatchedAccountSetupAdapter(params: {
  channelKey: string;
  alwaysUseAccounts?: boolean;
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  defaultAccountOnlyEnvError: string;
  missingCredentialError: string;
  hasCredentials: (input: ChannelSetupInput) => boolean;
  validateInput?: ChannelSetupAdapter["validateInput"];
  buildPatch: (input: ChannelSetupInput) => Record<string, unknown>;
}): ChannelSetupAdapter;
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
declare function patchScopedAccountConfig(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  accountId: string;
  patch: Record<string, unknown>;
  accountPatch?: Record<string, unknown>;
  clearFields?: readonly string[];
  ensureChannelEnabled?: boolean;
  ensureAccountEnabled?: boolean;
  scopeDefaultToAccounts?: boolean;
}): OpenClawConfig;
/**
 * Promotes legacy single-account channel fields into the account map for multi-account setup.
 */
declare function moveSingleAccountChannelSectionToDefaultAccount(params: {
  cfg: OpenClawConfig;
  channelKey: string;
  setupSurface?: ChannelSetupAdapter;
}): OpenClawConfig;
//#endregion
export { createSetupInputPresenceValidator as a, patchScopedAccountConfig as c, createPatchedAccountSetupAdapter as i, prepareScopedSetupConfig as l, applySetupAccountConfigPatch as n, migrateBaseNameToDefaultAccount as o, createEnvPatchedAccountSetupAdapter as r, moveSingleAccountChannelSectionToDefaultAccount as s, applyAccountNameToChannelSection as t };