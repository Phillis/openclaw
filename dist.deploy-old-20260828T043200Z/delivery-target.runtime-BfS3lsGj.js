import { r as getLoadedChannelPluginForRead } from "./registry-loaded-Dbglb2uR.js";
import { i as resolveChannelTarget } from "./target-resolver-C54g4nxf.js";
import { r as resolveOutboundChannelPlugin } from "./channel-resolution-B1taGHmD.js";
import { d as mapAllowFromEntries } from "./channel-config-helpers-C7An4wuC.js";
import { r as resolveOutboundSessionRoute } from "./outbound-session-B9AYez4r.js";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-DfLZKSSn.js";
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
