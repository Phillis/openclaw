import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import "./provider-auth-DKsH0m9K.js";
import { i as hasConfiguredAccountValue, t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./account-resolution-Cb-rHsSW.js";
//#region extensions/feishu/src/accounts.ts
const { listAccountIds: listFeishuAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedFeishuAccountConfig } = createAccountListHelpers("feishu", {
	allowUnlistedDefaultAccount: true,
	omitKeys: ["defaultAccount"],
	nestedObjectKeys: ["tools"],
	hasImplicitDefaultAccount: (cfg) => {
		const feishu = cfg.channels?.feishu;
		return hasConfiguredAccountValue(feishu?.appId) && hasConfiguredAccountValue(feishu?.appSecret);
	}
});
function formatSecretRefLabel(ref) {
	return `${ref.source}:${ref.provider}:${ref.id}`;
}
var FeishuSecretRefUnavailableError = class extends Error {
	constructor(path, ref) {
		super(`${path}: unresolved SecretRef "${formatSecretRefLabel(ref)}". Resolve this command against an active gateway runtime snapshot before reading it.`);
		this.name = "FeishuSecretRefUnavailableError";
		this.path = path;
	}
};
function resolveFeishuSecretLike(params) {
	const asString = normalizeOptionalString(params.value);
	if (asString) return asString;
	const ref = coerceSecretRef(params.value);
	if (!ref) return;
	if (params.mode === "inspect") {
		if (params.allowEnvSecretRefRead && ref.source === "env") {
			const envValue = normalizeOptionalString(process.env[ref.id]);
			if (envValue) return envValue;
		}
		return;
	}
	throw new FeishuSecretRefUnavailableError(params.path, ref);
}
function resolveFeishuBaseCredentials(cfg, mode) {
	const appId = resolveFeishuSecretLike({
		value: cfg?.appId,
		path: "channels.feishu.appId",
		mode,
		allowEnvSecretRefRead: true
	});
	const appSecret = resolveFeishuSecretLike({
		value: cfg?.appSecret,
		path: "channels.feishu.appSecret",
		mode,
		allowEnvSecretRefRead: true
	});
	if (!appId || !appSecret) return null;
	return {
		appId,
		appSecret,
		domain: cfg?.domain ?? "feishu"
	};
}
function resolveFeishuEventSecrets(cfg, mode) {
	return {
		encryptKey: (cfg?.connectionMode ?? "websocket") === "webhook" ? resolveFeishuSecretLike({
			value: cfg?.encryptKey,
			path: "channels.feishu.encryptKey",
			mode,
			allowEnvSecretRefRead: true
		}) : normalizeOptionalString(cfg?.encryptKey),
		verificationToken: resolveFeishuSecretLike({
			value: cfg?.verificationToken,
			path: "channels.feishu.verificationToken",
			mode,
			allowEnvSecretRefRead: true
		})
	};
}
/**
* Resolve the default account selection and its source.
*/
function resolveDefaultFeishuAccountSelection(cfg) {
	const preferred = normalizeOptionalAccountId((cfg.channels?.feishu)?.defaultAccount);
	if (preferred) return {
		accountId: preferred,
		source: "explicit-default"
	};
	const ids = listFeishuAccountIds(cfg);
	if (ids.includes("default")) return {
		accountId: DEFAULT_ACCOUNT_ID,
		source: "mapped-default"
	};
	return {
		accountId: ids[0] ?? "default",
		source: "fallback"
	};
}
/**
* Resolve the default account ID.
*/
function resolveDefaultFeishuAccountId(cfg) {
	return resolveDefaultAccountId(cfg);
}
/**
* Merge top-level config with account-specific config.
* Account-specific fields override top-level fields.
*/
function mergeFeishuAccountConfig(cfg, accountId) {
	const feishuCfg = cfg.channels?.feishu;
	const merged = resolveMergedFeishuAccountConfig(cfg, accountId);
	const topTools = feishuCfg?.tools;
	if (merged.tools === void 0 && topTools !== void 0) return {
		...merged,
		tools: topTools
	};
	if (topTools?.bitable === false) return {
		...merged,
		tools: {
			...merged.tools,
			bitable: false
		}
	};
	return merged;
}
function resolveFeishuCredentials(cfg, options) {
	const mode = options?.mode ?? (options?.allowUnresolvedSecretRef ? "inspect" : "strict");
	const base = resolveFeishuBaseCredentials(cfg, mode);
	if (!base) return null;
	const eventSecrets = resolveFeishuEventSecrets(cfg, mode);
	return {
		...base,
		...eventSecrets
	};
}
function inspectFeishuCredentials(cfg) {
	return resolveFeishuCredentials(cfg, { mode: "inspect" });
}
function buildResolvedFeishuAccount(params) {
	const hasExplicitAccountId = typeof params.accountId === "string" && params.accountId.trim() !== "";
	const defaultSelection = hasExplicitAccountId ? null : resolveDefaultFeishuAccountSelection(params.cfg);
	const accountId = hasExplicitAccountId ? normalizeAccountId(params.accountId) : defaultSelection?.accountId ?? "default";
	const selectionSource = hasExplicitAccountId ? "explicit" : defaultSelection?.source ?? "fallback";
	const baseEnabled = (params.cfg.channels?.feishu)?.enabled !== false;
	const merged = mergeFeishuAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const baseCreds = resolveFeishuBaseCredentials(merged, params.baseMode);
	const eventSecrets = resolveFeishuEventSecrets(merged, params.eventSecretMode);
	const accountName = merged.name;
	return {
		accountId,
		selectionSource,
		enabled,
		configured: Boolean(baseCreds),
		name: typeof accountName === "string" ? accountName.trim() || void 0 : void 0,
		appId: baseCreds?.appId,
		appSecret: baseCreds?.appSecret,
		encryptKey: eventSecrets.encryptKey,
		verificationToken: eventSecrets.verificationToken,
		domain: baseCreds?.domain ?? "feishu",
		config: merged
	};
}
/**
* Resolve a read-only Feishu account snapshot for CLI/config surfaces.
* Unresolved SecretRefs are treated as unavailable instead of throwing.
*/
function resolveFeishuAccount(params) {
	return buildResolvedFeishuAccount({
		...params,
		baseMode: "inspect",
		eventSecretMode: "inspect"
	});
}
/**
* Resolve a runtime Feishu account.
* Required app credentials stay strict; event-only secrets can be required by callers.
*/
function resolveFeishuRuntimeAccount(params, options) {
	return buildResolvedFeishuAccount({
		...params,
		baseMode: "strict",
		eventSecretMode: options?.requireEventSecrets ? "strict" : "inspect"
	});
}
/**
* List all enabled and configured accounts.
*/
function listEnabledFeishuAccounts(cfg) {
	return listFeishuAccountIds(cfg).map((accountId) => resolveFeishuAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled && account.configured);
}
//#endregion
export { resolveDefaultFeishuAccountId as a, resolveFeishuCredentials as c, listFeishuAccountIds as i, resolveFeishuRuntimeAccount as l, inspectFeishuCredentials as n, resolveDefaultFeishuAccountSelection as o, listEnabledFeishuAccounts as r, resolveFeishuAccount as s, FeishuSecretRefUnavailableError as t };
