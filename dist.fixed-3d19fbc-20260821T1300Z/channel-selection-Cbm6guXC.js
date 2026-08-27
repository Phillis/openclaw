import "./src-BkwWvwB2.js";
import { t as expectDefined } from "./expect-CyE8FADM.js";
import { r as formatErrorMessage } from "./errors-CqPTYU6G.js";
import { r as defaultRuntime } from "./runtime-DtFIMC-W.js";
import { t as createDedupeCache } from "./dedupe-C5V_sRWr.js";
import { n as normalizeMessageChannel } from "./message-channel-core-3kHPdlzP.js";
import { i as listChannelPlugins } from "./registry-BQt6AaEH.js";
import "./plugins-BItc4cFS.js";
import { t as isDeliverableMessageChannel } from "./message-channel-normalize-BhvdDSLi.js";
import "./message-channel-C3nRvjrX.js";
import { r as resolveOutboundChannelPlugin, t as normalizeDeliverableOutboundChannel } from "./channel-resolution-BR7Yi_qg.js";
import { n as resolveMissingOfficialExternalChannelPluginRepairHints, t as resolveMissingOfficialExternalChannelPluginRepairHint } from "./official-external-plugin-repair-hints-OjzK9GPy.js";
import { t as isAccountEnabled } from "./account-enabled-ClTLgAXM.js";
//#region src/infra/outbound/channel-selection.ts
function resolveAvailableKnownChannel(params) {
	const normalized = normalizeDeliverableOutboundChannel(params.value);
	if (!normalized) return;
	const plugin = resolveOutboundChannelPlugin({
		channel: normalized,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	return plugin ? {
		channel: normalized,
		plugin
	} : void 0;
}
/** Checks whether a channel has a non-disabled config entry. */
function isConfiguredChannel(cfg, channelId) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return false;
	const entry = channels[channelId];
	if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
	return entry.enabled !== false;
}
function listConfiguredOfficialExternalRepairHints(cfg) {
	const channels = cfg.channels;
	if (!channels || typeof channels !== "object" || Array.isArray(channels)) return [];
	return resolveMissingOfficialExternalChannelPluginRepairHints({
		config: cfg,
		channelIds: Object.keys(channels).filter((channelId) => isConfiguredChannel(cfg, channelId))
	});
}
function formatMissingOfficialExternalChannelsMessage(hints) {
	if (hints.length === 1) {
		const hint = hints[0];
		if (!hint) return "";
		return `Configured official external channel ${hint.label} is missing its plugin. ${hint.repairHint}`;
	}
	return `Configured official external channels ${hints.map((hint) => hint.label).join(", ")} are missing their plugins. Run: openclaw doctor --fix, or install individually: ${hints.map((hint) => hint.installCommand).join("; ")}.`;
}
function formatNoConfiguredChannelsMessage() {
	return [
		"Channel is required (no configured channels detected).",
		"Run openclaw channels add to configure one, or pass --channel <channel> after enabling a channel.",
		"Use openclaw channels list --all to see available channel ids."
	].join(" ");
}
function formatMultipleConfiguredChannelsMessage(configured) {
	return [`Channel is required when multiple channels are configured: ${configured.join(", ")}.`, "Pass --channel <channel> to choose one."].join(" ");
}
const loggedChannelSelectionErrors = createDedupeCache({
	ttlMs: 0,
	maxSize: 1024
});
function logChannelSelectionError(params) {
	const message = formatErrorMessage(params.error);
	const key = `${params.pluginId}:${params.accountId}:${params.operation}:${message}`;
	if (loggedChannelSelectionErrors.check(key)) return;
	defaultRuntime.error?.(`[channel-selection] ${params.pluginId}(${params.accountId}) ${params.operation} failed: ${message}`);
}
async function isPluginConfigured(plugin, cfg) {
	const accountIds = plugin.config.listAccountIds(cfg);
	if (accountIds.length === 0) return false;
	for (const accountId of accountIds) {
		let account;
		try {
			account = plugin.config.resolveAccount(cfg, accountId);
		} catch (error) {
			logChannelSelectionError({
				pluginId: plugin.id,
				accountId,
				operation: "resolveAccount",
				error
			});
			continue;
		}
		if (!(plugin.config.isEnabled ? plugin.config.isEnabled(account, cfg) : isAccountEnabled(account))) continue;
		if (!plugin.config.isConfigured) return true;
		let configured;
		try {
			configured = await plugin.config.isConfigured(account, cfg);
		} catch (error) {
			logChannelSelectionError({
				pluginId: plugin.id,
				accountId,
				operation: "isConfigured",
				error
			});
			continue;
		}
		if (configured) return true;
	}
	return false;
}
async function listConfiguredMessageChannelPlugins(cfg) {
	const plugins = [];
	for (const plugin of listChannelPlugins()) {
		if (!isDeliverableMessageChannel(plugin.id)) continue;
		if (await isPluginConfigured(plugin, cfg)) plugins.push(plugin);
	}
	return plugins;
}
/** Lists deliverable channels with at least one enabled, configured account. */
async function listConfiguredMessageChannels(cfg) {
	return (await listConfiguredMessageChannelPlugins(cfg)).map((plugin) => plugin.id);
}
/** Resolves the message action channel from explicit input, context fallback, or config. */
async function resolveMessageChannelSelection(params) {
	const normalized = normalizeMessageChannel(params.channel);
	if (normalized) {
		const availableExplicit = resolveAvailableKnownChannel({
			cfg: params.cfg,
			value: params.channel,
			agentId: params.agentId
		});
		if (!availableExplicit) {
			const fallback = resolveAvailableKnownChannel({
				cfg: params.cfg,
				value: params.fallbackChannel,
				agentId: params.agentId
			});
			if (fallback) return {
				channel: fallback.channel,
				plugin: fallback.plugin,
				configured: [],
				source: "tool-context-fallback"
			};
			if (!isDeliverableMessageChannel(normalized)) throw new Error(`Unknown channel: ${normalized}`);
			const repairHint = isConfiguredChannel(params.cfg, normalized) ? resolveMissingOfficialExternalChannelPluginRepairHint({
				config: params.cfg,
				channelId: normalized
			}) : null;
			if (repairHint?.channelId === normalized) throw new Error(`Channel is unavailable: ${normalized}. ${repairHint.repairHint}`);
			throw new Error(`Channel is unavailable: ${normalized}`);
		}
		return {
			channel: availableExplicit.channel,
			plugin: availableExplicit.plugin,
			configured: [],
			source: "explicit"
		};
	}
	const fallback = resolveAvailableKnownChannel({
		cfg: params.cfg,
		value: params.fallbackChannel,
		agentId: params.agentId
	});
	if (fallback) return {
		channel: fallback.channel,
		plugin: fallback.plugin,
		configured: [],
		source: "tool-context-fallback"
	};
	const configuredPlugins = await listConfiguredMessageChannelPlugins(params.cfg);
	const configured = configuredPlugins.map((plugin) => plugin.id);
	if (configuredPlugins.length === 1) {
		const plugin = expectDefined(configuredPlugins[0], "configured plugin at 0");
		return {
			channel: plugin.id,
			plugin,
			configured,
			source: "single-configured"
		};
	}
	if (configured.length === 0) {
		const repairHints = listConfiguredOfficialExternalRepairHints(params.cfg);
		if (repairHints.length > 0) throw new Error(`Channel is required (no available channels detected). ${formatMissingOfficialExternalChannelsMessage(repairHints)}`);
		throw new Error(formatNoConfiguredChannelsMessage());
	}
	throw new Error(formatMultipleConfiguredChannelsMessage(configured));
}
//#endregion
export { listConfiguredMessageChannels as n, resolveMessageChannelSelection as r, isConfiguredChannel as t };
