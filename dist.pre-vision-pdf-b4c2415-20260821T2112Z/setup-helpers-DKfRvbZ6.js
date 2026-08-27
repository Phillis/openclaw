import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { t as resolveSingleAccountKeysToMove } from "./setup-promotion-helpers-B6epgpo7.js";
//#region src/channels/plugins/setup-helpers.ts
function getChannelSection(cfg, channelKey) {
	const section = cfg.channels?.[channelKey];
	return section && typeof section === "object" ? section : void 0;
}
function writeChannelSection(cfg, channelKey, section) {
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[channelKey]: section
		}
	};
}
function applyAccountNameToChannelSection(params) {
	const trimmed = params.name?.trim();
	if (!trimmed) return params.cfg;
	const accountId = normalizeAccountId(params.accountId);
	const base = getChannelSection(params.cfg, params.channelKey);
	const accounts = base?.accounts ?? {};
	if (!(params.alwaysUseAccounts || accountId !== "default" || Object.keys(accounts).length > 0)) return writeChannelSection(params.cfg, params.channelKey, {
		...base,
		name: trimmed
	});
	const baseWithoutName = accountId === "default" ? (({ name: _ignored, ...rest }) => rest)(base ?? {}) : base ?? {};
	return writeChannelSection(params.cfg, params.channelKey, {
		...baseWithoutName,
		accounts: {
			...accounts,
			[accountId]: {
				...accounts[accountId],
				name: trimmed
			}
		}
	});
}
/** Moves a root-level channel name into `accounts.default` before adding named accounts. */
function migrateBaseNameToDefaultAccount(params) {
	if (params.alwaysUseAccounts) return params.cfg;
	const base = getChannelSection(params.cfg, params.channelKey);
	const baseName = base?.name?.trim();
	if (!baseName) return params.cfg;
	const accounts = { ...base?.accounts };
	const defaultAccount = accounts["default"] ?? {};
	if (!defaultAccount.name) accounts[DEFAULT_ACCOUNT_ID] = {
		...defaultAccount,
		name: baseName
	};
	const { name: _ignored, ...rest } = base ?? {};
	return writeChannelSection(params.cfg, params.channelKey, {
		...rest,
		accounts
	});
}
/** Applies setup-time account naming and optional root-name migration in one step. */
function prepareScopedSetupConfig(params) {
	const namedConfig = applyAccountNameToChannelSection({
		cfg: params.cfg,
		channelKey: params.channelKey,
		accountId: params.accountId,
		name: params.name,
		alwaysUseAccounts: params.alwaysUseAccounts
	});
	if (!params.migrateBaseName || normalizeAccountId(params.accountId) === "default") return namedConfig;
	return migrateBaseNameToDefaultAccount({
		cfg: namedConfig,
		channelKey: params.channelKey,
		alwaysUseAccounts: params.alwaysUseAccounts
	});
}
/** Applies a setup patch using account-scoped config semantics. */
function applySetupAccountConfigPatch(params) {
	return patchScopedAccountConfig(params);
}
/** Creates a setup adapter that turns validated setup input into an account config patch. */
function createPatchedAccountSetupAdapter(params) {
	return {
		resolveAccountId: ({ accountId }) => normalizeAccountId(accountId),
		applyAccountName: ({ cfg, accountId, name }) => prepareScopedSetupConfig({
			cfg,
			channelKey: params.channelKey,
			accountId,
			name,
			alwaysUseAccounts: params.alwaysUseAccounts
		}),
		validateInput: params.validateInput,
		applyAccountConfig: ({ cfg, accountId, input }) => {
			const next = prepareScopedSetupConfig({
				cfg,
				channelKey: params.channelKey,
				accountId,
				name: input.name,
				alwaysUseAccounts: params.alwaysUseAccounts,
				migrateBaseName: !params.alwaysUseAccounts
			});
			const patch = params.buildPatch(input);
			return patchScopedAccountConfig({
				cfg: next,
				channelKey: params.channelKey,
				accountId,
				patch,
				accountPatch: patch,
				ensureChannelEnabled: params.ensureChannelEnabled ?? !params.alwaysUseAccounts,
				ensureAccountEnabled: params.ensureAccountEnabled ?? true,
				scopeDefaultToAccounts: params.alwaysUseAccounts
			});
		}
	};
}
function hasPresentSetupValue(value) {
	if (typeof value === "string") return value.trim().length > 0;
	return value !== void 0 && value !== null;
}
function createSetupInputPresenceValidator(params) {
	return (inputParams) => {
		if (params.defaultAccountOnlyEnvError && inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
		if (!inputParams.input.useEnv) {
			const inputRecord = inputParams.input;
			for (const requirement of params.whenNotUseEnv ?? []) {
				if (requirement.someOf.some((key) => hasPresentSetupValue(inputRecord[key]))) continue;
				return requirement.message;
			}
		}
		return params.validate?.(inputParams) ?? null;
	};
}
/** Creates a setup adapter that supports env-backed default account auth and patched credentials. */
function createEnvPatchedAccountSetupAdapter(params) {
	return createPatchedAccountSetupAdapter({
		channelKey: params.channelKey,
		alwaysUseAccounts: params.alwaysUseAccounts,
		ensureChannelEnabled: params.ensureChannelEnabled,
		ensureAccountEnabled: params.ensureAccountEnabled,
		validateInput: (inputParams) => {
			if (inputParams.input.useEnv && inputParams.accountId !== "default") return params.defaultAccountOnlyEnvError;
			if (!inputParams.input.useEnv && !params.hasCredentials(inputParams.input)) return params.missingCredentialError;
			return params.validateInput?.(inputParams) ?? null;
		},
		buildPatch: params.buildPatch
	});
}
/** Patches channel config at root for default accounts or under `accounts.<id>` for named accounts. */
function patchScopedAccountConfig(params) {
	const accountId = normalizeAccountId(params.accountId);
	const base = getChannelSection(params.cfg, params.channelKey);
	const ensureChannelEnabled = params.ensureChannelEnabled ?? true;
	const ensureAccountEnabled = params.ensureAccountEnabled ?? ensureChannelEnabled;
	const patch = params.patch;
	const accountPatch = params.accountPatch ?? patch;
	const clearFields = (record) => {
		if (!params.clearFields?.length) return record;
		const cleared = { ...record };
		for (const field of params.clearFields) delete cleared[field];
		return cleared;
	};
	if (accountId === "default" && !params.scopeDefaultToAccounts) return writeChannelSection(params.cfg, params.channelKey, {
		...clearFields(base ?? {}),
		...ensureChannelEnabled ? { enabled: true } : {},
		...patch
	});
	const accounts = base?.accounts ?? {};
	const existingAccount = clearFields(accounts[accountId] ?? {});
	return writeChannelSection(params.cfg, params.channelKey, {
		...base,
		...ensureChannelEnabled ? { enabled: true } : {},
		accounts: {
			...accounts,
			[accountId]: {
				...existingAccount,
				...ensureAccountEnabled ? { enabled: typeof existingAccount.enabled === "boolean" ? existingAccount.enabled : true } : {},
				...accountPatch
			}
		}
	});
}
function moveSingleAccountKeysIntoAccount(params) {
	const nextAccount = { ...params.baseAccount };
	const nextChannel = { ...params.channel };
	for (const key of params.keysToMove) {
		if (!(key in nextAccount)) {
			const value = params.channel[key];
			nextAccount[key] = value && typeof value === "object" ? structuredClone(value) : value;
		}
		delete nextChannel[key];
	}
	return writeChannelSection(params.cfg, params.channelKey, {
		...nextChannel,
		accounts: {
			...params.accounts,
			[params.targetAccountId]: nextAccount
		}
	});
}
function resolveExistingAccountKey(accounts, targetAccountId) {
	return Object.keys(accounts).find((key) => normalizeAccountId(key) === targetAccountId) ?? targetAccountId;
}
function resolveSingleAccountPromotionTarget(params) {
	const pluginTarget = params.setupSurface?.resolveSingleAccountPromotionTarget?.({ channel: params.channel });
	if (pluginTarget?.trim()) return normalizeAccountId(pluginTarget);
	const accounts = params.channel.accounts ?? {};
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId(params.channel.defaultAccount) : void 0;
	if (normalizedDefaultAccount) return Object.keys(accounts).find((accountId) => normalizeAccountId(accountId) === normalizedDefaultAccount) ?? "default";
	const namedAccounts = Object.keys(accounts).filter(Boolean);
	return namedAccounts.length === 1 ? namedAccounts[0] ?? "default" : DEFAULT_ACCOUNT_ID;
}
/**
* Promotes legacy single-account channel fields into the account map for multi-account setup.
*/
function moveSingleAccountChannelSectionToDefaultAccount(params) {
	const base = getChannelSection(params.cfg, params.channelKey);
	if (!base) return params.cfg;
	const accounts = base.accounts ?? {};
	const hasAccounts = Object.keys(accounts).length > 0;
	const keysToMove = resolveSingleAccountKeysToMove({
		channelKey: params.channelKey,
		channel: base,
		setupSurface: params.setupSurface,
		includeSetupKeys: true
	});
	if (hasAccounts && keysToMove.length === 0) return params.cfg;
	const resolvedTargetAccountKey = resolveExistingAccountKey(accounts, hasAccounts ? resolveSingleAccountPromotionTarget({
		channel: base,
		setupSurface: params.setupSurface
	}) : DEFAULT_ACCOUNT_ID);
	return moveSingleAccountKeysIntoAccount({
		cfg: params.cfg,
		channelKey: params.channelKey,
		channel: base,
		accounts,
		keysToMove,
		targetAccountId: resolvedTargetAccountKey,
		baseAccount: accounts[resolvedTargetAccountKey]
	});
}
//#endregion
export { createSetupInputPresenceValidator as a, patchScopedAccountConfig as c, createPatchedAccountSetupAdapter as i, prepareScopedSetupConfig as l, applySetupAccountConfigPatch as n, migrateBaseNameToDefaultAccount as o, createEnvPatchedAccountSetupAdapter as r, moveSingleAccountChannelSectionToDefaultAccount as s, applyAccountNameToChannelSection as t };
