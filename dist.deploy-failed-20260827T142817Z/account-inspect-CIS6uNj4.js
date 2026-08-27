import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput, s as coerceSecretRef } from "./types.secrets-BrIfhxSG.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BDz7f4XS.js";
import "./secret-provider-alias-Ccb6IWZM.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as resolveAccountWithDefaultFallback } from "./account-core-EOI6wkSo.js";
import "./routing-DG_rmd7A.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cz1V4EjA.js";
import "./secret-file-runtime-DD5yEM8Q.js";
import "./secret-input-Dv7SE4A5.js";
import { n as resolveTelegramAccountConfig, t as mergeTelegramAccountConfig } from "./account-config-wdGYzZF3.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-BhIUBDEJ.js";
//#region extensions/telegram/src/account-inspect.ts
function inspectTokenFile(pathValue, configPath) {
	const tokenFile = normalizeOptionalString(pathValue) ?? "";
	if (!tokenFile) return null;
	const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath });
	if (result.status === "configured_unavailable") return {
		token: "",
		tokenSource: "tokenFile",
		tokenStatus: "configured_unavailable",
		credentialDiagnostics: [result.diagnostic]
	};
	return {
		token: result.status === "available" ? result.value : "",
		tokenSource: "tokenFile",
		tokenStatus: result.status === "available" ? "available" : "configured_unavailable"
	};
}
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg.secrets?.providers?.[params.provider];
	if (!providerConfig) return params.provider === resolveDefaultSecretProviderAlias(params.cfg, "env");
	if (providerConfig.source !== "env") return false;
	const allowlist = providerConfig.allowlist;
	return !allowlist || allowlist.includes(params.id);
}
function inspectTokenValue(params) {
	const ref = coerceSecretRef(params.value, params.cfg.secrets?.defaults);
	if (ref?.source === "env") {
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: ref.provider,
			id: ref.id
		})) return {
			token: "",
			tokenSource: "env",
			tokenStatus: "configured_unavailable"
		};
		const envValue = normalizeOptionalString(process.env[ref.id]);
		if (envValue) return {
			token: envValue,
			tokenSource: "env",
			tokenStatus: "available"
		};
		return {
			token: "",
			tokenSource: "env",
			tokenStatus: "configured_unavailable"
		};
	}
	const token = normalizeSecretInputString(params.value);
	if (token) return {
		token,
		tokenSource: "config",
		tokenStatus: "available"
	};
	if (hasConfiguredSecretInput(params.value, params.cfg.secrets?.defaults)) return {
		token: "",
		tokenSource: "config",
		tokenStatus: "configured_unavailable"
	};
	return null;
}
function hasConfiguredTelegramAccounts(cfg) {
	const accounts = cfg.channels?.telegram?.accounts;
	return Boolean(accounts) && typeof accounts === "object" && !Array.isArray(accounts) && Object.keys(accounts).length > 0;
}
function inspectTelegramAccountPrimary(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = mergeTelegramAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.telegram?.enabled !== false && merged.enabled !== false;
	const accountConfig = resolveTelegramAccountConfig(params.cfg, accountId);
	const allowChannelCredentialFallback = accountId === "default" || Boolean(accountConfig) || !hasConfiguredTelegramAccounts(params.cfg);
	const accountTokenFile = inspectTokenFile(accountConfig?.tokenFile, `channels.telegram.accounts.${accountId}.tokenFile`);
	if (accountTokenFile) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: accountTokenFile.token,
		tokenSource: accountTokenFile.tokenSource,
		tokenStatus: accountTokenFile.tokenStatus,
		...accountTokenFile.credentialDiagnostics ? { credentialDiagnostics: accountTokenFile.credentialDiagnostics } : {},
		configured: accountTokenFile.tokenStatus !== "missing",
		config: merged
	};
	const accountToken = inspectTokenValue({
		cfg: params.cfg,
		value: accountConfig?.botToken
	});
	if (accountToken) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: accountToken.token,
		tokenSource: accountToken.tokenSource,
		tokenStatus: accountToken.tokenStatus,
		configured: accountToken.tokenStatus !== "missing",
		config: merged
	};
	if (allowChannelCredentialFallback) {
		const channelTokenFile = inspectTokenFile(params.cfg.channels?.telegram?.tokenFile, "channels.telegram.tokenFile");
		if (channelTokenFile) return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: channelTokenFile.token,
			tokenSource: channelTokenFile.tokenSource,
			tokenStatus: channelTokenFile.tokenStatus,
			...channelTokenFile.credentialDiagnostics ? { credentialDiagnostics: channelTokenFile.credentialDiagnostics } : {},
			configured: channelTokenFile.tokenStatus !== "missing",
			config: merged
		};
		const channelToken = inspectTokenValue({
			cfg: params.cfg,
			value: params.cfg.channels?.telegram?.botToken
		});
		if (channelToken) return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: channelToken.token,
			tokenSource: channelToken.tokenSource,
			tokenStatus: channelToken.tokenStatus,
			configured: channelToken.tokenStatus !== "missing",
			config: merged
		};
	}
	const envToken = accountId === "default" ? normalizeOptionalString(params.envToken) ?? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN) ?? "" : "";
	if (envToken) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: envToken,
		tokenSource: "env",
		tokenStatus: "available",
		configured: true,
		config: merged
	};
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		config: merged
	};
}
function inspectTelegramAccount(params) {
	return resolveAccountWithDefaultFallback({
		accountId: params.accountId ?? resolveDefaultTelegramAccountId(params.cfg),
		normalizeAccountId,
		resolvePrimary: (accountId) => inspectTelegramAccountPrimary({
			cfg: params.cfg,
			accountId,
			envToken: params.envToken
		}),
		hasCredential: (account) => account.tokenSource !== "none",
		resolveDefaultAccountId: () => resolveDefaultTelegramAccountId(params.cfg)
	});
}
//#endregion
export { inspectTelegramAccount as t };
