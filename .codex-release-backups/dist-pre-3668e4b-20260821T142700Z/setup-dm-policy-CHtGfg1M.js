import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString } from "./types.secrets-BrIfhxSG.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
import { t as applyAccountNameToChannelSection } from "./setup-helpers-D-LqhtmB.js";
import { m as normalizeAllowFromEntries, t as addWildcardAllowFrom } from "./setup-wizard-helpers-Dm-d9du3.js";
import "./setup-BVnDItNa.js";
import { t as createChannelDmPolicy } from "./channel-dm-policy-BciMMWsn.js";
import { a as resolveMatrixAccountConfig } from "./account-config-BBbAX8mT.js";
import { r as resolveMatrixEnvAuthReadiness } from "./env-auth-B2ZAokPF.js";
import { r as resolveDefaultMatrixAccountId } from "./accounts-CfCyqoAF.js";
import { t as resolveMatrixConfigFieldPath } from "./config-paths-B0GLR7RK.js";
import { n as updateMatrixAccountConfig } from "./config-update-BswXiQYj.js";
import { t as isSupportedMatrixAvatarSource } from "./profile-3GM0cbXZ.js";
//#region extensions/matrix/src/setup-contract.ts
const matrixSingleAccountKeysToMove = [
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName",
	"avatarUrl",
	"initialSyncLimit",
	"encryption",
	"allowlistOnly",
	"dangerouslyAllowNameMatching",
	"allowBots",
	"streaming",
	"replyToMode",
	"threadReplies",
	"textChunkLimit",
	"responsePrefix",
	"ackReaction",
	"ackReactionScope",
	"reactionNotifications",
	"threadBindings",
	"startupVerification",
	"startupVerificationCooldownHours",
	"mediaMaxMb",
	"autoJoin",
	"autoJoinAllowlist",
	"dm",
	"groups",
	"rooms",
	"actions"
];
const matrixNamedAccountPromotionKeys = [
	"name",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceId",
	"deviceName",
	"avatarUrl",
	"initialSyncLimit",
	"encryption"
];
const singleAccountKeysToMove = [...matrixSingleAccountKeysToMove];
const namedAccountPromotionKeys = [...matrixNamedAccountPromotionKeys];
function resolveSingleAccountPromotionTarget(params) {
	const accounts = typeof params.channel.accounts === "object" && params.channel.accounts ? params.channel.accounts : {};
	const normalizedDefaultAccount = typeof params.channel.defaultAccount === "string" && params.channel.defaultAccount.trim() ? normalizeAccountId(params.channel.defaultAccount) : void 0;
	const matchedAccountId = normalizedDefaultAccount ? Object.entries(accounts).find(([accountId, value]) => accountId && value && typeof value === "object" && normalizeAccountId(accountId) === normalizedDefaultAccount)?.[0] : void 0;
	if (matchedAccountId) return matchedAccountId;
	if (normalizedDefaultAccount) return DEFAULT_ACCOUNT_ID;
	const namedAccounts = Object.entries(accounts).filter(([accountId, value]) => accountId && typeof value === "object" && value);
	if (namedAccounts.length === 1) {
		const onlyAccount = namedAccounts[0];
		if (onlyAccount) return onlyAccount[0];
	}
	if (namedAccounts.length > 1 && accounts["default"] && typeof accounts["default"] === "object") return DEFAULT_ACCOUNT_ID;
	return DEFAULT_ACCOUNT_ID;
}
//#endregion
//#region extensions/matrix/src/setup-config.ts
const channel = "matrix";
const COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE = /* @__PURE__ */ new Set([
	"name",
	"enabled",
	"httpPort",
	"webhookPath",
	"webhookUrl",
	"webhookSecret",
	"service",
	"region",
	"homeserver",
	"userId",
	"accessToken",
	"password",
	"deviceName",
	"url",
	"code",
	"dmPolicy",
	"allowFrom",
	"groupPolicy",
	"groupAllowFrom",
	"defaultTo"
]);
const MATRIX_SINGLE_ACCOUNT_KEYS_TO_MOVE = new Set(matrixSingleAccountKeysToMove);
const MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS = new Set(matrixNamedAccountPromotionKeys);
function cloneIfObject(value) {
	if (value && typeof value === "object") return structuredClone(value);
	return value;
}
function resolveSetupAvatarUrl(input) {
	const avatarUrl = input.avatarUrl;
	if (typeof avatarUrl !== "string") return;
	return avatarUrl.trim() || void 0;
}
function resolveExistingMatrixAccountKey(accounts, targetAccountId) {
	const normalizedTargetAccountId = normalizeAccountId(targetAccountId);
	return Object.keys(accounts).find((accountId) => normalizeAccountId(accountId) === normalizedTargetAccountId) ?? targetAccountId;
}
function moveSingleMatrixAccountConfigToNamedAccount(cfg) {
	const baseConfig = cfg.channels?.[channel];
	const base = typeof baseConfig === "object" && baseConfig ? baseConfig : void 0;
	if (!base) return cfg;
	const accounts = typeof base.accounts === "object" && base.accounts ? base.accounts : {};
	const hasNamedAccounts = Object.keys(accounts).some(Boolean);
	const keysToMove = Object.entries(base).filter(([key, value]) => {
		if (key === "accounts" || key === "enabled" || value === void 0) return false;
		if (!COMMON_SINGLE_ACCOUNT_KEYS_TO_MOVE.has(key) && !MATRIX_SINGLE_ACCOUNT_KEYS_TO_MOVE.has(key)) return false;
		if (hasNamedAccounts && !MATRIX_NAMED_ACCOUNT_PROMOTION_KEYS.has(key)) return false;
		return true;
	}).map(([key]) => key);
	if (keysToMove.length === 0) return cfg;
	const resolvedTargetAccountId = resolveExistingMatrixAccountKey(accounts, resolveSingleAccountPromotionTarget({ channel: base }));
	const nextAccount = { ...accounts[resolvedTargetAccountId] };
	for (const key of keysToMove) nextAccount[key] = cloneIfObject(base[key]);
	const nextChannel = { ...base };
	for (const key of keysToMove) delete nextChannel[key];
	return {
		...cfg,
		channels: {
			...cfg.channels,
			[channel]: {
				...nextChannel,
				accounts: {
					...accounts,
					[resolvedTargetAccountId]: nextAccount
				}
			}
		}
	};
}
function validateMatrixSetupInput(params) {
	const input = params.input;
	const avatarUrl = resolveSetupAvatarUrl(input);
	if (avatarUrl && !isSupportedMatrixAvatarSource(avatarUrl)) return "Matrix avatar URL must be an mxc:// URI or an http(s) URL.";
	if (input.useEnv) {
		const envReadiness = resolveMatrixEnvAuthReadiness(params.accountId, process.env);
		return envReadiness.ready ? null : envReadiness.missingMessage;
	}
	if (!input.homeserver?.trim()) return "Matrix requires --homeserver";
	const accessToken = input.accessToken?.trim();
	const password = normalizeSecretInputString(input.password);
	const userId = input.userId?.trim();
	if (!accessToken && !password) return "Matrix requires --access-token or --password";
	if (!accessToken) {
		if (!userId) return "Matrix requires --user-id when using --password";
		if (!password) return "Matrix requires --password when using --user-id";
	}
	return null;
}
function applyMatrixSetupAccountConfig(params) {
	const input = params.input;
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const next = applyAccountNameToChannelSection({
		cfg: normalizedAccountId !== "default" ? moveSingleMatrixAccountConfigToNamedAccount(params.cfg) : params.cfg,
		channelKey: channel,
		accountId: normalizedAccountId,
		name: input.name
	});
	const avatarUrl = resolveSetupAvatarUrl(input);
	if (input.useEnv) return updateMatrixAccountConfig(next, normalizedAccountId, {
		enabled: true,
		homeserver: null,
		allowPrivateNetwork: null,
		proxy: null,
		userId: null,
		accessToken: null,
		password: null,
		deviceId: null,
		deviceName: null,
		avatarUrl
	});
	const accessToken = input.accessToken?.trim();
	const password = normalizeSecretInputString(input.password);
	const userId = input.userId?.trim();
	return updateMatrixAccountConfig(next, normalizedAccountId, {
		enabled: true,
		homeserver: input.homeserver?.trim(),
		allowPrivateNetwork: typeof input.dangerouslyAllowPrivateNetwork === "boolean" ? input.dangerouslyAllowPrivateNetwork : typeof input.allowPrivateNetwork === "boolean" ? input.allowPrivateNetwork : void 0,
		proxy: normalizeOptionalString(input.proxy),
		userId: password && !userId ? null : userId,
		accessToken: accessToken || (password ? null : void 0),
		password: password || (accessToken ? null : void 0),
		deviceName: input.deviceName?.trim(),
		avatarUrl,
		initialSyncLimit: input.initialSyncLimit
	});
}
//#endregion
//#region extensions/matrix/src/setup-dm-policy.ts
function resolveMatrixSetupDmAllowFrom(policy, allowFrom) {
	if (policy === "open") return addWildcardAllowFrom(allowFrom);
	return normalizeAllowFromEntries(allowFrom ?? []).filter((entry) => entry !== "*");
}
function createMatrixSetupDmPolicy(promptAllowFrom) {
	return createChannelDmPolicy({
		label: "Matrix",
		channel: "matrix",
		policyPath: "dm.policy",
		allowFromPath: "dm.allowFrom",
		resolveAccount: (cfg, accountId) => {
			const resolvedCfg = cfg;
			const resolvedAccountId = normalizeAccountId(accountId?.trim() || resolveDefaultMatrixAccountId(resolvedCfg) || "default");
			const config = resolveMatrixAccountConfig({
				cfg: resolvedCfg,
				accountId: resolvedAccountId
			});
			return {
				accountId: resolvedAccountId,
				config: {
					dmPolicy: config.dm?.policy,
					allowFrom: config.dm?.allowFrom,
					dm: config.dm
				}
			};
		},
		resolveConfigKeys: ({ cfg, account }) => ({
			policyKey: resolveMatrixConfigFieldPath(cfg, account.accountId, "dm.policy"),
			allowFromKey: resolveMatrixConfigFieldPath(cfg, account.accountId, "dm.allowFrom")
		}),
		resolveAllowFrom: ({ policy, account }) => resolveMatrixSetupDmAllowFrom(policy, account.config.allowFrom),
		buildPatch: ({ account, policy, allowFrom }) => ({ dm: {
			...account.config.dm,
			policy,
			allowFrom
		} }),
		applyPatch: ({ cfg, account, patch }) => updateMatrixAccountConfig(cfg, account.accountId, patch),
		promptAllowFrom
	});
}
//#endregion
export { namedAccountPromotionKeys as a, validateMatrixSetupInput as i, applyMatrixSetupAccountConfig as n, resolveSingleAccountPromotionTarget as o, moveSingleMatrixAccountConfigToNamedAccount as r, singleAccountKeysToMove as s, createMatrixSetupDmPolicy as t };
