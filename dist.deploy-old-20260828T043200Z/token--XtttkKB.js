import { h as normalizeSecretInputString, y as resolveSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { u as resolveDefaultSecretProviderAlias } from "./ref-contract-BHWY70rN.js";
import { n as resolveNormalizedAccountEntry } from "./account-lookup-CaTe6-6f.js";
import "./secret-provider-alias-Bo64Fq7x.js";
import "./account-core-D-Gu5DXB.js";
import "./routing-DM8631ts.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cbg2G7na.js";
import "./secret-file-runtime-D0-UDab9.js";
import "./secret-input-bJBlHnFk.js";
import { n as resolveDefaultTelegramAccountId } from "./account-selection-BxPKRWB5.js";
//#region extensions/telegram/src/token.ts
function resolveEnvSecretRefValue(params) {
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (providerConfig) {
		if (providerConfig.source !== "env") throw new Error(`Secret provider "${params.provider}" has source "${providerConfig.source}" but ref requests "env".`);
		if (providerConfig.allowlist && !providerConfig.allowlist.includes(params.id)) throw new Error(`Environment variable "${params.id}" is not allowlisted in secrets.providers.${params.provider}.allowlist.`);
	} else if (params.provider !== resolveDefaultSecretProviderAlias({ secrets: params.cfg?.secrets }, "env")) throw new Error(`Secret provider "${params.provider}" is not configured (ref: env:${params.provider}:${params.id}).`);
	return normalizeSecretInputString((params.env ?? process.env)[params.id]);
}
function resolveRuntimeTokenValue(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: resolved.value
	};
	if (resolved.status === "missing") return { status: "missing" };
	if (resolved.ref.source === "env") {
		const envValue = resolveEnvSecretRefValue({
			cfg: params.cfg,
			provider: resolved.ref.provider,
			id: resolved.ref.id
		});
		if (envValue) return {
			status: "available",
			value: envValue
		};
		return { status: "configured_unavailable" };
	}
	resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg?.secrets?.defaults,
		mode: "strict"
	});
	return { status: "configured_unavailable" };
}
function resolveTelegramToken(cfg, opts = {}) {
	const accountId = normalizeOptionalAccountId(opts.accountId) ?? (cfg ? resolveDefaultTelegramAccountId(cfg) : "default");
	const telegramCfg = cfg?.channels?.telegram;
	const resolveAccountCfg = (id) => {
		const accounts = telegramCfg?.accounts;
		return Array.isArray(accounts) ? void 0 : resolveNormalizedAccountEntry(accounts, id, normalizeAccountId);
	};
	const accountCfg = resolveAccountCfg(accountId !== "default" ? accountId : DEFAULT_ACCOUNT_ID);
	if (accountId !== "default" && !accountCfg) {
		const accounts = telegramCfg?.accounts;
		if (Boolean(accounts) && typeof accounts === "object" && !Array.isArray(accounts) && Object.keys(accounts).length > 0) {
			opts.logMissingFile?.(`channels.telegram.accounts: unknown accountId "${accountId}" — not found in config, refusing channel-level fallback`);
			return {
				token: "",
				source: "none"
			};
		}
	}
	const accountTokenFile = accountCfg?.tokenFile?.trim();
	if (accountTokenFile) {
		const result = tryReadSecretFileSync(accountTokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath: `channels.telegram.accounts.${accountId}.tokenFile` });
		if (result.status === "available") return {
			token: result.value,
			source: "tokenFile"
		};
		opts.logMissingFile?.(`channels.telegram.accounts.${accountId}.tokenFile is configured but unavailable`);
		return {
			token: "",
			source: "tokenFile",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const accountToken = resolveRuntimeTokenValue({
		cfg,
		value: accountCfg?.botToken,
		path: `channels.telegram.accounts.${accountId}.botToken`
	});
	if (accountToken.status === "available") return {
		token: accountToken.value,
		source: "config"
	};
	if (accountToken.status === "configured_unavailable") return {
		token: "",
		source: "none"
	};
	const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
	const tokenFile = telegramCfg?.tokenFile?.trim();
	if (tokenFile) {
		const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath: "channels.telegram.tokenFile" });
		if (result.status === "available") return {
			token: result.value,
			source: "tokenFile"
		};
		opts.logMissingFile?.("channels.telegram.tokenFile is configured but unavailable");
		return {
			token: "",
			source: "tokenFile",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const configToken = resolveRuntimeTokenValue({
		cfg,
		value: telegramCfg?.botToken,
		path: "channels.telegram.botToken"
	});
	if (configToken.status === "available") return {
		token: configToken.value,
		source: "config"
	};
	if (configToken.status === "configured_unavailable") return {
		token: "",
		source: "none"
	};
	const envToken = allowEnv ? (opts.envToken ?? process.env.TELEGRAM_BOT_TOKEN)?.trim() : "";
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	return {
		token: "",
		source: "none"
	};
}
//#endregion
export { resolveTelegramToken as t };
