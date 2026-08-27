import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { h as normalizeSecretInputString, l as hasConfiguredSecretInput } from "./types.secrets-BrIfhxSG.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import "./secret-input-Dv7SE4A5.js";
import { a as mergeDiscordAccountConfig, l as resolveDiscordAccountConfig, o as resolveDefaultDiscordAccountId } from "./accounts-CafjbqFC.js";
//#region extensions/discord/src/account-token-inspect.ts
function inspectDiscordConfiguredToken(value) {
	const normalized = normalizeSecretInputString(value);
	if (normalized) return {
		token: normalized.replace(/^Bot\s+/i, ""),
		tokenSource: "config",
		tokenStatus: "available"
	};
	if (hasConfiguredSecretInput(value)) return {
		token: "",
		tokenSource: "config",
		tokenStatus: "configured_unavailable"
	};
	return null;
}
function inspectDiscordAccountTokenState(params) {
	const accountToken = inspectDiscordConfiguredToken(params.accountToken);
	if (accountToken) return {
		...params.base,
		...accountToken,
		configured: true,
		config: params.config
	};
	if (params.hasAccountToken) return {
		...params.base,
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		config: params.config
	};
	const channelToken = inspectDiscordConfiguredToken(params.channelToken);
	if (channelToken) return {
		...params.base,
		...channelToken,
		configured: true,
		config: params.config
	};
	const fallback = params.resolveFallbackToken();
	if (fallback.token) return {
		...params.base,
		token: fallback.token,
		tokenSource: fallback.source,
		tokenStatus: "available",
		configured: true,
		config: params.config
	};
	return {
		...params.base,
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		config: params.config
	};
}
//#endregion
//#region extensions/discord/src/account-inspect.ts
function inspectDiscordAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const merged = mergeDiscordAccountConfig(params.cfg, accountId);
	const enabled = params.cfg.channels?.discord?.enabled !== false && merged.enabled !== false;
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const hasAccountToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "token"));
	return inspectDiscordAccountTokenState({
		base: {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name)
		},
		config: merged,
		accountToken: accountConfig?.token,
		hasAccountToken,
		channelToken: params.cfg.channels?.discord?.token,
		resolveFallbackToken: () => {
			const envToken = accountId === "default" ? normalizeSecretInputString(params.envToken ?? process.env.DISCORD_BOT_TOKEN) : void 0;
			return {
				token: envToken?.replace(/^Bot\s+/i, "") ?? "",
				source: envToken ? "env" : "none"
			};
		}
	});
}
//#endregion
export { inspectDiscordAccountTokenState as n, inspectDiscordAccount as t };
