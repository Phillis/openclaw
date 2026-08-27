import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.js";
import { r as normalizeOptionalAccountId } from "./account-id-BRqK6RmF.js";
import { i as listChannelPlugins, t as getChannelPlugin } from "./registry-CWrpiLCs.js";
import "./plugins-2lW9dSyY.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-rAbqRXlG.js";
import "./message-channel-T4W5YOto.js";
import { t as resolveAccountEntry } from "./account-lookup-gtl3eJfy.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-DsNf7m1q.js";
import { t as isConfiguredChannel } from "./channel-selection-Deci6uHt.js";
import { i as resolveChannelDefaultAccountId } from "./helpers-C-WC19Mc.js";
import { i as resolveChannelAccountEnabled } from "./account-summary-Dbo8XU-g.js";
//#region src/infra/outbound/message-account-selection.ts
function resolveListedAccountId(params) {
	const listedAccountId = params.plugin.config.listAccountIds(params.cfg).find((candidate) => normalizeOptionalAccountId(candidate) === params.accountId);
	if (listedAccountId) return listedAccountId;
	const defaultAccountId = resolveChannelDefaultAccountId({
		plugin: params.plugin,
		cfg: params.cfg
	});
	return normalizeOptionalAccountId(defaultAccountId) === params.accountId ? defaultAccountId : void 0;
}
function isExplicitAccountDisabled(params) {
	const channelConfig = params.cfg.channels?.[params.channel];
	if (!channelConfig || typeof channelConfig !== "object" || Array.isArray(channelConfig)) return false;
	const channelRecord = channelConfig;
	if (channelRecord.enabled === false) return true;
	return resolveAccountEntry(channelRecord.accounts, params.listedAccountId)?.enabled === false;
}
/**
* Binds a caller-supplied message account to one listed channel account.
* Host-derived defaults and binding accounts bypass this helper by design.
*/
function validateExplicitMessageAccountSelection(params) {
	const rawAccountId = normalizeOptionalString(params.accountId);
	if (!rawAccountId) return;
	const accountId = normalizeOptionalAccountId(rawAccountId);
	if (!accountId) throw new Error(`Invalid account ID "${rawAccountId}".`);
	const channel = normalizeOptionalString(params.channel);
	if (!channel) return accountId;
	const plugin = params.plugin ?? resolveOutboundChannelPlugin({
		channel,
		cfg: params.cfg
	}) ?? getChannelPlugin(channel);
	if (!plugin) return accountId;
	const listedAccountId = resolveListedAccountId({
		plugin,
		cfg: params.cfg,
		accountId
	});
	if (!listedAccountId) throw new Error(`Unknown account "${rawAccountId}" for channel ${channel}.`);
	if (isExplicitAccountDisabled({
		cfg: params.cfg,
		channel: plugin.id,
		listedAccountId
	})) throw new Error(`Account "${listedAccountId}" for channel ${channel} is disabled.`);
	if (params.checkResolvedAccount !== false) {
		if (!resolveChannelAccountEnabled({
			plugin,
			account: plugin.config.resolveAccount(params.cfg, accountId),
			cfg: params.cfg
		})) throw new Error(`Account "${listedAccountId}" for channel ${channel} is disabled.`);
	}
	return accountId;
}
/** Selects configured, enabled, deliverable plugins without bootstrap or config mutation. */
function isPotentialConfiguredMessageChannel(params) {
	if (!isDeliverableMessageChannel(params.plugin.id)) return false;
	const channelConfig = params.cfg.channels?.[params.plugin.id];
	if (channelConfig && typeof channelConfig === "object" && !Array.isArray(channelConfig) && channelConfig.enabled === false) return false;
	if (isConfiguredChannel(params.cfg, params.plugin.id)) return true;
	try {
		return params.plugin.config.hasConfiguredState?.({
			cfg: params.cfg,
			env: process.env
		}) === true;
	} catch {
		return false;
	}
}
/**
* Plans an unscoped broadcast before SecretRefs are resolved. Rejected routes
* stay in candidateChannels for per-channel errors but cannot expose secrets.
* Host-derived binding/default accounts do not use this explicit-account plan.
*/
function resolveMessageBroadcastAccountPlan(params) {
	const accountId = validateExplicitMessageAccountSelection({
		cfg: params.cfg,
		accountId: params.accountId,
		checkResolvedAccount: false
	});
	if (!accountId) return;
	const candidatePlugins = listChannelPlugins().filter((plugin) => isPotentialConfiguredMessageChannel({
		cfg: params.cfg,
		plugin
	}));
	const secretChannels = candidatePlugins.flatMap((plugin) => {
		try {
			validateExplicitMessageAccountSelection({
				cfg: params.cfg,
				channel: plugin.id,
				accountId,
				plugin,
				checkResolvedAccount: false
			});
			const accountForEnablement = plugin.config.inspectAccount?.(params.cfg, accountId) ?? plugin.config.resolveAccount(params.cfg, accountId);
			if (accountForEnablement === void 0 || !resolveChannelAccountEnabled({
				plugin,
				account: accountForEnablement,
				cfg: params.cfg
			})) throw new Error(`Account "${accountId}" for channel ${plugin.id} is disabled.`);
			return [plugin.id];
		} catch {
			return [];
		}
	});
	return {
		accountId,
		candidateChannels: candidatePlugins.map((plugin) => plugin.id),
		secretChannels
	};
}
//#endregion
export { resolveMessageBroadcastAccountPlan as n, validateExplicitMessageAccountSelection as r, isPotentialConfiguredMessageChannel as t };
