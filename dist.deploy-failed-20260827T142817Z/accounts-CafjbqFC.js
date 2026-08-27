import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { n as normalizeAccountId } from "./account-id-BRqK6RmF.js";
import { n as normalizeChannelDmPolicy } from "./dm-access-C_vMmAfR.js";
import { t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import { d as mapAllowFromEntries } from "./channel-config-helpers-C6dKYMZI.js";
import { t as createAccountListHelpers } from "./account-helpers-CEliAVvN.js";
import "./string-coerce-runtime-D9ocX9lc.js";
import { t as createAccountActionGate } from "./account-action-gate-C_U0Com2.js";
import "./routing-DG_rmd7A.js";
import { n as resolveDiscordToken, r as selectDiscordRuntimeConfig } from "./token-BCy0y3gW.js";
//#region extensions/discord/src/accounts.ts
const { listAccountIds, resolveDefaultAccountId, resolveAccountConfig: resolveMergedDiscordAccountConfig } = createAccountListHelpers("discord", {
	implicitDefaultAccount: {
		channelKeys: ["token"],
		envVars: ["DISCORD_BOT_TOKEN"]
	},
	nestedObjectKeys: [
		"activities",
		"agentComponents",
		"botLoopProtection"
	]
});
const listDiscordAccountIds = listAccountIds;
const resolveDefaultDiscordAccountId = resolveDefaultAccountId;
function resolveDiscordAccountConfig(cfg, accountId) {
	return resolveAccountEntry(cfg.channels?.discord?.accounts, accountId);
}
function mergeDiscordAccountConfig(cfg, accountId) {
	return resolveMergedDiscordAccountConfig(cfg, accountId);
}
function resolveDiscordAccountAllowFrom(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.discord;
	const allowFrom = accountConfig?.allowFrom ?? rootConfig?.allowFrom;
	return allowFrom ? mapAllowFromEntries(allowFrom) : void 0;
}
function resolveDiscordAccountDmPolicy(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	const accountConfig = resolveDiscordAccountConfig(params.cfg, accountId);
	const rootConfig = params.cfg.channels?.discord;
	return normalizeChannelDmPolicy(accountConfig?.dmPolicy ?? rootConfig?.dmPolicy ?? "pairing");
}
function createDiscordActionGate(params) {
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(params.cfg));
	return createAccountActionGate({
		baseActions: params.cfg.channels?.discord?.actions,
		accountActions: resolveDiscordAccountConfig(params.cfg, accountId)?.actions
	});
}
function resolveDiscordAccount(params) {
	const cfg = selectDiscordRuntimeConfig(params.cfg);
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultDiscordAccountId(cfg));
	const baseEnabled = cfg.channels?.discord?.enabled !== false;
	const merged = mergeDiscordAccountConfig(cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const tokenResolution = resolveDiscordToken(cfg, { accountId });
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: tokenResolution.token,
		tokenSource: tokenResolution.source,
		tokenStatus: tokenResolution.tokenStatus,
		config: merged
	};
}
function resolveDiscordMaxLinesPerMessage(params) {
	if (typeof params.discordConfig?.maxLinesPerMessage === "number") return params.discordConfig.maxLinesPerMessage;
	return resolveDiscordAccount({
		cfg: params.cfg,
		accountId: params.accountId
	}).config.maxLinesPerMessage;
}
function resolveDiscordAccountTokenOwner(params) {
	const token = params.token.trim();
	if (!token) return;
	let owner;
	const accountIds = listDiscordAccountIds(params.cfg);
	for (const [index, accountId] of accountIds.entries()) {
		const account = resolveDiscordAccount({
			cfg: params.cfg,
			accountId
		});
		const accountToken = account.token.trim();
		if (!account.enabled || accountToken !== token) continue;
		const priority = account.tokenSource === "config" ? 2 : account.tokenSource === "env" ? 1 : 0;
		if (!owner || priority > owner.priority) {
			owner = {
				accountId: account.accountId,
				priority,
				index
			};
			continue;
		}
		if (priority === owner.priority && index < owner.index) owner = {
			accountId: account.accountId,
			priority,
			index
		};
	}
	return owner?.accountId;
}
function resolveDiscordDuplicateTokenOwner(params) {
	const owner = resolveDiscordAccountTokenOwner({
		cfg: params.cfg,
		token: params.account.token
	});
	return owner && owner !== params.account.accountId ? owner : void 0;
}
function isDiscordAccountEnabledForRuntime(account, cfg) {
	return account.enabled && !resolveDiscordDuplicateTokenOwner({
		cfg,
		account
	});
}
function resolveDiscordAccountDisabledReason(account, cfg) {
	if (!account.enabled) return "disabled";
	const owner = resolveDiscordDuplicateTokenOwner({
		cfg,
		account
	});
	return owner ? `duplicate bot token; using account "${owner}"` : "disabled";
}
function listEnabledDiscordAccounts(cfg) {
	return listDiscordAccountIds(cfg).map((accountId) => resolveDiscordAccount({
		cfg,
		accountId
	})).filter((account) => isDiscordAccountEnabledForRuntime(account, cfg));
}
//#endregion
export { mergeDiscordAccountConfig as a, resolveDiscordAccountAllowFrom as c, resolveDiscordAccountDmPolicy as d, resolveDiscordMaxLinesPerMessage as f, listEnabledDiscordAccounts as i, resolveDiscordAccountConfig as l, isDiscordAccountEnabledForRuntime as n, resolveDefaultDiscordAccountId as o, listDiscordAccountIds as r, resolveDiscordAccount as s, createDiscordActionGate as t, resolveDiscordAccountDisabledReason as u };
