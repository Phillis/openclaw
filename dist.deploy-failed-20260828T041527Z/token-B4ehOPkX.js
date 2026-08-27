import { m as normalizeResolvedSecretInputString, y as resolveSecretInputString } from "./types.secrets-Bre8L6Ts.js";
import { n as normalizeAccountId } from "./account-id-BH0zJUew.js";
import { S as selectApplicableRuntimeConfig, a as getRuntimeConfigSnapshot, c as getRuntimeConfigSourceSnapshot } from "./runtime-snapshot-Cv5MaU8U.js";
import { t as resolveAccountEntry } from "./account-lookup-CaTe6-6f.js";
import "./routing-DM8631ts.js";
import "./secret-input-bJBlHnFk.js";
import "./runtime-config-snapshot-FUsn-9bA.js";
//#region extensions/discord/src/runtime-config.ts
function selectDiscordRuntimeConfig(inputConfig) {
	return selectApplicableRuntimeConfig({
		inputConfig,
		runtimeConfig: getRuntimeConfigSnapshot(),
		runtimeSourceConfig: getRuntimeConfigSourceSnapshot()
	}) ?? inputConfig;
}
function withSourceActivities(runtimeAccount, sourceAccount) {
	const { activities: _runtimeActivities, ...runtimeRest } = runtimeAccount ?? {};
	return {
		...runtimeRest,
		...sourceAccount?.activities ? { activities: sourceAccount.activities } : {}
	};
}
/** Restores plugin-owned sensitive Activity config onto the resolved runtime shape. */
function selectDiscordActivitiesRuntimeConfig(inputConfig) {
	const runtimeConfig = selectDiscordRuntimeConfig(inputConfig);
	const sourceDiscord = getRuntimeConfigSourceSnapshot()?.channels?.discord;
	if (!sourceDiscord) return runtimeConfig;
	const runtimeDiscord = runtimeConfig.channels?.discord;
	const accountIds = /* @__PURE__ */ new Set([...Object.keys(runtimeDiscord?.accounts ?? {}), ...Object.keys(sourceDiscord.accounts ?? {})]);
	const accounts = Object.fromEntries([...accountIds].map((accountId) => [accountId, withSourceActivities(runtimeDiscord?.accounts?.[accountId], sourceDiscord.accounts?.[accountId])]));
	return {
		...runtimeConfig,
		channels: {
			...runtimeConfig.channels,
			discord: {
				...withSourceActivities(runtimeDiscord, sourceDiscord),
				...accountIds.size > 0 ? { accounts } : {}
			}
		}
	};
}
//#endregion
//#region extensions/discord/src/token.ts
function stripDiscordBotPrefix(token) {
	return token.replace(/^Bot\s+/i, "");
}
function normalizeDiscordToken(raw, path) {
	const trimmed = normalizeResolvedSecretInputString({
		value: raw,
		path
	});
	if (!trimmed) return;
	return stripDiscordBotPrefix(trimmed);
}
function resolveDiscordTokenValue(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: stripDiscordBotPrefix(resolved.value)
	};
	if (resolved.status === "configured_unavailable") return { status: "configured_unavailable" };
	return { status: "missing" };
}
function resolveDiscordToken(cfg, opts = {}) {
	const selectedCfg = selectDiscordRuntimeConfig(cfg);
	const accountId = normalizeAccountId(opts.accountId);
	const discordCfg = selectedCfg?.channels?.discord;
	const accountCfg = resolveAccountEntry(discordCfg?.accounts, accountId);
	const hasAccountToken = Boolean(accountCfg && Object.hasOwn(accountCfg, "token"));
	const accountToken = resolveDiscordTokenValue({
		cfg: selectedCfg,
		value: accountCfg?.token,
		path: `channels.discord.accounts.${accountId}.token`
	});
	if (accountToken.status === "available" && accountToken.value) return {
		token: accountToken.value,
		source: "config",
		tokenStatus: "available"
	};
	if (accountToken.status === "configured_unavailable") return {
		token: "",
		source: "config",
		tokenStatus: "configured_unavailable"
	};
	if (hasAccountToken) return {
		token: "",
		source: "none",
		tokenStatus: "missing"
	};
	const configToken = resolveDiscordTokenValue({
		cfg: selectedCfg,
		value: discordCfg?.token,
		path: "channels.discord.token"
	});
	if (configToken.status === "available" && configToken.value) return {
		token: configToken.value,
		source: "config",
		tokenStatus: "available"
	};
	if (configToken.status === "configured_unavailable") return {
		token: "",
		source: "config",
		tokenStatus: "configured_unavailable"
	};
	const envToken = accountId === "default" ? normalizeDiscordToken(opts.envToken ?? process.env.DISCORD_BOT_TOKEN, "DISCORD_BOT_TOKEN") : void 0;
	if (envToken) return {
		token: envToken,
		source: "env",
		tokenStatus: "available"
	};
	return {
		token: "",
		source: "none",
		tokenStatus: "missing"
	};
}
//#endregion
export { selectDiscordRuntimeConfig as i, resolveDiscordToken as n, selectDiscordActivitiesRuntimeConfig as r, normalizeDiscordToken as t };
