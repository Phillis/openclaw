import { r as OpenClawConfig } from "../types.openclaw-D3TBp_34.js";
import { D as ChannelSecurityDmPolicy } from "../types.core-CInSoozE.js";
import { A as authorizeConfigWrite, F as ConfigWriteTargetLike, M as formatConfigWriteDeniedMessage, N as ConfigWriteAuthorizationResultLike, P as ConfigWriteScopeLike, j as canBypassConfigWritePolicy, s as ChannelConfigAdapter } from "../types.adapters-GPtjDBAh.js";
import { t as buildAccountScopedDmSecurityPolicy } from "../helpers-BBnGZWZu.js";

//#region src/channels/plugins/dm-access.d.ts
/**
 * Selects whether canonical DM fields live at the top level or under `dm`.
 */
type ChannelDmAllowFromMode = "topOnly" | "topOrNested" | "nestedOnly";
/**
 * Supported direct-message policy values for channel account config.
 */
type ChannelDmPolicy = "pairing" | "allowlist" | "open" | "disabled";
/**
 * Normalized DM access view consumed by channel setup and reply gates.
 */
type ChannelDmAccess = {
  dmPolicy?: ChannelDmPolicy;
  allowFrom?: Array<string | number>;
};
/**
 * Mutable config record used while migrating channel account DM fields.
 */
type DmAccessRecord = Record<string, unknown>;
/**
 * Result returned by compatibility helpers after optional DM config mutation.
 */
type CompatMutationResult = {
  entry: DmAccessRecord;
  changed: boolean;
};
/**
 * Narrows a raw string to a supported channel DM policy.
 */
declare function normalizeChannelDmPolicy(value: string | undefined): ChannelDmPolicy | undefined;
/**
 * Resolves the effective DM policy from account, parent account, and default policy.
 */
declare function resolveChannelDmPolicy(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
  defaultPolicy?: string;
}): ChannelDmPolicy | undefined;
/**
 * Resolves the effective DM allowlist from account or parent account config.
 */
declare function resolveChannelDmAllowFrom(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
}): Array<string | number> | undefined;
/**
 * Resolves policy and allowlist together for channel access checks.
 */
declare function resolveChannelDmAccess(params: {
  account?: DmAccessRecord | null;
  parent?: DmAccessRecord | null;
  mode?: ChannelDmAllowFromMode;
  defaultPolicy?: string;
}): ChannelDmAccess;
/**
 * Writes a canonical DM allowlist and removes the matching legacy alias.
 */
declare function setCanonicalDmAllowFrom(params: {
  entry: DmAccessRecord;
  mode: ChannelDmAllowFromMode;
  allowFrom: Array<string | number>;
  pathPrefix: string;
  changes?: string[];
  reason: string;
}): void;
/**
 * Migrates legacy `dm.*` aliases into the canonical DM access fields.
 */
declare function normalizeLegacyDmAliases(params: {
  entry: DmAccessRecord;
  pathPrefix: string;
  changes: string[];
  promoteAllowFrom?: boolean;
}): CompatMutationResult;
/**
 * Ensures `dmPolicy="open"` has the wildcard allowlist required by access gates.
 */
