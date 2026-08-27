//#region src/channels/plugins/account-helpers.d.ts
/**
 * Resolves an account config by id, then merges it over channel-level defaults.
 */
declare function resolveMergedAccountConfig<TConfig extends Record<string, unknown>>(params: {
  channelConfig: TConfig | undefined;
  accounts: Record<string, Partial<TConfig>> | undefined;
  accountId: string;
  omitKeys?: string[];
  normalizeAccountId?: (accountId: string) => string;
  nestedObjectKeys?: string[];
}): TConfig;
//#endregion
//#region src/routing/account-lookup.d.ts
declare function resolveNormalizedAccountEntry<T>(accounts: Record<string, T> | undefined, accountId: string, normalizeAccountId: (accountId: string) => string): T | undefined;
//#endregion
//#region src/plugin-sdk/account-configured-ids.d.ts
/** List normalized configured account ids from a raw channel account record map. */
declare function listConfiguredAccountIds(params: {
  accounts: Record<string, unknown> | undefined;
  normalizeAccountId: (accountId: string) => string;
}): string[];
//#endregion
export { listConfiguredAccountIds, resolveMergedAccountConfig, resolveNormalizedAccountEntry };