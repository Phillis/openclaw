import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { m as normalizeUniqueStringEntries } from "./string-normalization-e_fvmxMf.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { n as resolveNormalizedAccountEntry, t as resolveAccountEntry } from "./account-lookup-CaTe6-6f.js";
//#region src/channels/plugins/account-helpers.ts
/**
* Channel plugin account helper factory.
*
* Lists configured accounts and resolves default-account behavior for plugin configs.
*/
/**
* Creates reusable account listing, default selection, and merged config helpers for a channel.
*/
function createAccountListHelpers(channelKey, options) {
	function hasImplicitDefaultAccount(cfg) {
		const channel = cfg.channels?.[channelKey];
		return Boolean(options?.hasImplicitDefaultAccount?.(cfg) || options?.implicitDefaultAccount?.channelKeys?.some((key) => hasConfiguredAccountValue(channel?.[key])) || options?.implicitDefaultAccount?.envVars?.some((key) => hasConfiguredAccountValue(process.env[key])));
	}
	function resolveConfiguredDefaultAccountId(cfg) {
		const channel = cfg.channels?.[channelKey];
		return normalizeOptionalAccountId(typeof channel?.defaultAccount === "string" ? channel.defaultAccount : void 0);
	}
	function listConfiguredAccountIds(cfg) {
		const accounts = (cfg.channels?.[channelKey])?.accounts;
		if (!accounts || typeof accounts !== "object") return [];
		const ids = Object.keys(accounts).filter(Boolean);
		const normalizeConfiguredAccountId = options?.normalizeAccountId;
		if (!normalizeConfiguredAccountId) return ids;
		return normalizeUniqueStringEntries(ids.map((id) => normalizeConfiguredAccountId(id)));
	}
	function listAccountIds(cfg) {
		return listCombinedAccountIds({
			configuredAccountIds: listConfiguredAccountIds(cfg),
			additionalAccountIds: options?.additionalAccountIds?.(cfg),
			implicitAccountId: options?.resolveImplicitAccountId ? options.resolveImplicitAccountId(cfg) : hasImplicitDefaultAccount(cfg) ? DEFAULT_ACCOUNT_ID : void 0,
			fallbackAccountIdWhenEmpty: options?.fallbackAccountIdWhenEmpty === false ? void 0 : options?.fallbackAccountIdWhenEmpty ?? "default"
		});
	}
	function resolveDefaultAccountId(cfg) {
		return resolveListedDefaultAccountId({
			accountIds: listAccountIds(cfg),
			configuredDefaultAccountId: resolveConfiguredDefaultAccountId(cfg),
			allowUnlistedDefaultAccount: options?.allowUnlistedDefaultAccount
		});
	}
	return {
		listConfiguredAccountIds,
		listAccountIds,
		resolveDefaultAccountId,
		resolveAccountConfig: (cfg, accountId) => {
			const channelConfig = cfg.channels?.[channelKey];
			const accounts = channelConfig?.accounts;
			return resolveMergedAccountConfig({
				channelConfig,
				accounts,
				accountId,
				omitKeys: options?.omitKeys,
				normalizeAccountId: options?.normalizeAccountId,
				nestedObjectKeys: options?.nestedObjectKeys
			});
		}
	};
}
/**
* Checks whether a config/env value should count as an account being configured.
*/
function hasConfiguredAccountValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
/**
* Combines configured, additional, implicit, and fallback account ids into stable order.
*/
function listCombinedAccountIds(params) {
	const ids = /* @__PURE__ */ new Set();
	for (const accountIds of [
		params.configuredAccountIds,
		params.additionalAccountIds ?? [],
		params.implicitAccountId ? [params.implicitAccountId] : []
	]) for (const accountId of accountIds) if (accountId) ids.add(accountId);
	if (ids.size === 0 && params.fallbackAccountIdWhenEmpty) return [params.fallbackAccountIdWhenEmpty];
	return [...ids].toSorted((a, b) => a.localeCompare(b));
}
/**
* Resolves the default account id from a listed account set and optional configured preference.
*/
function resolveListedDefaultAccountId(params) {
	const preferred = params.configuredDefaultAccountId;
	const normalizeListedAccountId = params.normalizeListedAccountId ?? normalizeAccountId;
	if (preferred && (params.allowUnlistedDefaultAccount || params.accountIds.some((accountId) => normalizeListedAccountId(accountId) === preferred))) return preferred;
	if (params.accountIds.includes("default")) return DEFAULT_ACCOUNT_ID;
	if (params.ambiguousFallbackAccountId && params.accountIds.length > 1) return params.ambiguousFallbackAccountId;
	return params.accountIds[0] ?? "default";
}
/**
* Merges channel-level config with account-level overrides.
*/
function mergeAccountConfig(params) {
	const omitKeys = /* @__PURE__ */ new Set(["accounts", ...params.omitKeys ?? []]);
	const base = Object.fromEntries(Object.entries(params.channelConfig ?? {}).filter(([key]) => !omitKeys.has(key)));
	const merged = {
		...base,
		...params.accountConfig
	};
	for (const key of params.nestedObjectKeys ?? []) {
		const baseValue = base[key];
		const accountValue = params.accountConfig?.[key];
		if (typeof baseValue === "object" && baseValue != null && !Array.isArray(baseValue) && typeof accountValue === "object" && accountValue != null && !Array.isArray(accountValue)) merged[key] = {
			...baseValue,
			...accountValue
		};
	}
	return merged;
}
/**
* Resolves an account config by id, then merges it over channel-level defaults.
*/
function resolveMergedAccountConfig(params) {
	const accountConfig = params.normalizeAccountId ? resolveNormalizedAccountEntry(params.accounts, params.accountId, params.normalizeAccountId) : resolveAccountEntry(params.accounts, params.accountId);
	return mergeAccountConfig({
		channelConfig: params.channelConfig,
		accountConfig,
		omitKeys: params.omitKeys,
		nestedObjectKeys: params.nestedObjectKeys
	});
}
/**
* Builds a safe account snapshot for status/setup surfaces.
*/
function describeAccountSnapshot(params) {
	return {
		accountId: params.account.accountId ?? "default",
		name: normalizeOptionalString(params.account.name),
		enabled: params.account.enabled !== false,
		configured: params.configured,
		...params.extra
	};
}
/**
* Builds a webhook-mode account snapshot with the standard mode field.
*/
function describeWebhookAccountSnapshot(params) {
	return describeAccountSnapshot({
		account: params.account,
		configured: params.configured,
		extra: {
			mode: params.mode ?? "webhook",
			...params.extra
		}
	});
}
//#endregion
export { listCombinedAccountIds as a, resolveMergedAccountConfig as c, hasConfiguredAccountValue as i, describeAccountSnapshot as n, mergeAccountConfig as o, describeWebhookAccountSnapshot as r, resolveListedDefaultAccountId as s, createAccountListHelpers as t };
