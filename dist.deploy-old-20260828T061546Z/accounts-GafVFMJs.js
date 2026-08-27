import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { y as resolveSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BH0zJUew.js";
import { t as resolveAccountEntry } from "./account-lookup-CaTe6-6f.js";
import { t as createAccountListHelpers } from "./account-helpers-Cnv50TjD.js";
import "./string-coerce-runtime-C8jKEm3h.js";
import "./routing-DM8631ts.js";
import { n as tryReadSecretFileSync } from "./secret-file-Cbg2G7na.js";
import "./secret-file-runtime-D0-UDab9.js";
import "./secret-input-bJBlHnFk.js";
//#region extensions/zalo/src/token.ts
function readTokenFromFile(tokenFile, configPath) {
	const result = tryReadSecretFileSync(tokenFile, "Zalo token file", { rejectSymlink: true }, { configPath });
	return result.status === "available" ? {
		token: result.value,
		source: "configFile",
		status: "available"
	} : {
		token: "",
		source: "configFile",
		status: "configured_unavailable",
		credentialDiagnostics: [result.diagnostic]
	};
}
function resolveZaloToken(config, accountId, options) {
	const resolvedAccountId = normalizeAccountId(accountId ?? config?.defaultAccount);
	const isDefaultAccount = resolvedAccountId === DEFAULT_ACCOUNT_ID;
	const baseConfig = config;
	const accountConfig = resolveAccountEntry(baseConfig?.accounts, normalizeAccountId(resolvedAccountId));
	const accountHasBotToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "botToken"));
	if (accountConfig && accountHasBotToken) {
		const token = resolveSecretInputString({
			value: accountConfig.botToken,
			path: `channels.zalo.accounts.${resolvedAccountId}.botToken`,
			mode: options?.mode
		});
		if (token.status === "available") return {
			token: token.value,
			source: "config",
			status: "available"
		};
		if (token.status === "configured_unavailable") return {
			token: "",
			source: "config",
			status: "configured_unavailable"
		};
	}
	if (accountConfig?.tokenFile?.trim()) return readTokenFromFile(accountConfig.tokenFile, `channels.zalo.accounts.${resolvedAccountId}.tokenFile`);
	if (!accountHasBotToken) {
		const token = resolveSecretInputString({
			value: baseConfig?.botToken,
			path: "channels.zalo.botToken",
			mode: options?.mode
		});
		if (token.status === "available") return {
			token: token.value,
			source: "config",
			status: "available"
		};
		if (token.status === "configured_unavailable") return {
			token: "",
			source: "config",
			status: "configured_unavailable"
		};
		if (baseConfig?.tokenFile?.trim()) return readTokenFromFile(baseConfig.tokenFile, "channels.zalo.tokenFile");
	}
	if (isDefaultAccount) {
		const envToken = process.env.ZALO_BOT_TOKEN?.trim();
		if (envToken) return {
			token: envToken,
			source: "env",
			status: "available"
		};
	}
	return {
		token: "",
		source: "none",
		status: "missing"
	};
}
//#endregion
//#region extensions/zalo/src/accounts.ts
const { listAccountIds: listZaloAccountIds, resolveDefaultAccountId: resolveDefaultZaloAccountId, resolveAccountConfig: mergeZaloAccountConfig } = createAccountListHelpers("zalo", {
	omitKeys: ["defaultAccount"],
	implicitDefaultAccount: {
		channelKeys: ["botToken", "tokenFile"],
		envVars: ["ZALO_BOT_TOKEN"]
	}
});
function resolveZaloAccountWithMode(params) {
	const accountId = normalizeAccountId(params.accountId ?? (params.cfg.channels?.zalo)?.defaultAccount);
	const baseEnabled = (params.cfg.channels?.zalo)?.enabled !== false;
	const merged = mergeZaloAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const tokenResolution = resolveZaloToken(params.cfg.channels?.zalo, accountId, { mode: params.mode });
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		token: tokenResolution.token,
		tokenSource: tokenResolution.source,
		tokenStatus: tokenResolution.status,
		...tokenResolution.credentialDiagnostics ? { credentialDiagnostics: tokenResolution.credentialDiagnostics } : {},
		config: merged
	};
}
function resolveZaloAccount(params) {
	return resolveZaloAccountWithMode({
		...params,
		mode: "strict"
	});
}
function inspectZaloAccount(params) {
	return resolveZaloAccountWithMode({
		...params,
		mode: "inspect"
	});
}
//#endregion
export { resolveZaloToken as a, resolveZaloAccount as i, listZaloAccountIds as n, resolveDefaultZaloAccountId as r, inspectZaloAccount as t };
