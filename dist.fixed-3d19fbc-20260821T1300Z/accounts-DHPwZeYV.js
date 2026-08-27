import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-BRqK6RmF.js";
import { y as resolveSecretInputString } from "./types.secrets-BrIfhxSG.js";
import { t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import { t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./routing-CERGQFBr.js";
import { n as tryReadSecretFileSync } from "./secret-file--SF4Rv39.js";
import "./secret-input-CkeFVjF0.js";
import "./core-CfdI1fMy.js";
//#region extensions/zalo/src/token.ts
function readTokenFromFile(tokenFile) {
	return tryReadSecretFileSync(tokenFile, "Zalo token file", { rejectSymlink: true }) ?? "";
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
		const fileToken = readTokenFromFile(accountConfig.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile",
			status: "available"
		};
	}
	if (!accountHasBotToken) {
		const fileToken = readTokenFromFile(accountConfig?.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile",
			status: "available"
		};
	}
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
		const fileToken = readTokenFromFile(baseConfig?.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile",
			status: "available"
		};
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
