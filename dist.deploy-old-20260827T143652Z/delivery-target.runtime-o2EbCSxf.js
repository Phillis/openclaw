import { r as getLoadedChannelPluginForRead } from "./registry-loaded-BwPPBT4p.js";
import { i as resolveChannelTarget } from "./target-resolver--eBeHIN9.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-CmOqcYJw.js";
import { d as mapAllowFromEntries } from "./channel-config-helpers-C6dKYMZI.js";
import { r as resolveOutboundSessionRoute } from "./outbound-session-BJsbg3br.js";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-BjN2bqKX.js";
//#region src/cron/isolated-agent/delivery-target.runtime.ts
/** Resolves a cron delivery target through channel plugins with bootstrap allowed. */
async function resolveChannelTargetForDelivery(params) {
	const plugin = resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	try {
		return await resolveChannelTarget({
			cfg: params.cfg,
			channel: params.channel,
			input: params.input,
			accountId: params.accountId,
			unknownTargetMode: "normalized",
			plugin
		});
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err : new Error(String(err))
		};
	}
}
/** Resolves the outbound session route used for cron delivery threading and mirrors. */
async function resolveOutboundSessionRouteForDelivery(params) {
	const plugin = resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	});
	return await resolveOutboundSessionRoute({
		...params,
		plugin
	});
}
/** Returns whether a channel can canonicalize outbound cron delivery sessions. */
function channelCanResolveOutboundSessionRoute(params) {
	return Boolean(resolveOutboundChannelPlugin({
		channel: params.channel,
		cfg: params.cfg,
		agentId: params.agentId,
		allowBootstrap: true
	})?.messaging?.resolveOutboundSessionRoute);
}
//#endregion
export { channelCanResolveOutboundSessionRoute, getLoadedChannelPluginForRead, mapAllowFromEntries, resolveChannelTargetForDelivery, resolveFirstBoundAccountId, resolveOutboundSessionRouteForDelivery };