declare function ensureOpenDmPolicyAllowFromWildcard(params: {
  entry: DmAccessRecord;
  mode: ChannelDmAllowFromMode;
  pathPrefix: string;
  changes: string[];
}): void;
//#endregion
//#region src/plugin-sdk/channel-config-helpers.d.ts
/** Origin scope used when authorizing channel config writes. */
type ConfigWriteScope = ConfigWriteScopeLike;
/** Target account/channel for a config write authorization check. */
type ConfigWriteTarget = ConfigWriteTargetLike;
/** Decision returned by channel config write policy helpers. */
type ConfigWriteAuthorizationResult = ConfigWriteAuthorizationResultLike;
type ChannelCrudConfigAdapter<ResolvedAccount> = Pick<ChannelConfigAdapter<ResolvedAccount>, "listAccountIds" | "resolveAccount" | "inspectAccount" | "defaultAccountId" | "setAccountEnabled" | "deleteAccount">;
type ChannelConfigAdapterWithAccessors<ResolvedAccount> = Pick<ChannelConfigAdapter<ResolvedAccount>, "listAccountIds" | "resolveAccount" | "inspectAccount" | "defaultAccountId" | "setAccountEnabled" | "deleteAccount" | "resolveAllowFrom" | "formatAllowFrom" | "resolveDefaultTo">;
/** Returns whether config writes are enabled for a channel/account target. */
declare function resolveChannelConfigWrites(params: {
  cfg: OpenClawConfig;
  channelId?: string | null;
  accountId?: string | null;
}): boolean;
type ChannelConfigAccessorParams<Config extends OpenClawConfig = OpenClawConfig> = {
  cfg: Config;
  accountId?: string | null;
};
type MultiAccountChannelConfigAdapterParams<ResolvedAccount, AccessorAccount = ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig> = {
  sectionKey: string;
  listAccountIds: (cfg: Config) => string[];
  resolveAccount: (cfg: Config, accountId?: string | null) => ResolvedAccount;
  resolveAccessorAccount?: (params: ChannelConfigAccessorParams<Config>) => AccessorAccount;
  defaultAccountId: (cfg: Config) => string;
  inspectAccount?: (cfg: Config, accountId?: string | null) => unknown;
  clearBaseFields: string[];
  resolveAllowFrom: (account: AccessorAccount) => Array<string | number> | null | undefined;
  formatAllowFrom: (allowFrom: Array<string | number>) => string[];
  resolveDefaultTo?: (account: AccessorAccount) => string | number | null | undefined;
};
type NamedAccountChannelConfigBaseParams<ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig> = {
  sectionKey: string;
  listAccountIds: (cfg: Config) => string[];
  resolveAccount: (cfg: Config, accountId?: string | null) => ResolvedAccount;
  defaultAccountId: (cfg: Config) => string;
  inspectAccount?: (cfg: Config, accountId?: string | null) => unknown;
  clearBaseFields: string[];
};
/** Coerce mixed allowlist config values into plain strings without trimming or deduping. */
declare function mapAllowFromEntries(allowFrom: Array<string | number> | null | undefined): string[];
/** Normalize user-facing allowlist entries the same way config and doctor flows expect. */
declare function formatTrimmedAllowFromEntries(allowFrom: Array<string | number>): string[];
/** Collapse nullable config scalars into a trimmed optional string. */
declare function resolveOptionalConfigString(value: string | number | null | undefined): string | undefined;
/** Adapt `{ cfg, accountId }` accessors to callback sites that pass positional args. */
declare function adaptScopedAccountAccessor<Result, Config extends OpenClawConfig = OpenClawConfig>(accessor: (params: {
  cfg: Config;
  accountId?: string | null;
}) => Result): (cfg: Config, accountId?: string | null) => Result;
/** Build the shared allowlist/default target adapter surface for account-scoped channel configs. */
declare function createScopedAccountConfigAccessors<ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: {
  /** Resolves the account used by read-only config accessors from `{ cfg, accountId }`. */resolveAccount: (params: {
    cfg: Config;
    accountId?: string | null;
  }) => ResolvedAccount; /** Reads raw allowlist entries from the resolved account. */
  resolveAllowFrom: (account: ResolvedAccount) => Array<string | number> | null | undefined; /** Formats allowlist entries for display or config inspection. */
  formatAllowFrom: (allowFrom: Array<string | number>) => string[]; /** Optional default destination selector; omitted when the channel has no default target. */
  resolveDefaultTo?: (account: ResolvedAccount) => string | number | null | undefined;
}): Pick<ChannelConfigAdapter<ResolvedAccount>, "resolveAllowFrom" | "formatAllowFrom" | "resolveDefaultTo">;
/** Build the common CRUD/config helpers for channels that store multiple named accounts. */
declare function createScopedChannelConfigBase<ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: NamedAccountChannelConfigBaseParams<ResolvedAccount, Config> & {
  allowTopLevel?: boolean;
}): ChannelCrudConfigAdapter<ResolvedAccount>;
/** Build the full shared config adapter for account-scoped channels with allowlist/default target accessors. */
declare function createScopedChannelConfigAdapter<ResolvedAccount, AccessorAccount = ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: MultiAccountChannelConfigAdapterParams<ResolvedAccount, AccessorAccount, Config> & {
  allowTopLevel?: boolean;
}): ChannelConfigAdapterWithAccessors<ResolvedAccount>;
/** Build CRUD/config helpers for top-level single-account channels. */
declare function createTopLevelChannelConfigBase<ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: {
  sectionKey: string;
  resolveAccount: (cfg: Config) => ResolvedAccount;
  listAccountIds?: (cfg: Config) => string[];
  defaultAccountId?: (cfg: Config) => string;
  inspectAccount?: (cfg: Config) => unknown;
  deleteMode?: "remove-section" | "clear-fields";
  clearBaseFields?: string[];
}): Pick<ChannelConfigAdapter<ResolvedAccount>, "listAccountIds" | "resolveAccount" | "inspectAccount" | "defaultAccountId" | "setAccountEnabled" | "deleteAccount">;
/** Build the full shared config adapter for top-level single-account channels with allowlist/default target accessors. */
declare function createTopLevelChannelConfigAdapter<ResolvedAccount, AccessorAccount = ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: {
  sectionKey: string;
  resolveAccount: (cfg: Config) => ResolvedAccount;
  resolveAccessorAccount?: (params: {
    cfg: Config;
    accountId?: string | null;
  }) => AccessorAccount;
  listAccountIds?: (cfg: Config) => string[];
  defaultAccountId?: (cfg: Config) => string;
  inspectAccount?: (cfg: Config) => unknown;
  deleteMode?: "remove-section" | "clear-fields";
  clearBaseFields?: string[];
  resolveAllowFrom: (account: AccessorAccount) => Array<string | number> | null | undefined;
  formatAllowFrom: (allowFrom: Array<string | number>) => string[];
  resolveDefaultTo?: (account: AccessorAccount) => string | number | null | undefined;
}): ChannelConfigAdapterWithAccessors<ResolvedAccount>;
/** Build CRUD/config helpers for channels where the default account lives at channel root and named accounts live under `accounts`. */
declare function createHybridChannelConfigBase<ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: NamedAccountChannelConfigBaseParams<ResolvedAccount, Config> & {
  preserveSectionOnDefaultDelete?: boolean;
}): ChannelCrudConfigAdapter<ResolvedAccount>;
/** Build the full shared config adapter for hybrid channels with allowlist/default target accessors. */
declare function createHybridChannelConfigAdapter<ResolvedAccount, AccessorAccount = ResolvedAccount, Config extends OpenClawConfig = OpenClawConfig>(params: MultiAccountChannelConfigAdapterParams<ResolvedAccount, AccessorAccount, Config> & {
  preserveSectionOnDefaultDelete?: boolean;
}): ChannelConfigAdapterWithAccessors<ResolvedAccount>;
/** Convert account-specific DM security fields into the shared runtime policy resolver shape. */
declare function createScopedDmSecurityResolver<ResolvedAccount extends {
  accountId?: string | null;
}>(params: {
  channelKey: string;
  resolvePolicy: (account: ResolvedAccount) => string | null | undefined;
  resolveAllowFrom: (account: ResolvedAccount) => Array<string | number> | null | undefined;
  resolveAccess?: (params: {
    cfg: OpenClawConfig;
    accountId?: string | null;
    account: ResolvedAccount;
  }) => {
    dmPolicy?: string | null;
    allowFrom?: Array<string | number> | null;
  };
  resolveFallbackAccountId?: (account: ResolvedAccount) => string | null | undefined;
  defaultPolicy?: string;
  allowFromPathSuffix?: string;
  policyPathSuffix?: string;
  approveChannelId?: string;
  approveHint?: string;
  normalizeEntry?: (raw: string) => string;
  inheritSharedDefaultsFromDefaultAccount?: boolean;
}): ({
  cfg,
  accountId,
  account
}: {
  cfg: OpenClawConfig;
  accountId?: string | null;
  account: ResolvedAccount;
}) => ChannelSecurityDmPolicy;
//#endregion
export { type ChannelDmAccess, type ChannelDmAllowFromMode, type ChannelDmPolicy, ConfigWriteAuthorizationResult, ConfigWriteScope, ConfigWriteTarget, type DmAccessRecord, adaptScopedAccountAccessor, authorizeConfigWrite, buildAccountScopedDmSecurityPolicy, canBypassConfigWritePolicy, createHybridChannelConfigAdapter, createHybridChannelConfigBase, createScopedAccountConfigAccessors, createScopedChannelConfigAdapter, createScopedChannelConfigBase, createScopedDmSecurityResolver, createTopLevelChannelConfigAdapter, createTopLevelChannelConfigBase, ensureOpenDmPolicyAllowFromWildcard, formatConfigWriteDeniedMessage, formatTrimmedAllowFromEntries, mapAllowFromEntries, normalizeChannelDmPolicy, normalizeLegacyDmAliases, resolveChannelConfigWrites, resolveChannelDmAccess, resolveChannelDmAllowFrom, resolveChannelDmPolicy, resolveOptionalConfigString, setCanonicalDmAllowFrom };